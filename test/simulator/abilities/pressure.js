var assert = require('assert');
var battle;

describe('Pressure', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deduct 1 extra PP from opposing Pokemon moves targetting the user', function () {
		battle = BattleEngine.Battle.construct('battle-pressure-1', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Giratina", ability: 'pressure', moves: ['rest']},
			{species: "Talonflame", ability: 'galewings', moves: ['peck']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Giratina", ability: 'defiant', moves: ['rest']},
			{species: "Talonflame", ability: 'galewings', moves: ['peck']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.choose('p1', 'move 1, move 1 -1');
		battle.choose('p2', 'move 1, move 1 1');
		var move = Tools.getMove('peck');
		assert.strictEqual(battle.p1.active[1].getMoveData(move).pp, 55);
		assert.strictEqual(battle.p2.active[1].getMoveData(move).pp, 54);
	});

	it('should deduct PP if moves are redirected to the user', function () {
		battle = BattleEngine.Battle.construct('battle-pressure-redirect', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Giratina", ability: 'pressure', moves: ['followme']},
			{species: "Talonflame", ability: 'galewings', moves: ['peck']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Clefable", ability: 'unaware', moves: ['followme']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['peck']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.choose('p1', 'move 1, move 1 2');
		battle.choose('p2', 'move 1, move 1 2');
		var move = Tools.getMove('peck');
		assert.strictEqual(battle.p1.active[1].getMoveData(move).pp, 55);
		assert.strictEqual(battle.p2.active[1].getMoveData(move).pp, 54);
	});

	it('should deduct PP even if the move fails or misses', function () {
		battle = BattleEngine.Battle.construct();
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
		battle = BattleEngine.Battle.construct('battle-pressure-multi', 'triplescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Giratina", ability: 'pressure', moves: ['rest']},
			{species: "Palkia", ability: 'pressure', moves: ['rest']},
			{species: "Dialga", ability: 'pressure', moves: ['rest']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Kyurem", ability: 'pressure', moves: ['hail']},
			{species: "Zekrom", ability: 'teravolt', moves: ['spikes']},
			{species: "Reshiram", ability: 'turboblaze', moves: ['rockslide']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].getMoveData(Tools.getMove('hail')).pp, 12);
		assert.strictEqual(battle.p2.active[1].getMoveData(Tools.getMove('spikes')).pp, 28);
		assert.strictEqual(battle.p2.active[2].getMoveData(Tools.getMove('rockslide')).pp, 13);
	});

	it('should deduct PP for each opposing Pressure Pokemon when Snatch of Imprison are used', function () {
		battle = BattleEngine.Battle.construct('battle-pressure-snatch', 'triplescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Giratina", ability: 'pressure', moves: ['rest']},
			{species: "Palkia", ability: 'pressure', moves: ['rest']},
			{species: "Dialga", ability: 'pressure', moves: ['rest']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Kyurem", ability: 'pressure', moves: ['snatch']},
			{species: "Zekrom", ability: 'teravolt', moves: ['imprison']},
			{species: "Reshiram", ability: 'turboblaze', moves: ['rest']}
		]);
		battle.commitDecisions(); // Team Preview
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
		battle = BattleEngine.Battle.construct('battle-dpp-pressure', 'gen4doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Giratina", ability: 'pressure', moves: ['rest']},
			{species: "Aerodactyl", ability: 'quickfeet', moves: ['peck']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Giratina", ability: 'pressure', moves: ['rest']},
			{species: "Aerodactyl", ability: 'quickfeet', moves: ['peck']}
		]);
		battle.choose('p1', 'move 1, move 1 -1');
		battle.choose('p2', 'move 1, move 1 1');
		var move = Tools.getMove('peck');
		assert.strictEqual(battle.p1.active[1].getMoveData(move).pp, 54);
		assert.strictEqual(battle.p2.active[1].getMoveData(move).pp, 54);
	});

	it('should deduct PP if moves are redirected to the user', function () {
		battle = BattleEngine.Battle.construct('battle-dpp-pressure-redirect', 'gen4doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Giratina", ability: 'pressure', moves: ['followme']},
			{species: "Aerodactyl", ability: 'quickfeet', moves: ['peck']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Clefable", ability: 'magicguard', moves: ['followme']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['peck']}
		]);
		battle.choose('p1', 'move 1, move 1 2');
		battle.choose('p2', 'move 1, move 1 2');
		var move = Tools.getMove('peck');
		assert.strictEqual(battle.p1.active[1].getMoveData(move).pp, 55);
		assert.strictEqual(battle.p2.active[1].getMoveData(move).pp, 54);
	});

	it('should deduct PP even if the move fails or misses', function () {
		battle = BattleEngine.Battle.construct('battle-dpp-pressure-miss', 'gen4customgame');
		battle.join('p1', 'Guest 1', 1, [{species: "Giratina", ability: 'pressure', item: 'laggingtail', moves: ['shadowforce']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['doubleedge', 'dragonpulse']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].getMoveData(Tools.getMove('doubleedge')).pp, 22);
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].getMoveData(Tools.getMove('dragonpulse')).pp, 14);
	});

	it('should deduct PP for each Pressure Pokemon targetted', function () {
		battle = BattleEngine.Battle.construct('battle-dpp-pressure-multi', 'gen4doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Palkia", ability: 'pressure', moves: ['rest']},
			{species: "Dialga", ability: 'pressure', moves: ['rest']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Lugia", ability: 'pressure', moves: ['hail']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['earthquake']}
		]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].getMoveData(Tools.getMove('hail')).pp, 12);
		assert.strictEqual(battle.p2.active[1].getMoveData(Tools.getMove('earthquake')).pp, 12);
	});

	it('should not deduct PP from self-targeting moves', function () {
		battle = BattleEngine.Battle.construct('battle-dpp-pressure-self', 'gen4customgame');
		battle.join('p1', 'Guest 1', 1, [{species: "Palkia", ability: 'pressure', moves: ['calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Dialga", ability: 'pressure', moves: ['calmmind']}]);
		battle.commitDecisions();
		var move = Tools.getMove('calmmind');
		assert.strictEqual(battle.p1.active[0].getMoveData(move).pp, 31);
		assert.strictEqual(battle.p1.active[0].getMoveData(move).pp, 31);
	});
});
