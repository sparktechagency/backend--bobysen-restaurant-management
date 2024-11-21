import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { topRestaurantServices } from "./TopRestaurant.service";

const insertTopRestaurantIntoDb = catchAsync(
  async (req: Request, res: Response) => {
    const result = await topRestaurantServices.insertTopRestaurantIntoDb(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Restaurants added successfully",
      data: result,
    });
    return result;
  }
);
const getAllTopRestaurants = catchAsync(async (req: Request, res: Response) => {
  const result = await topRestaurantServices.getAllTopRestaurants(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Restaurants retrieved successfully",
    data: result?.data,
    meta: result?.meta,
  });
  return result;
});
const getAllTopRestaurantForTable = catchAsync(
  async (req: Request, res: Response) => {
    const result = await topRestaurantServices.getAllTopRestaurantForTable(
      req.query
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Restaurants retrieved successfully",
      data: result?.data,
      meta: result?.meta,
    });
    return result;
  }
);
const getSingleTopRestaurant = catchAsync(
  async (req: Request, res: Response) => {
    const result = await topRestaurantServices.getSingleTopRestaurant(
      req.params.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Restaurant retrieved successfully",
      data: result,
    });
    return result;
  }
);
const updateTopRestaurant = catchAsync(async (req: Request, res: Response) => {
  const result = await topRestaurantServices.updateTopRestaurant(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Restaurant updated successfully",
    data: result,
  });
  return result;
});
const deleteTopRestaurant = catchAsync(async (req: Request, res: Response) => {
  const result = await topRestaurantServices.deleteTopRestaurantFromList(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Restaurant deleted successfully",
    data: result,
  });
  return result;
});

export const TopRestaurantControllers = {
  insertTopRestaurantIntoDb,
  getAllTopRestaurants,
  getAllTopRestaurantForTable,
  getSingleTopRestaurant,
  updateTopRestaurant,
  deleteTopRestaurant,
};
