import { enumProvider, userModel,enumRole } from "../../DB/models/user.model.js";
import { findUser , eventEmitter,compare,verifyToken,signToken,hashing } from "../../utils/index.js";
import { decodedToken } from "../../middlewares/auth.js";
import { tokensType } from "../../middlewares/auth.js";
import { OAuth2Client } from "google-auth-library";




export const signUp = async (req, res, next) => {

    const { firstName, lastName, email, password, mobileNumber, gender, DOB } = req.body;
    
    const user = await findUser({ payload: { email } });
    
    if (user)
        return next(new Error("User already exists", { cause: 400 }));

    const userData = await userModel.create({
        firstName,
        lastName,
        email,
        password,
        mobileNumber,
        gender,
        DOB,
        provider: enumProvider.system
    });

    eventEmitter.emit("otp-email", { email });
    return res.status(200).json({ msg: "success"});
}



export const confirmEmail = async (req, res, next) => {

    const { email, code } = req.body;

    const user = await findUser({ payload: { email, isConfirmed: false } });
    
    if (!user)
        return next(new Error("user not found or already confirmed", { cause: 404 }));

    const findConfrimOtp = user.OTP.find(async(item) => {
        return await compare({ key: code, hash: item.code });
    });

    if (!findConfrimOtp)
        return next(new Error("code not found", { cause: 400 }));

    if(findConfrimOtp.expiresIn < Date.now())
        return next(new Error("code expired", { cause: 400 }));

    if (!await compare({ key: code, hash: findConfrimOtp.code }))
        return next(new Error("invalid code", { cause: 400 }));

    await userModel.updateOne({ email }, { $set: { isConfirmed: true }, $unset: { OTP: "" } });

    return res.status(200).json({ msg: "email confirmed" });
}



export const resendOtp = async (req, res, next) => {

    const { token } = req.params;

    const decoded = await verifyToken({ token, SECRET_KEY: process.env.SECRET_KEY_JWT });

    if (!decoded.email)
        return next(new Error("invalid token", { cause: 400 }));

    const user = await findUser({ payload: { email: decoded.email } });
    
    if (!user)
        return next(new Error("user not found", { cause: 404 }));

    if (user.OTP.length > 0)
        await userModel.updateOne({ email: decoded.email }, { $unset: { OTP: "" } });

    if(user.OTP[0].type == "forgetPassword")
        eventEmitter.emit("forgetPassword", { email: decoded.email });
    else if(user.OTP[0].type == "confirmEmail")
        eventEmitter.emit("otp-email", { email: decoded.email });
    
    return res.status(200).json({ msg: "done" });
}



export const singIn = async (req, res, next) => {

    const { email } = req.body;
    
    let user = await findUser({ payload: { email, isDeleted: false, isConfirmed: true, provider: enumProvider.system , bannedAt: null } });
    
    if (!user)
        return next(new Error("user not found", { cause: 404 }));

    if (user?.changeCredentailTime)
        user = await userModel.updateOne({ email }, { $unset: { changeCredentailTime: 0 } });

    if (!await compare({ key: req.body.password, hash: user.password }))
        return next(new Error("invalid password", { cause: 400 }));

    let access_key= undefined;
    let refresh_key = undefined;

    if (user.role == enumRole.user) {

        access_key = process.env.SECRET_KEY_JWT_ACCESS_USER;
        refresh_key = process.env.SECRET_KEY_JWT_REFRESH_USER;

    } else if (user.role == enumRole.admin) {

        access_key = process.env.SECRET_KEY_JWT_ACCESS_ADMIN;
        refresh_key = process.env.SECRET_KEY_JWT_REFRESH_ADMIN;

    }

    const access_token = await signToken({ payload: { email, id: user._id },SECRET_KEY: access_key,expire:"1h"});
    const refresh_token = await signToken({ payload: { email, id: user._id }, SECRET_KEY: refresh_key, expire: "7d" });

    return res.status(200).json({ msg: "login successful", access_token, refresh_token });
}



export const loginWithGmail = async (req, res, next) => {
    const { idToken } = req.body;

    const client = new OAuth2Client();

    async function verify() {

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID
        });

        const payload = ticket.getPayload();

        return payload;
    }

    const { email, name, picture, email_verified } = await verify();

    const [firstName, lastName] = name.split(" ");
    
    let user = await findUser({ payload: { email } });

    if (!user) {
        user = await userModel.create({ firstName, lastName, email, confirmed: email_verified, role: enumRole.user, provider: enumProvider.google, image: picture });
    }

    if (user.provider != enumProvider.google)
        return next(new Error("u must login with system", { cause: 400 }))

    let access_key= undefined;

    if (user.role == enumRole.user) {

        access_key = process.env.SECRET_KEY_JWT_ACCESS_USER;

    } else if (user.role == enumRole.admin) {

        access_key = process.env.SECRET_KEY_JWT_ACCESS_ADMIN;

    }

    const access_token = await signToken({ payload: { email, id: user._id }, SECRET_KEY: access_key, expire: "1d" });

    return res.status(200).json({ msg: "done", token: access_token })
}



export const forgetPassword = async (req, res, next) => {

    const { email } = req.body;

    const user = await findUser({ payload: { email } });

    if (!user)
        return next(new Error("user not found", { cause: 401 }));

    eventEmitter.emit("forgetPassword", { email });

    return res.status(200).json({ msg: "done" });
}



export const resetPassword = async (req, res, next) => {
    const { email, code, newPassword } = req.body;

    const user = await findUser({ payload: { email, isDeleted: false } });

    if (!user)
        return next(new Error("user not found", { cause: 404 }));

    const findConfrimOtp = user.OTP.find(async(item) => {
        return await compare({ key: code, hash: item.code });
    });

    if (!findConfrimOtp)
        return next(new Error("code not found", { cause: 400 }));

    if(findConfrimOtp.expiresIn < Date.now())
        return next(new Error("code expired", { cause: 400 }));

    if (!await compare({ key: code, hash: findConfrimOtp.code }))
        return next(new Error("invalid code", { cause: 400 }));

    if (await compare({ key: newPassword, hash: user.password }))
        return next(new Error("new password is same as old", { cause: 400 }));

    const hashedPassword = await hashing({ key: newPassword });
    
    const updated = await userModel.updateOne({ _id: user._id }, { $set: { password: hashedPassword, changeCredentailTime: Date.now() } , $unset: { OTP: "" } });

    return res.status(200).json({ msg: "done" });
}



export const refreshToken = async (req, res, next) => {
    
    const { authorization } = req.headers;

    const decoded = await decodedToken({ authorization, tokenType: tokensType.refresh, next });

    if (!decoded)
        return next(new Error("user not found", { cause: 404 }));

    let access_key= undefined;

    if (user.role == enumRole.user) {

        access_key = process.env.SECRET_KEY_JWT_ACCESS_USER;

    } else if (user.role == enumRole.admin) {

        access_key = process.env.SECRET_KEY_JWT_ACCESS_ADMIN;

    }

    const access_token = await signToken({ payload: { email: decoded.email, id: decoded._id }, SECRET_KEY: access_key, expire: "1h" });

    return res.status(200).json({ msg: "refresh token successful", access_token });
}