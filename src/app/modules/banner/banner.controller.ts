import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { uploadToSpaces } from "../../utils/spaces";
import { bannerservices } from "./banner.service";

const insertBannerIntoDb = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.image = await uploadToSpaces(req?.file, "banner");
  }
  console.log(req.body);
  const result = await bannerservices.insetBannerIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banner added successfully",
    data: result,
  });
});
const getAllBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerservices.getAllBanner();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banners retrieved successfully",
    data: result,
  });
});
const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerservices.deleteBanner(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Banners retrieved successfully",
    data: result,
  });
});

export const bannerControllers = {
  insertBannerIntoDb,
  getAllBanner,
  deleteBanner,
};
