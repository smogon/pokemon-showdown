'use strict';
/**********************
 * Badges by a weeb for weebs *
 **********************/

function badgeImg(link, name) {
	return '<img src="' + link + '" height="16" width="16" alt="' + name + '" title="' + name + '" >';
}

exports.commands = {
	badge: 'badges',
	badges: function (target, room, user) {
		let parts = target.split(',');
		let cmd = parts[0].trim().toLowerCase();
		let userid, targetUser;
		let selectedBadge;
		let userBadges;
		let output = '';
		switch (cmd) {
		case 'set':
			if (!this.can('lock')) return false;
			if (parts.length !== 3) return this.errorReply("Correct command: `/badges set, user, badgeName`");
			userid = toId(parts[1].trim());
			targetUser = Users.getExact(userid);
			userBadges = Db('userBadges').get(userid);
			selectedBadge = parts[2].trim();
			if (!Db('badgeData').has(selectedBadge)) return this.errorReply("This badge does not exist, please check /badges list");
			if (!Db('userBadges').has(userid)) userBadges = [];
			userBadges = userBadges.filter(b => b !== selectedBadge);
			userBadges.push(selectedBadge);
			Db('userBadges').set(toId(userid), userBadges);
			if (Users.get(targetUser)) Users.get(userid).popup('|modal||html|<font color="red"><strong>ATTENTION!</strong></font><br /> You have received a badge from <b><font color="' + Wisp.hashColor(toId(user)) + '">' + Tools.escapeHTML(user.name) + '</font></b>: <img src="' + Db('badgeData').get(selectedBadge)[1] + '" width="16" height="16">');
			this.logModCommand(user.name + " gave the badge '" + selectedBadge + "' badge to " + userid + ".");
			this.sendReply("The '" + selectedBadge + "' badge was given to '" + userid + "'.");
			break;
		case 'create':
			if (!this.can('ban')) return false;
			if (parts.length !== 4) return this.errorReply("Correct command: `/badges create, badge name, description, image`.");
			let badgeName = Tools.escapeHTML(parts[1].trim());
			let description = Tools.escapeHTML(parts[2].trim());
			let img = parts[3].trim();
			if (Db('badgeData').has(badgeName)) return this.errorReply('This badge already exists.');
			Db('badgeData').set(badgeName, [description, img]);
			this.logModCommand(user.name + " created the badge '" + badgeName + ".");
			this.sendReply("The badge '" + badgeName + "' was successfully created.");
			break;
		case 'list':
			if (!this.runBroadcast()) return;
			output = '<table> <tr>';
			Object.keys(Db('badgeData').object()).forEach((badge) => {
				let badgeData = Db('badgeData').get(badge);
				output += '<td>' + badgeImg(badgeData[1], badge) + '</td> <td>' + badge + '</td> <td>' + badgeData[0] + '</td>';
			});
			output += '</tr> <table>';
			this.sendReplyBox(output);
			break;
		case 'info':
			if (!this.runBroadcast()) return;
			if (!parts[1]) return this.errorReply("Invalid command. Valid commands are `/badges list`, `/badges info, badgeName`, `/badges set, user, badgeName` and `/badges take, user, badgeName`.");
			selectedBadge = parts[1].trim();
			if (!Db('badgeData').has(selectedBadge)) return this.errorReply("This badge does not exist, please check /badges list");
			let badgeData = Db('badgeData').get(selectedBadge);
			this.sendReplyBox(badgeImg(badgeData[1], selectedBadge) + selectedBadge + ': ' + badgeData[0]);
			break;
		case 'take':
			if (!this.can('lock')) return false;
			if (parts.length !== 3) return this.errorReply("Correct command: `/badges take, user, badgeName`");
			userid = toId(parts[1].trim());
			if (!Db('userBadges').has(userid)) return this.errorReply("This user doesn't have any badges.");
			userBadges = Db('userBadges').get(userid);
			selectedBadge = parts[2].trim();
			if (Db('badgeData').has(userid)) return this.errorReply('This badge already exists.');
			userBadges = userBadges.filter(b => b !== selectedBadge);
			Db('userBadges').set(toId(userid), userBadges);
			this.logModCommand(user.name + " took the badge '" + selectedBadge + "' badge from " + userid + ".");
			this.sendReply("The '" + selectedBadge + "' badge was taken from '" + userid + "'.");
			break;
		default:
			return this.errorReply("Invalid command. Valid commands are `/badges list`, `/badges info, badgeName`, `/badges set, user, badgeName` and `/badges take, user, badgeName`" +
			 "`/badges create, name, description, img`.");
		}
	},
	badgeshelp: ["Valid commands are `/badges list`, `/badges info, badgeName`, `/badges set, user, badgeName` and `/badges take, user, badgeName`."],
};
