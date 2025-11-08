// Payment Verification System
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { getSolanaConnection, getPaymentWallet, PAYMENT_AMOUNT_SOL, solToLamports } from './client';

export interface PaymentVerificationResult {
  valid: boolean;
  signature: string;
  amount?: number;
  sender?: string;
  recipient?: string;
  timestamp?: number;
  error?: string;
}

/**
 * Verify a Solana transaction signature for payment
 * Checks:
 * 1. Transaction exists and is confirmed
 * 2. Recipient matches payment wallet
 * 3. Amount is >= required payment
 * 4. Transaction is recent (within timeout window)
 */
export async function verifyPaymentSignature(
  signature: string,
  requiredAmount: number = PAYMENT_AMOUNT_SOL,
  timeoutMs: number = 60000
): Promise<PaymentVerificationResult> {
  const connection = getSolanaConnection();
  const paymentWallet = getPaymentWallet();

  try {
    // Validate signature format
    if (!isValidSignature(signature)) {
      return {
        valid: false,
        signature,
        error: 'Invalid signature format',
      };
    }

    // Fetch transaction
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed',
    });

    if (!tx) {
      return {
        valid: false,
        signature,
        error: 'Transaction not found or not confirmed',
      };
    }

    // Check if transaction was successful
    if (tx.meta?.err) {
      return {
        valid: false,
        signature,
        error: 'Transaction failed on-chain',
      };
    }

    // Extract transaction details
    const blockTime = tx.blockTime;
    if (!blockTime) {
      return {
        valid: false,
        signature,
        error: 'Block time not available',
      };
    }

    // Check transaction recency
    const now = Date.now() / 1000;
    const age = now - blockTime;
    if (age > timeoutMs / 1000) {
      return {
        valid: false,
        signature,
        error: `Transaction too old (${Math.floor(age)}s)`,
      };
    }

    // Find payment to our wallet
    const accountKeys = tx.transaction.message.getAccountKeys();
    const preBalances = tx.meta?.preBalances || [];
    const postBalances = tx.meta?.postBalances || [];

    let paymentFound = false;
    let paymentAmount = 0;
    let sender = '';

    for (let i = 0; i < accountKeys.length; i++) {
      const account = accountKeys.get(i);
      if (!account) continue;

      if (account.equals(paymentWallet)) {
        // Found our wallet, check if balance increased
        const balanceChange = (postBalances[i] || 0) - (preBalances[i] || 0);
        if (balanceChange > 0) {
          paymentFound = true;
          paymentAmount = balanceChange / 1_000_000_000; // Convert lamports to SOL

          // Find sender (account with balance decrease)
          for (let j = 0; j < accountKeys.length; j++) {
            const senderChange = (postBalances[j] || 0) - (preBalances[j] || 0);
            if (senderChange < 0 && j !== i) {
              sender = accountKeys.get(j)?.toBase58() || '';
              break;
            }
          }
          break;
        }
      }
    }

    if (!paymentFound) {
      return {
        valid: false,
        signature,
        error: 'No payment found to payment wallet',
      };
    }

    // Allow small margin for fees
    const minRequired = requiredAmount * 0.99;
    if (paymentAmount < minRequired) {
      return {
        valid: false,
        signature,
        amount: paymentAmount,
        error: `Insufficient payment: ${paymentAmount} SOL (required: ${requiredAmount} SOL)`,
      };
    }

    return {
      valid: true,
      signature,
      amount: paymentAmount,
      sender,
      recipient: paymentWallet.toBase58(),
      timestamp: blockTime,
    };
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return {
      valid: false,
      signature,
      error: error.message || 'Verification failed',
    };
  }
}

/**
 * Validate signature string format (base58)
 */
export function isValidSignature(signature: string): boolean {
  try {
    const decoded = bs58.decode(signature);
    return decoded.length === 64;
  } catch {
    return false;
  }
}

/**
 * Quick validation (no blockchain call) for optimistic serving
 */
export function quickValidateSignature(signature: string): boolean {
  return isValidSignature(signature) && signature.length >= 86 && signature.length <= 88;
}
