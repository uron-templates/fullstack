#!/usr/bin/env node
/**
 * Parse Commands
 */
const program = require('commander');
const build = require('../lib/build');

program
    .version(require('../package').version, '-v, --version')
    .parse(process.argv);

build().run().then((d) => {
    console.info('>>> Build Success >>>', d);
}).catch((e) => {
    console.error('>>> Build Error >>>', e);
});
