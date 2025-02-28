import nodemailer from 'nodemailer';

export const sendMail = async ({ email, subject, html }) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SEBDER_EMAIL_PASSWORD
        }
    });

    const info = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject,
        html
    });

}