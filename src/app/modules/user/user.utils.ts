import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import httpStatus from 'http-status';
import parsePhoneNumberFromString, { CountryCode } from 'libphonenumber-js';
import AppError from '../../error/AppError';
import { blockedDomains } from './user.constant';
export const validatePhoneNumber = (
  phoneNumber: string,
  countryCode: CountryCode = 'MU'
) => {
  const number = parsePhoneNumberFromString(phoneNumber, countryCode);
  return number && number.isValid() ? true : false;
};
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // max 5 signups per IP per hour
  message: {
    success: false,
    message: 'Too many signup attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const validateEmailDomain = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const domain = email.split('@')[1];

  if (blockedDomains.includes(domain)) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Disposable email addresses are not allowed'
    );
  }

  next();
};

/**
 * Middleware to verify Google reCAPTCHA v3 token
 * Expects the token to be in req.body.captchaToken
 */
