/*
  Warnings:

  - You are about to drop the column `value` on the `WalletEntry` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `WalletExit` table. All the data in the column will be lost.
  - Added the required column `amount` to the `WalletEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `WalletExit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WalletEntry" DROP COLUMN "value",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "WalletExit" DROP COLUMN "value",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;
