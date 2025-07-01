import { Router } from "express";
import { authentication } from "../../middlewares/auth.js";
import * as OpenaiServices from "./openai.service.js";
const openAiRouter = Router();


openAiRouter.post('/start', /*authentication,*/ OpenaiServices.startChat)



export default openAiRouter;