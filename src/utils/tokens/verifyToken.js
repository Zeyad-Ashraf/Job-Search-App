import jwt from 'jsonwebtoken';

export const verifyToken = async ({ token, SECRET_KEY = process.env.SECRET_KEY_JWT }) => {
    return jwt.verify(token, SECRET_KEY);
}