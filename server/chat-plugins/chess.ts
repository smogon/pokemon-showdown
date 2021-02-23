/**
 * Plugin to play chess in specialized gamerooms.
 * By Mia and Zarel.
 * @author mia-pi-git
 */

import {Utils} from '../../lib';

/** map<to, from> */
export const chessChallenges = Chat.oldPlugins.chess?.chessChallenges || new Map();

const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
type Side = 'B' | 'W';

interface Piece {
	symbols: {B: string, W: string};
	name: string;
	/**
	 * @param dCol: difference between old column and new column
	 * @param dRow: difference between new row and old row
	 * @param hasStarted: has it moved from original position?
	 */
	canMove: (dCol: number, dRow: number, hasStarted?: boolean) => boolean;
	canCapture?: (dCol: number, dRow: number, hasStarted?: boolean) => boolean;
	canBeBlocked?: boolean;
}

function toPieceID(str: string) {
	return toID(str).toUpperCase();
}

export const PIECES: {[letter: string]: Piece} = {
	P: {
		symbols: {W: '\u2659', B: '\u265F'},
		name: "Pawn",
		canMove: (dCol, dRow, started) => {
			let limit = 2;
			if (!started) limit = 3;
			return dRow === 0 && limit > Math.abs(dCol);
		},
		canCapture: (dCol, dRow) => Math.abs(dCol) === 1 && Math.abs(dRow) === 1,
		canBeBlocked: true,
	},
	B: {
		symbols: {W: '\u2657', B: '\u265D'},
		name: "Bishop",
		canMove: (dCol, dRow) => dCol === dRow || dCol === -dRow,
		canBeBlocked: true,
	},
	N: {
		symbols: {B: '\u265E', W: '\u2658'},
		name: 'Knight',
		canMove: (dCol, dRow) => (
			(Math.abs(dCol) === 1 && Math.abs(dRow) === 2) ||
			(Math.abs(dCol) === 2 && Math.abs(dRow) === 1)
		),
	},
	Q: {
		name: 'Queen',
		symbols: {B: '\u265B', W: '\u2655'},
		canMove: (dCol, dRow) => (
			(dCol === dRow || dCol === -dRow) ||
			(Math.abs(dCol) === 0 && Math.abs(dRow) > 0 || Math.abs(dRow) === 0 && Math.abs(dCol) > 0)
		),
		canBeBlocked: true,
	},
	K: {
		name: 'King',
		symbols: {B: '\u265A', W: '\u2654'},
		canMove: (dCol, dRow) => {
			const col = Math.abs(dCol);
			const row = Math.abs(dRow);
			const total = row + col;
			return col < 2 && row < 2 && total > 1 && total < 2;
		},
	},
	R: {
		name: 'Rook',
		symbols: {W: '\u2656', B: '\u265C'},
		canMove: (dCol, dRow) => (
			(Math.abs(dCol) === 0 && Math.abs(dRow) > 0 || Math.abs(dRow) === 0 && Math.abs(dCol) > 0)
		),
		canBeBlocked: true,
	},
};

export class ChessPlayer extends Rooms.RoomGamePlayer {
	side: Side;
	game: ChessGame;
	user: User;
	wantsTie = false;
	stale = false;
	constructor(user: User, game: ChessGame) {
		super(user, game);
		this.game = game;
		this.user = user;
		this.side = this.startingSide();
	}
	startingSide(): Side {
		if (this.game.players[0]) {
			return this.game.opposite(this.game.players[0].side);
		}
		return Utils.randomElement(['B', 'W']);
	}
	send(message: string) {
		this.user.sendTo(this.game.room, message);
	}

	sendControls(html: string) {
		this.send(`|controlshtml|${html}`);
	}
}


export class ChessGame extends Rooms.RoomGame {
	gameid = 'chess' as ID;
	title = 'Chess';
	sides: {[side: string]: ChessPlayer};
	playerTable: {[k: string]: ChessPlayer};
	players: ChessPlayer[] = [];
	log: string[] = [];
	board: string[][];
	turn!: string;
	state: string;
	check: {[side: string]: [number, number][]};
	constructor(room: Room) {
		super(room);
		this.room = room;
		this.sides = {};
		this.board = ChessGame.startingBoard();
		this.state = '';
		this.check = {};
		this.playerTable = {};
	}
	copy() {
		return [...this.board];
	}
	parseLocation(args: string): [number, number] {
		const [letter, num] = toID(args).split('');
		const letterIdx = LETTERS.indexOf(letter);
		if (letterIdx < 0) throw new Chat.ErrorMessage(`Invalid column: ${letter}`);
		const colIdx = parseInt(num) - 1;
		const row = this.board[colIdx];
		if (!row) {
			throw new Chat.ErrorMessage(`Invalid row: ${num}`);
		}
		return [colIdx, letterIdx];
	}
	send(player: ChessPlayer, message: string) {
		return player.user.sendTo(this.room, message);
	}
	addPlayer(user: User) {
		const player = new ChessPlayer(user, this);
		this.players.push(player);

		this.playerTable[user.id] = player;
		const titles: {[k: string]: string} = {
			B: 'Black',
			W: 'White',
		};
		this.room.auth.set(player.id, Users.PLAYER_SYMBOL);
		this.sides[player.side] = player;
		player.sendControls(
			`<center>You are the ${titles[player.side]} side!<br />` +
			`Use <code>/chess move [location], [newlocation]</code> to play.</center>`
		);
		if (this.players.length > 1) {
			this.start();
		}
		return player;
	}
	sendBoard() {
		let buf = `<center><div class="ladder pad"><table><tr><th></th><th>`;
		buf += LETTERS.join(`</th><th>`);
		for (const [i, str] of this.board.entries()) {
			buf += `<tr><th>${i + 1}</th><td>`;
			buf += str.map((p) => {
				const [color, type] = p.split('');
				const pieceInfo = PIECES[type];
				if (!pieceInfo) return p;
				return pieceInfo.symbols[color as Side];
			}).join(`</td><td>`);
			buf += `</td></tr>`;
		}
		buf += `</center>`;
		this.sendField(buf);
		return buf;
	}

	sendField(buffer: string) {
		this.room?.add(`|fieldhtml|${buffer}`).update();
	}

	static startingBoard(): string[][] {
		const ROW1 = 'RNBQKBNR';
		const ROW2 = 'PPPPPPPP';
		const EMPTY = ' '.repeat(8);
		return [
			[...ROW1].map(piece => `W${piece}`),
			[...ROW2].map(piece => `W${piece}`),
			[...EMPTY].map(item => item.trim()),
			[...EMPTY].map(item => item.trim()),
			[...EMPTY].map(item => item.trim()),
			[...EMPTY].map(item => item.trim()),
			[...ROW2].map(piece => `B${piece}`),
			[...ROW1].map(piece => `B${piece}`),
		];
	}

	checkCanMove(
		piece: string, oldCol: number, oldRow: number,
		newCol: number, newRow: number, isBlack: boolean, shouldThrow = false, toCheck?: string[][],
	) {
		const pieceLetter = toPieceID(piece).charAt(1);
		const board = toCheck || this.copy();
		if (!piece) {
			if (shouldThrow) throw new Chat.ErrorMessage(`You can't move an empty space!`);
			return false;
		}

		const isCapture = !!board[newCol][newRow];
		const dCol = newCol - oldCol;
		const dRow = (newRow - oldRow) * (isBlack ? -1 : 1);

		if (!dCol && !dRow) {
			if (shouldThrow) throw new Chat.ErrorMessage(`That's not a valid board location.`);
			return false;
		}

		const pieceInfo = PIECES[pieceLetter];
		if (!pieceInfo) {
			if (shouldThrow) throw new Chat.ErrorMessage(`Piece ${piece} not found.`);
			return false;
		}
		const canMove = isCapture && pieceInfo.canCapture ? pieceInfo.canCapture : pieceInfo.canMove;
		if (!canMove(dCol, dRow, !piece.endsWith('.'))) {
			if (shouldThrow) throw new Chat.ErrorMessage(`You cannot move there.`);
			return false;
		}

		if (pieceInfo.canBeBlocked) {
			const stepRow = Math.sign(newRow - oldRow);
			const stepCol = Math.sign(newCol - oldCol);
			let curRow = oldRow;
			let curCol = oldCol;
			let steps = 0;
			while (true) {
				curRow += stepRow;
				curCol += stepCol;
				steps++;
				if (steps > 10) throw new Error("bug in blockfinder");

				if (curRow === newRow && curCol === newCol) return true;
				if (board[curCol][curRow]) {
					if (shouldThrow) {
						throw new Chat.ErrorMessage(
							`You're blocked from moving there (${this.stringLoc([curCol, curRow])} blocks you).`
						);
					}
					return false;
				}
			}
		}
		return true;
	}

	runLogLine(line: string) {
		const parts = line.split('|');
		parts.shift();
		const name = parts.shift()!;
		switch (name) {
		case 'move':
			const [cur, to] = parts;
			const [cCol, cRow] = this.parseLocation(cur);
			const [nCol, nRow] = this.parseLocation(to);
			const piece = this.board[cCol][cRow];
 			try {
				this.checkCanMove(piece, cCol, cRow, nCol, nRow, piece.startsWith('B'));
			} catch (e) {
				throw new Chat.ErrorMessage(`Invalid movement in log line: ${e.message}`);
			}
			this.board[cCol][cRow] = '';
			this.board[nCol][nRow] = (piece.endsWith('.') ? piece : `${piece}.`);
			this.sendBoard();
			break;
		case 'turn':
			this.turn = parts[0];
			break;
		}
	}

	destroy() {
		this.room.game = null;
		this.room = null!;
		for (const p in this.playerTable) {
			const player = this.playerTable[p];
			player.destroy();
		}
	}
	getPlayer(user: User): ChessPlayer {
		const player = this.playerTable[user.id];
		if (!player) throw new Chat.ErrorMessage(`You are not a player in the current game of Chess.`);
		return player;
	}
	move(player: ChessPlayer, currentLoc: string, targetLoc: string) {
		if (!this.state) {
			throw new Chat.ErrorMessage(`The game has not started yet.`);
		}
		if (this.turn !== player.id) {
			throw new Chat.ErrorMessage(`It is not your turn to play!`);
		}
		if (this.state === 'ended') {
			throw new Chat.ErrorMessage(`The game is over.`);
		}
		const [col, row] = this.parseLocation(currentLoc);
		const [newCol, newRow] = this.parseLocation(targetLoc);
		const targetPiece = this.board[newCol][newRow];
		const piece = this.board[col][row];
		const pieceId = toPieceID(piece);
		const pieceInfo = PIECES[pieceId.slice(1)];
		if (!toID(piece).startsWith(toID(player.side))) {
			throw new Chat.ErrorMessage(`That isn't your piece to move.`);
		}
		const isBlack = player.side === 'B';

		if (this.check[player.side]) {
			if (!this.checkWouldBeUnchecked(targetLoc, currentLoc, player.side)) {
				throw new Chat.ErrorMessage(`You must move your king out of check.`);
			}
		}

		if (this.board[newCol][newRow].endsWith('K')) {
			throw new Chat.ErrorMessage("You cannot capture kings");
		}

		if (piece.endsWith('K')) {
			const curBoard = [...this.board];
			curBoard[newCol][newRow] = piece;

			const check = this.checkCheck(piece.charAt(0) as Side, curBoard, true);
			if (check) {
				throw new Chat.ErrorMessage("You cannot move into check");
			}
		}

		this.checkCanMove(piece, col, row, newCol, newRow, isBlack, true);

		this.board[col][row] = '';
		this.board[newCol][newRow] = piece.endsWith('.') ? piece : `${piece}.`;

		for (const side of Object.keys(this.sides) as Side[]) {
			if (this.checkCheckmate(side)) {
				return this.end(Utils.html`Checkmate! ${this.sides[this.opposite(side)].name} won the game!`);
			}
			this.checkCheck(side); // check to see if they've moved into check
			const sidePieces = this.find(side).map(([c, r]) => this.board[c][r]);
			// if this is true, they only have pawns and kings, they can't really win now except with promotion
			// so this can change
			this.sides[side].stale = sidePieces.every(p => p.endsWith('P') || p.endsWith('K'))
		}

		// stalemate
		if (this.players.every(p => p.stale)) {
			return this.end(`Stalemate. No players could win...`);
		}

		const targetInfo = PIECES[targetPiece.charAt(1)];
		this.add(
			Utils.html`${player.name} moved their ${pieceInfo.name} to ${targetLoc}` +
			Utils.html`${targetInfo ? ` and took the opponent's ${targetInfo.name} there` : ''}.`
		);

		this.log.push(
			`|move|${player.side}|${this.stringLoc([col, row])}|${this.stringLoc([newCol, newRow])}|` +
			`${targetInfo?.name.charAt(0) || ""}`
		);

		this.turn = this.sides[isBlack ? 'W' : 'B'].id;
		this.log.push(`|turn|${this.turn}`);
		this.add(Utils.html`<h2>It is now ${this.playerTable[this.turn].name}'s turn to choose.</h2>`);
		this.playerTable[this.turn].send(`|tempnotify|Make your move!`);
		this.sendBoard();
		return piece;
	}
	add(message: string, isHTML = true) {
		return this.room?.add(`${isHTML ? `|html|` : ''}${message}`).update();
	}
	addControls(message: string) {
		this.room.add(`|controlshtml|${message}`).update();
	}
	start() {
		const nameString = Object.keys(this.playerTable).map(p => this.playerTable[p].name).join(' vs ');
		this.add(Utils.html`<h2>Chess: ${nameString}<h2>`);
		this.sendBoard();
		this.state = 'active';
		this.turn = this.sides['W'].id;
	}
	validateLocation(coords: string) {
		const [letter, num] = [...toID(coords)];
		if (!LETTERS.includes(letter)) {
			throw new Chat.ErrorMessage(`Invalid letter: ${letter}`);
		}
		const n = parseInt(num);
		if (n > 8 || n < 1) {
			throw new Chat.ErrorMessage(`Invalid number: ${num}`);
		}
	}
	opposite(side: string) {
		return side === 'W' ? 'B' : 'W';
	}
	checkCheck(side: Side, board: string[][] | null = null, noChange = false) {
		if (!board) board = this.copy();

		const kingLoc = this.find(side + 'K', board)[0];
		const check = noChange ? {} : this.check;
		const enemyPieces = this.find(this.opposite(side), board);

		for (const loc of enemyPieces) {
			const enemy = board[loc[0]][loc[1]];
			if (this.checkCanMove(enemy, loc[0], loc[1], kingLoc[0], kingLoc[1], side === 'B', false, board)) {
				if (!check[side]) check[side] = [];
				check[side].push(loc);
			}
		}

		return check[side];
	}
	checkWouldBeUnchecked(targetLoc: string, currentLoc: string, side: Side, board?: string[][]) {
		if (!board) board = this.copy();

		const targetCoords = this.parseLocation(targetLoc);
		const currentCoords = this.parseLocation(currentLoc);

		const [tCol, tRow] = targetCoords;
		const [cCol, cRow] = currentCoords;

		const piece = board[cCol][cRow];
		if (!this.checkCanMove(piece, cCol, cRow, tCol, tRow, side === "B", false, board)) {
			return false;
		}

		board[cCol][cRow] = '';
		board[tCol][tRow] = piece;

		return !this.checkCheck(side, board, true).length;
	}
	checkCheckmate(side: Side) {
		const king = this.find(side + 'K')[0];
		if (king[0] === undefined) {
			throw new Error(`Can't find king for ${side}`); // should __always__ exist
		}
		const startCheck = this.checkCheck(side, null, true);
		if (!startCheck || !startCheck.length) return false;
		const curBoard = this.copy();
		for (const loc of this.find(side, curBoard)) {
			const piece = curBoard[loc[0]][loc[1]];
			for (const [c, row] of curBoard.entries()) {
				for (const [r] of row.entries()) {
					if (this.checkCanMove(piece, loc[0], loc[1], c, r, side === 'B', false, curBoard)) {
						if (!this.checkCheck(side, curBoard, true)) {
							return false;
						}
					}
				}
			}
		}
		return true;
	}
	stringLoc(coords: [number, number]) {
		return `${LETTERS[coords[1]]}${coords[0] + 1}`;
	}
	end(endMessage: string) {
		this.sendBoard();
		this.add(`<h2>${endMessage}</h2>`);
		this.addControls("");
		this.state = 'ended';
	}
	find(piece: string, board: string[][] | null = null) {
		if (!board) board = this.board;
		const result: [number, number][] = [];
		piece = toPieceID(piece);
		for (const [col, fullRow] of board.entries()) {
			for (const [row, rest] of fullRow.entries()) {
				if (rest.startsWith(piece)) { // reminder that it can end in .
					result.push([col, row]);
				}
			}
		}
		return result;
	}
	forfeit(user: User) {
		const player = this.getPlayer(user);
		this.add(Utils.html`${user.name} forfeited.`);
		this.log.push(`|forfeit|`);
		return this.end(Utils.html`${this.sides[this.opposite(player.side)].name} won the game!`);
	}
	promote(loc: string, to: string, user: ChessPlayer) {
		if (this.turn !== user.id) {
			throw new Chat.ErrorMessage(`It is not your turn.`);
		}
		const [col, row] = this.parseLocation(loc);
		const piece = this.board[col][row];
		const validRow = piece.startsWith('B') ? 7 : 0;
		if (!piece.startsWith(user.side)) throw new Chat.ErrorMessage("Not your piece to promote");
		if (row !== validRow) throw new Chat.ErrorMessage("You're not in a place you can promote");
		const pieceType = Object.keys(PIECES).find(
			p => toID(PIECES[p].name) === toID(to) || toID(p) === toID(to)
		);
		if (!pieceType) {
			throw new Chat.ErrorMessage('Piece type not found');
		}
		if (['K', 'P'].includes(pieceType)) {
			throw new Chat.ErrorMessage(`Cannot promote to that type.`);
		}
		this.board[col][row] = `${user.side}${pieceType}`;
		this.sendBoard();
		this.add(Utils.html`${user.name} promoted their piece at ${loc} to ${PIECES[pieceType].name}`);
	}
}

function findExistingRoom(user1: string, user2: string) {
	return Rooms.get(`chess-${user1}-${user2}`) || Rooms.get(`chess-${user2}-${user1}`);
}

export const commands: ChatCommands = {
	chess: {
		challenge(target, room, user) {
			this.checkChat();
			if (this.pmTarget && !toID(target)) target = this.pmTarget.id;
			if (!target) return this.errorReply(`Specify a user to challenge to chess.`);
			const targetUser = Users.get(target);
			if (!targetUser) return this.errorReply(`User not found.`);
			if (targetUser.id === user.id) return this.errorReply(`You can't challenge yourself.`);
			chessChallenges.set(targetUser.id, user.id);
			Chat.sendPM(`/raw ${user.name} has challenged you to chess!`, user, targetUser);
			targetUser.send(
				`|pm|${user.getIdentity()}|${targetUser.getIdentity()}|` +
				`/uhtml chess,<button class="button" name="send" value="/chess accept">Accept</button>`
			);
		},
		accept(target, room, user) {
			const request = chessChallenges.get(user.id);
			if (!request) return this.errorReply(`You do not have any chess challenges.`);
			const targetUser = Users.get(request);
			if (!targetUser) return this.errorReply(`User not found.`);
			const existingRoom = findExistingRoom(user.id, targetUser.id);
			const options = {
				modchat: '+', isPrivate: true,
			};
			const roomid = `chess-${targetUser.id}-${user.id}`;
			const gameRoom = existingRoom ? existingRoom : Rooms.createGameRoom(
				roomid as RoomID, `[Chess] ${user.name} vs ${targetUser.name}`, options
			);
			gameRoom.game = new ChessGame(gameRoom);
			user.joinRoom(gameRoom.roomid);
			targetUser.joinRoom(gameRoom.roomid);
			gameRoom.game.addPlayer(targetUser);
			gameRoom.game.addPlayer(user);
			user.send(`|pm|${user.getIdentity()}|${targetUser.getIdentity()}|/uhtmlchange chess,`);
		},
		move(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(ChessGame);
			const player = game.getPlayer(user);
			if (!target) {
				return this.parse(`/chess help`);
			}
			const [location, to] = Utils.splitFirst(target, ',');
			game.move(player, location, to);
			this.sendReply(`You moved your piece at ${location} to ${to}.`);
			game.sendBoard();
		},
		accepttie: 'offertie',
		offertie(target, room, user) {
			const game = this.requireGame(ChessGame);
			const player = game.getPlayer(user);
			player.wantsTie = true;
			if (game.players.every(p => p.wantsTie)) {
				game.end(`The game was tied!`);
			} else {
				game.add(Utils.html`${user.name} is offering a tie.`);
			}
		},
		promote(target, room, user) {
			const game = this.requireGame(ChessGame);
			const player = game.getPlayer(user);
			const [loc, to] = target.split(',').map(i => i.trim());
			game.promote(loc, to, player);
		},
		exportlog(target, room, user) {
			this.checkChat();
			const game = this.requireGame(ChessGame);
			game.getPlayer(user);
			if (game.state !== 'ended') {
				return this.errorReply(`The game hasn't ended yet.`);
			}
			this.sendReplyBox(
				`<details class="readmore"><summary>Log of this Chess game</summary>` +
				`${game.log.join('<br />')}</details>`
			);
		},
	},
	chesshelp: [
		`/chess challenge [user] - Challenges the [user] to a chess game.`,
		`/chess accept [name] - Accepts the chess challenge from [name].`,
		`/chess offertie - Offers a tie in your current chess game.`,
		`/chess accepttie - Accepts the pending tie request in your current chess game, if it exists.`,
		`/chess promote [location], [type] - If the pawn at the [location] is at the end of the board, promotes it to the [type].`,
		`/chess move [current space], [new space] - Moves the piece at the [current space] to the [new space]`,
	],
};
