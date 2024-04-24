import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "./user.constant";
import fileUpload from "../../middleware/fileUpload";
import parseData from "../../middleware/parseData";
const upload = fileUpload("./public/uploads/profile/");
const router = Router();
router.post(
  "/create-user",
  // upload.single("file"),
  // parseData(),
  userControllers.insertuserIntoDb
);
router.post(
  "/create-vendor",
  upload.single("file"),
  parseData(),
  userControllers.insertVendorIntoDb
);
router.get(
  "/",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.vendor),
  userControllers.getme
);
router.get(
  "/all",
  auth(USER_ROLE.vendor, USER_ROLE.admin),
  userControllers.getAllUsers
);
router.get(
  "/all",
  auth(USER_ROLE.vendor, USER_ROLE.admin),
  userControllers.getAllUsers
);
router.get(
  "/:id",
  auth(USER_ROLE.vendor, USER_ROLE.admin),
  userControllers.getsingleUser
);
router.get(
  "/update/:id",
  auth(USER_ROLE.user),
  upload.single("file"),
  parseData(),
  userControllers.updateUser
);
router.patch(
  "/:id",
  auth(USER_ROLE.user),
  upload.single("file"),
  parseData(),
  userControllers.updateProfile
);
export const userRoutes = router;
