import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { notificationServices } from "./notificaiton.service";
const insertNotificatonIntoDb = catchAsync(
  async (req: Request, res: Response) => {
    const result = await notificationServices.insertNotificationIntoDb(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Notification added  successfully",
      data: result,
    });
  }
);
const getAllNotification = catchAsync(async (req: Request, res: Response) => {
  const result = await notificationServices.getAllNotifications(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notifications retrived successfully",
    data: result,
  });
});
const markAsDone = catchAsync(async (req: Request, res: Response) => {
  const result = await notificationServices.markAsDone(req?.user?.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Mark as done successfully",
    data: result,
  });
});

export const notificationControllers = {
  insertNotificatonIntoDb,
  getAllNotification,
  markAsDone,
};
