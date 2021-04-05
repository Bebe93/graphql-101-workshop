import { gql } from "apollo-server";

const typeDefs = gql`
  extend type Query {
    posts: [Post!]!
    post(id: ID!): Post
  }

  extend type Mutation {
    createPost(data: CreatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
  }

  extend type Subscription {
    post: Post!
    comment(postId: ID!): Comment!
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    post: ID!
    author: ID!
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
export default typeDefs;
