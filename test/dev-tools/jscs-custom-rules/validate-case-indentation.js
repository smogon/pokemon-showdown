var Checker = require('jscs');
var assert = require('assert');

describe('rules/validate-case-indentation', function () {
	var checker;

	before(function () {
		checker = new Checker();
		checker.configure({
			additionalRules: [new (require('./../../../dev-tools/jscs-custom-rules/validate-case-indentation.js'))()],
			validateCaseIndentation: true
		});
	});

	describe('option value true', function () {
		it('should report cases not aligned with switch keyword', function () {
			var src = 'switch (Number.isFinite) {\n';
			src += '\tcase isFinite:\n';
			src += '\t\tbreak;\n';
			src += '}';
			assert(!checker.checkString(src).isEmpty());
		});

		it('should not report cases aligned with switch keyword', function () {
			var src = 'switch (Number.isFinite) {\n';
			src += 'case isFinite:\n';
			src += '\tbreak;\n';
			src += '}';
			assert(checker.checkString(src).isEmpty());
		});

		it('should report default case not aligned with switch keyword', function () {
			var src = 'switch (Number.isFinite) {\n';
			src += '\tdefault:\n';
			src += '}';
			assert(!checker.checkString(src).isEmpty());
		});

		it('should not report default case aligned with switch keyword', function () {
			var src = 'switch (Number.isFinite) {\n';
			src += 'default:\n';
			src += '}';
			assert(checker.checkString(src).isEmpty());
		});
	});
});
