-- AlterTable
ALTER TABLE "documents" ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "serial_number" DROP NOT NULL;
