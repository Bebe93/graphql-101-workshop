import { ApolloServer, gql } from "apollo-server";
import db from "./db";

const typeDefs = gql`
  type Query {
    users: [User!]!
    posts: [Post!]!
    user(id: ID!): User
    post(id: ID!): Post
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    post: Post!
    author: User!
  }
`;

const resolvers = {
  Query: {
    posts() {
      return db.posts;
    },
    users() {
      return db.users;
    },
    user(_, args) {
      return db.users.find((user) => user.id === args.id); //finding the user by passing an ID
    },
    post(_, args) {
      return db.posts.find((post) => post.id === args.id);
    },
  },

  Post: {
    author(post) {
      return db.users.find((user) => user.id === post.author);
    },
  },
  User: {
    posts(user) {
      return db.posts.filter((post) => post.author === user.id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
