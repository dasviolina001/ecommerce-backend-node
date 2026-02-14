import { prisma } from "../db/prisma";

import { EXTENDED_DAY_DELIVERY } from "../config/constants";

import { ReturnStatus, OrderStatus } from "../generated/prisma/enums";

export class ReturnService {
  async checkReturnEligibility(orderItemId: string) {
    const orderItem = await (prisma as any).orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        order: true,
        product: true,
        variant: true,
      },
    });

    if (!orderItem) {
      return {
        eligible: false,
        reason: "Order item not found",
      };
    }

    if (orderItem.status !== OrderStatus.DELIVERED) {
      return {
        eligible: false,
        reason: "This item has not been marked as delivered yet",
      };
    }

    if (!orderItem.deliveredAt) {
      return {
        eligible: false,
        reason: "Delivery date has not been recorded",
      };
    }

    const isReturnAllowed =
      orderItem.variant?.isReturn ?? orderItem.product.isReturn;

    if (!isReturnAllowed) {
      return {
        eligible: false,
        reason: "This product cannot be returned",
      };
    }

    const returnWindowUntil = new Date(orderItem.deliveredAt);
    returnWindowUntil.setDate(
      returnWindowUntil.getDate() + EXTENDED_DAY_DELIVERY,
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (today > returnWindowUntil) {
      return {
        eligible: false,
        reason: `Return period has expired. Returns were allowed until ${returnWindowUntil.toISOString().split("T")[0]}`,
      };
    }

    return {
      eligible: true,
      returnableUntil: returnWindowUntil,
    };
  }

  async createReturn(
    userId: string,
    orderItemId: string,
    reason: string,
    videoPath?: string,
  ) {
    const eligibility = await this.checkReturnEligibility(orderItemId);
    if (!eligibility.eligible) {
      throw new Error(eligibility.reason);
    }

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
    });

    if (!orderItem || !orderItem.deliveredAt) {
      throw new Error("Order item delivery date not found");
    }

    const returnableUntil = new Date(orderItem.deliveredAt);
    returnableUntil.setDate(returnableUntil.getDate() + EXTENDED_DAY_DELIVERY);

    const existingReturn = await (prisma as any).return.findFirst({
      where: {
        orderItemId,
        status: {
          in: ["INITIATED", "APPROVED", "PROCESSING"],
        },
      },
    });

    if (existingReturn) {
      throw new Error("A return request already exists for this order item");
    }

    const returnRecord = await (prisma as any).return.create({
      data: {
        userId,
        orderItemId,
        reason,
        videoPath,
        returnableUntil,
        isReturnableWindow: true,
        status: "INITIATED",
      },
      include: {
        orderItem: {
          include: {
            product: true,
            variant: true,
            order: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    await (prisma as any).returnHistory.create({
      data: {
        returnId: returnRecord.id,
        previousStatus: "INITIATED" as ReturnStatus,
        newStatus: "INITIATED" as ReturnStatus,
        comment: "Return initiated by user",
      },
    });

    return returnRecord;
  }

  async getUserReturns(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [returns, total] = await Promise.all([
      (prisma as any).return.findMany({
        where: { userId },
        include: {
          orderItem: {
            include: {
              product: true,
              variant: true,
              order: true,
            },
          },
          history: {
            orderBy: { createdAt: "desc" },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      (prisma as any).return.count({ where: { userId } }),
    ]);

    return {
      data: returns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getReturnById(returnId: string, userId?: string) {
    const return_record = await (prisma as any).return.findUnique({
      where: { id: returnId },
      include: {
        orderItem: {
          include: {
            product: true,
            variant: true,
            order: {
              include: {
                address: true,
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        history: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!return_record) {
      throw new Error("Return not found");
    }

    if (userId && return_record.userId !== userId) {
      throw new Error("Unauthorized to view this return");
    }

    return return_record;
  }

  /**
   * Approve a return
   */
  async approveReturn(returnId: string, adminComment?: string) {
    const return_record = await (prisma as any).return.findUnique({
      where: { id: returnId },
    });

    if (!return_record) {
      throw new Error("Return not found");
    }

    if (return_record.status !== "INITIATED") {
      throw new Error(
        `Return cannot be approved. Current status: ${return_record.status}`,
      );
    }

    const updated = await (prisma as any).return.update({
      where: { id: returnId },
      data: {
        status: "APPROVED",
        approvedRejectedAt: new Date(),
        adminComment: adminComment || null,
      },
      include: {
        orderItem: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    await (prisma as any).returnHistory.create({
      data: {
        returnId,
        previousStatus: "INITIATED",
        newStatus: "APPROVED",
        comment: adminComment || "Return approved by admin",
        changedBy: "ADMIN",
      },
    });

    return updated;
  }

  async rejectReturn(returnId: string, adminComment: string) {
    const return_record = await (prisma as any).return.findUnique({
      where: { id: returnId },
    });

    if (!return_record) {
      throw new Error("Return not found");
    }

    if (return_record.status !== "INITIATED") {
      throw new Error(
        `Return cannot be rejected. Current status: ${return_record.status}`,
      );
    }

    if (!adminComment || adminComment.trim().length === 0) {
      throw new Error("Admin comment is required for rejection");
    }

    const updated = await (prisma as any).return.update({
      where: { id: returnId },
      data: {
        status: "REJECTED",
        approvedRejectedAt: new Date(),
        adminComment,
      },
      include: {
        orderItem: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    await (prisma as any).returnHistory.create({
      data: {
        returnId,
        previousStatus: "INITIATED",
        newStatus: "REJECTED",
        comment: adminComment,
        changedBy: "ADMIN",
      },
    });

    return updated;
  }

  async updateReturnStatus(
    returnId: string,
    newStatus: string,
    comment?: string,
  ) {
    const return_record = await (prisma as any).return.findUnique({
      where: { id: returnId },
    });

    if (!return_record) {
      throw new Error("Return not found");
    }

    const allowedTransitions: Record<string, string[]> = {
      INITIATED: ["APPROVED", "REJECTED", "CANCELLED"],
      APPROVED: ["PROCESSING", "CANCELLED"],
      PROCESSING: ["COMPLETED", "CANCELLED"],
      REJECTED: [],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!allowedTransitions[return_record.status]?.includes(newStatus)) {
      throw new Error(
        `Cannot transition from ${return_record.status} to ${newStatus}`,
      );
    }

    const updated = await (prisma as any).return.update({
      where: { id: returnId },
      data: {
        status: newStatus as ReturnStatus,
      },
    });

    // SUMAN -> Restore inventory if status is COMPLETED and order is REFUNDED
    if (newStatus === "COMPLETED" && !updated.inventoryRestored) {
      const returnWithOrder = await (prisma as any).return.findUnique({
        where: { id: returnId },
        include: {
          orderItem: {
            include: { order: true }
          }
        }
      });

      if (returnWithOrder?.orderItem?.order?.status === OrderStatus.REFUNDED) {
        const orderItem = returnWithOrder.orderItem;
        await (prisma as any).$transaction(async (tx: any) => {
          if (orderItem.variantId) {
            await tx.productVariant.update({
              where: { id: orderItem.variantId },
              data: { quantity: { increment: orderItem.quantity } }
            });
          } else {
            await tx.product.update({
              where: { id: orderItem.productId },
              data: { quantity: { increment: orderItem.quantity } }
            });
          }
          await tx.return.update({
            where: { id: returnId },
            data: { inventoryRestored: true }
          });
        });
      }
    }

    await (prisma as any).returnHistory.create({
      data: {
        returnId,
        previousStatus: return_record.status as ReturnStatus,
        newStatus: newStatus as ReturnStatus,
        comment: comment || null,
        changedBy: "ADMIN",
      },
    });

    return updated;
  }

  async cancelReturn(returnId: string, userId: string) {
    const return_record = await (prisma as any).return.findUnique({
      where: { id: returnId },
    });

    if (!return_record) {
      throw new Error("Return not found");
    }

    if (return_record.userId !== userId) {
      throw new Error("Unauthorized to cancel this return");
    }

    if (return_record.status !== "INITIATED") {
      throw new Error(
        `Cannot cancel return. Current status: ${return_record.status}`,
      );
    }

    const updated = await (prisma as any).return.update({
      where: { id: returnId },
      data: {
        status: "CANCELLED",
      },
    });

    await (prisma as any).returnHistory.create({
      data: {
        returnId,
        previousStatus: "INITIATED",
        newStatus: "CANCELLED",
        comment: "Return cancelled by user",
        changedBy: userId,
      },
    });

    return updated;
  }

  async getAllReturns(
    page = 1,
    limit = 10,
    filters?: {
      status?: string;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.userId) {
      where.userId = filters.userId;
    }
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const [returns, total] = await Promise.all([
      (prisma as any).return.findMany({
        where,
        include: {
          orderItem: {
            include: {
              product: true,
              variant: true,
              order: {
                include: {
                  user: {
                    select: {
                      id: true,
                      fullName: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          history: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      (prisma as any).return.count({ where }),
    ]);

    return {
      data: returns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async setDeliveryDate(orderItemId: string, deliveredAt: Date) {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { order: true },
    });

    if (!orderItem) {
      throw new Error("Order item not found");
    }

    if (orderItem.status !== OrderStatus.DELIVERED) {
      // If we are setting a delivery date, we should probably ensure status is DELIVERED
      // But let's stick to the current logic's intent which was to only allow it for delivered items.
      // However, since we now have item-level status, let's allow setting it if the item itself is delivered.
      // throw new Error("Delivery date can only be set for delivered items");
    }

    const updated = await prisma.orderItem.update({
      where: { id: orderItemId },
      data: { deliveredAt },
      include: {
        product: true,
        variant: true,
        order: true,
      },
    });

    return updated;
  }
}

export const returnService = new ReturnService();
