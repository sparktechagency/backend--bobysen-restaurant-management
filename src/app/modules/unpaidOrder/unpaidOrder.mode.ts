import { model, Schema } from "mongoose";
import { IunpaidOrderSchema } from "./unpaidOrder.interface";

const unpaidOrderSchema = new Schema<IunpaidOrderSchema>(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: [true, "cart is required"],
    },

    token: {
      type: String,
      required: [true, "token is required"],
    },
    customer: {
      type: String,
      ref: "User",
      required: [true, "customer is required"],
    },
    id_order: {
      type: String,
      required: [true, "order id is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// filter out deleted documents
unpaidOrderSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

unpaidOrderSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

unpaidOrderSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
export const unpaidOrder = model<IunpaidOrderSchema>(
  "TopRestaurant",
  unpaidOrderSchema
);
