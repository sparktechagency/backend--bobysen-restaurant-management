import axios from "axios";
import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../error/AppError";
import { Cart } from "../cart/cart.model";
import { Wallet } from "../wallet/wallet.model";
const insertOrderIntoDb = async (payload: any) => {
  const { cart, amount, id_order, status, id_form, checksum } = payload || {};
  //   const formatedAmount = Number(amount) / 100;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // update due
    const updateDue = await Cart.findByIdAndUpdate(
      cart,
      {
        $inc: {
          totalDue: -Number(amount),
          totalPaid: Number(amount),
        },
        $set: {
          status: "paid",
        },
        $push: {
          transactions: {
            amount,
            date: new Date(),
            orderId: id_order,
            status,
            id_form,
            checksum,
          },
        },
      },
      { session, new: true }
    );
    if (!updateDue) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to update Data");
    }

    const result = await Wallet.findOneAndUpdate(
      { owner: updateDue?.owner },
      {
        $inc: {
          amount: Number(amount),
          due: Number(amount),
        },
      },
      { upsert: true, new: true, session }
    );
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong");
    }

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const getImnCallback = async (received_crypted_data: any) => {
  console.log(received_crypted_data);
  let response;
  const obj = {
    authentify: {
      id_merchant: "5s0aOiRIH43yqkffzpEbpddlqGzMCoyY",
      id_entity: "w3QAeoMtLJROmlIyXVgnx1R6y7BgNo8t",
      id_operator: "oeRH43c5RoQockXajPTo0TA5YW0KReio",
      operator_password: "NUvxccs0R0rzKPoLlIPeet21rarpX0rk",
    },
    salt: "SQt1DtGZceeCjO59cDAL82sAQcyj8uxocTxMkLeC6mzvfjILIq",
    cipher_key:
      "aAUJIcMPgVpK9zAB9tVjDWLIglibzgerTeiSU1ACEgu2GXIl1mYMj0wVNjs9XUEdIEysG2G7GNAxYpaGpqveDgVMaNzVZsHNrNdZ",
    received_crypted_data: received_crypted_data,
  };

  try {
    response = await axios.post(
      "https://api.mips.mu/api/decrypt_imn_data",
      obj,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              "datamation_8a9ft5:kqK1hvT5Mhwu7t0KavYaJctDW5M8xruW"
            ).toString("base64"),
          "Content-Type": "application/json",
        },
      }
    );
    // if (response?.data?.status === "success") {
    //   const { amount, checksum, id_order } = response?.data;
    //   await insertOrderIntoDb({ amount, checksum, id_order });
    // }

    // Handle the decrypted data as needed
  } catch (error: any) {
    throw new Error(error);
    // Handle the error
  }
  return response?.data;
};

// load payment zone

const loadPaymentZone = async (payload: any) => {
  let response;
  const headers = {
    "content-type": "application/json",
    Authorization:
      "Basic " +
      Buffer.from(
        "datamation_8a9ft5:kqK1hvT5Mhwu7t0KavYaJctDW5M8xruW"
      ).toString("base64"),
  };

  const authObj = {
    authentify: {
      id_merchant: "5s0aOiRIH43yqkffzpEbpddlqGzMCoyY",
      id_entity: "w3QAeoMtLJROmlIyXVgnx1R6y7BgNo8t",
      id_operator: "oeRH43c5RoQockXajPTo0TA5YW0KReio",
      operator_password: "NUvxccs0R0rzKPoLlIPeet21rarpX0rk",
    },
  };

  try {
    response = await axios.post(
      "https://api.mips.mu/api/load_payment_zone",
      { ...authObj, ...payload },
      {
        headers: headers,
      }
    );
    // Handle the response data as needed
  } catch (error: any) {
    throw new Error(error);
    // Handle the error
  }

  return response?.data?.answer;
};

export const orderServices = {
  insertOrderIntoDb,
  getImnCallback,
  loadPaymentZone,
};
