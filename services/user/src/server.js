const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const mongoose = require('mongoose');
require('dotenv').config();

const typeDefs = require('./schema');
const resolvers = require('./resolver');


// Direct connection via context
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
.then(() => {
    console.log('[User] Database successfully connected!');
},
error => {
    console.log('[User] Database could not connected', error);
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

server.listen(process.env.PORT_USER).then(({url}) => {
    console.log(`🚀 [User] Server ready at ${url}`);
});