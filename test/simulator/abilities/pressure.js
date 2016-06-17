'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Pressure', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deduct 1 extra PP from opposing Pokemon moves targetting the user', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: "Giratina", ability: 'pressure', moves: ['rest']}, {species: "Talonflame", ability: 'galewings', moves: ['peck']}],
			[{species: "Giratina", ability: 'defiant', moves: ['rest']}, {species: "Talonflame", ability: 'galewings', moves: ['peck']}],
		]);
		battle.choose('p1', 'move 1, move 1 -1');
		battle.choose('p2', 'move 1, move 1 1');
		let move = Tools.getMove('peck');
		assert.strictEqual(battle.p1.active[1].getMoveData(move).pp, 55);
		assert.strictEqual(battle.p2.active[1].getMoveData(move).pp, 54);
	});

	it('should deduct PP if moves are redirected to the user', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: "Giratina", ability: 'pressure', moves: ['followme']}, {species: "Talonflame", ability: 'galewings', moves: ['peck']}],
			[{species: "Clefable", ability: 'unaware', moves: ['followme']}, {species: "Ho-Oh", ability: 'pressure', moves: ['peck']}],
		]);
		battle.choose('p1', 'move 1, move 1 2');
		battle.choose('p2', 'move 1, move 1 2');
		let move = Tools.getMove('peck');
		assert.strictEqual(battle.p1.active[1].getMoveData(move).pp, 55);
		assert.strictEqual(battle.p2.active[1].getMoveData(move).pp, 54);
	});

	it('should deduct PP even if the move fails or misses', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Giratina", ability: 'pressure', item: 'laggingtail', moves: ['mistyterrain', 'shadowforce']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Smeargle", ability: 'desolateland', moves: ['doubleedge', 'spore', 'moonblast', 'surf']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].getMoveData(Tools.getMove('doubleedge')).pp, 22);
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p2.active[0].getMoveData(Tools.getMove('spore')).pp, 22);
		battle.choose('p2', 'move 3');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].getMoveData(Tools.getMove('moonblast')).pp, 22);
		battle.choose('p2', 'move 4');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].getMoveData(Tools.getMove('surf')).pp, 22);
	});

	it('should deduct PP for each Pressure Pokemon targetted', function () {
		this.timeout(3000);
		battle = common.createBattle({gameType: 'triples'});
		battle.join('p1', 'Guest 1', 1, [
			{species: "Giratina", ability: 'pressure', moves: ['rest']},
			{species: "Palkia", ability: 'pressure', moves: ['rest']},
			{species: "Dialga", ability: 'pressure', moves: ['rest']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Kyurem", ability: 'pressure', moves: ['hail']},
			{species: "Zekrom", ability: 'teravolt', moves: ['spikes']},
			{species: "Reshiram", ability: 'turboblaze', moves: ['rockslide']},
		]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].getMoveData(Tools.getMove('hail')).pp, 12);
		assert.strictEqual(battle.p2.active[1].getMoveData(Tools.getMove('spikes')).pp, 28);
		assert.strictEqual(battle.p2.active[2].getMoveData(Tools.getMove('rockslide')).pp, 13);
	});

	it('should deduct PP for each opposing Pressure Pokemon when Snatch of Imprison are used', function () {
		this.timeout(3000);
		battle = common.createBattle({gameType: 'triples'});
		battle.join('p1', 'Guest 1', 1, [
			{species: "Giratina", ability: 'pressure', moves: ['rest']},
			{species: "Palkia", ability: 'pressure', moves: ['rest']},
			{species: "Dialga", ability: 'pressure', moves: ['rest']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Kyurem", ability: 'pressure', moves: ['snatch']},
			{species: "Zekrom", ability: 'teravolt', moves: ['imprison']},
			{species: "Reshiram", ability: 'turboblaze', moves: ['rest']},
		]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].getMoveData(Tools.getMove('snatch')).pp, 12);
		assert.strictEqual(battle.p2.active[1].getMoveData(Tools.getMove('imprison')).pp, 12);
	});
});

describe('Pressure [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deduct 1 extra PP from any moves targetting the user', function () {
		battle = common.gen(4).createBattle({gameType: 'doubles'}, [
			[{species: "Giratina", ability: 'pressure', moves: ['rest']}, {species: "Aerodactyl", ability: 'quickfeet', moves: ['peck']}],
			[{species: "Giratina", ability: 'pressure', moves: ['rest']}, {species: "Aerodactyl", ability: 'quickfeet', moves: ['peck']}],
		]);
		battle.choose('p1', 'move 1, move 1 -1');
		battle.choose('p2', 'move 1, move 1 1');
		let move = Tools.getMove('peck');
		assert.strictEqual(battle.p1.active[1].getMoveData(move).pp, 54);
		assert.strictEqual(battle.p2.active[1].getMoveData(move).pp, 54);
	});

	it('should deduct PP if moves are redirected to the user', function () {
		battle = common.gen(4).createBattle({gameType: 'doubles'}, [
			[{species: "Giratina", ability: 'pressure', moves: ['followme']}, {species: "Aerodactyl", ability: 'quickfeet', moves: ['peck']}],
			[{species: "Clefable", ability: 'magicguard', moves: ['followme']}, {species: "Ho-Oh", ability: 'pressure', moves: ['peck']}],
		]);
		battle.choose('p1', 'move 1, move 1 2');
		battle.choose('p2', 'move 1, move 1 2');
		let move = Tools.getMove('peck');
		assert.strictEqual(battle.p1.active[1].getMoveData(move).pp, 55);
		assert.strictEqual(battle.p2.active[1].getMoveData(move).pp, 54);
	});

	it('should deduct PP even if the move fails or misses', function () {
		battle = common.gen(4).createBattle([
			[{species: "Giratina", ability: 'pressure', item: 'laggingtail', moves: ['shadowforce']}],
			[{species: "Smeargle", ability: 'owntempo', moves: ['doubleedge', 'dragonpulse']}],
		]);
		const attacker = battle.p2.active[0];
		battle.commitDecisions();
		assert.strictEqual(attacker.getMoveData(Tools.getMove('doubleedge')).pp, 22);
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(attacker.getMoveData(Tools.getMove('dragonpulse')).pp, 14);
	});

	it('should deduct PP for each Pressure Pokemon targetted', function () {
		battle = common.gen(4).createBattle({gameType: 'doubles'}, [
			[{species: "Palkia", ability: 'pressure', moves: ['rest']}, {species: "Dialga", ability: 'pressure', moves: ['rest']}],
			[{species: "Lugia", ability: 'pressure', moves: ['hail']}, {species: "Ho-Oh", ability: 'pressure', moves: ['earthquake']}],
		]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].getMoveData(Tools.getMove('hail')).pp, 12);
		assert.strictEqual(battle.p2.active[1].getMoveData(Tools.getMove('earthquake')).pp, 12);
	});

	it('should not deduct PP from self-targeting moves', function () {
		battle = common.gen(4).createBattle([
			[{species: "Palkia", ability: 'pressure', moves: ['calmmind']}],
			[{species: "Dialga", ability: 'pressure', moves: ['calmmind']}],
		]);
		battle.commitDecisions();
		let move = Tools.getMove('calmmind');
		assert.strictEqual(battle.p1.active[0].getMoveData(move).pp, 31);
		assert.strictEqual(battle.p1.active[0].getMoveData(move).pp, 31);
	});
});
