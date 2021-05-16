import React from "react";
import App from "./App";
import { ApolloClient } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { createHttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";

// we are going to export an apollo provider that wraps the entire app

// Our Apollo provider is going to be linked to our apollo server , which in development is running on
// localhost:5000

const httpLink = createHttpLink({
  uri: "http://localhost:5000",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
