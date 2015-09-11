/**
 * Crash logger
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Logs crashes, sends an e-mail notification if you've set up
 * config.js to do that.
 *
 * @license MIT license
 */

exports = module.exports = (function () {
	var lastCrashLog = 0;
	var transport;
	var logPath = require('path').resolve(__dirname, 'logs/errors.txt');
	return function (err, description, isException) {
		console.log("\nCRASH: " + (err.stack || err) + "\n");
		require('fs').createWriteStream(logPath, {'flags': 'a'}).on("open", function (fd) {
			this.write("\n" + err.stack + "\n");
			this.end();
		}).on("error", function (err) {
			console.log("\nSUBCRASH: " + err.stack + "\n");
		});
		var datenow = Date.now();
		if (Config.crashguardemail && ((datenow - lastCrashLog) > 1000 * 60 * 5)) {
			lastCrashLog = datenow;
			try {
				if (!transport) transport = require('nodemailer').createTransport(Config.crashguardemail.options);
			} catch (e) {
				console.log("Could not start nodemailer - try `npm install` if you want to use it");
			}
			if (transport) {
				transport.sendMail({
					from: Config.crashguardemail.from,
					to: Config.crashguardemail.to,
					subject: Config.crashguardemail.subject,
					text: description + " crashed " + (exports.hadException ? "again " : "") + "with this stack trace:\n" + (err.stack || err)
				}, function (err) {
					if (err) console.log("Error sending email: " + err);
				});
			}
		}
		if (isException) {
			exports.hadException = true;
		}
		if (process.uptime() > 60 * 60) {
			// no need to lock down the server
			return true;
		}
	};
})();
