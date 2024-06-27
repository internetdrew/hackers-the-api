/*
  Warnings:

  - You are about to drop the `HackContributor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HackTargetCharacter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HackTargetOrganization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HackContributor" DROP CONSTRAINT "HackContributor_characterId_fkey";

-- DropForeignKey
ALTER TABLE "HackContributor" DROP CONSTRAINT "HackContributor_hackId_fkey";

-- DropForeignKey
ALTER TABLE "HackTargetCharacter" DROP CONSTRAINT "HackTargetCharacter_characterId_fkey";

-- DropForeignKey
ALTER TABLE "HackTargetCharacter" DROP CONSTRAINT "HackTargetCharacter_hackId_fkey";

-- DropForeignKey
ALTER TABLE "HackTargetOrganization" DROP CONSTRAINT "HackTargetOrganization_hackId_fkey";

-- DropForeignKey
ALTER TABLE "HackTargetOrganization" DROP CONSTRAINT "HackTargetOrganization_organizationId_fkey";

-- AlterTable
ALTER TABLE "Hack" ADD COLUMN     "characterId" INTEGER,
ADD COLUMN     "organizationId" INTEGER;

-- DropTable
DROP TABLE "HackContributor";

-- DropTable
DROP TABLE "HackTargetCharacter";

-- DropTable
DROP TABLE "HackTargetOrganization";

-- CreateTable
CREATE TABLE "HackContribution" (
    "characterId" INTEGER NOT NULL,
    "hackId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HackContribution_characterId_hackId_key" ON "HackContribution"("characterId", "hackId");

-- AddForeignKey
ALTER TABLE "HackContribution" ADD CONSTRAINT "HackContribution_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackContribution" ADD CONSTRAINT "HackContribution_hackId_fkey" FOREIGN KEY ("hackId") REFERENCES "Hack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hack" ADD CONSTRAINT "Hack_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hack" ADD CONSTRAINT "Hack_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
