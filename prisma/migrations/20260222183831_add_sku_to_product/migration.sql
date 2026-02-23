-- AlterTable
ALTER TABLE `product` ADD COLUMN `sku` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `product_sku_key` ON `product`(`sku`);

-- CreateIndex
CREATE INDEX `product_sku_idx` ON `product`(`sku`);
