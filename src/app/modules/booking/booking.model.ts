import { model, Schema } from "mongoose";
import { TBooking } from "./booking.interface";

const unpaidBookingSchema = new Schema<TBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user information is required"],
    },
    id: {
      type: String,
      required: [true, "id is required"],
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "table id is required"],
    },

    isReviewed: {
      type: Boolean,
      default: false,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "event  is required"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    ticket: {
      type: String,
      select: 0,
    },
    table: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: [true, "table id is required"],
    },
    date: {
      type: String,
      required: [true, "date is required"],
    },
    time: {
      type: String,
      required: [true, "time is required"],
    },
    endTime: {
      type: String,
      required: [true, "end time is required"],
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const bookingSchema = new Schema<TBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user information is required"],
    },
    id: {
      type: String,
      required: [true, "id is required"],
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "table id is required"],
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },

    ticket: {
      type: String,
      select: 0,
    },
    table: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: [true, "table id is required"],
    },
    date: {
      type: String,
      required: [true, "date is required"],
    },
    time: {
      type: String,
      required: [true, "time is required"],
    },
    endTime: {
      type: String,
      required: [true, "end time is required"],
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = model<TBooking>("Booking", bookingSchema);
export const Unpaidbooking = model<TBooking>(
  "Unpaidbooking",
  unpaidBookingSchema
);
