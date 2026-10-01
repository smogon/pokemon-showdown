/**
 * Tests for the shiny collection chat plugin
 */
'use strict';

const assert = require('../../assert');
const { makeUser, destroyUser } = require('../../users-utils');
const ShinyCollection = require('../../../dist/server/chat-plugins/shiny-collection');

function fakeBattle(format, turns = 0, p1team = [], players = []) {
	const messages = [];
	return {
		format,
		roomid: 'battle-test-1',
		logData: { turns, p1team },
		players,
		room: { add: msg => { messages.push(msg); return { update() {} }; } },
		messages,
	};
}

describe('Shiny collection plugin', () => {
	let user;
	beforeEach(() => {
		ShinyCollection.destroy();
		user = makeUser('Shiny Hunter');
	});
	afterEach(() => {
		if (user.connected) destroyUser(user);
		ShinyCollection.destroy();
		Config.shinycollection = true;
	});

	it('should only apply to random formats from gen 3 on, except SSB', () => {
		assert(ShinyCollection.isEligibleFormat('gen4randombattle'));
		assert(ShinyCollection.isEligibleFormat('gen9randomdoublesbattle'));
		assert.false(ShinyCollection.isEligibleFormat('gen1randombattle'));
		assert.false(ShinyCollection.isEligibleFormat('gen2randombattle'));
		assert.false(ShinyCollection.isEligibleFormat('gen9ou'));
		assert.false(ShinyCollection.isEligibleFormat('gen9superstaffbrosultimate'));
	});

	it('should share one collection across formats and ignore duplicates', () => {
		const added = ShinyCollection.addShinies(user.id, ['Dugtrio', 'Dugtrio'], 'gen4randombattle', 'battle-a');
		assert.deepEqual(added, ['Dugtrio']);
		assert.deepEqual(ShinyCollection.addShinies(user.id, ['Dugtrio'], 'gen9randombattle', 'battle-b'), []);

		assert.deepEqual(ShinyCollection.getShinies(user, fakeBattle('gen4randombattle')), ['Dugtrio']);
		assert.deepEqual(ShinyCollection.getShinies(user, fakeBattle('gen9randombattle')), ['Dugtrio']);
		assert.equal(ShinyCollection.listShinies(user.id)[0].first_formatid, 'gen4randombattle');
	});

	it('should not send species from later generations', () => {
		ShinyCollection.addShinies(user.id, ['Dugtrio', 'Dugtrio-Alola'], 'gen9randombattle', 'battle-a');
		assert.deepEqual(ShinyCollection.getShinies(user, fakeBattle('gen4randombattle')), ['Dugtrio']);
		assert.deepEqual(ShinyCollection.getShinies(user, fakeBattle('gen9randombattle')).sort(), ['Dugtrio', 'Dugtrio-Alola']);
	});

	it('should not return shinies for ineligible formats or unregistered users', () => {
		ShinyCollection.addShinies(user.id, ['Dugtrio'], 'gen4randombattle', 'battle-a');
		assert.equal(ShinyCollection.getShinies(user, fakeBattle('gen2randombattle')), undefined);
		user.registered = false;
		assert.equal(ShinyCollection.getShinies(user, fakeBattle('gen4randombattle')), undefined);
	});

	it('should turn off completely when Config.shinycollection is false', () => {
		ShinyCollection.addShinies(user.id, ['Dugtrio'], 'gen4randombattle', 'battle-a');
		Config.shinycollection = false;
		assert.equal(ShinyCollection.getShinies(user, fakeBattle('gen4randombattle')), undefined);
		assert.equal(ShinyCollection.listShinies(user.id), null);
		assert.deepEqual(ShinyCollection.addShinies(user.id, ['Lapras'], 'gen4randombattle', 'battle-b'), []);
	});

	it('should record shinies at the end of a long enough battle and announce new ones', () => {
		const team = [{ species: 'Gastrodon-East', shiny: true }, { species: 'Rotom-Wash', shiny: false }];
		const players = [{ id: user.id, name: user.name, slot: 'p1' }];

		const short = fakeBattle('gen4randombattle', ShinyCollection.MIN_TURNS - 1, team, players);
		ShinyCollection.recordShinies(short);
		assert.equal(ShinyCollection.listShinies(user.id).length, 0);

		const long = fakeBattle('gen4randombattle', ShinyCollection.MIN_TURNS, team, players);
		ShinyCollection.recordShinies(long);
		assert.deepEqual(ShinyCollection.listShinies(user.id).map(row => row.species), ['Gastrodon']);
		assert.equal(long.messages.length, 1);
		assert(long.messages[0].includes('Gastrodon'));

		// already collected: no second announcement
		const again = fakeBattle('gen9randombattle', 10, team, players);
		ShinyCollection.recordShinies(again);
		assert.equal(again.messages.length, 0);
	});

	it('should save shinies for a player who went offline before the battle ended', () => {
		const userid = user.id;
		const team = [{ species: 'Lapras', shiny: true }];
		const battle = fakeBattle('gen4randombattle', 10, team, [{ id: userid, name: user.name, slot: 'p1' }]);
		ShinyCollection.getShinies(user, battle); // battle start
		destroyUser(user);
		assert(!Users.get(userid));

		ShinyCollection.recordShinies(battle);
		assert.deepEqual(ShinyCollection.listShinies(userid).map(row => row.species), ['Lapras']);
	});
});
