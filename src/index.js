import { ApolloServer } from "apollo-server";
import db from "./db";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    author: ID!
    published: Boolean!
  }

  type Query {
    users: [User!]!
    posts: [Post!]!
  }

  type Query {
    users: [User!]!
    posts: [Post!]!
    user(id: ID!): User
  }
`;
const resolvers = {
  Query: {
    users() {
      return db.users;
    },

    posts() {
      return db.posts;
    },
  },
};
const resolvers = {
  Query: {
    user(_, args) {
      return db.users.find((user) => user.id === args.id);
    },
  },
};
