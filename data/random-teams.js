'use strict';

/** @type {typeof import('../sim/dex')} */
const Dex = require(/** @type {any} */ ('../.sim-dist/dex'));
/** @type {typeof import('../sim/prng').PRNG} */
const PRNG = require(/** @type {any} */ ('../.sim-dist/prng')).PRNG;

/**@type {AnyObject} */
// @ts-ignore
const randomBSSFactorySets = require('./bss-factory-sets.json');
/**@type {AnyObject} */
// @ts-ignore
const randomFactorySets = require('./factory-sets.json');

/**
 * @typedef {Object} TeamData
 * @property {{[k: string]: number}} typeCount
 * @property {{[k: string]: number}} typeComboCount
 * @property {{[k: string]: number}} baseFormes
 * @property {number} megaCount
 * @property {number} [zCount]
 * @property {{[k: string]: number}} has
 * @property {boolean} forceResult
 * @property {{[k: string]: number}} weaknesses
 * @property {{[k: string]: number}} resistances
 * @property {string} [weather]
 * @property {number} [eeveeLimCount]
 */

class RandomTeams extends Dex.ModdedDex {
	/**
	 * @param {Format | string} format
	 * @param {?PRNG | [number, number, number, number]} [prng]
	 */
	constructor(format, prng) {
		format = Dex.getFormat(format);
		super(format.mod);
		this.randomBSSFactorySets = randomBSSFactorySets;
		this.randomFactorySets = randomFactorySets;

		this.factoryTier = '';
		this.format = format;
		this.prng = prng && !Array.isArray(prng) ? prng : new PRNG(prng);
	}

	/**
	 * @param {?PRNG | [number, number, number, number]} [prng]
	 */
	setSeed(prng) {
		this.prng = prng && !Array.isArray(prng) ? prng : new PRNG(prng);
	}

	/**
	 * @param {PlayerOptions | null} [options]
	 * @return {PokemonSet[]}
	 */
	getTeam(options) {
		const generatorName = typeof this.format.team === 'string' && this.format.team.startsWith('random') ? this.format.team + 'Team' : '';
		// @ts-ignore
		return this[generatorName || 'randomTeam'](options);
	}

	/**
	 * @param {number} numerator - the top part of the probability fraction
	 * @param {number} denominator - the bottom part of the probability fraction
	 * @return {boolean} - randomly true or false
	 */
	randomChance(numerator, denominator) {
		return this.prng.randomChance(numerator, denominator);
	}

	/**
	 * @param {ReadonlyArray<T>} items - the items to choose from
	 * @return {T} - a random item from items
	 * @template T
	 */
	sample(items) {
		return this.prng.sample(items);
	}

	/**
	 * @param {number} [m]
	 * @param {number} [n]
	 * @return {number}
	 */
	random(m, n) {
		return this.prng.next(m, n);
	}

	/**
	 * Remove an element from an unsorted array significantly faster
	 * than .splice
	 *
	 * @param {any[]} list
	 * @param {number} index
	 */
	fastPop(list, index) {
		// If an array doesn't need to be in order, replacing the
		// element at the given index with the removed element
		// is much, much faster than using list.splice(index, 1).
		let length = list.length;
		let element = list[index];
		list[index] = list[length - 1];
		list.pop();
		return element;
	}

	/**
	 * Remove a random element from an unsorted array and return it.
	 * Uses the battle's RNG if in a battle.
	 *
	 * @param {any[]} list
	 */
	sampleNoReplace(list) {
		let length = list.length;
		let index = this.random(length);
		return this.fastPop(list, index);
	}

	/**
	 * @param {Template} template
	 */
	checkBattleForme(template) {
		// If the Pokémon has a Mega or Primal alt forme, that's its preferred battle forme.
		// No randomization, no choice. We are just checking its existence.
		// Returns a Pokémon template for further details.
		if (!template.otherFormes) return null;
		let firstForme = this.getTemplate(template.otherFormes[0]);
		if (firstForme.isMega || firstForme.isPrimal) return firstForme;
		return null;
	}

	// checkAbilities(selectedAbilities, defaultAbilities) {
	// 	if (!selectedAbilities.length) return true;
	// 	let selectedAbility = selectedAbilities.pop();
	// 	let isValid = false;
	// 	for (let i = 0; i < defaultAbilities.length; i++) {
	// 		let defaultAbility = defaultAbilities[i];
	// 		if (!defaultAbility) break;
	// 		if (defaultAbility.includes(selectedAbility)) {
	// 			defaultAbilities.splice(i, 1);
	// 			isValid = this.checkAbilities(selectedAbilities, defaultAbilities);
	// 			if (isValid) break;
	// 			defaultAbilities.splice(i, 0, defaultAbility);
	// 		}
	// 	}
	// 	if (!isValid) selectedAbilities.push(selectedAbility);
	// 	return isValid;
	// }
	// hasMegaEvo(template) {
	// 	if (!template.otherFormes) return false;
	// 	let firstForme = this.getTemplate(template.otherFormes[0]);
	// 	return !!firstForme.isMega;
	// }
	/**
	 * @return {RandomTeamsTypes.RandomSet[]}
	 */
	randomCCTeam() {
		let team = [];

		let natures = Object.keys(this.data.Natures);
		let items = Object.keys(this.data.Items);

		let random6 = this.random6Pokemon();

		for (let i = 0; i < 6; i++) {
			let species = random6[i];
			let template = this.getTemplate(species);

			// Random legal item
			let item = '';
			if (this.gen >= 2) {
				do {
					item = this.sample(items);
				} while (this.getItem(item).gen > this.gen || this.data.Items[item].isNonstandard);
			}

			// Make sure forme is legal
			if (template.battleOnly || template.requiredItems && !template.requiredItems.some(req => toId(req) === item)) {
				template = this.getTemplate(template.baseSpecies);
				species = template.name;
			}

			// Make sure that a base forme does not hold any forme-modifier items.
			let itemData = this.getItem(item);
			if (itemData.forcedForme && species === this.getTemplate(itemData.forcedForme).baseSpecies) {
				do {
					item = this.sample(items);
					itemData = this.getItem(item);
				} while (itemData.gen > this.gen || itemData.isNonstandard || itemData.forcedForme && species === this.getTemplate(itemData.forcedForme).baseSpecies);
			}

			// Random legal ability
			let abilities = Object.values(template.abilities).filter(a => this.getAbility(a).gen <= this.gen);
			/**@type {string} */
			// @ts-ignore
			let ability = this.gen <= 2 ? 'None' : this.sample(abilities);

			// Four random unique moves from the movepool
			let moves;
			let pool = ['struggle'];
			if (species === 'Smeargle') {
				pool = Object.keys(this.data.Movedex).filter(moveid => !(['chatter', 'struggle', 'paleowave', 'shadowstrike', 'magikarpsrevenge'].includes(moveid) || this.data.Movedex[moveid].isZ));
			} else if (template.learnset) {
				pool = Object.keys(template.learnset);
				if (template.species.substr(0, 6) === 'Rotom-') {
					const learnset = this.getTemplate(template.baseSpecies).learnset;
					if (learnset) pool = [...new Set(pool.concat(Object.keys(learnset)))];
				}
			} else {
				const learnset = this.getTemplate(template.baseSpecies).learnset;
				if (learnset) pool = Object.keys(learnset);
			}
			if (pool.length <= 4) {
				moves = pool;
			} else {
				moves = [this.sampleNoReplace(pool), this.sampleNoReplace(pool), this.sampleNoReplace(pool), this.sampleNoReplace(pool)];
			}

			// Random EVs
			let evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			let s = ["hp", "atk", "def", "spa", "spd", "spe"];
			let evpool = 510;
			do {
				let x = this.sample(s);
				// @ts-ignore
				let y = this.random(Math.min(256 - evs[x], evpool + 1));
				// @ts-ignore
				evs[x] += y;
				evpool -= y;
			} while (evpool > 0);

			// Random IVs
			let ivs = {hp: this.random(32), atk: this.random(32), def: this.random(32), spa: this.random(32), spd: this.random(32), spe: this.random(32)};

			// Random nature
			let nature = this.sample(natures);

			// Level balance--calculate directly from stats rather than using some silly lookup table
			let mbstmin = 1307; // Sunkern has the lowest modified base stat total, and that total is 807

			let stats = template.baseStats;
			// If Wishiwashi, use the school-forme's much higher stats
			if (template.baseSpecies === 'Wishiwashi') stats = Dex.getTemplate('wishiwashischool').baseStats;

			// Modified base stat total assumes 31 IVs, 85 EVs in every stat
			let mbst = (stats["hp"] * 2 + 31 + 21 + 100) + 10;
			mbst += (stats["atk"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["def"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spa"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spd"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spe"] * 2 + 31 + 21 + 100) + 5;

			let level = Math.floor(100 * mbstmin / mbst); // Initial level guess will underestimate

			while (level < 100) {
				mbst = Math.floor((stats["hp"] * 2 + 31 + 21 + 100) * level / 100 + 10);
				mbst += Math.floor(((stats["atk"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100); // Since damage is roughly proportional to level
				mbst += Math.floor((stats["def"] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor(((stats["spa"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats["spd"] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor((stats["spe"] * 2 + 31 + 21 + 100) * level / 100 + 5);

				if (mbst >= mbstmin) break;
				level++;
			}

			// Random happiness
			let happiness = this.random(256);

			// Random shininess
			let shiny = this.randomChance(1, 1024);

			team.push({
				name: template.baseSpecies,
				species: template.species,
				gender: template.gender,
				item: item,
				ability: ability,
				moves: moves,
				evs: evs,
				ivs: ivs,
				nature: nature,
				level: level,
				happiness: happiness,
				shiny: shiny,
			});
		}

		return team;
	}

	random6Pokemon() {
		// Pick six random pokemon--no repeats, even among formes
		// Also need to either normalize for formes or select formes at random
		// Unreleased are okay but no CAP
		let last = [0, 151, 251, 386, 493, 649, 721, 807][this.gen];
		/**@type {{[k: string]: number}} */
		let hasDexNumber = {};
		for (let i = 0; i < 6; i++) {
			let num;
			do {
				num = this.random(last) + 1;
			} while (num in hasDexNumber);
			hasDexNumber[num] = i;
		}

		/**@type {string[][]} */
		let formes = [[], [], [], [], [], []];
		for (let id in this.data.Pokedex) {
			if (!(this.data.Pokedex[id].num in hasDexNumber)) continue;
			let template = this.getTemplate(id);
			if (template.gen <= this.gen && template.species !== 'Pichu-Spiky-eared' && template.species.substr(0, 8) !== 'Pikachu-') {
				formes[hasDexNumber[template.num]].push(template.species);
			}
		}

		let sixPokemon = [];
		for (let i = 0; i < 6; i++) {
			if (!formes[i].length) {
				throw new Error("Invalid pokemon gen " + this.gen + ": " + JSON.stringify(formes) + " numbers " + JSON.stringify(hasDexNumber));
			}
			sixPokemon.push(this.sample(formes[i]));
		}
		return sixPokemon;
	}

	randomHCTeam() {
		let team = [];

		let itemPool = Object.keys(this.data.Items);
		let abilityPool = Object.keys(this.data.Abilities);
		let movePool = Object.keys(this.data.Movedex);
		let naturePool = Object.keys(this.data.Natures);

		let random6 = this.random6Pokemon();

		for (let i = 0; i < 6; i++) {
			// Choose forme
			let template = this.getTemplate(random6[i]);

			// Random unique item
			let item = '';
			if (this.gen >= 2) {
				do {
					item = this.sampleNoReplace(itemPool);
				} while (this.getItem(item).gen > this.gen || this.data.Items[item].isNonstandard);
			}

			// Random unique ability
			let ability = 'None';
			if (this.gen >= 3) {
				do {
					ability = this.sampleNoReplace(abilityPool);
				} while (this.getAbility(ability).gen > this.gen || this.data.Abilities[ability].isNonstandard);
			}

			// Random unique moves
			let m = [];
			do {
				let moveid = this.sampleNoReplace(movePool);
				if (this.getMove(moveid).gen <= this.gen && !this.data.Movedex[moveid].isNonstandard && (moveid === 'hiddenpower' || moveid.substr(0, 11) !== 'hiddenpower')) {
					m.push(moveid);
				}
			} while (m.length < 4);

			// Random EVs
			let evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			let s = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
			if (this.gen === 6) {
				let evpool = 510;
				do {
					let x = this.sample(s);
					// @ts-ignore
					let y = this.random(Math.min(256 - evs[x], evpool + 1));
					// @ts-ignore
					evs[x] += y;
					evpool -= y;
				} while (evpool > 0);
			} else {
				for (const x of s) {
					// @ts-ignore
					evs[x] = this.random(256);
				}
			}

			// Random IVs
			let ivs = {hp: this.random(32), atk: this.random(32), def: this.random(32), spa: this.random(32), spd: this.random(32), spe: this.random(32)};

			// Random nature
			let nature = this.sample(naturePool);

			// Level balance
			let mbstmin = 1307;
			let stats = template.baseStats;
			let mbst = (stats['hp'] * 2 + 31 + 21 + 100) + 10;
			mbst += (stats['atk'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['def'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spa'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spd'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spe'] * 2 + 31 + 21 + 100) + 5;
			let level = Math.floor(100 * mbstmin / mbst);
			while (level < 100) {
				mbst = Math.floor((stats['hp'] * 2 + 31 + 21 + 100) * level / 100 + 10);
				mbst += Math.floor(((stats['atk'] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats['def'] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor(((stats['spa'] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats['spd'] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor((stats['spe'] * 2 + 31 + 21 + 100) * level / 100 + 5);
				if (mbst >= mbstmin) break;
				level++;
			}

			// Random happiness
			let happiness = this.random(256);

			// Random shininess
			let shiny = this.randomChance(1, 1024);

			team.push({
				name: template.baseSpecies,
				species: template.species,
				gender: template.gender,
				item: item,
				ability: ability,
				moves: m,
				evs: evs,
				ivs: ivs,
				nature: nature,
				level: level,
				happiness: happiness,
				shiny: shiny,
			});
		}

		return team;
	}

	/**
	 * @param {?string[]} moves
	 * @param {{[k: string]: boolean}} [hasType]
	 * @param {{[k: string]: boolean}} [hasAbility]
	 * @param {string[]} [movePool]
	 */
	queryMoves(moves, hasType = {}, hasAbility = {}, movePool = []) {
		// This is primarily a helper function for random setbuilder functions.
		let counter = {
			Physical: 0, Special: 0, Status: 0, damage: 0, recovery: 0, stab: 0, inaccurate: 0, priority: 0, recoil: 0, drain: 0,
			adaptability: 0, bite: 0, contrary: 0, hustle: 0, ironfist: 0, serenegrace: 0, sheerforce: 0, skilllink: 0, technician: 0,
			physicalsetup: 0, specialsetup: 0, mixedsetup: 0, speedsetup: 0, physicalpool: 0, specialpool: 0,
			/**@type {Move[]} */
			damagingMoves: [],
			/**@type {{[k: string]: number}} */
			damagingMoveIndex: {},
			setupType: '',
			// typescript
			Bug: 0, Dark: 0, Dragon: 0, Electric: 0, Fairy: 0, Fighting: 0, Fire: 0, Flying: 0, Ghost: 0, Grass: 0, Ground: 0,
			Ice: 0, Normal: 0, Poison: 0, Psychic: 0, Rock: 0, Steel: 0, Water: 0,
		};

		for (let type in Dex.data.TypeChart) {
			// @ts-ignore
			counter[type] = 0;
		}

		if (!moves || !moves.length) return counter;

		// Moves that heal a fixed amount:
		let RecoveryMove = [
			'healorder', 'milkdrink', 'moonlight', 'morningsun', 'recover', 'roost', 'slackoff', 'softboiled', 'synthesis',
		];
		// Moves which drop stats:
		let ContraryMove = [
			'closecombat', 'leafstorm', 'overheat', 'superpower', 'vcreate',
		];
		// Moves that boost Attack:
		let PhysicalSetup = [
			'bellydrum', 'bulkup', 'coil', 'curse', 'dragondance', 'honeclaws', 'howl', 'poweruppunch', 'swordsdance',
		];
		// Moves which boost Special Attack:
		let SpecialSetup = [
			'calmmind', 'chargebeam', 'geomancy', 'nastyplot', 'quiverdance', 'tailglow',
		];
		// Moves which boost Attack AND Special Attack:
		let MixedSetup = [
			'growth', 'happyhour', 'holdhands', 'shellsmash', 'workup',
		];
		// Moves which boost Speed:
		let SpeedSetup = [
			'agility', 'autotomize', 'rockpolish', 'shiftgear',
		];
		// Moves that shouldn't be the only STAB moves:
		let NoStab = [
			'aquajet', 'bounce', 'explosion', 'fakeout', 'firstimpression', 'flamecharge', 'fly', 'iceshard', 'pursuit', 'quickattack', 'selfdestruct', 'skyattack', 'suckerpunch', 'watershuriken',
			'chargebeam', 'clearsmog', 'eruption', 'vacuumwave', 'waterspout',
		];

		// Iterate through all moves we've chosen so far and keep track of what they do:
		for (const [k, moveId] of moves.entries()) {
			let move = this.getMove(moveId);
			let moveid = move.id;
			let movetype = move.type;
			if (['judgment', 'multiattack', 'revelationdance'].includes(moveid)) movetype = Object.keys(hasType)[0];
			if (move.damage || move.damageCallback) {
				// Moves that do a set amount of damage:
				counter['damage']++;
				counter.damagingMoves.push(move);
				counter.damagingMoveIndex[moveid] = k;
			} else {
				// Are Physical/Special/Status moves:
				counter[move.category]++;
			}
			// Moves that have a low base power:
			if (moveid === 'lowkick' || (move.basePower && move.basePower <= 60 && moveid !== 'rapidspin')) counter['technician']++;
			// Moves that hit up to 5 times:
			if (move.multihit && Array.isArray(move.multihit) && move.multihit[1] === 5) counter['skilllink']++;
			if (move.recoil || move.hasCustomRecoil) counter['recoil']++;
			if (move.drain) counter['drain']++;
			// Moves which have a base power, but aren't super-weak like Rapid Spin:
			if (move.basePower > 30 || move.multihit || move.basePowerCallback || moveid === 'naturepower') {
				// @ts-ignore
				counter[movetype]++;
				if (hasType[movetype] || movetype === 'Normal' && (hasAbility['Aerilate'] || hasAbility['Galvanize'] || hasAbility['Pixilate'] || hasAbility['Refrigerate'])) {
					counter['adaptability']++;
					// STAB:
					// Certain moves aren't acceptable as a Pokemon's only STAB attack
					if (!NoStab.includes(moveid) && (moveid !== 'hiddenpower' || Object.keys(hasType).length === 1)) {
						counter['stab']++;
						// Ties between Physical and Special setup should broken in favor of STABs
						counter[move.category] += 0.1;
					}
				} else if (move.priority === 0 && hasAbility['Protean'] && !NoStab.includes(moveid)) {
					counter['stab']++;
				} else if (movetype === 'Steel' && hasAbility['Steelworker']) {
					counter['stab']++;
				}
				if (move.category === 'Physical') counter['hustle']++;
				if (move.flags['bite']) counter['bite']++;
				if (move.flags['punch']) counter['ironfist']++;
				counter.damagingMoves.push(move);
				counter.damagingMoveIndex[moveid] = k;
			}
			// Moves with secondary effects:
			if (move.secondary) {
				counter['sheerforce']++;
				if (move.secondary.chance && move.secondary.chance >= 20 && move.secondary.chance < 100) {
					counter['serenegrace']++;
				}
			}
			// Moves with low accuracy:
			if (move.accuracy && move.accuracy !== true && move.accuracy < 90) counter['inaccurate']++;
			// Moves with non-zero priority:
			if (move.category !== 'Status' && move.priority !== 0) counter['priority']++;

			// Moves that change stats:
			if (RecoveryMove.includes(moveid)) counter['recovery']++;
			if (ContraryMove.includes(moveid)) counter['contrary']++;
			if (PhysicalSetup.includes(moveid)) {
				counter['physicalsetup']++;
				counter.setupType = 'Physical';
			} else if (SpecialSetup.includes(moveid)) {
				counter['specialsetup']++;
				counter.setupType = 'Special';
			}
			if (MixedSetup.includes(moveid)) counter['mixedsetup']++;
			if (SpeedSetup.includes(moveid)) counter['speedsetup']++;
		}

		// Keep track of the available moves
		for (const moveid of movePool) {
			let move = this.getMove(moveid);
			if (move.damageCallback) continue;
			if (move.category === 'Physical') counter['physicalpool']++;
			if (move.category === 'Special') counter['specialpool']++;
		}

		// Choose a setup type:
		if (counter['mixedsetup']) {
			counter.setupType = 'Mixed';
		} else if (counter.setupType) {
			let pool = {
				Physical: counter.Physical + counter['physicalpool'],
				Special: counter.Special + counter['specialpool'],
			};
			if (counter['physicalsetup'] && counter['specialsetup']) {
				if (pool.Physical === pool.Special) {
					if (counter.Physical > counter.Special) counter.setupType = 'Physical';
					if (counter.Special > counter.Physical) counter.setupType = 'Special';
				} else {
					counter.setupType = pool.Physical > pool.Special ? 'Physical' : 'Special';
				}
			// @ts-ignore
			} else if (!pool[counter.setupType] || pool[counter.setupType] === 1 && (!moves.includes('rest') || !moves.includes('sleeptalk'))) {
				counter.setupType = '';
			}
		}
		counter['Physical'] = Math.floor(counter['Physical']);
		counter['Special'] = Math.floor(counter['Special']);

		return counter;
	}

	/**
	 * @param {string | Template} template
	 * @param {number} [slot]
	 * @param {RandomTeamsTypes.TeamDetails} [teamDetails]
	 * @param {boolean} [isDoubles]
	 * @return {RandomTeamsTypes.RandomSet}
	 */
	randomSet(template, slot = 1, teamDetails = {}, isDoubles = false) {
		template = this.getTemplate(template);
		let baseTemplate = template;
		let species = template.species;

		if (!template.exists || ((!isDoubles || !template.randomDoubleBattleMoves) && !template.randomBattleMoves && !template.learnset)) {
			// GET IT? UNOWN? BECAUSE WE CAN'T TELL WHAT THE POKEMON IS
			template = this.getTemplate('unown');

			let err = new Error('Template incompatible with random battles: ' + species);
			Monitor.crashlog(err, 'The randbat set generator');
		}

		if (template.battleOnly) {
			// Only change the species. The template has custom moves, and may have different typing and requirements.
			species = template.baseSpecies;
		}
		let battleForme = this.checkBattleForme(template);
		if (battleForme && battleForme.randomBattleMoves && template.otherFormes && (battleForme.isMega ? !teamDetails.megaStone : this.random(2))) {
			template = this.getTemplate(template.otherFormes.length >= 2 ? this.sample(template.otherFormes) : template.otherFormes[0]);
		}

		const randMoves = !isDoubles ? template.randomBattleMoves : template.randomDoubleBattleMoves || template.randomBattleMoves;
		let movePool = (randMoves ? randMoves.slice() : template.learnset ? Object.keys(template.learnset) : []);
		/**@type {string[]} */
		let moves = [];
		let ability = '';
		let item = '';
		let evs = {
			hp: 85,
			atk: 85,
			def: 85,
			spa: 85,
			spd: 85,
			spe: 85,
		};
		let ivs = {
			hp: 31,
			atk: 31,
			def: 31,
			spa: 31,
			spd: 31,
			spe: 31,
		};
		/**@type {{[k: string]: true}} */
		let hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) {
			hasType[template.types[1]] = true;
		}
		/**@type {{[k: string]: true}} */
		let hasAbility = {};
		hasAbility[template.abilities[0]] = true;
		if (template.abilities[1]) {
			// @ts-ignore
			hasAbility[template.abilities[1]] = true;
		}
		if (template.abilities['H']) {
			// @ts-ignore
			hasAbility[template.abilities['H']] = true;
		}
		let availableHP = 0;
		for (const moveid of movePool) {
			if (moveid.startsWith('hiddenpower')) availableHP++;
		}

		// These moves can be used even if we aren't setting up to use them:
		let SetupException = ['closecombat', 'extremespeed', 'superpower', 'clangingscales', 'dracometeor', 'leafstorm', 'overheat'];

		let counterAbilities = ['Adaptability', 'Contrary', 'Hustle', 'Iron Fist', 'Skill Link'];
		let ateAbilities = ['Aerilate', 'Galvanize', 'Pixilate', 'Refrigerate'];

		/**@type {{[k: string]: boolean}} */
		let hasMove = {};
		let counter;

		do {
			// Keep track of all moves we have:
			hasMove = {};
			for (const moveid of moves) {
				if (moveid.startsWith('hiddenpower')) {
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
			}

			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length < 4 && movePool.length) {
				let moveid = this.sampleNoReplace(movePool);
				if (moveid.startsWith('hiddenpower')) {
					availableHP--;
					if (hasMove['hiddenpower']) continue;
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
				moves.push(moveid);
			}

			counter = this.queryMoves(moves, hasType, hasAbility, movePool);

			// Iterate through the moves again, this time to cull them:
			for (const [k, moveId] of moves.entries()) {
				let move = this.getMove(moveId);
				let moveid = move.id;
				let rejected = false;
				let isSetup = false;

				switch (moveid) {
				// Not very useful without their supporting moves
				case 'clangingscales': case 'electricterrain': case 'happyhour': case 'holdhands':
					if (teamDetails.zMove || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'cottonguard': case 'defendorder':
					if (!counter['recovery'] && !hasMove['rest']) rejected = true;
					break;
				case 'bounce': case 'dig': case 'fly':
					if (teamDetails.zMove || counter.setupType !== 'Physical') rejected = true;
					break;
				case 'focuspunch':
					if (!hasMove['substitute'] || counter.damagingMoves.length < 2) rejected = true;
					break;
				case 'perishsong':
					if (!hasMove['protect']) rejected = true;
					break;
				case 'reflect':
					if (!hasMove['calmmind'] && !hasMove['lightscreen']) rejected = true;
					if (movePool.length > 1) {
						let screen = movePool.indexOf('lightscreen');
						if (screen >= 0) this.fastPop(movePool, screen);
					}
					break;
				case 'rest':
					if (movePool.includes('sleeptalk')) rejected = true;
					break;
				case 'sleeptalk':
					if (!hasMove['rest']) rejected = true;
					if (movePool.length > 1) {
						let rest = movePool.indexOf('rest');
						if (rest >= 0) this.fastPop(movePool, rest);
					}
					break;
				case 'storedpower':
					if (!counter.setupType && !hasMove['cosmicpower']) rejected = true;
					break;

				// Set up once and only if we have the moves for it
				case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) {
						if (!hasMove['growth'] || hasMove['sunnyday']) rejected = true;
					}
					if (counter.Physical + counter['physicalpool'] < 2 && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'calmmind': case 'geomancy': case 'nastyplot': case 'quiverdance': case 'tailglow':
					if (counter.setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					if (counter.Special + counter['specialpool'] < 2 && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'growth': case 'shellsmash': case 'workup':
					if (counter.setupType !== 'Mixed' || counter['mixedsetup'] > 1) rejected = true;
					if (counter.damagingMoves.length + counter['physicalpool'] + counter['specialpool'] < 2) rejected = true;
					if (moveid === 'growth' && !hasMove['sunnyday']) rejected = true;
					isSetup = true;
					break;
				case 'agility': case 'autotomize': case 'rockpolish': case 'shiftgear':
					if (counter.damagingMoves.length < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!counter.setupType) isSetup = true;
					break;
				case 'flamecharge':
					if (counter.damagingMoves.length < 3 && !counter.setupType) rejected = true;
					if (hasMove['dracometeor'] || hasMove['overheat']) rejected = true;
					break;

				// Bad after setup
				case 'circlethrow': case 'dragontail':
					if (counter.setupType && ((!hasMove['rest'] && !hasMove['sleeptalk']) || hasMove['stormthrow'])) rejected = true;
					if (!!counter['speedsetup'] || hasMove['encore'] || hasMove['raindance'] || hasMove['roar'] || hasMove['whirlwind']) rejected = true;
					break;
				case 'defog':
					if (counter.setupType || hasMove['spikes'] || hasMove['stealthrock'] || (hasMove['rest'] && hasMove['sleeptalk']) || teamDetails.hazardClear) rejected = true;
					break;
				case 'fakeout': case 'tailwind':
					if (counter.setupType || hasMove['substitute'] || hasMove['switcheroo'] || hasMove['trick']) rejected = true;
					break;
				case 'foulplay':
					if (counter.setupType || !!counter['speedsetup'] || counter['Dark'] > 2 || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (counter.damagingMoves.length - 1 === counter['priority']) rejected = true;
					break;
				case 'haze': case 'spikes': case 'waterspout':
					if (counter.setupType || !!counter['speedsetup'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'healbell': case 'technoblast':
					if (counter['speedsetup']) rejected = true;
					break;
				case 'healingwish': case 'memento':
					if (counter.setupType || !!counter['recovery'] || hasMove['substitute']) rejected = true;
					break;
				case 'leechseed': case 'roar': case 'whirlwind':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['dragontail']) rejected = true;
					break;
				case 'nightshade': case 'seismictoss': case 'superfang':
					if (counter.damagingMoves.length > 1 || counter.setupType) rejected = true;
					break;
				case 'protect':
					if (counter.setupType && !hasMove['wish']) rejected = true;
					if (hasMove['rest'] || hasMove['lightscreen'] && hasMove['reflect']) rejected = true;
					break;
				case 'pursuit':
					if (counter.setupType || counter.Status > 1 || counter['Dark'] > 2 || hasMove['knockoff'] && !hasType['Dark']) rejected = true;
					break;
				case 'rapidspin':
					if (counter.setupType || teamDetails.hazardClear) rejected = true;
					break;
				case 'reversal':
					if (hasMove['substitute'] && teamDetails.zMove) rejected = true;
					break;
				case 'stealthrock':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest'] || teamDetails.stealthRock) rejected = true;
					break;
				case 'switcheroo': case 'trick':
					if (counter.Physical + counter.Special < 3 || counter.setupType || !!counter['speedsetup']) rejected = true;
					if (hasMove['lightscreen'] || hasMove['reflect'] || hasMove['suckerpunch'] || hasMove['trickroom']) rejected = true;
					break;
				case 'toxicspikes':
					if (counter.setupType || teamDetails.toxicSpikes) rejected = true;
					break;
				case 'trickroom':
					if (counter.setupType || !!counter['speedsetup'] || counter.damagingMoves.length < 2) rejected = true;
					if (hasMove['lightscreen'] || hasMove['reflect']) rejected = true;
					break;
				case 'uturn':
					if (counter.setupType || !!counter['speedsetup'] || hasAbility['Protean'] && counter.Status > 2) rejected = true;
					if (hasType['Bug'] && counter.stab < 2 && counter.damagingMoves.length > 2 && !hasAbility['Adaptability'] && !hasAbility['Download']) rejected = true;
					break;
				case 'voltswitch':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['electricterrain'] || hasMove['magnetrise'] || hasMove['uturn']) rejected = true;
					if (movePool.includes('plasmafists') || movePool.includes('volttackle')) rejected = true;
					break;

				// Bit redundant to have both
				// Attacks:
				case 'bugbite': case 'bugbuzz': case 'signalbeam':
					if (hasMove['uturn'] && !counter.setupType) rejected = true;
					break;
				case 'lunge':
					if (hasMove['leechlife']) rejected = true;
					break;
				case 'darkestlariat': case 'nightslash':
					if (hasMove['knockoff'] || hasMove['pursuit']) rejected = true;
					break;
				case 'darkpulse':
					if (hasMove['shadowball']) rejected = true;
					if ((hasMove['crunch'] || hasMove['hyperspacefury']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'suckerpunch':
					if (counter['Dark'] > 1 && !hasType['Dark']) rejected = true;
					if (counter.damagingMoves.length < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'dragonclaw':
					if (hasMove['dragontail'] || hasMove['outrage']) rejected = true;
					break;
				case 'dracometeor':
					if (hasMove['swordsdance'] || counter.setupType === 'Physical' && hasMove['outrage']) rejected = true;
					break;
				case 'dragonpulse': case 'spacialrend':
					if (hasMove['dracometeor'] || hasMove['outrage']) rejected = true;
					break;
				case 'outrage':
					if (hasMove['dracometeor'] && counter.damagingMoves.length < 3) rejected = true;
					if (hasMove['clangingscales'] && !teamDetails.zMove) rejected = true;
					break;
				case 'chargebeam':
					if (hasMove['thunderbolt'] && counter.Special < 3) rejected = true;
					break;
				case 'thunder':
					if (hasMove['thunderbolt'] && !hasMove['raindance']) rejected = true;
					break;
				case 'thunderbolt':
					if (hasMove['discharge'] || (hasMove['raindance'] && hasMove['thunder']) || (hasMove['voltswitch'] && hasMove['wildcharge'])) rejected = true;
					break;
				case 'thunderpunch':
					if (hasAbility['Galvanize'] && !!counter['Normal']) rejected = true;
					break;
				case 'dazzlinggleam':
					if (hasMove['drainingkiss'] || hasMove['playrough'] && counter.setupType !== 'Special') rejected = true;
					break;
				case 'moonblast':
					if (isDoubles && hasMove['dazzlinggleam']) rejected = true;
					break;
				case 'aurasphere': case 'focusblast':
					if ((hasMove['closecombat'] || hasMove['superpower']) && counter.setupType !== 'Special') rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'drainpunch':
					if (!hasMove['bulkup'] && (hasMove['closecombat'] || hasMove['highjumpkick'])) rejected = true;
					if ((hasMove['focusblast'] || hasMove['superpower']) && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'closecombat': case 'highjumpkick':
					if ((hasMove['aurasphere'] || hasMove['focusblast'] || movePool.includes('aurasphere') || movePool.includes('focusblast')) && counter.setupType === 'Special') rejected = true;
					if (hasMove['bulkup'] && hasMove['drainpunch']) rejected = true;
					break;
				case 'machpunch':
					if (hasType['Fighting'] && counter.stab < 2 && !hasAbility['Technician']) rejected = true;
					break;
				case 'stormthrow':
					if (hasMove['circlethrow'] && hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'superpower':
					if (counter['Fighting'] > 1 && counter.setupType) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk'] && !hasAbility['Contrary']) rejected = true;
					if (hasAbility['Contrary']) isSetup = true;
					break;
				case 'vacuumwave':
					if ((hasMove['closecombat'] || hasMove['machpunch']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'fierydance': case 'firefang': case 'firepunch': case 'flamethrower':
					if (hasMove['blazekick'] || hasMove['heatwave'] || hasMove['overheat']) rejected = true;
					if (hasMove['fireblast'] && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'fireblast': case 'magmastorm':
					if (hasMove['flareblitz'] && counter.setupType !== 'Special') rejected = true;
					if (hasMove['lavaplume'] && !counter.setupType && !counter['speedsetup']) rejected = true;
					if (hasMove['mindblown'] && counter.setupType && !teamDetails.zMove) rejected = true;
					break;
				case 'lavaplume':
					if (hasMove['firepunch'] || hasMove['fireblast'] && (counter.setupType || !!counter['speedsetup'])) rejected = true;
					break;
				case 'mindblown':
					if (hasMove['fireblast'] && counter.setupType && teamDetails.zMove) rejected = true;
					break;
				case 'overheat':
					if (hasMove['fireblast'] || hasMove['lavaplume'] || counter.setupType === 'Special') rejected = true;
					break;
				case 'airslash': case 'hurricane':
					if (hasMove['acrobatics'] || hasMove['bravebird']) rejected = true;
					break;
				case 'hex':
					if (!hasMove['willowisp']) rejected = true;
					break;
				case 'shadowball':
					if (hasMove['hex'] && hasMove['willowisp']) rejected = true;
					break;
				case 'shadowclaw':
					if (hasMove['phantomforce'] || hasMove['shadowforce'] || hasMove['shadowsneak']) rejected = true;
					if (hasMove['shadowball'] && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'shadowsneak':
					if (hasType['Ghost'] && template.types.length > 1 && counter.stab < 2) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'gigadrain':
					if (hasMove['petaldance'] || hasMove['powerwhip'] || (hasMove['seedbomb'] && !isDoubles)) rejected = true;
					if (hasMove['leafstorm'] && counter.Special < 4 && !counter.setupType && !hasMove['trickroom']) rejected = true;
					break;
				case 'leafblade': case 'woodhammer':
					if (hasMove['gigadrain'] && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'leafstorm':
					if (hasMove['trickroom'] || counter['Grass'] > 1 && counter.setupType) rejected = true;
					break;
				case 'seedbomb':
					if (isDoubles && hasMove['gigadrain']) rejected = true;
					break;
				case 'solarbeam':
					if ((!hasAbility['Drought'] && !hasMove['sunnyday']) || hasMove['gigadrain'] || hasMove['leafstorm']) rejected = true;
					break;
				case 'bonemerang': case 'precipiceblades':
					if (hasMove['earthquake']) rejected = true;
					break;
				case 'earthpower':
					if (hasMove['earthquake'] && counter.setupType !== 'Special') rejected = true;
					break;
				case 'icebeam':
					if (hasMove['blizzard'] || hasMove['freezedry']) rejected = true;
					break;
				case 'iceshard': case 'icywind':
					if (hasMove['freezedry']) rejected = true;
					break;
				case 'bodyslam': case 'return':
					if (hasMove['doubleedge'] || hasMove['glare'] && hasMove['headbutt']) rejected = true;
					if (moveid === 'return' && hasMove['bodyslam']) rejected = true;
					break;
				case 'endeavor':
					if (slot > 0) rejected = true;
					break;
				case 'explosion':
					if (counter.setupType || (hasAbility['Refrigerate'] && hasMove['freezedry']) || hasMove['wish']) rejected = true;
					break;
				case 'extremespeed':
					if (counter.setupType !== 'Physical' && hasMove['vacuumwave']) rejected = true;
					break;
				case 'facade':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'hiddenpower':
					if (hasMove['rest'] || !counter.stab && counter.damagingMoves.length < 2) rejected = true;
					break;
				case 'hypervoice':
					if (hasMove['blizzard'] || hasMove['return']) rejected = true;
					break;
				case 'judgment':
					if (counter.setupType !== 'Special' && counter.stab > 1) rejected = true;
					break;
				case 'quickattack':
					if (hasType['Normal'] && (!counter.stab || counter['Normal'] > 2)) rejected = true;
					if (hasMove['feint']) rejected = true;
					break;
				case 'weatherball':
					if (!hasMove['raindance'] && !hasMove['sunnyday']) rejected = true;
					break;
				case 'acidspray':
					if (hasMove['sludgebomb'] || counter.Special < 2) rejected = true;
					break;
				case 'poisonjab':
					if (hasMove['gunkshot']) rejected = true;
					break;
				case 'sludgewave':
					if (hasMove['poisonjab']) rejected = true;
					break;
				case 'photongeyser': case 'psychic':
					if (hasMove['psyshock'] || counter.setupType === 'Special' && hasMove['storedpower']) rejected = true;
					break;
				case 'psychocut': case 'zenheadbutt':
					if ((hasMove['psychic'] || hasMove['psyshock']) && counter.setupType !== 'Physical') rejected = true;
					if (hasAbility['Contrary'] && !counter.setupType && !!counter['physicalpool']) rejected = true;
					break;
				case 'psyshock':
					if (movePool.length > 1) {
						let psychic = movePool.indexOf('psychic');
						if (psychic >= 0) this.fastPop(movePool, psychic);
					}
					break;
				case 'headsmash':
					if (hasMove['stoneedge'] || isDoubles && hasMove['rockslide']) rejected = true;
					break;
				case 'rockblast': case 'rockslide':
					if ((hasMove['headsmash'] || hasMove['stoneedge']) && !isDoubles) rejected = true;
					break;
				case 'stoneedge':
					if (isDoubles && hasMove['rockslide']) rejected = true;
					break;
				case 'bulletpunch':
					if (hasType['Steel'] && counter.stab < 2 && !hasAbility['Adaptability'] && !hasAbility['Technician']) rejected = true;
					break;
				case 'flashcannon':
					if ((hasMove['ironhead'] || hasMove['meteormash']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'hydropump':
					if (hasMove['liquidation'] || hasMove['razorshell'] || hasMove['waterfall'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['scald'] && (counter.Special < 4 || template.types.length > 1 && counter.stab < 3)) rejected = true;
					break;
				case 'originpulse': case 'surf':
					if (hasMove['hydropump'] || hasMove['scald']) rejected = true;
					break;
				case 'scald':
					if (hasMove['liquidation'] || hasMove['waterfall'] || hasMove['waterpulse']) rejected = true;
					break;

				// Status:
				case 'electroweb': case 'stunspore': case 'thunderwave':
					if (counter.setupType || !!counter['speedsetup'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['discharge'] || hasMove['spore'] || hasMove['toxic'] || hasMove['trickroom'] || hasMove['yawn']) rejected = true;
					break;
				case 'toxic':
					if (hasMove['hypnosis'] || hasMove['sleeppowder'] || hasMove['willowisp'] || hasMove['yawn']) rejected = true;
					if (counter.setupType || hasMove['flamecharge'] || hasMove['raindance']) rejected = true;
					break;
				case 'willowisp':
					if (hasMove['scald']) rejected = true;
					break;
				case 'raindance':
					if (counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasType['Water'] && !hasMove['thunder']) rejected = true;
					break;
				case 'sunnyday':
					if (counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasAbility['Chlorophyll'] && !hasAbility['Flower Gift'] && !hasMove['solarbeam']) rejected = true;
					if (rejected && movePool.length > 1) {
						let solarbeam = movePool.indexOf('solarbeam');
						if (solarbeam >= 0) this.fastPop(movePool, solarbeam);
						if (movePool.length > 1) {
							let weatherball = movePool.indexOf('weatherball');
							if (weatherball >= 0) this.fastPop(movePool, weatherball);
						}
					}
					break;
				case 'milkdrink': case 'moonlight': case 'painsplit': case 'recover': case 'roost': case 'synthesis':
					if (hasMove['leechseed'] || hasMove['rest'] || hasMove['wish']) rejected = true;
					break;
				case 'safeguard':
					if (hasMove['destinybond']) rejected = true;
					break;
				case 'substitute':
					if (hasMove['dracometeor'] || (hasMove['leafstorm'] && !hasAbility['Contrary']) || hasMove['pursuit'] || hasMove['rest'] || hasMove['taunt'] || hasMove['uturn'] || hasMove['voltswitch']) rejected = true;
					break;
				case 'powersplit':
					if (hasMove['guardsplit']) rejected = true;
					break;
				case 'wideguard':
					if (hasMove['protect']) rejected = true;
					break;
				}

				// Increased/decreased priority moves are unneeded with moves that boost only speed
				if (move.priority !== 0 && (!!counter['speedsetup'] || hasMove['copycat'])) {
					rejected = true;
				}

				// This move doesn't satisfy our setup requirements:
				if ((move.category === 'Physical' && counter.setupType === 'Special') || (move.category === 'Special' && counter.setupType === 'Physical')) {
					// Reject STABs last in case the setup type changes later on
					if (!SetupException.includes(moveid) && (!hasType[move.type] || counter.stab > 1 || counter[move.category] < 2)) rejected = true;
				}
				// @ts-ignore
				if (counter.setupType && !isSetup && counter.setupType !== 'Mixed' && move.category !== counter.setupType && counter[counter.setupType] < 2 && moveid !== 'rest' && moveid !== 'sleeptalk') {
					// Mono-attacking with setup and RestTalk is allowed
					// Reject Status moves only if there is nothing else to reject
					// @ts-ignore
					if (move.category !== 'Status' || counter[counter.setupType] + counter.Status > 3 && counter['physicalsetup'] + counter['specialsetup'] < 2) rejected = true;
				}
				if (counter.setupType === 'Special' && moveid === 'hiddenpower' && template.types.length > 1 && counter['Special'] <= 2 && !hasType[move.type] && !counter['Physical'] && counter['specialpool']) {
					// Hidden Power isn't good enough
					rejected = true;
				}

				// Pokemon should have moves that benefit their Type/Ability/Weather, as well as moves required by its forme
				// @ts-ignore
				if (!rejected && (counter['physicalsetup'] + counter['specialsetup'] < 2 && (!counter.setupType || counter.setupType === 'Mixed' || (move.category !== counter.setupType && move.category !== 'Status') || counter[counter.setupType] + counter.Status > 3)) &&
					((counter.damagingMoves.length === 0 && !hasMove['metalburst']) ||
					(!counter.stab && (template.types.length > 1 || (template.types[0] !== 'Normal' && template.types[0] !== 'Psychic') || !hasMove['icebeam'] || template.baseStats.spa >= template.baseStats.spd) && (!!counter['physicalpool'] || !!counter['specialpool'])) ||
					(hasType['Bug'] && (movePool.includes('megahorn') || movePool.includes('pinmissile') || (hasType['Flying'] && !hasMove['hurricane'] && movePool.includes('bugbuzz')))) ||
					((hasType['Dark'] && !counter['Dark']) || hasMove['suckerpunch'] && !hasAbility['Contrary'] && counter.stab < template.types.length) ||
					(hasType['Dragon'] && !counter['Dragon'] && !hasAbility['Aerilate'] && !hasAbility['Pixilate'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Electric'] && !counter['Electric'] && !hasAbility['Galvanize']) ||
					(hasType['Fairy'] && !counter['Fairy'] && (!!counter['speedsetup'] || !counter['Status'])) ||
					(hasType['Fighting'] && !counter['Fighting'] && (counter.setupType || !counter['Status'])) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Ghost'] && !hasType['Dark'] && !counter['Ghost'] && !hasAbility['Steelworker']) ||
					(hasType['Grass'] && !hasType['Fairy'] && !hasType['Poison'] && !hasType['Steel'] && !counter['Grass']) ||
					(hasType['Ground'] && !counter['Ground'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Ice'] && !counter['Ice'] && !hasAbility['Refrigerate']) ||
					(hasType['Psychic'] && !!counter['Psychic'] && !hasType['Flying'] && !hasAbility['Pixilate'] && counter.stab < template.types.length) ||
					(hasType['Rock'] && !counter['Rock'] && counter.setupType === 'Physical') ||
					(((hasType['Steel'] && hasAbility['Technician']) || hasAbility['Steelworker']) && !counter['Steel']) ||
					(hasType['Water'] && (!counter['Water'] || !counter.stab) && !hasAbility['Protean']) ||
					// @ts-ignore
					((hasAbility['Adaptability'] && !counter.setupType && template.types.length > 1 && (!counter[template.types[0]] || !counter[template.types[1]])) ||
					((hasAbility['Aerilate'] || (hasAbility['Galvanize'] && !counter['Electric']) || hasAbility['Pixilate'] || (hasAbility['Refrigerate'] && !hasMove['blizzard'])) && !counter['Normal']) ||
					(hasAbility['Contrary'] && !counter['contrary'] && template.species !== 'Shuckle') ||
					(hasAbility['Gale Wings'] && !counter['Flying']) ||
					(hasAbility['Guts'] && hasType['Normal'] && movePool.includes('facade')) ||
					(hasAbility['Psychic Surge'] && !counter['Psychic']) ||
					(hasAbility['Slow Start'] && movePool.includes('substitute')) ||
					(hasAbility['Stance Change'] && !counter.setupType && movePool.includes('kingsshield')) ||
					(!counter.recovery && (movePool.includes('softboiled') || template.nfe && !!counter['Status'] && (movePool.includes('recover') || movePool.includes('roost')))) ||
					(template.requiredMove && movePool.includes(toId(template.requiredMove)))))) {
					// Reject Status or non-STAB
					if (!isSetup && !move.weather && !move.damage && !move.heal && moveid !== 'judgment' && moveid !== 'rest' && moveid !== 'sleeptalk') {
						if (move.category === 'Status' || !hasType[move.type] || move.selfSwitch || move.basePower && move.basePower < 40 && !move.multihit) rejected = true;
					}
				}

				// Sleep Talk shouldn't be selected without Rest
				if (moveid === 'rest' && rejected) {
					let sleeptalk = movePool.indexOf('sleeptalk');
					if (sleeptalk >= 0) {
						if (movePool.length < 2) {
							rejected = false;
						} else {
							this.fastPop(movePool, sleeptalk);
						}
					}
				}

				// Remove rejected moves from the move list
				if (rejected && (movePool.length - availableHP || availableHP && (moveid === 'hiddenpower' || !hasMove['hiddenpower']))) {
					moves.splice(k, 1);
					break;
				}
			}
		} while (moves.length < 4 && movePool.length);

		// Moveset modifications
		if (hasMove['autotomize'] && hasMove['heavyslam']) {
			if (template.id === 'celesteela') {
				moves[moves.indexOf('heavyslam')] = 'flashcannon';
			} else {
				moves[moves.indexOf('autotomize')] = 'rockpolish';
			}
		}

		/**@type {[string, string | undefined, string | undefined]} */
		// @ts-ignore
		let abilities = Object.values(baseTemplate.abilities);
		abilities.sort((a, b) => this.getAbility(b).rating - this.getAbility(a).rating);
		let ability0 = this.getAbility(abilities[0]);
		let ability1 = this.getAbility(abilities[1]);
		let ability2 = this.getAbility(abilities[2]);
		if (abilities[1]) {
			if (abilities[2] && ability1.rating <= ability2.rating && this.randomChance(1, 2)) {
				[ability1, ability2] = [ability2, ability1];
			}
			if (ability0.rating <= ability1.rating && this.randomChance(1, 2)) {
				[ability0, ability1] = [ability1, ability0];
			} else if (ability0.rating - 0.6 <= ability1.rating && this.randomChance(2, 3)) {
				[ability0, ability1] = [ability1, ability0];
			}
			ability = ability0.name;

			let rejectAbility;
			do {
				rejectAbility = false;
				if (counterAbilities.includes(ability)) {
					// Adaptability, Contrary, Hustle, Iron Fist, Skill Link
					// @ts-ignore
					rejectAbility = !counter[toId(ability)];
				} else if (ateAbilities.includes(ability)) {
					rejectAbility = !counter['Normal'];
				} else if (ability === 'Blaze') {
					rejectAbility = !counter['Fire'];
				} else if (ability === 'Chlorophyll') {
					rejectAbility = abilities.includes('Harvest') || (!hasMove['sunnyday'] && !teamDetails['sun']);
				} else if (ability === 'Competitive') {
					rejectAbility = !counter['Special'] || (hasMove['rest'] && hasMove['sleeptalk']);
				} else if (ability === 'Compound Eyes' || ability === 'No Guard') {
					rejectAbility = !counter['inaccurate'];
				} else if (ability === 'Defiant' || ability === 'Moxie') {
					rejectAbility = !counter['Physical'] || hasMove['dragontail'];
				} else if (ability === 'Flare Boost' || ability === 'Moody') {
					rejectAbility = true;
				} else if (ability === 'Gluttony') {
					rejectAbility = !hasMove['bellydrum'];
				} else if (ability === 'Harvest') {
					rejectAbility = abilities.includes('Frisk');
				} else if (ability === 'Hydration' || ability === 'Rain Dish' || ability === 'Swift Swim') {
					rejectAbility = !hasMove['raindance'] && !teamDetails['rain'];
				} else if (ability === 'Ice Body' || ability === 'Slush Rush' || ability === 'Snow Cloak') {
					rejectAbility = !teamDetails['hail'];
				} else if (ability === 'Intimidate') {
					rejectAbility = hasMove['bodyslam'] || abilities.includes('Reckless') && counter['recoil'] > 1;
				} else if (ability === 'Lightning Rod') {
					rejectAbility = template.types.includes('Ground');
				} else if (ability === 'Limber') {
					rejectAbility = template.types.includes('Electric');
				} else if (ability === 'Liquid Voice') {
					rejectAbility = !hasMove['hypervoice'];
				} else if (ability === 'Magnet Pull') {
					rejectAbility = !hasType['Electric'] && !hasMove['earthpower'];
				} else if (ability === 'Overcoat') {
					rejectAbility = abilities.includes('Sturdy');
				} else if (ability === 'Overgrow') {
					rejectAbility = !counter['Grass'];
				} else if (ability === 'Poison Heal') {
					rejectAbility = abilities.includes('Technician') && !!counter['technician'];
				} else if (ability === 'Power Construct') {
					rejectAbility = template.forme === '10%' && !hasMove['substitute'];
				} else if (ability === 'Prankster') {
					rejectAbility = !counter['Status'];
				} else if (ability === 'Pressure' || ability === 'Synchronize') {
					rejectAbility = counter.Status < 2 || !!counter['recoil'] || template.isMega;
				} else if (ability === 'Regenerator') {
					rejectAbility = abilities.includes('Magic Guard');
				} else if (ability === 'Quick Feet') {
					rejectAbility = hasMove['bellydrum'];
				} else if (ability === 'Reckless' || ability === 'Rock Head') {
					rejectAbility = !counter['recoil'];
				} else if (ability === 'Sand Force' || ability === 'Sand Rush' || ability === 'Sand Veil') {
					rejectAbility = !teamDetails['sand'];
				} else if (ability === 'Scrappy') {
					rejectAbility = !template.types.includes('Normal');
				} else if (ability === 'Serene Grace') {
					rejectAbility = !counter['serenegrace'] || template.species === 'Blissey';
				} else if (ability === 'Sheer Force') {
					rejectAbility = !counter['sheerforce'] || hasMove['doubleedge'] || template.isMega || (abilities.includes('Iron Fist') && counter['ironfist'] > counter['sheerforce']);
				} else if (ability === 'Simple') {
					rejectAbility = !counter.setupType && !hasMove['cosmicpower'] && !hasMove['flamecharge'];
				} else if (ability === 'Snow Warning') {
					rejectAbility = hasMove['hypervoice'];
				} else if (ability === 'Solar Power') {
					rejectAbility = !counter['Special'] || template.isMega;
				} else if (ability === 'Strong Jaw') {
					rejectAbility = !counter['bite'];
				} else if (ability === 'Sturdy') {
					rejectAbility = !!counter['recoil'] && !counter['recovery'];
				} else if (ability === 'Swarm') {
					rejectAbility = !counter['Bug'];
				} else if (ability === 'Technician') {
					rejectAbility = !counter['technician'] || hasMove['tailslap'];
				} else if (ability === 'Tinted Lens') {
					rejectAbility = counter['damage'] >= counter.damagingMoves.length || (counter.Status > 2 && !counter.setupType);
				} else if (ability === 'Torrent') {
					rejectAbility = !counter['Water'];
				} else if (ability === 'Triage') {
					rejectAbility = !counter['recovery'] && !counter['drain'];
				} else if (ability === 'Unburden') {
					rejectAbility = template.isMega || (!counter.setupType && !hasMove['acrobatics']);
				} else if (ability === 'Water Absorb') {
					rejectAbility = abilities.includes('Volt Absorb') || (abilities.includes('Water Bubble') && !!counter['Water']);
				}

				if (rejectAbility) {
					if (ability === ability0.name && ability1.rating > 1) {
						ability = ability1.name;
					} else if (ability === ability1.name && abilities[2] && ability2.rating > 1) {
						ability = ability2.name;
					} else {
						// Default to the highest rated ability if all are rejected
						ability = abilities[0];
						rejectAbility = false;
					}
				}
			} while (rejectAbility);

			if (abilities.includes('Galvanize') && !!counter['Normal']) {
				ability = 'Galvanize';
			} else if (abilities.includes('Guts') && ability !== 'Quick Feet' && (hasMove['facade'] || (hasMove['protect'] && !isDoubles) || (hasMove['rest'] && hasMove['sleeptalk']))) {
				ability = 'Guts';
			} else if (abilities.includes('Prankster') && counter.Status > 1) {
				ability = 'Prankster';
			} else if (abilities.includes('Swift Swim') && hasMove['raindance']) {
				ability = 'Swift Swim';
			} else if (abilities.includes('Triage') && !!counter['drain']) {
				ability = 'Triage';
			} else if (abilities.includes('Unburden') && hasMove['acrobatics']) {
				ability = 'Unburden';
			} else if (isDoubles && abilities.includes('Intimidate')) {
				ability = 'Intimidate';
			}

			if (template.species === 'Ambipom' && !counter['technician']) {
				// If it doesn't qualify for Technician, Skill Link is useless on it
				ability = 'Pickup';
			} else if (template.baseSpecies === 'Basculin') {
				ability = 'Adaptability';
			} else if (template.baseSpecies === 'Glalie') {
				ability = 'Inner Focus';
			} else if (template.species === 'Lopunny' && hasMove['switcheroo'] && this.randomChance(2, 3)) {
				ability = 'Klutz';
			} else if ((template.species === 'Rampardos' && !hasMove['headsmash']) || hasMove['rockclimb']) {
				ability = 'Sheer Force';
			} else if (template.species === 'Torterra' && !counter['Grass']) {
				ability = 'Shell Armor';
			} else if (template.id === 'swampertmega') {
				ability = 'Damp';
			} else if (template.id === 'venusaurmega') {
				ability = 'Chlorophyll';
			}
		} else {
			ability = ability0.name;
		}

		item = !isDoubles ? 'Leftovers' : 'Sitrus Berry';
		if (template.requiredItems) {
			// @ts-ignore
			if (template.baseSpecies === 'Arceus' && (hasMove['judgment'] || !counter[template.types[0]] || teamDetails.zMove)) {
				// Judgment doesn't change type with Z-Crystals
				item = template.requiredItems[0];
			} else {
				item = this.sample(template.requiredItems);
			}

		// First, the extra high-priority items
		} else if (template.species === 'Cubone' || template.baseSpecies === 'Marowak') {
			item = 'Thick Club';
		} else if (template.species === 'Decidueye' && hasMove['spiritshackle'] && counter.setupType && !teamDetails.zMove) {
			item = 'Decidium Z';
		} else if (template.species === 'Dedenne') {
			item = 'Petaya Berry';
		} else if (template.species === 'Deoxys-Attack') {
			item = (slot === 0 && hasMove['stealthrock']) ? 'Focus Sash' : 'Life Orb';
		} else if (template.species === 'Farfetch\'d') {
			item = 'Stick';
		} else if (template.species === 'Genesect' && hasMove['technoblast']) {
			item = 'Douse Drive';
			species = 'Genesect-Douse';
		} else if (template.species === 'Kommo-o' && !teamDetails.zMove) {
			item = hasMove['clangingscales'] ? 'Kommonium Z' : 'Dragonium Z';
		} else if (template.species === 'Lycanroc' && hasMove['stoneedge'] && counter.setupType && !teamDetails.zMove) {
			item = 'Lycanium Z';
		} else if (template.species === 'Marshadow' && hasMove['spectralthief'] && counter.setupType && !teamDetails.zMove) {
			item = 'Marshadium Z';
		} else if (template.species === 'Mimikyu' && hasMove['playrough'] && counter.setupType && !teamDetails.zMove) {
			item = 'Mimikium Z';
		} else if ((template.species === 'Necrozma-Dusk-Mane' || template.species === 'Necrozma-Dawn-Wings') && !teamDetails.zMove) {
			if (hasMove['autotomize'] && hasMove['sunsteelstrike']) {
				item = 'Solganium Z';
			} else if (hasMove['trickroom'] && hasMove['moongeistbeam']) {
				item = 'Lunalium Z';
			} else {
				item = 'Ultranecrozium Z';
				if (!hasMove['photongeyser']) {
					for (const moveid of moves) {
						let move = this.getMove(moveid);
						if (move.category === 'Status' || hasType[move.type]) continue;
						moves[moves.indexOf(moveid)] = 'photongeyser';
						break;
					}
				}
			}
		} else if (template.species === 'Pikachu') {
			if (!isDoubles) species = 'Pikachu' + this.sample(['', '-Original', '-Hoenn', '-Sinnoh', '-Unova', '-Kalos', '-Alola', '-Partner']);
			if (species !== 'Pikachu') ability = 'Static';
			item = 'Light Ball';
		} else if (template.species === 'Porygon-Z' && hasMove['nastyplot'] && !hasMove['trick'] && !['nastyplot', 'icebeam', 'triattack'].includes(moves[0]) && !teamDetails.zMove && !isDoubles) {
			moves[moves.indexOf('nastyplot')] = 'conversion';
			moves[moves.indexOf('triattack')] = 'recover';
			item = 'Normalium Z';
		} else if (template.species === 'Raichu-Alola' && hasMove['thunderbolt'] && !teamDetails.zMove && this.randomChance(1, 4)) {
			item = 'Aloraichium Z';
		} else if (template.species === 'Shedinja' || template.species === 'Smeargle') {
			item = 'Focus Sash';
		} else if (template.species === 'Unfezant' && counter['Physical'] >= 2) {
			item = 'Scope Lens';
		} else if (template.species === 'Unown') {
			item = 'Choice Specs';
		} else if (template.species === 'Wobbuffet') {
			if (hasMove['destinybond']) {
				item = 'Custap Berry';
			} else {
				item = isDoubles || this.randomChance(1, 2) ? 'Sitrus Berry' : 'Leftovers';
			}
		} else if (template.species === 'Zygarde-10%' && hasMove['substitute'] && !teamDetails.zMove && !isDoubles) {
			item = hasMove['outrage'] ? 'Dragonium Z' : 'Groundium Z';
		} else if (ability === 'Harvest') {
			item = 'Sitrus Berry';
		} else if (ability === 'Imposter') {
			item = 'Choice Scarf';
		} else if (ability === 'Klutz' && hasMove['switcheroo']) {
			// To perma-taunt a Pokemon by giving it Assault Vest
			item = 'Assault Vest';
		} else if (hasMove['switcheroo'] || hasMove['trick']) {
			if (template.baseStats.spe >= 60 && template.baseStats.spe <= 108) {
				item = 'Choice Scarf';
			} else {
				item = (counter.Physical > counter.Special) ? 'Choice Band' : 'Choice Specs';
			}
		} else if (template.evos.length) {
			item = (ability === 'Technician' && counter.Physical >= 4) ? 'Choice Band' : 'Eviolite';
		} else if (hasMove['bellydrum']) {
			if (ability === 'Gluttony') {
				item = this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki']) + ' Berry';
			} else if (template.baseStats.spe <= 50 && !teamDetails.zMove && this.randomChance(1, 2)) {
				item = 'Normalium Z';
			} else {
				item = 'Sitrus Berry';
			}
		} else if (hasMove['geomancy']) {
			item = 'Power Herb';
		} else if (hasMove['shellsmash']) {
			item = (ability === 'Solid Rock' && counter['priority']) ? 'Weakness Policy' : 'White Herb';
		} else if (ability === 'Poison Heal' || ability === 'Toxic Boost') {
			item = 'Toxic Orb';
		} else if (ability === 'Unburden') {
			item = hasMove['fakeout'] ? 'Normal Gem' : 'Sitrus Berry';
		} else if (hasMove['acrobatics']) {
			item = '';
		} else if (hasMove['dig'] && !teamDetails.zMove) {
			item = 'Groundium Z';
		} else if (hasMove['electricterrain']) {
			item = 'Electrium Z';
		} else if (hasMove['happyhour'] || hasMove['holdhands']) {
			item = 'Normalium Z';
		} else if (hasMove['hydropump'] && ability === 'Battle Bond' && hasMove['uturn'] && !teamDetails.zMove) {
			item = 'Waterium Z';
		} else if (hasMove['fleurcannon'] && !!counter['speedsetup'] && !teamDetails.zMove) {
			item = 'Fairium Z';
		} else if (hasMove['focusblast'] && hasMove['nastyplot'] && hasType['Fighting'] && !teamDetails.zMove) {
			item = 'Fightinium Z';
		} else if ((hasMove['magmastorm'] || hasMove['mindblown'] && !!counter['Status']) && !teamDetails.zMove) {
			item = 'Firium Z';
		} else if (!teamDetails.zMove && (hasMove['fly'] || (hasMove['hurricane'] && template.baseStats.spa >= 125) || ((hasMove['bounce'] || hasMove['bravebird']) && counter.setupType))) {
			item = 'Flyinium Z';
		} else if (hasMove['solarbeam'] && ability !== 'Drought' && !hasMove['sunnyday'] && !teamDetails['sun']) {
			item = !teamDetails.zMove ? 'Grassium Z' : 'Power Herb';
		} else if ((ability === 'Magic Guard' && counter.damagingMoves.length > 1) || (ability === 'Sheer Force' && !!counter['sheerforce'])) {
			item = 'Life Orb';
		} else if (hasMove['rest'] && !hasMove['sleeptalk'] && ability !== 'Hydration' && ability !== 'Natural Cure' && ability !== 'Shed Skin') {
			item = 'Chesto Berry';
		} else if (hasMove['hail'] && !teamDetails.zMove) {
			item = 'Icium Z';
		} else if (hasMove['raindance']) {
			if (template.baseSpecies === 'Castform' && !teamDetails.zMove) {
				item = 'Waterium Z';
			} else {
				item = (ability === 'Forecast' || hasMove['rest'] || hasMove['uturn']) ? 'Damp Rock' : 'Life Orb';
			}
		} else if (hasMove['sunnyday']) {
			if (template.baseSpecies === 'Castform' && !teamDetails.zMove) {
				item = 'Firium Z';
			} else {
				item = (ability !== 'Chlorophyll' || counter.Status > 1) ? 'Heat Rock' : 'Life Orb';
			}
		} else if ((ability === 'Guts' || hasMove['facade'] || hasMove['psychoshift']) && !hasMove['sleeptalk']) {
			item = (hasType['Fire'] || ability === 'Quick Feet') ? 'Toxic Orb' : 'Flame Orb';
		} else if (hasMove['auroraveil'] || hasMove['lightscreen'] && hasMove['reflect']) {
			item = 'Light Clay';

		// Medium priority
		} else if (((ability === 'Speed Boost' && !hasMove['substitute']) || (ability === 'Stance Change')) && counter.Physical + counter.Special > 2) {
			item = 'Life Orb';
		} else if (hasType['Grass'] && template.baseStats.spe <= 70 && hasMove['sleeppowder'] && counter.setupType && !teamDetails.zMove) {
			item = 'Grassium Z';
		} else if (counter.Physical >= 4 && !hasMove['bodyslam'] && !hasMove['dragontail'] && !hasMove['fakeout'] && !hasMove['flamecharge'] && !hasMove['rapidspin'] && !hasMove['suckerpunch'] && !isDoubles) {
			item = (template.baseStats.atk >= 100 || ability === 'Huge Power') && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && this.randomChance(2, 3) ? 'Choice Scarf' : 'Choice Band';
		} else if (counter.Special >= 4 && !hasMove['acidspray'] && !hasMove['chargebeam'] && !hasMove['clearsmog'] && !hasMove['fierydance'] && !isDoubles) {
			item = template.baseStats.spa >= 100 && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && this.randomChance(2, 3) ? 'Choice Scarf' : 'Choice Specs';
		} else if (((counter.Physical >= 3 && hasMove['defog']) || (counter.Special >= 3 && hasMove['uturn'])) && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && !hasMove['foulplay'] && this.randomChance(2, 3) && !isDoubles) {
			item = 'Choice Scarf';
		} else if (ability === 'Defeatist' || hasMove['eruption'] || hasMove['waterspout']) {
			item = counter.Status <= 1 ? 'Expert Belt' : 'Leftovers';
		} else if (hasMove['reversal'] && hasMove['substitute'] && !teamDetails.zMove) {
			item = 'Fightinium Z';
		} else if ((hasMove['endeavor'] || hasMove['flail'] || hasMove['reversal']) && ability !== 'Sturdy') {
			item = 'Focus Sash';
		} else if (hasMove['outrage'] && (counter.setupType || ability === 'Multiscale')) {
			item = 'Lum Berry';
		} else if (isDoubles && counter.damagingMoves.length >= 4 && template.baseStats.spe >= 60 && !hasMove['fakeout'] && !hasMove['flamecharge'] && !hasMove['suckerpunch'] && ability !== 'Multiscale' && ability !== 'Sturdy') {
			item = 'Life Orb';
		} else if (isDoubles && this.getEffectiveness('Ice', template) >= 2) {
			item = 'Yache Berry';
		} else if (isDoubles && this.getEffectiveness('Rock', template) >= 2) {
			item = 'Charti Berry';
		} else if (isDoubles && this.getEffectiveness('Fire', template) >= 2) {
			item = 'Occa Berry';
		} else if (isDoubles && this.getImmunity('Fighting', template) && this.getEffectiveness('Fighting', template) >= 2) {
			item = 'Chople Berry';
		} else if ((ability === 'Slow Start' || hasMove['clearsmog'] || hasMove['curse'] || hasMove['detect'] || hasMove['protect'] || hasMove['sleeptalk']) && !isDoubles) {
			item = 'Leftovers';
		} else if (hasMove['substitute']) {
			item = counter.damagingMoves.length > 2 && !!counter['drain'] ? 'Life Orb' : 'Leftovers';
		} else if (this.getEffectiveness('Ground', template) >= 2 && ability !== 'Levitate' && !hasMove['magnetrise']) {
			item = 'Air Balloon';
		} else if ((ability === 'Iron Barbs' || ability === 'Rough Skin') && this.randomChance(1, 2)) {
			item = 'Rocky Helmet';
		} else if (counter.Physical + counter.Special >= 4 && template.baseStats.spd >= 65 && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 235) {
			item = 'Assault Vest';
		} else if (counter.damagingMoves.length >= 4) {
			item = (!!counter['Dragon'] || !!counter['Normal'] || (hasMove['suckerpunch'] && !hasType['Dark'])) ? 'Life Orb' : 'Expert Belt';
		} else if ((template.species === 'Latias' || template.species === 'Latios') && !!counter['Dragon'] && !!counter['Psychic']) {
			item = 'Soul Dew';
		} else if (template.species === 'Palkia' && (hasMove['dracometeor'] || hasMove['spacialrend']) && hasMove['hydropump']) {
			item = 'Lustrous Orb';
		} else if (counter.damagingMoves.length >= 3 && !!counter['speedsetup'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 300) {
			item = 'Weakness Policy';
		} else if (slot === 0 && ability !== 'Regenerator' && ability !== 'Sturdy' && !counter['recoil'] && !counter['recovery'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd <= 275) {
			item = 'Focus Sash';

		// This is the "REALLY can't think of a good item" cutoff
		} else if (counter.damagingMoves.length >= 3 && ability !== 'Sturdy' && !hasMove['acidspray'] && !hasMove['dragontail'] && !hasMove['foulplay'] && !hasMove['rapidspin'] && !hasMove['superfang']) {
			item = (template.baseStats.hp + template.baseStats.def + template.baseStats.spd <= 275 || !!counter['speedsetup'] || hasMove['trickroom']) ? 'Life Orb' : 'Leftovers';
		} else if (ability === 'Sturdy' && hasMove['explosion'] && !counter['speedsetup']) {
			item = 'Custap Berry';
		} else if (ability === 'Super Luck') {
			item = 'Scope Lens';
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && hasType['Poison']) {
			item = 'Black Sludge';
		}

		let level;

		if (!isDoubles) {
			/** @type {{[tier: string]: number}} */
			let levelScale = {
				'(PU)': 89,
				PU: 88,
				PUBL: 87,
				NU: 86,
				NUBL: 85,
				RU: 84,
				RUBL: 83,
				UU: 82,
				UUBL: 81,
				'(OU)': 80,
				OU: 80,
				Unreleased: 80,
				Uber: 78,
			};
			/** @type {{[species: string]: number}} */
			let customScale = {
				// Banned Ability
				Dugtrio: 82, Gothitelle: 82, Pelipper: 84, Politoed: 84, Wobbuffet: 82,

				// Holistic judgement
				'Castform-Rainy': 100, 'Castform-Snowy': 100, 'Castform-Sunny': 100, Delibird: 100, Unown: 100,
			};
			level = levelScale[template.tier] || 90;
			if (customScale[template.name]) level = customScale[template.name];

			// Custom level based on moveset
			if (template.species === 'Zygarde-10%' && ability === 'Power Construct') level = 80;
		} else {
			// We choose level based on BST. Min level is 70, max level is 99. 600+ BST is 70, less than 300 is 99. Calculate with those values.
			// Every 10.34 BST adds a level from 70 up to 99. Results are floored. Uses the Mega's stats if holding a Mega Stone
			let baseStats = template.baseStats;
			// If Wishiwashi, use the school-forme's much higher stats
			if (template.baseSpecies === 'Wishiwashi') baseStats = this.getTemplate('wishiwashischool').baseStats;

			let bst = baseStats.hp + baseStats.atk + baseStats.def + baseStats.spa + baseStats.spd + baseStats.spe;
			// Adjust levels of mons based on abilities (Pure Power, Sheer Force, etc.) and also Eviolite
			// For the stat boosted, treat the Pokemon's base stat as if it were multiplied by the boost. (Actual effective base stats are higher.)
			let templateAbility = (baseTemplate === template ? ability : template.abilities[0]);
			if (templateAbility === 'Huge Power' || templateAbility === 'Pure Power') {
				bst += baseStats.atk;
			} else if (templateAbility === 'Parental Bond') {
				bst += 0.25 * (counter.Physical > counter.Special ? baseStats.atk : baseStats.spa);
			} else if (templateAbility === 'Protean') {
				bst += 0.3 * (counter.Physical > counter.Special ? baseStats.atk : baseStats.spa);
			} else if (templateAbility === 'Fur Coat') {
				bst += baseStats.def;
			} else if (templateAbility === 'Slow Start') {
				bst -= baseStats.atk / 2 + baseStats.spe / 2;
			} else if (templateAbility === 'Truant') {
				bst *= 2 / 3;
			}
			if (item === 'Eviolite') {
				bst += 0.5 * (baseStats.def + baseStats.spd);
			} else if (item === 'Light Ball') {
				bst += baseStats.atk + baseStats.spa;
			}
			level = 70 + Math.floor(((600 - this.clampIntRange(bst, 300, 600)) / 10.34));
		}

		if (template.species === 'Stunfisk') {
			// This is just to amuse Zarel
			ability = 'Limber';
			item = 'Cheri Berry';
			level += 2;
		}

		// Prepare optimal HP
		let srWeakness = this.getEffectiveness('Rock', template);
		while (evs.hp > 1) {
			let hp = Math.floor(Math.floor(2 * template.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if (hasMove['substitute'] && hasMove['reversal']) {
				// Reversal users should be able to use four Substitutes
				if (hp % 4 > 0) break;
			} else if (hasMove['substitute'] && (item === 'Petaya Berry' || item === 'Sitrus Berry' || ability === 'Power Construct' && item !== 'Leftovers')) {
				// Three Substitutes should activate Petaya Berry for Dedenne
				// Two Substitutes should activate Sitrus Berry or Power Construct
				if (hp % 4 === 0) break;
			} else if (hasMove['bellydrum'] && (item === 'Sitrus Berry' || ability === 'Gluttony')) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || hp % (4 / srWeakness) > 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		if (!counter['Physical'] && !hasMove['copycat'] && !hasMove['transform']) {
			evs.atk = 0;
			ivs.atk = 0;
		}

		if (ability === 'Beast Boost' && counter.Special < 1) {
			evs.spa = 0;
			ivs.spa = 0;
		}

		if (hasMove['gyroball'] || hasMove['trickroom']) {
			evs.spe = 0;
			ivs.spe = 0;
		}

		return {
			name: template.baseSpecies,
			species: species,
			gender: template.gender,
			moves: moves,
			ability: ability,
			evs: evs,
			ivs: ivs,
			item: item,
			level: level,
			shiny: this.randomChance(1, 1024),
		};
	}

	randomTeam() {
		let pokemon = [];

		const allowedNFE = ['Chansey', 'Doublade', 'Gligar', 'Pikachu', 'Porygon2', 'Scyther', 'Type: Null'];

		// For Monotype
		let isMonotype = this.format.id === 'gen7monotyperandombattle';
		let typePool = Object.keys(this.data.TypeChart);
		let type = this.sample(typePool);

		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			let template = this.getTemplate(id);
			if (isMonotype) {
				let types = template.types;
				if (template.battleOnly) types = this.getTemplate(template.baseSpecies).types;
				if (types.indexOf(type) < 0) continue;
			}
			if (template.gen <= this.gen && (!template.nfe || allowedNFE.includes(template.species)) && !template.isMega && !template.isPrimal && !template.isNonstandard && template.randomBattleMoves) {
				pokemonPool.push(id);
			}
		}

		// PotD stuff
		let potd;
		if (global.Config && Config.potd && this.getRuleTable(this.getFormat()).has('potd')) {
			potd = this.getTemplate(Config.potd);
		}

		/**@type {{[k: string]: number}} */
		let baseFormes = {};
		/**@type {{[k: string]: number}} */
		let tierCount = {};
		/**@type {{[k: string]: number}} */
		let typeCount = {};
		/**@type {{[k: string]: number}} */
		let typeComboCount = {};
		/**@type {RandomTeamsTypes.TeamDetails} */
		let teamDetails = {};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;

			// Adjust rate for species with multiple formes
			switch (template.baseSpecies) {
			case 'Arceus': case 'Silvally':
				if (this.randomChance(17, 18)) continue;
				break;
			case 'Rotom':
				if (this.randomChance(5, 6)) continue;
				break;
			case 'Deoxys': case 'Gourgeist': case 'Oricorio':
				if (this.randomChance(3, 4)) continue;
				break;
			case 'Castform': case 'Kyurem': case 'Lycanroc': case 'Necrozma': case 'Wormadam':
				if (this.randomChance(2, 3)) continue;
				break;
			case 'Basculin': case 'Cherrim': case 'Floette': case 'Giratina': case 'Hoopa': case 'Landorus': case 'Meloetta': case 'Meowstic': case 'Shaymin': case 'Thundurus': case 'Tornadus':
				if (this.randomChance(1, 2)) continue;
				break;
			case 'Dugtrio': case 'Exeggutor': case 'Golem': case 'Greninja': case 'Marowak': case 'Muk': case 'Ninetales': case 'Persian': case 'Raichu': case 'Sandslash': case 'Zygarde':
				if (this.gen >= 7 && this.randomChance(1, 2)) continue;
				break;
			}

			let tier = template.tier;

			// Limit two Pokemon per tier
			if (!tierCount[tier]) {
				tierCount[tier] = 1;
			} else if (tierCount[tier] > 1) {
				continue;
			}

			let types = template.types;

			if (!isMonotype) {
				// Limit two of any type
				let skip = false;
				for (const type of types) {
					if (typeCount[type] > 1 && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
				if (skip) continue;
			}

			if (potd && potd.exists) {
				// The Pokemon of the Day belongs in slot 2
				if (pokemon.length === 1) {
					template = potd;
				} else if (template.species === potd.species) {
					continue; // No thanks, I've already got it
				}
			}

			let set = this.randomSet(template, pokemon.length, teamDetails, this.format.gameType !== 'singles');

			// Illusion shouldn't be the last Pokemon of the team
			if (set.ability === 'Illusion' && pokemon.length > 4) continue;

			// Pokemon shouldn't have Physical and Special setup on the same set
			let incompatibleMoves = ['bellydrum', 'swordsdance', 'calmmind', 'nastyplot'];
			let intersectMoves = set.moves.filter(move => incompatibleMoves.includes(move));
			if (intersectMoves.length > 1) continue;

			// Limit 1 of any type combination, 2 in Monotype
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle' || set.ability === 'Sand Stream') {
				// Drought, Drizzle and Sand Stream don't count towards the type combo limit
				typeCombo = set.ability;
				if (typeCombo in typeComboCount) continue;
			} else {
				if (typeComboCount[typeCombo] >= (isMonotype ? 2 : 1)) continue;
			}

			let item = this.getItem(set.item);

			// Limit 1 Z-Move per team
			if (teamDetails['zMove'] && item.zMove) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			if (pokemon.length === 6) {
				// Set Zoroark's level to be the same as the last Pokemon
				let illusion = teamDetails['illusion'];
				if (illusion) pokemon[illusion - 1].level = pokemon[5].level;
				break;
			}

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;
			tierCount[tier]++;

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

			// Team has Mega/weather/hazards
			if (item.megaStone) teamDetails['megaStone'] = 1;
			if (item.zMove) teamDetails['zMove'] = 1;
			if (set.ability === 'Snow Warning' || set.moves.includes('hail')) teamDetails['hail'] = 1;
			if (set.moves.includes('raindance') || set.ability === 'Drizzle' && !item.onPrimal) teamDetails['rain'] = 1;
			if (set.ability === 'Sand Stream') teamDetails['sand'] = 1;
			if (set.moves.includes('sunnyday') || set.ability === 'Drought' && !item.onPrimal) teamDetails['sun'] = 1;
			if (set.moves.includes('stealthrock')) teamDetails['stealthRock'] = 1;
			if (set.moves.includes('toxicspikes')) teamDetails['toxicSpikes'] = 1;
			if (set.moves.includes('defog') || set.moves.includes('rapidspin')) teamDetails['hazardClear'] = 1;

			// For setting Zoroark's level
			if (set.ability === 'Illusion') teamDetails['illusion'] = pokemon.length;
		}
		return pokemon;
	}

	/**
	 * @param {Template} template
	 * @param {number} slot
	 * @param {RandomTeamsTypes.FactoryTeamDetails} teamData
	 * @param {string} tier
	 * @return {RandomTeamsTypes.RandomFactorySet | false}
	 */
	randomFactorySet(template, slot, teamData, tier) {
		let speciesId = toId(template.species);
		// let flags = this.randomFactorySets[tier][speciesId].flags;
		let setList = this.randomFactorySets[tier][speciesId].sets;

		/**@type {{[k: string]: number}} */
		let itemsMax = {'choicespecs': 1, 'choiceband': 1, 'choicescarf': 1};
		/**@type {{[k: string]: number}} */
		let movesMax = {'rapidspin': 1, 'batonpass': 1, 'stealthrock': 1, 'defog': 1, 'spikes': 1, 'toxicspikes': 1};
		let requiredMoves = {'stealthrock': 'hazardSet', 'rapidspin': 'hazardClear', 'defog': 'hazardClear'};
		let weatherAbilitiesRequire = {
			'hydration': 'raindance', 'swiftswim': 'raindance',
			'leafguard': 'sunnyday', 'solarpower': 'sunnyday', 'chlorophyll': 'sunnyday',
			'sandforce': 'sandstorm', 'sandrush': 'sandstorm', 'sandveil': 'sandstorm',
			'slushrush': 'hail', 'snowcloak': 'hail',
		};
		let weatherAbilities = ['drizzle', 'drought', 'snowwarning', 'sandstream'];

		// Build a pool of eligible sets, given the team partners
		// Also keep track of sets with moves the team requires
		/**@type {{set: AnyObject, moveVariants?: number[]}[]} */
		let effectivePool = [];
		let priorityPool = [];
		for (const curSet of setList) {
			let item = this.getItem(curSet.item);
			if (teamData.megaCount > 0 && item.megaStone) continue; // reject 2+ mega stones
			if (teamData.zCount && teamData.zCount > 0 && item.zMove) continue; // reject 2+ Z stones
			if (itemsMax[item.id] && teamData.has[item.id] >= itemsMax[item.id]) continue;

			let ability = this.getAbility(curSet.ability);
			// @ts-ignore
			if (weatherAbilitiesRequire[ability.id] && teamData.weather !== weatherAbilitiesRequire[ability.id]) continue;
			if (teamData.weather && weatherAbilities.includes(ability.id)) continue; // reject 2+ weather setters

			let reject = false;
			let hasRequiredMove = false;
			let curSetVariants = [];
			for (const move of curSet.moves) {
				let variantIndex = this.random(move.length);
				let moveId = toId(move[variantIndex]);
				if (movesMax[moveId] && teamData.has[moveId] >= movesMax[moveId]) {
					reject = true;
					break;
				}
				// @ts-ignore
				if (requiredMoves[moveId] && !teamData.has[requiredMoves[moveId]]) {
					hasRequiredMove = true;
				}
				curSetVariants.push(variantIndex);
			}
			if (reject) continue;
			effectivePool.push({set: curSet, moveVariants: curSetVariants});
			if (hasRequiredMove) priorityPool.push({set: curSet, moveVariants: curSetVariants});
		}
		if (priorityPool.length) effectivePool = priorityPool;

		if (!effectivePool.length) {
			if (!teamData.forceResult) return false;
			for (const curSet of setList) {
				effectivePool.push({set: curSet});
			}
		}

		let setData = this.sample(effectivePool);
		let moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moveVariants ? moveSlot[setData.moveVariants[i]] : this.sample(moveSlot));
		}

		let item = Array.isArray(setData.set.item) ? this.sample(setData.set.item) : setData.set.item;
		let ability = Array.isArray(setData.set.ability) ? this.sample(setData.set.ability) : setData.set.ability;
		let nature = Array.isArray(setData.set.nature) ? this.sample(setData.set.nature) : setData.set.nature;

		return {
			name: setData.set.name || template.baseSpecies,
			species: setData.set.species,
			gender: setData.set.gender || template.gender || (this.randomChance(1, 2) ? 'M' : 'F'),
			item: item || '',
			ability: ability || template.abilities['0'],
			shiny: typeof setData.set.shiny === 'undefined' ? this.randomChance(1, 1024) : setData.set.shiny,
			level: setData.set.level ? setData.set.level : tier === "LC" ? 5 : 100,
			happiness: typeof setData.set.happiness === 'undefined' ? 255 : setData.set.happiness,
			evs: Object.assign({hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}, setData.set.evs),
			ivs: Object.assign({hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, setData.set.ivs),
			nature: nature || 'Serious',
			moves: moves,
		};
	}

	/**
	 * @param {PlayerOptions} [side]
	 * @param {number} [depth]
	 * @return {RandomTeamsTypes.RandomFactorySet[]}
	 */
	randomFactoryTeam(side, depth = 0) {
		let forceResult = (depth >= 4);

		// The teams generated depend on the tier choice in such a way that
		// no exploitable information is leaked from rolling the tier in getTeam(p1).
		let availableTiers = ['Uber', 'OU', 'UU', 'RU', 'NU', 'PU', 'LC', 'Mono'];
		if (!this.FactoryTier) this.FactoryTier = this.sample(availableTiers);
		const chosenTier = this.FactoryTier;

		/**@type {{[k: string]: number}} */
		const tierValues = {
			'Uber': 5,
			'OU': 4, 'UUBL': 4,
			'UU': 3, 'RUBL': 3,
			'RU': 2, 'NUBL': 2,
			'NU': 1, 'PUBL': 1,
			'PU': 0,
		};

		let pokemon = [];
		let pokemonPool = Object.keys(this.randomFactorySets[chosenTier]);

		let typePool = Object.keys(this.data.TypeChart);
		const type = this.sample(typePool);

		/**@type {TeamData} */
		let teamData = {typeCount: {}, typeComboCount: {}, baseFormes: {}, megaCount: 0, zCount: 0, has: {}, forceResult: forceResult, weaknesses: {}, resistances: {}};
		let requiredMoveFamilies = ['hazardSet', 'hazardClear'];
		/**@type {{[k: string]: string}} */
		let requiredMoves = {'stealthrock': 'hazardSet', 'rapidspin': 'hazardClear', 'defog': 'hazardClear'};
		/**@type {{[k: string]: string}} */
		let weatherAbilitiesSet = {'drizzle': 'raindance', 'drought': 'sunnyday', 'snowwarning': 'hail', 'sandstream': 'sandstorm'};
		/**@type {{[k: string]: string[]}} */
		let resistanceAbilities = {
			'dryskin': ['Water'], 'waterabsorb': ['Water'], 'stormdrain': ['Water'],
			'flashfire': ['Fire'], 'heatproof': ['Fire'],
			'lightningrod': ['Electric'], 'motordrive': ['Electric'], 'voltabsorb': ['Electric'],
			'sapsipper': ['Grass'],
			'thickfat': ['Ice', 'Fire'],
			'levitate': ['Ground'],
		};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Lessen the need of deleting sets of Pokemon after tier shifts
			if (chosenTier in tierValues && template.tier in tierValues && tierValues[template.tier] > tierValues[chosenTier]) continue;

			let speciesFlags = this.randomFactorySets[chosenTier][template.speciesid].flags;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[template.baseSpecies]) continue;

			// Limit the number of Megas to one
			if (teamData.megaCount >= 1 && speciesFlags.megaOnly) continue;

			let set = this.randomFactorySet(template, pokemon.length, teamData, chosenTier);
			if (!set) continue;

			let itemData = this.getItem(set.item);

			// Actually limit the number of Megas to one
			if (teamData.megaCount >= 1 && itemData.megaStone) continue;

			// Limit the number of Z moves to one
			if (teamData.zCount >= 1 && itemData.zMove) continue;

			let types = template.types;

			// Enforce Monotype
			if (chosenTier === 'Mono') {
				// Prevents Mega Evolutions from breaking the type limits
				if (itemData.megaStone) {
					let megaTemplate = this.getTemplate(itemData.megaStone);
					if (types.length > megaTemplate.types.length) types = [template.types[0]];
					// Only check the second type because a Mega Evolution should always share the first type with its base forme.
					if (megaTemplate.types[1] && types[1] && megaTemplate.types[1] !== types[1]) {
						types = [megaTemplate.types[0]];
					}
				}
				if (!types.includes(type)) continue;
			} else {
			// If not Monotype, limit to two of each type
				let skip = false;
				for (const type of types) {
					if (teamData.typeCount[type] > 1 && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit 1 of any type combination
				let typeCombo = types.slice().sort().join();
				if (set.ability + '' === 'Drought' || set.ability + '' === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
					typeCombo = set.ability + '';
				}
				if (typeCombo in teamData.typeComboCount) continue;
			}

			// Okay, the set passes, add it to our team
			pokemon.push(set);
			let typeCombo = types.slice().sort().join();
			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			teamData.typeComboCount[typeCombo] = 1;

			teamData.baseFormes[template.baseSpecies] = 1;

			if (itemData.megaStone) teamData.megaCount++;
			if (itemData.zMove) teamData.zCount++;
			if (itemData.id in teamData.has) {
				teamData.has[itemData.id]++;
			} else {
				teamData.has[itemData.id] = 1;
			}

			let abilityData = this.getAbility(set.ability);
			if (abilityData.id in weatherAbilitiesSet) {
				teamData.weather = weatherAbilitiesSet[abilityData.id];
			}

			for (const move of set.moves) {
				let moveId = toId(move);
				if (moveId in teamData.has) {
					teamData.has[moveId]++;
				} else {
					teamData.has[moveId] = 1;
				}
				if (moveId in requiredMoves) {
					teamData.has[requiredMoves[moveId]] = 1;
				}
			}

			for (let typeName in this.data.TypeChart) {
				// Cover any major weakness (3+) with at least one resistance
				if (teamData.resistances[typeName] >= 1) continue;
				if (resistanceAbilities[abilityData.id] && resistanceAbilities[abilityData.id].includes(typeName) || !this.getImmunity(typeName, types)) {
					// Heuristic: assume that Pokémon with these abilities don't have (too) negative typing.
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
					continue;
				}
				let typeMod = this.getEffectiveness(typeName, types);
				if (typeMod < 0) {
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (pokemon.length < 6) return this.randomFactoryTeam(side, ++depth);

		// Quality control
		if (!teamData.forceResult) {
			for (const requiredFamily of requiredMoveFamilies) {
				if (!teamData.has[requiredFamily]) return this.randomFactoryTeam(side, ++depth);
			}
			for (let type in teamData.weaknesses) {
				if (teamData.weaknesses[type] >= 3) return this.randomFactoryTeam(side, ++depth);
			}
		}

		return pokemon;
	}

	/**
	 * @param {Template} template
	 * @param {number} slot
	 * @param {RandomTeamsTypes.FactoryTeamDetails} teamData
	 * @return {RandomTeamsTypes.RandomFactorySet | false}
	 */
	randomBSSFactorySet(template, slot, teamData) {
		let speciesId = toId(template.species);
		// let flags = this.randomBSSFactorySets[tier][speciesId].flags;
		let setList = this.randomBSSFactorySets[speciesId].sets;

		/**@type {{[k: string]: number}} */
		let movesMax = {'batonpass': 1, 'stealthrock': 1, 'spikes': 1, 'toxicspikes': 1, 'doubleedge': 1, 'trickroom': 1};
		/**@type {{[k: string]: string}} */
		let requiredMoves = {};
		/**@type {{[k: string]: string}} */
		let weatherAbilitiesRequire = {
			'swiftswim': 'raindance',
			'sandrush': 'sandstorm', 'sandveil': 'sandstorm',
		};
		let weatherAbilities = ['drizzle', 'drought', 'snowwarning', 'sandstream'];

		// Build a pool of eligible sets, given the team partners
		// Also keep track of sets with moves the team requires
		/**@type {{set: AnyObject, moveVariants?: number[], itemVariants?: number, abilityVariants?: number}[]} */
		let effectivePool = [];
		let priorityPool = [];
		for (const curSet of setList) {
			let item = this.getItem(curSet.item);
			if (teamData.megaCount > 1 && item.megaStone) continue; // reject 3+ mega stones
			if (teamData.zCount && teamData.zCount > 1 && item.zMove) continue; // reject 3+ Z stones
			if (teamData.has[item.id]) continue; // Item clause

			let ability = this.getAbility(curSet.ability);
			if (weatherAbilitiesRequire[ability.id] && teamData.weather !== weatherAbilitiesRequire[ability.id]) continue;
			if (teamData.weather && weatherAbilities.includes(ability.id)) continue; // reject 2+ weather setters

			if (curSet.species === 'Aron' && teamData.weather !== 'sandstorm') continue; // reject Aron without a Sand Stream user

			let reject = false;
			let hasRequiredMove = false;
			let curSetVariants = [];
			for (const move of curSet.moves) {
				let variantIndex = this.random(move.length);
				let moveId = toId(move[variantIndex]);
				if (movesMax[moveId] && teamData.has[moveId] >= movesMax[moveId]) {
					reject = true;
					break;
				}
				if (requiredMoves[moveId] && !teamData.has[requiredMoves[moveId]]) {
					hasRequiredMove = true;
				}
				curSetVariants.push(variantIndex);
			}
			if (reject) continue;
			effectivePool.push({set: curSet, moveVariants: curSetVariants});
			if (hasRequiredMove) priorityPool.push({set: curSet, moveVariants: curSetVariants});
		}
		if (priorityPool.length) effectivePool = priorityPool;

		if (!effectivePool.length) {
			if (!teamData.forceResult) return false;
			for (const curSet of setList) {
				effectivePool.push({set: curSet});
			}
		}

		let setData = this.sample(effectivePool);
		let moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moveVariants ? moveSlot[setData.moveVariants[i]] : this.sample(moveSlot));
		}

		return {
			name: setData.set.nickname || setData.set.name || template.baseSpecies,
			species: setData.set.species,
			gender: setData.set.gender || template.gender || (this.randomChance(1, 2) ? 'M' : 'F'),
			item: setData.set.item || '',
			ability: setData.set.ability || template.abilities['0'],
			shiny: typeof setData.set.shiny === 'undefined' ? this.randomChance(1, 1024) : setData.set.shiny,
			level: setData.set.level || 50,
			happiness: typeof setData.set.happiness === 'undefined' ? 255 : setData.set.happiness,
			evs: Object.assign({hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}, setData.set.evs),
			ivs: Object.assign({hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, setData.set.ivs),
			nature: setData.set.nature || 'Serious',
			moves: moves,
		};
	}

	/**
	 * @param {PlayerOptions} [side]
	 * @param {number} [depth]
	 * @return {RandomTeamsTypes.RandomFactorySet[]}
	 */
	randomBSSFactoryTeam(side, depth = 0) {
		let forceResult = (depth >= 4);

		let pokemon = [];

		let pokemonPool = Object.keys(this.randomBSSFactorySets);

		/**@type {TeamData} */
		let teamData = {typeCount: {}, typeComboCount: {}, baseFormes: {}, megaCount: 0, zCount: 0, eeveeLimCount: 0, has: {}, forceResult: forceResult, weaknesses: {}, resistances: {}};
		/**@type {string[]} */
		let requiredMoveFamilies = [];
		/**@type {{[k: string]: string}} */
		let requiredMoves = {};
		/**@type {{[k: string]: string}} */
		let weatherAbilitiesSet = {'drizzle': 'raindance', 'drought': 'sunnyday', 'snowwarning': 'hail', 'sandstream': 'sandstorm'};
		/**@type {{[k: string]: string[]}} */
		let resistanceAbilities = {
			'waterabsorb': ['Water'],
			'flashfire': ['Fire'],
			'lightningrod': ['Electric'], 'voltabsorb': ['Electric'],
			'thickfat': ['Ice', 'Fire'],
			'levitate': ['Ground'],
		};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			let speciesFlags = this.randomBSSFactorySets[template.speciesid].flags;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[template.baseSpecies]) continue;

			// Limit the number of Megas + Z-moves to 3
			if (teamData.megaCount + teamData.zCount >= 3 && speciesFlags.megaOnly) continue;

			// Limit 2 of any type
			let types = template.types;
			let skip = false;
			for (const type of types) {
				if (teamData.typeCount[type] > 1 && this.randomChance(4, 5)) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			// Restrict Eevee with certain Pokemon
			if (speciesFlags.limEevee) teamData.eeveeLimCount++;
			if (teamData.eeveeLimCount >= 1 && speciesFlags.limEevee) continue;

			let set = this.randomBSSFactorySet(template, pokemon.length, teamData);
			if (!set) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in teamData.typeComboCount) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			teamData.typeComboCount[typeCombo] = 1;

			teamData.baseFormes[template.baseSpecies] = 1;

			// Limit Mega and Z-move
			let itemData = this.getItem(set.item);
			if (itemData.megaStone) teamData.megaCount++;
			if (itemData.zMove) teamData.zCount++;
			teamData.has[itemData.id] = 1;

			let abilityData = this.getAbility(set.ability);
			if (abilityData.id in weatherAbilitiesSet) {
				teamData.weather = weatherAbilitiesSet[abilityData.id];
			}

			for (const move of set.moves) {
				let moveId = toId(move);
				if (moveId in teamData.has) {
					teamData.has[moveId]++;
				} else {
					teamData.has[moveId] = 1;
				}
				if (moveId in requiredMoves) {
					teamData.has[requiredMoves[moveId]] = 1;
				}
			}

			for (let typeName in this.data.TypeChart) {
				// Cover any major weakness (3+) with at least one resistance
				if (teamData.resistances[typeName] >= 1) continue;
				if (resistanceAbilities[abilityData.id] && resistanceAbilities[abilityData.id].includes(typeName) || !this.getImmunity(typeName, types)) {
					// Heuristic: assume that Pokémon with these abilities don't have (too) negative typing.
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
					continue;
				}
				let typeMod = this.getEffectiveness(typeName, types);
				if (typeMod < 0) {
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (pokemon.length < 6) return this.randomBSSFactoryTeam(side, ++depth);

		// Quality control
		if (!teamData.forceResult) {
			for (const requiredFamily of requiredMoveFamilies) {
				if (!teamData.has[requiredFamily]) return this.randomBSSFactoryTeam(side, ++depth);
			}
			for (let type in teamData.weaknesses) {
				if (teamData.weaknesses[type] >= 3) return this.randomBSSFactoryTeam(side, ++depth);
			}
		}

		return pokemon;
	}
}

module.exports = RandomTeams;
