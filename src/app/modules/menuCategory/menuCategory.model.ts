import { Schema, model } from "mongoose";
import { TMenuCategory } from "./menuCategory.interface";

const MenuCategorySchema = new Schema<TMenuCategory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: "",
    },
    image: {
      type: String,
      // required: [true, "image is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// filter out deleted documents
MenuCategorySchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

MenuCategorySchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

MenuCategorySchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const MenuCategory = model<TMenuCategory>(
  "MenuCategory",
  MenuCategorySchema
);
