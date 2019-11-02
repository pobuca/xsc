import Command from '../classes/Command';

export default class XCommitCommand extends Command {
    public static command = 'xcommit';

    public async invoke(...params: string[]) {
        await this.execSync(`git add --all`);
        await this.execSync(`git commit --allow-empty -a -m "${params.join(' ')}"`);
        await this.execSync(`git pull`);
        await this.execSync(`git push`);
    }
}
