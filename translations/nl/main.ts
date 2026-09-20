import type { TranslationCatalog } from '../../server/chat';

export const translations: TranslationCatalog = {
	// #region Generic UI
	// ==================================================================

	"Total": null, // NEEDS TRANSLATION
	"User '{TARGETUSER}' not found.": "Gebruiker '{TARGETUSER}' is niet gevonden.",
	"User \"{TARGETUSER}\" not found.": null, // NEEDS TRANSLATION
	"Refresh": "Vernieuwen",
	"Action": "Actie",

	// #endregion Generic

	"namelocked": "genaamlockt",
	"locked": "gelockt",

	"autoconfirmed": "autoconfirmed",
	"trusted": "vertrouwd",

	"Please follow the rules:": "Volg de regels:",
	// TRANSLATORS: Link to the PS rules for your language (the part after pokemonshowdown.com)
	"/rules": "/pages/rules-nl",
	"Global Rules": "Globale regels",
	"{ROOM} room rules": "Regels van de {ROOM} room",

	"<strong>Global ranks</strong>": "<strong>Globale rangen</strong>",
	"+ <strong>Global Voice</strong> - They can use ! commands like !groups": "+ <strong>Global voice</strong> - Ze kunnen ! commando's gebruiken.",
	"% <strong>Global Driver</strong> - Like Voice, and they can lock users and check for alts": "% <strong>Global driver</strong> - Het bovenstaande en ze kunnen gebruikers locken en alts (nevenaccounts) inzien.",
	"@ <strong>Global Moderator</strong> - The above, and they can globally ban users": "@ <strong>Global moderator</strong> - Het bovenstaande en ze kunnen gebruikers uit de gehele server verbannen.",
	"* <strong>Global Bot</strong> - An automated account that can use HTML anywhere": null, // NEEDS TRANSLATION
	"* <strong>Global Bot</strong> - Like Moderator, but makes it clear that this user is a bot": "* <strong>Global bot</strong> - Hetzelfde als een moderator maar dit symbool maakt duidelijk dat deze gebruiker een bot is.",
	"~ <strong>Global Administrator</strong> - They can do anything, like change what this message says and promote users globally": "~ <strong>Global administrator</strong> - Zij kunnen alles doen, zoals veranderen wat hier staat en gebruikers globaal promoveren.",

	"<strong>Room ranks</strong>": "<strong>Roomrangen</strong>",
	"^ <strong>Prize Winner</strong> - They don't have any powers beyond a symbol.": "^ <strong>Prijswinnaar</strong> - Ze hebben geen extra bevoegdheden naast een symbool.",
	"+ <strong>Voice</strong> - They can use ! commands like !groups": "+ <strong>Voice</strong> - Ze kunnen ! commando's gebruiken en tijdens beperkte chat praten.",
	"% <strong>Driver</strong> - The above, and they can mute and warn": "% <strong>Driver</strong> - Het bovenstaande en ze kunnen gebruikers muten en waarschuwen.",
	"@ <strong>Moderator</strong> - The above, and they can room ban users": "@ <strong>Moderator</strong> - Het bovenstaande en ze kunnen gebruikers uit de room verbannen.",
	"* <strong>Bot</strong> - An automated account that can mute, warn, and use HTML": null, // NEEDS TRANSLATION
	"* <strong>Bot</strong> - Like Moderator, but makes it clear that this user is a bot": "* <strong>Bot</strong> - Hetzelfde als een moderator maar dit symbool maakt duidelijk dat deze gebruiker een bot is.",
	"# <strong>Room Owner</strong> - They are leaders of the room and can almost totally control it": "# <strong>Roomowner</strong> - Zij zijn de beheerders van de room en kunnen bijna alles in de room beslissen.",

	"/help OR /h OR /? - Gives you help.": "/help OF /h OF /? - Geeft je hulp.",
	"For an overview of room commands, use /roomhelp": "Typ /roomhelp voor een overzicht van alle roomcommando's.",
	"For details of a specific command, use something like: /help data": "Typ bijvoorbeeld '/help data' voor details over een specifiek commando.",

	"COMMANDS": "COMMANDO'S",
	"BATTLE ROOM COMMANDS": "COMMANDO'S VOOR GEVECHTEN",
	"OPTION COMMANDS": "INSTELLINGSCOMMANDO'S",
	"INFORMATIONAL/RESOURCE COMMANDS": "INFORMATIE-/NASLAGCOMMANDO'S",
	"DATA COMMANDS": "DATACOMMANDO'S",
	"DRIVER COMMANDS": "COMMANDO'S VOOR DRIVERS",
	"MODERATOR COMMANDS": "COMMANDO'S VOOR MODERATORS",
	"ADMIN COMMANDS": "COMMANDO'S VOOR ADMINS",

	"(replace / with ! to broadcast. Broadcasting requires: + % @ # ~)": "(vervang / door ! om het commando uit te zenden. Uitzenden vereist: + % @ # ~)",

	"<strong>Room punishments</strong>:": "<strong>Roomstraffen</strong>:",
	"<strong>warn</strong> - Displays a popup with the rules.": "<strong>waarschuwing</strong> - Laat een popup zien met de regels.",
	"<strong>mute</strong> - Mutes a user (makes them unable to talk) for 7 minutes.": "<strong>mute</strong> - Mutet een gebruiker (maakt het onmogelijk om te praten) voor 7 minuten.",
	"<strong>hourmute</strong> - Mutes a user for 60 minutes.": "<strong>hourmute</strong> - Mutet een gebruiker voor 60 minuten.",
	"<strong>ban</strong> - Bans a user (makes them unable to join the room) for 2 days.": "<strong>ban</strong> - Verbant een gebruiker (maakt het onmogelijk om de room binnen te komen) voor 2 dagen.",
	"<strong>weekban</strong> - Bans a user from the room for a week.": "<strong>weekban</strong> - Verbant een gebruiker een week lang uit de room.",
	"<strong>blacklist</strong> - Bans a user for a year.": "<strong>blacklist</strong> - Verbant een gebruiker voor een jaar.",

	"<strong>Global punishments</strong>:": "<strong>Globale straffen</strong>:",
	"<strong>lock</strong> - Locks a user (makes them unable to talk in any rooms or PM non-staff) for 2 days.": "<strong>lock</strong> - Lockt een gebruiker (maakt het onmogelijk om in rooms te praten en privéberichten te sturen naar niet-stafleden) voor 2 dagen.",
	"<strong>weeklock</strong> - Locks a user for a week.": "<strong>weeklock</strong> - Lockt een gebruiker voor een week.",
	"<strong>namelock</strong> - Locks a user and prevents them from having a username for 2 days.": "<strong>namelock</strong> - Lockt een gebruiker en maakt het onmogelijk een gebruikersnaam te kiezen voor 2 dagen.",
	"<strong>globalban</strong> - Globally bans (makes them unable to connect and play games) for a week.": "<strong>globalban</strong> - Verbant een gebruiker globaal (maakt het onmogelijk met de website te verbinden) voor een week.",

	"<strong>Indefinite global punishments</strong>:": "<strong>Globale straffen van onbepaalde tijd</strong>:",
	"<strong>permalock</strong> - Issued for repeated instances of bad behavior and is rarely the result of a single action. ": "<strong>permalock</strong> - Uitgegeven voor herhaalde gevallen van slecht gedrag. Deze straf is zelden het resultaat van slechts één enkele actie. ",
	'These can be appealed in the <a href="https://www.smogon.com/forums/threads/discipline-appeal-rules.3583479/">Discipline Appeal</a>': ' Tegen deze straf kan bezwaar gemaakt worden, mits er ten minste 3 maanden lang geen overige incidenten optreden.',
	" forum after at least 3 months without incident.": ' Dit kan door te posten in het <a href="https://www.smogon.com/forums/threads/discipline-appeal-rules.3583479/">Discipline Appeal</a> forum.',
	"<strong>permaban</strong> - Unappealable global ban typically issued for the most severe cases of offensive/inappropriate behavior.": "<strong>permaban</strong> - Een globale verbanning waar geen bezwaar op gemaakt kan worden. Deze straf wordt meestal uitgegeven in extreme gevallen van offensief/ongepast gedrag.",

	"<strong>Room drivers (%)</strong> can use:": "<strong>Roomdrivers (%)</strong> kunnen de volgende commando's gebruiken:",
	"- /warn OR /k <em>username</em>: warn a user and show the Pok&eacute;mon Showdown rules": "- /warn OF /k <em>gebruikersnaam</em>: Waarschuwt een gebruiker en laat ze de Pok&eacute;mon Showdown regels zien.",
	"- /mute OR /m <em>username</em>: 7 minute mute": "- /mute OF /m <em>gebruikersnaam</em>: Mutet een gebruiker voor 7 minuten.",
	"- /hourmute OR /hm <em>username</em>: 60 minute mute": "- /mute OF /m <em>gebruikersnaam</em>: Mutet een gebruiker voor 60 minuten.",
	"- /unmute <em>username</em>: unmute": "- /unmute <em>gebruikersnaam</em>: Be&euml;indigt een mute.",
	"- /hidetext <em>username</em>: hide a user's messages from the room": "- /hidetext <em>gebruikersnaam</em>: Verbergt de chatberichten van een gebruiker.",
	"- /announce OR /wall <em>message</em>: make an announcement": "- /announce OF /wall <em>bericht</em>: Doet een aankondiging.",
	"- /modlog <em>username</em>: search the moderator log of the room": "- /modlog <em>gebruikersnaam</em>: Doorzoekt de moderatiegeschiedenis van een room.",
	"- /modnote <em>note</em>: add a moderator note that can be read through modlog": "- /modnote <em>notitie</em>: Voegt een notitie toe die terug kan worden gelezen met /modlog.",

	"<strong>Room moderators (@)</strong> can also use:": "<strong>Roommoderators (@)</strong> kunnen ook de volgende commando's gebruiken:",
	"- /roomban OR /rb <em>username</em>: ban user from the room": "- /roomban OF /rb <em>gebruikersnaam</em>: Verbant gebruiker uit de room.",
	"- /roomunban <em>username</em>: unban user from the room": "- /roomunban <em>gebruikersnaam</em>: Maakt een roomban ongedaan.",
	"- /roomvoice <em>username</em>: appoint a room voice": "- /roomvoice <em>gebruikersnaam</em>: Benoemt een roomvoice.",
	"- /roomdevoice <em>username</em>: remove a room voice": "- /roomdevoice <em>gebruikersnaam</em>: Neemt een roomvoice weg.",
	"- /staffintro <em>intro</em>: set the staff introduction that will be displayed for all staff joining the room": "- /staffintro <em>intro</em>: Stelt een stafintroductie in die wordt getoond aan alle stafleden die de room binnenkomen.",
	"- /roomsettings: change a variety of room settings, namely modchat": "- /roomsettings: Toont een menu waarin het mogelijk is allerlei chatinstellingen te wijzigen, waaronder modchat.",

	"<strong>Room owners (#)</strong> can also use:": "<strong>Roomowners (#)</strong> kunnen ook de volgende commando's gebruiken:",
	"- /roomintro <em>intro</em>: set the room introduction that will be displayed for all users joining the room": "- /roomintro <em>intro</em>: Stelt een roomintroductie in die wordt getoond aan iedereen die de room binnenkomt.",
	"- /rules <em>rules link</em>: set the room rules link seen when using /rules": "- /rules <em>link naar regels</em>: Stelt de roomregels in die worden weergegeven als je /rules typt.",
	"- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver": "- /roommod, /roomdriver <em>gebruikersnaam</em>: Benoemt een roommoderator/-driver.",
	"- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver": "- /roomdemod, /roomdedriver <em>gebruikersnaam</em>: Degradeert een roommoderator/-driver.",
	"- /roomdeauth <em>username</em>: remove all room auth from a user": "- /roomdeauth <em>gebruikersnaam</em>: Verwijdert alle roomrangen van een gebruiker in de room.",
	"- /declare <em>message</em>: make a large blue declaration to the room": "- /declare <em>bericht</em>: Stuurt een grote blauwe declaratie naar de room.",
	"- !htmlbox <em>HTML code</em>: broadcast a box of HTML code to the room": "- !htmlbox <em>HTML code</em>: Stuurt een box met HTML-code naar de room.",
	"- !showimage <em>[url], [width], [height]</em>: show an image to the room": "- !showimage <em>[url], [breedte], [hoogte]</em>: Laat een afbeelding aan de room zien.",
	"- !show [image or youtube link]: display given media in chat.": null, // NEEDS TRANSLATION
	"- /whitelist [user]: whitelist a non-staff user to use !show.": null, // NEEDS TRANSLATION
	"- /unwhitelist [user]: removes the user from !show whitelist.": null, // NEEDS TRANSLATION
	"- /roomsettings: change a variety of room settings, including modchat, capsfilter, etc": "- /roomsettings: Toont een menu waarin het mogelijk is allerlei chatinstellingen te wijzigen, waaronder modchat, capsfilter, enzovoort.",

	"More detailed help can be found in the <a href=\"https://www.smogon.com/forums/posts/6774654/\">roomauth guide</a>": "Meer details zijn te vinden in de <a href=\"https://www.smogon.com/forums/posts/6774654/\">roomauthgids</a>",

	"Tournament Help:": "Toernooihulp",
	"- /tour create <em>format</em>, elimination: create a new single elimination tournament in the current room.": "- /tour create <em>format</em>, elimination: Maakt een nieuw single-eliminationtoernooi aan in de room.",
	"- /tour create <em>format</em>, roundrobin: create a new round robin tournament in the current room.": "- /tour create <em>format</em>, roundrobin: Maakt een nieuw roundrobintournooi aan in de room.",
	"- /tour end: forcibly end the tournament in the current room": "- /tour end: Be&euml;indigt het huidige toernooi in de room.",
	"- /tour start: start the tournament in the current room": "- /tour start: Start het huidige toernooi in de room.",
	"- /tour banlist [pokemon], [talent], [...]: ban moves, abilities, Pokémon or items from being used in a tournament (it must be created first)": "- /tour banlist [pokemon], [talent], [...]: Verbiedt aanvallen, abilities, Pok&eacute;mon of items in een toernooi (het toernooi moet wel eerst aangemaakt worden).",

	"More detailed help can be found in the <a href=\"https://www.smogon.com/forums/posts/6777489/\">tournaments guide</a>": "Meer details zijn te vinden in de <a href=\"https://www.smogon.com/forums/posts/6777489/\">toernooigids</a>",

	"Your status cannot be updated while you are locked or semilocked.": "Je kunt je status niet veranderen als je gelockt of gesemilockt bent.",
	"Your status is too long; it must be under {MAX} characters.": "Je status is te lang; hij kan maximaal {MAX} karakters bevatten.",
	"Your status contains a banned word.": "Je status bevat een verboden woord.",
	"Your status has been set to: {TARGET}.": "Je status is nu: {TARGET}.",
	"You are now marked as busy.": "Je staat nu als bezig aangegeven.",
	"You are now marked as away. Send a message or use /back to indicate you are back.": "Je staat nu als afwezig aangegeven. Stuur een bericht of typ /back om te laten zien dat je terug bent.",
	"You are already marked as back.": "Je staat al op aanwezig.",
	"You are no longer marked as busy.": "Je staat niet langer als bezig (busy) aangegeven.",

	"You must choose a name before you can talk.": "Je moet eerst een naam kiezen voordat je kunt praten.",
	"You are {LOCKTYPE} and can't talk in chat. {EXPIRATION}": "je bent {LOCKTYPE} en kunt niet in de chat praten. {EXPIRATION}",
	// TRANSLATORS: your lock
	"Get help with this": "Hulp",
	"You are muted and cannot talk in this room.": "Je bent gemutet en kunt niet praten in deze room.",
	"Because moderated chat is set, your account must be at least one week old and you must have won at least one ladder game to speak in this room.": "Omdat modchat aanstaat moet je account minstens een week oud zijn en moet je een laddergevecht hebben gewonnen in deze room te kunnen praten.",
	"Because moderated chat is set, your account must be staff in a public room or have a global rank to speak in this room.": "Omdat modchat aanstaat moet je account een stafrang in een openbare room of een globale rang hebben om in deze room te kunnen praten.",
	"Because moderated chat is set, you must be of rank {GROUP} or higher to speak in this room.": "Omdat modchat aangezet is moet je rang {GROUP} of hoger zijn om in deze room te kunnen praten.",
	"Your message can't be blank.": "Je bericht kan niet blanco zijn.",
	"Your message is too long: ": "Je bericht is te lang: ",
	"Your message contains banned characters.": "Je bericht bevat verboden tekens.",
	"This room has slow-chat enabled. You can only talk once every {SECONDS} seconds.": "Slowchat staat aan in deze room. Je kunt slechts één keer per {SECONDS} seconden een bericht versturen.",
	"Your username contains a phrase banned by this room.": "Je gebruikersnaam bevat een woord dat in deze room verboden is.",
	"Your status message contains a phrase banned by this room.": "Je statusbericht bevat een woord dat in deze room verboden is.",

	"You are {LOCKTYPE} and can only private message members of the global moderation team. {EXPIRATION}": "Je bent {LOCKTYPE} en kunt alleen privéberichten sturen aan globale stafleden.",
	"The user \"{TARGETUSER}\" is locked and cannot be PMed.": "De gebruiker \"{TARGETUSER}\" is gelockt en kan geen privéberichten ontvangen.",
	"On this server, you must be of rank {GROUP} or higher to PM users.": "Op deze server moet je minstens rang {GROUP} zijn om privéberichten te versturen.",
	"This user is blocking private messages right now.": "Deze gebruiker blokkeert momenteel privéberichten.",
	"This {GROUP} is too busy to answer private messages right now. Please contact a different staff member.": "Deze {GROUP} is momenteel te druk om privéberichten te beantwoorden. Neem contact op met een ander staflid.",
	"If you need help, try opening a <a href=\"view-help-request\" class=\"button\">help ticket</a>": "Als je hulp nodig hebt, maak dan een <a href=\"view-help-request\" class=\"button\">hulpticket</a> aan.",
	"You are blocking private messages right now.": "Je blokkeert momenteel privéberichten.",
	"You are blocking challenges right now.": "Je blokkeert momenteel uitdagingen.",

	"Your message contained banned words in this room.": "Je bericht bevat woorden die in deze room verboden zijn.",
	"You can't send the same message again so soon.": "Je kunt hetzelfde bericht niet zo snel nogmaals versturen.",
	"Due to this room being a high traffic room, your message must contain at least two letters.": "Aangezien dit een room is met veel chatverkeer, moet je bericht minstens twee letters bevatten.",

	"You are already blocking private messages! To unblock, use /unblockpms": "Je blokkeert privéberichten al. Typ /unblockpms om privéberichten te deblokkeren",
	"You are now blocking private messages, except from staff and {RANK}.": "Je blokkeert momenteel privéberichten, behalve van staf en {RANK}.",
	"You are now blocking private messages, except from staff and {STATUS} users.": "Je blokkeert momenteel privéberichten, behalve van staf en {STATUS} gebruikers.",
	"You are now blocking private messages, except from staff.": "Je blokkeert momenteel privéberichten, behalve van staf.",
	"You are not blocking private messages! To block, use /blockpms": "Je blokkeert momenteel geen privéberichten. Typ /blockpms om ze te blokkeren",
	"You are no longer blocking private messages.": "Je blokkeert geen privéberichten meer.",
	"You are now blocking all incoming challenge requests.": "Je blokkeert nu alle inkomende uitdagingen.",
	"You are already blocking challenges!": "Je blokkeert uitdagingen al!",
	"You are already available for challenges!": "Je bent al beschikbaar voor uitdagingen!",
	"You are available for challenges from now on.": "Je bent weer beschikbaar voor uitdagingen.",
	"You are now blocking challenges, except from staff and {RANK}.": "Je blokkeert nu uitdagingen, behalve van staff en {RANK}.",
	"You are now blocking challenges, except from staff and {STATUS} users.": "Je blokkeert nu uitdagingen, behalve van staff en {STATUS} gebruikers.",

	"Staff FAQ": "Staff FAQ",
	"You cannot broadcast all FAQs at once.": "Je kunt niet alle FAQ's tegelijk uitzenden.",
	"A user is autoconfirmed when they have won at least one rated battle and have been registered for one week or longer. In order to prevent spamming and trolling, most chatrooms only allow autoconfirmed users to chat. If you are not autoconfirmed, you can politely PM a staff member (staff have %, @, or # in front of their username) in the room you would like to chat and ask them to disable modchat. However, staff are not obligated to disable modchat.": "Een gebruiker is autoconfirmed wanneer hij minstens één beoordeeld gevecht heeft gewonnen en één week of langer is geregistreerd. Om spammen en trollen te voorkomen, laten de meeste chatrooms alleen autoconfirmed gebruikers toe om te chatten. Als je niet autoconfirmed bent, kun je beleefd een PM sturen naar een stafflid (staff hebben %, @, of # voor hun gebruikersnaam) in de room waar je wilt chatten en vragen om modchat uit te schakelen. Echter, staff zijn niet verplicht om modchat uit te schakelen.",
	"How the ladder works": "Hoe de ladder werkt",
	"Tiering FAQ": "Tiering FAQ",
	"Badge FAQ": "Badge FAQ",
	"Common misconceptions about our RNG": "Veelvoorkomende misvattingen over onze RNG",
	"To join a room tournament, click the <strong>Join!</strong> button or type the command <code>/tour join</code> in the room's chat. You can check if your team is legal for the tournament by clicking the <strong>Validate</strong> button once you've joined and selected a team. To battle your opponent in the tournament, click the <strong>Ready!</strong> button when it appears. There are two different types of room tournaments: elimination (if a user loses more than a certain number of times, they are eliminated) and round robin (all users play against each other, and the user with the most wins is the winner).": "Om deel te nemen aan een room toernooi, klik op de <strong>Join!</strong> knop of typ het commando <code>/tour join</code> in de chat van de room. Je kunt controleren of je team legaal is voor het toernooi door op de <strong>Validate</strong> knop te klikken zodra je je hebt aangemeld en een team hebt geselecteerd. Om te vechten tegen je tegenstander in het toernooi, klik op de <strong>Ready!</strong> knop wanneer het verschijnt. Er zijn twee verschillende soorten room toernooien: eliminatie (als een gebruiker meer dan een bepaald aantal keren verliest, worden ze geëlimineerd) en round robin (alle gebruikers spelen tegen elkaar, en de gebruiker met de meeste overwinningen is de winnaar).",
	"Frequently Asked Questions": "Veelgestelde Vragen",

	"Invalid room.": null, // NEEDS TRANSLATION

	"pages/faq": "pages/faq",
	"pages/ladderhelp": "pages/ladderhelp",
	"pages/rng": "pages/rng",
	"pages/staff": "pages/staff",

	"- We log PMs so you can report them - staff can't look at them without permission unless there's a law enforcement reason.": "- We loggen PMs zodat je ze kunt rapporteren - staff kan ze niet bekijken zonder toestemming, tenzij er een wettelijke reden voor is.",
	"- We log IPs to enforce bans and mutes.": "- We loggen IP-adressen om bans en mutes te handhaven.",
	"- We use cookies to save your login info and teams, and for Google Analytics and AdSense.": "- We gebruiken cookies om je login info en teams op te slaan, en voor Google Analytics en AdSense.",
	'- For more information, you can read our <a href="https://{ROOT}/privacy">full privacy policy.</a>': '- Voor meer informatie kun je onze <a href="https://{ROOT}/privacy">volledige privacybeleid</a> lezen.',
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
