export const validation = (schema) => (req, res, next) => {
    let errArr = [];

    for (let key of Object.keys(schema)) {
        let validatee = schema[key].validate(req[key], { abortEarly: false });

        if (validatee?.error)
            errArr.push(validatee.error);
    }

    if (errArr.length > 0)
        return res.status(400).json({ msg: errArr });

    next();
}