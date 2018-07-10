const router = require('koa-router')();
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');
const schema = require('../schema');
const home = require('./home');

router.use('', home.routes());

// graphql
router.post('/graphql', graphqlKoa({ schema }));
router.get('/graphql', graphqlKoa({ schema }));
router.get(
    '/graphiql',
    graphiqlKoa({
        endpointURL: '/graphql', // a POST endpoint that GraphiQL will make the actual requests to
    })
);

module.exports = router;
