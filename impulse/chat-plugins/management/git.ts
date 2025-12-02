/*
* Pokemon Showdown
* Git Commands
* Allows pulling git changes directly from chatrooms.
* Note: Remove sudo if you're using windows or android.
* @author PrinceSky-Git
*/

import { FS, Utils } from '../../../lib';
import { execSync } from 'child_process';

const findGitRoot = async (startPath: string): Promise<string | null> => {
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
};

const getErrorMessage = (err: unknown): string => {
	return err instanceof Error ? err.message : String(err);
};

const executeGitCommand = async (command: string, gitRoot: string): Promise<string> => {
	try {
		const output = execSync(command, {
			cwd: gitRoot,
			encoding: 'utf8',
			timeout: 30000,
		});
		return output;
	} catch (err: unknown) {
		const message = getErrorMessage(err);
		throw new Chat.ErrorMessage(`${command} failed: ${message}`);
	}
};

export const commands: Chat.ChatCommands = {
	async gitpull(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;
		this.checkCan('bypassall');

		const gitRoot = await findGitRoot(FS.ROOT_PATH);
		if (!gitRoot) {
			throw new Chat.ErrorMessage('Could not find git root directory.');
		}

		const output = await executeGitCommand('sudo git pull', gitRoot);
		const html = `<details><summary>Git pull completed</summary>` +
			`<pre>${Utils.escapeHTML(output)}</pre></details>`;
		return this.sendReplyBox(html);
	},
	gitpullhelp: [
		`/gitpull - Pulls the latest changes from git repository. Requires: ~`,
	],

	async gitstatus(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;
		this.checkCan('bypassall');

		const gitRoot = await findGitRoot(FS.ROOT_PATH);
		if (!gitRoot) {
			throw new Chat.ErrorMessage('Could not find git root directory.');
		}

		const output = await executeGitCommand('sudo git status', gitRoot);
		const html = `<details><summary>Git status</summary>` +
			`<pre>${Utils.escapeHTML(output)}</pre></details>`;
		return this.sendReplyBox(html);
	},
	gitstatushelp: [
		`/gitstatus - Shows the current git status. Requires: ~`,
	],

	githelp(): void {
		if (!this.runBroadcast()) return;
		const helpList = [
			{
				cmd: "/gitpull",
				desc: "Pulls the latest changes from git repository. Requires: ~.",
			},
			{
				cmd: "/gitstatus",
				desc: "Shows the current git status. Requires: ~.",
			},
		];
		const html = `<center><strong>Git Commands:</strong></center>` +
			`<hr><ul style="list-style-type:none;padding-left:0;">` +
			helpList.map(({ cmd, desc }, i) =>
				`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
			).join('') +
			`</ul>`;
		this.sendReplyBox(html);
	},
};
