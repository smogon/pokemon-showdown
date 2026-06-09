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
	obtainable: {
		inherit: true,
		onValidateSet(set) {
			const species = this.dex.species.get(set.species);
			if (['entei', 'raikou', 'suicune'].includes(species.id)) {
				if (!set.ivs) set.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
				for (const stat in set.ivs) {
					if ((stat === 'atk' && set.ivs[stat] > 7) || (stat !== 'hp' && set.ivs[stat as 'def'] > 0)) {
						return [
							`${set.name} must have 7 or fewer Attack IVs and 0 IVs in all other stats except HP, due to the Roaming IVs glitch.`,
						];
					}
				}
			}
		},
	},
};
