'use strict';

const assert = require('./../assert');
const common = require('./../common');
const Utils = require('../../dist/lib/utils').Utils;
const BASE_TEAM_ORDER = [1, 2, 3, 4, 5, 6];

const SINGLES_TEAMS = {
	illusion: [[
		{ species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle'] },
		{ species: 'Ivysaur', ability: 'overgrow', moves: ['tackle'] },
		{ species: 'Venusaur', ability: 'overgrow', moves: ['tackle'] },
		{ species: 'Charmander', ability: 'blaze', moves: ['tackle'] },
		{ species: 'Charmeleon', ability: 'blaze', moves: ['tackle'] },
		{ species: 'Zoroark', ability: 'illusion', moves: ['tackle'] },
	], [
		{ species: 'Squirtle', ability: 'torrent', moves: ['tackle'] },
		{ species: 'Wartortle', ability: 'torrent', moves: ['tackle'] },
	]],
	full: [[
		{ species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle'] },
		{ species: 'Ivysaur', ability: 'overgrow', moves: ['tackle'] },
		{ species: 'Venusaur', ability: 'overgrow', moves: ['tackle'] },
		{ species: 'Charmander', ability: 'blaze', moves: ['tackle'] },
		{ species: 'Charmeleon', ability: 'blaze', moves: ['tackle'] },
		{ species: 'Charizard', ability: 'blaze', moves: ['tackle'] },
	], [
		{ species: 'Squirtle', ability: 'torrent', moves: ['tackle'] },
		{ species: 'Wartortle', ability: 'torrent', moves: ['tackle'] },
	]],
};

const DOUBLES_TEAMS = {
	forcePass: [[
		{ species: 'Bulbasaur', ability: 'overgrow', moves: ['lunardance'] },
		{ species: 'Clefable', ability: 'unaware', moves: ['healingwish'] },
		{ species: 'Latias', ability: 'levitate', moves: ['roost'] },
	], [
		{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] },
		{ species: 'Clefable', ability: 'unaware', moves: ['recover'] },
	]],
	full: [[
		{ species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle'] },
		{ species: 'Ivysaur', ability: 'overgrow', moves: ['tackle'] },
		{ species: 'Venusaur', ability: 'overgrow', moves: ['tackle'] },
		{ species: 'Charmander', ability: 'blaze', moves: ['tackle'] },
		{ species: 'Charmeleon', ability: 'blaze', moves: ['tackle'] },
		{ species: 'Charizard', ability: 'blaze', moves: ['tackle'] },
	], [
		{ species: 'Squirtle', ability: 'torrent', moves: ['tackle'] },
		{ species: 'Wartortle', ability: 'torrent', moves: ['tackle'] },
	]],
	default: [[
		{ species: 'Latias', ability: 'overgrow', moves: ['lunardance'] },
		{ species: 'Clefable', ability: 'unaware', moves: ['healingwish'] },
		{ species: 'Bulbasaur', ability: 'levitate', moves: ['synthesis'] },
		{ species: 'Venusaur', ability: 'overgrow', moves: ['tackle'] },
	], [
		{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] },
		{ species: 'Clefable', ability: 'unaware', moves: ['recover'] },
	]],
};

const TRIPLES_TEAMS = {
	forcePass: [[
		{ species: 'Bulbasaur', ability: 'overgrow', moves: ['synthesis'] },
		{ species: 'Clefable', ability: 'unaware', moves: ['healingwish'] },
		{ species: 'Latias', ability: 'levitate', moves: ['lunardance'] },
		{ species: 'Venusaur', ability: 'overgrow', moves: ['synthesis'] },
	], [
		{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] },
		{ species: 'Clefable', ability: 'unaware', moves: ['recover'] },
		{ species: 'Latias', ability: 'blaze', moves: ['roost'] },
	]],
	full: [[
		{ species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle'] },
		{ species: 'Ivysaur', ability: 'overgrow', moves: ['tackle'] },
		{ species: 'Venusaur', ability: 'overgrow', moves: ['tackle'] },
		{ species: 'Charmander', ability: 'blaze', moves: ['tackle'] },
		{ species: 'Charmeleon', ability: 'blaze', moves: ['tackle'] },
		{ species: 'Charizard', ability: 'blaze', moves: ['tackle'] },
	], [
		{ species: 'Squirtle', ability: 'torrent', moves: ['tackle'] },
		{ species: 'Wartortle', ability: 'torrent', moves: ['tackle'] },
		{ species: 'Blastoise', ability: 'torrent', moves: ['tackle'] },
	]],
	default: [[
		{ species: 'Bulbasaur', ability: 'overgrow', moves: ['synthesis'] },
		{ species: 'Clefable', ability: 'unaware', moves: ['healingwish'] },
		{ species: 'Latias', ability: 'levitate', moves: ['roost'] },
		{ species: 'Venusaur', ability: 'overgrow', moves: ['synthesis'] },
	], [
		{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] },
		{ species: 'Clefable', ability: 'unaware', moves: ['recover'] },
		{ species: 'Latias', ability: 'blaze', moves: ['roost'] },
	]],
};

let battle;

describe('Choices', () => {
	afterEach(() => {
		battle.destroy();
	});

	describe('Generic', () => {
		it('should wait for players to send their choices and run them as soon as they are all received', done => {
			battle = common.createBattle();
			battle.setPlayer('p1', { team: [{ species: "Mew", ability: 'synchronize', moves: ['recover'] }] });
			battle.setPlayer('p2', { team: [{ species: "Rhydon", ability: 'prankster', moves: ['sketch'] }] });

			setTimeout(() => {
				battle.choose('p2', 'move 1');
			}, 20);
			setTimeout(() => {
				battle.choose('p1', 'move 1');
				assert.equal(battle.turn, 2);
				done();
			}, 40);
		});
	});

	describe('Move requests', () => {
		it('should allow specifying moves', () => {
			const MOVES = [['growl', 'tackle'], ['growl', 'scratch']];
			battle = common.createBattle([
				[{ species: "Bulbasaur", ability: 'Overgrow', moves: MOVES[0] }],
				[{ species: "Charmander", ability: 'Blaze', moves: MOVES[1] }],
			]);

			const activeMons = battle.sides.map(side => side.active[0]);
			for (let i = 0; i < 2; i++) {
				for (let j = 0; j < 2; j++) {
					const beforeHP = activeMons.map(pokemon => pokemon.hp);
					const beforeAtk = activeMons.map(pokemon => pokemon.boosts.atk);
					battle.makeChoices('move ' + (i + 1), 'move ' + (j + 1));
					assert.equal(activeMons[0].lastMove.id, MOVES[0][i]);
					assert.equal(activeMons[1].lastMove.id, MOVES[1][j]);

					if (i >= 1) { // p1 used a damaging move
						assert.atMost(activeMons[1].hp, beforeHP[1] - 1);
						assert.statStage(activeMons[1], beforeAtk[1]);
					} else {
						assert.equal(activeMons[1].hp, beforeHP[1]);
						assert.statStage(activeMons[1], beforeAtk[1] - 1);
					}
					if (j >= 1) { // p2 used a damaging move
						assert.atMost(activeMons[0].hp, beforeHP[0] - 1);
						assert.statStage(activeMons[0], beforeAtk[0]);
					} else {
						assert.equal(activeMons[0].hp, beforeHP[0]);
						assert.statStage(activeMons[0], beforeAtk[0] - 1);
					}
				}
			}
		});

		it(`should allow specifying move targets`, () => {
			battle = common.createBattle({ gameType: 'doubles' }, [[
				{ species: "Gastrodon", ability: 'stickyhold', moves: ['gastroacid'] },
				{ species: "Venusaur", ability: 'noguard', moves: ['leechseed'] },
			], [
				{ species: "Tyranitar", ability: 'unnerve', moves: ['knockoff'] },
				{ species: "Zapdos", ability: 'pressure', moves: ['glare'] }],
			]);
			const p2active = battle.p2.active;

			battle.makeChoices('move gastroacid 1, move leechseed 2', 'move knockoff -2, move glare -1');
			assert.equal(battle.turn, 2);

			assert(p2active[0].volatiles['gastroacid']);
			assert(p2active[1].volatiles['leechseed']);
			assert.false.holdsItem(p2active[1]);
			assert.equal(p2active[0].status, 'par');
		});

		it('should disallow specifying move targets for targetless moves (randomNormal)', () => {
			battle = common.createBattle({ gameType: 'doubles' }, [
				[{ species: "Dragonite", ability: 'multiscale', moves: ['outrage'] }, { species: "Blastoise", ability: 'torrent', moves: ['rest'] }],
				[{ species: "Tyranitar", ability: 'unnerve', moves: ['dragondance'] }, { species: "Zapdos", ability: 'pressure', moves: ['roost'] }],
			]);

			assert.cantTarget(() => battle.p1.chooseMove('outrage', 1), 'outrage');
		});

		it('should disallow specifying move targets for targetless moves (scripted)', () => {
			battle = common.createBattle({ gameType: 'doubles' }, [
				[{ species: "Dragonite", ability: 'multiscale', moves: ['counter'] }, { species: "Blastoise", ability: 'torrent', moves: ['rest'] }],
				[{ species: "Tyranitar", ability: 'unnerve', moves: ['bodyslam'] }, { species: "Zapdos", ability: 'pressure', moves: ['drillpeck'] }],
			]);

			assert.cantTarget(() => battle.p1.chooseMove('counter', 2), 'counter');
		});

		it('should disallow specifying move targets for targetless moves (self)', () => {
			battle = common.createBattle({ gameType: 'doubles' }, [
				[{ species: "Dragonite", ability: 'multiscale', moves: ['roost'] }, { species: "Blastoise", ability: 'torrent', moves: ['rest'] }],
				[{ species: "Tyranitar", ability: 'unnerve', moves: ['dragondance'] }, { species: "Zapdos", ability: 'pressure', moves: ['roost'] }],
			]);

			assert.cantTarget(() => battle.p1.chooseMove('roost', -2), 'roost');
		});

		it('should allow specifying switch targets', () => {
			battle = common.createBattle([[
				{ species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle'] },
				{ species: 'Ivysaur', ability: 'overgrow', moves: ['tackle'] },
				{ species: 'Venusaur', ability: 'overgrow', moves: ['tackle'] },
			], [
				{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] },
				{ species: 'Charmeleon', ability: 'blaze', moves: ['scratch'] },
				{ species: 'Charizard', ability: 'blaze', moves: ['scratch'] },
			]]);

			battle.makeChoices('switch 2', 'switch 3');

			assert.species(battle.p1.active[0], 'Ivysaur');
			assert.species(battle.p2.active[0], 'Charizard');

			battle.makeChoices('switch 3', 'switch 3');

			assert.species(battle.p1.active[0], 'Venusaur');
			assert.species(battle.p2.active[0], 'Charmander');

			battle.makeChoices('switch 2', 'switch 2');

			assert.species(battle.p1.active[0], 'Bulbasaur');
			assert.species(battle.p2.active[0], 'Charmeleon');
		});

		it('should allow shifting the Pokémon on the left to the center', () => {
			battle = common.gen(5).createBattle({ gameType: 'triples' });
			battle.setPlayer('p1', { team: [
				{ species: "Pineco", ability: 'sturdy', moves: ['harden'] },
				{ species: "Geodude", ability: 'sturdy', moves: ['defensecurl'] },
				{ species: "Gastly", ability: 'levitate', moves: ['spite'] },
			] });
			battle.setPlayer('p2', { team: [
				{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
				{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
				{ species: "Golem", ability: 'sturdy', moves: ['defensecurl'] },
			] });
			const [p1, p2] = battle.sides;
			battle.makeChoices('move harden, move defensecurl, shift', 'move roost, move irondefense, shift');

			for (const [index, species] of ['Pineco', 'Gastly', 'Geodude'].entries()) {
				assert.species(p1.active[index], species);
			}
			for (const [index, species] of ['Skarmory', 'Golem', 'Aggron'].entries()) {
				assert.species(p2.active[index], species);
			}
		});

		it('should allow shifting the Pokémon on the right to the center', () => {
			battle = common.gen(5).createBattle({ gameType: 'triples' });
			battle.setPlayer('p1', { team: [
				{ species: "Pineco", ability: 'sturdy', moves: ['harden'] },
				{ species: "Geodude", ability: 'sturdy', moves: ['defensecurl'] },
				{ species: "Gastly", ability: 'levitate', moves: ['spite'] },
			] });
			battle.setPlayer('p2', { team: [
				{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
				{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
				{ species: "Golem", ability: 'sturdy', moves: ['defensecurl'] },
			] });
			battle.makeChoices('shift, default, default', 'shift, default, default');

			for (const [index, species] of ['Geodude', 'Pineco', 'Gastly'].entries()) {
				assert.species(battle.p1.active[index], species);
			}
			for (const [index, species] of ['Aggron', 'Skarmory', 'Golem'].entries()) {
				assert.species(battle.p2.active[index], species);
			}
		});

		it('should shift the Pokémon as a standard priority move action', () => {
			battle = common.gen(5).createBattle({ gameType: 'triples' });
			battle.setPlayer('p1', { team: [
				{ species: "Pineco", ability: 'sturdy', moves: ['harden'] },
				{ species: "Geodude", ability: 'sturdy', moves: ['suckerpunch'] },
				{ species: "Gastly", ability: 'levitate', moves: ['spite'] },
			] });
			battle.setPlayer('p2', { team: [
				{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
				{ species: "Aggron", ability: 'sturdy', moves: ['earthquake'] },
				{ species: "Golem", ability: 'sturdy', moves: ['defensecurl'] },
			] });
			battle.makeChoices('shift, move suckerpunch 2, shift', 'shift, move earthquake, shift');

			for (const [index, species] of ['Gastly', 'Pineco', 'Geodude'].entries()) {
				assert.species(battle.p1.active[index], species);
			}
			for (const [index, species] of ['Aggron', 'Golem', 'Skarmory'].entries()) {
				assert.species(battle.p2.active[index], species);
			}
			// Geodude's sucker punch should have processed first,
			// while Aggron was still in slot 2.
			assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
			// Aggron's Earthquake should process after Skarmory shifted
			// but before Golem shifted, so it didn't hit Golem.
			assert.equal(battle.p2.active[1].hp, battle.p2.active[1].maxhp);
		});

		it('should force Struggle usage on move attempt for no valid moves', () => {
			battle = common.createBattle();
			battle.setPlayer('p1', { team: [{ species: "Mew", ability: 'synchronize', moves: ['recover'] }] });
			battle.setPlayer('p2', { team: [{ species: "Rhydon", ability: 'prankster', moves: ['sketch'] }] });

			// First turn
			battle.makeChoices('move 1', 'move 1');

			// Second turn
			assert.cantMove(() => battle.makeChoices('move recover', 'move sketch'), 'Rhydon', 'Sketch');
			battle.makeChoices('move recover', 'move 1');

			assert.equal(battle.turn, 3);
			assert.equal(battle.p2.active[0].lastMove.id, 'struggle');
		});

		it('should not force Struggle usage on move attempt for valid moves', () => {
			battle = common.createBattle();
			battle.setPlayer('p1', { team: [{ species: "Mew", ability: 'synchronize', moves: ['recover'] }] });
			battle.setPlayer('p2', { team: [{ species: "Rhydon", ability: 'prankster', moves: ['struggle', 'surf'] }] });

			battle.makeChoices('move recover', 'move surf');

			assert.equal(battle.turn, 2);
			assert.notEqual(battle.p2.active[0].lastMove.id, 'struggle');
		});

		it('should not force Struggle usage on move attempt when choosing a disabled move', () => {
			battle = common.createBattle();
			battle.setPlayer('p1', { team: [{ species: "Mew", item: 'assaultvest', ability: 'synchronize', moves: ['recover', 'icebeam'] }] });
			battle.setPlayer('p2', { team: [{ species: "Rhydon", item: '', ability: 'prankster', moves: ['surf'] }] });
			const failingAttacker = battle.p1.active[0];
			battle.p2.chooseMove(1);

			assert.cantMove(() => battle.p1.chooseMove(1), 'Mew', 'Recover', true);
			assert.equal(battle.turn, 1);
			assert.notEqual(failingAttacker.lastMove && failingAttacker.lastMove.id, 'struggle');

			assert.cantMove(() => battle.p1.chooseMove(1), 'Mew', 'Recover');
			assert.equal(battle.turn, 1);
			assert.notEqual(failingAttacker.lastMove && failingAttacker.lastMove.id, 'struggle');
		});

		it('should send meaningful feedback to players if they try to use a disabled move', () => {
			battle = common.createBattle({ strictChoices: false });
			battle.setPlayer('p1', { team: [{ species: "Skarmory", ability: 'sturdy', moves: ['spikes', 'roost'] }] });
			battle.setPlayer('p2', { team: [{ species: "Smeargle", ability: 'owntempo', moves: ['imprison', 'spikes'] }] });

			battle.makeChoices('move spikes', 'move imprison');

			const buffer = [];
			battle.send = (type, data) => {
				if (type === 'sideupdate') buffer.push(Array.isArray(data) ? data.join('\n') : data);
			};
			battle.p1.chooseMove(1);
			assert(buffer.length >= 2);
			assert(buffer.some(message => message.startsWith('p1\n|error|[Unavailable choice]')));
			assert(buffer.some(message => message.startsWith('p1\n|request|') && JSON.parse(message.slice(12)).active[0].moves[0].disabled));
		});

		it('should send meaningful feedback to players if they try to switch a trapped Pokémon out', () => {
			battle = common.createBattle({ strictChoices: false });
			battle.setPlayer('p1', { team: [
				{ species: "Scizor", ability: 'swarm', moves: ['bulletpunch'] },
				{ species: "Azumarill", ability: 'sapsipper', moves: ['aquajet'] },
			] });
			battle.setPlayer('p2', { team: [{ species: "Gothitelle", ability: 'shadowtag', moves: ['calmmind'] }] });

			const buffer = [];
			battle.send = (type, data) => {
				if (type === 'sideupdate') buffer.push(Array.isArray(data) ? data.join('\n') : data);
			};
			battle.p1.chooseSwitch(2);
			assert(buffer.length >= 2);
			assert(buffer.some(message => message.startsWith('p1\n|error|[Unavailable choice]')));
			assert(buffer.some(message => message.startsWith('p1\n|request|') && JSON.parse(message.slice(12)).active[0].trapped));
		});
	});

	describe('Switch requests', () => {
		it('should allow specifying switch targets', () => {
			battle = common.createBattle([[
				{ species: 'Latias', ability: 'levitate', moves: ['lunardance'] },
				{ species: 'Ivysaur', ability: 'overgrow', moves: ['tackle'] },
				{ species: 'Venusaur', ability: 'overgrow', moves: ['tackle'] },
			], [
				{ species: 'Latias', ability: 'blaze', moves: ['lunardance'] },
				{ species: 'Charmeleon', ability: 'blaze', moves: ['scratch'] },
				{ species: 'Charizard', ability: 'blaze', moves: ['scratch'] },
			]]);

			battle.makeChoices('move lunardance', 'move lunardance');
			battle.makeChoices('switch 2', 'switch 3');

			assert.species(battle.p1.active[0], 'Ivysaur');
			assert.species(battle.p2.active[0], 'Charizard');
		});

		it('should allow passing when there are not enough available switch-ins', () => {
			battle = common.createBattle({ gameType: 'doubles' }, [[
				{ species: 'Latias', ability: 'levitate', moves: ['lunardance'] },
				{ species: 'Ivysaur', ability: 'overgrow', moves: ['lunardance'] },
				{ species: 'Venusaur', ability: 'overgrow', moves: ['tackle'] },
			], [
				{ species: 'Latias', ability: 'blaze', moves: ['lunardance'] },
				{ species: 'Charmeleon', ability: 'blaze', moves: ['lunardance'] },
				{ species: 'Charizard', ability: 'blaze', moves: ['scratch'] },
			]]);

			battle.makeChoices('move lunardance, move lunardance', 'move lunardance, move lunardance');
			assert.equal(battle.getAllActive().length, 0, `All active Pok\u00E9mon should have fainted`);

			battle.makeChoices('pass, switch 3', 'switch 3, pass');

			for (const [index, species] of ['Latias', 'Venusaur'].entries()) {
				assert.species(battle.p1.active[index], species);
			}
			for (const [index, species] of ['Charizard', 'Charmeleon'].entries()) {
				assert.species(battle.p2.active[index], species);
			}

			assert.fainted(battle.p1.active[0]);
			assert.fainted(battle.p2.active[1]);
		});

		it('should allow passing when there are not enough available switch-ins even if an active Pokémon is not fainted', () => {
			battle = common.gen(5).createBattle({ gameType: 'triples' }, [[
				{ species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle'] },
				{ species: 'Clefable', ability: 'unaware', moves: ['healingwish'] },
				{ species: 'Latias', ability: 'levitate', moves: ['lunardance'] },
				{ species: 'Venusaur', ability: 'overgrow', moves: ['tackle'] },
			], [
				{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] },
				{ species: 'Clefable', ability: 'unaware', moves: ['healingwish'] },
				{ species: 'Latias', ability: 'blaze', moves: ['lunardance'] },
				{ species: 'Charizard', ability: 'blaze', moves: ['scratch'] },
			]]);

			battle.makeChoices('move tackle 2, move healingwish, move lunardance', 'move scratch 2, move healingwish, move lunardance');
			assert.sets(() => battle.turn, battle.turn + 1, () => {
				battle.makeChoices('pass, pass, switch 4', 'pass, switch 4, pass');
			}, "The turn should be resolved");

			for (const [index, species] of ['Bulbasaur', 'Clefable', 'Venusaur'].entries()) {
				assert.species(battle.p1.active[index], species);
			}
			for (const [index, species] of ['Charmander', 'Charizard', 'Latias'].entries()) {
				assert.species(battle.p2.active[index], species);
			}
		});

		it('should disallow passing when there are enough available switch-ins', () => {
			battle = common.createBattle({ gameType: 'doubles' }, [[
				{ species: 'Latias', ability: 'levitate', moves: ['lunardance'] },
				{ species: 'Bulbasaur', ability: 'overgrow', moves: ['lunardance'] },
				{ species: 'Ivysaur', ability: 'overgrow', moves: ['tackle'] },
				{ species: 'Venusaur', ability: 'overgrow', moves: ['tackle'] },
			], [
				{ species: 'Latias', ability: 'blaze', moves: ['lunardance'] },
				{ species: 'Charmander', ability: 'blaze', moves: ['lunardance'] },
				{ species: 'Charmeleon', ability: 'blaze', moves: ['scratch'] },
				{ species: 'Charizard', ability: 'blaze', moves: ['scratch'] },
			]]);

			battle.makeChoices('move lunardance, move lunardance', 'move lunardance, move lunardance');
			assert.equal(battle.getAllActive().length, 0, `All active Pok\u00E9mon should have fainted`);

			assert.constant(() => battle.turn, () => {
				assert.throws(
					() => battle.p1.choosePass(),
					/\[Invalid choice\] Can't pass: You need to switch in a Pokémon to replace Latias/,
					`Expected choosePass() to fail`
				);
				battle.p1.chooseSwitch(3);
				battle.p2.chooseSwitch(3);
				assert.throws(
					() => battle.p2.choosePass(),
					/\[Invalid choice\] Can't pass: You need to switch in a Pokémon to replace Charmander/,
					`Expected choosePass() to fail`
				);
			});

			assert.equal(battle.getAllActive().length, 0, `All active Pok\u00E9mon should have fainted`);
		});
	});

	describe('Team Preview requests', () => {
		it('should allow specifying the team order', () => {
			const TEAMS = [[
				{ species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle'] },
				{ species: 'Clefable', ability: 'unaware', moves: ['healingwish'] },
				{ species: 'Latias', ability: 'levitate', moves: ['lunardance'] },
				{ species: 'Venusaur', ability: 'overgrow', moves: ['tackle'] },
			], [
				{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] },
				{ species: 'Clefable', ability: 'unaware', moves: ['healingwish'] },
				{ species: 'Latias', ability: 'blaze', moves: ['lunardance'] },
				{ species: 'Charizard', ability: 'blaze', moves: ['scratch'] },
			]];

			for (let i = 0; i < 10; i++) {
				const teamOrder = [BASE_TEAM_ORDER, BASE_TEAM_ORDER].map(teamOrder => Utils.shuffle(teamOrder.slice(0, 4)));
				battle = common.createBattle({ preview: true }, TEAMS);
				battle.makeChoices(`team ${teamOrder[0].join('')}`, `team ${teamOrder[1].join('')}`);
				for (const [index, pokemon] of battle.p1.pokemon.entries()) {
					assert.species(pokemon, TEAMS[0][teamOrder[0][index] - 1].species);
				}
				for (const [index, pokemon] of battle.p2.pokemon.entries()) {
					assert.species(pokemon, TEAMS[1][teamOrder[1][index] - 1].species);
				}

				if (i < 9) battle.destroy();
			}
		});

		it('should autocomplete a single-slot choice in Singles', () => {
			// Backwards-compatibility with the client. It should be useful for 3rd party bots/clients (Android?)
			for (let i = 0; i < 5; i++) {
				battle = common.createBattle({ preview: true }, SINGLES_TEAMS.full);
				const teamOrder = Utils.shuffle(BASE_TEAM_ORDER.slice()).slice(0, 1);
				const fullTeamOrder = teamOrder.concat(BASE_TEAM_ORDER.filter(elem => !teamOrder.includes(elem)));

				battle.makeChoices(`team ${teamOrder.join('')}`, 'default');

				for (const [index, oSlot] of fullTeamOrder.entries()) {
					assert.species(battle.p1.pokemon[index], SINGLES_TEAMS.full[0][oSlot - 1].species);
				}

				if (i < 4) battle.destroy();
			}
		});

		it('should allow specifying the team order in a slot-per-slot basis in Singles with Illusion', () => {
			for (let i = 0; i < 5; i++) {
				battle = common.createBattle({ preview: true }, SINGLES_TEAMS.illusion);
				const teamOrder = Utils.shuffle(BASE_TEAM_ORDER.slice());

				battle.makeChoices(`team ${teamOrder.join('')}`, 'default');

				for (const [index, oSlot] of teamOrder.entries()) {
					assert.species(battle.p1.pokemon[index], SINGLES_TEAMS.illusion[0][oSlot - 1].species);
				}

				if (i < 4) battle.destroy();
			}
		});

		it('should allow specifying the team order in a slot-per-slot basis in Doubles', () => {
			for (let i = 0; i < 5; i++) {
				battle = common.createBattle({ preview: true, gameType: 'doubles' }, DOUBLES_TEAMS.full);
				const teamOrder = Utils.shuffle(BASE_TEAM_ORDER.slice());

				battle.makeChoices(`team ${teamOrder.join('')}`, 'default');

				for (const [index, oSlot] of teamOrder.entries()) {
					assert.species(battle.p1.pokemon[index], DOUBLES_TEAMS.full[0][oSlot - 1].species);
				}

				if (i < 4) battle.destroy();
			}
		});

		it('should allow specifying the team order in a slot-per-slot basis in Triples', () => {
			for (let i = 0; i < 5; i++) {
				battle = common.gen(5).createBattle({ preview: true, gameType: 'triples' }, TRIPLES_TEAMS.full);
				const teamOrder = Utils.shuffle(BASE_TEAM_ORDER.slice());

				battle.makeChoices(`team ${teamOrder.join('')}`, 'default');

				for (const [index, oSlot] of teamOrder.entries()) {
					assert.species(battle.p1.pokemon[index], TRIPLES_TEAMS.full[0][oSlot - 1].species);
				}

				if (i < 4) battle.destroy();
			}
		});

		it('should autocomplete multi-slot choices', () => {
			for (let i = 0; i < 5; i++) {
				battle = common.createBattle({ preview: true }, SINGLES_TEAMS.full);
				const teamOrder = Utils.shuffle(BASE_TEAM_ORDER.slice()).slice(0, 2);
				const fullTeamOrder = teamOrder.concat(BASE_TEAM_ORDER.filter(elem => !teamOrder.includes(elem)));

				battle.makeChoices(`team ${teamOrder.slice(0, 2).join('')}`, 'default');

				for (const [index, oSlot] of fullTeamOrder.entries()) {
					assert.species(battle.p1.pokemon[index], SINGLES_TEAMS.full[0][oSlot - 1].species);
				}

				if (i < 4) battle.destroy();
			}
		});
	});

	describe('Logging', () => {
		it('should privately log the ID of chosen moves', () => {
			battle = common.createBattle([
				[{ species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl'] }],
				[{ species: "Charmander", ability: 'blaze', moves: ['scratch', 'growl'] }],
			]);
			battle.makeChoices('move 1', 'move growl');

			const logText = battle.inputLog.join('\n');
			const subString = '>p1 move tackle\n>p2 move growl';
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should privately log the target of targetted chosen moves', () => {
			battle = common.createBattle({ gameType: 'doubles' }, [[
				{ species: "Bulbasaur", ability: 'overgrow', moves: ['tackle'] },
				{ species: "Ivysaur", ability: 'overgrow', moves: ['tackle'] },
			], [
				{ species: "Charmander", ability: 'blaze', moves: ['scratch'] },
				{ species: "Charizard", ability: 'blaze', moves: ['scratch'] },
			]]);
			battle.makeChoices('move tackle +1, move tackle +2', 'move scratch +2, move scratch +1');

			const logText = battle.inputLog.join('\n');
			const subString = '>p1 move tackle +1, move tackle +2\n>p2 move scratch +2, move scratch +1';
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should not log the target of targetless chosen moves', () => {
			battle = common.createBattle({ gameType: 'doubles' }, [[
				{ species: "Bulbasaur", ability: 'overgrow', moves: ['magnitude'] },
				{ species: "Ivysaur", ability: 'overgrow', moves: ['rockslide'] },
			], [
				{ species: "Charmander", ability: 'blaze', moves: ['scratch'] },
				{ species: "Charizard", ability: 'blaze', moves: ['scratch'] },
			]]);
			battle.makeChoices('move magnitude, move rockslide', 'move scratch +1, move scratch +1');

			const logText = battle.inputLog.join('\n');
			const subString = '>p1 move magnitude, move rockslide\n>p2 move scratch +1, move scratch +1';
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should privately log the user intention of mega evolving', () => {
			battle = common.createBattle([
				[{ species: "Venusaur", item: 'venusaurite', ability: 'overgrow', moves: ['tackle'] }],
				[{ species: "Blastoise", item: 'blastoisinite', ability: 'blaze', moves: ['tailwhip'] }],
			]);
			battle.makeChoices('move tackle mega', 'move tailwhip mega');

			const logText = battle.inputLog.join('\n');
			const subString = '>p1 move tackle mega\n>p2 move tailwhip mega';
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should privately log the user intention of mega evolving for Mega-X and Mega-Y', () => {
			battle = common.createBattle([
				[{ species: "Charizard", item: 'charizarditex', ability: 'blaze', moves: ['scratch'] }],
				[{ species: "Charizard", item: 'charizarditey', ability: 'blaze', moves: ['ember'] }],
			]);
			battle.makeChoices('move scratch mega', 'move ember mega');

			const logText = battle.inputLog.join('\n');
			const subString = '>p1 move scratch mega\n>p2 move ember mega';
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should privately log the target of switches', () => {
			battle = common.createBattle([[
				{ species: "Bulbasaur", ability: 'overgrow', moves: ['tackle'] },
				{ species: "Ivysaur", ability: 'overgrow', moves: ['tackle'] },
				{ species: "Venusaur", ability: 'overgrow', moves: ['tackle'] },
			], [
				{ species: "Charmander", ability: 'blaze', moves: ['scratch'] },
				{ species: "Charmeleon", ability: 'blaze', moves: ['scratch'] },
				{ species: "Charizard", ability: 'blaze', moves: ['scratch'] },
			]]);

			battle.makeChoices('switch 2', 'switch 3');

			const logText = battle.inputLog.join('\n');
			const subString = '>p1 switch 2\n>p2 switch 3';
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should privately log the team order chosen', () => {
			battle = common.createBattle({ preview: true }, [[
				{ species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle'] },
				{ species: 'Clefable', ability: 'unaware', moves: ['healingwish'] },
				{ species: 'Latias', ability: 'levitate', moves: ['lunardance'] },
				{ species: 'Venusaur', ability: 'overgrow', moves: ['tackle'] },
			], [
				{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] },
				{ species: 'Clefable', ability: 'unaware', moves: ['healingwish'] },
				{ species: 'Latias', ability: 'blaze', moves: ['lunardance'] },
				{ species: 'Charizard', ability: 'blaze', moves: ['scratch'] },
			]]);

			battle.makeChoices('team 1342', 'team 1234');

			const logText = battle.inputLog.join('\n');
			const subString = '>p1 team 1, 3, 4, 2\n>p2 team 1, 2, 3, 4';
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should privately log shifting decisions for the Pokémon on the left', () => {
			battle = common.gen(5).createBattle({ gameType: 'triples' });
			battle.setPlayer('p1', { team: [
				{ species: "Pineco", ability: 'sturdy', moves: ['harden'] },
				{ species: "Geodude", ability: 'sturdy', moves: ['defensecurl'] },
				{ species: "Gastly", ability: 'levitate', moves: ['haze'] },
			] });
			battle.setPlayer('p2', { team: [
				{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
				{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
				{ species: "Golem", ability: 'sturdy', moves: ['defensecurl'] },
			] });
			battle.makeChoices('shift, move defensecurl, move haze', 'move roost, move irondefense, move defensecurl');

			const logText = battle.inputLog.join('\n');
			const subString = '>p1 shift, move defensecurl, move haze\n>p2 move roost, move irondefense, move defensecurl';
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});

		it('should privately log shifting decisions for the Pokémon on the right', () => {
			battle = common.gen(5).createBattle({ gameType: 'triples' });
			battle.setPlayer('p1', { team: [
				{ species: "Pineco", ability: 'sturdy', moves: ['harden'] },
				{ species: "Geodude", ability: 'sturdy', moves: ['defensecurl'] },
				{ species: "Gastly", ability: 'levitate', moves: ['haze'] },
			] });
			battle.setPlayer('p2', { team: [
				{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
				{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
				{ species: "Golem", ability: 'sturdy', moves: ['defensecurl'] },
			] });

			battle.makeChoices('move harden, move defensecurl, shift', 'move roost, move irondefense, move defensecurl');

			const logText = battle.inputLog.join('\n');
			const subString = '>p1 move harden, move defensecurl, shift\n>p2 move roost, move irondefense, move defensecurl';
			assert(logText.includes(subString), `${logText} does not include ${subString}`);
		});
	});
});

describe('Choice extensions', () => {
	describe('Undo', () => {
		const MODES = ['revoke', 'override'];
		for (const mode of MODES) {
			it(`should disallow to ${mode} decisions after every player has sent an unrevoked action`, () => {
				battle = common.createBattle({ cancel: true });
				battle.setPlayer('p1', { team: [{ species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl'] }] });
				battle.setPlayer('p2', { team: [{ species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl'] }] });

				battle.choose('p1', 'move tackle');
				battle.choose('p2', 'move growl');
				// NOTE: the next turn has already started at this point, so undoChoice is a noop
				// and the subsequent battle chocie is a choice for turn 2, not an override.
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.choose('p1', 'move growl');

				assert.equal(battle.turn, 2);
				assert.equal(battle.p1.active[0].lastMove.id, 'tackle');
				assert.equal(battle.p2.active[0].lastMove.id, 'growl');
			});

			it(`should support to ${mode} move decisions`, () => {
				battle = common.createBattle({ cancel: true });
				battle.setPlayer('p1', { team: [{ species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl'] }] });
				battle.setPlayer('p2', { team: [{ species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl'] }] });

				battle.choose('p1', 'move tackle');
				assert(!battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.makeChoices('move growl', 'move growl');

				assert.equal(battle.turn, 2);
				assert.equal(battle.p1.active[0].lastMove.id, 'growl');
			});

			it(`should disallow to ${mode} move decisions for maybe-disabled Pokémon`, () => {
				battle = common.createBattle({ cancel: true });
				battle.setPlayer('p1', { team: [{ species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl', 'synthesis'] }] });
				battle.setPlayer('p2', { team: [{ species: "Charmander", ability: 'blaze', moves: ['scratch'] }] });

				const target = battle.p1.active[0];
				target.maybeDisabled = true;
				battle.makeRequest();

				battle.choose('p1', 'move tackle');
				// NOTE: noCancel is global so it still true even though the Pokemon can't undo.
				assert(!battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') assert.cantUndo(() => battle.undoChoice('p1'));
				assert.cantUndo(() => battle.choose('p1', 'move growl'));
				battle.choose('p2', 'move scratch');

				assert.equal(target.lastMove.id, 'tackle');
			});

			it(`should disallow to ${mode} move decisions by default`, () => {
				battle = common.createBattle();
				battle.setPlayer('p1', { team: [{ species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl'] }] });
				battle.setPlayer('p2', { team: [{ species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl'] }] });

				battle.choose('p1', 'move tackle');
				assert(battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') assert.cantUndo(() => battle.undoChoice('p1'));
				assert.cantUndo(() => battle.choose('p1', 'move growl'));
				battle.choose('p2', 'move growl');

				assert.equal(battle.turn, 2);
				assert.equal(battle.p1.active[0].lastMove.id, 'tackle');
				assert.equal(battle.p2.active[0].lastMove.id, 'growl');
			});

			it(`should support to ${mode} switch decisions on move requests`, () => {
				const TEAMS = [[
					{ species: 'Bulbasaur', ability: 'overgrow', moves: ['synthesis'] },
					{ species: 'Ivysaur', ability: 'overgrow', moves: ['synthesis'] },
					{ species: 'Venusaur', ability: 'overgrow', moves: ['synthesis'] },
				], [
					{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] },
				]];
				battle = common.createBattle({ cancel: true }, TEAMS);

				battle.choose('p1', 'switch 2');
				assert(!battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.makeChoices('move 1', 'move 1');

				for (const [index, species] of ['Bulbasaur', 'Ivysaur', 'Venusaur'].entries()) {
					assert.species(battle.p1.pokemon[index], species);
				}
				assert.equal(battle.p1.active[0].lastMove.id, 'synthesis');

				battle.destroy();
				battle = common.createBattle({ cancel: true }, TEAMS);

				battle.choose('p1', 'switch 2');
				assert(!battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.makeChoices('switch 3', 'move 1');

				for (const [index, species] of ['Venusaur', 'Ivysaur', 'Bulbasaur'].entries()) {
					assert.species(battle.p1.pokemon[index], species);
				}
			});

			it(`should disallow to ${mode} switch decisions on move requests for maybe-trapped Pokémon`, () => {
				const TEAMS = [[
					{ species: 'Bulbasaur', ability: 'overgrow', moves: ['synthesis'] },
					{ species: 'Ivysaur', ability: 'overgrow', moves: ['synthesis'] },
				], [
					{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] },
				]];
				battle = common.createBattle({ cancel: true }, TEAMS);

				battle.p1.active[0].maybeTrapped = true;
				battle.makeRequest();

				battle.choose('p1', 'switch 2');
				// NOTE: noCancel is global so it still true even though the Pokemon can't undo.
				assert(!battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') assert.cantUndo(() => battle.undoChoice('p1'));
				assert.cantUndo(() => battle.choose('p1', 'move synthesis'));
				battle.choose('p2', 'move scratch');

				assert.species(battle.p1.active[0], 'Ivysaur');
			});

			it(`should disallow to ${mode} switch decisions on move requests for unconfirmed trapping-immune Pokémon that would otherwise be trapped`, () => {
				battle = common.createBattle({ cancel: true, legality: true }, [
					[
						{ species: 'Starmie', ability: 'naturalcure', moves: ['reflecttype', 'recover'] },
						{ species: 'Mandibuzz', ability: 'overcoat', moves: ['knockoff'] },
					], [
						{ species: 'Zoroark', ability: 'illusion', moves: ['shadowball, focusblast'] },
						{ species: 'Gothitelle', ability: 'competitive', moves: ['calmmind'] },
						{ species: 'Gengar', ability: 'levitate', moves: ['shadowball, focusblast'] },
					],
				]);
				const target = battle.p1.active[0];

				battle.makeChoices('move reflecttype', 'switch 3');

				// The real Gengar comes in, but p1 only sees a Gengar being switched by another Gengar, implying Illusion.
				// For a naive client, Starmie turns into Ghost/Poison, and it will be correct.
				assert.equal(target.getTypes().join('/'), 'Ghost/Poison');

				// Trapping with Gengar-Mega is a guaranteed trapping, so we are going to get a very meta
				// Competitive Gothitelle into the battle field (Frisk is revealed on switch-in).
				battle.makeChoices('move recover', 'switch 2');

				assert(target.maybeTrapped, `${target} should be flagged as maybe trapped`);

				battle.choose('p1', 'switch 2');
				// NOTE: noCancel is global so it still true even though the Pokemon can't undo.
				assert(!battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') assert.cantUndo(() => battle.undoChoice('p1'));
				assert.cantUndo(() => battle.choose('p1', 'move recover'));
				battle.choose('p2', 'move 1');

				assert.species(battle.p1.active[0], 'Mandibuzz');
			});

			it(`should disallow to ${mode} switch decisions on move requests by default`, () => {
				const TEAMS = [[
					{ species: 'Bulbasaur', ability: 'overgrow', moves: ['synthesis'] },
					{ species: 'Ivysaur', ability: 'overgrow', moves: ['synthesis'] },
					{ species: 'Venusaur', ability: 'overgrow', moves: ['synthesis'] },
				], [
					{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] },
				]];
				battle = common.createBattle(TEAMS);

				battle.choose('p1', 'switch 2');
				assert(battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') assert.cantUndo(() => battle.undoChoice('p1'));
				assert.cantUndo(() => battle.choose('p1', 'move synthesis'));
				battle.choose('p2', 'move scratch');

				for (const [index, species] of ['Ivysaur', 'Bulbasaur', 'Venusaur'].entries()) {
					assert.species(battle.p1.pokemon[index], species);
				}

				battle.destroy();
				battle = common.createBattle(TEAMS);

				battle.choose('p1', 'switch 2');
				assert(battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') assert.cantUndo(() => battle.undoChoice('p1'));
				assert.cantUndo(() => battle.choose('p1', 'switch 3'));
				battle.choose('p2', 'move scratch');

				for (const [index, species] of ['Ivysaur', 'Bulbasaur', 'Venusaur'].entries()) {
					assert.species(battle.p1.pokemon[index], species);
				}
			});

			it(`should support to ${mode} shift decisions on move requests`, () => {
				const TEAMS = [[
					{ species: 'Bulbasaur', ability: 'overgrow', moves: ['synthesis'] },
					{ species: 'Ivysaur', ability: 'overgrow', moves: ['synthesis'] },
					{ species: 'Venusaur', ability: 'overgrow', moves: ['synthesis'] },
				], [
					{ species: 'Aggron', ability: 'sturdy', moves: ['irondefense'] },
					{ species: 'Aggron', ability: 'sturdy', moves: ['irondefense'] },
					{ species: 'Aggron', ability: 'sturdy', moves: ['irondefense'] },
				]];
				battle = common.gen(5).createBattle({ gameType: 'triples', cancel: true }, TEAMS);

				battle.choose('p1', 'shift, move 1, move 1');
				assert(!battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.makeChoices('move 1, move 1, move 1', 'move 1, move 1, move 1');

				for (const [index, species] of ['Bulbasaur', 'Ivysaur', 'Venusaur'].entries()) {
					assert.species(battle.p1.active[index], species);
				}
				assert.equal(battle.p1.active[0].lastMove.id, 'synthesis');

				battle.destroy();
				battle = common.gen(5).createBattle({ gameType: 'triples', cancel: true }, TEAMS);

				battle.choose('p1', 'move 1, move 1, shift');
				assert(!battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.makeChoices('move 1, move 1, move 1', 'move 1, move 1, move 1');

				for (const [index, species] of ['Bulbasaur', 'Ivysaur', 'Venusaur'].entries()) {
					assert.species(battle.p1.active[index], species);
				}
				assert.equal(battle.p1.active[2].lastMove.id, 'synthesis');
			});

			it(`should disallow to ${mode} shift decisions by default`, () => {
				const TEAMS = [[
					{ species: 'Bulbasaur', ability: 'overgrow', moves: ['synthesis'] },
					{ species: 'Ivysaur', ability: 'overgrow', moves: ['growth'] },
					{ species: 'Venusaur', ability: 'overgrow', moves: ['synthesis'] },
				], [
					{ species: 'Aggron', ability: 'sturdy', moves: ['irondefense'] },
					{ species: 'Aggron', ability: 'sturdy', moves: ['irondefense'] },
					{ species: 'Aggron', ability: 'sturdy', moves: ['irondefense'] },
				]];
				battle = common.gen(5).createBattle({ gameType: 'triples' }, TEAMS);

				battle.choose('p1', 'shift, move 1, move 1');
				assert(battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') assert.cantUndo(() => battle.undoChoice('p1'));
				assert.cantUndo(() => battle.choose('p1', 'move 1, move 1, move 1'));
				battle.choose('p2', 'move 1, move 1, move 1');

				for (const [index, species] of ['Ivysaur', 'Bulbasaur', 'Venusaur'].entries()) {
					assert.species(battle.p1.active[index], species);
				}
				assert.equal(battle.p1.active[0].lastMove.id, 'growth');

				battle.destroy();
				battle = common.gen(5).createBattle({ gameType: 'triples' }, TEAMS);

				battle.choose('p1', 'move 1, move 1, shift');
				assert(battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') assert.cantUndo(() => battle.undoChoice('p1'));
				assert.cantUndo(() => battle.choose('p1', 'move 1, move 1, move 1'));
				battle.choose('p2', 'move 1, move 1, move 1');

				for (const [index, species] of ['Bulbasaur', 'Venusaur', 'Ivysaur'].entries()) {
					assert.species(battle.p1.active[index], species);
				}
				assert.equal(battle.p1.active[2].lastMove.id, 'growth');
			});

			it(`should support to ${mode} switch decisions on double switch requests`, () => {
				battle = common.createBattle({ cancel: true });
				battle.setPlayer('p1', { team: [
					{ species: "Deoxys-Attack", ability: 'pressure', moves: ['explosion'] },
					{ species: "Bulbasaur", ability: 'overgrow', moves: ['tackle'] },
					{ species: "Chikorita", ability: 'overgrow', moves: ['tackle'] },
				] });
				battle.setPlayer('p2', { team: [
					{ species: "Caterpie", ability: 'shielddust', moves: ['tackle'] },
					{ species: "Charmander", ability: 'blaze', moves: ['tackle'] },
				] });

				battle.makeChoices('move explosion', 'move tackle');

				battle.choose('p1', 'switch 2');
				assert(!battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.makeChoices('switch 3', 'switch 2');

				assert.equal(battle.turn, 2);
				assert.equal(battle.p1.active[0].species.name, 'Chikorita');
				assert.equal(battle.p2.active[0].species.name, 'Charmander');
			});

			it(`should support to ${mode} pass decisions on double switch requests`, () => {
				battle = common.createBattle({ cancel: true, gameType: 'doubles' });
				battle.setPlayer('p1', { team: [
					{ species: "Deoxys-Attack", ability: 'pressure', moves: ['explosion'] },
					{ species: "Bulbasaur", ability: 'overgrow', moves: ['tackle'] },
					{ species: "Chikorita", ability: 'overgrow', moves: ['tackle'] },
				] });
				battle.setPlayer('p2', { team: [
					{ species: "Caterpie", ability: 'shielddust', moves: ['tackle'] },
					{ species: "Charmander", ability: 'blaze', moves: ['tackle'] },
					{ species: "Cyndaquil", ability: 'blaze', moves: ['tackle'] },
				] });

				battle.makeChoices('move explosion, move tackle 1', 'move tackle 1, move tackle 1');

				battle.choose('p1', 'pass, switch 3');
				assert(!battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.makeChoices('switch 3, pass', 'pass, switch 3');

				for (const [index, species] of ['Chikorita', 'Bulbasaur'].entries()) {
					assert.species(battle.p1.active[index], species);
				}
			});

			it(`should disallow to ${mode} switch decisions on switch requests by default`, () => {
				const TEAMS = [[
					{ species: 'Latias', ability: 'levitate', moves: ['lunardance'] },
					{ species: 'Clefable', ability: 'unaware', moves: ['healingwish'] },
					{ species: 'Ivysaur', ability: 'overgrow', moves: ['tackle'] },
					{ species: 'Venusaur', ability: 'overgrow', moves: ['tackle'] },
				], [
					{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] },
					{ species: 'Charmeleon', ability: 'blaze', moves: ['scratch'] },
					{ species: 'Charizard', ability: 'blaze', moves: ['scratch'] },
				]];

				battle = common.createBattle({ gameType: 'doubles', cancel: true }, TEAMS);
				battle.makeChoices('move lunardance, move healingwish', 'move scratch 1, move scratch 1');

				battle.choose('p1', 'switch 3, switch 4');
				assert(!battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') battle.undoChoice('p1');
				assert.throws(
					() => battle.makeChoices('switch 4, switch 3', 'pass'),
					/\[Invalid choice\] Can't switch: You can't switch to a fainted Pokémon/,
					`Expected switch to fail`
				);

				for (const [index, species] of ['Ivysaur', 'Venusaur'].entries()) {
					assert.species(battle.p1.active[index], species);
				}
			});

			it(`should disallow to ${mode} pass decisions on switch requests by default`, () => {
				const TEAMS = [[
					{ species: 'Latias', ability: 'levitate', moves: ['lunardance'] },
					{ species: 'Clefable', ability: 'overgrow', moves: ['healingwish'] },
					{ species: 'Venusaur', ability: 'overgrow', moves: ['tackle'] },
				], [
					{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] },
					{ species: 'Charmeleon', ability: 'blaze', moves: ['scratch'] },
					{ species: 'Charizard', ability: 'blaze', moves: ['scratch'] },
				]];

				battle = common.createBattle({ gameType: 'doubles' }, TEAMS);
				battle.makeChoices('move lunardance, move healingwish', 'move scratch 1, move scratch 1');

				battle.choose('p1', 'pass, switch 3');
				assert(battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') battle.undoChoice('p1');
				assert.throws(
					() => battle.makeChoices('switch 3, pass', 'pass'),
					/\[Invalid choice\] Can't switch: You can't switch to a fainted Pokémon/,
					`Expected switch to fail`
				);

				for (const [index, species] of ['Latias', 'Venusaur'].entries()) {
					assert.species(battle.p1.active[index], species);
				}
			});

			it(`should disallow to ${mode} switch decisions on double switch requests by default`, () => {
				battle = common.createBattle();
				battle.setPlayer('p1', { team: [
					{ species: "Deoxys-Attack", ability: 'pressure', moves: ['explosion'] },
					{ species: "Bulbasaur", ability: 'overgrow', moves: ['tackle'] },
					{ species: "Chikorita", ability: 'overgrow', moves: ['tackle'] },
				] });
				battle.setPlayer('p2', { team: [
					{ species: "Caterpie", ability: 'shielddust', moves: ['tackle'] },
					{ species: "Charmander", ability: 'blaze', moves: ['tackle'] },
				] });

				battle.makeChoices('move explosion', 'move tackle');

				battle.choose('p1', 'switch 2');
				assert(battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') assert.cantUndo(() => battle.undoChoice('p1'));
				assert.cantUndo(() => battle.choose('p1', 'switch 3'));
				battle.choose('p2', 'switch 2');

				assert.species(battle.p1.active[0], 'Bulbasaur');
				assert.species(battle.p2.active[0], 'Charmander');
			});

			it(`should disallow to ${mode} pass decisions on double switch requests by default`, () => {
				battle = common.createBattle({ gameType: 'doubles' });
				battle.setPlayer('p1', { team: [
					{ species: "Deoxys-Attack", ability: 'pressure', moves: ['explosion'] },
					{ species: "Bulbasaur", ability: 'overgrow', moves: ['tackle'] },
					{ species: "Chikorita", ability: 'overgrow', moves: ['tackle'] },
				] });
				battle.setPlayer('p2', { team: [
					{ species: "Caterpie", ability: 'shielddust', moves: ['tackle'] },
					{ species: "Charmander", ability: 'blaze', moves: ['tackle'] },
					{ species: "Cyndaquil", ability: 'blaze', moves: ['tackle'] },
				] });

				battle.makeChoices('move explosion, move tackle 1', 'move tackle 1, move tackle 1');

				battle.choose('p1', 'pass, switch 3');
				assert(battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') assert.cantUndo(() => battle.undoChoice('p1'));
				assert.cantUndo(() => battle.choose('p1', 'switch 3, pass'));
				battle.choose('p2', 'pass, switch 3');

				for (const [index, species] of ['Deoxys-Attack', 'Chikorita'].entries()) {
					assert.species(battle.p1.active[index], species);
				}
			});

			it(`should support to ${mode} team order action on team preview requests`, () => {
				battle = common.createBattle({ preview: true, cancel: true }, [
					[{ species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle'] }, { species: 'Ivysaur', ability: 'overgrow', moves: ['tackle'] }],
					[{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] }, { species: 'Charmeleon', ability: 'blaze', moves: ['scratch'] }],
				]);

				battle.choose('p1', 'team 12');
				assert(!battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.makeChoices('team 21', 'team 12');

				for (const [index, species] of ['Ivysaur', 'Bulbasaur'].entries()) {
					assert.species(battle.p1.pokemon[index], species);
				}
				battle.destroy();

				battle = common.createBattle({ preview: true, cancel: true }, [
					[{ species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle'] }, { species: 'Ivysaur', ability: 'overgrow', moves: ['tackle'] }],
					[{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] }, { species: 'Charmeleon', ability: 'blaze', moves: ['scratch'] }],
				]);

				battle.choose('p1', 'team 21');
				assert(!battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') battle.undoChoice('p1');
				battle.makeChoices('team 12', 'team 12');

				for (const [index, species] of ['Bulbasaur', 'Ivysaur'].entries()) {
					assert.species(battle.p1.pokemon[index], species);
				}
			});

			it(`should disallow to ${mode} team order action on team preview requests by default`, () => {
				battle = common.createBattle({ preview: true }, [
					[{ species: 'Bulbasaur', ability: 'overgrow', moves: ['tackle'] }, { species: 'Ivysaur', ability: 'overgrow', moves: ['tackle'] }],
					[{ species: 'Charmander', ability: 'blaze', moves: ['scratch'] }, { species: 'Charmeleon', ability: 'blaze', moves: ['scratch'] }],
				]);

				battle.choose('p1', 'team 12');
				assert(battle.p1.activeRequest.noCancel);
				if (mode === 'revoke') assert.cantUndo(() => battle.undoChoice('p1'));
				assert.cantUndo(() => battle.choose('p1', 'team 21'));
				battle.choose('p2', 'team 12');

				for (const [index, species] of ['Bulbasaur', 'Ivysaur'].entries()) {
					assert.species(battle.p1.pokemon[index], species);
				}
			});
		}
	});
});

describe('Choice internals', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should allow input of move commands in a per Pokémon basis', () => {
		battle = common.createBattle({ gameType: 'doubles' });
		battle.setPlayer('p1', { team: [
			{ species: "Mew", ability: 'synchronize', moves: ['recover'] },
			{ species: "Bulbasaur", ability: 'overgrow', moves: ['growl', 'synthesis'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: "Pupitar", ability: 'shedskin', moves: ['surf'] }, // faster than Bulbasaur
			{ species: "Arceus", ability: 'multitype', moves: ['calmmind'] },
		] });
		const [p1, p2] = battle.sides;

		assert.equal(battle.turn, 1);

		p1.chooseMove(1);
		p1.chooseMove(1);
		p2.chooseMove(1);
		p2.chooseMove(1);
		battle.commitChoices();

		assert.equal(battle.turn, 2);
		assert.statStage(p2.active[0], 'atk', -1);

		p1.chooseMove('recover');
		p1.chooseMove('synthesis');
		p2.chooseMove('surf');
		p2.chooseMove('calmmind');
		battle.commitChoices();

		assert.equal(battle.turn, 3);
		assert.fullHP(p1.active[1]);

		p1.chooseMove('recover');
		p1.chooseMove('2');
		p2.chooseMove('1');
		p2.chooseMove('calmmind');
		battle.commitChoices();

		assert.equal(battle.turn, 4);
		assert.fullHP(p1.active[1]);
	});

	it('should allow input of switch commands in a per Pokémon basis', () => {
		battle = common.createBattle({ gameType: 'doubles' });
		battle.setPlayer('p1', { team: [
			{ species: "Mew", ability: 'synchronize', moves: ['selfdestruct'] },
			{ species: "Bulbasaur", ability: 'overgrow', moves: ['selfdestruct'] },
			{ species: "Koffing", ability: 'levitate', moves: ['smog'] },
			{ species: "Ekans", ability: 'shedskin', moves: ['leer'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: "Deoxys-Defense", ability: 'pressure', moves: ['recover'] },
			{ species: "Arceus", ability: 'multitype', moves: ['recover'] },
		] });
		const [p1, p2] = battle.sides;

		assert.equal(battle.turn, 1);
		p1.chooseMove('selfdestruct');
		p1.chooseMove('selfdestruct');
		p2.chooseMove('recover');
		p2.chooseMove('recover');
		battle.commitChoices();

		assert.fainted(p1.active[0]);
		assert.fainted(p1.active[1]);
		p1.chooseSwitch(4);
		p1.chooseSwitch(3);
		battle.commitChoices();
		assert.equal(battle.turn, 2);
		assert.equal(p1.active[0].name, 'Ekans');
		assert.equal(p1.active[1].name, 'Koffing');
	});

	it('should allow input of move and switch commands in a per Pokémon basis', () => {
		battle = common.createBattle({ gameType: 'doubles' });
		battle.setPlayer('p1', { team: [
			{ species: "Mew", ability: 'synchronize', moves: ['recover'] },
			{ species: "Bulbasaur", ability: 'overgrow', moves: ['growl', 'synthesis'] },
			{ species: "Koffing", ability: 'levitate', moves: ['smog'] },
			{ species: "Ekans", ability: 'shedskin', moves: ['leer'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: "Deoxys-Defense", ability: 'pressure', moves: ['recover'] },
			{ species: "Arceus", ability: 'multitype', moves: ['recover'] },
		] });
		const [p1, p2] = battle.sides;

		assert.equal(battle.turn, 1);
		p1.choose('move recover, switch 4');
		assert.throws(
			() => p2.choose('switch 3'),
			/\[Invalid choice\] Can't switch: You do not have a Pokémon in slot 3 to switch to/,
			`Expected switch to fail`
		);
		p2.choose('move recover, move recover');
		battle.commitChoices();

		assert.equal(battle.turn, 2);
		assert.equal(p1.active[0].name, 'Mew');
		assert.equal(p1.active[1].name, 'Ekans');

		p1.choose('switch 4, move leer');
		assert.throws(
			() => p2.choose('switch 3'),
			/\[Invalid choice\] Can't switch: You do not have a Pokémon in slot 3 to switch to/,
			`Expected switch to fail`
		);
		p2.choose('move recover, move recover');
		battle.commitChoices();

		assert.equal(battle.turn, 3);
		assert.equal(p1.active[0].name, 'Bulbasaur');
		assert.equal(p1.active[1].name, 'Ekans');
	});

	it('should empty the actions list when undoing a move', () => {
		battle = common.createBattle({ gameType: 'doubles', cancel: true });
		battle.setPlayer('p1', { team: [
			{ species: "Pineco", ability: 'sturdy', moves: ['selfdestruct'] },
			{ species: "Geodude", ability: 'sturdy', moves: ['selfdestruct'] },
			{ species: "Koffing", ability: 'levitate', moves: ['smog'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
			{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
		] });
		const p1 = battle.p1;

		p1.chooseMove(1);
		assert(p1.choice.actions.length > 0);
		battle.undoChoice('p1');
		assert.false(p1.choice.actions.length > 0);

		battle.makeChoices('default', 'default');

		assert.fainted(p1.active[0]);
		assert.fainted(p1.active[1]);
	});

	it('should empty the actions list when undoing a switch', () => {
		battle = common.createBattle({ gameType: 'doubles', cancel: true });
		battle.setPlayer('p1', { team: [
			{ species: "Pineco", ability: 'sturdy', moves: ['selfdestruct'] },
			{ species: "Geodude", ability: 'sturdy', moves: ['selfdestruct'] },
			{ species: "Koffing", ability: 'levitate', moves: ['smog'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
			{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
		] });
		const p1 = battle.p1;

		battle.makeChoices('move selfdestruct, move selfdestruct', 'move roost, move irondefense');

		p1.chooseSwitch(3);
		assert(p1.choice.actions.length > 0);
		battle.undoChoice('p1');
		assert.false(p1.choice.actions.length > 0);
		battle.makeChoices('pass, switch 3', '');

		assert.fainted(p1.active[0]);
		assert.species(p1.active[1], 'Koffing');
	});

	it('should empty the actions list when undoing a pass', () => {
		battle = common.createBattle({ gameType: 'doubles', cancel: true });
		battle.setPlayer('p1', { team: [
			{ species: "Pineco", ability: 'sturdy', moves: ['selfdestruct'] },
			{ species: "Geodude", ability: 'sturdy', moves: ['selfdestruct'] },
			{ species: "Koffing", ability: 'levitate', moves: ['smog'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
			{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
		] });
		const p1 = battle.p1;

		battle.makeChoices('move selfdestruct, move selfdestruct', 'move roost, move irondefense');

		p1.choosePass();
		assert(p1.choice.actions.length > 0);
		battle.undoChoice('p1');
		assert.false(p1.choice.actions.length > 0);
		battle.makeChoices('pass, switch 3', '');

		assert.fainted(p1.active[0]);
		assert.species(p1.active[1], 'Koffing');
	});

	it('should empty the actions list when undoing a shift', () => {
		battle = common.gen(5).createBattle({ gameType: 'triples', cancel: true });
		battle.supportCancel = true;
		battle.setPlayer('p1', { team: [
			{ species: "Pineco", ability: 'sturdy', moves: ['selfdestruct'] },
			{ species: "Geodude", ability: 'sturdy', moves: ['selfdestruct'] },
			{ species: "Gastly", ability: 'levitate', moves: ['lick'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
			{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
			{ species: "Golem", ability: 'sturdy', moves: ['defensecurl'] },
		] });
		const p1 = battle.p1;

		p1.chooseShift();
		assert(p1.choice.actions.length > 0);
		battle.undoChoice('p1');
		assert.false(p1.choice.actions.length > 0);
		battle.makeChoices('move 1, move 1, shift', 'default');

		assert.fainted(p1.active[0]);
		assert.fainted(p1.active[2]);
		assert.species(p1.active[1], 'Gastly');
		assert.false.fainted(p1.active[1]);
	});
});
