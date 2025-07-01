import { EventEmitter } from 'events';
import { customAlphabet } from 'nanoid';
import { hashing } from '../encryption/hashing.js';
import { sendMail } from '../../service/index.js';
import { userModel } from '../../DB/models/user.model.js';
import { signToken } from '../tokens/signToken.js';
import { applicationModel, enumApplicationStatus } from '../../DB/models/application.model.js';

export const eventEmitter = new EventEmitter();

eventEmitter.on("otp-email", async ({ email, type }) => {
    
    const otp = customAlphabet('1234567890', 6)();

    const hashed = await hashing({ key: otp });

    const user = await userModel.updateOne({ email }, { $push: { OTP: [{ code: hashed, type: "confirmEmail", expiresIn: Date.now() + 1000 * 60 * 10 }] } });

    const token = await signToken({ payload: { email }, SECRET_KEY: process.env.SECRET_KEY_JWT });

    await sendMail({ email, subject: "confirm your email", html: `
            <div style="width: 91%; height:150px; background-color: #a52a2a; color: white; text-align: center; padding: 15px; border-radius: 10px; font-family: Arial, sans-serif;">
                <h2 style="margin: 0;">Your Confirm OTP</h2>
                <div style="background-color: white; color: black; padding: 15px; font-size: 20px; font-weight: bold; margin: 10px 0; border-radius: 5px;">
                    ${otp}
                </div>
                <a href="http://localhost:3000/auth/resend/${token}" 
                    style="display: inline-block; background-color: white; color: #a52a2a; text-decoration: none; padding: 8px 10px; font-size: 14px; font-weight: bold; border-radius: 5px; border: none;">
                    Resend OTP
                </a>
            </div>
            `
    });

});

eventEmitter.on("forgetPassword", async ({ email }) => {

    const otp = customAlphabet('1234567890', 6)();

    const hashed = await hashing({ key: otp });

    const user = await userModel.updateOne({ email }, { $push: { OTP: [{ code: hashed, type: "forgetPassword", expiresIn: Date.now() + 1000 * 60 * 10 }] }});

    const token = await signToken({ payload: { email }, SECRET_KEY: process.env.SECRET_KEY_JWT });

    await sendMail({ email, subject: "forget Otp", html: `
            <div style="width: 91%; height:150px; background-color: #a52a2a; color: white; text-align: center; padding: 15px; border-radius: 10px; font-family: Arial, sans-serif;">
                <h2 style="margin: 0;">Your OTP</h2>
                <div style="background-color: white; color: black; padding: 15px; font-size: 20px; font-weight: bold; margin: 10px 0; border-radius: 5px;">
                    ${otp}
                </div>
                <a href="http://localhost:3000/auth/resend/${token}" 
                    style="display: inline-block; background-color: white; color: #a52a2a; text-decoration: none; padding: 8px 10px; font-size: 14px; font-weight: bold; border-radius: 5px; border: none;">
                    Resend OTP
                </a>
            </div>
            `
    });
})


eventEmitter.on("applicationAccepted", async ({ applicationId }) => {
    const emailOfUser = await applicationModel.findOne({ _id: applicationId, status: enumApplicationStatus.accepted }).populate({
        path: "userId",
        select: "email -_id"
    });
    await sendMail({ email: emailOfUser.userId.email, subject: "Application Accepted", html: `<p>Your application has been accepted</p>` });
})


eventEmitter.on("rejectAccepted", async ({ applicationId }) => {
    const emailOfUser = await applicationModel.findOne({ _id: applicationId, status: enumApplicationStatus.rejected }).populate({
        path: "userId",
        select: "email -_id"
    });
    await sendMail({ email: emailOfUser.userId.email, subject: "Application Rejected", html: `<p>Your application has been rejected</p>` });
});