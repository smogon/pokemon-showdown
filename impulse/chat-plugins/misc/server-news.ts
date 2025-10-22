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

const formatDate = (date: Date = new Date()): string => `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;

class NewsManager {
	static async generateNewsDisplay(): Promise<string[]> {
		const news = await NewsDB.find({}, { sort: { timestamp: -1 }, limit: 3, projection: { title: 1, desc: 1, postedBy: 1, postTime: 1 } });
		return news.map(entry =>
			`<center><strong>${entry.title}</strong></center><br>${entry.desc}<br><br><small>-<em> ${nameColor(entry.postedBy, true, false)}</em> on ${entry.postTime}</small>`
		);
	}

	static async onUserConnect(user: User): Promise<void> {
		if (!await NewsDB.exists({})) return;
		const news = await this.generateNewsDisplay();
		if (news.length) {
			user.send(`|pm| ${serverName} News|${user.getIdentity()}|/raw ${news.join('<hr>')}`);
		}
	}

	static async addNews(title: string, desc: string, user: User): Promise<string> {
		const newsEntry: NewsEntry = {
			title,
			postedBy: user.name,
			desc,
			postTime: formatDate(),
			timestamp: Date.now(),
		};
		await NewsDB.insertOne(newsEntry);
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
		const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
		const result = await NewsDB.deleteMany({ timestamp: { $lt: cutoff } });
		return result.deletedCount || 0;
	}
}

export const loginfilter = function(user: User, oldUser: User | null, userType: string): void {
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

			const trimmedTitle = title.trim();
			const trimmedDesc = descParts.join(',').trim();

			if (await NewsDB.exists({ title: trimmedTitle })) {
				return this.errorReply(`"${trimmedTitle}" exists. Use /servernews update.`);
			}

			await NewsManager.addNews(toID(trimmedTitle), trimmedDesc, user);

			this.sendReply(`Added: "${trimmedTitle}"`);
		},

		async update(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.parse('/help servernewshelp');
			const [title, ...descParts] = target.split(',');
			if (!descParts.length) return this.errorReply("Usage: /servernews update [title], [new desc]");

			const trimmedTitle = title.trim();
			const newDesc = descParts.join(',').trim();

			const result = await NewsManager.updateNews(toID(trimmedTitle), newDesc);
			if (result?.includes('not found')) return this.errorReply(result);

			this.sendReply(`Updated: "${trimmedTitle}"`);
		},

		remove: 'delete',
		async delete(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.parse('/help servernewshelp');

			const trimmedTitle = target.trim();
			const result = await NewsManager.deleteNews(toID(trimmedTitle));

			if (result?.includes('not found')) return this.errorReply(result);

			this.sendReply(`Deleted: "${trimmedTitle}"`);
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
		const helpList = [
			{cmd: "/servernews view", desc: "View the latest 3 server news."},
			{cmd: "/servernews add [title], [desc]", desc: "Add a news. Requires: &."},
			{cmd: "/servernews update [title], [desc]", desc: "Update a news. Requires: &."},
			{cmd: "/servernews delete [title]", desc: "Delete a news. Requires: &."},
			{cmd: "/servernews cleanup [days]", desc: "Delete news older than [days] days. Requires: ~."},
		];
		const html = `<center><strong>Server News Commands:<br>Alias: /svn</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
			helpList.map(({cmd, desc}, i) =>
				`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
			).join('') +
			`</ul>`;
		this.sendReplyBox(html);
	},
	svnhelp: 'servernewshelp',
};
