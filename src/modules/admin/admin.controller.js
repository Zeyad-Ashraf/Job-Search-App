import { Router } from "express";
import * as adminService from "./admin.service.js";
import { asyncHandler } from "../../utils/index.js";
import { authentication, authorization } from "../../middlewares/auth.js";
import { validation } from "../../middlewares/validation.js";
import * as adminSchema from "./admin.Schema.js";
import { enumRole } from "../../DB/models/user.model.js";
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from "./graphSchema.js";
import expressPlayground from "graphql-playground-middleware-express";

const adminRouter = Router();

adminRouter.patch("/banOrUnbanUser", authentication, authorization([enumRole.admin]), validation(adminSchema.banOrUnbanUserSchema), asyncHandler(adminService.banOrUnbanUser));

adminRouter.patch("/banOrUnbanCompany", authentication, authorization([enumRole.admin]), validation(adminSchema.banOrUnbanUserSchema), asyncHandler(adminService.banOrUnbanCompany));

adminRouter.patch("/approveCompany", authentication, authorization([enumRole.admin]), validation(adminSchema.banOrUnbanUserSchema), asyncHandler(adminService.approveCompany));

adminRouter.use("/graphql", createHandler({ schema }));

adminRouter.use("/playground", expressPlayground.default({ endpoint: "/admin/graphql" }));

export default adminRouter;