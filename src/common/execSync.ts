import { execSync } from 'child_process';
import { logCmd } from './log';

export default function (cmd: string, options: any = { stdio: 'ignore' }) {
    logCmd(cmd);
    execSync(cmd, options);
}