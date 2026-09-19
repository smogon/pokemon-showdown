import type { TranslationCatalog } from '../../server/chat';

export const translations: TranslationCatalog = {
	// #region Generic UI
	// ==================================================================

	"Total": null, // NEEDS TRANSLATION
	"User '{TARGETUSER}' not found.": null, // NEEDS TRANSLATION
	"User \"{TARGETUSER}\" not found.": null, // NEEDS TRANSLATION
	"Refresh": null, // NEEDS TRANSLATION
	"Action": null, // NEEDS TRANSLATION

	// #endregion Generic

	"namelocked": null, // NEEDS TRANSLATION
	"locked": null, // NEEDS TRANSLATION

	"autoconfirmed": null, // NEEDS TRANSLATION
	"trusted": null, // NEEDS TRANSLATION

	"Please follow the rules:": null, // NEEDS TRANSLATION
	// TRANSLATORS: Link to the PS rules for your language (the part after pokemonshowdown.com)
	"/rules": null, // NEEDS TRANSLATION
	"Global Rules": null, // NEEDS TRANSLATION
	"{ROOM} room rules": null, // NEEDS TRANSLATION

	"<strong>Global ranks</strong>": null, // NEEDS TRANSLATION
	"+ <strong>Global Voice</strong> - They can use ! commands like !groups": null, // NEEDS TRANSLATION
	"% <strong>Global Driver</strong> - Like Voice, and they can lock users and check for alts": null, // NEEDS TRANSLATION
	"@ <strong>Global Moderator</strong> - The above, and they can globally ban users": null, // NEEDS TRANSLATION
	"* <strong>Global Bot</strong> - An automated account that can use HTML anywhere": null, // NEEDS TRANSLATION
	"* <strong>Global Bot</strong> - Like Moderator, but makes it clear that this user is a bot": null, // NEEDS TRANSLATION
	"~ <strong>Global Administrator</strong> - They can do anything, like change what this message says and promote users globally": null, // NEEDS TRANSLATION

	"<strong>Room ranks</strong>": null, // NEEDS TRANSLATION
	"^ <strong>Prize Winner</strong> - They don't have any powers beyond a symbol.": null, // NEEDS TRANSLATION
	"+ <strong>Voice</strong> - They can use ! commands like !groups": null, // NEEDS TRANSLATION
	"% <strong>Driver</strong> - The above, and they can mute and warn": null, // NEEDS TRANSLATION
	"@ <strong>Moderator</strong> - The above, and they can room ban users": null, // NEEDS TRANSLATION
	"* <strong>Bot</strong> - An automated account that can mute, warn, and use HTML": null, // NEEDS TRANSLATION
	"* <strong>Bot</strong> - Like Moderator, but makes it clear that this user is a bot": null, // NEEDS TRANSLATION
	"# <strong>Room Owner</strong> - They are leaders of the room and can almost totally control it": null, // NEEDS TRANSLATION

	"/help OR /h OR /? - Gives you help.": null, // NEEDS TRANSLATION
	"For an overview of room commands, use /roomhelp": null, // NEEDS TRANSLATION
	"For details of a specific command, use something like: /help data": null, // NEEDS TRANSLATION

	"COMMANDS": null, // NEEDS TRANSLATION
	"BATTLE ROOM COMMANDS": null, // NEEDS TRANSLATION
	"OPTION COMMANDS": null, // NEEDS TRANSLATION
	"INFORMATIONAL/RESOURCE COMMANDS": null, // NEEDS TRANSLATION
	"DATA COMMANDS": null, // NEEDS TRANSLATION
	"DRIVER COMMANDS": null, // NEEDS TRANSLATION
	"MODERATOR COMMANDS": null, // NEEDS TRANSLATION
	"ADMIN COMMANDS": null, // NEEDS TRANSLATION

	"(replace / with ! to broadcast. Broadcasting requires: + % @ # ~)": null, // NEEDS TRANSLATION

	"<strong>Room punishments</strong>:": null, // NEEDS TRANSLATION
	"<strong>warn</strong> - Displays a popup with the rules.": null, // NEEDS TRANSLATION
	"<strong>mute</strong> - Mutes a user (makes them unable to talk) for 7 minutes.": null, // NEEDS TRANSLATION
	"<strong>hourmute</strong> - Mutes a user for 60 minutes.": null, // NEEDS TRANSLATION
	"<strong>ban</strong> - Bans a user (makes them unable to join the room) for 2 days.": null, // NEEDS TRANSLATION
	"<strong>weekban</strong> - Bans a user from the room for a week.": null, // NEEDS TRANSLATION
	"<strong>blacklist</strong> - Bans a user for a year.": null, // NEEDS TRANSLATION

	"<strong>Global punishments</strong>:": null, // NEEDS TRANSLATION
	"<strong>lock</strong> - Locks a user (makes them unable to talk in any rooms or PM non-staff) for 2 days.": null, // NEEDS TRANSLATION
	"<strong>weeklock</strong> - Locks a user for a week.": null, // NEEDS TRANSLATION
	"<strong>namelock</strong> - Locks a user and prevents them from having a username for 2 days.": null, // NEEDS TRANSLATION
	"<strong>globalban</strong> - Globally bans (makes them unable to connect and play games) for a week.": null, // NEEDS TRANSLATION

	"<strong>Indefinite global punishments</strong>:": null, // NEEDS TRANSLATION
	"<strong>permalock</strong> - Issued for repeated instances of bad behavior and is rarely the result of a single action. ": null, // NEEDS TRANSLATION
	"These can be appealed in the <a href=\"https://www.smogon.com/forums/threads/discipline-appeal-rules.3583479/\">Discipline Appeal</a>": null, // NEEDS TRANSLATION
	" forum after at least 3 months without incident.": null, // NEEDS TRANSLATION
	"<strong>permaban</strong> - Unappealable global ban typically issued for the most severe cases of offensive/inappropriate behavior.": null, // NEEDS TRANSLATION

	"<strong>Room drivers (%)</strong> can use:": null, // NEEDS TRANSLATION
	"- /warn OR /k <em>username</em>: warn a user and show the Pok&eacute;mon Showdown rules": null, // NEEDS TRANSLATION
	"- /mute OR /m <em>username</em>: 7 minute mute": null, // NEEDS TRANSLATION
	"- /hourmute OR /hm <em>username</em>: 60 minute mute": null, // NEEDS TRANSLATION
	"- /unmute <em>username</em>: unmute": null, // NEEDS TRANSLATION
	"- /hidetext <em>username</em>: hide a user's messages from the room": null, // NEEDS TRANSLATION
	"- /announce OR /wall <em>message</em>: make an announcement": null, // NEEDS TRANSLATION
	"- /modlog <em>username</em>: search the moderator log of the room": null, // NEEDS TRANSLATION
	"- /modnote <em>note</em>: add a moderator note that can be read through modlog": null, // NEEDS TRANSLATION

	"<strong>Room moderators (@)</strong> can also use:": null, // NEEDS TRANSLATION
	"- /roomban OR /rb <em>username</em>: ban user from the room": null, // NEEDS TRANSLATION
	"- /roomunban <em>username</em>: unban user from the room": null, // NEEDS TRANSLATION
	"- /roomvoice <em>username</em>: appoint a room voice": null, // NEEDS TRANSLATION
	"- /roomdevoice <em>username</em>: remove a room voice": null, // NEEDS TRANSLATION
	"- /staffintro <em>intro</em>: set the staff introduction that will be displayed for all staff joining the room": null, // NEEDS TRANSLATION
	"- /roomsettings: change a variety of room settings, namely modchat": null, // NEEDS TRANSLATION

	"<strong>Room owners (#)</strong> can also use:": null, // NEEDS TRANSLATION
	"- /roomintro <em>intro</em>: set the room introduction that will be displayed for all users joining the room": null, // NEEDS TRANSLATION
	"- /rules <em>rules link</em>: set the room rules link seen when using /rules": null, // NEEDS TRANSLATION
	"- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver": null, // NEEDS TRANSLATION
	"- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver": null, // NEEDS TRANSLATION
	"- /roomdeauth <em>username</em>: remove all room auth from a user": null, // NEEDS TRANSLATION
	"- /declare <em>message</em>: make a large blue declaration to the room": null, // NEEDS TRANSLATION
	"- !htmlbox <em>HTML code</em>: broadcast a box of HTML code to the room": null, // NEEDS TRANSLATION
	"- !showimage <em>[url], [width], [height]</em>: show an image to the room": null, // NEEDS TRANSLATION
	"- !show [image or youtube link]: display given media in chat.": null, // NEEDS TRANSLATION
	"- /whitelist [user]: whitelist a non-staff user to use !show.": null, // NEEDS TRANSLATION
	"- /unwhitelist [user]: removes the user from !show whitelist.": null, // NEEDS TRANSLATION
	"- /roomsettings: change a variety of room settings, including modchat, capsfilter, etc": null, // NEEDS TRANSLATION

	"More detailed help can be found in the <a href=\"https://www.smogon.com/forums/posts/6774654/\">roomauth guide</a>": null, // NEEDS TRANSLATION

	"Tournament Help:": null, // NEEDS TRANSLATION
	"- /tour create <em>format</em>, elimination: create a new single elimination tournament in the current room.": null, // NEEDS TRANSLATION
	"- /tour create <em>format</em>, roundrobin: create a new round robin tournament in the current room.": null, // NEEDS TRANSLATION
	"- /tour end: forcibly end the tournament in the current room": null, // NEEDS TRANSLATION
	"- /tour start: start the tournament in the current room": null, // NEEDS TRANSLATION
	"- /tour banlist [pokemon], [talent], [...]: ban moves, abilities, Pokémon or items from being used in a tournament (it must be created first)": null, // NEEDS TRANSLATION

	"More detailed help can be found in the <a href=\"https://www.smogon.com/forums/posts/6777489/\">tournaments guide</a>": null, // NEEDS TRANSLATION

	"Your status cannot be updated while you are locked or semilocked.": null, // NEEDS TRANSLATION
	"Your status is too long; it must be under {MAX} characters.": null, // NEEDS TRANSLATION
	"Your status contains a banned word.": null, // NEEDS TRANSLATION
	"Your status has been set to: {TARGET}.": null, // NEEDS TRANSLATION
	"You are now marked as busy.": null, // NEEDS TRANSLATION
	"You are now marked as away. Send a message or use /back to indicate you are back.": null, // NEEDS TRANSLATION
	"You are already marked as back.": null, // NEEDS TRANSLATION
	"You are no longer marked as busy.": null, // NEEDS TRANSLATION

	"You must choose a name before you can talk.": null, // NEEDS TRANSLATION
	"You are {LOCKTYPE} and can't talk in chat. {EXPIRATION}": null, // NEEDS TRANSLATION
	// TRANSLATORS: your lock
	"Get help with this": null, // NEEDS TRANSLATION
	"You are muted and cannot talk in this room.": null, // NEEDS TRANSLATION
	"Because moderated chat is set, your account must be at least one week old and you must have won at least one ladder game to speak in this room.": null, // NEEDS TRANSLATION
	"Because moderated chat is set, your account must be staff in a public room or have a global rank to speak in this room.": null, // NEEDS TRANSLATION
	"Because moderated chat is set, you must be of rank {GROUP} or higher to speak in this room.": null, // NEEDS TRANSLATION
	"Your message can't be blank.": null, // NEEDS TRANSLATION
	"Your message is too long: ": null, // NEEDS TRANSLATION
	"Your message contains banned characters.": null, // NEEDS TRANSLATION
	"This room has slow-chat enabled. You can only talk once every {SECONDS} seconds.": null, // NEEDS TRANSLATION
	"Your username contains a phrase banned by this room.": null, // NEEDS TRANSLATION
	"Your status message contains a phrase banned by this room.": null, // NEEDS TRANSLATION

	"You are {LOCKTYPE} and can only private message members of the global moderation team. {EXPIRATION}": null, // NEEDS TRANSLATION
	"The user \"{TARGETUSER}\" is locked and cannot be PMed.": null, // NEEDS TRANSLATION
	"On this server, you must be of rank {GROUP} or higher to PM users.": null, // NEEDS TRANSLATION
	"This user is blocking private messages right now.": null, // NEEDS TRANSLATION
	"This {GROUP} is too busy to answer private messages right now. Please contact a different staff member.": null, // NEEDS TRANSLATION
	"If you need help, try opening a <a href=\"view-help-request\" class=\"button\">help ticket</a>": null, // NEEDS TRANSLATION
	"You are blocking private messages right now.": null, // NEEDS TRANSLATION
	"You are blocking challenges right now.": null, // NEEDS TRANSLATION

	"Your message contained banned words in this room.": null, // NEEDS TRANSLATION
	"You can't send the same message again so soon.": null, // NEEDS TRANSLATION
	"Due to this room being a high traffic room, your message must contain at least two letters.": null, // NEEDS TRANSLATION

	"You are already blocking private messages! To unblock, use /unblockpms": null, // NEEDS TRANSLATION
	"You are now blocking private messages, except from staff and {RANK}.": null, // NEEDS TRANSLATION
	"You are now blocking private messages, except from staff and {STATUS} users.": null, // NEEDS TRANSLATION
	"You are now blocking private messages, except from staff.": null, // NEEDS TRANSLATION
	"You are not blocking private messages! To block, use /blockpms": null, // NEEDS TRANSLATION
	"You are no longer blocking private messages.": null, // NEEDS TRANSLATION
	"You are now blocking all incoming challenge requests.": null, // NEEDS TRANSLATION
	"You are already blocking challenges!": null, // NEEDS TRANSLATION
	"You are already available for challenges!": null, // NEEDS TRANSLATION
	"You are available for challenges from now on.": null, // NEEDS TRANSLATION
	"You are now blocking challenges, except from staff and {RANK}.": null, // NEEDS TRANSLATION
	"You are now blocking challenges, except from staff and {STATUS} users.": null, // NEEDS TRANSLATION

	"Staff FAQ": null, // NEEDS TRANSLATION
	"You cannot broadcast all FAQs at once.": null, // NEEDS TRANSLATION
	"A user is autoconfirmed when they have won at least one rated battle and have been registered for one week or longer. In order to prevent spamming and trolling, most chatrooms only allow autoconfirmed users to chat. If you are not autoconfirmed, you can politely PM a staff member (staff have %, @, or # in front of their username) in the room you would like to chat and ask them to disable modchat. However, staff are not obligated to disable modchat.": null, // NEEDS TRANSLATION
	"How the ladder works": null, // NEEDS TRANSLATION
	"Tiering FAQ": null, // NEEDS TRANSLATION
	"Badge FAQ": null, // NEEDS TRANSLATION
	"Common misconceptions about our RNG": null, // NEEDS TRANSLATION
	"To join a room tournament, click the <strong>Join!</strong> button or type the command <code>/tour join</code> in the room's chat. You can check if your team is legal for the tournament by clicking the <strong>Validate</strong> button once you've joined and selected a team. To battle your opponent in the tournament, click the <strong>Ready!</strong> button when it appears. There are two different types of room tournaments: elimination (if a user loses more than a certain number of times, they are eliminated) and round robin (all users play against each other, and the user with the most wins is the winner).": null, // NEEDS TRANSLATION
	"Frequently Asked Questions": null, // NEEDS TRANSLATION

	"Invalid room.": null, // NEEDS TRANSLATION

	"pages/faq": null, // NEEDS TRANSLATION
	"pages/ladderhelp": null, // NEEDS TRANSLATION
	"pages/rng": null, // NEEDS TRANSLATION
	"pages/staff": null, // NEEDS TRANSLATION

	"- We log PMs so you can report them - staff can't look at them without permission unless there's a law enforcement reason.": null, // NEEDS TRANSLATION
	"- We log IPs to enforce bans and mutes.": null, // NEEDS TRANSLATION
	"- We use cookies to save your login info and teams, and for Google Analytics and AdSense.": null, // NEEDS TRANSLATION
	"- For more information, you can read our <a href=\"https://{ROOT}/privacy\">full privacy policy.</a>": null, // NEEDS TRANSLATION
	"pages/proxyhelp": null, // NEEDS TRANSLATION
	"Proxy lock help": null, // NEEDS TRANSLATION
	"Custom avatars are given to Global Staff members, contributors (coders and spriters) to Pokemon Showdown, and Smogon badgeholders at the discretion of the PS! Administrators. They are also sometimes given out as rewards for major events such as PSPL (Pokemon Showdown Premier League). If you're curious, you can view the entire list of <a href=\"https://www.smogon.com/smeargle/customs/\">custom avatars</a>.": null, // NEEDS TRANSLATION
	"pages/privacy": null, // NEEDS TRANSLATION
	"Pokémon Showdown privacy policy": null, // NEEDS TRANSLATION
	"{TARGETUSER}'s status \"{STATUS}\" was cleared by {USER}{REASON}.": null, // NEEDS TRANSLATION
	"To use the friends feature you must be autoconfirmed, which means being registered for at least one week and winning one rated game.": null, // NEEDS TRANSLATION
	"That name is too long - choose a valid name.": null, // NEEDS TRANSLATION
	"You are currently blocking friend requests, and so cannot accept your own.": null, // NEEDS TRANSLATION
	"You already are allowing friend requests.": null, // NEEDS TRANSLATION
	"You are now allowing friend requests.": null, // NEEDS TRANSLATION
	"You already are blocking incoming friend requests.": null, // NEEDS TRANSLATION
	"You are now blocking incoming friend requests.": null, // NEEDS TRANSLATION
	"Unrecognized setting.": null, // NEEDS TRANSLATION
	"You are already not receiving friend notifications.": null, // NEEDS TRANSLATION
	"You will not receive friend notifications.": null, // NEEDS TRANSLATION
	"You are already hiding your logins from friends.": null, // NEEDS TRANSLATION
	"You are already allowing friends to see your login times.": null, // NEEDS TRANSLATION
	"You are already allowing other people to view your friends list.": null, // NEEDS TRANSLATION
	"You are now allowing other people to view your friends list.": null, // NEEDS TRANSLATION
	"You are already hiding your friends list.": null, // NEEDS TRANSLATION
	"You are now hiding your friends list.": null, // NEEDS TRANSLATION
	"You are already sharing your battles with friends.": null, // NEEDS TRANSLATION
	"You are already not sharing your battles with friends.": null, // NEEDS TRANSLATION
	"Undo": null, // NEEDS TRANSLATION
	"Accept": null, // NEEDS TRANSLATION
	"Deny": null, // NEEDS TRANSLATION
	"You are locked due to your proxy / VPN and can't talk in chat.": null, // NEEDS TRANSLATION
	"|html|<div class=\"message-error\">You must be registered to chat in temporary rooms (like battles).</div>": null, // NEEDS TRANSLATION
	"You may register in the <button name=\"openOptions\"><i class=\"fa fa-cog\"></i> Options</button> menu.": null, // NEEDS TRANSLATION
	"Moderated chat is set. To speak in this room, your account must be autoconfirmed, which means being registered for at least one week and winning at least one rated game (any game started through the 'Battle!' button).": null, // NEEDS TRANSLATION
	"|html|You may register in the <button name=\"openOptions\"><i class=\"fa fa-cog\"></i> Options</button> menu.": null, // NEEDS TRANSLATION
	"|html|<div class=\"message-error\">You must be registered to send private messages.</div>": null, // NEEDS TRANSLATION
	"That user is unregistered and cannot be PMed.": null, // NEEDS TRANSLATION
	"You are locked due to your proxy / VPN and can only private message members of the global moderation team.": null, // NEEDS TRANSLATION
	"All Friends": null, // NEEDS TRANSLATION
	"Spectate": null, // NEEDS TRANSLATION
	"Sent": null, // NEEDS TRANSLATION
	"Received": null, // NEEDS TRANSLATION
	"Help": null, // NEEDS TRANSLATION
	"Settings": null, // NEEDS TRANSLATION
	"You are currently blocking friend requests.": null, // NEEDS TRANSLATION
	"You are not blocking friend requests.": null, // NEEDS TRANSLATION
	"You are currently allowing friend notifications.": null, // NEEDS TRANSLATION
	"Your friend notifications are disabled.": null, // NEEDS TRANSLATION

};
