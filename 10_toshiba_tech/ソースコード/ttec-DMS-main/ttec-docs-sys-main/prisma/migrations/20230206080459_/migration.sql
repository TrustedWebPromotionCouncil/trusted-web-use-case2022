/*
  Warnings:

  - Added the required column `serial_number` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "serial_number" TEXT NOT NULL;
