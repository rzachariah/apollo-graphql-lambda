// graphql.js

const { ApolloServer, gql } = require('apollo-server-lambda');
const express = require('express');
const { logRequestMiddleware } = require('./middlewares/logRequestMiddleware');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler({
  expressAppFromMiddleware(middleware) {
    const app = express();
    app.use(logRequestMiddleware);
    app.use(middleware);
    return app;
  }
});
