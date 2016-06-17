'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const fuzzer = require('fuzzur').mutate;

const FUZZER_ITERATIONS = 20;

function serializeChoices(parsedChoice) {
	if (!parsedChoice) return '';
	return parsedChoice.map(choiceData => choiceData[1] ? choiceData.join(' ') : choiceData[0]).join(', ');
}

let battle;

describe('Choice parser', function () {
	afterEach(() => battle.destroy());
	describe('Team Preview requests', function () {
		it('should accept only `team` choices', function () {
			battle = common.createBattle({preview: true}, [
				[{species: "Mew", ability: 'synchronize', moves: ['recover']}],
				[{species: "Rhydon", ability: 'prankster', moves: ['splash']}],
			]);

			const validDecision = 'team 1';
			assert(battle.parseChoice(battle.p1, validDecision));
			assert(battle.parseChoice(battle.p2, validDecision));

			let remainingIterations = FUZZER_ITERATIONS;
			while (remainingIterations--) {
				const side = battle.sides[remainingIterations % 2];
				const mutatedDecision = fuzzer(validDecision);
				if (!mutatedDecision.startsWith('team ')) {
					assert.false(battle.parseChoice(side, mutatedDecision), `Decision '${mutatedDecision}' should be rejected`);
				}
			}
		});

		it('should reject empty or non-numerical choice details', function () {
			battle = common.createBattle({preview: true}, [
				[{species: "Mew", ability: 'synchronize', moves: ['recover']}],
				[{species: "Rhydon", ability: 'prankster', moves: ['splash']}],
			]);

			battle.sides.forEach(side => {
				assert.false(battle.parseChoice(side, 'team'));
				assert.false(battle.parseChoice(side, 'team '));
				assert.false(battle.parseChoice(side, 'team  '));
				assert.false(battle.parseChoice(side, 'team Rhydon'));
				assert.false(battle.parseChoice(side, 'team Mew'));
				assert.false(battle.parseChoice(side, 'team first'));

				let totalIterations = Math.ceil(FUZZER_ITERATIONS / 2);
				while (totalIterations--) {
					const data = fuzzer('1').trim();
					if (isNaN(data)) assert.false(battle.parseChoice(side, `team ${data}`));
				}
			});
		});
	});

	describe('Switch requests', function () {
		describe('Generic', function () {
			it('should reject empty or non-numerical input for `switch` choices', function () {
				battle = common.createBattle();
				const p1 = battle.join('p1', 'Guest 1', 1, [
					{species: "Mew", ability: 'synchronize', moves: ['lunardance']},
					{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']},
				]);
				battle.join('p2', 'Guest 2', 1, [{species: "Rhydon", ability: 'prankster', moves: ['splash']}]);

				battle.commitDecisions();

				assert.false(battle.parseChoice(p1, 'switch'));
				assert.false(battle.parseChoice(p1, 'switch '));
				assert.false(battle.parseChoice(p1, 'switch  '));
				assert.false(battle.parseChoice(p1, 'switch Rhydon'));
				assert.false(battle.parseChoice(p1, 'switch Bulbasaur'));
				assert.false(battle.parseChoice(p1, 'switch first'));
				assert.false(battle.parseChoice(p1, 'switch second'));

				let totalIterations = Math.ceil(FUZZER_ITERATIONS / 2);
				while (totalIterations--) {
					const data = fuzzer('2').trim();
					if (isNaN(data)) assert.false(battle.parseChoice(p1, `switch ${data}`, `Decision 'switch ${data}' should be rejected`));
				}
			});
		});

		describe('Singles', function () {
			it('should accept only `switch` choices', function () {
				battle = common.createBattle();
				const p1 = battle.join('p1', 'Guest 1', 1, [
					{species: "Mew", ability: 'synchronize', moves: ['lunardance']},
					{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']},
				]);
				battle.join('p2', 'Guest 2', 1, [{species: "Rhydon", ability: 'prankster', moves: ['splash']}]);

				battle.commitDecisions();

				const validDecision = 'switch 2';
				assert(battle.parseChoice(p1, validDecision));

				let remainingIterations = FUZZER_ITERATIONS;
				while (remainingIterations--) {
					const mutatedDecision = fuzzer(validDecision);
					if (!mutatedDecision.startsWith('switch ')) {
						assert.false(battle.parseChoice(p1, mutatedDecision), `Decision '${mutatedDecision}' should be rejected`);
					}
				}
			});
		});

		describe('Doubles/Triples', function () {
			it('should accept only `switch` and `pass` choices', function () {
				battle = common.createBattle({gameType: 'doubles'});
				const p1 = battle.join('p1', 'Guest 1', 1, [
					{species: "Pineco", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Geodude", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Koffing", ability: 'levitate', moves: ['smog']},
				]);
				battle.join('p2', 'Guest 2', 1, [
					{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
					{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
					{species: "Ekans", ability: 'shedskin', moves: ['wrap']},
				]);
				battle.commitDecisions(); // Both p1 active Pokémon faint

				const validDecisions = ['pass', 'switch 3'];
				validDecisions.forEach(leftDecision => {
					validDecisions.forEach(rightDecision => {
						assert(battle.parseChoice(p1, `${leftDecision}, ${rightDecision}`), `Decision '${leftDecision}, ${rightDecision}' should be valid`);
					});
				});

				let remainingIterations = FUZZER_ITERATIONS;
				while (remainingIterations--) {
					const side = battle.sides[remainingIterations % 2];
					const mutatedDecisions = Tools.shuffle(validDecisions.map(fuzzer)).slice(0, 2);
					if (mutatedDecisions.some(decision => decision && !decision.startsWith('switch ') && !decision.startsWith('pass '))) {
						const choiceString = mutatedDecisions.join(', ');
						assert.false(battle.parseChoice(side, choiceString), `Decision '${choiceString}' should be rejected`);
					}
				}
			});

			it('should reject choice details for `pass` choices', function () {
				battle = common.createBattle({gameType: 'doubles'});
				const p1 = battle.join('p1', 'Guest 1', 1, [
					{species: "Pineco", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Geodude", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Koffing", ability: 'levitate', moves: ['smog']},
				]);
				battle.join('p2', 'Guest 2', 1, [
					{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
					{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
					{species: "Ekans", ability: 'shedskin', moves: ['wrap']},
				]);
				battle.commitDecisions(); // Both p1 active Pokémon faint

				const switchChoice = 'switch 3';
				const passChoice = 'pass';

				assert.false(battle.parseChoice(p1, `${switchChoice}, ${passChoice} 1`));
				assert.false(battle.parseChoice(p1, `${passChoice} 1, ${switchChoice}`));
				assert.false(battle.parseChoice(p1, `${switchChoice}, ${passChoice} a`));
				assert.false(battle.parseChoice(p1, `${passChoice} a, ${switchChoice}`));

				let totalIterations = Math.ceil(FUZZER_ITERATIONS / 2);
				while (totalIterations--) {
					const data = fuzzer('2').replace(/[\s,]/g, '');
					if (data) {
						const decisions = totalIterations % 2 ? [switchChoice, `passChoice ${data}`] : [`passChoice ${data}`, switchChoice];
						assert.false(battle.parseChoice(p1, decisions.join(', ')));
					}
				}
			});
		});
	});

	describe('Move requests', function () {
		describe('Generic', function () {
			it('should be unaware of disabled moves', function () {
				battle = common.createBattle();
				const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Mew", item: 'assaultvest', ability: 'shadowtag', moves: ['recover']}]);
				const p2 = battle.join('p2', 'Guest 2', 1, [{species: "Rhydon", item: 'assaultvest', ability: 'shadowtag', moves: ['splash']}]);

				battle.sides.forEach(side => assert(battle.parseChoice(side, 'move 1')));
				assert.strictEqual(serializeChoices(battle.parseChoice(p1, 'move recover')), 'move recover');
				assert.strictEqual(serializeChoices(battle.parseChoice(p2, 'move sketch')), 'move sketch');
			});

			it('should be unaware of trapped Pokémon', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [
					{species: "Mew", item: 'assaultvest', ability: 'shadowtag', moves: ['recover']},
					{species: "Bulbasaur", item: '', ability: 'overgrow', moves: ['tackle', 'growl']},
				]);
				battle.join('p2', 'Guest 2', 1, [
					{species: "Rhydon", item: 'assaultvest', ability: 'shadowtag', moves: ['splash']},
					{species: "Charmander", item: '', ability: 'blaze', moves: ['tackle', 'growl']},
				]);

				battle.sides.forEach(side => assert(battle.parseChoice(side, 'switch 2')));
			});

			it('should reject `pass` choices for non-fainted Pokémon', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['recover']}]);
				battle.join('p2', 'Guest 2', 1, [{species: "Rhydon", ability: 'prankster', moves: ['splash']}]);

				battle.sides.forEach(side => assert.false(battle.parseChoice(side, 'pass')));
			});
		});

		describe('Singles', function () {
			it('should accept only `move` and `switch` choices', function () {
				battle = common.createBattle();
				const p1 = battle.join('p1', 'Guest 1', 1, [
					{species: "Mew", ability: 'synchronize', moves: ['lunardance', 'recover']},
					{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']},
				]);
				const p2 = battle.join('p2', 'Guest 2', 1, [
					{species: "Rhydon", ability: 'prankster', moves: ['splash', 'horndrill']},
					{species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl']},
				]);

				const validDecisions = ['move 1', 'move 2', 'switch 2'];
				validDecisions.forEach(decision => {
					assert(battle.parseChoice(p1, decision, `Decision '${decision}' should be valid`));
					assert(battle.parseChoice(p2, decision, `Decision '${decision}' should be valid`));
				});

				let remainingIterations = FUZZER_ITERATIONS;
				while (remainingIterations--) {
					const side = battle.sides[remainingIterations % 2];
					const mutatedDecision = Tools.shuffle(validDecisions.map(fuzzer))[0];
					if (!mutatedDecision.startsWith('move ') && !mutatedDecision.startsWith('switch ')) {
						assert.false(battle.parseChoice(side, mutatedDecision), `Decision '${mutatedDecision}' should be rejected`);
					}
				}
			});
		});

		describe('Doubles', function () {
			it('should accept only `move` and `switch` choices for healthy Pokémon', function () {
				battle = common.createBattle({gameType: 'doubles'});
				const p1 = battle.join('p1', 'Guest 1', 1, [
					{species: "Pineco", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Geodude", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Koffing", ability: 'levitate', moves: ['smog']},
				]);
				battle.join('p2', 'Guest 2', 1, [
					{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
					{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
					{species: "Ekans", ability: 'shedskin', moves: ['wrap']},
				]);

				const validDecisions = ['move 1', 'switch 3'];
				validDecisions.forEach(leftDecision => {
					validDecisions.forEach(rightDecision => {
						assert(battle.parseChoice(p1, `${leftDecision}, ${rightDecision}`), `Decision '${leftDecision}, ${rightDecision}' should be valid`);
					});
				});

				let remainingIterations = FUZZER_ITERATIONS;
				while (remainingIterations--) {
					const side = battle.sides[remainingIterations % 2];
					const mutatedDecisions = Tools.shuffle(validDecisions.map(fuzzer)).slice(0, 2).map(decision => decision.trim());
					if (mutatedDecisions.some(decision => decision && !decision.startsWith('move ') && !decision.startsWith('switch '))) {
						const choiceString = mutatedDecisions.join(', ');
						assert.false(battle.parseChoice(side, choiceString), `Decision '${choiceString}' should be rejected for ${side}`);
					}
				}
			});

			it('should enforce `pass` choices for fainted Pokémon', function () {
				battle = common.createBattle({gameType: 'doubles'});
				const p1 = battle.join('p1', 'Guest 1', 1, [
					{species: "Pineco", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Geodude", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Koffing", ability: 'levitate', moves: ['smog']},
				]);
				battle.join('p2', 'Guest 2', 1, [
					{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
					{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
				]);
				battle.commitDecisions(); // Both p1 active Pokémon faint
				p1.choosePass().chooseSwitch(3); // Koffing switches in at slot #2

				assert.fainted(p1.active[0]);
				assert.species(p1.active[1], 'Koffing');
				assert.false.fainted(p1.active[1]);

				assert(battle.parseChoice(p1, 'move smog'));

				const validDecisions = ['move smog', 'move 1'];
				validDecisions.forEach(decision => {
					assert.strictEqual(serializeChoices(battle.parseChoice(p1, `${decision}`)), `pass, ${decision}`, `Decision '${decision}' should be valid`);
					assert.strictEqual(serializeChoices(battle.parseChoice(p1, `pass, ${decision}`)), `pass, ${decision}`, `Decision 'pass, ${decision}' should be valid`);
				});

				let remainingIterations = FUZZER_ITERATIONS;
				while (remainingIterations--) {
					const mutatedDecision = fuzzer(validDecisions[remainingIterations % 2]).replace(/[\s,]/g, '');
					if (mutatedDecision !== 'pass') {
						validDecisions.forEach(healthyDecision => assert.false(battle.parseChoice(p1, `${mutatedDecision}, ${healthyDecision}`)));
					}
				}
			});
		});

		describe('Triples', function () {
			it('should accept only `move` and `switch` choices for a healthy Pokémon on the center', function () {
				battle = common.createBattle({gameType: 'triples'});
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

				const validDecisions = ['move 1', 'switch 4'];
				const otherDecisions = ['move 1', 'move 1'];

				validDecisions.forEach(decision => {
					const choiceString = [otherDecisions[0]].concat([decision]).concat(otherDecisions[1]).join(', ');
					assert(battle.parseChoice(p1, choiceString), `Decision '${choiceString}' should be valid`);
					assert(battle.parseChoice(p2, choiceString), `Decision '${choiceString}' should be valid`);
				});

				let remainingIterations = FUZZER_ITERATIONS;
				while (remainingIterations--) {
					const side = battle.sides[remainingIterations % 2];
					const mutatedDecision = fuzzer('').replace(/[\s,]/g, '');
					if (mutatedDecision && !mutatedDecision.startsWith('move') && !mutatedDecision.startsWith('switch ') && !mutatedDecision.startsWith('shift ')) {
						const choiceString = [otherDecisions[0]].concat([mutatedDecision]).concat(otherDecisions[1]).join(', ');
						assert.false(battle.parseChoice(side, choiceString));
					}
				}
			});

			it('should accept only `move`, `switch` and `shift` choices for a healthy Pokémon on the left', function () {
				battle = common.createBattle({gameType: 'triples'});
				const p1 = battle.join('p1', 'Guest 1', 1, [
					{species: "Pineco", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Geodude", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Gastly", ability: 'levitate', moves: ['lick']},
					{species: "Forretress", ability: 'levitate', moves: ['spikes']},
				]);
				const p2 = battle.join('p2', 'Guest 2', 1, [
					{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
					{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
					{species: "Golem", ability: 'sturdy', moves: ['defensecurl']},
					{species: "Magnezone", ability: 'magnetpull', moves: ['discharge']},
				]);

				const validDecisions = ['move 1', 'switch 4', 'shift'];
				const otherDecisions = ['move 1', 'move 1'];

				validDecisions.forEach(decision => {
					const choiceString = [decision].concat(otherDecisions).join(', ');
					assert(battle.parseChoice(p1, choiceString), `Decision '${choiceString}' should be valid`);
					assert(battle.parseChoice(p2, choiceString), `Decision '${choiceString}' should be valid`);
				});

				let remainingIterations = FUZZER_ITERATIONS;
				while (remainingIterations--) {
					const side = battle.sides[remainingIterations % 2];
					const mutatedDecision = fuzzer('').replace(/[\s,]/g, '');
					if (mutatedDecision && !mutatedDecision.startsWith('move') && !mutatedDecision.startsWith('switch ') && !mutatedDecision.startsWith('shift ')) {
						const choiceString = [mutatedDecision].concat(otherDecisions).join(', ');
						assert.false(battle.parseChoice(side, choiceString));
					}
				}
			});

			it('should accept only `move`, `switch` and `shift` choices for a healthy Pokémon on the right', function () {
				battle = common.createBattle({gameType: 'triples'});
				const p1 = battle.join('p1', 'Guest 1', 1, [
					{species: "Pineco", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Geodude", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Gastly", ability: 'levitate', moves: ['lick']},
					{species: "Forretress", ability: 'levitate', moves: ['spikes']},
				]);
				const p2 = battle.join('p2', 'Guest 2', 1, [
					{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
					{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
					{species: "Golem", ability: 'sturdy', moves: ['defensecurl']},
					{species: "Magnezone", ability: 'magnetpull', moves: ['discharge']},
				]);

				const validDecisions = ['move 1', 'switch 4', 'shift'];
				const otherDecisions = ['move 1', 'move 1'];

				validDecisions.forEach(decision => {
					const choiceString = otherDecisions.concat([decision]).join(', ');
					assert(battle.parseChoice(p1, choiceString), `Decision '${choiceString}' should be valid`);
					assert(battle.parseChoice(p2, choiceString), `Decision '${choiceString}' should be valid`);
				});

				let remainingIterations = FUZZER_ITERATIONS;
				while (remainingIterations--) {
					const side = battle.sides[remainingIterations % 2];
					const mutatedDecision = fuzzer('').replace(/[\s,]/g, '');
					if (mutatedDecision && !mutatedDecision.startsWith('move') && !mutatedDecision.startsWith('switch ') && !mutatedDecision.startsWith('shift ')) {
						const choiceString = otherDecisions.concat([mutatedDecision]).join(', ');
						assert.false(battle.parseChoice(side, choiceString));
					}
				}
			});

			it('should reject choice details for `shift` choices', function () {
				battle = common.createBattle({gameType: 'triples'});
				battle.join('p1', 'Guest 1', 1, [
					{species: "Pineco", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Geodude", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Gastly", ability: 'levitate', moves: ['lick']},
					{species: "Forretress", ability: 'levitate', moves: ['spikes']},
				]);
				battle.join('p2', 'Guest 2', 1, [
					{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
					{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
					{species: "Golem", ability: 'sturdy', moves: ['defensecurl']},
					{species: "Magnezone", ability: 'magnetpull', moves: ['discharge']},
				]);

				const validDecision = 'shift';
				const otherDecisions = ['move 1', 'move 1'];

				let remainingIterations = FUZZER_ITERATIONS;
				while (remainingIterations--) {
					const side = battle.sides[remainingIterations % 2];
					const choiceData = fuzzer('').replace(/[\s,]/g, '');
					if (choiceData.trim().length) {
						const mutatedDecision = [`${validDecision} ${choiceData}`].concat(otherDecisions).join(', ');
						assert.false(battle.parseChoice(side, mutatedDecision));
					}
				}
			});

			it('should enforce `pass` choices for fainted Pokémon', function () {
				battle = common.createBattle({gameType: 'triples'});
				const p1 = battle.join('p1', 'Guest 1', 1, [
					{species: "Pineco", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Geodude", ability: 'sturdy', moves: ['selfdestruct']},
					{species: "Gastly", ability: 'levitate', moves: ['lunardance']},
					{species: "Forretress", ability: 'levitate', moves: ['spikes']},
				]);
				battle.join('p2', 'Guest 2', 1, [
					{species: "Skarmory", ability: 'sturdy', moves: ['roost']},
					{species: "Aggron", ability: 'sturdy', moves: ['irondefense']},
					{species: "Golem", ability: 'sturdy', moves: ['defensecurl']},
				]);
				battle.commitDecisions(); // All p1 active Pokémon faint

				p1.choosePass().chooseSwitch(4).chooseDefault(); // Forretress switches in to slot #3
				assert.species(p1.active[1], 'Forretress');

				const validDecisions = ['move spikes', 'move 1'];
				validDecisions.forEach(decision => {
					assert.strictEqual(serializeChoices(battle.parseChoice(p1, decision)), `pass, ${decision}, pass`);
					assert.strictEqual(serializeChoices(battle.parseChoice(p1, `pass, ${decision}, pass`)), `pass, ${decision}, pass`);
					assert.strictEqual(serializeChoices(battle.parseChoice(p1, `pass, ${decision}`)), `pass, ${decision}, pass`);
					assert.strictEqual(serializeChoices(battle.parseChoice(p1, `${decision}, pass`)), `pass, ${decision}, pass`);
				});

				let remainingIterations = FUZZER_ITERATIONS;
				while (remainingIterations--) {
					const forryDecision = Tools.shuffle(validDecisions.slice())[0];
					const mutatedDecisions = ([
						Math.random() > 0.5 ? Tools.shuffle(validDecisions.map(fuzzer))[0].replace(/[\s,]/g, '') : '',
					].concat([
						forryDecision,
					]).concat([
						Math.random() > 0.5 ? Tools.shuffle(validDecisions.map(fuzzer))[0].replace(/[\s,]/g, '') : '',
					]));

					if (mutatedDecisions[0] && mutatedDecisions[0] !== 'pass' || mutatedDecisions[2] && mutatedDecisions[2] !== 'pass') {
						const mutatedDecision = mutatedDecisions.filter(choice => choice).join(', ');
						assert.false(battle.parseChoice(p1, mutatedDecision), `Decision '${mutatedDecision}' should be rejected`);
					}
				}
			});
		});
	});
});