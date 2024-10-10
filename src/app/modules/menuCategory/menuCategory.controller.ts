import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { storeFile } from "../../utils/fileHelper";
import sendResponse from "../../utils/sendResponse";
import { menuCategoryServices } from "./menuCategory.service";
const insertMenuCategoryIntoDb = catchAsync(
  async (req: Request, res: Response) => {
    if (req?.file) {
      req.body.image = storeFile("category", req?.file?.filename);
    }
    req.body.user = req?.user?.userId;

    const result = await menuCategoryServices.insertMenuCategoryIntoDb(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "category added successfully",
      data: result,
    });
  }
);
const findAllCategory = catchAsync(async (req: Request, res: Response) => {
  console.log(req.query);
  const result = await menuCategoryServices.findAllCategory(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "categories retrieved successfully",
    data: result,
  });
});
const updateMenuCategory = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.image = storeFile("category", req?.file?.filename);
  }
  const result = await menuCategoryServices.updateMenuCategory(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "category updated successfully",
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.image = storeFile("category", req?.file?.filename);
  }
  const result = await menuCategoryServices.getSingleCategory(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category retrieved successfully",
    data: result,
  });
});

export const categoryControllers = {
  insertMenuCategoryIntoDb,
  getSingleCategory,
  findAllCategory,
  updateMenuCategory,
};
