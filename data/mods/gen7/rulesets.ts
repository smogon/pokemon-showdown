export const Rulesets: {[k: string]: ModdedFormatData} = {
	standard: {
		inherit: true,
		ruleset: ['Obtainable', 'Team Preview', 'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
	},
	standarddoubles: {
		inherit: true,
		ruleset: ['Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Abilities Clause', 'Evasion Moves Clause', 'Gravity Sleep Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
	},
	obtainablemoves: {
		inherit: true,
		banlist: [
			// Leaf Blade: Gen 6+ Nuzleaf level-up
			// Sucker Punch: Gen 4 Shiftry tutor
			'Shiftry + Leaf Blade + Sucker Punch',

			// Aura Break Zygarde can't be changed to 10% forme in gen 7
			// making moves only obtainable from gen 6 illegal
			'Zygarde-10% + Aura Break + Rock Smash',
			'Zygarde-10% + Aura Break + Secret Power',
			'Zygarde-10% + Aura Break + Strength',
		],
	},
	gravitysleepclause: {
		effectType: 'ValidatorRule',
		name: 'Gravity Sleep Clause',
		desc: "Bans Gravity + sleep moves below 100% accuracy",
		banlist: ['Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder'],
		onBegin() {
			this.add('rule', 'Gravity Sleep Clause: The combination of Gravity and sleep-inducing moves with imperfect accuracy are banned');
		},
	},
	teampreview: {
		inherit: true,
		onTeamPreview() {
			this.add('clearpoke');
			for (const pokemon of this.getAllPokemon()) {
				const details = pokemon.details.replace(', shiny', '')
					.replace(/(Arceus|Gourgeist|Pumpkaboo|Xerneas|Silvally|Urshifu)(-[a-zA-Z?-]+)?/g, '$1-*')
					// Zacian and Zamazenta should already be in the correct formes for Team Preview
					// but we still appened "-*" to the base formes so the client doesn't get confused
					// when they transform into their Crowned formes before they are sent into battle
					.replace(/(Zacian|Zamazenta)(?!-Crowned)/g, '$1-*');
				this.add('poke', pokemon.side.id, details, pokemon.item ? 'item' : '');
			}
			this.makeRequest('teampreview');
		},
	},
};
