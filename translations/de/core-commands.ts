import type { TranslationCatalog } from '../../server/chat';

export const translations: TranslationCatalog = {
	"Server version: <b>{VERSION}</b>": "Server-Version: <b>{VERSION}</b>",
	"/mee - must not start with a letter or number": "/mee - darf nicht mit einem Buchstaben oder einer Zahl anfangen",
	"What?! How are you not more excited to battle?! Try /battle! to show me you're ready.": "Wie bitte?! Wie kannst du dich nicht über einen Kampf freuen?! Sobald du bereit bist, benutze den Befehl /battle!",
	"Access denied for custom avatar - make sure you're on the right account?": "Zugriff auf einen Custom Avatar verweigert - bitte stelle sicher, dass du den richtigen Account verwendest.",
	"Invalid avatar.": "Ungültiger Avatar.",
	"Avatar changed to:": "Avatar geändert zu:",
	"Artist: ": "Ersteller: ",
	"No one has PMed you yet.": "Niemand hat dir bisher eine private Nachricht geschrieben.",
	"You forgot the comma.": "Du hast das Komma vergessen.",
	"User {TARGETUSER} not found. Did you misspell their name?": "Der Nutzer {TARGETUSER} wurde nicht gefunden. Hast du den Namen falsch geschrieben?",
	"User {TARGETUSER} is offline.": "Der Nutzer {TARGETUSER} ist offline.",
	"The user \"{TARGETUSER}\" was not found.": "Der Nutzer \"{TARGETUSER}\" wurde nicht gefunden.",
	"The room \"{TARGET}\" was not found.": "Der Raum \"{TARGET}\" wurde nicht gefunden.",
	"You do not have permission to invite people into this room.": "Du hast keine Berechtigung, Nutzer in diesen Raum einzuladen.",
	"This user is already in \"{ROOM}\".": "Dieser Nutzer ist bereits in \"{ROOM}\".",
	"Setting status messages in /busy is no longer supported. Set a status using /status.": "Es ist nicht mehr möglich, eine Statusmeldung mit /busy einzustellen. Stelle eine Statusmeldung mit /status ein.",
	"Setting status messages in /away is no longer supported. Set a status using /status.": "Es ist nicht mehr möglich, eine Statusmeldung mit /away einzustellen. Stelle eine Statusmeldung mit /status ein.",
	"{TARGETUSER} does not have a status set.": "{TARGETUSER} hat keine Statusmeldung eingestellt.",
	"{TARGETUSER}'s status \"{STATUS}\" was cleared by {USER}{REASON}": "Die Statusmeldung \"{STATUS}\" von {TARGETUSER} wurde von {USER}{REASON} entfernt",
	"You don't have a status message set.": "Du hast keine Statusmeldung eingestellt.",
	"You have cleared your status message.": "Du hast deine Statusmeldung entfernt.",
	"This user has not played any ladder games yet.": "Dieser Nutzer hat noch keine Ladder-Kämpfe bestritten.",
	// TRANSLATORS: initial for Wins
	"W": "S",
	// TRANSLATORS: initial for Losses
	"L": "N",
	"You already have the temporary symbol '{GROUP}'.": "Du hast bereits das vorübergehende Symbol '{GROUP}'.",
	"You must specify a valid group symbol.": "Du musst ein gültiges Gruppensymbol angeben.",
	"You may only set a temporary symbol below your current rank.": "Du darfst nur ein vorübergehendes Symbol einstellen, welches unter deinem derzeitigen Rang ist.",
	"Your temporary group symbol is now": "Dein vorübergehendes Gruppensymbol ist jetzt",
	"Currently, you're viewing Pokémon Showdown in {LANGUAGE}.": "Derzeit wird Pokémon Showdown in {LANGUAGE} angezeigt.",
	"Valid languages are: {LANGUAGES}": "Gültige Sprachen sind: {LANGUAGES}",
	"Pokémon Showdown will now be displayed in {LANGUAGE} (except in language rooms).": "Pokémon Showdown wird jetzt in {LANGUAGE} angezeigt (außer in Sprachräumen).",
	"Note that rooms can set their own language, which will override this setting.": "Bitte beachte, dass Räume ihre eigene Sprache einstellen können, welche diese Einstellung überschreibt.",
	"/updatesettings expects JSON encoded object.": "/updatesettings verlangt ein Objekt, welches in JSON verschlüsselt ist.",
	"Unable to parse settings in /updatesettings!": "Es ist nicht möglich, die Einstellungen in /updatesettings zu analysieren!",
	"Must be in a battle.": "Muss in einem Kampf sein.",
	"User {USER} not found.": "Nutzer {USER} wurde nicht gefunden.",
	"Must be a player in this battle.": "Muss ein Spieler in diesem Kampf sein.",
	"{TARGETUSER} has not requested extraction.": "{TARGETUSER} hat keine Extraktion angefordert.",
	"You have already consented to extraction with {TARGETUSER}.": "Du hast bereits einer Extraktion mit {TARGETUSER} zugestimmt.",
	"{USER} consents to sharing battle team and choices with {TARGETUSER}.": "{USER} gibt das Einverständnis, das Kampf-Team und die Entscheidungen mit {TARGETUSER} zu teilen.",
	"No input log found.": "Kein Input-Protokoll wurde gefunden.",
	"This command only works in battle rooms.": "Dieser Befehl funktioniert nur in Kampfräumen.",
	"This command only works when the battle has ended - if the battle has stalled, use /offertie.": "Dieser Befehl funktioniert nur, sobald der Kampf beendet wurde - falls der Kampf hinausgezögert wird, benutze /offertie",
	"Alternatively, you can end the battle with /forcetie.": "Alternativ kannst du den Kampf mit /forcetie beenden.",
	"{USER} has extracted the battle input log.": "{USER} hat das Input-Protokoll des Kampfes extrahiert.",
	"You already extracted the battle input log.": "Du hast bereits das Input-Protokoll des Kampfes extrahiert.",
	"Battle input log re-requested.": "Input-Protokoll des Kampfes wurde nochmal angefordert.",
	"Invalid input log.": "Ungültiges Input-Protokoll.",
	"Your input log contains untrusted code - you must have console access to use it.": "Dein Input-Protokoll enthält einen nicht vertrauenswürdigen Code - du musst Zugriff auf die Konsole haben, um es zu benutzen.",
	"This command can only be used in a battle.": "Dieser Befehl kann nur in einem Kampf benutzt werden.",
	"Only players can extract their team.": "Nur Spieler können ihre Teams extrahieren.",
	"Use a number between 1-6 to view a specific set.": "Benutze eine Nummer zwischen 1-6, um ein bestimmtes Set einzusehen.",
	"The Pokemon \"{TARGET}\" is not in your team.": "Das Pokemon \"{TARGET}\" ist nicht in deinem Team.",
	"That Pokemon is not in your team.": "Dieses Pokemon ist nicht in deinem Team.",
	"View team": "Team einsehen",
	"Must be in a battle room.": "Muss in einem Kampfraum sein.",
	"User {USER} must be in the battle room already.": null, // NEEDS TRANSLATION
	"This server does not allow offering ties.": "Dieser Server unterstützt es nicht, Unentschieden anzubieten.",
	"You can't offer ties in tournaments.": "Du kannst keine Unentschieden in einem Turnier anbieten.",
	"It's too early to tie, please play until turn 100.": "Es ist noch zu früh, um ein Unentschieden anzubieten, bitte warte bis Zug 100.",
	"No other player is requesting a tie right now. It was probably canceled.": "Kein Spieler fordert gerade ein Unentschieden an. Wahrscheinlich wurde es abgebrochen.",
	"{USER} is offering a tie.": "{USER} bietet ein Unentschieden an.",
	"Accept tie": "Unentschieden akzeptieren",
	"Reject": "Ablehnen",
	"Must be a player to accept ties.": "Muss ein Spieler sein, um Unentschieden zu akzeptieren.",
	"You have already agreed to a tie.": "Du hast bereits einem Unentschieden zugestimmt.",
	"{USER} accepted the tie.": "{USER} hat das Unentschieden angenommen.",
	"All players have accepted the tie.": "Alle Spieler haben einem Unentschieden zugestimmt.",
	"Must be a player to reject ties.": "Muss ein Spieler sein, um Unentschieden abzulehnen.",
	"{USER} rejected the tie.": "{USER} hat das Unentschieden abgelehnt.",
	"This room doesn't have an active game.": " In diesem Raum findet kein aktiver Kampf statt.",
	"This kind of game can't be forfeited.": "In diesem Kampf kann man nicht aufgeben.",
	"This game doesn't support /choose": "Dieses Spiel unterstützt nicht /choose",
	"This game doesn't support /undo": "Dieses Spiel unterstützt nicht /undo",
	"You can only save replays for battles.": "Du kannst nur Replays für Kämpfe speichern.",
	"This battle can't have hidden replays, because the tournament is set to be forced public.": "Dieser Kampf unterstützt keine verborgenen Replays, da das Turnier so eingestellt wurde, dass alle Kämpfe öffentlich sind.",
	"The replay for this battle is already set to hidden.": "Das Replay dieses Kampfes wurde bereits verborgen.",
	"{USER} hid the replay of this battle.": "{USER} hat das Replay dieses Kampfes verborgen.",
	"You can only do this in battle rooms.": "Du kannst dies nur in Kampfräumen machen.",
	"You can only add a Player to unrated battles.": "Du kannst einen Spieler ausschließlich in Unrated-Kämpfen hinzufügen.",
	"Player must be set to \"p1\" or \"p2\", not \"{TARGET}\".": "Spieler müssen zu \"p1\" oder \"p2\" zugeordnet werden, nicht \"{TARGET}\".",
	"This room already has a player in slot {TARGET}.": "Dieser Raum besitzt bereits einen Spieler in Slot {TARGET}",
	"{TARGETUSER} is already a player in this battle.": "{TARGETUSER} ist bereits ein Spieler in diesem Kampf.",
	"Player 2": "Spieler 2",
	"Players could not be restored (maybe this battle already has two players?).": "Spieler konnten nicht wiederhergestellt werden (vielleicht hat dieser Kampf bereits zwei Spieler?).",
	"This game doesn't support /joingame": "Dieses Spiel unterstützt nicht /joingame",
	"This game doesn't support /leavegame": "Dieses Spiel unterstützt nicht /leavegame",
	"You can only do this in unrated non-tour battles.": "Du kannst dies nur in einem Unrated-Kampf machen, welcher nicht Teil eines Turniers ist.",
	"{TARGETUSER} was kicked from a battle by {USER} {REASON}": "{TARGETUSER} wurde aus dem Kampf von {USER} gekickt {REASON}",
	"You can only set the timer from inside a battle room.": "Du kannst den Timer nur innerhalb eines Kampfraumes einstellen.",
	"This game's timer is managed by a different command.": "Der Timer dieses Kampfes wird mit einem anderen Befehl gesteuert.",
	"The game timer is OFF.": "Der Timer des Kampfes ist ausgeschaltet.",
	"The game timer is ON (requested by {USER})": "Der Timer des Kampfes ist eingeschaltet (von {USER} angefordert)",
	"Access denied.": "Zugriff verweigert",
	"Timer was turned off by staff. Please do not turn it back on until our staff say it's okay.": "Der Timer wurde vom Staff ausgeschaltet. Bitte schalte diesen nicht wieder ein, außer der Staff wünscht es.",
	"The timer is already off.": "Der Timer ist bereits ausgeschaltet.",
	"\"{TARGET}\" is not a recognized timer state.": "\"{TARGET}\" ist kein erkannter Zeitwert.",
	"Forcetimer is now OFF: The timer is now opt-in. (set by {USER})": "Der Forcetimer ist jetzt ausgeschaltet: Der Timer kann nur noch mit entsprechender Einwilligung eingeschaltet werden. (eingestellt von {USER})",
	"Forcetimer is now ON: All battles will be timed. (set by {USER})": "Der Forcetimer ist jetzt eingeschaltet: Alle Kämpfe unterstehen einem Timer. (eingestellt von {USER})",
	"'{TARGET}' is not a recognized forcetimer setting.": "'{TARGET}' ist keine erkannte Einstellung bezüglich des Forcetimers.",
	"This server requires you to be rank {GROUP} or higher to search for a battle.": "Dieser Server erfordert es, Rang {GROUP} oder höher zu sein, um nach Kämpfen zu suchen.",
	"Since you have reached {ELO} ELO in {TARGET}, you must register your account to continue playing that format on ladder.": "Da du {ELO} ELO in {TARGET} erreicht hast, musst du deinen Account registrieren, um weiterhin dieses Format auf der Ladder spielen zu können.",
	"Register": "Registrieren",
	"The user '{TARGETUSER}' was not found.": "Der Nutzer '{TARGETUSER}' wurde nicht gefunden.",
	"You are locked and cannot challenge unlocked users. If this user is your friend, ask them to challenge you instead.": "Du bist gesperrt und kannst andere Nutzer nicht zu einem Kampf herausfordern.",
	"You are banned from battling and cannot challenge users.": "Du bist davon ausgeschlossen, Kämpfe zu bestreiten und kannst keine anderen Nutzer herausfordern.",
	"You must choose a username before you challenge someone.": "Du musst einen Nutzernamen haben, bevor du jemanden herausforderst.",
	"This server requires you to be rank {GROUP} or higher to challenge users.": "Dieser Server erfordert es, Rang {GROUP} oder höher zu sein, um Nutzer herauszufordern.",
	"This command does not support specifying multiple users": "Dieser Befehl unterstützt es nicht, mehrere Nutzer anzugeben.",
	"Provide a valid format.": "Gib ein gültiges Format an.",
	"Please provide a valid format.": "Bitte gib ein gültiges Format an.",
	"The format '{FORMAT}' was not found.": "Das Format '{FORMAT}' wurde nicht gefunden.",
	"Your team is valid for {FORMAT}.": "Dein Team ist gültig für {FORMAT}.",
	"Your team was rejected for the following reasons:": "Dein Team wurde aus folgenden Gründen abgelehnt:",
	"Battles are now hidden (except to staff) in your trainer card.": "Kämpfe werden jetzt in deiner Trainer-Karte verborgen (außer vom Staff).",
	"Battles are now visible in your trainer card.": "Kämpfe sind jetzt in deiner Trainer-Karte öffentlich.",
	"'{COMMAND}' is a help command.": "'{COMMAND}' ist ein informativer Befehl.",
	"The command '/{TARGET}' does not exist.": "Der Befehl '/{TARGET}' existiert nicht.",
	"Could not find help for '/{TARGET}'. Try /help for general help.": "Es konnten keine Hilfestellungen für '/{TARGET}' gefunden werden. Benutze /help um eine allgemeine Hilfestellung zu erhalten.",
	"Could not find help for '/{TARGET}' - displaying help for '/{CLOSEST}' instead": "Es konnten keine Hilfestellungen für '/{TARGET}' gefunden werden - stattdessen wird eine Hilfestellung für '/{CLOSEST}' angezeigt.",
	"Server version: <b>{VERSION}": null, // NEEDS TRANSLATION
	"User {TARGETUSER} is offline. Send the message again to confirm. If you are using /msg, use /offlinemsg instead.": null, // NEEDS TRANSLATION
	"You are already blocking {PREFIX}private messages! To unblock, use /unblockpms": null, // NEEDS TRANSLATION
	"You are now blocking {PREFIX}private messages, except from staff and {TARGET}.": null, // NEEDS TRANSLATION
	"You are now blocking {PREFIX}private messages, except from staff, friends, and {TARGET} users.": null, // NEEDS TRANSLATION
	"You are now blocking {PREFIX}private messages, except from staff and friends.": null, // NEEDS TRANSLATION
	"You are now blocking {PREFIX}private messages, except from staff.": null, // NEEDS TRANSLATION
	"You are not blocking {PREFIX}private messages! To block, use /blockpms": null, // NEEDS TRANSLATION
	"You are no longer blocking {PREFIX}private messages.": null, // NEEDS TRANSLATION
	"You are now blocking room invites, except from staff and {TARGET}.": null, // NEEDS TRANSLATION
	"You are now blocking room invites, except from staff and {TARGET} users.": null, // NEEDS TRANSLATION
	"You are now blocking room invites, except from staff.": null, // NEEDS TRANSLATION
	"Format": null, // NEEDS TRANSLATION
	"You are not a player and don't have a team.": null, // NEEDS TRANSLATION
	"You don't have a Pokémon matching \"{TARGET}\" in your team.": null, // NEEDS TRANSLATION
	"You don't have a Pokémon #{NUMBER} on your team - your team only has {COUNT} Pokémon.": null, // NEEDS TRANSLATION
	"Must be a player to agree to open team sheets.": null, // NEEDS TRANSLATION
	"This format does not allow requesting open team sheets. You can both manually agree to it by using !showteam hidestats.": null, // NEEDS TRANSLATION
	"You cannot agree to open team sheets after Team Preview. Each player can still show their own sheet by using this command: !showteam hidestats": null, // NEEDS TRANSLATION
	"An opponent has already rejected open team sheets.": null, // NEEDS TRANSLATION
	"You have already made your decision about agreeing to open team sheets.": null, // NEEDS TRANSLATION
	"{USER} has agreed to open team sheets.": null, // NEEDS TRANSLATION
	"Must be a player to reject open team sheets.": null, // NEEDS TRANSLATION
	"This format does not allow requesting open team sheets.": null, // NEEDS TRANSLATION
	"You cannot reject open team sheets after Team Preview.": null, // NEEDS TRANSLATION
	"{USER} rejected open team sheets.": null, // NEEDS TRANSLATION
	"The user '{USER}' is not accepting challenges right now.": null, // NEEDS TRANSLATION
	"'/{TARGET}' is a help command.": null, // NEEDS TRANSLATION
	"{USER} wants to extract the battle input log.": null, // NEEDS TRANSLATION
	"{TARGETUSER} was kicked from a battle by {USER}.{REASON}": null, // NEEDS TRANSLATION
	"unlocked": null, // NEEDS TRANSLATION
	"friended": null, // NEEDS TRANSLATION

};
