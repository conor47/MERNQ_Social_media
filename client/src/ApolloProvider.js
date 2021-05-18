import React from "react";
import App from "./App";
import { ApolloClient } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { createHttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import { setContext } from "apollo-link-context";

// we are going to export an apollo provider that wraps the entire app

// Our Apollo provider is going to be linked to our apollo server , which in development is running on
// localhost:5000

const httpLink = createHttpLink({
  uri: "http://localhost:5000",
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "", //this will merge the headers of the request with this new
    }, // new header we have created
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink), //we are adding the token to our request and now protected api calls should be succesful
  cache: new InMemoryCache(),
});

// we will be using apollo link context. This will act in a way like a middleware. It will set a context for all requests in our application
// before they are forwarded to the http link. This enables us to set a header in a request for when users are
// performing mutations. As we know these headers are required by our server for authorization.

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
