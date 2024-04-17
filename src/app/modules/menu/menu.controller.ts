import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { storeFile } from "../../utils/fileHelper";
import { menuServices } from "./menu.service";
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
    message: "menu added successfully",
    data: result,
  });
});
const getAllMenu = catchAsync(async (req: Request, res: Response) => {
  const result = await menuServices.getAllMenu(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "menu retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});
const getsingleMenu = catchAsync(async (req: Request, res: Response) => {
  const result = await menuServices.getSingleMenu(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "menu retrived successfully",
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
    message: "menu updated successfully",
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
    message: "menu deleted successfully",
    data: result,
  });
});

export const menuControllers = {
  insertMenuIntoDb,
  getAllMenu,
  getsingleMenu,
  updateMenu,
  deleteMenu,
};
