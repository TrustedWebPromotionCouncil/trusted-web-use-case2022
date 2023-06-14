/*
  Warnings:

  - Added the required column `data` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filename` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mime_type` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scaned_at` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "data" TEXT NOT NULL,
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "mime_type" TEXT NOT NULL,
ADD COLUMN     "scaned_at" TIMESTAMPTZ NOT NULL;
