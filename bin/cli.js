const { green, cyan, red } = require('chalk');
const { writeFileSync, readFileSync, readdirSync } = require('fs');
const { clearLine, cursorTo } = require('readline');

const CLI = require('../dist/CLI').default;
const cli = new CLI({
    cwd: process.cwd(),
    execSync: require('child_process').execSync,
    writeFileSync: writeFileSync,
    readdirSync: readdirSync,
    readFileSync: readFileSync
});

cli.onAny((event, data) => {
    let prefix = green('xsc');

    if (event == 'raw') {
        prefix = '';
    }

    clearLine(process.stdout, 0);
    cursorTo(process.stdout, 0, null);
    console.log(`${prefix} ${cyan(data)}`);
});

module.exports = cli;

process.on('unhandledRejection', (e) => {
    console.error(red(e.message));
});
