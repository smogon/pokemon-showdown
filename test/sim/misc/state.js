'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const Battle = require('./../../../dist/sim/battle').Battle;
const State = require('./../../../dist/sim/state').State;

const TEAMS = [[
	{species: 'Mew', ability: 'synchronize', item: 'assaultvest', moves: ['psychic']},
	{species: 'Ditto', ability: 'imposter', item: 'choicescarf', moves: ['transform']},
	{species: 'Amoonguss', ability: 'effectspore', item: 'blacksludge', moves: ['toxic']},
	{species: 'Gliscor', ability: 'poisonheal', item: 'toxicorb', moves: ['curse']},
	{species: 'Zoroark', ability: 'illusion', item: 'leftovers', moves: ['knockoff']},
	{species: 'Gengar', ability: 'cursedbody', item: 'brightpowder', moves: ['disable']},
], [
	{species: 'Ninjask', ability: 'speedboost', item: 'rockyhelmet', moves: ['batonpass']},
	{species: 'Hippowdon', ability: 'sandstream', item: 'choiceband', moves: ['earthquake']},
	{species: 'Jirachi', ability: 'serenegrace', item: 'choicescarf', moves: ['ironhead']},
	{species: 'Chansey', ability: 'naturalcure', item: 'eviolite', moves: ['seismictoss']},
	{species: 'Vaporeon', ability: 'waterabsorb', item: 'wacanberry', moves: ['surf']},
	{species: 'Snorlax', ability: 'thickfat', item: 'leftovers', moves: ['rest']},
]];

describe('State', function () {
	describe('Battles', function () {
		it('should be able to be serialized and deserialized without affecting functionality (slow)', function () {
			this.timeout(5000);
			const control = common.createBattle(TEAMS);
			let test = common.createBattle(TEAMS);

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
		it('should require special treatment for complex objects', function () {
			const battle = common.createBattle(TEAMS);
			battle.foo = new Map();
			assert.throws(() => battle.toJSON(), /Unsupported type Map/);
		});
	});
});
