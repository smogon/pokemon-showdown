/**
 * Crash logger
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Logs crashes, sends an e-mail notification if you've set up
 * config.js to do that.
 *
 * @license MIT license
 */

module.exports = (function() {
	var lastCrashLog = 0;
	return function(err, description) {
		console.log("\nCRASH: "+err.stack+"\n");
		fs.createWriteStream('logs/errors.txt', {'flags': 'a'}).on("open", function(fd) {
			this.write("\n"+err.stack+"\n");
			this.end();
		}).on("error", function (err) {
			console.log("\nSUBCRASH: "+err.stack+"\n");
		});
		var datenow = Date.now();
		if (config.crashguardemail && ((datenow - lastCrashLog) > 1000 * 60 * 5)) {
			lastCrashLog = datenow;
			var transport;
			try {
				var transport = require('nodemailer').createTransport(
					config.crashguardemail.transport,
					config.crashguardemail.options
				);
				transport.sendMail({
					from: config.crashguardemail.from,
					to: config.crashguardemail.to,
					subject: config.crashguardemail.subject,
					text: description + ' crashed with this stack trace:\n' + err.stack
				});
			} catch (e) {
				// could not send an email...
				console.log('Error sending email: ' + e);
			} finally {
				if (transport) {
					transport.close();
				}
			}
		}
		if (process.uptime() > 60 * 60) {
			// no need to lock down the server
			return true;
		}
	};
})();
