/**
* TCG & Tabletop: Yugioh wiki plugin
* This is a command that allows users to search the yugioh wiki for cards. It will display the closest match with a given query, or a separate message if there isn't anything found.
* By bumbadadabum with help from ascriptmaster, codelegend and the PS development team.
*/

'use strict';

const https = require('https');
const querystring = require('querystring');

const SEARCH_PATH = '/api/v1/Search/List/';
const DETAILS_PATH = '/api/v1/Articles/Details/';

async function getFandom(site, pathName, search) {
	const reqOpts = {
		hostname: `${site}.fandom.com`,
		method: 'GET',
		path: `${pathName}?${querystring.stringify(search)}`,
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const body = await new Promise((resolve, reject) => {
		https.request(reqOpts, res => {
			if (!(res.statusCode >= 200 && res.statusCode < 300)) return reject(new Error(`Not found.`));
			const body = [];
			res.setEncoding('utf8');
			res.on('data', chunk => body.push(chunk));
			res.on('end', () => resolve(body.join('')));
		}).on('error', reject).setTimeout(5000).end();
	});

	const json = JSON.parse(body);
	if (!json) throw new Error(`Malformed data`);
	if (json.exception) throw new Error(Dex.getString(json.exception.message) || `Not found`);
	return json;
}

async function searchFandom(site, query) {
	const result = await getFandom(site, SEARCH_PATH, {query, limit: 1});
	if (!Array.isArray(result.items) || !result.items.length) throw new Error(`Malformed data`);
	if (!result.items[0] || typeof result.items[0] !== 'object') throw new Error(`Malformed data`);
	return result.items[0];
}

async function getCardDetails(site, id) {
	const result = await getFandom(site, DETAILS_PATH, {ids: id, abstract: 0, width: 80, height: 115});
	if (typeof result.items !== 'object' || !result.items[id] || typeof result.items[id] !== 'object') {
		throw new Error(`Malformed data`);
	}
	return result.items[id];
}

exports.commands = {
	ygo: 'yugioh',
	yugioh(target, room, user) {
		if (!this.canBroadcast()) return;
		if (room.roomid !== 'tcgtabletop') return this.errorReply("This command can only be used in the TCG & Tabletop room.");
		let subdomain = 'yugioh';
		let query = target.trim();
		if (!query) return this.parse('/help yugioh');

		return searchFandom(subdomain, query).then(data => {
			if (!this.runBroadcast()) return;
			let entryUrl = Dex.getString(data.url);
			let entryTitle = Dex.getString(data.title);
			let id = Dex.getString(data.id);
			let htmlReply = Chat.html`<strong>Best result for ${query}:</strong><br /><a href="${entryUrl}">${entryTitle}</a>`;
			if (id) {
				getCardDetails(subdomain, id).then(card => {
					let thumb = Dex.getString(card.thumbnail);
					if (thumb) {
						htmlReply = `<table><tr><td style="padding-right:5px;"><img src="${Chat.escapeHTML(thumb)}" width=80 height=115></td><td>${htmlReply}</td></tr></table>`;
					}
					if (!this.broadcasting) return this.sendReply(`|raw|<div class="infobox">${htmlReply}</div>`);
					room.addRaw(`<div class="infobox">${htmlReply}</div>`).update();
				}, () => {
					if (!this.broadcasting) return this.sendReply(`|raw|<div class="infobox">${htmlReply}</div>`);
					room.addRaw(`<div class="infobox">${htmlReply}</div>`).update();
				});
			} else {
				if (!this.broadcasting) return this.sendReply(`|raw|<div class="infobox">${htmlReply}</div>`);
				room.addRaw(`<div class="infobox">${htmlReply}</div>`).update();
			}
		}, err => {
			if (!this.runBroadcast()) return;

			if (err instanceof SyntaxError || err.message === 'Malformed data') {
				if (!this.broadcasting) return this.sendReply(`Error: Something went wrong in the request: ${err.message}`);
				return room.add(`Error: Something went wrong in the request: ${err.message}`).update();
			} else if (err.message === 'Not found') {
				if (!this.broadcasting) return this.sendReply('|raw|<div class="infobox">No results found.</div>');
				return room.addRaw('<div class="infobox">No results found.</div>').update();
			} else if (err.code === "ENOTFOUND") {
				if (!this.broadcasting) return this.sendReply("Error connecting to the yugioh wiki.");
				return room.add("Error connecting to the yugioh wiki.").update();
			}
			if (!this.broadcasting) return this.sendReply(`Error: ${err.message}`);
			return room.add(`Error: ${err.message}`).update();
		});
	},
	yugiohhelp: [`/yugioh [query] - Search the Yugioh wiki.`],
};
