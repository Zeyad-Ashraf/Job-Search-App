import joi from "joi";
import { enumSeniorityLevel, enumWorkTime } from "../../DB/models/job.model.js";
import { generalRules } from "../../utils/index.js";

export const addJobSchema = {
    body: joi.object({
        jobTitle: joi.string().required(),
        jobLocation: joi.string().required(),
        workingTime: joi.string().valid(...Object.values(enumWorkTime)).required(),
        seniorityLevel: joi.string().valid(...Object.values(enumSeniorityLevel)).required(),
        jobDescription: joi.string().required(),
        technicalSkills: joi.array().items(joi.string()).required(),
        softSkills: joi.array().items(joi.string()).required()
    }).required(),
    params: joi.object({
        companyId: generalRules.objectId.required()
    }).required(),
    headers: generalRules.headers.required()
}


export const updateJobSchema = {
    body: joi.object({
        jobTitle: joi.string(),
        jobLocation: joi.string(),
        workingTime: joi.string().valid(...Object.values(enumWorkTime)),
        seniorityLevel: joi.string().valid(...Object.values(enumSeniorityLevel)),
        jobDescription: joi.string(),
        technicalSkills: joi.array().items(joi.string()),
        softSkills: joi.array().items(joi.string())
    }),
    params: joi.object({
        companyId: generalRules.objectId.required(),
        jobId: generalRules.objectId.required()
    }).required(),
    headers: generalRules.headers.required()
}


export const deleteJobSchema = {
    params: joi.object({
        companyId: generalRules.objectId.required()
    }).required(),
    headers: generalRules.headers.required()
}


export const getCompanyJobsSchema = {
    query: joi.object({
        companyId: generalRules.objectId.required()
    }).required(),
    headers: generalRules.headers.required()
}


export const filterJobsSchema = {
    headers: generalRules.headers.required(),
    query: joi.object({
        page: joi.string(),
        limit: joi.string().valid("10", "20"),
        workingTime: joi.string(),
        seniorityLevel: joi.string(),
        jobTitle: joi.string(),
        jobLocation: joi.string()
    })
}
