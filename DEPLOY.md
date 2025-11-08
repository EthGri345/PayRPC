# Deployment Guide for payrpc.xyz

## Quick Deploy to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

### Step 2: Deploy
```bash
cd /home/ethan-griffin/payrpc
vercel --prod
```

### Step 3: Set Environment Variables in Vercel Dashboard

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add these:

**Required:**
```
NEXT_PUBLIC_SOLANA_RPC_URL = https://mainnet.helius-rpc.com/?api-key=a327dbc6-7112-490a-ba95-e2c7d3982802
PAYMENT_WALLET_ADDRESS = FzKyKCvCWgr9xWh3Vgg3uPfR5CG6AgFJmCwUvZjhraQV
PAYMENT_AMOUNT = 0.001
```

**Database (Add Vercel Postgres):**
1. Go to Storage tab in Vercel
2. Create Postgres Database
3. It will auto-populate DATABASE_URL

**Redis (Optional but Recommended):**
1. Go to https://upstash.com
2. Create Redis database
3. Copy REDIS_URL
4. Add to Vercel env vars

### Step 4: Add Custom Domain (When DNS is Ready)

1. In Vercel dashboard, go to Domains
2. Add: `payrpc.xyz`
3. Vercel will show you nameservers or A/CNAME records
4. Update at your domain registrar
5. Wait for DNS propagation (up to 48h, usually <1h)

**Current Vercel Nameservers:**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

## Alternative: Point Domain to Vercel

If you can't change nameservers, add these DNS records:

**A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Testing After Deploy

```bash
# Test Vercel URL (before custom domain)
curl https://your-project.vercel.app/api/v1/docs

# Test custom domain (after DNS sync)
curl https://payrpc.xyz/api/v1/docs

# Test payment flow
curl https://payrpc.xyz/api/v1/account/balance/So11111111111111111111111111111111111111112
```

## Post-Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Database connected (Vercel Postgres)
- [ ] Redis connected (Upstash)
- [ ] Custom domain added
- [ ] DNS records updated
- [ ] SSL certificate active (auto by Vercel)
- [ ] Test all API endpoints
- [ ] Verify payment flow works
- [ ] Check homepage loads
- [ ] Monitor logs for errors

## Database Migration

After first deploy, run migrations:

```bash
# In Vercel dashboard, go to project
# Settings → Functions → Add Environment Variable
# Then deploy a migration

# Or use Vercel CLI
vercel env pull
npx prisma migrate deploy
```

## Current Status

✅ Code pushed to GitHub
✅ Build configuration ready
⏳ Waiting for payrpc.xyz DNS to sync
⏳ Ready to deploy to Vercel

## Deploy Now (Temporary URL)

```bash
vercel --prod
```

You'll get: `https://payrpc-xyz.vercel.app` (temporary)
Then add custom domain when DNS is ready.
