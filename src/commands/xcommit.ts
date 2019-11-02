import Command from '../classes/Command';

export default class XCommitCommand extends Command {
    public static command = 'xcommit';

    public async invoke(...params: string[]) {
        this.execSync(`git add --all`);
        this.execSync(`git commit --allow-empty -a -m "${params.join(' ')}"`);
        this.execSync(`git pull`);
        this.execSync(`git push`);
    }
}
