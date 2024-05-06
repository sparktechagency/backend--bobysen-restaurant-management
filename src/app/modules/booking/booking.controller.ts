import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { bookingServies } from "./booking.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import moment from "moment";
const bookAtable = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req?.user?.userId;
  const result = await bookingServies.bookAtable(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Table Find successfully",
    data: result,
  });
});
const getAllBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingServies.getAllBookings(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "booking retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});
const getAllBookingByOwner = catchAsync(async (req: Request, res: Response) => {
  if (req?.user?.role === "vendor") {
    req.query.owner = req?.user?.userId;
  }
  const result = await bookingServies.getAllBookingByOwner(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "booking retrived successfully",
    data: result,
  });
});
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingServies.getSingleBooking(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "booking retrived successfully",
    data: result,
  });
});
const updatebooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingServies.updateBooking(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "booking updated successfully",
    data: result,
  });
});
const getBookingDetailsWithMenu = catchAsync(
  async (req: Request, res: Response) => {
    const result = await bookingServies.getBookingDetailsWithMenuOrder(
      req.params.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking details retrived successfully",
      data: result,
    });
  }
);
const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingServies.deletebooking(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "booking deleted successfully",
    data: result,
  });
});

export const bookingControllers = {
  bookAtable,
  getAllBooking,
  getAllBookingByOwner,
  getBookingDetailsWithMenu,
  getSingleBooking,
  updatebooking,
  deleteBooking,
};
