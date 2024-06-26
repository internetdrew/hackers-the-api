/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Hack` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Hack_title_key" ON "Hack"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");
