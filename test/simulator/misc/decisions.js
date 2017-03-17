'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

const BASE_TEAM_ORDER = [1, 2, 3, 4, 5, 6];

const SINGLES_TEAMS = {
	illusion: [[
		{species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle']},
		{species: 'Ivysaur', ability: 'overgrow', moves: ['tackle']},
		{species: 'Venusaur', ability: 'overgrow', moves: ['tackle']},
		{species: 'Charmander', ability: 'blaze', moves: ['tackle']},
		{species: 'Charmeleon', ability: 'blaze', moves: ['tackle']},
		{species: 'Zoroark', ability: 'illusion', moves: ['tackle']},
	], [
		{species: 'Squirtle', ability: 'torrent', moves: ['tackle']},
		{species: 'Wartortle', ability: 'torrent', moves: ['tackle']},
	]],
	full: [[
		{species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle']},
		{species: 'Ivysaur', ability: 'overgrow', moves: ['tackle']},
		{species: 'Venusaur', ability: 'overgrow', moves: ['tackle']},
		{species: 'Charmander', ability: 'blaze', moves: ['tackle']},
		{species: 'Charmeleon', ability: 'blaze', moves: ['tackle']},
		{species: 'Charizard', ability: 'blaze', moves: ['tackle']},
	], [
		{species: 'Squirtle', ability: 'torrent', moves: ['tackle']},
		{species: 'Wartortle', ability: 'torrent', moves: ['tackle']},
	]],
};

const DOUBLES_TEAMS = {
	forcePass: [[
		{species: 'Bulbasaur', ability: 'overgrow', moves: ['lunardance']},
		{species: 'Clefable', ability: 'unaware', moves: ['healingwish']},
		{species: 'Latias', ability: 'levitate', moves: ['roost']},
	], [
		{species: 'Charmander', ability: 'blaze', moves: ['scratch']},
		{species: 'Clefable', ability: 'unaware', moves: ['recover']},
	]],
	full: [[
		{species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle']},
		{species: 'Ivysaur', ability: 'overgrow', moves: ['tackle']},
		{species: 'Venusaur', ability: 'overgrow', moves: ['tackle']},
		{species: 'Charmander', ability: 'blaze', moves: ['tackle']},
		{species: 'Charmeleon', ability: 'blaze', moves: ['tackle']},
		{species: 'Charizard', ability: 'blaze', moves: ['tackle']},
	], [
		{species: 'Squirtle', ability: 'torrent', moves: ['tackle']},
		{species: 'Wartortle', ability: 'torrent', moves: ['tackle']},
	]],
	default: [[
		{species: 'Latias', ability: 'overgrow', moves: ['lunardance']},
		{species: 'Clefable', ability: 'unaware', moves: ['healingwish']},
		{species: 'Bulbasaur', ability: 'levitate', moves: ['synthesis']},
		{species: 'Venusaur', ability: 'overgrow', moves: ['tackle']},
	], [
		{species: 'Charmander', ability: 'blaze', moves: ['scratch']},
		{species: 'Clefable', ability: 'unaware', moves: ['recover']},
	]],
};

const TRIPLES_TEAMS = {
	forcePass: [[
		{species: 'Bulbasaur', ability: 'overgrow', moves: ['synthesis']},
		{species: 'Clefable', ability: 'unaware', moves: ['healingwish']},
		{species: 'Latias', ability: 'levitate', moves: ['lunardance']},
		{species: 'Venusaur', ability: 'overgrow', moves: ['synthesis']},
	], [
		{species: 'Charmander', ability: 'blaze', moves: ['scratch']},
		{species: 'Clefable', ability: 'unaware', moves: ['recover']},
		{species: 'Latias', ability: 'blaze', moves: ['roost']},
	]],
	full: [[
		{species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle']},
		{species: 'Ivysaur', ability: 'overgrow', moves: ['tackle']},
		{species: 'Venusaur', ability: 'overgrow', moves: ['tackle']},
		{species: 'Charmander', ability: 'blaze', moves: ['tackle']},
		{species: 'Charmeleon', ability: 'blaze', moves: ['tackle']},
		{species: 'Charizard', ability: 'blaze', moves: ['tackle']},
	], [
		{species: 'Squirtle', ability: 'torrent', moves: ['tackle']},
		{species: 'Wartortle', ability: 'torrent', moves: ['tackle']},
		{species: 'Blastoise', ability: 'torrent', moves: ['tackle']},
	]],
	default: [[
		{species: 'Bulbasaur', ability: 'overgrow', moves: ['synthesis']},
		{species: 'Clefable', ability: 'unaware', moves: ['healingwish']},
		{species: 'Latias', ability: 'levitate', moves: ['roost']},
		{species: 'Venusaur', ability: 'overgrow', moves: ['synthesis']},
	], [
		{species: 'Charmander', ability: 'blaze', moves: ['scratch']},
		{species: 'Clefable', ability: 'unaware', moves: ['recover']},
		{species: 'Latias', ability: 'blaze', moves: ['roost']},
	]],
};

let battle;

describe('Decisions', function () {
	afterEach(function () {
		battle.destroy();
	});

	describe('Generic', function () {
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
	});

	describe('Move requests', function () {
		it('should allow specifying moves', function () {
			const MOVES = [['growl', 'tackle'], ['growl', 'scratch']];
			battle = common.createBattle([
				[{species: "Bulbasaur", ability: 'Overgrow', moves: MOVES[0]}],
				[{species: "Charmander", ability: 'Blaze', moves: MOVES[1]}],
			]);

			const activeMons = battle.sides.map(side => side.active[0]);
			for (let i = 0; i < 2; i++) {
				for (let j = 0; j < 2; j++) {
					const beforeHP = activeMons.map(pokemon => pokemon.hp);
					const beforeAtk = activeMons.map(pokemon => pokemon.boosts.atk);
					battle.p1.chooseMove(i + 1);
					battle.p2.chooseMove(j + 1);
					assert.strictEqual(activeMons[0].lastMove, MOVES[0][i]);
					assert.strictEqual(activeMons[1].lastMove, MOVES[1][j]);

					if (i >= 1) { // p1 used a damaging move
						assert.atMost(activeMons[1].hp, beforeHP[1] - 1);
						assert.statStage(activeMons[1], beforeAtk[1]);
					} else {
						assert.strictEqual(activeMons[1].hp, beforeHP[1]);
						assert.statStage(activeMons[1], beforeAtk[1] - 1);
					}
					if (j >= 1) { // p2 used a damaging move
						assert.atMost(activeMons[0].hp, beforeHP[0] - 1);
						assert.statStage(activeMons[0], beforeAtk[0]);
					} else {
						assert.strictEqual(activeMons[0].hp, beforeHP[0]);
						assert.statStage(activeMons[0], beforeAtk[0] - 1);
					}
				}
			}
		});

		it('should allow specifying move targets', function () {
			battle = common.createBattle({gameType: 'doubles'}, [
				[{species: "Gastrodon", ability: 'stickyhold', moves: ['gastroacid']}, {species: "Venusaur", ability: 'thickfat', moves: ['leechseed']}],
				[{species: "Tyranitar", ability: 'unnerve', moves: ['knockoff']}, {species: "Zapdos", ability: 'pressure', moves: ['thunderwave']}],
			]);
			const p2active = battle.p2.active;

			battle.p1.chooseMove(1, 1).chooseMove(1, 2);
			battle.p2.chooseMove(1, -2).chooseMove(1, -1);
			assert.strictEqual(battle.turn, 2);

			assert(p2active[0].volatiles['gastroacid']);
			assert(p2active[1].volatiles['leechseed']);
			assert.false.holdsItem(p2active[1]);
			assert.strictEqual(p2active[0].status, 'par');
		});

		it('should disallow specifying move targets for targetless moves (randomNormal)', function () {
			battle = common.createBattle({gameType: 'doubles'}, [
				[{species: "Dragonite", ability: 'multiscale', moves: ['outrage']}, {species: "Blastoise", ability: 'torrent', moves: ['rest']}],
				[{species: "Tyranitar", ability: 'unnerve', moves: ['dragondance']}, {species: "Zapdos", ability: 'pressure', moves: ['roost']}],
			]);

			battle.p1.chooseMove('outrage', 1);
			battle.p1.chooseMove('rest');
			battle.p2.chooseMove('dragondance');
			battle.p2.chooseMove('roost');

			assert.notStrictEqual(battle.turn, 2);
		});

		it('should disallow specifying move targets for targetless moves (scripted)', function () {
			battle = common.createBattle({gameType: 'doubles'}, [
				[{species: "Dragonite", ability: 'multiscale', moves: ['counter']}, {species: "Blastoise", ability: 'torrent', moves: ['rest']}],
				[{species: "Tyranitar", ability: 'unnerve', moves: ['bodyslam']}, {species: "Zapdos", ability: 'pressure', moves: ['drillpeck']}],
			]);

			battle.p1.chooseMove('counter', 2);
			battle.p1.chooseMove('rest');
			battle.p2.chooseMove('bodyslam', 1);
			battle.p2.chooseMove('drillpeck', 1);

			assert.notStrictEqual(battle.turn, 2);
		});

		it('should disallow specifying move targets for targetless moves (self)', function () {
			battle = common.createBattle({gameType: 'doubles'}, [
				[{species: "Dragonite", ability: 'multiscale', moves: ['roost']}, {species: "Blastoise", ability: 'torrent', moves: ['rest']}],
				[{species: "Tyranitar", ability: 'unnerve', moves: ['dragondance']}, {species: "Zapdos", ability: 'pressure', moves: ['roost']}],
			]);

			battle.p1.chooseMove('roost', -2);
			battle.p1.chooseMove('rest');
			battle.p2.chooseMove('dragondance');
			battle.p2.chooseMove('roost');

			assert.notStrictEqual(battle.turn, 2);
		});

		it('should allow specifying switch targets', function () {
			battle = common.createBattle([[
				{species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle']},
				{species: 'Ivysaur', ability: 'overgrow', moves: ['tackle']},
				{species: 'Venusaur', ability: 'overgrow', moves: ['tackle']},
			], [
				{species: 'Charmander', ability: 'blaze', moves: ['scratch']},
				{species: 'Charmeleon', ability: 'blaze', moves: ['scratch']},
				{species: 'Charizard', ability: 'blaze', moves: ['scratch']},
			]]);

			battle.p1.chooseSwitch(2);
			battle.p2.chooseSwitch(3);

			assert.species(battle.p1.active[0], 'Ivysaur');
			assert.species(battle.p2.active[0], 'Charizard');

			battle.p1.chooseSwitch(3);
			battle.p2.chooseSwitch(3);

			assert.species(battle.p1.active[0], 'Venusaur');
			assert.species(battle.p2.active[0], 'Charmander');

			battle.p1.chooseSwitch(2);
			battle.p2.chooseSwitch(2);

			assert.species(battle.p1.active[0], 'Bulbasaur');
			assert.species(battle.p2.active[0], 'Charmeleon');
		});

		it('should allow shifting the Pokémon on the left to the center', function () {
			battle = common.createBattle({gameType: 'triples'});
			const p1 = battle.join('p1', 'Guest 1', 1, [
				{species: "Pineco", ability: 'sturdy', moves: ['harden']},
				{species: "Geodude", ability: 'sturdy', moves: ['defensecurl']},
				{species: "Gastly", ability: 'levitate', moves: ['spite']},
			]);
			const p2 = battle.join('p2', 'Guest 2', 1, [
				{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
				{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
				{species: "Golem", ability: 'sturdy', moves: ['defensecurl']},
			]);
			p1.chooseMove(1).chooseMove(1).chooseShift();
			p2.chooseMove(1).chooseMove(1).chooseShift();

			['Pineco', 'Gastly', 'Geodude'].forEach((species, index) => assert.species(battle.p1.active[index], species));
			['Skarmory', 'Golem', 'Aggron'].forEach((species, index) => assert.species(battle.p2.active[index], species));
		});

		it('should allow shifting the Pokémon on the right to the center', function () {
			battle = common.createBattle({gameType: 'triples'});
			const p1 = battle.join('p1', 'Guest 1', 1, [
				{species: "Pineco", ability: 'sturdy', moves: ['harden']},
				{species: "Geodude", ability: 'sturdy', moves: ['defensecurl']},
				{species: "Gastly", ability: 'levitate', moves: ['spite']},
			]);
			const p2 = battle.join('p2', 'Guest 2', 1, [
				{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
				{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
				{species: "Golem", ability: 'sturdy', moves: ['defensecurl']},
			]);
			p1.chooseShift();
			p2.chooseShift();
			battle.commitDecisions();

			['Geodude', 'Pineco', 'Gastly'].forEach((species, index) => assert.species(battle.p1.active[index], species));
			['Aggron', 'Skarmory', 'Golem'].forEach((species, index) => assert.species(battle.p2.active[index], species));
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

			battle.p1.chooseMove(1);
			battle.p2.chooseMove(2);

			assert.strictEqual(battle.turn, 2);
			assert.notStrictEqual(battle.p2.active[0].lastMove, 'struggle');
		});

		it('should not force Struggle usage on move attempt when choosing a disabled move', function () {
			battle = common.createBattle();
			battle.join('p1', 'Guest 1', 1, [{species: "Mew", item: 'assaultvest', ability: 'synchronize', moves: ['recover', 'icebeam']}]);
			battle.join('p2', 'Guest 2', 1, [{species: "Rhydon", item: '', ability: 'prankster', moves: ['struggle', 'surf']}]);
			const failingAttacker = battle.p1.active[0];
			battle.p2.chooseMove(2);

			battle.p1.chooseMove(1);
			assert.strictEqual(battle.turn, 1);
			assert.notStrictEqual(failingAttacker.lastMove, 'struggle');

			battle.p1.chooseMove('recover');
			assert.strictEqual(battle.turn, 1);
			assert.notStrictEqual(failingAttacker.lastMove, 'struggle');
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
			battle.p1.chooseMove(1);
			assert(buffer.length >= 1);
			assert(buffer.some(message => {
				return message.startsWith('p1\n') && /\bcant\b/.test(message) && (/\|0\b/.test(message) || /\|p1a\b/.test(message));
			}));
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
			battle.p1.chooseSwitch(2);
			assert(buffer.length >= 1);
			assert(buffer.some(message => {
				return message.startsWith('p1\n') && /\btrapped\b/.test(message) && (/\|0\b/.test(message) || /\|p1a\b/.test(message));
			}));
		});
	});

	describe('Switch requests', function () {
		it('should allow specifying switch targets', function () {
			battle = common.createBattle([[
				{species: 'Latias', ability: 'levitate', moves: ['lunardance']},
				{species: 'Ivysaur', ability: 'overgrow', moves: ['tackle']},
				{species: 'Venusaur', ability: 'overgrow', moves: ['tackle']},
			], [
				{species: 'Latias', ability: 'blaze', moves: ['lunardance']},
				{species: 'Charmeleon', ability: 'blaze', moves: ['scratch']},
				{species: 'Charizard', ability: 'blaze', moves: ['scratch']},
			]]);

			battle.commitDecisions();
			battle.p1.chooseSwitch(2);
			battle.p2.chooseSwitch(3);

			assert.species(battle.p1.active[0], 'Ivysaur');
			assert.species(battle.p2.active[0], 'Charizard');
		});

		it('should allow passing when there are not enough available switch-ins', function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'Latias', ability: 'levitate', moves: ['lunardance']},
				{species: 'Ivysaur', ability: 'overgrow', moves: ['lunardance']},
				{species: 'Venusaur', ability: 'overgrow', moves: ['tackle']},
			], [
				{species: 'Latias', ability: 'blaze', moves: ['lunardance']},
				{species: 'Charmeleon', ability: 'blaze', moves: ['lunardance']},
				{species: 'Charizard', ability: 'blaze', moves: ['scratch']},
			]]);

			battle.commitDecisions();
			battle.sides.forEach(side => side.active.forEach(pokemon => assert.fainted(pokemon)));

			battle.p1.choosePass();
			battle.p1.chooseSwitch(3);
			battle.p2.chooseSwitch(3);
			battle.p2.choosePass();

			['Latias', 'Venusaur'].forEach((species, index) => assert.species(battle.p1.active[index], species));
			['Charizard', 'Charmeleon'].forEach((species, index) => assert.species(battle.p2.active[index], species));

			assert.fainted(battle.p1.active[0]);
			assert.fainted(battle.p2.active[1]);
		});

		it('should allow passing when there are not enough available switch-ins even if an active Pokémon is not fainted', function () {
			battle = common.createBattle({gameType: 'triples'}, [[
				{species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle']},
				{species: 'Clefable', ability: 'unaware', moves: ['healingwish']},
				{species: 'Latias', ability: 'levitate', moves: ['lunardance']},
				{species: 'Venusaur', ability: 'overgrow', moves: ['tackle']},
			], [
				{species: 'Charmander', ability: 'blaze', moves: ['scratch']},
				{species: 'Clefable', ability: 'unaware', moves: ['healingwish']},
				{species: 'Latias', ability: 'blaze', moves: ['lunardance']},
				{species: 'Charizard', ability: 'blaze', moves: ['scratch']},
			]]);

			battle.commitDecisions();
			assert.sets(() => battle.turn, battle.turn + 1, () => {
				battle.p1.choosePass();
				battle.p1.choosePass();
				battle.p1.chooseSwitch(4);
				battle.p2.choosePass();
				battle.p2.chooseSwitch(4);
				battle.p2.choosePass();
			}, "The turn should be resolved");

			['Bulbasaur', 'Clefable', 'Venusaur'].forEach((species, index) => assert.species(battle.p1.active[index], species));
			['Charmander', 'Charizard', 'Latias'].forEach((species, index) => assert.species(battle.p2.active[index], species));
		});

		it('should disallow passing when there are enough available switch-ins', function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: 'Latias', ability: 'levitate', moves: ['lunardance']},
				{species: 'Bulbasaur', ability: 'overgrow', moves: ['lunardance']},
				{species: 'Ivysaur', ability: 'overgrow', moves: ['tackle']},
				{species: 'Venusaur', ability: 'overgrow', moves: ['tackle']},
			], [
				{species: 'Latias', ability: 'blaze', moves: ['lunardance']},
				{species: 'Charmander', ability: 'blaze', moves: ['lunardance']},
				{species: 'Charmeleon', ability: 'blaze', moves: ['scratch']},
				{species: 'Charizard', ability: 'blaze', moves: ['scratch']},
			]]);

			battle.commitDecisions();
			battle.sides.forEach(side => side.active.forEach(pokemon => assert.fainted(pokemon)));

			assert.constant(() => battle.turn, () => {
				battle.p1.choosePass();
				battle.p1.chooseSwitch(3);
				battle.p2.chooseSwitch(3);
				battle.p2.choosePass();
			});

			battle.sides.forEach(side => side.active.forEach(pokemon => assert.fainted(pokemon)));
		});
	});

	describe('Team Preview requests', function () {
		it('should allow specifying the team order', function () {
			const TEAMS = [[
				{species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle']},
				{species: 'Clefable', ability: 'unaware', moves: ['healingwish']},
				{species: 'Latias', ability: 'levitate', moves: ['lunardance']},
				{species: 'Venusaur', ability: 'overgrow', moves: ['tackle']},
			], [
				{species: 'Charmander', ability: 'blaze', moves: ['scratch']},
				{species: 'Clefable', ability: 'unaware', moves: ['healingwish']},
				{species: 'Latias', ability: 'blaze', moves: ['lunardance']},
				{species: 'Charizard', ability: 'blaze', moves: ['scratch']},
			]];

			for (let i = 0; i < 10; i++) {
				const teamOrder = [BASE_TEAM_ORDER, BASE_TEAM_ORDER].map(teamOrder => Tools.shuffle(teamOrder.slice(0, 4)));
				battle = common.createBattle({preview: true}, TEAMS);
				battle.p1.chooseTeam(teamOrder[0].join(''));
				battle.p2.chooseTeam(teamOrder[1].join(''));
				battle.p1.pokemon.forEach((pokemon, index) => assert.species(pokemon, TEAMS[0][teamOrder[0][index] - 1].species));
				battle.p2.pokemon.forEach((pokemon, index) => assert.species(pokemon, TEAMS[1][teamOrder[1][index] - 1].species));

				if (i < 9) battle.destroy();
			}
		});

		it('should autocomplete a single-slot decision in Singles for no Illusion', function () {
			// Backwards-compatibility with the client. It should be useful for 3rd party bots/clients (Android?)
			for (let i = 0; i < 5; i++) {
				battle = common.createBattle({preview: true}, SINGLES_TEAMS.full);
				const teamOrder = Tools.shuffle(BASE_TEAM_ORDER.slice()).slice(0, 1);
				const fullTeamOrder = teamOrder.concat(BASE_TEAM_ORDER.filter(elem => !teamOrder.includes(elem)));

				battle.choose('p1', 'team ' + teamOrder.join(''));
				battle.p2.chooseDefault();

				fullTeamOrder.forEach((oSlot, index) => assert.species(battle.p1.pokemon[index], SINGLES_TEAMS.full[0][oSlot - 1].species));

				if (i < 4) battle.destroy();
			}
		});

		it('should allow specifying the team order in a slot-per-slot basis in Singles with Illusion', function () {
			for (let i = 0; i < 5; i++) {
				battle = common.createBattle({preview: true}, SINGLES_TEAMS.illusion);
				const teamOrder = Tools.shuffle(BASE_TEAM_ORDER.slice());

				battle.choose('p1', 'team ' + teamOrder.join(''));
				battle.p2.chooseDefault();

				teamOrder.forEach((oSlot, index) => assert.species(battle.p1.pokemon[index], SINGLES_TEAMS.illusion[0][oSlot - 1].species));

				if (i < 4) battle.destroy();
			}
		});

		it('should allow specifying the team order in a slot-per-slot basis in Doubles', function () {
			for (let i = 0; i < 5; i++) {
				battle = common.createBattle({preview: true, gameType: 'doubles'}, DOUBLES_TEAMS.full);
				const teamOrder = Tools.shuffle(BASE_TEAM_ORDER.slice());

				battle.choose('p1', 'team ' + teamOrder.join(''));
				battle.p2.chooseDefault();

				teamOrder.forEach((oSlot, index) => assert.species(battle.p1.pokemon[index], DOUBLES_TEAMS.full[0][oSlot - 1].species));

				if (i < 4) battle.destroy();
			}
		});

		it('should allow specifying the team order in a slot-per-slot basis in Triples', function () {
			for (let i = 0; i < 5; i++) {
				battle = common.createBattle({preview: true, gameType: 'triples'}, TRIPLES_TEAMS.full);
				const teamOrder = Tools.shuffle(BASE_TEAM_ORDER.slice());

				battle.choose('p1', 'team ' + teamOrder.join(''));
				battle.p2.chooseDefault();

				teamOrder.forEach((oSlot, index) => assert.species(battle.p1.pokemon[index], TRIPLES_TEAMS.full[0][oSlot - 1].species));

				if (i < 4) battle.destroy();
			}
		});

		it('should autocomplete multi-slot decisions', function () {
			for (let i = 0; i < 5; i++) {
				battle = common.createBattle({preview: true}, SINGLES_TEAMS.full);
				const teamOrder = Tools.shuffle(BASE_TEAM_ORDER.slice()).slice(0, 2);
				const fullTeamOrder = teamOrder.concat(BASE_TEAM_ORDER.filter(elem => !teamOrder.includes(elem)));

				battle.choose('p1', 'team ' + teamOrder.slice(0, 2).join(''));
				battle.p2.chooseDefault();

				fullTeamOrder.forEach((oSlot, index) => assert.species(battle.p1.pokemon[index], SINGLES_TEAMS.full[0][oSlot - 1].species));

				if (i < 4) battle.destroy();
			}
		});
	});

	describe('Logging', function () {
		it('should privately log the ID of chosen moves', function () {
			battle = common.createBattle([
				[{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']}],
				[{species: "Charmander", ability: 'blaze', moves: ['scratch', 'growl']}],
			]);
			battle.p1.chooseMove(1);
			battle.p2.chooseMove('growl');

			const logText = battle.log.join('\n');
			const logs = ['|choice||', '|choice|move tackle|', '|choice||move growl', '|choice|move tackle|move growl'];
			const subString = '|split\n' + logs.join('\n');
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should privately log the target of targetted chosen moves', function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle']},
				{species: "Ivysaur", ability: 'overgrow', moves: ['tackle']},
			], [
				{species: "Charmander", ability: 'blaze', moves: ['scratch']},
				{species: "Charizard", ability: 'blaze', moves: ['scratch']},
			]]);
			battle.p1.chooseMove(1, 1).chooseMove(1, 2);
			battle.p2.chooseMove(1, 2).chooseMove(1, 1);

			const logText = battle.log.join('\n');
			const logs = ['|choice||', '|choice|move tackle 1, move tackle 2|', '|choice||move scratch 2, move scratch 1', '|choice|move tackle 1, move tackle 2|move scratch 2, move scratch 1'];
			const subString = '|split\n' + logs.join('\n');
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should not log the target of targetless chosen moves', function () {
			battle = common.createBattle({gameType: 'doubles'}, [[
				{species: "Bulbasaur", ability: 'overgrow', moves: ['magnitude']},
				{species: "Ivysaur", ability: 'overgrow', moves: ['rockslide']},
			], [
				{species: "Charmander", ability: 'blaze', moves: ['scratch']},
				{species: "Charizard", ability: 'blaze', moves: ['scratch']},
			]]);
			battle.p1.chooseMove(1).chooseMove(1);
			battle.p2.chooseMove(1, 1).chooseMove(1, 1);

			const logText = battle.log.join('\n');
			const logs = ['|choice||', '|choice|move magnitude, move rockslide|', '|choice||move scratch 1, move scratch 1', '|choice|move magnitude, move rockslide|move scratch 1, move scratch 1'];
			const subString = '|split\n' + logs.join('\n');
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should privately log the user intention of mega evolving', function () {
			battle = common.createBattle([
				[{species: "Venusaur", item: 'venusaurite', ability: 'overgrow', moves: ['tackle']}],
				[{species: "Blastoise", item: 'blastoisinite', ability: 'blaze', moves: ['tailwhip']}],
			]);
			battle.p1.chooseMove(1, null, true);
			battle.p2.chooseMove(1, null, true);

			const logText = battle.log.join('\n');
			const logs = ['|choice||', '|choice|move tackle mega|', '|choice||move tailwhip mega', '|choice|move tackle mega|move tailwhip mega'];
			const subString = '|split\n' + logs.join('\n');
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should privately log the user intention of mega evolving for Mega-X and Mega-Y', function () {
			battle = common.createBattle([
				[{species: "Charizard", item: 'charizarditex', ability: 'blaze', moves: ['scratch']}],
				[{species: "Charizard", item: 'charizarditey', ability: 'blaze', moves: ['ember']}],
			]);
			battle.p1.chooseMove(1, null, true);
			battle.p2.chooseMove(1, null, true);

			const logText = battle.log.join('\n');
			const logs = ['|choice||', '|choice|move scratch mega|', '|choice||move ember mega', '|choice|move scratch mega|move ember mega'];
			const subString = '|split\n' + logs.join('\n');
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should privately log the target of switches', function () {
			battle = common.createBattle([[
				{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle']},
				{species: "Ivysaur", ability: 'overgrow', moves: ['tackle']},
				{species: "Venusaur", ability: 'overgrow', moves: ['tackle']},
			], [
				{species: "Charmander", ability: 'blaze', moves: ['scratch']},
				{species: "Charmeleon", ability: 'blaze', moves: ['scratch']},
				{species: "Charizard", ability: 'blaze', moves: ['scratch']},
			]]);

			battle.p1.chooseSwitch(2);
			battle.p2.chooseSwitch(3);

			const logText = battle.log.join('\n');
			const logs = ['|choice||', '|choice|switch 2|', '|choice||switch 3', '|choice|switch 2|switch 3'];
			const subString = '|split\n' + logs.join('\n');
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should privately log the team order chosen', function () {
			battle = common.createBattle({preview: true}, [[
				{species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle']},
				{species: 'Clefable', ability: 'unaware', moves: ['healingwish']},
				{species: 'Latias', ability: 'levitate', moves: ['lunardance']},
				{species: 'Venusaur', ability: 'overgrow', moves: ['tackle']},
			], [
				{species: 'Charmander', ability: 'blaze', moves: ['scratch']},
				{species: 'Clefable', ability: 'unaware', moves: ['healingwish']},
				{species: 'Latias', ability: 'blaze', moves: ['lunardance']},
				{species: 'Charizard', ability: 'blaze', moves: ['scratch']},
			]]);

			battle.p1.chooseTeam('1342');
			battle.p2.chooseTeam('1234');

			const logText = battle.log.join('\n');
			const logs = ['|choice||', '|choice|team 1, team 3, team 4, team 2|', '|choice||team 1, team 2, team 3, team 4', '|choice|team 1, team 3, team 4, team 2|team 1, team 2, team 3, team 4'];
			const subString = '|split\n' + logs.join('\n');
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should privately log shifting decisions for the Pokémon on the left', function () {
			battle = common.createBattle({gameType: 'triples'});
			const p1 = battle.join('p1', 'Guest 1', 1, [
				{species: "Pineco", ability: 'sturdy', moves: ['harden']},
				{species: "Geodude", ability: 'sturdy', moves: ['defensecurl']},
				{species: "Gastly", ability: 'levitate', moves: ['haze']},
			]);
			const p2 = battle.join('p2', 'Guest 2', 1, [
				{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
				{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
				{species: "Golem", ability: 'sturdy', moves: ['defensecurl']},
			]);
			p1.chooseShift().chooseMove(1).chooseMove(1);
			p2.chooseMove(1).chooseMove(1).chooseMove(1);

			const logText = battle.log.join('\n');
			const logs = ['|choice||', '|choice|shift, move defensecurl, move haze|', '|choice||move roost, move irondefense, move defensecurl', '|choice|shift, move defensecurl, move haze|move roost, move irondefense, move defensecurl'];
			const subString = '|split\n' + logs.join('\n');
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should privately log shifting decisions for the Pokémon on the right', function () {
			battle = common.createBattle({gameType: 'triples'});
			const p1 = battle.join('p1', 'Guest 1', 1, [
				{species: "Pineco", ability: 'sturdy', moves: ['harden']},
				{species: "Geodude", ability: 'sturdy', moves: ['defensecurl']},
				{species: "Gastly", ability: 'levitate', moves: ['haze']},
			]);
			const p2 = battle.join('p2', 'Guest 2', 1, [
				{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
				{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
				{species: "Golem", ability: 'sturdy', moves: ['defensecurl']},
			]);
			p1.chooseMove(1).chooseMove(1).chooseShift();
			p2.chooseMove(1).chooseMove(1).chooseMove(1);

			const logText = battle.log.join('\n');
			const logs = ['|choice||', '|choice|move harden, move defensecurl, shift|', '|choice||move roost, move irondefense, move defensecurl', '|choice|move harden, move defensecurl, shift|move roost, move irondefense, move defensecurl'];
			const subString = '|split\n' + logs.join('\n');
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});
	});
});

describe('Decision extensions', function () {
	describe('Undo', function () {
		const MODES = ['revoke', 'override'];
		for (const mode of MODES) {
			it(`should disallow to ${mode} decisions after every player has sent an unrevoked decision`, function () {
				battle = common.createBattle({cancel: true});
				battle.join('p1', 'Guest 1', 1, [{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']}]);
				battle.join('p2', 'Guest 2', 1, [{species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl']}]);

				battle.choose('p1', 'move tackle');
				battle.choose('p2', 'move growl');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'move growl');

				assert.strictEqual(battle.turn, 2);
				assert.strictEqual(battle.p1.active[0].lastMove, 'tackle');
				assert.strictEqual(battle.p2.active[0].lastMove, 'growl');
			});

			it(`should support to ${mode} move decisions`, function () {
				battle = common.createBattle({cancel: true});
				battle.join('p1', 'Guest 1', 1, [{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']}]);
				battle.join('p2', 'Guest 2', 1, [{species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl']}]);

				battle.choose('p1', 'move tackle');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'move growl');
				battle.choose('p2', 'move growl');

				assert.strictEqual(battle.turn, 2);
				assert.strictEqual(battle.p1.active[0].lastMove, 'growl');
			});

			it(`should disallow to ${mode} move decisions for maybe-disabled Pokémon`, function () {
				battle = common.createBattle({cancel: true});
				battle.join('p1', 'Guest 1', 1, [{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl', 'synthesis']}]);
				battle.join('p2', 'Guest 2', 1, [{species: "Charmander", ability: 'blaze', moves: ['scratch']}]);

				const target = battle.p1.active[0];
				target.maybeDisabled = true;
				battle.makeRequest();

				battle.choose('p1', 'move tackle');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'move growl');
				battle.choose('p2', 'move scratch');

				assert.strictEqual(target.lastMove, 'tackle');
			});

			it(`should disallow to ${mode} move decisions by default`, function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']}]);
				battle.join('p2', 'Guest 2', 1, [{species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl']}]);

				battle.choose('p1', 'move tackle');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'move growl');
				battle.choose('p2', 'move growl');

				assert.strictEqual(battle.turn, 2);
				assert.strictEqual(battle.p1.active[0].lastMove, 'tackle');
				assert.strictEqual(battle.p2.active[0].lastMove, 'growl');
			});

			it(`should support to ${mode} switch decisions on move requests`, function () {
				const TEAMS = [[
					{species: 'Bulbasaur', ability: 'overgrow', moves: ['synthesis']},
					{species: 'Ivysaur', ability: 'overgrow', moves: ['synthesis']},
					{species: 'Venusaur', ability: 'overgrow', moves: ['synthesis']},
				], [
					{species: 'Charmander', ability: 'blaze', moves: ['scratch']},
				]];
				battle = common.createBattle({cancel: true}, TEAMS);

				battle.choose('p1', 'switch 2');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'move 1');
				battle.choose('p2', 'move 1');

				['Bulbasaur', 'Ivysaur', 'Venusaur'].forEach((species, index) => assert.species(battle.p1.pokemon[index], species));
				assert.strictEqual(battle.p1.active[0].lastMove, 'synthesis');

				battle.destroy();
				battle = common.createBattle({cancel: true}, TEAMS);

				battle.choose('p1', 'switch 2');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'switch 3');
				battle.choose('p2', 'move 1');

				['Venusaur', 'Ivysaur', 'Bulbasaur'].forEach((species, index) => assert.species(battle.p1.pokemon[index], species));
			});

			it(`should disallow to ${mode} switch decisions on move requests for maybe-trapped Pokémon`, function () {
				const TEAMS = [[
					{species: 'Bulbasaur', ability: 'overgrow', moves: ['synthesis']},
					{species: 'Ivysaur', ability: 'overgrow', moves: ['synthesis']},
				], [
					{species: 'Charmander', ability: 'blaze', moves: ['scratch']},
				]];
				battle = common.createBattle({cancel: true}, TEAMS);

				battle.p1.active[0].maybeTrapped = true;
				battle.makeRequest();

				battle.choose('p1', 'switch 2');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'move 1');
				battle.choose('p2', 'move 1');

				assert.species(battle.p1.active[0], 'Ivysaur');
			});

			it(`should disallow to ${mode} switch decisions on move requests for unconfirmed trapping-immune Pokémon that would otherwise be trapped`, function () {
				battle = common.createBattle({cancel: true, pokemon: true, legality: true}, [
					[
						{species: 'Starmie', ability: 'naturalcure', moves: ['reflecttype', 'recover']},
						{species: 'Mandibuzz', ability: 'overcoat', moves: ['knockoff']},
					], 	[
						{species: 'Zoroark', ability: 'illusion', moves: ['shadowball, focusblast']},
						{species: 'Gothitelle', ability: 'competitive', moves: ['calmmind']},
						{species: 'Gengar', ability: 'levitate', moves: ['shadowball, focusblast']},
					],
				]);
				const target = battle.p1.active[0];

				battle.p1.chooseMove('reflecttype');
				battle.p2.chooseSwitch(3);

				// The real Gengar comes in, but p1 only sees a Gengar being switched by another Gengar, implying Illusion.
				// For a naive client, Starmie turns into Ghost/Poison, and it will be correct.
				assert.strictEqual(target.getTypes().join('/'), 'Ghost/Poison');

				// Trapping with Gengar-Mega is a guaranteed trapping, so we are going to get a very meta
				// Competitive Gothitelle into the battle field (Frisk is revealed on switch-in).
				battle.p1.chooseMove('recover');
				battle.p2.chooseSwitch(2);

				assert(target.maybeTrapped, `${target} should be flagged as maybe trapped`);

				battle.choose('p1', 'switch 2');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'move recover');
				battle.choose('p2', 'move 1');

				assert.species(battle.p1.active[0], 'Mandibuzz');
			});

			it(`should disallow to ${mode} switch decisions on move requests by default`, function () {
				const TEAMS = [[
					{species: 'Bulbasaur', ability: 'overgrow', moves: ['synthesis']},
					{species: 'Ivysaur', ability: 'overgrow', moves: ['synthesis']},
					{species: 'Venusaur', ability: 'overgrow', moves: ['synthesis']},
				], [
					{species: 'Charmander', ability: 'blaze', moves: ['scratch']},
				]];
				battle = common.createBattle(TEAMS);

				battle.choose('p1', 'switch 2');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'move 1');
				battle.choose('p2', 'move 1');

				['Ivysaur', 'Bulbasaur', 'Venusaur'].forEach((species, index) => assert.species(battle.p1.pokemon[index], species));

				battle.destroy();
				battle = common.createBattle(TEAMS);

				battle.choose('p1', 'switch 2');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'switch 3');
				battle.choose('p2', 'move 1');

				['Ivysaur', 'Bulbasaur', 'Venusaur'].forEach((species, index) => assert.species(battle.p1.pokemon[index], species));
			});

			it(`should support to ${mode} shift decisions on move requests`, function () {
				const TEAMS = [[
					{species: 'Bulbasaur', ability: 'overgrow', moves: ['synthesis']},
					{species: 'Ivysaur', ability: 'overgrow', moves: ['synthesis']},
					{species: 'Venusaur', ability: 'overgrow', moves: ['synthesis']},
				], [
					{species: 'Aggron', ability: 'sturdy', moves: ['irondefense']},
					{species: 'Aggron', ability: 'sturdy', moves: ['irondefense']},
					{species: 'Aggron', ability: 'sturdy', moves: ['irondefense']},
				]];
				battle = common.createBattle({gameType: 'triples', cancel: true}, TEAMS);

				battle.choose('p1', 'shift, move 1, move 1');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'move 1, move 1, move 1');
				battle.choose('p2', 'move 1, move 1, move 1');

				['Bulbasaur', 'Ivysaur', 'Venusaur'].forEach((species, index) => assert.species(battle.p1.active[index], species));
				assert.strictEqual(battle.p1.active[0].lastMove, 'synthesis');

				battle.destroy();
				battle = common.createBattle({gameType: 'triples', cancel: true}, TEAMS);

				battle.choose('p1', 'move 1, move 1, shift');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'move 1, move 1, move 1');
				battle.choose('p2', 'move 1, move 1, move 1');

				['Bulbasaur', 'Ivysaur', 'Venusaur'].forEach((species, index) => assert.species(battle.p1.active[index], species));
				assert.strictEqual(battle.p1.active[2].lastMove, 'synthesis');
			});

			it(`should disallow to ${mode} shift decisions by default`, function () {
				const TEAMS = [[
					{species: 'Bulbasaur', ability: 'overgrow', moves: ['synthesis']},
					{species: 'Ivysaur', ability: 'overgrow', moves: ['growth']},
					{species: 'Venusaur', ability: 'overgrow', moves: ['synthesis']},
				], [
					{species: 'Aggron', ability: 'sturdy', moves: ['irondefense']},
					{species: 'Aggron', ability: 'sturdy', moves: ['irondefense']},
					{species: 'Aggron', ability: 'sturdy', moves: ['irondefense']},
				]];
				battle = common.createBattle({gameType: 'triples'}, TEAMS);

				battle.choose('p1', 'shift, move 1, move 1');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'move 1, move 1, move 1');
				battle.choose('p2', 'move 1, move 1, move 1');

				['Ivysaur', 'Bulbasaur', 'Venusaur'].forEach((species, index) => assert.species(battle.p1.active[index], species));
				assert.strictEqual(battle.p1.active[0].lastMove, 'growth');

				battle.destroy();
				battle = common.createBattle({gameType: 'triples'}, TEAMS);

				battle.choose('p1', 'move 1, move 1, shift');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'move 1, move 1, move 1');
				battle.choose('p2', 'move 1, move 1, move 1');

				['Bulbasaur', 'Venusaur', 'Ivysaur'].forEach((species, index) => assert.species(battle.p1.active[index], species));
				assert.strictEqual(battle.p1.active[2].lastMove, 'growth');
			});

			it(`should support to ${mode} switch decisions on double switch requests`, function () {
				battle = common.createBattle({cancel: true});
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
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'switch 3');
				battle.choose('p2', 'switch 2');

				assert.strictEqual(battle.turn, 2);
				assert.strictEqual(battle.p1.active[0].template.species, 'Chikorita');
				assert.strictEqual(battle.p2.active[0].template.species, 'Charmander');
			});

			it(`should support to ${mode} pass decisions on double switch requests`, function () {
				battle = common.createBattle({cancel: true, gameType: 'doubles'});
				battle.join('p1', 'Guest 1', 1, [
					{species: "Deoxys-Attack", ability: 'pressure', moves: ['explosion']},
					{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle']},
					{species: "Chikorita", ability: 'overgrow', moves: ['tackle']},
				]);
				battle.join('p2', 'Guest 2', 1, [
					{species: "Caterpie", ability: 'shielddust', moves: ['tackle']},
					{species: "Charmander", ability: 'blaze', moves: ['tackle']},
					{species: "Cyndaquil", ability: 'blaze', moves: ['tackle']},
				]);

				battle.commitDecisions();

				battle.choose('p1', 'pass, switch 3');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'switch 3, pass');
				battle.choose('p2', 'pass, switch 3');

				['Chikorita', 'Bulbasaur'].forEach((species, index) => assert.species(battle.p1.active[index], species));
			});

			it(`should disallow to ${mode} switch decisions on switch requests by default`, function () {
				const TEAMS = [[
					{species: 'Latias', ability: 'levitate', moves: ['lunardance']},
					{species: 'Clefable', ability: 'unaware', moves: ['healingwish']},
					{species: 'Ivysaur', ability: 'overgrow', moves: ['tackle']},
					{species: 'Venusaur', ability: 'overgrow', moves: ['tackle']},
				], [
					{species: 'Charmander', ability: 'blaze', moves: ['scratch']},
					{species: 'Charmeleon', ability: 'blaze', moves: ['scratch']},
					{species: 'Charizard', ability: 'blaze', moves: ['scratch']},
				]];

				battle = common.createBattle({gameType: 'doubles', cancel: true}, TEAMS);
				battle.commitDecisions();

				battle.choose('p1', 'switch 3, switch 4');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'switch 4, switch 3');

				['Ivysaur', 'Venusaur'].forEach((species, index) => assert.species(battle.p1.active[index], species));
			});

			it(`should disallow to ${mode} pass decisions on switch requests by default`, function () {
				const TEAMS = [[
					{species: 'Latias', ability: 'levitate', moves: ['lunardance']},
					{species: 'Clefable', ability: 'overgrow', moves: ['healingwish']},
					{species: 'Venusaur', ability: 'overgrow', moves: ['tackle']},
				], [
					{species: 'Charmander', ability: 'blaze', moves: ['scratch']},
					{species: 'Charmeleon', ability: 'blaze', moves: ['scratch']},
					{species: 'Charizard', ability: 'blaze', moves: ['scratch']},
				]];

				battle = common.createBattle({gameType: 'doubles'}, TEAMS);
				battle.commitDecisions();

				battle.choose('p1', 'pass, switch 3');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'switch 3, pass');

				['Latias', 'Venusaur'].forEach((species, index) => assert.species(battle.p1.active[index], species));
			});

			it(`should disallow to ${mode} switch decisions on double switch requests by default`, function () {
				battle = common.createBattle();
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
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'switch 3');
				battle.choose('p2', 'switch 2');

				assert.species(battle.p1.active[0], 'Bulbasaur');
				assert.species(battle.p2.active[0], 'Charmander');
			});

			it(`should disallow to ${mode} pass decisions on double switch requests by default`, function () {
				battle = common.createBattle({gameType: 'doubles'});
				battle.join('p1', 'Guest 1', 1, [
					{species: "Deoxys-Attack", ability: 'pressure', moves: ['explosion']},
					{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle']},
					{species: "Chikorita", ability: 'overgrow', moves: ['tackle']},
				]);
				battle.join('p2', 'Guest 2', 1, [
					{species: "Caterpie", ability: 'shielddust', moves: ['tackle']},
					{species: "Charmander", ability: 'blaze', moves: ['tackle']},
					{species: "Cyndaquil", ability: 'blaze', moves: ['tackle']},
				]);

				battle.commitDecisions();

				battle.choose('p1', 'pass, switch 3');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'switch 3, pass');
				battle.choose('p2', 'pass, switch 3');

				['Deoxys-Attack', 'Chikorita'].forEach((species, index) => assert.species(battle.p1.active[index], species));
			});

			it(`should support to ${mode} team order decision on team preview requests`, function () {
				battle = common.createBattle({preview: true, cancel: true}, [
					[{species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle']}, {species: 'Ivysaur', ability: 'overgrow', moves: ['tackle']}],
					[{species: 'Charmander', ability: 'blaze', moves: ['scratch']}, {species: 'Charmeleon', ability: 'blaze', moves: ['scratch']}],
				]);

				battle.choose('p1', 'team 12');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'team 21');
				battle.choose('p2', 'team 12');

				['Ivysaur', 'Bulbasaur'].forEach((species, index) => assert.species(battle.p1.pokemon[index], species));
				battle.destroy();

				battle = common.createBattle({preview: true, cancel: true}, [
					[{species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle']}, {species: 'Ivysaur', ability: 'overgrow', moves: ['tackle']}],
					[{species: 'Charmander', ability: 'blaze', moves: ['scratch']}, {species: 'Charmeleon', ability: 'blaze', moves: ['scratch']}],
				]);

				battle.choose('p1', 'team 21');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'team 12');
				battle.choose('p2', 'team 12');

				['Bulbasaur', 'Ivysaur'].forEach((species, index) => assert.species(battle.p1.pokemon[index], species));
			});

			it(`should disallow to ${mode} team order decision on team preview requests by default`, function () {
				battle = common.createBattle({preview: true}, [
					[{species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle']}, {species: 'Ivysaur', ability: 'overgrow', moves: ['tackle']}],
					[{species: 'Charmander', ability: 'blaze', moves: ['scratch']}, {species: 'Charmeleon', ability: 'blaze', moves: ['scratch']}],
				]);

				battle.choose('p1', 'team 12');
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'team 21');
				battle.choose('p2', 'team 12');

				['Bulbasaur', 'Ivysaur'].forEach((species, index) => assert.species(battle.p1.pokemon[index], species));
			});
		}
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
		p1.chooseMove(1).chooseMove(1);
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
		assert(p1.choice.actions.length > 0);
		battle.undoChoice('p1');
		assert.false(p1.choice.actions.length > 0);
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
		assert(p1.choice.actions.length > 0);
		battle.undoChoice('p1');
		assert.false(p1.choice.actions.length > 0);
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
		assert(p1.choice.actions.length > 0);
		battle.undoChoice('p1');
		assert.false(p1.choice.actions.length > 0);
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
		assert(p1.choice.actions.length > 0);
		battle.undoChoice('p1');
		assert.false(p1.choice.actions.length > 0);
		p1.chooseMove(1).chooseMove(1).chooseShift();
		p2.chooseDefault();

		assert.fainted(p1.active[0]);
		assert.fainted(p1.active[2]);
		assert.species(p1.active[1], 'Gastly');
		assert.false.fainted(p1.active[1]);
	});
});

