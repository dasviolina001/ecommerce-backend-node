-- AlterTable
ALTER TABLE `Cart` ADD COLUMN `couponCode` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `type` ENUM('FIXED', 'PERCENTAGE') NOT NULL,
    `value` DOUBLE NOT NULL,
    `minOrderValue` DOUBLE NULL,
    `maxDiscount` DOUBLE NULL,
    `isStackable` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `startsAt` DATETIME(3) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Coupon_code_key`(`code`),
    INDEX `Coupon_code_idx`(`code`),
    INDEX `Coupon_isActive_idx`(`isActive`),
    INDEX `Coupon_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CouponUser` (
    `id` VARCHAR(191) NOT NULL,
    `couponId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CouponUser_userId_idx`(`userId`),
    INDEX `CouponUser_couponId_idx`(`couponId`),
    UNIQUE INDEX `CouponUser_couponId_userId_key`(`couponId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CouponProduct` (
    `id` VARCHAR(191) NOT NULL,
    `couponId` INTEGER NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CouponProduct_productId_idx`(`productId`),
    INDEX `CouponProduct_couponId_idx`(`couponId`),
    UNIQUE INDEX `CouponProduct_couponId_productId_key`(`couponId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CouponCategory` (
    `id` VARCHAR(191) NOT NULL,
    `couponId` INTEGER NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CouponCategory_categoryId_idx`(`categoryId`),
    INDEX `CouponCategory_couponId_idx`(`couponId`),
    UNIQUE INDEX `CouponCategory_couponId_categoryId_key`(`couponId`, `categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CouponUser` ADD CONSTRAINT `CouponUser_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CouponUser` ADD CONSTRAINT `CouponUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CouponProduct` ADD CONSTRAINT `CouponProduct_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CouponProduct` ADD CONSTRAINT `CouponProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CouponCategory` ADD CONSTRAINT `CouponCategory_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CouponCategory` ADD CONSTRAINT `CouponCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
