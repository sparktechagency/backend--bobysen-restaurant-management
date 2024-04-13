import { Schema, model } from "mongoose";
import { TMenuCategory } from "./menuCategory.interface";

const MenuCategorySchema = new Schema<TMenuCategory>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: "",
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

export const MenuCategory = model<TMenuCategory>(
  "MenuCategory",
  MenuCategorySchema
);
