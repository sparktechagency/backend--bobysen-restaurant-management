import { model, Schema } from "mongoose";
import { TBooking } from "./booking.interface";

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
    table: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: [true, "table id is required"],
    },
    date: {
      type: Date,
      required: [true, "date is required"],
    },
    time: {
      type: String,
      required: [true, "time is required"],
    },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = model<TBooking>("Booking", bookingSchema);
