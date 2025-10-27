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

export const commands: Chat.ChatCommands = {
	async gitpull(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;
		this.checkCan('bypassall');
		
		const gitRoot = await findGitRoot(FS.ROOT_PATH);
		if (!gitRoot) {
			throw new Chat.ErrorMessage('Could not find git root directory.');
		}
		
		try {
			const output = execSync('sudo git pull', {
				cwd: gitRoot,
				encoding: 'utf8',
				timeout: 30000,
			});
			
			return this.sendReplyBox(`<details><summary>Git pull completed</summary><pre>${Utils.escapeHTML(output)}</pre></details>`);
			this.room.add(`|html|<div class="infobox">${user.name} pulled latest changes from git repository.</div>`);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			throw new Chat.ErrorMessage(`Git pull failed: ${message}`);
		}
	},
	gitpullhelp: [`/gitpull - Pulls the latest changes from git repository. Requires: ~`],
	
	async gitstatus(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;
		this.checkCan('bypassall');
		
		const gitRoot = await findGitRoot(FS.ROOT_PATH);
		if (!gitRoot) {
			throw new Chat.ErrorMessage('Could not find git root directory.');
		}
		
		try {
			const output = execSync('sudo git status', {
				cwd: gitRoot,
				encoding: 'utf8',
				timeout: 30000,
			});
			
			return this.sendReplyBox(`<details><summary>Git status</summary><pre>${Utils.escapeHTML(output)}</pre></details>`);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			throw new Chat.ErrorMessage(`Git status failed: ${message}`);
		}
	},
	gitstatushelp: [`/gitstatus - Shows the current git status. Requires: ~`],
	
	async githelp(): Promise<void> {
		if (!this.runBroadcast()) return;
		const helpList = [
			{cmd: "/gitpull", desc: "Pulls the latest changes from git repository. Requires: ~."},
			{cmd: "/gitstatus", desc: "Shows the current git status. Requires: ~."},
		];
		const html = `<center><strong>Git Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
			helpList.map(({cmd, desc}, i) =>
				`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
			).join('') +
			`</ul>`;
		this.sendReplyBox(html);
	},
};
