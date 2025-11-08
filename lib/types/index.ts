// PayRPC Type Definitions

export interface PaymentDetails {
  paymentRequired: true;
  amount: number;
  recipient: string;
  requestId: string;
  expiresAt: number;
  message?: string;
}

export interface PaymentProof {
  signature: string;
  requestId: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  payment?: PaymentDetails;
  responseTime?: number;
}

export interface DiscountTier {
  name: 'none' | 'bronze' | 'silver' | 'gold';
  minTokens: number;
  discount: number; // percentage
  price: number; // actual price after discount
}

export const DISCOUNT_TIERS: DiscountTier[] = [
  { name: 'none', minTokens: 0, discount: 0, price: 0.001 },
  { name: 'bronze', minTokens: 100, discount: 20, price: 0.0008 },
  { name: 'silver', minTokens: 1000, discount: 50, price: 0.0005 },
  { name: 'gold', minTokens: 10000, discount: 80, price: 0.0002 },
];

// Solana Types
export interface SolanaAccountInfo {
  address: string;
  balance: number;
  executable: boolean;
  owner: string;
  rentEpoch?: number;
  data?: any;
}

export interface TokenAccountInfo {
  mint: string;
  owner: string;
  amount: string;
  decimals: number;
  uiAmount: number;
}

export interface TransactionInfo {
  signature: string;
  slot: number;
  blockTime: number | null;
  err: any;
  memo?: string;
  fee: number;
}

export interface TokenInfo {
  address: string;
  name?: string;
  symbol?: string;
  decimals: number;
  supply?: string;
  logoURI?: string;
}

export interface MarketData {
  mint: string;
  price: number;
  volume24h: number;
  priceChange24h: number;
  liquidity: number;
  holders?: number;
}

export interface WhaleActivity {
  wallet: string;
  action: 'buy' | 'sell' | 'transfer';
  amount: number;
  usdValue: number;
  timestamp: number;
  signature: string;
}

export interface TrendingToken {
  mint: string;
  name: string;
  symbol: string;
  volumeChange: number;
  priceChange: number;
  buyPressure: number;
  score: number;
}

// Cache Types
export interface CacheConfig {
  ttl: number; // seconds
  key: string;
}

// API Endpoint Types
export type EndpointCategory = 'account' | 'token' | 'network' | 'analytics' | 'batch';

export interface EndpointMetadata {
  path: string;
  category: EndpointCategory;
  description: string;
  price: number;
  cacheTTL: number;
}
