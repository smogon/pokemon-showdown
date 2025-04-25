import type { Learnset } from "../../../sim/dex-species";

export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
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

			// https://github.com/smogon/pokemon-showdown/pull/8869
			'Rapidash + Pay Day + Growl',
			'Rapidash + Pay Day + Tail Whip',
			'Fearow + Pay Day + Peck',
			'Fearow + Pay Day + Mirror Move',
			'Magikarp + Dragon Rage + Tackle',
		],
	},
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
	nc2000movelegality: {
		effectType: 'ValidatorRule',
		name: 'NC 2000 Move Legality',
		desc: "Prevents Pok\u00e9mon from having moves that would only be obtainable in Pok\u00e9mon Crystal.",
		onValidateSet(set) {
			const illegalCombos: { [speciesid: string]: { [moveid: string]: 'E' | 'L' | 'S' } } = {
				arbok: { crunch: 'E' },
				sandslash: { metalclaw: 'E' },
				golduck: { crosschop: 'E' },
				marowak: { swordsdance: 'E' },
				electabuzz: { crosschop: 'E' },
				magmar: { crosschop: 'E' },
				jolteon: { batonpass: 'L' },
				vaporeon: { batonpass: 'L' },
				flareon: { batonpass: 'L' },
				espeon: { batonpass: 'L' },
				umbreon: { batonpass: 'L' },
				dragonite: { extremespeed: 'S' },
				meganium: { swordsdance: 'E' },
				typhlosion: { submission: 'E' },
				ariados: { agility: 'L' },
				yanma: { wingattack: 'L' },
				murkrow: { skyattack: 'E' },
				qwilfish: { spikes: 'L' },
				sneasel: { metalclaw: 'L' },
				ursaring: { metalclaw: 'E' },
				piloswine: { amnesia: 'L' },
				skarmory: { skyattack: 'E' },
				donphan: { watergun: 'E' },
				suicune: { aurorabeam: 'L' },
				dugtrio: { triattack: 'L' },
				magneton: { triattack: 'L' },
				cloyster: { spikes: 'L' },
			};

			const moveSources: NonNullable<Learnset['learnset']> = Object.fromEntries(
				set.moves.map(move => [this.toID(move), []])
			);

			const species = this.dex.species.get(set.species);
			for (const { learnset } of this.dex.species.getFullLearnset(species.id)) {
				for (const moveid in moveSources) {
					moveSources[moveid].push(...(learnset[moveid] || []));
				}
			}

			const notUsableAsTM = ['icebeam', 'flamethrower', 'thunderbolt'];
			const legalityList = illegalCombos[species.id];
			const problems = [];
			for (const moveid of set.moves.map(this.toID)) {
				// Diglett Magnemite Shellder
				if (!moveSources[moveid]) continue;
				if (legalityList) {
					const list = moveSources[moveid].filter(x => !x.includes(legalityList[moveid]));
					if (!list.length) {
						switch (legalityList[moveid]) {
						case 'L':
							// Converted to a set to remove duplicate entries
							const levels = new Set(moveSources[moveid].filter(x => x.includes(legalityList[moveid])).map(x => x.slice(2)));
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
					if (moveid === id && moveSources[id] && !moveSources[id].filter(x => !x.includes('2T')).length) {
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
