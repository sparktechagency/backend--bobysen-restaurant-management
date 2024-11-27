import httpStatus from "http-status";
import moment from "moment";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../error/AppError";
import { notificationServices } from "../notification/notificaiton.service";
import { messages } from "../notification/notification.constant";
import { modeType } from "../notification/notification.interface";
import { WalletSearchableFields } from "./wallet.constant";
import { Wallet } from "./wallet.model";

const sendAmountToVendor = async (id: string, payload: any) => {
  const { amount, method, percentage } = payload || {};

  // Calculate the subtotal after discount
  const subTotal = Math.ceil(
    (Number(amount) * (100 - Number(percentage))) / 100
  );

  // Find the wallet by ID and populate the owner field
  const findWallet = await Wallet.findById(id).populate("owner");
  const date = moment().format("YYYY-MM-DD");

  // Condition for insufficient balance
  if (Number(amount) > Number(findWallet?.due)) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Insufficient balance");
  }

  // Prepare the notification object
  const notification = [
    {
      receiver: findWallet?.owner?._id!,
      message: messages.payment,
      refference: findWallet?._id,
      model_type: modeType.Wallet,
    },
  ];

  // Update the wallet by decrementing the due amount and incrementing the total paid amount
  const result = await Wallet.findByIdAndUpdate(
    id,
    {
      $inc: {
        due: -Number(amount), // Decrease the due amount by the payment amount
        totalPaid: Number(amount), // Increment totalPaid by the actual paid amount
      },
      lastPaymentDate: new Date(),
      $push: {
        paymentHistory: {
          method: method,
          amount: Number(amount),
          date,
          subTotal: subTotal, // Store the discounted amount in payment history
          percentage: Number(percentage),
        },
      },
    },
    { new: true }
  );

  // Insert the notification into the database
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
