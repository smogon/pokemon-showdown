/**
 * News System for the server
 * This shows News via the /news view command and sends news PMs when users connect.
 * Everyone will receive the news on connect.
 * Uses persistent data storage for news.
 * Credits: Lord Haji, HoeenHero (adapted for current PS code)
 * @license MIT license
 */

import { FS } from '../lib/fs';

const NEWS_DATA_PATH = 'impulse-db/news.json';

interface NewsEntry {
	postedBy: string;
	desc: string;
	postTime: string;
}

interface NewsData {
	[title: string]: NewsEntry;
}

const notifiedUsers: { [userid: string]: NodeJS.Timeout } = {};

class NewsManager {
	private static news: NewsData = NewsManager.loadNews();

	private static loadNews(): NewsData {
		try {
			const raw = FS(NEWS_DATA_PATH).readIfExistsSync();
			return raw ? JSON.parse(raw) : {};
		} catch (e) {
			console.error(`Error loading news: ${e}`);
			return {};
		}
	}

	private static saveNews(): void {
		try {
			FS(NEWS_DATA_PATH).writeUpdate(() => JSON.stringify(this.news, null, 2));
		} catch (e) {
			console.error(`Error saving news: ${e}`);
		}
	}

	static generateNewsDisplay(): string[] {
		const newsDisplay: string[] = [];
		for (const title in this.news) {
			const newsData = this.news[title];
			newsDisplay.push(`<h4>${title}</h4>${newsData.desc}<br /><br />—${Impulse.nameColor(newsData.postedBy, true, true)} <small>on ${newsData.postTime}</small>`);
		}
		return newsDisplay;
	}

	static onUserConnect(user: User): void {
		const userid = user.id;
		if (notifiedUsers[userid]) {
			return;
		}
		const newsDisplay = this.generateNewsDisplay();
		if (newsDisplay.length > 0) {
			const recentNews = newsDisplay.slice(-2).join(`<hr>`);
			const message = `|pm| Server News|${user.getIdentity()}|/raw <div class="infobox">${recentNews}</div>`;
			user.send(message);
			/*notifiedUsers[userid] = setTimeout(() => {
				delete notifiedUsers[userid];
			}, 60 * 60 * 1000);*/
		}
	}

	static addNews(title: string, desc: string, user: User): string {
		const postedBy = user.name;
		const now = new Date();
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const postTime = `${monthNames[now.getUTCMonth()]} ${now.getUTCDate()}, ${now.getUTCFullYear()}`;
		this.news[title] = { postedBy, desc, postTime };
		this.saveNews();
		return `Added Server News: ${title}`;
	}

	static deleteNews(title: string): string | null {
		if (!this.news[title]) {
			return `News with this title doesn't exist.`;
		}
		delete this.news[title];
		this.saveNews();
		return `Deleted Server News titled: ${title}.`;
	}
}

Impulse.NewsManager = NewsManager;


export const commands: Chat.Commands = {
	servernews: {
		'': 'view',
		display: 'view',
		view: function (target, room, user) {
			if (!this.runBroadcast()) return;
			const output = `<center><strong>Server News:</strong></center>${NewsManager.generateNewsDisplay().join(`<hr>`)})`;
			if (this.broadcasting) {
				return this.sendReplyBox(`<div class="infobox-limited">${output}</div>`);
			}
			return user.send(`|popup||wide||html|<div class="infobox">${output}</div>`);
		},
		remove: 'delete',
		delete: function (target, room, user) {
			this.checkCan('globalban');
			if (!target) return this.parse('/help servernews');
			const result = NewsManager.deleteNews(target);
			if (result) {
				this.modlog(`NEWS`, null, result);
				this.privateModAction(`(${user.name} ${result})`);
			} else {
				this.errorReply("News with this title doesn't exist.");
			}
		},
		add: function (target, room, user) {
			this.checkCan('globalban');
			if (!target) return this.parse('/help servernews');
			const parts = target.split(',');
			if (parts.length < 2) return this.errorReply("Usage: /news add [title], [desc]");
			const title = parts[0].trim();
			const desc = parts.slice(1).join(',').trim();
			const result = NewsManager.addNews(title, desc, user);
			this.modlog(`NEWS`, null, result);
			this.privateModAction(`(${user.name} ${result})`);
		},
	},
	servernewshelp: [
		`/servernews view - Views current server news.`,
		`/servernews delete [news title] - Deletes server news with the [title]. Requires @, &, ~.`,
		`/servernews add [news title], [news desc] - Adds news [news]. Requires @, &, ~.`,
	],
};
