/**
 * Tools for testing Random Battles.
 *
 * @author Annika
 * Some helper functions by Slayer95 have also been added.
 */
'use strict';

const assert = require("../assert");
const Teams = require('./../../sim/teams').Teams;
const TeamValidator = require('../../sim/team-validator').TeamValidator;

/**
 * Unit test helper for Pokemon sets
 *
 * @param {ID} pokemon the ID of the Pokemon whose set is to be tested
 * @param {{format?: string, rounds?: number, isDoubles?: boolean, isLead?: boolean, isDynamax?: boolean, seed?: PRNGSeed}} options
 * @param {(set: RandomTeamsTypes.RandomSet) => void} test a function called on each set
 */
function testSet(pokemon, options, test) {
	const rounds = options.rounds || 1000;

	const isDoubles = options.isDoubles || (options.format && options.format.includes('doubles'));
	const isDynamax = options.isDynamax || !(options.format && options.format.includes('nodmax'));
	for (let i = 0; i < rounds; i++) {
		const generator = Teams.getGenerator(options.format, options.seed || [i, i, i, i]);
		const set = generator.randomSet(pokemon, {}, options.isLead, isDoubles, isDynamax);
		test(set);
	}
}

/**
 * Tests that a Pokémon always gets STAB moves.
 *
 * @param {ID} pokemon
 * @param {{format?: string, rounds?: number, isDoubles?: boolean, isLead?: boolean, isDynamax?: boolean, seed?: PRNGSeed}} options
 */
function testHasSTAB(pokemon, options) {
	const dex = Dex.forFormat(options.format || 'gen8randombattle');
	const types = dex.species.get(pokemon).types;
	testSet(pokemon, options, set => {
		assert(
			set.moves.some(move => types.includes(dex.moves.get(move).type)),
			`${pokemon} should have at least one STAB move (generated moveset: ${set.moves})`
		);
	});
}

/**
 * Tests that a Pokémon does not get two moves together.
 *
 * @param {ID} pokemon the ID of the Pokemon whose set is to be tested
 * @param {{format?: string, rounds?: number, isDoubles?: boolean, isLead?: boolean, isDynamax?: boolean, seed?: PRNGSeed}} options
 * @param {ID} move1
 * @param {ID} move2
 */
function testNotBothMoves(pokemon, options, move1, move2) {
	testSet(pokemon, options, set => {
		assert(
			!(set.moves.includes(move1) && set.moves.includes(move2)),
			`${pokemon} should not generate both "${move1}" and "${move2}" (generated moveset: ${set.moves})`
		);
	});
}

/**
 * Tests that a Pokémon does not get two copies of Hidden Power.
 *
 * @param {ID} pokemon the ID of the Pokemon whose set is to be tested
 * @param {{format?: string, rounds?: number, isDoubles?: boolean, isLead?: boolean, isDynamax?: boolean, seed?: PRNGSeed}} options
 */
function testHiddenPower(pokemon, options) {
	testSet(pokemon, options, set => {
		assert.equal(set.moves.length, 4, `fewer than 4 moves (got ${JSON.stringify(set.moves)})`);
		assert(
			set.moves.filter(m => m.startsWith('hiddenpower')).length < 2,
			`multiple Hidden Power moves (got ${JSON.stringify(set.moves)})`
		);
	});
}

/**
 * Tests that a Pokémon always gets a move.
 *
 * @param {ID} pokemon the ID of the Pokemon whose set is to be tested
 * @param {{format?: string, rounds?: number, isDoubles?: boolean, isLead?: boolean, isDynamax?: boolean, seed?: PRNGSeed}} options
 * @param {ID} move
 */
function testAlwaysHasMove(pokemon, options, move) {
	testSet(pokemon, options, set => {
		assert(
			set.moves.includes(move),
			`${pokemon} should always generate "${move}" (generated moveset: ${set.moves})`
		);
	});
}

/**
 * Unit test helper for Pokemon teams
 *
 * @param {{format?: string, rounds?: number, seed?: PRNGSeed}} options
 * @param {(team: RandomTeamsTypes.RandomSet[]) => void} test a function called on each team
 */
function testTeam(options, test) {
	const rounds = options.rounds || 1000;

	for (let i = 0; i < rounds; i++) {
		const generator = Teams.getGenerator(options.format, options.seed || [i, i, i, i]);
		const team = generator.randomTeam();
		test(team);
	}
}

/**
 * Checks if a set is valid.
 *
 * @param {number} genNumber
 * @param {RandomTeamsTypes.RandomSet} set
 */
function isValidSet(genNumber, set) {
	const dex = Dex.mod(`gen${genNumber}`);
	const species = dex.species.get(set.species || set.name);
	if (!species.exists || species.gen > genNumber) return false;
	if (set.item) {
		const item = dex.items.get(set.item);
		if (!item.exists || item.gen > genNumber) {
			return false;
		}
	}
	if (set.ability && set.ability !== 'None') {
		const ability = dex.abilities.get(set.ability);
		if (!ability.exists || ability.gen > genNumber) {
			return false;
		}
	} else if (genNumber >= 3) {
		return false;
	}
	if (set.moves.filter(m => m.startsWith('hiddenpower')).length > 1) return false;
	return true;
}

/**
 * Checks if a move is valid on a set.
 *
 * @param {ID} move
 * @param {RandomTeamsTypes.RandomSet} set
 * @param {ID} tier
 * @param {ID} mod
 * @returns {boolean}
 */
function validateLearnset(move, set, tier, mod = 'gen8') {
	const validator = TeamValidator.get(`${mod}${tier}`);
	const species = validator.dex.species.get(set.species || set.name);
	return !validator.checkCanLearn(move, species);
}

exports.testSet = testSet;
exports.testAlwaysHasMove = testAlwaysHasMove;
exports.testNotBothMoves = testNotBothMoves;
exports.testHiddenPower = testHiddenPower;
exports.testTeam = testTeam;
exports.testHasSTAB = testHasSTAB;

exports.isValidSet = isValidSet;
exports.validateLearnset = validateLearnset;
