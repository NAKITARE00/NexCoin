const API_URL = 'http://localhost:8000';

// Function to analyze transactions
export const analyzeTransactions = async (transactions) => {
  try {
    validateTransactionsArray(transactions);

    // Format transactions data to match backend structure
    const formattedData = {
      transactions: transactions.map(formatTransactionData)
    };

    console.log('Sending data to analysis service:', formattedData);

    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify(formattedData),
      mode: 'cors',  // Explicitly set CORS mode
      credentials: 'include'
    });

    console.log('Response status:', response.status);

    // Handle non-OK responses and extract error messages if available
    if (!response.ok) {
      const errorData = await tryParseJSON(response);
      const errorMessage = errorData?.detail || errorData?.message || 'Analysis failed';
      throw new Error(`${errorMessage} (Status: ${response.status})`);
    }

    // Parse successful response data
    const data = await response.json();
    return {
      ...data,
      chartUrl: `${API_URL}/plots/transaction_analysis_over_time.png?timestamp=${Date.now()}`
    };

  } catch (error) {
    console.error('Analysis service error:', {
      message: error.message,
      stack: error.stack,
      transactions
    });
    throw new Error(`Transaction analysis failed: ${error.message}`);
  }
};

// Helper function to validate an array of transaction objects
const validateTransactionsArray = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    throw new Error('Invalid transactions data: Must be a non-empty array');
  }
  transactions.forEach(validateTransactionData);
};

// Helper function to validate a single transaction object
export const validateTransactionData = (transaction) => {
  if (typeof transaction.amount !== 'number' || isNaN(transaction.amount)) {
    throw new Error('Invalid transaction amount: Must be a valid number');
  }
  if (transaction.amount <= 0) {
    throw new Error('Transaction amount must be positive');
  }
  if (!transaction.timestamp || isNaN(new Date(transaction.timestamp))) {
    throw new Error('Invalid timestamp: Must be a valid date string');
  }
  if (!transaction.sender || !transaction.recipient) {
    throw new Error('Transaction must have sender and recipient fields');
  }
  return true;
};

// Helper function to format a single transaction object for backend
export const formatTransactionData = (transaction) => ({
  amount: parseFloat(transaction.amount),
  timestamp: transaction.timestamp,
  sender: transaction.sender,
  recipient: transaction.recipient,
  status: 'completed'
});

// Function to safely parse JSON error responses
const tryParseJSON = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    console.error('Error parsing error response:', error);
    return null;
  }
};
