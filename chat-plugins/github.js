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

let sendReport = function (html) {
	if (Config.github && Config.github.rooms && Config.github.rooms !== []) {
		for (let curRoom of Config.github.rooms) {
			let room = Rooms(curRoom);
			if (room) room.add(`|html|<div class="infobox">${html}</div>`).update();
		}
	} else if (Rooms('development')) {
		Rooms('development').add(`|html|<div class="infobox">${html}</div>`).update();
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
		if (commitMessage !== shortCommit) {
			shortCommit += '&hellip;';
		}
		message = "";
		message += `<font color='FF00FF'>${Chat.escapeHTML(repo)}</font>/`;
		message += Chat.html`<font color='800080'>${branch}</font> `;
		message += Chat.html`<a href="${commit.url}">`;
		message += Chat.html`<font color='606060'>${commit.id.substring(0, 6)}</font></a> `;
		message += Chat.html`<font color='909090'>${commit.author.name}</font>: ${shortCommit}`;
		messages.push(message);
	});
	sendReport(messages.join('<br />'));
});

git.on('pull_request', function pullRequest(repo, ref, result) {
	let COOLDOWN = 10 * 60 * 1000;
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
