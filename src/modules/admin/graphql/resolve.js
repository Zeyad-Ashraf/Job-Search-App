
import { companyModel } from "../../../DB/models/company.model.js";
import { userModel } from "../../../DB/models/user.model.js";

export const getAllUsers = async () => {
    return await userModel.find();
}

export const getAllCompanies = async () => {
    return await companyModel.find();
}