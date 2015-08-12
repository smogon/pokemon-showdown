var assert = require('assert');
var database = require('../../database');
var fs = require('fs');
var path = require('path');

var DB, file;
describe('lowdb', function () {
	before(function () {
		DB = database('lowdb');
		file = path.join(__dirname, '../../config/db.json');
	});

	it('should create a user when writing', function (done) {
		DB.write('money', 1, 'testuser2', function (err, value) {
			assert.deepEqual(typeof err, 'object');

			setTimeout(function () {
				fs.readFile(file, 'utf8', function (err, data) {
					if (err) return done(err);
					assert.deepEqual(data.indexOf('testuser2') >= 0, true);
					var json = JSON.parse(data);
					assert.deepEqual(typeof json, 'object');
					assert.deepEqual(json.users.length, 1);
					done();
				});
			}, 50);
		});
	});

	after(function (done) {
		fs.unlink(file, function (err) {
			if (err) return done(err);
			done();
		});
	});
});
