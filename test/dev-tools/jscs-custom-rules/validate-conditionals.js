var Checker = require('jscs');
var assert = require('assert');

describe('rules/validate-conditionals', function () {
	var checker;

	before(function () {
		checker = new Checker();
		checker.configure({
			additionalRules: [new (require('./../../../dev-tools/jscs-custom-rules/validate-conditionals.js'))()],
			validateConditionals: true
		});
	});

	describe('option value true', function () {
		it('should report braces if only in consequent', function () {
			assert(!checker.checkString('if (Math.random) {\nMath.random();\n} else 0;').isEmpty());
		});

		it('should report braces if only in alternate without indentation', function () {
			assert(!checker.checkString('if (Math.random) Math.random();\nelse {\n0;\n}').isEmpty());
		});

		it('should report braces if only in alternate with indentation', function () {
			assert(!checker.checkString('if (Math.random) Math.random();\nelse {\n\t0;\n}').isEmpty());
		});

		it('should report lack of braces for multiline consequent', function () {
			assert(!checker.checkString('if (Math.random)\nMath.random();').isEmpty());
		});

		it('should report lack of braces for multiline alternate', function () {
			assert(!checker.checkString('if (Math.random) {\nMath.random()\n} else\n0;').isEmpty());
		});

		it('should report braces for single-line consequent', function () {
			assert(!checker.checkString('if (Math.random) {Math.random();}').isEmpty());
		});

		it('should report braces for single-line alternate', function () {
			assert(!checker.checkString('if (Math.random) {\nMath.random();\n} else {0;}').isEmpty());
		});

		it('should report lack of braces for single-line alternate', function () {
			assert(!checker.checkString('if (Math.random) Math.random();\nelse Number.isFinite();').isEmpty());
		});

		it('should report lack of braces for nested conditionals', function () {
			assert(!checker.checkString('if (Math.random) Math.random();\nelse if (Number.isFinite) Number.isFinite();\nelse Number.isInteger();').isEmpty());
		});

		it('should report lack of braces for nested conditionals', function () {
			assert(!checker.checkString('if (Math.random) Math.random();\nelse if (Number.isFinite) Number.isFinite();\nelse if (Number.isInteger) Number.isInteger();\nelse Number.parseInt();').isEmpty());
		});

		it('should report single-line if-else', function () {
			assert(!checker.checkString('if (Math.random) Math.random(); else Number.isFinite();').isEmpty());
		});

		it('should not report braces for multiline consequent', function () {
			assert(checker.checkString('if (Math.random) {\nMath.random();\n}').isEmpty());
		});

		it('should report single-line empty blocks', function () {
			assert(!checker.checkString('if (Math.random) {}').isEmpty());
		});

		it('should not report braces for empty blocks', function () {
			assert(checker.checkString('if (Math.random) {\n//This is a comment\n}').isEmpty());
		});

		it('should not report braces for multiline alternate', function () {
			assert(checker.checkString('if (Math.random) {\nMath.random();\n} else {\n0;\n}').isEmpty());
		});

		it('should not report lack of braces for single-line conditional', function () {
			assert(checker.checkString('if (Math.random) Math.random();').isEmpty());
		});
	});
});
