var fs = require('fs');

function loadVips() {
	try {
		Users.vips = JSON.parse(fs.readFileSync('config/vips.json', 'utf8'));
	} catch (e) {
		Users.vips = {};
	}
}
if (!Users.vips) loadVips();

function saveVips() {
	fs.writeFileSync('config/vips.json', JSON.stringify(Users.vips));
}

exports.commands = {
	givevip: function (target, room, user) {
		if (!this.can('givevip')) return false;
		if (!target) return this.sendReply("Usage: /givevip [user]");
		if (Users.vips[toId(target)]) return this.sendReply(target + " already has vip.");
		var targetUser = Users(target);

		if (!targetUser) return this.sendReply("User \"" + target + "\" not found.");
		if (!targetUser.connected) return this.sendReply(targetUser.name + " is not online.");
		if (!targetUser.registered) return this.sendReply(targetUser.name + " is not registered.");

		Users.vips[targetUser.userid] = 1;
		targetUser.popup("You have received VIP from " + user.name);
		this.privateModCommand("(" + user.name + " has given VIP status to " + targetUser.name + ")");
		saveVips();
	},

	takevip: function (target, room, user) {
		if (!this.can('givevip')) return false;
		if (!target) return this.sendReply("Usage: /takevip [user]");
		if (!Users.vips[toId(target)]) return this.sendReply("User \"" + target + "\" does not have VIP.");

		delete Users.vips[toId(target)];
		saveVips();
		this.privateModCommand("(" + user.name + " has removed VIP status from " + target + ")");
	},
};
