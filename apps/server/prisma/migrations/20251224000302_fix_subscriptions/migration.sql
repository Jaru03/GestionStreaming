/*
  Warnings:

  - You are about to drop the `Screen` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `screenName` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Screen" DROP CONSTRAINT "Screen_accountId_fkey";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "screenName" TEXT NOT NULL,
ADD COLUMN     "screenPin" TEXT;

-- DropTable
DROP TABLE "Screen";
