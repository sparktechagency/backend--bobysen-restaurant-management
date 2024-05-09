import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { Table } from "../table/table.model";
import { TBook } from "./booking.interface";
import { Booking } from "./booking.model";
import mongoose, { Schema, Types } from "mongoose";
import notFound from "../../middleware/notfound";
import { generateBookingNumber } from "./booking.utils";
import moment from "moment";
import { notificationServices } from "../notification/notificaiton.service";
import { modeType } from "../notification/notification.interface";
import { message } from "antd";
import { messages } from "../notification/notification.constant";
import { Restaurant } from "../restaurant/restaurant.model";

// search booking
const bookAtable = async (payload: TBook) => {
  if (Number(payload?.seats) > 10) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "If you want to book more than 10 seats, please contact the restaurant owner."
    );
  }

  // check if restaurant booked or open
  const isNotOpenRestaurant = await Restaurant.findOne({
    $and: [
      { "close.from": { $lte: payload.date } }, // Check if close.from is less than or equal to payload.date
      { "close.to": { $gte: payload.date } }, // Check if close.to is greater than or equal to payload.date
    ],
  });
  if (isNotOpenRestaurant) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Restaurant is closed during this time. Please select another date."
    );
  }

  // retrive total tables under the restaurant
  const tables = await Table.find({
    restaurant: payload.restaurant,
  }).countDocuments();

  // retrive book tables
  const bookedTables: any = await Booking.find({
    date: payload?.date,
    restaurant: payload?.restaurant,
    staus: "active",
  }).populate("restaurant");

  // conditionally check avilable tables
  if (bookedTables.length >= tables) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No tables avilable for booking during this date"
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
      "We couldn't find any tables with the required number of seats.  Please contact with  the restaurant owner"
    );
  }
  //
  const data = {
    ...payload,
    table: findTable[0]?._id,
    restaurant: payload?.restaurant,
    id: generateBookingNumber(),
  };

  const result = await Booking.create(data);
  const notificationData = [
    {
      receiver: payload?.user,
      message: messages.booking,
      refference: result?._id,
      model_type: modeType.Booking,
    },
    // {
    //   receiver: bookedTables[0]?.restaurant?.owner,
    //   message: messages.bookingForOwner,
    //   description: `Date:${moment(payload?.date).format(
    //     "YYYY-MM-DD HH:mm a"
    //   )},TableNo:${findTable[0]?.tableNo},Seats:${findTable[0]?.seats}`,
    //   refference: result?._id,
    //   model_type: modeType.Booking,
    // },
  ];
  await notificationServices.insertNotificationIntoDb(notificationData);
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
  const searchAbleFields = ["userName", "id", "email"];
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
      $addFields: {
        formattedDate: {
          $dateToString: {
            format: "%Y-%m-%d", // specify the desired format
            date: "$date", // the date field you want to format
          },
        },
      },
    },
    {
      $project: {
        userName: "$user.fullName",
        email: "$user.email",
        id: "$id",
        status: "$status",
        date: "$formattedDate",
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

const getBookingDetailsWithMenuOrder = async (id: string) => {
  const result = Booking.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "tables",
        foreignField: "_id",
        localField: "table",
        as: "table",
      },
    },
    {
      $unwind: "$table",
    },
  ]);
  return result;
};
const updateBooking = async (id: string, payload: Record<string, any>) => {
  let message;
  const result = await Booking.findByIdAndUpdate(id, payload, { new: true });

  if (payload?.status === "cancelled") {
    message = messages.cancelled;
    const notificationData = {
      receiver: result?.user,
      message,
      refference: result?._id,
      model_type: modeType.Booking,
    };
    await notificationServices.insertNotificationIntoDb(notificationData);
  }

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
  getBookingDetailsWithMenuOrder,
  deletebooking,
};
