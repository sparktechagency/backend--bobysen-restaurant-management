import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { coinService, coinWithDrawServices } from "./coins.service";

const getAllMyCoin = catchAsync(async (req: Request, res: Response) => {
  console.log(req.user);
  const result = await coinService.getAllMyCoin(req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Points retrieved successfully",
    data: result,
  });
});

//--------------------------------------
const insertCoinWithDrawRequest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await coinWithDrawServices.insertCoinWithDrawRequest({
      ...req.body,
      customer: req.user.userId,
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Redeem request sent successfully",
      data: result,
    });
  }
);

const getAllCoinsWithdrawRequests = catchAsync(
  async (req: Request, res: Response) => {
    const query = { ...req.query };
    if (req?.user?.role === "user") query["customer"] = req.user.userId;
    const result = await coinWithDrawServices.getAllCoinsWithdrawRequests(
      req.query
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Redeem request retrieved successfully",
      data: result,
    });
  }
);

const getSingleCoinsWithdrawRequest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await coinWithDrawServices.getSingleCoinsWithdrawRequest(
      req.params.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Redeem request retrieved successfully",
      data: result,
    });
  }
);
const updateCoinsWithdrawRequest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await coinWithDrawServices.getSingleCoinsWithdrawRequest(
      req.params.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Redeem request updated successfully",
      data: result,
    });
  }
);
export const coinController = {
  getAllMyCoin,
};
export const coinWithDrawController = {
  insertCoinWithDrawRequest,

  getAllCoinsWithdrawRequests,
  getSingleCoinsWithdrawRequest,
  updateCoinsWithdrawRequest,
};
