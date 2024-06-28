/*
  Warnings:

  - The primary key for the `HackContribution` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `HackContribution` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[characterId,hackId]` on the table `HackContribution` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "HackContribution" DROP CONSTRAINT "HackContribution_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "HackContribution_characterId_hackId_key" ON "HackContribution"("characterId", "hackId");
