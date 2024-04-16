import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateOtp } from "../../utils/otpGenerator";
import moment from "moment";
import { deleteFile } from "../../utils/fileHelper";
import config from "../../config";

import jwt, { Secret } from "jsonwebtoken";

const insertUserIntoDb = async (
  payload: Partial<TUser>
): Promise<{ user: TUser; token: string }> => {
  const user = await User.isUserExist(payload.email as string);
  if (user) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "user already exist with this email"
    );
  }
  const formatedData = {
    ...payload,
    role: "user",
    status: "pending",
    verification: {
      otp: generateOtp(),
      expiresAt: moment().add(1, "minute"),
    },
  };

  const result = await User.create(formatedData);
  const jwtPayload = {
    email: payload?.email,
    id: result?._id,
  };
  const token = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
    expiresIn: "1m",
  });
  return {
    user: result,
    token: token,
  };
};

const insertVendorIntoDb = async (payload: Partial<TUser>): Promise<TUser> => {
  const user = await User.isUserExist(payload.email as string);
  if (user) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "user already exist with this email"
    );
  }
  const result = await User.create(payload);
  return result;
};

const getme = async (id: string): Promise<TUser | null> => {
  const result = await User.findById(id);
  return result;
};

const updateProfile = async (
  id: string,
  payload: Partial<TUser>
): Promise<TUser | null> => {
  const user = await User.findById(id);
  //  email update lagbe na
  if (payload?.email) {
    throw new AppError(httpStatus?.BAD_REQUEST, "email is not for update");
  }
  if (payload?.role) {
    throw new AppError(httpStatus?.BAD_REQUEST, "role is not for update");
  }
  const result = await User.findByIdAndUpdate(id, payload, { new: true });

  if (result && payload?.image) {
    await deleteFile(user?.image!);
  }
  return result;
};

export const userServices = {
  insertUserIntoDb,
  insertVendorIntoDb,
  getme,
  updateProfile,
};
