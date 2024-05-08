import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { menuCategoryServices } from "../menuCategory/menuCategory.service";
import moment from "moment";
import { cartServices } from "./cart.service";
const insertItemIntoCart = catchAsync(async (req: Request, res: Response) => {
  let itemData = { ...req.body };
  delete itemData.owner;
  const data: any = { item: itemData };
  data.date = moment().format("YYYY-MM-DD");
  data.booking = req.params.id;
  data.user = req?.user.userId;
  data.owner = req.body.owner;
  const result = await cartServices.insertItemsIntoCart(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Item added successfully",
    data: result,
  });
});
const getCartItems = catchAsync(async (req: Request, res: Response) => {
  const result = await cartServices.getCartItems(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart items retrived successfully",
    data: result,
  });
});
const getMYOrders = catchAsync(async (req: Request, res: Response) => {
  const query = { ...req.query };
  query["user"] = req?.user?.userId;
  console.log(req?.user);
  const result = await cartServices.getAllOrders(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});
const removeItemFromCart = catchAsync(async (req: Request, res: Response) => {
  const result = await cartServices.removeItemFromCart(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Item removed successfully",
    data: result,
  });
});

const getSingleCartItemsUsingId = catchAsync(
  async (req: Request, res: Response) => {
    const result = await cartServices.getSingleCartItem(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order details retrived successfully",
      data: result,
    });
  }
);
export const cartControllers = {
  insertItemIntoCart,
  getCartItems,
  getMYOrders,
  removeItemFromCart,
  getSingleCartItemsUsingId,
};
