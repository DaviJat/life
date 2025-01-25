-- DropForeignKey
ALTER TABLE "BillToPay" DROP CONSTRAINT "BillToPay_personId_fkey";

-- AlterTable
ALTER TABLE "BillToPay" ADD COLUMN     "dueDate" TIMESTAMP(3),
ALTER COLUMN "value" DROP NOT NULL,
ALTER COLUMN "personId" DROP NOT NULL,
ALTER COLUMN "paymentType" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BillToPay" ADD CONSTRAINT "BillToPay_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
