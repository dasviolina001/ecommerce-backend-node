
import { prisma } from "../db/prisma";
import { OrderStatus, PaymentStatus } from "../generated/prisma/enums";

import { CustomError } from "../middleware/errorHandler";

export interface CreateOrderItemData {
  productId?: string;
  variantId?: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CreateOrderData {
  userId: string;
  addressId: string;
  items: CreateOrderItemData[];
  paymentMethod: string;
  paymentId?: string;
  couponId?: number;
}

export const createOrder = async (data: CreateOrderData) => {
  const { userId, addressId, items, paymentMethod, paymentId, couponId } = data;

  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new CustomError("Invalid address", 400);
  }

  let totalAmount = 0;

  const orderItemsData: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
    size: string | undefined;
    color: string | undefined;
  }[] = [];

  // 1. Validation and Stock Check Phase
  for (const item of items) {
    let finalProductId = item.productId;
    let finalSize = item.size;
    let finalColor = item.color;
    let price = 0;
    let availableQuantity = 0;

    if (item.variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId }
      });
      if (!variant) throw new CustomError(`Variant not found: ${item.variantId}`, 404);

      if (finalProductId && variant.productId !== finalProductId) {
        throw new CustomError("Variant mismatch", 400);
      }

      finalProductId = variant.productId;
      finalSize = variant.size || finalSize;
      finalColor = variant.color || finalColor;

      price = variant.sellingPrice || variant.maximumRetailPrice || 0;
      availableQuantity = variant.quantity;

      if (availableQuantity < item.quantity) {
        throw new CustomError(`Insufficient stock for variant: ${variant.sku}`, 400);
      }
    }

    if (!finalProductId) {
      throw new CustomError("Product ID is required if no variant is provided", 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: finalProductId },
    });

    if (!product) {
      throw new CustomError(`Product not found: ${finalProductId}`, 404);
    }

    if (!item.variantId) {
      if (product.hasVariants) {
        throw new CustomError(`Product ${product.productName} requires a variant selection`, 400);
      }
      price = product.sellingPrice || product.maximumRetailPrice || 0;
      availableQuantity = product.quantity;

      if (availableQuantity < item.quantity) {
        throw new CustomError(`Insufficient stock for product: ${product.productName}`, 400);
      }
    }

    totalAmount += price * item.quantity;

    orderItemsData.push({
      productId: finalProductId,
      variantId: item.variantId || undefined,
      quantity: item.quantity,
      price: price,
      size: finalSize,
      color: finalColor,
    });
  }


  let discountAmount = 0;
  if (couponId) {
    const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
    if (coupon && coupon.isActive) {



      if (coupon.type === "FIXED") {
        discountAmount = coupon.value;
      } else if (coupon.type === "PERCENTAGE") {
        discountAmount = (totalAmount * coupon.value) / 100;
      }
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    }
  }

  const finalAmount = Math.max(0, totalAmount - discountAmount);

  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const order = await prisma.$transaction(async (tx) => {

    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        addressId,
        totalAmount,
        discountAmount,
        finalAmount,
        paymentMethod,
        paymentId,
        paymentStatus: paymentId ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
        couponId,
        status: OrderStatus.PENDING,
        orderItems: {
          create: orderItemsData.map((item) => ({
            ...item,
            status: OrderStatus.PENDING,
            orderItemHistories: {
              create: {
                status: OrderStatus.PENDING,
                comment: "Order item created",
              },
            },
          })),
        },
        history: {
          create: {
            status: OrderStatus.PENDING,
            comment: "Order created",
          },
        },
      },
      include: {
        orderItems: true,
        history: true,
      },
    });


    for (const item of items) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { quantity: { decrement: item.quantity } }
        });
      } else {
        await tx.product.update({
          where: { id: item.productId || orderItemsData[items.indexOf(item)].productId },
          data: { quantity: { decrement: item.quantity } }
        });
      }
    }

    return newOrder;
  });

  return order;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  comment?: string,
  userId?: string
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new CustomError("Order not found", 404);
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        status,
      },
    });

    await tx.orderHistory.create({
      data: {
        orderId,
        status,
        comment,
        createdBy: userId,
      },
    });

    // SUMAN -> If order is being REFUNDED, look for COMPLETED returns to restore inventory
    if (status === OrderStatus.REFUNDED) {
      const orderItemsWithReturns = await tx.orderItem.findMany({
        where: { orderId },
        include: {
          returns: {
            where: {
              status: "COMPLETED",
              inventoryRestored: false,
            },
          },
        },
      });

      for (const item of orderItemsWithReturns) {
        for (const ret of item.returns) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { quantity: { increment: item.quantity } },
            });
          } else {
            await tx.product.update({
              where: { id: item.productId },
              data: { quantity: { increment: item.quantity } },
            });
          }

          await tx.return.update({
            where: { id: ret.id },
            data: { inventoryRestored: true },
          });
        }
      }
    }
  });

  return getOrderById(orderId);
};

export const updateOrderItemStatus = async (
  orderItemId: string,
  status: OrderStatus,
  comment?: string,
  userId?: string
) => {
  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: { order: true },
  });

  if (!orderItem) {
    throw new CustomError("Order item not found", 404);
  }

  await prisma.$transaction(async (tx) => {
    await tx.orderItem.update({
      where: { id: orderItemId },
      data: {
        status,
        deliveredAt: status === OrderStatus.DELIVERED ? new Date() : orderItem.deliveredAt,
      },
    });

    await (tx as any).orderItemHistory.create({
      data: {
        orderItemId,
        status,
        comment,
        createdBy: userId,
      },
    });

    // Check if all items in the order have the same status
    const allItems = await tx.orderItem.findMany({
      where: { orderId: orderItem.orderId },
    });

    const statuses = allItems.map((item) => item.status);
    const uniqueStatuses = [...new Set(statuses)];

    if (uniqueStatuses.length === 1 && uniqueStatuses[0] === status) {
      // If all items have the same status, update the main order status too
      await tx.order.update({
        where: { id: orderItem.orderId },
        data: { status },
      });

      await tx.orderHistory.create({
        data: {
          orderId: orderItem.orderId,
          status,
          comment: `Main order status automatically updated to ${status} as all items are now ${status}`,
          createdBy: "SYSTEM",
        },
      });
    } else if (status === OrderStatus.PROCESSING || status === OrderStatus.SHIPPED || status === OrderStatus.DELIVERED) {
      // If main order is still PENDING but an item moved forward, sync main order to PROCESSING or better
      // This is a simple heuristic. For now, let's keep it simple.
    }
  });

  return getOrderById(orderItem.orderId);
};

export const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          product: true,
          variant: true, // Include variant details
          orderItemHistories: {
            orderBy: { createdAt: 'desc' }
          }
        }
      },
      history: {
        orderBy: { createdAt: 'desc' }
      },
      address: true,
      user: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      }
    }
  });

  if (!order) {
    throw new CustomError("Order not found", 404);
  }

  return order;
}

export const getUserOrders = async (userId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const orders = await prisma.order.findMany({
    where: { userId },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        take: 1,
        include: { product: true, variant: true }
      },
      _count: {
        select: { orderItems: true }
      }
    }
  });

  const total = await prisma.order.count({ where: { userId } });

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export const getAllOrders = async (page?: number, limit?: number, status?: OrderStatus) => {
  const where = status ? { status } : {};

  const queryOptions: any = {
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          fullName: true,
          email: true
        }
      },
      address: true,
      _count: {
        select: { orderItems: true }
      }
    }
  };

  if (page && limit) {
    queryOptions.skip = (page - 1) * limit;
    queryOptions.take = limit;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany(queryOptions),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      total,
      page: page || 1,
      limit: limit || total,
      totalPages: limit ? Math.ceil(total / limit) : 1
    }
  };
}
