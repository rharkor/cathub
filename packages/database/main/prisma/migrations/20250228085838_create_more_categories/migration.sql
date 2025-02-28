-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Category" ADD VALUE 'GANG_BANG';
ALTER TYPE "Category" ADD VALUE 'PURRING_PLEASURE';
ALTER TYPE "Category" ADD VALUE 'NAUGHTY_PAWS';
ALTER TYPE "Category" ADD VALUE 'MIDNIGHT_MEOWS';
ALTER TYPE "Category" ADD VALUE 'FLUFFY_FANTASIES';
