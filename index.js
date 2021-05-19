const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

// it is convention to seperate your dependency imports and your relative imports

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config");

// PubSub is a pattern. We will instantiate it and pass it to our context so that we can use it in our resolvers

const pubsub = new PubSub();

const PORT = process.env.port || 5000;

// instead of using an authentication middleware with express , which runs on every request ( even for non protected routes)
// we will perform authentication using context

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),

  // here we are accessing the request body which express receives and passing it on to our context
});

mongoose.connect(MONGODB, { useNewUrlParser: true }).then(() => {
  console.log("MongoDB connected");
  return server
    .listen({ port: PORT })
    .then((res) => {
      console.log(`server running at ${res.url}`);
    })
    .catch((err) => {
      console.error(err);
    });
});
