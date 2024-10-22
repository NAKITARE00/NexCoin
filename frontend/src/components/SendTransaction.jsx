import React, { useState, useEffect, useCallback } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address } from '@ton/core';  // Import Address to handle TON addresses

function SendTransaction() {
  const [tonConnectUI] = useTonConnectUI();
  const [tonWalletAddress, setTonWalletAddress] = useState(null);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  const handleSendTransaction = async () => {
    if (!tonWalletAddress) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }

    try {
      const txResult = await tonConnectUI.sendTransaction({
        to: toAddress,
        value: amount,
      });
      setTxStatus('Transaction successful!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Transaction failed. Please check the address and amount.');
    }
  };

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
                Disconnect Wallet
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
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSendTransaction}
          >
            Send Transaction
          </button>

          {txStatus && <p className="text-green-500">{txStatus}</p>}
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        </>
      )}
    </div>
  );
}

export default SendTransaction;
