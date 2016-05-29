/*
 * Chat log viewer plugin by jd
 */
'use strict';

const fs = require('fs');

exports.commands = {
	viewlogs: function (target, room, user) {
		if (!target) return this.sendReply("Usage: /viewlogs [room], [year-month-day / 2014-12-08] - Provides you with a temporary link to view the target rooms chat logs.");
		let targetSplit = target.split(',');
		if (!targetSplit[1]) return this.sendReply("Usage: /viewlogs [room], [year-month-day / 2014-12-08] -Provides you with a temporary link to view the target rooms chat logs.");
		for (let u in targetSplit) targetSplit[u] = targetSplit[u].trim();
		let targetRoom = targetSplit[0];
		if (!user.can('lock') && !user.can('warn', null, Rooms(targetRoom))) return this.errorReply("/viewlogs - Access denied.");
		if (toId(targetRoom) === 'staff' && !user.can('warn')) return this.errorReply("/viewlogs - Access denied.");
		if (toId(targetRoom) === 'administrators' && !user.can('hotpatch')) return this.errorReply("/viewlogs - Access denied.");
		if (toId(targetRoom) === 'upperstaff' && !user.can('pban')) return this.errorReply("/viewlogs - Access denied.");
		if (Rooms(targetRoom) && Rooms(targetRoom).isPrivate && !user.can('pban')) {
			if (Rooms(targetRoom) && Rooms(targetRoom).isPrivate && !user.can('warn', null, Rooms(targetRoom))) return this.errorReply("/viewlogs - Access denied.");
		}
		let date;
		if (toId(targetSplit[1]) === 'today' || toId(targetSplit[1]) === 'yesterday') {
			date = new Date();
			if (toId(targetSplit[1]) === 'yesterday') date.setDate(date.getDate() - 1);
			date = date.toLocaleDateString('en-US', {
				day : 'numeric',
				month : 'numeric',
				year : 'numeric',
			}).split('/').reverse();
			if (date[1] < 10) date[1] = "0" + date[1];
			if (date[2] < 10) date[2] = "0" + date[2];
			targetSplit[1] = date[0] + '-' + date[2] + '-' + date[1];
		}
		date = targetSplit[1];
		let splitDate = date.split('-');
		if (splitDate.length < 3) return this.sendReply("Usage: /viewlogs [room], [year-month-day / 2014-12-08] -Provides you with a temporary link to view the target rooms chat logs.");

		fs.readFile('logs/chat/' + toId(targetRoom) + '/' + splitDate[0] + '-' + splitDate[1] + '/' + date + '.txt', 'utf8', (err, data) => {
			if (err) return this.errorReply("/viewlogs - Error: " + err);
			let filename = require('crypto').randomBytes(4).toString('hex');

			if (!user.can('warn', null, Rooms(targetRoom))) {
				let lines = data.split('\n');
				for (let line in lines) {
					if (lines[line].substr(9).trim().charAt(0) === '(') lines.slice(line, 1);
				}
				data = lines.join('\n');
			}

			data = targetRoom + "|" + date + "|" + JSON.stringify(Wisp.customColors) + "\n" + data;

			fs.writeFile('static/logs/' + filename, data, err => {
				if (err) return this.errorReply("/viewlogs - " + err);
				this.sendReply(
					"|raw|You can view the logs at <a href=\"http://158.69.196.64:" + Config.port +
					"/logs/logviewer.html?file=" + filename + "\">http://158.69.196.64:" + Config.port +
					"/logs/logviewer.html?file=" + filename + "</a>"
				);
				setTimeout(function () {
					fs.unlink('static/logs/' + filename);
				}, 1 * 1000 * 60);
			});
		});
	},
};
