import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

export const userType = new GraphQLList(new GraphQLObjectType({
    name: "User",
    fields: {
        _id: { type: GraphQLID },
        fullName: { type: GraphQLString },
        email: { type: GraphQLString },
        DOB: { type: GraphQLString },
        mobileNumber: { type: GraphQLString }
    }
}));


export const companyType = new GraphQLList(new GraphQLObjectType({
    name: "Company",
    fields: {
        _id: { type: GraphQLID },
        companyName: { type: GraphQLString },
        description: { type: GraphQLString },
        industry: { type: GraphQLString },
        address: { type: GraphQLString },
        numberOfEmployees: { type: GraphQLString },
        companyEmail: { type: GraphQLString },
        createdBy: { type: GraphQLID }
    }
}));