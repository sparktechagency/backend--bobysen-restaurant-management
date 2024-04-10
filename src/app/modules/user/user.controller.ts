import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
const insertuserIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.insertUserIntoDb(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "user created successfully",
    data: result,
  });
});
const insertVendorIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.insertVendorIntoDb(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "vendor created successfully",
    data: result,
  });
});

const getme = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getme(req.user.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "user retrived successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.updateProfile(req.user.userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "user profile updated successfully",
    data: result,
  });
});

export const userControllers = {
  insertuserIntoDb,
  insertVendorIntoDb,
  getme,
  updateProfile,
};
