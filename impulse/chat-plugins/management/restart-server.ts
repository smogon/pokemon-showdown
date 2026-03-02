/*
 * Pokemon Showdown
 * Restart Server Command
 * Allows restarting the server directly from a chatroom.
 * @author TurboRx
 */

export const commands: Chat.ChatCommands = {
	restartserver(target, room, user): void {
		this.checkCan('bypassall');

		const logRoom = Rooms.get('staff') || Rooms.lobby || room;
		logRoom?.roomlog(`${user.name} used /restartserver`);

		for (const u of Users.users.values()) {
			u.send(
				`|pm|~|${u.getIdentity()}|/raw <div class="broadcast-red">` +
				`<b>The server is restarting.</b><br />` +
				`You will be able to reconnect shortly.</div>`
			);
		}

		this.privateGlobalModAction(`${user.name} used /restartserver.`);
		this.globalModlog('RESTARTSERVER', null, `by ${user.name}`);

		const exitTimer = setTimeout(() => {
			process.exit(0);
		}, 10000);

		void (logRoom?.log.roomlogStream?.writeEnd() ?? Promise.resolve()).then(() => {
			clearTimeout(exitTimer);
			process.exit(0);
		});
	},
	restartserverhelp: [
		`/restartserver - Restarts the server. Requires: ~`,
	],
};
