/**
 * Enforces Pokémon Showdown code style for conditionals
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "validateConditionals": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 *  if (console.log) {
 *  	console.log("Test");
 *  }
 *
 *  if (console.log) {
 *  	console.log("Test");
 *  } else {
 *  	throw new Error("Error");
 *  }
 *
 *  if (console.log) {
 *  	console.log("Test");
 *  } else {
 *  	0;
 *  }
 *
 *  if (console.log) {
 *  	console.log("Test");
 *  } else if (Number.isFinite) {
 *  	Number.isFinite(42);
 *  }
 *
 *  if (Math.random) Math.random();
 *
 *  if (a == 1) // Do something with this magic number
 * ```
 *
 * ##### Invalid
 *
 * ```js
 *  if (console.log) {
 *  	console.log("Test");
 *  } else if (Number.isFinite) Number.isFinite();
 *
 *  if (Math.random) {
 *  	Math.random();
 *  } else {Number.isFinite()};
 *
 *  if (Math.random) {
 *  	Math.random();
 *  } else if (Number.isFinite) {Number.isFinite()};
 *
 *  if (Math.random) Math.random();
 *  else {
 *  	Number.isFinite();
 *  }
 *
 *  if (Math.random) Math.random(); else Number.isFinite();
 *
 *  if (Math.random) Math.random();
 *  else Number.isFinite();
 *
 *  if (Math.random) Math.random();
 *  else if (Number.isFinite) Number.isFinite();
 *  else Number.isInteger();
 *
 *  if (Math.random)
 *  	Math.random();
 *
 * ```
 */

'use strict';

const assert = require('assert');

module.exports = function () {};

module.exports.prototype = {

	configure: function (options) {
		assert(
			options === true,
			this.getOptionName() + ' option requires a true value or should be removed'
		);
	},

	getOptionName: function () {
		return 'validateConditionals';
	},

	check: function (file, errors) {
		file.iterateNodesByType('IfStatement', function (node) {
			let consequent = node.consequent;
			let statementType = consequent.type;

			// Either all `BlockStatement` or none.
			let subNode = node;
			while (subNode.alternate) {
				subNode = subNode.alternate;
				if (subNode.type === 'IfStatement') {
					if (subNode.consequent.type !== statementType) {
						errors.add("Mixed conditional blocks and expressions are disallowed", subNode.loc.start);
						break;
					} else if (subNode.consequent.type !== 'BlockStatement') {
						errors.add("Nested conditionals require curly braces", subNode.loc.start);
						break;
					}
				} else {
					if (subNode.type !== statementType && (subNode.type === 'BlockStatement' || statementType === 'BlockStatement')) {
						errors.add("Mixed conditional blocks and expressions are disallowed", subNode.loc.start);
					} else if (subNode.type !== 'BlockStatement') {
						errors.add("Nested conditionals require curly braces", subNode.loc.start);
					}
					break;
				}
			}

			// Curly braces iff multiline
			let nodesCheck = [consequent];
			if (node.alternate) nodesCheck.push(node.alternate);
			for (let i = 0; i < nodesCheck.length; i++) {
				let subNode = nodesCheck[i];
				if (subNode.type === 'BlockStatement') {
					let openingBrace = file.getFirstNodeToken(subNode);
					let closingBrace = file.getLastNodeToken(subNode);
					if (!subNode.body.length) {
						// Empty block
						errors.assert.differentLine({
							token: openingBrace,
							nextToken: closingBrace
						});
						continue;
					}
					let nextToken = file.getFirstNodeToken(subNode.body[0]);
					let prevToken = file.getPrevToken(closingBrace);

					errors.assert.differentLine({
						token: openingBrace,
						nextToken: nextToken,
						message: 'Newline after opening curly brace required for block conditional (a)'
					});
					errors.assert.differentLine({
						token: prevToken,
						nextToken: closingBrace,
						message: 'Newline before closing curly brace required for block conditional (b)'
					});
				} else if (subNode.type !== 'IfStatement') {
					if (subNode === consequent) {
						let token = file.getFirstNodeToken(subNode);
						errors.assert.sameLine({
							token: node.test,
							nextToken: token,
							message: 'Newline disallowed in non-block conditional (b)'
						});
					}
				}
			}
		});
	}
};
