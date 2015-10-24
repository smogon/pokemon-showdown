exports.commands = {
	cc: 'customcolour',
	customcolour: function (target, room) {
		var targets = target.split(',');
		if (targets.length < 2) return this.sendReply("/customcolour OR /cc [colour], [message] - Outputs a message in a custom colour. Requires: " + Users.getGroupsThatCan('customcolour', room).join(" "));
		if (!this.can('customcolour', room) || !this.canBroadcast('!cc')) return false;

		this.sendReply('|raw|<font color="' + targets[0].toLowerCase().replace(/[^#a-z0-9]+/g, '') + '">' + Tools.escapeHTML(targets.slice(1).join(",")) + '</font>');
	}
};
