import { model, Schema } from "mongoose";
import { Icoin } from "./coins.interface";

const coinSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming there is a Customer model to reference
      required: true,
    },
    coins: {
      type: Number,
      required: true,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CoinWithDrawSchema = new Schema<Icoin>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming there is a Customer model to reference
      required: true,
    },
    coins: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

coinSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

coinSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

coinSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
CoinWithDrawSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

CoinWithDrawSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

CoinWithDrawSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const WithDrawCoin = model<Icoin>("WithdrawCoin", CoinWithDrawSchema);
export const Coin = model("Coin", coinSchema);
export default WithDrawCoin;
