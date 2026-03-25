ALTER TABLE "Vehicle"
ADD COLUMN IF NOT EXISTS "listingCategory" TEXT NOT NULL DEFAULT 'SALE';

UPDATE "Vehicle"
SET "listingCategory" = 'SALE'
WHERE "listingCategory" IS NULL OR "listingCategory" NOT IN ('SALE', 'HIRE');
