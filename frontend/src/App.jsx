import React, { useState } from 'react';
import { WalletCreation, SendTransaction, WalletBalance } from "./components";
import { home, genwallet, wallet, send, nexlogo } from './assets';

function App() {
    const [activeComponent, setActiveComponent] = useState('home');

    const renderComponent = () => {
        switch(activeComponent) {
            case 'home':
                return (
                    <div className="text-center">
                        <p className="mb-4">Your gateway to secure and efficient cryptocurrency transactions.</p>
                    </div>
                );
            case 'create':
                return <WalletCreation />;
            case 'balance':
                return <WalletBalance />;
            case 'send':
                return <SendTransaction />;
            default:
                return <WalletCreation />;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-epilogue">
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">  
                <div className="w-full max-w-lg p-6 bg-gray-900 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-8">NEXCOIN</h1>
                    {renderComponent()}
                </div>
            </div>
            <nav className="bg-gray-800 shadow-lg py-2 w-full"> 
                <div className="w-full max-w-lg mx-auto flex justify-around"> 
                    <button 
                        onClick={() => setActiveComponent('home')} 
                        className={`flex flex-col items-center px-2 py-1 rounded-lg ${activeComponent === 'home' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
                        style={{ fontSize: '12px', padding: '8px 16px' }}  // Reduced button size
                    >
                        <img src={home} alt="Home Icon" className="w-6 h-6 mb-1" />
                        <span>Home</span>
                    </button>
                    <button 
                        onClick={() => setActiveComponent('create')} 
                        className={`flex flex-col items-center px-2 py-1 rounded-lg ${activeComponent === 'create' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
                        style={{ fontSize: '12px', padding: '8px 16px' }}
                    >
                        <img src={genwallet} alt="Create Wallet Icon" className="w-6 h-6 mb-1" />
                        <span>Wallet</span>
                    </button>
                    <button 
                        onClick={() => setActiveComponent('balance')} 
                        className={`flex flex-col items-center px-2 py-1 rounded-lg ${activeComponent === 'balance' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
                        style={{ fontSize: '12px', padding: '8px 16px' }}
                    >
                        <img src={wallet} alt="Wallet Balance Icon" className="w-6 h-6 mb-1" />
                        <span>Balance</span>
                    </button>
                    <button 
                        onClick={() => setActiveComponent('send')} 
                        className={`flex flex-col items-center px-2 py-1 rounded-lg ${activeComponent === 'send' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
                        style={{ fontSize: '12px', padding: '8px 16px' }}
                    >
                        <img src={send} alt="Send Transaction Icon" className="w-6 h-6 mb-1" />
                        <span>Send</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default App;
