import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { uploadToSpaces } from '../../utils/spaces';
import { restaurantServices } from './restaurant.service';
const insertRestaurantIntDb = catchAsync(
  async (req: Request, res: Response) => {
    const images = [];

    if (req?.files instanceof Array) {
      for (const file of req?.files) {
        images.push({ url: await uploadToSpaces(file, 'restaurant') });
      }
    }
    req.body.owner = req?.user?.userId;
    req.body.images = images;
    const result = await restaurantServices.insertRestaurantIntoDb(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Restaurant added successfully',
      data: result,
    });
    return result;
  }
);
const getAllRestaurants = catchAsync(async (req: Request, res: Response) => {
  const query = { ...req.query };
  query['owner'] = req?.user?.userId;
  const result = await restaurantServices.getAllRestaurant(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Restaurants retrieved successfully',
    data: result,
  });
  return result;
});
const getAllRestaurantsForUser = catchAsync(
  async (req: Request, res: Response) => {
    const query: any = { ...req.query };
    if (!req?.query?.limit) {
      query['limit'] = 99;
    }
    const result = await restaurantServices.getAllRestaurantsForUser(query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Restaurants retrieved successfully',
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
    message: 'Restaurant retrieved successfully',
    data: result,
  });
  return result;
});
const updateRestaurant = catchAsync(async (req: Request, res: Response) => {
  const images = [];
  if (req?.files instanceof Array) {
    for (const file of req?.files) {
      images.push({ url: await uploadToSpaces(file, 'restaurant') });
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
    message: 'Restaurant updated successfully',
    data: result,
  });
  return result;
});
const deleteRestaurant = catchAsync(async (req: Request, res: Response) => {
  const result = await restaurantServices.deleteRestaurant(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Restaurant deleted successfully',
    data: result,
  });
  return result;
});
const deleteFiles = catchAsync(async (req: Request, res: Response) => {
  const result = await restaurantServices.deleteFiles(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Image deleted successfully',
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
      message: 'Restaurant retrieved successfully',
      data: result,
    });
    return result;
  }
);
const getAllRestaurantForAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const result = await restaurantServices.getAllRestaurantForAdmin(req.query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Restaurant retrieved successfully',
      data: result,
    });
    return result;
  }
);
const nearByRestaurant = catchAsync(async (req: Request, res: Response) => {
  const result = await restaurantServices.nearByRestaurant(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Restaurant retrieved successfully',
    data: result,
  });
  return result;
});
const getAllRestaurantId = catchAsync(async (req: Request, res: Response) => {
  const query = { ...req.query };
  query['owner'] = req.user.userId;
  const result = await restaurantServices.getAllRestaurantId({
    ...query,
    status: 'active',
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Restaurant retrieved successfully',
    data: result,
  });
  return result;
});
const changeRestaurantStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result = await restaurantServices.changeRestaurantStatus(
      req.params.id,
      req.body?.status
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Restaurant status changed successfully',
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
  getAllRestaurantForAdmin,
  nearByRestaurant,
  getAllRestaurantId,
  changeRestaurantStatus,
};
