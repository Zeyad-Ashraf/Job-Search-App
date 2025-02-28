import bcrypt from 'bcrypt';


export const compare = async ({ key, hash }) => {
    return bcrypt.compareSync(key, hash);
}