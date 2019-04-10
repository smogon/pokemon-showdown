'use strict';

module.exports = {
	testEnvironment: 'node',
	setupFilesAfterEnv: ['<rootDir>/test/main.js'],
	testMatch: ['<rootDir>/test/simulator/**/*.js', '<rootDir>/test/application/*.js', '<rootDir>/test/chat-plugins/*.js', '<rootDir>/test/dev-tools/*.js'],
};
