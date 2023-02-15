/*
  Warnings:

  - You are about to drop the `PaymentReversalHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Purchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wallet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WalletStatement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PaymentReversalHistory" DROP CONSTRAINT "PaymentReversalHistory_purchaseId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentReversalHistory" DROP CONSTRAINT "PaymentReversalHistory_walletId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_walletId_fkey";

-- DropForeignKey
ALTER TABLE "WalletStatement" DROP CONSTRAINT "WalletStatement_walletId_fkey";

-- DropTable
DROP TABLE "PaymentReversalHistory";

-- DropTable
DROP TABLE "Purchase";

-- DropTable
DROP TABLE "Wallet";

-- DropTable
DROP TABLE "WalletStatement";

-- CreateTable
CREATE TABLE "wallet" (
    "id" SERIAL NOT NULL,
    "amount" MONEY NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_statement" (
    "id" SERIAL NOT NULL,
    "withdrawal" MONEY,
    "deposit" MONEY,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wallet_id" INTEGER NOT NULL,

    CONSTRAINT "wallet_statement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase" (
    "id" SERIAL NOT NULL,
    "amount" MONEY NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wallet_id" INTEGER NOT NULL,

    CONSTRAINT "purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_reversal_history" (
    "id" SERIAL NOT NULL,
    "amount" MONEY NOT NULL,
    "purchase_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wallet_id" INTEGER NOT NULL,

    CONSTRAINT "payment_reversal_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "wallet_statement" ADD CONSTRAINT "wallet_statement_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase" ADD CONSTRAINT "purchase_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_reversal_history" ADD CONSTRAINT "payment_reversal_history_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_reversal_history" ADD CONSTRAINT "payment_reversal_history_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
