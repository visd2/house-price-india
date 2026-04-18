from fastapi import APIRouter
import joblib, os

router = APIRouter()

BASE = os.path.dirname(os.path.abspath(__file__))

city_enc = joblib.load(os.path.join(BASE, '../model/city_encoder.pkl'))
loc_enc  = joblib.load(os.path.join(BASE, '../model/location_encoder_multi.pkl'))

CITY_LOCATIONS = {
    'Bangalore' : ['Whitefield', 'Koramangala', 'HSR Layout', 'Indiranagar', 'Electronic City', 'Bellandur', 'Marathahalli'],
    'Mumbai'    : ['Andheri', 'Bandra', 'Powai', 'Thane', 'Borivali', 'Kurla', 'Malad'],
    'Delhi'     : ['Dwarka', 'Rohini', 'Saket', 'Vasant Kunj', 'Lajpat Nagar', 'Janakpuri'],
    'Hyderabad' : ['Gachibowli', 'Madhapur', 'Kondapur', 'HITEC City', 'Kukatpally', 'Banjara Hills'],
    'Chennai'   : ['Anna Nagar', 'Velachery', 'OMR', 'Adyar', 'Porur', 'Tambaram'],
    'Kolkata'   : ['Salt Lake', 'New Town', 'Park Street', 'Ballygunge', 'Howrah'],
}

CITY_STATS = {
    'Bangalore' : {'avg': 85,  'min': 30,  'max': 400},
    'Mumbai'    : {'avg': 180, 'min': 60,  'max': 800},
    'Delhi'     : {'avg': 120, 'min': 40,  'max': 600},
    'Hyderabad' : {'avg': 75,  'min': 25,  'max': 350},
    'Chennai'   : {'avg': 70,  'min': 25,  'max': 300},
    'Kolkata'   : {'avg': 55,  'min': 20,  'max': 250},
}

@router.get("/insights/cities")
def get_cities():
    return {"cities": city_enc.classes_.tolist()}

@router.get("/insights/locations/{city}")
def get_locations(city: str):
    locs = CITY_LOCATIONS.get(city, [])
    return {"city": city, "locations": locs}

@router.get("/insights/stats")
def get_stats():
    return {
        "city_stats"     : CITY_STATS,
        "total_listings" : 78000,
        "cities_covered" : len(city_enc.classes_),
    }

@router.get("/insights/stats/{city}")
def get_city_stats(city: str):
    stats = CITY_STATS.get(city, {})
    if not stats:
        return {"error": "City not found"}
    return {
        "city"      : city,
        "avg_price" : stats['avg'],
        "min_price" : stats['min'],
        "max_price" : stats['max'],
        "locations" : CITY_LOCATIONS.get(city, [])
    }
