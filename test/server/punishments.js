'use strict';
/**
 * Tests to ensure punishments are sorted and handled properly.
 * @author mia-pi-git
 */
const assert = require('../assert');
const {Punishments} = require('../../.server-dist/punishments');

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
