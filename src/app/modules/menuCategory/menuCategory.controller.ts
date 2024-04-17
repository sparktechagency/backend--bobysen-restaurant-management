import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { menuCategoryServices } from "./menuCategory.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { storeFile } from "../../utils/fileHelper";
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
  const result = await menuCategoryServices.findAllCategory(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "categories retrived successfully",
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

export const categoryControllers = {
  insertMenuCategoryIntoDb,
  findAllCategory,
  updateMenuCategory,
};
