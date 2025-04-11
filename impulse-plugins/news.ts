/*************************************************
* Pokemon Showdown News Commands                 *
* Original Code By: Lord Haji, HoeenHero         *
* Updated To Typescript By: PrinceSky & Turbo Rx *
**************************************************/
/**********************""*************"*****
* Add this code inside server/users.ts     *
* handleRename function                    *
* Impulse.NewsManager.onUserConnect(user); *
********************************************/

import { FS } from '../lib/fs';

interface NewsEntry {
	postedBy: string;
	desc: string;
	postTime: string;
}

interface NewsData {
	[title: string]: NewsEntry;
}

class NewsManager {
	private static news: NewsData = NewsManager.loadNews();
	private static loadNews(): NewsData {
		try {
			const data = FS('impulse-db/news.json').readIfExistsSync();
			return data ? JSON.parse(data) : {};
		} catch (e) {
			console.error('Error loading news:', e);
			return {};
		}
	}
	
	private static saveNews(): void {
		try {
			FS('impulse-db/news.json').writeUpdate(() => JSON.stringify(this.news, null, 2));
		} catch (e) {
			console.error('Error saving news:', e);
		}
	}
	
	static generateNewsDisplay(): string[] {
		return Object.entries(this.news)
			.sort(([, a], [, b]) => new Date(b.postTime).getTime() - new Date(a.postTime).getTime())
			.map(([title, data]) => 
				`<h4><center>${title}</center></h4>${data.desc}<br /><br />` +
				`—${Impulse.nameColor(data.postedBy, true, false)} <small>on ${data.postTime}</small>`
				 );
	}
	
	static onUserConnect(user: User): void {
		const news = this.generateNewsDisplay();
		if (news.length) {
			user.send(`|pm| ${Impulse.serverName} News|${user.getIdentity()}|/raw ${news.slice(0, 2).join('<hr>')}`);
		}
	}
	
	static addNews(title: string, desc: string, user: User): string {
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const now = new Date();
		this.news = {
			[title]: {
				postedBy: user.name,
				desc,
				postTime: `${months[now.getUTCMonth()]} ${now.getUTCDate()}, ${now.getUTCFullYear()}`
			},
			...this.news
		};
		this.saveNews();
		return `Added Server News: ${title}`;
	}
	
	static deleteNews(title: string): string | null {
		if (!this.news[title]) return `News with this title doesn't exist.`;
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
		view(target, room, user) {
			if (!this.runBroadcast()) return;
			const output = `<center><strong>Server News:</strong></center>${NewsManager.generateNewsDisplay().join('<hr>')}`;					
			if (this.broadcasting) {
				return this.sendReplyBox(`<div class="infobox-limited">${output}</div>`);
			}
			user.send(`|popup||wide||html|<div class="infobox">${output}</div>`);
		},
		
		add(target, room, user) {
			this.checkCan('globalban');
			if (!target) return this.parse('/help servernews');
			const [title, ...descParts] = target.split(',');
			if (!descParts.length) return this.errorReply("Usage: /news add [title], [desc]");
			const result = NewsManager.addNews(title.trim(), descParts.join(',').trim(), user);
			this.modlog('NEWS', null, result);
		},
		
		remove: 'delete',
		delete(target, room, user) {
			this.checkCan('globalban');
			if (!target) return this.parse('/help servernews');
			const result = NewsManager.deleteNews(target);
			if (result) {
				this.modlog('NEWS', null, result);
			} else {
				this.errorReply("News with this title doesn't exist.");
			}
		},
	},
	
	servernewshelp(target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`<b>Server News Commands:</b><br>` +
			`• <code>/servernews view</code> - Views current server news<br>` +
			`• <code>/servernews delete [title]</code> - Deletes news with [title] (Requires @, &, ~)<br>` +
			`• <code>/servernews add [title], [desc]</code> - Adds news (Requires @, &, ~)`
		);
	},
};
