'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

/**
 * There is already a faint-order test file, but this test suite focuses on very specific fainting order messages
 * in older generations, mostly related to interactions between recoil, Pursuit, Destiny Bond, and switching.
 */
describe('Fainting', () => {
	afterEach(() => {
		battle.destroy();
	});

	describe('[Gen 4]', () => {
		it(`should finish a Pursuit-interrupted switch and its hazards before checking the outcome`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "alakazam", moves: ['spikes', 'pursuit'] },
			], [
				{ species: "gastly", level: 1, moves: ['destinybond'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move spikes', 'move destinybond');
			battle.makeChoices('move pursuit', 'switch 2');
			assert.logOrder(battle, [
				'|faint|p1a: Alakazam',
				'|switch|p2a: Shedinja',
				'|-damage|p2a: Shedinja|0 fnt|[from] Spikes',
				'|faint|p2a: Shedinja',
			]);
			assert(battle.ended);
			assert.equal(battle.winner, '');
		});

		it(`should check the outcome after one voluntary switch before executing the next`, () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
				{ species: "shedinja", moves: ['destinybond'] },
				{ species: "shuckle", moves: ['sleeptalk'] },
				{ species: "pikachu", moves: ['sleeptalk'] },
				{ species: "eevee", moves: ['sleeptalk'] },
			], [
				{ species: "snorlax", moves: ['sleeptalk', 'pursuit'] },
				{ species: "abra", level: 1, moves: ['explosion'] },
			]]);
			battle.makeChoices('move destinybond, move sleeptalk', 'move sleeptalk, move explosion');
			battle.makeChoices('switch 3, switch 4', 'move pursuit 1, pass');
			assert(battle.ended);
			assert.equal(battle.winner, 'Player 1');
			assert.logOrder(battle, [
				'|faint|p2a: Snorlax',
				'|switch|p1a: Pikachu',
				'|win|Player 1',
			]);
			assert(!battle.getDebugLog().includes('|switch|p1b: Eevee'));
		});

		it(`should check the outcome before requesting a replacement batch`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "alakazam", moves: ['sleeptalk'] },
			], [
				{ species: "snorlax", moves: ['explosion'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			assert(battle.ended);
			assert.equal(battle.winner, 'Player 2');
			assert(!battle.getDebugLog().includes('|switch|p2a: Shedinja'));
		});

		it(`should tie after both last replacements faint in the same batch`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "alakazam", moves: ['spikes', 'sleeptalk'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
			], [
				{ species: "snorlax", moves: ['spikes', 'explosion'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move spikes', 'move spikes');
			battle.makeChoices('move sleeptalk', 'move explosion');
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, 'switch');
			battle.makeChoices('switch 2', 'switch 2');
			assert.species(battle.p1.active[0], 'Shedinja');
			assert.species(battle.p2.active[0], 'Shedinja');
			assert.fainted(battle.p1.active[0]);
			assert.fainted(battle.p2.active[0]);
			assert(battle.ended);
			assert.equal(battle.winner, '');
		});

		it(`should finish the replacement batch before declaring a win when one side has reserves`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "alakazam", moves: ['spikes', 'sleeptalk'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
			], [
				{ species: "snorlax", moves: ['spikes', 'explosion'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
				{ species: "blissey", ability: 'drought', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move spikes', 'move spikes');
			battle.makeChoices('move sleeptalk', 'move explosion');
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, 'switch');
			battle.makeChoices('switch 2', 'switch 2');
			assert.species(battle.p1.active[0], 'Shedinja');
			assert.species(battle.p2.active[0], 'Shedinja');
			assert.fainted(battle.p1.active[0]);
			assert.fainted(battle.p2.active[0]);
			assert(battle.ended);
			assert.equal(battle.winner, 'Player 2');
		});

		it(`should finish the replacement batch without activating abilities before declaring a win`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "alakazam", moves: ['sleeptalk'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
			], [
				{ species: "snorlax", moves: ['spikes', 'explosion'] },
				{ species: "blissey", ability: 'drought', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move sleeptalk', 'move spikes');
			battle.makeChoices('move sleeptalk', 'move explosion');
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, 'switch');
			battle.makeChoices('switch 2', 'switch 2');
			assert.species(battle.p1.active[0], 'Shedinja');
			assert.species(battle.p2.active[0], 'Blissey');
			assert.fainted(battle.p1.active[0]);
			assert.false.fainted(battle.p2.active[0]);
			assert.equal(battle.field.weather, '');
			assert(battle.ended);
			assert.equal(battle.winner, 'Player 2');
		});

		it(`should activate the U-turn replacement's ability before checking the outcome`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "crobat", moves: ['sleeptalk', 'uturn'] },
				{ species: "tyranitar", ability: 'sandstream', moves: ['sleeptalk'] },
			], [
				{ species: "steelix", item: 'lifeorb', moves: ['spikes', 'pursuit'] },
			]]);
			battle.makeChoices('move sleeptalk', 'move spikes');
			const crobat = battle.p1.active[0];
			const steelix = battle.p2.active[0];
			// Steelix survives the resisted U-turn, but cannot survive Life Orb recoil.
			steelix.hp = Math.floor(steelix.maxhp / 10);
			battle.makeChoices('move uturn', 'move pursuit');
			assert.false.fainted(crobat);
			assert(!steelix.fainted);
			battle.makeChoices('switch 2', '');
			assert.species(battle.p1.active[0], 'Tyranitar');
			assert.equal(battle.field.weather, 'sandstorm');
			assert(steelix.fainted);
			assert(battle.ended);
			assert.equal(battle.winner, 'Player 1');
			assert.logOrder(battle, [
				'|switch|p1a: Tyranitar',
				'|faint|p2a: Steelix',
				'|-weather|Sandstorm|[from] ability: Sand Stream',
				'|win|Player 1',
			]);
		});

		it(`should resolve replacement hazards before displaying U-turn's target faint`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "crobat", moves: ['sleeptalk', 'uturn'] },
				{ species: "tyranitar", ability: 'sandstream', moves: ['sleeptalk'] },
			], [
				{ species: "shedinja", moves: ['spikes', 'sleeptalk'] },
				{ species: "blissey", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move sleeptalk', 'move spikes');
			const shedinja = battle.p2.active[0];
			battle.makeChoices('move uturn', 'move sleeptalk');
			assert(!shedinja.fainted);
			battle.makeChoices('switch 2', '');
			const hazardDamage = battle.log.find(line =>
				line.startsWith('|-damage|p1a: Tyranitar|') && line.endsWith('|[from] Spikes'));
			assert(hazardDamage);
			assert.logOrder(battle, [
				'|switch|p1a: Tyranitar',
				hazardDamage,
				'|faint|p2a: Shedinja',
				'|-weather|Sandstorm|[from] ability: Sand Stream',
			]);
		});

		it(`should display a replacement's hazard faint before U-turn's target faint`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "crobat", moves: ['sleeptalk', 'uturn'] },
				{ species: "shedinja", ability: 'drought', moves: ['sleeptalk'] },
				{ species: "pikachu", moves: ['sleeptalk'] },
			], [
				{ species: "shedinja", moves: ['spikes', 'sleeptalk'] },
				{ species: "blissey", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move sleeptalk', 'move spikes');
			const target = battle.p2.active[0];
			battle.makeChoices('move uturn', 'move sleeptalk');
			assert(!target.fainted);
			battle.makeChoices('switch 2', '');
			assert.logOrder(battle, [
				'|switch|p1a: Shedinja',
				'|-damage|p1a: Shedinja|0 fnt|[from] Spikes',
				// this is mainly a cosmetic check
				// '|faint|p1a: Shedinja',
				// '|faint|p2a: Shedinja',
			]);
			assert.equal(battle.field.weather, '');
		});

		it(`should display U-turn's target faint before its replacement when the user cannot switch`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "crobat", item: 'lifeorb', moves: ['uturn'] },
			], [
				{ species: "shedinja", moves: ['sleeptalk'] },
				{ species: "blissey", moves: ['sleeptalk'] },
			]]);
			const crobat = battle.p1.active[0];
			const shedinja = battle.p2.active[0];
			battle.makeChoices('move uturn', 'move sleeptalk');
			assert.false(battle.ended);
			assert.equal(battle.p1.active[0], crobat);
			assert.false.fainted(crobat);
			assert(shedinja.fainted);
			assert.equal(battle.p1.requestState, '');
			assert.equal(battle.p2.requestState, 'switch');
			const lifeOrbDamage = battle.log.find(line =>
				line.startsWith('|-damage|p1a: Crobat|') && line.endsWith('|[from] item: Life Orb'));
			assert(lifeOrbDamage);
			battle.makeChoices('', 'switch 2');
			assert.logOrder(battle, [
				'|move|p1a: Crobat|U-turn|p2a: Shedinja',
				'|faint|p2a: Shedinja',
				lifeOrbDamage,
				'|switch|p2a: Blissey',
			]);
		});

		it(`should apply U-turn's Life Orb before Destiny Bond and process faints before replacement switches`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "scizor", item: 'lifeorb', moves: ['uturn'] },
				{ species: "tyranitar", ability: 'sandstream', moves: ['sleeptalk'] },
			], [
				{ species: "froslass", moves: ['destinybond'] },
				{ species: "groudon", ability: 'drought', moves: ['sleeptalk'] },
			]]);
			battle.p2.active[0].hp = 1;
			battle.makeChoices();
			const lifeOrbDamage = battle.log.find(line =>
				line.startsWith('|-damage|p1a: Scizor|') && line.endsWith('|[from] item: Life Orb'));
			assert(lifeOrbDamage);
			assert.logOrder(battle, [
				'|move|p1a: Scizor|U-turn|p2a: Froslass',
				lifeOrbDamage,
				'|-activate|p2a: Froslass|move: Destiny Bond',
				// this is mainly a cosmetic check
				// '|faint|p1a: Scizor',
				// '|faint|p2a: Froslass',
			]);
			battle.makeChoices('switch 2', 'switch 2');
			assert.equal(battle.field.weather, 'sandstorm');
			for (const faint of ['|faint|p1a: Scizor', '|faint|p2a: Froslass']) {
				assert.logOrder(battle, [faint, '|switch|p1a: Tyranitar']);
				assert.logOrder(battle, [faint, '|switch|p2a: Groudon']);
			}
			assert.equal(battle.log.filter(line => line === '|-activate|p2a: Froslass|move: Destiny Bond').length, 1);
		});

		for (const move of ['uturn', 'flareblitz']) {
			it(`should skip Destiny Bond when ${move === 'uturn' ? 'Life Orb' : 'move recoil'} KOs the attacker first`, () => {
				battle = common.gen(4).createBattle([[
					{ species: "scizor", item: 'lifeorb', moves: [move] },
					{ species: "tyranitar", moves: ['sleeptalk'] },
				], [
					{ species: "froslass", moves: ['destinybond'] },
					{ species: "blissey", moves: ['sleeptalk'] },
				]]);
				const scizor = battle.p1.active[0];
				const froslass = battle.p2.active[0];
				scizor.hp = 1;
				froslass.hp = 1;
				battle.makeChoices();
				assert(scizor.fainted);
				assert(froslass.fainted);
				assert.false(battle.log.includes('|-activate|p2a: Froslass|move: Destiny Bond'));
				const damage = move === 'uturn' ? 'item: Life Orb' : 'Recoil';
				for (const faint of ['|faint|p1a: Scizor', '|faint|p2a: Froslass']) {
					assert.logOrder(battle, [`|-damage|p1a: Scizor|0 fnt|[from] ${damage}`, faint]);
				}
				assert.equal(battle.p1.requestState, 'switch');
				assert.equal(battle.p2.requestState, 'switch');
			});
		}

		it(`should cancel U-turn if its user faints to Life Orb`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "crobat", item: 'lifeorb', moves: ['uturn'] },
				{ species: "tyranitar", ability: 'sandstream', moves: ['sleeptalk'] },
			], [
				{ species: "steelix", moves: ['sleeptalk'] },
			]]);
			const crobat = battle.p1.active[0];
			crobat.hp = Math.floor(crobat.maxhp / 10);
			battle.makeChoices('move uturn', 'move sleeptalk');
			assert.fainted(crobat);
			assert.false.fainted(battle.p2.active[0]);
			assert.equal(battle.p1.requestState, 'switch');
			assert(!battle.getDebugLog().includes('|switch|p1a: Tyranitar'));
			assert.logOrder(battle, [
				'|move|p1a: Crobat|U-turn|p2a: Steelix',
				'|-damage|p1a: Crobat|0 fnt|[from] item: Life Orb',
				'|faint|p1a: Crobat',
			]);
		});

		it(`should display a Pursuit KO before cancelling U-turn`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "shedinja", moves: ['uturn'] },
				{ species: "tyranitar", ability: 'sandstream', moves: ['sleeptalk'] },
			], [
				{ species: "steelix", moves: ['pursuit'] },
			]]);
			const shedinja = battle.p1.active[0];
			battle.makeChoices('move uturn', 'move pursuit');
			assert.fainted(shedinja);
			assert.equal(battle.p1.requestState, 'switch');
			assert(!battle.getDebugLog().includes('|switch|p1a: Tyranitar'));
			assert.logOrder(battle, [
				'|move|p1a: Shedinja|U-turn|p2a: Steelix',
				'|-activate|p1a: Shedinja|move: Pursuit',
				'|faint|p1a: Shedinja',
			]);
		});

		it(`should skip U-turn's switch if it knocks out the opponent's last Pokemon`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "crobat", item: 'lifeorb', moves: ['uturn'] },
				{ species: "tyranitar", ability: 'sandstream', moves: ['sleeptalk'] },
			], [
				{ species: "shedinja", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move uturn', 'move sleeptalk');
			assert(battle.ended);
			assert.equal(battle.winner, 'Player 1');
			assert.species(battle.p1.active[0], 'Crobat');
			assert(!battle.getDebugLog().includes('|switch|p1a: Tyranitar'));
			const lifeOrbDamage = battle.log.find(line =>
				line.startsWith('|-damage|p1a: Crobat|') && line.endsWith('|[from] item: Life Orb'));
			assert(lifeOrbDamage);
			assert.logOrder(battle, [
				'|move|p1a: Crobat|U-turn|p2a: Shedinja',
				'|faint|p2a: Shedinja',
				lifeOrbDamage,
				'|win|Player 1',
			]);
		});

		it(`should wait for lethal Life Orb damage before checking U-turn's final KO result`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "crobat", item: 'lifeorb', moves: ['uturn'] },
			], [
				{ species: "shedinja", moves: ['sleeptalk'] },
			]]);
			battle.p1.active[0].hp = 1;
			battle.makeChoices();
			assert(battle.ended);
			assert.equal(battle.winner, '');
			assert.logOrder(battle, [
				'|faint|p2a: Shedinja',
				'|-damage|p1a: Crobat|0 fnt|[from] item: Life Orb',
				'|faint|p1a: Crobat',
			]);
		});
	});

	describe('[Gen 3]', () => {
		it(`should check the outcome after each replacement, before the other side switches in`, () => {
			battle = common.gen(3).createBattle([[
				{ species: "alakazam", moves: ['spikes', 'sleeptalk'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
			], [
				{ species: "snorlax", moves: ['spikes', 'explosion'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move spikes', 'move spikes');
			battle.makeChoices('move sleeptalk', 'move explosion');
			const secondReplacement = battle.p2.pokemon[1];
			battle.makeChoices('switch 2', 'switch 2');
			assert.species(battle.p1.active[0], 'Shedinja');
			assert.fainted(battle.p1.active[0]);
			assert.false.fainted(secondReplacement);
			assert(!battle.getDebugLog().includes('|switch|p2a: Shedinja'));
			assert(battle.ended);
			assert.equal(battle.winner, 'Player 2');
		});

		it(`should finish a Pursuit-interrupted switch and its hazards before checking the outcome`, () => {
			battle = common.gen(3).createBattle([[
				{ species: "alakazam", moves: ['spikes', 'pursuit'] },
			], [
				{ species: "gastly", level: 1, moves: ['destinybond'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move spikes', 'move destinybond');
			battle.makeChoices('move pursuit', 'switch 2');
			assert.logOrder(battle, [
				'|faint|p1a: Alakazam',
				'|switch|p2a: Shedinja',
				'|-damage|p2a: Shedinja|0 fnt|[from] Spikes',
				'|faint|p2a: Shedinja',
			]);
			assert(battle.ended);
			assert.equal(battle.winner, '');
		});

		it(`should check the outcome after one voluntary switch before executing the next`, () => {
			battle = common.gen(3).createBattle({ gameType: 'doubles' }, [[
				{ species: "shedinja", moves: ['destinybond'] },
				{ species: "shuckle", moves: ['sleeptalk'] },
				{ species: "pikachu", moves: ['sleeptalk'] },
				{ species: "eevee", moves: ['sleeptalk'] },
			], [
				{ species: "snorlax", moves: ['sleeptalk', 'pursuit'] },
				{ species: "abra", level: 1, moves: ['explosion'] },
			]]);
			battle.makeChoices('move destinybond, move sleeptalk', 'move sleeptalk, move explosion');
			battle.makeChoices('switch 3, switch 4', 'move pursuit 1, pass');
			assert(battle.ended);
			assert.equal(battle.winner, 'Player 1');
			assert.logOrder(battle, [
				'|faint|p2a: Snorlax',
				'|switch|p1a: Pikachu',
				'|win|Player 1',
			]);
			assert(!battle.getDebugLog().includes('|switch|p1b: Eevee'));
		});
	});

	describe('[Gen 2]', () => {
		it(`should display the Destiny Bond target's faint before the attacker's and then declare a draw`, () => {
			battle = common.gen(2).createBattle([[
				{ species: "snorlax", moves: ['strength'] },
			], [
				{ species: "jynx", moves: ['destinybond'] },
			]]);
			battle.p2.active[0].hp = 1;
			battle.makeChoices();
			assert(battle.ended);
			assert.equal(battle.winner, '');
			assert.logOrder(battle, [
				'|move|p1a: Snorlax|Strength|p2a: Jynx',
				'|-damage|p2a: Jynx|0 fnt',
				'|-activate|p2a: Jynx|move: Destiny Bond',
				'|faint|p2a: Jynx',
				'|faint|p1a: Snorlax',
			]);
			assert(battle.log.indexOf('|tie') > battle.log.indexOf('|faint|p1a: Snorlax'));
		});

		it(`should activate Destiny Bond after lethal move recoil and display the target's faint first`, () => {
			battle = common.gen(2).createBattle([[
				{ species: "snorlax", moves: ['doubleedge'] },
			], [
				{ species: "jynx", moves: ['destinybond'] },
			]]);
			battle.p1.active[0].hp = 1;
			battle.p2.active[0].hp = 1;
			battle.makeChoices();
			assert(battle.ended);
			assert.equal(battle.winner, '');
			assert.logOrder(battle, [
				'|move|p1a: Snorlax|Double-Edge|p2a: Jynx',
				'|-damage|p2a: Jynx|0 fnt',
				'|-damage|p1a: Snorlax|0 fnt|[from] Recoil',
				'|-activate|p2a: Jynx|move: Destiny Bond',
				'|faint|p2a: Jynx',
				'|faint|p1a: Snorlax',
			]);
			assert.equal(battle.log.filter(line => line === '|-activate|p2a: Jynx|move: Destiny Bond').length, 1);
			assert.equal(battle.log.filter(line => line === '|faint|p1a: Snorlax').length, 1);
			assert(battle.log.indexOf('|tie') > battle.log.indexOf('|faint|p1a: Snorlax'));
		});

		it(`should defer hazard faints between voluntary switches`, () => {
			battle = common.gen(2).createBattle([[
				{ species: "shedinja", moves: ['sleeptalk'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
			], [
				{ species: "forretress", moves: ['spikes'] },
				{ species: "snorlax", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move sleeptalk', 'move spikes');
			battle.makeChoices('switch 2', 'switch 2');
			assert.logOrder(battle, [
				'|-damage|p1a: Shedinja|0 fnt|[from] Spikes',
				'|switch|p2a: Snorlax',
				'|faint|p1a: Shedinja',
			]);
		});

		it(`fainting should only happen after all Pokemon have switched in, even if one side will eventually lose`, () => {
			battle = common.gen(2).createBattle([[
				{ species: "alakazam", moves: ['sleeptalk'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
			], [
				{ species: "snorlax", moves: ['spikes', 'selfdestruct'] },
				{ species: "tyranitar", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			battle.makeChoices('auto', 'move selfdestruct');
			battle.makeChoices();
			assert.logOrder(battle, [
				'|-damage|p1a: Shedinja|0 fnt',
				'|switch|p2a: Tyranitar',
				'|faint|p1a: Shedinja',
			]);
			assert(battle.ended);
		});

		it(`should result in a tie if both sides faint simultaneously`, () => {
			battle = common.gen(2).createBattle([[
				{ species: "alakazam", moves: ['spikes'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
			], [
				{ species: "snorlax", moves: ['spikes', 'selfdestruct'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			battle.makeChoices('auto', 'move selfdestruct');
			battle.makeChoices();
			assert(battle.ended);
			assert.equal(battle.winner, '');
		});

		it(`should delay the Pursuit user's Destiny Bond faint until after the replacement takes Spikes`, () => {
			battle = common.gen(2).createBattle([[
				{ species: "alakazam", moves: ['spikes', 'pursuit'] },
			], [
				{ species: "gastly", level: 1, moves: ['destinybond'] },
				{ species: "snorlax", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move spikes', 'move destinybond');
			battle.makeChoices('move pursuit', 'switch 2');
			assert.species(battle.p2.active[0], 'Snorlax');
			assert.false.fainted(battle.p2.active[0]);
			assert.false.fullHP(battle.p2.active[0]);
			assert(battle.ended);
			assert.equal(battle.winner, 'Player 2');
			assert.logOrder(battle, [
				'|-activate|p2a: Gastly|move: Destiny Bond',
				'|faint|p2a: Gastly',
				'|switch|p2a: Snorlax',
				'|-damage|p2a: Snorlax|',
				'|faint|p1a: Alakazam',
				'|win|Player 2',
			]);
		});

		it(`should finish a Pursuit-interrupted switch and its hazards before checking the outcome`, () => {
			battle = common.gen(2).createBattle([[
				{ species: "alakazam", moves: ['spikes', 'pursuit'] },
			], [
				{ species: "gastly", level: 1, moves: ['destinybond'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move spikes', 'move destinybond');
			battle.makeChoices('move pursuit', 'switch 2');
			assert.logOrder(battle, [
				'|-activate|p2a: Gastly|move: Destiny Bond',
				'|faint|p2a: Gastly',
				'|switch|p2a: Shedinja',
				'|-damage|p2a: Shedinja|0 fnt|[from] Spikes',
				'|faint|p1a: Alakazam',
				'|faint|p2a: Shedinja',
			]);
			assert(battle.ended);
			assert.equal(battle.winner, '');
			assert(battle.log.indexOf('|tie') > battle.log.indexOf('|faint|p2a: Shedinja'));
		});
	});
});
