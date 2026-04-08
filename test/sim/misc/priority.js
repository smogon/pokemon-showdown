'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Priority', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should cause +1 priority moves to go before regular moves`, () => {
		battle = common.createBattle([[
			{ species: 'Snorlax', ability: 'immunity', moves: ['quickattack'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['softboiled'] },
		]]);
		battle.makeChoices();
		const qaIdx = battle.log.findIndex(line => line.includes('|move|p1a: Snorlax|Quick Attack'));
		const sbIdx = battle.log.findIndex(line => line.includes('|move|p2a: Blissey|Soft-Boiled'));
		assert(qaIdx < sbIdx);
	});

	it(`should cause +2 priority to go before +1 priority`, () => {
		battle = common.createBattle([[
			{ species: 'Snorlax', ability: 'immunity', moves: ['quickattack'] },
		], [
			{ species: 'Arcanine', ability: 'flashfire', moves: ['extremespeed'] },
		]]);
		battle.makeChoices();
		const esIdx = battle.log.findIndex(line => line.includes('|move|p2a: Arcanine|Extreme Speed'));
		const qaIdx = battle.log.findIndex(line => line.includes('|move|p1a: Snorlax|Quick Attack'));
		assert(esIdx !== -1 && qaIdx !== -1);
		assert(esIdx < qaIdx);
	});

	it(`should boost status move priority by +1 with Prankster`, () => {
		battle = common.createBattle([[
			{ species: 'Charizard', ability: 'blaze', moves: ['flamethrower'] },
		], [
			{ species: 'Sableye', ability: 'prankster', moves: ['willowisp'] },
		]]);
		battle.makeChoices();
		const wowIdx = battle.log.findIndex(line => line.includes('|move|p2a: Sableye|Will-O-Wisp'));
		const ftIdx = battle.log.findIndex(line => line.includes('|move|p1a: Charizard|Flamethrower'));
		assert(wowIdx !== -1 && ftIdx !== -1);
		assert(wowIdx < ftIdx);
	});

	it(`should cause -6 priority moves to go last`, () => {
		// hippowdon (47 spe) is faster than snorlax (30 spe) normally,
		// but dragon tail (-6) goes after body slam (0)
		battle = common.createBattle([[
			{ species: 'Hippowdon', ability: 'sandstream', moves: ['dragontail'] },
		], [
			{ species: 'Snorlax', ability: 'immunity', moves: ['bodyslam'] },
		]]);
		battle.makeChoices();
		const bsIdx = battle.log.findIndex(line => line.includes('|move|p2a: Snorlax|Body Slam'));
		const dtIdx = battle.log.findIndex(line => line.includes('|move|p1a: Hippowdon|Dragon Tail'));
		assert(bsIdx !== -1 && dtIdx !== -1);
		assert(bsIdx < dtIdx);
	});

	it(`should break priority ties with Speed`, () => {
		battle = common.createBattle([[
			{ species: 'Slowbro', ability: 'oblivious', moves: ['watergun'] },
		], [
			{ species: 'Raichu', ability: 'static', moves: ['thunderbolt'] },
		]]);
		battle.makeChoices();
		const tbIdx = battle.log.findIndex(line => line.includes('|move|p2a: Raichu|Thunderbolt'));
		const wgIdx = battle.log.findIndex(line => line.includes('|move|p1a: Slowbro|Water Gun'));
		assert(tbIdx !== -1 && wgIdx !== -1);
		assert(tbIdx < wgIdx);
	});
});

describe('Priority [Gen 1]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should cause Quick Attack to go before regular moves`, () => {
		battle = common.gen(1).createBattle([[
			{ species: 'Snorlax', moves: ['quickattack'] },
		], [
			{ species: 'Alakazam', moves: ['psybeam'] },
		]]);
		battle.makeChoices();
		const qaIdx = battle.log.findIndex(line => line.includes('|move|p1a: Snorlax|Quick Attack'));
		const pbIdx = battle.log.findIndex(line => line.includes('|move|p2a: Alakazam|Psybeam'));
		assert(qaIdx !== -1 && pbIdx !== -1);
		assert(qaIdx < pbIdx);
	});
});
