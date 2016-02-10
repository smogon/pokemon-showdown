'use strict';

let RoundRobin = (function () {
	function RoundRobin(isDoubles) {
		this.isDoubles = !!isDoubles;
		this.isBracketFrozen = false;
		this.users = [];
		this.isUsersBusy = null;
		this.matches = null;
		this.userScores = null;
		this.pendingMatches = 0;

		if (isDoubles) this.name = "Double " + this.name;
	}

	RoundRobin.prototype.name = "Round Robin";
	RoundRobin.prototype.isDrawingSupported = true;

	RoundRobin.prototype.addUser = function (user) {
		if (this.isBracketFrozen) return 'BracketFrozen';

		if (this.users.indexOf(user) >= 0) return 'UserAlreadyAdded';

		this.users.push(user);
	};
	RoundRobin.prototype.removeUser = function (user) {
		if (this.isBracketFrozen) return 'BracketFrozen';

		let userIndex = this.users.indexOf(user);
		if (userIndex < 0) return 'UserNotAdded';

		this.users.splice(userIndex, 1);
	};
	RoundRobin.prototype.replaceUser = function (user, replacementUser) {
		let userIndex = this.users.indexOf(user);
		if (userIndex < 0) return 'UserNotAdded';

		if (this.users.indexOf(replacementUser) >= 0) return 'UserAlreadyAdded';

		this.users[userIndex] = replacementUser;
	};
	RoundRobin.prototype.getUsers = function () {
		return this.users.slice(0);
	};

	RoundRobin.prototype.getBracketData = function () {
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
					cell.state = match.state;
					if (match.state === 'finished') {
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
	};
	RoundRobin.prototype.freezeBracket = function () {
		this.isBracketFrozen = true;
		this.isUsersBusy = this.users.map(() => false);
		this.matches = this.users.map((userA, row) =>
			this.users.map((userB, col) => {
				if (!this.isDoubles && col >= row) return null;
				if (userA === userB) return null;
				++this.pendingMatches;
				return {state: 'available'};
			})
		);
		this.userScores = this.users.map(() => 0);
	};

	RoundRobin.prototype.disqualifyUser = function (user) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		let userIndex = this.users.indexOf(user);
		if (userIndex < 0) return 'UserNotAdded';

		this.matches[userIndex].forEach((match, col) => {
			if (!match || match.state !== 'available') return;
			match.state = 'finished';
			match.result = 'loss';
			match.score = [0, 1];
			++this.userScores[col];
			--this.pendingMatches;
		});

		this.matches.forEach((challenges, row) => {
			let match = challenges[userIndex];
			if (!match || match.state !== 'available') return;
			match.state = 'finished';
			match.result = 'win';
			match.score = [1, 0];
			++this.userScores[row];
			--this.pendingMatches;
		});
	};
	RoundRobin.prototype.getUserBusy = function (user) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		let userIndex = this.users.indexOf(user);
		if (userIndex < 0) return 'UserNotAdded';
		return this.isUsersBusy[userIndex];
	};
	RoundRobin.prototype.setUserBusy = function (user, isBusy) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		let userIndex = this.users.indexOf(user);
		if (userIndex < 0) return 'UserNotAdded';
		this.isUsersBusy[userIndex] = isBusy;
	};

	RoundRobin.prototype.getAvailableMatches = function () {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		let matches = [];
		this.matches.forEach((challenges, row) => {
			challenges.forEach((match, col) => {
				if (!match) return;
				if (match.state === 'available' && !this.isUsersBusy[row] && !this.isUsersBusy[col]) {
					matches.push([this.users[row], this.users[col]]);
				}
			});
		});
		return matches;
	};
	RoundRobin.prototype.setMatchResult = function (match, result, score) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		if (!(result in {win:1, loss:1, draw:1})) return 'InvalidMatchResult';

		let userIndexA = this.users.indexOf(match[0]);
		let userIndexB = this.users.indexOf(match[1]);
		if (userIndexA < 0 || userIndexB < 0) return 'UserNotAdded';

		match = this.matches[userIndexA][userIndexB];
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
		--this.pendingMatches;
	};

	RoundRobin.prototype.isTournamentEnded = function () {
		return this.isBracketFrozen && this.pendingMatches === 0;
	};

	RoundRobin.prototype.getResults = function () {
		if (!this.isTournamentEnded()) return 'TournamentNotEnded';

		let sortedScores = this.userScores.map((score, userIndex) =>
			({userIndex: userIndex, score: score})
		).sort((a, b) => b.score - a.score);

		let results = [];
		let currentScore = sortedScores[0].score;
		let currentRank = [];
		results.push(currentRank);
		sortedScores.forEach(score => {
			if (score.score < currentScore) {
				currentScore = score.score;
				currentRank = [];
				results.push(currentRank);
			}
			currentRank.push(this.users[score.userIndex]);
		});
		return results;
	};

	return RoundRobin;
})();

exports.RoundRobin = RoundRobin;
