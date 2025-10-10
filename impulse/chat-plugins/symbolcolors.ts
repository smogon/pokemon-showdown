/*
* Pokemon Showdown
* Symbol Colors
* @license MIT
*/

import { FS } from '../../lib';
import { ImpulseDB } from '../../impulse/impulse-db';

const STAFF_ROOM_ID = 'staff';
const SYMBOL_COLOR_LOG_PATH = 'logs/symbolcolors.txt';

interface SymbolColorDocument {
	_id: string; // userid
	color: string; // hex color
	createdAt: Date;
	updatedAt: Date;
}

// Get typed MongoDB collection for symbol colors
const SymbolColorsDB = ImpulseDB<SymbolColorDocument>('symbolcolors');

async function logSymbolColorAction(action: string, staff: string, target: string, details?: string): Promise<void> {
	try {
		const timestamp = new Date().toISOString();
		const logEntry = `[${timestamp}] ${action} | Staff: ${staff} | Target: ${target}${details ? ` | ${details}` : ''}\n`;
		await FS(SYMBOL_COLOR_LOG_PATH).append(logEntry);
	} catch (err) {
		console.error('Error writing to symbol color log:', err);
	}
}

async function updateSymbolColors(): Promise<void> {
	try {
		// Fetch all symbol color documents from MongoDB
		const symbolColorDocs = await SymbolColorsDB.find({});
		
		let newCss = '/* SYMBOLCOLORS START */\n';
		
		for (const doc of symbolColorDocs) {
			const userid = doc._id;
			const color = doc.color;
			
			newCss += `[id$="-userlist-user-${userid}"] button > em.group {\n color: ${color}; \n}\n` +
				`\n[class$="chatmessage-${userid}"] strong small, .groupsymbol {\n color: ${color}; \n}\n`;
		}
		
		newCss += '/* SYMBOLCOLORS END */\n';

		const file = FS('config/custom.css').readIfExistsSync().split('\n');
		const start = file.indexOf('/* SYMBOLCOLORS START */');
		const end = file.indexOf('/* SYMBOLCOLORS END */');
		
		if (start !== -1 && end !== -1) {
			file.splice(start, (end - start) + 1);
		}
		
		await FS('config/custom.css').writeUpdate(() => file.join('\n') + newCss);
		Impulse.reloadCSS();
	} catch (err) {
		console.error('Error updating symbol colors:', err);
	}
}

export const commands: Chat.ChatCommands = {
	symbolcolor: {
		async set(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('globalban');
			const [name, color] = target.split(',').map(s => s.trim());
			if (!name || !color) return this.parse('/help symbolcolor');
			
			const userId = toID(name);
			if (userId.length > 19) return this.errorReply('Usernames are not this long...');
			
			// Validate hex color format
			if (!/^#[0-9A-Fa-f]{6}$/.test(color) && !/^#[0-9A-Fa-f]{3}$/.test(color)) {
				return this.errorReply('Invalid color format. Please use hex format (e.g., #FF5733 or #F73)');
			}
			
			// Use exists() - most efficient way to check existence
			if (await SymbolColorsDB.exists({ _id: userId })) {
				return this.errorReply('This user already has a symbol color. Remove it first with /symbolcolor delete [user].');
			}
			
			const now = new Date();
			
			// Use insertOne() for single document insert
			await SymbolColorsDB.insertOne({
				_id: userId,
				color,
				createdAt: now,
				updatedAt: now,
			});
			
			await updateSymbolColors();
			
			// Log the action
			await logSymbolColorAction('SET', user.name, userId, `Color: ${color}`);
			
			this.sendReply(`|raw|You have given ${Impulse.nameColor(name, true, false)} a symbol color: <span style="color: ${color}">■</span>`);

			const targetUser = Users.get(userId);
			if (targetUser?.connected) {
				targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has set your userlist symbol color to <span style="color: ${color}; font-weight: bold;">${color}</span><br /><center>Refresh, If you don't see it.</center>`);
			}

			const staffRoom = Rooms.get(STAFF_ROOM_ID);
			if (staffRoom) {
				staffRoom.add(`|html|<div class="infobox"> ${Impulse.nameColor(user.name, true, true)} set symbol color for ${Impulse.nameColor(name, true, false)}: <span style="color: ${color}">■ ${color}</span></div>`).update();
			}
		},
		
		async update(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('globalban');
			const [name, color] = target.split(',').map(s => s.trim());
			if (!name || !color) return this.parse('/help symbolcolor');
			
			const userId = toID(name);
			
			// Validate hex color format
			if (!/^#[0-9A-Fa-f]{6}$/.test(color) && !/^#[0-9A-Fa-f]{3}$/.test(color)) {
				return this.errorReply('Invalid color format. Please use hex format (e.g., #FF5733 or #F73)');
			}
			
			// Get old color before updating for logging
			const oldSymbolColor = await SymbolColorsDB.findOne(
				{ _id: userId },
				{ projection: { color: 1 } }
			);
			
			if (!oldSymbolColor) {
				return this.errorReply('This user does not have a symbol color. Use /symbolcolor set to create one.');
			}
			
			// Use atomic updateOne with $set - checks existence and updates in one operation
			const result = await SymbolColorsDB.updateOne(
				{ _id: userId },
				{ $set: { color, updatedAt: new Date() } }
			);
			
			await updateSymbolColors();
			
			// Log the action
			await logSymbolColorAction('UPDATE', user.name, userId, `Old: ${oldSymbolColor.color}, New: ${color}`);
			
			this.sendReply(`|raw|You have updated ${Impulse.nameColor(name, true, false)}'s symbol color to: <span style="color: ${color}">■</span>`);

			const targetUser = Users.get(userId);
			if (targetUser?.connected) {
				targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has updated your userlist symbol color to <span style="color: ${color}; font-weight: bold;">${color}</span><br /><center>Refresh, If you don't see it.</center>`);
			}

			const staffRoom = Rooms.get(STAFF_ROOM_ID);
			if (staffRoom) {
				staffRoom.add(`|html|<div class="infobox"> ${Impulse.nameColor(user.name, true, true)} updated symbol color for ${Impulse.nameColor(name, true, false)}: <span style="color: ${color}">■ ${color}</span></div>`).update();
			}
		},

		async delete(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('globalban');
			const userId = toID(target);
			
			// Get symbol color details before deletion for logging
			const symbolColor = await SymbolColorsDB.findOne(
				{ _id: userId },
				{ projection: { color: 1 } }
			);
			
			if (!symbolColor) {
				return this.errorReply(`${target} does not have a symbol color.`);
			}
			
			// Use deleteOne() and check result - single atomic operation
			const result = await SymbolColorsDB.deleteOne({ _id: userId });
			
			await updateSymbolColors();
			
			// Log the action
			await logSymbolColorAction('DELETE', user.name, userId, `Removed color: ${symbolColor.color}`);
			
			this.sendReply(`You removed ${target}'s symbol color.`);

			const targetUser = Users.get(userId);
			if (targetUser?.connected) {
				targetUser.popup(`|html|${Impulse.nameColor(user.name, true, true)} has removed your userlist symbol color.`);
			}

			const staffRoom = Rooms.get(STAFF_ROOM_ID);
			if (staffRoom) {
				staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} removed symbol color for ${Impulse.nameColor(target, true, false)}.</div>`).update();
			}
		},
		
		async list(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('globalban');
			const page = parseInt(target) || 1;
			
			// Use findPaginated() - optimized helper method for pagination
			const result = await SymbolColorsDB.findPaginated({}, {
				page,
				limit: 20,
				sort: { _id: 1 }
			});
			
			if (result.total === 0) {
				return this.sendReply('No custom symbol colors have been set.');
			}
			
			let output = `<div class="ladder pad"><h2>Custom Symbol Colors (Page ${result.page}/${result.totalPages})</h2><table style="width: 100%"><tr><th>User</th><th>Color</th><th>Preview</th><th>Created</th></tr>`;
			
			for (const symbolColor of result.docs) {
				const created = symbolColor.createdAt ? symbolColor.createdAt.toLocaleDateString() : 'Unknown';
				output += `<tr><td>${symbolColor._id}</td><td>${symbolColor.color}</td><td><span style="color: ${symbolColor.color}; font-size: 24px;">■</span></td><td>${created}</td></tr>`;
			}
			
			output += `</table></div>`;
			
			if (result.totalPages > 1) {
				output += `<div class="pad"><center>`;
				if (result.hasPrev) {
					output += `<button class="button" name="send" value="/symbolcolor list ${result.page - 1}">Previous</button> `;
				}
				if (result.hasNext) {
					output += `<button class="button" name="send" value="/symbolcolor list ${result.page + 1}">Next</button>`;
				}
				output += `</center></div>`;
			}
			
			this.sendReply(`|raw|${output}`);
		},
		
		async view(this: CommandContext, target: string, room: Room, user: User) {
			const userId = toID(target);
			if (!userId) return this.parse('/help symbolcolor');
			
			// Use findOne() with projection to only fetch needed fields
			const symbolColor = await SymbolColorsDB.findOne(
				{ _id: userId },
				{ projection: { _id: 1, color: 1, createdAt: 1, updatedAt: 1 } }
			);
			
			if (!symbolColor) {
				return this.sendReply(`${target} does not have a custom symbol color.`);
			}
			
			const created = symbolColor.createdAt ? symbolColor.createdAt.toLocaleString() : 'Unknown';
			const updated = symbolColor.updatedAt ? symbolColor.updatedAt.toLocaleString() : 'Unknown';
			
			this.sendReplyBox(
				`<strong>Symbol Color for ${target}:</strong><br />` +
				`<span style="color: ${symbolColor.color}; font-size: 48px;">■</span><br />` +
				`<strong>Color:</strong> ${symbolColor.color}<br />` +
				`<strong>Created:</strong> ${created}<br />` +
				`<strong>Last Updated:</strong> ${updated}`
			);
		},
		
		async setmany(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('globalban');
			
			// Parse bulk input: userid1:color1, userid2:color2, ...
			const entries = target.split(',').map(s => s.trim()).filter(Boolean);
			if (entries.length === 0) {
				return this.errorReply('No symbol colors to set. Format: /symbolcolor setmany user1:#FF5733, user2:#00FF00');
			}
			
			const documents: SymbolColorDocument[] = [];
			const now = new Date();
			
			for (const entry of entries) {
				const [name, color] = entry.split(':').map(s => s.trim());
				if (!name || !color) continue;
				
				const userId = toID(name);
				if (userId.length > 19) continue;
				
				// Validate hex color format
				if (!/^#[0-9A-Fa-f]{6}$/.test(color) && !/^#[0-9A-Fa-f]{3}$/.test(color)) {
					continue;
				}
				
				documents.push({
					_id: userId,
					color,
					createdAt: now,
					updatedAt: now,
				});
			}
			
			if (documents.length === 0) {
				return this.errorReply('No valid symbol colors to set.');
			}
			
			// Use insertMany() with ordered: false for best performance
			// ordered: false allows MongoDB to continue inserting even if some fail
			try {
				const result = await SymbolColorsDB.insertMany(documents, { ordered: false });
				await updateSymbolColors();
				
				// Log the bulk action
				const userList = documents.map(d => d._id).join(', ');
				await logSymbolColorAction('SETMANY', user.name, `${result.insertedCount} users`, `Users: ${userList}`);
				
				this.sendReply(`|raw|Successfully set ${result.insertedCount} custom symbol color(s).`);
				
				const staffRoom = Rooms.get(STAFF_ROOM_ID);
				if (staffRoom) {
					staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} bulk set ${result.insertedCount} custom symbol colors.</div>`).update();
				}
			} catch (err: any) {
				// Handle duplicate key errors gracefully
				if (err.code === 11000 && err.result?.insertedCount) {
					await updateSymbolColors();
					const userList = documents.map(d => d._id).join(', ');
					await logSymbolColorAction('SETMANY PARTIAL', user.name, `${err.result.insertedCount} users`, `Users: ${userList}, Some duplicates skipped`);
					this.sendReply(`|raw|Successfully set ${err.result.insertedCount} custom symbol color(s). Some users already had colors.`);
				} else {
					await logSymbolColorAction('SETMANY FAILED', user.name, `${documents.length} users`, `Error: ${err.message || err}`);
					this.errorReply(`Error setting symbol colors: ${err.message || err}`);
				}
			}
		},
		
		async search(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('globalban');
			if (!target) return this.errorReply('Please provide a search term.');
			
			const searchTerm = toID(target);
			
			// Use find() with regex filter - only fetch needed fields with projection
			const symbolColors = await SymbolColorsDB.find(
				{ _id: { $regex: searchTerm, $options: 'i' } as any },
				{ projection: { _id: 1, color: 1 }, limit: 50 }
			);
			
			if (symbolColors.length === 0) {
				return this.sendReply(`No symbol colors found matching "${target}".`);
			}
			
			let output = `<div class="ladder pad"><h2>Search Results for "${target}"</h2><table style="width: 100%"><tr><th>User</th><th>Color</th><th>Preview</th></tr>`;
			
			for (const symbolColor of symbolColors) {
				output += `<tr><td>${symbolColor._id}</td><td>${symbolColor.color}</td><td><span style="color: ${symbolColor.color}; font-size: 24px;">■</span></td></tr>`;
			}
			
			output += `</table></div>`;
			this.sendReply(`|raw|${output}`);
		},
		
		async count(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('globalban');
			
			// Use estimatedDocumentCount() - faster than countDocuments() for total count
			const total = await SymbolColorsDB.estimatedDocumentCount();
			this.sendReply(`There are currently ${total} custom symbol color(s) set.`);
		},

		async logs(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('globalban');
			
			try {
				const logContent = await FS(SYMBOL_COLOR_LOG_PATH).readIfExists();
				
				if (!logContent) {
					return this.sendReply('No symbol color logs found.');
				}
				
				const lines = logContent.trim().split('\n');
				const numLines = parseInt(target) || 50;
				
				if (numLines < 1 || numLines > 500) {
					return this.errorReply('Please specify a number between 1 and 500.');
				}
				
				// Get the last N lines and reverse to show latest first
				const recentLines = lines.slice(-numLines).reverse();
				
				let output = `<div class="ladder pad"><h2>Symbol Color Logs (Last ${recentLines.length} entries - Latest First)</h2>`;
				output += `<div style="max-height: 370px; overflow: auto; font-family: monospace; font-size: 11px;">`;
				
				// Add each log entry with a horizontal line separator
				for (let i = 0; i < recentLines.length; i++) {
					output += `<div style="padding: 8px 0;">${Chat.escapeHTML(recentLines[i])}</div>`;
					if (i < recentLines.length - 1) {
						output += `<hr style="border: 0; border-top: 1px solid #ccc; margin: 0;">`;
					}
				}
				
				output += `</div></div>`;
				
				this.sendReply(`|raw|${output}`);
			} catch (err) {
				console.error('Error reading symbol color logs:', err);
				return this.errorReply('Failed to read symbol color logs.');
			}
		},

		''(target, room, user) {
			this.parse('/symbolcolorhelp');
		},
	},
	sc: 'symbolcolor',

	symbolcolorhelp(target: string, room: ChatRoom | null, user: User) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`<b>Custom Symbol Color Commands:</b><br>` +
			`<ul>` +
			`<li><code>/symbolcolor set [username], [hex color]</code> OR <code>/sc set [username], [hex color]</code> - Gives [user] a symbol color (e.g., #FF5733)</li>` +
			`<li><code>/symbolcolor update [username], [hex color]</code> OR <code>/sc update [username], [hex color]</code> - Updates an existing symbol color</li>` +
			`<li><code>/symbolcolor delete [username]</code> OR <code>/sc delete [username]</code> - Removes a user's symbol color</li>` +
			`<li><code>/symbolcolor setmany [user1:#color1, user2:#color2, ...]</code> OR <code>/sc setmany [user1:#color1, user2:#color2, ...]</code> - Bulk set multiple symbol colors</li>` +
			`<li><code>/symbolcolor list [page]</code> OR <code>/sc list [page]</code> - Lists all custom symbol colors with pagination</li>` +
			`<li><code>/symbolcolor view [username]</code> OR <code>/sc view [username]</code> - View details about a user's symbol color</li>` +
			`<li><code>/symbolcolor search [term]</code> OR <code>/sc search [term]</code> - Search for symbol colors by username</li>` +
			`<li><code>/symbolcolor count</code> OR <code>/sc count</code> - Show total number of custom symbol colors</li>` +
			`<li><code>/symbolcolor logs [number]</code> OR <code>/sc logs [number]</code> - View recent symbol color log entries (default: 50, max: 500)</li>` +
			`</ul>` +
			`<small>All commands except view require @ or higher permission.</small>`
		);
	},
	schelp: 'symbolcolorhelp',
};
