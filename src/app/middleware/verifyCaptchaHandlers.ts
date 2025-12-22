import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../config';
import AppError from '../error/AppError';
import {
  RECAPTCHA_EXPECTED_ACTION,
  RECAPTCHA_MIN_SCORE,
} from '../modules/user/user.constant';
import { RecaptchaResponse } from '../modules/user/user.interface';

export const verifyCaptchaToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { captchaToken } = req.body;

    // Check if token is provided
    if (!captchaToken) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Captcha token is required');
    }

    // Check if secret key is configured
    const secretKey = config.google_captcha_secret_key;
    if (!secretKey) {
      console.error('GOOGLE_CAPTCHA_SECRET_KEY is not configured');
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Captcha verification is not configured'
      );
    }

    // Verify the token with Google
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const params = new URLSearchParams({
      secret: secretKey,
      response: captchaToken,
      remoteip: req.ip || req.socket.remoteAddress || '',
    });

    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to verify captcha with Google servers'
      );
    }

    const data = (await response.json()) as RecaptchaResponse;

    // Check for verification success
    if (!data.success) {
      console.warn('Captcha verification failed:', {
        errorCodes: data['error-codes'],
        ip: req.ip,
      });
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Captcha verification failed. Please try again.'
      );
    }

    // For reCAPTCHA v3: verify score and action
    if (data.score !== undefined) {
      if (data.score < RECAPTCHA_MIN_SCORE) {
        console.warn('Captcha score too low:', {
          score: data.score,
          ip: req.ip,
        });
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Captcha verification failed. Suspicious activity detected.'
        );
      }

      if (data.action && data.action !== RECAPTCHA_EXPECTED_ACTION) {
        console.warn('Captcha action mismatch:', {
          expected: RECAPTCHA_EXPECTED_ACTION,
          received: data.action,
          ip: req.ip,
        });
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Captcha verification failed. Invalid action.'
        );
      }
    }

    // Verification successful - proceed to next middleware
    next();
  } catch (error) {
    // Pass AppError instances to error handler
    if (error instanceof AppError) {
      next(error);
      return;
    }

    // Log unexpected errors and send generic message
    console.error('Unexpected error during captcha verification:', error);
    next(
      new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'An error occurred during captcha verification'
      )
    );
  }
};
