/**
* The Happy Place: Quote of the Day Plugin
* This is a command that allows a room owner to set an inspirational "quote" of the day.
* Others may broadcast this at any time to remind the room of such.
* Only works in a room with the id "thehappyplace"
* Credits: panpawn, TalkTakesTime, Morfent, and sirDonovan
*/

'use strict';

exports.commands = {
	quoteoftheday: 'qotd',
	qotd: function (target, room, user) {
		if (room.id !== 'thehappyplace') return this.errorReply(`This command can only be used in The Happy Place.`);
		if (!room.chatRoomData) return;
		if (!target) {
			if (!this.runBroadcast()) return;
			if (!room.chatRoomData.quote) return this.sendReplyBox(`The Quote of the Day has not been set.`);
			const quote = (typeof room.quote === 'object' ? `"${room.quote.quote}" - ${room.quote.author}` : `${room.quote}`);
			return this.sendReplyBox(
				`The current <strong>Inspirational Quote of the Day</strong> is:<br />` +
				quote
			);
		}
		if (!this.can('mute', null, room)) return;
		if (this.meansNo(target) || target === 'reset') {
			if (!room.chatRoomData.quote) return this.sendReply(`The Quote of the Day has already been reset.`);
			delete room.chatRoomData.quote;
			this.sendReply(Chat.html`The Quote of the Day was reset by ${user.name}.`);
			this.modlog('QOTD', null, 'RESET');
			Rooms.global.writeChatRoomData();
			return;
		}
		const quote = target.split('|')[0].replace('"', '');
		const author = target.split('|')[1];
		if (!quote) return;
		if (!author) {
			this.errorReply(`You have to specify the author of this quote.`);
			this.parse(`/help qotd`);
			return;
		}
		room.quote = {quote: Chat.escapeHTML(quote.trim()), author: Chat.escapeHTML(author.trim())};
		room.chatRoomData.quote = room.quote;
		Rooms.global.writeChatRoomData();
		room.addRaw(
			Chat.html`<div class="broadcast-blue"><strong>The Inspirational Quote of the Day has been updated by ${user.name}.</strong><br />` +
			Chat.html`Quote: "${quote}" - ${author}`
		);
		this.modlog('QOTD', null, `to "${quote}" - ${author}`);
	},
	quoteofthedayhelp: 'qotdhelp',
	qotdhelp: [
		`/qotd - View the current Inspirational Quote of the Day.`,
		`/qotd [quote] | [author] - Set the Inspirational Quote of the Day. Requires: % @ # & ~`,
	],
};
