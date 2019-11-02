import { resolve } from 'path';
import ITerminal from '../../interfaces/ITerminal';

export default async function getLocalPackageFile(terminal: ITerminal) {
    return require(resolve(terminal.cwd, 'package'));
}
