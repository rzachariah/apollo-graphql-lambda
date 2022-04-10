// graphql.js

const { ApolloServer, gql } = require("apollo-server-lambda");
const express = require("express");
const logger = require("./logger");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => {
      logger.info("Inside hello");
      return "Hello world!";
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context, express }) => {
    const { awsRequestId, functionName, functionVersion } = context;
    const { originalUrl } = express.req;
    logger.defaultMeta = {
      requestId: awsRequestId,
      functionName,
      functionVersion,
      url: originalUrl,
    };
    logger.info("Received request");
    return {
      event,
      context,
      express,
    };
  },
  logger,
  formatResponse: (response) => {
    logger.info("Determined response", {
      hasData: !!response.data,
      hasErrors: !!response.errors,
    });
  },
});

exports.graphqlHandler = server.createHandler({
  expressAppFromMiddleware(middleware) {
    const app = express();
    app.use(middleware);
    return app;
  },
});
