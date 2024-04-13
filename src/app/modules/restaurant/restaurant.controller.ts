import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { restaurantServices } from "./restaurant.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
const getme = catchAsync(async (req: Request, res: Response) => {
  req.body.owner = req?.user?.userId;
  const result = await restaurantServices.insertRestaurantIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "restaurant added successfully",
    data: result,
  });
});
