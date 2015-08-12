/**
 * Database file
 * To easily switch between different databases using a common API.
 *
 *
 * methods.read(key, username, callback)
 *	 Reads a key in the database.
 *
 *	 @param {String} key
 *	 @param {String} user
 *	 @param {Function} callback(err, value)
 *
 * methods.write(key, value, user, callback)
 *	 Writes a key to value in the database.
 *
 *	 @param {String} key
 *	 @param {*} value
 *	 @param {String} user
 *	 @param {Function} callback(err, value)
 *
 * methods.total(key, callback)
 *	 Combined value from all rows.
 *
 *	 @param {String} key
 *	 @param {Function} callback(err, total)
 *
 * methods.countUsers(callback)
 *	 Gets how many users there are.
 *
 *	 @param {Function} callback(err, size)
 *
 * methods.sortDesc(key, amount, callback)
 *	 Sort by a key in descending order.
 *
 *	 @param {String} key
 *	 @param {Number} amount
 *	 @param {Function} callback(err, array)
 *
 * methods.get(key, callback)
 *	 Get a key in the database.
 *
 *	 @param {String} key
 *	 @param {Function} callback(err, key)
 *
 * methods.set(key, value, callback)
 *	 Set a key in the database.
 *
 *	 @param {String} key
 *	 @param {Number} value
 *	 @param {Function} callback(err, newKey)
 *
 * methods.users(callback)
 *	 Get the users array in the database.
 *
 *	 @param {Function} callback(err, users)
 *
 * @license MIT license
 */

var low = require('lowdb');
var mysql = require('mysql');
var path = require('path');

var lowFile = path.join(__dirname, 'config/db.json');

var databases = {};

databases.lowdb = function () {
	var db = low(lowFile);
	var methods = {};

	methods.read = function (key, username, callback) {
		var user = db('users').find({username: username});
		if (!user) return callback(null);
		callback(null, user[key]);
	};

	methods.write = function (key, value, username, callback) {
		var user = db('users').find({username: username});
		if (!user) db('users').push({username: username});
		var obj = {};
		obj[key] = value;
		var val = db('users')
					.chain()
					.find({username: username})
					.assign(obj)
					.value();

		callback(null, val[key]);
	};

	methods.total = function (key, callback) {
		var total = db('users').reduce(function (acc, user) {
			if (!acc[key] || !user[key]) return {money: acc[key]};
			return {money: acc[key] + user[key]};
		});
		callback(null, total.money);
	};

	methods.countUsers = function (callback) {
		return callback(null, db('users').size());
	};

	methods.sortDesc = function (key, amount, callback) {
		var value = db('users')
						.chain()
						.filter(function (user) {
							return user[key] >= 0;
						})
						.sortByOrder(key, ['desc'])
						.take(amount)
						.value();

		callback(null, value);
	};

	methods.get = function (key, callback) {
		if (key === 'users') return callback(new Error('Cannot overwrite users'));
		callback(null, db.object[key]);
	};

	methods.set = function (key, value, callback) {
		if (key === 'users') return callback(new Error('Cannot overwrite users'));
		db.object[key] = value;
		callback(null, db.object[key]);
	};

	methods.users = function (callback) {
		callback(null, db('users').value());
	};

	return methods;
};

databases.mysql = function () {
	var methods = {};
	var connection = mysql.createConnection(Config.mysql);
	connection.connect(function (err) {
		if (err) return console.error('error connecting: ' + err.stack);
		console.log('connected as id ' + connection.threadId);
	});

	var createUserTableStr = "CREATE TABLE IF NOT EXISTS users (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT," +
							"username VARCHAR(20) UNIQUE," +
							"money INTEGER," +
							"tickets TEXT);";

	connection.query(createUserTableStr, function (err) {
		if (err) throw err;
	});

	var createSymbolTableStr = "CREATE TABLE IF NOT EXISTS symbols (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, k TEXT, v TEXT);";

	connection.query(createSymbolTableStr, function (err) {
		if (err) throw err;
	});

	methods.read = function (key, username, callback) {
		connection.query("SELECT ?? from users WHERE username = ?;", [key, username], function (err, rows) {
			if (err) return callback(new Error(err));
			if (!rows.length) return callback(null);
			var value = rows[0][key];
			if (key === 'tickets' && value) return callback(null, value.split(','));
			callback(null, value);
		});
	};

	methods.write = function (key, value, username, callback) {
		if (Array.isArray(value)) value = value.join(', ');
		connection.query("INSERT INTO users (username, ??) VALUES (?, ?) ON DUPLICATE KEY UPDATE ?? = VALUES (??);", [key, username, value, key, key], function (err) {
			if (err) return callback(new Error(err));
			callback(null, value);
		});
	};

	methods.total = function (key, callback) {
		connection.query("SELECT SUM(??) FROM users;", [key], function (err, rows) {
			if (err) return callback(new Error(err));
			callback(null, rows[0]['SUM(`' + key + '`)']);
		});
	};

	methods.countUsers = function (callback) {
		connection.query("SELECT * FROM users;", function (err, rows) {
			if (err) return callback(new Error(err));
			callback(null, rows.length);
		});
	};

	methods.sortDesc = function (key, amount, callback) {
		connection.query("SELECT username, ?? FROM users ORDER BY ?? DESC LIMIT ?;", [key, key, amount], function (err, rows) {
			if (err) return callback(new Error(err));
			callback(null, rows);
		});
	};

	methods.get = function (key, callback) {
		connection.query("SELECT * FROM symbols WHERE k = ?;", [key], function (err, rows) {
			if (err) return callback(new Error(err));
			if (key === 'pot') return callback(null, Number(rows[0]['v']));
			callback(null, rows[0][key]);
		});
	};

	methods.set = function (key, value, callback) {
		connection.query("DELETE FROM symbols WHERE k = ?;", [key], function (err) {
			if (err) return callback(new Error(err));
			connection.query("INSERT INTO symbols (k, v) VALUES (?, ?);", [key, value], function (err) {
				if (err) return callback(new Error(err));
				callback(null, value);
			});
		});
	};

	methods.users = function (callback) {
		connection.query("SELECT * FROM users;", function (err, rows) {
			if (err) return callback(new Error(err));
			callback(null, rows);
		});
	};

	return methods;
};

function Database(database) {
	return databases[database]();
}

module.exports = Database;
