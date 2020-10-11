/**
 * Youtube room chat-plugin.
 * Supports adding channels and selecting a random channel.
 * Also supports showing video data on request.
 * Written by Mia, with some design concepts from bumbadadabum.
 * @author mia-pi-git
 */

import {Net} from '../../lib/net';
import {FS} from '../../lib/fs';
import {Utils} from '../../lib/utils';

const ROOT = 'https://www.googleapis.com/youtube/v3/';
const STORAGE_PATH = 'config/chat-plugins/youtube.json';

interface ChannelEntry {
	name: string;
	description: string;
	url: string;
	icon: string;
	videos: number;
	subs: number;
	views: number;
	username?: string;
	category?: string;
}

interface ChannelData {
	channels: {[k: string]: ChannelEntry};
	categories: string[];
}

function loadData() {
	const raw: AnyObject = JSON.parse(FS(STORAGE_PATH).readIfExistsSync() || "{}");
	if (!(raw.channels && raw.categories)) { // hasn't been converted to new format
		const data: Partial<ChannelData> = {};
		data.channels = raw;
		data.categories = [];
		// re-save into new format
		FS(STORAGE_PATH).writeUpdate(() => JSON.stringify(data));
		return data as ChannelData;
	}
	return raw as ChannelData;
}

const channelData: {channels: {[k: string]: ChannelEntry}, categories: string[]} = loadData();

export class YoutubeInterface {
	interval: NodeJS.Timer | null;
	intervalTime: number;
	data: ChannelData;
	constructor(data?: ChannelData) {
		this.data = data ? data : {categories: [], channels: {}};
		this.interval = null;
		this.intervalTime = 0;
	}
	async getChannelData(link: string, username?: string) {
		if (!Config.youtubeKey) {
			throw new Chat.ErrorMessage(`This server does not support YouTube commands. If you're the owner, you can enable them by setting up Config.youtubekey.`);
		}
		const id = this.getId(link);
		const raw = await Net(`${ROOT}channels`).get({
			query: {part: 'snippet,statistics', id, key: Config.youtubeKey},
		});
		const res = JSON.parse(raw);
		if (!res || !res.items || res.items.length < 1) {
			throw new Chat.ErrorMessage(`Channel not found.`);
		}
		const data = res.items[0];
		const cache: ChannelEntry = {
			name: data.snippet.title,
			description: data.snippet.description,
			url: data.snippet.customUrl,
			icon: data.snippet.thumbnails.medium.url,
			videos: Number(data.statistics.videoCount),
			subs: Number(data.statistics.subscriberCount),
			views: Number(data.statistics.viewCount),
			username: username,
		};
		this.data.channels[id] = {...cache};
		this.save();
		return cache;
	}
	async generateChannelDisplay(link: string) {
		const id = this.getId(link);
		// url isn't needed but it destructures wrong without it
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const {name, description, url, icon, videos, subs, views, username} = await this.get(id);
		// credits bumbadadabum for most of the html
		let buf = `<div class="infobox"><table style="margin:0px;"><tr>`;
		buf += `<td style="margin:5px;padding:5px;min-width:175px;max-width:160px;text-align:center;border-bottom:0px;">`;
		buf += `<div style="padding:5px;background:white;border:1px solid black;margin:auto;max-width:100px;max-height:100px;">`;
		buf += `<a href="${ROOT}channel/${id}"><img src="${icon}" width=100px height=100px/></a>`;
		buf += `</div><p style="margin:5px 0px 4px 0px;word-wrap:break-word;">`;
		buf += `<a style="font-weight:bold;color:#c70000;font-size:12pt;" href="https://www.youtube.com/channel/${id}">${name}</a>`;
		buf += `</p></td><td style="padding: 0px 25px;font-size:10pt;background:rgb(220,20,60);width:100%;border-bottom:0px;vertical-align:top;">`;
		buf += `<p style="padding: 5px;border-radius:8px;color:white;font-weight:bold;text-align:center;">`;
		buf += `${videos} videos | ${subs} subscribers | ${views} video views</p>`;
		buf += `<p style="margin-left: 5px; font-size:9pt;color:white;">`;
		buf += `${description.slice(0, 400).replace(/\n/g, ' ')}${description.length > 400 ? '(...)' : ''}</p>`;
		if (username) {
			buf += `<p style="text-align:left;font-style:italic;color:white;">PS username: ${username}</p></td></tr></table></div>`;
		} else {
			buf += '</td></tr></table></div>';
		}
		return buf;
	}
	randChannel(cat?: string) {
		let channels = Object.keys(this.data.channels);
		if (channels.length < 1) {
			throw new Chat.ErrorMessage(`There are no channels in the database.`);
		}
		if (cat) {
			cat = toID(cat);
			const categoryIDs = this.data.categories.map(toID);
			if (!categoryIDs.includes(cat as ID)) {
				throw new Chat.ErrorMessage(`Invalid category.`);
			}
			channels = channels.filter(id => {
				const channel = this.data.channels[id];
				return channel.category && toID(channel.category) === cat;
			});
		}

		const id = Utils.shuffle(channels)[0].trim();
		return this.generateChannelDisplay(id);
	}
	get(id: string, username?: string): Promise<ChannelEntry> {
		if (!(id in this.data.channels)) return this.getChannelData(id, username);
		return Promise.resolve({...this.data.channels[id]});
	}
	channelSearch(search: string) {
		let channel;
		if (this.data.channels[search]) {
			channel = search;
		} else {
			for (const id of Object.keys(this.data.channels)) {
				const name = toID(this.data.channels[id].name);
				const username = this.data.channels[id].username;
				if (name === toID(search) || username && toID(username) === toID(search)) {
					channel = id;
					break; // don't iterate through everything once a match is found
				}
			}
		}
		return channel;
	}
	getId(link: string) {
		let id = '';
		if (!link) throw new Chat.ErrorMessage('You must provide a YouTube link.');
		if (this.data.channels[link]) return link;
		if (!link.includes('channel/')) {
			if (link.includes('youtube')) {
				id = link.split('v=')[1] || '';
			} else if (link.includes('youtu.be')) {
				id = link.split('/')[3] || '';
			} else {
				throw new Chat.ErrorMessage('Invalid YouTube link.');
			}
		} else {
			id = link.split('channel/')[1] || '';
		}
		if (id.includes('&')) id = id.split('&')[0];
		if (id.includes('?')) id = id.split('?')[0];
		return id;
	}
	async generateVideoDisplay(link: string) {
		if (!Config.youtubeKey) {
			throw new Chat.ErrorMessage(`This server does not support YouTube commands. If you're the owner, you can enable them by setting up Config.youtubekey.`);
		}
		const id = this.getId(link);
		const raw = await Net(`${ROOT}videos`).get({
			query: {part: 'snippet,statistics', id, key: Config.youtubeKey},
		});
		const res = JSON.parse(raw);
		if (!res || !res.items || res.items.length < 1) throw new Chat.ErrorMessage("Video not found.");
		const video = res.items[0];
		const info = {
			title: video.snippet.title,
			date: new Date(video.snippet.publishedAt),
			description: video.snippet.description,
			channel: video.snippet.channelTitle,
			channelUrl: video.snippet.channelId,
			views: video.statistics.viewCount,
			thumbnail: video.snippet.thumbnails.default.url,
			likes: video.statistics.likeCount,
			dislikes: video.statistics.dislikeCount,
		};
		let buf = `<table style="margin:0px;"><tr>`;
		buf += `<td style="margin:5px;padding:5px;min-width:175px;max-width:160px;text-align:center;border-bottom:0px;">`;
		buf += `<div style="padding:5px;background:#b0b0b0;border:1px solid black;margin:auto;max-width:100px;max-height:100px;">`;
		buf += `<a href="${ROOT}channel/${id}"><img src="${info.thumbnail}" width=100px height=100px/></a>`;
		buf += `</div><p style="margin:5px 0px 4px 0px;word-wrap:break-word;">`;
		buf += `<a style="font-weight:bold;color:#c70000;font-size:12pt;" href="https://www.youtube.com/watch?v=${id}">${info.title}</a>`;
		buf += `</p></td><td style="padding: 0px 25px;font-size:10pt;max-width:100px;background:`;
		buf += `#white;width:100%;border-bottom:0px;vertical-align:top;">`;
		buf += `<p style="background: #e22828; padding: 5px;border-radius:8px;color:white;font-weight:bold;text-align:center;">`;
		buf += `${info.likes} likes | ${info.dislikes} dislikes | ${info.views} video views<br><br>`;
		buf += `<small>Published on ${info.date} | ID: ${id}</small><br>Uploaded by: ${info.channel}</p>`;
		buf += `<br><details><summary>Video Description</p></summary>`;
		buf += `<p style="background: #e22828;max-width:500px;padding: 5px;border-radius:8px;color:white;font-weight:bold;text-align:center;">`;
		buf += `<i>${info.description.slice(0, 400).replace(/\n/g, ' ')}${info.description.length > 400 ? '(...)' : ''}</p><i></details></td>`;
		return buf;
	}
	save() {
		return FS(STORAGE_PATH).writeUpdate(() => JSON.stringify(this.data));
	}
	getRoom(context: CommandContext) {
		const room = context.requireRoom();
		if (room.roomid !== 'youtube') {
			throw new Chat.ErrorMessage(`This command can only be used in the YouTube room.`);
		}
		return room;
	}
}

export const YouTube = new YoutubeInterface(channelData);

export const commands: ChatCommands = {
	async randchannel(target, room, user) {
		room = YouTube.getRoom(this);
		if (Object.keys(YouTube.data.channels).length < 1) return this.errorReply(`No channels in the database.`);
		target = toID(target);
		this.runBroadcast();
		const data = await YouTube.randChannel(target);
		return this.sendReplyBox(data);
	},
	randchannelhelp: [`/randchannel - View data of a random channel from the YouTube database.`],

	yt: 'youtube',
	youtube: {
		async addchannel(target, room, user) {
			room = YouTube.getRoom(this);
			let [id, name] = target.split(',');
			if (name) name = name.trim();
			if (!id) return this.errorReply('Specify a channel ID.');
			await YouTube.getChannelData(id, name);
			this.modlog('ADDCHANNEL', null, `${id} ${name ? `username: ${name}` : ''}`);
			return this.privateModAction(
				`${user.name} added channel with id ${id} ${name ? `and username (${name}) ` : ''} to the random channel pool.`
			);
		},
		addchannelhelp: [`/addchannel - Add channel data to the YouTube database. Requires: % @ #`],

		removechannel(target, room, user) {
			room = YouTube.getRoom(this);
			this.checkCan('mute', null, room);
			const id = YouTube.channelSearch(target);
			if (!id) return this.errorReply(`Channel with ID or name ${target} not found.`);
			delete YouTube.data.channels[id];
			YouTube.save();
			this.privateModAction(`${user.name} deleted channel with ID or name ${target}.`);
			return this.modlog(`REMOVECHANNEL`, null, id);
		},
		removechannelhelp: [`/youtube removechannel - Delete channel data from the YouTube database. Requires: % @ #`],

		async channel(target, room, user) {
			room = YouTube.getRoom(this);
			const channel = YouTube.channelSearch(target);
			if (!channel) return this.errorReply(`No channels with ID or name ${target} found.`);
			const data = await YouTube.generateChannelDisplay(channel);
			this.runBroadcast();
			return this.sendReplyBox(data);
		},
		channelhelp: [
			'/youtube channel - View the data of a specified channel. Can be either channel ID or channel name.',
		],
		video() {
			return this.errorReply(`Use /show instead.`);
		},

		channels(target, room, user) {
			target = toID(target);
			return this.parse(`/j view-channels${target ? `-${target}` : ''}`);
		},
		help(target, room, user) {
			return this.parse('/help youtube');
		},

		categories() {
			return this.parse(`/j view-channels-categories`);
		},

		update(target, room, user) {
			room = YouTube.getRoom(this);
			this.checkCan('mute', null, room);
			const [channel, name] = target.split(',');
			const id = YouTube.channelSearch(channel);
			if (!id) return this.errorReply(`Channel ${channel} is not in the database.`);
			channelData.channels[id].username = name;
			this.modlog(`UPDATECHANNEL`, null, name);
			this.privateModAction(`${user.name} updated channel ${id}'s username to ${name}.`);
			return FS(STORAGE_PATH).writeUpdate(() => JSON.stringify(channelData));
		},
		interval: 'repeat',
		repeat(target, room, user) {
			room = YouTube.getRoom(this);
			this.checkCan('declare', null, room);
			if (!target) return this.sendReply(`Interval is currently set to ${Chat.toDurationString(YouTube.intervalTime)}.`);
			if (Object.keys(channelData).length < 1) return this.errorReply(`No channels in the database.`);
			if (isNaN(parseInt(target))) return this.errorReply(`Specify a number (in minutes) for the interval.`);
			let interval = Number(target);
			if (interval < 10) return this.errorReply(`${interval} is too low - set it above 10 minutes.`);
			interval = interval * 60 * 1000;
			YouTube.intervalTime = interval;
			if (YouTube.interval) clearInterval(YouTube.interval);
			YouTube.interval = setInterval(() => {
				void (async () => {
					if (!room) return; // do nothing if the room doesn't exist anymore
					const res = await YouTube.randChannel();
					this.addBox(res);
					room.update();
				})();
			 }, interval);
			this.privateModAction(`${user.name} set a randchannel interval to ${target} minutes`);
			return this.modlog(`CHANNELINTERVAL`, null, `${target} minutes`);
		},
		addcategory(target, room, user) {
			room = YouTube.getRoom(this);
			this.checkCan('ban', null, room);
			const categoryID = toID(target);
			if (!categoryID) return this.parse(`/help youtube`);
			if (YouTube.data.categories.map(toID).includes(categoryID)) {
				return this.errorReply(`This category is already added. To change it, remove it and re-add it.`);
			}
			YouTube.data.categories.push(target);
			this.modlog(`YOUTUBE ADDCATEGORY`, null, target);
			this.privateModAction(`${user.name} added category '${target}' to the categories list.`);
			YouTube.save();
		},
		removecategory(target, room, user) {
			room = YouTube.getRoom(this);
			this.checkCan('ban', null, room);
			const categoryID = toID(target);
			if (!categoryID) return this.parse(`/help youtube`);
			const index = YouTube.data.categories.indexOf(target);
			if (index < 0) {
				return this.errorReply(`${target} is not a valid category.`);
			}
			for (const id in YouTube.data.channels) {
				const channel = YouTube.data.channels[id];
				if (channel.category === target) delete YouTube.data.channels[id].category;
			}
			YouTube.save();
			this.privateModAction(`${user.name} removed the category '${target}' from the category list.`);
			this.modlog(`YOUTUBE REMOVECATEGORY`, null, target);
		},
		setcategory(target, room, user) {
			room = YouTube.getRoom(this);
			this.checkCan('ban', null, room);
			target = target.trim();
			const [category, id] = Utils.splitFirst(target, ',').map(item => item.trim());
			if (!target || !category || !id) {
				return this.parse('/help youtube');
			}
			if (!YouTube.data.categories.includes(category)) {
				return this.errorReply(`Invalid category.`);
			}
			const name = YouTube.channelSearch(id);
			if (!name) return this.errorReply(`Invalid channel.`);
			const channel = YouTube.data.channels[name];
			YouTube.data.channels[name].category = category;
			YouTube.save();
			this.modlog(`YOUTUBE SETCATEGORY`, null, `${id}: to category ${category}`);
			this.privateModAction(`${user.name} set the channel ${channel.name}'s category to '${category}'.`);
		},
		decategorize(target, room, user) {
			room = YouTube.getRoom(this);
			this.checkCan('ban', null, room);
			target = target.trim();
			if (!target) {
				return this.parse('/help youtube');
			}
			const name = YouTube.channelSearch(target);
			if (!name) return this.errorReply(`Invalid channel.`);
			const channel = YouTube.data.channels[name];
			const category = channel.category;
			if (!category) return this.errorReply(`That channel does not have a category.`);
			delete channel.category;
			YouTube.save();
			this.modlog(`YOUTUBE DECATEGORIZE`, null, target);
			this.privateModAction(`${user.name} removed the channel ${channel.name} from the category ${category}.`);
		},
	},
	youtubehelp: [
		`YouTube commands:`,
		`/randchannel [optional category]- View data of a random channel from the YouTube database.` +
			` If a category is given, the random channel will be in the  given category.`,
		`/youtube addchannel [channel] - Add channel data to the YouTube database. Requires: % @ #`,
		`/youtube removechannel [channel]- Delete channel data from the YouTube database. Requires: % @ #`,
		`/youtube channel [channel] - View the data of a specified channel. Can be either channel ID or channel name.`,
		`/youtube video [video] - View data of a specified video. Can be either channel ID or channel name.`,
		`/youtube update [channel], [name] - sets a channel's PS username to [name]. Requires: % @ #`,
		`/youtube repeat [time] - Sets an interval for [time] minutes, showing a random channel each time. Requires: # &`,
		`/youtube addcategory [name] - Adds the [category] to the channel category list. Requires: @ # &`,
		`/youtube removecategory [name] - Removes the [category] from the channel category list. Requires: @ # &`,
		`/youtube setcategory [category], [channel name] - Sets the category for [channel] to [category]. Requires: @ # &`,
		`/youtube decategorize [channel name] - Removes the category for the [channel], if there is one. Requires: @ # &`,
		`/youtube categores - View all channels sorted by category.`,
	],
};

export const pages: PageTable = {
	async channels(args, user) {
		const [type] = args;
		if (!Config.youtubeKey) return `<h2>Youtube is not configured.</h2>`;
		const titles: {[k: string]: string} = {
			all: 'All channels',
			categories: 'by category',
		};
		const title = titles[type] || 'Usernames only';
		this.title = `[Channels] ${title}`;
		let buffer = `<div class="pad"><h4>Channels in the YouTube database: (${title})`;
		buffer += ` <button class="button" name="send" value="/join view-channels-${type}" style="float: right">Refresh</button>`;
		buffer += `</h4><hr />`;
		switch (toID(type)) {
		case 'categories':
			if (!YouTube.data.categories.length) {
				return this.errorReply(`There are currently no categories in the Youtube channel database.`);
			}
			const sorted: {[k: string]: string[]} = {};
			const channels = Object.assign({}, YouTube.data.channels);
			for (const id of Object.keys(channels)) {
				const channel = channels[id];
				const category = channel.category || "No category";
				if (!sorted[category]) {
					sorted[category] = [];
				}
				sorted[category].push(id);
			}
			for (const cat in sorted) {
				buffer += `<h3>${cat}:</h3>`;
				for (const id of sorted[cat]) {
					const channel = channels[id];
					buffer += `<details><summary>${channel.name}</summary>`;
					buffer += await YouTube.generateChannelDisplay(id);
					buffer += `</details><br />`;
				}
			}
			break;
		default:
			for (const id of Utils.shuffle(Object.keys(YouTube.data.channels))) {
				const {name, username} = await YouTube.get(id);
				if (toID(type) !== 'all' && !username) continue;
				buffer += `<details><summary>${name}`;
				buffer += `<small><i> (Channel ID: ${id})</i></small>`;
				if (username) buffer += ` <small>(PS name: ${username})</small>`;
				buffer += `</summary>`;
				buffer += await YouTube.generateChannelDisplay(id);
				buffer += `</details><hr/ >`;
			}
			break;
		}
		buffer += `</div>`;
		return buffer;
	},
};
