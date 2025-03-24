import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { otpServices } from "./otp.service";
const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const token = req?.headers?.token;

  const result = await otpServices.verifyOtp(token as string, req.body.otp);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "otp verified successfully",
    data: result,
  });
});
const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await otpServices.resendOtp(req.body.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "otp sent successfully",
    data: result,
  });
});
const verifyOtpForWidget = catchAsync(async (req: Request, res: Response) => {
  const data = {
    ...req.body,
    mobile: req?.body?.phoneNumber,
    otp: req?.body?.otp,
    user: req.user.userId,
  };
  const result = await otpServices.verifyOtpForWidget(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reservation successfully confirmed",
    data: result,
  });
});

export const otpControllers = {
  verifyOtp,
  resendOtp,
  verifyOtpForWidget,
};
