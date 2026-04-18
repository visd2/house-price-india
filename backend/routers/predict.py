from fastapi import APIRouter, HTTPException
from schemas import HouseInput, PredictResponse
import joblib, numpy as np, pandas as pd, json, os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../.env'))

router = APIRouter()

BASE     = os.path.dirname(os.path.abspath(__file__))
model    = joblib.load(os.path.join(BASE, '../model/model_multi.pkl'))
city_enc = joblib.load(os.path.join(BASE, '../model/city_encoder.pkl'))
loc_enc  = joblib.load(os.path.join(BASE, '../model/location_encoder_multi.pkl'))

with open(os.path.join(BASE, '../model/model_meta_multi.json')) as f:
    meta = json.load(f)

INFLATION_FACTOR = meta.get('inflation_factor', 1.35)

# ── City-wise verdict thresholds (2025 market) ──────────────────────────────
CITY_THRESHOLDS = {
    'Mumbai'    : {'low': 10000, 'high': 20000},
    'Delhi'     : {'low': 7000,  'high': 15000},
    'Bangalore' : {'low': 5000,  'high': 9000 },
    'Chennai'   : {'low': 4500,  'high': 9000 },
    'Hyderabad' : {'low': 4000,  'high': 8000 },
    'Kolkata'   : {'low': 3500,  'high': 7000 },
}

# ── City-wise price per sqft avg (for ML feature) ───────────────────────────
CITY_PPS_AVG = {
    'Mumbai'    : 12000,
    'Delhi'     : 9000,
    'Bangalore' : 6000,
    'Chennai'   : 5500,
    'Hyderabad' : 5000,
    'Kolkata'   : 4500,
}

# ── 2025 Researched Market Prices (Lakhs) ───────────────────────────────────
# Source: 99acres, MagicBricks, Housing.com manual research — April 2025
# Base: 1000 sqft property, premium locality
MARKET_PRICES = {
    'Mumbai'    : {1: 85,  2: 165, 3: 280, 4: 450, 5: 650},
    'Delhi'     : {1: 55,  2: 115, 3: 190, 4: 320, 5: 480},
    'Bangalore' : {1: 45,  2: 82,  3: 140, 4: 230, 5: 350},
    'Hyderabad' : {1: 40,  2: 72,  3: 120, 4: 200, 5: 300},
    'Chennai'   : {1: 38,  2: 68,  3: 115, 4: 190, 5: 280},
    'Kolkata'   : {1: 30,  2: 55,  3: 90,  4: 150, 5: 220},
}

# ── Amenity price impact (Lakhs) ────────────────────────────────────────────
AMENITY_IMPACT = {
    'gymnasium'     : 2.5,
    'swimming_pool' : 4.0,
    'car_parking'   : 3.0,
    'lift_available': 1.5,
    'power_backup'  : 1.0,
    'security'      : 1.5,
}


def get_market_reference_price(city: str, bhk: int, sqft: float) -> float:
    """
    2025 researched market reference price.
    Adjusts base price by sqft size and returns Lakhs.
    This is the 'market benchmark' shown alongside AI prediction.
    """
    city_data = MARKET_PRICES.get(city)
    if not city_data:
        return None

    bhk_key    = min(bhk, 5)
    base_price = city_data.get(bhk_key, city_data[2])

    # Sqft adjustment — larger flat = higher price, but not linear
    # Base is 1000 sqft. Each +500 sqft adds ~12%
    sqft_factor = 1 + ((sqft - 1000) / 500) * 0.12
    sqft_factor = max(0.6, min(sqft_factor, 2.5))  # clamp 0.6x – 2.5x

    return round(base_price * sqft_factor, 2)


def calculate_amenity_premium(data: HouseInput) -> float:
    """
    Calculate total amenity premium in Lakhs.
    Each amenity adds a fixed market-researched amount.
    """
    total = 0.0
    if data.gymnasium     == 1: total += AMENITY_IMPACT['gymnasium']
    if data.swimming_pool == 1: total += AMENITY_IMPACT['swimming_pool']
    if data.car_parking   == 1: total += AMENITY_IMPACT['car_parking']
    if data.lift_available== 1: total += AMENITY_IMPACT['lift_available']
    if data.power_backup  == 1: total += AMENITY_IMPACT['power_backup']
    if data.security      == 1: total += AMENITY_IMPACT['security']

    # Resale discount — resale properties avg 8% cheaper
    if data.resale == 1:
        total -= (MARKET_PRICES.get(data.city, {}).get(min(data.bhk, 5), 80)) * 0.08

    return round(total, 2)


def get_investment_insight(city: str, bhk: int, pps: float) -> str:
    """
    Investment insight based on city + per sqft rate.
    Used in SaaS premium tier.
    """
    thresh = CITY_THRESHOLDS.get(city, {'low': 5000, 'high': 9000})
    mid    = (thresh['low'] + thresh['high']) / 2

    if pps < thresh['low'] * 0.85:
        return "Strong Buy — Significantly below market rate. High appreciation potential."
    elif pps < thresh['low']:
        return "Good Buy — Below market average. Solid investment opportunity."
    elif pps < mid:
        return "Fair Value — Priced at market rate. Negotiate for 5-8% discount."
    elif pps < thresh['high']:
        return "Slightly High — Above average. Push for price reduction."
    else:
        return "Overpriced — Well above market. Walk away or negotiate hard."


@router.post("/predict", response_model=PredictResponse)
def predict_price(data: HouseInput):

    # ── Validate city ────────────────────────────────────────────────────────
    if data.city not in city_enc.classes_:
        raise HTTPException(
            status_code=400,
            detail=f"City '{data.city}' not supported. Available: {list(city_enc.classes_)}"
        )

    if data.total_sqft <= 0:
        raise HTTPException(status_code=400, detail="total_sqft must be greater than 0")

    # ── Encoding ─────────────────────────────────────────────────────────────
    try:
        city_encoded = city_enc.transform([data.city])[0]
    except:
        raise HTTPException(status_code=400, detail="City encoding failed")

    try:
        loc_encoded = loc_enc.transform([data.location])[0]
    except:
        loc_encoded = 0  # unknown location fallback

    # ── ML Prediction ─────────────────────────────────────────────────────────
    features = pd.DataFrame([{
        'city_enc'       : city_encoded,
        'location_enc'   : loc_encoded,
        'total_sqft'     : data.total_sqft,
        'bhk'            : data.bhk,
        'price_per_sqft' : CITY_PPS_AVG.get(data.city, 6000),
        'Gymnasium'      : data.gymnasium,
        'SwimmingPool'   : data.swimming_pool,
        'CarParking'     : data.car_parking,
        'LiftAvailable'  : data.lift_available,
        'PowerBackup'    : data.power_backup,
        '24X7Security'   : data.security,
        'Resale'         : data.resale,
    }])

    pred_log = model.predict(features)[0]
    ml_price = float(np.expm1(pred_log)) * INFLATION_FACTOR

    # ── Market Reference Price ────────────────────────────────────────────────
    market_price   = get_market_reference_price(data.city, data.bhk, data.total_sqft)
    amenity_premium = calculate_amenity_premium(data)

    # ── Final Price: 60% ML + 40% Market Reference + Amenity Premium ─────────
    if market_price:
        blended     = ml_price * 0.60 + market_price * 0.40
        final_price = round(blended + amenity_premium, 2)
        data_source = "AI Model + 2025 Market Research"
        live_price  = market_price
    else:
        final_price = round(ml_price + amenity_premium, 2)
        data_source = "AI Model"
        live_price  = None

    price_min  = round(final_price * 0.90, 2)
    price_max  = round(final_price * 1.10, 2)
    actual_pps = round((final_price * 100000) / data.total_sqft, 0)

    # ── Verdict ───────────────────────────────────────────────────────────────
    thresh = CITY_THRESHOLDS.get(data.city, {'low': 5000, 'high': 9000})
    if actual_pps < thresh['low']:
        verdict = "Underpriced - Good Deal!"
    elif actual_pps > thresh['high']:
        verdict = "Overpriced - Negotiate!"
    else:
        verdict = "Fair Price"

    # ── Investment insight ────────────────────────────────────────────────────
    insight = get_investment_insight(data.city, data.bhk, actual_pps)

    print(f"[Predict] {data.city} {data.bhk}BHK {data.total_sqft}sqft → "
          f"ML: ₹{round(ml_price,2)}L | Market: ₹{market_price}L | "
          f"Amenity: +₹{amenity_premium}L | Final: ₹{final_price}L | {verdict}")

    return PredictResponse(
        predicted_price = final_price,
        price_min       = price_min,
        price_max       = price_max,
        verdict         = verdict,
        price_per_sqft  = actual_pps,
        city            = data.city,
        data_source     = data_source,
        ml_price        = round(ml_price, 2),
        live_price      = live_price,
        amenity_premium = amenity_premium,
        investment_insight = insight,
    )
