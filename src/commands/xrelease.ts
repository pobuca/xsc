import Command from '../classes/Command';
import processProductionCommand, { ProdCommand, SubCommand } from './common/processProductionCommand';

export default class XReleaseCommand extends Command {
    public static command = 'xrelease';

    public async invoke(subCommand: SubCommand) {
        processProductionCommand(this, ProdCommand.Release, subCommand || SubCommand.Start);
    }
}
