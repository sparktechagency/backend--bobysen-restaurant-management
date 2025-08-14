import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { Secret } from 'jsonwebtoken';
import moment from 'moment';
import QueryBuilder from '../../builder/QueryBuilder';
import config from '../../config';
import AppError from '../../error/AppError';
import { deleteFile } from '../../utils/fileHelper';
import { sendEmail } from '../../utils/mailSender';
import { generateOtp } from '../../utils/otpGenerator';
import { createToken } from '../auth/auth.utils';
import { otpServices } from '../otp/otp.service';
import { TUser } from './user.interface';
import { User } from './user.model';
import { validatePhoneNumber } from './user.utils';

const insertUserIntoDb = async (
  payload: Partial<TUser>
): Promise<{ user: TUser; token: string }> => {
  // Step 1: Check if any user exists with this email
  const existingUser = await User.isUserExist(payload.email as string);

  let user: TUser;

  if (existingUser) {
    if (existingUser.type === 'website_mobile') {
      // Regular user already exists → cannot create
      throw new AppError(
        httpStatus.FORBIDDEN,
        'User already exists with this email'
      );
    } else if (existingUser.type === 'widget') {
      // Widget user exists → update info and verify account
      existingUser.fullName = payload.fullName!;
      existingUser.phoneNumber = payload.phoneNumber!;
      existingUser.password = payload.password!;
      existingUser.status = 'pending';
      existingUser.type = 'website_mobile';
      user = await existingUser.save();

      // Send OTP
      const smsData = {
        mobile: user.phoneNumber,
        template_id: config?.otp_tempalte_id,
        authkey: config?.whatsapp_auth_key,
        realTimeResponse: 1,
      };
      await otpServices.sendotpforverification(smsData);
      // Generate JWT
      const token = jwt.sign(
        { email: user.email, id: user._id },
        config.jwt_access_secret as Secret,
        { expiresIn: '3m' }
      );

      return { user, token };
    }
  }

  // Step 2: Validate phone number
  if (!validatePhoneNumber(payload?.phoneNumber!)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Phone number is invalid');
  }

  // Step 3: Generate OTP and set expiry
  const otp = generateOtp();
  const expiresAt = moment().add(3, 'minute');

  // Step 4: Prepare user data for creation (new regular user)
  const formatedData = {
    ...payload,
    role: 'user',
    type: 'website_mobile',
    status: 'pending',
    verification: { otp, expiresAt },
  };

  // Step 5: Create new regular user
  user = await User.create(formatedData);

  // Step 6: Generate JWT
  const token = jwt.sign(
    { email: user.email, id: user._id },
    config.jwt_access_secret as Secret,
    { expiresIn: '3m' }
  );

  // Step 7: Send OTP
  const smsData = {
    mobile: payload?.phoneNumber,
    template_id: config?.otp_tempalte_id,
    authkey: config?.whatsapp_auth_key,
    realTimeResponse: 1,
  };
  await otpServices.sendotpforverification(smsData);

  // Step 8: Return user and token
  return { user, token };
};

//  insert user from the widget

const insertUserIntoDbFromWidget = async (payload: any) => {
  // Check if any user exists with this email, regardless of type
  let user: any = await User.findOne({ email: payload?.email });
  if (user && user?.type != 'widget') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User already exist with same email.'
    );
  }

  let result: any;

  // Only create new user if none exists
  if (!user) {
    const data = {
      ...payload,
      role: 'user',
      type: 'widget',
      password: config.widgetPassword,
    };
    result = await User.create(data);
    user = result; // set for later use
  }

  // Send OTP regardless of whether user is new or existing
  const smsData = {
    mobile: payload?.phoneNumber,
    template_id: config?.template_id,
    authkey: config?.whatsapp_auth_key,
    realTimeResponse: 1,
  };
  await otpServices.sendOtpForWidget(smsData);

  const jwtPayload: any = {
    userId: user._id,
    role: user.role,
  };
  const token = createToken(
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
      'user already exist with this email'
    );
  }
  const formatedData = {
    ...payload,
    needsPasswordChange: true,
  };

  const result = await User.create(formatedData);
  await sendEmail(
    result?.email,
    'Your Gmail And Password Is:',
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
    throw new AppError(httpStatus?.BAD_REQUEST, 'email is not for update');
  }
  if (payload?.role) {
    throw new AppError(httpStatus?.BAD_REQUEST, 'role is not for update');
  }
  const result = await User.findByIdAndUpdate(id, payload, { new: true });

  if (result && payload?.image) {
    await deleteFile(user?.image!);
  }
  return result;
};

const getAllusers = async (query: Record<string, any>) => {
  const userModel = new QueryBuilder(User.find(), query)
    .search(['email', 'fullName'])
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
  if (payload?.email !== payload?.currentEmail) {
    const findEmail = await User.findOne({ email: payload?.email }).select(
      'email'
    );
    if (findEmail) {
      throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Duplicate email!');
    }
  }
  if (payload?.role) {
    throw new AppError(httpStatus?.BAD_REQUEST, 'role is not for update');
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
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Password does not match!');
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
