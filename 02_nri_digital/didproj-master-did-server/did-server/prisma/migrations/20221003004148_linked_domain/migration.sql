-- CreateTable
CREATE TABLE "LinkedDomain" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "linkedDid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LinkedDomain_id_fkey" FOREIGN KEY ("id") REFERENCES "Issuer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LinkedDomain_id_fkey" FOREIGN KEY ("id") REFERENCES "Verifier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
