import ITerminal from '../../interfaces/ITerminal';
import { IProjectDetails, ProjectType } from './inferProjectDetails';

export default function tryGetCSharpProjectDetails(terminal: ITerminal, path: string) {
    try {
        const versionFilePath = `${path}/Properties/AssemblyInfo.cs`;
        const assemblyInfo = terminal.readFileSync(versionFilePath).toString();

        return {
            type: ProjectType.CSharp,
            version: assemblyInfo.match(/AssemblyVersion\(\"([^\"]+)\"/)[1].replace(/\.\d+$/, ''),
            versionFilePath
        } as IProjectDetails;
    } catch (e) { /* Ignore */ }
}
