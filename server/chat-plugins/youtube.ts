/**
 * Youtube room chat-plugin.
 * Supports adding channels and selecting a random channel.
 * Also supports showing video data on request.
 * Written by mia-pi, with some code / design concepts from Asheviere.
 */

import * as https from 'https';
import {FS} from '../../lib/fs';
const ROOT = 'https://www.googleapis.com/youtube/v3/';
const CHANNEL = `${ROOT}channels`;
const STORAGE_PATH = 'config/chat-plugins/youtube.json';

let channelData: AnyObject;

try {
	channelData = JSON.parse(FS(STORAGE_PATH).readIfExistsSync() || "{}");
} catch (e) {
	channelData = {};
}

export class YoutubeInterface {
	interval: NodeJS.Timer | null;
	constructor() {
		this.interval = null;
	}
	async getChannelData(channel: string, username?: string) {
		const queryUrl = `${CHANNEL}?part=snippet%2Cstatistics&id=${encodeURIComponent(channel)}&key=${Config.youtubeKey}`;
		const query = new Promise((resolve, reject) => {
			https.get(queryUrl, res => {
				const data: string[] = [];
				res.setEncoding('utf8');
				res.on('data', chunk => data.push(chunk));
				res.on('end', () => resolve(JSON.parse(data.join(''))));
			}).on('error', reject);
		});
		const res: any = await query.catch(() => {});
		if (!res) return null;
		const data = res.items[0];
		const cache = {
			name: data.snippet.title,
			description: data.snippet.description,
			url: data.snippet.customUrl,
			icon: data.snippet.thumbnails.medium.url,
			videos: Number(data.statistics.videoCount),
			subs: Number(data.statistics.subscriberCount),
			views: Number(data.statistics.viewCount),
			username: username,
		};
		channelData[channel] = {...cache};
		FS(STORAGE_PATH).writeUpdate(() => JSON.stringify(channelData));
		return cache;
	}
	async generateChannelDisplay(id: string) {
		// url isn't needed but it destructures wrong without it
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const {name, description, url, icon, videos, subs, views, username} = await this.get(id);
		// credits asheviere for most of the html
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
	randChannel() {
		const keys = Object.keys(channelData);
		const id = Dex.shuffle(keys)[0].trim();
		return this.generateChannelDisplay(id);
	}
	get(id: string, username?: string) {
		if (!(id in channelData)) return this.getChannelData(id, username);
		return {...channelData[id]};
	}
	channelSearch(search: string) {
		let channel;
		if (channelData[search]) {
			channel = search;
		} else {
			for (const id of Object.keys(channelData)) {
				if (toID(channelData[id].name) === toID(search)) {
					channel = id;
					break; // don't iterate through everything once a match is found
				}
			}
		}
		return channel;
	}
	async generateVideoDisplay(link: string) {
		let [, id] = link.split('v=');
		if (id.includes('&')) id = id.split('&')[0];
		const queryUrl = `${ROOT}videos?part=snippet%2Cstatistics&id=${encodeURIComponent(id)}&key=${Config.youtubeKey}`;
		const query = new Promise((resolve, reject) => {
			https.get(queryUrl, res => {
				const data: string[] = [];
				res.setEncoding('utf8');
				res.on('data', chunk => data.push(chunk));
				res.on('end', () => resolve(JSON.parse(data.join(''))));
			}).on('error', reject);
		});
		const res: any = await query.catch(() => {});
		if (!res.items) return;
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
		buf += `</p></td><td style="padding: 0px 25px;font-size:10pt;background:#white;width:100%;border-bottom:0px;vertical-align:top;">`;
		buf += `<p style="background: #e22828; padding: 5px;border-radius:8px;color:white;font-weight:bold;text-align:center;">`;
		buf += `${info.likes} likes | ${info.dislikes} dislikes | ${info.views} video views<br><br>`;
		buf += `<small>Published on ${info.date} | ID: ${id}</small></p>`;
		buf += `<br><details><summary>Video Description</p></summary>`;
		buf += `<p style="background: #e22828; padding: 5px;border-radius:8px;color:white;font-weight:bold;text-align:center;">`;
		buf += `<i>${info.description.slice(0, 400).replace(/\n/g, ' ')}${info.description.length > 400 ? '(...)' : ''}</p><i></details></td>`;
		return buf;
	}
	randomize() {
		const rearranged: string[] = [];
		const keys = Object.keys(channelData);
		while (keys.length > 1) {
			const item = keys[Math.floor(Math.random() * keys.length)];
			if (rearranged.includes(item)) continue;
			const index = keys.indexOf(item);
			if (index > -1) {
				keys.splice(index, 1);
			}
			rearranged.push(item);
		}
		if (rearranged.length !== keys.length) {
			for (const key of keys) {
				if (!rearranged.includes(key)) rearranged.push(key);
			}
		}
		return rearranged;
	}
}

const YouTube = new YoutubeInterface();

export const commands: ChatCommands = {
	randchannel(target, room, user) {
		if (room.roomid !== 'youtube') return this.errorReply(`This command can only be used in the YouTube room.`);
		this.runBroadcast();
		if (this.broadcasting) {
			if (!this.can('broadcast', null, room)) return false;
			return YouTube.randChannel().then(res => {
				this.addBox(res);
				room.update();
			});
		} else {
			return YouTube.randChannel().then(res => this.sendReplyBox(res));
		}
	},
	randchannelhelp: [`/randchannel - View data of a random channel from the YouTube database.`],

	yt: 'youtube',
	youtube: {
		async addchannel(target, room, user) {
			if (room.roomid !== 'youtube') return this.errorReply(`This command can only be used in the YouTube room.`);
			let [id, name] = target.split(',');
			if (id.includes('youtu')) id = id.split('channel/')[1];
			if (!id) return this.errorReply('Specify a channel ID.');
			if (!(await YouTube.getChannelData(id, name))) {
				return this.errorReply(`Error in retrieving channel data.`);
			}
			this.modlog('ADDCHANNEL', null, `${id} ${name ? `username: ${name}` : ''}`);
			this.privateModAction(`(${user.name} added channel with ID ${id} to the random channel pool.)`);
			return this.sendReply(`Added channel with id ${id} ${name ? `and username (${name}) ` : ''} to the random channel pool.`);
		},
		addchannelhelp: [`/addchannel - Add channel data to the Youtube database. Requires: % @ # ~`],

		removechannel(target, room, user) {
			if (room.roomid !== 'youtube') return this.errorReply(`This command can only be used in the YouTube room.`);
			if (!this.can('ban', null, room)) return false;
			const id = YouTube.channelSearch(target);
			if (!id) return this.errorReply(`Channel with ID or name ${target} not found.`);
			delete channelData[id];
			this.privateModAction(`(${user.name} deleted channel with ID or name ${target}.)`);
			return this.modlog(`REMOVECHANNEL`, null, id);
		},
		removechannelhelp: [`/youtube removechannel - Delete channel data from the YouTube database. Requires: % @ # ~`],

		channel(target, room, user) {
			if (room.roomid !== 'youtube') return this.errorReply(`This command can only be used in the YouTube room.`);
			const channel = YouTube.channelSearch(target);
			if (!channel) return this.errorReply(`No channels with ID or name ${target} found.`);
			this.runBroadcast();
			if (this.broadcasting) {
				return YouTube.generateChannelDisplay(channel).then(res => {
					this.addBox(res);
					room.update();
				});
			} else {
				return YouTube.generateChannelDisplay(channel).then(res => this.sendReplyBox(res));
			}
		},
		channelhelp: [
			'/youtube channel - View the data of a specified channel. Can be either channel ID or channel name.',
		],
		async video(target, room, user) {
			if (room.roomid !== 'youtube') return this.errorReply(`This command can only be used in the YouTube room.`);
			if (!target) return this.errorReply(`Provide a valid youtube link.`);
			const html = await YouTube.generateVideoDisplay(target);
			if (!html) return this.errorReply(`No such video found.`);
			this.runBroadcast();
			if (this.broadcasting) {
				this.addBox(html);
				return room.update();
			} else {
				return this.sendReplyBox(html);
			}
		},
		videohelp: [`/youtube video - View data of a specified video. Can be either channel ID or channel name`],

		channels(target, room, user) {
			let all;
			if (toID(target) === 'all') all = true;
			return this.parse(`/j view-channels${all ? '-all' : ''}`);
		},
		help(target, room, user) {
			return this.parse('/help youtube');
		},

		update(target, room, user) {
			if (room.roomid !== 'youtube') return this.errorReply(`This command can only be used in the YouTube room.`);
			if (!this.can('ban', null, room)) return false;
			const [channel, name] = target.split(',');
			const id = YouTube.channelSearch(channel);
			if (!id) return this.errorReply(`Channel ${channel} is not in the database.`);
			channelData[id].username = name;
			this.modlog(`UPDATECHANNEL`, null, name);
			this.privateModAction(`(${user.name} updated channel ${id}'s username to ${name}.)`);
			return FS(STORAGE_PATH).writeUpdate(() => JSON.stringify(channelData));
		},
		repeat(target, room, user) {
			if (room.roomid !== 'youtube') return this.errorReply(`This command can only be used in the YouTube room.`);
			if (!this.can('declare', null, room)) return false;
			if (!target || isNaN(parseInt(target))) return this.errorReply(`Specify a number (in minutes) for the interval.`);
			let interval = Number(target);
			if (interval < 10) return this.errorReply(`${interval} is too low - set it above 10 minutes.`);
			interval = interval * 60 * 1000;
			if (YouTube.interval) clearInterval(YouTube.interval);
			YouTube.interval = setInterval(
				() => void YouTube.randChannel().then(data => {
					this.addBox(data);
					room.update();
				}),
				interval
			);
			this.privateModAction(`(${user.name} set a randchannel interval to ${target} minutes)`);
			return this.modlog(`CHANNELINTERVAL`, null, `${target} minutes`);
		},
	},

	youtubehelp: [
		`YouTube commands:`,
		`/randchannel - View data of a random channel from the YouTube database.`,
		`/youtube addchannel [channel[- Add channel data to the Youtube database. Requires: % @ # ~`,
		`/youtube removechannel [channel]- Delete channel data from the YouTube database. Requires: % @ # ~`,
		`/youtube channel [channel] - View the data of a specified channel. Can be either channel ID or channel name.`,
		`/youtube video [video] - View data of a specified video. Can be either channel ID or channel name.`,
		`/youtube update [channel], [name] - sets a channel's PS username to [name]. Requires: % @ # ~`,
		`/youtube repeat [time] - Sets an interval for [time] minutes, showing a random channel each time. Requires: # & ~`,
	],

	requestapproval(target, room, user) {
		if (!this.canTalk()) return false;
		if (this.can('mute', null, room)) return this.errorReply(`Use !link instead.`);
		if (room.pendingApprovals.has(user.id)) return this.errorReply('You have a request pending already.');
		if (!toID(target)) return this.parse(`/help requestapproval`);
		if (!/^https?:\/\//.test(target)) target = `http://${target}`;
		room.pendingApprovals.set(user.id, target);
		this.sendReply(`You have requested for the link ${target} to be displayed.`);
		room.sendMods(
			`|uhtml|request-${user.id}|<div class="infobox">${user.name} has requested approval to show <a href="${target}">media.</a><br>` +
			`<button class="button" name="send" value="/approvelink ${user.id}">Approve</button><br>` +
			`<button class="button" name="send" value="/denylink ${user.id}">Deny</button></div>`
		);
		return room.update();
	},
	requestapprovalhelp: [`/requestapproval [link], [comment] - Requests permission to show media in the room.`],

	approvelink(target, room, user) {
		if (!this.can('mute', null, room)) return false;
		target = toID(target);
		if (!target) return this.parse(`/help approvelink`);
		const id = room.pendingApprovals.get(target);
		if (!id) return this.errorReply(`${target} has no pending request.`);
		this.privateModAction(`(${user.name} approved ${target}'s media display request.)`);
		this.modlog(`APPROVELINK`, null, `${target} (${id})`);
		room.pendingApprovals.delete(target);
		if (id.includes('youtu')) {
			return YouTube.generateVideoDisplay(id).then(res => {
				room.add(`|uhtmlchange|request-${target}|`).update();
				res += `<br><p style="margin-left: 5px; font-size:9pt;color:white;">(Suggested by ${target})</p>`;
				this.addBox(res as string);
				room.update();
			});
		} else {
			void Chat.fitImage(id).then(([width, height]) => {
				this.addBox(Chat.html`<img src="${id}" style="width: ${width}px; height: ${height}px" />`);
				room.add(`|uhtmlchange|request-${target}|`);
				room.update();
			});
		}
	},
	approvelinkhelp: [`/approvelink [user] - Approves the media display request of [user]. Requires: % @ # & ~`],

	denylink(target, room, user) {
		if (!this.can('mute', null, room)) return false;
		target = toID(target);
		if (!target) return this.parse(`/help denylink`);
		const id = room.pendingApprovals.get(target);
		if (!id) return this.errorReply(`${target} has no pending request.`);
		room.pendingApprovals.delete(target);
		room.add(`|uhtmlchange|request-${target}|`).update();
		this.privateModAction(`(${user.name} denied ${target}'s media display request.)`);
		this.modlog(`DENYLINK`, null, `${target} (${id})`);
	},
	denylinkhelp: [`/denylink [user] - Denies the media display request of [user]. Requires: % @ # & ~`],

	link(target, room, user) {
		if (!this.can('mute', null, room) && !(user.id in room.chatRoomData!.whitelist)) return false;
		if (!toID(target).trim()) return this.parse(`/help link`);
		const [link, comment] = target.split(',');
		this.runBroadcast();
		if (target.includes('youtu')) {
			return YouTube.generateVideoDisplay(link).then(res => {
				let buf = res;
				buf += `<br><small><p style="margin-left: 5px; font-size:9pt;color:white;">(Suggested by ${user.name})</p></small>`;
				if (comment) buf += `<br>(${comment})</div>`;
				this.addBox(buf as string);
				room.update();
			});
		} else {
			void Chat.fitImage(link).then(([width, height]) => {
				let buf = Chat.html`<img src="${link}" style="width: ${width}px; height: ${height}px" />`;
				if (comment) buf += `<br>(${comment})</div>`;
				if (!this.broadcasting) return this.sendReplyBox(buf);
				this.addBox(buf);
				room.update();
			});
		}
	},
	linkhelp: [`/link [url] - shows an image or video url in chat. Requires: whitelist % @ # & ~`],

	whitelist(target, room, user) {
		if (!this.can('ban', null, room)) return false;
		target = toID(target);
		if (!target) return this.parse(`/help whitelist`);
		if (!Users.get(target)) return this.errorReply(`User not found.`);
		if (target in room.auth! && room.auth![target] !== '+' || Users.get(target)!.isStaff) {
			return this.errorReply(`You don't need to whitelist staff - they can just use !link.`);
		}
		if (!room.whitelistUser(target)) return this.errorReply(`${target} is already whitelisted.`);
		if (Users.get(target)) Users.get(target)?.popup(`You have been whitelisted for linking in ${room}.`);
		this.privateModAction(`(${user.name} whitelisted ${target} for links.)`);
		this.modlog(`WHITELIST`, target);
	},
	whitelisthelp: [`/whitelist [user] - Whitelists [user] to post media in the room. Requires: % @ & # ~`],

	unwhitelist(target, room, user) {
		if (!this.can('ban', null, room)) return false;
		target = toID(target);
		if (Users.get(target)) Users.get(target)?.popup(`You have been removed from the link whitelist in ${room}.`);
		if (!target) return this.parse(`/help unwhitelist`);
		if (!room.unwhitelistUser(target)) return this.errorReply(`${target} is not whitelisted.`);
		this.sendReply(`Unwhitelisted ${target} for linking.`);
		this.modlog(`UNWHITELIST`, target);
		this.privateModAction(`(${user} removed ${target} from the link whitelist.)`);
		return Rooms.global.writeChatRoomData();
	},
};

export const pages: PageTable = {
	async channels(args, user) {
		const all = toID(args[0]) === 'all';
		this.title = `[Channels] ${all ? 'All' : ''}`;
		let buffer = `<div class="pad"><h4>Channels in the Youtube database:`;
		buffer += `<button class="button" name="send" value="/join view-channels${all ? '-all' : ''}"" style="float: right">`;
		buffer += `<i class="fa fa-refresh"></i> Refresh</button><br />`;
		if (all) buffer += `(All)`;
		buffer += `</h4><hr />`;
		const isStaff = user.can('mute', null, Rooms.get('youtube'));
		for (const id of YouTube.randomize()) {
			const name = YouTube.get(id).name;
			const psid = YouTube.get(id).username;
			if (!all && !psid) continue;
			buffer += `<details><summary>${name}`;
			if (isStaff) buffer += `<small><i> (Channel ID: ${id})</i></small>`;
			if (psid) buffer += ` <small>(PS name: ${psid})</small>`;
			buffer += `</summary>`;
			buffer += await YouTube.generateChannelDisplay(id);
			if (!isStaff) buffer += `<i>(Channel ID: ${id})</i>`;
			buffer += `</details><hr/ >`;
		}
		buffer += `</div>`;
		return buffer;
	},
};
