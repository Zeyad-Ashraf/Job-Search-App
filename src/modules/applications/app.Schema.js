import joi from "joi";
import { generalRules } from "../../utils/index.js";

export const addApplicationSchema = {
    file: generalRules.file.required(),
    params: joi.object({
        jobId: joi.string().required()
    })
}