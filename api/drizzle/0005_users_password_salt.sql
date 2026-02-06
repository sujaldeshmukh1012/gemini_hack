ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "salt" text;

