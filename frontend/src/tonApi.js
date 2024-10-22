import { TonClient } from 'ton';
import TonWeb from 'tonweb';

const endpoint = 'https://testnet.toncenter.com/api/v2/jsonRPC';
const client = new TonClient({ endpoint });

export const checkTonBalance = async (address) => {
    try {
        const balance = await client.getBalance(address);
        return TonWeb.utils.fromNano(balance);
    } catch (error) {
        console.error("Balance Check Error:", error);
        throw error;
    }
};

export const sendTonTransaction = async (toAddress, amount) => {
    try {
        const amountInNano = BigInt(amount * 1e9);
        const transaction = await client.sendTransaction({
            to: toAddress,
            amount: amountInNano.toString(),
            message: 'Transaction via Telegram Bot',
        });
        return transaction;
    } catch (error) {
        console.error("Transaction Error:", error);
        throw error;
    }
};
