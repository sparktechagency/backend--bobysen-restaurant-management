import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { TRestaurant } from "./restaurant.inerface";
import { Restaurant } from "./restaurant.model";

const insertRestaurantIntoDb = async (
  payload: TRestaurant
): Promise<TRestaurant> => {
  const result = await Restaurant.create(payload);
  return result;
};

const getAllRestaurant = async (query: Record<string, any>) => {
  console.log(query);
  const result = await Restaurant.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(query.owner),
      },
    },
    {
      $lookup: {
        from: "tables",
        localField: "_id",
        foreignField: "restaurant",
        as: "tables",
      },
    },

    {
      $lookup: {
        from: "menus",
        localField: "_id",
        foreignField: "restaurant",
        as: "menus",
      },
    },

    {
      $project: {
        name: 1,
        location: 1,
        tables: { $size: "$tables" }, // Count total tables
        menus: { $size: "$menus" }, // Count total menus
      },
    },
  ]);
  return result;
};
// get all restaurants for phone

const getAllRestaurantsForUser = async (query: Record<string, any>) => {
  const RestaurantModel = new QueryBuilder(Restaurant.find(), query)
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();
  const data = await RestaurantModel.modelQuery;
  const meta = await RestaurantModel.countTotal();
  return {
    data,
    meta,
  };
};
const getSingleRestaurant = async (id: string) => {
  const result = await Restaurant.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "users", // Assuming the owner collection name is "owners"
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: { $arrayElemAt: ["$owner", 0] },
      },
    },
    {
      $project: {
        close: 1,
        avgReviews: 1,
        _id: 1,
        name: 1,
        location: 1,
        description: 1,
        status: 1,
        images: 1,
        reviewStatus: 1,
        days: {
          $map: {
            input: [
              { day: "sunday", times: "$sunday" },
              { day: "monday", times: "$monday" },
              { day: "tuesday", times: "$tuesday" },
              { day: "wednesday", times: "$wednesday" },
              { day: "thursday", times: "$thursday" },
              { day: "friday", times: "$friday" },
              { day: "saturday", times: "$saturday" },
            ],
            as: "day",
            in: {
              day: "$$day.day",
              openingTime: { $ifNull: ["$$day.times.openingTime", "N/A"] },
              closingTime: { $ifNull: ["$$day.times.closingTime", "N/A"] },
            },
          },
        },
      },
    },
  ]);

  return result[0]; // Return the first document from the aggregation result
};

// update restaurant here

const getSingleRestaurantForOwner = async (id: string) => {
  const result = await Restaurant.findById(id).populate("owner");
  return result;
};
const deleteRestaurant = async (id: string) => {
  const result = await Restaurant.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    { new: true }
  );
  return result;
};

const updateRestaurant = async (id: string, payload: Partial<TRestaurant>) => {
  const { images, ...update } = payload;
  console.log("updated value", update);
  const result = await Restaurant.findByIdAndUpdate(
    id,
    {
      $push: {
        images: {
          $each: images,
        },
      },
      ...update,
    },
    { new: true }
  );
  return result;
};

// common function for delete files from restaurants

const deleteFiles = async (payload: any) => {
  const { restaurantId, imageId } = payload;
  console.log(payload);
  const result = await Restaurant.findByIdAndUpdate(
    restaurantId,
    {
      $pull: {
        images: {
          _id: imageId,
        },
      },
    },
    { new: true }
  );
  return result;
};
export const restaurantServices = {
  insertRestaurantIntoDb,
  updateRestaurant,
  getSingleRestaurantForOwner,
  getAllRestaurant,
  getAllRestaurantsForUser,
  getSingleRestaurant,
  deleteRestaurant,
  deleteFiles,
};
