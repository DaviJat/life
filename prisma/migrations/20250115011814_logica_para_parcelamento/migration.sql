/*
  Warnings:

  - You are about to drop the `PaidPayments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `paymentType` to the `BillToPay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exitDate` to the `WalletExit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('Cash', 'Installment');

-- DropForeignKey
ALTER TABLE "PaidPayments" DROP CONSTRAINT "PaidPayments_billToPayId_fkey";

-- DropForeignKey
ALTER TABLE "PaidPayments" DROP CONSTRAINT "PaidPayments_userId_fkey";

-- DropForeignKey
ALTER TABLE "PaidPayments" DROP CONSTRAINT "PaidPayments_walletExitId_fkey";

-- AlterTable
ALTER TABLE "BillToPay" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentType" "PaymentType" NOT NULL;

-- AlterTable
ALTER TABLE "WalletExit" ADD COLUMN     "billToPayId" INTEGER,
ADD COLUMN     "exitDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "installmentId" INTEGER;

-- DropTable
DROP TABLE "PaidPayments";

-- CreateTable
CREATE TABLE "Installment" (
    "id" SERIAL NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "billToPayId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Installment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WalletExit" ADD CONSTRAINT "WalletExit_billToPayId_fkey" FOREIGN KEY ("billToPayId") REFERENCES "BillToPay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletExit" ADD CONSTRAINT "WalletExit_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "Installment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_billToPayId_fkey" FOREIGN KEY ("billToPayId") REFERENCES "BillToPay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
