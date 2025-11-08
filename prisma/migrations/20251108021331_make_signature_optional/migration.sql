-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "signature" TEXT,
    "amount" REAL NOT NULL,
    "payerWallet" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" DATETIME,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Payment" ("amount", "createdAt", "endpoint", "expiresAt", "id", "payerWallet", "requestId", "signature", "verified", "verifiedAt") SELECT "amount", "createdAt", "endpoint", "expiresAt", "id", "payerWallet", "requestId", "signature", "verified", "verifiedAt" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE UNIQUE INDEX "Payment_requestId_key" ON "Payment"("requestId");
CREATE UNIQUE INDEX "Payment_signature_key" ON "Payment"("signature");
CREATE INDEX "Payment_payerWallet_idx" ON "Payment"("payerWallet");
CREATE INDEX "Payment_signature_idx" ON "Payment"("signature");
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
