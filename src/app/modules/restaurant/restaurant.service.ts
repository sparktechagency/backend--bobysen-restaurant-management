import QueryBuilder from "../../builder/QueryBuilder";
import { TRestaurant } from "./restaurant.inerface";
import { Restaurant } from "./restaurant.model";

const insertRestaurantIntoDb = async (
  payload: TRestaurant
): Promise<TRestaurant> => {
  const result = await Restaurant.create(payload);
  return result;
};

const getAllRestaurant = async (query: { [key: string]: any }) => {
  const RestaurantModel = new QueryBuilder(
    Restaurant.find().populate("owner"),
    query
  )
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
  const result = await Restaurant.findById(id).populate("owner");
  return result;
};
// update restaurant here

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
export const restaurantServices = {
  insertRestaurantIntoDb,
  getAllRestaurant,
  getSingleRestaurant,
  deleteRestaurant,
};
