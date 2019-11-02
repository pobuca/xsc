import Command from '../../classes/Command';

export default async function goToOriginBranch(cmd: Command, branch: string) {
    await cmd.execSync('git fetch --all');
    await cmd.execSync(`git checkout ${branch}`);
    await cmd.execSync(`git pull origin ${branch}`);
}
