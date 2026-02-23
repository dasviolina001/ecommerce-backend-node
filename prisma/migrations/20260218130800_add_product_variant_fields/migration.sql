-- AlterTable
ALTER TABLE `productvariant` ADD COLUMN `isBestSelling` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `productvariant` ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `productvariant` ADD COLUMN `isNewCollection` BOOLEAN NOT NULL DEFAULT false;
