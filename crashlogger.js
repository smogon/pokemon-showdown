/**
 * Crash logger
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Logs crashes, sends an e-mail notification if you've set up
 * config.js to do that.
 *
 * @license MIT license
 */

'use strict';

const CRASH_EMAIL_THROTTLE = 5 * 60 * 1000; // 5 minutes

const logPath = require('path').resolve(__dirname, 'logs/errors.txt');
let lastCrashLog = 0;
let transport;

exports = module.exports = function (err, description, data) {
	const datenow = Date.now();

	let stack = (err.stack || err);
	if (data) {
		stack += `\n\nAdditional information:\n`;
		for (let k in data) {
			stack += `  ${k} = ${data[k]}\n`;
		}
	}

	console.error(`\nCRASH: ${stack}\n`);
	let out = require('fs').createWriteStream(logPath, {'flags': 'a'});
	out.on("open", fd => {
		out.write(`\n${stack}\n`);
		out.end();
	}).on("error", err => {
		console.error(`\nSUBCRASH: ${err.stack}\n`);
	});

	if (Config.crashguardemail && ((datenow - lastCrashLog) > CRASH_EMAIL_THROTTLE)) {
		lastCrashLog = datenow;
		try {
			if (!transport) transport = require('nodemailer').createTransport(Config.crashguardemail.options);
		} catch (e) {
			console.error(`Could not start nodemailer - try \`npm install\` if you want to use it`);
		}
		if (transport) {
			transport.sendMail({
				from: Config.crashguardemail.from,
				to: Config.crashguardemail.to,
				subject: Config.crashguardemail.subject,
				text: `${description} crashed ${exports.hadException ? "again " : ""}with this stack trace:\n${stack}`,
			}, err => {
				if (err) console.error(`Error sending email: ${err}`);
			});
		}
	}

	exports.hadException = true;
	if (process.uptime() < 60 * 60) {
		// lock down the server
		return 'lockdown';
	}
};
