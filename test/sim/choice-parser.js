'use strict';

const assert = require('./../assert');
const common = require('./../common');

let battle;

describe('Choice parser', () => {
	afterEach(() => battle.destroy());
	describe('Team Preview requests', () => {
		it('should accept only `team` choices', () => {
			battle = common.createBattle({ preview: true }, [
				[{ species: "Mew", ability: 'synchronize', moves: ['recover'] }],
				[{ species: "Rhydon", ability: 'prankster', moves: ['splash'] }],
			]);

			const validChoice = 'team 1';
			assert(battle.choose('p1', validChoice));
			battle.p1.clearChoice();
			assert(battle.choose('p2', validChoice));
			battle.p1.clearChoice();

			const badChoices = ['move 1', 'move 2 mega', 'switch 1', 'pass', 'shift'];
			for (const badChoice of badChoices) {
				assert.throws(() => battle.choose('p1', badChoice));
			}
		});

		it('should reject non-numerical choice details', () => {
			battle = common.createBattle({ preview: true }, [
				[{ species: "Mew", ability: 'synchronize', moves: ['recover'] }],
				[{ species: "Rhydon", ability: 'prankster', moves: ['splash'] }],
			]);

			for (const side of battle.sides) {
				assert.throws(() => battle.choose(side.id, 'team Rhydon'));
				assert.throws(() => battle.choose(side.id, 'team Mew'));
				assert.throws(() => battle.choose(side.id, 'team first'));
			}
		});

		it('should reject zero-based choice details', () => {
			battle = common.createBattle({ preview: true }, [
				[{ species: "Mew", ability: 'synchronize', moves: ['recover'] }],
				[{ species: "Rhydon", ability: 'prankster', moves: ['splash'] }],
			]);

			for (const side of battle.sides) {
				assert.throws(
					() => battle.choose(side.id, 'team 0'),
					/\[Invalid choice\] Can't choose for Team Preview:/i,
					`Input should have been rejected`
				);
			}
		});
	});

	describe('Switch requests', () => {
		describe('Generic', () => {
			it('should reject non-numerical input for `switch` choices', () => {
				battle = common.createBattle();
				battle.setPlayer('p1', { team: [
					{ species: "Mew", ability: 'synchronize', moves: ['lunardance'] },
					{ species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl'] },
				] });
				battle.setPlayer('p2', { team: [{ species: "Rhydon", ability: 'prankster', moves: ['splash'] }] });

				battle.makeChoices('move lunardance', 'move splash');

				assert.throws(() => battle.choose('p1', 'switch first'));
				assert.throws(() => battle.choose('p1', 'switch second'));
			});
		});

		describe('Singles', () => {
			it('should accept only `switch` choices', () => {
				battle = common.createBattle();
				battle.setPlayer('p1', { team: [
					{ species: "Mew", ability: 'synchronize', moves: ['lunardance'] },
					{ species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl'] },
				] });
				battle.setPlayer('p2', { team: [{ species: "Rhydon", ability: 'prankster', moves: ['splash'] }] });

				battle.makeChoices('move lunardance', 'move splash');

				const badChoices = ['move 1', 'move 2 mega', 'team 1', 'pass', 'shift'];
				for (const badChoice of badChoices) {
					assert.throws(() => battle.p1.choose(badChoice));
				}

				const validChoice = 'switch Bulbasaur';
				assert(battle.p1.choose(validChoice));
				battle.p1.clearChoice();
			});
		});

		describe('Doubles/Triples', () => {
			it('should accept only `switch` and `pass` choices', () => {
				battle = common.createBattle({ gameType: 'doubles' });
				battle.setPlayer('p1', { team: [
					{ species: "Pineco", ability: 'sturdy', moves: ['selfdestruct'] },
					{ species: "Geodude", ability: 'sturdy', moves: ['selfdestruct'] },
					{ species: "Koffing", ability: 'levitate', moves: ['smog'] },
				] });
				battle.setPlayer('p2', { team: [
					{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
					{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
					{ species: "Ekans", ability: 'shedskin', moves: ['wrap'] },
				] });
				battle.makeChoices('move selfdestruct, move selfdestruct', 'move roost, move irondefense'); // Both p1 active Pokémon faint

				const badChoices = ['move 1', 'move 2 mega', 'team 1', 'shift'];
				for (const badChoice of badChoices) {
					assert.throws(() => battle.p1.choose(badChoice));
				}

				assert(battle.p1.choose(`pass, switch 3`), `Choice 'pass, switch 3' should be valid`);
			});

			it('should reject choice details for `pass` choices', () => {
				battle = common.createBattle({ gameType: 'doubles' });
				battle.setPlayer('p1', { team: [
					{ species: "Pineco", ability: 'sturdy', moves: ['selfdestruct'] },
					{ species: "Geodude", ability: 'sturdy', moves: ['selfdestruct'] },
					{ species: "Koffing", ability: 'levitate', moves: ['smog'] },
				] });
				battle.setPlayer('p2', { team: [
					{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
					{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
					{ species: "Ekans", ability: 'shedskin', moves: ['wrap'] },
				] });
				battle.makeChoices('move selfdestruct, move selfdestruct', 'move roost, move irondefense'); // Both p1 active Pokémon faint

				const switchChoice = 'switch 3';
				const passChoice = 'pass';

				assert.throws(() => battle.choose('p1', `${switchChoice}, ${passChoice} 1`));
				assert.throws(() => battle.choose('p1', `${passChoice} 1, ${switchChoice}`));
				assert.throws(() => battle.choose('p1', `${switchChoice}, ${passChoice} a`));
				assert.throws(() => battle.choose('p1', `${passChoice} a, ${switchChoice}`));
			});

			it.skip(`should only allow switching to left slots on double KOs with only one Pokemon remaining`, () => {
				battle = common.createBattle({ gameType: 'doubles' }, [[
					{ species: 'tornadus', moves: ['sleeptalk'] },
					{ species: 'landorus', moves: ['earthquake'] },
				], [
					{ species: 'roggenrola', level: 1, moves: ['sleeptalk'] },
					{ species: 'aron', level: 1, moves: ['sleeptalk'] },
					{ species: 'wynaut', moves: ['sleeptalk'] },
				]]);
				battle.makeChoices();
				assert.throws(() => battle.choose('p2', 'pass, switch 3'), 'Wynaut should only be able to switch on the left.');
			});
		});
	});

	describe('Move requests', () => {
		describe('Generic', () => {
			it('should reject `pass` choices for non-fainted Pokémon', () => {
				battle = common.createBattle();
				battle.setPlayer('p1', { team: [{ species: "Mew", ability: 'synchronize', moves: ['recover'] }] });
				battle.setPlayer('p2', { team: [{ species: "Rhydon", ability: 'prankster', moves: ['splash'] }] });

				for (const side of battle.sides) {
					assert.throws(() => battle.choose(side.id, 'pass'));
				}
			});

			it('should allow mega evolving and targeting in the same move in either order', () => {
				battle = common.createBattle({ gameType: 'doubles' });
				battle.setPlayer('p1', { team: [
					{ species: "Gengar", ability: 'cursedbody', item: 'gengarite', moves: ['shadowball'] },
					{ species: "Zigzagoon", ability: 'pickup', moves: ['tackle'] },
				] });
				battle.setPlayer('p2', { team: [
					{ species: "Blaziken", ability: 'blaze', item: 'firiumz', moves: ['blazekick'] },
					{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
				] });

				const badChoices = [`move 1 1 2`, `move 1 1 mega ultra`, `move 1 mega zmove 2`];
				for (const badChoice of badChoices) {
					const choice = `${badChoice}, move tackle 1`;
					assert.throws(() => battle.choose('p1', choice));
				}

				assert(battle.choose('p1', `move 1 +1 mega, move tackle 1`));
				assert(battle.choose('p2', `move Blaze Kick zmove 1, move irondefense`));
			});

			it('should allow Dynamax use in multiple possible formats', () => {
				battle = common.gen(8).createBattle([[
					{ species: "Mew", moves: ['psychic'] },
				], [
					{ species: "Mew", moves: ['psychic'] },
				]]);

				battle.makeChoices(`move max mindstorm`, `move psychic max`);
				assert(battle.p1.active[0].volatiles['dynamax']);
				assert(battle.p2.active[0].volatiles['dynamax']);
			});

			it('should handle Conversion 2', () => {
				battle = common.createBattle({ gameType: 'doubles' });
				battle.setPlayer('p1', { team: [
					{ species: "Porygon-Z", ability: 'adaptability', item: 'normaliumz', moves: ['conversion', 'conversion2'] },
					{ species: "Porygon", ability: 'download', moves: ['conversion', 'conversion2'] },
				] });
				battle.setPlayer('p2', { team: [
					{ species: "Gengar", ability: 'cursedbody', moves: ['lick'] },
					{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
				] });

				assert(battle.choose('p1', `move 1, move Conversion 2 2`));
				assert.equal(battle.p1.getChoice(), `move conversion, move conversion2 +2`);
				battle.p1.clearChoice();

				assert.throws(() => battle.choose('p1', `move 1, move Conversion -2`));
				battle.p1.clearChoice();

				assert(battle.choose('p1', `move Conversion 2 zmove 2, move 1`));
				assert.equal(battle.p1.getChoice(), `move conversion2 +2 zmove, move conversion`);
				battle.p1.clearChoice();
			});
		});

		describe('Singles', () => {
			it('should accept only `move` and `switch` choices', () => {
				battle = common.createBattle();
				battle.setPlayer('p1', { team: [
					{ species: "Mew", ability: 'synchronize', moves: ['lunardance', 'recover'] },
					{ species: "Bulbasaur", ability: 'overgrow', moves: ['tackle', 'growl'] },
				] });
				battle.setPlayer('p2', { team: [
					{ species: "Rhydon", ability: 'prankster', moves: ['splash', 'horndrill'] },
					{ species: "Charmander", ability: 'blaze', moves: ['tackle', 'growl'] },
				] });

				const validChoices = ['move 1', 'move 2', 'switch 2'];
				for (const action of validChoices) {
					assert(battle.choose('p1', action), `Choice '${action}' should be valid`);
					battle.p1.clearChoice();
				}

				const badChoices = ['move 1 zmove', 'move 2 mega', 'team 1', 'pass', 'shift'];
				for (const badChoice of badChoices) {
					assert.throws(() => battle.choose('p1', badChoice));
				}
			});
		});

		describe('Doubles', () => {
			it('should enforce `pass` choices for fainted Pokémon', () => {
				battle = common.createBattle({ gameType: 'doubles' });
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
				battle.makeChoices('move selfdestruct, move selfdestruct', 'move roost, move irondefense'); // Both p1 active Pokémon faint
				battle.makeChoices('pass, switch 3', ''); // Koffing switches in at slot #2

				assert.fainted(p1.active[0]);
				assert.species(p1.active[1], 'Koffing');
				assert.false.fainted(p1.active[1]);

				assert(battle.choose('p1', 'move smog 2'));
				assert.equal(battle.p1.getChoice(), `pass, move smog +2`, `Choice mismatch`);
			});
		});

		describe('Triples', () => {
			it('should accept only `move` and `switch` choices for a healthy Pokémon on the center', () => {
				battle = common.gen(5).createBattle({ gameType: 'triples' });
				battle.setPlayer('p1', { team: [
					{ species: "Pineco", ability: 'sturdy', moves: ['selfdestruct'] },
					{ species: "Geodude", ability: 'sturdy', moves: ['selfdestruct'] },
					{ species: "Gastly", ability: 'levitate', moves: ['lick'] },
					{ species: "Forretress", ability: 'levitate', moves: ['spikes'] },
				] });
				battle.setPlayer('p2', { team: [
					{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
					{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
					{ species: "Golem", ability: 'sturdy', moves: ['defensecurl'] },
				] });

				const validChoices = ['move 1', 'switch 4'];

				for (const action of validChoices) {
					const choiceString = `move 1, ${action}, move 1 1`;
					assert(battle.choose('p1', choiceString), `Choice '${choiceString}' should be valid`);
					battle.p1.clearChoice();
				}

				const badChoices = ['move 1 zmove', 'move 2 mega', 'team 1', 'pass', 'shift'];
				for (const badChoice of badChoices) {
					const choiceString = `move 1, ${badChoice}, move 1 1`;
					assert.throws(() => battle.choose('p1', choiceString));
				}
			});

			it('should accept only `move`, `switch` and `shift` choices for a healthy Pokémon on the left', () => {
				battle = common.gen(5).createBattle({ gameType: 'triples' });
				battle.setPlayer('p1', { team: [
					{ species: "Pineco", ability: 'sturdy', moves: ['selfdestruct'] },
					{ species: "Geodude", ability: 'sturdy', moves: ['selfdestruct'] },
					{ species: "Gastly", ability: 'levitate', moves: ['lick'] },
					{ species: "Forretress", ability: 'levitate', moves: ['spikes'] },
				] });
				battle.setPlayer('p2', { team: [
					{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
					{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
					{ species: "Golem", ability: 'sturdy', moves: ['defensecurl'] },
					{ species: "Magnezone", ability: 'magnetpull', moves: ['discharge'] },
				] });

				const validChoices = ['move 1', 'switch 4', 'shift'];

				for (const action of validChoices) {
					const choiceString = `${action}, move 1, move 1 1`;
					assert(battle.choose('p1', choiceString), `Choice '${choiceString}' should be valid`);
					battle.p1.clearChoice();
				}

				const badChoices = ['move 1 zmove', 'move 2 mega', 'team 1', 'pass'];
				for (const badChoice of badChoices) {
					const choiceString = `${badChoice}, move 1, move 1 1`;
					assert.throws(() => battle.choose('p1', choiceString));
				}
			});

			it('should accept only `move`, `switch` and `shift` choices for a healthy Pokémon on the right', () => {
				battle = common.gen(5).createBattle({ gameType: 'triples' });
				battle.setPlayer('p1', { team: [
					{ species: "Pineco", ability: 'sturdy', moves: ['selfdestruct'] },
					{ species: "Geodude", ability: 'sturdy', moves: ['selfdestruct'] },
					{ species: "Gastly", ability: 'levitate', moves: ['lick'] },
					{ species: "Forretress", ability: 'levitate', moves: ['spikes'] },
				] });
				battle.setPlayer('p2', { team: [
					{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
					{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
					{ species: "Golem", ability: 'sturdy', moves: ['defensecurl'] },
					{ species: "Magnezone", ability: 'magnetpull', moves: ['discharge'] },
				] });

				const validChoices = ['move 1 1', 'switch 4', 'shift'];

				for (const action of validChoices) {
					const choiceString = `move 1, move 1, ${action}`;
					assert(battle.choose('p1', choiceString), `Choice '${choiceString}' should be valid`);
					battle.p1.clearChoice();
				}

				const badChoices = ['move 1 zmove', 'move 2 mega', 'team 1', 'pass', 'shift blah'];
				for (const badChoice of badChoices) {
					const choiceString = `move 1, move 1, ${badChoice}`;
					assert.throws(() => battle.choose('p1', choiceString));
				}
			});

			it('should enforce `pass` choices for fainted Pokémon', () => {
				battle = common.gen(5).createBattle({ gameType: 'triples' });
				battle.setPlayer('p1', { team: [
					{ species: "Pineco", ability: 'sturdy', moves: ['selfdestruct'] },
					{ species: "Geodude", ability: 'sturdy', moves: ['selfdestruct'] },
					{ species: "Gastly", ability: 'levitate', moves: ['lunardance'] },
					{ species: "Forretress", ability: 'levitate', moves: ['spikes'] },
				] });
				battle.setPlayer('p2', { team: [
					{ species: "Skarmory", ability: 'sturdy', moves: ['roost'] },
					{ species: "Aggron", ability: 'sturdy', moves: ['irondefense'] },
					{ species: "Golem", ability: 'sturdy', moves: ['defensecurl'] },
				] });
				const p1 = battle.p1;
				battle.makeChoices('move selfdestruct, move selfdestruct, move lunardance', 'move roost, move irondefense, move defensecurl'); // All p1 active Pokémon faint

				battle.makeChoices('pass, switch 4, default', ''); // Forretress switches in to slot #2
				assert.species(p1.active[1], 'Forretress');

				const validChoices = ['move spikes', 'move 1'];
				for (const action of validChoices) {
					battle.choose('p1', action);
					assert.equal(battle.p1.getChoice(), `pass, move spikes, pass`);
					battle.p1.clearChoice();
					battle.choose('p1', `pass, ${action}, pass`);
					assert.equal(battle.p1.getChoice(), `pass, move spikes, pass`);
					battle.p1.clearChoice();
					battle.choose('p1', `pass, ${action}`);
					assert.equal(battle.p1.getChoice(), `pass, move spikes, pass`);
					battle.p1.clearChoice();
					battle.choose('p1', `${action}, pass`);
					assert.equal(battle.p1.getChoice(), `pass, move spikes, pass`);
					battle.p1.clearChoice();
				}
			});
		});
	});

	describe('Switch by name', () => {
		it('should prefer nickname over species name', () => {
			battle = common.createBattle([[
				{ species: 'Magikarp', moves: ['splash'] },
				{ species: 'Charizard', name: "Pikachu", moves: ['tackle'] },
				{ species: 'Pikachu', name: "Charizard", moves: ['tackle'] },
			], [
				{ species: 'Magikarp', moves: ['splash'] },
			]]);

			battle.makeChoices('switch Charizard', 'move splash');
			assert.species(battle.p1.active[0], 'Pikachu');
		});

		it('should support nicknames starting with a digit', () => {
			battle = common.createBattle([[
				{ species: 'Magikarp', moves: ['splash'] },
				{ species: 'Dusclops', name: "1-Eyed", moves: ['tackle'] },
				{ species: 'Ariados', name: "4-Legged", moves: ['tackle'] },
				{ species: 'Durant', name: "6-Legged", moves: ['tackle'] },
			], [
				{ species: 'Magikarp', moves: ['splash'] },
			]]);

			battle.makeChoices('switch 1-Eyed', 'move splash');
			assert.species(battle.p1.active[0], 'Dusclops');
			battle.makeChoices('switch 4-Legged', 'move splash');
			assert.species(battle.p1.active[0], 'Ariados');
			battle.makeChoices('switch 6-Legged', 'move splash');
			assert.species(battle.p1.active[0], 'Durant');
		});

		it('should ignore temporarily transformed species', () => {
			battle = common.createBattle([[
				{ species: 'Ditto', ability: 'imposter', moves: ['transform'] },
				{ species: 'Pikachu', moves: ['splash'] },
			], [
				{ species: 'Pikachu', moves: ['splash'] },
			]]);

			assert(battle.p1.active[0].transformed);
			assert.species(battle.p1.active[0], 'Pikachu');

			battle.makeChoices('switch Pikachu', 'move splash');

			assert(!battle.p1.active[0].transformed);
			assert.species(battle.p1.active[0], 'Pikachu');
		});

		it('should error when attempting to switch to an active Pokémon', () => {
			battle = common.createBattle([[
				{ species: 'Pikachu', moves: ['tackle'] },
				{ species: 'Charizard', moves: ['tackle'] },
			], [
				{ species: 'Magikarp', moves: ['splash'] },
			]]);

			assert.throws(() => {
				battle.makeChoices('switch Pikachu', 'move splash');
			});
		});

		it('should match final formes after Mega-Evolution', () => {
			battle = common.gen(9).createBattle({ formatid: 'gen9nationaldex@@@!teampreview' }, [[
				{ species: 'Magearna-Original', name: "Magi", item: 'magearnite', moves: ['agility'] },
				{ species: 'Magikarp', moves: ['splash'] },
			], [
				{ species: 'Magikarp', moves: ['splash'] },
			]]);

			battle.makeChoices('move agility mega', 'move splash');
			assert(battle.p1.active[0].species.isMega);

			battle.makeChoices('switch Magikarp', 'move splash');
			assert.species(battle.p1.active[0], 'Magikarp');

			battle.makeChoices(`switch ${p1.pokemon[1].species.name}`, 'move splash');
			assert(battle.p1.active[0].species.isMega);
		});

		it('should match base formes after Mega-Evolution', () => {
			battle = common.gen(9).createBattle({ formatid: 'gen9nationaldex@@@!teampreview' }, [[
				{ species: 'Magearna-Original', name: "Magi", item: 'magearnite', moves: ['agility'] },
				{ species: 'Magikarp', moves: ['splash'] },
			], [
				{ species: 'Magikarp', moves: ['splash'] },
			]]);

			battle.makeChoices('move agility mega', 'move splash');
			assert(battle.p1.active[0].species.isMega);

			battle.makeChoices('switch Magikarp', 'move splash');
			assert.species(battle.p1.active[0], 'Magikarp');

			battle.makeChoices('switch Magearna', 'move splash');
			assert(battle.p1.active[0].species.isMega);
		});

		it('should match cosmetic formes after Mega-Evolution', () => {
			battle = common.gen(9).createBattle({ formatid: 'gen9nationaldex@@@!teampreview' }, [[
				{ species: 'Magearna-Original', name: "Magi", item: 'magearnite', moves: ['agility'] },
				{ species: 'Magikarp', moves: ['splash'] },
			], [
				{ species: 'Magikarp', moves: ['splash'] },
			]]);

			battle.makeChoices('move agility mega', 'move splash');
			assert(battle.p1.active[0].species.isMega);

			battle.makeChoices('switch Magikarp', 'move splash');
			assert.species(battle.p1.active[0], 'Magikarp');

			battle.makeChoices('switch Magearna-Original', 'move splash');
			assert(battle.p1.active[0].species.isMega);
		});

		it('should allow switching into two identical Pokémon in the same turn', () => {
			battle = common.createBattle({ gameType: 'doubles' }, [[
				{ species: 'Pikachu', moves: ['tackle'] },
				{ species: 'Eevee', moves: ['tackle'] },
				{ species: 'Garchomp', moves: ['tackle'] },
				{ species: 'Garchomp', moves: ['tackle'] },
			], [
				{ species: 'Magikarp', moves: ['splash'] },
				{ species: 'Magikarp', moves: ['splash'] },
			]]);

			battle.makeChoices('switch Garchomp, switch Garchomp', 'move splash, move splash');
			assert.species(battle.p1.active[0], 'Garchomp');
			assert.species(battle.p1.active[1], 'Garchomp');
			assert.notEqual(battle.p1.active[0], battle.p1.active[1]);
		});

		it('should reject switching into the same Pokémon twice in the same turn', () => {
			battle = common.createBattle({ gameType: 'doubles' }, [[
				{ species: 'Pikachu', moves: ['tackle'] },
				{ species: 'Eevee', moves: ['tackle'] },
				{ species: 'Garchomp', moves: ['tackle'] },
				{ species: 'Salamence', moves: ['tackle'] },
			], [
				{ species: 'Magikarp', moves: ['splash'] },
				{ species: 'Magikarp', moves: ['splash'] },
			]]);

			assert.throws(() => {
				battle.makeChoices('switch Garchomp, switch Garchomp', 'move splash, move splash');
			});
			assert.species(battle.p1.active[0], 'Pikachu');
			assert.species(battle.p1.active[1], 'Eevee');
		});
	});
});
