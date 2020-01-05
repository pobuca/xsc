import { resolve } from 'path';
import { URL } from 'url';
import { GitRemoteHost } from '../../interfaces/GitRemoteHost';
import ITerminal from '../../interfaces/ITerminal';

export default async function inferRepoRemoteHostDetails(terminal: ITerminal) {
    const gitConfig = getParsedGitConfig(terminal);
    const remoteUrl = new URL(gitConfig['[remote "origin"]'].url);

    return {
        account: getRepoAccount(remoteUrl),
        host: getRepoRemoteHost(remoteUrl),
        project: getAzureDevOpsProject(remoteUrl),
        repo: getRepoName(remoteUrl),
        url: remoteUrl
    } as IGitRemoteHostDetails;
}

function getRepoAccount(url: URL) {
    return url.pathname.split('/')[1];
}

function getRepoName(url: URL) {
    return url.pathname.split('/').pop();
}

function getAzureDevOpsProject(url: URL) {
    const remoteHost = getRepoRemoteHost(url);
    let result: string | null = null;

    if (remoteHost === GitRemoteHost.AzureDevOps) {
        result = decodeURIComponent(url.pathname.split('/')[2]);
    }

    return result;
}

function getRepoRemoteHost(url: URL) {
    const host = url.host;

    if (host in GitRemoteHostMap) {
        return GitRemoteHostMap[host];
    } else {
        throw new Error(`Unknown remote host: ${url.host}`);
    }
}

function getParsedGitConfig(terminal: ITerminal) {
    const gitConfig = getGitConfig(terminal);
    const parsed = {} as { [key: string]: { [key: string]: string } };
    let lastKey: string;

    for (const line of gitConfig.split('\n')) {
        if (line) {
            const parsedLine = parseGitConfigLine(lastKey, parsed[lastKey], line);

            lastKey = parsedLine.lastKey;
            parsed[lastKey] = parsedLine.parsed;
        }
    }

    return parsed;
}

function parseGitConfigLine(lastKey: string, lastHashObject: { [key: string]: string }, line: string) {
    if (line.match(/^\[/)) {
        lastKey = line;
        lastHashObject = {};
    } else {
        const key = line.match(/^\t([^ ]+) \=/)?.[1];
        const value = line.match(/^\t[^ ]+ \= (.*)$/)?.[1];

        lastHashObject[key] = value;
    }

    return { lastKey, parsed: lastHashObject };
}

function getGitConfig(terminal: ITerminal) {
    return terminal.readFileSync(resolve(terminal.cwd, './.git/config')).toString();
}

const GitRemoteHostMap: { [key: string]: GitRemoteHost } = {
    'dev.azure.com': GitRemoteHost.AzureDevOps,
    'github.com': GitRemoteHost.GitHub
};

interface IGitRemoteHostDetails {
    url: URL;
    host: GitRemoteHost;

    /**
     * Azure Devops only
     */
    project: string;

    /**
     * Repo name
     */
    repo: string;

    /**
     * Azure Devops organization or Github username
     */
    account: string;
}
