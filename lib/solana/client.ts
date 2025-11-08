// Solana RPC Client Configuration
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('mainnet-beta');

// Create singleton connection instance
let connection: Connection | null = null;

export function getSolanaConnection(): Connection {
  if (!connection) {
    connection = new Connection(SOLANA_RPC_URL, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000,
    });
  }
  return connection;
}

export function getPaymentWallet(): PublicKey {
  const address = process.env.PAYMENT_WALLET_ADDRESS || 'PayRPCPlaceholder1111111111111111111111111';
  try {
    return new PublicKey(address);
  } catch (error) {
    console.error('Invalid payment wallet address:', address);
    throw new Error('Invalid payment wallet configuration');
  }
}

export const PAYMENT_AMOUNT_SOL = parseFloat(process.env.PAYMENT_AMOUNT || '0.001');
export const PAYMENT_TIMEOUT_MS = parseInt(process.env.PAYMENT_TIMEOUT_MS || '30000');
export const LAMPORTS_PER_SOL = 1_000_000_000;

export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}

export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}
