-- AlterTable
ALTER TABLE "users" ADD COLUMN "last_latitude" DOUBLE PRECISION,
ADD COLUMN "last_longitude" DOUBLE PRECISION,
ADD COLUMN "last_location_label" TEXT,
ADD COLUMN "last_location_at" TIMESTAMP(3);
