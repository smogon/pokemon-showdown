'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const Battle = require('./../../../dist/sim/battle').Battle;
const State = require('./../../../dist/sim/state').State;

const TEAMS = [[
	{ species: 'Mew', ability: 'synchronize', item: 'assaultvest', moves: ['psychic'] },
	{ species: 'Ditto', ability: 'imposter', item: 'choicescarf', moves: ['transform'] },
	{ species: 'Amoonguss', ability: 'effectspore', item: 'blacksludge', moves: ['toxic'] },
	{ species: 'Gliscor', ability: 'poisonheal', item: 'toxicorb', moves: ['curse'] },
	{ species: 'Zoroark', ability: 'illusion', item: 'leftovers', moves: ['knockoff'] },
	{ species: 'Gengar', ability: 'cursedbody', item: 'brightpowder', moves: ['disable'] },
], [
	{ species: 'Ninjask', ability: 'speedboost', item: 'rockyhelmet', moves: ['batonpass'] },
	{ species: 'Hippowdon', ability: 'sandstream', item: 'choiceband', moves: ['earthquake'] },
	{ species: 'Jirachi', ability: 'serenegrace', item: 'choicescarf', moves: ['ironhead'] },
	{ species: 'Chansey', ability: 'naturalcure', item: 'eviolite', moves: ['seismictoss'] },
	{ species: 'Vaporeon', ability: 'waterabsorb', item: 'wacanberry', moves: ['surf'] },
	{ species: 'Snorlax', ability: 'thickfat', item: 'leftovers', moves: ['rest'] },
]];

describe('State', () => {
	describe('Battles', () => {
		it('should be able to be serialized and deserialized without affecting functionality (slow)', function () {
			this.timeout(5000);
			const control = common.createBattle({ seed: 'sodium,00000001000000020000000300000004' }, TEAMS);
			let test = common.createBattle({ seed: 'sodium,00000001000000020000000300000004' }, TEAMS);

			while (!(control.ended || test.ended)) {
				control.makeChoices();
				test.makeChoices();

				assert.deepEqual(State.normalize(test.toJSON()), State.normalize(control.toJSON()));

				// Roundtrip the test battle to confirm it still works.
				const send = test.send;
				test = Battle.fromJSON(JSON.stringify(test));
				test.restart(send);
			}

			control.destroy();
			test.destroy();
		});
		it('should require special treatment for complex objects', () => {
			const battle = common.createBattle(TEAMS);
			battle.foo = new Map();
			assert.throws(() => battle.toJSON(), /Unsupported type Map/);
		});
		it('should deserialize a Pokemon that transformed into a Pokemon with fewer moves', () => {
			const battle = common.createBattle([[
				{ species: 'Smeargle', moves: ['transform', 'feint', 'darkvoid', 'spikyshield'] },
			], [
				{ species: 'Talonflame', moves: ['bravebird', 'flareblitz', 'sleeptalk'] },
			]]);
			battle.makeChoices('move transform', 'move sleeptalk');
			assert.equal(battle.p1.active[0].moveSlots.length, 3);
			assert.equal(battle.p1.active[0].baseMoveSlots.length, 4);

			const copy = State.deserializeBattle(State.serializeBattle(battle));
			const smeargle = copy.p1.active[0];
			assert.deepEqual(smeargle.moveSlots.map(moveSlot => moveSlot.id), ['bravebird', 'flareblitz', 'sleeptalk']);
			assert.deepEqual(smeargle.baseMoveSlots.map(moveSlot => moveSlot.id), ['transform', 'feint', 'darkvoid', 'spikyshield']);

			battle.destroy();
			copy.destroy();
		});
	});
});
