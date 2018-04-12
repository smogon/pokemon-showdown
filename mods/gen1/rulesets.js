'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	pokemon: {
		effectType: 'ValidatorRule',
		name: 'Pokemon',
		onValidateSet: function (set, format) {
			let template = this.getTemplate(set.species);
			let problems = [];
			if (set.species === set.name) delete set.name;

			if (template.gen > this.gen) {
				problems.push(set.species + ' does not exist in gen ' + this.gen + '.');
			} else if (template.isNonstandard) {
				problems.push(set.species + ' is not a real Pokemon.');
			}
			if (set.moves) {
				for (const setMoveid of set.moves) {
					let move = this.getMove(setMoveid);
					if (move.gen > this.gen) {
						problems.push(move.name + ' does not exist in gen ' + this.gen + '.');
					} else if (move.isNonstandard) {
						problems.push(move.name + ' is not a real move.');
					}
				}
			}
			if (set.moves && set.moves.length > 4) {
				problems.push((set.name || set.species) + ' has more than four moves.');
			}

			// Let's manually delete items.
			set.item = '';

			// Automatically set ability to None
			set.ability = 'None';

			// They also get a useless nature, since that didn't exist
			set.nature = 'Serious';

			// No shinies
			set.shiny = false;

			return problems;
		},
	},
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: ['Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Unreleased', 'Illegal', 'Dig', 'Fly',
			'Kakuna + Poison Sting + Harden', 'Kakuna + String Shot + Harden',
			'Beedrill + Poison Sting + Harden', 'Beedrill + String Shot + Harden',
			'Nidoking + Fury Attack + Thrash',
			'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp', 'Exeggutor + Stun Spore + Stomp',
			'Eevee + Tackle + Growl',
			'Vaporeon + Tackle + Growl',
			'Jolteon + Tackle + Growl', 'Jolteon + Focus Energy + Thunder Shock',
			'Flareon + Tackle + Growl', 'Flareon + Focus Energy + Ember',
		],
		onValidateSet: function (set) {
			// limit one of each move in Standard
			let moves = [];
			if (set.moves) {
				let hasMove = {};
				for (const setMoveid of set.moves) {
					let move = this.getMove(setMoveid);
					let moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(setMoveid);
				}
			}
			set.moves = moves;
		},
	},
};

exports.BattleFormats = BattleFormats;
