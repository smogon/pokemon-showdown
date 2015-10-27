lick: 'lick',
	l: 'lick',
	lick: function (target, room, user) {

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) return this.errorReply("User '" + this.targetUsername + "' does not exist.");
		if (!(targetUser in room.users)) {
			return this.errorReply("User " + this.targetUsername + " is not in the room " + room.id + ".");
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('lick', targetUser, room)) return false;

		this.addModCommand("" + targetUser.name + " was licked by " + user.name + "." + (target ? " (" + target + ")" : ""));
		targetUser.send('|c|~|/lick ' + target);
		this.add('|unlink|' + this.getLastIdOf(targetUser));
	},
