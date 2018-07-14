/**
 * Help Room AI
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Users often times will ask the same questions in the Help room,
 * which is why having their questions first ask an AI can be very
 * helpful.  If the AI does not know the answer, their question will
 * still be sent to the room.
 *
 * @license MIT license
 */

/**
 * Questions to add:
 * where's my treams?
 */

'use strict';

const OTHER_ADMIN_REQUESTS = 'http://www.smogon.com/forums/forums/other-admin-requests.346/';
const PS_GUIDE = 'http://www.smogon.com/sim/ps_guide';
const STAFF_FAQ = 'http://www.smogon.com/forums/threads/pok%C3%A9mon-showdown-forum-rules-resources-read-here-first.3570628/#post-6774482';
const APPEALS = 'http://www.smogon.com/forums/threads/discipline-appeal-rules.3583479/';

class HelpAI {
	constructor() {
		this.question = '';
	}
	ask(question, command, room) {
		this.question = question.toLowerCase(); // people yelling at the AI isn't very nice :(
		const tarRoom = (room && room.id === 'help' ? 'this room' : '<a href="/help">the Help room</a>'); // assume the command would only be used if outside Help
		const roomLink = (this.question.includes('<<') && this.question.includes('>>'));
		if ((this.includes('forgot') || this.includes('reset')) && (this.includes('pw') || this.includes('pass') || this.includes('login'))) {
			return `To get your password reset, PM a moderator (@) in ${tarRoom} - they can help walk you thru the process.  If no staff are online to help, you can submit a thread in the ${this.otherAdminRequests('Other Admin Requests Forum.')} Please be prepared to verify some questions regarding your account relating to when and where it was registered.`;
		} else if ((this.includes('staff') || this.includes('mod') || this.includes('room owner')) && (this.includes('abusing') || this.includes('abuse'))) {
			return `If you feel as though a <strong>room staff</strong> member has abused their authority, you can PM a Room Owner (#) from that room. Do <code>/roomauth [roomname]</code> to see if any are currently online (bolded on the list.) If it was a Room Owner that abused you, you can PM a Moderator (@) in ${tarRoom} with your claim and evidence.<br />` +
				`If you feel as though a <strong>global staff</strong> member (moderator, driver) has abused their authority, you can submit a thread in the ${this.otherAdminRequests('Other Admin Requests Forum.')} Please be thorough in your report, explaining clearly what the problem is, how it happened, who it was with and providing as much proof as you currently have available of any wrongdoings. Be assured that ONLY Pok\u00e9mon Showdown Senior Staff are able to view the post in that forum, and confidentially will be assured. Complaints are taken very seriously, and any false reports will be dealt with harshly.`;
		} else if (this.includes('hacking') || this.includes('cheating')) {
			return `Your opponent is probably not hacking/cheating. We get a lot of reports like this, and the answer is usually that you are mistaken about a game mechanic. Use the <code>/data</code> command to look up the opponent's Pok\u00e9mon, moves and abilities and consider that it might be a Zoroark with the ability Illusion, rather than the Pok\u00e9mon you are seeing.`;
		} else if (this.includes('endless battle')) {
			return `This means they are running a Pok\u00e9mon with a special set that literally never lets you end the battle without forfeiting. Not even by pressing moves until your pp run out and your Pok\u00e9mon faints to struggle damage. For example, Heal Pulse / Recover / Block / Recycle was used with a Leppa Berry for a while, before it was banned by the endless battle clause.<br />` +
				`After enough turns have passed, endless battle clause should detect that both Pok\u00e9mon are in an endless loop and end the battle in a tie. No moderator intervention is required, however you may contact one if you think there might be a bug.`;
		} else if (this.includes('timer stalling')) {
			return `Timer stalling refers to always waiting until the last few seconds to make a move in battle, to annoy the opponent. If you are certain your opponent is timer stalling, PM a Moderator (@) in the Help room.`;
		} else if (this.includes('spam') && this.includes('battle')) {
			return `If someone in your battle is spamming the chat, you can PM a Moderator (@) in ${tarRoom} to handle it.`;
		} else if (this.includes('autoconfirmed') || (this.includes('cant') || this.includes('can\'t') || this.includes('cannot') || this.includes('able to')) && (this.includes('talk') || this.includes('chat'))) {
			return `If you cannot talk in a room, then it is possible that room has moderated chat set to autoconfirmed - they do this to try and keep spammers out of the chat. To get your account autoconfirmed, you need to have registered your account (click the gear to the upper right -> "Register") for 7 days and win at least one ladder match. You can also try to ask a Moderator (@) in that room if they are willing to turn moderated chat off.`;
		} else if (this.includes('harass')) { // "harass" gets "harassed" and "harassment"
			return `If you are being harassed by another user, you can type <code>/ignore [username]</code> to block their messages. If the harassment is more severe, or <code>/ignore</code> is not working for you, you can PM a Moderator (@) in ${tarRoom} to report the harassment. Please include screenshots of the harassment in your report. If you don't know how to take a screenshot, you can <a href="https://snag.gy/">use Snaggy</a>.`;
		} else if (this.includes('report') && (this.includes('user') || this.includes('some') || this.includes('go to'))) {
			return `To report another user, you can PM a Moderator (@) in ${tarRoom}. PM them with evidence and an explaination of your report.`;
		} else if (this.includes('new here') || this.includes('learn') || this.includes('commands')) {
			return `A comprehensive guide to Pok\u00e9mon Showdown (and its' commands) can be found <a href="${PS_GUIDE}">here</a>. If you're new to competitive Pok\u00e9mon, type <code>/intro</code>.`;
		} else if (this.includes('battling') && (this.includes('team') || this.includes('building'))) {
			return `The dedicated place for this is the <a href="/competitivetutoring">Competitive Tutoring</a> room. If you already know which format you want to play, the corresponding room may be able to help you out: <a href="/ou">OU</a>, <a href="/ubers">Ubers</a>, <a href="/ag">AG</a>, <a href="/uu">UU</a>, <a href="/ru">RU</a>, <a href="/nu">NU</a>, <a href="/pu">PU</a>, <a href="/lc">LC</a>, <a href="/doubles">Doubles</a>, <a href="/vgc">VGC</a>, as well as <a href="alph">Alph</a> (this is the room for RBY, GSC, ADV, DPP, and BW) and <a href="/om">OM</a> (other metagames).`;
		} else if (this.includes('lfg') || this.includes('battle me') || this.includes('challenge')) {
			return `If you're looking for somebody to play a battle with, select the tier you wish to play on the dropdown to the left (on mobile, go to "Home") and select your team (if not a randomly generated tier). This will match you with a random opponent whose also playing on the ladder.<br /><br />To play with a friend, you can do <code>/user [username]</code>, and then click "Challenge". Then, select the tier you wish to play and the team you would like to use (if not a randomly generated one)`;
		} else if (this.includes('rate my team') || (this.includes('rmt') && !roomLink)) {
			return `If you'd like for someone to rate your team, we have a room dedicated for this named <a href="/rmt">Rate My Team</a>. Please be sure to read their roomintro for a guide on how to use the room and its' rules before chatting there.`;
		} else if ((this.includes('get') || this.includes('become')) && (this.includes('rank') || this.includes('staff') || this.includes('voice') || this.includes('driver') || this.includes('mod'))) {
			return `You can read the <a href="${STAFF_FAQ}">Staff FAQ</a> for more information about how to become a staff member.`;
		} else if ((this.includes('inappropriate') || this.includes('bad') || this.includes('offensive') || this.includes('racist')) && (this.includes('username') || this.includes('nick') || this.includes('name'))) {
			return `To report someone using an inappropriate username, you can PM a Moderator (@) in ${tarRoom}.`;
		} else if ((this.includes('appeal') || this.includes('for no reason')) && !roomLink) {
			return `To appeal a room punishment, PM an authority currently online in that room (use <code>/roomauth [roomname]</code>; bold names are people currently online.)<br />` +
				`To appeal a lock or global ban, you can either PM the authority that locked you, and/or post an appeal in the <a href="${APPEALS}">Appeals Forum</a>. To do so, you will have to have (or create) a Smogon Forums account.`;
		} else if (this.includes('change') && (this.includes('pass') || this.includes('pw'))) {
			return `To change your password, use the <button name="openOptions" class="button"><i style="font-size: 16px ; vertical-align: -1px" class="fa fa-cog"></i> Options</button> button and click "Password Change".`;
		} else if ((this.includes('send') || this.includes('give')) && this.includes('team')) {
			return `To give someone a team that you made, in the <a href="/teambuilder">Teambuilder</a>, you can select that team, click "Import/Export", copy the text, then paste it on a site like <a href="http://pastebin.com">pastebin</a>. Then, you can send that in a PM to the user you'd like to give the team to.`;
		} else if (this.includes('stalling') && !this.includes('time')) {
			return `If your opponent is stalling your Pokemon with moves or items, that is perfectly fine and part of a valid strategy. If he is waiting until last second for the timer each turn to move, that is timerstalling, which is not okay. If they are timerstalling, PM a Moderator (@) in ${tarRoom}.`;
		} else if (this.includes('replay')) {
			return `To upload a replay of your battle, once is it is finished, click "Upload Replay". To later view all replays of your previous battles, go to <a href="replay.pokemonshowdown.com/">replay.pokemonshowdown.com/</a> and search for your username.`;
		} else if (this.includes('zarel')) {
			return `Zarel is very busy; please don't contact him this way. First, try just asking your question in ${tarRoom}.`;
		} else if (this.includes('cusotm') && this.includes('avatar')) {
			return `Only global staff and highly respected contributors are allowed to have a custom avatar. However, we offer many pre-set options. If you want, you can <button class="button" name="avatars">change your avatar</button>.`;
		} else if ((this.includes('create') || this.includes('make')) && (this.includes('chat') || this.includes('room'))) {
			return `Groupchats are currently not open to the public. Only trusted users (users who are either global voice or above, and/or room driver in a public room) are allowed to create groupchats. Trusted users can create a groupchat using the <code>/makegroupchat</code> command.`;
		} else if (command) {
			return `Hmm, I'm not sure about that one. Try asking in the Help room.`;
		} else {
			return false;
		}
	}
	getResponseHTML(question, command, room) {
		const autoReply = this.ask(question, command, room);
		if (autoReply) {
			let buff = '';
			buff += Chat.html`<strong>Question:</strong> ${question}<br />`;
			buff += `<strong>Answer:</strong> ${autoReply}`;
			question = Chat.escapeHTML(question);
			if (!command) buff += `<br /><br /><button class="button" name="send" value="HELP: ${question}">This did not answer my question - ask the Help room</button>`;
			return buff;
		} else {
			return false;
		}
	}
	includes(text) {
		return this.question.includes(text);
	}
	otherAdminRequests(text) {
		return `<a href="${OTHER_ADMIN_REQUESTS}">${text}</a>`;
	}
}
const AI = new HelpAI();

exports.chatfilter = function (message, user, room, connection, targetUser) {
	if (room && room.id === 'help' && !user.can('broadcast', null, room)) {
		if (message.startsWith('HELP: ')) {
			message = message.replace('HELP: ', '');
			return message;
		} else {
			const reply = AI.getResponseHTML(message, null, room);
			if (reply) {
				user.sendTo(room.id, `|html|<div class="infobox">${reply}</div>`);
				return false;
			}
		}
	}
};

exports.commands = {
	'!askhelp': true,
	askhelp: function (target, room, user) {
		if (!target) return this.parse("/help askhelp");
		const reply = AI.getResponseHTML(target, true, room);
		this.sendReplyBox(reply);
	},
	askhelphelp: ["/askhelp [question] - Asks the Help AI a question."],
};
