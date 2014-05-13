var gulp = require('gulp'),
	jshintStylish = require('jshint-stylish'),
	gutil = require('gulp-util'),// Currently unused, but gulp strongly suggested I install...
	jshint = require('gulp-jshint'),
	jsHintOptions = {
		"trailing": true,
		"nonbsp": true,
		"noarg": true,
		"latedef": true,

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
	var directories = ['./*.js', './data/*.js', './mods/*.js', './config/*.js'];
	console.log("\n\n*** Linting JavaScript Files ***\n\n");

	gulp.src(directories)
		.pipe(jshint(jsHintOptions))
		.pipe(jshint.reporter(jshintStylish));

});

gulp.task('default', ['lint']);
