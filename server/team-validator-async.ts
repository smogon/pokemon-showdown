/**
 * Team Validator
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Spawns a child process to validate teams.
 *
 * @license MIT
 */

import {crashlogger} from '../lib/crashlogger';

declare var global: any;

export class TeamValidatorAsync {
	format: Format;

	constructor(format: string) {
		this.format = Dex.getFormat(format);
	}

	validateTeam(team: string, removeNicknames: boolean = false) {
		let formatid = this.format.id;
		if (this.format.customRules) formatid += '@@@' + this.format.customRules.join(',');
		return PM.query({formatid, removeNicknames, team});
	}

	static get(format: string) {
		return new TeamValidatorAsync(format);
	}
}

export const get = TeamValidatorAsync.get;

/*********************************************************
 * Process manager
 *********************************************************/

import {QueryProcessManager} from '../lib/process-manager';

export const PM = new QueryProcessManager(module, async message => {
	const {formatid, removeNicknames, team} = message;
	const parsedTeam = Dex.fastUnpackTeam(team);

	let problems;
	try {
		problems = TeamValidator.get(formatid).validateTeam(parsedTeam, removeNicknames);
	} catch (err) {
		crashlogger(err, 'A team validation', {
			formatid,
			team,
		});
		problems = [`Your team crashed the team validator. We've been automatically notified and will fix this crash, but you should use a different team for now.`];
	}

	if (problems && problems.length) {
		return '0' + problems.join('\n');
	}
	const packedTeam = Dex.packTeam(parsedTeam);
	// console.log('FROM: ' + message.substr(pipeIndex2 + 1));
	// console.log('TO: ' + packedTeam);
	return '1' + packedTeam;
});

import {Repl} from '../lib/repl';
import {Dex as importedDex} from '../sim/dex';
import {TeamValidator} from '../sim/team-validator';
import {Chat} from './chat';
import {Config} from './config-loader';

if (!PM.isParentProcess) {
	// This is a child process!
	global.Config = Config;

	global.TeamValidator = TeamValidator;

	// @ts-ignore ???
	global.Monitor = {
		crashlog(error: Error, source: string = 'A team validator process', details: any = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			// @ts-ignore
			process.send(`THROW\n@!!@${repr}\n${error.stack}`);
		},
	};

	if (Config.crashguard) {
		process.on('uncaughtException', (err: Error) => {
			Monitor.crashlog(err, `A team validator process`);
		});
		// Typescript doesn't like this call
		// @ts-ignore
		process.on('unhandledRejection', (err: Error, promise: Promise) => {
			if (err instanceof Error) {
				Monitor.crashlog(err, 'A team validator process Promise');
			}
		});
	}

	global.Dex = importedDex.includeData();
	global.toID = Dex.getId;

	// tslint:disable-next-line: no-eval
	Repl.start(`team-validator-${process.pid}`, cmd => eval(cmd));
} else {
	PM.spawn(global.Config ? Config.validatorprocesses : 1);
}
