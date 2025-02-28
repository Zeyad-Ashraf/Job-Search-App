import bcrypt from 'bcrypt';


export const hashing = async ({key , Rounds = Number(process.env.HASH_ROUNDS) }) => {
    return bcrypt.hashSync(key, Rounds);
}