import mongoose, { PipelineStage } from "mongoose";
import {
  RessearchAbleFields,
  restaurantExcludeFields,
} from "./restaurant.constant";
import { TRestaurant } from "./restaurant.inerface";
import { Restaurant } from "./restaurant.model";

const insertRestaurantIntoDb = async (
  payload: TRestaurant
): Promise<TRestaurant> => {
  const result = await Restaurant.create(payload);
  return result;
};

const getAllRestaurant = async (query: Record<string, any>) => {
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
        menus: { $size: "$menus" },
        address: 1, // Count total menus
      },
    },
  ]);
  return result;
};
// get all restaurants for phone

// const getAllRestaurantsForUser = async (query: Record<string, any>) => {
//   const RestaurantModel = new QueryBuilder(Restaurant.find(), query)
//     .search(["name"])
//     .filter()
//     .fields()
//     .sort()
//     .paginate();

//   const data = await RestaurantModel.modelQuery;
//   const meta = await RestaurantModel.countTotal();
//   return { data, meta };
// };
const getAllRestaurantsForUser = async (query: Record<string, any>) => {
  const pipeline: PipelineStage[] = [];
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Add geospatial stage if latitude and longitude are provided
  if (query?.latitude && query?.longitude) {
    pipeline.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [
            parseFloat(query?.longitude),
            parseFloat(query?.latitude),
          ],
          // coordinates: [90.42308159679541, 23.77634120911962],
        },
        key: "location",
        // query: {},
        maxDistance: parseFloat(10000 as unknown as string) * 1609,
        distanceField: "dist.calculated",
        spherical: true,
      },
    });
  }
  // search term
  if (query?.searchTerm) {
    pipeline.push({
      $match: {
        $or: RessearchAbleFields.map((field) => ({
          [field]: { $regex: query.searchTerm, $options: "i" },
        })),
      },
    });
  }

  // // get all current restaurant as well
  pipeline.push({
    $match: {
      isDeleted: false,
    },
  });

  // console.log(pipeline);
  // // Dynamic filter stage
  const filterConditions = Object.fromEntries(
    Object.entries(query).filter(
      ([key]) => !restaurantExcludeFields.includes(key)
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
  const data = await Restaurant.aggregate(pipeline);

  // Fetch the total count for pagination meta
  const total = await Restaurant.countDocuments(data);

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
        address: 1,
        _id: 1,
        name: 1,
        location: 1,
        description: 1,
        status: 1,
        helpLineNumber1: 1,
        helpLineNumber2: 1,
        images: 1,
        reviewStatus: 1,
        map: 1,
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

const getAllRestaurantForAdmin = async (query: Record<string, any>) => {
  const pipeline: any[] = [
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $addFields: {
        formattedDate: {
          $dateToString: {
            format: "%Y-%m-%d", // specify the desired format
            date: "$createdAt", // the date field you want to format
          },
        },
      },
    },
    {
      $project: {
        name: 1,
        owner: "$owner.fullName",
        email: "$owner.email",
        location: 1,
        createdAt: "$formattedDate",
        status: 1,
        address: 1,
      },
    },
  ];
  if (query?.searchTerm) {
    const searchRegex = new RegExp(query.searchTerm, "i");
    const searchMatchStage = {
      $or: RessearchAbleFields.map((field) => ({
        [field]: { $regex: searchRegex },
      })),
    };
    pipeline.push({ $match: searchMatchStage });
  }
  const result = await Restaurant.aggregate(pipeline);
  return result;
};
const nearByRestaurant = async (query: Record<string, any>) => {
  // const pipeline: PipelineStage[] = [];
  const { maxDistance = 10000, longitude, latitude } = query;
  // If geospatial data is provided, add $geoNear stage

  const pipeline: PipelineStage[] = [
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
          // coordinates: [90.42308159679541, 23.77634120911962],
        },
        key: "location",
        maxDistance: parseFloat(maxDistance) * 1609,
        distanceField: "dist.calculated",
        spherical: true,
      },
    },
  ];

  // If searchTerm is provided, add $match stage for name search
  // if (query?.searchTerm) {
  //   pipeline.push({
  //     $match: {
  //       name: new RegExp(query?.searchTerm, "i"), // Case-insensitive regex search
  //     },
  //   });
  // }
  const result = await Restaurant.aggregate(pipeline);

  return result;
};

const getAllRestaurantId = async (query: any) => {
  const result = await Restaurant.find(query).select("name");
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
  getAllRestaurantForAdmin,
  deleteFiles,
  nearByRestaurant,
  getAllRestaurantId,
};
