import { TCart } from "./cart.interface";
import { Cart } from "./cart.model";
import { FilterQuery } from "mongoose";

const insertItemsIntoCart = async (payload: any) => {
  const result = await Cart.findOneAndUpdate(
    {
      user: payload?.user,
      date: payload?.date,
      restaurant: payload?.restaurant,
    },
    {
      ...payload,
      $push: { items: payload.item },
      $inc: { totalAmount: Number(payload.item.amount) },
    },
    { upsert: true, new: true }
  );
  return result;
};

const getCartItems = async (query: FilterQuery<any>) => {
  const result = await Cart.findOne({
    user: query?.user,
    date: query?.date,
    restaurant: query?.restaurant,
  });
  return result;
};
export const cartServices = {
  insertItemsIntoCart,
  getCartItems,
};
