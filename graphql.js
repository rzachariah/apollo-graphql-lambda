// graphql.js

const { ApolloServer, gql } = require("apollo-server-lambda");
const express = require("express");
const { logRequestMiddleware } = require("./middlewares/logRequestMiddleware");
const { logger } = require("./logger");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (parent, args, context) => {
      context.logger.info("Inside hello");
      return "Hello world!";
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context, express }) => {
    const functionName = context.functionName;
    logger.defaultMeta = { requestId: context.awsRequestId, functionName };
    logger.info("Received request");
    return {
      headers: event.headers,
      functionName,
      event,
      context,
      expressRequest: express.req,
      logger,
    };
  },
});

exports.graphqlHandler = server.createHandler({
  expressAppFromMiddleware(middleware) {
    const app = express();
    app.use(logRequestMiddleware);
    app.use(middleware);
    return app;
  },
});
