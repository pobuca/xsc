
import { EventEmitter2 } from 'eventemitter2';
import ITerminal from './ITerminal';

export default interface ICommand extends EventEmitter2 {
    terminal: ITerminal;
    invoke(...params: string[]): Promise<void>;
}
