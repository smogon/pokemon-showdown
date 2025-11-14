/*
* Pokemon Showdown
* News Commands
* @author PrinceSky-Git
*/

import { ImpulseDB } from '../../impulse-db';
import { nameColor } from '../../colors';
import { toID } from '../../utils';

interface NewsEntry {
	_id: string;
	title: string;
	postedBy: string;
	desc: string;
	postTime: string;
	timestamp: number;
}

const serverName = Config.serverName || 'Impulse';

const NewsDB = ImpulseDB<NewsEntry>('news');
const MONTHS = [
	'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
	'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const formatDate = (date: Date = new Date()): string =>
	`${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;

const generateNewsDisplay = async (): Promise<string[]> => {
	const news = await NewsDB.find(
		{},
		{
			sort: { timestamp: -1 },
			limit: 3,
			projection: { title: 1, desc: 1, postedBy: 1, postTime: 1 },
		}
	);
	return news.map(entry =>
		`<center><strong>${entry.title}</strong></center><br>${entry.desc}<br><br>` +
		`<small>-<em> ${nameColor(entry.postedBy, true, false)}</em> on ${entry.postTime}</small>`
	);
};

const onUserConnect = async (user: User): Promise<void> => {
	if (!await NewsDB.exists({})) return;
	const news = await generateNewsDisplay();
	if (news.length) {
		user.send(`|pm| ${serverName} News|${user.getIdentity()}|/raw ${news.join('<hr>')}`);
	}
};

const addNews = async (title: string, desc: string, user: User): Promise<string> => {
	const _id = toID(title);
	const newsEntry: NewsEntry = {
		_id,
		title,
		postedBy: user.name,
		desc,
		postTime: formatDate(),
		timestamp: Date.now(),
	};
	await NewsDB.insertOne(newsEntry);
	return `Added: ${title}`;
};

const deleteNews = async (title: string): Promise<string | null> => {
	const _id = toID(title);
	const result = await NewsDB.deleteOne({ _id });
	return result.deletedCount === 0 ? `News "${title}" not found.` : `Deleted: ${title}`;
};

const updateNews = async (title: string, newDesc: string): Promise<string | null> => {
	const _id = toID(title);
	const result = await NewsDB.updateOne({ _id }, { $set: { desc: newDesc } });
	return result.matchedCount === 0 ? `News "${title}" not found.` : `Updated: ${title}`;
};

const deleteOldNews = async (daysOld = 90): Promise<number> => {
	const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
	const result = await NewsDB.deleteMany({ timestamp: { $lt: cutoff } });
	return result.deletedCount || 0;
};

export const loginfilter = (user: User, oldUser: User | null, userType: string): void => {
	void onUserConnect(user);
};

type HelpItem = { cmd: string; desc: string };

const SERVER_NEWS_HELP: HelpItem[] = [
	{ cmd: "/servernews view", desc: "View the latest 3 server news." },
	{ cmd: "/servernews add [title], [desc]", desc: "Add a news. Requires: &." },
	{ cmd: "/servernews update [title], [desc]", desc: "Update a news. Requires: &." },
	{ cmd: "/servernews delete [title]", desc: "Delete a news. Requires: &." },
	{ cmd: "/servernews cleanup [days]", desc: "Delete news older than [days] days. Requires: ~." }
];

export const commands: Chat.ChatCommands = {
	servernews: {
		'': 'view',
		display: 'view',
		async view(target, room, user): Promise<void> {
			const news = await generateNewsDisplay();
			const output = news.length ?
				`<center><strong>Server News:</strong></center>${news.join('<hr>')}` :
				`<center><strong>Server News:</strong></center><center><em>No news.</em></center>`;

			user.send(`|popup||html|<div class="infobox">${output}</div>`);
		},

		async add(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.parse('/servernewshelp');
			const [title, ...descParts] = target.split(',');
			if (!descParts.length) {
				return this.errorReply("Usage: /servernews add [title], [desc]");
			}

			const _id = toID(title);
			if (await NewsDB.exists({ _id })) {
				return this.errorReply(`"${title}" exists. Use /servernews update.`);
			}

			await addNews(title, descParts.join(','), user);

			this.sendReply(`Added: "${title}"`);
		},

		async update(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.parse('/servernewshelp');
			const [title, ...descParts] = target.split(',');
			if (!descParts.length) {
				return this.errorReply("Usage: /servernews update [title], [new desc]");
			}

			const result = await updateNews(title, descParts.join(','));
			if (result?.includes('not found')) return this.errorReply(result);

			this.sendReply(`Updated: "${title}"`);
		},

		remove: 'delete',
		async delete(target, room, user): Promise<void> {
			this.checkCan('roomowner');
			if (!target) return this.parse('/servernewshelp');

			const result = await deleteNews(target);

			if (result?.includes('not found')) return this.errorReply(result);

			this.sendReply(`Deleted: "${target}"`);
		},

		async cleanup(target, room, user): Promise<void> {
			this.checkCan('bypassall');
			const days = Math.max(parseInt(target) || 90, 1);

			const deleted = await deleteOldNews(days);

			this.sendReply(`Deleted ${deleted} news item(s) older than ${days} days.`);
		},
	},
	svn: 'servernews',

	servernewshelp(): void {
		if (!this.runBroadcast()) return;
		const html = `<center><strong>Server News Commands:<br>Alias: /svn</strong></center><hr>` +
			`<ul style="list-style-type:none;padding-left:0;">` +
			`${SERVER_NEWS_HELP.map(item => `<li><b>${item.cmd}</b> - ${item.desc}</li>`).join('<hr>')}</ul>`;
		this.sendReplyBox(html.trim());
	},
	svnhelp: 'servernewshelp',
};
