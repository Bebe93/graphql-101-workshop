import merge from "lodash.merge";
import { ApolloServer, gql, PubSub, makeExecutableSchema } from "apollo-server";
import db from "./db";

import User from "./schema/User/schema";
import userResolvers from "./schema/User/resolvers";
import Post from "./schema/Post/schema";
import postResolvers from "./schema/Post/resolvers";

//const pubsub = PubSub;

const baseTypeDefs = gql`
  type Query {
    _dummyQuery: String
  }
  type Mutation {
    _dummyQuery: String
  }
  type Subscription {
    _dummyQuery: String
  }
`;

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: [baseTypeDefs, Post, User],
    resolvers: merge(postResolvers, userResolvers),
  }),
  context: {
    db,
    pubsub: new PubSub(),
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
