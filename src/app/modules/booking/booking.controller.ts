import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { USER_ROLE } from "../user/user.constant";
import { bookingServies } from "./booking.service";
const bookAtable = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req?.user?.userId;
  const result = await bookingServies.bookAtable(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Table booked successfully",
    data: result,
  });
});
const getAllBooking = catchAsync(async (req: Request, res: Response) => {
  const { role, userId } = req.user;
  const query = { ...req.query };
  if (role === USER_ROLE.user) {
    query["user"] = userId;
  }
  const result = await bookingServies.getAllBookings(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking data retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});
const getAllBookingsForAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const result = await bookingServies.getAllBookingsForAdmin(req.query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking data retrived successfully",
      data: result,
    });
  }
);
const getAllBookingByOwner = catchAsync(async (req: Request, res: Response) => {
  if (req?.user?.role === "vendor") {
    req.query.owner = req?.user?.userId;
  }
  const result = await bookingServies.getAllBookingByOwner(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking data retrived successfully",
    data: result,
  });
});
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingServies.getSingleBooking(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking data retrived successfully",
    data: result,
  });
});
const updatebooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingServies.updateBooking(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking data updated successfully",
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
    message: "booking  data deleted successfully",
    data: result,
  });
});
const getBookingStatics = catchAsync(async (req: Request, res: Response) => {
  console.log(req.user);
  const result = await bookingServies.getBookingStatics(
    req.user.userId,
    req?.query?.year as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking statics retrived successfully",
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
  getBookingStatics,
  getAllBookingsForAdmin,
};
