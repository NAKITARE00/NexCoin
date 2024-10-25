# Save this file as main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from datetime import datetime
import pandas as pd
import matplotlib.pyplot as plt
import os

def create_app():
    app = FastAPI()

    # Updated CORS configuration to include Vite's default port
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",    # Vite development server
            "http://localhost:3000",    # React default port
            "http://127.0.0.1:5173",    # Alternative Vite URL
            "http://127.0.0.1:3000"     # Alternative React URL
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"]
    )

    class Transaction(BaseModel):
        amount: float
        timestamp: datetime
        status: str

    class TransactionAnalysisRequest(BaseModel):
        transactions: List[Transaction]

    @app.options("/api/analyze")
    async def options_analyze():
        return {"message": "OK"}

    @app.post("/api/analyze")
    async def analyze_transactions(request: TransactionAnalysisRequest):
        try:
            # Convert transactions to DataFrame
            df = pd.DataFrame([t.dict() for t in request.transactions])
            
            if df.empty:
                raise HTTPException(status_code=422, detail="No transactions provided")

            # Ensure directory exists
            os.makedirs("plots", exist_ok=True)
            
            # Create analysis plot
            plt.figure(figsize=(10, 6))
            plt.plot(pd.to_datetime(df['timestamp']), df['amount'], marker='o')
            plt.title('Transaction Analysis Over Time')
            plt.xlabel('Date')
            plt.ylabel('Amount (TON)')
            plt.grid(True)
            plt.xticks(rotation=45)
            plt.tight_layout()
            
            # Save plot
            plot_path = "plots/transaction_analysis_over_time.png"
            plt.savefig(plot_path)
            plt.close()

            # Calculate statistics
            stats = {
                "total_transactions": len(df),
                "total_amount": float(df['amount'].sum()),
                "average_amount": float(df['amount'].mean()),
                "max_amount": float(df['amount'].max()),
                "min_amount": float(df['amount'].min()),
                "plot_url": f"/plots/transaction_analysis_over_time.png"
            }

            return stats

        except Exception as e:
            raise HTTPException(status_code=422, detail=str(e))

    # Add a static file route for the plots
    app.mount("/plots", StaticFiles(directory="plots"), name="plots")
    
    return app

app = create_app()