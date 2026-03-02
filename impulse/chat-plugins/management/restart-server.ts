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

		let saveDetail = 'nosave';
		if (!noSave) {
			Rooms.global.lockdown = true;
		}

		for (const u of Users.users.values()) {
			u.send(
				`|pm|~|${u.getIdentity()}|/raw <div class="broadcast-red"><b>The server is restarting soon.</b><br />` +
				(noSave
					? `The server will restart shortly. <b>Ongoing battles will not be saved and will be lost.</b>`
					: `While we attempt to save ongoing battles, no more can be started. If you're in a battle, it will be paused during saving.<br />` +
					`After the restart, you should be able to resume your battles from where you left off, unless saving unexpectedly fails.`) +
				`</div>`
			);
		}

		if (!noSave) {
			this.sendReply('Saving battles...');
			try {
				const count = await Rooms.global.saveBattles();
				saveDetail = `${count} battles saved`;
				this.sendReply(`DONE.`);
				this.sendReply(`${count} battles saved.`);
			} catch (error) {
				saveDetail = 'save failed';
				console.error('Failed to save battles during /restartserver:', error);
				this.sendReply("Failed to save battles; proceeding with restart anyway.");
			}
		}

		const logRoom = Rooms.get('staff') || Rooms.lobby || room;

		this.privateGlobalModAction(`${user.name} used /restartserver (${saveDetail}).`);
		const modlogResult = this.globalModlog('RESTARTSERVER', null, `by ${user.name}: ${saveDetail}`);
		const modlogPromise: Promise<unknown> | null =
			modlogResult && typeof (modlogResult as any).then === 'function'
				? (modlogResult as Promise<unknown>)
				: null;

		const waitForModlog = async () => {
			if (!modlogPromise) return;
			try {
				await modlogPromise;
			} catch (error) {
				console.error('Failed to write modlog entry on /restartserver:', error);
			}
		};

		if (!logRoom?.log.roomlogStream) {
			const exitTimer = setTimeout(() => {
				process.exit(0);
			}, 10000);
			try {
				await waitForModlog();
			} finally {
				clearTimeout(exitTimer);
				process.exit(0);
			}
		}

		logRoom.roomlog(`${user.name} used /restartserver (${saveDetail})`);

		const exitTimer = setTimeout(() => {
			process.exit(0);
		}, 10000);

		try {
			await waitForModlog();
			await logRoom.log.roomlogStream.writeEnd();
		} catch (error) {
			console.error('Failed to flush roomlog stream on /restartserver:', error);
		} finally {
			clearTimeout(exitTimer);
			process.exit(0);
		}
	},
	restartserverhelp: [
		`/restartserver - Restarts the server. On servers with battle saving enabled, saves battles by default; use \`nosave\` during lockdown to skip saving. On servers without battle saving, battles cannot be saved and the server must already be in lockdown. Requires: ~`,
	],
};
