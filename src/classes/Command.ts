import { execSync, ExecSyncOptions } from 'child_process';
import { EventEmitter2 } from 'eventemitter2';
import ICommand from '../interfaces/ICommand';

export default abstract class Command extends EventEmitter2 implements ICommand {
    public static command: string;
    public async invoke(...params: string[]) {
        throw new Error('Not implemented');
    }
    public async execSync(command: string, options: ExecSyncOptions = { stdio: 'ignore' }) {
        this.emit('execSync', command);
        execSync(command, options);
    }
}
