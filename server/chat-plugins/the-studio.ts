import {FS} from '../../lib/fs';
import {Net} from '../../lib/net';
import { YouTube } from './youtube';

const LASTFM_DB = 'config/chat-plugins/lastfm.json';
const RECOMMENDATIONS = 'config/chat-plugins/the_studio.json';
const API_ROOT = 'http://ws.audioscrobbler.com/2.0/';

interface Recommendation {
	[userid: string]: {
		artist: string;
		title: string;
		url: string;
		description: string;
		tags: string[];
	};
}

interface LastFMEntry {

}

const lastfm: {[k: string]: string} = JSON.parse(FS(LASTFM_DB).readIfExistsSync() || "{}");
const recommendations: Recommendation = JSON.parse(FS(RECOMMENDATIONS).readIfExistsSync() || "{}");

function saveLastFM() {
	FS(LASTFM_DB).writeUpdate(() => JSON.stringify(lastfm));
}
function saveRecommendations() {
	FS(LASTFM_DB).writeUpdate(() => JSON.stringify(recommendations));
}

export class LastFMInterface {
	readonly data: {[k: string]: string};
	constructor(data?: {[k: string]: string}) {
		this.data = data ? data : {};
	}
	async getLastFMData(username: string) {
		const userid = toID(username);
		if (!Config.lastfmkey) {
			throw new Chat.ErrorMessage(`This server does not support last.fm commands. If you're the owner, you can enable them by setting up Config.lastfmkey.`);
		}
		const accountName = (lastfm[userid] || username).replace(/ /g, '_');
		const url = `${API_ROOT}?method=user.getrecenttracks&user=${accountName}&limit=1&api_key=${Config.lastfmkey}&format=json`;
		const raw = await Net(url).get();
		const res = JSON.parse(raw);
		if (!res?.recenttracks?.track?.length) throw new Chat.ErrorMessage(`Last.fm account not found.`);
		const track = res.recenttracks.track[0];
		let buf = `<table><tr>`;
		if (track.image?.length) {
			const imageIndex = track.image.length >= 3 ? 2 : track.image.length - 1;
			if (track.image[imageIndex]['#text']) {
				buf += `<td style="padding-right:5px" rowspan="2"><img src="${track.image[imageIndex]['#text']}" width="75" height="75" /></td>`;
			}
			buf += `<td><strong><a href="https://www.last.fm/user/${accountName}">${accountName}</a></strong>`;
			if (track['@attr']?.nowplaying) {
				buf += ` is currently listening to:`;
			} else {
				buf += ` was last seen listening to:`;
			}
			buf += `</td></tr><tr><td>`;
			const trackName = `${track.artist?.['#text'] ? `${track.artist?.['#text']} - ` : ''}${track.name}`;
			buf += trackName;
			// const videoID = await YouTube.runVideoSearch - not done
		}
	}
}

export const commands: ChatCommands = {};
