export const Rulesets: {[k: string]: ModdedFormatData} = {
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Items Clause', 'Evasion Moves Clause', 'Endless battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [
			'Hypnosis + Mean Look',
			'Hypnosis + Spider Web',
			'Lovely Kiss + Mean Look',
			'Lovely Kiss + Spider Web',
			'Sing + Mean Look',
			'Sing + Spider Web',
			'Sleep Powder + Mean Look',
			'Sleep Powder + Spider Web',
			'Spore + Mean Look',
			'Spore + Spider Web',
		],
	},
	mg2mod: {
		effectType: 'Rule',
		name: 'MG2 Mod',
		desc: 'At the start of a battle, gives each player a link to the Modern Gen 2 thread so they can use it to get information about new additions to the metagame.',
		onBegin() {
			this.add('-message', `Welcome to Modern Gen 2!`);
			this.add('-message', `This is essentially Gen 9 National Dex OU but played with Gen 2 mechanics!`);
			this.add('-message', `You can find our thread and metagame resources here:`);
			this.add('-message', `https://www.smogon.com/forums/threads/3725808/`);
		},
	},
	uselessmovesclause: {
		effectType: 'ValidatorRule',
		name: 'Useless Moves Clause',
		desc: "Bans moves that have no effect (to aid in teambuilding).",
		banlist: [
			'Electric Terrain', 'Electrify', 'Grassy Terrain', 'Healing Wish', 'Ion Deluge', 'Laser Focus', 'Lucky Chant',
			'Lunar Dance', 'Misty Terrain', 'Psychic Terrain', 'Speed Swap', 'Wish', 'Telekinesis', 'Wonder Room',
		],
		onBegin() {
			this.add('rule', 'Useless Moves Clause: Prevents trainers from bringing moves with no effect');
		},
	},
	uselessitemsclause: {
		effectType: 'ValidatorRule',
		name: 'Useless Items Clause',
		desc: "Bans items that have no effect (to aid in teambuilding).",
		banlist: [
			'Absorb Bulb', 'Blunder Policy', 'Cell Battery', 'Choice Band', 'Choice Scarf', 'Choice Specs', 'DeepSeaScale', 'DeepSeaTooth',
			'Chill Drive', 'Douse Drive', 'Shock Drive', 'Burn Drive', 'Eviolite', 'Expert Belt', 'Grip Claw', 'Iron Ball', 'Mental Herb',
			'Rocky Helmet', 'Quick Powder', 'Weakness Policy', 'Utility Umbrella', 'Snowball', 'Luminous Moss', 'Loaded Dice', 'Covert Cloak',
			'Babiri Berry', 'Charti Berry', 'Chilan Berry', 'Chople Berry', 'Coba Berry', 'Colbur Berry', 'Haban Berry', 'Kasib Berry', 'Kebia Berry',
			'Occa Berry', 'Passho Berry', 'Payapa Berry', 'Rindo Berry', 'Roseli Berry', 'Shuca Berry', 'Tanga Berry', 'Wacan Berry', 'Yache Berry',
		],
		onBegin() {
			this.add('rule', 'Useless Items Clause: Prevents trainers from bringing items with no effect');
		},
	},
};
