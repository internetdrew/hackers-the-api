/*
  Warnings:

  - You are about to drop the column `targetId` on the `Hack` table. All the data in the column will be lost.
  - You are about to drop the column `targetType` on the `Hack` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hack" DROP CONSTRAINT "Hack_targetId_Character_fkey";

-- DropForeignKey
ALTER TABLE "Hack" DROP CONSTRAINT "Hack_targetId_Organization_fkey";

-- AlterTable
ALTER TABLE "Hack" DROP COLUMN "targetId",
DROP COLUMN "targetType",
ADD COLUMN     "targetedCharacterId" INTEGER,
ADD COLUMN     "targetedOrganizationId" INTEGER;

-- AddForeignKey
ALTER TABLE "Hack" ADD CONSTRAINT "Hack_targetedCharacterId_fkey" FOREIGN KEY ("targetedCharacterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hack" ADD CONSTRAINT "Hack_targetedOrganizationId_fkey" FOREIGN KEY ("targetedOrganizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
