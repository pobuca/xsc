import { writeFileSync } from 'fs';
import { resolve } from 'path';
import Command from '../classes/Command';
import { Flow, FlowType } from '../classes/Flow';
import getLocalPackageFile from './common/getLocalPackageFile';
import goToOriginBranch from './common/goToOriginBranch';

export default class XHotfixCommand extends Command {
    public static command = 'xhotfix';

    public async invoke(subCommand: SubCommand) {
        let packageFile: any;
        let version: string;

        switch (subCommand) {
            case SubCommand.Start:
                const flow = new Flow(this.terminal, FlowType.Release);
                goToOriginBranch(this.terminal, 'master');
                packageFile = await getLocalPackageFile(this.terminal);
                version = packageFile.verion;
                const newVersion = await flow.findNextVersion(version);

                await this.execSync(`git flow hotfix start ${newVersion}`);

                packageFile.version = newVersion;
                writeFileSync(resolve(this.terminal.cwd, 'package.json'), JSON.stringify(packageFile, null, '\t'));

                await this.execSync(`git commit -a -m ${newVersion}`);
                await this.execSync(`git push --set-upstream origin hotfix/${newVersion}`);
                break;
            case SubCommand.Finish:
                packageFile = await getLocalPackageFile(this.terminal);
                version = packageFile.verion;
                await this.execSync(`hub pull-request -b master -m "Merge hotfix/${version} into master"`);
                await this.execSync(`hub pull-request -b develop -m "Merge hotfix/${version} into develop"`);
                break;
        }
    }
}

enum SubCommand {
    Start = 'start',
    Finish = 'finish'
}
