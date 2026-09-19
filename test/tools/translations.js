'use strict';
/* eslint-disable no-template-curly-in-string */

const assert = require('assert').strict;

const { TLCalls } = require('../../tools/tl-calls.mts');
const { ParsedCatalog, compileTranslations, validateCatalog } = require('../../tools/translations.mts');
const { TL_CALL_OPTIONS, updateTranslationFiles } = require('../../tools/build-translations.mts');

describe('Translation catalogs', () => {
	it('discovers server TL calls and assigns their catalogs', () => {
		const calls = TLCalls.fromSource(`
			const players = this.TL\`Players: \${game.formatPlayerList({ max: null, requirePoints: false })}\`;
			const refresh = this.TL("Refresh");
			const term = TL.term.moves;
			const moveName = TL(move);
			const roomTagged = room.TL\`Poll\`;
			const laterKey = TLkey\`Marked for later\`;
		`, 'trivia.ts', TL_CALL_OPTIONS);

		assert.deepEqual([...calls.keys()], ['Players: {0}', 'Poll', 'Marked for later', 'Refresh']);
		assert.deepEqual(calls.get('Players: {0}').placeholders, [
			'game.formatPlayerList( max: null, requirePoints: false )',
		]);
		assert.equal(calls.get('Players: {0}').catalog, 'trivia');
		assert.equal(calls.get('Players: {0}').region, '');
	});

	it('rejects TLkey markers with substitutions', () => {
		assert.throws(() => TLCalls.fromSource('const key = TLkey`Hello ${name}`;', 'x.ts'), /TLkey strings can't contain/);
	});

	it('routes keys shared between catalogs to the shared catalog', () => {
		const calls = new TLCalls(TL_CALL_OPTIONS);
		calls.scan('this.TL`Shared`; this.TL`Only trivia`;', 'trivia.ts');
		calls.scan('this.TL`Shared`;', 'poll.ts');
		assert.equal(calls.get('Shared').catalog, 'main');
		assert.equal(calls.get('Only trivia').catalog, 'trivia');
	});

	it('supports region maps for projects with regioned templates', () => {
		const calls = TLCalls.fromSource('TL`Forfeit`;', 'panel-battle.tsx', {
			regionByFile: { 'panel-battle.tsx': 'Battle' },
			defaultCatalog: 'ui',
			sharedRegion: 'Generic UI',
		});
		assert.equal(calls.get('Forfeit').catalog, 'ui');
		assert.equal(calls.get('Forfeit').region, 'Battle');
	});

	it('discovers both direct and contextual calls', () => {
		const calls = TLCalls.fromSource(`
			this.TL("Open");
			this.TL("Open", 'verb');
			TL('Open', "adjective");
		`);
		assert.deepEqual([...calls.get('Open').contexts], ['', 'verb', 'adjective']);
	});

	it('routes shared strings independently of catalog and region boundaries', () => {
		const calls = new TLCalls({
			catalogByFile: { 'battle.ts': 'ui', 'chat.ts': 'ui', 'sim.ts': 'sim' },
			defaultCatalog: 'common',
			regionByFile: { 'battle.ts': 'Battle', 'chat.ts': 'Chat', 'sim.ts': 'Battle' },
			sharedRegion: 'General',
		});
		calls.scan('TL`Across regions`; TL`Across catalogs`;', 'battle.ts');
		calls.scan('TL`Across regions`;', 'chat.ts');
		calls.scan('TL`Across catalogs`;', 'sim.ts');
		assert.equal(calls.get('Across regions').catalog, 'ui');
		assert.equal(calls.get('Across regions').region, 'General');
		assert.equal(calls.get('Across catalogs').catalog, 'common');
		assert.equal(calls.get('Across catalogs').region, 'Battle');
	});

	it('inserts into multiple regions without shifting their insertion points', () => {
		const source = `export const translations = {
	// #region Battle
	// #endregion Battle
	// #region Chat
	// #endregion Chat
};
`;
		const calls = new TLCalls({ regionByFile: { 'battle.ts': 'Battle', 'chat.ts': 'Chat' } });
		calls.scan('TL`Forfeit`;', 'battle.ts');
		calls.scan('TL`Send`;', 'chat.ts');
		const updated = new ParsedCatalog(source).update(calls);
		assert.deepEqual(updated.errors, []);
		const parsed = new ParsedCatalog(updated.source);
		assert.equal(parsed.entriesByKey.get('Forfeit').region, 'Battle');
		assert.equal(parsed.entriesByKey.get('Send').region, 'Chat');
		assert.equal(parsed.update(calls).source, updated.source);
	});

	it('keeps placeholders literal for direct calls while compiling tagged substitutions', () => {
		const source = `export const translations = {
	"Direct {NAME}": null,
	"Tagged {NAME}": null,
};
`;
		const calls = TLCalls.fromSource('TL("Direct {NAME}"); TL`Tagged ${name}`;');
		const template = new ParsedCatalog(source);
		assert.deepEqual(template.resolveCalls(calls), []);
		assert.equal(template.update(calls).source, source);
		assert.deepEqual(compileTranslations({
			'Direct {NAME}': 'Literal {NAME}',
			'Tagged {NAME}': 'Substitution {NAME}',
		}, calls), {
			'Direct {NAME}': 'Literal {NAME}',
			'Tagged {0}': 'Substitution {0}',
		});
	});

	it('adds new strings to the end of templates without regions', () => {
		const template = `export const translations = {
	// An existing comment
	"Existing": null,
};
`;
		const calls = TLCalls.fromSource('this.TL`Existing`; this.TL`Added`;');
		const updated = new ParsedCatalog(template).update(calls);
		assert.deepEqual(updated.added, ['Added']);
		assert.equal(updated.source, `export const translations = {
	// An existing comment
	"Existing": null,
	"Added": null,

};
`);
	});

	it('adds new strings to their mapped region without rewriting existing text', () => {
		const template = `export const translations = {
	// #region Battle
	// ==================================================================

	// An existing comment
	"Battle": null,

	// #endregion Battle
};
`;
		const calls = TLCalls.fromSource('const label = TL`Forfeit`;', 'panel-battle.tsx', {
			regionByFile: { 'panel-battle.tsx': 'Battle' },
		});
		const updated = new ParsedCatalog(template).update(calls);
		assert.deepEqual(updated.added, ['Forfeit']);
		assert.match(updated.source, /\/\/ An existing comment\n\t"Battle": null, \/\/ NOT USED/);
		assert.match(updated.source, /\t"Forfeit": null,\n\n\t\/\/ #endregion Battle/);
	});

	it('refuses to add strings to a missing region', () => {
		const template = `export const translations = {
	// #region Battle
	"Battle": null,
	// #endregion Battle
};
`;
		const calls = TLCalls.fromSource('TL`Forfeit`;', 'panel-chat.tsx', {
			regionByFile: { 'panel-chat.tsx': 'Chat' },
		});
		const updated = new ParsedCatalog(template).update(calls);
		assert.deepEqual(updated.errors, ['"Forfeit" maps to missing region "Chat"']);
	});

	it('never marks a DYNAMIC KEY as unused', () => {
		const template = `export const translations = {
	"Rendered later": null, // DYNAMIC KEY (passed to TL() through a variable)
	"Really unused": null,
};
`;
		const updated = new ParsedCatalog(template).update(TLCalls.fromSource(''));
		assert.match(updated.source, /"Rendered later": null, \/\/ DYNAMIC KEY \(passed to TL\(\) through a variable\)\n/);
		assert.match(updated.source, /"Really unused": null, \/\/ NOT USED/);
	});

	it('marks unused template values and removes the marker when calls return', () => {
		const template = `export const translations = {
	"Used": null, // NOT USED
	"Unused": null,
	"Contextual": {
		"used": null, // NOT USED
		"unused": null,
	},
};
`;
		const calls = TLCalls.fromSource('TL`Used`; TL("Contextual", "used");');
		const updated = new ParsedCatalog(template).update(calls);
		assert.match(updated.source, /"Used": null,\n/);
		assert.match(updated.source, /"Unused": null, \/\/ NOT USED/);
		assert.match(updated.source, /"used": null,\n/);
		assert.match(updated.source, /"unused": null, \/\/ NOT USED/);
		const locale = new ParsedCatalog(`export const translations = {
	"Used": "Active translation",
	"Unused": "Preserved translation",
	"Contextual": {
		"used": "Active context",
		"unused": "Preserved context",
	},
};
`);
		const synced = new ParsedCatalog(updated.source).sync(locale, calls);
		assert.equal(ParsedCatalog.evaluate(synced.source).Unused, 'Preserved translation');
		assert.equal(ParsedCatalog.evaluate(synced.source).Contextual.unused, 'Preserved context');
	});

	it('uses template placeholder names and preserves translations when they are renamed', () => {
		const template = `export const translations = {
	"Hello {USER}": null,
};
`;
		const locale = `export const translations = {
	// Keep this local note about {name}.
	"Hello {name}": "Hi {name}",
	"Old entry": "Keep me",
};
`;
		const calls = TLCalls.fromSource('this.TL`Hello ${user.name}`;', 'chat.ts');
		const templateCatalog = new ParsedCatalog(template);
		assert.deepEqual(templateCatalog.resolveCalls(calls), []);
		assert(calls.has('Hello {0}'));
		assert.deepEqual(calls.get('Hello {0}').placeholders, ['USER']);
		assert.equal(templateCatalog.update(calls).source, template);

		const synced = templateCatalog.sync(new ParsedCatalog(locale), calls);
		assert.match(synced.source, /Keep this local note about \{USER\}/);
		assert.match(synced.source, /"Hello \{USER\}": "Hi \{USER\}"/);
		assert.doesNotMatch(synced.source, /Old entry|Keep me/);
		assert.deepEqual(compileTranslations(ParsedCatalog.evaluate(synced.source)), {
			'Hello {0}': 'Hi {0}',
		});
		assert.deepEqual(synced.comparison, {
			missing: [], extra: [], incompatible: [], commentMismatches: [], orderMismatch: false,
		});
	});

	it('reports ambiguous placeholder matches instead of guessing', () => {
		const template = `export const translations = {
	"Hello {USER}": null,
	"Hello {ROOM}": null,
};
`;
		const calls = TLCalls.fromSource('this.TL`Hello ${target}`;');
		assert.deepEqual(new ParsedCatalog(template).resolveCalls(calls), [
			'"Hello {0}" matches multiple translation keys',
		]);
	});

	it('synchronizes missing entries and shared comments while preserving locale comments', () => {
		const template = `import type { UIText } from '../../server/chat';

export const translations: UIText = {
	// #region Navigation
	// ==================================================================

	// TRANSLATORS: Home may match Main menu.
	"Home": null,
	"Main menu": null,

	// #endregion Navigation
};
`;
		const locale = `export const translations = {
	"Main menu": "主菜单",
	// This wording is intentionally short.
	"Home": "首页",
	"Removed": "已删除",
};
`;
		const templateCatalog = new ParsedCatalog(template);
		const localeCatalog = new ParsedCatalog(locale, 'zh-cn.ts');
		assert.equal(templateCatalog.compare(localeCatalog).orderMismatch, true);
		assert.deepEqual(templateCatalog.compare(localeCatalog).extra, ['Removed']);
		const synced = templateCatalog.sync(localeCatalog);
		assert.doesNotMatch(synced.source, /import type|UIText/);
		assert.match(synced.source, /\/\/ TRANSLATORS: Home may match Main menu\./);
		assert.match(synced.source, /\/\/ This wording is intentionally short\.\n\t"Home": "首页",/);
		assert(synced.source.indexOf('"Home"') < synced.source.indexOf('"Main menu"'));
		assert.match(synced.source, /"Main menu": "主菜单"/);
		assert.doesNotMatch(synced.source, /Removed|已删除/);
		const comparison = templateCatalog.compare(new ParsedCatalog(synced.source));
		assert.deepEqual(synced.comparison, comparison);
		assert.deepEqual(comparison, {
			missing: [], extra: [], incompatible: [], commentMismatches: [], orderMismatch: false,
		});
	});

	it('rejects unknown placeholder names in translations and context maps', () => {
		assert.throws(() => validateCatalog({ 'Hello {NAME}': 'Hola {NOMBRE}' }, 'es.ts'), {
			name: 'TypeError',
			message: 'es.ts: translation for "Hello {NAME}" uses unknown placeholder "{NOMBRE}"',
		});
		assert.throws(() => validateCatalog({ 'Hello {NAME}': { brief: 'Hola {NOMBRE}' } }, 'es.ts'), {
			name: 'TypeError',
			message: 'es.ts: translation for "Hello {NAME}" in context "brief" uses unknown placeholder "{NOMBRE}"',
		});
		assert.throws(() => validateCatalog({ Hello: 'Hola {NAME}' }, 'es.ts'), /unknown placeholder/);
	});

	it('allows reordered, repeated, and omitted placeholders and null fallback', () => {
		const catalog = {
			'From {FIRST} to {SECOND}': '{SECOND}/{FIRST}/{SECOND}',
			'{NAME} joined': { '': 'Joined', brief: '{NAME}', fallback: null },
			'{NAME} left': null,
		};
		assert.equal(validateCatalog(catalog, 'example.ts'), catalog);
	});

	it('compiles reordered placeholders in context maps and preserves null fallback', () => {
		assert.deepEqual(compileTranslations({
			'{FIRST} before {SECOND}': { '': '{SECOND} after {FIRST}', brief: null },
			Open: { verb: 'Start', adjective: 'Available' },
		}), {
			'{0} before {1}': { '': '{1} after {0}', brief: null },
			Open: { verb: 'Start', adjective: 'Available' },
		});
	});

	it('keeps checked-in calls, templates, and locale catalogs synchronized', function () {
		this.timeout(10_000);
		const calls = updateTranslationFiles();
		assert.equal(calls.get('Format').catalog, 'ui');
		assert.equal(calls.get('Type').catalog, 'ui');
		assert.deepEqual([...calls.get('Type').contexts], ['kind']);
		assert.deepEqual([...calls.get('User').contexts].sort(), ['', 'pokemon']);
		assert.equal(calls.get('{0}: ').catalog, 'ui');
		assert.deepEqual(calls.get('{0}: ').placeholders, ['LABEL']);
	});
});
