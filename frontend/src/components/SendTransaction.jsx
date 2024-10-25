import React, { useState, useEffect, useCallback } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address } from '@ton/core';
import { analyzeTransactions } from '../transactionService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function SendTransaction() {
    const [tonConnectUI] = useTonConnectUI();
    const [tonWalletAddress, setTonWalletAddress] = useState(null);
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [txStatus, setTxStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [analysisResult, setAnalysisResult] = useState(null);

  const handleWalletConnection = useCallback((address) => {
    setTonWalletAddress(address);
    console.log('Wallet connected successfully!');
    setIsLoading(false);
  }, []);

  const handleWalletDisconnection = useCallback(() => {
    setTonWalletAddress(null);
    console.log('Wallet disconnected successfully!');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (tonConnectUI.account?.address) {
        handleWalletConnection(tonConnectUI.account.address);
      } else {
        handleWalletDisconnection();
      }
    };

    checkWalletConnection();

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        handleWalletConnection(wallet.account.address);
      } else {
        handleWalletDisconnection();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);

  const handleWalletAction = async () => {
    if (tonConnectUI.connected) {
      setIsLoading(true);
      await tonConnectUI.disconnect();
    } else {
      await tonConnectUI.openModal();
    }
  };

  const validateInput = () => {
    if (!toAddress || toAddress.trim() === '') {
      setErrorMessage('Recipient address is required.');
      return false;
    }
    try {
      Address.parse(toAddress);
    } catch (err) {
      setErrorMessage('Invalid recipient address.');
      return false;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setErrorMessage('Please enter a valid amount.');
      return false;
    }
    return true;
  };

  const handleSendTransaction = async () => {
    if (!tonWalletAddress) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }

    if (!validateInput()) return;

    try {
      setIsLoading(true);
      setErrorMessage('');

      const amountInNanotons = BigInt(Math.floor(parseFloat(amount) * 1e9)).toString();

      const transaction = {
        messages: [
          {
            address: toAddress,
            amount: amountInNanotons,
          },
        ],
        validUntil: Math.floor(Date.now() / 1000) + 300,
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      console.log("Transaction successful", result);
      setTxStatus('Transaction successful!');
      
      // Add transaction with timestamp
      const newTransaction = {
        amount: parseFloat(amount),
        timestamp: new Date().toISOString(),
        sender: tonWalletAddress,
        recipient: toAddress
      };
      
      setTransactions(prev => [...prev, newTransaction]);
      
      setToAddress('');
      setAmount('');

    }  catch (error) {
        console.error('Transaction Error:', error);
        setErrorMessage(`Transaction failed: ${error.message}`);
        } finally {
        setIsLoading(false);
        }
    };

    const handleAnalyzeTransactions = async () => {
    if (!transactions.length) {
      setErrorMessage('No transactions to analyze.');
      return;
    }

    try {
        setIsLoading(true);
        const result = await analyzeTransactions(transactions);
        setAnalysisResult(result);
        setErrorMessage('');
        } catch (error) {
        setErrorMessage('Failed to analyze transactions.');
        console.error('Analysis Error:', error);
        } finally {
      setIsLoading(false);
        }
    };

    const renderAnalysisResults = () => {
        if (!analysisResult) return null;
    };
    // const { statistics, cluster_stats } = analysisResult;
  
    const formatAddress = (address) => {
        const tempAddress = Address.parse(address).toString();
        return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
    };

  return (
    <div className="space-y-4 w-full max-w-md mx-auto px-6 py-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white text-center">Send Transaction</h2>
      {isLoading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <>
          {tonWalletAddress ? (
            <div className="mb-4">
              <p className="text-white">Connected: {formatAddress(tonWalletAddress)}</p>
              <button
                onClick={handleWalletAction}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleWalletAction}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Connect TON Wallet
            </button>
          )}

          <input
            type="text"
            placeholder="Recipient Address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-2 placeholder-gray-400 text-black py-3 text-center"
          />
          <input
            type="text"
            placeholder="Amount in TON"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-2 placeholder-gray-400 text-black py-3 text-center"
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            onClick={handleSendTransaction}
          >
            Send Transaction
          </button>
          
           <button
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={handleAnalyzeTransactions}
                disabled={!transactions.length}
            >
                Analyze Transactions
            </button>
          
                {txStatus && <p className="text-green-500">{txStatus}</p>}
                {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      
            {renderAnalysisResults()}

            {transactions.length > 0 && (
                <div className="mt-4">
                        <h3 className="text-lg text-white mb-2">Transaction History</h3>
                    <div className="text-white">
                        Total Transactions: {transactions.length}
                        <br/>
                        Total Amount: {transactions.reduce((a, b) => a + parseFloat(b.amount), 0).toFixed(2)} TON
                    </div>
                </div>
            )}
          
        </>
      )}
    </div>
  );
}

export default SendTransaction;