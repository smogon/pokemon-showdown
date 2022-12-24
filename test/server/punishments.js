'use strict';
/**
 * Tests for Punishments.
 *
 * @author mia-pi-git
 * @author Annika
 */
const assert = require('../assert');
const {makeUser, makeConnection} = require('../users-utils');
const {Punishments} = require('../../dist/server/punishments');

const TEST_PUNISHMENT_DURATION = 1000; // 1 second

describe("Punishments", () => {
	it("Should properly sort punishments by weight", () => {
		const list = [
			{type: "LOCK", id: "User 1", expireTime: Date.now() + 1000, reason: ''},
			{type: "SEMILOCK", id: "User 2", expireTime: Date.now() + 1000, reason: ''},
			{type: "BAN", id: "", expireTime: Date.now() + 1000, reason: ''},
		];
		Punishments.byWeight(list);
		assert.equal(list[0].type, 'BAN');
	});
	it("Should prevent a user from having two punishments of the same type", () => {
		Punishments.userids.add('banmeplease', {type: 'BAN', expireTime: Date.now() + 30 * 1000, id: 'banmeplease', reason: ''});
		Punishments.userids.add("banmeplease", {type: 'BAN', expireTime: Date.now() + 30 * 1000, id: 'banmeplease', reason: 'ok'});
		assert.equal(Punishments.userids.get('banmeplease').length, 1);
	});
	it("Should overwrite the old reason when a user receives two of the same punishment", () => {
		Punishments.userids.add('banmeplease', {type: 'BAN', expireTime: Date.now() + 30 * 1000, id: 'banmeplease', reason: ''});
		Punishments.userids.add("banmeplease", {type: 'BAN', expireTime: Date.now() + 30 * 1000, id: 'banmeplease', reason: 'ok'});
		assert.equal(Punishments.userids.getByType('banmeplease', 'BAN').reason, 'ok');
	});
	it("Should properly filter out expiring punishments", () => {
		const punishments = [{type: 'BAN', expireTime: Date.now() - 1000, id: 'banmeplease', reason: ''}];
		Punishments.userids.removeExpiring(punishments);
		assert.equal(punishments.length, 0);
	});
	it("Should be able to remove only one punishment from the list by passing an object", () => {
		const [expireTime, reason, id] = [Date.now() + 1000, '', 'banmeplease'];
		Punishments.userids.add(id, {type: 'BAN', expireTime, reason, id});
		Punishments.userids.add(id, {type: 'RICKROLL', expireTime, reason, id});
		Punishments.userids.deleteOne(id, {type: 'RICKROLL', expireTime, reason, id});
		assert.equal(Punishments.userids.get(id).length, 1);
	});

	it('should properly search for IP punishments by type', () => {
		const [expireTime, reason, id] = [Date.now() + 1000, '', 'banmeplease'];
		Punishments.ips.add('127.0.0.1', {type: 'BAN', expireTime, reason, id});
		Punishments.ips.add('127.0.0.1', {type: 'RICKROLL', expireTime, reason, id});
		Punishments.ips.add('127.0.*', {type: 'RANGEBAN', expireTime, reason, id});

		const allIPPunishments = Punishments.ipSearch('127.0.0.1');
		assert(Array.isArray(allIPPunishments));
		assert.equal(allIPPunishments.length, 3);

		const ban = Punishments.ipSearch('127.0.0.1', 'BAN');
		assert(!Array.isArray(ban));
		assert.equal(ban.type, 'BAN');

		const rickroll = Punishments.ipSearch('127.0.0.1', 'RICKROLL');
		assert(!Array.isArray(rickroll));
		assert.equal(rickroll.type, 'RICKROLL');
	});
});

describe('broader, more integrated Punishments tests', function () {
	before(() => {
		this.room = Rooms.get('lobby');

		this.parse = async function (message) {
			Chat.loadPlugins();
			const context = new Chat.CommandContext({
				message,
				room: this.room,
				user: this.user,
				connection: this.connection,
			});
			return context.parse();
		};
	});

	describe('room bans', () => {
		before(() => {
			this.user = makeUser("Roomban Me Please", '127.0.0.8');
			this.connection = this.user.connections[0];
			this.user.joinRoom(this.room.roomid, this.connection);
		});

		beforeEach(async () => Punishments.roomBan(this.room, this.user, Date.now() + TEST_PUNISHMENT_DURATION, this.user.id, false, 'test'));
		afterEach(() => Punishments.roomUnban(this.room, this.user.id));

		it('should force the user to leave the room and prevent them from rejoining', async () => {
			assert.equal(this.user.id in this.room.users, false, `user should not be in the room`);
			let joinAttempt = await this.user.tryJoinRoom(this.room, this.connection);
			assert.equal(joinAttempt, false, `user should be unable to join a room they are banned from`);

			Punishments.roomUnban(this.room, this.user.id);
			joinAttempt = await this.user.tryJoinRoom(this.room, this.connection);
			assert.equal(joinAttempt, true, `user should be able to join the room once they are unbanned`);
		});

		it.skip('should expire on its own', done => {
			assert(Punishments.hasRoomPunishType(this.room, 'roombanmeplease', 'ROOMBAN'), `should be in effect`);

			setTimeout(() => {
				assert(!Punishments.hasRoomPunishType(this.room, 'roombanmeplease', 'ROOMBAN'), `should have expired`);
				done();
			}, TEST_PUNISHMENT_DURATION);
		});
	});

	describe('locks (network) (slow)', () => {
		before(() => {
			this.user = makeUser("Lock Me Please", '127.0.0.3');
			this.connection = this.user.connections[0];
			this.user.joinRoom(this.room.roomid, this.connection);
		});

		beforeEach(async () => Punishments.lock(this.user, Date.now() + TEST_PUNISHMENT_DURATION, this.user.id, false, 'test'));
		afterEach(() => Punishments.unlock(this.user.id));

		it('should prevent users from chatting in rooms while they are locked', async () => {
			const initialLogLength = this.room.log.log.length;

			await this.parse("Hi! I'm a locked user!");
			assert.equal(this.room.log.log.length, initialLogLength, `user should be unable to sucessfully chat while locked`);

			Punishments.unlock(this.user.id);
			await this.parse("/msgroom lobby,Hi! I'm no longer locked!");
			// we can't just check the roomlog length because unlocking adds a |n| message to
			const lastMessage = this.room.log.log.pop();
			assert(lastMessage.endsWith(` Lock Me Please|Hi! I'm no longer locked!`), `user should have sucessfuly sent a message after being locked`);
		});

		// This test relies on Chat#parse returning `false` when permission is denied.
		// I'm not sure if this is an intended feature, but the way Chat is currently implemented,
		// an `ErrorMessage` is the only time `false` will be returned by Chat#parse (unless a chat command returns it, which /msg does not).
		// If you are here because this test is failing, check if the above assumptions are still valid.
		// If they are not, the test should either be refactored to use another way of
		// determining whether a PM was sucessful (such as modifying Chat.sendPM), or skipped entirely.
		it('should prevent users from sending PMs other than to staff while they are locked', async () => {
			makeUser("Some Random Reg", '127.0.0.4');
			makeUser("Annika", '127.0.0.5').tempGroup = '&';

			let result = await this.parse("/msg Some Random Reg, Hi! I'm a locked user!");
			assert.equal(result, false, `user should be unable to sucessfully send PMs while locked`);

			result = await this.parse("/msg Annika, Hi! I'm a locked user!");
			assert.notEqual(result, false, `user should be able to send PMs to global staff while locked`);

			Punishments.unlock(this.user.id);
			result = await this.parse("/msg Annika, Hi! I'm a locked user!");
			assert.notEqual(result, false, `user should be able to send PMs after being unlocked`);
			result = await this.parse("/msg Some Random Reg, Hi! I'm a locked user!");
			assert.notEqual(result, false, `user should be able to send PMs after being unlocked`);
		});

		// expiry tests are skipped because they fail when another test fails.
		// I don't know why this happens; I'm guessing it's an ideosycrasy of Mocha.
		it.skip('should expire on its own', done => {
			assert(this.user.locked);
			assert(Punishments.hasPunishType(this.user.id, 'LOCK'));

			setTimeout(() => {
				assert(!this.user.locked);
				assert(!Punishments.hasPunishType(this.user.id, 'LOCK'));
				done();
			}, TEST_PUNISHMENT_DURATION);
		});
	});

	describe('namelocks (network) (slow)', () => {
		before(() => {
			this.user = makeUser("Namelock Me Please", '127.0.0.6');
			this.connection = this.user.connections[0];
			this.user.joinRoom(this.room.roomid, this.connection);
		});

		beforeEach(async () => Punishments.namelock(this.user, Date.now() + TEST_PUNISHMENT_DURATION, this.user.id, false, 'test'));
		afterEach(() => Punishments.unnamelock(this.user.id));

		it('should prevent the user from having a username', async () => {
			assert(this.user.id.startsWith('guest'));

			await this.user.rename('some other name', '', false, this.connection);
			assert(this.user.id.startsWith('guest'));
		});

		it.skip('should expire on its own', done => {
			assert(this.user.locked);
			assert(this.user.namelocked);
			assert(Punishments.hasPunishType('namelockmeplease', 'NAMELOCK'));

			setTimeout(() => {
				assert(!this.user.locked);
				assert(!this.user.namelocked);
				assert(!Punishments.hasPunishType('namelockmeplease', 'NAMELOCK'));
				done();
			}, TEST_PUNISHMENT_DURATION);
		});
	});

	describe('global bans (network) (slow)', () => {
		before(() => {
			this.user = makeUser("Ban Me Please", '127.0.0.7');
			this.connection = this.user.connections[0];
			this.user.joinRoom(this.room.roomid, this.connection);
		});

		beforeEach(async () => Punishments.ban(this.user, Date.now() + TEST_PUNISHMENT_DURATION, this.user.id, false, 'test'));
		afterEach(() => Punishments.unban(this.user.id));

		it('should disconnect the user and prevent them from reconnecting', () => {
			assert.equal(this.user.connected, false, `user should be disconnected`);

			const conn = makeConnection('127.0.0.7');
			assert(Punishments.checkIpBanned(conn), `IP should be banned`);
		});

		it.skip('should expire on its own', done => {
			assert(Punishments.checkIpBanned(makeConnection('127.0.0.7')), `IP should be banned`);
			assert(Punishments.hasPunishType('banmeplease', 'BAN'));

			setTimeout(() => {
				assert(!Punishments.checkIpBanned(makeConnection('127.0.0.7')), `IP should no longer be banned`);
				assert(!Punishments.hasPunishType('banmeplease', 'BAN'));
				done();
			}, TEST_PUNISHMENT_DURATION);
		});
	});
});
