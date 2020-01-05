import { inc, ReleaseType } from 'semver';
import Command from '../../classes/Command';
import createPR from './createPR';
import goToOriginBranch from './goToOriginBranch';
import inferProjectDetails from './inferProjectDetails';
import updateProjectVersion from './updateProjectVersion';

const ProdCommandBaseBranchMap: { [cmd in ProdCommand]: string } = {
    hotfix: 'master',
    release: 'develop'
};

const ProdCommandVersionSegmentMap: { [cmd in ProdCommand]: ReleaseType } = {
    hotfix: 'patch',
    release: 'minor'
};

export default async function processProductionCommand(cmd: Command, prodCommand: ProdCommand, subCommand: SubCommand) {
    if (subCommand === SubCommand.Finish) {
        await finishCommand(cmd, prodCommand);
    } else if (subCommand === SubCommand.Start) {
        await startCommand(cmd, prodCommand);
    } else {
        throw new Error(`Unknown command: ${subCommand}`);
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

async function startCommand(cmd: Command, prodCommand: ProdCommand) {
    await cmd.execSync('git stash');
    await goToOriginBranch(cmd, ProdCommandBaseBranchMap[prodCommand]);

    const { version } = await inferProjectDetails(cmd.terminal);

    const newVersion = inc(version, ProdCommandVersionSegmentMap[prodCommand]);

    await cmd.execSync(`git flow ${prodCommand} start ${newVersion}`);

    await updateProjectVersion(cmd.terminal, newVersion);

    await cmd.execSync(`git commit -a -m ${newVersion}`);
    await cmd.execSync(`git push --set-upstream origin ${prodCommand}/${newVersion}`);

    try {
        await cmd.execSync('git stash pop');
    } catch (e) { /* Ignore */ }
}

async function finishCommand(cmd: Command, prodCommand: ProdCommand) {
    const { version } = await inferProjectDetails(cmd.terminal);

    await createPR(cmd, `${prodCommand}/${version}`, 'master');
    await createPR(cmd, `${prodCommand}/${version}`, 'develop');

    await cmd.execSync(`git checkout develop`);
    await cmd.execSync(`git branch -d ${prodCommand}/${version}`);
}
