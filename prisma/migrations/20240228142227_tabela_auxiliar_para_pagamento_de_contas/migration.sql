/*
  Warnings:

  - You are about to drop the column `billsToReceiveId` on the `WalletEntry` table. All the data in the column will be lost.
  - You are about to drop the column `billsToPayId` on the `WalletExit` table. All the data in the column will be lost.
  - Added the required column `paidPaymentsId` to the `BillsToPay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receivedPaymentsId` to the `BillsToReceive` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WalletEntry" DROP CONSTRAINT "WalletEntry_billsToReceiveId_fkey";

-- DropForeignKey
ALTER TABLE "WalletExit" DROP CONSTRAINT "WalletExit_billsToPayId_fkey";

-- AlterTable
ALTER TABLE "BillsToPay" ADD COLUMN     "paidPaymentsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "BillsToReceive" ADD COLUMN     "receivedPaymentsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WalletEntry" DROP COLUMN "billsToReceiveId";

-- AlterTable
ALTER TABLE "WalletExit" DROP COLUMN "billsToPayId";

-- CreateTable
CREATE TABLE "ReceivedPayments" (
    "id" SERIAL NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "amountReceived" DOUBLE PRECISION NOT NULL,
    "walletEntryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceivedPayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaidPayments" (
    "id" SERIAL NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "walletExitId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaidPayments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReceivedPayments" ADD CONSTRAINT "ReceivedPayments_walletEntryId_fkey" FOREIGN KEY ("walletEntryId") REFERENCES "WalletEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillsToReceive" ADD CONSTRAINT "BillsToReceive_receivedPaymentsId_fkey" FOREIGN KEY ("receivedPaymentsId") REFERENCES "ReceivedPayments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaidPayments" ADD CONSTRAINT "PaidPayments_walletExitId_fkey" FOREIGN KEY ("walletExitId") REFERENCES "WalletExit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillsToPay" ADD CONSTRAINT "BillsToPay_paidPaymentsId_fkey" FOREIGN KEY ("paidPaymentsId") REFERENCES "PaidPayments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
