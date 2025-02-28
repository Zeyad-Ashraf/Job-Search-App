import CryptoJS from "crypto-js";

export const decrypt = async ({ key, secretKey }) => {
    return CryptoJS.AES.decrypt(key, secretKey).toString(CryptoJS.enc.Utf8);
}