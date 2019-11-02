import { ExecSyncOptions } from 'child_process';

export default interface ITerminal {
    cwd: string;
    execSync(command: string, options?: ExecSyncOptions): Buffer;
}
