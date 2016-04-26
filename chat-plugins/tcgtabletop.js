/**
* TCG & Tabletop: Yugioh wiki plugin
* This is a command that allows users to search the yugioh wiki for cards. It will display the closest match with a given query, or a separate message if there isn't anything found.
* By bumbadadabum with help from ascriptmaster, codelegend and the PS development team.
*/

'use strict';

const http = require('http');

function noop() {}

function wikiaSearch(subdomain, query, callback) {
	http.get('http://' + subdomain + '.wikia.com/api/v1/Search/List/?query=' + encodeURIComponent(query) + '&limit=1', res => {
		let buffer = '';
		res.setEncoding('utf8');
		res.on('data', data => {
			buffer += data;
		});
		res.on('end', () => {
			let result;
			try {
				result = JSON.parse(buffer);
			} catch (e) {
				return callback(e);
			}
			if (!result) return callback(new Error("Malformed data"));
			if (result.exception) return callback(new Error(Tools.getString(result.exception.message) || "Not found"));
			if (!Array.isArray(result.items) || !result.items[0] || typeof result.items[0] !== 'object') return callback(new Error("Malformed data"));

			return callback(null, result.items[0]);
		});
	}).once('error', function (err) {
		this.on('error', noop);
		callback(err);
	});
}

exports.commands = {
	ygo: 'yugioh',
	yugioh: function (target, room, user) {
		if (!this.canBroadcast()) return;
		let subdomain = 'yugioh';
		let query = target.trim();

		wikiaSearch(subdomain, query, (err, data) => {
			if (!this.runBroadcast()) return;
			if (err) {
				if (err instanceof SyntaxError || err.message === 'Malformed data') {
					if (!this.broadcasting) return this.sendReply("Error: Something went wrong in the request: " + err.message);
					return room.add("Error: Something went wrong in the request: " + err.message).update();
				} else if (err.message === 'Not found') {
					if (!this.broadcasting) return this.sendReply("|raw|<div class=\"infobox\">No results found.</div>");
					return room.addRaw("<div class=\"infobox\">No results found.</div>").update();
				}
				if (!this.broadcasting) return this.sendReply("Error: " + err.message);
				return room.add("Error: " + err.message).update();
			}
			let entryUrl = Tools.getString(data.url);
			let entryTitle = Tools.getString(data.title);
			let htmlReply = "<strong>Best result for " + Tools.escapeHTML(query) + ":</strong><br/><a href=\"" + Tools.escapeHTML(entryUrl) + "\">" + Tools.escapeHTML(entryTitle) + "</a>";
			if (!this.broadcasting) return this.sendReply("|raw|<div class=\"infobox\">" + htmlReply + "</div>");
			room.addRaw("<div class=\"infobox\">" + htmlReply + "</div>").update();
		});
	},
};
