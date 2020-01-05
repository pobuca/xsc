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

        await this.verifyCommand('git', 'git --version');
        await this.verifyCommand('git flow', 'git flow version');
        await this.verifyCommand('hub', 'hub --version');
        await this.verifyCommand('az', 'az --version');
        await this.verifyCommand('az devops', 'az devops -h');
    }

    private async verifyCommand(commandName: string, command: string) {
        try {
            await this.execSync(command, { stdio: 'ignore' }, true);
            this.emit('raw', `    ${green('√')} ${commandName}`);
        } catch (e) {
            this.emit('raw', `    ${red('x')} ${commandName}`);
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
