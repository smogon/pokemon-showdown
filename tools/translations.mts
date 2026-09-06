import vm from 'node:vm';
import { type TLCalls, type TLCallsForKey } from './tl-calls.mts';

type TranslationValue = string | null | Record<string, string | null>;
export type TranslationCatalog = Record<string, TranslationValue>;

interface TranslationEntry {
	key: string;
	callKey: string;
	placeholders: string[];
	region: string;
	start: number;
	end: number;
	rawLines: string[];
	sharedComments: string[];
	localComments: string[];
	value: TranslationValue;
}

interface TranslationComparison {
	missing: string[];
	extra: string[];
	incompatible: string[];
	commentMismatches: string[];
	orderMismatch: boolean;
}

function parseCatalogKey(catalogKey: string): { callKey: string, placeholders: string[] } {
	const placeholders: string[] = [];
	const callKey = catalogKey.replace(/\{([^{}]+)\}/g, (placeholder, name) => {
		placeholders.push(name);
		return `{${placeholders.length - 1}}`;
	});
	return { callKey, placeholders };
}

function formatCatalogKey(callKey: string, placeholders: string[]): string {
	if (!placeholders.length) return callKey;
	return callKey.replace(/\{(\d+)\}/g, (placeholder, indexText) => {
		const name = placeholders[Number(indexText)];
		return name === undefined ? placeholder : `{${name}}`;
	});
}

function groupCallsByCatalogKey(calls: TLCalls): Map<string, TLCallsForKey> {
	const catalogCalls = new Map<string, TLCallsForKey>();
	for (const [callKey, call] of calls) {
		const key = formatCatalogKey(callKey, call.placeholders);
		let target = catalogCalls.get(key);
		if (!target) {
			target = { ...call, contexts: new Set() };
			catalogCalls.set(key, target);
		}
		for (const context of call.contexts) target.contexts.add(context);
		if (target.region !== call.region) target.region = calls.options.sharedRegion ?? '';
	}
	return catalogCalls;
}

export class ParsedCatalog {
	readonly filename: string;
	readonly source: string;
	readonly lines: string[];
	readonly entries: TranslationEntry[] = [];
	readonly entriesByKey = new Map<string, TranslationEntry>();
	readonly entriesByCallKey = new Map<string, TranslationEntry[]>();
	readonly regionEnds = new Map<string, number>();
	readonly objectStart: number;
	readonly objectEnd: number;
	readonly indent: string;

	static evaluate(source: string, filename = '<ui>'): TranslationCatalog {
		const withoutTypeImports = source.replace(/^import\s+type\s+.*;\s*$/gm, '');
		const runnable = withoutTypeImports.replace(
			/\bexport\s+const\s+translations(?:\s*:\s*[^=]+)?\s*=/, 'const translations ='
		);
		if (runnable === withoutTypeImports) throw new Error(`${filename} must export a \`translations\` object`);
		const translations = vm.runInNewContext(
			`(() => {\n"use strict";\n${runnable}\nreturn translations;\n})()`, {}, { filename }
		);
		if (!translations || typeof translations !== 'object' || Array.isArray(translations)) {
			throw new Error(`${filename} must export a \`translations\` object`);
		}
		return translations as TranslationCatalog;
	}

	private static isStructuralComment(line: string): boolean {
		return /^\s*\/\/ (?:#(?:end)?region |={10,})/.test(line);
	}

	constructor(source: string, filename = '<ui>') {
		this.filename = filename;
		this.source = source;
		this.lines = source.split('\n');
		const values = ParsedCatalog.evaluate(source, filename);
		let objectStart = -1;
		let objectEnd = -1;
		this.indent = '\t';
		for (let i = 0; i < this.lines.length; i++) {
			if (/\bexport\s+const\s+translations(?:\s*:\s*[^=]+)?\s*=\s*\{/.test(this.lines[i])) {
				objectStart = i;
			}
		}
		for (let i = this.lines.length - 1; i >= 0; i--) {
			if (this.lines[i].trim() === '};') {
				objectEnd = i;
				break;
			}
		}
		if (objectStart < 0 || objectEnd < 0) throw new Error(`${filename}: malformed translations object`);

		const quotedProperty = new RegExp(
			`^${this.indent.replace(/\t/g, '\\t')}((?:"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*')):\\s*(.*)$`
		);
		const commentPrefix = this.indent + '//';
		let region = '';
		for (let i = objectStart + 1; i < objectEnd; i++) {
			const regionStart = /^\s*\/\/ #region (.+)$/.exec(this.lines[i]);
			if (regionStart) region = regionStart[1];
			const regionEnd = /^\s*\/\/ #endregion (.+)$/.exec(this.lines[i]);
			if (regionEnd) {
				this.regionEnds.set(regionEnd[1], i);
				region = '';
			}
			const property = quotedProperty.exec(this.lines[i]);
			if (!property) continue;
			const key = vm.runInNewContext(property[1]) as string;
			if (this.entriesByKey.has(key)) {
				throw new Error(`${filename}: duplicate translation key ${JSON.stringify(key)}`);
			}
			let end = i;
			if (property[2].trim().startsWith('{')) {
				let foundEnd = false;
				while (++end < this.lines.length) {
					if (this.lines[end].startsWith(this.indent) && this.lines[end].trimStart().startsWith('},')) {
						foundEnd = true;
						break;
					}
				}
				if (!foundEnd) throw new Error(`${filename}: unterminated context map for ${JSON.stringify(key)}`);
			} else if (!/,\s*(?:\/\/.*)?$/.test(property[2])) {
				do {
					end++;
				} while (end < objectEnd && !/,\s*(?:\/\/.*)?$/.test(this.lines[end]));
				if (end >= objectEnd) throw new Error(`${filename}: unterminated translation for ${JSON.stringify(key)}`);
			}
			let commentStart = i;
			while (commentStart > objectStart + 1 && this.lines[commentStart - 1].startsWith(commentPrefix)) commentStart--;
			const leadingComments = this.lines.slice(commentStart, i);
			const { callKey, placeholders } = parseCatalogKey(key);
			const entry = {
				key, callKey, placeholders, region, start: i, end, rawLines: this.lines.slice(i, end + 1),
				sharedComments: leadingComments.filter(line => line.startsWith(`${commentPrefix} TRANSLATORS:`)),
				localComments: leadingComments.filter(line => (
					!line.startsWith(`${commentPrefix} TRANSLATORS:`) && !ParsedCatalog.isStructuralComment(line)
				)),
				value: values[key],
			};
			this.entries.push(entry);
			this.entriesByKey.set(key, entry);
			if (!this.entriesByCallKey.has(callKey)) this.entriesByCallKey.set(callKey, []);
			this.entriesByCallKey.get(callKey)!.push(entry);
			i = end;
		}
		this.objectStart = objectStart;
		this.objectEnd = objectEnd;
	}

	resolveCalls(calls: TLCalls): string[] {
		const errors: string[] = [];
		for (const [callKey, call] of calls) {
			if (!call.placeholders.length) continue;
			const matches = this.entriesByCallKey.get(callKey) || [];
			const inferredKey = formatCatalogKey(callKey, call.placeholders);
			const exact = matches.find(entry => entry.key === inferredKey);
			const match = exact || (matches.length === 1 ? matches[0] : undefined);
			if (!match && matches.length > 1) {
				errors.push(`${JSON.stringify(callKey)} matches multiple translation keys`);
			} else if (match) {
				if (new Set(match.placeholders).size !== match.placeholders.length) {
					errors.push(`${JSON.stringify(match.key)} has duplicate placeholder names`);
				} else {
					call.placeholders = match.placeholders;
				}
			}
		}
		return errors;
	}

	/** Update this template to match the actual TL calls in the source code */
	update(calls: TLCalls): { source: string, added: string[], errors: string[] } {
		const catalogCalls = groupCallsByCatalogKey(calls);
		const additions = new Map<number, [string, TLCallsForKey][]>();
		const errors: string[] = [];
		for (const entry of this.entries) {
			if (entry.value === null) continue;
			if (!entry.value || typeof entry.value !== 'object' || Array.isArray(entry.value) ||
				Object.values(entry.value).some(value => value !== null)) {
				errors.push(`${JSON.stringify(entry.key)} must contain only null template values`);
			}
		}
		for (const [key, call] of catalogCalls) {
			const matches = this.entriesByCallKey.get(parseCatalogKey(key).callKey) || [];
			const existing = this.entriesByKey.get(key) || matches[0];
			if (existing) {
				const expectedContexts = new Set(call.contexts);
				const actualContexts = existing.value && typeof existing.value === 'object' ?
					new Set(Object.keys(existing.value)) : new Set(['default']);
				for (const context of expectedContexts) {
					if (!actualContexts.has(context)) {
						errors.push(`${JSON.stringify(key)} needs context ${JSON.stringify(context)}`);
					}
				}
				continue;
			}
			const insertion = call.region ? this.regionEnds.get(call.region) : this.objectEnd;
			if (insertion === undefined) {
				errors.push(`${JSON.stringify(key)} maps to missing region ${JSON.stringify(call.region)}`);
				continue;
			}
			if (!additions.has(insertion)) additions.set(insertion, []);
			additions.get(insertion)!.push([key, call]);
		}
		if (errors.length) return { source: this.source, added: [], errors };

		const lines = [...this.lines];
		this.updateNotUsedMarkers(lines, catalogCalls);
		const added: string[] = [];
		for (const [end, entries] of [...additions].sort((a, b) => b[0] - a[0])) {
			let insertion = end;
			while (insertion > 0 && lines[insertion - 1] === '') insertion--;
			const newLines = [];
			for (const [key, call] of entries) {
				newLines.push(...this.templateEntryLines(key, call));
				added.push(key);
			}
			newLines.push('');
			lines.splice(insertion, end - insertion, ...newLines);
		}
		return { source: lines.join('\n'), added, errors: [] };
	}

	/**
	 * A `DYNAMIC KEY` comment replaces `NOT USED` for keys that _are_ used, but
	 * in ways that tl-calls can't see.
	 */
	private static isDynamicKey(line: string): boolean {
		return /\/\/ DYNAMIC KEY\b/.test(line);
	}

	private updateNotUsedMarkers(lines: string[], calls: ReadonlyMap<string, TLCallsForKey>): void {
		for (const entry of this.entries) {
			const contexts = calls.get(entry.key)?.contexts || new Set<string>();
			if (ParsedCatalog.isDynamicKey(lines[entry.start])) continue;
			if (entry.value === null) {
				lines[entry.start] = this.setNotUsed(lines[entry.start], !contexts.has('default'));
				continue;
			}
			if (typeof entry.value !== 'object') continue;
			for (let i = entry.start + 1; i < entry.end; i++) {
				const property = /^\s*("(?:\\.|[^"\\])*"):\s*null,/.exec(lines[i]);
				if (!property || ParsedCatalog.isDynamicKey(lines[i])) continue;
				const context = JSON.parse(property[1]);
				lines[i] = this.setNotUsed(lines[i], !contexts.has(context));
			}
		}
	}

	private setNotUsed(line: string, notUsed: boolean): string {
		if (notUsed) return line.replace(/null,\s*(?:\/\/ NOT USED)?$/, 'null, // NOT USED');
		return line.replace(/null,\s*\/\/ NOT USED$/, 'null,');
	}

	compare(locale: ParsedCatalog): TranslationComparison {
		const missing: string[] = [];
		const extra: string[] = [];
		const incompatible: string[] = [];
		const commentMismatches: string[] = [];
		for (const entry of this.entries) {
			const localized = locale.entriesByKey.get(entry.key);
			if (!localized) {
				missing.push(entry.key);
				continue;
			}
			if (this.schema(entry.value) !== this.schema(localized.value)) incompatible.push(entry.key);
			if (entry.sharedComments.join('\n') !== localized.sharedComments.join('\n')) {
				commentMismatches.push(entry.key);
			}
		}
		for (const entry of locale.entries) {
			if (!this.entriesByKey.has(entry.key)) extra.push(entry.key);
		}
		const orderMismatch = this.entries.some((entry, i) => entry.key !== locale.entries[i]?.key);
		return { missing, extra, incompatible, commentMismatches, orderMismatch };
	}

	/** Update a locale file to match this template */
	sync(locale: ParsedCatalog, calls?: TLCalls): {
		source: string, comparison: TranslationComparison,
	} {
		const comparison = this.compare(locale);
		if (comparison.incompatible.length) {
			return { source: locale.source, comparison };
		}

		const output = locale.lines.slice(0, locale.objectStart + 1);
		let cursor = this.objectStart + 1;
		for (const entry of this.entries) {
			output.push(...this.filterScaffolding(this.lines.slice(cursor, entry.start)));
			let localized = locale.entriesByKey.get(entry.key);
			if (!localized && calls?.get(entry.callKey)?.placeholders.length) {
				const matches = locale.entriesByCallKey.get(entry.callKey) || [];
				if (matches.length === 1) localized = matches[0];
			}
			if (localized) {
				const migrated = this.renameEntryPlaceholders(localized, entry);
				output.push(...migrated.localComments, ...migrated.rawLines);
			} else {
				output.push(...this.untranslatedEntryLines(entry));
			}
			cursor = entry.end + 1;
		}
		output.push(...this.filterScaffolding(this.lines.slice(cursor, this.objectEnd)));
		output.push(...locale.lines.slice(locale.objectEnd));
		const source = output.join('\n');
		return { source, comparison: this.compare(new ParsedCatalog(source, locale.filename)) };
	}

	private renameEntryPlaceholders(entry: TranslationEntry, target: TranslationEntry) {
		if (entry.key === target.key || entry.callKey !== target.callKey) return entry;
		const replacements = new Map(entry.placeholders.map((name, i) => (
			[name, target.placeholders[i]]
		)));
		const replacePlaceholders = (text: string) => text.replace(/\{([^{}]+)\}/g, (placeholder, name) => {
			const replacement = replacements.get(name);
			return replacement === undefined ? placeholder : `{${replacement}}`;
		});
		const migrateLine = (line: string) => {
			if (/^\s*\/\//.test(line)) return replacePlaceholders(line);
			return line.replace(/"(?:\\.|[^"\\])*"/g, token => (
				JSON.stringify(replacePlaceholders(JSON.parse(token)))
			));
		};
		return {
			...entry,
			localComments: entry.localComments.map(migrateLine),
			rawLines: entry.rawLines.map(migrateLine),
		};
	}

	private schema(value: TranslationValue): string {
		if (value === null || typeof value === 'string') return 'default';
		if (!value || typeof value !== 'object' || Array.isArray(value)) return 'invalid';
		return Object.keys(value).sort().join('\0');
	}

	private templateEntryLines(key: string, call: TLCallsForKey): string[] {
		const contexts = [...call.contexts].sort((a, b) => (
			a === 'default' ? -1 : b === 'default' ? 1 : a.localeCompare(b)
		));
		if (contexts.length === 1 && contexts[0] === 'default') {
			return [`${this.indent}${JSON.stringify(key)}: null,`];
		}
		return [
			`${this.indent}${JSON.stringify(key)}: {`,
			...contexts.map(context => `${this.indent}\t${JSON.stringify(context)}: null,`),
			`${this.indent}},`,
		];
	}

	private filterScaffolding(lines: string[]): string[] {
		return lines.filter(line => (
			!line.startsWith(`${this.indent}//`) || line.startsWith(`${this.indent}// TRANSLATORS:`) ||
			ParsedCatalog.isStructuralComment(line)
		));
	}

	private untranslatedEntryLines(entry: TranslationEntry): string[] {
		if (entry.value === null) return [`${this.indent}${JSON.stringify(entry.key)}: null, // NEEDS TRANSLATION`];
		return [
			`${this.indent}${JSON.stringify(entry.key)}: {`,
			...Object.keys(entry.value).map(context => (
				`${this.indent}\t${JSON.stringify(context)}: null, // NEEDS TRANSLATION`
			)),
			`${this.indent}},`,
		];
	}
}

export function validateCatalog(translations: unknown, filename: string): TranslationCatalog {
	if (!translations || typeof translations !== 'object' || Array.isArray(translations)) {
		throw new TypeError(`${filename} must export a \`translations\` object`);
	}
	for (const [english, translated] of Object.entries(translations)) {
		const placeholders = new Set(parseCatalogKey(english).placeholders);
		const validatePlaceholders = (text: string, context?: string) => {
			for (const [placeholder, name] of text.matchAll(/\{([^{}]+)\}/g)) {
				if (placeholders.has(name)) continue;
				throw new TypeError(
					`${filename}: translation for ${JSON.stringify(english)}` +
					(context === undefined ? '' : ` in context ${JSON.stringify(context)}`) +
					` uses unknown placeholder ${JSON.stringify(placeholder)}`
				);
			}
		};
		if (translated === '') {
			throw new TypeError(
				`${filename}: translation for ${JSON.stringify(english)} must use null to fall back to English`
			);
		}
		if (translated === null) continue;
		if (typeof translated === 'string') {
			validatePlaceholders(translated);
			continue;
		}
		if (!translated || typeof translated !== 'object' || Array.isArray(translated)) {
			throw new TypeError(
				`${filename}: translation for ${JSON.stringify(english)} must be a string, null, or context map`
			);
		}
		for (const [context, contextTranslation] of Object.entries(translated)) {
			if (contextTranslation === '') {
				throw new TypeError(
					`${filename}: translation for ${JSON.stringify(english)} in context ${JSON.stringify(context)} ` +
					`must use null to fall back to English`
				);
			}
			if (typeof contextTranslation !== 'string' && contextTranslation !== null) {
				throw new TypeError(
					`${filename}: translation for ${JSON.stringify(english)} in context ${JSON.stringify(context)} ` +
					`must be a string or null`
				);
			}
			if (typeof contextTranslation === 'string') validatePlaceholders(contextTranslation, context);
		}
	}
	return translations as TranslationCatalog;
}

export function resolveTLCalls(template: ParsedCatalog, calls: TLCalls): TLCalls {
	const errors = template.resolveCalls(calls);
	if (errors.length) throw new Error(`UI translation template needs manual changes:\n  - ${errors.join('\n  - ')}`);
	return calls;
}

/**
 * Compile readable catalog placeholders to the positional placeholders used by client TL.
 * Not used by server.
 */
export function compileTranslations(uiText: TranslationCatalog, calls?: TLCalls): TranslationCatalog {
	const callsByCatalogKey = calls && groupCallsByCatalogKey(calls);
	const compiled: TranslationCatalog = {};
	for (const [key, value] of Object.entries(uiText)) {
		if (callsByCatalogKey && !callsByCatalogKey.get(key)?.placeholders.length) {
			compiled[key] = value;
			continue;
		}
		const { callKey, placeholders } = parseCatalogKey(key);
		const compileValue = (text: string | null) => text?.replace(/\{([^{}]+)\}/g, (placeholder, name) => {
			const index = placeholders.indexOf(name);
			return index < 0 ? placeholder : `{${index}}`;
		}) ?? null;
		const translated = typeof value === 'object' && value ?
			Object.fromEntries(Object.entries(value).map(([context, text]) => [context, compileValue(text)])) :
			compileValue(value);
		if (translated !== null || !(callKey in compiled)) compiled[callKey] = translated;
	}
	return compiled;
}

export function formatKeys(keys: string[]): string {
	return keys.map(key => `  - ${JSON.stringify(key)}`).join('\n');
}

export function translationMismatchMessage(
	filename: string, template: string, comparison: TranslationComparison
): string {
	const parts = [`${filename} does not match ${template}.`];
	if (comparison.missing.length) parts.push(`Missing entries:\n${formatKeys(comparison.missing)}`);
	if (comparison.extra.length) parts.push(`Entries absent from template:\n${formatKeys(comparison.extra)}`);
	if (comparison.incompatible.length) {
		parts.push(`Context shapes requiring manual review:\n${formatKeys(comparison.incompatible)}`);
	}
	if (comparison.commentMismatches.length) {
		parts.push(`Outdated TRANSLATORS comments:\n${formatKeys(comparison.commentMismatches)}`);
	}
	if (comparison.orderMismatch) parts.push(`Entries are not in template order.`);
	return parts.join('\n');
}
