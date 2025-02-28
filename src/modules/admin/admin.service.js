import { companyModel } from "../../DB/models/company.model.js";
import { userModel } from "../../DB/models/user.model.js";

export const banOrUnbanUser = async (req, res, next) => {

    const { id } = req.body;

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const user = await userModel.findOne({ _id: id });

    if (!user)
        return next(new Error("user not found", { cause: 404 }));

    (user.bannedAt) ? await userModel.updateOne({ _id: id, isDeleted: false }, { $unset: { bannedAt: "" } })
        : await userModel.updateOne({_id:id, isDeleted:false},{$set:{bannedAt:Date.now()}});

    return res.status(200).json({ message: "done" });
}



export const banOrUnbanCompany = async (req, res, next) => {

    const { id } = req.body;

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const company = await companyModel.findOne({ _id: id });

    if (!company)
        return next(new Error("user not found", { cause: 404 }));

    (company.bannedAt) ? await companyModel.updateOne({ _id: id, isDeleted: false }, { $unset: { bannedAt: "" } })
        : await companyModel.updateOne({_id:id, isDeleted:false},{$set:{bannedAt:Date.now()}});

    return res.status(200).json({ message: "done" });
}



export const approveCompany = async (req, res, next) => {

    const { id } = req.body;

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const company = await companyModel.findOne({ _id: id });

    if (!company)
        return next(new Error("company not found", { cause: 404 }));

    if (company.approvedByAdmin)
        return next(new Error("company already approved", { cause: 400 }));

    await companyModel.updateOne({ _id: id }, { $set: { approvedByAdmin: true } });

    return res.status(200).json({ message: "done" });
}