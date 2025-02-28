import jwt from 'jsonwebtoken';

export const signToken = async ({ payload, SECRET_KEY=process.env.SECRET_KEY_JWT, expire="7d" }) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: expire });
}