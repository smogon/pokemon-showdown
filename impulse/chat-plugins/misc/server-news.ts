/*
* Pokemon Showdown
* News Commands
* @author PrinceSky-Git
*/

import { FS } from '../../../lib/fs';
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
const NEWS_PATH = 'impulse/db/news.json';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (date: Date = new Date()): string =>
	`${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;

async function getNewsData(): Promise<NewsEntry[]> {
	const data = await FS(NEWS_PATH).readIfExists();
	if (!data) return [];
	try {
		const parsed = JSON.parse(data);
		if (Array.isArray(parsed)) return parsed;
		return [];
	} catch {
		return [];
	}
}

async function saveNewsData(news: NewsEntry[]): Promise<void> {
	await FS(NEWS_PATH).writeUpdate(() => JSON.stringify(news, null, 2));
}

class NewsManager {
	static async generateNewsDisplay(): Promise<string[]> {
		const news = await getNewsData();
		const sorted = [...news].sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);
		return sorted.map(entry =>
			`<center><strong>${entry.title}</strong></center><br>${entry.desc}<br><br>` +
			`<small>-<em> ${nameColor(entry.postedBy, true, false)}</em> on ${entry.postTime}</small>`
		);
	}

	static async onUserConnect(user: User): Promise<void> {
		const news = await getNewsData();
		if (!news.length) return;
		const display = await this.generateNewsDisplay();
		if (display.length) {
			user.send(`|pm| ${serverName} News|${user.getIdentity()}|/raw ${display.join('<hr>')}`);
		}
	}

	static async addNews(title: string, desc: string, user: User): Promise<string> {
		const news = await getNewsData();
		if (news.some(n => n.title === title)) {
			return `News "${title}" exists. Use /servernews update.`;
		}
		const newsEntry: NewsEntry = {
			title,
			postedBy: user.name,
			desc,
			postTime: formatDate(),
			timestamp: Date.now(),
		};
		news.push(newsEntry);
		await saveNewsData(news);
		return `Added: ${title}`;
	}

	static async deleteNews(title: string): Promise<string | null> {
		const news = await getNewsData();
		const index = news.findIndex(n => n.title === title);
		if (index === -1) return `News "${title}" not found.`;
		news.splice(index, 1);
		await saveNewsData(news);
		return `Deleted: ${title}`;
	}

	static async updateNews(title: string, newDesc: string): Promise<string | null> {
		const news = await getNewsData();
		const entry = news.find(n => n.title === title);
		if (!entry) return `News "${title}" not found.`;
		entry.desc = newDesc;
		await saveNewsData(news);
		return `Updated: ${title}`;
	}

	static async deleteOldNews(daysOld = 90): Promise<number> {
		const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
		const news = await getNewsData();
		const oldLength = news.length;
		const filtered = news.filter(n => n.timestamp >= cutoff);
		await saveNewsData(filtered);
		return oldLength - filtered.length;
	}
}

export const loginfilter = (user: User, oldUser: User | null, userType: string): void => {
	void NewsManager.onUserConnect(user);
};

export const commands: Chat.ChatCommands = {
	servernews: {
		'': 'view',
		display: 'view',
		async view(target, room, user) {
			const news = await NewsManager.generateNewsDisplay();
			const output = news.length ?
				`<center><strong>Server News:</strong></center>${news.join('<hr>')}` :
				`<center><strong>Server News:</strong></center><center><em>No news.</em></center>`;

			user.send(`|popup||html|<div class="infobox">${output}</div>`);
		},

		async add(target, room, user) {
			this.checkCan('roomowner');
			if (!target) return this.parse('/help servernewshelp');
			const [title, ...descParts] = target.split(',');
			if (!descParts.length) return this.errorReply("Usage: /servernews add [title], [desc]");

			const result = await NewsManager.addNews(title, descParts.join(',').trim(), user);

			if (result.includes("exists")) return this.errorReply(result);
			this.sendReply(`Added: "${title}"`);
		},

		async update(target, room, user) {
			this.checkCan('roomowner');
			if (!target) return this.parse('/help servernewshelp');
			const [title, ...descParts] = target.split(',');
			if (!descParts.length) return this.errorReply("Usage: /servernews update [title], [new desc]");

			const result = await NewsManager.updateNews(title, descParts.join(',').trim());
			if (result?.includes('not found')) return this.errorReply(result);

			this.sendReply(`Updated: "${title}"`);
		},

		remove: 'delete',
		async delete(target, room, user) {
			this.checkCan('roomowner');
			if (!target) return this.parse('/help servernewshelp');

			const result = await NewsManager.deleteNews(target);

			if (result?.includes('not found')) return this.errorReply(result);

			this.sendReply(`Deleted: "${target}"`);
		},

		async cleanup(target, room, user) {
			this.checkCan('bypassall');
			const days = Math.max(parseInt(target) || 90, 1);

			const deleted = await NewsManager.deleteOldNews(days);

			this.sendReply(`Deleted ${deleted} news item(s) older than ${days} days.`);
		},
	},
	svn: 'servernews',

	servernewshelp() {
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
