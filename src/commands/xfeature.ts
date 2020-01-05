import Command from '../classes/Command';
import createPR from './common/createPR';
import getCurrentBranch from './common/getCurrentBranch';

export default class XFeatureCommand extends Command {
    public static command = 'xfeature';

    public async invoke(subCommand: SubCommand, featureName: string) {
        switch (subCommand) {
            case SubCommand.Start:
                await this.execSync(`git checkout develop`);
                await this.execSync(`git pull`);
                await this.execSync(`git flow feature start ${featureName}`);
                await this.execSync(`git push --set-upstream origin feature/${featureName}`);
                break;
            case SubCommand.Finish:
                const currentBranch = await getCurrentBranch(this.terminal);
                await createPR(this, currentBranch, 'develop');
                break;
        }
    }
}

enum SubCommand {
    Start = 'start',
    Finish = 'finish'
}
