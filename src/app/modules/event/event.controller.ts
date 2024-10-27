import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { uploadToSpaces } from "../../utils/spaces";
import { eventsServices } from "./event.service";

const insertEventsIntoDb = catchAsync(async (req: Request, res: Response) => {
  const data = { ...req.body };

  const images = [];
  if (req?.files instanceof Array) {
    for (const file of req?.files) {
      images.push({ url: await uploadToSpaces(file, "event") });
    }
  }
  data["images"] = images;
  const result = await eventsServices.insertEventIntoDb(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event added successfully",
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  console.log(req.query);
  const result = await eventsServices.getAllEvents(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "events retrieved successfully",
    data: result?.data,
    meta: result?.meta,
  });
});
const getSingleEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await eventsServices.getSingleEvent(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "event retrieved successfully",
    data: result,
  });
});
const geteventForVendor = catchAsync(async (req: Request, res: Response) => {
  const result = await eventsServices.geteventForVendor(req.user.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "event retrieved successfully",
    data: result,
  });
});
const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await eventsServices.updateEvent(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "event updated successfully",
    data: result,
  });
});

const loadPaymentZoneForEvent = catchAsync(
  async (req: Request, res: Response) => {
    const data = { ...req.body };
    data["user"] = req.user.userId;
    data["token"] = req.headers.authorization?.split(" ")[1];
    console.log(data);
    const result = await eventsServices.loadPaymentZoneForEvent(data);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "load payment zone retrieved successfully",
      data: result,
    });
  }
);
const makePaymentForEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await eventsServices.makePaymentForEvent(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Table Booked successfully",
    data: result,
  });
});

export const eventsController = {
  insertEventsIntoDb,
  getAllEvents,
  getSingleEvent,
  geteventForVendor,
  updateEvent,
  loadPaymentZoneForEvent,
  makePaymentForEvent,
};
