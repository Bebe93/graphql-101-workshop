import uuid from "uuid/v4";

const resolvers = {
  Query: {
    posts() {
      return db.posts;
    },
    post(_, args, { db }) {
      return db.posts.find((post) => post.id === args.id);
    },
  },

  Mutation: {
    createPost(_, { data }, { db, pubsub }) {
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

    createComment(_, { data }, { db, pubsub }) {
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
};

export default resolvers;
