const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const mongoose = require('mongoose');
require('dotenv').config();

const typeDefs = require('./schema');
const resolvers = require('./resolver');


// Direct connection via context
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
.then(() => {
    console.log('[Exam] Database successfully connected!');
},
error => {
    console.log('[Exam] Database could not connected', error);
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

server.listen(process.env.PORT_EXAM).then(({url}) => {
    console.log(`🚀 [Exam] Server ready at ${url}`);
});