/**
 * Chat parser
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Parses formate.
 *
 * @license MIT
 */

/*
REGEXFREE SOURCE FOR LINKREGEX

	(
		(
			# When using http://, allow any domain
			https?:\/\/ [a-z0-9-]+ ( \. [a-z0-9-]+ )*
		|
			# When using www., expect at least one more dot
			www \. [a-z0-9-]+ ( \. [a-z0-9-]+ )+
		|
			# Otherwise, allow any domain, but only if
			\b [a-z0-9-]+ ( \. [a-z0-9-]+ )* \.
			(
				# followed either a common TLD...
				( com? | org | net | edu | info | us | jp ) \b
			|
				# or any 2-3 letter TLD followed by a port or /
				[a-z]{2,3} (?= :[0-9] | / )
			)
		)
		# possible custom port
		( : [0-9]+ )?
		(
			\/
			(
				# characters allowed inside URL paths
				(
					[^\s()&<>[\]] | &amp; | &quot;
				|
					# parentheses in URLs should be matched, so they're not confused
					# for parentheses around URLs
					\( ( [^\s()<>&[\]] | &amp; )* \)
	  			|
					\[ ( [^\s()<>&[\]] | &amp; )* ]
				)*
				# URLs usually don't end with punctuation, so don't allow
				# punctuation symbols that probably arent related to URL.
				(
					[^\s()[\]{}\".,!?;:&<>*`^~\\]
				|
					# annoyingly, Wikipedia URLs often end in )
					\( ( [^\s()<>&[\]] | &amp; )* \)
				)
			)?
		)?
	|
		# email address
		[a-z0-9.]+ @ [a-z0-9-]+ ( \. [a-z0-9-]+ )* \. [a-z]{2,}
	)
	(?! [^ ]*&gt; )

*/
export const linkRegex = /(?:(?:https?:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*|www\.[a-z0-9-]+(?:\.[a-z0-9-]+)+|\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:(?:com?|org|net|edu|info|us|jp)\b|[a-z]{2,3}(?=:[0-9]|\/)))(?::[0-9]+)?(?:\/(?:(?:[^\s()&<>[\]]|&amp;|&quot;|\((?:[^\s()<>&[\]]|&amp;)*\)|\[(?:[^\s()<>&[\]]|&amp;)*])*(?:[^\s()[\]{}".,!?;:&<>*`^~\\]|\((?:[^\s()<>&[\]]|&amp;)*\)))?)?|[a-z0-9.]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,})(?![^ ]*&gt;)/ig;

/**
 * A span is a part of the text that's formatted. In the text:
 *
 *     Hi, **this** is an example.
 *
 * The word `this` is a `*` span. Many spans are just a symbol repeated, and
 * that symbol is the span type, but also many are more complicated.
 * For an explanation of all of these, see the `TextFormatter#get` function
 * implementation.
 */
type SpanType = '_' | '*' | '~' | '^' | '\\' | '|' | '<' | '[' | '`' | 'a' | 'u' | 'spoiler' | '>' | '(';

type FormatSpan = [SpanType, number];

class TextFormatter {
	readonly str: string;
	readonly buffers: string[];
	readonly stack: FormatSpan[];
	/** Allows access to special formatting (links without URL preview, pokemon icons) */
	readonly isTrusted: boolean;
	/** Replace \n with <br /> */
	readonly replaceLinebreaks: boolean;
	/** Discord-style WYSIWYM output; markup characters are in `<tt>` */
	readonly showSyntax: boolean;
	/** offset of str that's been parsed so far */
	offset: number;

	constructor(str: string, isTrusted = false, replaceLinebreaks = false, showSyntax = false) {
		// escapeHTML, without escaping /
		str = `${str}`
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');

		// filter links first
		str = str.replace(linkRegex, uri => {
			if (showSyntax) return `<u>${uri}</u>`;
			let fulluri;
			if (/^[a-z0-9.]+@/ig.test(uri)) {
				fulluri = 'mailto:' + uri;
			} else {
				fulluri = uri.replace(/^([a-z]*[^a-z:])/g, 'http://$1');
				if (uri.substr(0, 24) === 'https://docs.google.com/' || uri.substr(0, 16) === 'docs.google.com/') {
					if (uri.startsWith('https')) uri = uri.slice(8);
					if (uri.substr(-12) === '?usp=sharing' || uri.substr(-12) === '&usp=sharing') uri = uri.slice(0, -12);
					if (uri.substr(-6) === '#gid=0') uri = uri.slice(0, -6);
					let slashIndex = uri.lastIndexOf('/');
					if (uri.length - slashIndex > 18) slashIndex = uri.length;
					if (slashIndex - 4 > 19 + 3) {
						uri = uri.slice(0, 19) +
						'<small class="message-overflow">' + uri.slice(19, slashIndex - 4) + '</small>' + uri.slice(slashIndex - 4);
					}
				}
			}
			return `<a href="${fulluri}" rel="noopener" target="_blank">${uri}</a>`;
		});
		// (links don't have any specific syntax, they're just a pattern, so we detect them in a separate pass)

		this.str = str;
		this.buffers = [];
		this.stack = [];
		this.isTrusted = isTrusted;
		this.replaceLinebreaks = this.isTrusted || replaceLinebreaks;
		this.showSyntax = showSyntax;
		this.offset = 0;
	}
	// debugAt(i=0, j=i+1) { console.log(`${this.slice(0, i)}[${this.slice(i, j)}]${this.slice(j, this.str.length)}`); }

	slice(start: number, end: number) {
		return this.str.slice(start, end);
	}

	at(start: number) {
		return this.str.charAt(start);
	}

	/**
	 * We've encountered a possible start for a span. It's pushed onto our span
	 * stack.
	 *
	 * The span stack saves the start position so it can be replaced with HTML
	 * if we find an end for the span, but we don't actually replace it until
	 * `closeSpan` is called, so nothing happens (it stays plaintext) if no end
	 * is found.
	 */
	pushSpan(spanType: SpanType, start: number, end: number) {
		this.pushSlice(start);
		this.stack.push([spanType, this.buffers.length]);
		this.buffers.push(this.slice(start, end));
		this.offset = end;
	}

	pushSlice(end: number) {
		if (end !== this.offset) {
			this.buffers.push(this.slice(this.offset, end));
			this.offset = end;
		}
	}

	closeParenSpan(start: number) {
		let stackPosition = -1;
		for (let i = this.stack.length - 1; i >= 0; i--) {
			const span = this.stack[i];
			if (span[0] === '(') {
				stackPosition = i;
				break;
			}
			if (span[0] !== 'spoiler') break;
		}
		if (stackPosition === -1) return false;

		this.pushSlice(start);
		while (this.stack.length > stackPosition) this.popSpan(start);
		this.offset = start;
		return true;
	}

	/**
	 * We've encountered a possible end for a span. If it's in the span stack,
	 * we transform it into HTML.
	 */
	closeSpan(spanType: SpanType, start: number, end: number) {
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
		const span = this.stack.pop()!;
		const startIndex = span[1];
		let tagName = '';
		let attrs = '';
		switch (spanType) {
		case '_': tagName = 'i'; break;
		case '*': tagName = 'b'; break;
		case '~': tagName = 's'; break;
		case '^': tagName = 'sup'; break;
		case '\\': tagName = 'sub'; break;
		case '|': tagName = 'span'; attrs = (this.showSyntax ? ' class="spoiler-shown"' : ' class="spoiler"'); break;
		}
		const syntax = (this.showSyntax ? `<tt>${spanType}${spanType}</tt>` : '');
		if (tagName) {
			this.buffers[startIndex] = `${syntax}<${tagName}${attrs}>`;
			this.buffers.push(`</${tagName}>${syntax}`);
			this.offset = end;
		}
		return true;
	}

	/**
	 * Ends a span without an ending symbol. For most spans, this means
	 * they don't take effect, but certain spans like spoiler tags don't
	 * require ending symbols.
	 */
	popSpan(end: number) {
		const span = this.stack.pop();
		if (!span) return false;
		this.pushSlice(end);
		switch (span[0]) {
		case 'spoiler':
			this.buffers.push(`</span>`);
			this.buffers[span[1]] = (this.showSyntax ? `<span class="spoiler-shown">` : `<span class="spoiler">`);
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

	popAllSpans(end: number) {
		while (this.stack.length) this.popSpan(end);
		this.pushSlice(end);
	}

	toUriComponent(html: string) {
		const component = html.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&apos;/g, '\'')
			.replace(/&amp;/g, '&');
		return encodeURIComponent(component);
	}

	/**
	 * Handles special cases.
	 */
	runLookahead(spanType: SpanType, start: number) {
		switch (spanType) {
		case '`':
			// code span. Not only are the contents not formatted, but
			// the start and end delimiters must match in length.
			// ``Neither `this` nor ```this``` end this code span.``
			{
				let delimLength = 0;
				let i = start;
				while (this.at(i) === '`') {
					delimLength++;
					i++;
				}
				let curDelimLength = 0;
				while (i < this.str.length) {
					const char = this.at(i);
					if (char === '\n') break;
					if (char === '`') {
						curDelimLength++;
					} else {
						if (curDelimLength === delimLength) break;
						curDelimLength = 0;
					}
					i++;
				}
				if (curDelimLength !== delimLength) return false;
				const end = i;
				// matching delims found
				this.pushSlice(start);
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
				if (this.showSyntax) this.buffers.push(`<tt>${this.slice(start, innerStart)}</tt>`);
				this.buffers.push(`<code>`);
				this.buffers.push(this.slice(innerStart, innerEnd));
				this.buffers.push(`</code>`);
				if (this.showSyntax) this.buffers.push(`<tt>${this.slice(innerEnd, end)}</tt>`);
				this.offset = end;
			}
			return true;
		case '[':
			// Link span. Several possiblilities:
			// [[text <uri>]] - a link with custom text
			// [[search term]] - Google search
			// [[wiki: search term]] - Wikipedia search
			// [[pokemon: species name]] - icon (also item:, type:, category:)
			{
				if (this.slice(start, start + 2) !== '[[') return false;
				let i = start + 2;
				let colonPos = -1; // `:`
				let anglePos = -1; // `<`
				while (i < this.str.length) {
					const char = this.at(i);
					if (char === ']' || char === '\n') break;
					if (char === ':' && colonPos < 0) colonPos = i;
					if (char === '&' && this.slice(i, i + 4) === '&lt;') anglePos = i;
					i++;
				}
				if (this.slice(i, i + 2) !== ']]') return false;

				this.pushSlice(start);
				this.offset = i + 2;
				let termEnd = i;
				let uri = '';
				if (anglePos >= 0 && this.slice(i - 4, i) === '&gt;') { // `>`
					uri = this.slice(anglePos + 4, i - 4);
					termEnd = anglePos;
					if (this.at(termEnd - 1) === ' ') termEnd--;
					uri = encodeURI(uri.replace(/^([a-z]*[^a-z:])/g, 'http://$1'));
				}
				let term = this.slice(start + 2, termEnd).replace(/<\/?[au](?: [^>]+)?>/g, '');
				if (this.showSyntax) {
					term += `<small>${this.slice(termEnd, i)}</small>`;
				} else if (uri && !this.isTrusted) {
					const shortUri = uri.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
					term += `<small> &lt;${shortUri}&gt;</small>`;
					uri += '" rel="noopener';
				}

				if (colonPos > 0) {
					const key = this.slice(start + 2, colonPos).toLowerCase();
					switch (key) {
					case 'w':
					case 'wiki':
						if (this.showSyntax) break;
						term = term.slice(term.charAt(key.length + 1) === ' ' ? key.length + 2 : key.length + 1);
						uri = `//en.wikipedia.org/w/index.php?title=Special:Search&search=${this.toUriComponent(term)}`;
						term = `wiki: ${term}`;
						break;
					case 'pokemon':
					case 'item':
					case 'type':
					case 'category':
						if (this.showSyntax) {
							this.buffers.push(`<tt>${this.slice(start, this.offset)}</tt>`);
							return true;
						}
						term = term.slice(term.charAt(key.length + 1) === ' ' ? key.length + 2 : key.length + 1);

						let display = '';
						if (this.isTrusted) {
							display = `<psicon ${key}="${term}" />`;
						} else {
							display = `[${term}]`;
						}

						let dir = key;
						if (key === 'item') dir += 's';
						if (key === 'category') dir = 'categories' as 'category';

						uri = `//dex.pokemonshowdown.com/${dir}/${toID(term)}`;
						term = display;
					}
				}
				if (!uri) {
					uri = `//www.google.com/search?ie=UTF-8&btnI&q=${this.toUriComponent(term)}`;
				}
				if (this.showSyntax) {
					this.buffers.push(`<tt>[[</tt><u>${term}</u><tt>]]</tt>`);
				} else {
					this.buffers.push(`<a href="${uri}" target="_blank">${term}</a>`);
				}
			}
			return true;
		case '<':
			// Roomid-link span. Not to be confused with a URL span.
			// `<<roomid>>`
			{
				if (this.slice(start, start + 8) !== '&lt;&lt;') return false; // <<
				let i = start + 8;
				while (/[a-z0-9-]/.test(this.at(i))) i++;
				if (this.slice(i, i + 8) !== '&gt;&gt;') return false; // >>

				this.pushSlice(start);
				const roomid = this.slice(start + 8, i);
				if (this.showSyntax) {
					this.buffers.push(`<small>&lt;&lt;</small><u>${roomid}</u><small>&gt;&gt;</small>`);
				} else {
					this.buffers.push(`&laquo;<a href="/${roomid}" target="_blank">${roomid}</a>&raquo;`);
				}
				this.offset = i + 8;
			}
			return true;
		case 'a': case 'u':
			// URL span. Skip to the end of the link - where `</a>` or `</u>` is.
			// Nothing inside should be formatted further (obviously we don't want
			// `example.com/__foo__` to turn `foo` italic).
			{
				let i = start + 2;
				// Find </a> or </u>.
				// We need to check the location of `>` to disambiguate from </small>.
				while (this.at(i) !== '<' || this.at(i + 1) !== '/' || this.at(i + 3) !== '>') i++;
				i += 4;
				this.pushSlice(i);
			}
			return true;
		}
		return false;
	}

	get() {
		let beginningOfLine = this.offset;
		// main loop! `i` tracks our position
		// Note that we skip around a lot; `i` is mutated inside the loop
		// pretty often.
		for (let i = beginningOfLine; i < this.str.length; i++) {
			const char = this.at(i);
			switch (char) {
			case '_':
			case '*':
			case '~':
			case '^':
			case '\\':
			case '|':
				// Must be exactly two chars long.
				if (this.at(i + 1) === char && this.at(i + 2) !== char) {
					// This is a completely normal two-char span. Close it if it's
					// already open, open it if it's not.
					// The inside of regular spans must not start or end with a space.
					if (!(this.at(i - 1) !== ' ' && this.closeSpan(char, i, i + 2))) {
						if (this.at(i + 2) !== ' ') this.pushSpan(char, i, i + 2);
					}
					if (i < this.offset) {
						i = this.offset - 1;
						break;
					}
				}
				while (this.at(i + 1) === char) i++;
				break;
			case '(':
				// `(` span - does nothing except end spans
				this.stack.push(['(', -1]);
				break;
			case ')':
				// end of `(` span
				this.closeParenSpan(i);
				if (i < this.offset) {
					i = this.offset - 1;
					break;
				}
				break;
			case '`':
				// ` ``code`` ` span. Uses lookahead because its contents are not
				// formatted.
				// Must be at least two `` ` `` in a row.
				if (this.at(i + 1) === '`') this.runLookahead('`', i);
				if (i < this.offset) {
					i = this.offset - 1;
					break;
				}
				while (this.at(i + 1) === '`') i++;
				break;
			case '[':
				// `[` (link) span. Uses lookahead because it might contain a
				// URL which can't be formatted, or search terms that can't be
				// formatted.
				this.runLookahead('[', i);
				if (i < this.offset) {
					i = this.offset - 1;
					break;
				}
				while (this.at(i + 1) === '[') i++;
				break;
			case ':':
				// Looks behind for `spoiler:` or `spoilers:`. Spoiler spans
				// are also weird because they don't require an ending symbol,
				// although that's not handled here.
				if (i < 7) break;
				if (this.slice(i - 7, i + 1).toLowerCase() === 'spoiler:' ||
					this.slice(i - 8, i + 1).toLowerCase() === 'spoilers:') {
					if (this.at(i + 1) === ' ') i++;
					this.pushSpan('spoiler', i + 1, i + 1);
				}
				break;
			case '&': // escaped '<' or '>'
				// greentext or roomid
				if (i === beginningOfLine && this.slice(i, i + 4) === '&gt;') {
					// greentext span, normal except it lacks an ending span
					// check for certain emoticons like `>_>` or `>w<`
					if (!"._/=:;".includes(this.at(i + 4)) && !['w&lt;', 'w&gt;'].includes(this.slice(i + 4, i + 9))) {
						this.pushSpan('>', i, i);
					}
				} else {
					// completely normal `<<roomid>>` span
					// uses lookahead because roomids can't be formatted.
					this.runLookahead('<', i);
				}
				if (i < this.offset) {
					i = this.offset - 1;
					break;
				}
				while (this.slice(i + 1, i + 5) === 'lt;&') i += 4;
				break;
			case '<': // guaranteed to be <a ...> or <u>
				// URL span
				// The constructor has already converted `<` to `&lt;` and URLs
				// to links, so `<` must be the start of a converted link.
				this.runLookahead('a', i);
				if (i < this.offset) {
					i = this.offset - 1;
					break;
				}
				// should never happen
				break;
			case '\r':
			case '\n':
				// End of the line. No spans span multiple lines.
				this.popAllSpans(i);
				if (this.replaceLinebreaks) {
					this.buffers.push(`<br />`);
					this.offset++;
				}
				beginningOfLine = i + 1;
				break;
			}
		}

		this.popAllSpans(this.str.length);
		return this.buffers.join('');
	}
}

/**
 * Takes a string and converts it to HTML by replacing standard chat formatting with the appropriate HTML tags.
 */
export function formatText(str: string, isTrusted = false, replaceLinebreaks = false, showSyntax = false) {
	return new TextFormatter(str, isTrusted, replaceLinebreaks, showSyntax).get();
}

/**
 * Takes a string and strips all standard chat formatting except greentext from it, the text of a link is kept.
 */
export function stripFormatting(str: string) {
	// Doesn't match > meme arrows because the angle bracket appears in the chat still.
	str = str.replace(/\*\*([^\s*]+)\*\*|__([^\s_]+)__|~~([^\s~]+)~~|``([^\s`]+)``|\^\^([^\s^]+)\^\^|\\([^\s\\]+)\\/g,
		(match, $1, $2, $3, $4, $5, $6) => $1 || $2 || $3 || $4 || $5 || $6);
	// Remove all of the link expect for the text in [[text<url>]]
	return str.replace(/\[\[(?:([^<]*)\s*<[^>]+>|([^\]]+))\]\]/g, (match, $1, $2) => $1 || $2 || '');
}
