import { findUser } from "../utils/dbQuery/index.js";
import { asyncHandler } from "../utils/globalErrorHandling/index.js";
import { verifyToken } from "../utils/tokens/verifyToken.js";


export const tokensType = {
    access: 'access',
    refresh:'refresh'
}

export const decodedToken = async ({ authorization, tokenType, next }) => {

    if (!authorization)
        return next(new Error("invalid token", { cause: 400 }));

    const [prefix, token] = authorization.split(" ");

    if (!prefix || !token)
        return next(new Error("invalid token", { cause: 400 }));

    let access_key = undefined;
    let refresh_key = undefined;

    if (prefix.toLowerCase() === "bearer") {

        access_key = process.env.SECRET_KEY_JWT_ACCESS_USER;
        refresh_key = process.env.SECRET_KEY_JWT_REFRESH_USER;

    } else if (prefix.toLowerCase() === "admin") {

        access_key = process.env.SECRET_KEY_JWT_ACCESS_ADMIN;
        refresh_key = process.env.SECRET_KEY_JWT_REFRESH_ADMIN;

    } else 
        return next(new Error("invalid token", { cause: 400 }));
    

    const decoded = await verifyToken({ token, SECRET_KEY: tokenType == tokensType.access ? access_key : refresh_key });

    if (!decoded?.id)
        return next(new Error("invalid token", { cause: 400 }));

    const user = await findUser({ payload: { _id: decoded.id } });

    if (user?.isDeleted)
        return next(new Error("user deleted or banned", { cause: 401 }));

    if (user?.changeCredentailTime?.getTime() / 1000 > decoded.iat)
        return next(new Error("u must Login again", { cause: 400 }));

    return user;
}

export const authentication = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    const user = await decodedToken({ authorization, tokenType: tokensType.access, next });

    req.user = user;

    next();
});

export const authorization = (accessRoles = []) => asyncHandler(async (req, res, next) => {

    if (!accessRoles.includes(req.user.role))
        return next(new Error("don't have permission to do this action", { cause: 400 }));

    next();
});
