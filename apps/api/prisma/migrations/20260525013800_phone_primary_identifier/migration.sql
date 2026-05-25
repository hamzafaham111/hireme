-- AlterTable
ALTER TABLE "users" ADD COLUMN "phone" TEXT;
ALTER TABLE "users" ADD COLUMN "phone_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "email_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "phone_otp" TEXT;
ALTER TABLE "users" ADD COLUMN "phone_otp_expiry" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "worker_approved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "approved_at" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "approved_by" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- Set worker_approved = true for all customers (backward compatibility)
UPDATE "users" SET "worker_approved" = true WHERE "role" = 'customer';
