import Command from '../../classes/Command';
import { GitRemoteHost } from '../../interfaces/GitRemoteHost';
import inferRepoRemoteHostDetails from './inferRepoRemoteHostDetails';

export default async function createPR(cmd: Command, sourceBranch: string, targetBranch: string) {
    const hostDetails = await inferRepoRemoteHostDetails(cmd.terminal);

    const hostCommandMap: { [key in GitRemoteHost]: string } = {
        [GitRemoteHost.AzureDevOps]: `az repos pr create -p "${hostDetails.project}" -r ${hostDetails.repo} --org https://dev.azure.com/${hostDetails.account}/ -s ${sourceBranch} -t ${targetBranch}`,
        [GitRemoteHost.GitHub]: `hub pull-request -b ${targetBranch} -m "Merge ${sourceBranch} into ${targetBranch}"`
    };

    const command = hostCommandMap[hostDetails.host];

    await cmd.execSync(command);
}
