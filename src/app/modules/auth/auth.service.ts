import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import moment from "moment";

import config from "../../config";
import AppError from "../../error/AppError";
import { sendEmail } from "../../utils/mailSender";
import { generateOtp } from "../../utils/otpGenerator";
import { User } from "../user/user.model";
import { TchangePassword, Tlogin, TresetPassword } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";
const login = async (payload: Tlogin) => {
  const user = await User.isUserExist(payload?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }
  if (user?.status === "pending") {
    await User.findByIdAndDelete(user?._id);
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // throw new AppError(httpStatus.BAD_REQUEST, "user is not verified");

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
    user,
    accessToken,
    refreshToken,
  };
};
// change password

const changePassword = async (id: string, payload: TchangePassword) => {
  console.log(payload);
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
        passwordChangedAt: new Date(),
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
    expiresIn: "2m",
  });
  const currentTime = new Date();
  const otp = generateOtp();
  const expiresAt = moment(currentTime).add(2, "minute");
  await User.findByIdAndUpdate(user?._id, {
    verification: {
      otp,
      expiresAt,
    },
  });
  await sendEmail(
    email,
    "Welcome to Bookatable – Your Smart Dining Experience Awaits!",
    `<div style="font-family: Arial, sans-serif; text-align: center;">
      <a href="YOUR_LOGO_LINK_HERE">
        <img src="https://i.ibb.co.com/HfDrLRrK/1024x1024bb.png" alt="Bookatable Logo" style="width: 150px; height: auto;">
      </a>
      <h2>Welcome to Bookatable!</h2>
      <p>Thank you for registering with Bookatable! You’ve just unlocked a simple yet intelligent way to book your favorite restaurants effortlessly.</p>
      
      <h3>Your OTP is <strong>${otp}</strong></h3>
      <p>(Valid until ${expiresAt.toLocaleString()})</p>
  
      <p>With Bookatable, you can do more than just reserve a table – you can pre-order your meal, prepay, and enjoy a seamless dining experience without any hassle when you arrive.</p>
  
      <p>We look forward to serving you a delightful experience.</p>
      
      <p><strong>Bon appétit!</strong></p>
      <p>The Bookatable Team</p>
    </div>`
  );

  // send the mail here
  return { email, token };
};

const resetPassword = async (token: string, payload: TresetPassword) => {
  console.log(token, payload);
  let decode;
  try {
    decode = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;
  } catch (err) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Session has exipired. please try again"
    );
  }
  const user = await User.findById(decode?.id).select("isDeleted verification");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }
  if (new Date() > user?.verification?.expiresAt) {
    throw new AppError(httpStatus.FORBIDDEN, "sessions expired");
  }
  if (!user?.verification?.status) {
    throw new AppError(httpStatus.FORBIDDEN, "Otp is not verified yet!");
  }
  if (payload?.newPassword !== payload?.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password and Confirm password do not match!"
    );
  }
  const hashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  const result = await User.findByIdAndUpdate(decode?.id, {
    password: hashedPassword,
    passwordChangedAt: new Date(),
    verification: {
      otp: 0,
      status: false,
    },
  });
  return result;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid

  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  const { userId } = decoded;

  const user = await User.IsUserExistbyId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }
  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};
export const authServices = {
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
};
