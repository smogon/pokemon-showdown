import '../../../sim/dex-species';

declare module '../../../sim/dex-species' {
	interface Species {
		mons?: [any, string[], string[]?][] | null;
	}
	interface SpeciesFormatsData{
		hasMons?: true | null;
	}
};

export const Scripts: ModdedBattleScriptsData = {
	gen: 9
};
