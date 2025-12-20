import { Request, Response } from "express";

import { AuthRequest } from "../middleware/auth";

import * as adminService from "../service/adminService";

export const registerAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const admin = await adminService.registerAdmin(req.body);

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    data: admin,
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const result = await adminService.loginAdmin({
    email,
    password,
  });

  res.status(200).json({
    success: true,
    message: "Admin login successful",
    data: result,
  });
};

export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await adminService.getAllUsers(page, limit);

  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
};

export const getUserById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  const user = await adminService.getUserById(userId);

  res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
};

export const updateUserStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const { isActive } = req.body;

  const user = await adminService.updateUserStatus(userId, isActive);

  res.status(200).json({
    success: true,
    message: "User status updated successfully",
    data: user,
  });
};

export const verifyUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  const user = await adminService.verifyUser(userId);

  res.status(200).json({
    success: true,
    message: "User verified successfully",
    data: user,
  });
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  const result = await adminService.deleteUser(userId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
};

export const getUserBankDetails = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  const bankDetails = await adminService.getUserBankDetails(userId);

  res.status(200).json({
    success: true,
    message: "Bank details retrieved successfully",
    data: bankDetails,
  });
};

export const getAllUserBankDetails = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await adminService.getAllUserBankDetails(page, limit);

  res.status(200).json({
    success: true,
    message: "Bank details retrieved successfully",
    data: result,
  });
};
