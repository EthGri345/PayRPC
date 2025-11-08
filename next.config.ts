import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  env: {
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    PAYMENT_WALLET_ADDRESS: process.env.PAYMENT_WALLET_ADDRESS || 'PayRPCPlaceholder1111111111111111111111111',
  },
};

export default nextConfig;
