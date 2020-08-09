interface Match {
	state: string;
	score?: number[];
	result?: string;
}

import type {TournamentPlayer} from './index';

export class RoundRobin {
	readonly name: string;
	readonly isDrawingSupported: boolean;
	readonly isDoubles: boolean;
	isBracketFrozen: boolean;
	players: TournamentPlayer[];
	matches: (Match | null)[][];
	totalPendingMatches: number;
	perPlayerPendingMatches: number;
	matchesPerPlayer?: number;
	constructor(isDoubles: string) {
		this.name = "Round Robin";
		this.isDrawingSupported = true;
		this.isDoubles = !!isDoubles;
		this.isBracketFrozen = false;
		this.players = [];

		this.matches = [];
		this.totalPendingMatches = -1;
		this.perPlayerPendingMatches = -1;

		if (isDoubles) this.name = "Double " + this.name;
	}

	getPendingBracketData(players: TournamentPlayer[]) {
		return {
			type: 'table',
			tableHeaders: {
				cols: players.slice(0),
				rows: players.slice(0),
			},
			tableContents: players.map(
				(p1, row) => players.map((p2, col) => {
					if (!this.isDoubles && col >= row) return null;
					if (p1 === p2) return null;

					return {
						state: 'unavailable',
					};
				})
			),
			scores: players.map(player => 0),
		};
	}
	getBracketData() {
		const players = this.players;
		return {
			type: 'table',
			tableHeaders: {
				cols: players.slice(0),
				rows: players.slice(0),
			},
			tableContents: players.map(
				(p1, row) => players.map((p2, col) => {
					if (!this.isDoubles && col >= row) return null;
					if (p1 === p2) return null;
					const match = this.matches[row][col];
					if (!match) return null;

					const cell: any = {
						state: match.state,
					};
					if (match.state === 'finished' && match.score) {
						cell.result = match.result;
						cell.score = match.score.slice(0);
					}
					return cell;
				})
			),
			scores: players.map(player => player.score),
		};
	}
	freezeBracket(players: TournamentPlayer[]) {
		this.players = players;
		this.isBracketFrozen = true;

		this.matches = players.map(
			(p1, row) => players.map((p2, col) => {
				if (!this.isDoubles && col >= row) return null;
				if (p1 === p2) return null;

				return {state: 'available'};
			})
		);
		this.matchesPerPlayer = players.length - 1;
		// total matches = total players * matches per player / players per match
		// alternatively: the (playercount)th triangular number
		this.totalPendingMatches = players.length * this.matchesPerPlayer / 2;
		if (this.isDoubles) {
			this.totalPendingMatches *= 2;
			this.matchesPerPlayer *= 2;
		}
	}

	disqualifyUser(user: TournamentPlayer) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		const playerIndex = this.players.indexOf(user);

		for (const [col, match] of this.matches[playerIndex].entries()) {
			if (!match || match.state !== 'available') continue;
			const p2 = this.players[col];
			match.state = 'finished';
			match.result = 'loss';
			match.score = [0, 1];
			p2.score += 1;
			p2.games += 1;
			this.totalPendingMatches--;
		}

		for (const [row, challenges] of this.matches.entries()) {
			const match = challenges[playerIndex];
			if (!match || match.state !== 'available') continue;
			const p1 = this.players[row];
			match.state = 'finished';
			match.result = 'win';
			match.score = [1, 0];
			p1.score += 1;
			p1.games += 1;
			this.totalPendingMatches--;
		}

		user.unlinkUser();
	}

	getAvailableMatches() {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		const matches: [TournamentPlayer, TournamentPlayer][] = [];
		for (const [row, challenges] of this.matches.entries()) {
			const p1 = this.players[row];
			for (const [col, match] of challenges.entries()) {
				const p2 = this.players[col];
				if (!match) continue;
				if (match.state === 'available' && !p1.isBusy && !p2.isBusy) {
					matches.push([p1, p2]);
				}
			}
		}
		return matches;
	}
	setMatchResult([p1, p2]: [TournamentPlayer, TournamentPlayer], result: string, score: number[]) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		if (!['win', 'loss', 'draw'].includes(result)) return 'InvalidMatchResult';

		const row = this.players.indexOf(p1);
		const col = this.players.indexOf(p2);
		if (row < 0 || col < 0) return 'UserNotAdded';

		const match = this.matches[row][col];
		if (!match || match.state !== 'available') return 'InvalidMatch';

		match.state = 'finished';
		match.result = result;
		match.score = score.slice(0);
		this.totalPendingMatches--;
	}

	isTournamentEnded() {
		return this.isBracketFrozen && this.totalPendingMatches === 0;
	}

	getResults() {
		if (!this.isTournamentEnded()) return 'TournamentNotEnded';

		const sortedScores = this.players.slice().sort(
			(p1, p2) => p2.score - p1.score
		);

		const results: TournamentPlayer[][] = [];
		let currentScore = sortedScores[0].score;
		let currentRank: TournamentPlayer[] = [];
		results.push(currentRank);
		for (const player of sortedScores) {
			if (player.score < currentScore) {
				currentScore = player.score;
				currentRank = [];
				results.push(currentRank);
			}
			currentRank.push(player);
		}
		return results;
	}
}
