/*
  Warnings:

  - You are about to drop the column `paid` on the `BillsToPay` table. All the data in the column will be lost.
  - You are about to drop the column `paid` on the `BillsToReceive` table. All the data in the column will be lost.
  - You are about to drop the column `moneyLocationId` on the `WalletEntry` table. All the data in the column will be lost.
  - You are about to drop the column `moneyLocationId` on the `WalletExit` table. All the data in the column will be lost.
  - Added the required column `walletExitId` to the `BillsToPay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletEntryId` to the `BillsToReceive` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletId` to the `WalletEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletId` to the `WalletExit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WalletEntry" DROP CONSTRAINT "WalletEntry_moneyLocationId_fkey";

-- DropForeignKey
ALTER TABLE "WalletExit" DROP CONSTRAINT "WalletExit_moneyLocationId_fkey";

-- AlterTable
ALTER TABLE "BillsToPay" DROP COLUMN "paid",
ADD COLUMN     "walletExitId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "BillsToReceive" DROP COLUMN "paid",
ADD COLUMN     "walletEntryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WalletEntry" DROP COLUMN "moneyLocationId",
ADD COLUMN     "walletId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WalletExit" DROP COLUMN "moneyLocationId",
ADD COLUMN     "walletId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "WalletEntry" ADD CONSTRAINT "WalletEntry_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletExit" ADD CONSTRAINT "WalletExit_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillsToPay" ADD CONSTRAINT "BillsToPay_walletExitId_fkey" FOREIGN KEY ("walletExitId") REFERENCES "WalletExit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillsToReceive" ADD CONSTRAINT "BillsToReceive_walletEntryId_fkey" FOREIGN KEY ("walletEntryId") REFERENCES "WalletEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
