import { resolve } from 'path';
import { inc, ReleaseType } from 'semver';
import Command from '../../classes/Command';
import getLocalPackageFile from './getLocalPackageFile';
import goToOriginBranch from './goToOriginBranch';

const ProdCommandBaseBranchMap: { [cmd in ProdCommand]: string } = {
    hotfix: 'master',
    release: 'develop'
};

const ProdCommandVersionSegmentMap: { [cmd in ProdCommand]: ReleaseType } = {
    hotfix: 'patch',
    release: 'minor'
};

export default async function processProductionCommand(cmd: Command, prodCommand: ProdCommand, subCommand: SubCommand) {
    let packageFile: any;
    let version: string;

    switch (subCommand) {
        case SubCommand.Start:
            goToOriginBranch(cmd.terminal, ProdCommandBaseBranchMap[prodCommand]);
            packageFile = await getLocalPackageFile(cmd.terminal);
            version = packageFile.version;
            const newVersion = inc(version, ProdCommandVersionSegmentMap[prodCommand]);
            const packageFileName = resolve(cmd.terminal.cwd, 'package.json');

            await cmd.execSync(`git flow ${prodCommand} start ${newVersion}`);

            packageFile.version = newVersion;
            cmd.terminal.writeFileSync(packageFileName, JSON.stringify(packageFile, null, '\t'));

            await cmd.execSync(`git commit -a -m ${newVersion}`);
            await cmd.execSync(`git push --set-upstream origin ${prodCommand}/${newVersion}`);
            break;
        case SubCommand.Finish:
            packageFile = await getLocalPackageFile(cmd.terminal);
            version = packageFile.version;
            await cmd.execSync(`hub pull-request -b master -m "Merge ${prodCommand}/${version} into master"`);
            await cmd.execSync(`hub pull-request -b develop -m "Merge ${prodCommand}/${version} into develop"`);
            break;
    }
}

export enum SubCommand {
    Start = 'start',
    Finish = 'finish'
}

export enum ProdCommand {
    Hotfix = 'hotfix',
    Release = 'release'
}
