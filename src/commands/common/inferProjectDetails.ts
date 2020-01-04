import ITerminal from '../../interfaces/ITerminal';
import getLocalPackageFile from './getLocalPackageFile';

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
    const dir = terminal.readdirSync('.');

    for (const folder of dir) {
        const projectDetails = tryGetCSharpProjectDetails(terminal, `./${folder}`);

        if (projectDetails) {
            return projectDetails;
        }
    }

    throw new Error('Could not infer project details.');
}

function tryGetCSharpProjectDetails(terminal: ITerminal, path: string) {
    try {
        const assemblyInfo = terminal.readFileSync(`${path}/Properties/AssemblyInfo.cs`).toString();

        return {
            type: ProjectType.CSharp,
            version: assemblyInfo.match(/AssemblyVersion\(\"([^\"]+)\"/)[1].replace(/\.\d+$/, '')
        } as IProjectDetails;
    } catch (e) { /* Ignore */ }
}

export interface IProjectDetails {
    type: ProjectType;
    version: string;
}

export enum ProjectType {
    NodeJS,
    CSharp
}
