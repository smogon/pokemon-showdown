/*
* Pokemon Showdown
* Files Commands
* Allows reading, deleting, uploading and more from chatrooms.
* @author PrinceSky-Git
*/

import { FS, Utils } from '../../../lib';

const DIR_TO_BACKUP = 'impulse/db';

function checkAuth(user: any): void {
	if (!Config.fileWhitelist?.includes(user.id)) {
		throw new Chat.ErrorMessage('You are not whitelisted to use this command.');
	}
}

async function handleFileOp(
	ctx: any,
	filePath: string,
	operation: (file: any) => Promise<string>,
	opName: string
): Promise<void> {
	try {
		const file = FS(filePath);
		if (!await file.exists()) throw new Chat.ErrorMessage(`File not found: ${filePath}`);
		const result = await operation(file);
		return ctx.sendReply(result);
	} catch (err: unknown) {
		throw new Chat.ErrorMessage(`Failed to ${opName}: ${err instanceof Error ? err.message : String(err)}`);
	}
}

async function uploadToGist(filePath: string, content: string): Promise<any> {
	const fileName = filePath.split('/').pop() || 'file.txt';
	const res = await fetch('https://api.github.com/gists', {
		method: 'POST',
		headers: {
			'Accept': 'application/vnd.github+json',
			'Authorization': `Bearer ${Config.githubToken}`,
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'Pokemon-Showdown',
		},
		body: JSON.stringify({
			description: `Uploaded from Pokemon Showdown: ${filePath}`,
			public: false,
			files: { [fileName]: { content } },
		}),
	});
	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || res.statusText);
	}
	return res.json();
}

export const commands: Chat.ChatCommands = {
	async fileread(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;
		this.checkCan('bypassall');
		checkAuth(user);
		if (!target) throw new Chat.ErrorMessage('Please specify a file path.');

		try {
			const file = FS(target.trim());
			if (!await file.exists()) throw new Chat.ErrorMessage(`File not found: ${target}`);
			if (!await file.isFile()) throw new Chat.ErrorMessage(`Path is not a file: ${target}`);
			const content = await file.read();
			return this.sendReplyBox(
				`<details><summary>File: ${Utils.escapeHTML(target)}</summary>` +
				`<pre style="max-height: 400px; overflow-y: auto;">${Utils.escapeHTML(content)}</pre></details>`
			);
		} catch (err: unknown) {
			throw new Chat.ErrorMessage(`Failed to read file: ${err instanceof Error ? err.message : String(err)}`);
		}
	},
	filereadhelp: [`/fileread [path] - Reads and displays the contents of a file. Requires: ~ and whitelist`],

	async filedelete(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;
		this.checkCan('bypassall');
		checkAuth(user);
		if (!target) throw new Chat.ErrorMessage('Please specify a file path.');
		await handleFileOp(this, target.trim(), async (f) => {
			await f.unlinkIfExists();
			return `File deleted: ${target}`;
		}, 'delete file');
	},
	filedeletehelp: [`/filedelete [path] - Deletes a file. Requires: ~ and whitelist`],

	async filemove(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;
		this.checkCan('bypassall');
		checkAuth(user);
		const [src, dest] = target.split(',').map(s => s.trim());
		if (!src || !dest) throw new Chat.ErrorMessage('Usage: /filemove source, destination');
		await handleFileOp(this, src, async (f) => {
			await f.rename(FS(dest).path);
			return `File moved from ${src} to ${dest}`;
		}, 'move file');
	},
	filemovehelp: [`/filemove [source], [destination] - Moves a file. Requires: ~ and whitelist`],

	async filecopy(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;
		this.checkCan('bypassall');
		checkAuth(user);
		const [src, dest] = target.split(',').map(s => s.trim());
		if (!src || !dest) throw new Chat.ErrorMessage('Usage: /filecopy source, destination');
		await handleFileOp(this, src, async (f) => {
			await FS(dest).write(await f.read());
			return `File copied from ${src} to ${dest}`;
		}, 'copy file');
	},
	filecopyhelp: [`/filecopy [source], [destination] - Copies a file. Requires: ~ and whitelist`],

	async filerename(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;
		this.checkCan('bypassall');
		checkAuth(user);
		const [src, dest] = target.split(',').map(s => s.trim());
		if (!src || !dest) throw new Chat.ErrorMessage('Usage: /filerename source, destination');
		await handleFileOp(this, src, async (f) => {
			await f.rename(FS(dest).path);
			return `File renamed from ${src} to ${dest}`;
		}, 'rename file');
	},
	filerenamehelp: [`/filerename [source], [destination] - Renames a file. Requires: ~ and whitelist`],

	async fileupload(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;
		this.checkCan('bypassall');
		checkAuth(user);
		if (!target) throw new Chat.ErrorMessage('Please specify a file path.');

		try {
			const file = FS(target.trim());
			if (!await file.exists()) throw new Chat.ErrorMessage(`File not found: ${target}`);
			if (!await file.isFile()) throw new Chat.ErrorMessage(`Path is not a file: ${target}`);
			const result = await uploadToGist(target, await file.read());
			return this.sendReplyBox(
				`<strong>File uploaded successfully!</strong><br />File: ${Utils.escapeHTML(target)}<br />` +
				`Gist URL: <a href="${result.html_url}" target="_blank">${result.html_url}</a>`
			);
		} catch (err: unknown) {
			throw new Chat.ErrorMessage(`Failed to upload file: ${err instanceof Error ? err.message : String(err)}`);
		}
	},
	fileuploadhelp: [`/fileupload [path] - Uploads a file to GitHub Gist. Requires: ~ and whitelist`],

	async filesave(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;
		this.checkCan('bypassall');
		checkAuth(user);
		const [path, url] = target.split(',').map(s => s.trim());
		if (!path || !url) throw new Chat.ErrorMessage('Usage: /filesave [path], [GitHub/Gist raw URL]');

		try {
			const res = await fetch(url, { headers: { 'User-Agent': 'Pokemon-Showdown' } });
			if (!res.ok) throw new Chat.ErrorMessage(`Failed to fetch content from URL: ${res.statusText}`);
			const content = await res.text();
			await FS(path).write(content);
			return this.sendReply(`File saved successfully: ${path} (${content.length} bytes)`);
		} catch (err: unknown) {
			throw new Chat.ErrorMessage(`Failed to save file: ${err instanceof Error ? err.message : String(err)}`);
		}
	},
	filesavehelp: [`/filesave [path], [GitHub/Gist raw URL] - Downloads and saves a file from URL. Requires: ~ and whitelist`],

	async filebackup(target, room, user): Promise<void> {
		if (!this.runBroadcast()) return;
		this.checkCan('bypassall');
		checkAuth(user);

		try {
			const dir = FS(DIR_TO_BACKUP);
			if (!await dir.exists()) throw new Chat.ErrorMessage(`Directory not found: ${DIR_TO_BACKUP}`);
			if (!await dir.isDirectory()) throw new Chat.ErrorMessage(`Path is not a directory: ${DIR_TO_BACKUP}`);

			const jsonFiles = (await dir.readdir()).filter(f => f.endsWith('.json'));
			if (!jsonFiles.length) throw new Chat.ErrorMessage(`No .json files found in ${DIR_TO_BACKUP}`);

			this.sendReply(`Starting backup of ${jsonFiles.length} JSON file(s) from ${DIR_TO_BACKUP}...`);

			const results = [], errors = [];
			for (const fileName of jsonFiles) {
				try {
					const result = await uploadToGist(`${DIR_TO_BACKUP}/${fileName}`, await FS(`${DIR_TO_BACKUP}/${fileName}`).read());
					results.push({ fileName, url: result.html_url });
				} catch (err: unknown) {
					errors.push(`${fileName}: ${err instanceof Error ? err.message : String(err)}`);
				}
			}

			let html = `<strong>Backup Complete!</strong><br /><strong>Successfully uploaded ${results.length} of ${jsonFiles.length} file(s)</strong><br /><br />`;
			if (results.length) {
				html += `<details><summary>Successful Uploads (${results.length})</summary><ul>`;
				html += results.map(({ fileName, url }) => `<li>${Utils.escapeHTML(fileName)}: <a href="${url}" target="_blank">${url}</a></li>`).join('');
				html += `</ul></details>`;
			}
			if (errors.length) {
				html += `<details><summary>Failed Uploads (${errors.length})</summary><ul>`;
				html += errors.map(e => `<li>${Utils.escapeHTML(e)}</li>`).join('');
				html += `</ul></details>`;
			}
			return this.sendReplyBox(html);
		} catch (err: unknown) {
			throw new Chat.ErrorMessage(`Failed to backup files: ${err instanceof Error ? err.message : String(err)}`);
		}
	},
	filebackuphelp: [`/filebackup - Uploads all .json files from impulse/db directory to GitHub Gist. Requires: ~ and whitelist`],

	filehelp(): void {
		if (!this.runBroadcast()) return;
		const cmds = [
			["/fileread [path]", "Reads and displays the contents of a file. Requires: Whitelisted User."],
			["/filedelete [path]", "Deletes a file. Requires: Whitelisted User."],
			["/filemove [source], [destination]", "Moves a file. Requires: Whitelisted User."],
			["/filecopy [source], [destination]", "Copies a file. Requires: Whitelisted User."],
			["/filerename [source], [destination]", "Renames a file. Requires: Whitelisted User."],
			["/fileupload [path]", "Uploads a file to GitHub Gist. Requires: Whitelisted User."],
			["/filesave [path], [GitHub/Gist raw URL]", "Downloads and saves a file from URL. Requires: Whitelisted User."],
			["/filebackup", "Uploads all .json files from impulse/db directory to GitHub Gist. Requires: Whitelisted User."],
		];
		this.sendReplyBox(
			`<center><strong>File Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
			cmds.map(([c, d], i) => `<li><b>${c}</b> - ${d}</li>${i < cmds.length - 1 ? '<hr>' : ''}`).join('') +
			`</ul>`
		);
	},
};
