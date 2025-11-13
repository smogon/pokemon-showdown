/*
* Pokemon Showdown
* File Management commands
* @author PrinceSky-Git
*/
import { FS, Utils } from '../../../lib';

const DIR_TO_BACKUP = 'impulse/db';
const GIST_API_URL = 'https://api.github.com/gists';
const GITHUB_API_VERSION = '2022-11-28';
const USER_AGENT = 'Pokemon-Showdown';
const WHITELIST_ERROR = 'You are not whitelisted to use this command.';

const checkWhitelist = (user: User) => {
	if (!Config.fileWhitelist?.includes(user.id)) {
		throw new Chat.ErrorMessage(WHITELIST_ERROR);
	}
};

const uploadToGist = async (fileName: string, content: string, description: string): Promise<string> => {
	const gistData = {
		description,
		public: false,
		files: {
			[fileName]: { content },
		},
	};

	const response = await fetch(GIST_API_URL, {
		method: 'POST',
		headers: {
			'Accept': 'application/vnd.github+json',
			'Authorization': `Bearer ${Config.githubToken}`,
			'X-GitHub-Api-Version': GITHUB_API_VERSION,
			'User-Agent': USER_AGENT,
		},
		body: JSON.stringify(gistData),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || response.statusText);
	}

	const result = await response.json();
	return result.html_url;
};

export const commands: Chat.ChatCommands = {
	file: {
		'': 'help',

		async read(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			this.checkCan('bypassall');
			checkWhitelist(user);

			if (!target) {
				throw new Chat.ErrorMessage('Please specify a file path.');
			}
			const filePath = target.trim();

			try {
				const file = FS(filePath);
				if (!await file.exists()) {
					throw new Chat.ErrorMessage(`File not found: ${filePath}`);
				}
				if (!await file.isFile()) {
					throw new Chat.ErrorMessage(`Path is not a file: ${filePath}`);
				}

				const content = await file.read();
				return this.sendReplyBox(
					`<details>` +
					`<summary>File: ${Utils.escapeHTML(filePath)}</summary>` +
					`<pre style="max-height: 400px; overflow-y: auto;">${Utils.escapeHTML(content)}</pre>` +
					`</details>`
				);
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : String(err);
				throw new Chat.ErrorMessage(`Failed to read file: ${message}`);
			}
		},
		readhelp: [`/file read [path] - Reads and displays the contents of a file. Requires: ~ and whitelist`],

		async delete(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			this.checkCan('bypassall');
			checkWhitelist(user);

			if (!target) {
				throw new Chat.ErrorMessage('Please specify a file path.');
			}
			const filePath = target.trim();

			try {
				const file = FS(filePath);
				if (!await file.exists()) {
					throw new Chat.ErrorMessage(`File not found: ${filePath}`);
				}
				await file.unlinkIfExists();
				return this.sendReply(`File deleted: ${filePath}`);
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : String(err);
				throw new Chat.ErrorMessage(`Failed to delete file: ${message}`);
			}
		},
		deletehelp: [`/file delete [path] - Deletes a file. Requires: ~ and whitelist`],

		async move(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			this.checkCan('bypassall');
			checkWhitelist(user);

			const [source, destination] = target.split(',').map(s => s.trim());
			if (!source || !destination) {
				throw new Chat.ErrorMessage('Usage: /file move source, destination');
			}

			try {
				const sourceFile = FS(source);
				if (!await sourceFile.exists()) {
					throw new Chat.ErrorMessage(`Source file not found: ${source}`);
				}
				await sourceFile.rename(FS(destination).path);
				return this.sendReply(`File moved from ${source} to ${destination}`);
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : String(err);
				throw new Chat.ErrorMessage(`Failed to move file: ${message}`);
			}
		},
		movehelp: [`/file move [source], [destination] - Moves a file. Requires: ~ and whitelist`],

		async copy(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			this.checkCan('bypassall');
			checkWhitelist(user);

			const [source, destination] = target.split(',').map(s => s.trim());
			if (!source || !destination) {
				throw new Chat.ErrorMessage('Usage: /file copy source, destination');
			}

			try {
				const sourceFile = FS(source);
				if (!await sourceFile.exists()) {
					throw new Chat.ErrorMessage(`Source file not found: ${source}`);
				}
				const content = await sourceFile.read();
				await FS(destination).write(content);
				return this.sendReply(`File copied from ${source} to ${destination}`);
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : String(err);
				throw new Chat.ErrorMessage(`Failed to copy file: ${message}`);
			}
		},
		copyhelp: [`/file copy [source], [destination] - Copies a file. Requires: ~ and whitelist`],

		async rename(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			this.checkCan('bypassall');
			checkWhitelist(user);

			const [source, destination] = target.split(',').map(s => s.trim());
			if (!source || !destination) {
				throw new Chat.ErrorMessage('Usage: /file rename source, destination');
			}

			try {
				const sourceFile = FS(source);
				if (!await sourceFile.exists()) {
					throw new Chat.ErrorMessage(`Source file not found: ${source}`);
				}
				await sourceFile.rename(FS(destination).path);
				return this.sendReply(`File renamed from ${source} to ${destination}`);
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : String(err);
				throw new Chat.ErrorMessage(`Failed to rename file: ${message}`);
			}
		},
		renamehelp: [`/file rename [source], [destination] - Renames a file. Requires: ~ and whitelist`],

		async upload(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			this.checkCan('bypassall');
			checkWhitelist(user);

			if (!target) {
				throw new Chat.ErrorMessage('Please specify a file path.');
			}
			const filePath = target.trim();

			try {
				const file = FS(filePath);
				if (!await file.exists()) {
					throw new Chat.ErrorMessage(`File not found: ${filePath}`);
				}
				if (!await file.isFile()) {
					throw new Chat.ErrorMessage(`Path is not a file: ${filePath}`);
				}

				const content = await file.read();
				const fileName = filePath.split('/').pop() || 'file.txt';
				const description = `Uploaded from Pokemon Showdown: ${filePath}`;

				const url = await uploadToGist(fileName, content, description);

				return this.sendReplyBox(
					`<strong>File uploaded successfully!</strong><br />` +
					`File: ${Utils.escapeHTML(filePath)}<br />` +
					`Gist URL: <a href="${url}" target="_blank">${url}</a>`
				);
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : String(err);
				throw new Chat.ErrorMessage(`Failed to upload file: ${message}`);
			}
		},
		uploadhelp: [`/file upload [path] - Uploads a file to GitHub Gist. Requires: ~ and whitelist`],

		async save(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			this.checkCan('bypassall');
			checkWhitelist(user);

			const [filePath, url] = target.split(',').map(s => s.trim());
			if (!filePath || !url) {
				throw new Chat.ErrorMessage('Usage: /file save [path], [GitHub/Gist raw URL]');
			}

			try {
				const response = await fetch(url, {
					headers: { 'User-Agent': USER_AGENT },
				});
				if (!response.ok) {
					throw new Chat.ErrorMessage(`Failed to fetch content from URL: ${response.statusText}`);
				}
				const content = await response.text();
				await FS(filePath).write(content);
				return this.sendReply(`File saved successfully: ${filePath} (${content.length} bytes)`);
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : String(err);
				throw new Chat.ErrorMessage(`Failed to save file: ${message}`);
			}
		},
		savehelp: [`/file save [path], [GitHub/Gist raw URL] - Downloads and saves a file from URL. Requires: ~ and whitelist`],

		async backup(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;
			this.checkCan('bypassall');
			checkWhitelist(user);

			try {
				const dir = FS(DIR_TO_BACKUP);
				if (!await dir.exists()) {
					throw new Chat.ErrorMessage(`Directory not found: ${DIR_TO_BACKUP}`);
				}
				if (!await dir.isDirectory()) {
					throw new Chat.ErrorMessage(`Path is not a directory: ${DIR_TO_BACKUP}`);
				}

				const files = await dir.readdir();
				const jsonFiles = files.filter(file => file.endsWith('.json'));

				if (jsonFiles.length === 0) {
					throw new Chat.ErrorMessage(`No .json files found in ${DIR_TO_BACKUP}`);
				}

				this.sendReply(`Starting backup of ${jsonFiles.length} JSON file(s) from ${DIR_TO_BACKUP}...`);

				const results = [];
				const errors = [];

				for (const fileName of jsonFiles) {
					try {
						const filePath = `${DIR_TO_BACKUP}/${fileName}`;
						const content = await FS(filePath).read();
						const description = `Backup from Pokemon Showdown: ${filePath}`;
						const url = await uploadToGist(fileName, content, description);
						results.push({ fileName, url });
					} catch (err: unknown) {
						const message = err instanceof Error ? err.message : String(err);
						errors.push(`${fileName}: ${message}`);
					}
				}

				let html = `<strong>Backup Complete!</strong><br />`;
				html += `<strong>Successfully uploaded ${results.length} of ${jsonFiles.length} file(s)</strong><br /><br />`;

				if (results.length > 0) {
					html += `<details><summary>Successful Uploads (${results.length})</summary><ul>`;
					for (const { fileName, url } of results) {
						html += `<li>${Utils.escapeHTML(fileName)}: <a href="${url}" target="_blank">${url}</a></li>`;
					}
					html += `</ul></details>`;
				}

				if (errors.length > 0) {
					html += `<details><summary>Failed Uploads (${errors.length})</summary><ul>`;
					for (const error of errors) {
						html += `<li>${Utils.escapeHTML(error)}</li>`;
					}
					html += `</ul></details>`;
				}
				return this.sendReplyBox(html);
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : String(err);
				throw new Chat.ErrorMessage(`Failed to backup files: ${message}`);
			}
		},
		backuphelp: [`/file backup - Uploads all .json files from impulse/db directory to GitHub Gist. Requires: ~ and whitelist`],

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/file read [path]", desc: "Reads and displays the contents of a file. Requires: Whitelisted User." },
				{ cmd: "/file delete [path]", desc: "Deletes a file. Requires: Whitelisted User." },
				{ cmd: "/file move [source], [destination]", desc: "Moves a file. Requires: Whitelisted User." },
				{ cmd: "/file copy [source], [destination]", desc: "Copies a file. Requires: Whitelisted User." },
				{ cmd: "/file rename [source], [destination]", desc: "Renames a file. Requires: Whitelisted User." },
				{ cmd: "/file upload [path]", desc: "Uploads a file to GitHub Gist. Requires: Whitelisted User." },
				{
					cmd: "/file save [path], [GitHub/Gist raw URL]",
					desc: "Downloads and saves a file from URL. Requires: Whitelisted User.",
				},
				{ cmd: "/file backup", desc: "Uploads all .json files from impulse/db directory to GitHub Gist. Requires: Whitelisted User." },
			];
			const html = `<center><strong>File Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul>`;
			this.sendReplyBox(html);
		},
	},
};
