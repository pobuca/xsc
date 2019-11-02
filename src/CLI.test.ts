import CLI from './CLI';
import ITerminal from './interfaces/ITerminal';

describe('CLI', () => {
    it('should instantiate', () => {
        const terminal: ITerminal = {
            execSync() { return new Buffer([]); }
        };

        const cli = new CLI(terminal);
    });
});
