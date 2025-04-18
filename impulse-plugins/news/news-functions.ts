import { FS } from '../../lib/fs';

// Type definitions
export interface NewsEntry {
	postedBy: string;
	desc: string;
	postTime: string;
}

export interface NewsData {
	[title: string]: NewsEntry;
}

// NewsManager class to handle all news operations
export class NewsManager {
	private news: NewsData;
	private static readonly NEWS_FILE = 'impulse-db/news.json';
	
	constructor() {
		this.news = this.loadNews();
	}
	
	private loadNews(): NewsData {
		try {
			const data = FS(NewsManager.NEWS_FILE).readIfExistsSync();
			return data ? JSON.parse(data) : {};
		} catch (e) {
			console.error('Error loading news:', e);
			return {};
		}
	}
	
	private saveNews(): void {
		try {
			FS(NewsManager.NEWS_FILE).writeUpdate(() => JSON.stringify(this.news, null, 2));
		} catch (e) {
			console.error('Error saving news:', e);
		}
	}
	
	// Format news entries for display
	formatNewsEntries(): string[] {
		return Object.entries(this.news)
			.sort(([, a], [, b]) => new Date(b.postTime).getTime() - new Date(a.postTime).getTime())
			.map(([title, data]) => 
				`<h4><center>${title}</center></h4>${data.desc}<br /><br />` +
				`—${Impulse.nameColor(data.postedBy, true, false)} <small>on ${data.postTime}</small>`
			);
	}
	
	// Get recent news entries
	getRecentNews(limit: number): string[] {
		const allNews = this.formatNewsEntries();
		return allNews.slice(0, limit);
	}
	
	// Send news notification to user
	notifyUser(user: User): void {
		const recentNews = this.getRecentNews(2);
		if (recentNews.length) {
			user.send(`|pm| ${Impulse.serverName} News|${user.getIdentity()}|/raw ${recentNews.join('<hr>')}`);
		}
	}
	
	// Add a new news entry
	addNews(title: string, desc: string, poster: string): string {
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const now = new Date();
		
		this.news = {
			[title]: {
				postedBy: poster,
				desc,
				postTime: `${months[now.getUTCMonth()]} ${now.getUTCDate()}, ${now.getUTCFullYear()}`
			},
			...this.news
		};
		
		this.saveNews();
		return `Added Server News: ${title}`;
	}
	
	// Delete a news entry
	deleteNews(title: string): string | null {
		if (!this.news[title]) return null;
		
		delete this.news[title];
		this.saveNews();
		return `Deleted Server News titled: ${title}.`;
	}
}
