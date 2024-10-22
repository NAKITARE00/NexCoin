import React, { useState } from 'react';
import { getBalance } from '../wallet';

function WalletBalance() {
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState(null);

    const handleCheckBalance = async () => {
        const balance = await getBalance(address);
        setBalance(balance);
    };

    return (
        <div className="space-y-4 w-full">
            <h2 className="text-xl font-semibold text-gray-700 text-center">Check Balance</h2>
            <input
                type="text"
                placeholder="Enter wallet address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-2 placeholder-gray-400 py-3 text-center"     
            />
            <button
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleCheckBalance}
            >
                Check Balance
            </button>
            {balance !== null && <p className="text-gray-700">Balance: {balance} ETH</p>}
        </div>
    );
}

export default WalletBalance; 
