/*
  Warnings:

  - Added the required column `password` to the `Verifier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Issuer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Holder` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Verifier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT
);
INSERT INTO "new_Verifier" ("description", "email", "id", "name") SELECT "description", "email", "id", "name" FROM "Verifier";
DROP TABLE "Verifier";
ALTER TABLE "new_Verifier" RENAME TO "Verifier";
CREATE UNIQUE INDEX "Verifier_email_key" ON "Verifier"("email");
CREATE TABLE "new_Issuer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT
);
INSERT INTO "new_Issuer" ("description", "email", "id", "name") SELECT "description", "email", "id", "name" FROM "Issuer";
DROP TABLE "Issuer";
ALTER TABLE "new_Issuer" RENAME TO "Issuer";
CREATE UNIQUE INDEX "Issuer_email_key" ON "Issuer"("email");
CREATE TABLE "new_Holder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT
);
INSERT INTO "new_Holder" ("description", "email", "id", "name") SELECT "description", "email", "id", "name" FROM "Holder";
DROP TABLE "Holder";
ALTER TABLE "new_Holder" RENAME TO "Holder";
CREATE UNIQUE INDEX "Holder_email_key" ON "Holder"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
