import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import { UserStatus } from "./user.constant";
import config from "../../config";
import bcrypt from "bcrypt";
import { boolean } from "zod";
const adminSchema = new Schema<TUser, UserModel>(
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
    needsPasswordChange: {
      type: Boolean,
      default: false,
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
        select: 0,
      },
      expiresAt: {
        type: Date,
        select: 0,
      },
      status: {
        type: Boolean,
        default: false,
        select: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

// set '' after saving password
adminSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});
// filter out deleted documents
adminSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

adminSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email: email }).select("+password");
};
adminSchema.statics.IsUserExistbyId = async function (id: string) {
  return await User.findById(id).select("+password");
};
adminSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>("User", adminSchema);
