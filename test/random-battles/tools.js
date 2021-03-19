/**
 * Tools for testing Random Battles.
 *
 * @author Annika
 */
'use strict';

/**
 * Unit test helper for Pokemon sets
 *
 * @param {ID} pokemon the ID of the Pokemon whose set is to be tested
 * @param {{format?: string, rounds?: number, isDoubles?: boolean, isLead?: boolean, isDynamax?: boolean}} options
 * @param {(set: RandomTeamsTypes.RandomSet) => void} test a function called on each set
 */
function testSet(pokemon, options, test) {
	const generator = Dex.getTeamGenerator(options.format);
	const rounds = options.rounds || 1000;

	const isDoubles = options.isDoubles || (options.format && options.format.includes('doubles'));
	const isDynamax = options.isDynamax || !(options.format && options.format.includes('nodmax'));
	for (let i = 0; i < rounds; i++) {
		const set = generator.randomSet(pokemon, {}, options.isLead, isDoubles, isDynamax);
		test(set);
	}
}

/**
 * Unit test helper for Pokemon teams
 *
 * @param {{format?: string, rounds?: number}} options
 * @param {(team: RandomTeamsTypes.RandomSet[]) => void} test a function called on each team
 */
function testTeam(options, test) {
	const generator = Dex.getTeamGenerator(options.format);
	const rounds = options.rounds || 1000;

	for (let i = 0; i < rounds; i++) {
		const team = generator.randomTeam();
		test(team);
	}
}

exports.testSet = testSet;
exports.testTeam = testTeam;
