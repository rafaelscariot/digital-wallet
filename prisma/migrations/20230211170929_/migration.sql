/*
  Warnings:

  - The `withdrawal` column on the `WalletStatement` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deposit` column on the `WalletStatement` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `amount` on the `PaymentReversalHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amount` on the `Purchase` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amount` on the `Wallet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PaymentReversalHistory" DROP COLUMN "amount",
ADD COLUMN     "amount" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "amount",
ADD COLUMN     "amount" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "amount",
ADD COLUMN     "amount" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "WalletStatement" DROP COLUMN "withdrawal",
ADD COLUMN     "withdrawal" MONEY,
DROP COLUMN "deposit",
ADD COLUMN     "deposit" MONEY;
