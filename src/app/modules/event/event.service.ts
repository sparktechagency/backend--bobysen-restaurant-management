import axios from "axios";
import httpStatus from "http-status";
import mongoose, { Schema } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { Booking } from "../booking/booking.model";
import { Ievents } from "./event.interface";
import { Event, EventPayment } from "./event.model";

const insertEventIntoDb = async (payload: Ievents) => {
  const result = await Event.create(payload);
  return result;
};

const getAllEvents = async (query: Record<string, any>) => {
  const eventModel = new QueryBuilder(
    Event.find().populate({ path: "restaurant", select: "name address" }),
    query
  )
    .filter()
    .search([])
    .fields()
    .paginate()
    .sort();
  const data = await eventModel.modelQuery;
  const meta = await eventModel.countTotal();

  return {
    data,
    meta,
  };
};

const getSingleEvent = async (id: string) => {
  const result = await Event.findById(id).populate("restaurant");
  return result;
};

const updateEvent = async (id: string, payload: Partial<Ievents>) => {
  const result = await Event.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const geteventForVendor = async (vendorId: string) => {
  const events = await Event.aggregate([
    {
      $lookup: {
        from: "restaurants", // The collection name for restaurants
        localField: "restaurant", // The field in Event that references the restaurant
        foreignField: "_id", // The _id field in the restaurant collection
        as: "restaurantDetails", // The field where the joined data will be stored
      },
    },
    {
      // Unwind the joined data (since it's an array after $lookup)
      $unwind: "$restaurantDetails",
    },
    {
      // Match the events where the vendor inside the restaurant matches the provided vendorId
      $match: {
        "restaurantDetails.vendor": new Schema.Types.ObjectId(vendorId), // Match vendorId
      },
    },
    {
      // Optionally, project only the fields you want to return
      $project: {
        _id: 1, // Event ID
        title: 1, // Event name
        image: 1, // Event date
        date: 1,

        "restaurantDetails.name": 1, // Restaurant name
        "restaurantDetails.vendor": 1, // Restaurant vendor
      },
    },
  ]);

  return events;
};

const loadPaymentZoneForEvent = async (payload: any) => {
  const { unpaidBooking, user, token, ...others } = payload;
  const data = {
    ...others,
    additional_params: [
      {
        param_name: "user",
        param_value: user,
      },
      {
        param_name: "token",
        param_value: token,
      },
      {
        param_name: "unpaidBooking",
        param_value: unpaidBooking,
      },

      {
        param_name: "type",
        param_value: "event",
      },
    ],
    request_mode: "simple",
    touchpoint: "native_app",
  };

  let response;
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic " +
      Buffer.from(
        "datamation_8a9ft5:kqK1hvT5Mhwu7t0KavYaJctDW5M8xruW"
      ).toString("base64"),
  };

  const authObj = {
    authentify: {
      id_merchant: "5s0aOiRIH43yqkffzpEbpddlqGzMCoyY",
      id_entity: "w3QAeoMtLJROmlIyXVgnx1R6y7BgNo8t",
      id_operator: "oeRH43c5RoQockXajPTo0TA5YW0KReio",
      operator_password: "NUvxccs0R0rzKPoLlIPeet21rarpX0rk",
    },
  };

  try {
    response = await axios.post(
      "https://api.mips.mu/api/load_payment_zone",
      { ...authObj, ...data },
      {
        headers: headers,
      }
    );
    // Handle the response data as needed
  } catch (error: any) {
    throw new Error(error);
    // Handle the error
  }

  return response?.data?.answer;
};

const makePaymentForEvent = async (payload: any) => {
  console.log("event payload", payload);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //  first of all post a booking
    const bookAtable = await Booking.create([payload], { session });
    if (!bookAtable[0]) {
      throw new AppError(httpStatus.BAD_REQUEST, "Event not booked");
    }

    // data format for event

    const data = {
      user: payload?.user,
      event: payload?.event,
      booking: bookAtable[0]?._id,
      transactionId: payload?.transactionId,
    };
    // insert payment information to the eventpayment model
    const insertEventPayment = await EventPayment.create([data], { session });
    if (!insertEventPayment[0]) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "payment not added into database"
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return bookAtable[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error as any);
  }
};

export const eventsServices = {
  insertEventIntoDb,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  geteventForVendor,
  loadPaymentZoneForEvent,
  makePaymentForEvent,
};
