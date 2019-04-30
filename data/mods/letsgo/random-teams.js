'use strict';

const RandomTeams = require('../../random-teams');

class RandomLetsGoTeams extends RandomTeams {
	/**
	 * @param {string | Template} template
	 * @param {number} [slot]
	 * @param {RandomTeamsTypes.TeamDetails} [teamDetails]
	 * @return {RandomTeamsTypes.RandomSet}
	 */
	randomSet(template, slot = 1, teamDetails = {}) {
		template = this.getTemplate(template);
		let species = template.species;

		if (!template.exists || (!template.randomBattleMoves && !template.learnset)) {
			template = this.getTemplate('bulbasaur');

			let err = new Error('Template incompatible with random battles: ' + species);
			Monitor.crashlog(err, 'The Let\'s Go randbat set generator');
		}

		if (template.battleOnly) {
			// Only change the species. The template has custom moves, and may have different typing and requirements.
			species = template.baseSpecies;
		}

		let movePool = (template.randomBattleMoves ? template.randomBattleMoves.slice() : template.learnset ? Object.keys(template.learnset) : []);
		/**@type {string[]} */
		let moves = [];
		/**@type {{[k: string]: true}} */
		let hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) {
			hasType[template.types[1]] = true;
		}

		/**@type {{[k: string]: boolean}} */
		let hasMove = {};
		let counter;

		do {
			// Keep track of all moves we have:
			hasMove = {};
			for (const setMoveid of moves) {
				hasMove[setMoveid] = true;
			}

			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length < 4 && movePool.length) {
				let moveid = this.sampleNoReplace(movePool);
				hasMove[moveid] = true;
				moves.push(moveid);
			}

			counter = this.queryMoves(moves, hasType, {}, movePool);

			// Iterate through the moves again, this time to cull them:
			for (const [i, setMoveid] of moves.entries()) {
				let move = this.getMove(setMoveid);
				let moveid = move.id;
				let rejected = false;
				let isSetup = false;

				switch (moveid) {
				// Set up once and only if we have the moves for it
				case 'bulkup': case 'swordsdance':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) rejected = true;
					if (counter.Physical + counter['physicalpool'] < 2) rejected = true;
					isSetup = true;
					break;
				case 'calmmind': case 'nastyplot': case 'quiverdance':
					if (counter.setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					if (counter.Special + counter['specialpool'] < 2) rejected = true;
					isSetup = true;
					break;
				case 'growth': case 'shellsmash':
					if (counter.setupType !== 'Mixed') rejected = true;
					if (counter.damagingMoves.length + counter['physicalpool'] + counter['specialpool'] < 2) rejected = true;
					isSetup = true;
					break;
				case 'agility':
					if (counter.damagingMoves.length < 2 && !counter.setupType) rejected = true;
					if (!counter.setupType) isSetup = true;
					break;

				// Bad after setup
				case 'dragontail':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['encore'] || hasMove['roar'] || hasMove['whirlwind']) rejected = true;
					break;
				case 'fakeout': case 'uturn':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['substitute']) rejected = true;
					break;
				case 'haze': case 'leechseed': case 'roar': case 'whirlwind':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['dragontail']) rejected = true;
					break;
				case 'nightshade': case 'seismictoss': case 'superfang':
					if (counter.damagingMoves.length > 1 || counter.setupType) rejected = true;
					break;
				case 'protect':
					if (counter.setupType || hasMove['rest'] || hasMove['lightscreen'] || hasMove['reflect']) rejected = true;
					break;
				case 'stealthrock':
					if (counter.setupType || !!counter['speedsetup'] || teamDetails.stealthRock) rejected = true;
					break;

				// Bit redundant to have both
				case 'leechlife': case 'substitute':
					if (hasMove['uturn']) rejected = true;
					break;
				case 'dragonclaw': case 'dragonpulse':
					if (hasMove['dragontail'] || hasMove['outrage']) rejected = true;
					break;
				case 'thunderbolt':
					if (hasMove['thunder']) rejected = true;
					break;
				case 'flareblitz': case 'flamethrower': case 'lavaplume':
					if (hasMove['fireblast'] || hasMove['firepunch']) rejected = true;
					break;
				case 'megadrain':
					if (hasMove['petaldance'] || hasMove['powerwhip']) rejected = true;
					break;
				case 'bonemerang':
					if (hasMove['earthquake']) rejected = true;
					break;
				case 'icebeam':
					if (hasMove['blizzard']) rejected = true;
					break;
				case 'return':
					if (hasMove['bodyslam'] || hasMove['facade'] || hasMove['doubleedge']) rejected = true;
					break;
				case 'psychic':
					if (hasMove['psyshock']) rejected = true;
					break;
				case 'rockslide':
					if (hasMove['stoneedge']) rejected = true;
					break;
				case 'hydropump': case 'willowisp':
					if (hasMove['scald']) rejected = true;
					break;
				case 'surf':
					if (hasMove['hydropump'] || hasMove['scald']) rejected = true;
					break;
				}

				// Increased/decreased priority moves are unneeded with moves that boost only speed
				if (move.priority !== 0 && !!counter['speedsetup']) {
					rejected = true;
				}

				// This move doesn't satisfy our setup requirements:
				if ((move.category === 'Physical' && counter.setupType === 'Special') || (move.category === 'Special' && counter.setupType === 'Physical')) {
					// Reject STABs last in case the setup type changes later on
					if (!hasType[move.type] || counter.stab > 1 || counter[move.category] < 2) rejected = true;
				}
				// @ts-ignore
				if (counter.setupType && !isSetup && counter.setupType !== 'Mixed' && move.category !== counter.setupType && counter[counter.setupType] < 2) {
					// Mono-attacking with setup and RestTalk is allowed
					// Reject Status moves only if there is nothing else to reject
					// @ts-ignore
					if (move.category !== 'Status' || counter[counter.setupType] + counter.Status > 3 && counter['physicalsetup'] + counter['specialsetup'] < 2) rejected = true;
				}

				// Pokemon should have moves that benefit their Type, as well as moves required by its forme
				// @ts-ignore
				if (!rejected && (counter['physicalsetup'] + counter['specialsetup'] < 2 && (!counter.setupType || counter.setupType === 'Mixed' || (move.category !== counter.setupType && move.category !== 'Status') || counter[counter.setupType] + counter.Status > 3)) &&
					(((counter.damagingMoves.length === 0 || !counter.stab) && (counter['physicalpool'] || counter['specialpool'])) ||
					(hasType['Dark'] && !counter['Dark']) ||
					(hasType['Dragon'] && !counter['Dragon']) ||
					(hasType['Electric'] && !counter['Electric']) ||
					(hasType['Fighting'] && !counter['Fighting'] && (counter.setupType || !counter['Status'])) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Ghost'] && !hasType['Dark'] && !counter['Ghost']) ||
					(hasType['Ground'] && !counter['Ground']) ||
					(hasType['Ice'] && !counter['Ice']) ||
					(hasType['Water'] && (!counter['Water'] || !counter.stab)) ||
					(template.requiredMove && movePool.includes(toId(template.requiredMove))))) {
					// Reject Status or non-STAB
					if (!isSetup && !move.weather) {
						if (move.category === 'Status' || !hasType[move.type] || move.selfSwitch || move.basePower && move.basePower < 40 && !move.multihit) rejected = true;
					}
				}

				// Remove rejected moves from the move list
				if (rejected && movePool.length) {
					moves.splice(i, 1);
					break;
				}
			}
		} while (moves.length < 4 && movePool.length);

		let ivs = {
			hp: 31,
			atk: 31,
			def: 31,
			spa: 31,
			spd: 31,
			spe: 31,
		};

		// Minimize confusion damage
		if (!counter['Physical'] && !hasMove['transform']) {
			ivs.atk = 0;
		}

		return {
			name: template.baseSpecies,
			species: species,
			level: 100,
			gender: template.gender,
			happiness: 70,
			shiny: this.randomChance(1, 1024),
			item: (template.requiredItem || ''),
			ability: 'No Ability',
			moves: moves,
			evs: {hp: 20, atk: 20, def: 20, spa: 20, spd: 20, spe: 20},
			ivs: ivs,
		};
	}

	randomTeam() {
		let pokemon = [];

		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			let template = this.getTemplate(id);
			if (template.num < 1 || (template.num > 151 && ![808, 809].includes(template.num)) || template.nfe || !template.randomBattleMoves || !template.randomBattleMoves.length) continue;
			pokemonPool.push(id);
		}

		/**@type {{[k: string]: number}} */
		let typeCount = {};
		/**@type {{[k: string]: number}} */
		let typeComboCount = {};
		/**@type {{[k: string]: number}} */
		let baseFormes = {};
		/**@type {RandomTeamsTypes.TeamDetails} */
		let teamDetails = {};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;

			let types = template.types;

			// Limit 2 of any type
			let skip = false;
			for (const type of template.types) {
				if (typeCount[type] > 1 && this.randomChance(4, 5)) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			let set = this.randomSet(template, pokemon.length, teamDetails);

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (typeComboCount[typeCombo] >= 1) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;

			// Increment type counters
			for (const type of types) {
				if (type in typeCount) {
					typeCount[type]++;
				} else {
					typeCount[type] = 1;
				}
			}
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Team details
			if (set.moves.includes('stealthrock')) teamDetails['stealthRock'] = 1;
			if (set.moves.includes('rapidspin')) teamDetails['rapidSpin'] = 1;
		}
		return pokemon;
	}
}

module.exports = RandomLetsGoTeams;
