import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { uploadToSpaces } from "../../utils/spaces";
import { eventsServices } from "./event.service";

const insertEventsIntoDb = catchAsync(async (req: Request, res: Response) => {
  const data = { ...req.body };

  if (req?.file) {
    data["image"] = await uploadToSpaces(req?.file, "event");
  }
  const result = await eventsServices.insertEventIntoDb(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event added successfully",
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
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
const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await eventsServices.updateEvent(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "event updated successfully",
    data: result,
  });
});

export const eventsController = {
  insertEventsIntoDb,
  getAllEvents,
  getSingleEvent,
  updateEvent,
};
