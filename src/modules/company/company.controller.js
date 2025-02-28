import { Router } from "express";
import * as companyService from "./company.service.js";
import { asyncHandler } from "../../utils/index.js";
import { authentication } from "../../middlewares/auth.js";
import { validation } from "../../middlewares/validation.js";
import * as companySchema from "./company.Schema.js";
import { fileTypes, multerCloudinary } from "../../middlewares/multer.js"
import jobRouter from "../jobs/job.controller.js";

const companyRouter = Router({ mergeParams: true });

companyRouter.post("/addCompany", multerCloudinary([...fileTypes.image,...fileTypes.pdf]).single("legalAttachment"),authentication,validation(companySchema.addCompanySchema), asyncHandler(companyService.addCompany));

companyRouter.patch("/updateCompany/:id", authentication, validation(companySchema.updateCompanySchema), asyncHandler(companyService.updateCompany));

companyRouter.delete("/softDelete/:id", authentication, validation(companySchema.softDeleteCompanySchema), asyncHandler(companyService.softDeleteCompany));

companyRouter.get("/findCompany", authentication, validation(companySchema.findCompany), asyncHandler(companyService.findCompany));

companyRouter.get("/findCompanJobs/:id", authentication, asyncHandler(companyService.getCompanyJobs));

companyRouter.post("/uplaodLogo",multerCloudinary([...fileTypes.image]).single("logo"), authentication, validation(companySchema.uplaodLogoSchema), asyncHandler(companyService.uploadLogo));

companyRouter.post("/uplaodCover", multerCloudinary([...fileTypes.image]).single("coverPic"), authentication, validation(companySchema.uplaodLogoSchema), asyncHandler(companyService.uploadCoverPic));

companyRouter.delete("/deleteLogo", authentication, validation(companySchema.deleteLogoPicSchema), asyncHandler(companyService.deleteLogoPic));

companyRouter.delete("/deleteCover", authentication, validation(companySchema.deleteLogoPicSchema), asyncHandler(companyService.deleteCoverPic));

companyRouter.post("/:companyId/addHr/:userId", authentication, asyncHandler(companyService.addHr));

companyRouter.use("/:companyId/jobs", jobRouter);


export default companyRouter;