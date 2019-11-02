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

    it('should start a release', async () => {
        await cli.invoke('xhotfix', ['finish']);
    });

    it('should show version', async () => {
        await cli.invoke('xsc', []);
    });

    it('should init', async () => {
        await cli.invoke('xsc', ['init']);
    });
});
