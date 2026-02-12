import { prisma } from "../db/prisma";

import { CustomError } from "../middleware/errorHandler";

export interface CreatePincodeData {
  name: string;
  value: string;
  isActive?: boolean;
}

export interface UpdatePincodeData {
  name?: string;
  value?: string;
  isActive?: boolean;
}

export const createPincode = async (data: CreatePincodeData) => {
  // Check if pincode value already exists
  const existingPincode = await prisma.pincode.findUnique({
    where: { value: data.value },
  });

  if (existingPincode) {
    throw new CustomError("Pincode value already exists", 409);
  }

  const pincode = await prisma.pincode.create({
    data: {
      name: data.name.trim(),
      value: data.value.trim(),
      isActive: data.isActive ?? true,
    },
  });

  return pincode;
};

export const getAllPincodes = async (
  page?: number,
  limit?: number,
  includeInactive = false
) => {
  const where = includeInactive ? {} : { isActive: true };

  const queryOptions: any = {
    where,
    orderBy: {
      createdAt: "desc",
    },
  };

  if (page && limit) {
    queryOptions.skip = (page - 1) * limit;
    queryOptions.take = limit;
  }

  const [pincodes, total] = await Promise.all([
    prisma.pincode.findMany(queryOptions),
    prisma.pincode.count({ where }),
  ]);

  return {
    pincodes,
    pagination: {
      total,
      page: page || 1,
      limit: limit || total,
      totalPages: limit ? Math.ceil(total / limit) : 1,
    },
  };
};

export const getPincodeById = async (pincodeId: string, includeInactive = false) => {
  const where: any = { id: pincodeId };
  if (!includeInactive) {
    where.isActive = true;
  }

  const pincode = await prisma.pincode.findUnique({
    where,
    include: {
      groups: {
        include: {
          pincodeGroup: {
            select: {
              id: true,
              name: true,
              description: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!pincode) {
    throw new CustomError("Pincode not found", 404);
  }

  return pincode;
};

export const getPincodeByValue = async (value: string, includeInactive = false) => {
  const where: any = { value };
  if (!includeInactive) {
    where.isActive = true;
  }

  const pincode = await prisma.pincode.findUnique({
    where,
    include: {
      groups: {
        include: {
          pincodeGroup: {
            select: {
              id: true,
              name: true,
              description: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!pincode) {
    throw new CustomError("Pincode not found", 404);
  }

  return pincode;
};

export const updatePincode = async (
  pincodeId: string,
  data: UpdatePincodeData
) => {
  const pincode = await prisma.pincode.findUnique({
    where: { id: pincodeId },
  });

  if (!pincode) {
    throw new CustomError("Pincode not found", 404);
  }

  // Check if new value already exists (if value is being updated)
  if (data.value && data.value !== pincode.value) {
    const existingPincode = await prisma.pincode.findUnique({
      where: { value: data.value },
    });

    if (existingPincode) {
      throw new CustomError("Pincode value already exists", 409);
    }
  }

  const updatedPincode = await prisma.pincode.update({
    where: { id: pincodeId },
    data: {
      name: data.name?.trim(),
      value: data.value?.trim(),
      isActive: data.isActive,
    },
  });

  return updatedPincode;
};

export const softDeletePincode = async (pincodeId: string) => {
  const pincode = await prisma.pincode.findUnique({
    where: { id: pincodeId },
  });

  if (!pincode) {
    throw new CustomError("Pincode not found", 404);
  }

  const updatedPincode = await prisma.pincode.update({
    where: { id: pincodeId },
    data: { isActive: false },
  });

  return updatedPincode;
};

export const restorePincode = async (pincodeId: string) => {
  const pincode = await prisma.pincode.findUnique({
    where: { id: pincodeId },
  });

  if (!pincode) {
    throw new CustomError("Pincode not found", 404);
  }

  const updatedPincode = await prisma.pincode.update({
    where: { id: pincodeId },
    data: { isActive: true },
  });

  return updatedPincode;
};

export const deletePincode = async (pincodeId: string) => {
  const pincode = await prisma.pincode.findUnique({
    where: { id: pincodeId },
  });

  if (!pincode) {
    throw new CustomError("Pincode not found", 404);
  }

  await prisma.pincode.delete({
    where: { id: pincodeId },
  });

  return { message: "Pincode deleted successfully" };
};
