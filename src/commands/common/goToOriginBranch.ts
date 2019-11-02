import ITerminal from '../../interfaces/ITerminal';

export default async function goToOriginBranch(terminal: ITerminal, branch: string) {
    await terminal.execSync('git fetch --all');
    await terminal.execSync(`git checkout ${branch}`);
    await terminal.execSync('git pull');
}
