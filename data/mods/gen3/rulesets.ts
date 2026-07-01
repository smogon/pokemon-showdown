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
		// PU +40). We pin a UUBL +5 / UU +10 / RU +15 / NU +20 / PU +30 / ZU +35 /
		// SU-LC-NFE +40 ladder and additionally treat "(OU)" by technicality
		// (Regice, Raikou, Porygon2) as UUBL. OU and Uber stay unboosted. HP is
		// never boosted.
		inherit: true,
		desc: `Pok&eacute;mon below OU get their stats, excluding HP, boosted. UUBL (and OU by technicality) get +5, UU/RUBL get +10, RU/NUBL get +15, NU/PUBL get +20, PU/ZUBL get +30, ZU gets +35, and SU/LC/NFE get +40.`,
		onModifySpecies(species, target, source, effect) {
			if (!species.baseStats) return;
			const boosts: { [tier: string]: number } = {
				uubl: 5,
				uu: 10,
				rubl: 10,
				ru: 15,
				nubl: 15,
				nu: 20,
				publ: 20,
				pu: 30,
				zubl: 30,
				zu: 35,
				su: 40,
				nfe: 40,
				lc: 40,
			};
			const tiers = ['ou', 'uubl', 'uu', 'rubl', 'ru', 'nubl', 'nu', 'publ', 'pu', 'zubl', 'zu', 'su', 'nfe', 'lc'];
			// SU is a fork-only bottom tier that lives in the gen3subzu mod, NOT the
			// standard gen3 tier list this format (mod: 'gen3') reads. Without this
			// lookup an SU mon (e.g. Sunflora) falls through to its coarser gen3 tier
			// (ZU) and gets +35 instead of the intended SU +40. Consult gen3subzu so
			// every SU mon lands on the su rung; degrade gracefully if it is absent.
			const subzuTier = this.dex.mod('gen3subzu')?.species.get(species.id)?.tier;
			// "(OU)" (OU by technicality) ids to "ou" exactly like real OU, so detect
			// the raw tier string and treat it as UUBL (+5) before falling back to toID.
			let tier: string = subzuTier === 'SU' ? 'su' :
				(species.tier === '(OU)' ? 'uubl' : this.toID(species.tier));
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
