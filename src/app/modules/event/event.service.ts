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

export const eventsServices = {
  insertEventIntoDb,
  getAllEvents,
  getSingleEvent,
  updateEvent,
};
