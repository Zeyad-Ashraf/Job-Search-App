import { userModel } from "../../DB/models/user.model.js";

export const findUser = async ({ payload }) => {
    return await userModel.findOne({ ...payload });
}

export const saveUser = async ({data}) => {
    return await data.save();
}