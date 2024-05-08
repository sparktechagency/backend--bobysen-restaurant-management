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

export const orderControllers = {
  insertOrderIntoDB,
};
