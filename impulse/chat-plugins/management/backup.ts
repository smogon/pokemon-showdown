/*
* Pokemon Showdown
* Google Drive Backup Commands
* Automatically backup JSON files from config/ directory to Google Drive
*/

import { FS } from '../../../lib/fs';
import { google } from 'googleapis';
import { Readable } from 'stream';

const BACKUP_CONFIG_FILE = 'impulse/db/backup-config.json';
const DB_DIR = 'impulse/db';

interface BackupConfig {
	enabled: boolean;
	folderId: string | null;
	lastBackup: string | null;
	autoBackupInterval: number; // in milliseconds
	backupAllFiles: boolean; // If true, backup all .json files in impulse/db
	specificFiles: string[]; // Specific files to backup if backupAllFiles is false
}

interface BackupLog {
	timestamp: string;
	fileName: string;
	status: 'success' | 'failed';
	error?: string;
	fileSize?: number;
}

let backupConfig: BackupConfig = {
	enabled: false,
	folderId: null,
	lastBackup: null,
	autoBackupInterval: 24 * 60 * 60 * 1000, // Default: 24 hours
	backupAllFiles: true, // Default: backup all .json files
	specificFiles: [], // Empty means backup all
};

let backupInterval: NodeJS.Timeout | null = null;

const loadBackupConfig = async (): Promise<void> => {
	const data = await FS(BACKUP_CONFIG_FILE).readIfExists();
	if (data) {
		backupConfig = { ...backupConfig, ...JSON.parse(data) };
	}
};

const saveBackupConfig = async (): Promise<void> => {
	await FS(BACKUP_CONFIG_FILE).safeWrite(JSON.stringify(backupConfig, null, 2));
};

class GoogleDriveBackup {
	private static drive: any = null;

	static async initializeDrive(): Promise<boolean> {
		try {
			// You need to set up Google Drive API credentials
			// Instructions: https://developers.google.com/drive/api/v3/quickstart/nodejs
			const auth = new google.auth.GoogleAuth({
				keyFile: 'config/google-credentials.json',
				scopes: ['https://www.googleapis.com/auth/drive.file'],
			});

			this.drive = google.drive({ version: 'v3', auth });
			return true;
		} catch (error) {
			console.error('Failed to initialize Google Drive:', error);
			return false;
		}
	}

	static async createBackupFolder(folderName: string = 'Pokemon Showdown Backups'): Promise<string | null> {
		if (!this.drive) {
			if (!await this.initializeDrive()) return null;
		}

		try {
			const fileMetadata = {
				name: folderName,
				mimeType: 'application/vnd.google-apps.folder',
			};

			const response = await this.drive.files.create({
				requestBody: fileMetadata,
				fields: 'id',
			});

			return response.data.id;
		} catch (error) {
			console.error('Failed to create backup folder:', error);
			return null;
		}
	}

	static async uploadFile(filePath: string, fileName: string, folderId: string): Promise<BackupLog> {
		const timestamp = new Date().toISOString();

		if (!this.drive) {
			if (!await this.initializeDrive()) {
				return {
					timestamp,
					fileName,
					status: 'failed',
					error: 'Failed to initialize Google Drive',
				};
			}
		}

		try {
			const fileContent = await FS(filePath).readBuffer();
			const fileSize = fileContent.length;

			const fileMetadata = {
				name: `${fileName}_${timestamp.replace(/[:.]/g, '-')}`,
				parents: [folderId],
			};

			const media = {
				mimeType: 'application/json',
				body: Readable.from(fileContent),
			};

			await this.drive.files.create({
				requestBody: fileMetadata,
				media: media,
				fields: 'id',
			});

			return {
				timestamp,
				fileName,
				status: 'success',
				fileSize,
			};
		} catch (error: any) {
			return {
				timestamp,
				fileName,
				status: 'failed',
				error: error.message || 'Unknown error',
			};
		}
	}

	static async backupAllFiles(): Promise<BackupLog[]> {
		if (!backupConfig.enabled || !backupConfig.folderId) {
			return [{
				timestamp: new Date().toISOString(),
				fileName: 'all',
				status: 'failed',
				error: 'Backup not enabled or folder ID not set',
			}];
		}

		const logs: BackupLog[] = [];

		for (const fileName of backupConfig.filesToBackup) {
			const filePath = CONFIG_DIR + fileName;
			
			// Check if file exists
			if (!await FS(filePath).exists()) {
				logs.push({
					timestamp: new Date().toISOString(),
					fileName,
					status: 'failed',
					error: 'File does not exist',
				});
				continue;
			}

			const log = await this.uploadFile(filePath, fileName, backupConfig.folderId);
			logs.push(log);
		}

		backupConfig.lastBackup = new Date().toISOString();
		await saveBackupConfig();

		return logs;
	}

	static async backupSingleFile(fileName: string): Promise<BackupLog> {
		if (!backupConfig.folderId) {
			return {
				timestamp: new Date().toISOString(),
				fileName,
				status: 'failed',
				error: 'Folder ID not set',
			};
		}

		const filePath = CONFIG_DIR + fileName;

		if (!await FS(filePath).exists()) {
			return {
				timestamp: new Date().toISOString(),
				fileName,
				status: 'failed',
				error: 'File does not exist',
			};
		}

		return await this.uploadFile(filePath, fileName, backupConfig.folderId);
	}

	static startAutoBackup(): void {
		if (backupInterval) {
			clearInterval(backupInterval);
		}

		if (!backupConfig.enabled || !backupConfig.folderId) {
			return;
		}

		backupInterval = setInterval(async () => {
			console.log('Starting automatic backup...');
			await this.backupAllFiles();
			console.log('Automatic backup completed.');
		}, backupConfig.autoBackupInterval);

		console.log(`Auto-backup enabled. Interval: ${backupConfig.autoBackupInterval / 1000 / 60} minutes`);
	}

	static stopAutoBackup(): void {
		if (backupInterval) {
			clearInterval(backupInterval);
			backupInterval = null;
		}
	}
}

export const commands: Chat.ChatCommands = {
	backup: {
		async setup(target, room, user): Promise<void> {
			this.checkCan('bypassall');
			
			if (!target) {
				return this.sendReply(
					'Usage: /backup setup [folder name] - Creates a Google Drive folder for backups. ' +
					'Default folder name: "Pokemon Showdown Backups"'
				);
			}

			this.sendReply('Setting up Google Drive backup folder...');

			const folderId = await GoogleDriveBackup.createBackupFolder(target);

			if (!folderId) {
				return this.errorReply('Failed to create backup folder. Check your Google Drive credentials.');
			}

			backupConfig.folderId = folderId;
			await saveBackupConfig();

			this.sendReply(`Backup folder created successfully! Folder ID: ${folderId}`);
			this.sendReply('Use /backup enable to start automatic backups.');
		},

		async enable(target, room, user): Promise<void> {
			this.checkCan('bypassall');

			if (!backupConfig.folderId) {
				return this.errorReply('Please run /backup setup first to create a backup folder.');
			}

			backupConfig.enabled = true;
			await saveBackupConfig();

			GoogleDriveBackup.startAutoBackup();

			this.sendReply(
				`Automatic backups enabled! Files will be backed up every ${backupConfig.autoBackupInterval / 1000 / 60 / 60} hours.`
			);
		},

		async disable(target, room, user): Promise<void> {
			this.checkCan('bypassall');

			backupConfig.enabled = false;
			await saveBackupConfig();

			GoogleDriveBackup.stopAutoBackup();

			this.sendReply('Automatic backups disabled.');
		},

		async now(target, room, user): Promise<void> {
			this.checkCan('bypassall');

			if (!backupConfig.folderId) {
				return this.errorReply('Please run /backup setup first to create a backup folder.');
			}

			this.sendReply('Starting backup...');

			const logs = await GoogleDriveBackup.backupAllFiles();
			const successful = logs.filter(l => l.status === 'success').length;
			const failed = logs.filter(l => l.status === 'failed').length;

			let output = `Backup completed! Success: ${successful}, Failed: ${failed}<br><br>`;
			
			logs.forEach(log => {
				const icon = log.status === 'success' ? '✓' : '✗';
				const color = log.status === 'success' ? 'green' : 'red';
				const size = log.fileSize ? ` (${(log.fileSize / 1024).toFixed(2)} KB)` : '';
				const error = log.error ? ` - ${log.error}` : '';
				output += `<span style="color: ${color};">${icon} ${log.fileName}${size}${error}</span><br>`;
			});

			this.sendReplyBox(output);
		},

		async file(target, room, user): Promise<void> {
			this.checkCan('bypassall');

			if (!target) {
				return this.sendReply('Usage: /backup file [filename] - Backup a specific file');
			}

			if (!backupConfig.folderId) {
				return this.errorReply('Please run /backup setup first to create a backup folder.');
			}

			const fileName = target.trim();
			
			if (!backupConfig.filesToBackup.includes(fileName)) {
				return this.errorReply(
					`File not in backup list. Available files: ${backupConfig.filesToBackup.join(', ')}`
				);
			}

			this.sendReply(`Backing up ${fileName}...`);

			const log = await GoogleDriveBackup.backupSingleFile(fileName);

			if (log.status === 'success') {
				this.sendReply(
					`Successfully backed up ${fileName} (${log.fileSize ? (log.fileSize / 1024).toFixed(2) + ' KB' : 'unknown size'})`
				);
			} else {
				this.errorReply(`Failed to backup ${fileName}: ${log.error}`);
			}
		},

		async interval(target, room, user): Promise<void> {
			this.checkCan('bypassall');

			if (!target) {
				const currentHours = backupConfig.autoBackupInterval / 1000 / 60 / 60;
				return this.sendReply(
					`Current backup interval: ${currentHours} hours. ` +
					'Usage: /backup interval [hours] - Set backup interval in hours'
				);
			}

			const hours = parseFloat(target);

			if (isNaN(hours) || hours <= 0) {
				return this.errorReply('Please specify a valid number of hours (e.g., 24, 12, 6)');
			}

			backupConfig.autoBackupInterval = hours * 60 * 60 * 1000;
			await saveBackupConfig();

			if (backupConfig.enabled) {
				GoogleDriveBackup.startAutoBackup();
			}

			this.sendReply(`Backup interval set to ${hours} hours.`);
		},

		async addfile(target, room, user): Promise<void> {
			this.checkCan('bypassall');

			if (!target) {
				return this.sendReply('Usage: /backup addfile [filename] - Add a file to backup list');
			}

			const fileName = target.trim();

			if (backupConfig.filesToBackup.includes(fileName)) {
				return this.errorReply(`${fileName} is already in the backup list.`);
			}

			// Check if file exists
			if (!await FS(CONFIG_DIR + fileName).exists()) {
				return this.errorReply(`File ${fileName} does not exist in config/ directory.`);
			}

			backupConfig.filesToBackup.push(fileName);
			await saveBackupConfig();

			this.sendReply(`Added ${fileName} to backup list.`);
		},

		async removefile(target, room, user): Promise<void> {
			this.checkCan('bypassall');

			if (!target) {
				return this.sendReply('Usage: /backup removefile [filename] - Remove a file from backup list');
			}

			const fileName = target.trim();
			const index = backupConfig.filesToBackup.indexOf(fileName);

			if (index === -1) {
				return this.errorReply(`${fileName} is not in the backup list.`);
			}

			backupConfig.filesToBackup.splice(index, 1);
			await saveBackupConfig();

			this.sendReply(`Removed ${fileName} from backup list.`);
		},

		async status(target, room, user): Promise<void> {
			this.checkCan('bypassall');

			const status = backupConfig.enabled ? 'Enabled' : 'Disabled';
			const folderStatus = backupConfig.folderId ? `Set (${backupConfig.folderId})` : 'Not set';
			const lastBackup = backupConfig.lastBackup || 'Never';
			const intervalHours = backupConfig.autoBackupInterval / 1000 / 60 / 60;

			let output = '<strong>Google Drive Backup Status</strong><br><br>';
			output += `<strong>Status:</strong> ${status}<br>`;
			output += `<strong>Folder ID:</strong> ${folderStatus}<br>`;
			output += `<strong>Last Backup:</strong> ${lastBackup}<br>`;
			output += `<strong>Interval:</strong> ${intervalHours} hours<br>`;
			output += `<strong>Files to Backup (${backupConfig.filesToBackup.length}):</strong><br>`;
			output += '<ul style="margin: 5px 0;">';
			backupConfig.filesToBackup.forEach(file => {
				output += `<li>${file}</li>`;
			});
			output += '</ul>';

			this.sendReplyBox(output);
		},

		help(target, room, user): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/backup setup [folder name]", desc: "Create Google Drive backup folder. Requires: ~." },
				{ cmd: "/backup enable", desc: "Enable automatic backups. Requires: ~." },
				{ cmd: "/backup disable", desc: "Disable automatic backups. Requires: ~." },
				{ cmd: "/backup now", desc: "Backup all files immediately. Requires: ~." },
				{ cmd: "/backup file [filename]", desc: "Backup a specific file. Requires: ~." },
				{ cmd: "/backup interval [hours]", desc: "Set backup interval in hours. Requires: ~." },
				{ cmd: "/backup addfile [filename]", desc: "Add file to backup list. Requires: ~." },
				{ cmd: "/backup removefile [filename]", desc: "Remove file from backup list. Requires: ~." },
				{ cmd: "/backup status", desc: "View backup configuration. Requires: ~." },
			];
			const html = `<center><strong>Google Drive Backup Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul><br><small><strong>Setup Instructions:</strong><br>` +
				`1. Create Google Cloud project and enable Drive API<br>` +
				`2. Create service account and download credentials JSON<br>` +
				`3. Save credentials as config/google-credentials.json<br>` +
				`4. Run /backup setup to create backup folder<br>` +
				`5. Run /backup enable to start automatic backups</small>`;
			this.sendReplyBox(html);
		},

		''(target, room, user): void {
			this.parse('/backup help');
		},
	},

	backuphelp: 'backup.help',
};

void loadBackupConfig();

// Start auto-backup on server start if enabled
if (backupConfig.enabled && backupConfig.folderId) {
	void GoogleDriveBackup.initializeDrive().then(success => {
		if (success) {
			GoogleDriveBackup.startAutoBackup();
		}
	});
}
