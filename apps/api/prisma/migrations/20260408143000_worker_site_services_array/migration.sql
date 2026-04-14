-- Allow workers to be linked to multiple catalog services.
ALTER TABLE "workers"
ADD COLUMN "site_service_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Backfill from the existing single-link column.
UPDATE "workers"
SET "site_service_ids" = CASE
  WHEN "site_service_id" IS NULL THEN ARRAY[]::TEXT[]
  ELSE ARRAY["site_service_id"]
END;
