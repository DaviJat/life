/*
  Warnings:

  - You are about to drop the column `moneyLocationId` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the `MoneyLocation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('Physical', 'Virtual');

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_moneyLocationId_fkey";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "moneyLocationId",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "type" "WalletType" NOT NULL;

-- DropTable
DROP TABLE "MoneyLocation";

-- DropEnum
DROP TYPE "MoneyLocationType";
