import { execSync } from 'child_process';
import { logCmd } from './log';

export default function (cmd: string) {
    logCmd(cmd);
    execSync(cmd, { stdio: 'ignore' });
}