export type QueryObject = {
  [key: string]: any;
};

export type Tlogin = {
  email: string;
  password: string;
};
export type TchangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
