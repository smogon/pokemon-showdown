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

import { NewsManager } from './news-functions';

// Create a singleton instance of NewsManager
const newsManager = new NewsManager();

// Make it accessible globally
Impulse.NewsManager = {
	onUserConnect: (user: User) => newsManager.notifyUser(user)
};

// Command definitions
export const commands: Chat.Commands = {
	servernews: {
		'': 'view',
		display: 'view',
		view(target, room, user) {
			if (!this.runBroadcast()) return;
			
			const newsEntries = newsManager.formatNewsEntries();
			if (!newsEntries.length) {
				return this.errorReply("There is no server news.");
			}
			
			const output = `<center><strong>Server News:</strong></center>${newsEntries.join('<hr>')}`;
			
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
			
			const result = newsManager.addNews(title.trim(), descParts.join(',').trim(), user.name);
			this.modlog('NEWS', null, result);
		},
		
		remove: 'delete',
		delete(target, room, user) {
			this.checkCan('globalban');
			if (!target) return this.parse('/help servernews');
			
			const result = newsManager.deleteNews(target);
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
