import joi from "joi";
import { generalRules } from "../../utils/index.js";
import { enumNumberOfEmployees } from "../../DB/models/company.model.js";


export const addCompanySchema = {
    body: joi.object({
        companyName: joi.string().required(),
        description: joi.string().required(),
        industry: joi.string().required(),
        address: joi.string().pattern(/^\d+\s[A-Za-z0-9\s.-]+,\s[A-Za-z\s]+,\s[A-Z]{2,}$/).message("you must enter address like this : buldingNumebr streatName St, townCity, governorate").required(),
        numberOfEmployees: joi.string().valid(...Object.values(enumNumberOfEmployees)).required(),
        companyEmail: joi.string().email({tlds:true , minDomainSegments:2 ,maxDomainSegments:4}).message("you must enter valid email").required(),
    }),
    headers: generalRules.headers.required(),
    file:generalRules.file.required()
}


export const updateCompanySchema = {
    body: joi.object({
        companyName: joi.string(),
        description: joi.string(),
        industry: joi.string(),
        address: joi.string().pattern(/^\d+\s[A-Za-z0-9\s.-]+,\s[A-Za-z\s]+,\s[A-Z]{2,}$/).message("you must enter address like this : buldingNumebr streatName St, townCity, governorate"),
        numberOfEmployees: joi.string().valid(...Object.values(enumNumberOfEmployees)),
        companyEmail: joi.string().email({tlds:true , minDomainSegments:2 ,maxDomainSegments:4}).message("you must enter valid email"),
    }),
    params: joi.object({
        id: generalRules.objectId.required()
    }),
    headers: generalRules.headers.required()
}


export const softDeleteCompanySchema = {
    params: joi.object({
        id: generalRules.objectId.required()
    }),
    headers: generalRules.headers.required()
}


export const findCompany = {
    body: joi.object({
        companyName: joi.string().required()
    }),
    headers: generalRules.headers.required()
}


export const findCompanJobsSchema = {
    params: joi.object({
        id: generalRules.objectId.required()
    }).required(),
    headers: generalRules.headers.required()
}


export const uplaodLogoSchema = {
    headers: generalRules.headers.required(),
    file:generalRules.file.required()
}


export const deleteLogoPicSchema = {
    headers: generalRules.headers.required()
}