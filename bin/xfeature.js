#!/usr/bin/env node
const commandName = require('path').parse(__filename).name;
require('./cli').invoke(commandName, process.argv.splice(2));