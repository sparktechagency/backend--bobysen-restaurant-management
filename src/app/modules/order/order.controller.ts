import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { orderServices } from "./order.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
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
  console.log("body from controller", req.body);
  const result = await orderServices.getImnCallback(
    req.body.received_crypted_data
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "imn callback retrived successfully",
    data: result,
  });
});

export const orderControllers = {
  insertOrderIntoDB,
  getimnCallback,
};
