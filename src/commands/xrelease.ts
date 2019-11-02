import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { inc } from 'semver';
import Command from '../classes/Command';
import getLocalPackageFile from './common/getLocalPackageFile';
import goToOriginBranch from './common/goToOriginBranch';

export default class XReleaseCommand extends Command {
    public static command = 'xrelease';

    public async invoke(subCommand: SubCommand) {
        let packageFile: any;
        let version: string;

        switch (subCommand) {
            case SubCommand.Start:
                goToOriginBranch(this.terminal, 'develop');
                packageFile = await getLocalPackageFile(this.terminal);
                version = packageFile.version;
                const newVersion = inc(version, 'minor');

                await this.execSync(`git flow release start ${newVersion}`);

                packageFile.version = newVersion;
                writeFileSync(resolve(this.terminal.cwd, 'package.json'), JSON.stringify(packageFile, null, '\t'));

                await this.execSync(`git commit -a -m ${newVersion}`);
                await this.execSync(`git push --set-upstream origin release/${newVersion}`);
                break;
            case SubCommand.Finish:
                packageFile = await getLocalPackageFile(this.terminal);
                version = packageFile.version;
                await this.execSync(`hub pull-request -b master -m "Merge release/${version} into master"`);
                await this.execSync(`hub pull-request -b develop -m "Merge release/${version} into develop"`);
                break;
        }
    }
}

enum SubCommand {
    Start = 'start',
    Finish = 'finish'
}
