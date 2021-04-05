import { gql } from "apollo-server";
const typeDefs = gql`
  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }

  extend type Mutation {
    createUser(data: CreateUserInput!): User!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  type User {
    name: String!
    email: String!
    age: Int
    id: ID!
    posts: [Post!]!
    comments: [Comment!]!
  }
`;

export default typeDefs;
