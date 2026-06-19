from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import expenses
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Personal Expense Tracker",
    description="API for managing personal expenses",
    version="1.0.0"
)

# Allow both local dev and production frontend origins
allowed_origins = [
    "http://localhost:5173",   # local Vite dev server
]

# Add your Vercel production URL (set this env var on Render later)
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(expenses.router)

@app.get("/")
def root():
    return {"status": "ok", "message": "Expense Tracker API is running"}
