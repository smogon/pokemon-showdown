'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

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
			assert(battle.choose('p1', validDecision));
			battle.p1.clearChoice();
			assert(battle.choose('p2', validDecision));
			battle.p1.clearChoice();

			const badDecisions = ['move 1', 'move 2 mega', 'switch 1', 'pass', 'shift'];
			for (const badDecision of badDecisions) {
				assert.false(battle.choose('p1', badDecision), `Decision '${badDecision}' should be rejected`);
			}
		});

		it('should reject non-numerical choice details', function () {
			battle = common.createBattle({preview: true}, [
				[{species: "Mew", ability: 'synchronize', moves: ['recover']}],
				[{species: "Rhydon", ability: 'prankster', moves: ['splash']}],
			]);

			battle.sides.forEach(side => {
				assert.false(battle.choose(side.id, 'team Rhydon'));
				assert.false(battle.choose(side.id, 'team Mew'));
				assert.false(battle.choose(side.id, 'team first'));
			});
		});
	});

	describe('Switch requests', function () {
		describe('Generic', function () {
			it('should reject non-numerical input for `switch` choices', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [
					{species: "Mew", ability: 'synchronize', moves: ['lunardance']},
					{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']},
				]);
				battle.join('p2', 'Guest 2', 1, [{species: "Rhydon", ability: 'prankster', moves: ['splash']}]);

				battle.commitDecisions();

				assert.false(battle.choose('p1', 'switch Rhydon'));
				assert.false(battle.choose('p1', 'switch Bulbasaur'));
				assert.false(battle.choose('p1', 'switch first'));
				assert.false(battle.choose('p1', 'switch second'));
			});
		});

		describe('Singles', function () {
			it('should accept only `switch` choices', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [
					{species: "Mew", ability: 'synchronize', moves: ['lunardance']},
					{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']},
				]);
				battle.join('p2', 'Guest 2', 1, [{species: "Rhydon", ability: 'prankster', moves: ['splash']}]);

				battle.commitDecisions();

				const badDecisions = ['move 1', 'move 2 mega', 'team 1', 'pass', 'shift'];
				for (const badDecision of badDecisions) {
					assert.false(battle.choose('p1', badDecision), `Decision '${badDecision}' should be rejected`);
				}

				const validDecision = 'switch 2';
				assert(battle.choose('p1', validDecision));
				battle.p1.clearChoice();
			});
		});

		describe('Doubles/Triples', function () {
			it('should accept only `switch` and `pass` choices', function () {
				battle = common.createBattle({gameType: 'doubles'});
				battle.join('p1', 'Guest 1', 1, [
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

				const badDecisions = ['move 1', 'move 2 mega', 'team 1', 'shift'];
				for (const badDecision of badDecisions) {
					assert.false(battle.choose('p1', badDecision), `Decision '${badDecision}' should be rejected`);
				}

				assert(battle.choose('p1', `pass, switch 3`), `Decision 'pass, switch 3' should be valid`);
			});

			it('should reject choice details for `pass` choices', function () {
				battle = common.createBattle({gameType: 'doubles'});
				battle.join('p1', 'Guest 1', 1, [
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

				assert.false(battle.choose('p1', `${switchChoice}, ${passChoice} 1`));
				assert.false(battle.choose('p1', `${passChoice} 1, ${switchChoice}`));
				assert.false(battle.choose('p1', `${switchChoice}, ${passChoice} a`));
				assert.false(battle.choose('p1', `${passChoice} a, ${switchChoice}`));
			});
		});
	});

	describe('Move requests', function () {
		describe('Generic', function () {
			it('should reject `pass` choices for non-fainted Pokémon', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['recover']}]);
				battle.join('p2', 'Guest 2', 1, [{species: "Rhydon", ability: 'prankster', moves: ['splash']}]);

				battle.sides.forEach(side => assert.false(battle.choose(side.id, 'pass')));
			});
		});

		describe('Singles', function () {
			it('should accept only `move` and `switch` choices', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [
					{species: "Mew", ability: 'synchronize', moves: ['lunardance', 'recover']},
					{species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl']},
				]);
				battle.join('p2', 'Guest 2', 1, [
					{species: "Rhydon", ability: 'prankster', moves: ['splash', 'horndrill']},
					{species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl']},
				]);

				const validDecisions = ['move 1', 'move 2', 'switch 2'];
				for (const decision of validDecisions) {
					assert(battle.choose('p1', decision), `Decision '${decision}' should be valid`);
					battle.p1.clearChoice();
				}

				const badDecisions = ['move 1 zmove', 'move 2 mega', 'team 1', 'pass', 'shift'];
				for (const badDecision of badDecisions) {
					assert.false(battle.choose('p1', badDecision), `Decision '${badDecision}' should be rejected`);
				}
			});
		});

		describe('Doubles', function () {
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
				battle.choose('p1', 'pass, switch 3'); // Koffing switches in at slot #2

				assert.fainted(p1.active[0]);
				assert.species(p1.active[1], 'Koffing');
				assert.false.fainted(p1.active[1]);

				assert(battle.choose('p1', 'move smog 2'));
				assert.strictEqual(battle.p1.getChoice(true), `pass, move smog 2`, `Decision mismatch`);
			});
		});

		describe('Triples', function () {
			it('should accept only `move` and `switch` choices for a healthy Pokémon on the center', function () {
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
				]);

				const validDecisions = ['move 1', 'switch 4'];

				validDecisions.forEach(decision => {
					const choiceString = `move 1, ${decision}, move 1 1`;
					assert(battle.choose('p1', choiceString), `Decision '${choiceString}' should be valid`);
					battle.p1.clearChoice();
				});

				const badDecisions = ['move 1 zmove', 'move 2 mega', 'team 1', 'pass', 'shift'];
				for (const badDecision of badDecisions) {
					const choiceString = `move 1, ${badDecision}, move 1 1`;
					assert.false(battle.choose('p1', choiceString), `Decision '${choiceString}' should be rejected`);
				}
			});

			it('should accept only `move`, `switch` and `shift` choices for a healthy Pokémon on the left', function () {
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

				const validDecisions = ['move 1', 'switch 4', 'shift'];

				validDecisions.forEach(decision => {
					const choiceString = `${decision}, move 1, move 1 1`;
					assert(battle.choose('p1', choiceString), `Decision '${choiceString}' should be valid`);
					battle.p1.clearChoice();
				});

				const badDecisions = ['move 1 zmove', 'move 2 mega', 'team 1', 'pass'];
				for (const badDecision of badDecisions) {
					const choiceString = `${badDecision}, move 1, move 1 1`;
					assert.false(battle.choose('p1', choiceString), `Decision '${choiceString}' should be rejected`);
				}
			});

			it('should accept only `move`, `switch` and `shift` choices for a healthy Pokémon on the right', function () {
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

				const validDecisions = ['move 1 1', 'switch 4', 'shift'];

				validDecisions.forEach(decision => {
					const choiceString = `move 1, move 1, ${decision}`;
					assert(battle.choose('p1', choiceString), `Decision '${choiceString}' should be valid`);
					battle.p1.clearChoice();
				});

				const badDecisions = ['move 1 zmove', 'move 2 mega', 'team 1', 'pass', 'shift blah'];
				for (const badDecision of badDecisions) {
					const choiceString = `move 1, move 1, ${badDecision}`;
					assert.false(battle.choose('p1', choiceString), `Decision '${choiceString}' should be rejected`);
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

				p1.choosePass().chooseSwitch(4).chooseDefault(); // Forretress switches in to slot #2
				assert.species(p1.active[1], 'Forretress');

				const validDecisions = ['move spikes', 'move 1'];
				validDecisions.forEach(decision => {
					battle.choose('p1', decision);
					assert.strictEqual(battle.p1.getChoice(true), `pass, move spikes, pass`);
					battle.p1.clearChoice();
					battle.choose('p1', `pass, ${decision}, pass`);
					assert.strictEqual(battle.p1.getChoice(true), `pass, move spikes, pass`);
					battle.p1.clearChoice();
					battle.choose('p1', `pass, ${decision}`);
					assert.strictEqual(battle.p1.getChoice(true), `pass, move spikes, pass`);
					battle.p1.clearChoice();
					battle.choose('p1', `${decision}, pass`);
					assert.strictEqual(battle.p1.getChoice(true), `pass, move spikes, pass`);
					battle.p1.clearChoice();
				});
			});
		});
	});
});
