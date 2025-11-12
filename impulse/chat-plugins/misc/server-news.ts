/*
* Pokemon Showdown
* News Commands
* @author PrinceSky-Git
*/

import { ImpulseDB } from '../../impulse-db';
import { nameColor } from '../../colors';

interface NewsEntry {
	_id?: unknown;
	title: string;
	postedBy: string;
	desc: string;
	postTime: string;
	timestamp: number;
}

const serverName = Config.serverName || 'Impulse';
const NewsDB = ImpulseDB<NewsEntry>('news');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (date: Date = new Date()): string =>
	`${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;

class NewsManager {
	static async generateNewsDisplay(): Promise<string[]> {
		const news = await NewsDB.find({}, { sort: { timestamp: -1 }, limit: 3, projection: { title: 1, desc: 1, postedBy: 1, postTime: 1 } });
		return news.map(entry =>
			`<center><strong>${entry.title}</strong></center><br>${entry.desc}<br><br>` +
			`<small>-<em> ${nameColor(entry.postedBy, true, false)}</em> on ${entry.postTime}</small>`
		);
	}

	static async onUserConnect(user: User): Promise<void> {
		if (!await NewsDB.exists({})) return;
		const news = await this.generateNewsDisplay();
		if (news.length) user.send(`|pm| ${serverName} News|${user.getIdentity()}|/raw ${news.join('<hr>')}`);
	}

	static async addNews(title: string, desc: string, user: User): Promise<string> {
		await NewsDB.insertOne({ title, postedBy: user.name, desc, postTime: formatDate(), timestamp: Date.now() });
		return `Added: ${title}`;
	}

	static async deleteNews(title: string): Promise<string | null> {
		const result = await NewsDB.deleteOne({ title });
		return result.deletedCount === 0 ? `News "${title}" not found.` : `Deleted: ${title}`;
	}

	static async updateNews(title: string, newDesc: string): Promise<string | null> {
		const result = await NewsDB.updateOne({ title }, { $set: { desc: newDesc } });
		return result.matchedCount === 0 ? `News "${title}" not found.` : `Updated: ${title}`;
	}

	static async deleteOldNews(daysOld = 90): Promise<number> {
		const result = await NewsDB.deleteMany({ timestamp: { $lt: Date.now() - (daysOld * 86400000) } });
		return result.deletedCount || 0;
	}
}

export const loginfilter = (user: User, oldUser: User | null, userType: string): void => {
	void NewsManager.onUserConnect(user);
};

export const commands: Chat.ChatCommands = {
	servernews: {
		'': 'view',
		display: 'view',
		async view(target, room, user): Promise<void> {
			const news = await NewsManager.generateNewsDisplay();
			const output = news.length ?
				`<center><strong>Server News:</strong></center>${news.join('<hr>')}` :
				`<center><strong>Server News:</strong></center><center><em>No news.</em></center>`;

			user.send(`|popup||html|<div class="infobox">${output}</div>`);
		},

		async add(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.parse('/help servernewshelp');
			const [title, ...descParts] = target.split(',');
			if (!descParts.length) return this.errorReply("Usage: /servernews add [title], [desc]");
			if (await NewsDB.exists({ title })) return this.errorReply(`"${title}" exists. Use /servernews update.`);

			await NewsManager.addNews(title, descParts.join(','), user);
			this.sendReply(`Added: "${title}"`);
		},

		async update(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.parse('/help servernewshelp');
			const [title, ...descParts] = target.split(',');
			if (!descParts.length) return this.errorReply("Usage: /servernews update [title], [new desc]");

			const result = await NewsManager.updateNews(title, descParts.join(','));
			if (result?.includes('not found')) return this.errorReply(result);

			this.sendReply(`Updated: "${title}"`);
		},

		remove: 'delete',
		async delete(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.parse('/help servernewshelp');

			const result = await NewsManager.deleteNews(target);
			if (result?.includes('not found')) return this.errorReply(result);

			this.sendReply(`Deleted: "${target}"`);
		},

		async cleanup(target, room, user): Promise<void> {
			this.checkCan('bypassall');
			const days = Math.max(parseInt(target) || 90, 1);
			const deleted = await NewsManager.deleteOldNews(days);
			this.sendReply(`Deleted ${deleted} news item(s) older than ${days} days.`);
		},
	},
	svn: 'servernews',

	servernewshelp(): void {
		if (!this.runBroadcast()) return;
		const cmds = [
			["/servernews view", "View the latest 3 server news."],
			["/servernews add [title], [desc]", "Add a news. Requires: &."],
			["/servernews update [title], [desc]", "Update a news. Requires: &."],
			["/servernews delete [title]", "Delete a news. Requires: &."],
			["/servernews cleanup [days]", "Delete news older than [days] days. Requires: ~."],
		];
		this.sendReplyBox(
			`<center><strong>Server News Commands:<br>Alias: /svn</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
			cmds.map(([c, d], i) => `<li><b>${c}</b> - ${d}</li>${i < cmds.length - 1 ? '<hr>' : ''}`).join('') +
			`</ul>`
		);
	},
	svnhelp: 'servernewshelp',
};
