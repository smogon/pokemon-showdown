import type { TranslationCatalog } from '../../server/chat';

export const translations: TranslationCatalog = {
	// #region Generic UI
	// ==================================================================

	"Total": null,
	"User '{TARGETUSER}' not found.": null,
	"User \"{TARGETUSER}\" not found.": null,
	"Refresh": null,
	"Action": null,

	// #endregion Generic

	"namelocked": null,
	"locked": null,

	"autoconfirmed": null,
	"trusted": null,

	"Please follow the rules:": null,
	// TRANSLATORS: Link to the PS rules for your language (path after pokemonshowdown.com
	"/rules": null,
	"Global Rules": null,
	"{ROOM} room rules": null,

	"<strong>Global ranks</strong>": null,
	"+ <strong>Global Voice</strong> - They can use ! commands like !groups": null,
	"% <strong>Global Driver</strong> - Like Voice, and they can lock users and check for alts": null,
	"@ <strong>Global Moderator</strong> - The above, and they can globally ban users": null,
	"* <strong>Global Bot</strong> - An automated account that can use HTML anywhere": null,
	// old wording; kept so existing translations aren't lost
	"* <strong>Global Bot</strong> - Like Moderator, but makes it clear that this user is a bot": null, // NOT USED
	"~ <strong>Global Administrator</strong> - They can do anything, like change what this message says and promote users globally": null,

	"<strong>Room ranks</strong>": null,
	"^ <strong>Prize Winner</strong> - They don't have any powers beyond a symbol.": null,
	"+ <strong>Voice</strong> - They can use ! commands like !groups": null,
	"% <strong>Driver</strong> - The above, and they can mute and warn": null,
	"@ <strong>Moderator</strong> - The above, and they can room ban users": null,
	"* <strong>Bot</strong> - An automated account that can mute, warn, and use HTML": null,
	// old wording; kept so existing translations aren't lost
	"* <strong>Bot</strong> - Like Moderator, but makes it clear that this user is a bot": null, // NOT USED
	"# <strong>Room Owner</strong> - They are leaders of the room and can almost totally control it": null,

	"/help OR /h OR /? - Gives you help.": null, // DYNAMIC KEY (help.map(line => this.TL(line)))
	"For an overview of room commands, use /roomhelp": null,
	"For details of a specific command, use something like: /help data": null,

	"COMMANDS": null,
	"BATTLE ROOM COMMANDS": null,
	"OPTION COMMANDS": null,
	"INFORMATIONAL/RESOURCE COMMANDS": null,
	"DATA COMMANDS": null,
	"DRIVER COMMANDS": null,
	"MODERATOR COMMANDS": null,
	"ADMIN COMMANDS": null,

	"(replace / with ! to broadcast. Broadcasting requires: + % @ # ~)": null,

	"<strong>Room punishments</strong>:": null,
	"<strong>warn</strong> - Displays a popup with the rules.": null,
	"<strong>mute</strong> - Mutes a user (makes them unable to talk) for 7 minutes.": null,
	"<strong>hourmute</strong> - Mutes a user for 60 minutes.": null,
	"<strong>ban</strong> - Bans a user (makes them unable to join the room) for 2 days.": null,
	"<strong>weekban</strong> - Bans a user from the room for a week.": null,
	"<strong>blacklist</strong> - Bans a user for a year.": null,

	"<strong>Global punishments</strong>:": null,
	"<strong>lock</strong> - Locks a user (makes them unable to talk in any rooms or PM non-staff) for 2 days.": null,
	"<strong>weeklock</strong> - Locks a user for a week.": null,
	"<strong>namelock</strong> - Locks a user and prevents them from having a username for 2 days.": null,
	"<strong>globalban</strong> - Globally bans (makes them unable to connect and play games) for a week.": null,

	"<strong>Indefinite global punishments</strong>:": null,
	"<strong>permalock</strong> - Issued for repeated instances of bad behavior and is rarely the result of a single action. ": null,
	'These can be appealed in the <a href="https://www.smogon.com/forums/threads/discipline-appeal-rules.3583479/">Discipline Appeal</a>': null,
	" forum after at least 3 months without incident.": null,
	"<strong>permaban</strong> - Unappealable global ban typically issued for the most severe cases of offensive/inappropriate behavior.": null,

	"<strong>Room drivers (%)</strong> can use:": null,
	"- /warn OR /k <em>username</em>: warn a user and show the Pok&eacute;mon Showdown rules": null,
	"- /mute OR /m <em>username</em>: 7 minute mute": null,
	"- /hourmute OR /hm <em>username</em>: 60 minute mute": null,
	"- /unmute <em>username</em>: unmute": null,
	"- /hidetext <em>username</em>: hide a user's messages from the room": null,
	"- /announce OR /wall <em>message</em>: make an announcement": null,
	"- /modlog <em>username</em>: search the moderator log of the room": null,
	"- /modnote <em>note</em>: add a moderator note that can be read through modlog": null,

	"<strong>Room moderators (@)</strong> can also use:": null,
	"- /roomban OR /rb <em>username</em>: ban user from the room": null,
	"- /roomunban <em>username</em>: unban user from the room": null,
	"- /roomvoice <em>username</em>: appoint a room voice": null,
	"- /roomdevoice <em>username</em>: remove a room voice": null,
	"- /staffintro <em>intro</em>: set the staff introduction that will be displayed for all staff joining the room": null,
	"- /roomsettings: change a variety of room settings, namely modchat": null,

	"<strong>Room owners (#)</strong> can also use:": null,
	"- /roomintro <em>intro</em>: set the room introduction that will be displayed for all users joining the room": null,
	"- /rules <em>rules link</em>: set the room rules link seen when using /rules": null,
	"- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver": null,
	"- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver": null,
	"- /roomdeauth <em>username</em>: remove all room auth from a user": null,
	"- /declare <em>message</em>: make a large blue declaration to the room": null,
	"- !htmlbox <em>HTML code</em>: broadcast a box of HTML code to the room": null,
	"- !showimage <em>[url], [width], [height]</em>: show an image to the room": null, // NOT USED
	// old wording; kept so existing translations aren't lost
	"- !show [image or youtube link]: display given media in chat.": null,
	"- /whitelist [user]: whitelist a non-staff user to use !show.": null, // NOT USED
	"- /unwhitelist [user]: removes the user from !show whitelist.": null, // NOT USED
	"- /roomsettings: change a variety of room settings, including modchat, capsfilter, etc": null,

	"More detailed help can be found in the <a href=\"https://www.smogon.com/forums/posts/6774654/\">roomauth guide</a>": null,

	"Tournament Help:": null,
	"- /tour create <em>format</em>, elimination: create a new single elimination tournament in the current room.": null,
	"- /tour create <em>format</em>, roundrobin: create a new round robin tournament in the current room.": null,
	"- /tour end: forcibly end the tournament in the current room": null,
	"- /tour start: start the tournament in the current room": null,
	"- /tour banlist [pokemon], [talent], [...]: ban moves, abilities, Pokémon or items from being used in a tournament (it must be created first)": null,

	"More detailed help can be found in the <a href=\"https://www.smogon.com/forums/posts/6777489/\">tournaments guide</a>": null,

	"Your status cannot be updated while you are locked or semilocked.": null,
	"Your status is too long; it must be under {MAX} characters.": null,
	"Your status contains a banned word.": null,
	"Your status has been set to: {TARGET}.": null,
	"You are now marked as busy.": null,
	"You are now marked as away. Send a message or use /back to indicate you are back.": null,
	"You are already marked as back.": null,
	"You are no longer marked as busy.": null,

	"You must choose a name before you can talk.": null,
	"You are {LOCKTYPE} and can't talk in chat. {EXPIRATION}": null,
	// TRANSLATORS: your lock
	"Get help with this": null,
	"You are muted and cannot talk in this room.": null,
	"Because moderated chat is set, your account must be at least one week old and you must have won at least one ladder game to speak in this room.": null, // NOT USED
	"Because moderated chat is set, your account must be staff in a public room or have a global rank to speak in this room.": null,
	"Because moderated chat is set, you must be of rank {GROUP} or higher to speak in this room.": null,
	"Your message can't be blank.": null,
	"Your message is too long: ": null,
	"Your message contains banned characters.": null,
	"This room has slow-chat enabled. You can only talk once every {SECONDS} seconds.": null,
	"Your username contains a phrase banned by this room.": null, // NOT USED
	"Your status message contains a phrase banned by this room.": null, // NOT USED

	"You are {LOCKTYPE} and can only private message members of the global moderation team. {EXPIRATION}": null,
	"The user \"{TARGETUSER}\" is locked and cannot be PMed.": null,
	"On this server, you must be of rank {GROUP} or higher to PM users.": null,
	"This user is blocking private messages right now.": null,
	"This {GROUP} is too busy to answer private messages right now. Please contact a different staff member.": null,
	"If you need help, try opening a <a href=\"view-help-request\" class=\"button\">help ticket</a>": null,
	"You are blocking private messages right now.": null,
	"You are blocking challenges right now.": null, // NOT USED

	"Your message contained banned words in this room.": null, // NOT USED
	"You can't send the same message again so soon.": null,
	"Due to this room being a high traffic room, your message must contain at least two letters.": null,

	"You are already blocking private messages! To unblock, use /unblockpms": null, // NOT USED
	"You are now blocking private messages, except from staff and {RANK}.": null, // NOT USED
	"You are now blocking private messages, except from staff and {STATUS} users.": null, // NOT USED
	"You are now blocking private messages, except from staff.": null, // NOT USED
	"You are not blocking private messages! To block, use /blockpms": null, // NOT USED
	"You are no longer blocking private messages.": null, // NOT USED
	"You are now blocking all incoming challenge requests.": null,
	"You are already blocking challenges!": null,
	"You are already available for challenges!": null,
	"You are available for challenges from now on.": null,
	"You are now blocking challenges, except from staff and {RANK}.": null,
	"You are now blocking challenges, except from staff and {STATUS} users.": null,

	"Staff FAQ": null,
	"You cannot broadcast all FAQs at once.": null,
	"A user is autoconfirmed when they have won at least one rated battle and have been registered for one week or longer. In order to prevent spamming and trolling, most chatrooms only allow autoconfirmed users to chat. If you are not autoconfirmed, you can politely PM a staff member (staff have %, @, or # in front of their username) in the room you would like to chat and ask them to disable modchat. However, staff are not obligated to disable modchat.": null,
	"How the ladder works": null,
	"Tiering FAQ": null,
	"Badge FAQ": null,
	"Common misconceptions about our RNG": null,
	"To join a room tournament, click the <strong>Join!</strong> button or type the command <code>/tour join</code> in the room's chat. You can check if your team is legal for the tournament by clicking the <strong>Validate</strong> button once you've joined and selected a team. To battle your opponent in the tournament, click the <strong>Ready!</strong> button when it appears. There are two different types of room tournaments: elimination (if a user loses more than a certain number of times, they are eliminated) and round robin (all users play against each other, and the user with the most wins is the winner).": null,
	"Frequently Asked Questions": null,

	"Invalid room.": null, // NOT USED

	"pages/faq": null,
	"pages/ladderhelp": null,
	"pages/rng": null,
	"pages/staff": null,

	"- We log PMs so you can report them - staff can't look at them without permission unless there's a law enforcement reason.": null,
	"- We log IPs to enforce bans and mutes.": null,
	"- We use cookies to save your login info and teams, and for Google Analytics and AdSense.": null,
	'- For more information, you can read our <a href="https://{ROOT}/privacy">full privacy policy.</a>': null,
	"pages/proxyhelp": null,
	"Proxy lock help": null,
	"Custom avatars are given to Global Staff members, contributors (coders and spriters) to Pokemon Showdown, and Smogon badgeholders at the discretion of the PS! Administrators. They are also sometimes given out as rewards for major events such as PSPL (Pokemon Showdown Premier League). If you're curious, you can view the entire list of <a href=\"https://www.smogon.com/smeargle/customs/\">custom avatars</a>.": null,
	"pages/privacy": null,
	"Pokémon Showdown privacy policy": null,
	"{TARGETUSER}'s status \"{STATUS}\" was cleared by {USER}{REASON}.": null,
	"To use the friends feature you must be autoconfirmed, which means being registered for at least one week and winning one rated game.": null,
	"That name is too long - choose a valid name.": null,
	"You are currently blocking friend requests, and so cannot accept your own.": null,
	"You already are allowing friend requests.": null,
	"You are now allowing friend requests.": null,
	"You already are blocking incoming friend requests.": null,
	"You are now blocking incoming friend requests.": null,
	"Unrecognized setting.": null,
	"You are already not receiving friend notifications.": null,
	"You will not receive friend notifications.": null,
	"You are already hiding your logins from friends.": null,
	"You are already allowing friends to see your login times.": null,
	"You are already allowing other people to view your friends list.": null,
	"You are now allowing other people to view your friends list.": null,
	"You are already hiding your friends list.": null,
	"You are now hiding your friends list.": null,
	"You are already sharing your battles with friends.": null,
	"You are already not sharing your battles with friends.": null,
	"Undo": null,
	"Accept": null,
	"Deny": null,
	"You are locked due to your proxy / VPN and can't talk in chat.": null,
	"|html|<div class=\"message-error\">You must be registered to chat in temporary rooms (like battles).</div>": null,
	"You may register in the <button name=\"openOptions\"><i class=\"fa fa-cog\"></i> Options</button> menu.": null,
	"Moderated chat is set. To speak in this room, your account must be autoconfirmed, which means being registered for at least one week and winning at least one rated game (any game started through the 'Battle!' button).": null,
	"|html|You may register in the <button name=\"openOptions\"><i class=\"fa fa-cog\"></i> Options</button> menu.": null,
	"|html|<div class=\"message-error\">You must be registered to send private messages.</div>": null,
	"That user is unregistered and cannot be PMed.": null,
	"You are locked due to your proxy / VPN and can only private message members of the global moderation team.": null,
	"All Friends": null,
	"Spectate": null,
	"Sent": null,
	"Received": null,
	"Help": null,
	"Settings": null,
	"You are currently blocking friend requests.": null,
	"You are not blocking friend requests.": null,
	"You are currently allowing friend notifications.": null,
	"Your friend notifications are disabled.": null,

};
