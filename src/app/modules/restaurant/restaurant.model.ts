import { Schema, model } from "mongoose";
import { TRestaurant } from "./restaurant.inerface";
const RestaurantSchema = new Schema<TRestaurant>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    location: {
      type: String,
      required: [true, "location is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "owner id is required"],
    },
    images: [
      {
        url: {
          type: String,
        },
      },
    ],
    close: {
      from: Date,
      to: Date,
    },
    reviewStatus: {
      type: Boolean,
      required: [true, "review status is required"],
    },
    sunday: {
      openingTime: {
        type: String,
        required: [true, "opening time for Sunday is required"],
      },
      closingTime: {
        type: String,
        required: [true, "closing time for Sunday is required"],
      },
    },
    monday: {
      openingTime: {
        type: String,
        required: [true, "opening time for Monday is required"],
      },
      closingTime: {
        type: String,
        required: [true, "closing time for Monday is required"],
      },
    },
    tuesday: {
      openingTime: {
        type: String,
        required: [true, "opening time for Tuesday is required"],
      },
      closingTime: {
        type: String,
        required: [true, "closing time for Tuesday is required"],
      },
    },
    wednesday: {
      openingTime: {
        type: String,
        required: [true, "opening time for Wednesday is required"],
      },
      closingTime: {
        type: String,
        required: [true, "closing time for Wednesday is required"],
      },
    },
    thursday: {
      openingTime: {
        type: String,
        required: [true, "opening time for Thursday is required"],
      },
      closingTime: {
        type: String,
        required: [true, "closing time for Thursday is required"],
      },
    },
    friday: {
      openingTime: {
        type: String,
        required: [true, "opening time for Friday is required"],
      },
      closingTime: {
        type: String,
        required: [true, "closing time for Friday is required"],
      },
    },
    saturday: {
      openingTime: {
        type: String,
        required: [true, "opening time for Saturday is required"],
      },
      closingTime: {
        type: String,
        required: [true, "closing time for Saturday is required"],
      },
    },
    totalReviews: {
      type: Number,
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
RestaurantSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

RestaurantSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

RestaurantSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
export const Restaurant = model<TRestaurant>("Restaurant", RestaurantSchema);
