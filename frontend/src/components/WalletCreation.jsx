import React, { useState } from 'react';
import { createWallet } from '../wallet';

function WalletCreation() {
    const [wallet, setWallet] = useState(null);
    const [showMessage, setShowMessage] = useState(false);

    const handleCreateWallet = () => {
        const newWallet = createWallet();
        setWallet(newWallet);
        setShowMessage(false); // Reset copy message
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setShowMessage(true); // Show confirmation message
            setTimeout(() => setShowMessage(false), 2000); // Hide message after 2 seconds
        });
    };

    return (
        <div className="space-y-4 flex flex-col items-center text-center w-[300px] max-w-screen-sm mx-auto px-6">
            <h2 className='text-xl font-semibold text-white'>Create Wallet</h2>
            <button
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleCreateWallet}
            >
                Generate Wallet
            </button>
            {wallet && (
                <div className="text-sm text-white space-y-1 w-full break-words">
                    <div className="bg-gray-800 text-white py-1 px-2 rounded mb-2">
                        <p><strong>Address:</strong> {wallet.address}</p>
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <p><strong>Private Key:</strong></p>
                        <button 
                            onClick={() => copyToClipboard(wallet.privateKey)}
                            className="bg-gray-800 text-white py-1 px-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Copy Private Key
                        </button>
                    </div>
                    {showMessage && <p className="text-green-500 text-sm">Private Key copied to clipboard!</p>}
                </div>
            )}
        </div>
    );
}

export default WalletCreation;



