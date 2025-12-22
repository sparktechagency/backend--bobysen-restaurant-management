export const USER_ROLE = {
  admin: 'admin',
  vendor: 'vendor',
  user: 'user',
  all: ['admin', 'vendor', 'user'].join(','),
};

export const UserStatus = ['pending', 'active', 'blocked'];

export const blockedDomains = [
  'yerato.com',
  'mcpservers.one',
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'throwawaymail.com',
  'dispostable.com',
  'maildrop.cc',
  'fakeinbox.com',
  'getnada.com',
  'temp-mail.org',
  'yopmail.com',
  'trashmail.com',
  'mintemail.com',
  'mailcatch.com',
  'mailnesia.com',
  'spamgourmet.com',
  'mailinator.com',
  'rosuper.com',
  'cropimage.me',
  'zongusa.com',
  'supdrop.com',
  'ssgperf.com',
  'screwingpuzzle.com',
  'videnox.com',
  'delaeb.com',
  'eryod.com',
  'mcpservers.one',
];

// reCAPTCHA v3 configuration constants
export const RECAPTCHA_MIN_SCORE = 0.5; // Adjust based on your security needs (0.0 - 1.0)
export const RECAPTCHA_EXPECTED_ACTION = 'submit'; // Should match the action in your frontend
