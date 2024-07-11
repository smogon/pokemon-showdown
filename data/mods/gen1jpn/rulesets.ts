export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: ['Obtainable', 'Desync Clause Mod', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Dig', 'Fly'],
	},
	nc1997movelegality: {
		effectType: 'ValidatorRule',
		name: 'NC 1997 Move Legality',
		desc: "Bans move combinations on Pok\u00e9mon that would only be obtainable in Pok\u00e9mon Yellow.",
		banlist: [
			// https://www.smogon.com/forums/threads/rby-and-gsc-illegal-movesets.78638/
			// https://www.smogon.com/forums/threads/rby-tradebacks-bug-report-thread.3524844/post-9235903
			// Due to Yellow learnset modifications not applying, there are a few more incompatibilities than usual.
			'Nidoking + Fury Attack + Thrash', 'Nidoking + Double Kick + Thrash',
			'Butterfree + Tackle + Harden', 'Butterfree + String Shot + Harden',
			'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp', 'Exeggutor + Stun Spore + Stomp',
			'Eevee + Tackle + Growl',
			'Vaporeon + Tackle + Growl',
			'Jolteon + Tackle + Growl', 'Jolteon + Focus Energy + Thunder Shock',
			'Flareon + Tackle + Growl', 'Flareon + Focus Energy + Ember',
		],
		onValidateSet(set) {
			const rgb97Legality: {[speciesid: string]: {[moveid: string]: 'illegal' | number}} = {
				charizard: {fly: 'illegal'},
				butterfree: {
					confusion: 12, poisonpowder: 15, stunspore: 16, sleeppowder: 17, supersonic: 21,
					psybeam: 34, flash: 'illegal', gust: 'illegal',
				},
				fearow: {payday: 'illegal'},
				pikachu: {quickattack: 16, tailwhip: 'illegal', slam: 'illegal', lightscreen: 'illegal'},
				raichu: {quickattack: 16, tailwhip: 'illegal', slam: 'illegal', lightscreen: 'illegal'},
				nidoranf: {doublekick: 43},
				nidorina: {doublekick: 43},
				nidoqueen: {doublekick: 43},
				nidoranm: {doublekick: 43},
				nidorino: {doublekick: 43},
				nidoking: {doublekick: 43},
				venonat: {poisonpowder: 24, supersonic: 'illegal', confusion: 'illegal'},
				venomoth: {poisonpowder: 24, supersonic: 'illegal'},
				diglett: {cut: 'illegal'},
				dugtrio: {cut: 'illegal'},
				psyduck: {amnesia: 'illegal'},
				golduck: {amnesia: 'illegal'},
				mankey: {lowkick: 'illegal', screech: 'illegal'},
				primeape: {lowkick: 'illegal', screech: 'illegal'},
				kadabra: {kinesis: 'illegal'},
				alakazam: {kinesis: 'illegal'},
				rapidash: {payday: 'illegal'},
				cubone: {tailwhip: 'illegal', headbutt: 'illegal'},
				marowak: {tailwhip: 'illegal', headbutt: 'illegal'},
				chansey: {tailwhip: 'illegal'},
				tangela: {absorb: 29, growth: 49, vinewhip: 'illegal'},
				scyther: {wingattack: 'illegal'},
				pinsir: {bind: 'illegal'},
				magikarp: {dragonrage: 'illegal'},
				eevee: {quickattack: 27, tailwhip: 31, bite: 37, growl: 'illegal', focusenergy: 'illegal'},
				vaporeon: {
					quickattack: 27, tailwhip: 31, watergun: 31, bite: 37, acidarmor: 42, haze: 44, mist: 48, hydropump: 54,
					growl: 'illegal', focusenergy: 'illegal', aurorabeam: 'illegal',
				},
				jolteon: {
					quickattack: 27, tailwhip: 31, thundershock: 31, bite: 37, doublekick: 42, agility: 44,
					pinmissile: 48, growl: 'illegal', focusenergy: 'illegal',
				},
				flareon: {
					quickattack: 27, tailwhip: 31, ember: 31, bite: 37, leer: 42, firespin: 44, flamethrower: 54,
					growl: 'illegal', focusenergy: 'illegal', smog: 'illegal',
				},
			};
			const species = this.dex.species.get(set.species || set.name);
			const legalityList = rgb97Legality[species.id];
			if (!legalityList) return;
			const problems = [];
			if (set.moves) {
				for (const moveid of set.moves.map(this.toID)) {
					const legality = legalityList[moveid];
					if (legality) {
						if (legality === 'illegal') {
							problems.push(`${set.species} can't learn ${this.dex.moves.get(moveid).name} in 1997.`);
						} else if (set.level < legality) {
							problems.push(`${set.species} can't learn ${this.dex.moves.get(moveid).name} before level ${legalityList[moveid]} in 1997.`);
						}
					}
				}
			}
			return problems;
		},
	},
};
