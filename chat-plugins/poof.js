/* Poof chat-plugin
 * A script that handles the poof command
 * by: kota
 */

const messages = [
	"ventured into Shrek's Swamp.",
	"disrespected the OgreLord!",
	"used Explosion!",
	"was swallowed up by the Earth!",
	"was eaten by Lex!",
	"was sucker punched by Absol!",
	"has left the building.",
	"got lost in the woods!",
	"left for their lover!",
	"couldn't handle the coldness of Frost!",
	"was hit by Magikarp's Revenge!",
	"was sucked into a whirlpool!",
	"got scared and left the server!",
	"went into a cave without a repel!",
	"got eaten by a bunch of piranhas!",
	"ventured too deep into the forest without an escape rope",
	"got shrekt",
	"woke up an angry Snorlax!",
	"was forced to give jd an oil massage!",
	"was used as shark bait!",
	"peered through the hole on Shedinja's back",
	"received judgment from the almighty Arceus!",
	"used Final Gambit and missed!",
	"went into grass without any Pokemon!",
	"made a Slowbro angry!",
	"took a focus punch from Breloom!",
	"got lost in the illusion of reality.",
	"ate a bomb!",
	"left for a timeout!",
	"fell into a snake pit!",
];

exports.commands = {
	d: 'poof',
	cpoof: 'poof',
	poof: function (target, room, user) {
		if (Config.poofOff) return this.sendReply("Poof is currently disabled.");
		if (target && !this.can('broadcast')) return false;
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.sendReply("You cannot do this while unable to talk.");
		if (room.id !== 'lobby') return false;
		var message = target || messages[Math.floor(Math.random() * messages.length)];
		if (message.indexOf('{{user}}') < 0) message = '{{user}} ' + message;
		message = message.replace(/{{user}}/g, user.name);
		if (!this.canTalk(message)) return false;

		var colour = '#' + [1, 1, 1].map(function () {
			var part = Math.floor(Math.random() * 0xaa);
			return (part < 0x10 ? '0' : '') + part.toString(16);
		}).join('');

		room.addRaw('<center><strong><font color="' + colour + '">~~ ' + Tools.escapeHTML(message) + ' ~~</font></strong></center>');
		//user.lastPoof = Date.now();
		//user.lastPoofMessage = message;
		user.disconnectAll();
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
