var RoundRobin = (function () {
	function RoundRobin(isDoubles) {
		this.isDoubles = !!isDoubles;
		this.isBracketFrozen = false;
		this.users = [];
		this.isUsersBusy = null;
		this.matches = null;
		this.userScores = null;
		this.pendingMatches = 0;

		if (isDoubles)
			this.name = "Double " + this.name;
	}

	RoundRobin.prototype.name = "Round Robin";
	RoundRobin.prototype.isDrawingSupported = true;

	RoundRobin.prototype.addUser = function (user) {
		if (this.isBracketFrozen)
			return 'BracketFrozen';

		if (this.users.indexOf(user) >= 0)
			return 'UserAlreadyAdded';

		this.users.push(user);
	};
	RoundRobin.prototype.removeUser = function (user) {
		if (this.isBracketFrozen)
			return 'BracketFrozen';

		var userIndex = this.users.indexOf(user);
		if (userIndex < 0)
			return 'UserNotAdded';

		this.users.splice(userIndex, 1);
	};
	RoundRobin.prototype.replaceUser = function (user, replacementUser) {
		var userIndex = this.users.indexOf(user);
		if (userIndex < 0)
			return 'UserNotAdded';

		if (this.users.indexOf(replacementUser) >= 0)
			return 'UserAlreadyAdded';

		this.users[userIndex] = replacementUser;
	};
	RoundRobin.prototype.getUsers = function () {
		return this.users.slice(0);
	};

	RoundRobin.prototype.getBracketData = function () {
		var data = {};
		data.type = 'table';
		data.tableHeaders = {
			cols: this.users.slice(0),
			rows: this.users.slice(0)
		};
		data.tableContents = this.users.map(function (userA, row) {
			return this.users.map(function (userB, col) {
				if (!this.isDoubles && col >= row)
					return null;
				if (userA === userB)
					return null;

				var cell = {};
				if (!this.isBracketFrozen)
					cell.state = 'unavailable';
				else {
					var match = this.matches[row][col];
					cell.state = match.state;
					if (match.state === 'finished') {
						cell.result = match.result;
						cell.score = match.score.slice(0);
					}
				}
				return cell;
			}, this);
		}, this);
		data.scores = this.users.map(function (user, u) {
			return this.isBracketFrozen ? this.userScores[u] : 0;
		}, this);
		return data;
	};
	RoundRobin.prototype.freezeBracket = function () {
		this.isBracketFrozen = true;
		this.isUsersBusy = this.users.map(function () { return false; });
		this.matches = this.users.map(function (userA, row) {
			return this.users.map(function (userB, col) {
				if (!this.isDoubles && col >= row)
					return null;
				if (userA === userB)
					return null;
				++this.pendingMatches;
				return {state: 'available'};
			}, this);
		}, this);
		this.userScores = this.users.map(function () { return 0; });
	};

	RoundRobin.prototype.disqualifyUser = function (user) {
		if (!this.isBracketFrozen)
			return 'BracketNotFrozen';

		var userIndex = this.users.indexOf(user);
		if (userIndex < 0)
			return 'UserNotAdded';

		this.matches[userIndex].forEach(function (match, col) {
			if (!match || match.state !== 'available')
				return;
			match.state = 'finished';
			match.result = 'loss';
			match.score = [0, 1];
			++this.userScores[col];
			--this.pendingMatches;
		}, this);

		this.matches.forEach(function (challenges, row) {
			var match = challenges[userIndex];
			if (!match || match.state !== 'available')
				return;
			match.state = 'finished';
			match.result = 'win';
			match.score = [1, 0];
			++this.userScores[row];
			--this.pendingMatches;
		}, this);
	};
	RoundRobin.prototype.getUserBusy = function (user) {
		if (!this.isBracketFrozen)
			return 'BracketNotFrozen';

		var userIndex = this.users.indexOf(user);
		if (userIndex < 0)
			return 'UserNotAdded';
		return this.isUsersBusy[userIndex];
	};
	RoundRobin.prototype.setUserBusy = function (user, isBusy) {
		if (!this.isBracketFrozen)
			return 'BracketNotFrozen';

		var userIndex = this.users.indexOf(user);
		if (userIndex < 0)
			return 'UserNotAdded';
		this.isUsersBusy[userIndex] = isBusy;
	};

	RoundRobin.prototype.getAvailableMatches = function () {
		if (!this.isBracketFrozen)
			return 'BracketNotFrozen';

		var matches = [];
		this.matches.forEach(function (challenges, row) {
			challenges.forEach(function (match, col) {
				if (!match)
					return;
				if (match.state === 'available' &&
					!this.isUsersBusy[row] && !this.isUsersBusy[col])
					matches.push([this.users[row], this.users[col]]);
			}, this);
		}, this);
		return matches;
	};
	RoundRobin.prototype.setMatchResult = function (match, result, score) {
		if (!this.isBracketFrozen)
			return 'BracketNotFrozen';

		if (!(result in {win:1, loss:1, draw:1}))
			return 'InvalidMatchResult';

		var userIndexA = this.users.indexOf(match[0]);
		var userIndexB = this.users.indexOf(match[1]);
		if (userIndexA < 0 || userIndexB < 0)
			return 'UserNotAdded';

		match = this.matches[userIndexA][userIndexB];
		if (!match || match.state !== 'available')
			return 'InvalidMatch';

		var virtualScore;
		if (result === 'win')
			virtualScore = [1, 0];
		else if (result === 'loss')
			virtualScore = [0, 1];
		else
			virtualScore = [0.5, 0.5];
		if (!score)
			score = virtualScore;

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
		if (!this.isTournamentEnded())
			return 'TournamentNotEnded';

		var sortedScores = this.userScores.map(function (score, userIndex) {
			return {userIndex: userIndex, score: score};
		}).sort(function (a, b) { return b.score - a.score; });

		var results = [];
		var currentScore = sortedScores[0].score;
		var currentRank = [];
		results.push(currentRank);
		sortedScores.forEach(function (score) {
			if (score.score < currentScore) {
				currentScore = score.score;
				currentRank = [];
				results.push(currentRank);
			}
			currentRank.push(this.users[score.userIndex]);
		}, this);
		return results;
	};

	return RoundRobin;
})();

exports.RoundRobin = RoundRobin;
