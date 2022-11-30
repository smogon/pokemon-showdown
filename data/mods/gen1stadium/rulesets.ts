export const Rulesets: {[k: string]: ModdedFormatData} = {
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: ['Obtainable', 'Stadium Sleep Clause', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Exact HP Mod', 'Cancel Mod'],
		banlist: [
			// Only obtainable as Egg move, no valid parent
			'Happiny + Heal Bell', 'Chansey + Heal Bell', 'Blissey + Heal Bell',
			'Psyduck + Simple Beam', 'Golduck + Simple Beam',
			'Spoink + Simple Beam', 'Grumpig + Simple Beam',
			// Only obtainable as Egg move, all parents unobtainable
			'Qwilfish + Barb Barrage',
			'Stantler + Psyshield Bash',
			'Rellor + Cosmic Power', 'Rabsca + Cosmic Power',
			'Growlithe + Raging Fury', 'Arcanine + Raging Fury',
		],
	},
};
