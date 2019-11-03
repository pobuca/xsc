import { ExecSyncOptions } from 'child_process';
import { EventEmitter2 } from 'eventemitter2';
import ICommand from '../interfaces/ICommand';
import ITerminal from '../interfaces/ITerminal';

export default abstract class Command extends EventEmitter2 implements ICommand {
    public static command: string;
    constructor(public terminal: ITerminal) {
        super();
    }
    public async invoke(...params: string[]) {
        throw new Error('Not implemented');
    }
    public async execSync(command: string, options: ExecSyncOptions = { stdio: ['ignore', 'ignore', 'inherit'] }) {
        this.emit('execSync', command);
        await this.terminal.execSync(command, options);
    }
}
