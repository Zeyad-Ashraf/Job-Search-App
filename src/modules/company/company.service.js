import { companyModel } from "../../DB/models/company.model.js";
import { enumRole } from "../../DB/models/user.model.js";
import cloudinary from "../../utils/cloudinary/index.js"
import { saveUser } from "../../utils/index.js";
import { userModel } from "../../DB/models/user.model.js";
import { jobModel } from "../../DB/models/job.model.js";

export const addCompany = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const { companyName, description, industry, address, numberOfEmployees, companyEmail, legalAttachment } = req.body;

    const company = await companyModel.findOne({ $or: [{ companyName }, { companyEmail }] });

    if (company)
        return next(new Error("company already exist", { cause: 400 }));

    let secure_url = undefined;
    let public_id = undefined;

    if (req.file) {
        const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
            folder: "Job-app/company/legalAttachment",
            user_filename: true,
            unique_filename: false
        });

        secure_url = uploadedFile.secure_url;
        public_id = uploadedFile.public_id;
    }

    const newCompany = new companyModel({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        legalAttachment: {
            secure_url,
            public_id
        },
        createdBy: req.user._id
    });

    await saveUser({ data: newCompany });

    return res.status(201).json({ message: "done"});
}



export const updateCompany = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    if (req.body.companyName || req.body.companyEmail)
        if (await companyModel.findOne({ $or: [{ companyName: req.body.companyName }, { companyEmail: req.body.companyEmail }] }))
            return next(new Error("company already exist", { cause: 400 }));

    const condition = req.user.role === enumRole.admin ? {} : { createdBy: req.user._id };

    const company = await companyModel.findOneAndUpdate({
            _id: req.params.id,
            isDeleted: { $exists: false },
            ...condition
        },
            req.body,
        {
            new: true
        }
    );

    if (!company)
        return next(new Error("company not found", { cause: 404 }));
    
    return res.status(200).json({ message: "done" });
}



export const softDeleteCompany = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const condition = req.user.role === enumRole.admin ? {} : { createdBy: req.user._id };

    const company = await companyModel.findOneAndUpdate({
            _id: req.params.id,
            isDeleted:false,
            ...condition
        },
        {
            $set: {
                isDeleted: true
            },
        },
        {
            new: true
        }
    );

    if (!company)
        return next(new Error("company not found", { cause: 404 }));

    const jobs = await jobModel.deleteMany({ companyId: company._id });
    
    return res.status(200).json({ message: "done" });
}



export const getCompanyJobs = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const findCompany = await companyModel.findOne({ _id: req.params.id, isDeleted: { $exists: false } }).populate("jobs");

    if (!findCompany)
        return next(new Error("company not found", { cause: 404 }));

    return res.status(200).json({ message: "done" ,jobs:findCompany.jobs});
}



export const findCompany = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const company = await companyModel.findOne({ companyName: req.body.companyName, isDeleted: false, approvedByAdmin: true })
        .select("companyName description industry address numberOfEmployees companyEmail createdBy -_id");

    if (!company)
        return next(new Error("company not found", { cause: 404 }));

    return res.status(200).json({ message: "done",company });
}



export const uploadLogo = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    if (!req.file)
        return next(new Error("choose pic", { cause: 400 }));

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: "Job-app/company/logo",
        user_filename: true,
        unique_filename: false
    });

    const updated = await companyModel.findOneAndUpdate({ createdBy: req.user._id }, { $set: { Logo: { secure_url, public_id } } });

    if (!updated)
        return next(new Error("you don't have permission to do this action", { cause: 401 }));

    return res.status(200).json({ message: "done" });
}



export const uploadCoverPic = async (req, res, next) => {
    
    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    if (!req.file)
        return next(new Error("choose pic", { cause: 400 }));

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: "Job-app/company/coverPic",
        user_filename: true,
        unique_filename: false
    });


    const updated = await companyModel.findOneAndUpdate({ createdBy: req.user._id }, { $set: { coverPic: { secure_url, public_id } } });

    if (!updated)
        return next(new Error("you don't have permission to do this action", { cause: 401 }));

    return res.status(200).json({ message: "done" });
}



export const deleteLogoPic = async (req, res, next) => {
    
    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const company = await companyModel.findOne({ createdBy: req.user._id });

    if (!company)
        return next(new Error("you don't have permission to do this action", { cause: 401 }));

    const deleted = await cloudinary.uploader.destroy(company.Logo.public_id)

    if (!deleted)
        return next(new Error("profile pic not found", { cause: 400 }));

    company.Logo = {};

    await saveUser({ data: company });

    return res.status(200).json({ message: "done" });
}



export const deleteCoverPic = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const company = await companyModel.findOne({ createdBy: req.user._id });

    if (!company)
        return next(new Error("you don't have permission to do this action", { cause: 401 }));

    const deleted = await cloudinary.uploader.destroy(company.coverPic.public_id)

    if (!deleted)
        return next(new Error("profile pic not found", { cause: 400 }));

    company.coverPic = {};

    await saveUser({ data: company });

    return res.status(200).json({ message: "done" });
}



export const addHr = async (req, res, next) => {

    const { companyId, userId } = req.params;

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const [company, user] = await Promise.all([
        companyModel.findOne({ _id: companyId, isDeleted: false,createdBy:req.user._id }),
        userModel.findOne({ _id: userId, isDeleted: false })
    ])

    if (!company)
        return next(new Error("company not found", { cause: 404 }));

    if (!user)
        return next(new Error("user not found", { cause: 404 }));

    if(company.HRs.includes(userId))
        company.HRs.splice(company.HRs.indexOf(userId),1);
    else
        company.HRs.push(userId);

    await saveUser({ data: company });

    return res.status(200).json({ message: "done" });
}