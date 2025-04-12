/******************************************
* Pokemon Showdown Anime & Manga Commands *
* author: @Prince Sky                     *
* Html By: @TurboRx                       *
*******************************************/

import { FS } from '../lib/fs';

interface JikanAnime {
	mal_id: number;
	title: string;
	title_english: string | null;
	episodes: number | null;
	status: string | null;
	genres: { name: string; }[];
	synopsis: string | null;
	images: { jpg: { image_url: string; }; };
	rating: string | null;
	aired?: { from: string; };
}

interface JikanManga {
	mal_id: number;
	title: string;
	title_english: string | null;
	chapters: number | null;
	volumes: number | null;
	status: string | null;
	genres: { name: string; }[];
	synopsis: string | null;
	images: { jpg: { image_url: string; }; };
	rating: string | null;
}

const adultRatings = ['Rx - Hentai', 'R+ - Mild Nudity', 'R - 17+ (Violence & Profanity)'];

async function fetchJikanData<T>(type: 'anime' | 'manga', query?: string): Promise<T[]> {
	try {
		const endpoint = query ? `https://api.jikan.moe/v4/${type}?q=${encodeURIComponent(query)}&limit=1`: `https://api.jikan.moe/v4/seasons/upcoming`;
		const response = await fetch(endpoint);
		const data = await response.json();
		if (!data.data?.length) {
			console.log(`No ${type} found${query ? ` for '${query}'` : ''} on Jikan.`);
			return [];
		}
		return query ? data.data : data.data.slice(0, 5);
	} catch (error) {
		console.error(`Error fetching ${type} from Jikan API:`, error);
		return [];
	}
}

function createDisplayBox(info: JikanAnime | JikanManga, type: 'anime' | 'manga', truncateLength = 500): string {
	if (info.rating && adultRatings.includes(info.rating)) {
		return `Warning: The ${type} '${Chat.escapeHTML(info.title)}' may contain mature content (rated ${Chat.escapeHTML(info.rating)}). Viewer discretion is advised.`;
	}
	let html = `<div style="display: flex; border: 1px solid #ccc; border-radius: 5px; padding: 5px; margin: 5px; overflow: hidden;">`;
	if (info.images?.jpg?.image_url) {
		html += `<div style="flex: 0 0 auto; margin-right: 10px;">` +
			`<img src="${Chat.escapeHTML(info.images.jpg.image_url)}" alt="Cover Image" style="width: 100px; height: 150px;"></div>`;
	}
	html += `<div style="flex: 1 1 auto; font-size: 0.9em;">` +
		`<strong>${Chat.escapeHTML(info.title)}${info.title_english ? ` / ${Chat.escapeHTML(info.title_english)}` : ''}</strong><br>` +
		`<strong>Status:</strong> ${Chat.escapeHTML(info.status || 'N/A')}<br>`;
	if (type === 'anime') {
		html += `<strong>Episodes:</strong> ${(info as JikanAnime).episodes || 'N/A'}<br>`;
		if ((info as JikanAnime).aired?.from) {
			html += `<strong>Release Date:</strong> ${new Date((info as JikanAnime).aired.from).toLocaleDateString()}<br>`;
		}
	} else {
		html += `<strong>Chapters:</strong> ${(info as JikanManga).chapters || 'N/A'}<br>` +
			`<strong>Volumes:</strong> ${(info as JikanManga).volumes || 'N/A'}<br>`;
	}
	if (info.genres?.length) {
		html += `<strong>Genres:</strong> ${info.genres.map(g => Chat.escapeHTML(g.name)).join(', ')}<br>`;
	}
	if (info.synopsis) {
		const truncated = info.synopsis.length > truncateLength;
		html += `<strong>Synopsis:</strong> ${Chat.escapeHTML(info.synopsis.slice(0, truncateLength))}${truncated ? '... ' : ''}` +
			`${truncated ? `<a href="https://myanimelist.net/${type}/${info.mal_id}" target="_blank">Read more</a>` : ''}<br>`;
	}
	html += `<a href="https://myanimelist.net/${type}/${info.mal_id}" target="_blank" style="text-decoration: none;">View on MyAnimeList</a></div></div>`;
	return html;
}

export const commands: Chat.ChatCommands = {
	async anime(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.sendReply('Usage: /anime [anime name]');
		const [animeInfo] = await fetchJikanData<JikanAnime>('anime', target.trim());
		this.sendReplyBox(animeInfo ? createDisplayBox(animeInfo, 'anime') : `No information found for '${Chat.escapeHTML(target)}'`);
	},
	
	async manga(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.sendReply('Usage: /manga [manga name]');
		const [mangaInfo] = await fetchJikanData<JikanManga>('manga', target.trim());
		this.sendReplyBox(mangaInfo ? createDisplayBox(mangaInfo, 'manga') : `No manga information found for '${Chat.escapeHTML(target)}'`);
	},
	
	async upcominganime(target, room, user) {
		if (!this.runBroadcast()) return;
		const genreQuery = target.trim().toLowerCase();
		const upcomingAnime = await fetchJikanData<JikanAnime>('anime');
		if (!upcomingAnime.length) return this.sendReplyBox('No upcoming anime found.');
		
		const filteredAnime = genreQuery ? 
			upcomingAnime.filter(anime => anime.genres.some(g => g.name.toLowerCase() === genreQuery)) : 
			upcomingAnime;
		if (!filteredAnime.length) {
			return this.sendReplyBox(`No upcoming anime found with genre "${Chat.escapeHTML(genreQuery)}".`);
		}
		let html = `<div style="max-height: 350px; overflow-y: auto; border: 1px solid #ccc; border-radius: 5px; padding: 10px;">` +
			`<strong>Top Upcoming Anime${genreQuery ? ` in "${Chat.escapeHTML(genreQuery)}"` : ''}:</strong><br>`;
		html += filteredAnime.map((anime, i) => 
			createDisplayBox(anime, 'anime', 200) + 
			(i < filteredAnime.length - 1 ? '<hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0;">' : '')
										 ).join('');
		html += '</div>';
		this.sendReplyBox(html);
	},
};
