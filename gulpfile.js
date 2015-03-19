var path = require('path');
var util = require('util');

var gulp = require('gulp');
var lazypipe = require('lazypipe');
var merge = require('merge-stream');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var replace = require('gulp-replace');
var jshintStylish = require('./' + path.relative(__dirname, require('jshint-stylish')));

var globals = {};
var globalList = [
	'Config', 'ResourceMonitor', 'toId', 'toName', 'string', 'LoginServer',
	'Users', 'Rooms', 'Verifier', 'CommandParser', 'Simulator', 'Tournaments',
	'Dnsbl', 'Cidr', 'Sockets', 'Tools', 'TeamValidator'
];
globalList.forEach(function (identifier) {globals[identifier] = false;});

function transformLet () {
	// Replacing `var` with `let` is sort of a hack that stops jsHint from
	// complaining that I'm using `var` like `let` should be used, but
	// without having to deal with iffy `let` support.

	return lazypipe()
		.pipe(replace.bind(null, /\bvar\b/g, 'let'))();
}

function lint (jsHintOptions, jscsOptions) {
	return lazypipe()
		.pipe(jshint.bind(jshint, jsHintOptions, {timeout: 150000}))
		.pipe(jscs.bind(jscs, jscsOptions))();
}

var jsHintOptions = {};
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

var jscsOptions = {};
jscsOptions.base = {
	"preset": "yandex",

	"requireCurlyBraces": null,

	"maximumLineLength": null,
	"validateIndentation": '\t',
	"validateQuoteMarks": null,
	"disallowYodaConditions": null,
	"disallowQuotedKeysInObjects": null,
	"requireDotNotation": null,

	"disallowMultipleVarDecl": null,
	"disallowImplicitTypeConversion": null,
	"requireSpaceAfterLineComment": null,
	"validateJSDoc": null,

	"disallowMixedSpacesAndTabs": "smart",
	"requireSpaceAfterKeywords": true,

	"disallowSpacesInFunctionDeclaration": null,
	"requireSpacesInFunctionDeclaration": {
		"beforeOpeningCurlyBrace": true
	},
	"requireSpacesInAnonymousFunctionExpression": {
		"beforeOpeningRoundBrace": true,
		"beforeOpeningCurlyBrace": true
	},
	"disallowSpacesInNamedFunctionExpression": null,
	"requireSpacesInNamedFunctionExpression": {
		"beforeOpeningCurlyBrace": true
	},
	"validateParameterSeparator": ", ",

	"requireBlocksOnNewline": 1,
	"disallowPaddingNewlinesInBlocks": true,

	"requireOperatorBeforeLineBreak": true,
	"disallowTrailingComma": true,

	"requireCapitalizedConstructors": true,

	"validateLineBreaks": require('os').EOL === '\n' ? 'LF' : null,
	"disallowMultipleLineBreaks": null,

	"esnext": true
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

var lintData = [
	{
		dirs: ['./*.js', './tournaments/*.js', './chat-plugins/*.js', './config/!(config).js', './**/scripts.js', './**/rulesets.js', './**/statuses.js'],
		jsHint: jsHintOptions.base,
		jscs: jscsOptions.base
	}, {
		dirs: ['./config/config*.js'],
		jsHint: jsHintOptions.base,
		jscs: jscsOptions.config
	}, {
		dirs: ['./**/abilities.js', './**/items.js', './**/moves.js', './**/typechart.js', './**/aliases.js'],
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
		dirs: ['./data/learnsets*.js', './mods/*/learnsets.js'],
		jsHint: jsHintOptions.legacy,
		jscs: jscsOptions.dataCompactAllIndented
	}, {
		dirs: ['./test/*.js', './test/application/*.js', './test/simulator/*/*.js'],
		jsHint: jsHintOptions.test,
		jscs: jscsOptions.base
	}
];

var linter = function () {
	return (
		merge.apply(
			null,
			lintData.map(function (source) {
				return gulp.src(source.dirs)
					.pipe(transformLet())
					.pipe(lint(source.jsHint, source.jscs));
			})
		).pipe(jshint.reporter(jshintStylish))
		 .pipe(jshint.reporter('fail'))
	);
};

gulp.task('fastlint', function () {
	var source = lintData[0];
	return gulp.src(source.dirs)
		.pipe(transformLet())
		.pipe(lint(source.jsHint, source.jscs))
		.pipe(jshint.reporter(jshintStylish))
		.pipe(jshint.reporter('fail'));
});

gulp.task('lint', linter);
gulp.task('default', linter);
