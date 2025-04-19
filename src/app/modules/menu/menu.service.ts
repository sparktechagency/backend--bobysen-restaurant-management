import httpStatus from "http-status";
import mongoose, { PipelineStage } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { deleteFile } from "../../utils/fileHelper";
import { Booking } from "../booking/booking.model";
import { Restaurant } from "../restaurant/restaurant.model";
import { TMenu, TReview } from "./menu.inteface";
import { Menu, Review } from "./menu.model";

const insertMenuIntoDb = async (payload: TMenu): Promise<TMenu> => {
  const result = await Menu.create(payload);
  return result;
};

const getAllMenu = async (query: { [key: string]: any }) => {
  const MenuModel = new QueryBuilder(
    Menu.find().populate("category", "title"),
    query
  )
    .search(["name"])
    .filter()
    .paginate()
    .sort()
    .fields();
  const data = await MenuModel.modelQuery;
  const meta = await MenuModel.countTotal();
  return {
    data,
    meta,
  };
};

const getSingleMenu = async (id: string, userId: string) => {
  const result = await Menu.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "favouritelists",
        let: { menuId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                  { $in: ["$$menuId", "$menu"] },
                ],
              },
            },
          },
          {
            $project: { _id: 0 },
          },
        ],
        as: "isFavourite",
      },
    },
    {
      $addFields: {
        isFavourite: {
          $cond: {
            if: { $gt: [{ $size: "$isFavourite" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    // Project all fields from the Menu collection
    {
      $project: {
        _id: 1,
        category: 1,
        image: 1,
        restaurant: 1,
        description: 1,
        name: 1,
        price: 1,
        owner: 1,
        available: 1,
        isDeleted: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
        isFavourite: 1,
      },
    },
  ]);
  return result[0] ? result[0] : {};
};

// get all menu for vendor
const getAllTablesForOwner = async (userId: string) => {
  const result = await Restaurant.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        _id: 1,
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
  ]);

  return result[0];
};

// update menu here
const updateMenu = async (id: string, payload: Partial<TMenu>) => {
  const findMenu = await Menu.findById(id);
  const result = await Menu.findByIdAndUpdate(id, payload, { new: true });
  if (payload?.image && result) {
    await deleteFile(findMenu?.image as string);
  }
  return result;
};
const deleteMenu = async (id: string) => {
  const result = await Menu.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    { new: true }
  );
  return result;
};

// get Reivew

const insertReviewIntoDb = async (payload: TReview): Promise<TReview> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updateBooking = await Booking.findByIdAndUpdate(
      payload?.booking,
      {
        isReviewed: true,
      },
      { session }
    );
    if (!updateBooking) {
      throw new AppError(httpStatus.NOT_ACCEPTABLE, "Something went wrong.");
    }

    const review = await Review.create([payload], { session });
    if (!review[0]) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Something went wrong. Please try again"
      );
    }

    const restaurantId = review[0]?.restaurant;

    // Perform aggregation and update outside the transaction
    const pipeline = [
      { $match: { restaurant: restaurantId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
        },
      },
    ];

    const result = await Review.aggregate(pipeline);
    if (result.length > 0) {
      let { avgRating } = result[0];

      // Ensure only one decimal place
      avgRating = Number(avgRating.toFixed(1));

      const submit = await Restaurant.findByIdAndUpdate(restaurantId, {
        avgReviews: avgRating,
      });
    }

    await session.commitTransaction();
    return review[0];
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err);
  } finally {
    await session.endSession();
  }
};

const getAllReviews = async (restaurantId: string) => {
  const pipeline = [
    {
      $match: {
        restaurant: new mongoose.Types.ObjectId(restaurantId.toString()),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
        reviews: {
          $push: {
            rating: "$rating",
            comment: "$comment",
            _id: "$_id",
            user: {
              name: "$userDetails.fullName",
              image: "$userDetails.image",
            },
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$count" },
        ratings: {
          $push: {
            rating: "$_id",
            count: "$count",
            reviews: "$reviews",
          },
        },
      },
    },
    {
      $unwind: "$ratings",
    },
    {
      $addFields: {
        "ratings.avg": {
          $multiply: [
            {
              $divide: ["$ratings.count", "$total"],
            },
            100,
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $first: "$total" },
        ratingOverview: {
          $push: {
            k: { $concat: [{ $toString: "$ratings.rating" }, "star"] },
            v: {
              count: "$ratings.count",
              avg: "$ratings.avg",
            },
          },
        },
        reviews: { $push: "$ratings.reviews" },
      },
    },
    {
      $project: {
        _id: 0,
        ratingOverview: { $arrayToObject: "$ratingOverview" },
        reviews: {
          $reduce: {
            input: "$reviews",
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] },
          },
        },
      },
    },
  ];

  const result = await Review.aggregate(pipeline as PipelineStage[]);
  return result[0];
};

const updateReviews = async (id: string) => {
  const result = await Review.deleteOne({ _id: id });
  return result;
};
export const menuServices = {
  insertMenuIntoDb,
  getAllMenu,
  getSingleMenu,
  getAllTablesForOwner,
  updateMenu,
  deleteMenu,
};

export const reviewServices = {
  insertReviewIntoDb,
  getAllReviews,
  updateReviews,
};
