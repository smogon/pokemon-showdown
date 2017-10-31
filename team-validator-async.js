/**
 * Team Validator
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Spawns a child process to validate teams.
 *
 * @license MIT license
 */

'use strict';

let PM;

class ValidatorAsync {
	constructor(format) {
		this.format = Dex.getFormat(format);
	}

	validateTeam(team, removeNicknames) {
		removeNicknames = removeNicknames ? '1' : '0';
		let id = this.format.id;
		if (this.format.customRules) id += '@@@' + this.format.customRules.join(',');
		return PM.send(id, removeNicknames, team);
	}
}

/*********************************************************
 * Process manager
 *********************************************************/

const ProcessManager = require('./process-manager');

class TeamValidatorManager extends ProcessManager {
	onMessageUpstream(message) {
		// Protocol:
		// success: "[id]|1[details]"
		// failure: "[id]|0[details]"
		let pipeIndex = message.indexOf('|');
		let id = +message.substr(0, pipeIndex);

		if (this.pendingTasks.has(id)) {
			this.pendingTasks.get(id)(message.slice(pipeIndex + 1));
			this.pendingTasks.delete(id);
			this.release();
		}
	}

	onMessageDownstream(message) {
		// protocol:
		// "[id]|[format]|[removeNicknames]|[team]"
		let pipeIndex = message.indexOf('|');
		let nextPipeIndex = message.indexOf('|', pipeIndex + 1);
		let id = message.substr(0, pipeIndex);
		let format = message.substr(pipeIndex + 1, nextPipeIndex - pipeIndex - 1);

		pipeIndex = nextPipeIndex;
		nextPipeIndex = message.indexOf('|', pipeIndex + 1);
		let removeNicknames = message.substr(pipeIndex + 1, nextPipeIndex - pipeIndex - 1);
		let team = message.substr(nextPipeIndex + 1);

		process.send(id + '|' + this.receive(format, removeNicknames, team));
	}

	receive(format, removeNicknames, team) {
		let parsedTeam = Dex.fastUnpackTeam(team);
		removeNicknames = removeNicknames === '1';

		let problems;
		try {
			problems = TeamValidator(format).validateTeam(parsedTeam, removeNicknames);
		} catch (err) {
			require('./crashlogger')(err, 'A team validation', {
				format: format,
				team: team,
			});
			problems = [`Your team crashed the team validator. We've been automatically notified and will fix this crash, but you should use a different team for now.`];
		}

		if (problems && problems.length) {
			return '0' + problems.join('\n');
		} else {
			let packedTeam = Dex.packTeam(parsedTeam);
			// console.log('FROM: ' + message.substr(pipeIndex2 + 1));
			// console.log('TO: ' + packedTeam);
			return '1' + packedTeam;
		}
	}
}

/*********************************************************
 * Exports
 *********************************************************/

function getAsyncValidator(format) {
	return new ValidatorAsync(format);
}

PM = new TeamValidatorManager({
	execFile: __filename,
	maxProcesses: global.Config ? Config.validatorprocesses : 1,
	isChatBased: false,
});

let TeamValidatorAsync = Object.assign(getAsyncValidator, {
	ValidatorAsync,
	TeamValidatorManager,
	PM,
});

module.exports = TeamValidatorAsync;

if (process.send && module === process.mainModule) {
	// This is a child process!

	global.Config = require('./config/config');
	global.TeamValidator = require('./sim/team-validator');

	if (Config.crashguard) {
		process.on('uncaughtException', err => {
			require('./crashlogger')(err, `A team validator process`, true);
		});
	}

	global.Dex = require('./sim/dex').includeData();
	global.toId = Dex.getId;
	global.Chat = require('./chat');

	require('./repl').start(`team-validator-${process.pid}`, cmd => eval(cmd));

	process.on('message', message => PM.onMessageDownstream(message));
	process.on('disconnect', () => process.exit());
}
