from pydantic import BaseModel
from typing import Optional

class HouseInput(BaseModel):
    city           : str
    location       : str
    total_sqft     : float
    bath           : int
    balcony        : int
    bhk            : int
    gymnasium      : int = 0
    swimming_pool  : int = 0
    car_parking    : int = 1
    lift_available : int = 1
    power_backup   : int = 1
    security       : int = 1
    resale         : int = 0

class PredictResponse(BaseModel):
    predicted_price    : float
    price_min          : float
    price_max          : float
    verdict            : str
    price_per_sqft     : float
    city               : str
    data_source        : str  = "AI Model"
    ml_price           : Optional[float] = None
    live_price         : Optional[float] = None
    amenity_premium    : Optional[float] = None
    investment_insight : Optional[str]   = None
