/*
  Warnings:

  - You are about to drop the `LinkedDomain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LinkedDomain";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "IssuerLinkedDomain" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "linkedDid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IssuerLinkedDomain_id_fkey" FOREIGN KEY ("id") REFERENCES "Issuer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerifierLinkedDomain" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "linkedDid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VerifierLinkedDomain_id_fkey" FOREIGN KEY ("id") REFERENCES "Verifier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
