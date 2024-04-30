import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { menuCategoryServices } from "../menuCategory/menuCategory.service";
import moment from "moment";
import { cartServices } from "./cart.service";
const insertItemIntoCart = catchAsync(async (req: Request, res: Response) => {
  const data: any = { item: req.body };
  data.date = moment().format("YYYY-MM-DD");
  data.restaurant = req.params.id;
  data.user = req?.user.userId;
  const result = await cartServices.insertItemsIntoCart(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Item  successfully added",
    data: result,
  });
});

export const cartControllers = {
  insertItemIntoCart,
};
