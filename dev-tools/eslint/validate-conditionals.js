/**
 * Enforces Pokémon Showdown code style for conditionals
 *
 * Reliant on specific active settings for ESLint's rule "Require Following Curly Brace Conventions" (curly)
 * curly: [2, "multi-line", "consistent"]
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

module.exports = function (context) {
	return {
		"IfStatement": function (node) {
			if (!node.alternate) return;
			if (node.consequent.loc.end.line > node.consequent.loc.start.line) return;
			if (node.consequent.loc.end.line >= node.alternate.loc.start.line - 1) {
				context.report({
					node: node.alternate,
					message: "Nested conditional must span across multiple lines.",
				});
			}
		},
	};
};

module.exports.schema = [];
