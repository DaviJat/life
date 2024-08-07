/*
  Warnings:

  - You are about to drop the column `billsToPayId` on the `PaidPayments` table. All the data in the column will be lost.
  - You are about to drop the column `billsToReceiveId` on the `ReceivedPayments` table. All the data in the column will be lost.
  - You are about to drop the `BillsToPay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BillsToReceive` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `billToPayId` to the `PaidPayments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billToReceiveId` to the `ReceivedPayments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BillsToPay" DROP CONSTRAINT "BillsToPay_personId_fkey";

-- DropForeignKey
ALTER TABLE "BillsToReceive" DROP CONSTRAINT "BillsToReceive_personId_fkey";

-- DropForeignKey
ALTER TABLE "PaidPayments" DROP CONSTRAINT "PaidPayments_billsToPayId_fkey";

-- DropForeignKey
ALTER TABLE "ReceivedPayments" DROP CONSTRAINT "ReceivedPayments_billsToReceiveId_fkey";

-- AlterTable
ALTER TABLE "PaidPayments" DROP COLUMN "billsToPayId",
ADD COLUMN     "billToPayId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ReceivedPayments" DROP COLUMN "billsToReceiveId",
ADD COLUMN     "billToReceiveId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "BillsToPay";

-- DropTable
DROP TABLE "BillsToReceive";

-- CreateTable
CREATE TABLE "BillToReceive" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "personId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillToReceive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillToPay" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "personId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillToPay_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReceivedPayments" ADD CONSTRAINT "ReceivedPayments_billToReceiveId_fkey" FOREIGN KEY ("billToReceiveId") REFERENCES "BillToReceive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillToReceive" ADD CONSTRAINT "BillToReceive_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaidPayments" ADD CONSTRAINT "PaidPayments_billToPayId_fkey" FOREIGN KEY ("billToPayId") REFERENCES "BillToPay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillToPay" ADD CONSTRAINT "BillToPay_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
