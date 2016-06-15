'use strict';

const assert = require('assert');
let battle;

describe('Choice parser', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should wait for players to send their decisions and run them as soon as they are all received', function (done) {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Rhydon", ability: 'prankster', moves: ['sketch']}]);

		setTimeout(() => {
			battle.choose('p2', 'move 1');
		}, 20);
		setTimeout(() => {
			battle.choose('p1', 'move 1');
			assert.strictEqual(battle.turn, 2);
			done();
		}, 40);
	});

	it('should force Struggle usage on move attempt for no valid moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Rhydon", ability: 'prankster', moves: ['sketch']}]);

		// First turn
		battle.choose('p1', 'move 1');
		battle.choose('p2', 'move 1');

		// Second turn
		battle.choose('p1', 'move recover');
		battle.choose('p2', 'move sketch');

		// Implementation-dependent paths
		if (battle.turn === 3) {
			assert.strictEqual(battle.p2.active[0].lastMove, 'struggle');
		} else {
			battle.choose('p2', 'move 1');
			assert.strictEqual(battle.turn, 3);
			assert.strictEqual(battle.p2.active[0].lastMove, 'struggle');
		}
	});

	it('should not force Struggle usage on move attempt for valid moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Rhydon", ability: 'prankster', moves: ['struggle', 'surf']}]);

		// First turn
		battle.choose('p1', 'move 1');
		battle.choose('p2', 'move 2');

		assert.strictEqual(battle.turn, 2);
		assert.notStrictEqual(battle.p2.active[0].lastMove, 'struggle');
	});

	it('should not allow revoking decisions after every player has sent an unrevoked decision', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl']}]);

		// First turn
		battle.choose('p1', 'move tackle');
		battle.choose('p2', 'move growl');
		battle.undoChoice('p1');
		battle.choose('p1', 'move growl');

		assert.strictEqual(battle.turn, 2);
		assert.strictEqual(battle.p1.active[0].lastMove, 'tackle');
		assert.strictEqual(battle.p2.active[0].lastMove, 'growl');
	});

	it('should not allow overriding decisions after every player has sent an unrevoked decision', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl']}]);

		// First turn
		battle.choose('p1', 'move tackle');
		battle.choose('p2', 'move growl');
		battle.choose('p1', 'move growl');

		assert.strictEqual(battle.turn, 2);
		assert.strictEqual(battle.p1.active[0].lastMove, 'tackle');
		assert.strictEqual(battle.p2.active[0].lastMove, 'growl');
	});

	it('should support revoking decisions', function () {
		battle = BattleEngine.Battle.construct();
		battle.supportCancel = true;
		battle.join('p1', 'Guest 1', 1, [{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl']}]);

		// First turn
		battle.choose('p1', 'move tackle');
		battle.undoChoice('p1');
		battle.choose('p1', 'move growl');
		battle.choose('p2', 'move growl');

		assert.strictEqual(battle.turn, 2);
		assert.strictEqual(battle.p1.active[0].lastMove, 'growl');
		assert.strictEqual(battle.p2.active[0].lastMove, 'growl');
	});

	it('should support overriding decisions', function () {
		battle = BattleEngine.Battle.construct();
		battle.supportCancel = true;
		battle.join('p1', 'Guest 1', 1, [{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl']}]);

		// First turn
		battle.choose('p1', 'move 1');
		battle.choose('p1', 'move growl');
		battle.choose('p2', 'move 2');

		assert.strictEqual(battle.turn, 2);
		assert.strictEqual(battle.p1.active[0].lastMove, 'growl');
		assert.strictEqual(battle.p2.active[0].lastMove, 'growl');
	});

	it('should disallow revoking decisions by default', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl']}]);

		// First turn
		battle.choose('p1', 'move tackle');
		battle.undoChoice('p1');
		battle.choose('p1', 'move growl');
		battle.choose('p2', 'move growl');

		assert.strictEqual(battle.turn, 2);
		assert.strictEqual(battle.p1.active[0].lastMove, 'tackle');
		assert.strictEqual(battle.p2.active[0].lastMove, 'growl');
	});

	it('should support revoking decisions on double switches', function () {
		battle = BattleEngine.Battle.construct();
		battle.supportCancel = true;
		battle.join('p1', 'Guest 1', 1, [
			{species: "Deoxys-Attack", ability: 'pressure', moves: ['explosion']},
			{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle']},
			{species: "Chikorita", ability: 'overgrow', moves: ['tackle']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Caterpie", ability: 'shielddust', moves: ['tackle']},
			{species: "Charmander", ability: 'blaze', moves: ['tackle']},
		]);

		battle.commitDecisions();

		// First turn
		battle.choose('p1', 'switch 2');
		battle.undoChoice('p1');
		battle.choose('p1', 'switch 3');
		battle.choose('p2', 'switch 2');

		assert.strictEqual(battle.turn, 2);
		assert.strictEqual(battle.p1.active[0].template.species, 'Chikorita');
		assert.strictEqual(battle.p2.active[0].template.species, 'Charmander');
	});

	it('should support overriding decisions on double switches', function () {
		battle = BattleEngine.Battle.construct();
		battle.supportCancel = true;
		battle.join('p1', 'Guest 1', 1, [
			{species: "Deoxys-Attack", ability: 'pressure', moves: ['explosion']},
			{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle']},
			{species: "Chikorita", ability: 'overgrow', moves: ['tackle']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Caterpie", ability: 'shielddust', moves: ['tackle']},
			{species: "Charmander", ability: 'blaze', moves: ['tackle']},
		]);

		battle.commitDecisions();

		battle.choose('p1', 'switch 2');
		battle.choose('p1', 'switch 3');
		battle.choose('p2', 'switch 2');

		assert.strictEqual(battle.turn, 2);
		assert.strictEqual(battle.p1.active[0].template.species, 'Chikorita');
		assert.strictEqual(battle.p2.active[0].template.species, 'Charmander');
	});

	it('should disallow overriding decisions by default', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl']}]);

		battle.choose('p1', 'move 1');
		battle.choose('p1', 'move growl');
		battle.choose('p2', 'move 2');

		assert.strictEqual(battle.turn, 2);
		assert.strictEqual(battle.p1.active[0].lastMove, 'tackle');
		assert.strictEqual(battle.p2.active[0].lastMove, 'growl');
	});

	it('should send meaningful feedback to players if they try to switch a trapped Pokémon out', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Scizor", ability: 'swarm', moves: ['bulletpunch']},
			{species: "Azumarill", ability: 'sapsipper', moves: ['aquajet']},
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Gothitelle", ability: 'shadowtag', moves: ['calmmind']}]);

		const buffer = [];
		battle.send = (type, data) => {
			if (type === 'sideupdate') buffer.push(Array.isArray(data) ? data.join('\n') : data);
		};
		battle.choose('p1', 'switch 2');
		assert(buffer.length >= 1);
		assert(buffer.some(message => {
			return message.startsWith('p1\n') && /\btrapped\b/.test(message) && (/\|0\b/.test(message) || /\|p1a\b/.test(message));
		}));
	});

	it('should send meaningful feedback to players if they try to use a disabled move', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Skarmory", ability: 'sturdy', moves: ['spikes', 'roost']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['imprison', 'spikes']}]);

		battle.commitDecisions();

		const buffer = [];
		battle.send = (type, data) => {
			if (type === 'sideupdate') buffer.push(Array.isArray(data) ? data.join('\n') : data);
		};
		battle.choose('p1', 'move 1');
		assert(buffer.length >= 1);
		assert(buffer.some(message => {
			return message.startsWith('p1\n') && /\bcant\b/.test(message) && (/\|0\b/.test(message) || /\|p1a\b/.test(message));
		}));
	});
});
