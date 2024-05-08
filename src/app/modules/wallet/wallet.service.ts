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

const sendAmountToVendor = async (id: string, payload: any) => {
  const { amount, method } = payload || {};
  const findWallet = await Wallet.findById(id).populate("owner");

  //   condition ammount
  if (Number(amount) > Number(findWallet?.amount)) {
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
        amount: Number(findWallet?.amount) - Number(amount),
        totalPaid: Number(amount),
      },
      lastPaymentDate: new Date(),
      $push: {
        paymentHistory: {
          method: method,
          amount: Number(amount),
          date: new Date(),
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

export const walletServices = {
  getAllWalletDetails,
  sendAmountToVendor,
};
