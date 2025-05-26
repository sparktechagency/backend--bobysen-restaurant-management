import { model, Schema } from "mongoose";
import { Icategory } from "./category.interface";

const categorySchema = new Schema<Icategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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
categorySchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

categorySchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

categorySchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
export const Category = model<Icategory>("Category", categorySchema);
