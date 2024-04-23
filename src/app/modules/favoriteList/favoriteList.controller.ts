import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { favoriteListServices } from "./favouriteList.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

const insertMenuintoFavriteList = catchAsync(
  async (req: Request, res: Response) => {
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
      data: result,
    });
  }
);
const removedataFromFavoriteList = catchAsync(
  async (req: Request, res: Response) => {
    const result = await favoriteListServices.removeFromFavoriteList(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "item removed from favorite list",
      data: result,
    });
  }
);

export const favoriteListControllers = {
  insertMenuintoFavriteList,
  insertRestaurantIntoFavoriteList,
  getAllDataFromFavoriteList,
  removedataFromFavoriteList,
};
