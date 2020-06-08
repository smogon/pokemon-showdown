/**
 * Utils library
 *
 * Miscellaneous utility functions that don't really have a better place.
 *
 * It'll always be a judgment call whether or not a function goes into a
 * "catch-all" library like this, so here are some guidelines:
 *
 * - It must not have any dependencies
 *
 * - It must conceivably have a use in a wide variety of projects, not just
 *   Pokémon (if it's Pokémon-specific, Dex is probably a good place for it)
 *
 * - A lot of Chat functions are kind of iffy, but I'm going to say for now
 *   that if it's English-specific, it should be left out of here.
 */

type Comparable = number | string | boolean | Comparable[] | {reverse: Comparable};

export const Utils = new class Utils {
	escapeRegex(str: string) {
		return str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
	}
	/**
	 * Escapes HTML in a string.
	 */
	escapeHTML(str: string) {
		if (!str) return '';
		return ('' + str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;')
			.replace(/\//g, '&#x2f;');
	}

	/**
	 * Strips HTML from a string.
	 */
	stripHTML(htmlContent: string) {
		if (!htmlContent) return '';
		return htmlContent.replace(/<[^>]*>/g, '');
	}

	/**
	 * Visualizes eval output in a slightly more readable form
	 */
	visualize(value: any, depth = 0): string {
		if (value === undefined) return `undefined`;
		if (value === null) return `null`;
		if (typeof value === 'number' || typeof value === 'boolean') {
			return `${value}`;
		}
		if (typeof value === 'string') {
			return `"${value}"`; // NOT ESCAPED
		}
		if (typeof value === 'symbol') {
			return value.toString();
		}
		if (Array.isArray(value)) {
			if (depth > 10) return `[array]`;
			return `[` + value.map(elem => this.visualize(elem, depth + 1)).join(`, `) + `]`;
		}
		if (value instanceof RegExp || value instanceof Date || value instanceof Function) {
			if (depth && value instanceof Function) return `Function`;
			return `${value}`;
		}
		let constructor = '';
		if (value.constructor && value.constructor.name && typeof value.constructor.name === 'string') {
			constructor = value.constructor.name;
			if (constructor === 'Object') constructor = '';
		} else {
			constructor = 'null';
		}
		if (value.toString) {
			try {
				const stringValue = value.toString();
				if (typeof stringValue === 'string' &&
						stringValue !== '[object Object]' &&
						stringValue !== `[object ${constructor}]`) {
					return `${constructor}(${stringValue})`;
				}
			} catch (e) {}
		}
		let buf = '';
		for (const key in value) {
			if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
			if (depth > 2 || (depth && constructor)) {
				buf = '...';
				break;
			}
			if (buf) buf += `, `;
			let displayedKey = key;
			if (!/^[A-Za-z0-9_$]+$/.test(key)) displayedKey = JSON.stringify(key);
			buf += `${displayedKey}: ` + this.visualize(value[key], depth + 1);
		}
		if (constructor && !buf && constructor !== 'null') return constructor;
		return `${constructor}{${buf}}`;
	}

	/**
	 * Compares two variables; intended to be used as a smarter comparator.
	 * The two variables must be the same type (TypeScript will not check this).
	 *
	 * - Numbers are sorted low-to-high, use `-val` to reverse
	 * - Strings are sorted A to Z case-semi-insensitively, use `{reverse: val}` to reverse
	 * - Booleans are sorted true-first (REVERSE of casting to numbers), use `!val` to reverse
	 * - Arrays are sorted lexically in the order of their elements
	 *
	 * In other words: `[num, str]` will be sorted A to Z, `[num, {reverse: str}]` will be sorted Z to A.
	 */
	compare(a: Comparable, b: Comparable): number {
		if (typeof a === 'number') {
			return a - (b as number);
		}
		if (typeof a === 'string') {
			return a.localeCompare(b as string);
		}
		if (typeof a === 'boolean') {
			return (a ? 1 : 2) - (b ? 1 : 2);
		}
		if (Array.isArray(a)) {
			for (let i = 0; i < a.length; i++) {
				const comparison = this.compare(a[i], (b as Comparable[])[i]);
				if (comparison) return comparison;
			}
			return 0;
		}
		if (a.reverse) {
			return this.compare((b as {reverse: string}).reverse, a.reverse);
		}
		throw new Error(`Passed value ${a} is not comparable`);
	}

	/**
	 * Sorts an array according to the callback's output on its elements.
	 *
	 * The callback's output is compared according to `PSUtils.compare` (in
	 * particular, it supports arrays so you can sort by multiple things).
	 */
	sortBy<T>(array: T[], callback: (a: T) => Comparable): T[];
	/**
	 * Sorts an array according to `PSUtils.compare`. (Correctly sorts numbers,
	 * unlike `array.sort`)
	 */
	sortBy<T extends Comparable>(array: T[]): T[];
	sortBy<T>(array: T[], callback?: (a: T) => Comparable) {
		if (!callback) return (array as any[]).sort(this.compare);
		return array.sort((a, b) => this.compare(callback(a), callback(b)));
	}

	/**
	 * Like string.split(delimiter), but only recognizes the first `limit`
	 * delimiters (default 1).
	 *
	 * `"1 2 3 4".split(" ", 2) => ["1", "2"]`
	 *
	 * `Utils.splitFirst("1 2 3 4", " ", 1) => ["1", "2 3 4"]`
	 *
	 * Returns an array of length exactly limit + 1.
	 *
	 */
	splitFirst(str: string, delimiter: string, limit = 1) {
		const splitStr: string[] = [];
		while (splitStr.length < limit) {
			const delimiterIndex = str.indexOf(delimiter);
			if (delimiterIndex >= 0) {
				splitStr.push(str.slice(0, delimiterIndex));
				str = str.slice(delimiterIndex + delimiter.length);
			} else {
				splitStr.push(str);
				str = '';
			}
		}
		splitStr.push(str);
		return splitStr;
	}

	/**
	* Species string tag function for escaping HTML
	*/
	html(strings: TemplateStringsArray, ...args: any) {
		let buf = strings[0];
		let i = 0;
		while (i < args.length) {
			buf += this.escapeHTML(args[i]);
			buf += strings[++i];
		}
		return buf;
	}
};
