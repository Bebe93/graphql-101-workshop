import uuid from "uuid/v4";

const resolvers = {
  Query: {
    users() {
      return db.users;
    },
    user(_, args) {
      return db.users.find((user) => user.id === args.id);
    },
  },
  Mutation: {
    createUser(_, { data }) {
      const emailTaken = db.users.find((user) => user.email === data.email);
      if (emailTaken) {
        throw new Error("Email already taken");
      }

      const user = {
        id: uuid(),
        email: data.email,
        name: data.name,
        age: data.age,
      };
      db.users.push(user);

      return user;
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

export default resolvers;
