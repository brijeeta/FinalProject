const { gql } = require('apollo-server-express');

const typeDefs = gql `
  type Query {
    sayHi:String!
    }
`;

module.exports = typeDefs;