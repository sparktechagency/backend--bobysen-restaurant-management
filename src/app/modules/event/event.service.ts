import { Schema } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { Ievents } from "./event.interface";
import { Event } from "./event.model";

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

export const eventsServices = {
  insertEventIntoDb,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  geteventForVendor,
};
