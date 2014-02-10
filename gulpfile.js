var gulp = require('gulp'),
	gutil = require('gulp-util'),// Currently unused, but gulp strongly suggested I install...
	jshint = require('gulp-jshint');

gulp.task('lint', function() {
	console.log("\n\n*** Linting JavaScript Files ***\n\n");

	gulp.src('./*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));

	gulp.src('./data/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));

	gulp.src('./mods/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));

	gulp.src('./config/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('default', ['lint']);
