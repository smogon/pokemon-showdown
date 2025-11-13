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

const DB_TABLE_NAME = 'news';
const SERVER_NAME = Config.serverName || 'Impulse';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const NEWS_DISPLAY_LIMIT = 3;
const DEFAULT_CLEANUP_DAYS = 90;
const MS_IN_DAY = 86400000;

const formatDate = (date: Date = new Date()): string =>
	`${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;

class NewsManager {
	static async generateNewsDisplay(): Promise<string[]> {
		const news = await ImpulseDB<NewsEntry>(DB_TABLE_NAME).find(
			{},
			{
				sort: { timestamp: -1 },
				limit: NEWS_DISPLAY_LIMIT,
				projection: { title: 1, desc: 1, postedBy: 1, postTime: 1 },
			}
		);
		return news.map(entry =>
			`<center><strong>${entry.title}</strong></center><br>${entry.desc}<br><br>` +
			`<small>-<em> ${nameColor(entry.postedBy, true, false)}</em> on ${entry.postTime}</small>`
		);
	}

	static async onUserConnect(user: User): Promise<void> {
		if (!await ImpulseDB<NewsEntry>(DB_TABLE_NAME).exists({})) return;
		const news = await this.generateNewsDisplay();
		if (news.length) user.send(`|pm| ${SERVER_NAME} News|${user.getIdentity()}|/raw ${news.join('<hr>')}`);
	}

	static async addNews(title: string, desc: string, user: User): Promise<string> {
		await ImpulseDB<NewsEntry>(DB_TABLE_NAME).insertOne({
			title,
			postedBy: user.name,
			desc,
			postTime: formatDate(),
			timestamp: Date.now(),
		});
		return `Added: ${title}`;
	}

	static async deleteNews(title: string): Promise<string | null> {
		const result = await ImpulseDB<NewsEntry>(DB_TABLE_NAME).deleteOne({ title });
		return result.deletedCount === 0 ? `News "${title}" not found.` : `Deleted: ${title}`;
	}

	static async updateNews(title: string, newDesc: string): Promise<string | null> {
		const result = await ImpulseDB<NewsEntry>(DB_TABLE_NAME).updateOne({ title }, { $set: { desc: newDesc } });
		return result.matchedCount === 0 ? `News "${title}" not found.` : `Updated: ${title}`;
	}

	static async deleteOldNews(daysOld = DEFAULT_CLEANUP_DAYS): Promise<number> {
		const cutoff = Date.now() - (daysOld * MS_IN_DAY);
		const result = await ImpulseDB<NewsEntry>(DB_TABLE_NAME).deleteMany({ timestamp: { $lt: cutoff } });
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
		viewhelp: ["/servernews view - View the latest 3 server news."],

		async add(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.parse('/help servernews');
			const [title, ...descParts] = target.split(',');
			if (!descParts.length) return this.errorReply("Usage: /servernews add [title], [desc]");
			if (await ImpulseDB<NewsEntry>(DB_TABLE_NAME).exists({ title })) {
				return this.errorReply(`"${title}" exists. Use /servernews update.`);
			}

			await NewsManager.addNews(title, descParts.join(','), user);
			this.sendReply(`Added: "${title}"`);
			this.modlog('SERVERNEWS ADD', null, `"${title}"`);
		},
		addhelp: ["/servernews add [title], [desc] - Add a news. Requires: &."],

		async update(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.parse('/help servernews');
			const [title, ...descParts] = target.split(',');
			if (!descParts.length) return this.errorReply("Usage: /servernews update [title], [new desc]");

			const result = await NewsManager.updateNews(title, descParts.join(','));
			if (result?.includes('not found')) return this.errorReply(result);

			this.sendReply(`Updated: "${title}"`);
			this.modlog('SERVERNEWS UPDATE', null, `"${title}"`);
		},
		updatehelp: ["/servernews update [title], [desc] - Update a news. Requires: &."],

		remove: 'delete',
		async delete(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.parse('/help servernews');

			const result = await NewsManager.deleteNews(target);
			if (result?.includes('not found')) return this.errorReply(result);

			this.sendReply(`Deleted: "${target}"`);
			this.modlog('SERVERNEWS DELETE', null, `"${target}"`);
		},
		deletehelp: ["/servernews delete [title] - Delete a news. Requires: &."],

		async cleanup(target, room, user): Promise<void> {
			this.checkCan('bypassall');
			const days = Math.max(parseInt(target) || DEFAULT_CLEANUP_DAYS, 1);
			const deleted = await NewsManager.deleteOldNews(days);
			this.sendReply(`Deleted ${deleted} news item(s) older than ${days} days.`);
			this.modlog('SERVERNEWS CLEANUP', null, `deleted ${deleted} items older than ${days} days`);
		},
		cleanuphelp: ["/servernews cleanup [days] - Delete news older than [days] days. Requires: ~."],

		help(): void {
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
	},
	svn: 'servernews',
	servernewshelp: 'servernews.help',
	svnhelp: 'servernews.help',
};
