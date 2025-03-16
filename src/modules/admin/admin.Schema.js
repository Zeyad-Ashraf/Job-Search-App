import joi from "joi";
import { generalRules } from "../../utils/index.js";

export const banOrUnbanUserSchema = {
    body: joi.object({
        id: generalRules.objectId.required()
    }),
    headers: generalRules.headers.required().unknown(true)
}