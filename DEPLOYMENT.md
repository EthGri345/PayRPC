# PayRPC Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables

Before deploying, you MUST update these in your hosting platform:

```env
# REQUIRED: Your actual Helius API key
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_ACTUAL_KEY

# REQUIRED: Your Solana wallet that will receive payments
PAYMENT_WALLET_ADDRESS=YOUR_ACTUAL_SOLANA_WALLET_ADDRESS

# Production database (PostgreSQL recommended)
DATABASE_URL=postgresql://user:password@host:5432/database

# Redis for caching (highly recommended for production)
REDIS_URL=redis://user:password@host:6379

# Token configuration (update when token is deployed)
TOKEN_MINT_ADDRESS=YOUR_TOKEN_MINT_ADDRESS
TOKEN_DECIMALS=9

# API settings
PAYMENT_AMOUNT=0.001
PAYMENT_TIMEOUT_MS=30000
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 2. Get API Keys

**Helius (Recommended RPC Provider)**
1. Go to https://helius.dev/
2. Create free account
3. Get API key (100k credits/day free)
4. Update NEXT_PUBLIC_SOLANA_RPC_URL

**Alternative RPC Providers:**
- QuickNode: https://quicknode.com/
- Alchemy: https://www.alchemy.com/solana
- Public RPC (not recommended): https://api.mainnet-beta.solana.com

### 3. Create Solana Wallet

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Create new wallet
solana-keygen new -o ~/payment-wallet.json

# Get the public key
solana-keygen pubkey ~/payment-wallet.json

# Fund it with some SOL for testing
# Use https://faucet.solana.com (devnet) or buy SOL (mainnet)
```

## Deployment Options

### Option 1: Vercel (Fastest, Recommended for MVP)

**Pros:**
- Zero config deployment
- Automatic HTTPS
- Global CDN
- Free tier available

**Cons:**
- Need external database
- Serverless functions (cold starts)

**Steps:**

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial PayRPC deployment"
gh repo create payrpc --public
git push origin main
```

2. **Deploy to Vercel**
```bash
npm install -g vercel
vercel login
vercel --prod
```

3. **Add Environment Variables in Vercel Dashboard**
- Go to vercel.com/dashboard
- Select project
- Settings → Environment Variables
- Add all variables from checklist

4. **Add PostgreSQL Database**
- Vercel → Storage → Create Database → Postgres
- Copy DATABASE_URL
- Update env variable
- Redeploy

### Option 2: Railway (Full Stack, Recommended for Production)

**Pros:**
- Includes PostgreSQL + Redis
- Persistent storage
- No cold starts
- Simple pricing

**Steps:**

1. **Create Railway Account**
- Go to https://railway.app
- Sign up with GitHub

2. **Create New Project**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add PostgreSQL
railway add postgresql

# Add Redis
railway add redis

# Deploy
railway up
```

3. **Link Services**
- Railway will auto-populate DATABASE_URL and REDIS_URL
- Add other env variables in dashboard

### Option 3: Docker (Self-Hosted)

**For complete control:**

1. **Create Dockerfile**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. **Create docker-compose.yml**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/payrpc
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: payrpc
      POSTGRES_PASSWORD: password
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

3. **Deploy**
```bash
docker-compose up -d
```

## Post-Deployment

### 1. Run Database Migrations

```bash
# For Vercel/Railway
npx prisma migrate deploy

# For Docker (inside container)
docker exec -it payrpc-app npx prisma migrate deploy
```

### 2. Verify Deployment

Test key endpoints:

```bash
# Docs (should work immediately)
curl https://your-domain.com/api/v1/docs

# Balance (should return 402)
curl https://your-domain.com/api/v1/account/balance/So11111111111111111111111111111111111111112

# Expected response:
# {
#   "success": false,
#   "payment": {
#     "paymentRequired": true,
#     "amount": 0.001,
#     "recipient": "YOUR_WALLET",
#     "requestId": "...",
#     "expiresAt": ...
#   }
# }
```

### 3. Monitor

**Check Logs:**
```bash
# Vercel
vercel logs

# Railway
railway logs

# Docker
docker logs payrpc-app
```

**Database:**
```bash
# Open Prisma Studio
npx prisma studio

# Or use Railway dashboard
```

### 4. Custom Domain (Optional)

**Vercel:**
1. Project → Settings → Domains
2. Add your domain
3. Update DNS records

**Railway:**
1. Project → Settings → Public Networking
2. Generate domain or add custom
3. Update DNS

## Security Hardening

### 1. Add Rate Limiting

Install and configure:
```bash
npm install @upstash/ratelimit
```

### 2. Add CORS

Update `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://your-frontend.com' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
      ],
    },
  ];
}
```

### 3. Enable HTTPS Only

All hosting options auto-enable HTTPS, but verify in config.

### 4. Secure Database

- Use strong passwords
- Enable SSL connections
- Restrict IP access

## Monitoring & Analytics

### Recommended Tools

- **Uptime:** UptimeRobot, Pingdom
- **Errors:** Sentry
- **Analytics:** PostHog, Mixpanel
- **Logging:** Axiom, Better Stack

## Cost Estimates

### MVP (Testing)

- **Vercel:** Free
- **PostgreSQL:** Free (Vercel Storage) or $5/mo (Railway)
- **Redis:** Free (Railway) or $10/mo (Upstash)
- **Helius RPC:** Free (100k/day)

**Total: $0-15/month**

### Production (1000 req/day)

- **Railway:** $5 (app) + $5 (DB) = $10
- **Redis:** $10
- **Helius:** Free or $99/mo for premium

**Total: $20-120/month**

### Scale (100k req/day)

- **Railway:** $20 (app) + $20 (DB) = $40
- **Redis:** $50 (larger instance)
- **Helius:** $99-$299/mo

**Total: $190-390/month**

## Troubleshooting

### "Invalid payment wallet"
→ Check PAYMENT_WALLET_ADDRESS is valid Solana address

### "Database connection failed"
→ Verify DATABASE_URL and run migrations

### "RPC timeout"
→ Check NEXT_PUBLIC_SOLANA_RPC_URL and API key

### "Redis connection failed"
→ Verify REDIS_URL or disable Redis (uses in-memory cache)

## Next Steps

1. Deploy token contract
2. Update TOKEN_MINT_ADDRESS
3. Implement buyback bot
4. Add analytics dashboard
5. Create SDKs (Python, TypeScript, Rust)
6. Add WebSocket support
7. Integrate DeFi price feeds
8. Add whale tracking

## Support

- GitHub Issues: Create detailed bug reports
- Documentation: /api/v1/docs
- Twitter: @payrpc

---

Need help? Open an issue on GitHub.
