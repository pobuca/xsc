
import { EventEmitter2 } from 'eventemitter2';

export default interface ICommand extends EventEmitter2 {
    invoke(...params: string[]): Promise<void>;
}
