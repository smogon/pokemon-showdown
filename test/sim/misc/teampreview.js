'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Team Preview', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should hide formes of certain Pokemon', function () {
		battle = common.createBattle([[
			{species: 'Pumpkaboo-Super', ability: 'pickup', moves: ['sleeptalk']},
			{species: 'Gourgeist-Small', ability: 'pickup', moves: ['sleeptalk']},
			{species: 'Dudunsparce-Three-Segment', ability: 'runaway', moves: ['sleeptalk']},
		], [
			{species: 'Silvally', ability: 'rkssystem', moves: ['sleeptalk']},
			{species: 'Urshifu-Rapid-Strike', ability: 'unseenfist', moves: ['sleeptalk']},
			{species: 'Zacian', ability: 'intrepidsword', item: 'rustedsword', moves: ['sleeptalk']},
		]]);
		for (const line of battle.log) {
			if (line.startsWith('|poke|')) {
				const details = line.split('|')[3];
				assert(details.match(/(Pumpkaboo|Gourgeist|Silvally|Urshifu|Zacian|Dudunsparce)-\*/), `Forme was not hidden; preview details: ${details}`);
			}
		}
	});

	it('should hide Arceus formes [Gen 8]', function () {
		battle = common.createBattle({formatid: 'gen8anythinggoes'}, [[
			{species: 'Arceus-Steel', ability: 'multitype', item: 'steelplate', moves: ['sleeptalk']},
		], [
			{species: 'Arceus-Fire', ability: 'multitype', item: 'flameplate', moves: ['sleeptalk']},
		]]);
		for (const line of battle.log) {
			if (line.startsWith('|poke|')) {
				const details = line.split('|')[3];
				assert(details.match(/Arceus-\*/), `Forme was not hidden; preview details: ${details}`);
			}
		}
	});

	it('should not hide formes of hacked Zacian/Zamazenta formes', function () {
		battle = common.createBattle([[
			{species: 'Zacian-Crowned', moves: ['sleeptalk']},
		], [
			{species: 'Zamazenta-Crowned', moves: ['sleeptalk']},
		]]);
		for (const line of battle.log) {
			if (line.startsWith('|poke|')) {
				const details = line.split('|')[3];
				assert.false(details.includes('-*'), `Forme was hidden; preview details: ${details}`);
			}
		}
	});
});
