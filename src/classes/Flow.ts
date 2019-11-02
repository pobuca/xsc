import { inc, ReleaseType } from 'semver';
import ITerminal from '../interfaces/ITerminal';

export class Flow {
    private static VersionSegmentFlowMap: { [key in FlowType]: ReleaseType } = {
        hotfix: 'patch',
        release: 'minor',
    };

    constructor(private terminal: ITerminal, private flow: FlowType) { }

    public async findNextVersion(version: string) {
        let out: Buffer;

        do {
            out = await this.terminal.execSync(`git ls-remote origin ${this.flow}/${version}`, { stdio: 'inherit' });

            if (out) {
                version = inc(version, Flow.VersionSegmentFlowMap[this.flow]);
            }
        } while (out);
    }
}

export enum FlowType {
    Release = 'release',
    Hotfix = 'hotfix',
}
