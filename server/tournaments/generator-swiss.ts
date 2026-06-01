interface Match {
	state: string;
	score?: number[];
	result?: string;
}

import { Utils } from "../../lib/utils";
import type { TournamentPlayer } from "./index";

export class Swiss {
	readonly name: string;
	readonly isDrawingSupported: boolean;
	isBracketFrozen: boolean;
	players: TournamentPlayer[];
	matches: (Match | null)[][];
	totalPendingMatches: number;
	perPlayerPendingMatches: number;
	matchesPerPlayer?: number;

	constructor() {
		this.name = "Swiss";
		this.isDrawingSupported = true;
		this.isBracketFrozen = false;
		this.players = []

		this.matches = [];
		this.totalPendingMatches = -1;
		this.perPlayerPendingMatches = -1;
	}

	getPendingBracketData(players: TournamentPlayer[]) {
		return {
			type: ""
		}
	}
}
