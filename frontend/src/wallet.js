import { ethers } from 'ethers';


const provider = new ethers.providers.InfuraProvider('mainnet', import.meta.env.VITE_INFURA_PROJECT_ID);

export function createWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    };
}

export async function getBalance(address) {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
}

export async function sendTransaction(privateKey, toAddress, amount) {
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = {
        to: toAddress,
        value: ethers.utils.parseEther(amount),
        gasLimit: 21000,
        gasPrice: await provider.getGasPrice(),
    };
    const transaction = await wallet.sendTransaction(tx);
    await transaction.wait();
    return transaction;
}
