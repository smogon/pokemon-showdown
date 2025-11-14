/*
* Pokemon Showdown
* News Commands
* @author PrinceSky-Git
*/

import { ImpulseDB } from '../../impulse-db';
import { nameColor } from '../../colors';

interface NewsEntry {
	_id: string;
	title: string;
	postedBy: string;
	desc: string;
	postTime: string;
	timestamp: number;
}

interface NewsBlockEntry {
	_id: string;
}

const serverName = Config.serverName || 'Impulse';

const NewsDB = ImpulseDB<NewsEntry>('news');
const NewsBlockDB = ImpulseDB<NewsBlockEntry>('newsblock');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (date: Date = new Date()): string =>
	`${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;

const parseTargetArgs = (target: string): [string, string] => {
	const [title, ...descParts] = target.split(',');
	return [title, descParts.join(',')];
};

const validateNewsArgs = (target: string, context: Chat.CommandContext, usage: string): [string, string] | null => {
	if (!target) {
		context.parse('/help servernewshelp');
		return null;
	}
	const [title, desc] = parseTargetArgs(target);
	if (!desc) {
		context.errorReply(usage);
		return null;
	}
	return [title, desc];
};

class NewsManager {
	static async generateNewsDisplay(): Promise<string[]> {
		const news = await NewsDB.find(
			{},
			{ sort: { timestamp: -1 }, limit: 2, projection: { title: 1, desc: 1, postedBy: 1, postTime: 1 } }
		);
		return news.map(entry =>
			`<center><strong>${entry.title}</strong></center><br>${entry.desc}<br><br>` +
			`<small>-<em> ${nameColor(entry.postedBy, true, false)}</em> on ${entry.postTime}</small>`
		);
	}

	static async onUserConnect(user: User): Promise<void> {
		if (!await NewsDB.exists({})) return;
		if (await NewsBlockDB.exists({ _id: toID(user.name) })) return;
		const news = await this.generateNewsDisplay();
		if (news.length) {
			user.send(`|pm| ${serverName} News|${user.getIdentity()}|/raw ${news.join('<hr>')}`);
		}
	}

	static async addNews(id: string, title: string, desc: string, user: User): Promise<string> {
		const newsEntry: NewsEntry = {
			_id: id,
			title,
			postedBy: user.name,
			desc,
			postTime: formatDate(),
			timestamp: Date.now(),
		};
		await NewsDB.insertOne(newsEntry);
		return `Added: ${title}`;
	}

	static async deleteNews(id: string, title: string): Promise<string | null> {
		const result = await NewsDB.deleteOne({ _id: id });
		return result.deletedCount === 0 ? `News "${title}" not found.` : `Deleted: ${title}`;
	}

	static async blockNews(userid: string): Promise<void> {
		await NewsBlockDB.insertOne({ _id: userid });
	}

	static async unblockNews(userid: string): Promise<boolean> {
		const result = await NewsBlockDB.deleteOne({ _id: userid });
		return result.deletedCount > 0;
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
			const args = validateNewsArgs(target, this, "Usage: /servernews add [title], [desc]");
			if (!args) return;
			const [title, desc] = args;
			const id = toID(title);

			if (await NewsDB.exists({ _id: id })) {
				return this.errorReply(`"${title}" exists.`);
			}

			await NewsManager.addNews(id, title, desc, user);
			this.sendReply(`Added: "${title}"`);
		},

		remove: 'delete',
		async delete(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.parse('/help servernewshelp');

			const id = toID(target);
			const result = await NewsManager.deleteNews(id, target);

			if (result?.includes('not found')) return this.errorReply(result);

			this.sendReply(`Deleted: "${target}"`);
		},

		async block(target, room, user): Promise<void> {
			const userid = toID(user.name);
			if (await NewsBlockDB.exists({ _id: userid })) {
				return this.errorReply("You have already blocked server news.");
			}

			await NewsManager.blockNews(userid);
			this.sendReply("You have blocked server news. You will no longer receive news on login.");
		},

		async unblock(target, room, user): Promise<void> {
			const userid = toID(user.name);
			const unblocked = await NewsManager.unblockNews(userid);

			if (!unblocked) {
				return this.errorReply("You have not blocked server news.");
			}

			this.sendReply("You have unblocked server news. You will now receive news on login.");
		},
	},
	svn: 'servernews',

	servernewshelp(): void {
		if (!this.runBroadcast()) return;
		const helpList = [
			{ cmd: "/servernews view", desc: "View the latest 2 server news." },
			{ cmd: "/servernews add [title], [desc]", desc: "Add a news. Requires: &." },
			{ cmd: "/servernews delete [title]", desc: "Delete a news. Requires: &." },
			{ cmd: "/servernews block", desc: "Block server news on login." },
			{ cmd: "/servernews unblock", desc: "Unblock server news on login." },
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
