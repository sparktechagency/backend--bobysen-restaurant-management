import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { Table } from "../table/table.model";
import { TBook } from "./booking.interface";
import { Booking } from "./booking.model";
import mongoose, { Schema, Types } from "mongoose";
import notFound from "../../middleware/notfound";
import { generateBookingNumber } from "./booking.utils";

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
    date: payload?.date,
    restaurant: payload?.restaurant,
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
  const data = {
    ...payload,
    table: findTable[0]?._id,
    restaurant: payload?.restaurant,
    id: generateBookingNumber(),
  };
  const result = await Booking.create(data);
  return result;
};

// const bookTable = async (payload: TBook) => {

// };
const getAllBookings = async (query: Record<string, any>) => {
  const bookingModel = new QueryBuilder(
    Booking.find().populate("user restaurant table"),
    query
  )
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();
  const data = await bookingModel.modelQuery;
  const meta = await bookingModel.countTotal();

  return {
    data,
    meta,
  };
};
const getAllBookingByOwner = async (query: Record<string, any>) => {
  const searchAbleFields = ["fullName", "id"];
  const pipeline: any[] = [
    {
      $lookup: {
        from: "restaurants",
        localField: "restaurant",
        foreignField: "_id",
        as: "restaurant",
      },
    },
    {
      $unwind: "$restaurant",
    },
    {
      $lookup: {
        from: "tables",
        localField: "table",
        foreignField: "_id",
        as: "table",
      },
    },
    {
      $unwind: "$table",
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $match: {
        "restaurant.owner": new mongoose.Types.ObjectId(query?.owner),
      },
    },
    {
      $project: {
        userName: "$user.fullName",
        email: "$user.email",
        status: "$status",
        date: "$date",
        time: "$time",
        tableId: "$table._id",
        tableName: "$table.tableName",
        tableNo: "$table.tableNo",
        seats: "$table.seats",
        restaurantName: "$restaurant.name",
      },
    },
  ];
  Object.keys(query).forEach((key) => {
    if (key !== "searchTerm" && key !== "owner") {
      console.log(key);
      const matchStage: Record<string, any> = {};
      matchStage[key] = query[key];
      console.log(query);
      pipeline.push({ $match: matchStage });
    }
  });
  // searchterm
  if (query?.searchTerm) {
    const searchRegex = new RegExp(query.searchTerm, "i");
    const searchMatchStage = {
      $or: searchAbleFields.map((field) => ({
        [field]: { $regex: searchRegex },
      })),
    };
    pipeline.push({ $match: searchMatchStage });
  }
  // project
  pipeline.push();
  const result = await Booking.aggregate(pipeline);
  return result;
};
const getSingleBooking = async (id: string) => {
  const result = await Booking.findById(id).populate("table");
  return result;
};

const updateBooking = async (id: string, payload: Record<string, any>) => {
  const result = await Booking.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deletebooking = async (id: string) => {
  const result = await Booking.findByIdAndDelete(id);
  return result;
};

export const bookingServies = {
  bookAtable,
  getAllBookings,
  getAllBookingByOwner,
  getSingleBooking,
  updateBooking,
  deletebooking,
};
