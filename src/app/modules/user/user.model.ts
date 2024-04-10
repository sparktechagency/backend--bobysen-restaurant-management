import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import { UserStatus } from "./user.constant";
import config from "../../config";
import bcrypt from "bcrypt";
import { boolean } from "zod";
const userSchema = new Schema<TUser, UserModel>(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
    },
    fullName: {
      type: String,
      required: [true, "fullName is required"],
    },
    image: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: 0,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["admin", "vendor", "user"],
    },
    status: {
      type: String,
      enum: UserStatus,
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    verification: {
      otp: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
      status: {
        type: boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

// set '' after saving password
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.IsUserExist = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>("User", userSchema);
