/**
 * Tests for server/modlog.ts
 * Written by Annika
 */

'use strict';

const TEST_PATH = 'test/modlogs';

const {FS} = require('../../.lib-dist/fs');

const ml = require('../../.server-dist/modlog');
const modlog = new ml.Modlog(TEST_PATH);
const assert = require('assert').strict;

const DATASET_A = [
	`[2020-07-29T23:29:49.707Z] (readingtest) ROOMBAN: sometroll [127.0.0.1] by annika (FIRST ENTRY)`,
	`[2020-07-29T23:29:49.717Z] (readingtest) LOCK: sometroll [127.0.0.1] by annika (ENTRY 2)`,
	`[2020-07-29T23:29:49.72Z] (readingtest) ROOMBAN: sometroll [127.0.0.1] by annika (ENTRY 3)`,
	`[2020-07-29T23:29:49.737Z] (readingtest) WEEKLOCK: sometroll [127.0.0.1] by annika (ENTRY 4)`,
	`[2020-07-29T23:29:49.747Z] (readingtest) ROOMBAN: sometroll [127.0.0.1] by annika (ENTRY 5)`,
	`[2020-07-29T23:29:49.757Z] (readingtest) ROOMBAN: sometroll [127.0.0.1] by annika (ENTRY 6)`,
	`[2020-07-29T23:29:49.767Z] (readingtest) MUTE: sometroll [127.0.0.1] by annika (ENTRY 7)`,
	`[2020-07-29T23:29:49.777Z] (readingtest) ROOMBAN: sometroll [127.0.0.1] by annika (ENTRY 8)`,
	`[2020-07-29T23:29:49.787Z] (readingtest) ROOMBAN: sometroll [127.0.0.1] by annika (LAST ENTRY)`,
];

const DATASET_B = [
	`[2020-07-29T23:29:49.797Z] (readingtest2) ROOMBAN: sometroll [127.0.0.1] by annika`,
	`[2020-07-29T23:29:49.807Z] (readingtest2) ROOMBAN: sometroll [127.0.0.1] by annika`,
	`[2020-07-29T23:29:49.817Z] (readingtest2) POLL: by annika`,
	`[2020-07-29T23:29:49.827Z] (readingtest2) ROOMBAN: sometroll [127.0.0.1] by annika`,
	`[2020-07-29T23:29:49.837Z] (readingtest2) TOUR START: by annika`,
];

/**
 * Normalizes a modlog entry, handling timestamps and the like.
 */
const normalizeModlogEntry = (entry) => entry.replace(/\[[^\]]+\]/, `[TIMESTAMP]`);

async function getLines(roomid) {
	const lines = (await FS(`${TEST_PATH}/modlog_${modlog.getSharedID(roomid) || roomid}.txt`).read()).split('\n');
	let lastLine;
	while (!lastLine) lastLine = lines.pop();
	if (!lastLine) throw new Error(`No modlog lines written.`);
	return {lastLine, lines};
}

describe('Modlog (without FS writes)', () => {
	it('should correctly determine if a room has a shared modlog', () => {
		assert(modlog.getSharedID('battle-gen8randombattle-42'));
		assert(modlog.getSharedID('groupchat-annika-shitposting'));
		assert(modlog.getSharedID('help-mePleaseIAmTrappedInAUnitTestFactory'));

		assert(!modlog.getSharedID('1v1'));
		assert(!modlog.getSharedID('development'));
	});

	it('should throw an error when writing to a destroyed modlog stream', () => {
		modlog.initialize('somedeletedroom');
		assert.doesNotThrow(() => modlog.write('somedeletedroom', 'ROOMBAN: sometroll [127.0.0.1] by annika'));
		modlog.destroy('somedeletedroom');
		assert.throws(() => modlog.write('somedeletedroom', 'ROOMBAN: sometroll [127.0.0.1] by annika'));
	});

	it('should throw an error when writing to an uninitialized modlog stream', () => {
		assert.throws(() => modlog.write('lmaothisroomisntreal', 'ROOMBAN: sometroll [127.0.0.1] by annika'));
		modlog.initialize('itsrealnow');
		assert.doesNotThrow(() => modlog.write('itsrealnow', 'ROOMBAN: sometroll [127.0.0.1] by annika'));
	});
});

describe.skip('Modlog (with FS writes)', () => {
	before(async () => {
		/**
		 * Some modlog tests involve writing to the filesystem.
		 * Filesystem writes are disabled again in after(),
		 * so this only affects tests in this describe().
		 */
		Config.nofswriting = false;

		await FS(TEST_PATH).mkdirp();
		await FS(`${TEST_PATH}/modlog_readingtest.txt`).write(DATASET_A.join('\n') + '\n');
		await FS(`${TEST_PATH}/modlog_readingtest2.txt`).write(DATASET_B.join('\n') + '\n');
	});

	after(async () => {
		// This currently fails on Windows; it fails to remove
		// the directory and crashes as a result
		await FS(TEST_PATH).rmdir(true);
		Config.nofswriting = true;
	});

	/*******************************
	 * Tests for writing to modlog *
	 *******************************/
	it('should write messages serially to the modlog', async () => {
		modlog.initialize('development');
		modlog.write('development', 'ROOMOWNER: [somecooluser] by someadmin');
		modlog.write('development', 'ROOMBAN: [kjnhvgcfg] [127.0.0.1] by annika');
		await modlog.destroy('development'); // ensure all writes have synced to disk

		const lines = await getLines('development');

		assert.equal(
			normalizeModlogEntry(lines.lastLine),
			normalizeModlogEntry('[2020-07-29T23:29:49.797Z] (development) ROOMBAN: [kjnhvgcfg] [127.0.0.1] by annika')
		);
		assert.equal(
			normalizeModlogEntry(lines.lines.pop()),
			normalizeModlogEntry('[2020-07-29T23:29:49.797Z] (development) ROOMOWNER: [somecooluser] by someadmin')
		);
	});

	it('should support renaming modlogs', async () => {
		const message = 'ROOMREGULAR USER: [somerandomreg] by annika (demote)';
		// Modlog renaming tests should pass whether or not the room names within the file are changed
		const messageRegex = /\[[^\]]+\] \((oldroom|newroom)\) ROOMREGULAR USER: \[somerandomreg\] by annika \(demote\)/;
		modlog.initialize('oldroom');
		modlog.write('oldroom', message);
		await modlog.rename('oldroom', 'newroom');

		assert(FS(`${TEST_PATH}/modlog_newroom.txt`).existsSync());
		assert.throws(() => modlog.write('oldroom', 'something'));

		let lastLine = (await getLines('newroom')).lastLine;
		assert(messageRegex.test(lastLine));

		modlog.write('newroom', 'ROOMBAN: [kjnhvgcfg] [127.0.0.1] by annika');
		await modlog.destroy('newroom'); // ensure all writes have synced to disk

		lastLine = (await getLines('newroom')).lastLine;
		assert.equal(
			normalizeModlogEntry(lastLine),
			normalizeModlogEntry('[2020-07-29T23:29:49.797Z] (newroom) ROOMBAN: [kjnhvgcfg] [127.0.0.1] by annika')
		);
	});

	it('should use overrideID if specified', async () => {
		modlog.initialize('battle-gen8randombattle-1337');
		modlog.write('battle-gen8randombattle-1337', 'MODCHAT: by annika: to +', 'actually this: cool name');
		await modlog.destroy('battle-gen8randombattle-1337'); // ensure all writes have synced to disk

		const lastLine = (await getLines('battle-gen8randombattle-1337')).lastLine;
		assert.equal(
			normalizeModlogEntry(lastLine),
			normalizeModlogEntry('[2020-07-29T23:29:49.797Z] (actually this: cool name) MODCHAT: by annika: to +')
		);
	});

	/**************************************
	 * Tests for reading/searching modlog *
	 **************************************/
	it('should read the entire modlog file when not limited', async () => {
		const results = await modlog.runSearch(['readingtest'], '', false, 10000, false);
		assert.equal(results.length, DATASET_A.length);
	});

	it("should support searching multiple rooms' modlogs", async () => {
		const results = await modlog.runSearch(['readingtest', 'readingtest2'], '', false, 10000, false);
		assert.equal(results.length, DATASET_A.length + DATASET_B.length);
	});

	it('should be case-insensitive', async () => {
		const notExactUpper = await modlog.runSearch(['readingtest'], 'someTRoll', false, 10000, false);
		const notExactLower = await modlog.runSearch(['readingtest'], 'someTRoll', false, 10000, false);
		const exactUpper = await modlog.runSearch(['readingtest'], 'sOmEtRoLl', true, 10000, false);
		const exactLower = await modlog.runSearch(['readingtest'], 'sOmEtRoLl', true, 10000, false);

		assert.deepEqual(notExactUpper, notExactLower);
		assert.deepEqual(exactUpper, exactLower);
	});

	it('should respect isExact', async () => {
		const notExact = await modlog.runSearch(['readingtest'], 'troll', false, 10000, false);
		const exact = await modlog.runSearch(['readingtest'], 'troll', true, 10000, false);

		assert.equal(notExact.length, 0);
		assert(exact.length);
	});

	it('should be LIFO (last-in, first-out)', async () => {
		modlog.initialize('lifotest');
		modlog.write('lifotest', 'firstwrite');
		modlog.write('lifotest', 'secondwrite');
		await modlog.destroy('lifotest');

		const search = await modlog.runSearch(['lifotest'], '', false, 10000, false);

		assert.equal(search.length, 2);

		assert(search[0].includes('secondwrite'));
		assert(!search[0].includes('firstwrite'));

		assert(search[1].includes('firstwrite'));
		assert(!search[1].includes('secondwrite'));
	});

	it('should support limiting the number of responses', async () => {
		const unlimited = await modlog.runSearch(['readingtest'], '', false, 10000, false);
		const limited = await modlog.runSearch(['readingtest'], '', false, 5, false);

		assert.equal(limited.length, 5);
		assert(unlimited.length > limited.length);

		assert(limited[0].includes('LAST ENTRY'));
		assert(unlimited[0].includes('LAST ENTRY'));

		const limitedLast = limited.pop();
		const unlimitedLast = unlimited.pop();

		assert(!limitedLast.includes('FIRST ENTRY'));
		assert(unlimitedLast.includes('FIRST ENTRY'));
	});

	it('should support filtering out non-punishment-related logs', async () => {
		const all = await modlog.runSearch(['readingtest2'], '', false, 10000, false);
		const onlyPunishments = await modlog.runSearch(['readingtest2'], '', false, 10000, true);

		assert(all.length > onlyPunishments.length);
		assert.equal(
			onlyPunishments.filter(result => result.includes('ROOMBAN')).length,
			onlyPunishments.length
		);
	});
});
