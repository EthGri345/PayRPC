// API Documentation Endpoint (Free - no payment required)
import { NextResponse } from 'next/server';

export async function GET() {
  const documentation = {
    name: 'PayRPC API',
    version: '1.0.0',
    description: 'Pay-per-request Solana blockchain data API using HTTP 402 standard',
    pricing: {
      basePrice: 0.001,
      currency: 'SOL',
      discounts: [
        { tier: 'Bronze', minTokens: 100, discount: '20%', price: 0.0008 },
        { tier: 'Silver', minTokens: 1000, discount: '50%', price: 0.0005 },
        { tier: 'Gold', minTokens: 10000, discount: '80%', price: 0.0002 },
      ],
    },
    paymentFlow: {
      steps: [
        '1. Make API request without payment',
        '2. Receive 402 response with payment details',
        '3. Send 0.001 SOL on Solana to provided address',
        '4. Retry request with payment signature in header',
        '5. Receive data instantly',
      ],
      headers: {
        'x-payment-signature': 'Solana transaction signature',
        'x-request-id': 'Request ID from 402 response',
      },
    },
    endpoints: [
      {
        category: 'Account',
        routes: [
          { path: '/api/v1/account/detail/{address}', method: 'GET', description: 'Get full account information' },
          { path: '/api/v1/account/balance/{address}', method: 'GET', description: 'Get SOL balance' },
          { path: '/api/v1/account/tokens/{address}', method: 'GET', description: 'Get token holdings' },
          { path: '/api/v1/account/transactions/{address}', method: 'GET', description: 'Get transaction history' },
          { path: '/api/v1/account/nfts/{address}', method: 'GET', description: 'Get NFT holdings' },
        ],
      },
      {
        category: 'Token',
        routes: [
          { path: '/api/v1/token/info/{mint}', method: 'GET', description: 'Get token metadata and supply' },
          { path: '/api/v1/token/price/{mint}', method: 'GET', description: 'Get current token price' },
          { path: '/api/v1/token/holders/{mint}', method: 'GET', description: 'Get holder count' },
        ],
      },
      {
        category: 'Network',
        routes: [
          { path: '/api/v1/network/stats', method: 'GET', description: 'Get network statistics (TPS, epoch, supply)' },
        ],
      },
      {
        category: 'Analytics',
        routes: [
          { path: '/api/v1/analytics/trending', method: 'GET', description: 'Get trending tokens' },
          { path: '/api/v1/analytics/whales/{mint}', method: 'GET', description: 'Track whale activity' },
        ],
      },
      {
        category: 'Batch',
        routes: [
          { path: '/api/v1/batch', method: 'POST', description: 'Batch requests (10% discount)' },
        ],
      },
    ],
    example: {
      javascript: `
// Initial request
const response = await fetch('https://api.payrpc.xyz/api/v1/account/balance/WALLET_ADDRESS');
const data = await response.json();

if (data.payment) {
  // Send payment on Solana
  const signature = await sendSolanaPayment(data.payment.recipient, data.payment.amount);

  // Retry with payment proof
  const paidResponse = await fetch('https://api.payrpc.xyz/api/v1/account/balance/WALLET_ADDRESS', {
    headers: {
      'x-payment-signature': signature,
      'x-request-id': data.payment.requestId
    }
  });

  const result = await paidResponse.json();
  console.log(result.data);
}
      `.trim(),
    },
  };

  return NextResponse.json(documentation);
}
