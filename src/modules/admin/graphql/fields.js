
import { userType,companyType } from "./type.js";
import { getAllUsers,getAllCompanies } from "./resolve.js";


export const adminQuery = {
    allUsers: {
        type: userType,
        resolve:getAllUsers
    },
    allCompanies: {
        type: companyType,
        resolve:getAllCompanies
    }
}