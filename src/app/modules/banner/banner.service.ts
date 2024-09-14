import { Ibanner } from "./banner.interrface";
import Banner from "./banner.model";

const insetBannerIntoDb = async (payload: Ibanner) => {
  const result = await Banner.create(payload);
  return result;
};

const getAllBanner = async () => {
  const result = await Banner.find({});
  return result;
};

const deleteBanner = async (id: string) => {
  const result = await Banner.findByIdAndDelete(id);
  return result;
};

export const bannerservices = {
  insetBannerIntoDb,
  getAllBanner,
  deleteBanner,
};
