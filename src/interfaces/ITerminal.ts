import { ExecSyncOptions } from 'child_process';

export default interface ITerminal {
    execSync(command: string, options: ExecSyncOptions): Buffer;
}
