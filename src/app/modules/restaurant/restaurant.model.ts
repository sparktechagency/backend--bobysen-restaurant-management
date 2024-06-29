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
    helpLineNumber1: {
      type: Number,
      required: [true, "helpLine Number is required"],
    },
    helpLineNumber2: {
      type: Number,
      // required:[true,"helpLine Number is required"]
    },
    map: {
      type: {
        latitude: Number,
        longitude: Number,
        coordinates: [Number],
      },
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
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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
      default: true,
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
    avgReviews: {
      type: Number,
      default: 0,
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
RestaurantSchema.index({ map: "2dsphere" });

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
