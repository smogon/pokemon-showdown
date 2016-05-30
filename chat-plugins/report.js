/*****************
* Reports Plugin *
* Credits: jd    *
*****************/
'use strict';

const fs = require('fs');
const moment = require('moment');

let Reports = {};
function loadReports() {
	try {
		Reports = JSON.parse(fs.readFileSync('config/reports.json'));
	} catch (e) {
		Reports = {};
	}
}
loadReports();

function saveReports() {
	fs.writeFile('config/reports.json', JSON.stringify(Reports));
}

exports.commands = {
	complain: 'requesthelp',
	bitch: 'requesthelp',
	report: 'requesthelp',
	requesthelp: function (target, room, user) {
		if (user.can('pban')) return this.parse('/reports ' + (target || ''));
		if (!this.canTalk()) return this.errorReply("You can't use this command while unable to speak.");
		if (!target) return this.errorReply("Usage: /requesthelp [message] - Requests help from Senior Staff. Please remember to include as much detail as possible with your request.");
		if (target.length < 1) return this.errorReply("Usage: /requesthelp [message] - Requests help from Senior Staff. Please remember to include as much detail as possible with your request.");

		let reportId = (Object.keys(Reports).length + 1);
		while (Reports[reportId]) reportId--;
		Reports[reportId] = {};
		Reports[reportId].reporter = user.name;
		Reports[reportId].message = target.trim();
		Reports[reportId].id = reportId;
		Reports[reportId].status = 'Pending Staff';
		Reports[reportId].reportTime = moment().format('MMMM Do YYYY, h:mm A') + " EST";
		saveReports();
		Wisp.messageSeniorStaff('A new report has been submitted by ' + user.name + '. ID: ' + reportId + ' Message: ' + target.trim());
		Rooms('upperstaff').add('A new report has been submitted by ' + user.name + '. ID: ' + reportId + ' Message: ' + target.trim());
		Rooms('upperstaff').update();
		return this.sendReply("Your report has been sent to Senior Staff.");
	},

	reports: function (target, room, user, connection) {
		if (!user.can('pban')) return this.errorReply('/reports - Access denied.');
		if (!target) target = '';
		target = target.trim();

		let cmdParts = target.split(' ');
		let cmd = cmdParts.shift().trim().toLowerCase();
		let params = cmdParts.join(' ').split(',').map(function (param) { return param.trim(); });
		switch (cmd) {
		case '':
		case 'view':
			if (!this.runBroadcast()) return;
			if (Object.keys(Reports).length < 1) return this.sendReplyBox("There's currently no reports.");
			let output = '|raw|<table border="1" cellspacing ="0" cellpadding="3"><tr><th>ID</th><th>Reporter</th><th>Message</th><th>Report Time</th><th>Status</th></tr>';
			for (let u in Object.keys(Reports)) {
				let currentReport = Reports[Object.keys(Reports)[u]];
				let date = currentReport.reportTime;
				output += '<tr><td>' + currentReport.id + '</td><td>' + Tools.escapeHTML(currentReport.reporter) + '</td><td>' +
					Tools.escapeHTML(currentReport.message) + '</td><td>' + date + ' </td><td>' + (currentReport.status === 'Pending Staff' ? '<font color=blue>Pending Staff</font>' : (~currentReport.status.indexOf('Accepted by') ? '<font color=green>' + Tools.escapeHTML(currentReport.status) + '</font>' : Tools.escapeHTML(currentReport.status))) + '</td></tr>';
			}
			this.sendReply(output);
			break;
		case 'accept':
			if (params.length < 1) return this.errorReply("Usage: /reports accept [id]");
			let id = params.shift();
			if (!Reports[id]) return this.errorReply("There's no report with that id.");
			if (Reports[id].status !== 'Pending Staff') return this.errorReply("That report isn't pending staff.");
			Reports[id].status = "Accepted by " + user.name;
			saveReports();
			if (Users(Reports[id].reporter) && Users(Reports[id].reporter).connected) {
				Users(Reports[id].reporter).popup("Your report has been accepted by " + user.name);
			}
			this.sendReply("You've accepted the report by " + Reports[id].reporter);
			Wisp.messageSeniorStaff(user.name + " accepted the report by " + Reports[id].reporter + ". (ID: " + id + ")");
			Rooms('upperstaff').add(user.name + " accepted the report by " + Reports[id].reporter + ". (ID: " + id + ")");
			Rooms('upperstaff').update();
			break;
		case 'decline':
		case 'deny':
			if (params.length < 1) return this.errorReply("Usage: /reports deny [id]");
			let reportid = params.shift();
			if (!Reports[reportid]) return this.errorReply("There's no report with that id.");
			if (Reports[reportid].status !== 'Pending Staff') return this.errorReply("That report isn't pending staff.");
			if (Users(Reports[reportid].reporter) && Users(Reports[reportid].reporter).connected) {
				Users(Reports[reportid].reporter).popup("|modal|" + "Your report has been denied by " + user.name);
			}
			this.sendReply("You've denied the report by " + Reports[reportid].reporter);
			Wisp.messageSeniorStaff(user.name + " denied the report by " + Reports[reportid].reporter + ". (ID: " + reportid + ")");
			Rooms('upperstaff').add(user.name + " denied the report by " + Reports[reportid].reporter + ". (ID: " + reportid + ")");
			Rooms('upperstaff').update();
			delete Reports[reportid];
			saveReports();
			break;
		case 'del':
		case 'delete':
			if (params.length < 1) return this.errorReply("Usage: /reports delete [id]");
			let rid = params.shift();
			if (!Reports[rid]) return this.errorReply("There's no report with that id.");
			Wisp.messageSeniorStaff(user.name + " deleted the report by " + Reports[rid].reporter + ". (ID: " + rid + ")");
			Rooms('upperstaff').add(user.name + " deleted the report by " + Reports[rid].reporter + ". (ID: " + rid + ")");
			Rooms('upperstaff').update();
			delete Reports[rid];
			saveReports();
			this.sendReply("That report has been deleted.");
			break;
		case 'help':
			if (!this.runBroadcast()) return;
			this.sendReplyBox("Report commands: <br />" +
				"/report [message] - Adds a report to the system<br />" +
				"/reports view - Views all current reports<br />" +
				"/reports accept [id] - Accepts a report<br />" +
				"/reports delete [id] - Deletes a report<br />" +
				"/reports deny [id] - Denies a report"
			);
			break;
		default:
			this.sendReply("/reports " + target + " - Command not found.");
		}
	},
};
