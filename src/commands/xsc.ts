import Command from '../classes/Command';

export default class XSCCommand extends Command {
    public static command = 'xsc';

    public async invoke(subCommand: SubCommand) {
        if (subCommand === SubCommand.Init) {
            await this.initializeRepo();
        } else {
            this.emit('log', require('../../package').version);
        }
    }

    private async initializeRepo() {
        try {
            await this.execSync('git status');
        } catch (e) {
            await this.execSync('git init');
            await this.execSync('git add . && git commit -m "Initial commit"');
            await this.execSync('hub create -p -d "Initial commit"', { stdio: 'inherit' });
        }

        await this.execSync(`git flow init`, { stdio: 'inherit' });
        await this.execSync(`hub ci-status`, { stdio: 'inherit' });
    }
}

enum SubCommand {
    Init = 'init'
}
