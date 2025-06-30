/**
 * Youtube room chat-plugin.
 * Supports adding channels and selecting a random channel.
 * Also supports showing video data on request.
 * Written by Mia, with some design concepts from bumbadadabum.
 * @author mia-pi-git
 */

import { Utils, FS, Net } from '../../lib';

const ROOT = 'https://www.googleapis.com/youtube/v3/';
const STORAGE_PATH = 'config/chat-plugins/youtube.json';
const GROUPWATCH_ROOMS = [
	'internetexplorers', 'pokemongames', 'videogames', 'smashbros', 'pokemongo', 'hindi', 'franais', 'arcade',
];

export const videoDataCache: Map<string, VideoData> = Chat.oldPlugins.youtube?.videoDataCache || new Map();
export const searchDataCache: Map<string, string[]> = Chat.oldPlugins.youtube?.searchDataCache || new Map();

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

export interface VideoData {
	id: string;
	title: string;
	date: string;
	description: string;
	channelTitle: string;
	channelUrl: string;
	views: number;
	thumbnail: string;
	likes: number;
	dislikes: number;
}

interface TwitchChannel {
	status: string;
	display_name: string;
	name: string;
	language: string;
	created_at: string;
	logo: string;
	views: number;
	followers: number;
	video_banner: string;
	url: string;
	game: string;
	description: string;
	updated_at: string;
}

interface ChannelData {
	channels: { [k: string]: ChannelEntry };
	categories: string[];
	intervalTime?: number;
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

const channelData: ChannelData = loadData();

export class YoutubeInterface {
	interval: NodeJS.Timeout | null;
	intervalTime: number;
	data: ChannelData;
	linkRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)(\/|$)/i;
	constructor(data?: ChannelData) {
		this.data = data ? data : { categories: [], channels: {} };
		this.interval = null;
		this.intervalTime = 0;
		if (data?.intervalTime) {
			this.runInterval(`${data.intervalTime}`);
		}
	}
	async getChannelData(link: string, username?: string) {
		if (!Config.youtubeKey) {
			throw new Chat.ErrorMessage(`This server does not support YouTube commands. If you're the owner, you can enable them by setting up Config.youtubekey.`);
		}
		const id = this.getId(link);
		const raw = await Net(`${ROOT}channels`).get({
			query: { part: 'snippet,statistics', id, key: Config.youtubeKey },
		});
		const res = JSON.parse(raw);
		if (!res?.items || res.items.length < 1) {
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
			username,
		};
		this.data.channels[id] = { ...cache };
		this.save();
		return cache;
	}
	async generateChannelDisplay(link: string) {
		const id = this.getId(link);
		const { name, description, icon, videos, subs, views, username } = await this.get(id);
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

		const id = Utils.shuffle(channels)[0];
		return this.generateChannelDisplay(id);
	}
	get(id: string, username?: string): Promise<ChannelEntry> {
		if (!(id in this.data.channels)) return this.getChannelData(id, username);
		return Promise.resolve({ ...this.data.channels[id] });
	}
	async getVideoData(id: string): Promise<VideoData | null> {
		const cached = videoDataCache.get(id);
		if (cached) return cached;
		let raw;
		try {
			raw = await Net(`${ROOT}videos`).get({
				query: { part: 'snippet,statistics', id, key: Config.youtubeKey },
			});
		} catch (e: any) {
			throw new Chat.ErrorMessage(`Failed to retrieve video data: ${e.message}.`);
		}
		const res = JSON.parse(raw);
		if (!res?.items || res.items.length < 1) return null;
		const video = res.items[0];
		const data: VideoData = {
			title: video.snippet.title,
			id,
			date: new Date(video.snippet.publishedAt).toString(),
			description: video.snippet.description,
			channelTitle: video.snippet.channelTitle,
			channelUrl: video.snippet.channelId,
			views: video.statistics.viewCount,
			thumbnail: video.snippet.thumbnails.default.url,
			likes: video.statistics.likeCount,
			dislikes: video.statistics.dislikeCount,
		};
		videoDataCache.set(id, data);
		return data;
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
				throw new Chat.ErrorMessage('Invalid YouTube channel link.');
			}
		} else {
			id = link.split('channel/')[1] || '';
		}
		if (id.includes('&')) id = id.split('&')[0];
		if (id.includes('?')) id = id.split('?')[0];
		return id;
	}
	async generateVideoDisplay(link: string, fullInfo = false) {
		if (!Config.youtubeKey) {
			throw new Chat.ErrorMessage(`This server does not support YouTube commands. If you're the owner, you can enable them by setting up Config.youtubekey.`);
		}
		const id = this.getId(link);
		const info = await this.getVideoData(id);
		if (!info) throw new Chat.ErrorMessage(`Video not found.`);
		if (!fullInfo) {
			let buf = `<b>${info.title}</b> `;
			buf += `(<a class="subtle" href="https://youtube.com/channel/${info.channelUrl}">${info.channelTitle}</a>)<br />`;
			buf += `<youtube src="https://www.youtube.com/embed/${id}" />`;
			return buf;
		}
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
		buf += `<small>Published on ${info.date} | ID: ${id}</small><br>Uploaded by: ${info.channelTitle}</p>`;
		buf += `<br><details><summary>Video Description</p></summary>`;
		buf += `<p style="background: #e22828;max-width:500px;padding: 5px;border-radius:8px;color:white;font-weight:bold;text-align:center;">`;
		buf += `<i>${info.description.slice(0, 400).replace(/\n/g, ' ')}${info.description.length > 400 ? '(...)' : ''}</p><i></details></td>`;
		return buf;
	}
	save() {
		return FS(STORAGE_PATH).writeUpdate(() => JSON.stringify(this.data));
	}
	async searchVideo(name: string, limit?: number): Promise<string[] | undefined> {
		const cached = searchDataCache.get(toID(name));
		if (cached) {
			return cached.slice(0, limit);
		}
		const raw = await Net(`${ROOT}search`).get({
			query: {
				part: 'snippet', q: name,
				key: Config.youtubeKey, order: 'relevance',
			},
		});
		const result = JSON.parse(raw);
		const resultArray = result.items?.map((item: AnyObject) => item?.id?.videoId).filter(Boolean);
		searchDataCache.set(toID(name), resultArray);
		return resultArray.slice(0, limit);
	}
	async searchChannel(name: string, limit = 10): Promise<string[] | undefined> {
		const raw = await Net(`${ROOT}search`).get({
			query: {
				part: 'snippet', q: name, type: 'channel',
				key: Config.youtubeKey, order: 'relevance', maxResults: limit,
			},
		});
		const result = JSON.parse(raw);
		return result?.items.map((item: AnyObject) => item?.snippet?.channelId);
	}
	runInterval(time: string) {
		let interval = Number(time);
		if (interval < 10) throw new Chat.ErrorMessage(`${interval} is too low - set it above 10 minutes.`);
		this.intervalTime = interval;
		this.data.intervalTime = interval;
		interval = interval * 60 * 1000;
		if (this.interval) clearInterval(this.interval);
		this.interval = setInterval(() => {
			void (async () => {
				const room = Rooms.search('youtube');
				if (!room) return; // do nothing if the room doesn't exist anymore
				const res = await YouTube.randChannel();
				room.add(`|html|${res}`).update();
			})();
		}, interval);
		return this.interval;
	}
	async createGroupWatch(url: string, baseRoom: Room, title: string) {
		const videoInfo = await this.getGroupwatchData(url);
		const num = baseRoom.nextGameNumber();
		baseRoom.saveSettings();
		return new GroupWatch(baseRoom, num, url, title, videoInfo);
	}
	async getGroupwatchData(url: string) {
		if (!Chat.isLink(url)) {
			throw new Chat.ErrorMessage("Invalid URL: " + url);
		}
		const urlData = new URL(url);
		const host = urlData.hostname;
		let videoInfo: GroupwatchData;
		if (['youtu.be', 'www.youtube.com'].includes(host)) {
			const id = this.getId(url);
			const data = await this.getVideoData(id);
			if (!data) throw new Chat.ErrorMessage(`Video not found.`);
			videoInfo = Object.assign(data, { groupwatchType: 'youtube' }) as GroupwatchData;
		} else if (host === 'www.twitch.tv') {
			const data = await Twitch.getChannel(urlData.pathname.slice(1));
			if (!data) throw new Chat.ErrorMessage(`Channel not found`);
			videoInfo = Object.assign(data, { groupwatchType: 'twitch' }) as GroupwatchData;
		} else {
			throw new Chat.ErrorMessage(`Invalid URL: must be either a Youtube or Twitch link.`);
		}
		return videoInfo;
	}
}

export const Twitch = new class {
	linkRegex = /(https?:\/\/)?twitch.tv\/([A-Za-z0-9]+)/i;
	async getChannel(channel: string): Promise<TwitchChannel | undefined> {
		if (!Config.twitchKey || typeof Config.twitchKey !== 'object') {
			throw new Chat.ErrorMessage(`Twitch is not enabled.`);
		}
		channel = toID(channel);
		let res;
		try {
			res = await Net(`https://api.twitch.tv/helix/search/channels`).get({
				headers: {
					'Authorization': `Bearer ${Config.twitchKey.key}`,
					'Client-Id': Config.twitchKey.id,
					'Content-Type': 'application/json',
					'Accept': "application/vnd.twitchtv.v5+json",
				},
				query: { query: channel },
			});
		} catch (e: any) {
			throw new Chat.ErrorMessage(`Error retrieving twitch channel: ${e.message}`);
		}
		const data = JSON.parse(res);
		Utils.sortBy(data.channels as AnyObject[], c => -c.followers);
		return data?.channels?.[0] as TwitchChannel | undefined;
	}
	visualizeChannel(info: TwitchChannel) {
		let buf = `<div class="infobox"><table style="margin:0px;"><tr>`;
		buf += `<td style="margin:5px;padding:5px;min-width:175px;max-width:160px;text-align:center;border-bottom:0px;">`;
		buf += `<div style="padding:5px;background:white;border:1px solid black;margin:auto;max-width:100px;max-height:100px;">`;
		buf += `<a href="${info.url}"><img src="${info.logo}" width=100px height=100px/></a>`;
		buf += `</div><p style="margin:5px 0px 4px 0px;word-wrap:break-word;">`;
		buf += `<a style="font-weight:bold;color:#6441a5;font-size:12pt;" href="${info.logo}">${info.display_name}</a>`;
		buf += `</p></td><td style="padding: 0px 25px;font-size:10pt;background:rgb(100, 65, 164);width:100%;border-bottom:0px;vertical-align:top;">`;
		buf += `<p style="padding: 5px;border-radius:8px;color:white;font-size:15px;font-weight:bold;text-align:center;">`;
		const created = new Date(info.created_at);
		buf += `${info.followers} subscribers | ${info.views} stream views | created ${Chat.toTimestamp(created).split(' ')[0]}</p>`;
		buf += `<p style="color:white;font-size:10px">Last seen playing ${info.game} (Status: ${info.status})</p>`;
		buf += `<hr /><p style="margin-left: 5px; font-size:9pt;color:white;">`;
		buf += `${info.description.slice(0, 400).replace(/\n/g, ' ')}${info.description.length > 400 ? '...' : ''}</p>`;
		buf += '</td></tr></table></div>';
		return buf;
	}
};

type GroupwatchData = VideoData & { groupwatchType: 'youtube' } | TwitchChannel & { groupwatchType: 'twitch' };
export class GroupWatch extends Rooms.SimpleRoomGame {
	override readonly gameid = 'groupwatch' as ID;
	url: string;
	info: GroupwatchData;
	started: number | null = null;
	id: string;
	static groupwatches = new Map<string, GroupWatch>();
	constructor(room: Room, num: number, url: string, title: string, videoInfo: GroupwatchData) {
		super(room);
		this.title = title;
		this.id = `${room.roomid}-${num}`;
		GroupWatch.groupwatches.set(this.id, this);
		this.url = url;
		this.info = videoInfo;
	}
	override onJoin(user: User) {
		const hints = this.hints();
		for (const hint of hints) {
			user.sendTo(this.room.roomid, `|html|${hint}`);
		}
	}
	start() {
		if (this.started) throw new Chat.ErrorMessage(`We've already started.`);
		this.started = Date.now();
		this.update();
	}
	hints() {
		const title = this.info.groupwatchType === 'youtube' ? this.info.title : this.info.display_name;
		const hints = [
			`To watch, all you need to do is click play on the video once staff have started it!`,
			`We are currently watching: <a href="${this.url}">${title}</a>`,
		];
		if (this.started && this.info.groupwatchType === 'youtube') {
			const diff = Date.now() - this.started;
			hints.push(`Video is currently at ${Chat.toDurationString(diff)} (${Math.floor(diff / 1000)} seconds)`);
		}
		return hints;
	}
	getStatsDisplay() {
		if (this.info.groupwatchType === 'twitch') {
			let buf = `<p style="background: #6441a5; padding: 5px;border-radius:8px;color:white;font-weight:bold;text-align:center;">`;
			buf += `<strong>Watching <a href="${this.info.url}" class="subtle">${this.info.display_name}</strong><br />`;
			buf += `${Chat.count(Object.keys(this.room.users).length, 'users')} watching<br />`;
			buf += `<strong>Playing: ${this.info.game}`;
			return buf;
		}
		let controlsHTML = `<h3>${this.info.title}</h3>`;
		controlsHTML += `<div class="infobox"><b>Channel:</b> `;
		controlsHTML += `<a href="https://www.youtube.com/channel/${this.info.channelUrl}">${this.info.channelTitle}</a><br />`;
		controlsHTML += `<b>Likes:</b> ${this.info.likes} | <b>Dislikes:</b> ${this.info.dislikes}<br />`;
		controlsHTML += `<b>Uploaded:</b> <time>${new Date(this.info.date).toISOString()}</time><br />`;
		controlsHTML += `<details><summary>Description</summary>${this.info.description.replace(/\n/ig, '<br />')}</details>`;
		controlsHTML += `</div>`;
		return controlsHTML;
	}
	getVideoDisplay() {
		if (this.info.groupwatchType === 'twitch') {
			let buf = `<p style="background: #6441a5; padding: 5px;border-radius:8px;color:white;font-weight:bold;text-align:center;">`;
			buf += `<twitch src="${this.info.url}" width="600" height="330" />`;
			return buf;
		}
		let buf = `<p style="background: #e22828; padding: 5px;border-radius:8px;color:white;font-weight:bold;text-align:center;">`;
		buf += `<br /><br /><b>${this.info.title}</b><br />`;
		const id = YouTube.getId(this.url);
		const url = `https://youtube.com/watch?v=${id}`;
		let addendum = '';
		if (this.started) {
			const diff = Date.now() - this.started;
			addendum = `&start=${Math.floor(diff / 1000)}`;
		}
		buf += `<youtube src="${url}${addendum}"></youtube>`;
		buf += `<br />`.repeat(4);
		buf += `</p>`;
		return buf;
	}
	display() {
		return (
			Utils.html`<center><div class="pad"><strong>${this.room.title} Groupwatch - ${this.title}</strong><br /><br />` +
			`<p>${this.started ? this.getVideoDisplay() : ""}</p><hr />` +
			`<p>${this.started ? this.getStatsDisplay() : "<i>Waiting to start the video...</i>"}</p>` +
			`<p>${this.hints().join('<br />')}</p>`
		);
	}
	update() {
		for (const user of Object.values(this.room.users)) {
			for (const conn of user.connections) {
				if (conn.openPages?.has(`groupwatch-${this.id}`)) {
					void Chat.parse(`/j view-groupwatch-${this.id}`, this.room, user, conn);
				}
			}
		}
	}
	async changeVideo(url: string) {
		const info = await YouTube.getGroupwatchData(url);
		if (!info) throw new Chat.ErrorMessage(`Could not retrieve data for URL ${url}`);
		this.url = url;
		this.started = Date.now();
		this.info = info;
		this.update();
	}
	override destroy() {
		GroupWatch.groupwatches.delete(this.id);
		this.room.game = null;
		this.room = null!;
	}
}

export const YouTube = new YoutubeInterface(channelData);

export function destroy() {
	if (YouTube.interval) clearInterval(YouTube.interval);
}

export const commands: Chat.ChatCommands = {
	async randchannel(target, room, user) {
		room = this.requireRoom('internetexplorers' as RoomID);
		if (Object.keys(YouTube.data.channels).length < 1) throw new Chat.ErrorMessage(`No channels in the database.`);
		target = toID(target);
		this.runBroadcast();
		const data = await YouTube.randChannel(target);
		return this.sendReply(`|html|${data}`);
	},
	randchannelhelp: [`/randchannel - View data of a random channel from the YouTube database.`],

	yt: 'youtube',
	youtube: {
		async addchannel(target, room, user) {
			room = this.requireRoom('internetexplorers' as RoomID);
			this.checkCan('mute', null, room);
			const [id, name] = target.split(',').map(t => t.trim());
			if (!id) throw new Chat.ErrorMessage('Specify a channel ID.');
			await YouTube.getChannelData(id, name);
			this.modlog('ADDCHANNEL', null, `${id} ${name ? `username: ${name}` : ''}`);
			return this.privateModAction(
				`${user.name} added channel with id ${id} ${name ? `and username (${name}) ` : ''} to the random channel pool.`
			);
		},
		addchannelhelp: [`/addchannel - Add channel data to the YouTube database. Requires: % @ #`],

		removechannel(target, room, user) {
			room = this.requireRoom('internetexplorers' as RoomID);
			this.checkCan('mute', null, room);
			const id = YouTube.channelSearch(target);
			if (!id) throw new Chat.ErrorMessage(`Channel with ID or name ${target} not found.`);
			delete YouTube.data.channels[id];
			YouTube.save();
			this.privateModAction(`${user.name} deleted channel with ID or name ${target}.`);
			return this.modlog(`REMOVECHANNEL`, null, id);
		},
		removechannelhelp: [`/youtube removechannel - Delete channel data from the YouTube database. Requires: % @ #`],

		async channel(target, room, user) {
			room = this.requireRoom('internetexplorers' as RoomID);
			const channel = YouTube.channelSearch(target);
			if (!channel) throw new Chat.ErrorMessage(`No channels with ID or name ${target} found.`);
			const data = await YouTube.generateChannelDisplay(channel);
			this.runBroadcast();
			return this.sendReply(`|html|${data}`);
		},
		channelhelp: [
			'/youtube channel - View the data of a specified channel. Can be either channel ID or channel name.',
		],
		async video(target, room, user) {
			room = this.requireRoom('internetexplorers' as RoomID);
			this.checkCan('mute', null, room);
			const buffer = await YouTube.generateVideoDisplay(target, true);
			this.runBroadcast();
			this.sendReplyBox(buffer);
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
			room = this.requireRoom('internetexplorers' as RoomID);
			this.checkCan('mute', null, room);
			const [channel, name] = target.split(',');
			const id = YouTube.channelSearch(channel);
			if (!id) throw new Chat.ErrorMessage(`Channel ${channel} is not in the database.`);
			YouTube.data.channels[id].username = name;
			this.modlog(`UPDATECHANNEL`, null, name);
			this.privateModAction(`${user.name} updated channel ${id}'s username to ${name}.`);
			YouTube.save();
		},
		interval: 'repeat',
		repeat(target, room, user) {
			room = this.requireRoom('internetexplorers' as RoomID);
			this.checkCan('declare', null, room);
			if (!target) {
				if (!YouTube.interval) throw new Chat.ErrorMessage(`The YouTube plugin is not currently running an interval.`);
				return this.sendReply(`Interval is currently set to ${Chat.toDurationString(YouTube.intervalTime * 60 * 1000)}.`);
			}
			if (this.meansNo(target)) {
				if (!YouTube.interval) throw new Chat.ErrorMessage(`The interval is not currently running`);
				clearInterval(YouTube.interval);
				delete YouTube.data.intervalTime;
				YouTube.save();
				this.privateModAction(`${user.name} turned off the YouTube interval`);
				return this.modlog(`YOUTUBE INTERVAL`, null, 'OFF');
			}
			if (Object.keys(channelData).length < 1) throw new Chat.ErrorMessage(`No channels in the database.`);
			if (isNaN(parseInt(target))) throw new Chat.ErrorMessage(`Specify a number (in minutes) for the interval.`);
			YouTube.runInterval(target);
			YouTube.save();
			this.privateModAction(`${user.name} set a randchannel interval to ${target} minutes`);
			return this.modlog(`CHANNELINTERVAL`, null, `${target} minutes`);
		},
		addcategory(target, room, user) {
			room = this.requireRoom('internetexplorers' as RoomID);
			this.checkCan('mute', null, room);
			const categoryID = toID(target);
			if (!categoryID) return this.parse(`/help youtube`);
			if (YouTube.data.categories.map(toID).includes(categoryID)) {
				throw new Chat.ErrorMessage(`This category is already added. To change it, remove it and re-add it.`);
			}
			YouTube.data.categories.push(target);
			this.modlog(`YOUTUBE ADDCATEGORY`, null, target);
			this.privateModAction(`${user.name} added category '${target}' to the categories list.`);
			YouTube.save();
		},
		removecategory(target, room, user) {
			room = this.requireRoom('internetexplorers' as RoomID);
			this.checkCan('mute', null, room);
			const categoryID = toID(target);
			if (!categoryID) return this.parse(`/help youtube`);
			const index = YouTube.data.categories.indexOf(target);
			if (index < 0) {
				throw new Chat.ErrorMessage(`${target} is not a valid category.`);
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
			room = this.requireRoom('internetexplorers' as RoomID);
			this.checkCan('mute', null, room);
			target = target.trim();
			const [category, id] = Utils.splitFirst(target, ',').map(item => item.trim());
			if (!target || !category || !id) {
				return this.parse('/help youtube');
			}
			if (!YouTube.data.categories.includes(category)) {
				throw new Chat.ErrorMessage(`Invalid category.`);
			}
			const name = YouTube.channelSearch(id);
			if (!name) throw new Chat.ErrorMessage(`Invalid channel.`);
			const channel = YouTube.data.channels[name];
			YouTube.data.channels[name].category = category;
			YouTube.save();
			this.modlog(`YOUTUBE SETCATEGORY`, null, `${id}: to category ${category}`);
			this.privateModAction(`${user.name} set the channel ${channel.name}'s category to '${category}'.`);
		},
		decategorize(target, room, user) {
			room = this.requireRoom('internetexplorers' as RoomID);
			this.checkCan('mute', null, room);
			target = target.trim();
			if (!target) {
				return this.parse('/help youtube');
			}
			const name = YouTube.channelSearch(target);
			if (!name) throw new Chat.ErrorMessage(`Invalid channel.`);
			const channel = YouTube.data.channels[name];
			const category = channel.category;
			if (!category) throw new Chat.ErrorMessage(`That channel does not have a category.`);
			delete channel.category;
			YouTube.save();
			this.modlog(`YOUTUBE DECATEGORIZE`, null, target);
			this.privateModAction(`${user.name} removed the channel ${channel.name} from the category ${category}.`);
		},
	},
	youtubehelp: [
		`YouTube commands:`,
		`/randchannel [optional category]- View data of a random channel from the YouTube database.` +
		` If a category is given, the random channel will be in the given category.`,
		`/youtube addchannel [channel] - Add channel data to the YouTube database. Requires: % @ #`,
		`/youtube removechannel [channel]- Delete channel data from the YouTube database. Requires: % @ #`,
		`/youtube channel [channel] - View the data of a specified channel. Can be either channel ID or channel name.`,
		`/youtube video [video] - View data of a specified video. Can be either channel ID or channel name.`,
		`/youtube update [channel], [name] - sets a channel's PS username to [name]. Requires: % @ #`,
		`/youtube repeat [time] - Sets an interval for [time] minutes, showing a random channel each time. Requires: # ~`,
		`/youtube addcategory [name] - Adds the [category] to the channel category list. Requires: @ # ~`,
		`/youtube removecategory [name] - Removes the [category] from the channel category list. Requires: @ # ~`,
		`/youtube setcategory [category], [channel name] - Sets the category for [channel] to [category]. Requires: @ # ~`,
		`/youtube decategorize [channel name] - Removes the category for the [channel], if there is one. Requires: @ # ~`,
		`/youtube categores - View all channels sorted by category.`,
	],
	groupwatch: {
		async create(target, room, user) {
			room = this.requireRoom();
			if (!GROUPWATCH_ROOMS.includes(room.roomid)) {
				throw new Chat.ErrorMessage(`This room is not allowed to use the groupwatch function.`);
			}
			this.checkCan('mute', null, room);
			const [url, title] = Utils.splitFirst(target, ',').map(p => p.trim());
			if (!url || !title) throw new Chat.ErrorMessage(`You must specify a video to watch and a title for the group watch.`);
			const game = await YouTube.createGroupWatch(url, room, title);
			this.modlog(`YOUTUBE GROUPWATCH`, null, `${url} (${title})`);
			room.add(
				`|uhtml|${game.id}|` +
				`<button class="button" name="send" value="/j view-groupwatch-${game.id}">Join the ongoing group watch!</button>`
			);
			room.send(`|tempnotify|youtube|New groupwatch - ${title}!`);
			this.update();
		},
		end(target, room, user) {
			room = this.requireRoom();
			this.checkCan('mute', null, room);
			const game = this.requireGame(GroupWatch);
			this.modlog(`GROUPWATCH END`);
			this.add(`|uhtmlchange|${game.id}|`);
			game.destroy();
		},
		start(target, room, user) {
			room = this.requireRoom();
			this.checkCan('mute', null, room);
			const game = this.requireGame(GroupWatch);
			game.start();
			game.update();
		},
		async edit(target, room, user) {
			room = this.requireRoom();
			this.checkCan('mute', null, room);
			const game = this.requireGame(GroupWatch);
			await game.changeVideo(target);
		},
		list() {
			let buf = `<strong>Ongoing groupwatches:</strong><br />`;
			for (const curRoom of Rooms.rooms.values()) {
				if (!curRoom.getGame(GroupWatch)) continue;
				buf += `<button class="button" name="send" value="/j ${curRoom.roomid}">${curRoom.title}</button>`;
			}
			this.runBroadcast();
			this.sendReplyBox(buf);
		},
	},
	groupwatchhelp: [
		`/groupwatch create [link],[title] - create a groupwatch for the given Youtube or Twitch [link] with the [title]. Requires: % @ ~ #`,
		`/groupwatch end - End the current room's groupwatch, if one exists. Requires: % @ ~ #`,
		`/groupwatch start - Begin playback for the current groupwatch. Requires: % @ ~ #`,
		`/groupwatch edit [link] - Change the current groupwatch, if one exists, to be viewing the given [link]. Requires: % @ ~ #`,
	],
	twitch: {
		async channel(target, room, user) {
			room = this.requireRoom('internetexplorers' as RoomID);
			if (!Config.twitchKey) throw new Chat.ErrorMessage(`Twitch is not configured`);
			const data = await Twitch.getChannel(target);
			if (!data) throw new Chat.ErrorMessage(`Channel not found`);
			const html = Twitch.visualizeChannel(data);
			this.runBroadcast();
			return this.sendReplyBox(html);
		},
	},
};

export const pages: Chat.PageTable = {
	async channels(args, user) {
		const [type] = args;
		if (!Config.youtubeKey) return `<h2>Youtube is not configured.</h2>`;
		const titles: { [k: string]: string } = {
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
				throw new Chat.ErrorMessage(`There are currently no categories in the Youtube channel database.`);
			}
			const sorted: { [k: string]: string[] } = {};
			const channels = YouTube.data.channels;
			for (const [id, channel] of Object.entries(channels)) {
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
				const { name, username } = await YouTube.get(id);
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
	groupwatch(query, user, connection) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		const [roomid, num] = query;
		const watch = GroupWatch.groupwatches.get(`${roomid}-${num}`);
		if (!watch) throw new Chat.ErrorMessage(`Groupwatch ${roomid}-${num} not found.`);
		this.title = `[Groupwatch] ${watch.title}`;
		return watch.display();
	},
};
