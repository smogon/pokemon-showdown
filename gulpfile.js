var gulp = require('gulp'),
	gutil = require('gulp-util'),// Currently unused, but gulp strongly suggested I install...
	jshint = require('gulp-jshint'),
	jsHintIgnore = {
		"sub": true,
		"smarttabs": true
	};

gulp.task('lint', function() {
	var directories = ['./*.js', './data/*.js', './mods/*.js', './config/*.js'];
	console.log("\n\n*** Linting JavaScript Files ***\n\n");

	for(var dir in directories) {
		gulp.src(directories[dir])
			.pipe(jshint(jsHintIgnore))
			.pipe(jshint.reporter('default'));
	}
});

gulp.task('default', ['lint']);
