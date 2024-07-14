-- CreateTable
CREATE TABLE "Quotes" (
    "id" SERIAL NOT NULL,
    "quote" TEXT NOT NULL,
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "Quotes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quotes" ADD CONSTRAINT "Quotes_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
