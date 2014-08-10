/**
* The Happy Place: Quote of the Day Plugin
* This is a command that allows a room owner to set an inspirational "quote" of the day.
* Others may braodcast this at any time to remind the room of such.
* Only works in a room with the id "thehappyplace"
* Credits: panpawn, TalkTakesTime, Morfent, and sirDonovan
*/

var quote = "";

exports.commands = {
	quoteoftheday: 'qotd',
	qotd: function (target, room, user) {
		if (room.id !== 'thehappyplace') return this.sendReply("This command can only be used in The Happy Place.");
		if (!this.canBroadcast()) return;
		if (!target) {
			if (!quote) return this.sendReplyBox("The Quote of the Day has not been set.");
			return this.sendReplyBox("The current <strong>'Inspirational Quote of the Day'</strong> is:<br />" + quote);
		}
		if (!this.can('declare', null, room)) return false;
		if (target === 'off' || target === 'disable' || target === 'reset') {
			if (!quote) return this.sendReply("The Quote of the Day has already been reset.");
			quote = "";
			this.sendReply("The Quote of the Day was reset by " + Tools.escapeHTML(user.name) + ".");
			this.logModCommand(user.name + " has reset the Quote of the Day.");
			return;
		}
		quote = Tools.escapeHTML(target);
		room.addRaw(
			'<div class="broadcast-green">' +
				"<p><strong>The 'Inspirational Quote of the Day' has been updated by " + Tools.escapeHTML(user.name) + ".</strong></p>" +
				"<p>Quote: " + quote + '</p>' +
			'</div>'
		);
		this.logModCommand(Tools.escapeHTML(user.name) + " has updated the quote of the day to: " + quote);
	}
};
