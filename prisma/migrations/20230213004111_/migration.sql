/*
  Warnings:

  - You are about to drop the `PaymentReversalHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PaymentReversalHistory" DROP CONSTRAINT "PaymentReversalHistory_purchase_id_fkey";

-- DropForeignKey
ALTER TABLE "PaymentReversalHistory" DROP CONSTRAINT "PaymentReversalHistory_wallet_id_fkey";

-- AlterTable
ALTER TABLE "WalletStatement" ADD COLUMN     "reversal" MONEY;

-- DropTable
DROP TABLE "PaymentReversalHistory";
