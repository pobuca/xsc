import { ExecSyncOptions } from 'child_process';

export default interface ITerminal {
    cwd: string;
    writeFileSync(fileName: string, content: string): void;
    execSync(command: string, options?: ExecSyncOptions): Buffer;
}
