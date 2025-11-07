/*
* Pokemon Showdown
* News Commands
* @author PrinceSky-Git
*/

import { FS } from '../../../lib/fs';
import { nameColor } from '../../colors';

interface NewsEntry {
	title: string;
	postedBy: string;
	desc: string;
	postTime: string;
	timestamp: number;
}

const serverName = Config.serverName || 'Impulse';
const NEWS_FILE = 'impulse/db/server-news.json';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (date: Date = new Date()): string => (
	`${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
);

class NewsManager {
	static async loadNews(): Promise<NewsEntry[]> {
		const data = await FS(NEWS_FILE).readIfExists();
		if (!data) return [];
		try {
			return JSON.parse(data);
		} catch {
			return [];
		}
	}

	static saveNews(news: NewsEntry[]): void {
		FS(NEWS_FILE).writeUpdate(() => JSON.stringify(news, null, 2));
	}

	static async generateNewsDisplay(): Promise<string[]> {
		const allNews = await this.loadNews();
		// Sort by timestamp descending and take top 3
		const news = allNews
			.sort((a, b) => b.timestamp - a.timestamp)
			.slice(0, 3);
		return news.map(entry =>
			`<center><strong>${entry.title}</strong></center><br>${entry.desc}<br><br><small>-<em> ${nameColor(entry.postedBy, true, false)}</em> on ${entry.postTime}</small>`
		);
	}

	static async onUserConnect(user: User): Promise<void> {
		const allNews = await this.loadNews();
		if (allNews.length === 0) return;
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
		const allNews = await this.loadNews();
		allNews.push(newsEntry);
		this.saveNews(allNews);
		return `Added: ${title}`;
	}

	static async deleteNews(title: string): Promise<string | null> {
		const allNews = await this.loadNews();
		const index = allNews.findIndex(entry => entry.title === title);
		if (index === -1) {
			return `News "${title}" not found.`;
		}
		allNews.splice(index, 1);
		this.saveNews(allNews);
		return `Deleted: ${title}`;
	}

	static async updateNews(title: string, newDesc: string): Promise<string | null> {
		const allNews = await this.loadNews();
		const entry = allNews.find(e => e.title === title);
		if (!entry) {
			return `News "${title}" not found.`;
		}
		entry.desc = newDesc;
		this.saveNews(allNews);
		return `Updated: ${title}`;
	}

	static async deleteOldNews(daysOld = 90): Promise<number> {
		const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
		const allNews = await this.loadNews();
		const originalCount = allNews.length;
		const filteredNews = allNews.filter(entry => entry.timestamp >= cutoff);
		const deletedCount = originalCount - filteredNews.length;
		if (deletedCount > 0) {
			this.saveNews(filteredNews);
		}
		return deletedCount;
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

			const allNews = await NewsManager.loadNews();
			if (allNews.some(entry => entry.title === title)) {
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
