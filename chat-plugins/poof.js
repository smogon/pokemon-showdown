const absol98sk = [
	"If you're a trainer, talk with Pokemon!!"
];

const amiy = [
	"went to find people to flop on.",
	"got swallowed whole by a Snorlax."
];

const anrindas = [
	"went back to the Dragon's Den."
];

const axtheefrost = [
	"went to aliment Wobbuffet."
];

const bidoofftw = [
	"was forced onto bed by Kingdom of Tea."
];

const ctfrm = [
	"is better than Christos."
];

const christs = [
	"is everyone's favourite moderator."
];

const darklight1999 = [
	"returns back to darkness."
];

const darkshadow6 = [
	"Never Give Up"
];

const hannumikkola = [
	"is stealing your food now."
];

const indiancharizard = [
	"was struck by Dragon Slayer Anrin's dark magic."
];

const kingdomoftea = [
	"retreats to get more tea."
];

const srinator = [
	"elfs smells too much, ima leave"
];

const wolf = [
	"howls to the moon.",
	"runs off into a forest."
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
		if (user.name.toUpperCase() === 'WOLF') {
			var message = target || wolf[Math.floor(Math.random() * wolf.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name.toUpperCase());

			room.addRaw(Tools.escapeHTML(message));
			user.leaveRoom(room);
		} else if (user.name.toUpperCase() === 'ABSOL98SK') {
			var message = target || absol98sk[Math.floor(Math.random() * absol98sk.length)];

			room.addRaw(Tools.escapeHTML(message));
			user.leaveRoom(room);
		} else if (user.name.toUpperCase() === 'AMIŧY' || user.name.toUpperCase() === 'KIMISUMI') {
			var message = target || amiy[Math.floor(Math.random() * amiy.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name.toUpperCase());

			room.addRaw(Tools.escapeHTML(message));
			user.leaveRoom(room);
		} else if (user.name.toUpperCase() === 'ANRIN DAS' || user.name.toUpperCase() === 'ANRIN N') {
			var message = target || anrindas[Math.floor(Math.random() * anrindas.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name.toUpperCase());

			room.addRaw(Tools.escapeHTML(message));
			user.leaveRoom(room);
		} else if (user.name.toUpperCase() === 'AXTHEEFROST' || user.name.toUpperCase() === 'ANDY VENUS') {
			var message = target || axtheefrost[Math.floor(Math.random() * axtheefrost.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name.toUpperCase());

			room.addRaw(Tools.escapeHTML(message));
			user.leaveRoom(room);
		} else if (user.name.toUpperCase() === 'BIDOOF FTW') {
			var message = target || bidoofftw[Math.floor(Math.random() * bidoofftw.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name.toUpperCase());

			room.addRaw(Tools.escapeHTML(message));
			user.leaveRoom(room);
		} else if (user.name.toUpperCase() === 'CаѕTFоRM') {
			var message = target || ctfrm[Math.floor(Math.random() * ctfrm.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name.toUpperCase());

			room.addRaw(Tools.escapeHTML(message));
			user.leaveRoom(room);
		} else if (user.name.toUpperCase() === 'CHRISTοS') {
			var message = target || christs[Math.floor(Math.random() * christs.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name.toUpperCase());

			room.addRaw(Tools.escapeHTML(message));
			user.leaveRoom(room);
		} else if (user.name.toUpperCase() === 'DARK LIGHT1999') {
			var message = target || darklight1999[Math.floor(Math.random() * darklight1999.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name.toUpperCase());

			room.addRaw(Tools.escapeHTML(message));
			user.leaveRoom(room);
		} else if (user.name.toUpperCase() === 'DARK SHADOW 6') {
			var message = target || darkshadow6[Math.floor(Math.random() * darkshadow6.length)];

			room.addRaw(Tools.escapeHTML(message));
			user.leaveRoom(room);
		} else if (user.name.toUpperCase() === 'HANNU MIKKOLA') {
			var message = target || hannumikkola[Math.floor(Math.random() * hannumikkola.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name.toUpperCase());

			room.addRaw(Tools.escapeHTML(message));
			user.leaveRoom(room);
		} else if (user.name.toUpperCase() === 'INDIANCHARIZARD#' || user.name.toUpperCase() === 'ASTRAEA') {
			var message = target || indiancharizard[Math.floor(Math.random() * indiancharizard.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name.toUpperCase());

			room.addRaw(Tools.escapeHTML(message));
			user.leaveRoom(room);
		} else if (user.name.toUpperCase() === 'KINGDOM OF TEA') {
			var message = target || kingdomoftea[Math.floor(Math.random() * kingdomoftea.length)];
			if (message.indexOf('{{user}}') < 0)
				message = '{{user}} ' + message;
			message = message.replace(/{{user}}/g, user.name.toUpperCase());

			room.addRaw(Tools.escapeHTML(message));
			user.leaveRoom(room);
		} else if (user.name.toUpperCase() === 'SRINATOR') {
			var message = target || srinator[Math.floor(Math.random() * srinator.length)];

			room.addRaw(Tools.escapeHTML(message));
			user.leaveRoom(room);
		} else {
			user.leaveRoom(room);
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
