export const Rulesets: {[k: string]: ModdedFormatData} = {
	obtainablemoves: {
		inherit: true,
		banlist: [
			// https://www.smogon.com/forums/threads/implementing-all-old-gens-in-ps-testers-required.3483261/post-5420130
			// confirmed by Marty
			'Kakuna + Poison Sting + Harden', 'Kakuna + String Shot + Harden',
			'Beedrill + Poison Sting + Harden', 'Beedrill + String Shot + Harden',

			// https://www.smogon.com/forums/threads/rby-and-gsc-illegal-movesets.78638/
			'Nidoking + Fury Attack + Thrash',
			'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp', 'Exeggutor + Stun Spore + Stomp',
			'Eevee + Tackle + Growl',
			'Vaporeon + Tackle + Growl',
			'Jolteon + Tackle + Growl', 'Jolteon + Focus Energy + Thunder Shock',
			'Flareon + Tackle + Growl', 'Flareon + Focus Energy + Ember',
		],
	},
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
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
	nintendocup2000movelegality: {
		effectType: 'ValidatorRule',
		name: 'Nintendo Cup 2000 Move Legality',
		desc: "Prevents Pok\u00e9mon from having moves that would only be obtainable in Pok\u00e9mon Crystal.",
		onValidateSet(set) {
			const illegalCombos: {[speciesid: string]: {[moveid: string]: 'E' | 'L' | 'S'}} = {
				arbok: {crunch: 'E'},
				sandslash: {metalclaw: 'E'},
				golduck: {crosschop: 'E'},
				marowak: {swordsdance: 'E'},
				electabuzz: {crosschop: 'E'},
				magmar: {crosschop: 'E'},
				jolteon: {batonpass: 'L'},
				vaporeon: {batonpass: 'L'},
				flareon: {batonpass: 'L'},
				espeon: {batonpass: 'L'},
				umbreon: {batonpass: 'L'},
				dragonite: {extremespeed: 'S'},
				meganium: {swordsdance: 'E'},
				typhlosion: {submission: 'E'},
				ariados: {agility: 'L'},
				yanma: {wingattack: 'L'},
				murkrow: {skyattack: 'E'},
				qwilfish: {spikes: 'L'},
				sneasel: {metalclaw: 'L'},
				ursaring: {metalclaw: 'E'},
				piloswine: {amnesia: 'L'},
				skarmory: {skyattack: 'E'},
				donphan: {watergun: 'E'},
				suicune: {aurorabeam: 'L'},
				dugtrio: {triattack: 'L'},
				magneton: {triattack: 'L'},
				cloyster: {spikes: 'L'},
			};
			const notUsableAsTM = ['icebeam', 'flamethrower', 'thunderbolt'];
			const species = this.dex.species.get(set.species || set.name);
			const learnsetData = {...(this.dex.data.Learnsets[species.id]?.learnset || {})};
			const legalityList = illegalCombos[species.id];
			const problems = [];
			let prevo = species.prevo;
			while (prevo) {
				const prevoSpecies = this.dex.species.get(prevo);
				const prevoLsetData = this.dex.data.Learnsets[prevoSpecies.id]?.learnset || {};
				for (const moveid in prevoLsetData) {
					if (!(moveid in learnsetData)) {
						learnsetData[moveid] = prevoLsetData[moveid];
					} else {
						learnsetData[moveid].push(...prevoLsetData[moveid]);
					}
				}
				prevo = prevoSpecies.prevo;
			}
			for (const moveid of set.moves.map(this.toID)) {
				// Diglett Magnemite Shellder
				if (!learnsetData[moveid]) continue;
				if (legalityList) {
					const list = learnsetData[moveid].filter(x => !x.includes(legalityList[moveid]));
					if (!list.length) {
						switch (legalityList[moveid]) {
						case 'L':
							// Converted to a set to remove duplicate entries
							const levels = new Set(learnsetData[moveid].filter(x => x.includes(legalityList[moveid])).map(x => x.slice(2)));
							problems.push(
								`${species.name} can't learn ${this.dex.moves.get(moveid).name}.`,
								`(It learns ${this.dex.moves.get(moveid).name} in Pok\u00e9mon Crystal at the following levels: ${[...levels].join(', ')})`
							);
							break;
						case 'S':
							problems.push(
								`${species.name} can't learn ${this.dex.moves.get(moveid).name}.`,
								`(It only learns ${this.dex.moves.get(moveid).name} in Pok\u00e9mon Crystal via special in-game events.)`
							);
							break;
						case 'E':
							problems.push(
								`${species.name} can't learn ${this.dex.moves.get(moveid).name}.`,
								`(It only learns ${this.dex.moves.get(moveid).name} as an egg move in Pok\u00e9mon Crystal.)`
							);
							break;
						}
					}
				}
				for (const id of notUsableAsTM) {
					if (moveid === id && learnsetData[id] && !learnsetData[id].filter(x => !x.includes('2T')).length) {
						problems.push(`${species.name} can't learn ${this.dex.moves.get(id).name}.`);
					}
				}
			}
			if (problems.some(x => notUsableAsTM.map(y => this.dex.moves.get(y).name).some(z => x.includes(z)))) {
				problems.push(
					`(${notUsableAsTM.map(y => this.dex.moves.get(y).name).join(' / ')} aren't learnable outside of Pok\u00e9mon Crystal.)`
				);
			}
			return problems;
		},
	},
};
