from dotenv import load_dotenv
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import predict, insights
from collections import defaultdict
from datetime import date

app = FastAPI(title="GharMol API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Rate limiting — free tier: 5 predictions/day ──────────────────────────
request_counts = defaultdict(lambda: {"count": 0, "date": date.today()})
FREE_DAILY_LIMIT = 5

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    if request.url.path == "/predict" and request.method == "POST":
        ip    = request.client.host
        today = date.today()
        if request_counts[ip]["date"] != today:
            request_counts[ip] = {"count": 0, "date": today}
        request_counts[ip]["count"] += 1
        if request_counts[ip]["count"] > FREE_DAILY_LIMIT:
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Free limit reached (5/day). Upgrade at gharmol.vercel.app/pricing"
                }
            )
    return await call_next(request)

app.include_router(predict.router,  tags=["Prediction"])
app.include_router(insights.router, tags=["Insights"])

@app.get("/")
def root():
    return {
        "message" : "GharMol API is running!",
        "version" : "2.0",
        "cities"  : ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata"],
        "docs"    : "/docs"
    }

@app.get("/health")
def health():
    return {"status": "ok"}
