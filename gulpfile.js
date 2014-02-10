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
		"eqeqeq": false
	};

gulp.task('lint', function() {
	var directories = ['./*.js', './data/*.js', './mods/*.js', './config/*.js'];
	console.log("\n\n*** Linting JavaScript Files ***\n\n");

	for(var dir in directories) {
		gulp.src(directories[dir])
			.pipe(jshint(jsHintOptions))
			.pipe(jshint.reporter(jshintStylish));
	}
});

gulp.task('default', ['lint']);
