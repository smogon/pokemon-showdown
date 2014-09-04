var gulp = require('gulp');
var jshintStylish = require('jshint-stylish');
var gutil = require('gulp-util'); // Currently unused, but gulp strongly suggested I install...
var jshint = require('gulp-jshint');
var replace = require('gulp-replace');

var jsHintOptions = {
	"nonbsp": true,
	"noarg": true,
	"loopfunc": true,
	"latedef": 'nofunc',

	"freeze": true,
	"immed": true,
	"undef": true,

	// style
	// "indent": true,
	"smarttabs": true,
	"trailing": true,
	"newcap": true,

	"sub": true,
	"evil": true,
	"esnext": true,
	"node": true,
	"eqeqeq": false,

	"globals": {
		"Config": false,
		"ResourceMonitor": false,
		"toId": false,
		"toName": false,
		"string": false,
		"LoginServer": false,
		"Users": false,
		"Rooms": false,
		"Verifier": false,
		"CommandParser": false,
		"Simulator": false,
		"Tournaments": false,
		"Dnsbl": false,
		"Cidr": false,
		"Sockets": false,
		"Tools": false,
		"TeamValidator": false
	}
};

gulp.task('data', function () {
	var directories = ['./data/*.js', './mods/*/*.js'];
	jsHintOptions['es3'] = true;

	// Replacing `var` with `let` is sort of a hack that stops jsHint from
	// complaining that I'm using `var` like `let` should be used, but
	// without having to deal with iffy `let` support.

	return gulp.src(directories)
		.pipe(replace(/\bvar\b/g, 'let'))
		.pipe(jshint(jsHintOptions))
		.pipe(jshint.reporter(jshintStylish))
		.pipe(jshint.reporter('fail'));
});

gulp.task('fastlint', function () {
	var directories = ['./*.js', './tournaments/*.js', './chat-plugins/*.js', './config/*.js'];
	delete jsHintOptions['es3'];

	return gulp.src(directories)
		.pipe(replace(/\bvar\b/g, 'let'))
		.pipe(jshint(jsHintOptions))
		.pipe(jshint.reporter(jshintStylish))
		.pipe(jshint.reporter('fail'));
});

gulp.task('default', ['fastlint', 'data']);
gulp.task('lint', ['fastlint', 'data']);
