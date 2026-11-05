CREATE TYPE "Role" AS ENUM ('ADMIN', 'FOUNDER');

ALTER TABLE "users" ADD COLUMN "role" "Role";

-- Existing rows are developer test accounts and are assigned ADMIN during this backfill.
UPDATE "users" SET "role" = 'ADMIN';

ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;
