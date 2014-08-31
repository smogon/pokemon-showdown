exports.commands = {
	hide: 'hideauth',
	hideauth: function (target, room, user) {
		if (!this.can('hideauth')) return false;
		target = target || Config.groups.default.global;
		if (!Config.groups.global[target]) {
			target = Config.groups.default.global;
			this.sendReply("You have picked an invalid group, defaulting to '" + target + "'.");
		} else if (Config.groups.bySymbol[target].globalRank >= Config.groups.bySymbol[user.group].globalRank)
			return this.sendReply("The group you have chosen is either your current group OR one of higher rank. You cannot hide like that.");

		user.getIdentity = function (roomid) {
			var identity = Object.getPrototypeOf(this).getIdentity.call(this, roomid);
			if (identity[0] === this.group)
				return target + identity.slice(1);
			return identity;
		};
		user.updateIdentity();
		return this.sendReply("You are now hiding your auth as '" + target + "'.");
	},

	show: 'showauth',
	showauth: function (target, room, user) {
		if (!this.can('hideauth')) return false;
		delete user.getIdentity;
		user.updateIdentity();
		return this.sendReply("You are now showing your authority!");
	}
};
