/**
 * GitHub Alert Notifications
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This notifies a set of rooms of changes to specific repositor(y/ies).
 *
 * Much of this comes from Ecuacion's bot, which is based on xfix's bot,
 * and jd who originally converted this to PS server-side.
 *
 * @license MIT license
 */

'use strict';

let gitConfig = {};

if (!Config.github) {
	return;
} else if (Config.github === {}) {
	gitConfig.port = 3420;
	gitConfig.secret = "";
} else {
	gitConfig = {
		port: Config.github.port,
		secret: Config.github.secret,
	};
}

const git = exports.github = require('githubhook')(gitConfig);

let updates = {};
let targetRooms = (Config.github.rooms && Config.github.rooms.length) ? Config.github.rooms : ['development'];
targetRooms = targetRooms.map(toId);
let gitBans = {};

let sendReport = function (html) {
	for (let curRoom of targetRooms) {
		let room = Rooms(curRoom);
		if (room) room.add(`|html|<div class="infobox">${html}</div>`).update();
	}
};

git.on('push', (repo, ref, result) => {
	let url = result.compare;
	let branch = /[^/]+$/.exec(ref)[0];
	let messages = [];
	let message = "";
	message += `[<font color='FF00FF'>${Chat.escapeHTML(repo)}</font>] `;
	message += `<font color='909090'>${Chat.escapeHTML(result.pusher.name)}</font> `;
	message += (result.forced ? '<font color="red">force-pushed</font>' : 'pushed') + " ";
	message += `<b>${Chat.escapeHTML(result.commits.length)}</b> `;
	message += `new commit${(result.commits.length === 1 ? '' : 's')} to `;
	message += `<font color='800080'>${Chat.escapeHTML(branch)}</font>: `;
	message += `<a href="${Chat.escapeHTML(url)}">View &amp; compare</a>`;
	messages.push(message);
	result.commits.forEach(function (commit) {
		let commitMessage = commit.message;
		let shortCommit = /.+/.exec(commitMessage)[0];
		message = "";
		message += `<font color='FF00FF'>${Chat.escapeHTML(repo)}</font>/`;
		message += Chat.html`<font color='800080'>${branch}</font> `;
		message += Chat.html`<a href="${commit.url}">`;
		message += Chat.html`<font color='606060'>${commit.id.substring(0, 6)}</font></a> `;
		message += Chat.html`<font color='909090'>${commit.author.name}</font>: ${shortCommit}`;
		if (commitMessage !== shortCommit) message += '&hellip;';
		messages.push(message);
	});
	sendReport(messages.join('<br />'));
});

git.on('pull_request', function pullRequest(repo, ref, result) {
	let COOLDOWN = 10 * 60 * 1000;
	let requestUsername = toId(result.sender.login);
	if (requestUsername in gitBans) return;
	let requestNumber = result.pull_request.number;
	let url = result.pull_request.html_url;
	let action = result.action;
	if (!updates[repo]) updates[repo] = {};
	if (action === 'synchronize') {
		action = 'updated';
	}
	if (action === 'labeled' || action === 'unlabeled') {
		// Nobody cares about labels
		return;
	}
	let now = Date.now();
	if (updates[repo][requestNumber] && updates[repo][requestNumber] + COOLDOWN > now) {
		return;
	}
	updates[repo][requestNumber] = now;
	let message = "";
	message += `[<font color='FF00FF'>${repo}</font>] `;
	message += `<font color='909090'>${result.sender.login}</font> `;
	message += `${action} pull request <a href=\"${url}\">#${requestNumber}</a>: `;
	message += result.pull_request.title;
	sendReport(message);
});

git.listen();

exports.commands = {
	'gb': 'gitban',
	gitban: function (target, room, user, connection, cmd) {
		if (!targetRooms.some(curRoom => toId(room) === curRoom)) return this.sendReply(`|html|<div class="message-error">The command "/${cmd}" does not exist. To send a message starting with "/${cmd}", type "//${cmd}".</div>`);
		if (!this.can('ban', null, room)) return false;
		if (!target) return this.parse('/help gitban');
		target = target.trim();
		if (gitBans[toId(target)]) return this.errorReply(`The Github Username '${target} already exists on the Github Alert Blacklist.'`);
		gitBans[toId(target)] = 1;
		this.addModCommand(`${target} was added to Github Alert Blacklist by ${user.name}.`);
		this.sendReply(`The Github username '${target}' was successfully added to the Github Alert Blacklist.`);
	},
	'gitbanhelp': ["/gitban <github username>: Makes the Github Plugin ignore the github username's alerts. Requires: @ # & ~"],

	'gub': 'gitunban',
	gitunban: function (target, room, user, connection, cmd) {
		if (!targetRooms.some(curRoom => toId(room) === curRoom)) return this.sendReply(`|html|<div class="message-error">The command "/${cmd}" does not exist. To send a message starting with "/${cmd}", type "//${cmd}".</div>`);
		if (!this.can('ban', null, room)) return false;
		if (!target) return this.parse('/help gitunban');
		target = target.trim();
		if (!gitBans[toId(target)]) return this.errorReply(`The Github Username '${target} does not exist on the Github Alert Blacklist.'`);
		delete gitBans[toId(target)];
		this.addModCommand(`${target} was removed from the Github Alert Blacklist by ${user.name}.`);
		this.sendReply(`The Github username '${target}' was successfully removed from the Github Alert Blacklist.`);
	},
	'gitunbanhelp': ["/gitunban <github username>: Removes the Github Username from Github Alert Blacklist. Requires: @ # & ~"],
};
