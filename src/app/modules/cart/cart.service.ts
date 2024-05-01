import { TCart, TRemoveItem } from "./cart.interface";
import { Cart } from "./cart.model";
import { FilterQuery } from "mongoose";

const insertItemsIntoCart = async (payload: any) => {
  console.log(payload);
  const result = await Cart.findOneAndUpdate(
    {
      booking: payload.booking,
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

const getCartItems = async (id: string) => {
  const result = await Cart.findOne({ booking: id });
  return result;
};
const removeItemFromCart = async (id: string, item: TRemoveItem) => {
  const result = await Cart.findOneAndUpdate(
    { booking: id },
    {
      $pull: {
        items: { menu: item?.itemId },
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
  removeItemFromCart,
};
