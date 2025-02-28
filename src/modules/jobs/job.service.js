import {jobModel} from "../../DB/models/job.model.js";
import { companyModel } from "../../DB/models/company.model.js";



export const addJob = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills} = req.body;

    const { companyId } = req.params;

    const company = await companyModel.findOne({ _id: companyId, isDeleted: false, approvedByAdmin: true });

    if (!company)
        return next(new Error("company not found", { cause: 404 }));

    if (!company.createdBy.equals(req.user._id) && !company.HRs.includes(req.user._id))
        return next(new Error("you don't have permission to do this action", { cause: 401 }));

    const newJob = await jobModel.create({jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, addedBy: req.user._id, companyId});

    return res.status(201).json({ message: "done" });
}



export const updateJob = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const { companyId, jobId } = req.params;

    const company = await companyModel.findOne({ _id: companyId, isDeleted: false, approvedByAdmin: true });

    if (!company)
        return next(new Error("company not found", { cause: 404 }));

    if (!company.createdBy.equals(req.user._id) && !company.HRs.includes(req.user._id))
        return next(new Error("you don't have permission to do this action", { cause: 401 }));

    const updateJob = await jobModel.findOneAndUpdate({ _id: jobId, isDeleted: { $exists: false }, companyId }, { ...req.body, updatedBy: req.user._id }, { new: true });

    if (!updateJob)
        return next(new Error("job not found", { cause: 404 }));

    return res.status(201).json({ message: "done" });
}



export const deleteJob = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const { companyId, jobId } = req.params;

    const company = await companyModel.findOne({ _id: companyId, isDeleted: false, approvedByAdmin: true });

    if (!company)
        return next(new Error("company not found", { cause: 404 }));

    if (!company.createdBy.equals(req.user._id) && !company.HRs.includes(req.user._id))
        return next(new Error("you don't have permission to do this action", { cause: 401 }));

    const deletedJob = await jobModel.findOneAndDelete({ _id: jobId, isDeleted: { $exists: false }, companyId });

    if (!deletedJob)
        return next(new Error("job not found", { cause: 404 }));

    return res.status(201).json({ message: "done" });
}



export const getAllJobs = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const { companyId } = req.query;

    const company = await companyModel.findOne({ _id: companyId, isDeleted: false, approvedByAdmin: true }).populate({
        path: "jobs",
        select: "jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills -_id -companyId"
    });

    if (!company)
        return next(new Error("company not found", { cause: 404 }));

    return res.status(201).json({ message: "done" ,jobs:company.jobs});
}



export const filterJobs = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const { ...filters } = req.query;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const matchSearch = {}

    if (filters.workingTime) matchSearch.workingTime = filters.workingTime;
    if (filters.jobLocation) matchSearch.jobLocation = filters.jobLocation;
    if (filters.seniorityLevel) matchSearch.seniorityLevel = filters.seniorityLevel;
    if (filters.jobTitle) matchSearch.jobTitle = filters.jobTitle;
    if (filters.technicalSkills) matchSearch.technicalSkills = filters.technicalSkills;

    const jobs = await jobModel.find({ isDeleted: { $exists: false }, ...matchSearch }).limit(limit).skip(skip)
        .select("jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills -_id");

    return res.status(201).json({ message: "done" ,jobs});
}



export const displayJobs = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    let { page, limit } = req.query;
    page = page * 1 || 1;
    limit = limit * 1 || 10;
    const skip = (page - 1) * limit;

    const jobs = await jobModel.find({ closed: { $exists: false } }).limit(limit).skip(skip).sort({ createdAt: -1 }).populate({
        path: "companyId",
        select: "companyName -_id"
    })

    if (!jobs)
        return next(new Error("company not found", { cause: 404 }));

    return res.status(201).json({ message: "done", jobs });
}



export const getJob = async (req, res, next) => {
    
    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const { jobId } = req.params;

    const job = await jobModel.findOne({ _id: jobId, closed: { $exists: false } }).populate({
        path: "companyId",
        select: "companyName -_id"
    })

    if (!job)
        return next(new Error("job not found or job is closed", { cause: 404 }));

    return res.status(201).json({ message: "done", job });
}



