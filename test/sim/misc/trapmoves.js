'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;
const trappers = ['Block', 'Mean Look', 'Spider Web', 'Thousand Waves', 'Anchor Shot', 'Spirit Shackle'];
const partialtrappers = ['Bind', 'Clamp', 'Fire Spin', 'Infestation', 'Magma Storm', 'Sand Tomb', 'Whirlpool', 'Wrap'];

describe('Trapping Moves', () => {
	afterEach(() => {
		battle.destroy();
	});

	for (const move of trappers) {
		it('should prevent Pokemon from switching out normally', () => {
			battle = common.createBattle([[
				{ species: "Smeargle", ability: 'prankster', moves: [toID(move)] },
			], [
				{ species: "Tangrowth", ability: 'leafguard', moves: ['swordsdance'] },
				{ species: "Starmie", ability: 'illuminate', moves: ['reflecttype'] },
			]]);
			battle.makeChoices('move ' + toID(move), 'move swordsdance');
			assert.trapped(() => battle.makeChoices('move ' + toID(move), 'switch 2'));
			assert.equal(battle.p2.active[0].species.id, 'tangrowth');
		});

		it('should not prevent Pokemon from switching out using moves', () => {
			battle = common.createBattle([[
				{ species: "Smeargle", ability: 'prankster', moves: [toID(move)] },
			], [
				{ species: "Tangrowth", ability: 'leafguard', moves: ['batonpass'] },
				{ species: "Starmie", ability: 'illuminate', moves: ['reflecttype'] },
			]]);
			battle.makeChoices('move ' + toID(move), 'move batonpass');
			battle.makeChoices('', 'switch 2');
			assert.equal(battle.p2.active[0].species.id, 'starmie');
		});

		it('should not prevent Pokemon immune to trapping from switching out', () => {
			battle = common.createBattle([[
				{ species: "Smeargle", ability: 'prankster', moves: [toID(move)] },
			], [
				{ species: "Gourgeist", ability: 'insomnia', moves: ['synthesis'] },
				{ species: "Starmie", ability: 'illuminate', moves: ['reflecttype'] },
			]]);
			battle.makeChoices('move ' + toID(move), 'move synthesis');
			battle.makeChoices('move ' + toID(move), 'switch 2');
			assert.equal(battle.p2.active[0].species.id, 'starmie');
		});

		it('should stop trapping the Pokemon if the user is no longer active', () => {
			battle = common.createBattle([[
				{ species: "Smeargle", ability: 'prankster', moves: [toID(move)] },
				{ species: "Kyurem", ability: 'pressure', moves: ['rest'] },
			], [
				{ species: "Tangrowth", ability: 'leafguard', moves: ['roar'] },
				{ species: "Starmie", ability: 'illuminate', moves: ['reflecttype'] },
			]]);
			battle.makeChoices('move ' + toID(move), 'move roar');
			battle.makeChoices('move rest', 'switch 2');
			assert.equal(battle.p2.active[0].species.id, 'starmie');
		});

		it('should free all trapped Pokemon if the user is no longer active', () => {
			battle = common.createBattle({ gameType: 'doubles' }, [[
				{ species: "Smeargle", ability: 'prankster', moves: [toID(move)] },
				{ species: "Cobalion", ability: 'justified', item: 'laggingtail', moves: ['swordsdance', 'closecombat'] },
			], [
				{ species: "Tangrowth", ability: 'leafguard', moves: ['synthesis'] },
				{ species: "Starmie", ability: 'illuminate', moves: ['recover'] },
				{ species: "Cradily", ability: 'suctioncups', moves: ['recover'] },
				{ species: "Hippowdon", ability: 'sandstream', moves: ['slackoff'] },
			]]);
			if (move !== 'Thousand Waves') {
				battle.makeChoices('move ' + toID(move) + ' 1, move swordsdance', 'move synthesis, move recover');
				battle.makeChoices('move ' + toID(move) + ' 2, move closecombat -1', 'move synthesis, move recover');
			} else {
				battle.makeChoices('move ' + toID(move) + ', move closecombat -1', 'move synthesis, move recover');
			}
			battle.makeChoices('move swordsdance', 'switch 3, switch 4');
			assert.equal(battle.p2.active[0].species.id, 'cradily');
			assert.equal(battle.p2.active[1].species.id, 'hippowdon');
		});

		if (trappers.indexOf(move) < 3) {
			// Only test on moves that existed in gen 4
			it('should be passed when the user uses Baton Pass in Gen 4', () => {
				battle = common.gen(4).createBattle([[
					{ species: "Smeargle", ability: 'prankster', moves: [toID(move), 'batonpass'] },
					{ species: "Shedinja", ability: 'wonderguard', moves: ['rest'] },
				], [
					{ species: "Tangrowth", ability: 'leafguard', moves: ['synthesis', 'roar'] },
					{ species: "Starmie", ability: 'illuminate', moves: ['reflecttype'] },
				]]);
				battle.makeChoices('move ' + toID(move), 'move synthesis');
				battle.makeChoices('move batonpass', 'move synthesis');
				battle.makeChoices('switch 2', '');
				assert.equal(battle.p2.active[0].species.id, 'tangrowth');
				battle.makeChoices('move rest', 'move roar');
				battle.makeChoices('move batonpass', 'switch 2');
				assert.equal(battle.p2.active[0].species.id, 'starmie');
			});
		}
	}
});

describe('Partial Trapping Moves', () => {
	afterEach(() => {
		battle.destroy();
	});

	for (const move of partialtrappers) {
		it('should deal 1/8 HP per turn', () => {
			battle = common.createBattle([[
				{ species: "Smeargle", ability: 'noguard', moves: [toID(move), 'rest'] },
			], [
				{ species: "Blissey", ability: 'naturalcure', moves: ['healbell'] },
			]]);
			battle.makeChoices('move ' + toID(move), 'move healbell');
			const pokemon = battle.p2.active[0];
			pokemon.heal(pokemon.maxhp);
			battle.makeChoices('move rest', 'move healbell');
			assert.equal(pokemon.maxhp - pokemon.hp, battle.modify(pokemon.maxhp, 1 / 8));
		});

		it('should prevent Pokemon from switching out normally', () => {
			battle = common.createBattle([[
				{ species: "Smeargle", ability: 'noguard', moves: [toID(move)] },
			], [
				{ species: "Blissey", ability: 'naturalcure', moves: ['healbell'] },
				{ species: "Starmie", ability: 'illuminate', moves: ['reflecttype'] },
			]]);
			battle.makeChoices('move ' + toID(move), 'move healbell');
			assert.trapped(() => battle.makeChoices('move ' + toID(move), 'switch 2'));
			assert.equal(battle.p2.active[0].species.id, 'blissey');
		});

		it('should not prevent Pokemon from switching out using moves', () => {
			battle = common.createBattle([[
				{ species: "Smeargle", ability: 'noguard', moves: [toID(move)] },
			], [
				{ species: "Blissey", ability: 'naturalcure', moves: ['batonpass'] },
				{ species: "Starmie", ability: 'illuminate', moves: ['reflecttype'] },
			]]);
			battle.makeChoices('move ' + toID(move), 'move batonpass');
			battle.makeChoices('', 'switch 2');
			assert.equal(battle.p2.active[0].species.id, 'starmie');
		});

		it('should not prevent Pokemon immune to trapping from switching out', () => {
			battle = common.createBattle([[
				{ species: "Smeargle", ability: 'noguard', moves: [toID(move)] },
			], [
				{ species: "Dusknoir", ability: 'frisk', moves: ['sleeptalk'] },
				{ species: "Starmie", ability: 'illuminate', moves: ['reflecttype'] },
			]]);
			battle.makeChoices('move ' + toID(move), 'move sleeptalk');
			battle.makeChoices('move ' + toID(move), 'switch 2');
			assert.equal(battle.p2.active[0].species.id, 'starmie');
		});

		it('should stop trapping the Pokemon if the user is no longer active', () => {
			battle = common.createBattle([[
				{ species: "Smeargle", ability: 'noguard', moves: [toID(move)] },
				{ species: "Kyurem", ability: 'pressure', moves: ['rest'] },
			], [
				{ species: "Blissey", ability: 'naturalcure', moves: ['roar'] },
				{ species: "Starmie", ability: 'illuminate', moves: ['reflecttype'] },
			]]);
			battle.makeChoices('move ' + toID(move), 'move roar');
			battle.makeChoices('move rest', 'switch 2');
			assert.equal(battle.p2.active[0].species.id, 'starmie');
		});

		it('should stop trapping the Pokemon if the target uses Rapid Spin', () => {
			battle = common.createBattle([[
				{ species: "Smeargle", ability: 'noguard', moves: [toID(move)] },
				{ species: "Kyurem", ability: 'pressure', moves: ['rest'] },
			], [
				{ species: "Blissey", ability: 'naturalcure', moves: ['rapidspin'] },
				{ species: "Starmie", ability: 'illuminate', moves: ['reflecttype'] },
			]]);
			battle.makeChoices('move ' + toID(move), 'move rapidspin');
			battle.makeChoices('move ' + toID(move), 'switch 2');
			assert.equal(battle.p2.active[0].species.id, 'starmie');
		});
	}
});

describe('Partial Trapping Moves [Gen 1]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('Wrap ends when wrapped Pokemon dies of residual damage', () => {
		battle = common.gen(1).createBattle([[
			{ species: "Arbok", moves: ['wrap', 'toxic'] },
		], [
			{ species: "Rhydon", moves: ['splash'] },
			{ species: "Exeggutor", moves: ['splash'] },
		]]);
		battle.makeChoices('move toxic', 'move splash');
		for (let i = 0; i < 6; i++) {
			battle.makeChoices();
		}
		assert(!battle.p1.active[0].volatiles['partialtrappinglock']);
	});

	it('Wrap ends when wrapped Pokemon switches to a Pokemon that dies of residual damage', () => {
		battle = common.gen(1).createBattle([[
			{ species: "Dragonite", moves: ['wrap', 'seismictoss', 'toxic'], evs: { hp: 255 } },
		], [
			{ species: "Mewtwo", moves: ['splash'], evs: { hp: 255 } },
			{ species: "Exeggutor", moves: ['splash'] },
		]]);
		for (let i = 0; i < 4; i++) {
			battle.makeChoices('move seismictoss', 'auto');
		}
		battle.makeChoices('move toxic', 'auto');
		battle.makeChoices('move wrap', 'switch 2');
		battle.makeChoices('move wrap', 'switch 2');
		battle.makeChoices();
		assert(!battle.p1.active[0].volatiles['partialtrappinglock']);
	});

	it('Wrap ends when wrapper dies to residual damage', () => {
		battle = common.gen(1).createBattle([[
			{ species: "Dragonite", moves: ['wrap', 'splash'] },
			{ species: "Exeggutor", moves: ['splash'] },
		], [
			{ species: "Rhydon", moves: ['toxic'] },
		]]);
		battle.makeChoices('move splash', 'move toxic');
		for (let i = 0; i < 7; i++) {
			battle.makeChoices();
		}
		assert(!battle.p2.active[0].volatiles['partiallytrapped']);
	});

	it('Wrap ends when wrapper switches to a Pokemon that dies of residual damage', () => {
		battle = common.gen(1).createBattle([[
			{ species: "Rhydon", moves: ['splash'], evs: { hp: 255 } },
			{ species: "Dragonite", moves: ['wrap'] },
		], [
			{ species: "Slowbro", moves: ['seismictoss', 'toxic'] },
		]]);
		for (let i = 0; i < 4; i++) {
			battle.makeChoices();
		}
		battle.makeChoices('move splash', 'move toxic');
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices();
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices();
		assert(!battle.p2.active[0].volatiles['partiallytrapped']);
	});

	it('Wrap should damage the target\'s substitute', () => {
		battle = common.gen(1).createBattle([[
			{ species: "charizard", moves: ['wrap'] },
		], [
			{ species: "alakazam", moves: ['splash', 'substitute'] },
		]]);
		const alakazam = battle.p2.active[0];
		battle.makeChoices('move wrap', 'move substitute');
		for (let i = 0; i < 4; i++) {
			// run enough turns to break the substitute
			battle.makeChoices();
			if (!alakazam.volatiles['substitute']) {
				break;
			}
		}
		assert.equal(alakazam.hp, 188);
		assert.false(alakazam.volatiles['substitute']);
	});

	it(`Wrap should never miss if the target is already trapped`, () => {
		battle = common.gen(1).createBattle({ seed: [0, 0, 0, 2] }, [[
			{ species: 'Dragonite', moves: ['wrap'] },
		], [
			{ species: 'Cloyster', moves: ['surf'] },
		]]);
		const cloyster = battle.p2.active[0];
		assert.hurts(cloyster, () => battle.makeChoices());
		assert(cloyster.volatiles['partiallytrapped']);

		battle.forceRandomChance = false;
		assert.hurts(cloyster, () => battle.makeChoices());
		assert(cloyster.volatiles['partiallytrapped']);
	});

	it(`should stay asleep if it switched in after a Pokemon spent a turn trapped`, () => {
		battle = common.gen(1).createBattle({ seed: [0, 0, 0, 3] }, [[
			{ species: 'dragonite', moves: ['wrap', 'spore', 'splash'] },
		], [
			{ species: 'rhydon', moves: ['swordsdance'] },
			{ species: 'exeggutor', moves: ['splash'] },
		]]);
		const rhydon = battle.p2.active[0];

		battle.makeChoices('move spore', 'move swordsdance');
		battle.makeChoices('move wrap', 'switch 2');
		battle.makeChoices('move wrap', 'move fight'); // Exeggutor needs to spend a turn trapped to select a move
		battle.makeChoices('move wrap', 'switch 2');
		assert.equal(battle.p1.active[0].volatiles['partialtrappinglock'].duration, 1); // this is just a rng check
		battle.makeChoices('move wrap', 'move fight');
		assert(!battle.p1.active[0].volatiles['partialtrappinglock']);
		for (let i = 0; i < 20; i++) {
			battle.makeChoices('move splash', 'move fight');
		}
		assert.equal(rhydon.boosts.atk, 0); // it never woke up
		battle.makeChoices('move splash', 'switch 2');
		battle.makeChoices('move splash', 'move splash'); // using a move frees Rhydon from being locked
		battle.makeChoices('move splash', 'switch 2');
		for (let i = 0; i < 5; i++) {
			battle.makeChoices('move splash', 'move fight');
			if (rhydon.status !== 'slp') break;
		}
		battle.makeChoices('move splash', 'move swordsdance'); // it was able to wake up after the switch
		assert.equal(rhydon.boosts.atk, 2);
	});

	it(`should continue if copied by Mirror Move`, () => {
		battle = common.gen(1).createBattle([[
			{ species: 'dragonite', moves: ['wrap'] },
		], [
			{ species: 'rhydon', moves: ['splash'] },
			{ species: 'alakazam', moves: ['mirrormove'] },
		]]);
		battle.makeChoices('move wrap', 'switch 2');
		for (let i = 0; i < 5; i++) {
			// wait for the trap to end
			if (!battle.p2.active[0].volatiles['partiallytrapped']) break;
			battle.makeChoices();
		}
		battle.makeChoices(); // trap back with Mirror Move
		for (let i = 0; i < 5; i++) {
			if (!battle.p1.active[0].volatiles['partiallytrapped']) break;
			battle.makeChoices();
		}
		assert.false(battle.log.some(line => line.includes('Desync Clause Mod activated!')));
		// check if that target is freed and the trapper can choose other moves
		assert(!battle.p1.active[0].volatiles['partiallytrapped']);
		assert.equal(battle.p2.activeRequest.active[0].moves.length, 1);
		assert.equal(battle.p2.activeRequest.active[0].moves[0].id, 'mirrormove');
	});

	it(`should cause a Desync if copied by Mirror Move and the target switches`, () => {
		battle = common.gen(1).createBattle([[
			{ species: 'dragonite', moves: ['wrap'] },
			{ species: 'magikarp', moves: ['splash'] },
		], [
			{ species: 'rhydon', moves: ['splash'] },
			{ species: 'alakazam', moves: ['mirror move'] },
		]]);
		battle.makeChoices('move wrap', 'switch 2');
		for (let i = 0; i < 5; i++) {
			// wait for the trap to end
			if (!battle.p2.active[0].volatiles['partiallytrapped']) break;
			battle.makeChoices();
		}
		battle.makeChoices(); // trap back with Mirror Move
		battle.makeChoices('switch 2', 'move wrap');
		assert(battle.log.slice(-10).some(line => line.includes('Desync Clause Mod activated!')));
		// check if that target is freed and the trapper can choose other moves
		assert(!battle.p1.active[0].volatiles['partiallytrapped']);
		assert.equal(battle.p2.activeRequest.active[0].moves.length, 1);
		assert.equal(battle.p2.activeRequest.active[0].moves[0].id, 'mirrormove');
	});

	it(`should continue if copied by Metronome even if the target switches`, () => {
		battle = common.gen(1).createBattle({ seed: 'gen5,99176924e1c86af0' }, [[
			{ species: 'dragonite', moves: ['splash'] },
			{ species: 'magikarp', moves: ['splash'] },
		], [
			{ species: 'alakazam', moves: ['metronome'] },
		]]);
		battle.makeChoices(); // trap with Metronome
		assert(battle.log.slice(-10).some(line => line === '|move|p2a: Alakazam|Wrap|p1a: Dragonite|[from] Metronome'));
		battle.makeChoices('switch 2', 'move wrap');
		assert.false(battle.log.some(line => line.includes('Desync Clause Mod activated!')));
		// default to Metronome
		assert(battle.log.slice(-10).some(line => line.includes('|move|p2a: Alakazam|Metronome|')));
		// check if that target is freed and the trapper can choose other moves
		assert(!battle.p1.active[0].volatiles['partiallytrapped']);
		assert.equal(battle.p2.activeRequest.active[0].moves.length, 1);
		assert.equal(battle.p2.activeRequest.active[0].moves[0].id, 'metronome');
	});
});
