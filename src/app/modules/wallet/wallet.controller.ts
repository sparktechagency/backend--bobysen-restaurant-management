import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { USER_ROLE } from "../user/user.constant";
import { walletServices } from "./wallet.service";
const sentAmountToTheVendor = catchAsync(
  async (req: Request, res: Response) => {
    const result = await walletServices.sendAmountToVendor(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment Send successfully",
      data: result,
    });
  }
);
const getWalletDetails = catchAsync(async (req: Request, res: Response) => {
  const query = { ...req.query };
  const { role, userId } = req?.user;
  if (role === USER_ROLE.vendor) {
    query["owner"] = userId;
  }
  console.log(query);
  const result = await walletServices.getAllWalletDetails(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet details retrieved successfully",
    data: result?.data,
    meta: result?.meta,
  });
});
const getwalletDetailsByOwner = catchAsync(
  async (req: Request, res: Response) => {
    console.log(req.query);
    const result = await walletServices.getWalletDetailsByOwner(req.query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Wallet details retrieved successfully",
      data: result,
    });
  }
);
const getSingleWallet = catchAsync(async (req: Request, res: Response) => {
  const result = await walletServices.getSingleWallet(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet details retrieved successfully",
    data: result,
  });
});
const getWalletStatics = catchAsync(async (req: Request, res: Response) => {
  const result = await walletServices.getWalletStatics();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet details retrieved successfully",
    data: result,
  });
});

export const walletControllers = {
  sentAmountToTheVendor,
  getWalletDetails,
  getwalletDetailsByOwner,
  getSingleWallet,
  getWalletStatics,
};
