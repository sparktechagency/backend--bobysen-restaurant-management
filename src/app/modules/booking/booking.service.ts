import QueryBuilder from "../../builder/QueryBuilder";
import { Booking } from "./booking.model";

const getAllBookings = async (query: Record<string, any>) => {
  const bookingModel = new QueryBuilder(Booking.find(), query)
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();
  const data = bookingModel.modelQuery;
  const meta = await bookingModel.countTotal();

  return {
    data,
    meta,
  };
};
const getSingleBooking = async (id: string) => {
  const result = await Booking.findById(id);
  return result;
};

export const bookingServies = {
  getAllBookings,
  getSingleBooking,
};
