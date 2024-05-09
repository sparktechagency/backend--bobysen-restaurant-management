import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { storeFile } from "../../utils/fileHelper";
import { menuServices, reviewServices } from "./menu.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
const insertMenuIntoDb = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.image = storeFile("menu", req?.file?.filename);
  }
  req.body.owner = req?.user?.userId;
  const result = await menuServices.insertMenuIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Menu added successfully",
    data: result,
  });
});
const getAllMenu = catchAsync(async (req: Request, res: Response) => {
  if (req?.user?.role === "vendor") {
    req.query.owner = req?.user?.userId;
  }
  const result = await menuServices.getAllMenu(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Menu retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});
const getAllMenuForOwner = catchAsync(async (req: Request, res: Response) => {
  console.log(req?.user?.userId);
  const result = await menuServices.getAllTablesForOwner(req?.user?.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Menu retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});
const getsingleMenu = catchAsync(async (req: Request, res: Response) => {
  const result = await menuServices.getSingleMenu(
    req.params.id,
    req?.user?.userId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Menu retrived successfully",
    data: result,
  });
});
const updateMenu = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.image = storeFile("menu", req?.file?.filename);
  }
  const result = await menuServices.updateMenu(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Menu updated successfully",
    data: result,
  });
});
const deleteMenu = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.image = storeFile("menu", req?.file?.filename);
  }
  const result = await menuServices.deleteMenu(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Menu deleted successfully",
    data: result,
  });
});
// ------------------------- review part-------------------------------
const insertReviewIntoDb = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req?.user?.userId;
  const result = await reviewServices.insertReviewIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Thank you for your valuable feedback",
    data: result,
  });
});
const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewServices.getAllReviews(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrived successfully",
    data: result,
  });
});

export const menuControllers = {
  insertMenuIntoDb,
  getAllMenu,
  getsingleMenu,
  getAllMenuForOwner,
  updateMenu,
  deleteMenu,
};

export const reviewControllers = {
  insertReviewIntoDb,
  getAllReviews,
};
