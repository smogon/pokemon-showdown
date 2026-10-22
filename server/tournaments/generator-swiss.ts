import { Utils } from "../../lib/utils";
import type { TournamentPlayer } from "./index";

interface Match {
	player1: TournamentPlayer;
	player2: TournamentPlayer;
	state: 'available' | 'finished';
	score?: number[];
	result?: string;
}

class SwissRound {
	matches: Match[] = [];
	bye?: TournamentPlayer;

	getMatch(player: TournamentPlayer): Match | undefined {
		return this.matches.find(
			match => match.player1 === player || match.player2 === player
		);
	}
}

export class Swiss {
	readonly name: string;
	readonly isDrawingSupported: boolean;
	isBracketFrozen: boolean;
	players: TournamentPlayer[];
	rounds: SwissRound[];
	roundLimit: number;

	constructor() {
		this.name = "Swiss";
		this.isDrawingSupported = true;
		this.isBracketFrozen = false;
		this.players = []
		this.rounds = [];
		this.roundLimit = -1;
	}

	getPendingBracketData(players: TournamentPlayer[]) {
		return {
			type: "swiss",
			roundLimit: this.roundLimit,
			rounds: [],
			players: players.map(player => ({
				name: player.name,
				score: player.score,
				isDisqualified: player.isDisqualified,
			})),
		}
	}

	getBracketData() {
		const players = this.players;
		return {
			type: "swiss",
			roundLimit: this.roundLimit,
			rounds: this.rounds.map(round => ({
				matches: round.matches.map(match => ({
					...match,
					score: match.score?.slice()
				})),
				bye: round.bye,
			})),
			players: players.map(player => ({
				name: player.name,
				score: player.score,
				isDisqualified: player.isDisqualified,
			})),
		}
	}

	pairPlayers(players: TournamentPlayer[], allowRematches: true): Match[];
	pairPlayers(players: TournamentPlayer[], allowRematches?: false): Match[] | null;
	pairPlayers(
		players: TournamentPlayer[],
		allowRematches: boolean = false
	): Match[] | null {
		// The caller must assign any bye before requesting pairings.
		if (players.length % 2) {
			throw new Error('Must have an even number of players to pair.');
		};

		// Hashmap ensures that player doesn't play an opponent twice
		const opponents = new Map<TournamentPlayer, Set<TournamentPlayer>>();
		for (const player of players) opponents.set(player, new Set());
		for (const round of this.rounds) {
			for (const match of round.matches) {
				opponents.get(match.player1)?.add(match.player2);
				opponents.get(match.player2)?.add(match.player1);
			}
		}

		// Randomize equal scores without changing the caller's player order.
		const sortedPlayers = Utils.sortBy(Utils.shuffle([...players]), player => -player.score);

		const pair = (remaining: TournamentPlayer[]): Match[] | null => {
			if (!remaining.length) return [];

			const player1 = remaining[0];
			const candidates = Utils.sortBy(
				// Remove opponents player1 has already played
				remaining.slice(1).filter(
					player => allowRematches || !opponents.get(player1)!.has(player)
				),
				// Sort by the difference in their scores
				player => [
					opponents.get(player1)!.has(player) ? 1 : 0,
					Math.abs(player1.score - player.score)
				]
			);
			for (const player2 of candidates) {
				// Remove our new match
				const removedPlayers = remaining.filter(player => player !== player1 && player !== player2);

				// Recurse
				const matches = pair(removedPlayers);

				// If this pair fails to produce a valid set of matches,
				// fail and try another pair.
				if (matches !== null) {
					return [{ player1, player2, state: 'available' }, ...matches];
				}
			}

			return null;
		};
		const matches = pair(sortedPlayers);
		if (allowRematches && matches === null) {
			throw new Error('Unable to pair players with rematches allowed.');
		}
		return matches;
	}

	createNextRound(): SwissRound {
		const activePlayers = this.players.filter(player => !player.isDisqualified);

		const round = new SwissRound();

		if (activePlayers.length % 2) {
			const playersWhoHadABye = new Set(
				this.rounds.flatMap(round => round.bye ? [round.bye] : [])
			);

			// Sort players by those who have had a bye,
			// then those who need a bye (low score)
			const orderedCandidates = Utils.sortBy(
				Utils.shuffle([...activePlayers]),
				player => [
					playersWhoHadABye.has(player) ? 1 : 0,
					player.score
				]
			);

			for (const byePlayer of orderedCandidates) {
				const tryPairing = activePlayers.filter(player => player !== byePlayer);

				const matches = this.pairPlayers(tryPairing);

				// If this byePlayer fails to produce a valid set of matches,
				// fail and try another byePlayer.
				if (matches !== null) {
					round.matches = matches;
					round.bye = byePlayer;
					return round;
				}
			}

			// Trying to have no rematches doesn't work; allow rematches
			const byePlayer = orderedCandidates[0];
			const remainingPlayers = activePlayers.filter(player => player !== byePlayer);

			const matches = this.pairPlayers(remainingPlayers, true);
			round.matches = matches;
			round.bye = byePlayer;
			return round;
		} else {
			let matches = this.pairPlayers(activePlayers) ??
				this.pairPlayers(activePlayers, true);
			round.matches = matches;
			return round;
		}
	}

	freezeBracket(players: TournamentPlayer[]) {
		this.players = players;
		if (this.roundLimit === -1) {
			this.roundLimit = Math.ceil(Math.log2(players.length));
		}

		const round = this.createNextRound();
		if (!round) throw new Error(`Unable to pair players for the first Swiss round`);
		this.rounds.push(round);
		if (round.bye) round.bye.score += 1;
		this.isBracketFrozen = true;
	}

	disqualifyUser(user: TournamentPlayer) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';
		if (!this.players.includes(user)) return 'UserNotAdded';

		const round = this.rounds[this.rounds.length - 1];
		const match = round.getMatch(user);
		if (match?.state === 'available') {
			const isPlayer1 = match.player1 === user;
			const opponent = isPlayer1 ? match.player2 : match.player1;

			opponent.score += 1;
			opponent.wins += 1;
			opponent.games += 1;
			user.losses += 1;
			user.games += 1;

			const error = this.setMatchResult(
				[match.player1, match.player2],
				isPlayer1 ? 'loss' : 'win',
				match.player1 === user ? [0, 1] : [1, 0]
			);
			if (error) throw new Error(`Unexpected ${error} from setMatchResult during disqualification`);
		}

		user.game.updatePlayer(user, null);
	}

	getAvailableMatches() {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		const round = this.rounds[this.rounds.length - 1];
		const matches: [TournamentPlayer, TournamentPlayer][] = [];

		for (const match of round.matches) {
			if (match.state === 'available' &&
				!match.player1.isBusy &&
				!match.player2.isBusy) {
				matches.push([match.player1, match.player2]);
			}
		}

		return matches;
	}

	setMatchResult([p1, p2]: [TournamentPlayer, TournamentPlayer], result: 'win' | 'loss' | 'draw', score: number[]) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		if (!this.players.includes(p1) || !this.players.includes(p2)) return 'UserNotAdded';

		const round = this.rounds[this.rounds.length - 1];

		let targetMatch = round.getMatch(p1);

		if (targetMatch === undefined) return 'InvalidMatch';

		if (targetMatch.state !== 'available') return 'MatchAlreadyFinished';
		if (targetMatch.player1 !== p1 || targetMatch.player2 !== p2) {
			return 'InvalidMatch';
		}

		targetMatch.state = 'finished';
		targetMatch.result = result;
		targetMatch.score = score.slice();

		if (
			round.matches.every(match => match.state === 'finished') &&
				!this.isTournamentEnded()
		) {
			const nextRound = this.createNextRound();
			this.rounds.push(nextRound);
			if (nextRound.bye) {
				nextRound.bye.score += 1;
			}
		}
	}

	isTournamentEnded() {
		const activePlayers = this.players.filter(player => !player.isDisqualified);

		return this.isBracketFrozen && (
			activePlayers.length < 2 || (
				this.rounds.length >= this.roundLimit &&
				this.rounds[this.rounds.length - 1].matches.every(
					match => match.state === 'finished'
				)
			)
		);
	}

	getResults() {
		if (!this.isTournamentEnded()) return 'TournamentNotEnded';

		// Do we want DQed players to potentially get the top score?
		// If not, then just copy the `activePlayers` assignment
		// from `isTournamentEnded`.
		const sortedScores = Utils.sortBy([...this.players], p => -p.score);

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
