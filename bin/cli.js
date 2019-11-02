const chalk = require('chalk');
const CLI = require('../dist/CLI').default;
const cli = new CLI();

cli.onAny((event, data) => {
    console.log(`${event}: ${data}`);
});

module.exports = cli;