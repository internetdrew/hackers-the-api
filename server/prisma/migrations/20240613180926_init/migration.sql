-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('CHARACTER', 'ORGANIZATION');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "knownAliases" TEXT[],
    "imageUrl" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "skillLevel" "SkillLevel" NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hack" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetId" INTEGER NOT NULL,
    "targetType" "TargetType" NOT NULL,

    CONSTRAINT "Hack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerpetratorOnHack" (
    "hackId" INTEGER NOT NULL,
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "PerpetratorOnHack_pkey" PRIMARY KEY ("hackId","characterId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Hack" ADD CONSTRAINT "Hack_targetId_Character_fkey" FOREIGN KEY ("targetId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hack" ADD CONSTRAINT "Hack_targetId_Organization_fkey" FOREIGN KEY ("targetId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerpetratorOnHack" ADD CONSTRAINT "PerpetratorOnHack_hackId_fkey" FOREIGN KEY ("hackId") REFERENCES "Hack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerpetratorOnHack" ADD CONSTRAINT "PerpetratorOnHack_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
