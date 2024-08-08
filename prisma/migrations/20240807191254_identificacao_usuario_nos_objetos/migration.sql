/*
  Warnings:

  - Added the required column `userId` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "userId" INTEGER NOT NULL;
