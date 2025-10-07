/*
* Pokemon Showdown
* Symbol Colors
* @license MIT
*/

import { FS } from '../../lib';
import { ImpulseDB } from '../../impulse/impulse-db';
import '../utils';

const STAFF_ROOM_ID = 'staff';

interface SymbolColorDocument {
	_id: string; // userid
	color: string; // hex color
	createdAt: Date;
	updatedAt: Date;
}

// Get typed MongoDB collection for symbol colors
const SymbolColorsDB = ImpulseDB<SymbolColorDocument>('symbolcolors');

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
			} as any);
			
			await updateSymbolColors();
			
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
			
			// Use findById() - most efficient for _id lookups
			const existingColor = await SymbolColorsDB.findById(userId);
			if (!existingColor) {
				return this.errorReply('This user does not have a symbol color. Use /symbolcolor set to create one.');
			}
			
			// Validate hex color format
			if (!/^#[0-9A-Fa-f]{6}$/.test(color) && !/^#[0-9A-Fa-f]{3}$/.test(color)) {
				return this.errorReply('Invalid color format. Please use hex format (e.g., #FF5733 or #F73)');
			}
			
			// Use updateOne() with $set operator
			await SymbolColorsDB.updateOne(
				{ _id: userId },
				{ $set: { color, updatedAt: new Date() } }
			);
			
			await updateSymbolColors();
			
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
			
			// Use exists() for efficient check before delete
			if (!await SymbolColorsDB.exists({ _id: userId })) {
				return this.errorReply(`${target} does not have a symbol color.`);
			}
			
			// Use deleteOne() for single document deletion
			await SymbolColorsDB.deleteOne({ _id: userId });
			await updateSymbolColors();
			
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
			
			// Use findWithPagination() - optimized for paginated results
			const result = await SymbolColorsDB.findWithPagination({}, {
				page,
				limit: 20,
				sort: { _id: 1 }
			});
			
			if (result.total === 0) {
				return this.sendReply('No custom symbol colors have been set.');
			}
			
			let output = `<div class="ladder pad"><h2>Custom Symbol Colors (Page ${result.page}/${result.pages})</h2><table style="width: 100%"><tr><th>User</th><th>Color</th><th>Preview</th><th>Created</th></tr>`;
			
			for (const symbolColor of result.data) {
				const created = symbolColor.createdAt ? symbolColor.createdAt.toLocaleDateString() : 'Unknown';
				output += `<tr><td>${symbolColor._id}</td><td>${symbolColor.color}</td><td><span style="color: ${symbolColor.color}; font-size: 24px;">■</span></td><td>${created}</td></tr>`;
			}
			
			output += `</table></div>`;
			
			if (result.pages > 1) {
				output += `<div class="pad"><center>`;
				if (result.page > 1) {
					output += `<button class="button" name="send" value="/symbolcolor list ${result.page - 1}">Previous</button> `;
				}
				if (result.page < result.pages) {
					output += `<button class="button" name="send" value="/symbolcolor list ${result.page + 1}">Next</button>`;
				}
				output += `</center></div>`;
			}
			
			this.sendReply(`|raw|${output}`);
		},
		
		async view(this: CommandContext, target: string, room: Room, user: User) {
			const userId = toID(target);
			if (!userId) return this.parse('/help symbolcolor');
			
			// Use findById() - most efficient for _id lookups
			const symbolColor = await SymbolColorsDB.findById(userId);
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
			
			const documents: any[] = [];
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
			
			// Use insertMany() for bulk inserts - much more efficient than multiple insertOne()
			try {
				await SymbolColorsDB.insertMany(documents);
				await updateSymbolColors();
				this.sendReply(`|raw|Successfully set ${documents.length} custom symbol color(s).`);
				
				const staffRoom = Rooms.get(STAFF_ROOM_ID);
				if (staffRoom) {
					staffRoom.add(`|html|<div class="infobox">${Impulse.nameColor(user.name, true, true)} bulk set ${documents.length} custom symbol colors.</div>`).update();
				}
			} catch (err) {
				this.errorReply(`Error setting symbol colors: ${err}`);
			}
		},
		
		async search(this: CommandContext, target: string, room: Room, user: User) {
			this.checkCan('globalban');
			if (!target) return this.errorReply('Please provide a search term.');
			
			const searchTerm = toID(target);
			
			// Use find() with regex filter for searching
			const symbolColors = await SymbolColorsDB.find({
				_id: { $regex: searchTerm, $options: 'i' } as any
			});
			
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
			
			// Use count() - most efficient way to get document count
			const total = await SymbolColorsDB.count({});
			this.sendReply(`There are currently ${total} custom symbol color(s) set.`);
		},

		''(target, room, user) {
			this.parse('/symbolcolorhelp');
		},
	},

	symbolcolorhelp(target: string, room: ChatRoom | null, user: User) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`<b>Custom Symbol Color Commands:</b><br>` +
			`<ul>` +
			`<li><code>/symbolcolor set [username], [hex color]</code> - Gives [user] a symbol color (e.g., #FF5733)</li>` +
			`<li><code>/symbolcolor update [username], [hex color]</code> - Updates an existing symbol color</li>` +
			`<li><code>/symbolcolor delete [username]</code> - Removes a user's symbol color</li>` +
			`<li><code>/symbolcolor setmany [user1:#color1, user2:#color2, ...]</code> - Bulk set multiple symbol colors</li>` +
			`<li><code>/symbolcolor list [page]</code> - Lists all custom symbol colors with pagination</li>` +
			`<li><code>/symbolcolor view [username]</code> - View details about a user's symbol color</li>` +
			`<li><code>/symbolcolor search [term]</code> - Search for symbol colors by username</li>` +
			`<li><code>/symbolcolor count</code> - Show total number of custom symbol colors</li>` +
			`</ul>` +
			`<small>All commands except view require @ or higher permission.</small>`
		);
	},
};
