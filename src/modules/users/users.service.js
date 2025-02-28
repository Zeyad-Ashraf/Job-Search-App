import { userModel } from "../../DB/models/user.model.js";
import { encrypt, decrypt, compare, saveUser } from "../../utils/index.js";
import cloudinary from "../../utils/cloudinary/index.js";

const userData = ({user,decryptedPhone}) => {
    return {
        mobileNumber: decryptedPhone,
        userName: user.fullName,
        profilePic: user.profilePic,
        coverPic: user.coverPic
    }
}



export const updateProfile = async (req, res, next) => {

    if (!req.body)
        return next(new Error("no data to update your profile", { cause: 400 }));

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    if (req.body.mobileNumber !== undefined) {
        req.body.mobileNumber = await encrypt({ key: req.body.mobileNumber,secretKey:process.env.SECRET_KEY });
    }

    const updated = await userModel.updateOne({ _id: req.user._id }, req.body, { new: true });

    return res.status(200).json({ message: "updated profile" });
}



export const getProfile = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const decryptedPhone = await decrypt({ key: req.user.mobileNumber,secretKey:process.env.SECRET_KEY });

    return res.status(200).json({ user:userData({user:req.user,decryptedPhone}) });

}



export const getAnotherProfile = async (req, res, next) => {
    
    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const user = await userModel.findOne({ _id: req.params.id });


    if (!user || user.isDeleted)
        return next(new Error("user not found", { cause: 404 }));

    const decryptedPhone = await decrypt({ key: user.mobileNumber ,secretKey:process.env.SECRET_KEY});

    return res.status(200).json({ user:userData({user:req.user,decryptedPhone}) });
}



export const updatePassword = async (req, res, next) => {

    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    if (!await compare({ key: req.body.oldPassword, hash: req.user.password }))
        return next(new Error("old password is wrong", { cause: 400 }));


    req.user.password = req.body.newPassword;
    req.user.changeCredentailTime = Date.now();

    await saveUser({ data: req.user });

    return res.status(200).json({ message: "done" });
}



export const uploadProfilePic = async (req, res, next) => {
    
    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    if (!req.file)
        return next(new Error("choose pic", { cause: 400 }));

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: "Job-app/users/profilePic",
        user_filename: true,
        unique_filename: false
    });

    const updated = await userModel.updateOne({ _id: req.user._id }, { $set: { profilePic: { secure_url, public_id } } });

    return res.status(200).json({ message: "done" });
}



export const uploadCoverPic = async (req, res, next) => {
    
    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    if (!req.file)
        return next(new Error("choose pic", { cause: 400 }));

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: "Job-app/users/coverPic",
        user_filename: true,
        unique_filename: false
    });

    const updated = await userModel.updateOne({ _id: req.user._id }, { $set: { coverPic: { secure_url, public_id } } });

    return res.status(200).json({ message: "done" });
}



export const deleteProfilePic = async (req, res, next) => {
    
    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const deleted = await cloudinary.uploader.destroy(req.user.profilePic.public_id)

    if (!deleted)
        return next(new Error("profile pic not found", { cause: 400 }));

    req.user.profilePic = {};

    await saveUser({ data: req.user });

    return res.status(200).json({ message: "done" });
}



export const deleteCoverPic = async (req, res, next) => {
    
    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    const deleted = await cloudinary.uploader.destroy(req.user.coverPic.public_id)

    if (!deleted)
        return next(new Error("profile pic not found", { cause: 400 }));

    req.user.coverPic = {};

    await saveUser({ data: req.user });

    return res.status(200).json({ message: "done" });
}



export const softDeleteAccount = async (req, res, next) => {
    
    if (!req.user)
        return next(new Error("not logged in", { cause: 401 }));

    req.user.isDeleted = true;

    await saveUser({ data: req.user });

    return res.status(200).json({ message: "done" });
}