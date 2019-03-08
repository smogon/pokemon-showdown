'use strict';

/** @typedef {{state: string, score?: number[], result?: string}} Match */
class RoundRobin {
	/**
	 * @param {string} isDoubles
	 */
	constructor(isDoubles) {
		/** @type {string} */
		this.name = "Round Robin";
		this.isDrawingSupported = true;

		this.isDoubles = !!isDoubles;
		this.isBracketFrozen = false;
		/** @type {User[]} */
		this.users = [];
		/** @type {boolean[]} */
		this.isUsersBusy = [];
		/** @type {(?Match)[][]} */
		this.matches = [];
		/** @type {number[]} */
		this.userScores = [];
		this.pendingMatches = new Map();
		this.totalPendingMatches = 0;

		if (isDoubles) this.name = "Double " + this.name;
	}
	/**
	 * @param {User} user
	 */
	addUser(user) {
		if (this.isBracketFrozen) return 'BracketFrozen';
		this.users.push(user);
		this.pendingMatches.set(user, 0);
	}
	/**
	 * @param {User} user
	 */
	removeUser(user) {
		if (this.isBracketFrozen) return 'BracketFrozen';
		this.users.splice(this.users.indexOf(user), 1);
		this.pendingMatches.delete(user);
	}
	/**
	 * @param {User} user
	 * @param {User} replacementUser
	 */
	replaceUser(user, replacementUser) {
		this.users[this.users.indexOf(user)] = replacementUser;
		let pendingMatches = this.pendingMatches.get(user);
		this.pendingMatches.set(replacementUser, pendingMatches);
		this.pendingMatches.delete(user);
	}
	getUsers() {
		return this.users.slice(0);
	}

	getBracketData() {
		let data = {};
		data.type = 'table';
		data.tableHeaders = {
			cols: this.users.slice(0),
			rows: this.users.slice(0),
		};
		data.tableContents = this.users.map((userA, row) =>
			this.users.map((userB, col) => {
				if (!this.isDoubles && col >= row) return null;
				if (userA === userB) return null;

				let cell = {};
				if (!this.isBracketFrozen) {
					cell.state = 'unavailable';
				} else {
					let match = this.matches[row][col];
					if (!match) return null;
					cell.state = match.state;
					if (match.state === 'finished' && match.score) {
						cell.result = match.result;
						cell.score = match.score.slice(0);
					}
				}
				return cell;
			})
		);
		data.scores = this.users.map((user, u) =>
			this.isBracketFrozen ? this.userScores[u] : 0
		);
		return data;
	}
	freezeBracket() {
		this.isBracketFrozen = true;
		this.isUsersBusy = this.users.map(() => false);
		this.matches = this.users.map((userA, row) =>
			this.users.map((userB, col) => {
				if (!this.isDoubles && col >= row) return null;
				if (userA === userB) return null;
				let pendingMatchesA = this.pendingMatches.get(userA);
				this.pendingMatches.set(userA, ++pendingMatchesA);
				let pendingMatchesB = this.pendingMatches.get(userB);
				this.pendingMatches.set(userB, ++pendingMatchesB);
				++this.totalPendingMatches;
				return {state: 'available'};
			})
		);
		this.userScores = this.users.map(() => 0);
	}

	/**
	 * @param {User} user
	 */
	disqualifyUser(user) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		let userIndex = this.users.indexOf(user);

		for (const [col, match] of this.matches[userIndex].entries()) {
			if (!match || match.state !== 'available') continue;
			match.state = 'finished';
			match.result = 'loss';
			match.score = [0, 1];
			++this.userScores[col];
			--this.totalPendingMatches;
		}

		for (const [row, challenges] of this.matches.entries()) {
			let match = challenges[userIndex];
			if (!match || match.state !== 'available') continue;
			match.state = 'finished';
			match.result = 'win';
			match.score = [1, 0];
			++this.userScores[row];
			--this.totalPendingMatches;
		}

		user.destroy();
	}
	/**
	 * @param {User} user
	 */
	getUserBusy(user) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';
		return this.isUsersBusy[this.users.indexOf(user)];
	}
	/**
	 * @param {User} user
	 * @param {boolean} isBusy
	 */
	setUserBusy(user, isBusy) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';
		this.isUsersBusy[this.users.indexOf(user)] = isBusy;
	}

	getAvailableMatches() {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		/** @type {[User, User][]} */
		let matches = [];
		for (const [row, challenges] of this.matches.entries()) {
			for (const [col, match] of challenges.entries()) {
				if (!match) continue;
				if (match.state === 'available' && !this.isUsersBusy[row] && !this.isUsersBusy[col]) {
					matches.push([this.users[row], this.users[col]]);
				}
			}
		}
		return matches;
	}
	/**
	 * @param {[User, User]} matchResult
	 * @param {string} result
	 * @param {number[]} score
	 */
	setMatchResult(matchResult, result, score) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		if (!['win', 'loss', 'draw'].includes(result)) return 'InvalidMatchResult';

		let userA = matchResult[0];
		let userB = matchResult[1];
		let userIndexA = this.users.indexOf(userA);
		let userIndexB = this.users.indexOf(userB);
		if (userIndexA < 0 || userIndexB < 0) return 'UserNotAdded';

		let match = this.matches[userIndexA][userIndexB];
		if (!match || match.state !== 'available') return 'InvalidMatch';

		let virtualScore;
		if (result === 'win') {
			virtualScore = [1, 0];
		} else if (result === 'loss') {
			virtualScore = [0, 1];
		} else {
			virtualScore = [0.5, 0.5];
		}
		if (!score) score = virtualScore;

		match.state = 'finished';
		match.result = result;
		match.score = score.slice(0);
		this.userScores[userIndexA] += virtualScore[0];
		this.userScores[userIndexB] += virtualScore[1];
		--this.totalPendingMatches;

		let pendingMatchesA = this.pendingMatches.get(userA);
		if (--pendingMatchesA === 0) userA.destroy();
		this.pendingMatches.set(userA, pendingMatchesA);
		let pendingMatchesB = this.pendingMatches.get(userB);
		if (--pendingMatchesB === 0) userB.destroy();
		this.pendingMatches.set(userB, pendingMatchesB);
	}

	isTournamentEnded() {
		return this.isBracketFrozen && this.totalPendingMatches === 0;
	}

	getResults() {
		if (!this.isTournamentEnded()) return 'TournamentNotEnded';

		let sortedScores = this.userScores.map((score, userIndex) =>
			({userIndex: userIndex, score: score})
		).sort((a, b) => b.score - a.score);

		/** @type {User[][]} */
		let results = [];
		let currentScore = sortedScores[0].score;
		/** @type {User[]} */
		let currentRank = [];
		results.push(currentRank);
		for (const score of sortedScores.values()) {
			if (score.score < currentScore) {
				currentScore = score.score;
				currentRank = [];
				results.push(currentRank);
			}
			currentRank.push(this.users[score.userIndex]);
		}
		return results;
	}
}

module.exports = RoundRobin;
