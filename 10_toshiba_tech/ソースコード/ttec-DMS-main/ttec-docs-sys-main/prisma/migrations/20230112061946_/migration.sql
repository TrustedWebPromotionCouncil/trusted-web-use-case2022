/*
  Warnings:

  - You are about to drop the column `data` on the `documents` table. All the data in the column will be lost.
  - Added the required column `vc` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" DROP COLUMN "data",
ADD COLUMN     "vc" TEXT NOT NULL;
