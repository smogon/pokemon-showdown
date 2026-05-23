/**
 * Client-based Commands
 * Pokemon Showdown - https://pokemonshowdown.com/
 *
 * These are commands that only affect the client.
 * Only help text is stored here to allow broadcasting
 * with !help.
 * 
 * @license MIT
 */


export const commands: Chat.ChatCommands = {
	chalhelp: 'challengehelp',
	challhelp: 'challengehelp',
	challengehelp: [
		`/challenge - Open a prompt to challenge a user to a battle.`,
		`/challenge [user] - Challenge the user [user] to a battle.`,
		`/challenge [user], [format] - Challenge the user [user] to a battle in the specified [format].`,
		`/challenge [user], [format] @@@ [rules] - Challenge the user [user] to a battle with custom rules.`,
		`[rules] can be a comma-separated list of: [added rule], ![removed rule], -[banned thing], *[restricted thing], +[unbanned/unrestricted thing]`,
		`If used in the DMs of a user, no [user] parameter can be used and it will challenge that user.`,
		`/battlerules - Detailed information on what can go in [rules].`,
	],
	accepthelp: [
		`/accept - Accept a challenge if only one is pending.`,
		`/accept [user] - Accept a challenge from the specified user.`,
	],
	rejecthelp: [
		`/reject - Reject a challenge if only one is pending.`,
		`/reject [user] - Reject a challenge from the specified user.`,
	],
	userhelp: 'openhelp',
	openhelp: [
		`/user [user] - Open a popup containing the user [user]\'s avatar, name, rank, and chatroom list.`,
	],
	newshelp: [
		`/news - Opens a popup containing the news.`,
	],
	ignorehelp: 'unignorehelp',
	unignorehelp: [
		`/ignore [user] - Ignore all messages from the user [user].`,
		`/unignore [user] - Remove the user [user] from your ignore list.`,
		`/ignorelist - List all the users that you currently ignore.`,
		`/clearignore - Remove all users on your ignore list.`,
		`Note that staff messages cannot be ignored.`,
	],
	nickhelp: [
		`/nick [new username] - Change your username.`,
	],
	clearhelp: [
		`/clear - Clear the room\'s chat log.`,
	],
	showdebughelp: 'hidedebughelp',
	hidedebughelp: [
		`/showdebug - Receive debug messages from battle events.`,
		`/hidedebug - Ignore debug messages from battle events.`,
	],
	showjoinshelp: 'hidejoinshelp',
	hidejoinshelp: [
		`/showjoins [room] - Receive users\' join/leave messages.`,
		`/hidejoins [room] - Ignore users\' join/leave messages.`,
		`If no [room] is provided, changes the global setting.`,
	],
	showbattleshelp: 'hidebattleshelp',
	hidebattleshelp: [
		`/showbattles - Receive links to new battles in the Lobby (if the server supports it).`,
		`/hidebattles - Ignore links to new battles in the Lobby (if the server supports it).`,
	],
	unpackhiddenhelp: 'packhiddenhelp',
	packhiddenhelp: [
		`/unpackhidden - Suppress hiding locked or banned users\' chat messages after the fact.`,
		`/packhidden - Hide locked or banned users\' chat messages after the fact.`,
		`Hidden messages from a user can be restored by clicking the button underneath their lock/ban reason.`,
	],
	timestampshelp: [
		`Set your timestamps preference:`,
		`/timestamps [all|lobby|pms], [minutes|seconds|off]`,
		`all - Change all timestamps preferences, lobby - Change only lobby chat preferences, pms - Change only PM preferences.`,
		`off - Set timestamps off, minutes - Show timestamps of the form [hh:mm], seconds - Show timestamps of the form [hh:mm:ss].`,
	],
	highlighthelp: 'hlhelp',
	hlhelp: [
		`Set up highlights:`,
		`/highlight add [word 1], [word 2], [...] - Add the provided list of words to your highlight list.`,
		`/highlight roomadd [word 1], [word 2], [...] - Add the provided list of words to the highlight list of whichever room you used the command in.`,
		`/highlight list - List all words that currently highlight you.`,
		`/highlight roomlist - List all words that currently highlight you in whichever room you used the command in.`,
		`/highlight delete [word 1], [word 2], [...] - Delete the provided list of words from your entire highlight list.`,
		`/highlight roomdelete [word 1], [word 2], [...] - Delete the provided list of words from the highlight list of whichever room you used the command in.`,
		`/highlight clear - Clear your global highlight list.`,
		`/highlight roomclear - Clear the highlight list of whichever room you used the command in.`,
		`/highlight clearall - Clear your entire highlight list (all rooms and globally).`,
	],
	rankhelp: 'ladderhelp',
	rankinghelp: 'ladderhelp',
	ratinghelp: 'ladderhelp',
	ladderhelp: [
		`/rank [user] - Shows all ladder ranks for the given [user].`,
		`/rank [user], [format] - Shows the rank of [user] in the given [format].`,
		`If no user is given, it defaults to the user of the command.`,
	],
	afdhelp: [
		`/afd full - Enable all April Fools\' Day jokes.`,
		`/afd sprites - Enable April Fools\' Day sprites.`,
		`/afd default - Set April Fools\' Day to default (full on April 1st, off otherwise).`,
		`/afd off - Disable April Fools\' Day jokes until the next refresh, and set /afd default.`,
		`/afd never - Disable April Fools\' Day jokes permanently.`,
	],
};
