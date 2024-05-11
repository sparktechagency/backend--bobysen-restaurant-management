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
import { WalletSearchableFields } from "./wallet.constant";

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

const getWalletDetailsByOwner = async (query: Record<string, any>) => {
  const pipeline: any[] = [];
  pipeline.push(
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
    }
  );

  if (query?.searchTerm) {
    const searchRegex = new RegExp(query.searchTerm, "i");
    const searchMatchStage = {
      $or: WalletSearchableFields.map((field) => ({
        [field]: { $regex: searchRegex },
      })),
    };
    pipeline.push({ $match: searchMatchStage });
  }
  const result = await Wallet.aggregate(pipeline);
  return result;
};

const getWalletStatics = async () => {
  const result = await Wallet.aggregate([
    {
      $group: {
        _id: null, // Group all documents
        totalDue: { $sum: "$due" }, // Calculate total due
        totalPaid: { $sum: "$totalPaid" }, // Calculate total paid
      },
    },
    {
      $project: {
        _id: 0, // Exclude _id field
        totalDue: 1, // Include totalDue
        totalPaid: 1, // Include totalPaid
        totalBalance: { $subtract: ["$totalDue", "$totalPaid"] }, // Calculate total balance (due - totalPaid)
      },
    },
  ]);
  return result[0];
};
const getSingleWallet = async (id: string) => {
  const result = await Wallet.findById(id);
  return result;
};
export const walletServices = {
  getAllWalletDetails,
  sendAmountToVendor,
  getWalletDetailsByOwner,
  getWalletStatics,
  getSingleWallet,
};
