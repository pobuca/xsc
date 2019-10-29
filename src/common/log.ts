import chalk from 'chalk';

export function logCmd(cmd: string) {
    console.log(`${chalk.green('xsc:')} ${chalk.cyan(cmd)}`);
}