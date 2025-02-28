import { Router } from "express";
import * as userService from "./user.service.js";
import { asyncHandler } from "../../utils/index.js";
import { validation } from "../../middlewares/validation.js";
import * as userSchema from "./user.Schema.js";

const userRouter = Router();


userRouter.post("/signup", validation(userSchema.signUpSchema), asyncHandler(userService.signUp));

userRouter.post("/confrim",validation(userSchema.confrimEmailSchema), asyncHandler(userService.confirmEmail));

userRouter.get("/resend/:token", asyncHandler(userService.resendOtp));

userRouter.post("/signin", validation(userSchema.signInSchema), asyncHandler(userService.singIn));

userRouter.post("/forgetPass", asyncHandler(userService.forgetPassword));

userRouter.post("/resetPass", validation(userSchema.resetPassSchema), asyncHandler(userService.resetPassword));

userRouter.post("/refreshToken", asyncHandler(userService.refreshToken));

userRouter.post("/loginWithGmail", asyncHandler(userService.loginWithGmail));


export const authRouter = userRouter;