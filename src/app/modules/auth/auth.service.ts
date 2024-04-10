import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { Tlogin } from "./auth.interface";
import config from "../../config";
import { createToken } from "./auth.utils";
const insertUserinToDB = async (payload: TUser): Promise<TUser> => {
  const isUserExist = await User.isUserExist(payload.email);
  if (isUserExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "user already exist with this email"
    );
  }
  const result = await User.create(payload);
  return result;
};

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
