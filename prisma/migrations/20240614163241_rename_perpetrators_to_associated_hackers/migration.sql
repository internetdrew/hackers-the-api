/*
  Warnings:

  - You are about to drop the `PerpetratorOnHack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PerpetratorOnHack" DROP CONSTRAINT "PerpetratorOnHack_characterId_fkey";

-- DropForeignKey
ALTER TABLE "PerpetratorOnHack" DROP CONSTRAINT "PerpetratorOnHack_hackId_fkey";

-- DropTable
DROP TABLE "PerpetratorOnHack";

-- CreateTable
CREATE TABLE "HackerOnHack" (
    "hackId" INTEGER NOT NULL,
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "HackerOnHack_pkey" PRIMARY KEY ("hackId","characterId")
);

-- AddForeignKey
ALTER TABLE "HackerOnHack" ADD CONSTRAINT "HackerOnHack_hackId_fkey" FOREIGN KEY ("hackId") REFERENCES "Hack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackerOnHack" ADD CONSTRAINT "HackerOnHack_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
