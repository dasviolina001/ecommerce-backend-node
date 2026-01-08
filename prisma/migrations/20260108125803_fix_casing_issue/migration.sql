-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CouponProduct` ADD CONSTRAINT `CouponProduct_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
