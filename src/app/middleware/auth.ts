import httpStatus from "http-status";

import catchAsync from "../utils/catchAsync.js";
import jwt, { Secret } from "jsonwebtoken";

import AppError from "../error/AppError.js";
import config from "../config/index.js";
import { JwtPayload } from "jsonwebtoken";

const auth = (...userRoles: string[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "you are not authorized!");
    }
    let decode;
    try {
      decode = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, "unauthorized");
    }

    const { role, email } = decode;
    // const isUserExist = User.isUserExist(email);
    // if (!isUserExist) {
    //   throw new AppError(httpStatus.NOT_FOUND, "user not found");
    // }
    if (userRoles && !userRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized ");
    }
    req.user = decode;
    next();
  });
};
export default auth;
