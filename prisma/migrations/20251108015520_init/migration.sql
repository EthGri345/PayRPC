-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "payerWallet" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" DATETIME,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ApiRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "paymentId" TEXT,
    "responseTimeMs" INTEGER NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "errorMessage" TEXT,
    "payerWallet" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TokenBurn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "txSignature" TEXT NOT NULL,
    "usdValue" REAL,
    "burnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TokenBuyback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "solAmount" REAL NOT NULL,
    "tokenAmount" REAL NOT NULL,
    "txSignature" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "boughtAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WalletAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "walletAddress" TEXT NOT NULL,
    "tokenBalance" REAL NOT NULL DEFAULT 0,
    "discountTier" TEXT NOT NULL DEFAULT 'none',
    "totalRequests" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" REAL NOT NULL DEFAULT 0,
    "firstSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SystemStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalRequests" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" REAL NOT NULL DEFAULT 0,
    "totalBurned" REAL NOT NULL DEFAULT 0,
    "uniqueWallets" INTEGER NOT NULL DEFAULT 0,
    "avgResponseTime" REAL NOT NULL DEFAULT 0,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_requestId_key" ON "Payment"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_signature_key" ON "Payment"("signature");

-- CreateIndex
CREATE INDEX "Payment_payerWallet_idx" ON "Payment"("payerWallet");

-- CreateIndex
CREATE INDEX "Payment_signature_idx" ON "Payment"("signature");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE INDEX "ApiRequest_endpoint_idx" ON "ApiRequest"("endpoint");

-- CreateIndex
CREATE INDEX "ApiRequest_createdAt_idx" ON "ApiRequest"("createdAt");

-- CreateIndex
CREATE INDEX "ApiRequest_payerWallet_idx" ON "ApiRequest"("payerWallet");

-- CreateIndex
CREATE UNIQUE INDEX "TokenBurn_txSignature_key" ON "TokenBurn"("txSignature");

-- CreateIndex
CREATE INDEX "TokenBurn_burnedAt_idx" ON "TokenBurn"("burnedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TokenBuyback_txSignature_key" ON "TokenBuyback"("txSignature");

-- CreateIndex
CREATE INDEX "TokenBuyback_boughtAt_idx" ON "TokenBuyback"("boughtAt");

-- CreateIndex
CREATE UNIQUE INDEX "WalletAnalytics_walletAddress_key" ON "WalletAnalytics"("walletAddress");

-- CreateIndex
CREATE INDEX "WalletAnalytics_tokenBalance_idx" ON "WalletAnalytics"("tokenBalance");

-- CreateIndex
CREATE INDEX "WalletAnalytics_discountTier_idx" ON "WalletAnalytics"("discountTier");

-- CreateIndex
CREATE UNIQUE INDEX "SystemStats_date_key" ON "SystemStats"("date");

-- CreateIndex
CREATE INDEX "SystemStats_date_idx" ON "SystemStats"("date");
