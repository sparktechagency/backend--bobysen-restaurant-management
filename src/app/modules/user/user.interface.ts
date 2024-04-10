import { Model } from "mongoose";
export interface TUser {
  id: string;
  email: string;
  password: string;
  userName: string;
  fullName: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: "admin" | "vendor" | "user";
  status: "in-progress" | "blocked";
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExist(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
