import { Router } from "express";
import { authentication } from "../../middlewares/auth.js";
import * as PaymentServices from "./subscribe.service.js"

const PaymentRouter = Router();


PaymentRouter.post('/subscribe', authentication, PaymentServices.subscribe );
PaymentRouter.post('/success', authentication, PaymentServices.success );
PaymentRouter.post('/cancel', authentication, PaymentServices.cancelSub );


export default PaymentRouter;