import joi from "joi";
import { enumGender } from "../../DB/models/user.model.js";
import { generalRules } from "../../utils/index.js";


export const updateProfileSchema = {
    body: joi.object({
        firstName: joi.string(),
        lastName: joi.string(),
        DOB: joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        mobileNumber: joi.string().regex(/^01[0125][0-9]{8}$/),
        gender: joi.string().valid(...Object.values(enumGender)),
    }),
    headers: generalRules.headers.required()
}


export const updatePasswordSchema = {
    body: joi.object({
        oldPassword: generalRules.password.required(),
        newPassword: generalRules.password.required(),
        cNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
    }),
    headers: generalRules.headers.required()
}


export const userProfileSchema = {
    params: joi.object({
        id: generalRules.objectId.required()
    }),
    headers: generalRules.headers.required()
}


export const uploadFileSchema = {
    file: generalRules.file.required(),
    headers: generalRules.headers.required(),
}


export const deleteAccountSchema = {
    headers: generalRules.headers.required()
}

