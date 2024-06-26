/*
  Warnings:

  - You are about to drop the column `targetedCharacterId` on the `Hack` table. All the data in the column will be lost.
  - You are about to drop the column `targetedOrganizationId` on the `Hack` table. All the data in the column will be lost.
  - You are about to drop the `HackerOnHack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hack" DROP CONSTRAINT "Hack_targetedCharacterId_fkey";

-- DropForeignKey
ALTER TABLE "Hack" DROP CONSTRAINT "Hack_targetedOrganizationId_fkey";

-- DropForeignKey
ALTER TABLE "HackerOnHack" DROP CONSTRAINT "HackerOnHack_characterId_fkey";

-- DropForeignKey
ALTER TABLE "HackerOnHack" DROP CONSTRAINT "HackerOnHack_hackId_fkey";

-- AlterTable
ALTER TABLE "Hack" DROP COLUMN "targetedCharacterId",
DROP COLUMN "targetedOrganizationId";

-- DropTable
DROP TABLE "HackerOnHack";

-- CreateTable
CREATE TABLE "HackContributor" (
    "hackId" INTEGER NOT NULL,
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "HackContributor_pkey" PRIMARY KEY ("hackId","characterId")
);

-- CreateTable
CREATE TABLE "HackTargetCharacter" (
    "hackId" INTEGER NOT NULL,
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "HackTargetCharacter_pkey" PRIMARY KEY ("hackId","characterId")
);

-- CreateTable
CREATE TABLE "HackTargetOrganization" (
    "hackId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "HackTargetOrganization_pkey" PRIMARY KEY ("hackId","organizationId")
);

-- AddForeignKey
ALTER TABLE "HackContributor" ADD CONSTRAINT "HackContributor_hackId_fkey" FOREIGN KEY ("hackId") REFERENCES "Hack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackContributor" ADD CONSTRAINT "HackContributor_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackTargetCharacter" ADD CONSTRAINT "HackTargetCharacter_hackId_fkey" FOREIGN KEY ("hackId") REFERENCES "Hack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackTargetCharacter" ADD CONSTRAINT "HackTargetCharacter_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackTargetOrganization" ADD CONSTRAINT "HackTargetOrganization_hackId_fkey" FOREIGN KEY ("hackId") REFERENCES "Hack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackTargetOrganization" ADD CONSTRAINT "HackTargetOrganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
