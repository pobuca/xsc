import ITerminal from '../../interfaces/ITerminal';

export default async function goToOriginBranch(terminal: ITerminal, branch: string) {
    await terminal.execSync('git fetch --all', { stdio: 'ignore' });
    await terminal.execSync(`git checkout ${branch}`, { stdio: 'ignore' });
    await terminal.execSync(`git pull origin ${branch}`, { stdio: 'ignore' });
}
