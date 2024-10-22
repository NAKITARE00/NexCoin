import matplotlib.pyplot as plt
import numpy as np

# Sample transaction data (amounts)
transaction_amounts = np.array([100, 200, 250, 300, 350, 400, 450, 500, 550])

# Generate time points for the transactions
transaction_time = np.arange(len(transaction_amounts))

# Plot the transaction amounts over time
plt.figure()
plt.plot(transaction_time, transaction_amounts, marker='o', linestyle='-', color='b', label='Transaction Amounts')
plt.xlabel('Transaction Time')
plt.ylabel('Amount')
plt.title('Transaction Analysis over Time')
plt.legend()

# Save the plot instead of showing it
plt.savefig('transaction_analysis_over_time.png')  # Save the plot
print("Plot saved as 'transaction_analysis_over_time.png'")

# Predict future transaction amounts (simple extrapolation)
future_transactions = np.array([600, 650, 700])
future_time = np.arange(len(transaction_amounts), len(transaction_amounts) + len(future_transactions))

# Plot the future transaction predictions
plt.figure()
plt.plot(future_time, future_transactions, marker='x', linestyle='--', color='r', label='Future Predictions')
plt.xlabel('Transaction Time')
plt.ylabel('Amount')
plt.title('Future Transaction Predictions')
plt.legend()

# Save the second plot as well
plt.savefig('future_transaction_predictions.png')  # Save the plot
print("Future predictions plot saved as 'future_transaction_predictions.png'")

# Print future predictions
print("Future Predictions:", future_transactions)
