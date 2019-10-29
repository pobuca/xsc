import execSync from './common/execSync';

let commitMessage = process.argv.slice(2).join(' ');

console.log(process.cwd())

execSync(`git add --all`);
execSync(`git commit --allow-empty -a -m "${commitMessage}"`);
execSync(`git pull`);
execSync(`git push`);
