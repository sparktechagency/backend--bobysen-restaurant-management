import httpStatus from "http-status";
import moment from "moment";
import mongoose, { Types } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { Coin } from "../coins/coins.model";
import { notificationServices } from "../notification/notificaiton.service";
import { messages } from "../notification/notification.constant";
import { modeType } from "../notification/notification.interface";
import { Restaurant } from "../restaurant/restaurant.model";
import { Table } from "../table/table.model";
import { User } from "../user/user.model";
import { TBook } from "./booking.interface";
import { Booking, Unpaidbooking } from "./booking.model";
import {
  calculateEndTime,
  checkRestaurantAvailability,
  generateBookingNumber,
  sendReservationEmail,
  sendWhatsAppMessageToCustomers,
  sendWhatsAppMessageToVendors,
  validateBookingTime,
} from "./booking.utils";

// search booking
const bookAtable = async (BookingData: TBook) => {
  const payload: any = { ...BookingData };
  if (payload?.event === "null") delete payload.event;
  if (BookingData?.event) payload["ticket"] = generateBookingNumber();
  const day = moment(payload?.date).format("dddd");
  if (Number(payload?.seats) > 10) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "If you want to book more than 10 seats, please contact the restaurant owner."
    );
  }
  const restaurant: any = await Restaurant.findById(payload?.restaurant);

  // check if restaurant booked or open
  const bookingTime = moment(payload.date);
  if (payload?.time === "00:00") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The restaurant is closed at 00:00. Please select a valid time."
    );
  }
  // check closing and opening time
  validateBookingTime(restaurant, bookingTime);
  // check the restaurant avilable that day
  checkRestaurantAvailability(restaurant, day, payload?.time);

  const totalTables = await Table.find({
    restaurant: payload.restaurant,
    seats: Number(payload.seats),
  }).countDocuments();
  const expireHours = calculateEndTime(payload?.time);
  // retrive book tables
  const bookedTables: any = await Booking.find({
    date: moment(payload?.date).format("YYYY-MM-DD"),
    restaurant: payload?.restaurant,
    status: "active",
    time: { $lt: expireHours },
    endTime: { $gt: payload?.time },
  });
  // conditionally check avilable tables
  if (bookedTables?.length >= totalTables) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No tables avilable for booking during this time. please choose different time and seats"
    );
  }

  const findTable = await Table.aggregate([
    {
      $match: {
        restaurant: new Types.ObjectId(payload?.restaurant),
        seats: Number(payload?.seats),
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
    date: moment(payload?.date).format("YYYY-MM-DD"),
    table: findTable[0]?._id,
    endTime: calculateEndTime(payload?.time),
    restaurant: payload?.restaurant,
    id: generateBookingNumber(),
  };

  // find user
  const user = await User.findById(payload?.user).select(
    "fullName phoneNumber email"
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const result = await Booking.create(data);
  const notificationData = [
    {
      receiver: payload?.user,
      message: messages.booking,
      refference: result?._id,
      model_type: modeType.Booking,
    },
  ];

  await Coin.findOneAndUpdate(
    { customer: user }, // Search condition
    { $inc: { coins: 10 } }, // Increment the coins by 10 if the document exists
    { new: true, upsert: true } // Insert if no document found, and return the updated document
  );
  // send message to the customer
  const customerSmsData = {
    phoneNumbers: [user?.phoneNumber],
    mediaUrl:
      "https://bookatable.mu/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.71060dcf.png&w=640&q=75",
    bodyValues: [
      user.fullName,
      restaurant?.name,
      result?.date,
      result?.time,
      findTable[0]?.seats,
    ],
    buttonUrl: "https://bookatable.mu",
  };
  const vendorSmsData = {
    phoneNumbers: [restaurant?.helpLineNumber1],
    mediaUrl:
      "https://bookatable.mu/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.71060dcf.png&w=640&q=75",
    bodyValues: [
      user.fullName,
      restaurant?.name,
      result?.date,
      result?.time,
      findTable[0]?.seats,
      user?.phoneNumber,
    ],
    buttonUrl: "https://bookatable.mu",
  };

  // await sendWhatsAppMessageToCustomers(smsData);
  // send message to the vendor

  // await sendWhatsAppMessageToCustomers(customerSmsData);
  // await sendWhatsAppMessageToVendors(vendorSmsData);
  const emailContext = {
    name: user?.fullName,
    email: user?.email,
    date: payload?.date,
    seats: payload?.seats,
    arrivalTime: payload?.time,
    restaurant: restaurant?.name,
    address: restaurant?.address,
  };
  // await sendReservationEmail(
  //   "reservationTemplate", // The name of your template file without the .html extension
  //   user?.email,
  //   "Your Reservation was successful",
  //   emailContext
  // );
  Promise.all([
    // Send WhatsApp and SMS to customer and vendor concurrently
    await notificationServices.insertNotificationIntoDb(notificationData),
    sendWhatsAppMessageToCustomers(customerSmsData),
    sendWhatsAppMessageToVendors(vendorSmsData),
    await sendReservationEmail(
      "reservationTemplate", // The name of your template file without the .html extension
      user?.email,
      "Your Reservation was successful",
      emailContext
    ),
  ]);
  return result;
};

//  book a table from widget

const getAllBookings = async (query: Record<string, any>) => {
  const bookingModel = new QueryBuilder(
    Booking.find().populate("user restaurant table event"),
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
const getAllBookingsForAdmin = async (query: Record<string, any>) => {

  const bookingModel = new QueryBuilder(
    Booking.find()
      .populate({
        path: "user",
        select: "fullName", // Select only the fullname field from the user
      })
      .populate({
        path: "restaurant",
        select: "name", // Select only the name field from the restaurant
      })
      .populate({
        path: "table",
        select: "tableNo seats", // Select only the table_name field from the table
      }),
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
  const pipeline: any[] = [];

  // Match by event if provided in the query
  if (query?.event) {
    pipeline.push({
      $match: {
        event: new mongoose.Types.ObjectId(query.event), // Convert event to ObjectId
      },
    });
  }

  // Add lookup and unwind stages
  pipeline.push(
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
        "restaurant._id": new mongoose.Types.ObjectId(query?.restaurant),
      },
    },
    {
      $project: {
        userName: "$user.fullName",
        email: "$user.email",
        id: "$id",
        status: "$status",
        date: "$date",
        time: "$time",
        tableId: "$table._id",
        tableName: "$table.tableName",
        tableNo: "$table.tableNo",
        seats: "$table.seats",
        restaurantName: "$restaurant.name",
        event: 1,
      },
    }
  );

  // Add matching for additional fields except searchTerm and owner
  Object.keys(query).forEach((key) => {
    if (
      key !== "searchTerm" &&
      key !== "owner" &&
      key !== "event" &&
      key !== "restaurant"
    ) {
      const matchStage: Record<string, any> = {};
      matchStage[key] = query[key];
      pipeline.push({ $match: matchStage });
    }
  });

  // Match by searchTerm if provided in the query
  if (query?.searchTerm) {
    const searchRegex = new RegExp(query.searchTerm, "i");
    const searchMatchStage = {
      $or: searchAbleFields.map((field) => ({
        [field]: { $regex: searchRegex },
      })),
    };
    pipeline.push({ $match: searchMatchStage });
  }

  // Execute the pipeline
  const result = await Booking.aggregate(pipeline);
  return result;
};

const getSingleBooking = async (id: string) => {
  const result = await Booking.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id.toString()) } },
    {
      $lookup: {
        from: "tables",
        localField: "table",
        foreignField: "_id",
        as: "tableDetails",
      },
    },

    {
      $lookup: {
        from: "reviews",
        let: { bookingId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$booking", "$$bookingId"] } } },
          { $limit: 1 },
        ],
        as: "reviewDetails",
      },
    },
    {
      $addFields: {
        isReview: {
          $cond: {
            if: { $gt: [{ $size: "$reviewDetails" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        date: 1,
        time: 1,
        status: 1,

        table: { $arrayElemAt: ["$tableDetails", 0] },
        isReview: 1,
      },
    },
  ]);
  return result;
};

const getBookingDetailsWithMenuOrder = async (id: string) => {
  const result = await Booking.aggregate([
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
    const notificationData = [
      {
        receiver: result?.user,
        message,
        refference: result?._id,
        model_type: modeType.Booking,
      },
    ];
    await notificationServices.insertNotificationIntoDb(notificationData);
  }

  return result;
};

const deletebooking = async (id: string) => {
  const result = await Booking.findByIdAndDelete(id);
  return result;
};
const getBookingStatics = async (
  userId: string,
  year: string,
  restaurantId?: string // Optional restaurantId
) => {
  console.log(userId, year, restaurantId);
  const monthsOfYear = Array.from({ length: 12 }, (_, i) => i + 1); // Array of month numbers from 1 to 12

  const matchStage: any = {
    date: {
      $gte: `${year}-01-01`,
      $lt: `${parseInt(year) + 1}-01-01`,
    },
    restaurant: { $exists: true }, // Filter out bookings without restaurant
  };

  if (restaurantId) {
    // Add restaurantId filter if provided
    matchStage.restaurant = restaurantId;
  }

  const result = await Booking.aggregate([
    {
      $match: matchStage,
    },
    {
      $addFields: {
        dateObj: {
          $dateFromString: { dateString: "$date", format: "%Y-%m-%d" },
        },
      },
    },
    {
      $lookup: {
        from: "restaurants",
        let: { restaurantId: { $toObjectId: "$restaurant" } }, // Convert restaurantId to ObjectId
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$_id", "$$restaurantId"] }, // Match restaurant by ObjectId
                  { $eq: ["$owner", new mongoose.Types.ObjectId(userId)] }, // Match owner by ObjectId
                  {
                    $eq: ["$owner", new mongoose.Types.ObjectId(restaurantId)],
                  }, // Match owner by ObjectId
                ],
              },
            },
          },
        ],
        as: "restaurantOwner",
      },
    },
    {
      $match: {
        restaurantOwner: { $ne: [] }, // Ensure that the restaurant has an owner that matches the userId
      },
    },
    {
      $group: {
        _id: { $month: "$dateObj" },
        totalBooking: { $sum: 1 },
      },
    },
    {
      $project: {
        month: {
          $dateToString: {
            format: "%b", // Use %b for abbreviated month name
            date: {
              $dateFromParts: { year: Number(year), month: "$_id", day: 1 },
            },
          },
        },
        totalBooking: 1,
        _id: 0,
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Merge with monthsOfYear array to include all months in the result
  const finalResult = monthsOfYear.map((month) => {
    const match = result.find(
      (item) =>
        item.month ===
        new Date(`${year}-${month}-01`).toLocaleString("en", { month: "short" })
    );
    return {
      month: new Date(`${year}-${month}-01`).toLocaleString("en", {
        month: "short",
      }),
      totalBooking: match ? match.totalBooking : 0,
    };
  });

  return finalResult;
};

const bookAtableForEvent = async (BookingData: TBook) => {
  const payload: any = { ...BookingData };
  if (payload?.event === "null") delete payload.event;
  if (BookingData?.event) payload["ticket"] = generateBookingNumber();
  const day = moment(payload?.date).format("dddd");
  if (Number(payload?.seats) > 10) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "If you want to book more than 10 seats, please contact the restaurant owner."
    );
  }
  const restaurant: any = await Restaurant.findById(payload?.restaurant);
  // check if restaurant booked or open
  const bookingTime = moment(payload.date);
  // check closing and opening time
  validateBookingTime(restaurant, bookingTime);
  // check the restaurant avilable that day
  checkRestaurantAvailability(restaurant, day, payload?.time);
  const totalTables = await Table.find({
    restaurant: payload.restaurant,
    seats: Number(payload.seats),
  }).countDocuments();
  const expireHours = calculateEndTime(payload?.time);
  // retrive book tables
  const bookedTables: any = await Booking.find({
    date: moment(payload?.date).format("YYYY-MM-DD"),
    restaurant: payload?.restaurant,
    status: "active",
    time: { $lt: expireHours },
    endTime: { $gt: payload?.time },
  });
  // conditionally check avilable tables
  if (bookedTables?.length >= totalTables) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No tables avilable for booking during this time. please choose different time and seats"
    );
  }

  const findTable: any = await Table.aggregate([
    {
      $match: {
        restaurant: new Types.ObjectId(payload?.restaurant),
        seats: Number(payload?.seats),
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
    date: moment(payload?.date).format("YYYY-MM-DD"),
    table: findTable[0]?._id,
    endTime: calculateEndTime(payload?.time),
    restaurant: payload?.restaurant,
    id: generateBookingNumber(),
  };

  // find user
  const user = await User.findById(payload?.user).select(
    "fullName phoneNumber email"
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const result = await Unpaidbooking.create(data);
  // const notificationData = [
  //   {
  //     receiver: payload?.user,
  //     message: messages.booking,
  //     refference: result?._id,
  //     model_type: modeType.Booking,
  //   },
  // ];

  // await Coin.findOneAndUpdate(
  //   { customer: user }, // Search condition
  //   { $inc: { coins: 10 } }, // Increment the coins by 10 if the document exists
  //   { new: true, upsert: true } // Insert if no document found, and return the updated document
  // );
  // send message to the customer
  // const customerSmsData = {
  //   phoneNumbers: [`+230${user?.phoneNumber}`],
  //   mediaUrl:
  //     "https://bookatable.mu/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.71060dcf.png&w=640&q=75",
  //   bodyValues: [
  //     user.fullName,
  //     restaurant?.name,
  //     result?.date,
  //     result?.time,
  //     findTable[0]?.seats,
  //   ],
  //   buttonUrl: "https://bookatable.mu",
  // };
  // const vendorSmsData = {
  //   phoneNumbers: [`+230${restaurant?.helpLineNumber1}`],
  //   mediaUrl:
  //     "https://bookatable.mu/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.71060dcf.png&w=640&q=75",
  //   bodyValues: [
  //     user.fullName,
  //     restaurant?.name,
  //     result?.date,
  //     result?.time,
  //     findTable[0]?.seats,
  //   ],
  //   buttonUrl: "https://bookatable.mu",
  // };

  // await sendWhatsAppMessageToCustomers(smsData);
  // send message to the vendor
  // await notificationServices.insertNotificationIntoDb(notificationData);
  // await sendWhatsAppMessageToCustomers(customerSmsData);
  // await sendWhatsAppMessageToVendors(vendorSmsData);
  const emailContext = {
    name: user?.fullName,
    email: user?.email,
    date: payload?.date,
    seats: payload?.seats,
    arrivalTime: payload?.time,
    restaurant: restaurant?.name,
    address: restaurant?.address,
  };
  // await sendReservationEmail(
  //   "reservationTemplate", // The name of your template file without the .html extension
  //   user?.email,
  //   "Your Reservation was successful",
  //   emailContext
  // );
  // return result;
  return result;
};

const getSingleUnpaiEventBooking = async (id: string) => {
  const result = await Unpaidbooking.findById(id)
    .populate({
      path: "table",
      select: "tableNo seats",
    })
    .populate({
      path: "event",
      select: "title entryFee",
    });
  return result;
};
export const bookingServies = {
  bookAtable,
  getAllBookings,
  getAllBookingByOwner,
  getSingleBooking,
  updateBooking,
  getBookingDetailsWithMenuOrder,
  getAllBookingsForAdmin,
  deletebooking,
  getBookingStatics,
  bookAtableForEvent,
  getSingleUnpaiEventBooking,
};
