const christs = [
	"Christos is everyone's favourite moderator."
];

const wolf = [
	"howled to the moon.",
	"ran off into a forest."
];

exports.commands = {
	dc: 'poof',
	disconnect: 'poof',
	disconnected: 'poof',
	cpoof: 'poof',
	poof: function (target, room, user) {
		if (Config.poofOff) return this.sendReply("Poof is currently disabled.");
		if (target && !this.can('broadcast')) return false;
		if (!this.canTalk(message)) return false;
		if (user.name === 'wolf') {
			var message = target || wolf[Math.floor(Math.random() * wolf.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name);

			room.addRaw(Tools.escapeHTML(message));
			user.disconnectAll();
		if (user.name === 'christs') {
			var message = target || christs[Math.floor(Math.random() * christs.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name);

			room.addRaw(Tools.escapeHTML(message));
			user.disconnectAll();
		} else {
			user.disconnectAll();
		}
	},

	poofoff: 'nopoof',
	nopoof: function () {
		if (!this.can('poofoff')) return false;
		Config.poofOff = true;
		return this.sendReply("Poof is now disabled.");
	},

	poofon: function () {
		if (!this.can('poofoff')) return false;
		Config.poofOff = false;
		return this.sendReply("Poof is now enabled.");
	}
};
