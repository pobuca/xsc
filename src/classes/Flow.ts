// import { inc, ReleaseType } from 'semver';
// import cmd from '../common/execSync';

// export class Flow {
//     private static VersionSegmentFlowMap: { [key in FlowType]: ReleaseType } = {
//         hotfix: 'patch',
//         release: 'minor',
//     };

//     constructor(private flow: FlowType) { }

//     public findNextVersion(version: string) {
//         cmd(`git ls-remote origin ${this.flow}/${version}`, { stdio: 'inherit' })

//         inc(version, Flow.VersionSegmentFlowMap[this.flow]);
//         process.exit(1);
//     }
// }

// export enum FlowType {
//     Release = 'release',
//     Hotfix = 'hotfix',
// }
