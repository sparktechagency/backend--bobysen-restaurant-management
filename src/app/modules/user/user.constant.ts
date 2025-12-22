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
];
