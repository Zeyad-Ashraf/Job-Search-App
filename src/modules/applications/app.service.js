import { applicationModel, enumApplicationStatus } from "../../DB/models/application.model.js";
import { jobModel } from "../../DB/models/job.model.js";
import cloudinary from "../../utils/cloudinary/index.js";
import { eventEmitter } from "../../utils/index.js";
import { getJob } from "../jobs/job.service.js";



export const getTheJob = getJob;

export const addAplication = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const { jobId } = req.params;

    if (!req.file)
        return next(new Error("u must choose file to upload", { cause: 400 }));

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: "Job-app/users/cv",
        user_filename: true,
        unique_filename: false
    })

    const job = await jobModel.findOne({ _id: jobId, closed: { $exists: false } });

    if (!job)
        return next(new Error("job not found or job is closed", { cause: 404 }));

    const newApplication = await applicationModel.create({ jobId, userId: req.user._id ,userCV: { secure_url, public_id }, status: "pending" });

    return res.status(201).json({ message: "done" });
}


export const getApplications = async (req, res, next) => {
    
    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const { jobId } = req.params;

    const job = await jobModel.findOne({ _id: jobId, closed: { $exists: false } }).populate([{
            path: "companyId",
            select: "companyName -_id"
        },
        {
            path: "application",
            select: "userId -_id"
        }]
    )

    if (!job)
        return next(new Error("job not found or job is closed", { cause: 404 }));

    return res.status(201).json({ message: "done", applications: job.application });
}



export const acceptApplication = async (req, res, next) => {
    
    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const { appId,jobId } = req.params;

    const hr = await jobModel.findOne({ _id: jobId, closed: { $exists: false } }).populate({
        path: "companyId"
    });

    if (!hr.companyId.HRs.includes(req.user._id))
        return next(new Error("you don't have permission to do this action", { cause: 401 }));

    const updated = await applicationModel.updateOne({ _id: appId }, { $set: { status: enumApplicationStatus.accepted } });

    eventEmitter.emit("applicationAccepted", { applicationId: appId });

    return res.status(201).json({ message: "done" });
}



export const rejectApplication = async (req, res, next) => {
    
    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const { appId,jobId } = req.params;

    const hr = await jobModel.findOne({ _id: jobId, closed: { $exists: false } }).populate({
        path: "companyId"
    });

    if (!hr.companyId.HRs.includes(req.user._id))
        return next(new Error("you don't have permission to do this action", { cause: 401 }));

    const updated = await applicationModel.updateOne({ _id: appId }, { $set: { status: enumApplicationStatus.rejected } });

    eventEmitter.emit("rejectAccepted", { applicationId: appId });

    return res.status(201).json({ message: "done" });
}