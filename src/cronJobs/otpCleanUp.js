import cron from 'node-cron';
import { userModel } from '../DB/models/user.model.js';

const otpCleanUp = async () => {
    const users = await userModel.find();
    users.forEach(async (user) => {
        if (user.OTP.length > 0) {
            user.OTP = user.OTP.filter((otp) => otp.expiresIn > new Date());
            await user.save();
        }
    });
};


cron.schedule('0 */6 * * *', async () => {
    await otpCleanUp();
});