// Solana Data Fetching Utilities
import { PublicKey, ParsedAccountData, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getSolanaConnection } from './client';
import { getCache, setCache, CACHE_TTL } from '../cache/redis';
import {
  SolanaAccountInfo,
  TokenAccountInfo,
  TransactionInfo,
  TokenInfo,
  MarketData,
} from '../types';

const connection = getSolanaConnection();

/**
 * Get account information
 */
export async function getAccountInfo(address: string): Promise<SolanaAccountInfo | null> {
  const cacheKey = `account:${address}`;
  const cached = await getCache<SolanaAccountInfo>(cacheKey);
  if (cached) return cached;

  try {
    const pubkey = new PublicKey(address);
    const accountInfo = await connection.getAccountInfo(pubkey);

    if (!accountInfo) return null;

    const data: SolanaAccountInfo = {
      address,
      balance: accountInfo.lamports / LAMPORTS_PER_SOL,
      executable: accountInfo.executable,
      owner: accountInfo.owner.toBase58(),
      rentEpoch: accountInfo.rentEpoch,
    };

    await setCache(cacheKey, data, CACHE_TTL.ACCOUNT_BALANCE);
    return data;
  } catch (error) {
    console.error('Error fetching account info:', error);
    return null;
  }
}

/**
 * Get account balance
 */
export async function getAccountBalance(address: string): Promise<number | null> {
  const cacheKey = `balance:${address}`;
  const cached = await getCache<number>(cacheKey);
  if (cached !== null) return cached;

  try {
    const pubkey = new PublicKey(address);
    const balance = await connection.getBalance(pubkey);
    const solBalance = balance / LAMPORTS_PER_SOL;

    await setCache(cacheKey, solBalance, CACHE_TTL.ACCOUNT_BALANCE);
    return solBalance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
}

/**
 * Get token accounts for an address
 */
export async function getTokenAccounts(address: string): Promise<TokenAccountInfo[]> {
  const cacheKey = `tokens:${address}`;
  const cached = await getCache<TokenAccountInfo[]>(cacheKey);
  if (cached) return cached;

  try {
    const pubkey = new PublicKey(address);
    const response = await connection.getParsedTokenAccountsByOwner(pubkey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    });

    const tokens: TokenAccountInfo[] = response.value.map((account) => {
      const data = account.account.data as ParsedAccountData;
      const parsed = data.parsed.info;

      return {
        mint: parsed.mint,
        owner: parsed.owner,
        amount: parsed.tokenAmount.amount,
        decimals: parsed.tokenAmount.decimals,
        uiAmount: parsed.tokenAmount.uiAmount,
      };
    });

    await setCache(cacheKey, tokens, CACHE_TTL.ACCOUNT_BALANCE);
    return tokens;
  } catch (error) {
    console.error('Error fetching token accounts:', error);
    return [];
  }
}

/**
 * Get transaction history for an address
 */
export async function getTransactionHistory(
  address: string,
  limit: number = 10
): Promise<TransactionInfo[]> {
  const cacheKey = `txs:${address}:${limit}`;
  const cached = await getCache<TransactionInfo[]>(cacheKey);
  if (cached) return cached;

  try {
    const pubkey = new PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(pubkey, { limit });

    const transactions: TransactionInfo[] = signatures.map((sig) => ({
      signature: sig.signature,
      slot: sig.slot,
      blockTime: sig.blockTime ?? null,
      err: sig.err,
      memo: sig.memo || undefined,
      fee: 0, // Fee not available in signature info
    }));

    await setCache(cacheKey, transactions, 30);
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

/**
 * Get token metadata
 */
export async function getTokenInfo(mint: string): Promise<TokenInfo | null> {
  const cacheKey = `token:info:${mint}`;
  const cached = await getCache<TokenInfo>(cacheKey);
  if (cached) return cached;

  try {
    const pubkey = new PublicKey(mint);
    const supply = await connection.getTokenSupply(pubkey);

    const info: TokenInfo = {
      address: mint,
      decimals: supply.value.decimals,
      supply: supply.value.amount,
    };

    // Try to fetch metadata from common registries
    // For now, return basic info
    await setCache(cacheKey, info, CACHE_TTL.TOKEN_INFO);
    return info;
  } catch (error) {
    console.error('Error fetching token info:', error);
    return null;
  }
}

/**
 * Get token holders count (approximate via supply distribution)
 */
export async function getTokenHolders(mint: string): Promise<number> {
  const cacheKey = `token:holders:${mint}`;
  const cached = await getCache<number>(cacheKey);
  if (cached !== null) return cached;

  try {
    // This is an approximation - real holder count requires indexing
    const pubkey = new PublicKey(mint);
    const largestAccounts = await connection.getTokenLargestAccounts(pubkey);
    const holders = largestAccounts.value.length;

    await setCache(cacheKey, holders, CACHE_TTL.TOKEN_INFO);
    return holders;
  } catch (error) {
    console.error('Error fetching token holders:', error);
    return 0;
  }
}

/**
 * Get network stats
 */
export async function getNetworkStats() {
  const cacheKey = 'network:stats';
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  try {
    const [epochInfo, perfSamples, supply] = await Promise.all([
      connection.getEpochInfo(),
      connection.getRecentPerformanceSamples(1),
      connection.getSupply(),
    ]);

    const stats = {
      slot: epochInfo.absoluteSlot,
      epoch: epochInfo.epoch,
      slotIndex: epochInfo.slotIndex,
      slotsInEpoch: epochInfo.slotsInEpoch,
      tps: perfSamples[0]?.numTransactions / perfSamples[0]?.samplePeriodSecs || 0,
      totalSupply: supply.value.total / LAMPORTS_PER_SOL,
      circulatingSupply: supply.value.circulating / LAMPORTS_PER_SOL,
    };

    await setCache(cacheKey, stats, CACHE_TTL.NETWORK_STATS);
    return stats;
  } catch (error) {
    console.error('Error fetching network stats:', error);
    return null;
  }
}

/**
 * Get NFTs for an address (using DAS API if available)
 */
export async function getNFTs(address: string): Promise<any[]> {
  const cacheKey = `nfts:${address}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  try {
    // This requires DAS (Digital Asset Standard) API from Helius
    // For now, return empty array - can be implemented with Helius DAS API
    const nfts: any[] = [];

    await setCache(cacheKey, nfts, 300);
    return nfts;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
}

/**
 * Get token price (mock - requires DEX integration)
 */
export async function getTokenPrice(mint: string): Promise<number | null> {
  const cacheKey = `price:${mint}`;
  const cached = await getCache<number>(cacheKey);
  if (cached !== null) return cached;

  try {
    // TODO: Integrate with Jupiter, Birdeye, or other price APIs
    // For now, return null
    return null;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return null;
  }
}
