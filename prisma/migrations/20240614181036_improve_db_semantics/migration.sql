/*
  Warnings:

  - You are about to drop the column `knownAliases` on the `Hack` table. All the data in the column will be lost.
  - You are about to drop the column `knownAliases` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `quote` on the `Quote` table. All the data in the column will be lost.
  - Added the required column `text` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hack" DROP COLUMN "knownAliases";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "knownAliases";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "quote",
ADD COLUMN     "text" TEXT NOT NULL;
