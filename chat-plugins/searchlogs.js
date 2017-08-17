/**
 * Search Logs Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Allows staff to search a room's log for a specific string of text.
 *
 * @license MIT license
 */

'use strict';

const LOGS_PATH = './logs/chat/';
const POPUP = '|popup||wide||html|';
const MAX_LINES = 1000;

class LogTools {
	search(user, room, phrase) {
		let pattern = this.escapeRegExp(phrase).replace(/\\\*/g, '.*');
		const command = `grep -Rnw '${LOGS_PATH}${room.id}' -e "${pattern}"`;

		let output = '';
		let displayedLines = 0;
		require('child_process').exec(command, (error, stdout, stderr) => {
			if (error && stderr) {
				user.send(`${POPUP}<div class="message-error">This server does not support /searchlogs.</div>`);
				return;
			}
			if (!stdout) return user.send(`${POPUP}<div class="message-error">Could not find any logs containing "${pattern}" in room "${room.title}".</div>`);
			stdout = stdout.split('\n');
			for (let i = 0; i < stdout.length; i++) {
				if (stdout[i].length < 1 || i > MAX_LINES) continue;
				const file = stdout[i].substr(0, stdout[i].indexOf(':'));
				if (file.includes('today.txt')) continue; // show result from today's roomlog only once
				let line = stdout[i].split(':');
				line.splice(0, 2);
				line = line.join(':');
				const message = this.parseMessage(line, user.userid);
				if (message.length < 1) continue;
				const displayedPath = file.replace(`${LOGS_PATH}${room.id}/`, '').replace('.txt', '');
				output += `<span style="color: #970097">${displayedPath}</span><span style="color: #00AAAA">:</span> ${message}<br />`;
				displayedLines++;
			}
			pattern = Chat.escapeHTML(pattern);
			user.send(`${POPUP}Displaying the last ${displayedLines} line${Chat.plural(displayedLines)} containing "${pattern}" in room "${room.title}":<br /><br />${output}`);
		});
	}
	escapeRegExp(string) {
		return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	}
	parseMessage(message, user) {
		const timestamp = message.substr(0, 9).trim();
		message = message.substr(9).trim();
		let lineSplit = message.split('|');
		let name = '';

		switch (lineSplit[1]) {
		case 'c':
			name = lineSplit[2];
			if (name === '~') break;
			message = Chat.html`<span class="chat"><small>[${timestamp}]</small> <small>${name.substr(0, 1)}</small>` +
				Chat.html`<strong class="username">${name.substr(1, name.length)}:</strong> ` +
				Chat.html`<em>${lineSplit.slice(3).join('|')}</em></span>`;
			break;
		case 'c:':
			name = lineSplit[3];
			if (name === '~') break;
			message = Chat.html`<span class="chat"><small>[${timestamp}]</small> <small>${name.substr(0, 1)}</small>` +
				Chat.html`<strong class="username">${name.substr(1, name.length)}:</strong> ` +
				Chat.html`<em>${lineSplit.slice(4).join('|')}</em></span>`;
			break;
		case 'j': case 'l': case 'n': case 'N':
			// do not parse these messages
			message = '';
			break;
		default:
			message = Chat.html`<span class="notice">${message}</span>`;
			break;
		}
		return message;
	}
}
const Logs = new LogTools();

exports.commands = {
	logsearch: 'searchlogs',
	searchlogs: function (target, room, user) {
		if (!target) return this.parse('/help searchlogs');

		let tarRoom = target.split('|')[0].trim();
		if (!Rooms.search(tarRoom)) return this.errorReply(`The room "${tarRoom}" does not exist.`);
		tarRoom = Rooms.search(tarRoom);

		if (!this.can('mute', null, tarRoom)) return;

		const phrase = target.split('|')[1].trim();
		if (!phrase) return this.parse('/help searchlogs');

		Logs.search(user, tarRoom, phrase);
	},
	searchlogshelp: ["/searchlogs [room] | [phrase] - Searches the logs of chatroom [room] for [phrase]. Phrase may contain * wildcards. Requires: % @ & # ~"],
};
