import { model, Schema } from "mongoose";
import { Ibanner } from "./banner.interrface";

// Define the schema based on the Ibanner interface
const bannerSchema = new Schema<Ibanner>(
  {
    image: {
      type: String,
      required: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      // autopopulate: true, // Automatically populate restaurant when creating a new banner
    },
  },
  { timestamps: true }
);

// Create the Mongoose model from the schema
const Banner = model("Banner", bannerSchema);

export default Banner;
