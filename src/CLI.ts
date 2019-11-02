import { EventEmitter2 } from 'eventemitter2';
import XCommitCommand from './commands/xcommit';
import XSCCommand from './commands/xsc';

export default class CLI extends EventEmitter2 {
    private static commands = [
        XCommitCommand,
        XSCCommand
    ];

    public async invoke(commandName: string, parameters: string[]) {
        const Command = this.lookup(commandName);
        const commandInstance = new Command();

        commandInstance.onAny(this.emit.bind(this));

        await commandInstance.invoke(...parameters as any);
    }

    private lookup(commandName: string) {
        for (const Command of CLI.commands) {
            if (Command.command === commandName) {
                return Command;
            }
        }
    }
}
