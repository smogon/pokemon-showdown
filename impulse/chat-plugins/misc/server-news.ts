/*
* Pokemon Showdown
* News Commands
* @author PrinceSky-Git
*/

import { FS } from '../../../lib/fs';
import { nameColor } from '../../colors';

interface NewsEntry {
	id: string;
	title: string;
	postedBy: string;
	desc: string;
	postTime: string;
	timestamp: number;
}

interface NewsData {
	[id: string]: NewsEntry;
}

let serverNews: NewsData = {};

const NEWS_FILE = 'impulse/db/server-news.json';
const serverName = Config.serverName || 'Impulse';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const loadNews = async (): Promise<void> => {
	const data = await FS(NEWS_FILE).readIfExists();
	serverNews = data ? JSON.parse(data) : {};
};

const saveNews = async (): Promise<void> => {
	await FS(NEWS_FILE).safeWrite(JSON.stringify(serverNews, null, 2));
};

const formatDate = (date: Date = new Date()): string => `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;

const generateNewsId = (title: string): string => {
	return `${toID(title)}_${Date.now()}`;
};

class NewsManager {
	static async generateNewsDisplay(): Promise<string[]> {
		const newsArray = Object.values(serverNews)
			.sort((a, b) => b.timestamp - a.timestamp)
			.slice(0, 3);

		return newsArray.map(entry =>
			`<center><strong>${entry.title}</strong></center><br>${entry.desc}<br><br><small>-<em> ${nameColor(entry.postedBy, true, false)}</em> on ${entry.postTime}</small>`
		);
	}

	static async onUserConnect(user: User): Promise<void> {
		if (Object.keys(serverNews).length === 0) return;
		const news = await this.generateNewsDisplay();
		if (news.length) {
			user.send(`|pm| ${serverName} News|${user.getIdentity()}|/raw ${news.join('<hr>')}`);
		}
	}

	static async addNews(title: string, desc: string, user: User): Promise<string> {
		const newsId = generateNewsId(title);
		const newsEntry: NewsEntry = {
			id: newsId,
			title,
			postedBy: user.name,
			desc,
			postTime: formatDate(),
			timestamp: Date.now(),
		};
		serverNews[newsId] = newsEntry;
		await saveNews();
		return `Added: ${title}`;
	}

	static async deleteNews(title: string): Promise<string | null> {
		const entry = Object.values(serverNews).find(n => n.title === title);
		if (!entry) return `News "${title}" not found.`;

		delete serverNews[entry.id];
		await saveNews();
		return `Deleted: ${title}`;
	}

	static async updateNews(title: string, newDesc: string): Promise<string | null> {
		const entry = Object.values(serverNews).find(n => n.title === title);
		if (!entry) return `News "${title}" not found.`;

		serverNews[entry.id].desc = newDesc;
		await saveNews();
		return `Updated: ${title}`;
	}

	static async deleteOldNews(daysOld = 90): Promise<number> {
		const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
		let deletedCount = 0;

		for (const [id, entry] of Object.entries(serverNews)) {
			if (entry.timestamp < cutoff) {
				delete serverNews[id];
				deletedCount++;
			}
		}

		if (deletedCount > 0) {
			await saveNews();
		}

		return deletedCount;
	}

	static async newsExists(title: string): Promise<boolean> {
		return Object.values(serverNews).some(n => n.title === title);
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

			if (await NewsManager.newsExists(title)) {
				return this.errorReply(`"${title}" exists. Use /servernews update.`);
			}

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
		const helpList = [
			{ cmd: "/servernews view", desc: "View the latest 3 server news." },
			{ cmd: "/servernews add [title], [desc]", desc: "Add a news. Requires: &." },
			{ cmd: "/servernews update [title], [desc]", desc: "Update a news. Requires: &." },
			{ cmd: "/servernews delete [title]", desc: "Delete a news. Requires: &." },
			{ cmd: "/servernews cleanup [days]", desc: "Delete news older than [days] days. Requires: ~." },
		];
		const html = `<center><strong>Server News Commands:<br>Alias: /svn</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
			helpList.map(({ cmd, desc }, i) =>
				`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
			).join('') +
			`</ul>`;
		this.sendReplyBox(html);
	},
	svnhelp: 'servernewshelp',
};

void loadNews();
