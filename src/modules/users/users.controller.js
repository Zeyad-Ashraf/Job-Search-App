import { Router } from "express";
import * as userService from "./users.service.js";
import { asyncHandler } from "../../utils/index.js";
import { validation } from "../../middlewares/validation.js";
import * as userSchema from "./users.schema.js";
import { authentication } from "../../middlewares/auth.js";
import { fileTypes, multerCloudinary } from "../../middlewares/multer.js";
import jobRouter from "../jobs/job.controller.js";

const userRouter = Router({ mergeParams: true });



userRouter.patch("/updateProfile", authentication, validation(userSchema.updateProfileSchema), asyncHandler(userService.updateProfile));

userRouter.get("/getProfile", authentication, asyncHandler(userService.getProfile));

userRouter.get("/getAnotherProfile/:id", authentication, validation(userSchema.userProfileSchema), asyncHandler(userService.getAnotherProfile));

userRouter.patch("/updatePassword", authentication, validation(userSchema.updatePasswordSchema), asyncHandler(userService.updatePassword));

userRouter.post("/uploadProfilePic", multerCloudinary([...fileTypes.image]).single("profilePic"), authentication, validation(userSchema.uploadFileSchema), asyncHandler(userService.uploadProfilePic));

userRouter.post("/uploadCoverPic", multerCloudinary([...fileTypes.image]).single("coverPic"), authentication, validation(userSchema.uploadFileSchema), asyncHandler(userService.uploadCoverPic));

userRouter.delete("/deleteProfilePic", authentication, asyncHandler(userService.deleteProfilePic));

userRouter.delete("/deleteCoverPic", authentication, asyncHandler(userService.deleteCoverPic));

userRouter.delete("/softDelete", authentication, validation(userSchema.deleteAccountSchema), asyncHandler(userService.softDeleteAccount));

userRouter.use("/jobs", jobRouter);



export default userRouter;