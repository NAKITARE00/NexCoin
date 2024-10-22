import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# Sample transaction data
data = {
    'Date': ['2024-10-01', '2024-10-02', '2024-10-03', '2024-10-04'],
    'Amount': [100, 150, 200, 250]
}

# Create a DataFrame
df = pd.DataFrame(data)
df['Date'] = pd.to_datetime(df['Date'])

# Plot the transaction amounts over time
plt.figure(figsize=(10, 6))
sns.lineplot(data=df, x='Date', y='Amount', marker='o')
plt.title('Transaction Amount Over Time')
plt.xlabel('Date')
plt.ylabel('Amount')
plt.show()

# Converting dates into days for the regression model
df['Days'] = (df['Date'] - df['Date'].min()).dt.days
X = df[['Days']]
y = df['Amount']

# Splitting the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Training a linear regression model
model = LinearRegression()
model.fit(X_train, y_train)

# Predicting future transactions (example for the next 3 days)
future_days = pd.DataFrame({'Days': [10, 11, 12]})  # Days to predict
future_predictions = model.predict(future_days)
print(f"Future Predictions: {future_predictions}")

# Visualizing the future predictions
plt.figure(figsize=(10, 6))
plt.plot(future_days['Days'], future_predictions, marker='o', linestyle='--', color='r', label='Predicted Amount')
plt.title('Predicted Transaction Amounts')
plt.xlabel('Days')
plt.ylabel('Amount')
plt.legend()
plt.show()
