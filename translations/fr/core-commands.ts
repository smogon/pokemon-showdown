import type { TranslationCatalog } from '../../server/chat';

export const translations: TranslationCatalog = {
	"Server version: <b>{VERSION}</b>": "Version du serveur : <b>{VERSION}</b>",
	"/mee - must not start with a letter or number": "/mee - ne doit pas commencer avec une lettre ou un nombre",
	"What?! How are you not more excited to battle?! Try /battle! to show me you're ready.": "Quoi ? Comment ça se fait que tu ne sois pas plus content que ça de combattre ? Essaie /battle! pour me montrer que tu es prêt !",
	"Access denied for custom avatar - make sure you're on the right account?": "Accès refusé pour l'avatar personnalisé - es-tu sûr d'être sur le bon compte ?",
	"Invalid avatar.": "Avatar invalide.",
	"Avatar changed to:": "Avatar changé pour :",
	"Artist: ": "Artiste : ",
	"No one has PMed you yet.": "Personne ne t'a encore envoyé de MP.",
	"You forgot the comma.": "Tu as oublié la virgule.",
	"User {TARGETUSER} not found. Did you misspell their name?": "Aucun {TARGETUSER} n'a été trouvé. As-tu bien écrit son pseudo ?",
	"User {TARGETUSER} is offline.": "{TARGETUSER} est hors-ligne.",
	"The user \"{TARGETUSER}\" was not found.": "L'utilisateur \"{TARGETUSER}\" n'a pas été trouvé.",
	"The room \"{TARGET}\" was not found.": "La room \"{TARGET}\" n'a pas été trouvée.",
	"You do not have permission to invite people into this room.": "Tu n'as pas la permission d'inviter des gens dans cette room.",
	"This user is already in \"{ROOM}\".": "Cet utilisateur est déjà sur \"{ROOM}\"",
	"Setting status messages in /busy is no longer supported. Set a status using /status.": "Écrire un statut avec /busy n'est plus possible. Pour le faire, utilise /status.",
	"Setting status messages in /away is no longer supported. Set a status using /status.": "Écrire un statut avec /away n'est plus possible. Pour le faire, utilise /status.",
	"{TARGETUSER} does not have a status set.": "{TARGETUSER} n'a pas de statut actuellement",
	"{TARGETUSER}'s status \"{STATUS}\" was cleared by {USER}{REASON}": "Le statut de {TARGETUSER}, \"{STATUS}\", a été effacé par {USER}{REASON}",
	"You don't have a status message set.": "Tu n'as pas encore de message de statut.",
	"You have cleared your status message.": "Tu as effacé ton message de statut.",
	"This user has not played any ladder games yet.": "Cet utilisateur n'a pas encore fait de combat de ladder.",
	// TRANSLATORS: initial for Wins
	"W": "V",
	// TRANSLATORS: initial for Losses
	"L": "D",
	"You already have the temporary symbol '{GROUP}'.": "Tu as déjà temporairement le symbole '{GROUP}'.",
	"You must specify a valid group symbol.": "Tu dois préciser un symbole de groupe valide.",
	"You may only set a temporary symbol below your current rank.": "Tu ne peux t'attribuer un symbole temporaire que en-dessous de ton rang actuel.",
	"Your temporary group symbol is now": "Ton symbole de groupe temporaire est maintenant",
	"Currently, you're viewing Pokémon Showdown in {LANGUAGE}.": "Actuellement, tu vois Pokémon Showdown en {LANGUAGE}.",
	"Valid languages are: {LANGUAGES}": "Les langues disponibles sont : {LANGUAGES}",
	"Pokémon Showdown will now be displayed in {LANGUAGE} (except in language rooms).": "Pokémon Showdown sera maintenant affiché en {LANGUAGE} (hors chatrooms dédiées à une langue en particulier).",
	"Note that rooms can set their own language, which will override this setting.": "Note que les rooms peuvent choisir la langue dans laquelle elles s'affichent, ce qui aura priorité sur ce changement.",
	"/updatesettings expects JSON encoded object.": "/updatesettings demande un objet codé en JSON.",
	"Unable to parse settings in /updatesettings!": "Incapable d'analyser les paramètres dans /updatesettings!",
	"Must be in a battle.": "Doit être utilisé dans un combat.",
	"User {USER} not found.": "L'utilisateur {USER} n'a pas été trouvé.",
	"Must be a player in this battle.": "Doit être un joueur dans ce match",
	"{TARGETUSER} has not requested extraction.": "{TARGETUSER} n'a pas demandé l'extraction des logs.",
	"You have already consented to extraction with {TARGETUSER}.": "Tu as déjà approuvé l'extraction des logs avec {TARGETUSER}.",
	"{USER} consents to sharing battle team and choices with {TARGETUSER}.": "{USER} est d'accord pour partager son équipe dans le match et ses choix en jeu avec {TARGETUSER}.",
	"No input log found.": "Aucun log de trouvé.",
	"This command only works in battle rooms.": "Cette commande marche seulement en combat.",
	"This command only works when the battle has ended - if the battle has stalled, use /offertie.": "Cette commande marche seulement quand le combat est fini.",
	"Alternatively, you can end the battle with /forcetie.": "Alternativement, tu peux finir le combat avec /forcetie.",
	"{USER} has extracted the battle input log.": "{USER} a extrait le log du combat.",
	"You already extracted the battle input log.": "Tu as déjà extrait le log du combat.",
	"Battle input log re-requested.": "Le log du combat a été demandé de nouveau.",
	"Invalid input log.": "Log invalide.",
	"Your input log contains untrusted code - you must have console access to use it.": "Ton log contient du code non sécurisé - tu dois avoir accès à la console du système pour l'utiliser.",
	"This command can only be used in a battle.": "Cette commande peut seulement être utilisée en match.",
	"Only players can extract their team.": "Seuls les jouerus peuvent extraire leurs équipes.",
	"Use a number between 1-6 to view a specific set.": "Utilise un chiffre entre 1 et 6 pour voir un set spécifique.",
	"The Pokemon \"{TARGET}\" is not in your team.": "Le Pokémon \"{TARGET}\" n'est pas dans ton équipe.",
	"That Pokemon is not in your team.": "Ce Pokémon n'est pas dans ton équipe.",
	"View team": "Voir l'équipe.",
	"Must be in a battle room.": "Doit être en combat.",
	"User {USER} must be in the battle room already.": null, // NEEDS TRANSLATION
	"This server does not allow offering ties.": "Ce serveur ne permet pas les propositions de matchs nuls.",
	"You can't offer ties in tournaments.": "Tu ne peux pas proposer un match nul en tournoi.",
	"It's too early to tie, please play until turn 100.": "C'est trop tôt pour proposer un match nul, merci de jouer jusqu'au tour 100.",
	"No other player is requesting a tie right now. It was probably canceled.": "Aucun joueur ne demande un match nul. La demande a probablement été annulée.",
	"{USER} is offering a tie.": "{USER} propose un match nul.",
	"Accept tie": "Accepter le match nul.",
	"Reject": "Rejeter.",
	"Must be a player to accept ties.": "Tu dois être un des joueurs pour accepter le match nul.",
	"You have already agreed to a tie.": "Tu as déjà accepté le match nul.",
	"{USER} accepted the tie.": "{USER} a accepté le match nul.",
	"All players have accepted the tie.": "Tous les joueurs ont accepté le match nul.",
	"Must be a player to reject ties.": "Tu dois être un des joueurs pour refuser le match nul.",
	"{USER} rejected the tie.": "{USER} a refusé le match nul.",
	"This room doesn't have an active game.": "La room n'a pas de jeu actif.",
	"This kind of game can't be forfeited.": "Il n'est pas possible d'abandonner dans ce genre de jeu.",
	"This game doesn't support /choose": "Ce jeu n'accepte pas /choose.",
	"This game doesn't support /undo": "Ce jeu n'accepte pas /undo.",
	"You can only save replays for battles.": "Tu peux seulement sauvegarder les replays des combats.",
	"This battle can't have hidden replays, because the tournament is set to be forced public.": "Ce combat ne peut pas sauvegarder de replay caché, car le tournoi est paramétré pour être public.",
	"The replay for this battle is already set to hidden.": "Le replay de ce combat est déjà paramétré comme caché.",
	"{USER} hid the replay of this battle.": "{USER} a caché le replay de ce combat.",
	"You can only do this in battle rooms.": "Tu peux seulement faire ça dans les combats.",
	"You can only add a Player to unrated battles.": "Tu ne peux ajouter un autre Joueur que dans les combats non classés.",
	"Player must be set to \"p1\" or \"p2\", not \"{TARGET}\".": "Un Joueur doit être désigné comme \"p1\" ou \"p2\", pas \"{TARGET}\".",
	"This room already has a player in slot {TARGET}.": "Ce combat a déjà un joueur en tant que {TARGET}.",
	"{TARGETUSER} is already a player in this battle.": "{TARGETUSER} est déjà un joueur dans ce match.",
	"Player 2": "Joueur 2",
	"Players could not be restored (maybe this battle already has two players?).": "Les Joueurs n'ont pas pu être remis en place (peut-être que ce combat a déjà deux joueurs ?).",
	"This game doesn't support /joingame": "Ce jeu n'accepte pas /joingame",
	"This game doesn't support /leavegame": "Ce jeu n'accepte pas /leavegame",
	"You can only do this in unrated non-tour battles.": "Tu peux seulement faire ça dans les combats non-classés hors tournois;",
	"{TARGETUSER} was kicked from a battle by {USER} {REASON}": "{TARGETUSER} a été exclu d'un combat par {USER} {REASON}",
	"You can only set the timer from inside a battle room.": "Tu ne peux paramétrer le timer que dans un combat.",
	"This game's timer is managed by a different command.": "Le timer du jeu est géré par une commande différente.",
	"The game timer is OFF.": "Le timer du jeu est OFF.",
	"The game timer is ON (requested by {USER})": "Le timer du jeu est ON (demandé par {USER})",
	"Access denied.": "Accès refusé.",
	"Timer was turned off by staff. Please do not turn it back on until our staff say it's okay.": "Le timer a été désactivé par le staff. Merci de ne pas le réactiver jusqu'à ce que notre staff dise que c'est bon.",
	"The timer is already off.": "Le timer est déjà désactivé.",
	"\"{TARGET}\" is not a recognized timer state.": "\"{TARGET}\" n'est pas un état possible pour le timer.",
	"Forcetimer is now OFF: The timer is now opt-in. (set by {USER})": "Le timer automatique est maintenant désactivé. Le timer est maintenant activable au cas par cas.",
	"Forcetimer is now ON: All battles will be timed. (set by {USER})": "Le timer automatique est maintenant activé. Il démarrera automatiquement au début de tous les combats (activé par {USER}).",
	"'{TARGET}' is not a recognized forcetimer setting.": "{TARGET}' n'est pas un paramètre reconnu pour le timer automatique.",
	"This server requires you to be rank {GROUP} or higher to search for a battle.": "Le serveur demande un rang de {GROUP} ou plus haut pour chercher un match.",
	"Since you have reached {ELO} ELO in {TARGET}, you must register your account to continue playing that format on ladder.": "Maintenant que tu as atteint un ELO de {ELO} en {TARGET}, tu dois enregistrer ton compte pour continuer de jouer ce format en classé.",
	"Register": "Enregistrer son compte",
	"The user '{TARGETUSER}' was not found.": "L'utilisateur '{TARGETUSER}' n'a pas été trouvé.",
	"You are locked and cannot challenge unlocked users. If this user is your friend, ask them to challenge you instead.": "Tu es locked et ne peux pas envoyer de challenge aux utilisateurs qui ne le sont pas.",
	"You are banned from battling and cannot challenge users.": "Tu es banni des combats et ne peux pas envoyer de challenge aux autres utilisateurs",
	"You must choose a username before you challenge someone.": "Tu dois choisir un pseudo avant d'envoyer des challenges aux autres utilisateurs",
	"This server requires you to be rank {GROUP} or higher to challenge users.": "Ce serveur demande d'être au moins {GROUP} ou plus pour envoyer des challenges aux autres utilisateurs.",
	"This command does not support specifying multiple users": "Cette commande ne permet pas de spécifier plusieurs utilisateurs.",
	"Provide a valid format.": "Précise un format valide.",
	"Please provide a valid format.": "Précise un format valide s'il te plaît.",
	"The format '{FORMAT}' was not found.": "Le format '{FORMAT}' n'a pas été trouvé.",
	"Your team is valid for {FORMAT}.": "Ton équipe est valide pour du {FORMAT}",
	"Your team was rejected for the following reasons:": "Ton équipe a été rejetée pour les raisons suivantes :",
	"Battles are now hidden (except to staff) in your trainer card.": "Les combats sont maintenant invisibles (excepté au staff) dans ta carte de Dresseur.",
	"Battles are now visible in your trainer card.": "Les combats sont maintenant visibles dans ta carte de Dresseur.",
	"'{COMMAND}' is a help command.": "{COMMAND}' est une commande d'aide.",
	"The command '/{TARGET}' does not exist.": "La commande '/{TARGET}' n'existe pas.",
	"Could not find help for '/{TARGET}'. Try /help for general help.": "Aucune aide trouvée pour '/{TARGET}'. Essaie /help pour une aide plus générale.",
	"Could not find help for '/{TARGET}' - displaying help for '/{CLOSEST}' instead": "Impossible de trouver de l'aide pour '/{TARGET}' - voici celle pour '/{CLOSEST}' à la place",
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
