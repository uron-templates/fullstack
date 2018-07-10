module.exports = {
    name: 'uron',
    keys: ['xxxxxxx'],
    {{#db}}
    db: {
        host: process.env.db_host,
        database: process.env.db_database,
        user: process.env.db_user,
        password: process.env.db_password,
    },
    {{/db}}
    private: {
        name: process.env.private_name,
        pass: process.env.private_pass,
    },
    proxyParams: {
        name: undefined,
        target: undefined,
        Referer: undefined,
    },
    client: {},
    vueAutoEditor: 'code',
    sessionKey: 'uron',
    sessionSecret: 'session',
};
