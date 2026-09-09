// Library for searching source files for
// `` TL`text` ``, `` TL(text) ``, and `` TL(text, context) `` calls,
// plus `` TLkey`text` `` markers for strings translated later with `` TL(key) ``.

import fs from 'node:fs';
import path from 'node:path';

export interface TLCallsForKey {
	placeholders: string[];
	contexts: Set<string>;
	catalog: string;
	region: string;
}

export interface TLCallOptions {
	catalogByFile?: Readonly<Record<string, string>>;
	defaultCatalog?: string;
	regionByFile?: Readonly<Record<string, string>>;
	sharedRegion?: string;
}

/*
SOURCE FOR TAGGED_TL_REGEX (compile with https://regexfree.k55.io/ )

	\b (?<tag> TL | TLkey ) \s* `
	(?<key> ( \\ [\s\S] | [^`] )* )
	`

*/
const TAGGED_TL_REGEX = /\b(TL|TLkey)\s*`((?:\\[\s\S]|[^`])*)`/g;

/*
SOURCE FOR CALLED_TL_REGEX (compile with https://regexfree.k55.io/ )

	\b TL \s* \( \s*
	(
		"(?<doubleQuotedKey> ( \\ [\s\S] | [^"\\] )* )"
	|
		'(?<singleQuotedKey> ( \\ [\s\S] | [^'\\] )* )'
	)
	(
		\s* , \s*
		(
			"(?<doubleQuotedContext> ( \\ [\s\S] | [^"\\] )* )"
		|
			'(?<singleQuotedContext> ( \\ [\s\S] | [^'\\] )* )'
		)
	)?
	\s* \)

*/
const CALLED_TL_REGEX = /\bTL\s*\(\s*(?:"((?:\\[\s\S]|[^"\\])*)"|'((?:\\[\s\S]|[^'\\])*)')(?:\s*,\s*(?:"((?:\\[\s\S]|[^"\\])*)"|'((?:\\[\s\S]|[^'\\])*)'))?\s*\)/g;

/** map from key to TL calls */
export class TLCalls extends Map<string, TLCallsForKey> {
	readonly options: TLCallOptions;

	constructor(options: TLCallOptions = {}) {
		super();
		this.options = options;
	}

	static fromSource(source: string, filename = '<source>', options: TLCallOptions = {}): TLCalls {
		return new TLCalls(options).scan(source, filename);
	}

	scan(source: string, filename = '<source>'): this {
		for (const match of source.matchAll(TAGGED_TL_REGEX)) {
			try {
				const template = TLCalls.taggedTemplate(match[2]);
				if (match[1] === 'TLkey' && template.placeholders.length) {
					throw new Error(`TLkey strings can't contain \${} substitutions (TL(key) never substitutes values)`);
				}
				this.addCall(template.key, template.placeholders, '', filename);
			} catch (error) {
				const line = source.slice(0, match.index).split('\n').length;
				throw new Error(`${filename}:${line}: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
		for (const match of source.matchAll(CALLED_TL_REGEX)) {
			const keyQuote = match[1] === undefined ? "'" : '"';
			const key = TLCalls.decodeLiteral(match[1] ?? match[2], keyQuote);
			let context = '';
			if (match[3] !== undefined || match[4] !== undefined) {
				const contextQuote = match[3] === undefined ? "'" : '"';
				context = TLCalls.decodeLiteral(match[3] ?? match[4], contextQuote);
			}
			this.addCall(key, [], context, filename);
		}
		return this;
	}

	private addCall(key: string, placeholders: string[], context: string, filename: string): void {
		const file = path.basename(filename);
		const catalog = this.options.catalogByFile?.[file] ?? this.options.defaultCatalog ?? '';
		const region = this.options.regionByFile?.[file] ?? this.options.sharedRegion ?? '';
		let call = this.get(key);
		if (!call) {
			call = { placeholders, contexts: new Set(), catalog, region };
			this.set(key, call);
		} else if (!call.placeholders.length && placeholders.length) {
			call.placeholders = placeholders;
		}
		if (call.catalog !== catalog) call.catalog = this.options.defaultCatalog ?? '';
		if (call.region !== region) call.region = this.options.sharedRegion ?? '';
		call.contexts.add(context);
	}

	/**
	 * Decode string escapes after converting template substitutions to placeholders.
	 * Uses eval - don't run on untrusted code.
	 */
	private static decodeLiteral(raw: string, quote: string): string {
		// eslint-disable-next-line @typescript-eslint/no-implied-eval
		return Function(`"use strict"; return ${quote}${raw}${quote};`)() as string;
	}

	private static taggedTemplate(raw: string): {
		key: string, placeholders: string[],
	} {
		let key = '';
		const placeholders: string[] = [];
		let lastIndex = 0;
		for (let i = 0; i < raw.length - 1; i++) {
			if (raw[i] === '\\') {
				i++;
				continue;
			}
			if (raw[i] !== '$' || raw[i + 1] !== '{') continue;
			key += raw.slice(lastIndex, i) + `{${placeholders.length}}`;
			const expressionStart = i + 2;
			let depth = 1;
			for (i = expressionStart; i < raw.length; i++) {
				if (raw[i] === '{') depth++;
				if (raw[i] === '}' && !--depth) break;
			}
			if (depth) throw new Error(`Unterminated TL template expression`);
			placeholders.push(raw.slice(expressionStart, i).replace(/[{}]/g, '').trim());
			lastIndex = i + 1;
		}
		return { key: this.decodeLiteral(key + raw.slice(lastIndex), '`'), placeholders };
	}
}

function findSourceFiles(directory: string): string[] {
	const files: string[] = [];
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		const file = path.resolve(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...findSourceFiles(file));
		} else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
			files.push(file);
		}
	}
	return files.sort();
}

export function findTLCalls(directories: string | readonly string[], options: TLCallOptions = {}): TLCalls {
	const calls = new TLCalls(options);
	for (const directory of typeof directories === 'string' ? [directories] : directories) {
		for (const file of findSourceFiles(directory)) {
			calls.scan(fs.readFileSync(file, 'utf8'), file);
		}
	}
	return calls;
}
