from dotenv import load_dotenv
import os

# Sabse pehle — .env load karo absolute path se
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

# Verify karo terminal mein
print(f"[STARTUP] RAPIDAPI_KEY loaded: {bool(os.getenv('RAPIDAPI_KEY'))}")
print(f"[STARTUP] Key preview: {os.getenv('RAPIDAPI_KEY', 'NOT FOUND')[:10]}")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict, insights

app = FastAPI(title="House Price India API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router,  tags=["Prediction"])
app.include_router(insights.router, tags=["Insights"])

@app.get("/")
def root():
    return {"message": "House Price India API is running!"}
