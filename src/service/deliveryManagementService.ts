import { prisma } from "../db/prisma";

import { CustomError } from "../middleware/errorHandler";

export interface DeliveryManagementData {
    pincodeGroupId: string;
    deliveryCharge: number;
    estimatedDeliveryTime: string;
}

export const createOrUpdateDeliveryManagement = async (data: DeliveryManagementData) => {
    const pincodeGroup = await prisma.pincodeGroup.findUnique({
        where: { id: data.pincodeGroupId },
    });

    if (!pincodeGroup) {
        throw new CustomError("Pincode group not found", 404);
    }

    const deliveryManagement = await prisma.deliveryManagement.upsert({
        where: { pincodeGroupId: data.pincodeGroupId },
        update: {
            deliveryCharge: data.deliveryCharge,
            estimatedDeliveryTime: data.estimatedDeliveryTime,
        },
        create: {
            pincodeGroupId: data.pincodeGroupId,
            deliveryCharge: data.deliveryCharge,
            estimatedDeliveryTime: data.estimatedDeliveryTime,
        },
    });

    return deliveryManagement;
};

export const getDeliveryManagementByGroupId = async (pincodeGroupId: string) => {
    const deliveryManagement = await prisma.deliveryManagement.findUnique({
        where: { pincodeGroupId },
        include: {
            pincodeGroup: true,
        },
    });

    if (!deliveryManagement) {
        throw new CustomError("Delivery management settings not found for this pincode group", 404);
    }

    return deliveryManagement;
};

export const getAllDeliveryManagements = async (page?: number, limit?: number) => {
    const queryOptions: any = {
        include: {
            pincodeGroup: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    };

    if (page && limit) {
        queryOptions.skip = (page - 1) * limit;
        queryOptions.take = limit;
    }

    const [deliveryManagements, total] = await Promise.all([
        prisma.deliveryManagement.findMany(queryOptions),
        prisma.deliveryManagement.count(),
    ]);

    return {
        deliveryManagements,
        pagination: {
            total,
            page: page || 1,
            limit: limit || total,
            totalPages: limit ? Math.ceil(total / limit) : 1,
        },
    };
};

export const deleteDeliveryManagement = async (pincodeGroupId: string) => {
    const deliveryManagement = await prisma.deliveryManagement.findUnique({
        where: { pincodeGroupId },
    });

    if (!deliveryManagement) {
        throw new CustomError("Delivery management settings not found", 404);
    }

    await prisma.deliveryManagement.delete({
        where: { pincodeGroupId },
    });

    return { message: "Delivery management settings deleted successfully" };
};
