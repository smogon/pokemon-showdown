'use strict';

const RandomGen3Teams = require('../../mods/gen3/random-teams');

class RandomGen2Teams extends RandomGen3Teams {
	randomTeam(side) {
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
			'Normal':0, 'Fighting':0, 'Flying':0, 'Poison':0, 'Ground':0, 'Rock':0, 'Bug':0, 'Ghost':0, 'Steel':0,
			'Fire':0, 'Water':0, 'Grass':0, 'Electric':0, 'Psychic':0, 'Ice':0, 'Dragon':0, 'Dark':0,
		};
		let resistanceCount = {
			'Normal':0, 'Fighting':0, 'Flying':0, 'Poison':0, 'Ground':0, 'Rock':0, 'Bug':0, 'Ghost':0, 'Steel':0,
			'Fire':0, 'Water':0, 'Grass':0, 'Electric':0, 'Psychic':0, 'Ice':0, 'Dragon':0, 'Dark':0,
		};
		let restrictMoves = {
			'reflect':1, 'lightscreen':1, 'rapidspin':1, 'spikes':1, 'bellydrum':1, 'haze':1,
			'healbell':1, 'thief':1, 'phazing':1, 'sleeptalk':2, 'sleeping':2,
		};

		while (pokemonPool.length && pokemonLeft > 0) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;
			let skip = false;

			// Ensure 1 Uber at most
			// Ensure 2 mons of same tier at most (this includes OU,BL,UU,NU; other tiers not supported yet)
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
				if (typeCount[types[0]] && this.random(3) === 0) skip = true;
			} else if (types.length === 2) {
				if (typeCount[types[0]] > 1 || typeCount[types[1]] > 1) skip = true;
				if (typeCount[types[0]] && typeCount[types[1]] && this.random(3) > 0) skip = true;
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
			if (set.other.discard && pokemonPool.length + 1 > pokemonLeft) continue;

			// The set also passes the randomSet limitations.
			pokemon.push(set.moveset);

			// Now let's update the counters. First, the Pokémon left.
			pokemonLeft--;

			// Moves counter.
			restrictMoves = set.other.restrictMoves;
			let moves = set.moveset.moves;
			for (let i = 0; i < moves.length; i++) {
				if (restrictMoves[moves[i]]) restrictMoves[moves[i]]--;
				if (restrictMoves['phazing'] && (moves[i] === "roar" || moves[i] === "whirlwind")) {
					restrictMoves['phazing']--;
				}
				if (restrictMoves['sleeping'] && (moves[i] === "sleeppowder" || moves[i] === "lovelykiss" || moves[i] === "sing" || moves[i] === "hypnosis" || moves[i] === "spore")) {
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
			for (let i = 0; i < types.length; i++) {
				if (typeCount[types[i]]) {
					typeCount[types[i]]++;
				} else {
					typeCount[types[i]] = 1;
				}
			}

			// Weakness and resistance counter.
			for (let i = 0; i < weaknesses.length; i++) {
				weaknessCount[weaknesses[i]]++;
			}
			for (let i = 0; i < resistances.length; i++) {
				resistanceCount[resistances[i]]++;
			}
		}

		return pokemon;
	}
	randomSet(template, slot, restrictMoves) {
		if (slot === undefined) slot = 1;
		template = this.getTemplate(template);
		if (!template.exists) template = this.getTemplate('unown');

		let randomSetNumber = 0;
		let set = template.randomSet1;
		let moves = [];
		let hasMove = {};
		let item = '';
		let ivs = {hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30};

		let discard = false;
		let rerollsLeft = 3;
		let isPhazingMove = function (move) {
			return (move === "roar" || move === "whirlwind");
		};
		let isSleepMove = function (move) {
			return (move === "sleeppowder" || move === "lovelykiss" || move === "sing" || move === "hypnosis" || move === "spore");
		};

		// Choose one of the available sets (up to four) at random
		// Prevent certain moves from showing up more than once or twice:
		// sleeptalk, reflect, lightscreen, rapidspin, spikes, bellydrum, heal bell, (p)hazing moves, sleep moves
		do {
			moves = [];
			hasMove = {};

			if (template.randomSet2) {
				randomSetNumber = this.random(15);
				if (randomSetNumber < template.randomSet1.chance) {
					set = template.randomSet1;
				} else if (randomSetNumber < template.randomSet2.chance) {
					set = template.randomSet2;
				} else if (template.randomSet3 && randomSetNumber < template.randomSet3.chance) {
					set = template.randomSet3;
				} else if (template.randomSet4 && randomSetNumber < template.randomSet4.chance) {
					set = template.randomSet4;
				} else if (template.randomSet5) {
					set = template.randomSet5;
				}
			}

			// Even if we want to discard this set, return a proper moveset in case there's no room to discard more Pokemon
			// Add the base moves (between 0 and 4) of the chosen set
			if (set.baseMove1 && moves.length < 4) moves.push(set.baseMove1);
			if (set.baseMove2 && moves.length < 4) moves.push(set.baseMove2);
			if (set.baseMove3 && moves.length < 4) moves.push(set.baseMove3);
			if (set.baseMove4 && moves.length < 4) moves.push(set.baseMove4);

			// Add the filler moves (between 0 and 4) of the chosen set
			if (set.fillerMoves1 && moves.length < 4) this.randomMove(moves, hasMove, set.fillerMoves1);
			if (set.fillerMoves2 && moves.length < 4) this.randomMove(moves, hasMove, set.fillerMoves2);
			if (set.fillerMoves3 && moves.length < 4) this.randomMove(moves, hasMove, set.fillerMoves3);
			if (set.fillerMoves4 && moves.length < 4) this.randomMove(moves, hasMove, set.fillerMoves4);

			// Make sure it's not an undesired moveset according to restrictMoves and the rest of the team
			rerollsLeft--;
			discard = false;
			for (let i = 0; i < moves.length; i++) {
				if (restrictMoves[moves[i]] === 0) { discard = true; break; }
				if (isPhazingMove(moves[i]) && restrictMoves['phazing'] === 0) { discard = true; break; }
				if (isSleepMove(moves[i]) && restrictMoves['sleeping'] === 0) { discard = true; break; }
			}
		} while (rerollsLeft > 0 && discard);

		// many restrictMoves are also rare and/or useful all around, so encourage adding them once to the team
		// Start accounting for this after the first half of the team has been added
		let discourage = false;
		if (!discard && slot > 3) {
			discourage = true;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i] === "sleeptalk" && restrictMoves['sleeptalk'] > 1) { discourage = false; break; }
				if (moves[i] !== "bellydrum" && moves[i] !== "haze" && moves[i] !== "thief" && restrictMoves[moves[i]] > 0) { discourage = false; break; }
				if (isPhazingMove(moves[i]) && restrictMoves['phazing'] > 0) { discourage = false; break; }
				if (isSleepMove(moves[i]) && restrictMoves['sleeping'] > 1) { discourage = false; break; }
			}
		}
		if (discourage && this.random(2) === 0) discard = true;

		// Add the held item
		// TODO: for some reason, items like Thick Club are not working in randbats
		if (set.item) item = set.item[this.random(set.item.length)];

		// Adjust ivs for hiddenpower
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].substr(0, 11) !== 'hiddenpower') continue;
			let hpType = moves[i].substr(11, moves[i].length);
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
			BL: 70,
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
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[fillerMoves[index]] = true;
				}
			}
		} while (!done);
	}
}

module.exports = RandomGen2Teams;
