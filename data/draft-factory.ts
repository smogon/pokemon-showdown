import {PRNG} from "../sim/prng";
import {deepClone} from "../lib/utils";

interface DraftPokemonSet extends Partial<PokemonSet> {
	teraCaptain?: boolean;
}

const sampleData: [DraftPokemonSet[], DraftPokemonSet[]][] = [
	[
		[
			{
				name: 'Fred',
				species: 'Furret',
				item: 'Choice Scarf',
				ability: 'Frisk',
				moves: ['trick', 'doubleedge', 'knockoff', 'uturn'],
				nature: 'Jolly',
				evs: {hp: 8, atk: 252, def: 0, spa: 0, spd: 0, spe: 252},
				teraCaptain: true,
				teraType: 'Normal',
			},
		],
		[
			{
				species: 'Ampharos',
				item: 'Choice Specs',
				ability: 'Static',
				moves: ['dazzlinggleam', 'thunderbolt', 'focusblast', 'voltswitch'],
				nature: 'Modest',
				evs: {hp: 248, atk: 0, def: 8, spa: 252, spd: 0, spe: 0},
			},
		],
	],
];

export default class DraftFactory {
	dex: ModdedDex;
	format: Format;
	prng: PRNG;
	matchup?: [DraftPokemonSet[], DraftPokemonSet[]];
	playerIndex: number;
	swapTeams: boolean;
	constructor(format: Format | string, seed: PRNG | PRNGSeed | null) {
		this.dex = Dex.forFormat(format);
		this.format = Dex.formats.get(format);
		this.prng = seed instanceof PRNG ? seed : new PRNG(seed);
		this.playerIndex = 0;
		this.swapTeams = this.prng.randomChance(1, 2);
	}

	setSeed(seed: PRNGSeed) {
		this.prng.seed = seed;
	}

	getTeam(options?: PlayerOptions | null): PokemonSet[] {
		if (this.playerIndex > 1) throw new Error("Can't generate more than 2 teams");

		if (!this.matchup) {
			this.matchup = deepClone(sampleData[this.prng.next(sampleData.length)]);
			if (this.swapTeams) this.matchup!.push(this.matchup!.shift()!);
		}

		const team: PokemonSet[] = this.matchup![this.playerIndex] as PokemonSet[];

		this.playerIndex++;
		return team;
	}
}
