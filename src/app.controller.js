import { connectionDb } from './DB/connectionDB.js';
import { rateLimit } from 'express-rate-limit';
import { globalErrorHandler } from './utils/index.js';
import { authRouter } from './modules/auth/user.controller.js';
import userRouter from './modules/users/users.controller.js';
import companyRouter from './modules/company/company.controller.js';
import adminRouter from './modules/admin/admin.controller.js';
import helmet from "helmet";
import cors from "cors"
import "./cronJobs/otpCleanUp.js";


const ratelimit = rateLimit({
    windowMs: 1 * 60 * 1000, 
    limit: 20,
    message: "Too many requests from this IP, please try again after 1 minute",
    handler: (req, res,next) => {
        return next(new Error('Too many requests from this IP, please try again after 1 minute',{cause: 429}));
    }
})

    
export const appController = async (app, express) => {
    
    app.use(express.json());

    app.use(ratelimit);

    app.use(helmet());
    // to protect my app by adding security headers some of it are CSP, X-XSS-Protection, X-Frame-Options, Strict-Transport-Security, X-Content-Type-Options, etc

    app.use(cors());

    app.use(express.urlencoded({ extended: true }));

    app.use("/auth", authRouter);
    app.use("/users", userRouter);
    app.use("/company", companyRouter);
    app.use("/admin", adminRouter);
    

    connectionDb();

    app.get("/", (req, res) => {
        return res.status(200).json({ message: "Welcome to Job Search App" });
    });


    app.use("*", (req, res, next) => {
        return next(new Error("Not Found", { cause: 404 }));
    });

    app.use(globalErrorHandler);

}