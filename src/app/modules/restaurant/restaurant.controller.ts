import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { restaurantServices } from "./restaurant.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { storeFile } from "../../utils/fileHelper";
import { USER_ROLE } from "../user/user.constant";
const insertRestaurantIntDb = catchAsync(
  async (req: Request, res: Response) => {
    const images = [];
    console.log(req.body);
    if (req?.files instanceof Array) {
      for (const file of req?.files) {
        images.push({ url: storeFile("restaurant", file?.filename) });
      }
    }
    req.body.owner = req?.user?.userId;
    req.body.images = images;
    const result = await restaurantServices.insertRestaurantIntoDb(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "restaurant added successfully",
      data: result,
    });
    return result;
  }
);
const getAllRestaurants = catchAsync(async (req: Request, res: Response) => {
  req.query.owner = req?.user?.userId;
  const result = await restaurantServices.getAllRestaurant(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Restaurants retrived successfully",
    data: result,
  });
  return result;
});
const getAllRestaurantsForUser = catchAsync(
  async (req: Request, res: Response) => {
    const result = await restaurantServices.getAllRestaurantsForUser(req.query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Restaurants retrived successfully",
      data: result?.data,
      meta: result?.meta,
    });
    return result;
  }
);
const getSingleRestaurant = catchAsync(async (req: Request, res: Response) => {
  const result = await restaurantServices.getSingleRestaurant(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "restaurant retrived successfully",
    data: result,
  });
  return result;
});
const updateRestaurant = catchAsync(async (req: Request, res: Response) => {
  const images = [];
  console.log(req.files);
  if (req?.files instanceof Array) {
    for (const file of req?.files) {
      images.push({ url: storeFile("restaurant", file?.filename) });
    }
  }
  req.body.images = images;
  const result = await restaurantServices.updateRestaurant(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "restaurant updated successfully",
    data: result,
  });
  return result;
});
const deleteRestaurant = catchAsync(async (req: Request, res: Response) => {
  const result = await restaurantServices.deleteRestaurant(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "restaurant deleted successfully",
    data: result,
  });
  return result;
});
const deleteFiles = catchAsync(async (req: Request, res: Response) => {
  const result = await restaurantServices.deleteFiles(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image deleted successfully",
    data: result,
  });
  return result;
});
const getSingleRestaurantForOwner = catchAsync(
  async (req: Request, res: Response) => {
    const result = await restaurantServices.getSingleRestaurantForOwner(
      req.params.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Restaurant retrived successfully",
      data: result,
    });
    return result;
  }
);

export const restauranntControllers = {
  insertRestaurantIntDb,
  getAllRestaurants,
  getSingleRestaurantForOwner,
  getAllRestaurantsForUser,
  updateRestaurant,
  getSingleRestaurant,
  deleteRestaurant,
  deleteFiles,
};
