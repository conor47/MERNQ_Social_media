const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

// While MongoDB isnt a relational database we can specify relations between models using mongoose as we have done above. Each post has a user field which references a specific user in our database.
// We will be able to use mongoose methods to automatically populate these fields

module.exports = model("posts", postSchema);
