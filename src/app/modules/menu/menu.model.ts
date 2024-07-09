import { Schema, model } from "mongoose";
import { MenuModel, TMenu, TReview } from "./menu.inteface";
const reviewSchema = new Schema<TReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: [true, "restaurant id is required"],
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: "Review",
    required: [true, "reservation  id is required"],
  },
  rating: {
    type: Number,
    required: [true, "rating is required"],
  },
  comment: {
    type: String,
    required: [true, "comment is required"],
  },
});
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
    description: {
      type: String,
      required: [true, "description is required"],
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
    available: {
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
export const Review = model<TReview>("Review", reviewSchema);
