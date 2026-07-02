'use strict';

const assert = require('../../assert');
const Dex = require('../../../dist/sim/dex').Dex;

describe('[Gen 3] Monotype', () => {
	const gen3 = Dex.mod('gen3');
	const ruleTable = Dex.formats.getRuleTable(Dex.formats.get('gen3monotype'));

	it('bans Suicune and Jirachi (both OU in gen3, too strong for Monotype)', () => {
		// Sanity: they really are OU, so the 'Uber' tier ban does not catch them —
		// the explicit banlist entries are what remove them.
		assert.equal(gen3.species.get('suicune').tier, 'OU');
		assert.equal(gen3.species.get('jirachi').tier, 'OU');
		assert(ruleTable.isBannedSpecies(gen3.species.get('suicune')), 'Suicune should be banned');
		assert(ruleTable.isBannedSpecies(gen3.species.get('jirachi')), 'Jirachi should be banned');
		assert.false.legalTeam([
			{ species: 'Suicune', ability: 'Pressure', moves: ['surf', 'calmmind', 'rest', 'sleeptalk'], evs: { hp: 4 }, level: 100 },
		], 'gen3monotype');
		assert.false.legalTeam([
			{ species: 'Jirachi', ability: 'Serene Grace', moves: ['psychic', 'calmmind', 'thunderbolt', 'wish'], evs: { hp: 4 }, level: 100 },
		], 'gen3monotype');
	});

	it('bans the whole Uber tier (e.g. Mewtwo)', () => {
		assert(ruleTable.isBannedSpecies(gen3.species.get('mewtwo')), 'Uber Mewtwo should be banned');
	});

	it('still allows Sand Veil (banned in [Gen 3] OU, allowed here — matches +Sand Veil)', () => {
		assert(!ruleTable.isBanned('ability:sandveil'), 'Sand Veil should be allowed in [Gen 3] Monotype');
	});

	it('enforces Same Type Clause but accepts a legal single-type team', () => {
		// Mono-Water passes.
		assert.legalTeam([
			{ species: 'Milotic', ability: 'Marvel Scale', moves: ['surf', 'recover', 'icebeam', 'toxic'], evs: { hp: 4 }, level: 100 },
		], 'gen3monotype');
		// Water + Steel/Flying share no type -> Same Type Clause violation.
		assert.false.legalTeam([
			{ species: 'Milotic', ability: 'Marvel Scale', moves: ['surf', 'recover', 'icebeam', 'toxic'], evs: { hp: 4 }, level: 100 },
			{ species: 'Skarmory', ability: 'Keen Eye', moves: ['spikes', 'drillpeck', 'toxic', 'protect'], evs: { hp: 4 }, level: 100 },
		], 'gen3monotype');
	});
});
