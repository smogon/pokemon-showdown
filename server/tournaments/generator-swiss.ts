const blossom = require('edmonds-blossom');

function createNameCell(name: string) {
	return {
		name: name,
		type: "nameCell",
	};
}
const NUM_DEFAULT_ROUNDS = 5;

import {Utils} from '../../lib/utils';
import {TournamentPlayer} from './index';

class SwissPlayer {
	tournamentPlayer: TournamentPlayer;
	playersAlreadyPlayed: SwissPlayer[];
	byesReceived: number;
	constructor(player: TournamentPlayer) {
		this.tournamentPlayer = player;
		this.playersAlreadyPlayed = [];
		this.byesReceived = 0;
	}
}

interface Match {
	p1: SwissPlayer;
	/** null if this is a match representing a bye */
	p2: SwissPlayer | null;
	state: string;
	score?: number[];
	result?: string;
	isByeMatch: boolean;
}

export class Swiss {
	readonly isDrawingSupported: boolean;
	readonly name: string;
	rounds: number;
	curRound: number;
	players: SwissPlayer[];
	matches: Match[];
	isBracketFrozen: boolean;
	totalPendingMatches: number;
	byePlayers: number[];
	constructor(numRounds: string) {
		this.isDrawingSupported = true;
		this.players = [];
		this.matches = [];
		const intNumRounds = Utils.parseExactInt(numRounds);
		this.rounds = intNumRounds ? intNumRounds : NUM_DEFAULT_ROUNDS;
		this.name = this.rounds + "-Round Swiss";
		this.curRound = 0;
		this.isBracketFrozen = false;
		this.totalPendingMatches = 0;
		this.byePlayers = [];
	}

	setMatchResult([p1, p2]: [TournamentPlayer, TournamentPlayer], result: string, score: number[]) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';
		if (!['win', 'loss', 'draw'].includes(result)) return 'InvalidMatchResult';

		const curMatch = this.matches.find(match =>
			match.p2 &&
			((match.p1.tournamentPlayer === p1 && match.p2.tournamentPlayer === p2) ||
			(match.p1.tournamentPlayer === p2 && match.p2.tournamentPlayer === p1)));
		if (curMatch === undefined) return 'InvalidMatch';
		curMatch.state = 'finished';
		curMatch.result = result;
		curMatch.score = score.slice(0);
		this.totalPendingMatches--;
		if (this.totalPendingMatches === 0 && this.curRound < this.rounds) {
			this.generateNextRoundPairings();
		}
	}

	getSwissPlayer(tournamentPlayer: TournamentPlayer) {
		return this.players.find(player => player.tournamentPlayer === tournamentPlayer);
	}

	isTournamentEnded() {
		return this.players.filter(player => !player.tournamentPlayer.isDisqualified).length < 2 ||
		(this.curRound === this.rounds && this.totalPendingMatches === 0);
	}

	disqualifyUser(user: TournamentPlayer) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		const player = this.getSwissPlayer(user);

		const match = this.matches.find(innerMatch => innerMatch.p1 === player || innerMatch.p2 === player);
		if (!match) return 'InvalidUser';
		if (match.state !== 'finished' && match.p2) {
			match.state = 'finished';
			if (match.p1.tournamentPlayer === user) {
				match.result = 'loss';
				match.score = [0, 1];
				match.p2.tournamentPlayer.score += 1;
			} else {
				match.result = 'win';
				match.score = [1, 0];
				match.p1.tournamentPlayer.score += 1;
			}
			this.totalPendingMatches--;
		}

		user.unlinkUser();
		if (this.totalPendingMatches === 0 && this.curRound < this.rounds) {
			this.generateNextRoundPairings();
		}
	}

	getAvailableMatches() {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';
		const matches = this.matches
			.filter(match => !match.p1.tournamentPlayer.isBusy && !match.p2?.tournamentPlayer.isBusy && match.state !== 'finished')
			.flatMap(match => match.p2 ? [[match.p1.tournamentPlayer, match.p2.tournamentPlayer]] : []);
		return matches;
	}

	getPendingBracketData(players: TournamentPlayer[]) {
		return this.getPlayerListWithScores(players);
	}

	getPlayerListWithScores(players: TournamentPlayer[]) {
		const playerNames = players.map(player => [createNameCell(player.name)]);
		return {
			type: 'table',
			tableHeaders: {
				cols: ["Players"],
				rows: players.map((player, row) => row + 1),
			},
			tableContents: playerNames,
			scores: players.map(player => player.score),
		};
	}

	getResults() {
		if (!this.isTournamentEnded()) return 'TournamentNotEnded';
		// TODO: Add tiebreak calculation
		const sortedScores = Utils.sortBy([...this.players], p => -p.tournamentPlayer.score);
		const results: TournamentPlayer[][] = [];
		for (const player of sortedScores) {
			results.push([player.tournamentPlayer]);
		}
		return results;
	}

	getBracketData() {
		if (this.isTournamentEnded()) {
			return this.getPlayerListWithScores(this.players.map(player => player.tournamentPlayer));
		}
		const swissData = [];
		const rowHeaders = [];
		for (let i = 0; i < this.matches.length; i++) {
			const match = this.matches[i];
			const row = [];
			row.push(createNameCell(match.p1.tournamentPlayer.name));
			row.push(createNameCell(match.p1.tournamentPlayer.score.toString()));
			if (match.p2) {
				row.push(createNameCell(match.p2.tournamentPlayer.name));
				row.push(createNameCell(match.p2.tournamentPlayer.score.toString()));
			} else {
				row.push(createNameCell("Bye"));
				row.push(createNameCell(""));
			}

			const cell: any = {
				state: match.state,
				type: 'matchCell',
			};
			if (match.state === 'finished' && match.score) {
				cell.result = match.result;
				cell.score = match.score.slice(0);
			}
			row.push(cell);
			swissData.push(row);
			rowHeaders.push("Match " + i + 1);
		}

		return {
			type: 'table',
			tableHeaders: {
				cols: ["Player 1", "Score", "Player 2", "Score", "Status"],
				rows: rowHeaders,
			},
			tableContents: swissData,
		};
	}

	freezeBracket(players: TournamentPlayer[]) {
		this.isBracketFrozen = true;
		this.players = Utils.shuffle(players.map(player => new SwissPlayer(player)));
		this.generateNextRoundPairings();
	}

	generateNextRoundPairings() {
		let byePlayer = null;
		const nonDQedPlayers = this.players.filter(player => !player.tournamentPlayer.isDisqualified);
		if (nonDQedPlayers.length % 2 === 1) {
			// Give a bye to the lowest-ranked player that has not received a bye yet.
			// If there are multiple, choose one at random.
			const minByes = Math.min(...nonDQedPlayers.map(player => player.byesReceived));
			const playersWithMinByes = nonDQedPlayers.filter(player => player.byesReceived === minByes);
			const minScoreAmongstPlayersWithMinByes = Math.min(...playersWithMinByes.map(player => player.tournamentPlayer.score));
			const playersWithMinScore = playersWithMinByes.filter(
				player => player.tournamentPlayer.score === minScoreAmongstPlayersWithMinByes
			);
			byePlayer = Utils.shuffle(playersWithMinScore)[0];
		}
		this.matches = [];
		const maxPossiblePoints = this.curRound + 1;
		const possiblePairs: number[][] = [];
		for (let p1 = 0; p1 < nonDQedPlayers.length; p1++) {
			const swissPlayer1 = nonDQedPlayers[p1];
			if (swissPlayer1 === byePlayer) continue;
			for (let p2 = 0; p2 < nonDQedPlayers.length; p2++) {
				const swissPlayer2 = nonDQedPlayers[p2];
				if (swissPlayer2 === byePlayer) continue;
				if (p1 < p2) {
					const match = [p1, p2];
					if (swissPlayer1.playersAlreadyPlayed.includes(swissPlayer2)) {
						match.push(0);
					} else {
						// We want a higher value for players with the same score as blossom finds the max weight matching
						match.push(maxPossiblePoints - Math.abs(swissPlayer1.tournamentPlayer.score - swissPlayer2.tournamentPlayer.score));
					}
					possiblePairs.push(match);
				}
			}
		}

		// TODO: reimplement blossom in our code
		const rawPairings = blossom(possiblePairs);
		for (let index1 = 0; index1 < rawPairings.length; index1++) {
			const index2 = rawPairings[index1];
			if (index1 > index2) {
				continue;
			}
			const swissPlayer1 = nonDQedPlayers[index1];
			const swissPlayer2 = nonDQedPlayers[index2];
			this.matches.push({
				p1: this.players[index1],
				p2: this.players[index2],
				state: 'available',
				isByeMatch: false,
			});
			swissPlayer1.playersAlreadyPlayed.push(swissPlayer2);
			swissPlayer2.playersAlreadyPlayed.push(swissPlayer1);
		}

		this.matches.sort((a, b) => this.getPlayerScore(b) - this.getPlayerScore(a));
		this.totalPendingMatches = this.matches.length;
		// The bye match should always go on the bottom
		if (byePlayer) {
			this.matches.push({
				p1: byePlayer,
				p2: null,
				state: 'finished',
				isByeMatch: true,
				score: [1, 0],
			});
			byePlayer.tournamentPlayer.score += 1;
		}
		this.curRound++;
		// TODO: Add a message in the room saying the next round has started
	}

	getPlayerScore(match: Match) {
		if (match.p2) {
			return match.p1.tournamentPlayer.score + match.p2.tournamentPlayer.score;
		} else {
			return match.p1.tournamentPlayer.score;
		}
	}
}
