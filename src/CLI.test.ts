import { expect } from 'chai';
import CLI from './CLI';
import ITerminal from './interfaces/ITerminal';

describe('CLI', () => {
    let cli: CLI;

    it('should instantiate', () => {
        const terminal: ITerminal = {
            cwd: '.',
            writeFileSync() { /* Ignore */ },
            execSync() { return new Buffer([]); }
        };

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

    it('should start a release', async () => {
        await cli.invoke('xrelease', ['start']);
    });

    it('should start a release', async () => {
        await cli.invoke('xrelease', ['finish']);
    });

    it('should start a hotfix', async () => {
        await cli.invoke('xhotfix', ['start']);
    });

    it('should start a hotfix', async () => {
        await cli.invoke('xhotfix', ['finish']);
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

    it('should init', async () => {
        await cli.invoke('xsc', ['init']);
    });
});
