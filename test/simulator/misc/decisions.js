'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Decisions', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should wait for players to send their decisions and run them as soon as they are all received', function (done) {
		battle = common.createBattle();
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
		battle = common.createBattle();
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
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Rhydon", ability: 'prankster', moves: ['struggle', 'surf']}]);

		// First turn
		battle.choose('p1', 'move 1');
		battle.choose('p2', 'move 2');

		assert.strictEqual(battle.turn, 2);
		assert.notStrictEqual(battle.p2.active[0].lastMove, 'struggle');
	});

	it('should send meaningful feedback to players if they try to switch a trapped Pokémon out', function () {
		battle = common.createBattle();
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
		battle = common.createBattle();
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

describe('Decision extensions', function () {
	it('should not allow revoking decisions after every player has sent an unrevoked decision', function () {
		battle = common.createBattle();
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
		battle = common.createBattle();
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
		battle = common.createBattle();
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
		battle = common.createBattle();
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
		battle = common.createBattle();
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
		battle = common.createBattle();
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
		battle = common.createBattle();
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
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl']}]);

		battle.choose('p1', 'move 1');
		battle.choose('p1', 'move growl');
		battle.choose('p2', 'move 2');

		assert.strictEqual(battle.turn, 2);
		assert.strictEqual(battle.p1.active[0].lastMove, 'tackle');
		assert.strictEqual(battle.p2.active[0].lastMove, 'growl');
	});
});

describe('Decision internals', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should allow input of move commands in a per Pokémon basis', function () {
		battle = common.createBattle({gameType: 'doubles'});
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: "Mew", ability: 'synchronize', moves: ['recover']},
			{species: "Bulbasaur", ability: 'overgrow', moves: ['growl', 'synthesis']},
		]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Pupitar", ability: 'shedskin', moves: ['surf']}, // faster than Bulbasaur
			{species: "Arceus", ability: 'multitype', moves: ['calmmind']},
		]);

		assert.strictEqual(battle.turn, 1);
		p1.chooseMove(1).chooseMove(1, 1);
		p2.chooseMove(1).chooseMove(1);

		assert.strictEqual(battle.turn, 2);
		assert.statStage(p2.active[0], 'atk', -1);
		p1.chooseMove('recover').chooseMove('synthesis');
		p2.chooseMove('surf').chooseMove('calmmind');

		assert.strictEqual(battle.turn, 3);
		assert.fullHP(p1.active[1]);

		p1.chooseMove('recover').chooseMove('2');
		p2.chooseMove('1').chooseMove('calmmind');

		assert.strictEqual(battle.turn, 4);
		assert.fullHP(p1.active[1]);
	});

	it('should allow input of switch commands in a per Pokémon basis', function () {
		battle = common.createBattle({gameType: 'doubles'});
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: "Mew", ability: 'synchronize', moves: ['selfdestruct']},
			{species: "Bulbasaur", ability: 'overgrow', moves: ['selfdestruct']},
			{species: "Koffing", ability: 'levitate', moves: ['smog']},
			{species: "Ekans", ability: 'shedskin', moves: ['leer']},
		]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Deoxys-Defense", ability: 'pressure', moves: ['recover']},
			{species: "Arceus", ability: 'multitype', moves: ['recover']},
		]);

		assert.strictEqual(battle.turn, 1);
		p1.chooseMove('selfdestruct').chooseMove('selfdestruct');
		p2.chooseMove('recover').chooseMove('recover');

		assert.fainted(p1.active[0]);
		assert.fainted(p1.active[1]);
		p1.chooseSwitch(4).chooseSwitch(3);
		assert.strictEqual(battle.turn, 2);
		assert.strictEqual(p1.active[0].name, 'Ekans');
		assert.strictEqual(p1.active[1].name, 'Koffing');
	});

	it('should allow input of move and switch commands in a per Pokémon basis', function () {
		battle = common.createBattle({gameType: 'doubles'});
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: "Mew", ability: 'synchronize', moves: ['recover']},
			{species: "Bulbasaur", ability: 'overgrow', moves: ['growl', 'synthesis']},
			{species: "Koffing", ability: 'levitate', moves: ['smog']},
			{species: "Ekans", ability: 'shedskin', moves: ['leer']},
		]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Deoxys-Defense", ability: 'pressure', moves: ['recover']},
			{species: "Arceus", ability: 'multitype', moves: ['recover']},
		]);

		assert.strictEqual(battle.turn, 1);
		p1.chooseMove(1).chooseSwitch(4);
		assert(!p2.chooseSwitch(3));
		p2.chooseMove(1).chooseMove(1);

		assert.strictEqual(battle.turn, 2);
		assert.strictEqual(p1.active[0].name, 'Mew');
		assert.strictEqual(p1.active[1].name, 'Ekans');

		p1.chooseSwitch(4).chooseMove(1);
		assert(!p2.chooseSwitch(3));
		p2.chooseMove(1).chooseMove(1);

		assert.strictEqual(battle.turn, 3);
		assert.strictEqual(p1.active[0].name, 'Bulbasaur');
		assert.strictEqual(p1.active[1].name, 'Ekans');
	});

	it('should empty the decisions list when undoing a move', function () {
		battle = common.createBattle({gameType: 'doubles', cancel: true});
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: "Pineco", ability: 'sturdy', moves: ['selfdestruct']},
			{species: "Geodude", ability: 'sturdy', moves: ['selfdestruct']},
			{species: "Koffing", ability: 'levitate', moves: ['smog']},
		]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
			{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
		]);

		p1.chooseMove(1);
		assert(p1.choiceData.decisions.length > 0);
		battle.undoChoice('p1');
		assert.false(p1.choiceData.decisions.length > 0);
		p1.chooseDefault();
		p2.chooseDefault();

		assert.fainted(p1.active[0]);
		assert.fainted(p1.active[1]);
	});

	it('should empty the decisions list when undoing a switch', function () {
		battle = common.createBattle({gameType: 'doubles', cancel: true});
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: "Pineco", ability: 'sturdy', moves: ['selfdestruct']},
			{species: "Geodude", ability: 'sturdy', moves: ['selfdestruct']},
			{species: "Koffing", ability: 'levitate', moves: ['smog']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
			{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
		]);

		battle.commitDecisions();

		p1.chooseSwitch(3);
		assert(p1.choiceData.decisions.length > 0);
		battle.undoChoice('p1');
		assert.false(p1.choiceData.decisions.length > 0);
		p1.choosePass().chooseSwitch(3);

		assert.fainted(p1.active[0]);
		assert.species(p1.active[1], 'Koffing');
	});

	it('should empty the decisions list when undoing a pass', function () {
		battle = common.createBattle({gameType: 'doubles', cancel: true});
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: "Pineco", ability: 'sturdy', moves: ['selfdestruct']},
			{species: "Geodude", ability: 'sturdy', moves: ['selfdestruct']},
			{species: "Koffing", ability: 'levitate', moves: ['smog']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
			{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
		]);

		battle.commitDecisions();

		p1.choosePass();
		assert(p1.choiceData.decisions.length > 0);
		battle.undoChoice('p1');
		assert.false(p1.choiceData.decisions.length > 0);
		p1.choosePass().chooseSwitch(3);

		assert.fainted(p1.active[0]);
		assert.species(p1.active[1], 'Koffing');
	});

	it('should empty the decisions list when undoing a shift', function () {
		battle = common.createBattle({gameType: 'triples', cancel: true});
		battle.supportCancel = true;
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: "Pineco", ability: 'sturdy', moves: ['selfdestruct']},
			{species: "Geodude", ability: 'sturdy', moves: ['selfdestruct']},
			{species: "Gastly", ability: 'levitate', moves: ['lick']},
		]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
			{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
			{species: "Golem", ability: 'sturdy', moves: ['defensecurl']},
		]);

		p1.chooseShift();
		assert(p1.choiceData.decisions.length > 0);
		battle.undoChoice('p1');
		assert.false(p1.choiceData.decisions.length > 0);
		p1.chooseMove(1).chooseMove(1).chooseShift();
		p2.chooseDefault();

		assert.fainted(p1.active[0]);
		assert.fainted(p1.active[2]);
		assert.species(p1.active[1], 'Gastly');
		assert.false.fainted(p1.active[1]);
	});
});

