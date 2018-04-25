'use strict';

const RandomGen3Teams = require('../../mods/gen3/random-teams');

class RandomGen2Teams extends RandomGen3Teams {
	// @ts-ignore
	randomTeam() {
		let pokemonLeft = 6;
		let pokemon = [];

		let n = 1;
		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			// FIXME: Not ES-compliant
			if (n++ > 251 || !this.data.FormatsData[id].randomSet1) continue;
			pokemonPool.push(id);
		}

		// Setup storage.
		let tierCount = {};
		let typeCount = {};
		let weaknessCount = {
			'Normal': 0, 'Fighting': 0, 'Flying': 0, 'Poison': 0, 'Ground': 0, 'Rock': 0, 'Bug': 0, 'Ghost': 0, 'Steel': 0,
			'Fire': 0, 'Water': 0, 'Grass': 0, 'Electric': 0, 'Psychic': 0, 'Ice': 0, 'Dragon': 0, 'Dark': 0,
		};
		let resistanceCount = {
			'Normal': 0, 'Fighting': 0, 'Flying': 0, 'Poison': 0, 'Ground': 0, 'Rock': 0, 'Bug': 0, 'Ghost': 0, 'Steel': 0,
			'Fire': 0, 'Water': 0, 'Grass': 0, 'Electric': 0, 'Psychic': 0, 'Ice': 0, 'Dragon': 0, 'Dark': 0,
		};
		let restrictMoves = {
			'reflect': 1, 'lightscreen': 1, 'rapidspin': 1, 'spikes': 1, 'bellydrum': 1, 'haze': 1,
			'healbell': 1, 'thief': 1, 'phazing': 1, 'sleeptalk': 2, 'sleeping': 2,
		};

		while (pokemonPool.length && pokemonLeft > 0) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;
			let skip = false;

			// Ensure 1 Uber at most
			// Ensure 2 mons of same tier at most (this includes OU,UUBL,UU,NU; other tiers not supported yet)
			let tier = template.tier;
			switch (tier) {
			case 'Uber':
				if (tierCount['Uber']) skip = true;
				break;
			default:
				if (tierCount[tier] > 1) skip = true;
			}

			// Ensure the same type not more than twice
			// 33% discard single-type mon if that type already exists
			// 66% discard double-type mon if both types already exist
			let types = template.types;
			if (types.length === 1) {
				if (typeCount[types[0]] > 1) skip = true;
				if (typeCount[types[0]] && this.randomChance(1, 3)) skip = true;
			} else if (types.length === 2) {
				if (typeCount[types[0]] > 1 || typeCount[types[1]] > 1) skip = true;
				if (typeCount[types[0]] && typeCount[types[1]] && this.randomChance(2, 3)) skip = true;
			}

			// Ensure the weakness-resistance balance is 2 points or lower for all types,
			// but ensure no more than 3 pokemon weak to the same regardless.
			let weaknesses = [];
			for (let type in weaknessCount) {
				let weak = this.getImmunity(type, template) && this.getEffectiveness(type, template) > 0;
				if (!weak) continue;
				if (weaknessCount[type] > 2 || weaknessCount[type] - resistanceCount[type] > 1) {
					skip = true;
				}
				weaknesses.push(type);
			}
			let resistances = [];
			for (let type in resistanceCount) {
				let resist = !this.getImmunity(type, template) || this.getEffectiveness(type, template) < 0;
				if (resist) resistances.push(type);
			}

			// In worst case scenario, make sure teams have 6 mons. This shouldn't be necessary
			if (skip && pokemonPool.length + 1 > pokemonLeft) continue;

			// The set passes the randomTeam limitations.
			let set = this.randomSet(template, pokemon.length, restrictMoves);
			// @ts-ignore
			if (set.other.discard && pokemonPool.length + 1 > pokemonLeft) continue;

			// The set also passes the randomSet limitations.
			// @ts-ignore
			pokemon.push(set.moveset);

			// Now let's update the counters. First, the Pokémon left.
			pokemonLeft--;

			// Moves counter.
			// @ts-ignore
			restrictMoves = set.other.restrictMoves;
			// @ts-ignore
			for (const moveid of set.moveset.moves) {
				if (restrictMoves[moveid]) restrictMoves[moveid]--;
				if (restrictMoves['phazing'] && ['roar', 'whirlwind'].includes(moveid)) {
					restrictMoves['phazing']--;
				}
				if (restrictMoves['sleeping'] && ['hypnosis', 'lovelykiss', 'sing', 'sleeppowder', 'spore'].includes(moveid)) {
					restrictMoves['sleeping']--;
				}
			}

			// Tier counter.
			if (tierCount[tier]) {
				tierCount[tier]++;
			} else {
				tierCount[tier] = 1;
			}

			// Type counter.
			for (const type of types) {
				if (typeCount[type]) {
					typeCount[type]++;
				} else {
					typeCount[type] = 1;
				}
			}

			// Weakness and resistance counter.
			for (const weakness of weaknesses) {
				weaknessCount[weakness]++;
			}
			for (const resistance of resistances) {
				resistanceCount[resistance]++;
			}
		}

		return pokemon;
	}

	/**
	 * @param {string | Template} template
	 * @param {number} [slot]
	 * @param {{[k: string]: number}} restrictMoves
	 * @return {RandomTeamsTypes["RandomSet"]}
	 */
	randomSet(template, slot, restrictMoves) {
		if (slot === undefined) slot = 1;
		template = this.getTemplate(template);
		if (!template.exists) template = this.getTemplate('unown');

		let randomSetNumber = 0;
		/**@type {RandomTeamsTypes["RandomSet"]} */
		// @ts-ignore
		let set = template.randomSet1;
		/**@type {string[]} */
		let moves = [];
		/**@type {{[k: string]: number}} */
		let hasMove = {};
		let item = '';
		let ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};

		let discard = false;
		let rerollsLeft = 3;
		/**@param {string} move */
		let isPhazingMove = function (move) {
			return (move === "roar" || move === "whirlwind");
		};
		/**@param {string} move */
		let isSleepMove = function (move) {
			return (move === "sleeppowder" || move === "lovelykiss" || move === "sing" || move === "hypnosis" || move === "spore");
		};

		// Choose one of the available sets (up to four) at random
		// Prevent certain moves from showing up more than once or twice:
		// sleeptalk, reflect, lightscreen, rapidspin, spikes, bellydrum, heal bell, (p)hazing moves, sleep moves
		do {
			moves = [];
			hasMove = {};

			// @ts-ignore
			if (template.randomSet2) {
				randomSetNumber = this.random(15);
				// @ts-ignore
				if (randomSetNumber < template.randomSet1.chance) {
					// @ts-ignore
					set = template.randomSet1;
					// @ts-ignore
				} else if (randomSetNumber < template.randomSet2.chance) {
					// @ts-ignore
					set = template.randomSet2;
					// @ts-ignore
				} else if (template.randomSet3 && randomSetNumber < template.randomSet3.chance) {
					// @ts-ignore
					set = template.randomSet3;
					// @ts-ignore
				} else if (template.randomSet4 && randomSetNumber < template.randomSet4.chance) {
					// @ts-ignore
					set = template.randomSet4;
					// @ts-ignore
				} else if (template.randomSet5) {
					// @ts-ignore
					set = template.randomSet5;
				}
			}

			// Even if we want to discard this set, return a proper moveset in case there's no room to discard more Pokemon
			// Add the base moves (between 0 and 4) of the chosen set
			// @ts-ignore
			if (set.baseMove1 && moves.length < 4) moves.push(set.baseMove1);
			// @ts-ignore
			if (set.baseMove2 && moves.length < 4) moves.push(set.baseMove2);
			// @ts-ignore
			if (set.baseMove3 && moves.length < 4) moves.push(set.baseMove3);
			// @ts-ignore
			if (set.baseMove4 && moves.length < 4) moves.push(set.baseMove4);

			// Add the filler moves (between 0 and 4) of the chosen set
			// @ts-ignore
			if (set.fillerMoves1 && moves.length < 4) this.randomMove(moves, hasMove, set.fillerMoves1);
			// @ts-ignore
			if (set.fillerMoves2 && moves.length < 4) this.randomMove(moves, hasMove, set.fillerMoves2);
			// @ts-ignore
			if (set.fillerMoves3 && moves.length < 4) this.randomMove(moves, hasMove, set.fillerMoves3);
			// @ts-ignore
			if (set.fillerMoves4 && moves.length < 4) this.randomMove(moves, hasMove, set.fillerMoves4);

			// Make sure it's not an undesired moveset according to restrictMoves and the rest of the team
			rerollsLeft--;
			discard = false;
			for (const moveid of moves) {
				if (restrictMoves[moveid] === 0) { discard = true; break; }
				if (isPhazingMove(moveid) && restrictMoves['phazing'] === 0) { discard = true; break; }
				if (isSleepMove(moveid) && restrictMoves['sleeping'] === 0) { discard = true; break; }
			}
		} while (rerollsLeft > 0 && discard);

		// many restrictMoves are also rare and/or useful all around, so encourage adding them once to the team
		// Start accounting for this after the first half of the team has been added
		let discourage = false;
		if (!discard && slot > 3) {
			discourage = true;
			for (const moveid of moves) {
				if (moveid === "sleeptalk" && restrictMoves['sleeptalk'] > 1) { discourage = false; break; }
				if (moveid !== "bellydrum" && moveid !== "haze" && moveid !== "thief" && restrictMoves[moveid] > 0) { discourage = false; break; }
				if (isPhazingMove(moveid) && restrictMoves['phazing'] > 0) { discourage = false; break; }
				if (isSleepMove(moveid) && restrictMoves['sleeping'] > 1) { discourage = false; break; }
			}
		}
		if (discourage && this.randomChance(1, 2)) discard = true;

		// Add the held item
		// TODO: for some reason, items like Thick Club are not working in randbats
		// @ts-ignore
		if (set.item) item = this.sample(set.item);

		// Adjust ivs for hiddenpower
		for (const setMoveid of moves) {
			if (!setMoveid.startsWith('hiddenpower')) continue;
			let hpType = setMoveid.substr(11, setMoveid.length);
			switch (hpType) {
			case 'dragon': ivs.def = 28; break;
			case 'ice': ivs.def = 26; break;
			case 'psychic': ivs.def = 24; break;
			case 'electric': ivs.atk = 28; break;
			case 'grass': ivs.atk = 28; ivs.def = 28; break;
			case 'water': ivs.atk = 28; ivs.def = 26; break;
			case 'fire': ivs.atk = 28; ivs.def = 24; break;
			case 'steel': ivs.atk = 26; break;
			case 'ghost': ivs.atk = 26; ivs.def = 28; break;
			case 'bug': ivs.atk = 26; ivs.def = 26; break;
			case 'rock': ivs.atk = 26; ivs.def = 24; break;
			case 'ground': ivs.atk = 24; break;
			case 'poison': ivs.atk = 24; ivs.def = 28; break;
			case 'flying': ivs.atk = 24; ivs.def = 26; break;
			case 'fighting': ivs.atk = 24; ivs.def = 24; break;
			}
			if (ivs.atk === 28 || ivs.atk === 24) ivs.hp = 14;
			if (ivs.def === 28 || ivs.def === 24) ivs.hp -= 8;
		}

		let levelScale = {
			LC: 90, // unused
			NFE: 84, // unused
			NU: 78,
			UU: 74,
			UUBL: 70,
			OU: 68,
			Uber: 64,
		};
		let customScale = {
			Caterpie: 99, Kakuna: 99, Magikarp: 99, Metapod: 99, Weedle: 99, // unused
			Unown: 98, Wobbuffet: 82, Ditto: 82,
			Snorlax: 66, Nidoqueen: 70,
		};
		let level = levelScale[template.tier] || 90;
		if (customScale[template.name]) level = customScale[template.name];

		// @ts-ignore
		return {
			moveset: {
				species: template.name,
				moves: moves,
				ability: 'None',
				evs: {hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255},
				ivs: ivs,
				item: item,
				level: level,
				shiny: false,
				gender: template.gender ? template.gender : 'M',
			},
			other: {
				discard: discard,
				restrictMoves: restrictMoves,
			},
		};
	}

	/**
	 * @param {string[]} moves
	 * @param {{[k: string]: number}} hasMove
	 * @param {string[]} fillerMoves
	 */
	randomMove(moves, hasMove, fillerMoves) {
		let index = 0;
		let done = false;

		do {
			index = this.random(fillerMoves.length);
			if (!hasMove[fillerMoves[index]] && !(hasMove[fillerMoves[index].substr(0, 11)])) {
				// push the move if not yet known
				moves.push(fillerMoves[index]);
				done = true;

				if (fillerMoves[index].substr(0, 11) === 'hiddenpower') {
					// only one hiddenpower is allowed
					hasMove['hiddenpower'] = 1;
				} else {
					hasMove[fillerMoves[index]] = 1;
				}
			}
		} while (!done);
	}
}

module.exports = RandomGen2Teams;
