import { model, Schema } from "mongoose";
import { Ievents } from "./event.interface";

const EventPaymentSchema: Schema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

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
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  entryFee: {
    type: Number,
    required: true,
  },
  images: [
    {
      url: {
        type: String,
      },
    },
  ],
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
export const EventPayment = model("EventPayment", EventPaymentSchema);
