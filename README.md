# GharMol — AI House Price Predictor

> Know the fair price of any property before you buy. Powered by XGBoost + FastAPI + React.

![GharMol](https://img.shields.io/badge/GharMol-AI%20Real%20Estate-C9A84C?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square)
![XGBoost](https://img.shields.io/badge/XGBoost-ML%20Model-orange?style=flat-square)

---

## What is GharMol?

GharMol is an AI-powered real estate price intelligence tool for Indian property buyers. Enter property details and instantly find out if a listing is **fairly priced**, **underpriced (good deal)**, or **overpriced (negotiate)**.

### Key Features

- **Instant Price Prediction** — AI model gives results in under 1 second
- **6 Major Cities** — Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Kolkata
- **Amenity Pricing** — Gym, pool, parking affect price calculations
- **Property Comparison** — Side-by-side cross-city comparison
- **Market Insights** — Live trends, price per sqft, BHK distribution charts
- **Fair Value Verdict** — Clear Underpriced / Fair / Overpriced badge

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| ML Model   | XGBoost, scikit-learn, pandas     |
| Backend    | FastAPI, Uvicorn, Pydantic        |
| Frontend   | React 18, Vite, Tailwind CSS      |
| Charts     | Chart.js, react-chartjs-2         |
| Deployment | Render (backend), Vercel (frontend) |

---

## Project Structure

```
house-price-india/
├── ml/
│   ├── data/
│   │   ├── raw/                  # Original CSV datasets
│   │   └── processed/            # Cleaned data + saved models
│   ├── notebooks/
│   │   ├── 01_eda.ipynb          # Data exploration & cleaning
│   │   ├── 02_model_training.ipynb  # Bangalore model
│   │   └── 03_multicity_model.ipynb # 6-city model
│   └── train.py
│
├── backend/
│   ├── main.py                   # FastAPI app entry point
│   ├── schemas.py                # Pydantic input/output models
│   ├── requirements.txt
│   ├── Procfile                  # Render deployment
│   ├── model/                    # Trained model files
│   │   ├── model_multi.pkl
│   │   ├── city_encoder.pkl
│   │   ├── location_encoder_multi.pkl
│   │   └── model_meta_multi.json
│   └── routers/
│       ├── predict.py            # POST /predict endpoint
│       ├── insights.py           # GET /insights/* endpoints
│       └── auth.py               # JWT authentication
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Predict.jsx       # Price prediction form
│   │   │   ├── Market.jsx        # Market trends & charts
│   │   │   └── Compare.jsx       # Side-by-side comparison
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── PriceCard.jsx     # Prediction result card
│   │   ├── App.jsx
│   │   └── index.css             # Global styles + design tokens
│   ├── .env
│   └── package.json
│
├── .gitignore
├── .env.example
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/house-price-india.git
cd house-price-india
```

### 2. Train the ML model

```bash
cd ml
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install pandas numpy scikit-learn xgboost joblib jupyter

# Open and run all cells in:
# notebooks/01_eda.ipynb
# notebooks/03_multicity_model.ipynb
```

### 3. Start the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy trained models
cp ../ml/data/processed/model_multi.pkl model/
cp ../ml/data/processed/city_encoder.pkl model/
cp ../ml/data/processed/location_encoder_multi.pkl model/
cp ../ml/data/processed/model_meta_multi.json model/

uvicorn main:app --reload
# API running at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 4. Start the frontend

```bash
cd frontend
npm install
# Create .env file:
echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev
# App running at http://localhost:5173
```

---

## API Reference

### POST /predict

Predict the fair price of a property.

**Request body:**
```json
{
  "city": "Mumbai",
  "location": "Andheri",
  "total_sqft": 1200,
  "bhk": 2,
  "bath": 2,
  "balcony": 1,
  "gymnasium": 1,
  "swimming_pool": 0,
  "car_parking": 1,
  "lift_available": 1,
  "power_backup": 1,
  "security": 1,
  "resale": 0
}
```

**Response:**
```json
{
  "predicted_price": 193.17,
  "price_min": 173.86,
  "price_max": 212.49,
  "verdict": "Fair Price",
  "price_per_sqft": 16098,
  "city": "Mumbai"
}
```

### GET /insights/cities

Returns list of supported cities.

### GET /insights/stats

Returns market statistics for all cities.

### GET /insights/stats/{city}

Returns detailed stats for a specific city.

---

## Dataset

| Source | Cities | Rows |
|--------|--------|------|
| Kaggle — Bengaluru House Data | Bangalore | 13,320 |
| Kaggle — MagicBricks Dataset | Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Kolkata | 78,000+ |

---

## Model Performance

| Metric | Value |
|--------|-------|
| Algorithm | XGBoost Regressor |
| R² Score | 0.82+ |
| MAE | ~12–15 Lakhs |
| Training data | 78,000+ listings |
| Cities | 6 |
| Inflation adjusted | Yes (1.35× for 2019→2025) |

---

## Deployment

### Backend — Render (Free Tier)

1. Push code to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Set Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend — Vercel (Free Tier)

1. Import GitHub repo on [vercel.com](https://vercel.com)
2. Set Root Directory: `frontend`
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`

---

## Roadmap

- [x] Bangalore single-city model
- [x] Multi-city model (6 cities)
- [x] Amenity-based pricing
- [x] Cross-city property comparison
- [x] Market insights dashboard
- [ ] User authentication & history
- [ ] RapidAPI real-time price integration
- [ ] Monthly auto-retraining pipeline (GitHub Actions)
- [ ] Mobile responsive improvements
- [ ] Razorpay subscription billing

---

## Author

**Vishal Kumar**
BCA Final Year — Guru Ghasidas Vishwavidyalaya, Bilaspur
ML & Data Science Specialist

- LinkedIn: [linkedin.com/in/your-profile](https://linkedin.com)
- Live Demo: [gharmol.vercel.app](https://vercel.app)
- HuggingFace: [huggingface.co/visdas](https://huggingface.co/visdas)

---

## License

MIT License — free to use, modify, and distribute.

---

*Built with ❤️ to help Indian homebuyers make smarter real estate decisions.*
