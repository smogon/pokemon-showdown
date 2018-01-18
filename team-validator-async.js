/**
 * Team Validator
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Spawns a child process to validate teams.
 *
 * @license MIT
 */

'use strict';

class ValidatorAsync {
	/**
	 * @param {string} format
	 */
	constructor(format) {
		this.format = Dex.getFormat(format);
	}

	/**
	 * @param {string} team
	 * @param {boolean} [removeNicknames]
	 */
	validateTeam(team, removeNicknames = false) {
		let formatid = this.format.id;
		if (this.format.customRules) formatid += '@@@' + this.format.customRules.join(',');
		return PM.query({formatid, removeNicknames, team});
	}
}

/*********************************************************
 * Process manager
 *********************************************************/

const QueryProcessManager = require('./lib/process-manager').QueryProcessManager;

const PM = new QueryProcessManager(module, async message => {
	let {formatid, removeNicknames, team} = message;
	let parsedTeam = Dex.fastUnpackTeam(team);

	let problems;
	try {
		problems = TeamValidator(formatid).validateTeam(parsedTeam, removeNicknames);
	} catch (err) {
		require('./lib/crashlogger')(err, 'A team validation', {
			formatid: formatid,
			team: team,
		});
		problems = [`Your team crashed the team validator. We've been automatically notified and will fix this crash, but you should use a different team for now.`];
	}

	if (problems && problems.length) {
		return '0' + problems.join('\n');
	}
	let packedTeam = Dex.packTeam(parsedTeam);
	// console.log('FROM: ' + message.substr(pipeIndex2 + 1));
	// console.log('TO: ' + packedTeam);
	return '1' + packedTeam;
});

if (!PM.isParentProcess) {
	// This is a child process!
	// @ts-ignore
	global.Config = require('./config/config');
	global.TeamValidator = require('./sim/team-validator');

	if (Config.crashguard) {
		process.on('uncaughtException', err => {
			require('./lib/crashlogger')(err, `A team validator process`, true);
		});
	}

	global.Dex = require('./sim/dex').includeData();
	global.toId = Dex.getId;
	global.Chat = require('./chat');

	require('./lib/repl').start(`team-validator-${process.pid}`, cmd => eval(cmd));
} else {
	PM.spawn(global.Config ? Config.validatorprocesses : 1);
}

/*********************************************************
 * Exports
 *********************************************************/

function getAsyncValidator(/** @type {string} */ format) {
	return new ValidatorAsync(format);
}

let TeamValidatorAsync = Object.assign(getAsyncValidator, {
	ValidatorAsync,
	PM,
});

module.exports = TeamValidatorAsync;
