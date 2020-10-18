import {FS} from '../../lib/fs';
import {Net} from '../../lib/net';
import {Utils} from '../../lib/utils';
import {YouTube} from './youtube';

const LASTFM_DB = 'config/chat-plugins/lastfm.json';
const RECOMMENDATIONS = 'config/chat-plugins/the_studio.json';
const API_ROOT = 'http://ws.audioscrobbler.com/2.0/';
const DEFAULT_IMAGES = [
	'https://lastfm.freetls.fastly.net/i/u/34s/2a96cbd8b46e442fc41c2b86b821562f.png',
	'https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png',
	'https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png',
	'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png',
];

interface Recommendation {
	artist: string;
	title: string;
	url: string;
	description: string;
	tags: string[];
	userData: {
		name: string;
		avatar?: string;
	};
	likes: number;
}

type Recommendations = {suggested: Recommendation[], saved: Recommendation[]};

const lastfm: {[userid: string]: string} = JSON.parse(FS(LASTFM_DB).readIfExistsSync() || "{}");
const recommendations: Recommendations = JSON.parse(FS(RECOMMENDATIONS).readIfExistsSync() || "{}");

if (!recommendations.saved) recommendations.saved = [];
if (!recommendations.suggested) recommendations.suggested = [];
saveRecommendations();

function saveLastFM() {
	FS(LASTFM_DB).writeUpdate(() => JSON.stringify(lastfm));
}
function saveRecommendations() {
	FS(RECOMMENDATIONS).writeUpdate(() => JSON.stringify(recommendations));
}

export class LastFMInterface {
	async getLastFMData(username: string, displayName?: string) {
		this.checkHasKey();
		const accountName = this.getAccountName(username);
		const raw = await Net(API_ROOT).get({
			query: {
				method: 'user.getRecentTracks', user: accountName,
				limit: 1, api_key: Config.lastfmkey, format: 'json',
			},
		});
		const res = JSON.parse(raw);
		if (res.error) {
			throw new Chat.ErrorMessage(`${res.message}.`);
		}
		if (!res?.recenttracks?.track?.length) throw new Chat.ErrorMessage(`last.fm account not found.`);
		const track = res.recenttracks.track[0];
		let buf = `<table><tr>`;
		if (track.image?.length) {
			const imageIndex = track.image.length >= 3 ? 2 : track.image.length - 1;
			if (track.image[imageIndex]['#text']) {
				buf += `<td style="padding-right:5px"><img src="${track.image[imageIndex]['#text']}" width="75" height="75" /></td>`;
			}
			buf += `<td><strong><a href="https://www.last.fm/user/${accountName}">${displayName || accountName}</a></strong>`;
			if (track['@attr']?.nowplaying) {
				buf += ` is currently listening to:`;
			} else {
				buf += ` was last seen listening to:`;
			}
			buf += `<br />`;
			const trackName = `${track.artist?.['#text'] ? `${track.artist['#text']} - ` : ''}${track.name}`;
			const videoIDs = await YouTube.searchVideo(trackName, 1);
			if (!videoIDs?.length) {
				throw new Chat.ErrorMessage(`Something went wrong with the YouTube API.`);
			}
			buf += `<a href="https://youtu.be/${videoIDs[0]}">${Utils.escapeHTML(trackName)}</a>`;
			buf += `</td></tr></table>`;
		}
		return buf;
	}

	addAccountName(userid: ID, accountName: string) {
		this.checkHasKey();
		accountName = accountName.trim();
		if (lastfm[userid]) {
			const oldName = lastfm[userid];
			lastfm[userid] = accountName;
			saveLastFM();
			return `last.fm account name changed from '${oldName}' to '${accountName}'.`;
		}
		lastfm[userid] = accountName;
		saveLastFM();
		return `Registered last.fm account '${accountName}'.`;
	}

	validateAccountName(accountName: string) {
		accountName = accountName.trim();
		const sanitizedName = accountName.replace(/[^-_a-zA-Z0-9]+/g, '');
		if (!(!accountName.includes(' ') && accountName === sanitizedName && /^[a-zA-Z]/.test(sanitizedName) &&
			sanitizedName.length > 1 && sanitizedName.length < 16)) {
				throw new Chat.ErrorMessage(`The provided account name (${sanitizedName}) is invalid. Valid last.fm usernames are between 2-15 characters, start with a letter, and only contain letters, numbers, hyphens, and underscores.`);
			}
		return true;
	}

	getAccountName(username: string) {
		if (lastfm[toID(username)]) return lastfm[toID(username)];
		return username.trim().replace(/ /g, '_').replace(/[^-_a-zA-Z0-9]/g, '');
	}

	async tryGetTrackData(track: string, artist?: string) {
		this.checkHasKey();
		const query: {[k: string]: any} = {
			method: 'track.search', limit: 1, api_key: Config.lastfmkey, track, format: 'json',
		};
		if (artist) query.artist = artist;
		const raw = await Net(API_ROOT).get({query});
		const req = JSON.parse(raw);
		let buf = ``;
		if (req.results?.trackmatches?.track?.length) {
			buf += `<table><tr><td style="padding-right:5px">`;
			const obj = req.results.trackmatches.track[0];
			const trackName = obj.name || "Untitled";
			const artistName = obj.artist || "Unknown Artist";
			const searchName = `${artistName} - ${trackName}`;
			if (obj.image?.length) {
				const img = obj.image;
				const imageIndex = img.length >= 3 ? 2 : img.length - 1;
				if (img[imageIndex]['#text'] && !DEFAULT_IMAGES.includes(img[imageIndex]['#text'])) {
					buf += `<img src="${img[imageIndex]['#text']}" width="75" height="75" />`;
				}
			}
			buf += `</td><td>`;
			const artistUrl = obj.url.split('_/')[0];
			buf += `<strong><a href="${artistUrl}">${artistName}</a> - <a href="${obj.url}">${trackName}</a></strong><br />`;
			const videoIDs = await YouTube.searchVideo(searchName, 1);
			if (!videoIDs?.length) {
				buf += searchName;
			} else {
				buf += `<a href="https://youtu.be/${videoIDs[0]}">YouTube link</a>`;
			}
			buf += `</td></tr></table>`;
		}
		if (req.error) {
			throw new Chat.ErrorMessage(`${req.message}.`);
		}
		if (!buf) {
			throw new Chat.ErrorMessage(`No results for '${artist ? `${artist} - ` : ``}${track}' found. Check spelling?`);
		}
		return buf;
	}
	checkHasKey() {
		if (!Config.lastfmkey) {
			throw new Chat.ErrorMessage(`This server does not support last.fm commands. If you're the owner, you can enable them by setting up Config.lastfmkey.`);
		}
	}
}

class RecommendationsInterface {
	lastRecommendation?: Recommendation;
	intervalTime: number | null;
	interval: NodeJS.Timer | null;

	constructor() {
		this.intervalTime = null;
		this.interval = null;
	}

	getRoom(context: CommandContext) {
		const room = context.requireRoom();
		if (room.roomid !== 'thestudio') {
			throw new Chat.ErrorMessage(`This command can only be used in The Studio.`);;
		}
		return room;
	}

	async add(room: Room, artist: string, title: string, url: string, description: string, username: string, tags: string[],  avatar?: string) {
		artist = artist.trim();
		title = title.trim();
		if (recommendations.saved.find(x => toID(x.title) === toID(title) && toID(x.artist) === toID(artist))) {
			throw new Chat.ErrorMessage(`The song titled '${title}' by ${artist} is already recommended.`);
		}
		if (!/^https?:\/\//.test(url)) url = `https://${url}`;
		if (!YouTube.validURL(url)) {
			throw new Chat.ErrorMessage(`Please provide a valid YouTube link.`);
		}
		// JUST in case
		if (!recommendations.saved) recommendations.saved = [];
		const rec: Recommendation = {artist, title, url, description, tags, userData: {name: username}, likes: 0};
		if (avatar) rec.userData.avatar = avatar;
		recommendations.saved.push(rec);
		saveRecommendations();
		await this.render(room, rec);
		this.collapse(room, this.lastRecommendation);
		this.lastRecommendation = rec;
	}

	delete(artist: string, title: string) {
		artist = artist.trim();
		title = title.trim();
		if (!recommendations.saved?.length) {
			throw new Chat.ErrorMessage(`The song titled '${title}' by ${artist} isn't recommended.`);
		}
		const recIndex = recommendations.saved.findIndex(x => toID(x.title) === toID(title) && toID(x.artist) === toID(artist));
		if (recIndex < 0) {
			throw new Chat.ErrorMessage(`The song titled '${title}' by ${artist} isn't recommended.`);
		}
		recommendations.saved.splice(recIndex, 1);
		saveRecommendations();
	}

	async suggest(
		room: Room, artist: string, title: string, url: string, description: string,
		username: string, tags: string[], avatar?: string
	) {
		artist = artist.trim();
		title = title.trim();
		if (recommendations.saved.find(x => toID(x.title) === toID(title) && toID(x.artist) === toID(artist))) {
			throw new Chat.ErrorMessage(`The song titled '${title}' by ${artist} is already recommended.`);
		}
		if (recommendations.suggested.find(x => toID(x.title) === toID(title) && toID(x.artist) === toID(artist))) {
			throw new Chat.ErrorMessage(`The song titled '${title}' by ${artist} is already suggested.`);
		}
		if (!/^https?:\/\//.test(url)) url = `https://${url}`;
		if (!YouTube.validURL(url)) {
			throw new Chat.ErrorMessage(`Please provide a valid YouTube link.`);
		}
		const rec: Recommendation = {artist, title, url, description, tags, userData: {name: username}, likes: 0};
		if (avatar) rec.userData.avatar = avatar;
		recommendations.suggested.push(rec);
		saveRecommendations();
		await this.render(room, rec, true);
	}

	approveSuggestion(room: Room, artist: string, title: string) {
		artist = artist.trim();
		title = title.trim();
		const index = recommendations.suggested.findIndex(x => toID(x.artist) === toID(artist) && toID(x.title) === toID(title));
		if (index < 0) {
			throw new Chat.ErrorMessage(`There is no song titled '${title}' by ${artist} suggested.`);
		}
		const rec = recommendations.suggested[index];
		if (!recommendations.saved) recommendations.saved = [];
		recommendations.saved.push(rec);
		recommendations.suggested.splice(index, 1);
		saveRecommendations();
		this.collapse(room, rec, true);
	}

	denySuggestion(artist: string, title: string) {
		artist = artist.trim();
		title = title.trim();
		const index = recommendations.suggested.findIndex(x => toID(x.artist) === toID(artist) && toID(x.title) === toID(title));
		if (index < 0) {
			throw new Chat.ErrorMessage(`There is no song titled '${title}' by ${artist} suggested.`);
		}
		recommendations.suggested.splice(index, 1);
		saveRecommendations();
	}

	async render(room: Room, rec: Recommendation, suggested = false) {
		const videoID = YouTube.getId(rec.url);
		const videoInfo = await YouTube.getVideoInfo(videoID);
		let buf = ``;
		buf += `<div style="color:#000;background:linear-gradient(rgba(210,210,210),rgba(225,225,225))">`;
		buf += `<table style="margin:auto;background:rgba(255,255,255,0.25);padding:3px;"><tbody><tr>`;
		if (videoInfo) {
			buf += `<td style="text-align:center;"><img src="${videoInfo.thumbnail}" width="120" height="67" /><br />`;
			buf += `<small><em>${!suggested ? `${rec.likes} ${Chat.count(rec.likes, "points")}` : ``}${videoInfo.stats.views} views</em></small></td>`;
		}
		buf += Utils.html`<td style="max-width:300px"><a href="${rec.url}" style="color:#000;font-weight:bold;">${rec.artist} - ${rec.title}</a>`;
		if (rec.tags?.length) {
			buf += `<br /><strong>Tags:</strong> <em>${rec.tags.map(x => Utils.escapeHTML(x)).join(', ')}</em>`;
		}
		if (rec.description) {
			buf += `<br /><span style="display:inline-block;line-height:1.15em;"><strong>Description:</strong> ${Utils.escapeHTML(rec.description)}</span>`;
		}
		if (!videoInfo && !suggested) {
			buf += `<br /><strong>Score:</strong> ${rec.likes} ${Chat.count(rec.likes, "points")}`;
		}
		if (!rec.userData.avatar) {
			buf += `<br /><strong>Recommended by:</strong> ${rec.userData.name}`;
		}
		buf += `<hr />`;
		if (suggested) {
			buf += `<button class="button" name="send" value="/approvesuggestion ${rec.userData.name}">Approve</button> | `;
			buf += `<button class="button" name="send" value="/denysuggestion ${rec.userData.name}">Approve</button>`;
		} else {
			buf += `<button class="button" name="send" value="/likerec ${rec.artist}, ${rec.title}" style="float:right;display:inline;padding:3px 5px;font-size:8pt;">`;
			buf += `<img src="https://${Config.routes.client}/sprites/bwicons/441.png" style="margin:-9px 0 -6px -7px;" width="32" height="32" />`;
			buf += `<span style="position:relative;bottom:2.6px;">Upvote</span></button>`;
		}
		buf += `</td>`;
		if (!suggested && rec.userData.avatar) {
			buf += `<td style="text-align:center;width:110px;background:rgba(255,255,255,0.4);border-radius:15px;">`;
			const isCustom = rec.userData.avatar.startsWith('#');
			buf += `<img style="margin-bottom:-38px;" src="https://${Config.routes.client}/sprites/trainers${isCustom ? '-custom' : ''}/${isCustom ? rec.userData.avatar.slice(1) : rec.userData.avatar}.png" width="80" height="80" />`;
			buf += `<br /><span style="background:rgba(0,0,0,0.5);padding:1.5px 4px;color:white;font-size:7pt;">Recommended by:`;
			buf += `<br /><strong>${rec.userData.name}</strong></span></td>`;
		}
		buf += `</tbody></table>`;
		buf += `</div>`;
		if (!suggested) {
			room.send(`|uhtml${this.lastRecommendation ? 'change' : ''}|studiorec-${toID(rec.artist)}-${toID(rec.title)}|${buf}`);
			room.update();
		} else {
			room.sendRankedUsers(`|uhtml|studiorec-${toID(rec.artist)}-${toID(rec.title)}-suggestion|${buf}`, '%');
			room.update();
		}
		this.lastRecommendation = rec;
	}

	collapse(room: Room, rec?: Recommendation, suggested = false) {
		if (!rec) return;
		let buf = ``;
		buf += `<div style="color:#000;background:linear-gradient(rgba(210,210,210),rgba(225,225,225));">`;
		buf += `<table style="margin: auto;background:rgba(255,255,255,0.25);padding:3px"><tbody><tr>`;
		buf += `<td style="text-align:center"><a href="${rec.url}" style="color:#000;font-weight:bold">${rec.artist} - ${rec.title}</a>`;
		if (rec.tags?.length) {
			buf += `<br /><strong>Tags:</strong> <em>${rec.tags.map(x => Utils.escapeHTML(x)).join(', ')}</em>`;
		}
		buf += `<br /><strong>Recommended by: ${rec.userData.name}</strong></td></tr></tbody></table></div>`;
		if (!suggested) {
			room.send(`|uhtmlchange|studiorec-${toID(rec.artist)}-${toID(rec.title)}|${buf}`);
			room.update();
		} else {
			room.sendRankedUsers(`|uhtmlchange|studiorec-${toID(rec.artist)}-${toID(rec.title)}-suggestion|${buf}`, '%');
			room.update();
		}
	}
}

export const LastFM = new LastFMInterface();
export const Recs = new RecommendationsInterface();

export const commands: ChatCommands = {
	registerlastfm(target, room, user) {
		if (!target) return this.parse(`/help registerlastfm`);
		this.checkChat(target);
		target = this.filter(target) || '';
		if (!target) {
			throw new Chat.ErrorMessage(`The provided account name has phrases that PS doesn't allow.`);
		}
		LastFM.validateAccountName(target);
		this.sendReply(LastFM.addAccountName(user.id, target.trim()));
	},
	registerlastfmhelp: [
		`/registerlastfm [username] - Adds the provided [username] to the last.fm database for scrobbling.`,
		`Usernames can only be 2-15 characters long, must start with a letter, and can only contain letters, numbers, hyphens, and underscores.`,
	],

	async lastfm(target, room, user) {
		this.runBroadcast(true);
		this.splitTarget(target, true);
		const username = LastFM.getAccountName(target ? target : user.name);
		this.sendReplyBox(await LastFM.getLastFMData(username, this.targetUsername ? this.targetUsername : user.named ? user.name : undefined));
	},
	lastfmhelp: [
		`/lastfm [username] - Displays the last scrobbled song for the person using the command or for [username] if provided.`,
		`To link up your last.fm account, check out "/help registerlastfm".`,
	],

	async track(target, room, user) {
		if (!target) return this.parse('/help track');
		this.checkChat(target);
		const [track, artist] = this.splitOne(target);
		if (!track) return this.parse('/help track');
		this.runBroadcast(true);
		this.sendReplyBox(await LastFM.tryGetTrackData(track, artist || undefined));
	},
	trackhelp: [
		`/track [song name], [artist] - Displays the most relevant search result to the song name (and artist if specified) provided.`,
	],

	addrec: 'addrecommendation',
	async addrecommendation(target, room, user) {
		room = Recs.getRoom(this);
		this.checkCan('show', null, room);
		const [artist, title, url, description, ...tags] = target.split(target.includes('|') ? '|' : ',').map(x => x.trim());
		if (!(artist && title && url && description && tags?.length)) {
			return this.parse(`/help addrecommendation`);
		}
		// Noob proofing
		let cleansedTags = tags.map(x => x.trim()).join('|').split(',');
		await Recs.add(room, artist, title, url, description, user.name, cleansedTags, String(user.avatar));

		this.privateModAction(``);
		this.modlog(`RECOMMENDATION`, null, `added '${toID(title)}' by ${toID(artist)}`);
	},
};
