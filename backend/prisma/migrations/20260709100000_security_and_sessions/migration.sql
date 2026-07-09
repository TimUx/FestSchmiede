-- Order lookup token for secure public access
ALTER TABLE "Order" ADD COLUMN "lookupToken" TEXT;

UPDATE "Order" SET "lookupToken" = encode(gen_random_bytes(16), 'hex') WHERE "lookupToken" IS NULL;

ALTER TABLE "Order" ALTER COLUMN "lookupToken" SET NOT NULL;

CREATE UNIQUE INDEX "Order_lookupToken_key" ON "Order"("lookupToken");

-- Refresh-token sessions
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserSession_refreshTokenHash_key" ON "UserSession"("refreshTokenHash");
CREATE INDEX "UserSession_userId_idx" ON "UserSession"("userId");

ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Data retention setting
ALTER TABLE "ClubSettings" ADD COLUMN "dataRetentionDays" INTEGER NOT NULL DEFAULT 365;
