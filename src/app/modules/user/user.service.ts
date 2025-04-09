import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt, { Secret } from "jsonwebtoken";
import moment from "moment";
import QueryBuilder from "../../builder/QueryBuilder";
import config from "../../config";
import AppError from "../../error/AppError";
import { deleteFile } from "../../utils/fileHelper";
import { sendEmail } from "../../utils/mailSender";
import { generateOtp } from "../../utils/otpGenerator";
import { createToken } from "../auth/auth.utils";
import { otpServices } from "../otp/otp.service";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { validatePhoneNumber } from "./user.utils";

const insertUserIntoDb = async (
  payload: Partial<TUser>
): Promise<{ user: TUser; token: string }> => {
  const user = await User.isUserExist(payload.email as string);
  // if (user?.isDeleted) {
  //   throw new AppError(httpStatus.FORBIDDEN, "This account is Deleted.");
  // }
  if (user) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "user already exist with this email"
    );
  }

  if (!validatePhoneNumber(payload?.phoneNumber!)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Phone number is invalid");
  }

  const otp = generateOtp();
  const expiresAt = moment().add(3, "minute");
  const formatedData = {
    ...payload,
    role: "user",
    status: "pending",
    verification: {
      otp,
      expiresAt,
    },
  };

  const result = await User.create(formatedData);
  const jwtPayload = {
    email: payload?.email,
    id: result?._id,
  };
  const token = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
    expiresIn: "3m",
  });
  const smsData = {
    mobile: payload?.phoneNumber,
    template_id: config?.otp_tempalte_id,
    authkey: config?.whatsapp_auth_key,
    realTimeResponse: 1,
  };
  console.log("dhaka");
  // await sendEmail(
  //   payload?.email!,
  //   "Welcome to Bookatable – Your Smart Dining Experience Awaits!",
  //   `<div style="font-family: Arial, sans-serif; text-align: center;">
  //     <a href="YOUR_LOGO_LINK_HERE">
  //       <img src="https://i.ibb.co.com/HfDrLRrK/1024x1024bb.png" alt="Bookatable Logo" style="width: 150px; height: auto;">
  //     </a>
  //     <h2>Welcome to Bookatable!</h2>
  //     <p>Thank you for registering with Bookatable! You’ve just unlocked a simple yet intelligent way to book your favorite restaurants effortlessly.</p>

  //     <h3>Your OTP is <strong>${otp}</strong></h3>
  //     <p>(Valid until ${expiresAt.toLocaleString()})</p>

  //     <p>With Bookatable, you can do more than just reserve a table – you can pre-order your meal, prepay, and enjoy a seamless dining experience without any hassle when you arrive.</p>

  //     <p>We look forward to serving you a delightful experience.</p>

  //     <p><strong>Bon appétit!</strong></p>
  //     <p>The Bookatable Team</p>
  //   </div>`
  // );
  await otpServices.sendotpforverification(smsData);
  return {
    user: result,
    token: token,
  };
};

//  insert user from the widget

const insertUserIntoDbFromWidget = async (payload: any) => {
  //
  const user = await User.findOne({ email: payload?.email, type: "widget" });
  if (user) {
    await User.findByIdAndDelete(user?._id);
  }
  const data = {
    ...payload,
    role: "user",
    type: "widget",
    password: "!password",
  };
  const result = await User.create(data);

  const smsData = {
    mobile: payload?.phoneNumber,
    template_id: config?.template_id,
    authkey: config?.whatsapp_auth_key,
    realTimeResponse: 1,
  };
  const otp = await otpServices.sendOtpForWidget(smsData);

  const jwtPayload = {
    userId: result._id,
    role: result.role,
  };
  const token = createToken(
    // @ts-ignore
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  return token;
};

const insertVendorIntoDb = async (payload: Partial<TUser>): Promise<TUser> => {
  const user = await User.isUserExist(payload.email as string);
  if (user) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "user already exist with this email"
    );
  }
  const formatedData = {
    ...payload,
    needsPasswordChange: true,
  };

  const result = await User.create(formatedData);
  await sendEmail(
    result?.email,
    "Your Gmail And Password Is:",
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #4CAF50;">Your One Time OTP</h2>
    <div style="background-color: #f2f2f2; padding: 20px; border-radius: 5px;">
      <p style="font-size: 16px;">Your Gmail Is: <strong>${result?.email}</strong></p>
      <p style="font-size: 14px; color: #666;">Your Login Password Is: ${payload?.password}</p>
    </div>
  </div>`
  );
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

const getAllusers = async (query: Record<string, any>) => {
  const userModel = new QueryBuilder(User.find(), query)
    .search(["email", "fullName"])
    .filter()
    .paginate()
    .sort()
    .fields();
  const data = await userModel.modelQuery;
  const meta = await userModel.countTotal();
  return {
    data,
    meta,
  };
};

const getSingleUser = async (id: string) => {
  const result = await User.findById(id);
  return result;
};
const updateUser = async (
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

const deleteAccount = async (id: string, password: string) => {
  const user = await User.IsUserExistbyId(id);

  const isPasswordMatched = await bcrypt.compare(password, user?.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Password does not match!");
  }
  const result = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
      },
    },
    {
      new: true,
    }
  );
  return result;
};

export const userServices = {
  insertUserIntoDb,
  insertVendorIntoDb,
  getme,
  updateProfile,
  getAllusers,
  updateUser,
  getSingleUser,
  deleteAccount,
  insertUserIntoDbFromWidget,
};
