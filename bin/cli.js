const { green, cyan, red } = require('chalk');
const CLI = require('../dist/CLI').default;
const cli = new CLI({
    execSync: require('child_process').execSync
});

cli.onAny((event, data) => {
    console.log(`${green('xsc')} ${cyan(data)}`);
});

module.exports = cli;

process.on('unhandledRejection', e => {
    console.error(red(e.message));
});