-- Site service public reference codes (SS-01, SS-02, …), separate from URL slugs.

ALTER TABLE "site_services" ADD COLUMN "service_key" TEXT;

-- Assign keys in display order for any existing rows.
WITH ordered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      ORDER BY "sort_order" ASC, "title" ASC, "created_at" ASC
    ) AS n
  FROM "site_services"
)
UPDATE "site_services" AS s
SET "service_key" = 'SS-' || LPAD(o.n::text, 2, '0')
FROM ordered AS o
WHERE s.id = o.id;

ALTER TABLE "site_services" ALTER COLUMN "service_key" SET NOT NULL;

CREATE UNIQUE INDEX "site_services_service_key_key" ON "site_services"("service_key");
