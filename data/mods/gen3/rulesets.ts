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
		// Without this override gen3 would inherit gen8's Tier Shift table (UU +10 …
		// PU +40). We pin the base +15/+20/+25/+30 ladder and additionally boost UUBL
		// — and "(OU)" by technicality, which we treat as UUBL — by +5. OU and Uber
		// stay unboosted. HP is never boosted.
		inherit: true,
		desc: `Pok&eacute;mon below OU get their stats, excluding HP, boosted. UUBL (and OU by technicality) get +5, UU/RUBL get +15, RU/NUBL get +20, NU/PUBL get +25, and PU or lower get +30.`,
		onModifySpecies(species, target, source, effect) {
			if (!species.baseStats) return;
			const boosts: { [tier: string]: number } = {
				uubl: 5,
				uu: 15,
				rubl: 15,
				ru: 20,
				nubl: 20,
				nu: 25,
				publ: 25,
				pu: 30,
				zubl: 30,
				zu: 30,
				nfe: 30,
				lc: 30,
			};
			const tiers = ['ou', 'uubl', 'uu', 'rubl', 'ru', 'nubl', 'nu', 'publ', 'pu', 'zubl', 'zu', 'nfe', 'lc'];
			// "(OU)" (OU by technicality) ids to "ou" exactly like real OU, so detect
			// the raw tier string and treat it as UUBL (+5) before falling back to toID.
			let tier: string = species.tier === '(OU)' ? 'uubl' : this.toID(species.tier);
			if (!(tier in boosts)) return;
			// Non-Pokemon bans cap the boost in lower tiers (mirrors data/rulesets.ts).
			if (target) {
				if (this.toID(target.set.item) === 'lightclay' && tiers.indexOf(tier) > tiers.indexOf('rubl')) tier = 'rubl';
				if (this.toID(target.set.item) === 'quickclaw' && tiers.indexOf(tier) > tiers.indexOf('nubl')) tier = 'nubl';
				if (this.toID(target.set.ability) === 'drought' && tiers.indexOf(tier) > tiers.indexOf('nubl')) tier = 'nubl';
				if (this.toID(target.set.item) === 'damprock' && tiers.indexOf(tier) > tiers.indexOf('publ')) tier = 'publ';
				if (this.toID(target.set.item) === 'unburden' && tiers.indexOf(tier) > tiers.indexOf('zubl')) tier = 'zubl';
			}
			const pokemon = this.dex.deepClone(species);
			pokemon.bst = pokemon.baseStats['hp'];
			const boost = boosts[tier];
			let statName: StatID;
			for (statName in pokemon.baseStats as StatsTable) {
				if (statName === 'hp') continue;
				pokemon.baseStats[statName] = this.clampIntRange(pokemon.baseStats[statName] + boost, 1, 255);
				pokemon.bst += pokemon.baseStats[statName];
			}
			return pokemon;
		},
	},
};
