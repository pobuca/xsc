const { green, cyan, red } = require('chalk');
const CLI = require('../dist/CLI').default;
const cli = new CLI({
    cwd: process.cwd(),
    execSync: require('child_process').execSync,
    writeFileSync: require('fs').writeFileSync,
});

/**
 * This delimiter is used to separate our logs
 * from the last output's stdout binary stream.
 */
const DELIM = ' ';

cli.onAny((event, data) => {
    console.log(`${DELIM}${green('xsc')} ${cyan(data)}`);
});

module.exports = cli;

process.on('unhandledRejection', (e) => {
    console.error(red(e.message));
});
