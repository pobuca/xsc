import { ExecSyncOptions } from 'child_process';

export default interface ITerminal {
    cwd: string;
    writeFileSync(fileName: string, content: string): void;
    readFileSync(fileName: string): Buffer;
    readdirSync(path: string): string[];
    execSync(command: string, options?: ExecSyncOptions): Buffer;
}
