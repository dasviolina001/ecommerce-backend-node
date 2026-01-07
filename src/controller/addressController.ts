import { Request, Response } from "express";

import { AuthRequest } from "../middleware/auth";

import { prisma } from "../db/prisma";

import { CustomError } from "../middleware/errorHandler";

export const createAddress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError("User not authenticated", 401);
    }

    const {
      mainAddress,
      secondaryAddress,
      landmark,
      pincode,
      state,
      city,
      district,
    } = req.body;

    if (!mainAddress || !pincode) {
      throw new CustomError("Main address and pincode are required", 400);
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user.id,
        mainAddress,
        secondaryAddress,
        landmark,
        pincode,
        state,
        city,
        district,
      },
    });

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error) {
    throw error;
  }
};

export const getUserAddresses = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError("User not authenticated", 401);
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "Addresses retrieved successfully",
      data: addresses,
    });
  } catch (error) {
    throw error;
  }
};

export const updateAddress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError("User not authenticated", 401);
    }

    const { id } = req.params;
    const {
      mainAddress,
      secondaryAddress,
      landmark,
      pincode,
      state,
      city,
      district,
    } = req.body;

    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      throw new CustomError("Address not found", 404);
    }

    if (existingAddress.userId !== req.user.id) {
      throw new CustomError("Access denied", 403);
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        mainAddress,
        secondaryAddress,
        landmark,
        pincode,
        state,
        city,
        district,
      },
    });

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteAddress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError("User not authenticated", 401);
    }

    const { id } = req.params;

    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      throw new CustomError("Address not found", 404);
    }

    if (existingAddress.userId !== req.user.id) {
      throw new CustomError("Access denied", 403);
    }

    await prisma.address.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};

export const getAllAddresses = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const addresses = await prisma.address.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "All addresses retrieved successfully",
      data: addresses,
    });
  } catch (error) {
    throw error;
  }
};
