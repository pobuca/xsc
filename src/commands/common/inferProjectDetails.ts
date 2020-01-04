import { resolve } from 'path';
import ITerminal from '../../interfaces/ITerminal';
import getLocalPackageFile from './getLocalPackageFile';
import tryGetCSharpProjectDetails from './tryGetCSharpProjectDetails';

export default async function inferProjectDetails(terminal: ITerminal): Promise<IProjectDetails> {
    try {
        return await getNodeJSProjectDetails(terminal);
    } catch (e) {
        return await getCSharpProjectDetails(terminal);
    }
}

async function getNodeJSProjectDetails(terminal: ITerminal) {
    const packageFile = await getLocalPackageFile(terminal);

    return {
        type: ProjectType.NodeJS,
        version: packageFile.version
    } as IProjectDetails;
}

async function getCSharpProjectDetails(terminal: ITerminal) {
    const dir = terminal.readdirSync(terminal.cwd);

    for (const folder of dir) {
        const projectRoot = resolve(terminal.cwd, folder);
        const projectDetails = tryGetCSharpProjectDetails(terminal, projectRoot);

        if (projectDetails) {
            return projectDetails;
        }
    }

    throw new Error('Could not infer project details.');
}

export interface IProjectDetails {
    type: ProjectType;
    version: string;
    versionFilePath: string;
}

export enum ProjectType {
    NodeJS,
    CSharp
}
