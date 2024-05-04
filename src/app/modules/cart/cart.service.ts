import QueryBuilder from "../../builder/QueryBuilder";
import { TCart, TRemoveItem } from "./cart.interface";
import { Cart } from "./cart.model";
import { FilterQuery } from "mongoose";

const insertItemsIntoCart = async (payload: any) => {
  const result = await Cart.findOneAndUpdate(
    {
      booking: payload.booking,
    },
    {
      ...payload,
      $push: { items: payload.item },
      $inc: {
        totalAmount: Number(payload.item.amount),
        totalDue: Number(payload.item.amount),
      },
    },
    { upsert: true, new: true }
  );
  return result;
};

const getCartItems = async (id: string) => {
  const result = await Cart.findOne({ booking: id }).populate({
    path: "items.menu",
    model: "Menu",
  });
  return result;
};
const getAllOrders = async (query: Record<string, any>) => {
  const OrderModel = new QueryBuilder(
    Cart.find().populate("items.menu booking"),
    query
  )
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await OrderModel.modelQuery;
  const meta = await OrderModel.countTotal();
  return {
    data,
    meta,
  };
};
const removeItemFromCart = async (id: string, item: TRemoveItem) => {
  const result = await Cart.findOneAndUpdate(
    { booking: id },
    {
      $pull: {
        items: { _id: item?.itemId },
      },
      $inc: {
        totalAmount: -Number(item?.amount), // Correcting the negative value
      },
    },
    { new: true } // To return the updated document
  );
  return result;
};
export const cartServices = {
  insertItemsIntoCart,
  getCartItems,
  getAllOrders,
  removeItemFromCart,
};
