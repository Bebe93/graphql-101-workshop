import { ApolloServer, gql, PubSub } from "apollo-server";
import db from "./db";
import uuid from "uuid/v4";

const pubsub = PubSub;

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
    createComment(data: CreateCommentInput!): Comment!
  }

  type Subscription {
    post: Post!
    comment(postId: ID!): Comment!
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

  input CreateCommentInput {
    text: String!
    post: ID!
    author: ID!
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
      pubsub.publish("post", { post });
      return post;
    },

    createComment(_, { data }) {
      const author = db.users.find((user) => user.id === data.author);
      if (!author) {
        throw new Error(`No user found for ID ${data.author}`);
      }
      const post = db.post.find((post) => post.id === data.post);
      if (!post) {
        throw new Error(`No post found for ID ${data.post}`);
      }
      const comment = {
        id: uuid(),
        text: data.text,
        post: data.post,
        author: data.author,
      };
      db.comments.push(comment);
      pubsub.publish(`comment ${data.post}`, { comment });
      return comment;
    },
  },

  Subscription: {
    post: {
      //it has a level more respect Query and Mutation
      subscribe() {
        return pubsub.asyncIterator(["post"]); //method that creates a channel
      },
    },
    comment: {
      subscribe(_, { postId }) {
        return pubsub.asyncIterator(`comment ${postId}`);
      },
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
