import { createOrder } from "../service/orderService";
import { prisma } from "../db/prisma";

async function verify() {
    try {
        const user = await prisma.user.findFirst();
        const product = await prisma.product.findFirst();
        const address = await prisma.address.findFirst({
            where: { userId: user?.id }
        });

        if (!user || !product || !address) {
            console.error("❌ Need user, product, and address to verify.");
            return;
        }

        console.log("--- Test Case 1: With deliveryCharge ---");
        const orderData = {
            userId: user.id,
            addressId: address.id,
            items: [{
                productId: product.id,
                quantity: 1
            }],
            paymentMethod: "COD",
            deliveryCharge: 50
        };

        const order = await createOrder(orderData);
        console.log(`Order Created: ${order.orderNumber}`);
        console.log(`Total Amount: ${order.totalAmount}`);
        console.log(`Discount Amount: ${order.discountAmount}`);
        console.log(`Delivery Charge: ${order.deliveryCharge}`);
        console.log(`Final Amount: ${order.finalAmount}`);

        const expectedFinalAmount = order.totalAmount - order.discountAmount + order.deliveryCharge;
        if (order.finalAmount === expectedFinalAmount) {
            console.log("✅ Verification Successful: finalAmount is correctly calculated.");
        } else {
            console.error(`❌ Verification Failed: Expected finalAmount ${expectedFinalAmount}, but got ${order.finalAmount}`);
        }

        console.log("\n--- Test Case 2: Default deliveryCharge (0) ---");
        const orderDataNoCharge = {
            userId: user.id,
            addressId: address.id,
            items: [{
                productId: product.id,
                quantity: 1
            }],
            paymentMethod: "COD"
        };

        const order2 = await createOrder(orderDataNoCharge);
        console.log(`Order Created: ${order2.orderNumber}`);
        console.log(`Delivery Charge: ${order2.deliveryCharge}`);
        console.log(`Final Amount: ${order2.finalAmount}`);

        if (order2.deliveryCharge === 0) {
            console.log("✅ Verification Successful: deliveryCharge defaults to 0.");
        } else {
            console.error(`❌ Verification Failed: Expected deliveryCharge 0, but got ${order2.deliveryCharge}`);
        }

    } catch (error) {
        console.error("❌ Error during verification:", error);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
