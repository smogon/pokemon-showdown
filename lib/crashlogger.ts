/**
 * Crash logger
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Logs crashes, sends an e-mail notification if you've set up
 * config.js to do that.
 *
 * @license MIT
 */

import * as fs from 'fs';
import * as path from 'path';

const CRASH_EMAIL_THROTTLE = 5 * 60 * 1000; // 5 minutes

const logPath = path.resolve(
	// not sure why this is necessary, but in Windows testing it was
	__dirname, '../', __dirname.includes(`${path.sep}dist${path.sep}`) ? '..' : '',
	path.join((global as any).Config?.logsdir || 'logs', 'errors.txt')
);
let lastCrashLog = 0;
let transport: any;

function appendCause(error: any) {
	let stack = ``;
	if (typeof error.cause === 'string') {
		stack += `\n\n[cause]: ${error.cause}\n`;
	} else if (error.cause && typeof error.cause === 'object') {
		const cause = error.cause as unknown as Partial<Error>;
		stack += `\n\n[cause]: ${cause.message || 'Unknown error'}\n`;
		if (cause.stack) {
			stack += `  ${cause.stack}`;
		}
	}
	return stack;
}

/**
 * Logs when a crash happens to console, then e-mails those who are configured
 * to receive them.
 */
export function crashlogger(
	error: unknown,
	description: string,
	data: AnyObject | null = null,
	emailConfig: AnyObject | null = null,
): string | null {
	const datenow = Date.now();

	let stack = '';
	if (typeof error === 'string') {
		stack = error;
	} else if (error && typeof error === 'object' && 'stack' in error) {
		stack = ((error as unknown) as Partial<Error>).stack || '';
	}

	if (error && typeof error === 'object' && 'cause' in error && (error as any).cause) {
		stack += appendCause(error as any);
	}

	if (data) {
		stack += `\n\nAdditional information:\n`;
		for (const k in data) {
			if (Object.prototype.hasOwnProperty.call(data, k)) {
				stack += `  ${k} = ${data[k]}\n`;
			}
		}
	}

	console.error(`\nCRASH: ${stack}\n`);
	try {
		const out = fs.createWriteStream(logPath, { flags: 'a' });
		out.on('open', () => {
			out.write(`\n${stack}\n`);
			out.end();
		}).on('error', (err: Error) => {
			console.error(`\nSUBCRASH: ${err.stack}\n`);
		});
	} catch (fileErr) {
		console.error(`Failed to write crash log to file: ${fileErr}`);
	}

	const emailOpts = emailConfig || (global as any).Config?.crashguardemail;
	if (emailOpts && ((datenow - lastCrashLog) > CRASH_EMAIL_THROTTLE)) {
		lastCrashLog = datenow;

		if (!transport) {
			try {
				require.resolve('nodemailer');
			} catch {
				throw new Error(
					'nodemailer is not installed, but it is required if Config.crashguardemail is configured! ' +
					'Run npm install --no-save nodemailer and restart the server.'
				);
			}
		}

		let text = `${description} crashed `;
		if (transport) {
			text += `again with this stack trace:\n${stack}`;
		} else {
			try {
				transport = require('nodemailer').createTransport(emailOpts.options);
			} catch {
				throw new Error("Failed to start nodemailer; are you sure you've configured Config.crashguardemail correctly?");
			}

			text += `with this stack trace:\n${stack}`;
		}

		transport.sendMail({
			from: emailOpts.from,
			to: emailOpts.to,
			subject: emailOpts.subject,
			text,
		}, (err: Error | null) => {
			if (err) console.error(`Error sending email: ${err}`);
		});
	}

	return null;
}
