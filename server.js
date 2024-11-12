// Server setup and configuration 
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const mongoose = require('mongoose');
const cors = require('cors');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');
const authDirectiveTransformer = require('./directives/auth');
const authMiddleware = require('./middleware/auth');
const { MONGODB_URI, PORT } = require('./config');

async function startServer() {
  const app = express();
  
  // Connect to MongoDB
  await mongoose.connect(MONGODB_URI);

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      
      return {
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        locations: error.locations,
        path: error.path,
      };
    },
  });

  await server.start();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use('/graphql', authMiddleware);

  // Apply Apollo middleware
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({ user: req.user })
    })
  );

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

module.exports = startServer;
