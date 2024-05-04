import { FilterQuery } from "mongoose";
import { emitMessage } from "../../utils/socket";
import { TNotification } from "./notification.interface";
import { Notification } from "./notification.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { notification } from "antd";

const insertNotificationIntoDb = async (payload: Partial<TNotification>) => {
  const result = await Notification.create(payload);
  // @ts-ignore
  emitMessage(payload?.receiver, { ...payload, createdAt: result?.createdAt });
  emitMessage("661e58dd2ed150bdebb8fa84", {
    ...payload,
  });
  return result;
};

const getAllNotifications = async (query: Record<string, any>) => {
  const notificationModel = new QueryBuilder(Notification.find(), query)
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await notificationModel.modelQuery;
  const meta = await notificationModel.countTotal();
  return {
    data,
    meta,
  };
};

const markAsDone = async (id: string) => {
  const result = await Notification.updateMany(
    { receiver: id },
    {
      $set: {
        read: true,
      },
    },
    { new: true }
  );
  return result;
};

export const notificationServices = {
  insertNotificationIntoDb,
  getAllNotifications,
  markAsDone,
};
