/*
* Pokemon Showdown
* Git Commands
* @author PrinceSky-Git
*/
import { FS, Utils } from '../../../lib';
import { execSync } from 'child_process';

const GIT_COMMAND_TIMEOUT = 30000; // 30 seconds
const SUDO_PREFIX = 'sudo '; // Remove 'sudo ' if not needed

async function findGitRoot(startPath: string): Promise<string | null> {
	let currentPath = FS(startPath);

	while (true) {
		const gitPath = FS(`${currentPath.path}/.git`);
		if (await gitPath.exists()) {
			return currentPath.path;
		}

		const parentPath = currentPath.parentDir();
		if (parentPath.path === currentPath.path) {
			return null;
		}
		currentPath = parentPath;
	}
}

async function runGitCommand(command: string): Promise<string> {
	const gitRoot = await findGitRoot(FS.ROOT_PATH);
	if (!gitRoot) {
		throw new Chat.ErrorMessage('Could not find .git root directory.');
	}

	try {
		return execSync(`${SUDO_PREFIX}git ${command}`, {
			cwd: gitRoot,
			encoding: 'utf8',
			timeout: GIT_COMMAND_TIMEOUT,
		});
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err);
		throw new Chat.ErrorMessage(`Git command 'git ${command}' failed: ${message}`);
	}
}

export const commands: Chat.ChatCommands = {
	git: {
		'': 'help',

		async pull(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			this.checkCan('bypassall');

			const output = await runGitCommand('pull');
			return this.sendReplyBox(`<details><summary>Git pull completed</summary><pre>${Utils.escapeHTML(output)}</pre></details>`);
		},
		pullhelp: [`/git pull - Pulls the latest changes from git repository. Requires: ~`],

		async status(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			this.checkCan('bypassall');

			const output = await runGitCommand('status');
			return this.sendReplyBox(`<details><summary>Git status</summary><pre>${Utils.escapeHTML(output)}</pre></details>`);
		},
		statushelp: [`/git status - Shows the current git status. Requires: ~`],

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/git pull", desc: "Pulls the latest changes from git repository. Requires: ~." },
				{ cmd: "/git status", desc: "Shows the current git status. Requires: ~." },
			];
			const html = `<center><strong>Git Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(html);
		},
	},

	gitpull: 'git.pull',
	gitpullhelp: 'git.pullhelp',
	gitstatus: 'git.status',
	gitstatushelp: 'git.statushelp',
	githelp: 'git.help',
};
