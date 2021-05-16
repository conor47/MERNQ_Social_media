const { model, Schema } = require("mongoose");

// We will not be specifying required fields in our models as this can be handled via graphQL

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
});

// We are exporting a model, which uses a specific schema which we have created

module.exports = model("User", userSchema);
