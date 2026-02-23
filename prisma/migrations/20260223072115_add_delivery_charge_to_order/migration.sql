/*
  Warnings:

  - You are about to drop the column `sku` on the `product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `product_sku_idx` ON `product`;

-- DropIndex
DROP INDEX `product_sku_key` ON `product`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `deliveryCharge` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `sku`;
