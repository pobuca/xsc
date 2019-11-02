import ITerminal from '../../interfaces/ITerminal';

export default async function getCurrentBranch(terminal: ITerminal) {
    const gitBranchOutput = terminal.execSync('git branch').toString();
    return gitBranchOutput.split('\n').filter((l) => l.match(/\*/))[0].replace('*', '').trim();
}
