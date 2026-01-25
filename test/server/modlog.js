/**
 * Tests for the modlog
 * Written by Annika
 */

'use strict';

const assert = require('assert').strict;

const DATASET_A = [
	{ action: 'ROOMBAN', userid: 'sometroll', ip: '127.0.0.1', loggedBy: 'annika', note: 'FIRST ENTRY', time: 1 },
	{ action: 'LOCK', userid: 'sometroll', ip: '127.0.0.1', loggedBy: 'annika', note: 'ENTRY 2', time: 2 },
	{ action: 'ROOMBAN', userid: 'sometroll', ip: '127.0.0.1', loggedBy: 'annika', note: 'ENTRY 3', time: 3 },
	{ action: 'WEEKLOCK', userid: 'sometroll', ip: '127.0.0.1', loggedBy: 'annika', note: 'this entry has many parts', time: 4 },
	{ action: 'ROOMBAN', userid: 'sometroll', ip: '127.0.0.1', loggedBy: 'annika', note: 'ENTRY 5', time: 5 },
	{ action: 'ROOMBAN', userid: 'sometroll', ip: '127.0.0.1', loggedBy: 'annika', note: 'ENTRY 6', time: 6 },
	{ action: 'MUTE', userid: 'sometroll', ip: '127.0.0.1', loggedBy: 'annika', note: 'ENTRY 7', time: 7 },
	{ action: 'ROOMBAN', userid: 'sometroll', ip: '127.0.0.1', loggedBy: 'annika', note: 'ENTRY 8', time: 8 },
	{ action: 'ROOMBAN', userid: 'sometroll', ip: '127.0.0.1', loggedBy: 'annika', note: 'LAST ENTRY', time: 9 },
];

const DATASET_B = [
	{ action: 'ROOMBAN', userid: 'sometroll', ip: '127.0.0.1', loggedBy: 'annika' },
	{ action: 'ROOMBAN', userid: 'sometroll', ip: '127.0.0.1', loggedBy: 'annika' },
	{ action: 'POLL', loggedBy: 'annika' },
	{ action: 'ROOMBAN', userid: 'sometroll', ip: '127.0.0.1', loggedBy: 'annika' },
	{ action: 'TOUR START', loggedBy: 'annika' },
];

async function lastLine(database, roomid) {
	const prepared = await database.prepare(
		`SELECT * FROM modlog WHERE roomid = ? ORDER BY modlog_id DESC LIMIT 1`
	);
	return database.get(prepared, [roomid]);
}

(Config.usesqlite && Config.usesqlitemodlog ? describe : describe.skip)('Modlog', () => {
	before(async () => {
		if (Rooms.Modlog.readyPromise) {
			await Rooms.Modlog.readyPromise;
		}
		if (!Rooms.Modlog.databaseReady) throw new Error(`Failed to ready up modlog database`);
	});

	describe('Modlog#prepareSQLSearch', () => {
		it('should respect the maxLines parameter', async () => {
			const query = Rooms.Modlog.prepareSQLSearch(['lobby'], 1337, false, { note: [], user: [], ip: [], action: [], actionTaker: [] });
			assert(query.queryText.endsWith('LIMIT ?'));
			assert(query.args.includes(1337));

			const noMaxLines = Rooms.Modlog.prepareSQLSearch(['lobby'], 0, false, { note: [], user: [], ip: [], action: [], actionTaker: [] });
			assert(!noMaxLines.queryText.includes('LIMIT'));
		});

		it('should attempt to respect onlyPunishments', async () => {
			const query = Rooms.Modlog.prepareSQLSearch(['lobby'], 0, true, { note: [], user: [], ip: [], action: [], actionTaker: [] });
			assert(query.queryText.includes('action IN ('));
			assert(query.args.includes('WEEKLOCK'));
		});
	});

	describe('Modlog#getSharedID', () => {
		it('should detect shared modlogs', () => {
			assert(Rooms.Modlog.getSharedID('battle-gen8randombattle-42'));
			assert(Rooms.Modlog.getSharedID('groupchat-annika-shitposting'));
			assert(Rooms.Modlog.getSharedID('help-mePleaseIAmTrappedInAUnitTestFactory'));

			assert(!Rooms.Modlog.getSharedID('1v1'));
			assert(!Rooms.Modlog.getSharedID('development'));
		});
	});

	describe('Modlog#write', () => {
		it('should write messages serially to the modlog', async () => {
			await Rooms.Modlog.write('development', { note: 'This message is logged first', action: 'UNITTEST' });
			await Rooms.Modlog.write('development', { note: 'This message is logged second', action: 'UNITTEST' });
			const lines = await Rooms.Modlog.database.all(await Rooms.Modlog.database.prepare(
				// Order by modlog_id since the writes most likely happen at the same second
				`SELECT * FROM modlog WHERE roomid = 'development' ORDER BY modlog_id DESC LIMIT 2`
			));

			assert.equal(lines.pop().note, 'This message is logged first');
			assert.equal(lines.pop().note, 'This message is logged second');
		});

		it('should use overrideID if specified', async () => {
			await Rooms.Modlog.write('battle-gen8randombattle-1337', { note: "I'm testing overrideID", action: 'UNITTEST' }, 'heyadora');
			const line = await lastLine(Rooms.Modlog.database, 'battle-gen8randombattle-1337');
			assert.equal(line.note, "I'm testing overrideID");
			assert.equal(line.visual_roomid, 'heyadora');
		});
	});

	describe("Modlog#rename", () => {
		it('should rename modlogs', async () => {
			const entry = { note: 'This is in a modlog that will be renamed!', action: 'UNITTEST' };

			await Rooms.Modlog.write('oldroom', entry);
			await Rooms.Modlog.rename('oldroom', 'newroom');
			const line = await lastLine(Rooms.Modlog.database, 'newroom');

			assert.equal(entry.action, line.action);
			assert.equal(entry.note, line.note);

			const newEntry = { note: 'This modlog has been renamed!', action: 'UNITTEST' };
			await Rooms.Modlog.write('newroom', newEntry);

			const newLine = await lastLine(Rooms.Modlog.database, 'newroom');

			assert.equal(newEntry.action, newLine.action);
			assert.equal(newEntry.note, newLine.note);
		});
	});

	describe('Modlog#search', () => {
		before(async () => {
			for (const entry of DATASET_A) {
				await Rooms.Modlog.write('readingtest', entry);
			}
			for (const entry of DATASET_B) {
				await Rooms.Modlog.write('readingtest2', entry);
			}
		});

		it('should be capable of reading the entire modlog file', async () => {
			const results = await Rooms.Modlog.search('readingtest2', { note: [], user: [], ip: [], action: [], actionTaker: [] }, 10000);
			assert.equal(results.results.length, DATASET_B.length);
		});

		it('user searches should be case-insensitive', async () => {
			const notExactUpper = await Rooms.Modlog.search('readingtest', { user: [{ search: 'sOmETRoll', isExact: false }], note: [], ip: [], action: [], actionTaker: [] });
			const notExactLower = await Rooms.Modlog.search('readingtest', { user: [{ search: 'sometroll', isExact: false }], note: [], ip: [], action: [], actionTaker: [] });
			const exactUpper = await Rooms.Modlog.search('readingtest', { user: [{ search: 'sOMEtroLL', isExact: true }], note: [], ip: [], action: [], actionTaker: [] });
			const exactLower = await Rooms.Modlog.search('readingtest', { user: [{ search: 'sometroll', isExact: true }], note: [], ip: [], action: [], actionTaker: [] });

			assert.deepEqual(notExactUpper.results, notExactLower.results);
			assert.deepEqual(exactUpper.results, exactLower.results);
		});

		// isExact is currently set up to search for the entire note equalling the search
		// this could be redesigned, but is what we currently test for.
		it('note searches should respect isExact', async () => {
			const notExact = await Rooms.Modlog.search('readingtest', { note: [{ search: 'has man', isExact: false }], user: [], ip: [], action: [], actionTaker: [] });
			const exact = await Rooms.Modlog.search('readingtest', { note: [{ search: 'has man', isExact: true }], user: [], ip: [], action: [], actionTaker: [] });

			assert.equal(exact.results.length, 0);
			assert(notExact.results.length);
		});

		it('should be LIFO (last-in, first-out)', async () => {
			await Rooms.Modlog.write('lifotest', { note: 'firstwrite', action: 'UNITTEST', timestamp: 1 });
			await Rooms.Modlog.write('lifotest', { note: 'secondwrite', action: 'UNITTEST', timestamp: 2 });
			const search = await Rooms.Modlog.search('lifotest');

			// secondwrite was last in, so it should be first out (results[0])
			assert.notEqual(search.results[0].note, 'firstwrite');
			assert.equal(search.results[0].note, 'secondwrite');

			// firstwrite was first in, so it should be last out (results[1])
			assert.notEqual(search.results[1].note, 'secondwrite');
			assert.equal(search.results[1].note, 'firstwrite');
		});

		it('should support limiting the number of responses', async () => {
			const unlimited = await Rooms.Modlog.search('readingtest');
			const limited = await Rooms.Modlog.search('readingtest', { note: [], user: [], ip: [], action: [], actionTaker: [] }, 5);

			assert.equal(limited.results.length, 5);
			assert(unlimited.results.length > limited.results.length);

			assert(limited.results[0].note.includes('LAST ENTRY'));
			assert(unlimited.results[0].note.includes('LAST ENTRY'));

			const limitedLast = limited.results.pop().note;
			const unlimitedLast = unlimited.results.pop().note;

			assert(!limitedLast.includes('FIRST ENTRY'));
			assert(unlimitedLast.includes('FIRST ENTRY'));
		});

		it('should support filtering out non-punishment-related logs', async () => {
			const all = (await Rooms.Modlog.search('readingtest2', { note: [], user: [], ip: [], action: [], actionTaker: [] }, 20, false)).results;
			const onlyPunishments = (await Rooms.Modlog.search('readingtest2', { note: [], user: [], ip: [], action: [], actionTaker: [] }, 20, true)).results;

			assert(all.length > onlyPunishments.length);
			assert.equal(
				onlyPunishments.filter(result => result.action === 'ROOMBAN').length,
				onlyPunishments.length
			);
		});
	});
});
