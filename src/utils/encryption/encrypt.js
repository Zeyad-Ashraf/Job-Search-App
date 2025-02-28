import CryptoJS from "crypto-js";


export const encrypt = async ({ key, secretKey }) => {
    return CryptoJS.AES.encrypt(key, secretKey).toString();
}