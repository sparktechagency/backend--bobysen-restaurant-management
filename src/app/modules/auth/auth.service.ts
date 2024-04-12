import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { TchangePassword, Tlogin } from "./auth.interface";
import config from "../../config";
import { createToken, verifyToken } from "./auth.utils";
import { generateOtp } from "../../utils/otpGenerator";
import moment from "moment";

const login = async (payload: Tlogin) => {
  const user = await User.isUserExist(payload?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }
  if (user?.UserStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }
  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, "password do not match");
  }
  const jwtPayload = {
    userId: user?._id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
    user,
  };
};
// change password

const changePassword = async (id: string, payload: TchangePassword) => {
  const user = await User.IsUserExistbyId(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }
  if (!(await User.isPasswordMatched(payload?.oldPassword, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "old password do not match!");
  }
  if (payload?.newPassword !== payload?.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "old password and new password do not match"
    );
  }
  const hashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  const result = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        password: hashedPassword,
      },
    },
    { new: true }
  );
  return result;
};
// forgot password

const forgotPassword = async (email: string) => {
  const user = await User.isUserExist(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found ");
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "your account is inactive");
  }
  const jwtPayload = {
    email: email,
    id: user?._id,
  };
  const token = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
    expiresIn: "1m",
  });
  const currentTime = new Date();
  await User.findByIdAndUpdate(user?._id, {
    verification: {
      otp: generateOtp(),
      expiresAt: moment(currentTime).add(1, "minute"),
    },
  });
  // send the mail here
  return {
    token,
  };
};

export const userServices = {
  login,
  changePassword,
};
