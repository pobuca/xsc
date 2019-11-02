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

    it('should invoke a command', () => {
        cli.invoke('xcommit', ['Test']);
    });
});
