/*
 * Pokemon Showdown
 * Restart Server Command
 * Allows restarting the server directly from a chatroom.
 * @author TurboRx
 */

export const commands: Chat.ChatCommands = {
	async restartserver(target, room, user): Promise<void> {
		this.checkCan('bypassall');
		let noSave = toID(target) === 'nosave';
		if (!Config.usepostgres) noSave = true;

		if (Rooms.global.lockdown !== true && noSave) {
			if (!Config.usepostgres) {
				throw new Chat.ErrorMessage(
					"This server has battle saving disabled, so /restartserver can only be used once the server is already in lockdown."
				);
			}
			throw new Chat.ErrorMessage(
				"For safety reasons, using /restartserver with the `nosave` option can only be done during lockdown."
			);
		}

		if (Monitor.updateServerLock) {
			throw new Chat.ErrorMessage("Wait for /updateserver to finish before using /restartserver.");
		}

		if (!noSave) {
			this.sendReply('Saving battles...');
			Rooms.global.lockdown = true;
			for (const u of Users.users.values()) {
				u.send(
					`|pm|~|${u.getIdentity()}|/raw <div class="broadcast-red"><b>The server is restarting soon.</b><br />` +
					`While battles are being saved, no more can be started. If you're in a battle, it will be paused during saving.<br />` +
					`After the restart, you will be able to resume your battles from where you left off.`
				);
			}
			try {
				const count = await Rooms.global.saveBattles();
				this.sendReply(`DONE.`);
				this.sendReply(`${count} battles saved.`);
			} catch (error) {
				console.error('Failed to save battles during /restartserver:', error);
				this.sendReply("Failed to save battles; proceeding with restart anyway.");
			}
		}

		const logRoom = Rooms.get('staff') || Rooms.lobby || room;

		this.privateGlobalModAction(`${user.name} used /restartserver.`);
		this.globalModlog('RESTARTSERVER', null, `by ${user.name}`);

		if (!logRoom?.log.roomlogStream) return process.exit(0);

		logRoom.roomlog(`${user.name} used /restartserver`);

		const exitTimer = setTimeout(() => {
			process.exit(0);
		}, 10000);

		void logRoom.log.roomlogStream.writeEnd()
			.catch(error => {
				console.error('Failed to flush roomlog stream on /restartserver:', error);
			})
			.finally(() => {
				clearTimeout(exitTimer);
				process.exit(0);
			});
	},
	restartserverhelp: [
		`/restartserver - Restarts the server. On servers with battle saving enabled, saves battles by default; use \`nosave\` during lockdown to skip saving. On servers without battle saving, battles cannot be saved and the server must already be in lockdown. Requires: ~`,
	],
};
