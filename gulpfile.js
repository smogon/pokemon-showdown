var gulp = require('gulp');
var jshintStylish = require('jshint-stylish');
var gutil = require('gulp-util'); // Currently unused, but gulp strongly suggested I install...
var jshint = require('gulp-jshint');
var replace = require('gulp-replace');

var jsHintOptions = {
	"trailing": true,
	"nonbsp": true,
	"noarg": true,
	"latedef": true,
	"loopfunc": true,

	"sub": true,
	"smarttabs": true,
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

gulp.task('lint', function () {
	var directories = ['./*.js', './data/*.js', './mods/*.js', './tournaments/*.js', './chat-plugins/*.js', './config/*.js'];
	console.log("\n\n*** Linting JavaScript Files ***\n\n");

	// Replacing `var` with `let` is sort of a hack that stops jsHint from
	// complaining that I'm using `var` like `let` should be used, but
	// without having to deal with iffy `let` support.

	gulp.src(directories)
		.pipe(replace(/\bvar\b/g, 'let'))
		.pipe(jshint(jsHintOptions))
		.pipe(jshint.reporter(jshintStylish));

});

gulp.task('fastlint', function () {
	var directories = ['./*.js', './tournaments/*.js', './chat-plugins/*.js', './config/*.js'];
	console.log("\n\n*** Linting JavaScript Files ***\n\n");

	gulp.src(directories)
		.pipe(replace(/\bvar\b/g, 'let'))
		.pipe(jshint(jsHintOptions))
		.pipe(jshint.reporter(jshintStylish));

});

gulp.task('default', ['lint']);
