/**
 * Rock Paper Scissors plugin by Mia
 * @author mia-pi-git
 */
const MAX_ROUNDS = 200;
const TIMEOUT = 10 * 1000;
const ICONS: {[k: string]: Chat.VNode} = {
	Rock: <i class="fa fa-hand-rock-o"></i>,
	Paper: <i class="fa fa-hand-paper-o"></i>,
	Scissors: <i class="fa fa-hand-scissors-o"></i>,
};

const MATCHUPS = new Map<string, string>([
	['Scissors', 'Paper'],
	['Rock', 'Scissors'],
	['Paper', 'Rock'],
]);

function toChoice(str: string) {
	const id = toID(str);
	return id.charAt(0).toUpperCase() + id.slice(1);
}

export class RPSPlayer extends Rooms.RoomGamePlayer {
	choice = '';
	prevChoice = '';
	prevWinner = false;
	score = 0;
	sendControls(jsx: Chat.VNode) {
		this.sendRoom(Chat.html`|controlshtml|${jsx}`);
	}
}

export class RPSGame extends Rooms.RoomGame {
	currentRound: number;
	declare playerTable: {[k: string]: RPSPlayer};
	readonly checkChat = true;
	roundTimer: NodeJS.Timeout | null = null;
	players: RPSPlayer[];
	constructor(room: Room) {
		super(room);
		this.currentRound = 0;
		this.title = 'Rock Paper Scissors';
		this.gameid = 'rockpaperscissors' as ID;
		this.players = [];

		this.room.update();
		this.controls(<div style={{textAlign: 'center'}}>Waiting for another player to join....</div>);
		this.sendField();
	}
	controls(node: Chat.VNode) {
		this.room.send(Chat.html`|controlshtml|${node}`);
	}
	onConnect(user: User, connection: Connection) {
		this.room.sendUser(connection, Chat.html`|fieldhtml|${this.getField()}`);
	}
	static getWinner(p1: RPSPlayer, p2: RPSPlayer) {
		const p1Choice = p1.choice;
		const p2Choice = p2.choice;
		if (!p1Choice && p2Choice) return p2;
		if (!p2Choice && p1Choice) return p1;
		if (MATCHUPS.get(p1Choice) === p2Choice) return p1;
		if (MATCHUPS.get(p2Choice) === p1Choice) return p2;
		return null;
	}
	sendControls(player: RPSPlayer) {
		if (!this.roundTimer) {
			return player.sendControls(<div style={{textAlign: 'center'}}>
				The game is paused.<br /><br />
				<button class="button" name="send" value="/rps resume">Resume game</button>
			</div>);
		}
		if (player.choice) {
			player.sendControls(
				<div style={{textAlign: 'center'}}>You have selected <strong>{player.choice}</strong>. Now to wait for your foe.</div>
			);
			return;
		}
		player.sendControls(<div style={{textAlign: 'center'}}>
			<strong>Make your choice, quick! You have {Chat.toDurationString(TIMEOUT)}!</strong><br />
			{['Rock', 'Paper', 'Scissors'].map(choice => (
				<button class="button" name="send" value={`/choose ${choice}`} style={{width: '6em'}}>
					<span style={{fontSize: '24px'}}>{ICONS[choice]}</span><br />
					{choice || '\u00A0'}
				</button>
			))}<br /><br />
			<button class="button" name="send" value="/rps end">End game</button>
		</div>);
	}
	getField() {
		if (this.players.length < 2) {
			return <div style={{textAlign: 'center'}}><h2>Waiting to start the game...</h2></div>;
		}

		const [p1, p2] = this.players;

		function renderBigChoice(choice: string, isWinner?: boolean) {
			return <div style={{
				width: '180px', fontSize: '120px', background: isWinner ? '#595' : '#888', color: 'white', borderRadius: '20px', paddingBottom: '5px', margin: '0 auto',
			}}>
				{ICONS[choice] || '\u00A0'}<br />
				<small style={{fontSize: '40px'}}>
					<small style={{fontSize: '32px', display: 'block'}}>
						{choice || '\u00A0'}
					</small>
				</small>
			</div>;
		}

		function renderCurrentChoice(exists?: boolean) {
			return <div style={{
				width: '100px', fontSize: '60px', background: '#888', color: 'white', borderRadius: '15px', paddingBottom: '5px', margin: '20px auto 0',
			}}>{exists ? <i class="fa fa-check"></i> : '\u00A0'}</div>;
		}

		return <table style={{width: '100%', textAlign: 'center', fontSize: '18px'}}><tr>
			<td>
				<div style={{padding: '8px 0'}}><strong>{p1.name}</strong> ({p1.score})</div>
				{renderBigChoice(p1.prevChoice, p1.prevWinner)}
				{renderCurrentChoice(!!p1.choice)}
			</td>
			<td>
				<em style={{fontSize: '24px'}}>vs</em>
			</td>
			<td>
				<div style={{padding: '8px 0'}}><strong>{p2.name}</strong> ({p2.score})</div>
				{renderBigChoice(p2.prevChoice, p2.prevWinner)}
				{renderCurrentChoice(!!p2.choice)}
			</td>
		</tr></table>;
	}
	sendField() {
		this.room.send(Chat.html`|fieldhtml|${this.getField()}`);
	}
	end() {
		const [p1, p2] = this.players;
		if (p1.score === p2.score) {
			this.message(`**Tie** at score ${p1.score}!`);
		} else {
			const [winner, loser] = p1.score > p2.score ? [p1, p2] : [p2, p1];
			this.message(`**${winner.name}** wins with score ${winner.score} to ${loser.score}!`);
		}

		if (this.roundTimer) {
			clearTimeout(this.roundTimer);
			this.roundTimer = null;
		}

		this.room.pokeExpireTimer();
		this.ended = true;
		this.room.add(`|-message|The game has ended.`); // for the benefit of those in the room
		for (const player of this.players) {
			player.sendControls(<div class="pad">The game has ended.</div>);
			player.unlinkUser();
		}
	}
	runMatch() {
		const [p1, p2] = this.players;
		const winner = RPSGame.getWinner(p1, p2);
		if (!winner) { // tie
			if (!p1.choice) {
				this.message(`${p1.name} and ${p2.name} both **timed out**.`);
			} else {
				this.message(`${p1.name} and ${p2.name} **tie** with ${p1.choice}.`);
			}
		} else {
			const loser = p1 === winner ? p2 : p1;
			if (!loser.choice) {
				this.message(`**${winner.name}**'s ${winner.choice} wins; ${loser.name} timed out.`);
			} else {
				this.message(`**${winner.name}**'s ${winner.choice} beats ${loser.name}'s ${loser.choice}.`);
			}
			winner.score++;
		}

		if (!winner && !p1.choice) {
			this.pause();
			return;
		}

		if (this.currentRound >= MAX_ROUNDS) {
			this.message(`The game is ending automatically at ${this.currentRound} rounds.`);
			return this.end();
		}

		for (const player of this.players) {
			player.prevChoice = player.choice;
			player.prevWinner = false;
			player.choice = '';
		}
		if (winner) winner.prevWinner = true;

		this.sendField();
		this.nextRound();
	}
	smallMessage(message: string) {
		this.room.add(`|-message|${message}`).update();
	}
	message(message: string) {
		this.room.add(`|message|${message}`).update();
	}
	start() {
		if (this.players.length < 2) {
			throw new Chat.ErrorMessage(`There are not enough players to start. Use /rps start to start when all players are ready.`);
		}
		if (this.room.log.log.length > 1000) {
			// prevent logs from ballooning too much
			this.room.log.log = [];
		}
		const [p1, p2] = this.players;
		this.room.add(
			`|raw|<h2><span style="font-weight: normal">Rock Paper Scissors:</span> ${p1.name} vs ${p2.name}!</h2>\n` +
			`|message|Game started!\n` +
			`|notify|Game started!`
		).update();
		this.nextRound();
	}
	getPlayer(user: User) {
		const player = this.playerTable[user.id];
		if (!player) throw new Chat.ErrorMessage(`You are not a player in this game.`);
		return player;
	}
	pause(user?: User) {
		if (!this.roundTimer) throw new Chat.ErrorMessage(`The game is not running, and cannot be paused.`);

		const player = user ? this.getPlayer(user) : null;
		clearTimeout(this.roundTimer);
		this.roundTimer = null;
		for (const curPlayer of this.players) this.sendControls(curPlayer);
		if (player) this.message(`The game was paused by ${player.name}.`);
	}
	unpause(user: User) {
		if (this.roundTimer) throw new Chat.ErrorMessage(`The game is not paused.`);

		const player = this.getPlayer(user);
		this.message(`The game was resumed by ${player.name}.`);
		this.nextRound();
	}
	nextRound() {
		this.currentRound++;
		this.sendField();
		this.room.add(`|html|<h2>Round ${this.currentRound}</h2>`).update();
		this.roundTimer = setTimeout(() => {
			this.runMatch();
		}, TIMEOUT);
		for (const player of this.players) this.sendControls(player);
	}
	choose(user: User, option: string) {
		option = toChoice(option);
		const player = this.getPlayer(user);
		if (!MATCHUPS.get(option)) {
			throw new Chat.ErrorMessage(`Invalid choice: ${option}.`);
		}
		if (player.choice) throw new Chat.ErrorMessage("You have already made your choice!");
		player.choice = option;
		this.smallMessage(`${user.name} made a choice.`);
		this.sendControls(player);
		if (this.players.filter(item => item.choice).length > 1) {
			clearTimeout(this.roundTimer!);
			this.roundTimer = null;
			return this.runMatch();
		}
		this.sendField();
		return true;
	}
	leaveGame(user: User) {
		const player = this.getPlayer(user);
		player.sendRoom(`You left the game.`);
		delete this.playerTable[user.id];
		this.end();
	}
	addPlayer(user: User) {
		if (this.playerTable[user.id]) throw new Chat.ErrorMessage(`You are already a player in this game.`);
		this.playerTable[user.id] = new RPSPlayer(user, this);
		this.players.push(this.playerTable[user.id]);
		this.room.auth.set(user.id, Users.PLAYER_SYMBOL);
		return this.playerTable[user.id];
	}
}

function findExisting(user1: string, user2: string) {
	return Rooms.get(`game-rps-${user1}-${user2}`) || Rooms.get(`game-rps-${user2}-${user1}`);
}

export const commands: Chat.ChatCommands = {
	rps: 'rockpaperscissors',
	rockpaperscissors: {
		challenge: 'create',
		chall: 'create',
		chal: 'create',
		create(target, room, user) {
			target = target.trim();
			if (!target && this.pmTarget) {
				target = this.pmTarget.id;
			}
			const {targetUser, targetUsername} = this.splitUser(target);
			if (!targetUser) {
				return this.errorReply(`User ${targetUsername} not found. Either specify a username or use this command in PMs.`);
			}
			if (targetUser === user) return this.errorReply(`You cannot challenge yourself.`);
			if (targetUser.settings.blockChallenges && !user.can('bypassblocks', targetUser)) {
				Chat.maybeNotifyBlocked('challenge', targetUser, user);
				return this.errorReply(this.tr`The user '${targetUser.name}' is not accepting challenges right now.`);
			}
			const existingRoom = findExisting(user.id, targetUser.id);
			if (existingRoom?.game && !existingRoom.game.ended) {
				return this.errorReply(`You're already playing a Rock Paper Scissors game against ${targetUser.name}!`);
			}

			Ladders.challenges.add(
				new Ladders.GameChallenge(user.id, targetUser.id, "Rock Paper Scissors", {
					acceptCommand: `/rps accept ${user.id}`,
				})
			);

			if (!this.pmTarget) this.pmTarget = targetUser;
			this.sendChatMessage(
				`/raw ${user.name} wants to play Rock Paper Scissors!`
			);
		},

		accept(target, room, user) {
			const fromUser = Ladders.challenges.accept(this);

			const existingRoom = findExisting(user.id, fromUser.id);
			const roomid = `game-rps-${fromUser.id}-${user.id}`;
			const gameRoom = existingRoom || Rooms.createGameRoom(
				roomid as RoomID, `[RPS] ${user.name} vs ${fromUser.name}`, {}
			);

			const game = new RPSGame(gameRoom);
			gameRoom.game = game;

			game.addPlayer(fromUser);
			game.addPlayer(user);
			user.joinRoom(gameRoom.roomid);
			fromUser.joinRoom(gameRoom.roomid);
			(gameRoom.game as RPSGame).start();

			this.pmTarget = fromUser;
			this.sendChatMessage(`/text ${user.name} accepted <<${gameRoom.roomid}>>`);
		},

		deny: 'reject',
		reject(target, room, user) {
			return this.parse(`/reject ${target}`);
		},

		end(target, room, user) {
			const game = this.requireGame(RPSGame);
			if (!game.playerTable[user.id]) {
				return this.errorReply(`You are not a player, and so cannot end the game.`);
			}
			game.end();
		},

		choose(target, room, user) {
			this.parse(`/choose ${target}`);
		},

		leave(target, room, user) {
			this.parse(`/leavegame`);
		},

		pause(target, room, user) {
			const game = this.requireGame(RPSGame);
			game.pause(user);
		},

		unpause: 'resume',
		resume(target, room, user) {
			const game = this.requireGame(RPSGame);
			game.unpause(user);
		},

		'': 'help',
		help() {
			this.runBroadcast();
			const strings = [
				`/rockpaperscissors OR /rps<br />`,
				`/rps challenge [user] - Challenges a user to a game of Rock Paper Scissors`,
				`(in PM) /rps challenge - Challenges a user to a game of Rock Paper Scissors`,
				`/rps leave - Leave the game.`,
				`/rps start - Start the Rock Paper Scissors game.`,
				`/rps end - End the Rock Paper Scissors game`,
				`/rps pause - Pauses the game, if it's in progress.`,
				`/rps resume - Resumes the game, if it's paused.`,
			];
			return this.sendReplyBox(strings.join('<br />'));
		},
	},
};
