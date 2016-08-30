"use strict";

describe("eslint-rules/validate-conditionals", function () {
	const rule = require('./../../../dev-tools/eslint/validate-conditionals');
	const RuleTester = require('eslint/lib/testers/rule-tester');

	const ruleTester = new RuleTester();
	ruleTester.run("validate-conditionals", rule, {
		valid: [
			'if (Math.random) {\nMath.random();\n}',
			'if (Math.random) {\n//This is a comment\n}',
			'if (Math.random) {\nMath.random();\n} else {\n0;\n}',
			'if (Math.random) Math.random();',
		],
		invalid: [{
			code: 'if (Math.random) Math.random(); else Number.isFinite();',
			errors: [{message: "Nested conditional must span across multiple lines."}],
		}, {
			code: 'if (Math.random) Math.random();\nelse Number.isFinite();',
			errors: [{message: "Nested conditional must span across multiple lines."}],
		}, {
			code: 'if (Math.random) Math.random();\nelse if (Number.isFinite) Number.isFinite();\nelse Number.isInteger();',
			errors: [{message: "Nested conditional must span across multiple lines."}, {message: "Nested conditional must span across multiple lines."}],
		}, {
			code: 'if (Math.random) Math.random();\nelse if (Number.isFinite) Number.isFinite();\nelse if (Number.isInteger) Number.isInteger();\nelse Number.parseInt();',
			errors: [{message: "Nested conditional must span across multiple lines."}, {message: "Nested conditional must span across multiple lines."}, {message: "Nested conditional must span across multiple lines."}],
		}],
	});
});
