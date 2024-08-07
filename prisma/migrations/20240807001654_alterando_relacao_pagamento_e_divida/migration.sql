/*
  Warnings:

  - A unique constraint covering the columns `[walletExitId]` on the table `PaidPayments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[walletEntryId]` on the table `ReceivedPayments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaidPayments_walletExitId_key" ON "PaidPayments"("walletExitId");

-- CreateIndex
CREATE UNIQUE INDEX "ReceivedPayments_walletEntryId_key" ON "ReceivedPayments"("walletEntryId");
