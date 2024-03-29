import { EventEmitter2 } from 'eventemitter2';
import Command from './classes/Command';
import XCommitCommand from './commands/xcommit';
import XFeatureCommand from './commands/xfeature';
import XHotfixCommand from './commands/xhotfix';
import XReleaseCommand from './commands/xrelease';
import XSCCommand from './commands/xsc';
import ITerminal from './interfaces/ITerminal';

export default class CLI extends EventEmitter2 {
    private static commands: any[] = [
        XCommitCommand,
        XFeatureCommand,
        XReleaseCommand,
        XHotfixCommand,
        XSCCommand
    ];

    constructor(private terminal: ITerminal) {
        super();
    }

    public async invoke(commandName: string, parameters: string[]) {
        const CommandConstructor: any = this.lookup(commandName);
        const commandInstance: Command = new CommandConstructor(this.terminal);

        commandInstance.onAny(this.emit.bind(this));

        await commandInstance.invoke(...parameters as any[]);
    }

    private lookup(commandName: string) {
        for (const CommandConstructor of CLI.commands) {
            if (CommandConstructor.command === commandName) {
                return CommandConstructor;
            }
        }

        throw new Error(`Unknown command: ${commandName}`);
    }
}
