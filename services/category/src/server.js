const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const mongoose = require('mongoose');
require('dotenv').config();

const typeDefs = require('./schema');
const resolvers = require('./resolver');
process.setMaxListeners(0);

// Direct connection via context
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
.then(() => {
    console.log('[Category] Database successfully connected!');
},
error => {
    console.log('[Category] Database could not connected', error);
});

const server = new ApolloServer({
    context: ({ req }) => {
        const token = req.headers.authorization || '';
        return { token };
    },
    schema: buildFederatedSchema([
        {
            typeDefs,
            resolvers
        }
    ])
});

server.listen(process.env.PORT_CATEGORY).then(({url}) => {
    console.log(`🚀 [Category] Server ready at ${url}`);
});