const { appendFileSync } = require('fs');
const { version } = require('../package');

console.log('version: ' + version);

appendFileSync('sonar-project.properties', `sonar.projectVersion=${version}`);
