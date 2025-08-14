import axios from 'axios';
import httpStatus from 'http-status';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import moment from 'moment';
import config from '../../config';
import AppError from '../../error/AppError';
import { bookingServies } from '../booking/booking.service';
import { User } from '../user/user.model';

const verifyOtp = async (token: string, otp: string | number) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'you are not authorized!');
  }
  let decode;
  try {
    decode = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;
  } catch (err) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'session has expired.please try to submit otp withing 5 minute'
    );
  }
  const user = await User.findById(decode?.id).select(
    'verification status phoneNumber'
  );
  console.log(user);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'user not found');
  }
  // if (new Date() > user?.verification?.expiresAt) {
  //   throw new AppError(
  //     httpStatus.FORBIDDEN,
  //     "otp has expired. Please resend it"
  //   );
  // }
  // if (Number(otp) !== Number(user?.verification?.otp)) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "otp did not match");
  // }

  const options = {
    method: 'GET',
    url: config.verify_otp_url,
    params: { otp: otp, mobile: user?.phoneNumber },
    headers: { authkey: config.whatsapp_auth_key },
  };
  // console.log(options);
  const { data } = await axios.request(options);
  if (data?.message === 'OTP expired') {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, data?.message);
  } else if (data?.message === 'OTP not match') {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, data?.message);
  } else if (data?.message === 'Mobile no. already verified') {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, data?.message);
  } else {
    const updateUser = await User.findByIdAndUpdate(
      user?._id,
      {
        $set: {
          status: user?.status === 'active' ? user?.status : 'active',
          verification: {
            otp: 0,
            expiresAt: moment().add(5, 'minute'),
            status: true,
          },
        },
      },
      { new: true }
    );
    const jwtPayload = {
      email: user?.email,
      id: user?._id,
    };
    const jwtToken = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
      expiresIn: '5m',
    });
    return { user: updateUser, token: jwtToken };
  }
};

const resendOtp = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'user not found');
  }
  // const otp = generateOtp();
  // const expiresAt = moment().add(2, "minute");
  // const updateOtp = await User.findByIdAndUpdate(user?._id, {
  //   $set: {
  //     verification: {
  //       otp,
  //       expiresAt,
  //       status: false,
  //     },
  //   },
  // });
  // if (!updateOtp) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "failed to resend otp. please try again later"
  //   );
  // }
  const smsData = {
    mobile: user?.phoneNumber,
    template_id: config?.template_id,
    authkey: config?.whatsapp_auth_key,
    realTimeResponse: 1,
  };
  await otpServices.sendOtpForWidget(smsData);
  const jwtPayload = {
    email: user?.email,
    id: user?._id,
  };
  const token = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
    expiresIn: '5m',
  });
  // await sendEmail(
  //   user?.email,
  //   "Your One Time Otp",
  //   `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  //   <h2 style="color: #4CAF50;">Your One Time OTP</h2>
  //   <div style="background-color: #f2f2f2; padding: 20px; border-radius: 5px;">
  //     <p style="font-size: 16px;">Your OTP Is: <strong>${otp}</strong></p>
  //     <p style="font-size: 14px; color: #666;">This OTP is valid until: ${expiresAt.toLocaleString()}</p>
  //   </div>
  // </div>`
  // );
  return { token };
};

const sendotpforverification = async (payload: any) => {
  console.log(payload);
  const options = {
    method: 'POST',
    url: config.otp_url,
    headers: { 'Content-Type': 'application/json' },
    params: {
      mobile: payload?.mobile,
      otp_expiry: 5,
      template_id: payload?.templateId,
      authkey: payload?.authkey,
      realTimeResponse: payload?.realTimeResponse,
    },
  };

  try {
    const { data } = await axios.request(options);
    return data;
  } catch (error) {
    console.log(
      'Error Sending OTP:',
      // @ts-ignore
      error.response ? error.response.data : error.message
    );
  }
};
const sendOtpForWidget = async (payload: any) => {
  const options = {
    method: 'POST',
    url: config.otp_url,
    headers: { 'Content-Type': 'application/json' },
    params: {
      mobile: payload?.mobile,
      otp_expiry: 5,
      template_id: payload?.templateId,
      authkey: payload?.authkey,
      realTimeResponse: payload?.realTimeResponse,
    },
  };

  try {
    const { data } = await axios.request(options);
    return data;
  } catch (error) {
    console.error(
      'Error Sending OTP:',
      // @ts-ignore
      error.response ? error.response.data : error.message
    );
  }
};

const verifyOtpForWidget = async (payload: any) => {
  const options = {
    method: 'GET',
    url: config.verify_otp_url,
    params: { otp: payload?.otp, mobile: payload?.mobile },
    headers: { authkey: config.whatsapp_auth_key },
  };

  const { data } = await axios.request(options);
  if (data?.message === 'OTP expired') {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, data?.message);
  } else if (data?.message === 'OTP not match') {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, data?.message);
  } else {
    await bookingServies.bookAtable(payload);
  }
  return data;
};

// Example usage:

export const otpServices = {
  verifyOtp,
  sendotpforverification,
  resendOtp,
  sendOtpForWidget,
  verifyOtpForWidget,
};
