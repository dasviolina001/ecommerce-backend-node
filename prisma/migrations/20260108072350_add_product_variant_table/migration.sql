/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId,variantId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[couponId,productId,variantId]` on the table `CouponProduct` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,productId,variantId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_userId_fkey`;

-- DropForeignKey
ALTER TABLE `CouponProduct` DROP FOREIGN KEY `CouponProduct_couponId_fkey`;

-- DropForeignKey
ALTER TABLE `Wishlist` DROP FOREIGN KEY `Wishlist_userId_fkey`;

-- DropIndex
DROP INDEX `Cart_userId_productId_key` ON `Cart`;

-- DropIndex
DROP INDEX `CouponProduct_couponId_productId_key` ON `CouponProduct`;

-- DropIndex
DROP INDEX `Wishlist_userId_productId_key` ON `Wishlist`;

-- AlterTable
ALTER TABLE `Cart` ADD COLUMN `variantId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Category` ADD COLUMN `isFeatured` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `CouponProduct` ADD COLUMN `variantId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `hasCashOnDelivery` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `hasVariants` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `quantity` INTEGER NOT NULL DEFAULT 0,
    MODIFY `paymentType` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Wishlist` ADD COLUMN `variantId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ProductVariant` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `variantName` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `size` VARCHAR(191) NULL,
    `dimensions` JSON NULL,
    `attributes` JSON NULL,
    `variantImages` LONGTEXT NULL,
    `variantDescription` VARCHAR(191) NULL,
    `buyingPrice` DOUBLE NULL,
    `maximumRetailPrice` DOUBLE NULL,
    `sellingPrice` DOUBLE NULL,
    `quantity` INTEGER NOT NULL,
    `lowStockAlert` INTEGER NULL DEFAULT 5,
    `expiryDate` DATETIME(3) NULL,
    `hasCashOnDelivery` BOOLEAN NOT NULL DEFAULT true,
    `sizeChartId` VARCHAR(191) NULL,
    `isRelatedItem` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ProductVariant_sku_key`(`sku`),
    INDEX `ProductVariant_productId_idx`(`productId`),
    INDEX `ProductVariant_sku_idx`(`sku`),
    INDEX `ProductVariant_sizeChartId_idx`(`sizeChartId`),
    INDEX `ProductVariant_isActive_idx`(`isActive`),
    INDEX `ProductVariant_color_idx`(`color`),
    INDEX `ProductVariant_size_idx`(`size`),
    UNIQUE INDEX `ProductVariant_productId_color_size_key`(`productId`, `color`, `size`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `orderNumber` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `addressId` VARCHAR(191) NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `discountAmount` DOUBLE NOT NULL DEFAULT 0,
    `finalAmount` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `paymentStatus` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `paymentMethod` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NULL,
    `couponId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_orderNumber_key`(`orderNumber`),
    INDEX `Order_userId_idx`(`userId`),
    INDEX `Order_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `variantId` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `size` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderHistory` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Cart_variantId_idx` ON `Cart`(`variantId`);

-- CreateIndex
CREATE UNIQUE INDEX `Cart_userId_productId_variantId_key` ON `Cart`(`userId`, `productId`, `variantId`);

-- CreateIndex
CREATE INDEX `CouponProduct_variantId_idx` ON `CouponProduct`(`variantId`);

-- CreateIndex
CREATE UNIQUE INDEX `CouponProduct_couponId_productId_variantId_key` ON `CouponProduct`(`couponId`, `productId`, `variantId`);

-- CreateIndex
CREATE INDEX `Wishlist_variantId_idx` ON `Wishlist`(`variantId`);

-- CreateIndex
CREATE UNIQUE INDEX `Wishlist_userId_productId_variantId_key` ON `Wishlist`(`userId`, `productId`, `variantId`);



-- AddForeignKey
ALTER TABLE `ProductVariant` ADD CONSTRAINT `ProductVariant_sizeChartId_fkey` FOREIGN KEY (`sizeChartId`) REFERENCES `SizeChart`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductVariant` ADD CONSTRAINT `ProductVariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `ProductVariant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `ProductVariant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;



-- AddForeignKey
ALTER TABLE `CouponProduct` ADD CONSTRAINT `CouponProduct_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `ProductVariant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `ProductVariant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderHistory` ADD CONSTRAINT `OrderHistory_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
