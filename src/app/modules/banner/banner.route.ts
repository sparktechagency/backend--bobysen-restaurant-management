import { Router } from "express";
import auth from "../../middleware/auth";
import fileUpload from "../../middleware/fileUpload";
import parseData from "../../middleware/parseData";
import { USER_ROLE } from "../user/user.constant";
import { bannerControllers } from "./banner.controller";
const upload = fileUpload("./public/uploads/banner");
const router = Router();
router.post(
  "/",
  upload.single("file"),
  parseData(),
  auth(USER_ROLE.admin),
  bannerControllers.insertBannerIntoDb
);
router.get("/", bannerControllers.getAllBanner);
router.delete("/:id", auth(USER_ROLE.admin), bannerControllers.deleteBanner);

export const bannerRoutes = router;
