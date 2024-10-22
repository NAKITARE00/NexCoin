import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Buffer } from 'buffer';

window.Buffer = Buffer;


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl="https://emerald-managerial-thrush-217.mypinata.cloud/ipfs/QmbLGBWUQep6587eshUVZPhjtuZtDSsc8DCiPuH5fEVx6d">
      <ThirdwebProvider>
        <App />
      </ThirdwebProvider>
    </TonConnectUIProvider>
  </StrictMode>,
);
