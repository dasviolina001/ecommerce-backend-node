import { Request, Response } from "express";

import { AuthRequest } from "../middleware/auth";

import * as pincodeService from "../service/pincodeService";

export const createPincode = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const pincode = await pincodeService.createPincode(req.body);

  res.status(201).json({
    success: true,
    message: "Pincode created successfully",
    data: pincode,
  });
};

export const getAllPincodes = async (
  req: Request | AuthRequest,
  res: Response
): Promise<void> => {
  const page = req.query.page ? parseInt(req.query.page as string) : undefined;

  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

  const includeInactive = (req as AuthRequest).user
    ? req.query.includeInactive === "true"
    : false;

  const result = await pincodeService.getAllPincodes(
    page,
    limit,
    includeInactive
  );

  res.status(200).json({
    success: true,
    message: "Pincodes retrieved successfully",
    data: result,
  });
};

export const getPincodeById = async (
  req: Request | AuthRequest,
  res: Response
): Promise<void> => {
  const { pincodeId } = req.params;
  // For public routes, always exclude inactive. Admin routes can use includeInactive query param
  const includeInactive = (req as AuthRequest).user
    ? req.query.includeInactive === "true"
    : false;

  const pincode = await pincodeService.getPincodeById(
    pincodeId,
    includeInactive
  );

  res.status(200).json({
    success: true,
    message: "Pincode retrieved successfully",
    data: pincode,
  });
};

export const getPincodeByValue = async (
  req: Request | AuthRequest,
  res: Response
): Promise<void> => {
  const { value } = req.params;

  const includeInactive = (req as AuthRequest).user
    ? req.query.includeInactive === "true"
    : false;

  const pincode = await pincodeService.getPincodeByValue(
    value,
    includeInactive
  );

  res.status(200).json({
    success: true,
    message: "Pincode retrieved successfully",
    data: pincode,
  });
};

export const updatePincode = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { pincodeId } = req.params;

  const pincode = await pincodeService.updatePincode(pincodeId, req.body);

  res.status(200).json({
    success: true,
    message: "Pincode updated successfully",
    data: pincode,
  });
};

export const softDeletePincode = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { pincodeId } = req.params;

  const pincode = await pincodeService.softDeletePincode(pincodeId);

  res.status(200).json({
    success: true,
    message: "Pincode soft deleted successfully",
    data: pincode,
  });
};

export const restorePincode = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { pincodeId } = req.params;

  const pincode = await pincodeService.restorePincode(pincodeId);

  res.status(200).json({
    success: true,
    message: "Pincode restored successfully",
    data: pincode,
  });
};

export const deletePincode = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { pincodeId } = req.params;

  const result = await pincodeService.deletePincode(pincodeId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
};
