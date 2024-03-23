import {Utils} from '../../lib';
import {BracketData, Generator, TournamentPlayer} from './index';

interface Match {
	/** Second player is null for bye */
	players: [SwissPlayer, SwissPlayer | null];
	state: 'available' | 'finished' | 'unavailable';
	result?: string;
	score?: number[];
}

class SwissPlayer {
	user: TournamentPlayer;
	matches: [SwissPlayer, string][];
	bye: number;
	/** Opponents' Win % */
	owp: number;
	/** Opponents' Opponents' Win % */
	oowp: number;
	lockResistance: boolean;
	constructor(user: TournamentPlayer) {
		this.user = user;
		this.matches = [];
		this.bye = 0;
		this.owp = 0.25;
		this.oowp = 0.25;
		this.lockResistance = false;
	}

	getWL() {
		const draws = this.user.games - this.user.wins - this.user.losses;
		return `${this.user.wins}-${this.user.losses}${draws > 0 ? `-${draws}` : ''}${this.user.isDisqualified ? ' (DQ)' : ''}`;
	}

	recalculateOWP() {
		if (this.lockResistance || !this.matches.length) return;
		let totalWP = 0;
		for (const [opp] of this.matches) {
			let wp = Math.max(opp.matches.filter(([_, result]) => result === 'win').length / opp.matches.length, 0.25);
			if (opp.user.isDisqualified) wp = Math.min(wp, 0.75);
			totalWP += wp;
		}
		this.owp = totalWP / this.matches.length;
	}
	recalculateOOWP() {
		if (this.lockResistance || !this.matches.length) return;
		let totalOWP = 0;
		for (const [opp] of this.matches) {
			totalOWP += opp.owp;
		}
		this.oowp = totalOWP / this.matches.length;
	}

	checkTie(otherPlayer: SwissPlayer) {
		if ((this.user.score - this.bye) !== (otherPlayer.user.score - otherPlayer.bye)) return false;
		if (this.owp !== otherPlayer.owp) return false;
		if (this.oowp !== otherPlayer.oowp) return false;
		return true;
	}
}

export class Swiss implements Generator {
	readonly name = 'Swiss';
	readonly isDrawingSupported = true;
	isBracketFrozen: boolean;
	players: SwissPlayer[];
	matches: Match[];
	currentRound: number;
	rounds: number;
	ended: boolean;
	constructor() {
		this.isBracketFrozen = false;
		this.players = [];
		this.matches = [];
		this.currentRound = 0;
		this.rounds = 0;
		this.ended = false;
	}

	getPendingBracketData(players: TournamentPlayer[]): BracketData {
		return {
			type: 'tree',
		};
	}
	getBracketData(): BracketData {
		if (this.ended) {
			return {
				type: 'table',
				tableHeaders: {
					cols: ['Player', 'Record', 'Op Win %', 'Op Op Win %'],
					rows: Array.from(this.players, (_, i) => i + 1),
				},
				tableContents: this.players.map(player => [
					{text: player.user.name},
					{text: player.getWL()},
					{text: (player.owp * 100).toFixed(2) + '%'},
					{text: (player.oowp * 100).toFixed(2) + '%'},
				]),
			};
		} else {
			return {
				type: 'table',
				tableHeaders: {
					cols: ['Player 1', 'Record', 'Player 2', 'Record', 'Status'],
					rows: Array.from(this.matches, (_, i) => `Match ${i + 1}`),
				},
				tableContents: this.matches.map(match => {
					const status: AnyObject = {
						state: match.state,
					};
					if (match.state === 'finished') {
						status.result = match.result;
						status.score = match.score;
					}
					const pendingChallenge = match.players[0].user.pendingChallenge;
					const inProgressMatch = match.players[0].user.inProgressMatch;
					if (pendingChallenge) {
						status.state = 'challenging';
					} else if (inProgressMatch) {
						status.state = 'inprogress';
						status.room = inProgressMatch.room.roomid;
					}
					return [
						{text: match.players[0].user.name},
						{text: match.players[0].getWL()},
						{text: match.players[1]?.user.name || 'BYE'},
						{text: match.players[1]?.getWL() || ''},
						status,
					];
				}),
			};
		}
	}
	freezeBracket(players: TournamentPlayer[]) {
		this.players = Utils.shuffle(players.map(player => new SwissPlayer(player)));
		this.isBracketFrozen = true;
		this.rounds = Math.ceil(Math.log2(this.players.length));
		this.advanceRound();
	}
	disqualifyUser(user: TournamentPlayer) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		const player = this.players.find(p => p.user === user)!;
		const match = this.matches.find(m => m.players[0] === player || m.players[1] === player);
		if (match && match.state === 'available') {
			let opponent;
			if (match.players[0] === player) {
				opponent = match.players[1]!;
				match.result = 'loss';
				match.score = [0, 1];
			} else {
				opponent = match.players[0];
				match.result = 'win';
				match.score = [1, 0];
			}
			player.user.losses++;
			player.matches.push([opponent, 'loss']);
			opponent.user.wins++;
			opponent.user.score++;
			opponent.matches.push([player, 'win']);
			match.state = 'finished';
		}
		if (this.matches.every(m => m.state === 'finished' || m.state === 'unavailable')) {
			this.advanceRound();
		}

		user.game.setPlayerUser(user, null);
	}
	sortPlayers(finalResults = false) {
		// OOWP depends on OWP of all players, so we need to calculate all OWPs first
		for (const player of this.players) {
			player.recalculateOWP();
		}
		for (const player of this.players) {
			player.recalculateOOWP();
		}

		if (finalResults) {
			this.players.sort((a, b) => b.user.score - a.user.score || b.owp - a.owp || b.oowp - a.oowp);

			const groups: SwissPlayer[][] = [];
			let currentGroup: SwissPlayer[] = [];
			for (const player of this.players) {
				if (!currentGroup.length || player.checkTie(currentGroup[0])) {
					currentGroup.push(player);
				} else {
					groups.push(currentGroup);
					currentGroup = [player];
				}
			}
			groups.push(currentGroup);

			// Final tiebreaker. Head to Head if applicable, or shuffle
			this.players = groups.flatMap(group => {
				if (group.length === 2) {
					const match = group[0].matches.find(([opponent]) => opponent === group[1]);
					if (match) {
						if (match[1] === 'win') return group;
						if (match[1] === 'loss') return [group[1], group[0]];
					}
				}
				return Utils.shuffle(group);
			});
		} else {
			this.players.sort((a, b) => b.user.score - a.user.score);

			const groups: SwissPlayer[][] = [];
			let currentGroup: SwissPlayer[] = [];
			for (const player of this.players) {
				if (!currentGroup.length || currentGroup[0].user.score - player.user.score <= 0.5) {
					currentGroup.push(player);
				} else {
					groups.push(currentGroup);
					currentGroup = [player];
				}
			}
			groups.push(currentGroup);

			this.players = groups.flatMap(Utils.shuffle);
		}
	}
	advanceRound() {
		if (this.currentRound === this.rounds) {
			this.ended = true;
			return;
		}
		this.currentRound++;

		this.sortPlayers();
		for (const player of this.players) {
			if (player.user.isDisqualified) player.lockResistance = true;
		}

		const players = this.players.filter(p => !p.user.isDisqualified);
		const pairedPlayers = new Set<SwissPlayer>();
		this.matches = [];

		// If odd number of players, give a bye to the lowest ranked player who has not had a bye
		let byePlayer: SwissPlayer | undefined;
		if (players.length % 2 === 1) {
			for (let i = players.length - 1; i >= 0; i--) {
				if (players[i].bye === 0) {
					byePlayer = players[i];
					pairedPlayers.add(byePlayer);
					break;
				}
			}
		}

		for (let i = 0; i < players.length; i++) {
			const p1 = players[i];
			if (pairedPlayers.has(p1)) continue;
			let p2: SwissPlayer | undefined;
			for (let j = i + 1; j < players.length; j++) {
				if (pairedPlayers.has(players[j])) continue;
				if (p1.matches.some(([opponent]) => opponent === players[j])) continue;
				p2 = players[j];
				break;
			}
			// If we already played everyone, just allow the repair
			p2 ||= players.slice(i + 1).find(p => !pairedPlayers.has(p));
			if (!p2) throw new Error(`Failed to pair player ${p1.user.name}`);
			this.matches.push({players: [p1, p2], state: 'available'});
			pairedPlayers.add(p1);
			pairedPlayers.add(p2);
		}

		// Doing this here so the match gets added at the end
		if (byePlayer) {
			this.matches.push({players: [byePlayer, null], state: 'unavailable'});
			byePlayer.bye = 1;
			byePlayer.user.wins++;
			byePlayer.user.score++;
		}
	}
	getAvailableMatches() {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';

		const matches: [TournamentPlayer, TournamentPlayer][] = [];
		for (const match of this.matches) {
			if (match.state !== 'available') continue;
			if (match.players.some(p => p!.user.isBusy)) continue;
			matches.push([match.players[0].user, match.players[1]!.user]);
		}
		return matches;
	}
	setMatchResult(match: [TournamentPlayer, TournamentPlayer], result: string, score: number[]) {
		if (!this.isBracketFrozen) return 'BracketNotFrozen';
		if (!['win', 'loss', 'draw'].includes(result)) return 'InvalidMatchResult';
		const p1 = this.players.find(p => p.user === match[0]);
		const p2 = this.players.find(p => p.user === match[1]);
		if (!p1 || !p2) return 'UserNotAdded';
		const swissMatch = this.matches.find(m => m.players[0] === p1 && m.players[1] === p2);
		if (!swissMatch || swissMatch.state !== 'available') return 'InvalidMatch';

		switch (result) {
		case 'win':
			p1.matches.push([p2, 'win']);
			p2.matches.push([p1, 'loss']);
			break;
		case 'loss':
			p1.matches.push([p2, 'loss']);
			p2.matches.push([p1, 'win']);
			break;
		default:
			p1.matches.push([p2, 'draw']);
			p2.matches.push([p1, 'draw']);
			break;
		}

		swissMatch.state = 'finished';
		swissMatch.result = result;
		swissMatch.score = score.slice();
		if (this.matches.every(m => m.state === 'finished' || m.state === 'unavailable')) {
			this.advanceRound();
		}
	}
	isTournamentEnded() {
		return this.ended;
	}
	getResults() {
		if (!this.isTournamentEnded()) return 'TournamentNotEnded';

		this.sortPlayers(true);
		return this.players.map(p => [p.user]);
	}
}
