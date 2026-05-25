-- Migrate DashboardRole to admin | customer | worker; link Worker<->User; Job customer + geo + site service.

-- 1) New role enum + column swap (PostgreSQL cannot alter enum in place safely)
CREATE TYPE "DashboardRole_new" AS ENUM ('admin', 'customer', 'worker');

ALTER TABLE "users" ADD COLUMN "role_new" "DashboardRole_new" NOT NULL DEFAULT 'admin';

UPDATE "users" SET "role_new" = CASE "role"::text
  WHEN 'superadmin' THEN 'admin'::"DashboardRole_new"
  WHEN 'admin' THEN 'admin'::"DashboardRole_new"
  WHEN 'agent' THEN 'admin'::"DashboardRole_new"
  WHEN 'content_editor' THEN 'admin'::"DashboardRole_new"
  ELSE 'admin'::"DashboardRole_new"
END;

ALTER TABLE "users" DROP COLUMN "role";
ALTER TABLE "users" RENAME COLUMN "role_new" TO "role";
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;

DROP TYPE "DashboardRole";
ALTER TYPE "DashboardRole_new" RENAME TO "DashboardRole";

-- 2) Worker optional user link
ALTER TABLE "workers" ADD COLUMN "user_id" TEXT;
CREATE UNIQUE INDEX "workers_user_id_key" ON "workers"("user_id");
ALTER TABLE "workers" ADD CONSTRAINT "workers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 3) Job: customer, coordinates, catalog service
ALTER TABLE "jobs" ADD COLUMN "customer_user_id" TEXT;
ALTER TABLE "jobs" ADD COLUMN "latitude" DOUBLE PRECISION;
ALTER TABLE "jobs" ADD COLUMN "longitude" DOUBLE PRECISION;
ALTER TABLE "jobs" ADD COLUMN "site_service_id" TEXT;

CREATE INDEX "jobs_customer_user_id_idx" ON "jobs"("customer_user_id");
CREATE INDEX "jobs_site_service_id_idx" ON "jobs"("site_service_id");

ALTER TABLE "jobs" ADD CONSTRAINT "jobs_customer_user_id_fkey" FOREIGN KEY ("customer_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_site_service_id_fkey" FOREIGN KEY ("site_service_id") REFERENCES "site_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
