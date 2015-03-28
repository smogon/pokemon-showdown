var assert = require('assert');
var battle;

describe('Heavy Metal', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should double the weight of a Pokemon', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Simisear", ability: 'heavymetal', moves: ['nastyplot']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Simisage", ability: 'gluttony', moves: ['grassknot']}]);
		var basePower = 0;
		battle.runEvent = function (eventid, target, source, effect, relayVar, onEffect) {
			if (eventid === 'BasePower' && effect.id === 'grassknot') {
				basePower = relayVar;
			}
			return BattleEngine.Battle.prototype.runEvent.apply(this, arguments);
		};
		battle.commitDecisions();
		assert.strictEqual(basePower, 80);
	});

	it('should be negated by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Simisear", ability: 'heavymetal', moves: ['nastyplot']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Simisage", ability: 'moldbreaker', moves: ['grassknot']}]);
		var basePower = 0;
		battle.runEvent = function (eventid, target, source, effect, relayVar, onEffect) {
			if (eventid === 'BasePower' && effect.id === 'grassknot') {
				basePower = relayVar;
			}
			return BattleEngine.Battle.prototype.runEvent.apply(this, arguments);
		};
		battle.commitDecisions();
		assert.strictEqual(basePower, 60);
	});
});

describe('Light Metal', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should halve the weight of a Pokemon', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Registeel", ability: 'lightmetal', moves: ['curse']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Simisage", ability: 'gluttony', moves: ['grassknot']}]);
		var basePower = 0;
		battle.runEvent = function (eventid, target, source, effect, relayVar, onEffect) {
			if (eventid === 'BasePower' && effect.id === 'grassknot') {
				basePower = relayVar;
			}
			return BattleEngine.Battle.prototype.runEvent.apply(this, arguments);
		};
		battle.commitDecisions();
		assert.strictEqual(basePower, 100);
	});

	it('should be negated by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Registeel", ability: 'lightmetal', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Simisage", ability: 'moldbreaker', moves: ['grassknot']}]);
		var basePower = 0;
		battle.runEvent = function (eventid, target, source, effect, relayVar, onEffect) {
			if (eventid === 'BasePower' && effect.id === 'grassknot') {
				basePower = relayVar;
			}
			return BattleEngine.Battle.prototype.runEvent.apply(this, arguments);
		};
		battle.commitDecisions();
		assert.strictEqual(basePower, 120);
	});
});

describe('Float Stone', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should halve the weight of a Pokemon', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Registeel", ability: 'clearbody', item: 'floatstone', moves: ['curse']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Simisage", ability: 'gluttony', moves: ['grassknot']}]);
		var basePower = 0;
		battle.runEvent = function (eventid, target, source, effect, relayVar, onEffect) {
			if (eventid === 'BasePower' && effect.id === 'grassknot') {
				basePower = relayVar;
			}
			return BattleEngine.Battle.prototype.runEvent.apply(this, arguments);
		};
		battle.commitDecisions();
		assert.strictEqual(basePower, 100);
	});
});

describe('Autotomize', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should reduce the weight of a Pokemon by 100 kg with each use', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Registeel", ability: 'clearbody', moves: ['autotomize']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Simisage", ability: 'gluttony', item: 'laggingtail', moves: ['grassknot']}]);
		var basePower = 0;
		battle.runEvent = function (eventid, target, source, effect, relayVar, onEffect) {
			if (eventid === 'BasePower' && effect.id === 'grassknot') {
				basePower = relayVar;
			}
			return BattleEngine.Battle.prototype.runEvent.apply(this, arguments);
		};
		battle.commitDecisions();
		assert.strictEqual(basePower, 100);
		battle.commitDecisions();
		assert.strictEqual(basePower, 20);
	});

	it('should factor into weight before Heavy Metal does', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Lairon", ability: 'heavymetal', moves: ['autotomize']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Simisage", ability: 'gluttony', item: 'laggingtail', moves: ['grassknot']}]);
		var basePower = 0;
		battle.runEvent = function (eventid, target, source, effect, relayVar, onEffect) {
			if (eventid === 'BasePower' && effect.id === 'grassknot') {
				basePower = relayVar;
			}
			return BattleEngine.Battle.prototype.runEvent.apply(this, arguments);
		};
		battle.commitDecisions();
		assert.strictEqual(basePower, 60);
	});
});
