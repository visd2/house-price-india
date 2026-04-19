from fastapi import APIRouter, HTTPException
import razorpay, os

router = APIRouter()
client = razorpay.Client(
    auth=(os.getenv("RAZORPAY_KEY"), os.getenv("RAZORPAY_SECRET"))
)

PLANS = {
    "basic": {"amount": 9900,  "name": "Basic — ₹99/month"},
    "pro"  : {"amount": 29900, "name": "Pro — ₹299/month"},
}

@router.post("/payment/create-order")
def create_order(plan: str = "basic"):
    if plan not in PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan")
    order = client.order.create({
        "amount"  : PLANS[plan]["amount"],
        "currency": "INR",
        "payment_capture": 1
    })
    return {"order_id": order["id"], "amount": PLANS[plan]["amount"]}
