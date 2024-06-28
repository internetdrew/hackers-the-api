/*
  Warnings:

  - You are about to drop the column `characterId` on the `Hack` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Hack` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hack" DROP CONSTRAINT "Hack_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Hack" DROP CONSTRAINT "Hack_organizationId_fkey";

-- DropIndex
DROP INDEX "HackContribution_characterId_hackId_key";

-- AlterTable
ALTER TABLE "Hack" DROP COLUMN "characterId",
DROP COLUMN "organizationId",
ADD COLUMN     "targetCharacterId" INTEGER,
ADD COLUMN     "targetOrganizationId" INTEGER;

-- AlterTable
ALTER TABLE "HackContribution" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "HackContribution_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Hack" ADD CONSTRAINT "Hack_targetCharacterId_fkey" FOREIGN KEY ("targetCharacterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hack" ADD CONSTRAINT "Hack_targetOrganizationId_fkey" FOREIGN KEY ("targetOrganizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
