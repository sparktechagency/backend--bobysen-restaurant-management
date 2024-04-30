import { Schema, model } from "mongoose";
import { TCart } from "./cart.interface";
import { TMenuCategory } from "../menuCategory/menuCategory.interface";

const cartSchema = new Schema<TCart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user information is required"],
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "user information is required"],
    },
    items: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "Menu",
          required: [true, "menu information is required"],
        },
        quantity: Number,
        amount: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "amount information is required"],
    },
    date: {
      type: String,
      required: [true, "date information is required"],
    },
    discount: {
      type: Number,
      required: [true, "discount amount is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: false,
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
