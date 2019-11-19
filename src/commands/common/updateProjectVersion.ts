import { resolve } from 'path';
import ITerminal from '../../interfaces/ITerminal';
import getLocalPackageFile from './getLocalPackageFile';

export default async function updateProjectVersion(terminal: ITerminal, version: string) {
    try {
        const packageFileName = resolve(terminal.cwd, 'package.json');
        const packageFile = await getLocalPackageFile(terminal);

        packageFile.version = version;
        terminal.writeFileSync(packageFileName, JSON.stringify(packageFile, null, '\t'));
    } catch (e) {
        const dir = terminal.readdirSync('.');

        for (const folder of dir) {
            try {
                let assemblyInfo = terminal.readFileSync(`./${folder}/Properties/AssemblyInfo.cs`).toString();
                assemblyInfo = assemblyInfo.replace(/AssemblyVersion\(\"([^\"]+)\"/, `AssemblyVersion("${version}.0"`);
                terminal.writeFileSync(`./${folder}/Properties/AssemblyInfo.cs`, assemblyInfo);
            } catch (e) { /* Ignore */ }
        }
    }
}
