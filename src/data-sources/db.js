Query: {
    users(_, __, { dataSources }) {
      return dataSources.db.getUsers()
    },
    user(_, args, { dataSources }) {
      return dataSources.db.getUser(args.id)
    }
  },