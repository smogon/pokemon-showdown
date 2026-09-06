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

	"namelocked": "namelocked",
	"locked": "locked",

	"autoconfirmed": "autoconfirmed",
	"trusted": "विश्वसनीय",

	"Please follow the rules:": "कृपया इन नियमों का पालन करें:",
	// TRANSLATORS: Link to the PS rules for your language (path after pokemonshowdown.com
	"/rules": "/pages/rules-hi",
	"Global Rules": "सामान्य नियम",
	"{ROOM} room rules": "{ROOM} Room के नियम",

	"<strong>Global ranks</strong>": "<strong>वैश्विक पद</strong>",
	"+ <strong>Global Voice</strong> - They can use ! commands like !groups": "+ <strong>वैश्विक Voice</strong> - ये लोग '!' commands का इस्तेमाल कर सकते हैं, जैसे की !groups",
	"% <strong>Global Driver</strong> - Like Voice, and they can lock users and check for alts": "% <strong>वैश्विक Driver</strong> - ये लोग ऊपर की चीज़ें और उसके अलावा lock या alt भी जाँच सकते हैं",
	"@ <strong>Global Moderator</strong> - The above, and they can globally ban users": "@ <strong>वैश्विक Moderator</strong> - ये लोग ऊपर की चीज़ें और उसके अलावा वैश्विक स्तर पे ban भी कर सकते हैं",
	"* <strong>Global Bot</strong> - An automated account that can use HTML anywhere": null, // NEEDS TRANSLATION
	"* <strong>Global Bot</strong> - Like Moderator, but makes it clear that this user is a bot": "* <strong>वैश्विक Bot</strong> - Moderator जैसा पर केवल Bots के लिए",
	"~ <strong>Global Administrator</strong> - They can do anything, like change what this message says and promote users globally": "~ <strong>वैश्विक Administrator</strong> - ये लोग कुछ भी कर सकते हैं, जैसे की इस सन्देश को बदलना",

	"<strong>Room ranks</strong>": "<strong>रूम के पद</strong>",
	"^ <strong>Prize Winner</strong> - They don't have any powers beyond a symbol.": null,
	"+ <strong>Voice</strong> - They can use ! commands like !groups": "+ <strong>Voice</strong> - ये लोग '!' commands का इस्तेमाल कर सकते हैं, जैसे की !groups",
	"% <strong>Driver</strong> - The above, and they can mute and warn": "% <strong>Driver</strong> - ये लोग ऊपर की चीज़ें और उसके अलावा mute और warn भी कर सकते हैं",
	"@ <strong>Moderator</strong> - The above, and they can room ban users": "@ <strong>Moderator</strong> - ये लोग ऊपर की चीज़ें और उसके अलावा room ban भी कर सकते हैं",
	"* <strong>Bot</strong> - An automated account that can mute, warn, and use HTML": null, // NEEDS TRANSLATION
	"* <strong>Bot</strong> - Like Moderator, but makes it clear that this user is a bot": "* <strong>Bot</strong> - Moderator जैसा पर केवल Bots के लिए",
	"# <strong>Room Owner</strong> - They are leaders of the room and can almost totally control it": "# <strong>Room Owner</strong> - ये लोग room के leader हैं और रूम लगभग पूरी तरह इनके अधीन है",

	"/help OR /h OR /? - Gives you help.": "/help या /h या /? - आपको सहायता दे.",
	"For an overview of room commands, use /roomhelp": "Room के कमांड्स के सारांश के लिए, /roomhelp उपयोग करें",
	"For details of a specific command, use something like: /help data": "किसी खास कमांड के विवरण के लिए, कुछ ऐसे करें: /help data",

	"COMMANDS": "कमांड",
	"BATTLE ROOM COMMANDS": "मुकाबले के कमांड",
	"OPTION COMMANDS": "विकल्पों के कमांड",
	"INFORMATIONAL/RESOURCE COMMANDS": "सूचनात्मक/संसाधन संबंधी कमांड",
	"DATA COMMANDS": "डेटा संबंधी कमांड",
	"DRIVER COMMANDS": "Drivers के कमांड",
	"MODERATOR COMMANDS": "Moderators के कमांड",
	"ADMIN COMMANDS": "Administrators के कमांड",

	"(replace / with ! to broadcast. Broadcasting requires: + % @ # ~)": "(प्रसारित करने के लिए / को ! से बदलें. प्रसारण के लिए आवश्यक पद: + % @ # ~) ",

	"<strong>Room punishments</strong>:": "<strong>Room के दंड</strong>:",
	"<strong>warn</strong> - Displays a popup with the rules.": "<strong>warn</strong> - नियमों का एक popup दिखाता है.",
	"<strong>mute</strong> - Mutes a user (makes them unable to talk) for 7 minutes.": "<strong>mute</strong> - 7 मिनटों के लिए उपयोगकर्ता को चुप (बातचीत में असमर्थ) करता है.",
	"<strong>hourmute</strong> - Mutes a user for 60 minutes.": "<strong>hourmute</strong> - 60 मिनटों के लिए उपयोगकर्ता को चुप करता है.",
	"<strong>ban</strong> - Bans a user (makes them unable to join the room) for 2 days.": "<strong>ban</strong> - 2 दिन के लिए उपयोगकर्ता को निष्कासित (room से जुड़ने में असमर्थ) करता है.",
	"<strong>weekban</strong> - Bans a user from the room for a week.": "<strong>weekban</strong> - एक सप्ताह के लिए उपयोगकर्ता को निष्कासित (room से जुड़ने में असमर्थ) करता है.",
	"<strong>blacklist</strong> - Bans a user for a year.": "<strong>blacklist</strong> - साल भर के लिए उपयोगकर्ता को निष्कासित करता है.",

	"<strong>Global punishments</strong>:": "<strong>वैश्विक दंड</strong>:",
	"<strong>lock</strong> - Locks a user (makes them unable to talk in any rooms or PM non-staff) for 2 days.": "<strong>lock</strong> - 2 दिन के लिए उपयोगकर्ता को lock (rooms और गैर-स्टाफ के PMs में बातचीत में असमर्थ) करता है.",
	"<strong>weeklock</strong> - Locks a user for a week.": "<strong>weeklock</strong> - एक सप्ताह के लिए उपयोगकर्ता को lock करता है.",
	"<strong>namelock</strong> - Locks a user and prevents them from having a username for 2 days.": "<strong>namelock</strong> - उपभोगकर्ता को लॉक करे और 2 दिन के लिए वो नाम रखने से रोकता है.",
	"<strong>globalban</strong> - Globally bans (makes them unable to connect and play games) for a week.": "<strong>globalban</strong> - एक सप्ताह के लिए वैश्विक तौर पे निष्कासित करता (connect और खेलने होने से रोकता) है.",

	"<strong>Indefinite global punishments</strong>:": "<strong>अनिश्चितकालीन वैश्विक दंड</strong>:",
	"<strong>permalock</strong> - Issued for repeated instances of bad behavior and is rarely the result of a single action. ": "<strong>permalock</strong> - लगातार बुरे व्यवहार के लिए मिलने वाला दंड. तीन माह तक किसी भी दुर्व्यवहार से दूर रहने के बाद ही इसे ",
	'These can be appealed in the <a href="https://www.smogon.com/forums/threads/discipline-appeal-rules.3583479/">Discipline Appeal</a>': '<a href="https://www.smogon.com/forums/threads/discipline-appeal-rules.3583479/">Discipline Appeal</a> forum पर अपील कर सकते हैं.',
	" forum after at least 3 months without incident.": null,
	"<strong>permaban</strong> - Unappealable global ban typically issued for the most severe cases of offensive/inappropriate behavior.": "<strong>permaban</strong> - सबसे गंभीर मामलों के लिए मिला हुआ स्थाई निष्काशन. ये दंड अपील के लिए अयोग्य है.",

	"<strong>Room drivers (%)</strong> can use:": "<strong>Room driver (%)</strong> उपयोग कर सकते हैं:",
	"- /warn OR /k <em>username</em>: warn a user and show the Pok&eacute;mon Showdown rules": "- /warn या /k <em>username</em>: उपयोगकर्ता को चेतावनी दे और Pok&eacute;mon Showdown के नियम दिखाए",
	"- /mute OR /m <em>username</em>: 7 minute mute": "- /mute या /m <em>username</em>: 7 मिनट का mute",
	"- /hourmute OR /hm <em>username</em>: 60 minute mute": "- /hourmute या /hm <em>username</em>: 60 मिनट का mute",
	"- /unmute <em>username</em>: unmute": "- /unmute <em>username</em>: mute हटाए",
	"- /hidetext <em>username</em>: hide a user's messages from the room": "- /hidetext <em>username</em>: room में उपयोगकर्ता के सन्देश छुपाये",
	"- /announce OR /wall <em>message</em>: make an announcement": "- /announce या /wall <em>सन्देश</em>: घोषणा करे",
	"- /modlog <em>username</em>: search the moderator log of the room": "- /modlog <em>username</em>: room के moderator log में खोजे",
	"- /modnote <em>note</em>: add a moderator note that can be read through modlog": "- /modnote <em>टिप्पणी</em>: एक moderator टिप्पणी डाले जो की modlog में पढ़ी जा सकती है",

	"<strong>Room moderators (@)</strong> can also use:": "<strong>Room moderator (@)</strong> इनका भी उपयोग कर सकते हैं:",
	"- /roomban OR /rb <em>username</em>: ban user from the room": "- /roomban या /rb <em>username</em>: उपयोगकर्ता को room से निष्कासित करे",
	"- /roomunban <em>username</em>: unban user from the room": "- /roomunban <em>username</em>: उपयोगकर्ता को room में अनिष्कासित करे",
	"- /roomvoice <em>username</em>: appoint a room voice": "- /roomvoice <em>username</em>: room voice नियुक्त करे",
	"- /roomdevoice <em>username</em>: remove a room voice": "- /roomdevoice <em>username</em>: room voice हटाए",
	"- /staffintro <em>intro</em>: set the staff introduction that will be displayed for all staff joining the room": "- /staffintro <em>intro</em>: staff के लिए परिचय सन्देश रखे, जो की हर जुड़ने वाले staff को दिखेगा.",
	"- /roomsettings: change a variety of room settings, namely modchat": "- /roomsettings: room के विविध सेटिंग बदले, यानी modchat.",

	"<strong>Room owners (#)</strong> can also use:": "<strong>Room owners (#)</strong> इनका भी उपयोग कर सकते हैं:",
	"- /roomintro <em>intro</em>: set the room introduction that will be displayed for all users joining the room": "- /roomintro <em>intro</em>: room के लिए परिचय सन्देश रखे, जो की हर जुड़ने वाले उपयोगकर्ता को दिखेगा.",
	"- /rules <em>rules link</em>: set the room rules link seen when using /rules": "- /rules <em>नियमों का लिंक</em>: room के नियमों का लिंक रखे जो की /rules से देखा जा सकता है",
	"- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver": "- /roommod, /roomdriver <em>username</em>: room moderador/driver नियुक्त करे",
	"- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver": "- /roomdemod, /roomdedriver <em>username</em>: room moderador/driver हटाए",
	"- /roomdeauth <em>username</em>: remove all room auth from a user": "- /roomdeauth <em>username</em>: उपयोगकर्ता को room के सभी पदों से हटाए",
	"- /declare <em>message</em>: make a large blue declaration to the room": "- /declare <em>सन्देश</em>: room में एक बड़ा नीला ऐलान करे",
	"- !htmlbox <em>HTML code</em>: broadcast a box of HTML code to the room": "- !htmlbox <em>HTML code</em>: room में HTML code के एक डब्बे को प्रसारित करे",
	"- !showimage <em>[url], [width], [height]</em>: show an image to the room": "- !showimage <em>[url], [width], [height]</em>: room में एक चित्र प्रदर्शित करे",
	"- !show [image or youtube link]: display given media in chat.": null, // NEEDS TRANSLATION
	"- /whitelist [user]: whitelist a non-staff user to use !show.": null, // NEEDS TRANSLATION
	"- /unwhitelist [user]: removes the user from !show whitelist.": null, // NEEDS TRANSLATION
	"- /roomsettings: change a variety of room settings, including modchat, capsfilter, etc": "- /roomsettings: room के विविध सेटिंग बदले, जैसे की  modchat, capsfilter आदि",

	"More detailed help can be found in the <a href=\"https://www.smogon.com/forums/posts/6774654/\">roomauth guide</a>": "और ज्यादा विस्तृत सहायता <a href=\"https://www.smogon.com/forums/posts/6774654/\">roomauth guide</a> में मिल सकती है",

	"Tournament Help:": "Tournament से जुड़ी सहायता:",
	"- /tour create <em>format</em>, elimination: create a new single elimination tournament in the current room.": "- /tour create <em>प्रारूप</em>, elimination: room में एक नया सिंगल एलिमिनेशन टूर बनाये.",
	"- /tour create <em>format</em>, roundrobin: create a new round robin tournament in the current room.": "- /tour create <em>प्रारूप</em>, roundrobin: room में एक नया round robin टूर बनाये.",
	"- /tour end: forcibly end the tournament in the current room": "- /tour end: room में जबरदस्ती टूर ख़त्म करे",
	"- /tour start: start the tournament in the current room": "- /tour start: room में टूर शुरू करे",
	"- /tour banlist [pokemon], [talent], [...]: ban moves, abilities, Pokémon or items from being used in a tournament (it must be created first)": "- /tour banlist [pokemon], [talent], [...]: टूर के लिए हमले, ability, Pokémon, या सामान प्रतिबंधित करे (टूर पहले बना होना चाहिए)",

	"More detailed help can be found in the <a href=\"https://www.smogon.com/forums/posts/6777489/\">tournaments guide</a>": "और ज्यादा विस्तृत सहायता <a href=\"https://www.smogon.com/forums/posts/6777489/\">tournaments guide</a> में मिल सकती है",

	"Your status cannot be updated while you are locked or semilocked.": "जब आप lock या semilock हों तब आप status नहीं बदल सकते.",
	"Your status is too long; it must be under {MAX} characters.": "आपका status बहुत बड़ा है; ये अधिकतम {MAX} अक्षर का हो सकता है.",
	"Your status contains a banned word.": "आपके status में एक प्रतिबंधित शब्द है.",
	"Your status has been set to: {TARGET}.": "आपका status अब ये है : {TARGET}.",
	"You are now marked as busy.": "आपको अब busy (व्यस्त) मार्क कर दिया गया है.",
	"You are now marked as away. Send a message or use /back to indicate you are back.": "आपको away (दूर) मार्क कर दिया गया है. अपनी वापसी दर्शाने के लिए एक सन्देश भेजें या /back का उपयोग करें.",
	"You are already marked as back.": "आप पहले से ही (back) मुक्त चिह्नित हैं.",
	"You are no longer marked as busy.": "अब आप (busy) व्यस्त चिन्हित नहीं हैं.",

	"You must choose a name before you can talk.": "बात करने के लिए एक नाम चुनें.",
	"You are {LOCKTYPE} and can't talk in chat. {EXPIRATION}": "आप {LOCKTYPE} हैं और बात नहीं कर सकते हैं. {EXPIRATION}",
	// TRANSLATORS: your lock
	"Get help with this": "इसके लिए सहायता",
	"You are muted and cannot talk in this room.": "आप इस room में muted हैं और बातचीत नही कर सकते",
	"Because moderated chat is set, your account must be at least one week old and you must have won at least one ladder game to speak in this room.": "क्योंकि chat सयंमित है, बात करने के लिए आपका खाता कम से कम एक सप्ताह पुराना और कम से कम एक मुकाबले का विजेता होना चाहिए.",
	"Because moderated chat is set, your account must be staff in a public room or have a global rank to speak in this room.": "क्योंकि chat सयंमित है, बात करने के लिए आपका खाता वैश्विक पद या सार्वजनिक room में staff होना चाहिए.",
	"Because moderated chat is set, you must be of rank {GROUP} or higher to speak in this room.": "क्योंकि chat सयंमित है, बात करने के लिए आपका पद {GROUP} या उससे ऊँचा होना चाहिए.",
	"Your message can't be blank.": "आपका सन्देश खाली नहीं होना चाहिए.",
	"Your message is too long: ": "आपका सन्देश बहुत लम्बा है.",
	"Your message contains banned characters.": "आपके सन्देश में प्रतिबंधित अक्षर हैं.",
	"This room has slow-chat enabled. You can only talk once every {SECONDS} seconds.": "इस room में slow-chat चालू है. आप केवल हर {SECONDS} seconds पर बात कर सकते हैं",
	"Your username contains a phrase banned by this room.": "आपके नाम में इस room का एक प्रतिबंधित शब्द है.",
	"Your status message contains a phrase banned by this room.": "आपके status में इस room का एक प्रतिबंधित शब्द है.",

	"You are {LOCKTYPE} and can only private message members of the global moderation team. {EXPIRATION}": null,
	"The user \"{TARGETUSER}\" is locked and cannot be PMed.": null,
	"On this server, you must be of rank {GROUP} or higher to PM users.": null,
	"This user is blocking private messages right now.": null,
	"This {GROUP} is too busy to answer private messages right now. Please contact a different staff member.": null,
	"If you need help, try opening a <a href=\"view-help-request\" class=\"button\">help ticket</a>": null,
	"You are blocking private messages right now.": null,
	"You are blocking challenges right now.": null,

	"Your message contained banned words in this room.": "आपके सन्देश में इस room का एक प्रतिबंधित शब्द है.",
	"You can't send the same message again so soon.": "आप एक ही सन्देश इतनी जल्दी दोबारा नहीं भेज सकते.",
	"Due to this room being a high traffic room, your message must contain at least two letters.": "क्योंकि ये एक तीव्र गतिविधि वाला room है, आपके सन्देश में कम से कम दो अक्षर रहने जरूरी हैं.",

	"You are already blocking private messages! To unblock, use /unblockpms": "आप पहले से ही निजी सन्देश रोक रहे हैं! खोलने के लिए /unblockpms उपयोग करें.",
	"You are now blocking private messages, except from staff and {RANK}.": "अब आप staff और {RANK} को छोड़ कर सबके लिए निजी सन्देश रोक रहे हैं.",
	"You are now blocking private messages, except from staff and {STATUS} users.": "अब आप staff और {STATUS} उपयोगकर्ता को छोड़ कर सबके लिए निजी सन्देश रोक रहे हैं.",
	"You are now blocking private messages, except from staff.": "अब आप staff को छोड़ कर सबके लिए निजी सन्देश रोक रहे हैं.",
	"You are not blocking private messages! To block, use /blockpms": "आप निजी सन्देश नहीं रोक रहे हैं! रोकने के लिए /blockpms का उपयोग करें.",
	"You are no longer blocking private messages.": "अब आप निजी सन्देश नहीं रोक रहे हैं.",
	"You are now blocking all incoming challenge requests.": "आप अब सभी मुकाबले के अनुरोध रोक रहे हैं.",
	"You are already blocking challenges!": " आप पहले से ही मुकाबले रोक रहे हैं!",
	"You are already available for challenges!": "आप पहले से ही मुकाबले के लिए तैयार हैं!",
	"You are available for challenges from now on.": "अब आप मुकाबलों के लिए तैयार हैं.",
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

	"Invalid room.": null, // NEEDS TRANSLATION

	"pages/faq": "pages/faq",
	"pages/ladderhelp": "pages/ladderhelp",
	"pages/rng": "pages/rng",
	"pages/staff": "pages/staff",

	"- We log PMs so you can report them - staff can't look at them without permission unless there's a law enforcement reason.": null,
	"- We log IPs to enforce bans and mutes.": null,
	"- We use cookies to save your login info and teams, and for Google Analytics and AdSense.": null,
	'- For more information, you can read our <a href="https://{ROOT}/privacy">full privacy policy.</a>': null,
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
