import * as del from 'del';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { dest, src } from 'gulp';
import { resolve } from 'path';
import CLI from './CLI';
import ITerminal from './interfaces/ITerminal';

const TMP_PATH = './tmp';

describe('CLI', () => {
    let cli: CLI;
    const terminal: ITerminal = {
        cwd: '.',
        writeFileSync() { /* Ignore */ },
        readFileSync() { return Buffer.from([]); },
        readdirSync() { return []; },
        execSync() { return Buffer.from([]); }
    };

    before(async () => {
        await del(TMP_PATH);
        await new Promise((r) => src('test/data/**').pipe(dest(TMP_PATH)).on('finish', r));
    });

    it('should instantiate', () => {
        cli = new CLI(terminal);
    });

    it('should error on unknown command', async () => {
        let errored = false;

        await cli.invoke('unknown', []).catch(() => errored = true);

        if (!errored) {
            throw new Error('Did not error');
        }
    });

    it('should invoke a command', async () => {
        await cli.invoke('xcommit', ['Test']);
    });

    for (const project of [
        'csharp-solution',
        'nodejs-project'
    ]) {
        describe(project, () => {
            const cwd = resolve(__dirname, `../${TMP_PATH}/${project}`);

            const projectCLI: CLI = new CLI(Object.assign({}, terminal, {
                cwd, readFileSync, readdirSync, writeFileSync
            }));

            it(`should start a release`, async () => {
                await projectCLI.invoke('xrelease', ['start']);
            });

            it(`should finish a release`, async () => {
                await projectCLI.invoke('xrelease', ['finish']);
            });

            it(`should start a hotfix`, async () => {
                await projectCLI.invoke('xhotfix', ['start']);
            });

            it(`should finish a hotfix`, async () => {
                await projectCLI.invoke('xhotfix', ['finish']);
            });

            it(`should error on invalid command`, async () => {
                let errored = false;

                await projectCLI.invoke('xhotfix', ['invalid']).catch((e) => errored = true);

                if (!errored) {
                    throw new Error('Did not error');
                }
            });
        });
    }

    describe('unknown-project', () => {
        const cwd = resolve(__dirname, `../${TMP_PATH}/unknown-project`);

        const projectCLI: CLI = new CLI(Object.assign({}, terminal, {
            cwd, readFileSync, readdirSync, writeFileSync
        }));

        it(`should start a release and throw`, async () => {
            try {
                await projectCLI.invoke('xrelease', ['start']);
                throw new Error('Did not throw as expected');
            } catch (e) { /* Success */ }
        });

        it(`should finish a release and throw`, async () => {
            try {
                await projectCLI.invoke('xrelease', ['finish']);
                throw new Error('Did not throw as expected');
            } catch (e) { /* Success */ }
        });

        it(`should start a hotfix and throw`, async () => {
            try {
                await projectCLI.invoke('xhotfix', ['start']);
                throw new Error('Did not throw as expected');
            } catch (e) { /* Success */ }
        });

        it(`should finish a hotfix and throw`, async () => {
            try {
                await projectCLI.invoke('xhotfix', ['finish']);
                throw new Error('Did not throw as expected');
            } catch (e) { /* Success */ }
        });
    });

    it('should start a feature', async () => {
        await cli.invoke('xfeature', ['start', 'my-feature']);
    });

    it('should start a feature', async () => {
        await cli.invoke('xfeature', ['finish']);
    });

    it('should show version', async () => {
        await cli.invoke('xsc', []);
    });

    describe('init command', () => {
        const cliWithGitflow = new CLI({
            cwd: '.',
            writeFileSync() { /* Ignore */ },
            readFileSync(filePath: string) {
                if (filePath === '.git/config') {
                    return Buffer.from('[gitflow ');
                }

                return Buffer.from([]);
            },
            readdirSync() { return []; },
            execSync(cmd: string) {
                if (cmd === 'git status') {
                    throw new Error('Not git repo');
                }

                return Buffer.from([]);
            }
        });

        it('should init with git flow', async () => {
            await cliWithGitflow.invoke('xsc', ['init']);
        });

        it('should init without git flow', async () => {
            await cli.invoke('xsc', ['init']);
        });
    });

    describe('without parameters', () => {
        it('should show x if required command errors', async () => {
            const cli = new CLI({
                cwd: '.',
                writeFileSync() { /* Ignore */ },
                readFileSync(cmd: string) { return Buffer.from([]); },
                readdirSync() { return []; },
                execSync(cmd: string) {
                    if (cmd === 'git --version') {
                        throw new Error('Not git repo');
                    }

                    return Buffer.from([]);
                }
            });

            await cli.invoke('xsc', []);
        });
    });
});
