import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { Wallet } from "./wallet.model";
import {
  modeType,
  TNotification,
} from "../notification/notification.interface";
import { messages } from "../notification/notification.constant";
import parseData from "../../middleware/parseData";
import { notificationServices } from "../notification/notificaiton.service";
import moment from "moment";

const sendAmountToVendor = async (id: string, payload: any) => {
  const { amount, method, percentage } = payload || {};
  const subTotal = Math.ceil(
    (Number(amount) * (100 - Number(percentage))) / 100
  );

  const findWallet = await Wallet.findById(id).populate("owner");
  const date = moment().format("YYYY-MM-DD");
  //   condition ammount
  if (Number(amount) > Number(findWallet?.due)) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Insufficient balance");
  }

  const notification = [
    {
      receiver: findWallet?.owner?._id!,
      message: messages.payment,
      refference: findWallet?._id,
      model_type: modeType.Wallet,
    },
  ];
  const result = await Wallet.findByIdAndUpdate(
    id,
    {
      $inc: {
        due: Number(findWallet?.amount) - Number(amount),
        totalPaid: Number(subTotal),
      },
      lastPaymentDate: new Date(),
      $push: {
        paymentHistory: {
          method: method,
          amount: Number(amount),
          date,
          subTotal: subTotal,
          percentage: Number(percentage),
        },
      },
    },
    { new: true }
  );

  await notificationServices.insertNotificationIntoDb(notification);
  return result;
};

const getAllWalletDetails = async (query: Record<string, any>) => {
  console.log(query);
  const walletModel = new QueryBuilder(Wallet.find().populate("owner"), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();
  const data = await walletModel.modelQuery;
  const meta = await walletModel.countTotal();

  return {
    data,
    meta,
  };
};

const getWalletDetailsByOwner = async () => {
  const result = await Wallet.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $unwind: "$ownerDetails",
    },
    {
      $lookup: {
        from: "restaurants",
        localField: "ownerDetails._id",
        foreignField: "owner",
        as: "restaurantDetails",
      },
    },
    {
      $unwind: "$restaurantDetails",
    },
    {
      $project: {
        owner: "$ownerDetails.fullName",
        restaurant: "$restaurantDetails.name",
        amount: 1,
        totalPaid: 1,
        due: 1,
        paymentHistory: 1,
      },
    },
  ]);
  return result;
};

const getSingleWallet = async (id: string) => {
  const result = await Wallet.findById(id);
  return result;
};
export const walletServices = {
  getAllWalletDetails,
  sendAmountToVendor,
  getWalletDetailsByOwner,
  getSingleWallet,
};
