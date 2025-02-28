import joi from "joi";
import { generalRules } from "../../utils/index.js";
import { enumGender } from "../../DB/models/user.model.js";



export const signUpSchema = {
    body: joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: generalRules.email.required(),
        password: generalRules.password.required(),
        cPassword: joi.string().valid(joi.ref("password")).required(),
        mobileNumber: joi.string().regex(/^01[0125][0-9]{8}$/).required(),
        gender: joi.string().valid(...Object.values(enumGender)),
        DOB: joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
    }).required()
}


export const resetPassSchema = {
    body: joi.object({
        email: generalRules.email.required(),
        code: joi.string().required(),
        newPassword: generalRules.password.required(),
        cNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
    }).required()
}


export const confrimEmailSchema = {
    body: joi.object({
        email: generalRules.email.required(),
        code: joi.string().required()
    })
}


export const signInSchema = {
    body: joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required()
    })
}