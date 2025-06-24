import httpStatus from "http-status";
import moment from "moment";
import mongoose, { PipelineStage } from "mongoose";
import AppError from "../../error/AppError";
import { Restaurant } from "../restaurant/restaurant.model";
import { TtopRestaurant } from "./TopRestaurant.interface";
import { TopRestaurant } from "./TopRestaurant.model";
import {
  topRestaurantExcludeFileds,
  topRestaurantSearchableFileds,
} from "./topRestaurant.constant";

const insertTopRestaurantIntoDb = async (payload: TtopRestaurant) => {
  const { restaurant, startDate, endDate } = payload;
  if (moment(endDate).isSameOrBefore(startDate)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The end date must be later than the start date. Please select a valid end date."
    );
  }
  const findTopRestaurant = await TopRestaurant.findOne({ restaurant });

  if (findTopRestaurant) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This Restaurant already in the list"
    );
  }

  // get location field
  const getLocation = await Restaurant.findById(restaurant).select("location");

  const result = await TopRestaurant.create({
    ...payload,
    location: getLocation?.location,
  });
  return result;
};

const getSingleTopRestaurant = async (id: string) => {
  const result = await TopRestaurant.findById(id).populate("restaurant");
  return result;
};
const updateTopRestaurant = async (
  id: string,
  payload: Partial<TtopRestaurant>
) => {
  const result = await TopRestaurant.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};
const deleteTopRestaurantFromList = async (id: string) => {
  const result = await TopRestaurant.findByIdAndDelete(id);
  return result;
};

const getAllTopRestaurants = async (query: Record<string, any>) => {
  const pipeline: PipelineStage[] = [];
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  if (query?.latitude && query?.longitude) {
    pipeline.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [
            parseFloat(query?.longitude),
            parseFloat(query?.latitude),
          ],
        },
        key: "location",
        query: {},
        maxDistance:
          parseFloat(query?.maxDistance ?? (10000 as unknown as string)) * 1609,
        distanceField: "dist.calculated",
        spherical: true,
      },
    });
  }

  pipeline.push(
    {
      $match: {
        isExpired: false,
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "restaurants",
        localField: "restaurant",
        foreignField: "_id",
        as: "restaurant",
      },
    },
    { $unwind: "$restaurant" }
  );

  // Dynamic search
  if (query?.searchTerm) {
    pipeline.push({
      $match: {
        $or: topRestaurantSearchableFileds.map((field) => ({
          [field]: { $regex: query.searchTerm, $options: "i" },
        })),
      },
    });
  }
  // Category filter (with ObjectId validation)
  if (query?.category && query.category !== "null" && query.category !== "") {
    try {
      const catId = new mongoose.Types.ObjectId(query.category);
      pipeline.push({
        $match: { "restaurant.category": catId },
      });
    } catch (e) {
      pipeline.push({ $match: { _id: null } });
    }
  }
  // Dynamic filter stage, but exclude 'category' to avoid double filtering
  const filterConditions = Object.fromEntries(
    Object.entries(query).filter(
      ([key]) => !topRestaurantExcludeFileds.includes(key) && key !== "category"
    )
  );
  if (Object.keys(filterConditions).length > 0) {
    pipeline.push({
      $match: filterConditions,
    });
  }

  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  // Fetch the data
  const data = await TopRestaurant.aggregate(pipeline);

  // Fetch the total count for pagination meta
  const total = await TopRestaurant.countDocuments({
    isExpired: false,
    isDeleted: false,
  });
  const totalPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
  };
};

const getAllTopRestaurantForTable = async (query: Record<string, any>) => {
  const pipeline: PipelineStage[] = [];
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // GeoNear stage (optional, if needed)
  if (query?.latitude && query?.longitude) {
    pipeline.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [
            parseFloat(query?.longitude),
            parseFloat(query?.latitude),
          ],
        },
        key: "location",
        maxDistance:
          parseFloat(query?.maxDistance ?? (10000 as unknown as string)) * 1609,
        distanceField: "dist.calculated",
        spherical: true,
      },
    });
  }

  // Match valid top restaurants
  pipeline.push({
    $match: {
      isExpired: false,
      isDeleted: false,
    },
  });

  // Lookup to fetch restaurant data
  pipeline.push({
    $lookup: {
      from: "restaurants", // Name of the restaurant collection
      localField: "restaurant", // Field in TopRestaurant referencing Restaurant
      foreignField: "_id", // Field in Restaurant that matches the reference
      as: "restaurantData",
    },
  });

  // Unwind the restaurant data to flatten it
  pipeline.push({
    $unwind: "$restaurantData",
  });

  // Replace root to return only restaurant data
  pipeline.push({
    $replaceRoot: {
      newRoot: "$restaurantData",
    },
  });

  // Dynamic search on restaurant fields
  if (query?.searchTerm) {
    pipeline.push({
      $match: {
        $or: topRestaurantSearchableFileds.map((field) => ({
          [field]: { $regex: query.searchTerm, $options: "i" },
        })),
      },
    });
  }

  // Dynamic filters for restaurant fields
  const filterConditions = Object.fromEntries(
    Object.entries(query).filter(
      ([key]) => !topRestaurantSearchableFileds.includes(key)
    )
  );

  if (Object.keys(filterConditions).length > 0) {
    pipeline.push({
      $match: filterConditions,
    });
  }

  // Add pagination
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  // Fetch the data
  const data = await TopRestaurant.aggregate(pipeline);

  // Fetch the total count for pagination meta
  const total = await TopRestaurant.countDocuments({
    isExpired: false,
    isDeleted: false,
  });

  const totalPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
  };
};

export const topRestaurantServices = {
  insertTopRestaurantIntoDb,
  getAllTopRestaurants,
  getSingleTopRestaurant,
  updateTopRestaurant,
  deleteTopRestaurantFromList,
  getAllTopRestaurantForTable,
};
