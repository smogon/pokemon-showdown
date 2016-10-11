'use strict';

exports.BattleFormats = {
	pokemon: {
		effectType: 'Banlist',
		onValidateSet: function (set, format) {
			let template = this.getTemplate(set.species);
			let problems = [];
			if (set.species === set.name) delete set.name;

			if (template.gen > this.gen) {
				problems.push(set.species + ' does not exist in gen ' + this.gen + '.');
			} else if (template.isNonstandard) {
				problems.push(set.species + ' is not a real Pokemon.');
			}
			let hasHP = false;
			let hasSD = false;
			if (set.item) {
				let item = this.getItem(set.item);
				if (item.gen > this.gen) {
					problems.push(item.name + ' does not exist in gen ' + this.gen + '.');
				} else if (item.isNonstandard) {
					problems.push(item.name + ' is not a real item.');
				}
			}
			if (set.moves) {
				for (let i = 0; i < set.moves.length; i++) {
					let move = this.getMove(set.moves[i]);
					if (move.gen > this.gen) {
						problems.push(move.name + ' does not exist in gen ' + this.gen + '.');
					} else if (move.isNonstandard) {
						problems.push(move.name + ' is not a real move.');
					}
					if (move.id === 'hiddenpower') hasHP = true;
					if (move.id === 'swordsdance') hasSD = true;
				}
			}
			if (set.moves && set.moves.length > 4) {
				problems.push((set.name || set.species) + ' has more than four moves.');
			}

			// Automatically set ability to None
			set.ability = 'None';

			// In gen 2, there's no advantage on having subpar EVs and you could max all of them
			set.evs = {hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255};

			// Check if there's Hidden Power
			if (hasHP) {
				// All IVs to 31 forces correct Hidden Power from Typecharts in the engine
				set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
				// There's no good shiny Pokémon with good HPs
				set.shiny = false;
			} else {
				// IVs still maxed at 30 on Gen 2
				if (!set.ivs) {
					set.ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};
				} else {
					for (let iv in set.ivs) {
						// Since Gen 2 has 0-15 DVs that increase 2 points, we only want pair numbers
						if (set.ivs[iv] % 2 !== 0) set.ivs[iv]--;
						// This shouldn't even be possible
						if (set.ivs[iv] > 30) set.ivs[iv] = 30;
					}
					// Special is one IV, we use spa for spa and spd.
					set.ivs.spd = set.ivs.spa;
				}
				// Calculate all the IV oddness on gen 2.
				// If you use Marowak with Thick Club, we'll be gentle enough to deal with your Attack DVs.
				// This is only done because the gen 6 Teambuilder is confusing, using IVs and all.
				let marowakClub = false;
				if (toId(set.item) === 'thickclub' && set.species === 'Marowak' && hasSD) {
					set.ivs.atk = 26;
					marowakClub = true;
				}
				// Don't run shinies, they fuck your IVs
				if (set.shiny) {
					set.ivs.def = 20;
					set.ivs.spe = 20;
					set.ivs.spa = 20;
					set.ivs.spd = 20;
					// Attack can vary, so let's check it
					if (!(set.ivs.atk in {4:1, 6:1, 12:1, 14:1, 20:1, 22:1, 28:1, 30:1})) {
						set.ivs.atk = marowakClub ? 22 : 30;
					}
				}
				// Deal with female IVs.
				if (!template.gender) {
					set.gender = 'M';
					// 0-1 (1 DV = 2 IV) Gender value 1:7
					if (template.genderRatio && template.genderRatio.F === 0.125 && set.ivs.atk < 3) {
						set.gender = 'F';
					}
					// 0-3 (3 DV = 6 IV) Gender value 1:3
					if (template.genderRatio && template.genderRatio.F === 0.25 && set.ivs.atk < 7) {
						set.gender = 'F';
					}
					// 0-7 (7 DV = 14 IV) Gender value 1:1
					if (template.genderRatio && template.genderRatio.F === 0.5 && set.ivs.atk < 15) {
						set.gender = 'F';
					}
					// 0-11 (11 DV = 22 IV) Gender value 3:1
					if (template.genderRatio && template.genderRatio.F === 0.75 && set.ivs.atk < 23) {
						set.gender = 'F';
					}
				}

				// The HP IV is calculated with the last bit of every value. Do this last.
				set.ivs.hp = (((set.ivs.atk / 2) % 2 * 8) + ((set.ivs.def / 2) % 2 * 4) + ((set.ivs.spe / 2) % 2 * 2) + ((set.ivs.spa / 2) % 2 * 1)) * 2;
			}

			// They all also get a useless nature, since that didn't exist
			set.nature = 'Serious';

			return problems;
		},
	},
	standard: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Unreleased', 'Illegal',
			'Hypnosis + Perish Song + Mean Look',
			'Hypnosis + Perish Song + Spider Web',
			'Lovely Kiss + Perish Song + Mean Look',
			'Lovely Kiss + Perish Song + Spider Web',
			'Sing + Perish Song + Mean Look',
			'Sing + Perish Song + Spider Web',
			'Sleep Powder + Perish Song + Mean Look',
			'Sleep Powder + Perish Song + Spider Web',
			'Spore + Perish Song + Mean Look',
			'Spore + Perish Song + Spider Web',
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
