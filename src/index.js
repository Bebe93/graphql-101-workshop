import merge from "lodash.merge";
import {
  ApolloServer,
  gql,
  PubSub,
  makeExecutableSchema,
  DataSource,
} from "apollo-server";
import db from "./db";

import User from "./schema/User/schema";
import userResolvers from "./schema/User/resolvers";
import Post from "./schema/Post/schema";
import postResolvers from "./schema/Post/resolvers";
import { DB } from "./data-sources/db";

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

export class DB extends DataSource {
  constructor(db) {
    super();
    this.db = db;
  }

  initialize({ context }) {
    this.context = context;
  }

  getUsers() {
    return this.db.users;
  }

  getUser(id) {
    return this.db.users.find((user) => user.id === id);
  }
}

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: [baseTypeDefs, Post, User],
    resolvers: merge(postResolvers, userResolvers),
  }),
  dataSources: () => ({
    db: new DB(db),
  }),
  context: {
    db,
    pubsub: new PubSub(),
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
