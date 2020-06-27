/**
 * Plugin to notify
 */
// @ts-ignore
import * as githubhook from 'githubhook';

const rooms: RoomID[] = ['staff', 'upperstaff', 'development'];
const repos: {[k: string]: string} = {
	'pokemon-showdown': 'server',
	'pokemon-showdown-client': 'client',
	'Pokemon-Showdown-Dex': 'dex',
}
const cooldown = 10 * 60 * 60 * 1000;
const github = githubhook({
	port: Config.port,
	secret: Config.github,
	logger: console,
});


interface Result {
	commits: {[k: string]: string}[],
	pusher: {
		name: string,
	}
	action: string,
	sender: {
		login: string,
	}
	pull_request: {
		number: number,
		html_url: string,
		title: string,
	}
}

export const GithubParser = new class {
	pushes: AnyObject;
	constructor() {
		this.pushes = {};
	}
	shouldShow(id: string): boolean {
		if (!this.pushes[id]) return true;
		// @ts-ignore
		if (Rooms.get('development')?.settings.gitbans?.includes(id)) return false;
		if (Date.now() - this.pushes[id] < cooldown) return true;
		return false;
	}
	report(html: string) {
		Rooms.global.notifyRooms(rooms, `|c| github|/html <div class="infobox">${html}</div>`);
	}
	push(repo: string, ref: string, result: Result) {
		this.report(`${repo}: ${ref}: \n${result}`);
	}
	pull(repo: string, ref: string, result: Result) {
		this.report(`${repo}: ${ref}: \n${result}`);
	}
}

github.on(
	'push',
	(repo: string, ref: string, result: Result) => {
		return GithubParser.push(repo, ref, result)
	}
);

github.on(
	'pull_request',
	(repo: string, ref: string, result: Result) => {
		return GithubParser.pull(repo, ref, result)
	}
);

export const commands: ChatCommands = {
	gitban(target, room, user) {
		if (room.roomid !== 'development') return this.errorReply(`This command can only be used in the Development room.`);
		// @ts-ignore
		let bans: string[] = room.settings.gitbans;
		if (!bans) bans = [];
		if (bans.includes(toID(target))) {
			return this.errorReply(`${target} is already banned from being reported by the GitHub plugin.`);
		}
		bans.push(toID(target));
		room.saveSettings();
		this.privateModAction(`(${user.name} prevented ${target} from being reported by the plugin.)`);
		return this.modlog('GITBAN', null, target);
	},
};
