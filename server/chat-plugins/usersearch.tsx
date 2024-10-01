import {Utils, FS} from '../../lib';

export const nameList = new Set<string>(JSON.parse(
	FS('config/chat-plugins/usersearch.json').readIfExistsSync() || "[]"
));

const ONLINE_SYMBOL = ` \u25C9 `;
const OFFLINE_SYMBOL = ` \u25CC `;

class PunishmentHTML extends Chat.JSX.Component<{userid: ID, target: string}> {
	render() {
		const {userid, target} = {...this.props};
		const buf = [];
		for (const cmdName of ['Forcerename', 'Namelock', 'Weeknamelock']) {
			// We have to use dangerouslySetInnerHTML here because otherwise the `value`
			// property of the button tag is auto escaped, making &#10; into &amp;#10;
			buf.push(<span dangerouslySetInnerHTML={
				{
					__html: `<button class="button" name="send" value="/msgroom staff,/${toID(cmdName)} ${userid}` +
					`&#10;/uspage ${target}">${cmdName}</button>`,
				}
			} />);
		}
		return buf;
	}
}

class SearchUsernames extends Chat.JSX.Component<{target: string, page?: boolean}> {
	render() {
		const {target, page} = {...this.props};
		const results: {offline: string[], online: string[]} = {
			offline: [],
			online: [],
		};
		for (const curUser of Users.users.values()) {
			if (!curUser.id.includes(target) || curUser.id.startsWith('guest')) continue;
			if (Punishments.isGlobalBanned(curUser)) continue;
			if (curUser.connected) {
				results.online.push(`${!page ? ONLINE_SYMBOL : ''} ${curUser.name}`);
			} else {
				results.offline.push(`${!page ? OFFLINE_SYMBOL : ''} ${curUser.name}`);
			}
		}
		for (const k in results) {
			Utils.sortBy(results[k as keyof typeof results], result => toID(result));
		}
		if (!page) {
			return <>
				Users with a name matching '{target}':<br />
				{!results.offline.length && !results.online.length ?
					<>No users found.</> : <>
						{results.online.join('; ')}
						{!!results.offline.length &&
							<>{!!results.online.length && <><br /><br /></>}{results.offline.join('; ')}</>}
					</>
				}
			</>;
		}
		return <div class="pad">
			<h2>Usernames containing "{target}"</h2>
			{!results.online.length && !results.offline.length ?
				<p>No results found.</p> :
				<>{!!results.online.length && <div class="ladder pad">
					<h3>Online users</h3>
					<table>
						<tr>
							<th>Username</th>
							<th>Punish</th>
						</tr>
						{(() => {
							const online = [];
							for (const username of results.online) {
								online.push(<tr>
									<td><username>{username}</username></td>
									<td><PunishmentHTML userid={toID(username)} target={target} /></td>
								</tr>);
							}
							return online;
						})()}
					</table>
				</div>}
				{!!(results.online.length && results.offline.length) && <hr />}
				{!!results.offline.length && <div class="ladder pad">
					<h3>Offline users</h3>
					<table>
						<tr>
							<th>Username</th>
							<th>Punish</th>
						</tr>
						{(() => {
							const offline = [];
							for (const username of results.offline) {
								offline.push(<tr>
									<td><username>{username}</username></td>
									<td><PunishmentHTML userid={toID(username)} target={target} /></td>
								</tr>);
							}
							return offline;
						})()}
					</table>
				</div>}</>
			}
		</div>;
	}
}

function saveNames() {
	FS('config/chat-plugins/usersearch.json').writeUpdate(() => JSON.stringify([...nameList]));
}

export const commands: Chat.ChatCommands = {
	us: 'usersearch',
	uspage: 'usersearch',
	usersearchpage: 'usersearch',
	usersearch(target, room, user, connection, cmd) {
		this.checkCan('lock');
		target = toID(target);
		if (!target) { // just join directly if it's the page cmd, they're likely looking for the full list
			if (cmd.includes('page')) return this.parse(`/j view-usersearch`);
			return this.parse(`/help usersearch`);
		}
		if (target.length < 3) {
			throw new Chat.ErrorMessage(`That's too short of a term to search for.`);
		}
		const showPage = cmd.includes('page');
		if (showPage) {
			this.parse(`/j view-usersearch-${target}`);
			return;
		}
		return this.sendReplyBox(<SearchUsernames target={target} />);
	},
	usersearchhelp: [
		`/usersearch [pattern]: Looks for all names matching the [pattern]. Requires: % @ ~`,
		`Adding "page" to the end of the command, i.e. /usersearchpage OR /uspage will bring up a page.`,
		`See also /usnames for a staff-curated list of the most commonly searched terms.`,
	],
	usnames: 'usersearchnames',
	usersearchnames: {
		'': 'list',
		list() {
			this.parse(`/join view-usersearch`);
		},
		add(target, room, user) {
			this.checkCan('lock');
			const targets = target.split(',').map(toID).filter(Boolean);
			if (!targets.length) {
				return this.errorReply(`Specify at least one term.`);
			}
			for (const [i, arg] of targets.entries()) {
				if (nameList.has(arg)) {
					targets.splice(i, 1);
					this.errorReply(`Term ${arg} is already on the usersearch term list.`);
					continue;
				}
				if (arg.length < 3) {
					targets.splice(i, 1);
					this.errorReply(`Term ${arg} is too short for the usersearch term list. Must be more than 3 characters.`);
					continue;
				}
				nameList.add(arg);
			}
			if (!targets.length) {
				// fuck you too, "mia added 0 term to the usersearch name list"
				return this.errorReply(`No terms could be added.`);
			}
			const count = Chat.count(targets, 'terms');
			Rooms.get('staff')?.addByUser(
				user, `${user.name} added the ${count} "${targets.join(', ')}" to the usersearch name list.`
			);
			this.globalModlog(`USERSEARCH ADD`, null, targets.join(', '));
			if (!room || room.roomid !== 'staff') {
				this.sendReply(`You added the ${count} "${targets.join(', ')}" to the usersearch name list.`);
			}
			saveNames();
		},
		remove(target, room, user) {
			this.checkCan('lock');
			const targets = target.split(',').map(toID).filter(Boolean);
			if (!targets.length) {
				return this.errorReply(`Specify at least one term.`);
			}
			for (const [i, arg] of targets.entries()) {
				if (!nameList.has(arg)) {
					targets.splice(i, 1);
					this.errorReply(`${arg} is not in the usersearch name list, and has been skipped.`);
					continue;
				}
				nameList.delete(arg);
			}
			if (!targets.length) {
				return this.errorReply(`No terms could be removed.`);
			}
			const count = Chat.count(targets, 'terms');
			Rooms.get('staff')?.addByUser(
				user, `${user.name} removed the ${count} "${targets.join(', ')}" from the usersearch name list.`
			);
			this.globalModlog(`USERSEARCH REMOVE`, null, targets.join(', '));
			if (!room || room.roomid !== 'staff') {
				this.sendReply(`You removed the ${count} "${targets.join(', ')}"" from the usersearch name list.`);
			}
			saveNames();
		},
	},
	usnameshelp: [
		`/usnames add [...terms]: Adds the given [terms] to the usersearch name list. Requires: % @ ~`,
		`/usnames remove [...terms]: Removes the given [terms] from the usersearch name list. Requires: % @ ~`,
		`/usnames OR /usnames list: Shows the usersearch name list.`,
	],
};

export const pages: Chat.PageTable = {
	usersearch(query, user) {
		this.checkCan('lock');
		const target = toID(query.shift());
		if (!target) {
			this.title = `[Usersearch Terms]`;
			const sorted: {[k: string]: number} = {};
			for (const curUser of Users.users.values()) {
				for (const term of nameList) {
					if (curUser.id.includes(term)) {
						if (!(term in sorted)) sorted[term] = 0;
						sorted[term]++;
					}
				}
			}
			return <div class="pad">
				<strong>Usersearch term list</strong>
				<button style={{float: 'right'}} class="button" name="send" value="/uspage">
					<i class="fa fa-refresh"></i> Refresh
				</button>
				<hr />
				{!nameList.size ?
					<p>None found.</p> :
					<div class="ladder pad">
						<table>
							<tr>
								<th>Term</th>
								<th>Current Matches</th>
								<th></th>
							</tr>
							{(() => {
								const buf = [];
								for (const k of Utils.sortBy(Object.keys(sorted), v => -sorted[v])) {
									buf.push(<tr>
										<td>{k}</td>
										<td>{sorted[k]}</td>
										<td><button class="button" name="send" value={`/uspage ${k}`}>Search</button></td>
									</tr>);
								}
								if (!buf.length) return <tr><td colSpan={3} style={{textAlign: 'center'}}>No names found.</td></tr>;
								return buf;
							})()}
						</table>
					</div>
				}
			</div>;
		}
		this.title = `[Usersearch] ${target}`;
		return <SearchUsernames target={target} page />;
	},
};
