import { model, Schema } from "mongoose";

// Define the schema based on the Ibanner interface
const bannerSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
});

// Create the Mongoose model from the schema
const Banner = model("Banner", bannerSchema);

export default Banner;
