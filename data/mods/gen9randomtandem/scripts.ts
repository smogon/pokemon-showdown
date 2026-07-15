declare module '../../../sim/dex-species' {
	interface Species {
		mons?: [any, string[], string[]?][] | null;
	}
};
declare module '../../../sim/pokemon' {
	interface Pokemon {
		tandem?: true | null;
	}
};

export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
};
