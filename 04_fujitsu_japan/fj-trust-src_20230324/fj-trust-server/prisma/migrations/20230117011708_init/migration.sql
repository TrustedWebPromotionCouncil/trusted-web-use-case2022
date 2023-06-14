-- CreateTable
CREATE TABLE "Holder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Issuer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Verifier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "description" TEXT,
    "holderId" INTEGER NOT NULL,
    "lastUpdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Skill_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "Holder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Credential" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "selfLevel" TEXT NOT NULL,
    "selfDescription" TEXT,
    "holderName" TEXT,
    "holderEmail" TEXT NOT NULL,
    "level" TEXT,
    "description" TEXT,
    "certified" BOOLEAN NOT NULL DEFAULT false,
    "issuerId" INTEGER NOT NULL,
    CONSTRAINT "Credential_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Issuer" ("id") ON DELETE SET DEFAULT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Proof" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "selfLevel" TEXT NOT NULL,
    "selfDescription" TEXT,
    "holderName" TEXT,
    "holderEmail" TEXT NOT NULL,
    "certLevel" TEXT,
    "certDescription" TEXT,
    "issuerName" TEXT,
    "issuerEmail" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Holder_email_key" ON "Holder"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Issuer_email_key" ON "Issuer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Verifier_email_key" ON "Verifier"("email");
