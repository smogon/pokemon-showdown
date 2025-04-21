/**
 * Chat plugin to view GitHub events in a chatroom.
 * By Mia, with design / html from xfix's original bot, https://github.com/xfix/GitHub-Bot-Legacy/
 * @author mia-pi-git
 */

import { FS, Utils } from '../../lib';

const STAFF_REPOS = Config.staffrepos || [
	'pokemon-showdown', 'pokemon-showdown-client', 'Pokemon-Showdown-Dex', 'pokemon-showdown-loginserver',
];
const COOLDOWN = 10 * 60 * 1000;

export const gitData: GitData = JSON.parse(FS("config/chat-plugins/github.json").readIfExistsSync() || "{}");

interface GitHookHandler {
	on(event: 'pull_request', callback: (repo: string, ref: string | undefined, result: PullRequest) => void): void;
	on(event: 'push', callback: (repo: string, ref: string, result: Push) => void): void;
	on(event: string, callback: (repo: string, ref: string | undefined, result: any) => void): void;
	listen(): void;
	server: import('http').Server;
}

interface Push {
	commits: Commit[];
	sender: { login: string };
	compare: string;
}

interface PullRequest {
	action: string;
	number: number;
	pull_request: {
		url: string,
		html_url: string,
		title: string,
		user: {
			login: string,
			html_url: string,
		},
		merge_commit_sha: string,
	};
	sender: { login: string };
}

interface Commit {
	id: string;
	message: string;
	author: { name: string, avatar_url: string };
	url: string;
}

interface GitData {
	usernames?: { [username: string]: string };
	bans?: { [username: string]: string };
}

export const GitHub = new class {
	readonly hook: GitHookHandler | null = null;
	updates: { [k: string]: number } = Object.create(null);
	constructor() {
		// config.github: https://github.com/nlf/node-github-hook#readme
		if (!Config.github) return;

		try {
			this.hook = require('githubhook')({
				logger: {
					log: (line: string) => Monitor.debug(line),
					error: (line: string) => Monitor.notice(line),
				},
				...Config.github,
			});
		} catch (err) {
			Monitor.crashlog(err, "GitHub hook");
		}
		this.listen();
	}
	listen() {
		if (!this.hook) return;
		this.hook.listen();
		this.hook.on('push', (repo, ref, result) => this.handlePush(repo, ref, result));
		this.hook.on('pull_request', (repo, ref, result) => this.handlePull(repo, ref, result));
	}
	private getRepoName(repo: string) {
		switch (repo) {
		case 'pokemon-showdown':
			return 'server';
		case 'pokemon-showdown-client':
			return 'client';
		case 'Pokemon-Showdown-Dex':
			return 'dex';
		default:
			return repo.toLowerCase();
		}
	}
	handlePush(repo: string, ref: string, result: Push) {
		const branch = /[^/]+$/.exec(ref)?.[0] || "";
		if (branch !== 'master') return;
		const messages: { [k: string]: string[] } = {
			staff: [],
			development: [],
		};
		for (const commit of result.commits) {
			const { message, url } = commit;
			const [shortMessage] = message.split('\n\n');
			const username = this.getUsername(commit.author.name);
			const repoName = this.getRepoName(repo);
			const id = commit.id.substring(0, 6);
			messages.development.push(
				Utils.html`[<span style="color:#FF00FF">${repoName}</span>] <a href="${url}" style="color:#606060">${id}</a> ${shortMessage} <span style="color:#909090">(${username})</span>`
			);
			messages.staff.push(Utils.html`[<span style="color:#FF00FF">${repoName}</span>] <a href="${url}">${shortMessage}</a> <span style="color:#909090">(${username})</span>`);
		}
		for (const k in messages) {
			this.report(k as RoomID, repo, messages[k as RoomID]);
		}
	}
	handlePull(repo: string, ref: string | undefined, result: PullRequest) {
		if (this.isRateLimited(result.number)) return;
		if (this.isGitbanned(result)) return;
		const url = result.pull_request.html_url;
		const action = this.isValidAction(result.action);
		if (!action) return;
		const repoName = this.getRepoName(repo);
		const userName = this.getUsername(result.sender.login);
		const title = result.pull_request.title;
		let buf = Utils.html`[<span style="color:#FF00FF">${repoName}</span>] <span style="color:#909090">${userName}</span> `;
		buf += Utils.html`${action} <a href="${url}">PR#${result.number}</a>: ${title}`;
		this.report('development', repo, buf);
	}
	report(roomid: RoomID, repo: string, messages: string[] | string) {
		if (!STAFF_REPOS.includes(repo) && roomid === 'staff') return;
		if (Array.isArray(messages)) messages = messages.join('<br />');
		Rooms.get(roomid)?.add(`|c| GitHub|/raw <div class="infobox">${messages}</div>`).update();
	}
	isGitbanned(result: PullRequest) {
		if (!gitData.bans) return false;
		return gitData.bans[result.sender.login] || gitData.bans[result.pull_request.user.login];
	}
	isRateLimited(prNumber: number) {
		if (this.updates[prNumber]) {
			if (this.updates[prNumber] + COOLDOWN > Date.now()) return true;
			this.updates[prNumber] = Date.now();
			return false;
		}
		this.updates[prNumber] = Date.now();
		return false;
	}
	isValidAction(action: string) {
		if (action === 'synchronize') return 'updated';
		if (action === 'review_requested') {
			return 'requested a review for';
		} else if (action === 'review_request_removed') {
			return 'removed a review request for';
		}
		if (['ready_for_review', 'labeled', 'unlabeled', 'converted_to_draft'].includes(action)) {
			return null;
		}
		return action;
	}
	getUsername(name: string) {
		return gitData.usernames?.[toID(name)] || name;
	}
	save() {
		FS("config/chat-plugins/github.json").writeUpdate(() => JSON.stringify(gitData));
	}
};

export const commands: Chat.ChatCommands = {
	gh: 'github',
	github: {
		''() {
			return this.parse('/help github');
		},
		ban(target, room, user) {
			room = this.requireRoom('development');
			this.checkCan('mute', null, room);
			const [username, reason] = Utils.splitFirst(target, ',').map(u => u.trim());
			if (!toID(target)) return this.parse(`/help github`);
			if (!toID(username)) throw new Chat.ErrorMessage("Provide a username.");
			if (room.auth.has(toID(GitHub.getUsername(username)))) {
				throw new Chat.ErrorMessage("That user is Dev roomauth. If you need to do this, demote them and try again.");
			}
			if (!gitData.bans) gitData.bans = {};
			if (gitData.bans[toID(username)]) {
				throw new Chat.ErrorMessage(`${username} is already gitbanned.`);
			}
			gitData.bans[toID(username)] = reason || " "; // to ensure it's truthy
			GitHub.save();
			this.privateModAction(`${user.name} banned the GitHub user ${username} from having their GitHub actions reported to this server.`);
			this.modlog('GITHUB BAN', username, reason);
		},
		unban(target, room, user) {
			room = this.requireRoom('development');
			this.checkCan('mute', null, room);
			target = toID(target);
			if (!target) return this.parse('/help github');
			if (!gitData.bans?.[target]) throw new Chat.ErrorMessage("That user is not gitbanned.");
			delete gitData.bans[target];
			if (!Object.keys(gitData.bans).length) delete gitData.bans;
			GitHub.save();
			this.privateModAction(`${user.name} allowed the GitHub user ${target} to have their GitHub actions reported to this server.`);
			this.modlog('GITHUB UNBAN', target);
		},
		bans() {
			const room = this.requireRoom('development');
			this.checkCan('mute', null, room);
			return this.parse('/j view-github-bans');
		},
		setname: 'addusername',
		addusername(target, room, user) {
			room = this.requireRoom('development');
			this.checkCan('mute', null, room);
			const [gitName, username] = Utils.splitFirst(target, ',').map(u => u.trim());
			if (!toID(gitName) || !toID(username)) return this.parse(`/help github`);
			if (!gitData.usernames) gitData.usernames = {};
			gitData.usernames[toID(gitName)] = username;
			GitHub.save();
			this.privateModAction(`${user.name} set ${gitName}'s name on reported GitHub actions to be ${username}.`);
			this.modlog('GITHUB SETNAME', null, `'${gitName}' to '${username}'`);
		},
		clearname: 'removeusername',
		removeusername(target, room, user) {
			room = this.requireRoom('development');
			this.checkCan('mute', null, room);
			target = toID(target);
			if (!target) return this.parse(`/help github`);
			const name = gitData.usernames?.[target];
			if (!name) throw new Chat.ErrorMessage(`${target} is not a GitHub username on our list.`);
			delete gitData.usernames?.[target];
			if (!Object.keys(gitData.usernames || {}).length) delete gitData.usernames;
			GitHub.save();
			this.privateModAction(`${user.name} removed ${target}'s name from the GitHub username list.`);
			this.modlog('GITHUB CLEARNAME', target, `from the name ${name}`);
		},
		names() {
			return this.parse('/j view-github-names');
		},
	},
	githubhelp: [
		`/github ban [username], [reason] - Bans a GitHub user from having their GitHub actions reported to Dev room. Requires: % @ # ~`,
		`/github unban [username] - Unbans a GitHub user from having their GitHub actions reported to Dev room. Requires: % @ # ~`,
		`/github bans - Lists all GitHub users that are currently gitbanned. Requires: % @ # ~`,
		`/github setname [username], [name] - Sets a GitHub user's name on reported GitHub actions to be [name]. Requires: % @ # ~`,
		`/github clearname [username] - Removes a GitHub user's name from the GitHub username list. Requires: % @ # ~`,
		`/github names - Lists all GitHub usernames that are currently on our list.`,
	],
};

export const pages: Chat.PageTable = {
	github: {
		bans(query, user) {
			const room = Rooms.get('development');
			if (!room) throw new Chat.ErrorMessage("No Development room found.");
			this.checkCan('mute', null, room);
			if (!gitData.bans) throw new Chat.ErrorMessage("There are no gitbans at this time.");
			let buf = `<div class="pad"><h2>Current Gitbans:</h2><hr /><ol>`;
			for (const [username, reason] of Object.entries(gitData.bans)) {
				buf += `<li><strong>${username}</strong> - ${reason.trim() || '(No reason found)'}</li>`;
			}
			buf += `</ol>`;
			return buf;
		},
		names() {
			if (!gitData.usernames) throw new Chat.ErrorMessage("There are no GitHub usernames in the list.");
			let buf = `<div class="pad"><h2>Current GitHub username mappings:</h2><hr /><ol>`;
			for (const [username, name] of Object.entries(gitData.usernames)) {
				buf += `<li><strong>${username}</strong> - ${name}</li>`;
			}
			buf += `</ol>`;
			return buf;
		},
	},
};

export function destroy() {
	GitHub.hook?.server.close();
}
