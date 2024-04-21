import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { Table } from "../table/table.model";
import { TBook } from "./booking.interface";
import { Booking } from "./booking.model";
import { Types } from "mongoose";
import notFound from "../../middleware/notfound";

// search booking
const bookAtable = async (payload: TBook) => {
  if (Number(payload?.seats) > 10) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "If you want to book more than 10 seats, please contact the restaurant owner."
    );
  }
  // retrive total tables under the restaurant
  const totalTables = await Table.find({
    restaurant: payload.restaurant,
  }).countDocuments();
  // retrive book tables
  const bookedTables = await Booking.find({
    date: payload.date,
    status: true,
  }).countDocuments();
  // conditionally check avilable tables
  if (bookedTables >= totalTables) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "no tables avilable for booking during this date"
    );
  }

  const findTable = await Table.aggregate([
    {
      $match: {
        restaurant: new Types.ObjectId(payload?.restaurant),
        seats: payload?.seats,
      },
    },
    {
      $limit: 1,
    },
  ]);
  if (!findTable[0]) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "We couldn't find any tables with the required number of seats. You can increase the number of seat, or  Please contact with  the restaurant owner"
    );
  }
  return findTable[0];
};

// const bookTable = async (payload: TBook) => {

// };
const getAllBookings = async (query: Record<string, any>) => {
  const bookingModel = new QueryBuilder(Booking.find(), query)
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();
  const data = bookingModel.modelQuery;
  const meta = await bookingModel.countTotal();

  return {
    data,
    meta,
  };
};
const getSingleBooking = async (id: string) => {
  const result = await Booking.findById(id);
  return result;
};

export const bookingServies = {
  bookAtable,
  getAllBookings,
  getSingleBooking,
};
