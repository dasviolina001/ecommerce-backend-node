-- AlterTable
ALTER TABLE `Product` ADD COLUMN `sizeChartId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `SizeChart` MODIFY `colors` JSON NULL;

-- CreateIndex
CREATE INDEX `Product_sizeChartId_idx` ON `Product`(`sizeChartId`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_sizeChartId_fkey` FOREIGN KEY (`sizeChartId`) REFERENCES `SizeChart`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
