#!/usr/bin/env node

const path = require('path');
const opn = require('opn');
{{#client}}
const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware');
{{/client}}
const debug = require('debug')('uron:uron-dev');

/**
 * Parse Commands
 */
const program = require('commander');
program
    .version(require('../package').version, '-v, --version')
    .option('-o, --open-browser', 'Open browser when start server')
    .option('--web-host <webHost>', 'Web url when open browser')
    .option('-p, --port <port>', 'Web Server Port', parseInt)
    .option('-n, --only-node', 'Only launch server')
    .parse(process.argv);

/**
 * Execute Task
 */
process.env.NODE_ENV = 'development';

const uronConfig = global.uronConfig = require('../config/resolve')();
{{#client}}
const vusionConfig = global.vusionConfig = require('vusion-cli/config/resolve')();
{{/client}}

let port;
if (program.port) {
    port = uronConfig.port = program.port;
} else {
    port = uronConfig.port;
}

const url = `http://${program.webHost || 'localhost'}:${port}`;

const options = Object.assign({}, uronConfig);
const entryFile = path.resolve(process.cwd(), uronConfig.entry);
const app = require(entryFile)(options);
{{#client}}
debug('onlyNode?', program.onlyNode);
if (!program.onlyNode)
    _webpackHotLoad(app);
{{/client}}

app.listen(port,'0.0.0.0', (err) => {
    if (err)
        return console.error(err);

    if (program.openBrowser) {
        debug('openBrowser,url is: %s', url);
        opn(url);
    }

    console.info(`Server listen on ${port}`);
});
{{#client}}
// 执行 webpack hot middleware and dev middleware
function _webpackHotLoad(app) {
    const { compiler, devOptions } = require('vusion-cli/lib/dev').prepare(require('vusion-cli/webpack/' + vusionConfig.type));
    app.use((ctx, next) => {
        if (ctx.path === '/') {
            const search = ctx.search;
            ctx.url = '/public/index.html';
            if (search) {
                ctx.url += search;
            }
            return next();
        } else if (ctx.url.startsWith('/public')) {
            return next();
        } else if (ctx.url === '/__webpack_hmr') {
            return next();
        } else if (ctx.path === '/favicon.ico') {
            ctx.url = '/public/favicon.ico';
            return next();
        }
    });
    app.use(devMiddleware(compiler, devOptions));
    app.use(hotMiddleware(compiler));
}
{{/client}}