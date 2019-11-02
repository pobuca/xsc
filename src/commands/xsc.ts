import Command from '../classes/Command';

export default class XSCCommand extends Command {
    public static command = 'xsc';

    public async invoke(subCommand: SubCommand) {
        switch (subCommand) {
            // Initialized git flow and hub since they are needed
            // for other operations.
            case SubCommand.Init:
                this.execSync(`git flow init`, { stdio: 'inherit' });
                this.execSync(`hub fetch --all`, { stdio: 'inherit' });
                break;
        }
    }
}

enum SubCommand {
    Init = 'init'
}
