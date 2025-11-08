# PayRPC - Pay-Per-Request Solana API

> HTTP 402 powered blockchain data access for autonomous agents

## Overview

PayRPC is a revolutionary Solana blockchain data API that implements the HTTP 402 (Payment Required) standard for micropayments. No registration, no API keys, no subscriptions - just pay 0.001 SOL per request and get instant access to blockchain data.

## Features

### Core Capabilities
- ✅ **15+ API Endpoints** - Account info, token data, network stats, analytics
- ✅ **HTTP 402 Protocol** - Pay-per-request using Solana micropayments
- ✅ **Sub-200ms Response Times** - Aggressive caching and optimizations
- ✅ **Zero Registration** - No forms, no email, no waiting
- ✅ **On-Chain Verification** - Cryptographic payment proof
- ✅ **Agent-Native Design** - Built for autonomous systems

### Advanced Features
- ✅ **Batch Requests** - 10% discount on batch operations
- ✅ **Redis Caching** - Ultra-fast responses with intelligent TTLs
- ✅ **Token Economics** - Deflationary buyback & burn model
- ✅ **Holder Discounts** - Up to 80% off for token holders
- ⏳ **WebSocket Streaming** - Real-time data (coming soon)
- ⏳ **GraphQL Endpoint** - Flexible queries (coming soon)

## Quick Start

### Installation

```bash
npm install
npx prisma migrate dev
npm run dev
```

### Environment Variables

```env
# Solana RPC (recommended: Helius for best performance)
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY

# Payment wallet (receives payments)
PAYMENT_WALLET_ADDRESS=YOUR_SOLANA_WALLET_ADDRESS

# Database
DATABASE_URL="file:./dev.db"

# Redis (optional but recommended)
REDIS_URL=redis://localhost:6379
```

## API Usage

### Example Flow

```javascript
// 1. Make initial request
const response = await fetch('http://localhost:3000/api/v1/account/balance/WALLET_ADDRESS');
const data = await response.json();

// 2. Receive 402 with payment details
if (data.payment) {
  console.log('Payment required:', data.payment);
  // {
  //   paymentRequired: true,
  //   amount: 0.001,
  //   recipient: "PayRPCWallet...",
  //   requestId: "abc123",
  //   expiresAt: 1234567890
  // }

  // 3. Send payment on Solana
  const signature = await sendSolanaPayment(
    data.payment.recipient,
    data.payment.amount
  );

  // 4. Retry with payment proof
  const paidResponse = await fetch('http://localhost:3000/api/v1/account/balance/WALLET_ADDRESS', {
    headers: {
      'x-payment-signature': signature,
      'x-request-id': data.payment.requestId
    }
  });

  const result = await paidResponse.json();
  console.log('Balance:', result.data.balance);
}
```

## Available Endpoints

### Account Endpoints
- `GET /api/v1/account/detail/{address}` - Full account information
- `GET /api/v1/account/balance/{address}` - SOL balance
- `GET /api/v1/account/tokens/{address}` - Token holdings
- `GET /api/v1/account/transactions/{address}` - Transaction history
- `GET /api/v1/account/nfts/{address}` - NFT holdings

### Token Endpoints
- `GET /api/v1/token/info/{mint}` - Token metadata
- `GET /api/v1/token/price/{mint}` - Current price
- `GET /api/v1/token/holders/{mint}` - Holder count

### Network Endpoints
- `GET /api/v1/network/stats` - Network statistics

### Analytics Endpoints
- `GET /api/v1/analytics/trending` - Trending tokens
- `GET /api/v1/analytics/whales/{mint}` - Whale activity

### Batch Endpoint
- `POST /api/v1/batch` - Batch requests (10% discount)

### Documentation
- `GET /api/v1/docs` - Full API documentation (free, no payment required)

## Pricing

| Tier | Min Tokens | Discount | Price/Request |
|------|-----------|----------|---------------|
| None | 0 | 0% | 0.001 SOL |
| Bronze | 100 | 20% | 0.0008 SOL |
| Silver | 1000 | 50% | 0.0005 SOL |
| Gold | 10000 | 80% | 0.0002 SOL |

## Token Economics

100% of API fees are used to:
1. **Buy back** the PayRPC token from the market
2. **Burn** purchased tokens permanently
3. Create **deflationary pressure** as API usage grows

## Architecture

```
┌─────────────────────┐
│   Next.js 14 App    │
├─────────────────────┤
│   API Routes        │
│   - Account         │
│   - Token           │
│   - Network         │
│   - Analytics       │
├─────────────────────┤
│ Payment Middleware  │
│ (HTTP 402)          │
├─────────────────────┤
│ Solana Verification │
│ - Web3.js           │
│ - On-chain checks   │
├─────────────────────┤
│ Database Layer      │
│ - Prisma ORM        │
│ - SQLite/PostgreSQL │
├─────────────────────┤
│ Cache Layer         │
│ - Redis             │
│ - In-memory fallback│
└─────────────────────┘
```

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Initialize database
npx prisma migrate dev

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Database Management

```bash
# Create new migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Generate Prisma Client
npm run prisma:generate
```

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Railway (Database + API)

1. Create PostgreSQL database
2. Deploy Next.js app
3. Link database URL

## Roadmap

- [x] Core HTTP 402 payment system
- [x] 15+ Solana data endpoints
- [x] Redis caching layer
- [x] Premium branded website
- [x] Token economics model
- [ ] WebSocket streaming
- [ ] GraphQL endpoint
- [ ] Python/TypeScript/Rust SDKs
- [ ] Webhook support
- [ ] Advanced analytics
- [ ] DeFi protocol integration

## Security

- ✅ Payment verification before data release
- ✅ On-chain transaction validation
- ✅ Rate limiting per wallet + IP
- ✅ SQL injection prevention
- ✅ Input validation on all endpoints
- ✅ HTTPS only in production
- ✅ Audit logs for all transactions

## Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

## License

MIT License - see LICENSE for details

## Support

- Documentation: `/api/v1/docs`
- GitHub Issues: https://github.com/payrpc/payrpc
- Twitter: @payrpc

---

Built with ❤️ for the agent economy
