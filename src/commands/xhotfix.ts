import Command from '../classes/Command';
import processProductionCommand, { ProdCommand, SubCommand } from './common/processProductionCommand';

export default class XHotfixCommand extends Command {
    public static command = 'xhotfix';

    public async invoke(subCommand: SubCommand) {
        await processProductionCommand(this, ProdCommand.Hotfix, subCommand);
    }
}
