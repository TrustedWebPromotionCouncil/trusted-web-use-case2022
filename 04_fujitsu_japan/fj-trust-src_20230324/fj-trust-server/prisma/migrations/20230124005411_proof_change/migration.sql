/*
  Warnings:

  - You are about to drop the column `certDescription` on the `Proof` table. All the data in the column will be lost.
  - You are about to drop the column `certLevel` on the `Proof` table. All the data in the column will be lost.
  - You are about to drop the column `certificateId` on the `Proof` table. All the data in the column will be lost.
  - You are about to drop the column `issuerEmail` on the `Proof` table. All the data in the column will be lost.
  - You are about to drop the column `issuerName` on the `Proof` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Proof` table. All the data in the column will be lost.
  - You are about to drop the column `selfDescription` on the `Proof` table. All the data in the column will be lost.
  - You are about to drop the column `selfLevel` on the `Proof` table. All the data in the column will be lost.
  - Added the required column `hashValue` to the `Proof` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trustSealId` to the `Proof` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verifierEmail` to the `Proof` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verifierName` to the `Proof` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Proof" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trustSealId" TEXT NOT NULL,
    "hashValue" TEXT NOT NULL,
    "proofHash" TEXT,
    "holderEmail" TEXT NOT NULL,
    "holderName" TEXT,
    "verifierEmail" TEXT NOT NULL,
    "verifierName" TEXT NOT NULL
);
INSERT INTO "new_Proof" ("holderEmail", "holderName", "id") SELECT "holderEmail", "holderName", "id" FROM "Proof";
DROP TABLE "Proof";
ALTER TABLE "new_Proof" RENAME TO "Proof";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
