
import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { adminQuery } from "./graphql/fields.js";

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            getAllUsers: {
                ...adminQuery.allUsers
            },
            getAllCompanies: {
                ...adminQuery.allCompanies
            }
        }
    })
});