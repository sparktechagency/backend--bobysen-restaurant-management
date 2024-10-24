import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { orderServices } from "./order.service";
const insertOrderIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.insertOrderIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order maked successfully",
    data: result,
  });
});
const getimnCallback = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServices.getImnCallback(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "imn callback retrieved successfully",
    data: result,
  });
});
const loadPaymentZone = catchAsync(async (req: Request, res: Response) => {
  const body = { ...req.body };
  body.user = req?.user?.userId;
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  const result = await orderServices.loadPaymentZone(body, token as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "payment url retrieved successfully",
    data: result,
  });
});

export const orderControllers = {
  insertOrderIntoDB,
  getimnCallback,
  loadPaymentZone,
};
