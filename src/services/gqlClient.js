// src/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const gqlClient = new ApolloClient({
  uri: "http://localhost:3001/graphql", // <== pakai port backend
  cache: new InMemoryCache(),
  connectToDevTools: true,
});


export default gqlClient;
