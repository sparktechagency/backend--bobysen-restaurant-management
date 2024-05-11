import mongoose from "mongoose";
import { Cart } from "../cart/cart.model";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import { Wallet } from "../wallet/wallet.model";

const insertOrderIntoDb = async (payload: any) => {
  const { cart, amount, id_order, status, id_form, checksum } = payload || {};
  //   const formatedAmount = Number(amount) / 100;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // update due
    const updateDue = await Cart.findByIdAndUpdate(
      cart,
      {
        $inc: {
          totalDue: -Number(amount),
          totalPaid: Number(amount),
        },
        $set: {
          status: "paid",
        },
        $push: {
          transactions: {
            amount,
            date: new Date(),
            orderId: id_order,
            status,
            id_form,
            checksum,
          },
        },
      },
      { session, new: true }
    );
    if (!updateDue) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to update Data");
    }

    const result = await Wallet.findOneAndUpdate(
      { owner: updateDue?.owner },
      {
        $inc: {
          amount: Number(amount),
          due: Number(amount),
        },
      },
      { upsert: true, new: true, session }
    );
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong");
    }

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

export const orderServices = {
  insertOrderIntoDb,
};
