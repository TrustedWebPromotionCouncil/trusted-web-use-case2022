/*
  Warnings:

  - Added the required column `location` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
