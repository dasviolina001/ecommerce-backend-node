-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_userId_fkey`;

-- DropForeignKey
ALTER TABLE `bankdetails` DROP FOREIGN KEY `BankDetails_userId_fkey`;

-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_productId_fkey`;

-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_userId_fkey`;

-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `couponcategory` DROP FOREIGN KEY `CouponCategory_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `couponcategory` DROP FOREIGN KEY `CouponCategory_couponId_fkey`;

-- DropForeignKey
ALTER TABLE `couponproduct` DROP FOREIGN KEY `CouponProduct_couponId_fkey`;

-- DropForeignKey
ALTER TABLE `couponproduct` DROP FOREIGN KEY `CouponProduct_productId_fkey`;

-- DropForeignKey
ALTER TABLE `couponproduct` DROP FOREIGN KEY `CouponProduct_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `couponuser` DROP FOREIGN KEY `CouponUser_couponId_fkey`;

-- DropForeignKey
ALTER TABLE `couponuser` DROP FOREIGN KEY `CouponUser_userId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_addressId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_couponId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropForeignKey
ALTER TABLE `orderhistory` DROP FOREIGN KEY `OrderHistory_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `pincodegrouppincode` DROP FOREIGN KEY `PincodeGroupPincode_pincodeGroupId_fkey`;

-- DropForeignKey
ALTER TABLE `pincodegrouppincode` DROP FOREIGN KEY `PincodeGroupPincode_pincodeId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_lastCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_masterCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_sizeChartId_fkey`;

-- DropForeignKey
ALTER TABLE `productvariant` DROP FOREIGN KEY `ProductVariant_productId_fkey`;

-- DropForeignKey
ALTER TABLE `productvariant` DROP FOREIGN KEY `ProductVariant_sizeChartId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlist` DROP FOREIGN KEY `Wishlist_productId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlist` DROP FOREIGN KEY `Wishlist_userId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlist` DROP FOREIGN KEY `Wishlist_variantId_fkey`;

-- CreateTable
CREATE TABLE `deliverymanagement` (
    `id` VARCHAR(191) NOT NULL,
    `pincodeGroupId` VARCHAR(191) NOT NULL,
    `deliveryCharge` DOUBLE NOT NULL,
    `estimatedDeliveryTime` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `deliverymanagement_pincodeGroupId_key`(`pincodeGroupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bankdetails` ADD CONSTRAINT `bankdetails_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_masterCategoryId_fkey` FOREIGN KEY (`masterCategoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_lastCategoryId_fkey` FOREIGN KEY (`lastCategoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_sizeChartId_fkey` FOREIGN KEY (`sizeChartId`) REFERENCES `sizechart`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productvariant` ADD CONSTRAINT `productvariant_sizeChartId_fkey` FOREIGN KEY (`sizeChartId`) REFERENCES `sizechart`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productvariant` ADD CONSTRAINT `productvariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couponuser` ADD CONSTRAINT `couponuser_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couponuser` ADD CONSTRAINT `couponuser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couponproduct` ADD CONSTRAINT `couponproduct_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couponproduct` ADD CONSTRAINT `couponproduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couponproduct` ADD CONSTRAINT `couponproduct_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couponcategory` ADD CONSTRAINT `couponcategory_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couponcategory` ADD CONSTRAINT `couponcategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderitem` ADD CONSTRAINT `orderitem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderitem` ADD CONSTRAINT `orderitem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderitem` ADD CONSTRAINT `orderitem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderhistory` ADD CONSTRAINT `orderhistory_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pincodegrouppincode` ADD CONSTRAINT `pincodegrouppincode_pincodeGroupId_fkey` FOREIGN KEY (`pincodeGroupId`) REFERENCES `pincodegroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pincodegrouppincode` ADD CONSTRAINT `pincodegrouppincode_pincodeId_fkey` FOREIGN KEY (`pincodeId`) REFERENCES `pincode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deliverymanagement` ADD CONSTRAINT `deliverymanagement_pincodeGroupId_fkey` FOREIGN KEY (`pincodeGroupId`) REFERENCES `pincodegroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `aboutpagecontent` RENAME INDEX `AboutPageContent_title_idx` TO `aboutpagecontent_title_idx`;

-- RenameIndex
ALTER TABLE `address` RENAME INDEX `Address_userId_idx` TO `address_userId_idx`;

-- RenameIndex
ALTER TABLE `bankdetails` RENAME INDEX `BankDetails_userId_key` TO `bankdetails_userId_key`;

-- RenameIndex
ALTER TABLE `cart` RENAME INDEX `Cart_productId_idx` TO `cart_productId_idx`;

-- RenameIndex
ALTER TABLE `cart` RENAME INDEX `Cart_userId_idx` TO `cart_userId_idx`;

-- RenameIndex
ALTER TABLE `cart` RENAME INDEX `Cart_userId_productId_variantId_key` TO `cart_userId_productId_variantId_key`;

-- RenameIndex
ALTER TABLE `cart` RENAME INDEX `Cart_variantId_idx` TO `cart_variantId_idx`;

-- RenameIndex
ALTER TABLE `category` RENAME INDEX `Category_isActive_idx` TO `category_isActive_idx`;

-- RenameIndex
ALTER TABLE `category` RENAME INDEX `Category_parentId_idx` TO `category_parentId_idx`;

-- RenameIndex
ALTER TABLE `category` RENAME INDEX `Category_slug_idx` TO `category_slug_idx`;

-- RenameIndex
ALTER TABLE `category` RENAME INDEX `Category_slug_key` TO `category_slug_key`;

-- RenameIndex
ALTER TABLE `contactpageinformation` RENAME INDEX `ContactPageInformation_label_idx` TO `contactpageinformation_label_idx`;

-- RenameIndex
ALTER TABLE `contactpageinformation` RENAME INDEX `ContactPageInformation_type_idx` TO `contactpageinformation_type_idx`;

-- RenameIndex
ALTER TABLE `coupon` RENAME INDEX `Coupon_code_idx` TO `coupon_code_idx`;

-- RenameIndex
ALTER TABLE `coupon` RENAME INDEX `Coupon_code_key` TO `coupon_code_key`;

-- RenameIndex
ALTER TABLE `coupon` RENAME INDEX `Coupon_expiresAt_idx` TO `coupon_expiresAt_idx`;

-- RenameIndex
ALTER TABLE `coupon` RENAME INDEX `Coupon_isActive_idx` TO `coupon_isActive_idx`;

-- RenameIndex
ALTER TABLE `couponcategory` RENAME INDEX `CouponCategory_categoryId_idx` TO `couponcategory_categoryId_idx`;

-- RenameIndex
ALTER TABLE `couponcategory` RENAME INDEX `CouponCategory_couponId_categoryId_key` TO `couponcategory_couponId_categoryId_key`;

-- RenameIndex
ALTER TABLE `couponcategory` RENAME INDEX `CouponCategory_couponId_idx` TO `couponcategory_couponId_idx`;

-- RenameIndex
ALTER TABLE `couponproduct` RENAME INDEX `CouponProduct_couponId_idx` TO `couponproduct_couponId_idx`;

-- RenameIndex
ALTER TABLE `couponproduct` RENAME INDEX `CouponProduct_couponId_productId_variantId_key` TO `couponproduct_couponId_productId_variantId_key`;

-- RenameIndex
ALTER TABLE `couponproduct` RENAME INDEX `CouponProduct_productId_idx` TO `couponproduct_productId_idx`;

-- RenameIndex
ALTER TABLE `couponproduct` RENAME INDEX `CouponProduct_variantId_idx` TO `couponproduct_variantId_idx`;

-- RenameIndex
ALTER TABLE `couponuser` RENAME INDEX `CouponUser_couponId_idx` TO `couponuser_couponId_idx`;

-- RenameIndex
ALTER TABLE `couponuser` RENAME INDEX `CouponUser_couponId_userId_key` TO `couponuser_couponId_userId_key`;

-- RenameIndex
ALTER TABLE `couponuser` RENAME INDEX `CouponUser_userId_idx` TO `couponuser_userId_idx`;

-- RenameIndex
ALTER TABLE `order` RENAME INDEX `Order_orderNumber_key` TO `order_orderNumber_key`;

-- RenameIndex
ALTER TABLE `order` RENAME INDEX `Order_status_idx` TO `order_status_idx`;

-- RenameIndex
ALTER TABLE `order` RENAME INDEX `Order_userId_idx` TO `order_userId_idx`;

-- RenameIndex
ALTER TABLE `pincode` RENAME INDEX `Pincode_isActive_idx` TO `pincode_isActive_idx`;

-- RenameIndex
ALTER TABLE `pincode` RENAME INDEX `Pincode_name_idx` TO `pincode_name_idx`;

-- RenameIndex
ALTER TABLE `pincode` RENAME INDEX `Pincode_value_idx` TO `pincode_value_idx`;

-- RenameIndex
ALTER TABLE `pincode` RENAME INDEX `Pincode_value_key` TO `pincode_value_key`;

-- RenameIndex
ALTER TABLE `pincodegroup` RENAME INDEX `PincodeGroup_isActive_idx` TO `pincodegroup_isActive_idx`;

-- RenameIndex
ALTER TABLE `pincodegroup` RENAME INDEX `PincodeGroup_name_idx` TO `pincodegroup_name_idx`;

-- RenameIndex
ALTER TABLE `pincodegrouppincode` RENAME INDEX `PincodeGroupPincode_pincodeGroupId_idx` TO `pincodegrouppincode_pincodeGroupId_idx`;

-- RenameIndex
ALTER TABLE `pincodegrouppincode` RENAME INDEX `PincodeGroupPincode_pincodeGroupId_pincodeId_key` TO `pincodegrouppincode_pincodeGroupId_pincodeId_key`;

-- RenameIndex
ALTER TABLE `pincodegrouppincode` RENAME INDEX `PincodeGroupPincode_pincodeId_idx` TO `pincodegrouppincode_pincodeId_idx`;

-- RenameIndex
ALTER TABLE `policypagecontent` RENAME INDEX `PolicyPageContent_title_idx` TO `policypagecontent_title_idx`;

-- RenameIndex
ALTER TABLE `product` RENAME INDEX `Product_isActive_idx` TO `product_isActive_idx`;

-- RenameIndex
ALTER TABLE `product` RENAME INDEX `Product_isBestSelling_idx` TO `product_isBestSelling_idx`;

-- RenameIndex
ALTER TABLE `product` RENAME INDEX `Product_isFeatured_idx` TO `product_isFeatured_idx`;

-- RenameIndex
ALTER TABLE `product` RENAME INDEX `Product_lastCategoryId_idx` TO `product_lastCategoryId_idx`;

-- RenameIndex
ALTER TABLE `product` RENAME INDEX `Product_masterCategoryId_idx` TO `product_masterCategoryId_idx`;

-- RenameIndex
ALTER TABLE `product` RENAME INDEX `Product_productName_idx` TO `product_productName_idx`;

-- RenameIndex
ALTER TABLE `productvariant` RENAME INDEX `ProductVariant_color_idx` TO `productvariant_color_idx`;

-- RenameIndex
ALTER TABLE `productvariant` RENAME INDEX `ProductVariant_isActive_idx` TO `productvariant_isActive_idx`;

-- RenameIndex
ALTER TABLE `productvariant` RENAME INDEX `ProductVariant_productId_color_size_key` TO `productvariant_productId_color_size_key`;

-- RenameIndex
ALTER TABLE `productvariant` RENAME INDEX `ProductVariant_productId_idx` TO `productvariant_productId_idx`;

-- RenameIndex
ALTER TABLE `productvariant` RENAME INDEX `ProductVariant_sizeChartId_idx` TO `productvariant_sizeChartId_idx`;

-- RenameIndex
ALTER TABLE `productvariant` RENAME INDEX `ProductVariant_size_idx` TO `productvariant_size_idx`;

-- RenameIndex
ALTER TABLE `productvariant` RENAME INDEX `ProductVariant_sku_idx` TO `productvariant_sku_idx`;

-- RenameIndex
ALTER TABLE `productvariant` RENAME INDEX `ProductVariant_sku_key` TO `productvariant_sku_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_email_key` TO `user_email_key`;

-- RenameIndex
ALTER TABLE `wishlist` RENAME INDEX `Wishlist_productId_idx` TO `wishlist_productId_idx`;

-- RenameIndex
ALTER TABLE `wishlist` RENAME INDEX `Wishlist_userId_idx` TO `wishlist_userId_idx`;

-- RenameIndex
ALTER TABLE `wishlist` RENAME INDEX `Wishlist_userId_productId_variantId_key` TO `wishlist_userId_productId_variantId_key`;

-- RenameIndex
ALTER TABLE `wishlist` RENAME INDEX `Wishlist_variantId_idx` TO `wishlist_variantId_idx`;
