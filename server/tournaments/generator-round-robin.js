'use strict';

/** @typedef {import('./index').TournamentPlayer} TournamentPlayer */

/** @typedef {{state: string, score?: number[], result?: string}} Match */

class RoundRobin {
	/**
	 * @param {string} isDoubles
	 */
	constructor(isDoubles) {
		/** @type {string} */
		this.name = "Round Robin";
		this.isDrawingSupported = true;
		this.isBracketFrozen = false;
		/** @type {TournamentPlayer[]} */
		this.players = [];

		this.isDoubles = !!isDoubles;
		/** @type {Match?[][]} */
		this.matches = [];
		this.totalPendingMatches = -1;
		this.perPlayerPendingMatches = -1;

		if (isDoubles) this.name = "Double " + this.name;
	}

	/**
	 * @param {TournamentPlayer[]} players
	 */
	getPendingBracketData(players) {
		return {
			type: 'table',
			tableHeaders: {
				cols: players.slice(0),
				rows: players.slice(0),
			},
			tableContents: players.map((p1, row) =>
				players.map((p2, col) => {
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
			tableContents: players.map((p1, row) =>
				players.map((p2, col) => {
					if (!this.isDoubles && col >= row) return null;
					if (p1 === p2) return null;
					let match = this.matches[row][col];
					if (!match) return null;

					/** @type {any} */
					let cell = {
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
	/**
	 * @param {TournamentPlayer[]} players
	 */
	freezeBracket(players) {
		this.players = players;
		this.isBracketFrozen = true;

		this.matches = players.map((p1, row) =>
			players.map((p2, col) => {
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

	/**
	 * @param {TournamentPlayer} user
	 */
	disqualifyUser(user) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		let playerIndex = this.players.indexOf(user);

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
			let match = challenges[playerIndex];
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

		/** @type {[TournamentPlayer, TournamentPlayer][]} */
		let matches = [];
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
	/**
	 * @param {[TournamentPlayer, TournamentPlayer]} players
	 * @param {string} result
	 * @param {number[]} score
	 */
	setMatchResult([p1, p2], result, score) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		if (!['win', 'loss', 'draw'].includes(result)) return 'InvalidMatchResult';

		let row = this.players.indexOf(p1);
		let col = this.players.indexOf(p2);
		if (row < 0 || col < 0) return 'UserNotAdded';

		let match = this.matches[row][col];
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

		let sortedScores = this.players.sort(
			(p1, p2) => p2.score - p1.score
		);

		/** @type {TournamentPlayer[][]} */
		let results = [];
		let currentScore = sortedScores[0].score;
		/** @type {TournamentPlayer[]} */
		let currentRank = [];
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

module.exports = RoundRobin;
