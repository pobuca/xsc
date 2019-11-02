import Command from '../classes/Command';

export default class XSCCommand extends Command {
    public static command = 'xsc';

    public async invoke(subCommand: SubCommand) {
        switch (subCommand) {
            // Initialize `git flow` and `hub` since they are needed
            // for other operations.
            case SubCommand.Init:
                this.execSync(`git flow init`, { stdio: 'inherit' });
                this.execSync(`hub fetch --all`, { stdio: 'inherit' });
                break;
            default:
                this.emit('log', require('../../package').version);
                break;
        }
    }
}

enum SubCommand {
    Init = 'init'
}
