import ITerminal from '../../interfaces/ITerminal';
import getLocalPackageFile from './getLocalPackageFile';

export default async function inferProjectDetails(terminal: ITerminal): Promise<IProjectDetails> {
    try {
        const packageFile = await getLocalPackageFile(terminal);

        return {
            type: ProjectType.NodeJS,
            version: packageFile.version
        } as IProjectDetails;
    } catch (e) {
        const dir = terminal.readdirSync('.');

        for (const folder of dir) {
            try {
                const assemblyInfo = terminal.readFileSync(`./${folder}/Properties/AssemblyInfo.cs`).toString();

                return {
                    type: ProjectType.CSharp,
                    version: assemblyInfo.match(/AssemblyVersion\(\"([^\"]+)\"/)[1].replace(/\.\d+$/, '')
                } as IProjectDetails;
            } catch (e) { /* Ignore */ }
        }

        throw new Error('Could not infer project details.');
    }
}

export interface IProjectDetails {
    type: ProjectType;
    version: string;
}

export enum ProjectType {
    NodeJS,
    CSharp
}
