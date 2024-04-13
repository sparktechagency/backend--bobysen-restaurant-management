import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { authServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.login(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "logged is successfully",
    data: result,
  });
});
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.changePassword(req.user.userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "password changed successfully",
    data: result,
  });
});
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.forgotPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "an otp sent to your email!",
    data: result,
  });
});
const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.verifyOtp(
    req?.headers?.token as string,
    req?.body?.otp
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "otp verfied successfully",
    data: result,
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.resetPassword(
    req?.headers?.token as string,
    req?.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "password changed successfully",
    data: result,
  });
});

export const authControllers = {
  login,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
