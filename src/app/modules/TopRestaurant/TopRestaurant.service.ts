import httpStatus from "http-status";
import { PipelineStage } from "mongoose";
import AppError from "../../error/AppError";
import { TtopRestaurant } from "./TopRestaurant.interface";
import { TopRestaurant } from "./TopRestaurant.model";
import {
  topRestaurantExcludeFileds,
  topRestaurantSearchableFileds,
} from "./topRestaurant.constant";

const insertTopRestaurantIntoDb = async (payload: TtopRestaurant) => {
  const { restaurant } = payload;
  const findTopRestaurant = await TopRestaurant.findOne({ restaurant });
  if (findTopRestaurant) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This Restaurant already in the list"
    );
  }
  const result = await TopRestaurant.create(payload);
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
  pipeline.push(
    {
      $match: {
        isExpired: false,
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
  if (query?.searchTerm) {
    pipeline.push({
      $match: {
        $or: topRestaurantSearchableFileds.map((field) => ({
          [field]: { $regex: query.searchTerm, $options: "i" },
        })),
      },
    });
  }

  // Dynamic filter stage
  const filterConditions = Object.fromEntries(
    Object.entries(query).filter(
      ([key]) => !topRestaurantExcludeFileds.includes(key)
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

  const total = data.length;
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
};
