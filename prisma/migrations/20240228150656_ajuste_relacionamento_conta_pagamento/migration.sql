/*
  Warnings:

  - You are about to drop the column `paidPaymentsId` on the `BillsToPay` table. All the data in the column will be lost.
  - You are about to drop the column `receivedPaymentsId` on the `BillsToReceive` table. All the data in the column will be lost.
  - Added the required column `billsToPayId` to the `PaidPayments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billsToReceiveId` to the `ReceivedPayments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BillsToPay" DROP CONSTRAINT "BillsToPay_paidPaymentsId_fkey";

-- DropForeignKey
ALTER TABLE "BillsToReceive" DROP CONSTRAINT "BillsToReceive_receivedPaymentsId_fkey";

-- AlterTable
ALTER TABLE "BillsToPay" DROP COLUMN "paidPaymentsId";

-- AlterTable
ALTER TABLE "BillsToReceive" DROP COLUMN "receivedPaymentsId";

-- AlterTable
ALTER TABLE "PaidPayments" ADD COLUMN     "billsToPayId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ReceivedPayments" ADD COLUMN     "billsToReceiveId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ReceivedPayments" ADD CONSTRAINT "ReceivedPayments_billsToReceiveId_fkey" FOREIGN KEY ("billsToReceiveId") REFERENCES "BillsToReceive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaidPayments" ADD CONSTRAINT "PaidPayments_billsToPayId_fkey" FOREIGN KEY ("billsToPayId") REFERENCES "BillsToPay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
