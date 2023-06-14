/*
  Warnings:

  - You are about to drop the column `holderId` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `issuerId` on the `Credential` table. All the data in the column will be lost.
  - Added the required column `holderEmail` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuerEmail` to the `Credential` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Skill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "description" TEXT,
    "holderEmail" TEXT NOT NULL,
    "holderName" TEXT,
    "lastUpdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Skill" ("description", "id", "lastUpdate", "level", "name") SELECT "description", "id", "lastUpdate", "level", "name" FROM "Skill";
DROP TABLE "Skill";
ALTER TABLE "new_Skill" RENAME TO "Skill";
CREATE TABLE "new_Credential" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "selfLevel" TEXT NOT NULL,
    "selfDescription" TEXT,
    "holderEmail" TEXT NOT NULL,
    "holderName" TEXT,
    "level" TEXT,
    "description" TEXT,
    "certified" BOOLEAN NOT NULL DEFAULT false,
    "issuerEmail" TEXT NOT NULL,
    "issuerName" TEXT
);
INSERT INTO "new_Credential" ("certified", "description", "holderEmail", "holderName", "id", "level", "name", "selfDescription", "selfLevel") SELECT "certified", "description", "holderEmail", "holderName", "id", "level", "name", "selfDescription", "selfLevel" FROM "Credential";
DROP TABLE "Credential";
ALTER TABLE "new_Credential" RENAME TO "Credential";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
