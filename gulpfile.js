'use strict';

const path = require('path');
const util = require('util');

const gulp = require('gulp');
const lazypipe = require('lazypipe');
const merge = require('merge-stream');
const cache = require('gulp-cache');
const jscs = require('gulp-jscs');
const jshint = require('gulp-jshint');
const replace = require('gulp-replace');
const CacheSwap = require('cache-swap');
const jshintStylish = require('jshint-stylish');

const fileCache = new CacheSwap({tmpDir: '', cacheDirName: 'gulp-cache'});

let globals = {};
let globalList = [
	'Config', 'Monitor', 'toId', 'Tools', 'LoginServer', 'Users', 'Rooms', 'Verifier',
	'CommandParser', 'Simulator', 'Tournaments', 'Dnsbl', 'Cidr', 'Sockets', 'TeamValidator',
	'Ladders'
];
globalList.forEach(function (identifier) {globals[identifier] = false;});

function lint(jsHintOptions, jscsOptions) {
	function cachedJsHint() {
		return cache(jshint(jsHintOptions), {
			success: function (file) {
				return file.jshint.success;
			},
			value: function (file) {
				return {jshint: file.jshint};
			},
			fileCache: fileCache
		});
	}
	return lazypipe()
		.pipe(cachedJsHint)
		.pipe(jscs.bind(jscs, jscsOptions))();
}

let jsHintOptions = {};
jsHintOptions.base = {
	"nonbsp": true,
	"nonew": true,
	"noarg": true,
	"loopfunc": true,
	"latedef": 'nofunc',

	"freeze": true,
	"undef": true,

	"sub": true,
	"evil": true,
	"esnext": true,
	"node": true,
	"eqeqeq": true,

	"globals": globals
};
jsHintOptions.legacy = util._extend(util._extend({}, jsHintOptions.base), {
	"es3": true
});
jsHintOptions.test = util._extend(util._extend({}, jsHintOptions.base), {
	"globals": util._extend(globals, {
		"BattleEngine": false
	}),
	"mocha": true
});

let jscsOptions = {};
jscsOptions.base = {
	"preset": "yandex",

	"additionalRules": [
		new (require('./dev-tools/jscs-custom-rules/validate-conditionals.js'))(),
		new (require('./dev-tools/jscs-custom-rules/validate-case-indentation.js'))()
	],
	"validateConditionals": true,
	"validateCaseIndentation": true,

	"requireCurlyBraces": null,

	"maximumLineLength": null,
	"validateIndentation": '\t',
	"validateQuoteMarks": null,
	"disallowQuotedKeysInObjects": null,
	"requireDotNotation": null,

	"disallowMultipleVarDecl": null,
	"disallowImplicitTypeConversion": null,
	"requireSpaceAfterLineComment": null,

	"disallowMixedSpacesAndTabs": "smart",
	"requireSpaceAfterKeywords": true,
	"requireSpaceAfterBinaryOperators": [
		'=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=',
		'&=', '|=', '^=',

		'+', '-', '*', '/', '%', '<<', '>>', '>>>', '&',
		'|', '^', '&&', '||', '===', '==', '>=',
		'<=', '<', '>', '!=', '!==',

		','
	],

	"disallowSpacesInCallExpression": true,
	"validateParameterSeparator": ", ",

	"requireBlocksOnNewline": 1,
	"disallowPaddingNewlinesInBlocks": true,

	"disallowSpaceBeforeSemicolon": true,
	"requireOperatorBeforeLineBreak": true,
	"disallowTrailingComma": true,

	"requireCapitalizedConstructors": true,

	"validateLineBreaks": require('os').EOL === '\n' ? 'LF' : null,
	"disallowMultipleLineBreaks": null
};
jscsOptions.config = util._extend(util._extend({}, jscsOptions.base), {
	"disallowTrailingComma": null
});
jscsOptions.dataCompactArr = util._extend(util._extend({}, jscsOptions.base), {
	"requireSpaceAfterBinaryOperators": ["="],
	"requireSpaceBeforeBinaryOperators": ["="],
	"disallowSpaceAfterBinaryOperators": [","],
	"disallowSpaceBeforeBinaryOperators": [","]
});
jscsOptions.dataCompactAll = {
	"disallowTrailingComma": true,

	"validateLineBreaks": 'CI' in process.env ? 'LF' : null,
	"requireLineFeedAtFileEnd": true,
	"requireSpaceAfterBinaryOperators": ["="],
	"requireSpaceBeforeBinaryOperators": ["="],

	"validateQuoteMarks": "\"",
	"disallowQuotedKeysInObjects": "allButReserved",

	"disallowSpaceAfterObjectKeys": true,
	"disallowSpaceBeforeObjectValues": true,
	"disallowSpacesInsideBrackets": true,
	"disallowSpacesInsideArrayBrackets": true,
	"disallowSpacesInsideObjectBrackets": true,
	"disallowSpacesInsideParentheses": true,
	"disallowSpaceAfterBinaryOperators": [","],
	"disallowSpaceBeforeBinaryOperators": [","]
};
jscsOptions.dataCompactAllIndented = util._extend(util._extend({}, jscsOptions.dataCompactAll), {
	"validateIndentation": '\t'
});

let lintData = [
	{
		dirs: ['./*.js', './tournaments/*.js', './chat-plugins/*.js', './config/!(config).js', './data/rulesets.js', './data/statuses.js'],
		jsHint: jsHintOptions.base,
		jscs: jscsOptions.base
	}, {
		dirs: ['./data/scripts.js', './mods/*/scripts.js', './mods/*/rulesets.js', './mods/*/statuses.js', './dev-tools/**.js'],
		jsHint: jsHintOptions.base,
		jscs: jscsOptions.base
	}, {
		dirs: ['./config/config*.js'],
		jsHint: jsHintOptions.base,
		jscs: jscsOptions.config
	}, {
		dirs: ['./data/abilities.js', './data/items.js', './data/moves.js', './data/typechart.js', './data/aliases.js', './mods/*/abilities.js', './mods/*/items.js', './mods/*/moves.js', './mods/*/typechart.js'],
		jsHint: jsHintOptions.legacy,
		jscs: jscsOptions.base
	}, {
		dirs: ['./data/formats-data.js', './mods/*/formats-data.js', './mods/!(gen1)/pokedex.js'],
		jsHint: jsHintOptions.legacy,
		jscs: jscsOptions.dataCompactArr
	}, {
		dirs: ['./data/pokedex.js', './mods/gen1/pokedex.js'],
		jsHint: jsHintOptions.legacy,
		jscs: jscsOptions.dataCompactAll
	}, {
		dirs: ['./test/*.js', './test/application/*.js', './test/simulator/*/*.js', './test/dev-tools/*/*.js'],
		jsHint: jsHintOptions.test,
		jscs: jscsOptions.base
	}
];
lintData.extra = {
	fastlint: lintData[0],
	learnsets: {
		dirs: ['./data/learnsets*.js', './mods/*/learnsets.js'],
		jsHint: jsHintOptions.legacy,
		jscs: jscsOptions.dataCompactAllIndented
	}
};

let linter = function () {
	return (
		merge.apply(
			null,
			lintData.map(function (source) {
				return gulp.src(source.dirs)
					.pipe(lint(source.jsHint, source.jscs));
			})
		).pipe(jshint.reporter(jshintStylish))
		 .pipe(jshint.reporter('fail'))
	);
};

for (let taskName in lintData.extra) {
	gulp.task(taskName, (function (task) {
		return function () {
			return gulp.src(task.dirs)
				.pipe(lint(task.jsHint, task.jscs))
				.pipe(jshint.reporter(jshintStylish))
				.pipe(jshint.reporter('fail'));
		};
	})(lintData.extra[taskName]));
}

gulp.task('clear', function (done) {
	fileCache.clear('default', done);
});

gulp.task('lint', linter);
gulp.task('default', linter);
