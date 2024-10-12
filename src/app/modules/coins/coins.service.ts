import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../error/AppError";
import WithDrawCoin, { Coin } from "./coins.model";

// coin service

const getAllMyCoin = async (id: string) => {
  const result = await Coin.findOne({ customer: id });
  return result;
};

const insertCoinWithDrawRequest = async (payload: any) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const result = await WithDrawCoin.create([payload], { session });
    if (!result) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "Something went wrong.please try again"
      );
    }
    await Coin.findOneAndUpdate(
      { customer: payload.customer },
      {
        $inc: {
          coins: Number(-payload.coins),
        },
      },
      { new: true, session }
    );

    await session.commitTransaction();
    await session.endSession();
    return result[0];
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const getAllCoinsWithdrawRequests = async (query: Record<string, any>) => {
  const result = await WithDrawCoin.find(query).populate({
    path: "customer",
    select: "fullName email image phoneNumber",
  });
  return result;
};

const getSingleCoinsWithdrawRequest = async (id: string) => {
  const result = await WithDrawCoin.findById(id);
  return result;
};

const updateCoinsWithdrawRequest = async (id: string, payload: any) => {
  console.log(id, payload);
  const result = await WithDrawCoin.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const coinService = {
  getAllMyCoin,
};

export const coinWithDrawServices = {
  insertCoinWithDrawRequest,
  getAllCoinsWithdrawRequests,
  getSingleCoinsWithdrawRequest,
  updateCoinsWithdrawRequest,
};
