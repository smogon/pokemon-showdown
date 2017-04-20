/*****************
* Reports Plugin *
* Credits: jd    *
*****************/

'use strict';

let fs = require('fs');
let moment = require('moment');

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
	report: 'requesthelp',
	requesthelp: function (target, room, user) {
		if (user.can('lock')) return this.parse('/reports ' + (target || ''));
		if (!this.canTalk()) return this.errorReply("You can't use this command while unable to speak.");
		if (!target) return this.sendReply("/requesthelp [message] - Requests help from SpacialGaze global authorities. Please be specific in your situation.");
		if (target.length < 1) return this.sendReply("/requesthelp [message] - Requests help from SpacialGaze global authorities. Please be specific in your situation.");

		let reportId = (Object.keys(Reports).length + 1);
        	console.log(reportId);
		while (Reports[reportId]) reportId--;
		Reports[reportId] = new Object();
		Reports[reportId].reporter = user.name;
		Reports[reportId].message = target.trim();
		Reports[reportId].id = reportId;
		Reports[reportId].status = 'Pending';
		Reports[reportId].reportTime = moment().format('MMMM Do YYYY, h:mm A') + " EST";
		saveReports();
		Rooms('staff').add('A new report has been submitted by ' + user.name + '. ID: ' + reportId + ' Message: ' + target.trim());
		Rooms('staff').update();
		return this.sendReply("Your report has been sent to SpacialGaze global authorities..");
	},

	reports: function (target, room, user, connection, cmd) {
		if (!user.can('lock')) return this.errorReply('/reports - Access denied.');
		if (!target) target = '';
		target = target.trim();

		let id;
		let cmdParts = target.split(' ');
		cmd = cmdParts.shift().trim().toLowerCase();
		let params = cmdParts.join(' ').split(',').map(function (param) { return param.trim(); });
		switch (cmd) {
			case '':
			case 'view':
				if (!this.runBroadcast()) return;
				let output = '|raw|<table border="1" cellspacing ="0" cellpadding="3"><tr><th>ID</th><th>Reporter</th><th>Message</th><th>Report Time</th><th>Status</th></tr>';
				for (let u in Object.keys(Reports)) {
					let currentReport = Reports[Object.keys(Reports)[u]];
					let date = currentReport.reportTime;
					output += '<tr><td>' + currentReport.id + '</td><td>' + Chat.escapeHTML(currentReport.reporter) + '</td><td>' +
						Chat.escapeHTML(currentReport.message) + '</td><td>' + date + ' </td><td>' + (currentReport.status === 'Pending' ? '<font color=#ff9900>Pending</font>' : (~currentReport.status.indexOf('Accepted by') ? '<font color=green>' + Chat.escapeHTML(currentReport.status) + '</font>' : Chat.escapeHTML(currentReport.status))) + '</td></tr>';
				}
				this.sendReply(output);
				break;
			case 'accept':
				if (params.length < 1) return this.errorReply("Usage: /reports accept [id]");
				id = params.shift();
				if (!Reports[id]) return this.errorReply("There's no report with that id.");
				if (Reports[id].status !== 'Pending') return this.errorReply("That report isn't pending staff.");
				Reports[id].status = "Accepted by " + user.name;
				saveReports();
				if (Users(Reports[id].reporter) && Users(Reports[id].reporter).connected) {
					Users(Reports[id].reporter).popup("Your report has been accepted by " + user.name);
				}
				this.sendReply("You've accepted the report by "+ Reports[id].reporter);
				Rooms('staff').add(user.name + " accepted the report by " + Reports[id].reporter + ". (ID: " + id + ")");
				Rooms('staff').update();
				break;
			case 'decline':
			case 'deny':
				if (params.length < 1) return this.errorReply("Usage: /reports deny [id]");
				id = params.shift();
				if (!Reports[id]) return this.errorReply("There's no report with that id.");
				if (Reports[id].status !== 'Pending') return this.errorReply("That report isn't pending staff.");
				if (Users(Reports[id].reporter) && Users(Reports[id].reporter).connected) {
					Users(Reports[id].reporter).popup("|modal|" + "Your report has been denied by " + user.name);
				}
				this.sendReply("You've denied the report by "+Reports[id].reporter);
				Rooms('staff').add(user.name + " denied the report by " + Reports[id].reporter + ". (ID: " + id + ")");
				Rooms('staff').update();
				delete Reports[id];
				saveReports();
				break;
			case 'del':
			case 'delete':
				if (params.length < 1) return this.errorReply("Usage: /reports delete [id]");
				id = params.shift();
				if (!Reports[id]) return this.errorReply("There's no report with that id.");
				Rooms('staff').add(user.name + " deleted the report by " + Reports[id].reporter + ". (ID: " + id + ")");
				Rooms('staff').update();
				delete Reports[id];
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
	}
};
