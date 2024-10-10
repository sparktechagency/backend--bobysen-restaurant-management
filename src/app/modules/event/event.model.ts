import { model, Schema } from "mongoose";
import { Ievents } from "./event.interface";

const EventsSchema: Schema = new Schema<Ievents>({
  title: {
    type: String,
    required: true,
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

EventsSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

EventsSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

EventsSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Event = model<Ievents>("Event", EventsSchema);
