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
					'[^\\s`()\\[\\]{}\'".,!?;:&<>*_`^~\\\\]' +
					'|' + parenthesisRegex +
				')' +
			')?' +
		')?' +
		'|[a-z0-9.]+\\b@' + domainRegex + '[.][a-z]{2,3}' +
	')' +
	'(?!.*&gt;)',
	'ig'
);
const hyperlinkRegex = new RegExp(`(.+)&lt;(.+)&gt;`, 'i');

/** @typedef {{token: string, endToken?: string, resolver: (str: string) => string}} Resolver */
/** @type {Resolver[]} */
const formattingResolvers = [
	{token: "**", resolver: str => `<b>${str}</b>`},
	{token: "__", resolver: str => `<i>${str}</i>`},
	{token: "``", resolver: str => `<code>${str}</code>`},
	{token: "~~", resolver: str => `<s>${str}</s>`},
	{token: "^^", resolver: str => `<sup>${str}</sup>`},
	{token: "\\\\", resolver: str => `<sub>${str}</sub>`},
	{token: "&lt;&lt;", endToken: "&gt;&gt;", resolver: str => str.replace(/[a-z0-9-]/g, '').length ? false : `&laquo;<a href="${str}" target="_blank">${str}</a>&raquo;`},
	{token: "[[", endToken: "]]", resolver: str => {
		let hl = hyperlinkRegex.exec(str);
		if (hl) return `<a href="${hl[2].trim().replace(/^([a-z]*[^a-z:])/g, 'http://$1')}">${hl[1].trim()}</a>`;

		let query = str;
		let querystr = str;
		let split = str.split(':');
		if (split.length > 1) {
			let opt = toId(split[0]);
			query = split.slice(1).join(':').trim();

			switch (opt) {
			case 'wiki':
			case 'wikipedia':
				return `<a href="http://en.wikipedia.org/w/index.php?title=Special:Search&search=${encodeURIComponent(query)}" target="_blank">${querystr}</a>`;
			case 'yt':
			case 'youtube':
				query += " site:youtube.com";
				querystr = `yt: ${query}`;
				break;
			case 'pokemon':
			case 'item':
				return `<psicon title="${query}" ${opt}="${query}" />`;
			}
		}

		return `<a href="http://www.google.com/search?ie=UTF-8&btnI&q=${encodeURIComponent(query)}" target="_blank">${querystr}</a>`;
	}},
];

/**
 * Takes a string and converts it to HTML by replacing standard chat formatting with the appropriate HTML tags.
 *
 * @param  {string} str
 * @return {string}
 */
function formatText(str) {
	// escapeHTML, without escaping /
	str = ('' + str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
	str = str.replace(linkRegex, uri => `<a href=${uri.replace(/^([a-z]*[^a-z:])/g, 'http://$1')}>${uri}</a>`);

	let output = [''];
	let stack = [];

	let parse = true;

	let i = 0;
	mainLoop: while (i < str.length) {
		let token = str[i];

		// Hardcoded parsing
		if (parse && token === '`' && str.substr(i, 2) === '``') {
			stack.push('``');
			output.push('');
			parse = false;
			i += 2;
			continue;
		}

		for (const formattingResolver of formattingResolvers) {
			let start = formattingResolver.token;
			let end = formattingResolver.endToken || start;

			if (stack.length && end.startsWith(token) && str.substr(i, end.length) === end && output[stack.length].replace(token, '').length) {
				for (let j = stack.length - 1; j >= 0; j--) {
					if (stack[j] === start) {
						parse = true;

						while (stack.length > j + 1) {
							output[stack.length - 1] += stack.pop() + output.pop();
						}

						let str = output.pop();
						let outstr = formattingResolver.resolver(str.trim());
						if (!outstr) outstr = `${start}${str}${end}`;
						output[stack.length - 1] += outstr;
						i += end.length;
						stack.pop();
						continue mainLoop;
					}
				}
			}

			if (parse && start.startsWith(token) && str.substr(i, start.length) === start) {
				stack.push(start);
				output.push('');
				i += start.length;
				continue mainLoop;
			}
		}

		output[stack.length] += token;
		i++;
	}

	while (stack.length) {
		output[stack.length - 1] += stack.pop() + output.pop();
	}

	let result = output[0];

	return result;
}

module.exports = {formatText, linkRegex};
