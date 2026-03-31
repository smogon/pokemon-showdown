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
		effectType: 'ValidatorRule',
		name: 'Obtainable',
		desc: "Makes sure the team is possible to obtain in-game.",
		ruleset: ['Obtainable Moves', 'Obtainable Abilities', 'Obtainable Formes', 'EV Limit = Auto', 'Obtainable Misc'],
		banlist: ['Unreleased', 'Unobtainable', 'Nonexistent'],
		// Mostly hardcoded in team-validator.ts
		onValidateTeam(team) {
			for (const set of team) {
				const species = set.species;
				if ((species === 'Raikou' || species === 'Entei' || species === 'Suicune') && set.ivs) {
					let stat: StatID;
					for (stat in set.ivs) {
						if (stat !== 'hp' && stat !== 'atk' && set.ivs[stat] > 0) {
							return [species + " may not have more than 7 Attack IVs or 0 Defense, Special Attack, Special Defense, or Speed IVs in FRLG, due to the Roaming IVs glitch."];
						}
						if (stat === 'atk' && set.ivs[stat] > 7) {
							return [species + " may not have more than 7 Attack IVs or 0 Defense, Special Attack, Special Defense, or Speed IVs in FRLG, due to the Roaming IVs glitch."];
						}
					}
				}
			}
		}
	}
};
