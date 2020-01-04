import { resolve } from 'path';
import ITerminal from '../../interfaces/ITerminal';
import getLocalPackageFile from './getLocalPackageFile';
import tryGetCSharpProjectDetails from './tryGetCSharpProjectDetails';

export default async function updateProjectVersion(terminal: ITerminal, version: string) {
    try {
        await updateNodeJSProjectVersion(terminal, version);
    } catch (e) {
        await updateCSharpProjectVersion(terminal, version);
    }
}

async function updateNodeJSProjectVersion(terminal: ITerminal, version: string) {
    const packageFileName = resolve(terminal.cwd, 'package.json');
    const packageFile = await getLocalPackageFile(terminal);

    packageFile.version = version;
    terminal.writeFileSync(packageFileName, JSON.stringify(packageFile, null, '\t'));
}

async function updateCSharpProjectVersion(terminal: ITerminal, version: string) {
    const dir = terminal.readdirSync(terminal.cwd);

    for (const folder of dir) {
        const projectDetails = tryGetCSharpProjectDetails(terminal, `${terminal.cwd}/${folder}`);

        if (projectDetails) {
            let assemblyInfo = terminal.readFileSync(projectDetails.versionFilePath).toString();
            assemblyInfo = assemblyInfo.replace(/AssemblyVersion\(\"([^\"]+)\"/, `AssemblyVersion("${version}.0"`);

            terminal.writeFileSync(projectDetails.versionFilePath, assemblyInfo);

            return;
        }
    }
}
