import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { findTLCalls, TLCalls } from './tl-calls.mts';
import {
	ParsedCatalog, validateCatalog, resolveTLCalls,
	formatKeys, translationMismatchMessage,
} from './translations.mts';

const ROOT_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TRANSLATIONS_PATH = path.resolve(ROOT_PATH, 'translations');
const TEMPLATE_PATH = path.resolve(TRANSLATIONS_PATH, 'en-template');
const TEXT_PATH = path.resolve(ROOT_PATH, 'data/text');
export const UI_TEMPLATE_PATH = path.resolve(TEXT_PATH, 'ui-template.ts');
export const SOURCE_DIRECTORIES = ['server', 'sim'].map(directory => path.resolve(ROOT_PATH, directory));

export const TL_CALL_OPTIONS = {
	catalogByFile: {
		'core.ts': 'core-commands',
		'helptickets.ts': 'helptickets',
		'announcements.ts': 'minor-activities',
		'poll.ts': 'minor-activities',
		'repeats.ts': 'repeats',
		'trivia.ts': 'trivia',
	},
	defaultCatalog: 'main',
};

function callsForCatalog(calls: TLCalls, catalog: string): TLCalls {
	const filtered = new TLCalls(calls.options);
	for (const [key, call] of calls) {
		if (call.catalog === catalog) filtered.set(key, call);
	}
	return filtered;
}

/**
 * - `sync=false`: updates template files to match TL calls in codebase
 * - `sync=true`: syncs every language's translations to match template files
 */
export function updateTranslationFiles(options: { sync?: boolean } = {}): TLCalls {
	const uiTemplateSource = fs.readFileSync(UI_TEMPLATE_PATH, 'utf8');
	const uiTemplate = new ParsedCatalog(uiTemplateSource, UI_TEMPLATE_PATH);
	validateCatalog(ParsedCatalog.evaluate(uiTemplateSource, UI_TEMPLATE_PATH), UI_TEMPLATE_PATH);

	const calls = findTLCalls(SOURCE_DIRECTORIES, TL_CALL_OPTIONS);
	const uiCalls = new TLCalls(calls.options);
	const templateFiles = fs.readdirSync(TEMPLATE_PATH)
		.filter(filename => filename.endsWith('.ts')).sort();
	const templates = new Map<string, { file: string, source: string, parsed: ParsedCatalog, calls: TLCalls }>();
	for (const filename of templateFiles) {
		const file = path.resolve(TEMPLATE_PATH, filename);
		const source = fs.readFileSync(file, 'utf8');
		const parsed = new ParsedCatalog(source, file);
		templates.set(filename, { file, source, parsed, calls: new TLCalls(calls.options) });
	}

	for (const [key, call] of calls) {
		if (call.placeholders.length ? uiTemplate.entriesByCallKey.has(key) : uiTemplate.entriesByKey.has(key)) {
			call.catalog = 'ui';
			uiCalls.set(key, call);
			continue;
		}
		for (const [filename, { parsed }] of templates) {
			if (call.placeholders.length ? parsed.entriesByCallKey.has(key) : parsed.entriesByKey.has(key)) {
				call.catalog = filename.slice(0, -3);
				break;
			}
		}
	}
	resolveTLCalls(uiTemplate, uiCalls);
	for (const [filename, template] of templates) {
		template.calls = callsForCatalog(calls, filename.slice(0, -3));
		resolveTLCalls(template.parsed, template.calls);
	}
	const missingCatalogs = new Set([...calls.values()].map(call => call.catalog));
	missingCatalogs.delete('ui');
	for (const filename of templateFiles) missingCatalogs.delete(filename.slice(0, -3));
	if (missingCatalogs.size) {
		throw new Error(`Missing translation template catalogs: ${[...missingCatalogs].sort().join(', ')}`);
	}

	const changedTemplates: string[] = [];
	const added: string[] = [];
	for (const { file, source, parsed, calls: catalogCalls } of templates.values()) {
		const update = parsed.update(catalogCalls);
		if (update.errors.length) {
			throw new Error(`Translation template needs manual changes:\n  - ${update.errors.join('\n  - ')}`);
		}
		if (update.source === source) continue;
		fs.writeFileSync(file, update.source);
		changedTemplates.push(path.relative(ROOT_PATH, file));
		added.push(...update.added);
	}
	if (changedTemplates.length) {
		const additions = added.length ? `\nNew calls:\n${formatKeys(added)}` : '';
		throw new Error(
			`Translation templates were updated:\n${changedTemplates.map(file => `  - ${file}`).join('\n')}` +
			`${additions}\nReview them, then run:\n  ./build translations --sync`
		);
	}

	const mismatches: string[] = [];
	for (const language of fs.readdirSync(TRANSLATIONS_PATH, { withFileTypes: true })) {
		if (!language.isDirectory() || language.name === 'en-template') continue;
		for (const [filename, { file: templateFile, parsed: template, calls: catalogCalls }] of templates) {
			const file = path.resolve(TRANSLATIONS_PATH, language.name, filename);
			if (!fs.existsSync(file)) continue;
			const localeSource = fs.readFileSync(file, 'utf8');
			const locale = new ParsedCatalog(localeSource, file);
			validateCatalog(ParsedCatalog.evaluate(localeSource, file), file);
			const comparison = template.compare(locale);
			if (!comparison.missing.length && !comparison.extra.length && !comparison.incompatible.length &&
				!comparison.commentMismatches.length && !comparison.orderMismatch) continue;
			if (!options.sync) {
				mismatches.push(translationMismatchMessage(file, templateFile, comparison));
				continue;
			}
			const synced = template.sync(locale, catalogCalls);
			if (synced.comparison.incompatible.length) {
				mismatches.push(translationMismatchMessage(file, templateFile, synced.comparison));
				continue;
			}
			fs.writeFileSync(file, synced.source);
		}
	}
	for (const language of fs.readdirSync(TEXT_PATH, { withFileTypes: true })) {
		if (!language.isDirectory()) continue;
		const file = path.resolve(TEXT_PATH, language.name, 'ui.ts');
		if (!fs.existsSync(file)) continue;
		const localeSource = fs.readFileSync(file, 'utf8');
		const locale = new ParsedCatalog(localeSource, file);
		validateCatalog(ParsedCatalog.evaluate(localeSource, file), file);
		const comparison = uiTemplate.compare(locale);
		if (!comparison.missing.length && !comparison.extra.length && !comparison.incompatible.length &&
			!comparison.commentMismatches.length && !comparison.orderMismatch) continue;
		if (!options.sync) {
			mismatches.push(translationMismatchMessage(file, UI_TEMPLATE_PATH, comparison));
			continue;
		}
		const synced = uiTemplate.sync(locale, uiCalls);
		if (synced.comparison.incompatible.length) {
			mismatches.push(translationMismatchMessage(file, UI_TEMPLATE_PATH, synced.comparison));
			continue;
		}
		fs.writeFileSync(file, synced.source);
	}
	if (mismatches.length) {
		throw new Error(`${mismatches.join('\n\n')}\n\nRun:\n  ./build translations --sync`);
	}
	return calls;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const sync = process.argv.slice(2).includes('--sync');
	try {
		updateTranslationFiles({ sync });
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	}
}
