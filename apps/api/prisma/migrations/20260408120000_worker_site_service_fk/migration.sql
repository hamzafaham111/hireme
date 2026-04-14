-- Link workers to catalog site services (nullable FK). Backfill exact title match (case-sensitive).

ALTER TABLE "workers" ADD COLUMN "site_service_id" TEXT;

UPDATE "workers" AS w
SET "site_service_id" = s.id
FROM "site_services" AS s
WHERE w.service = s.title;

CREATE INDEX "workers_site_service_id_idx" ON "workers"("site_service_id");

ALTER TABLE "workers"
  ADD CONSTRAINT "workers_site_service_id_fkey"
  FOREIGN KEY ("site_service_id") REFERENCES "site_services"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
