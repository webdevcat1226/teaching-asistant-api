const { ApolloServer } = require('apollo-server');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');
require('dotenv').config();
const cors = require('cors');
// const emitter = new EventEmitter();
process.setMaxListeners(0);

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    // console.log('[Auth DataSource]<', context, '>');
    request.http.headers.set('authorization', context.token);
  }
}

const serviceList = [
  { name: 'Book', url: `http://localhost:${process.env.PORT_BOOK}` },
  { name: 'Category', url: `http://localhost:${process.env.PORT_CATEGORY}` },
  { name: 'Exam', url: `http://localhost:${process.env.PORT_EXAM}` },
  { name: 'User', url: `http://localhost:${process.env.PORT_USER}` },
];
// now done for gateway.

const gateway = new ApolloGateway({
  serviceList,
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  },
});

(async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({
    cors: {
      origin: "*"
    },
    schema,
    executor,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      return { token };
    },
  });

  // server.applyMiddleware({ app });

  server.listen(process.env.PORT_GATEWAY).then(({ url }) => {
    console.log(`🚀 [Gateway] Server ready at ${url}`);
  });
})();
