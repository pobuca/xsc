import Command from '../classes/Command';
import getCurrentBranch from './common/getCurrentBranch';

export default class XSCCommand extends Command {
    public static command = 'xfeature';

    public async invoke(subCommand: SubCommand, featureName: string) {
        switch (subCommand) {
            case SubCommand.Start:
                await this.execSync(`git checkout develop`);
                await this.execSync(`git pull`);
                await this.execSync(`git flow feature start ${featureName}`);
                await this.execSync(`git push`);
                break;
            case SubCommand.Finish:
                const currentBranch = await getCurrentBranch(this.terminal);
                await this.execSync(`hub pull-request -b develop -m "Merge ${currentBranch} into develop"`);
                break;
        }
    }
}

enum SubCommand {
    Start = 'start',
    Finish = 'finish'
}
