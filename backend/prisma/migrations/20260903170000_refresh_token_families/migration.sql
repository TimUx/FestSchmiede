ALTER TABLE "UserSession" ADD COLUMN "family_id" TEXT;
UPDATE "UserSession" SET "family_id" = "id" WHERE "family_id" IS NULL;
ALTER TABLE "UserSession" ALTER COLUMN "family_id" SET NOT NULL;
CREATE INDEX "UserSession_family_id_idx" ON "UserSession"("family_id");

ALTER TABLE "platform_user_sessions" ADD COLUMN "family_id" TEXT;
UPDATE "platform_user_sessions" SET "family_id" = "id" WHERE "family_id" IS NULL;
ALTER TABLE "platform_user_sessions" ALTER COLUMN "family_id" SET NOT NULL;
CREATE INDEX "platform_user_sessions_family_id_idx" ON "platform_user_sessions"("family_id");
