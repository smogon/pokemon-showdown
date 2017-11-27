/**
 * Chat parser
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Parses formate.
 *
 * @license MIT license
 */

'use strict';

// Regex copied from the client
const domainRegex = '[a-z0-9\\-]+(?:[.][a-z0-9\\-]+)*';
const parenthesisRegex = '[(](?:[^\\s()<>&]|&amp;)*[)]';
const linkRegex = new RegExp(
	'(?:' +
		'(?:' +
			// When using www. or http://, allow any-length TLD (like .museum)
			'(?:https?://|\\bwww[.])' + domainRegex +
			'|\\b' + domainRegex + '[.]' +
				// Allow a common TLD, or any 2-3 letter TLD followed by : or /
				'(?:com?|org|net|edu|info|us|jp|[a-z]{2,3}(?=[:/]))' +
		')' +
		'(?:[:][0-9]+)?' +
		'\\b' +
		'(?:' +
			'/' +
			'(?:' +
				'(?:' +
					'[^\\s()&<>]|&amp;|&quot;' +
					'|' + parenthesisRegex +
				')*' +
				// URLs usually don't end with punctuation, so don't allow
				// punctuation symbols that probably aren't related to URL.
				'(?:' +
					'[^\\s`()\\[\\]{}\'".,!?;:&<>*`^~\\\\]' +
					'|' + parenthesisRegex +
				')' +
			')?' +
		')?' +
		// email address
		'|[a-z0-9.]+\\b@' + domainRegex + '[.][a-z]{2,3}' +
	')' +
	'(?!.*&gt;)',
	'ig'
);

/**
 * @typedef {'_' | '*' | '~' | '^' | '\\' | '<' | '[' | '`' | 'a' | 'spoiler' | '>'} SpanType
 */
/**
 * @typedef {[SpanType, number]} FormatSpan [spanType, buffersIndex]
 */

class TextFormatter {
	/**
	 * @param {string} str
	 */
	constructor(str, isTrusted = false) {
		// escapeHTML, without escaping /
		str = ('' + str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

		// filter links first
		str = str.replace(linkRegex, uri => {
			let fulluri = uri;
			if (/^[a-z0-9.]+@/ig.test(uri)) {
				fulluri = 'mailto:' + uri;
			} else {
				fulluri = uri.replace(/^([a-z]*[^a-z:])/g, 'http://$1');
				if (uri.substr(0, 24) === 'https://docs.google.com/' || uri.substr(0, 16) === 'docs.google.com/') {
					if (uri.slice(0, 5) === 'https') uri = uri.slice(8);
					if (uri.substr(-12) === '?usp=sharing' || uri.substr(-12) === '&usp=sharing') uri = uri.slice(0, -12);
					if (uri.substr(-6) === '#gid=0') uri = uri.slice(0, -6);
					let slashIndex = uri.lastIndexOf('/');
					if (uri.length - slashIndex > 18) slashIndex = uri.length;
					if (slashIndex - 4 > 19 + 3) uri = uri.slice(0, 19) + '<small class="message-overflow">' + uri.slice(19, slashIndex - 4) + '</small>' + uri.slice(slashIndex - 4);
				}
			}
			return `<a href="${fulluri}" target="_blank" rel="noopener">${uri}</a>`;
		});
		// (links don't have any specific syntax, they're just a pattern, so we detect them in a separate pass)

		this.str = str;
		this.buffers = /** @type {string[]} */ ([]);
		this.stack = /** @type {FormatSpan[]} */ ([]);
		this.isTrusted = isTrusted;
		/** offset of str that's been parsed so far */
		// @ts-ignore TypeScript bug: can't infer type
		this.offset = 0;
	}
	// debugAt(i=0, j=i+1) { console.log(this.slice(0, i) + '[' + this.slice(i, j) + ']' + this.slice(j, this.str.length)); }
	/**
	 * @param {number} start
	 * @param {number} end
	 */
	slice(start, end) {
		return this.str.slice(start, end);
	}
	/**
	 * @param {number} start
	 */
	at(start) {
		return this.str.charAt(start);
	}
	/**
	 * @param {SpanType} spanType
	 * @param {number} start
	 * @param {number} end
	 */
	pushSpan(spanType, start, end) {
		this.pushSlice(start);
		this.stack.push([spanType, this.buffers.length]);
		this.buffers.push(this.slice(start, end));
		this.offset = end;
	}
	/**
	 * @param {number} end
	 */
	pushSlice(end) {
		if (end !== this.offset) {
			this.buffers.push(this.slice(this.offset, end));
			this.offset = end;
		}
	}
	/**
	 * Attempt to close a span.
	 * @param {SpanType} spanType
	 * @param {number} start
	 * @param {number} end
	 * @return {boolean} success
	 */
	closeSpan(spanType, start, end) {
		// loop backwards
		let stackPosition = -1;
		for (let i = this.stack.length - 1; i >= 0; i--) {
			const span = this.stack[i];
			if (span[0] === spanType) {
				stackPosition = i;
				break;
			}
		}
		if (stackPosition === -1) return false;

		this.pushSlice(start);
		while (this.stack.length > stackPosition + 1) this.popSpan(start);
		const span = /** @type {FormatSpan} */ (this.stack.pop());
		const startIndex = span[1];
		let tagName = '';
		switch (spanType) {
		case '_': tagName = 'i'; break;
		case '*': tagName = 'b'; break;
		case '~': tagName = 's'; break;
		case '^': tagName = 'sup'; break;
		case '\\': tagName = 'sub'; break;
		}
		if (tagName) {
			this.buffers[startIndex] = `<${tagName}>`;
			this.buffers.push(`</${tagName}>`);
			this.offset = end;
		}
		return true;
	}
	/**
	 * Ends a span without an ending symbol. For most spans, this means
	 * they don't take effect, but certain spans like spoiler tags don't
	 * require ending symbols.
	 *
	 * @param {number} end
	 * @return {boolean} success
	 */
	popSpan(end) {
		const span = this.stack.pop();
		if (!span) return false;
		this.pushSlice(end);
		switch (span[0]) {
		case 'spoiler':
			this.buffers.push(`</span>`);
			this.buffers[span[1]] = `<span class="spoiler">`;
			break;
		case '>':
			this.buffers.push(`</span>`);
			this.buffers[span[1]] = `<span class="greentext">`;
			break;
		default:
			// do nothing
			break;
		}
		return true;
	}
	/**
	 * @param {number} end
	 */
	popAllSpans(end) {
		while (this.stack.length) this.popSpan(end);
		this.pushSlice(end);
	}
	/**
	 * @param {SpanType} spanType
	 * @param {number} start
	 * @return {boolean} success
	 */
	runLookahead(spanType, start) {
		switch (spanType) {
		case '`':
			{
				let delimLength = 0;
				let i = start;
				while (this.at(i) === '`') {
					delimLength++;
					i++;
				}
				let curDelimLength = 0;
				while (true) {
					const char = this.at(i);
					if (char === '\n' || char === '') break;
					if (char === '`') {
						curDelimLength++;
					} else {
						if (curDelimLength === delimLength) break;
						curDelimLength = 0;
					}
					i++;
				}
				if (curDelimLength !== delimLength) return false;
				// matching delims found
				this.pushSlice(start);
				this.buffers.push(`<code>`);
				let innerStart = start + delimLength;
				let innerEnd = i - delimLength;
				if (innerStart + 1 >= innerEnd) {
					// no special whitespace handling
				} else if (this.at(innerStart) === ' ' && this.at(innerEnd - 1) === ' ') {
					innerStart++; // strip starting and ending space
					innerEnd--;
				} else if (this.at(innerStart) === ' ' && this.at(innerStart + 1) === '`') {
					innerStart++; // strip starting space
				} else if (this.at(innerEnd - 1) === ' ' && this.at(innerEnd - 2) === '`') {
					innerEnd--; // strip ending space
				}
				this.buffers.push(this.slice(innerStart, innerEnd));
				this.buffers.push(`</code>`);
				this.offset = i;
			}
			return true;
		case '[':
			{
				if (this.slice(start, start + 2) !== '[[') return false;
				let i = start + 8;
				while (/[^\]\n]/.test(this.at(i))) i++;
				if (this.slice(i, i + 2) !== ']]') return false;
				const termEnd = i;
				i += 2;
				let term = this.slice(start + 2, termEnd);
				let uri = '';
				if (this.slice(i, i + 4) === '&lt;') { // <
					let j = i + 4;
					while (/[^ &\n]/.test(this.at(j))) j++;
					if (this.slice(j, j + 4) === '&gt;') { // >
						uri = this.slice(i + 4, j);
						i = j + 4;
						// does not require more escaping
						if (!this.isTrusted) {
							let shortUri = uri.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
							term += `<small> &lt;${shortUri}&gt;</small>`;
						}
						uri = uri.replace(/^([a-z]*[^a-z:])/g, 'http://$1');
					}
				}
				this.pushSlice(start);
				if (!uri) {
					const encodedTerm = encodeURIComponent(term.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, '\''));
					uri = `//www.google.com/search?ie=UTF-8&btnI&q=${encodedTerm}`;
				}
				this.buffers.push(`<a href="${uri}" target="_blank" rel="noopener">${term}</a>`);
				this.offset = i;
			}
			return true;
		case '<':
			{
				if (this.slice(start, start + 8) !== '&lt;&lt;') return false; // <<
				let i = start + 8;
				while (/[a-z0-9-]/.test(this.at(i))) i++;
				if (this.slice(i, i + 8) !== '&gt;&gt;') return false; // >>
				this.pushSlice(start);
				const roomid = this.slice(start + 8, i);
				this.buffers.push(`&laquo;<a href="/${roomid}" target="_blank">${roomid}</a>&raquo;`);
				this.offset = i + 8;
			}
			return true;
		case 'a':
			{
				let i = start + 1;
				while (this.at(i) !== '/' || this.at(i + 1) !== 'a' || this.at(i + 2) !== '>') i++; // </a>
				i += 3;
				this.pushSlice(i);
			}
			return true;
		}
		return false;
	}
	/**
	 * @return {string}
	 */
	get() {
		let i = this.offset;
		let beginningOfLine = i;
		// main loop! i tracks our position
		// i starts at -1 so loop increment can be at the beginning of the loop so we can use continue to continue
		while (true) {
			if (i >= this.str.length) break;
			const char = this.at(i);
			switch (char) {
			case '_':
			case '*':
			case '~':
			case '^':
			case '\\':
				if (this.at(i + 1) === char && this.at(i + 2) !== char) {
					if (!(this.at(i - 1) !== ' ' && this.closeSpan(char, i, i + 2))) {
						if (this.at(i + 2) !== ' ') this.pushSpan(char, i, i + 2);
					}
					if (i < this.offset) {
						i = this.offset;
						break;
					}
				}
				i++;
				while (this.at(i) === char) i++;
				break;
			case '`':
				this.runLookahead('`', i);
				if (i < this.offset) {
					i = this.offset;
					break;
				}
				i++;
				while (this.at(i) === '`') i++;
				break;
			case '[':
				this.runLookahead('[', i);
				if (i < this.offset) {
					i = this.offset;
					break;
				}
				i++;
				while (this.at(i) === '[') i++;
				break;
			case ':':
				if (i < 7) break;
				if (this.slice(i - 7, i + 1).toLowerCase() === 'spoiler:' || this.slice(i - 8, i + 1).toLowerCase() === 'spoilers:') {
					if (this.at(i + 1) === ' ') i++;
					this.pushSpan('spoiler', i + 1, i + 1);
				}
				i++;
				break;
			case '&': // escaped '<' or '>'
				if (i === beginningOfLine && this.slice(i, i + 4) === '&gt;') {
					if (!"._/=:;".includes(this.at(i + 4)) && !['w&lt;', 'w&gt;'].includes(this.slice(i + 4, i + 9))) {
						this.pushSpan('>', i, i);
					}
				} else {
					this.runLookahead('<', i);
				}
				if (i < this.offset) {
					i = this.offset;
					break;
				}
				i++;
				while (this.slice(i, i + 4) === 'lt;&') i += 4;
				break;
			case '<': // guaranteed to be <a
				this.runLookahead('a', i);
				if (i < this.offset) {
					i = this.offset;
					break;
				}
				i++; // should never happen
				break;
			case '\r':
			case '\n':
				this.popAllSpans(i);
				i++;
				beginningOfLine = i;
				break;
			default:
				i++;
				break;
			}
		}

		this.popAllSpans(this.str.length);
		return this.buffers.join('');
	}
}

/**
 * Takes a string and converts it to HTML by replacing standard chat formatting with the appropriate HTML tags.
 *
 * @param {string} str
 */
function formatText(str, isTrusted = false) {
	return new TextFormatter(str, isTrusted).get();
}

module.exports = {formatText, linkRegex};
