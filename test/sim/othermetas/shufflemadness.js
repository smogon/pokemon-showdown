'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('[Gen 9] Shuffle Madness', () => {
	afterEach(() => {
		if (battle) battle.destroy();
	});

	it('should randomize items at the end of the turn', () => {
		battle = common.createBattle({ formatid: 'gen9shufflemadness', seed: [1, 2, 3, 4] }, [[
			{ species: 'Skarmory', ability: 'sturdy', item: 'rockyhelmet', moves: ['bravebird', 'steelwing', 'roost', 'spikes'] },
		], [
			{ species: 'Garchomp', ability: 'sandveil', item: 'dragonfang', moves: ['earthquake', 'stoneedge', 'dragonclaw', 'dragondance'] },
		]]);

		battle.makeChoices();
		assert.equal(battle.turn, 1);
		assert.equal(battle.p1.active[0].item, 'rockyhelmet');
		assert.equal(battle.p2.active[0].item, 'dragonfang');

		battle.makeChoices('move spikes', 'move dragondance');

		assert.equal(battle.turn, 2);
		assert.notEqual(battle.p1.active[0].item, 'rockyhelmet');
		assert.notEqual(battle.p2.active[0].item, 'dragonfang');
	});

	it('should randomize moves at the end of the turn', () => {
		battle = common.createBattle({ formatid: 'gen9shufflemadness', seed: [1, 2, 3, 4] }, [[
			{ species: 'Skarmory', ability: 'sturdy', moves: ['bravebird', 'steelwing', 'roost', 'spikes'] },
		], [
			{ species: 'Garchomp', ability: 'sandveil', moves: ['earthquake', 'stoneedge', 'dragonclaw', 'dragondance'] },
		]]);

		battle.makeChoices();
		assert.equal(battle.turn, 1);
		assert.equal(battle.p1.active[0].moveSlots[0].id, 'bravebird');
		assert.equal(battle.p1.active[0].moveSlots[1].id, 'steelwing');
		assert.equal(battle.p1.active[0].moveSlots[2].id, 'roost');
		assert.equal(battle.p1.active[0].moveSlots[3].id, 'spikes');
		assert.equal(battle.p2.active[0].moveSlots[0].id, 'earthquake');
		assert.equal(battle.p2.active[0].moveSlots[1].id, 'stoneedge');
		assert.equal(battle.p2.active[0].moveSlots[2].id, 'dragonclaw');
		assert.equal(battle.p2.active[0].moveSlots[3].id, 'dragondance');

		battle.makeChoices('move spikes', 'move dragondance');
		assert.equal(battle.turn, 2);
		assert(
			battle.p1.active[0].moveSlots[0].id !== 'bravebird' ||
			battle.p1.active[0].moveSlots[1].id !== 'steelwing' ||
			battle.p1.active[0].moveSlots[2].id !== 'roost' ||
			battle.p1.active[0].moveSlots[3].id !== 'spikes' ||
			battle.p2.active[0].moveSlots[0].id !== 'earthquake' ||
			battle.p2.active[0].moveSlots[1].id !== 'stoneedge' ||
			battle.p2.active[0].moveSlots[2].id !== 'dragonclaw' ||
			battle.p2.active[0].moveSlots[3].id !== 'dragondance'
		);
	});

	it('should randomize abilities at the end of the turn', () => {
		battle = common.createBattle({ formatid: 'gen9shufflemadness', seed: [1, 2, 3, 4] }, [[
			{ species: 'Skarmory', ability: 'sturdy', moves: ['bravebird', 'steelwing', 'roost', 'spikes'] },
		], [
			{ species: 'Garchomp', ability: 'sandveil', moves: ['earthquake', 'stoneedge', 'dragonclaw', 'dragondance'] },
		]]);
		battle.makeChoices();
		assert.equal(battle.turn, 1);
		assert.equal(battle.p1.active[0].ability, 'sturdy');
		assert.equal(battle.p2.active[0].ability, 'sandveil');
		battle.makeChoices('move spikes', 'move dragondance');
		assert.equal(battle.turn, 2);
		assert.notEqual(battle.p1.active[0].ability, 'sturdy');
		assert.notEqual(battle.p2.active[0].ability, 'sandveil');
	});
	it('should trigger the Jackpot event (12 moves) on a 3% chance', () => {
		battle = common.createBattle({ formatid: 'gen9shufflemadness' }, [[
			{ species: 'Skarmory', ability: 'sturdy', moves: ['roost'] },
		], [
			{ species: 'Garchomp', ability: 'sandveil', moves: ['earthquake'] },
		]]);
		battle.makeChoices();
		const originalRandom = battle.random.bind(battle);
		battle.random = function (m, n) {
			if (m === undefined && n === undefined) return 0.01;
			return originalRandom(m, n);
		};

		battle.makeChoices('move roost', 'move earthquake');
		assert(battle.getDebugLog().includes('has hit the jackpot!'), 'A mensagem de Jackpot não apareceu no log!');
		assert.equal(battle.p1.active[0].moveSlots.length, 12, 'Skarmory deveria ter 12 ataques!');
		assert.equal(battle.p2.active[0].moveSlots.length, 12, 'Garchomp deveria ter 12 ataques!');
	});
	it('should trigger the Epic Moves event (all same move) on a 3% chance', () => {
		battle = common.createBattle({ formatid: 'gen9shufflemadness' }, [[
			{ species: 'Skarmory', ability: 'sturdy', moves: ['roost', 'spikes', 'bravebird', 'steelwing'] },
		], [
			{ species: 'Garchomp', ability: 'sandveil', moves: ['earthquake', 'stoneedge', 'dragonclaw', 'dragondance'] },
		]]);
		battle.makeChoices();
		const randomQueue = [
			0.50,
			0.01,
			0.50,
			0.01,
		];
		const originalRandom = battle.random.bind(battle);
		battle.random = function (m, n) {
			if (m === undefined && n === undefined) {
				return randomQueue.length > 0 ? randomQueue.shift() : 0.5;
			}
			return originalRandom(m, n);
		};

		battle.makeChoices('move roost', 'move earthquake');
		const p1Moves = battle.p1.active[0].moveSlots;
		assert.equal(p1Moves.length, 4);
		assert.equal(p1Moves[0].id, p1Moves[1].id, 'O Ataque 1 e 2 deviam ser iguais');
		assert.equal(p1Moves[1].id, p1Moves[2].id, 'O Ataque 2 e 3 deviam ser iguais');
		assert.equal(p1Moves[2].id, p1Moves[3].id, 'O Ataque 3 e 4 deviam ser iguais');
	});
	it('should find a Z-Crystal on the battlefield', () => {
		battle = common.createBattle({ formatid: 'gen9shufflemadness' }, [[
			{ species: 'Skarmory', ability: 'sturdy', moves: ['roost'] },
		], [
			{ species: 'Garchomp', ability: 'sandveil', moves: ['earthquake'] },
		]]);
		battle.makeChoices();
		const randomQueue = [
			0.5, 0.5, 0.1, 0.01,
			0.5, 0.5, 0.1, 0.01,
		];
		const originalRandom = battle.random.bind(battle);
		battle.random = function (m, n) {
			if (m === undefined && n === undefined) {
				return randomQueue.length > 0 ? randomQueue.shift() : 0.5;
			}
			return originalRandom(m, n);
		};

		battle.makeChoices('move roost', 'move earthquake');
		assert(battle.getDebugLog().includes('found a Z-Crystal on the battlefield!'));
		const itemP1 = battle.dex.items.get(battle.p1.active[0].item);
		assert.equal(itemP1.zMove, true, 'O item gerado devia ter a propriedade Z-Move!');
	});
});
