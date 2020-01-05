import chalk from 'chalk';
import Command from '../classes/Command';

const { green, red } = chalk;

export default class XSCCommand extends Command {
    public static command = 'xsc';
    public static defaultGitFlowConfig = [
        '',
        '[gitflow "branch"]',
        '\tmaster = master',
        '\tdevelop = develop',
        '[gitflow "prefix"]',
        '\tfeature = feature/',
        '\tbugfix = ',
        '\trelease = release/',
        '\thotfix = hotfix/',
        '\tsupport = ',
        '\tversiontag = '
    ].join('\n');

    private static asciiLogo = [
        ' _  _  ___   ___ ',
        '( \\/ )/ __) / __)',
        ' )  ( \\__ \\( (__ ',
        `(_/\\_)(___/ \\___) v${require('../../package').version}`,
        '        by Pobuca',
        ''
    ];

    public async invoke(subCommand: SubCommand) {
        if (subCommand === SubCommand.Init) {
            await this.initializeRepo();
        } else {
            await this.statusCommand();
        }
    }

    private async statusCommand() {
        for (const line of XSCCommand.asciiLogo) {
            this.emit('raw', line);
        }

        await this.verifyCommand('git', 'git --version', [
            'Download from https://git-scm.com/downloads',
            'Verify it is in your PATH by running `git`'
        ]);
        await this.verifyCommand('git flow', 'git flow version', [
            'Update or install git (https://git-scm.com/downloads)',
            'Verify by running `git flow --version`'
        ]);
        await this.verifyCommand('hub', 'hub --version', [
            'Download the latest hub release (https://github.com/github/hub/releases)',
            'Add binary to your PATH',
            'Verify by running `hub --version`'
        ]);
        await this.verifyCommand('az', 'az --version', [
            'Download & install (https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)',
            'Verify it is in your PATH',
            'Log in by running `az login`'
        ]);
        await this.verifyCommand('az devops', 'az devops -h', [
            'Install or update your Azure CLI (https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)',
            'Run `az extension add --name azure-devops`',
            'Log in by running `az login`'
        ]);
    }

    private async verifyCommand(commandName: string, command: string, fixSteps: string[]) {
        const indentation = ' '.repeat(4);
        try {
            await this.execSync(command, { stdio: 'ignore' }, true);
            this.emit('raw', `${indentation}${green('√')} ${commandName}`);
        } catch (e) {
            this.emit('raw', `${indentation}${red('x')} ${commandName}`);
            let count = 1;

            for (const step of fixSteps) {
                this.emit('raw', `${indentation.repeat(2)}${red(`${count}. ${step}`)}`);
                count++;
            }
        }
    }

    private async initializeRepo() {
        try {
            await this.execSync('git status');
        } catch (e) {
            await this.execSync('git init');
            await this.execSync('git add . && git commit -m "Initial commit"');
        }

        this.initializeGitFlow();
    }

    private async initializeGitFlow() {
        const gitConfigFilePath = '.git/config';
        let gitConfigFile = this.terminal.readFileSync(gitConfigFilePath).toString();

        if (!this.containsGitFlowOptions(gitConfigFile)) {
            gitConfigFile += XSCCommand.defaultGitFlowConfig;
            this.terminal.writeFileSync(gitConfigFilePath, gitConfigFile);
        }
    }

    private containsGitFlowOptions(configFile: string) {
        const lines = configFile.split('\n');

        for (const line of lines) {
            if (line.match(/^\[gitflow /)) {
                return true;
            }
        }

        return false;
    }
}

enum SubCommand {
    Init = 'init'
}
