import { Request, Response } from "express";
import httpStatus from "http-status";
import moment from "moment";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
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
    message: "Cart items retrieved successfully",
    data: result,
  });
});
const getMYOrders = catchAsync(async (req: Request, res: Response) => {
  const query = { ...req.query };
  query["user"] = req?.user?.userId;
  const result = await cartServices.getAllOrders(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders retrieved successfully",
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
      message: "Order details retrieved successfully",
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
