import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { favoriteListServices } from "./favouriteList.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

const insertMenuintoFavriteList = catchAsync(
  async (req: Request, res: Response) => {
    console.log(req.user);
    req.body.user = req?.user?.userId;
    const result = await favoriteListServices.insertMenuIntoFavouriteList(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "menu added into favourite list",
      data: result,
    });
  }
);
const insertRestaurantIntoFavoriteList = catchAsync(
  async (req: Request, res: Response) => {
    req.body.user = req?.user?.userId;
    const result = await favoriteListServices.insertRestaurantIntoDb(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "restaurant added into favourite list",
      data: result,
    });
  }
);
const getAllDataFromFavoriteList = catchAsync(
  async (req: Request, res: Response) => {
    req.query.user = req?.user?.userId;
    const result = await favoriteListServices.getAllDataFromFavoriteList(
      req.query
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "restaurant added into favourite list",
      data: result?.data,
      meta: result?.meta,
    });
  }
);
const removeMenuFromFavoriteList = catchAsync(
  async (req: Request, res: Response) => {
    const result = await favoriteListServices.removeMenuFromFavoriteList(
      req.params.id,
      req.body.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "item removed from favorite list",
      data: result,
    });
  }
);
const removeRestaurantFromList = catchAsync(
  async (req: Request, res: Response) => {
    const result = await favoriteListServices.removeRestaurantFromList(
      req.params.id,
      req.body.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "restaurant removed from favorite list",
      data: result,
    });
  }
);

export const favoriteListControllers = {
  insertMenuintoFavriteList,
  insertRestaurantIntoFavoriteList,
  getAllDataFromFavoriteList,
  removeMenuFromFavoriteList,
  removeRestaurantFromList,
};
