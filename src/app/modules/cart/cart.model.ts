import { Schema, model } from "mongoose";
import { statusValue, TCart } from "./cart.interface";
const cartSchema = new Schema<TCart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user information is required"],
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "user information is required"],
    },
    items: [
      {
        menu: {
          type: Schema.Types.ObjectId,
          ref: "Menu",
          required: [true, "menu information is required"],
        },
        quantity: Number,
        amount: Number,
      },
    ],
    subTotal: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, "amount information is required"],
      default: 0,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    totalDue: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      required: [true, "date information is required"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(statusValue),
      default: statusValue.unpaid,
    },
  },
  { timestamps: true }
);

// filter out deleted documents
cartSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

cartSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

cartSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Cart = model<TCart>("Cart", cartSchema);
