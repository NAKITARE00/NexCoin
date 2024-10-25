# backend/transaction_analysis.py
# transactionAnalysis.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
import matplotlib.pyplot as plt
import numpy as np
import os

# Create FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure the plots directory exists
PLOTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'plots')
os.makedirs(PLOTS_DIR, exist_ok=True)

# Define request model
class TransactionData(BaseModel):
    transactions: List[float]

def analyze_transactions(transaction_amounts):
    if not transaction_amounts:
        raise ValueError("No transaction amounts provided")
        
    # Convert to numpy array
    transaction_amounts = np.array(transaction_amounts)
    
    # Generate time points
    transaction_time = np.arange(len(transaction_amounts))
    
    # Create and save current transactions plot
    plt.figure(figsize=(10, 6))
    plt.plot(transaction_time, transaction_amounts, marker='o', linestyle='-', color='b', label='Transaction Amounts')
    plt.xlabel('Transaction Number')
    plt.ylabel('Amount (TON)')
    plt.title('Transaction Analysis over Time')
    plt.grid(True)
    plt.legend()
    current_plot_path = os.path.join(PLOTS_DIR, 'transaction_analysis_over_time.png')
    plt.savefig(current_plot_path)
    plt.close()
    
    # Simple future prediction (linear extrapolation)
    if len(transaction_amounts) >= 2:
        slope = np.mean(np.diff(transaction_amounts))
        future_points = 3
        last_value = transaction_amounts[-1]
        future_transactions = np.array([last_value + slope * (i + 1) for i in range(future_points)])
        
        # Plot future predictions
        plt.figure(figsize=(10, 6))
        plt.plot(transaction_time, transaction_amounts, 'b-', label='Historical')
        plt.plot(np.arange(len(transaction_amounts) - 1, len(transaction_amounts) + future_points),
                np.concatenate([transaction_amounts[-1:], future_transactions]),
                'r--', label='Prediction')
        plt.xlabel('Transaction Number')
        plt.ylabel('Amount (TON)')
        plt.title('Transaction Prediction')
        plt.grid(True)
        plt.legend()
        future_plot_path = os.path.join(PLOTS_DIR, 'future_transaction_predictions.png')
        plt.savefig(future_plot_path)
        plt.close()
    else:
        future_transactions = []
    
    return {
        'analysis': {
            'total_transactions': len(transaction_amounts),
            'total_amount': float(np.sum(transaction_amounts)),
            'average_amount': float(np.mean(transaction_amounts)),
            'future_predictions': future_transactions.tolist() if len(transaction_amounts) >= 2 else []
        },
        'plots': {
            'current': 'transaction_analysis_over_time.png',
            'future': 'future_transaction_predictions.png' if len(transaction_amounts) >= 2 else None
        }
    }

@app.post("/api/analyze")
async def analyze_endpoint(data: TransactionData):
    try:
        result = analyze_transactions(data.transactions)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/plots/{filename}")
async def get_plot(filename: str):
    file_path = os.path.join(PLOTS_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Plot not found")
    return FileResponse(file_path)

# For development purposes
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)