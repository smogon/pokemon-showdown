'use strict';

exports.BattleFormats = {
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
				for (let i = 0; i < set.moves.length; i++) {
					let move = this.getMove(set.moves[i]);
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

			// Maximise EVs by default
			if (!set.evs) {
				set.evs = {hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255};
			} else {
				// If EVs are set manually to lower attack for confusion damage, make attack minimum possible.
				// Each EV is 257 Stat points, that is, 30 EVs.
				// Minimum attack you can have at level 100 is 30.
				set.evs.hp = 255;
				set.evs.def = 255;
				set.evs.spa = 255;
				set.evs.spd = 255;
				set.evs.spe = 255;
				if (set.evs.atk < 30) {
					set.evs.atk = 30;
				} else {
					set.evs.atk = 255;
				}
			}

			// IVs worked different (DVs, 0 to 15, 2 points each) so we put all IVs to 30
			if (!set.ivs) {
				set.ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};
			} else {
				// Unless minimising Attack DV for confusion damage.
				set.ivs.hp = 30;
				set.ivs.def = 30;
				set.ivs.spa = 30;
				set.ivs.spd = 30;
				set.ivs.spe = 30;
				if (set.ivs.atk < 30) {
					// Make it odd DVs (1 DV = 2 IV) so we still have max HP.
					set.ivs.atk = 2;
				} else {
					set.ivs.atk = 30;
				}
			}

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
				for (let i = 0; i < set.moves.length; i++) {
					let move = this.getMove(set.moves[i]);
					let moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(set.moves[i]);
				}
			}
			set.moves = moves;
		},
	},
};
