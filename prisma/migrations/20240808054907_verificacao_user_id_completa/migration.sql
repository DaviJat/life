/*
  Warnings:

  - Added the required column `userId` to the `BillToPay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `BillToReceive` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PaidPayments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ReceivedPayments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `WalletEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `WalletExit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillToPay" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "BillToReceive" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PaidPayments" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ReceivedPayments" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WalletEntry" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WalletExit" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletEntry" ADD CONSTRAINT "WalletEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivedPayments" ADD CONSTRAINT "ReceivedPayments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillToReceive" ADD CONSTRAINT "BillToReceive_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletExit" ADD CONSTRAINT "WalletExit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaidPayments" ADD CONSTRAINT "PaidPayments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillToPay" ADD CONSTRAINT "BillToPay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
