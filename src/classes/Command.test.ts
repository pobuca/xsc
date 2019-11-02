import Command from './Command';

describe('Command', () => {
    it('should throw on non-overriden invoke', async () => {
        class TestCommand extends Command { }

        const testCommand = new TestCommand({} as any);

        let errored = false;

        await testCommand.invoke('').catch(() => errored = true);

        if (!errored) {
            throw new Error('Should have errored');
        }
    });
});
