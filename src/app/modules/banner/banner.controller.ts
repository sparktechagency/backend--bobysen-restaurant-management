import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { storeFile } from "../../utils/fileHelper";
import sendResponse from "../../utils/sendResponse";
import { bannerservices } from "./banner.service";

const insertBannerIntoDb = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.image = storeFile("banner", req?.file?.filename);
  }
  const result = await bannerservices.insetBannerIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banner added successfully",
    data: result,
  });
});
const getAllBanner = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.image = storeFile("banner", req?.file?.filename);
  }
  const result = await bannerservices.getAllBanner();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banners retrived successfully",
    data: result,
  });
});
const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerservices.deleteBanner(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banners retrived successfully",
    data: result,
  });
});

export const bannerControllers = {
  insertBannerIntoDb,
  getAllBanner,
  deleteBanner,
};
