const db = {
  users: [
    {
      id: "1",
      name: "Anna",
      email: "anna@codegram.com",
      age: 32,
    },
    {
      id: "2",
      name: "John",
      email: "john@gmail.com",
    },
    {
      id: "3",
      name: "Michael",
      email: "michael@gmail.com",
    },
  ],
  posts: [
    {
      id: "1",
      title: "This is my first blog post",
      body: "Welcome to my first post",
      published: true,
      author: "1",
    },
    {
      id: "2",
      title: "Another blog post",
      body: "This is my second blog post",
      published: false,
      author: "1",
    },
    {
      id: "3",
      title: "Draft blog post title",
      body: "",
      published: false,
      author: "2",
    },
  ],
  comments: [
    {
      id: "1",
      text: "Here is a comment",
      post: "2",
      author: "3",
    },
    {
      id: "2",
      text: "This post is great!",
      post: "2",
      author: "1",
    },
    {
      id: "3",
      text: "Not very good",
      post: "3",
      author: "2",
    },
  ],
};

export { db as default };
