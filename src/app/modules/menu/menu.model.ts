import { Query, Schema, model } from "mongoose";
import { MenuModel, TMenu } from "./menu.inteface";

const menuSchema = new Schema<TMenu, MenuModel>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: [true, "menu category is required"],
    },
    image: {
      type: String,
      required: [true, "menu image is required"],
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "restaurant is required"],
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    price: {
      type: Number,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, "owner information  is required"],
    },
    avilable: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
// filter out deleted documents
menuSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

menuSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
menuSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
export const Menu = model<TMenu, MenuModel>("Menu", menuSchema);
