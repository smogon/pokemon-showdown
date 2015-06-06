const messages = [
	"has vanished into nothingness!",
	"visited kupo's bedroom and never returned!",
	"used Explosion!",
	"was terrified of Kupo",
	"was squished by pandaw's large behind!",
	"stole Kupo's Pompom",
	"became kupo's love slave!",
	"has left the building.",
	"felt Thundurus's wrath!",
	"died of a broken heart.",
	"got lost in a maze!",
	"was hit by Magikarp's Revenge!",
	"was sucked into a whirlpool!",
	"got scared and left the server!",
	"fell off a cliff!",
	"got eaten by a bunch of piranhas!",
	"is blasting off again!",
	"A large spider descended from the sky and picked up {{user}}.",
	"tried to touch RisingPokeStar!",
	"rebelled for more poofs",
	"fell into a meerkat hole!",
	"took an arrow to the knee... and then one to the face.",
	"peered through the hole on Shedinja's back",
	"recieved judgment from the almighty Arceus!",
	"used Final Gambit and missed!",
	"pissed off a Gyarados!",
	"screamed \"BSHAX IMO\"!",
	"was never there to begin with",
	"got lost in the illusion of reality.",
	"was unfortunate and didn't get a cool message.",
	"went to fap",
	"was shouted at",
	"was kicked from server! (lel clause)",
	"was Pan Hammered!",
	"lost Wifi",
	"joined the Hunger Games",
	"let it Go",
	"was takin' blows and left",
	"was bullet punched by Sciz",
	"quit life",
	"lost a nuzlocke!",
	"is flying off again!",
	"has too much water.",
	"joined Finnism",
	"dun goofed",
	"did a shout out to {{user}}",
	"got 6-0'd"
];

exports.commands = {
	d: 'poof',
	cpoof: 'poof',
	poof: function (target, room, user) {
		if (Config.poofOff) return this.sendReply("Poof is currently disabled.");
		if (target && !this.can('broadcast')) return false;
		if (room.id !== 'lobby') return false;
		var message = target || messages[Math.floor(Math.random() * messages.length)];
		if (message.indexOf('{{user}}') < 0)
			message = '{{user}} ' + message;
		message = message.replace(/{{user}}/g, user.name);
		if (!this.canTalk(message)) return false;

		var colour = '#' + [1, 1, 1].map(function () {
			var part = Math.floor(Math.random() * 0xaa);
			return (part < 0x10 ? '0' : '') + part.toString(16);
		}).join('');

		room.addRaw('<center><strong><font color="' + colour + '">~~ ' + Tools.escapeHTML(message) + ' ~~</font></strong></center>');
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
