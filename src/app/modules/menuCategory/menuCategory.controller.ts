import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { uploadToSpaces } from "../../utils/spaces";
import { menuCategoryServices } from "./menuCategory.service";
const insertMenuCategoryIntoDb = catchAsync(
  async (req: Request, res: Response) => {
    if (req?.file) {
      req.body.image = await uploadToSpaces(req?.file, "category");
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
  const query = { ...req.query };
  if (req?.user?.role === "vendor") query["user"] = req?.user?.userId;
  const result = await menuCategoryServices.findAllCategory(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "categories retrieved successfully",
    data: result,
  });
});
const updateMenuCategory = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.image = await uploadToSpaces(req?.file, "category");
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
    req.body.image = await uploadToSpaces(req?.file, "category");
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
