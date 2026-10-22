export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		desc: "The standard ruleset for all official Smogon singles tiers (Ubers, OU, etc.)",
		ruleset: [
			'Standard AG',
			'Sleep Clause Mod', 'Switch Priority Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Items Clause', 'Evasion Moves Clause',
		],
	},
	standarddraft: {
		effectType: 'ValidatorRule',
		name: 'Standard Draft',
		desc: "The custom Draft League ruleset",
		ruleset: [
			'Obtainable', 'Nickname Clause', 'Beat Up Nicknames Mod', '+Unreleased', 'Sleep Clause Mod', 'OHKO Clause', 'Evasion Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod',
			'One Boost Passer Clause', 'Freeze Clause Mod', 'Accuracy Moves Clause', 'Baton Pass Trap Clause',
		],
		banlist: [
			'Uber', 'Smeargle + Ingrain', 'Swagger', 'Focus Band', 'King\'s Rock', 'Quick Claw', 'Baton Pass + Ancient Power', 'Baton Pass + Silver Wind',
		],
		// timer: {starting: 60 * 60, grace: 0, addPerTurn: 10, maxPerTurn: 100, timeoutAutoChoose: true},
	},
	tiershiftmod: {
		// Boosts are different for Gen 3 thus necessitating the override, plus some special cases (Glalie).
		inherit: true,
		desc: `Pok&eacute;mon below OU get their stats, excluding HP, boosted. UUBL (and OU by technicality) get +5, UU/RUBL get +10, RU/NUBL get +15, NU/PUBL get +20, PU/ZUBL get +30, ZU gets +35, and NFE/LC get +40.`,
		onModifySpecies(species) {
			if (!species.baseStats) return;
			const boosts: { [tier: string]: number } = {
				uubl: 5, uu: 10, rubl: 10, ru: 15, nubl: 15, nu: 20,
				publ: 20, pu: 30, zubl: 30, zu: 35, nfe: 40, lc: 40,
			};
			// Glalie is boosted as UU here rather than its standard NUBL.
			const tier = species.id === 'glalie' ? 'uu' :
				(species.tier === '(OU)' ? 'uubl' : this.toID(species.tier));
			if (!(tier in boosts)) return;
			const pokemon = this.dex.deepClone(species);
			pokemon.bst = pokemon.baseStats['hp'];
			let statName: StatID;
			for (statName in pokemon.baseStats as StatsTable) {
				if (statName === 'hp') continue;
				pokemon.baseStats[statName] = this.clampIntRange(pokemon.baseStats[statName] + boosts[tier], 1, 255);
				pokemon.bst += pokemon.baseStats[statName];
			}
			return pokemon;
		},
	},
};
