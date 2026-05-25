-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('individual', 'residential', 'commercial');

-- CreateEnum
CREATE TYPE "WorkerApprovalStatus" AS ENUM ('pending', 'approved', 'rejected', 'suspended');

-- AlterTable
ALTER TABLE "workers" ADD COLUMN     "approval_status" "WorkerApprovalStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "approved_at" TIMESTAMP(3),
ADD COLUMN     "approved_by" TEXT,
ADD COLUMN     "rejection_reason" TEXT;

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "preferred_location" TEXT,
    "preferred_services" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "customer_type" "CustomerType" NOT NULL DEFAULT 'individual',
    "total_jobs_posted" INTEGER NOT NULL DEFAULT 0,
    "total_spent" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "reputation_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "billing_address" TEXT,
    "communication_pref" TEXT NOT NULL DEFAULT 'whatsapp',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_user_id_key" ON "customers"("user_id");

-- CreateIndex
CREATE INDEX "customers_user_id_idx" ON "customers"("user_id");

-- CreateIndex
CREATE INDEX "workers_user_id_idx" ON "workers"("user_id");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
