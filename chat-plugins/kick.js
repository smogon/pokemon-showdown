exports.commands = {
	k: 'kick',
	kick: function (target, room, user) {
		if (!this.can('kick', targetUser, room)) return false;
		if (!this.canTalk()) return false;
		if (!target) return this.sendReply("Usage: /kick [user], [reason]");
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) return this.sendReply("User " + this.targetUsername + " not found.");
		var msg = "kicked by " + user.name + (target ? " (" + target + ")" : "") + ".";
		this.addModCommand(targetUser.name + " was " + msg);
		targetUser.popup("You have been " + msg);
		targetUser.leaveRoom(room.id);
	},
