import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { TchangePassword, Tlogin, TresetPassword } from "./auth.interface";
import config from "../../config";
import { createToken, verifyToken } from "./auth.utils";
import { generateOtp } from "../../utils/otpGenerator";
import moment from "moment";
import { sendEmail } from "../../utils/mailSender";

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
    expiresIn: "1m",
  });
  const currentTime = new Date();
  const otp = generateOtp();
  const expiresAt = moment(currentTime).add(1, "minute");
  await User.findByIdAndUpdate(user?._id, {
    verification: {
      otp,
      expiresAt,
    },
  });
  await sendEmail(
    email,
    "your reset password otp is:",
    `<div><h5>your otp is: ${otp}</h5>
    <p>valid for:${expiresAt.toLocaleString()}</p>
    </div>`
  );
  // send the mail here
  return token;
};

const verifyOtp = async (token: string, otp: number) => {
  let decode;
  try {
    decode = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, "you are not authorized");
  }

  const user = await User.findById(decode?.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }
  if (user?.verification?.expiresAt < new Date()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "otp has expired. please resend it"
    );
  }
  if (user?.verification?.otp !== Number(otp)) {
    throw new AppError(httpStatus.BAD_REQUEST, "wrong otp");
  }
  const jwtPayload = {
    email: user?.email,
    id: user?._id,
  };
  const verifiedToken = jwt.sign(
    jwtPayload,
    config.jwt_access_secret as Secret,
    {
      expiresIn: "1m",
    }
  );
  const result = await User.findByIdAndUpdate(
    decode?.id,
    {
      verification: {
        status: true,
      },
    },
    { new: true }
  );
  return {
    data: result,
    token: verifiedToken,
  };
};

const resetPassword = async (token: string, payload: TresetPassword) => {
  let decode;
  try {
    decode = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, "you are not authorized");
  }
  const user = await User.findById(decode?.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }
  if (!user?.verification?.status) {
    throw new AppError(httpStatus.FORBIDDEN, "otp not verified yet!");
  }
  if (payload?.newPassword !== payload?.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "new password and confirm password do not match!"
    );
  }
  const hashedPassword = bcrypt.hash(
    payload?.newPassword,
    config.bcrypt_salt_rounds as string
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

export const authServices = {
  login,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
