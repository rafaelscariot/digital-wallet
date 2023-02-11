/*
  Warnings:

  - You are about to drop the `payment_reversal_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wallet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wallet_statement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "payment_reversal_history" DROP CONSTRAINT "payment_reversal_history_purchase_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_reversal_history" DROP CONSTRAINT "payment_reversal_history_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "purchase" DROP CONSTRAINT "purchase_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "wallet_statement" DROP CONSTRAINT "wallet_statement_wallet_id_fkey";

-- DropTable
DROP TABLE "payment_reversal_history";

-- DropTable
DROP TABLE "purchase";

-- DropTable
DROP TABLE "wallet";

-- DropTable
DROP TABLE "wallet_statement";

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "amount" MONEY NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletStatement" (
    "id" SERIAL NOT NULL,
    "withdrawal" MONEY,
    "deposit" MONEY,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wallet_id" INTEGER NOT NULL,

    CONSTRAINT "WalletStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "amount" MONEY NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wallet_id" INTEGER NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentReversalHistory" (
    "id" SERIAL NOT NULL,
    "amount" MONEY NOT NULL,
    "purchase_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wallet_id" INTEGER NOT NULL,

    CONSTRAINT "PaymentReversalHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WalletStatement" ADD CONSTRAINT "WalletStatement_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentReversalHistory" ADD CONSTRAINT "PaymentReversalHistory_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentReversalHistory" ADD CONSTRAINT "PaymentReversalHistory_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
