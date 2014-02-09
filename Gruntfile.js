module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: ['*.js', 'data/*.js', 'mods/**/*.js'],
			core: '*.js',
			data: 'data/*.js',
			mods: 'mods/**/*.js'
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('default', ['jshint:core']);
};
