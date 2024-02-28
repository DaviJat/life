/*
  Warnings:

  - You are about to drop the column `walletExitId` on the `BillsToPay` table. All the data in the column will be lost.
  - You are about to drop the column `walletEntryId` on the `BillsToReceive` table. All the data in the column will be lost.
  - Added the required column `billsToReceiveId` to the `WalletEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billsToPayId` to the `WalletExit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BillsToPay" DROP CONSTRAINT "BillsToPay_walletExitId_fkey";

-- DropForeignKey
ALTER TABLE "BillsToReceive" DROP CONSTRAINT "BillsToReceive_walletEntryId_fkey";

-- AlterTable
ALTER TABLE "BillsToPay" DROP COLUMN "walletExitId";

-- AlterTable
ALTER TABLE "BillsToReceive" DROP COLUMN "walletEntryId";

-- AlterTable
ALTER TABLE "WalletEntry" ADD COLUMN     "billsToReceiveId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WalletExit" ADD COLUMN     "billsToPayId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "WalletEntry" ADD CONSTRAINT "WalletEntry_billsToReceiveId_fkey" FOREIGN KEY ("billsToReceiveId") REFERENCES "BillsToReceive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletExit" ADD CONSTRAINT "WalletExit_billsToPayId_fkey" FOREIGN KEY ("billsToPayId") REFERENCES "BillsToPay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
