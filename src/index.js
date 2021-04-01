import { ApolloServer, gql } from "apollo-server";
import db from "./db";
import uuid from "uuid/v4";

const typeDefs = gql`
  type Query {
    users: [User!]!
    posts: [Post!]!
    user(id: ID!): User
    post(id: ID!): Post
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    createPost(data: CreatePostInput!): Post!
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
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

  Mutation: {
    createUser(_, { data }) {
      const emailTaken = db.users.some((user) => user.email === data.email); //some returns a boolea
      if (emailTaken) throw new Error("email taken");
      const user = {
        id: uuid(),
        name: data.name,
        email: data.email,
        age: data.age,
      };
      db.users.push(user); //here is where the real database should go
      return user;
    },

    createPost(_, { data }) {
      const post = {
        id: uuid(),
        title: data.title,
        body: data.body,
        published: data.published,
        author: data.author,
      };
      db.posts.push(post);
      return post;
    },
  },

  Post: {
    author(post) {
      return db.users.find((user) => user.id === post.author);
    },
    comments(post) {
      return db.comments.filter((comment) => comment.post === user.id);
    },
  },
  User: {
    posts(user) {
      return db.posts.filter((post) => post.author === user.id);
    },
    comments(user) {
      return db.comments.filter((comment) => comment.author === user.id);
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
