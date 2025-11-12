/*
* Pokemon Showdown
* Git Commands
* Allows pulling git changes directly from chatrooms.
* Note: Remove sudo if you're using windows or android.
* @author PrinceSky-Git
*/

import { FS, Utils } from '../../../lib';
import { execSync } from 'child_process';

async function findGitRoot(startPath: string): Promise<string | null> {
	let cur = FS(startPath);
	while (true) {
		if (await FS(`${cur.path}/.git`).exists()) return cur.path;
		const parent = cur.parentDir();
		if (parent.path === cur.path) return null;
		cur = parent;
	}
}

async function runGitCmd(ctx: any, cmd: string, label: string): Promise<void> {
	const gitRoot = await findGitRoot(FS.ROOT_PATH);
	if (!gitRoot) throw new Chat.ErrorMessage('Could not find git root directory.');
	try {
		const output = execSync(`sudo git ${cmd}`, { cwd: gitRoot, encoding: 'utf8', timeout: 30000 });
		return ctx.sendReplyBox(`<details><summary>${label}</summary><pre>${Utils.escapeHTML(output)}</pre></details>`);
	} catch (err: unknown) {
		throw new Chat.ErrorMessage(`Git ${cmd} failed: ${err instanceof Error ? err.message : String(err)}`);
	}
}

export const commands: Chat.ChatCommands = {
	async gitpull(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;
		this.checkCan('bypassall');
		await runGitCmd(this, 'pull', 'Git pull completed');
	},
	gitpullhelp: [`/gitpull - Pulls the latest changes from git repository. Requires: ~`],

	async gitstatus(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;
		this.checkCan('bypassall');
		await runGitCmd(this, 'status', 'Git status');
	},
	gitstatushelp: [`/gitstatus - Shows the current git status. Requires: ~`],

	githelp(): void {
		if (!this.runBroadcast()) return;
		const cmds = [
			["/gitpull", "Pulls the latest changes from git repository. Requires: ~."],
			["/gitstatus", "Shows the current git status. Requires: ~."],
		];
		this.sendReplyBox(
			`<center><strong>Git Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
			cmds.map(([c, d], i) => `<li><b>${c}</b> - ${d}</li>${i < cmds.length - 1 ? '<hr>' : ''}`).join('') +
			`</ul>`
		);
	},
};
