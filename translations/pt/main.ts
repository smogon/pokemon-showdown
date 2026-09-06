import type { TranslationCatalog } from '../../server/chat';

export const translations: TranslationCatalog = {
	// #region Generic UI
	// ==================================================================

	"Total": null, // NEEDS TRANSLATION
	"User '{TARGETUSER}' not found.": "Usuário '{TARGETUSER}' não encontrado.",
	"User \"{TARGETUSER}\" not found.": "Usuário \"{TARGETUSER}\" não encontrado.",
	"Refresh": "Atualizar",
	"Action": "Ação",

	// #endregion Generic

	"namelocked": "namelocked",
	"locked": "locked",

	"autoconfirmed": "verificados",
	"trusted": "confiáveis",

	"Please follow the rules:": "Por favor siga as regras:",
	// TRANSLATORS: Link to the PS rules for your language (path after pokemonshowdown.com
	"/rules": "/pages/rules-pt",
	"Global Rules": "Regras Globais",
	"{ROOM} room rules": "Regras da Sala {ROOM}",

	"<strong>Global ranks</strong>": "<strong>Cargos Globais</strong>",
	"+ <strong>Global Voice</strong> - They can use ! commands like !groups": "+ <strong>Global Voice</strong> - Eles podem usar comandos com !, tal como !groups",
	"% <strong>Global Driver</strong> - Like Voice, and they can lock users and check for alts": "% <strong>Global Driver</strong> - Como Voice, além de poderem dar locks e verificar contas alternativas",
	"@ <strong>Global Moderator</strong> - The above, and they can globally ban users": "@ <strong>Global Moderator</strong> - O de cima, além de poderem banir usuários do servidor",
	"* <strong>Global Bot</strong> - An automated account that can use HTML anywhere": null, // NEEDS TRANSLATION
	"* <strong>Global Bot</strong> - Like Moderator, but makes it clear that this user is a bot": "* <strong>Global Bot</strong> - Igual ao cargo de Moderator, mas deixa claro que o usuário é um bot",
	"~ <strong>Global Administrator</strong> - They can do anything, like change what this message says and promote users globally": "~ <strong>Global Administrator</strong> - Eles podem fazer qualquer coisa, como mudar o que esta mensagem diz",

	"<strong>Room ranks</strong>": "<strong>Cargos da Sala</strong>",
	"^ <strong>Prize Winner</strong> - They don't have any powers beyond a symbol.": "^ <strong>Prize Winner</strong> - Eles não têm poder algum além de um símbolo.",
	"+ <strong>Voice</strong> - They can use ! commands like !groups": "+ <strong>Voice</strong> - Eles podem usar comandos com !, tal como !groups",
	"% <strong>Driver</strong> - The above, and they can mute and warn": "% <strong>Driver</strong> - O de cima, além de poderem dar mutes e avisos",
	"@ <strong>Moderator</strong> - The above, and they can room ban users": "@ <strong>Moderator</strong> - O de cima, além de poderem banir usuários da sala",
	"* <strong>Bot</strong> - An automated account that can mute, warn, and use HTML": null, // NEEDS TRANSLATION
	"* <strong>Bot</strong> - Like Moderator, but makes it clear that this user is a bot": "* <strong>Bot</strong> - Igual ao cargo de Moderator, mas deixa claro que o usuário é um bot",
	"# <strong>Room Owner</strong> - They are leaders of the room and can almost totally control it": "# <strong>Room Owners</strong> - Eles são os líderes da sala e podem controlá-la quase totalmente",

	"/help OR /h OR /? - Gives you help.": "/help OU /h OU ? - Oferece-lhe ajuda.",
	"For an overview of room commands, use /roomhelp": "Para uma visão geral dos comandos de sala, use /roomhelp",
	"For details of a specific command, use something like: /help data": "Para detalhes acerca de um comando específico, use, por exemplo, /help data",

	"COMMANDS": "COMANDOS",
	"BATTLE ROOM COMMANDS": "COMANDOS DO CHAT DE BATALHA",
	"OPTION COMMANDS": "COMANDOS DE OPÇÕES",
	"INFORMATIONAL/RESOURCE COMMANDS": "COMANDOS INFORMATIVOS E/OU DE RECURSOS",
	"DATA COMMANDS": "COMANDOS DE DADOS",
	"DRIVER COMMANDS": "COMANDOS DE DRIVER",
	"MODERATOR COMMANDS": "COMANDOS DE MODERATOR",
	"ADMIN COMMANDS": "COMANDOS DE ADMINISTRATOR",

	"(replace / with ! to broadcast. Broadcasting requires: + % @ # ~)": "(substitua / por ! para exibir um comando publicamente. Isso requer: + % @ # ~)",

	"<strong>Room punishments</strong>:": "<strong>Puni&ccedil;&otilde;es da sala</strong>",
	"<strong>warn</strong> - Displays a popup with the rules.": "<strong>warn</strong> - Faz uma mensagem com as regras aparecer.",
	"<strong>mute</strong> - Mutes a user (makes them unable to talk) for 7 minutes.": "<strong>mute</strong> - Silencia um usu&aacute;rio (ou seja, impede-o de falar) por 7 minutos.",
	"<strong>hourmute</strong> - Mutes a user for 60 minutes.": "<strong>hourmute</strong> - Silencia um usu&aacute;rio por 60 minutos.",
	"<strong>ban</strong> - Bans a user (makes them unable to join the room) for 2 days.": "<strong>ban</strong> - Bane um usu&aacute;rio (ou seja, impede-o de entrar na sala) por 2 dias.",
	"<strong>weekban</strong> - Bans a user from the room for a week.": "<strong>weekban</strong> - Bane um usuário da sala por uma semana.",
	"<strong>blacklist</strong> - Bans a user for a year.": "<strong>blacklist</strong> - Bane um usu&aacute;rio por um ano.",

	"<strong>Global punishments</strong>:": "<strong>Puni&ccedil;&otilde;es globais</strong>",
	"<strong>lock</strong> - Locks a user (makes them unable to talk in any rooms or PM non-staff) for 2 days.": "<strong>lock</strong> - Bloqueia um usu&aacute;rio (ou seja, impede-o de falar em quaisquer salas e de mandar mensagens privadas para quem n&atilde;o for staff) por 2 dias.",
	"<strong>weeklock</strong> - Locks a user for a week.": "<strong>weeklock</strong> - Bloqueia um usu&aacute;rio por uma semana.",
	"<strong>namelock</strong> - Locks a user and prevents them from having a username for 2 days.": "<strong>namelock</strong> - Bloqueia um usu&aacute;rio e o impede de escolher um nome por 2 dias.",
	"<strong>globalban</strong> - Globally bans (makes them unable to connect and play games) for a week.": "<strong>globalban</strong> - Bane globalmente um usu&aacute;rio (ou seja, impede-o de se conectar ao servidor e de jogar) por uma semana.",

	"<strong>Indefinite global punishments</strong>:": "<strong>Punições globais de duração indeterminada</strong>:",
	"<strong>permalock</strong> - Issued for repeated instances of bad behavior and is rarely the result of a single action. ": "<strong>permalock</strong> - aplicado em múltiplos casos de má conduta e raramente é resultado de uma única ação. ",
	'These can be appealed in the <a href="https://www.smogon.com/forums/threads/discipline-appeal-rules.3583479/">Discipline Appeal</a>': 'É possível fazer um apelo no <a href="https://www.smogon.com/forums/threads/discipline-appeal-rules.3583479/">fórum Discipline Appeals</a>',
	" forum after at least 3 months without incident.": " após pelo menos 3 meses sem um incidente.",
	"<strong>permaban</strong> - Unappealable global ban typically issued for the most severe cases of offensive/inappropriate behavior.": "<strong>permaban</strong> - trata-se de um banimento global geralmente aplicado aos casos mais severos de comportamentos ofensivos e/ou inapropriados. Não é possível fazer um apelo.",

	"<strong>Room drivers (%)</strong> can use:": "<strong>Room drivers (%)</strong> podem usar:",
	"- /warn OR /k <em>username</em>: warn a user and show the Pok&eacute;mon Showdown rules": "- /warn OU /k <em>nome</em>: d&aacute; um aviso a um usu&aacute;rio e mostra as regras do Pok&eacute;mon Showdown",
	"- /mute OR /m <em>username</em>: 7 minute mute": "- /mute OU /m <em>nome</em>: silencia um usu&aacute;rio por 7 minutos",
	"- /hourmute OR /hm <em>username</em>: 60 minute mute": "- /hourmute OU /hm <em>nome</em>: silencia um usu&aacute;rio por 60 minutos",
	"- /unmute <em>username</em>: unmute": "- /unmute <em>nome</em>: remove o mute de um usu&aacute;rio",
	"- /hidetext <em>username</em>: hide a user's messages from the room": "- /hidetext <em>nome</em>: esconde as mensagens de um usu&aacute;rio na sala",
	"- /announce OR /wall <em>message</em>: make an announcement": "- /announce OU /wall <em>mensagem</em>: faz um an&uacute;ncio",
	"- /modlog <em>username</em>: search the moderator log of the room": "- /modlog <em>nome</em>: faz uma busca do hist&oacute;rico de modera&ccedil;&atilde;o de um determinado usu&aacute;rio",
	"- /modnote <em>note</em>: add a moderator note that can be read through modlog": "- /modnote <em>nota</em>: adiciona uma nota de modera&ccedil;&atilde;o que s&oacute; pode ser lida atrav&eacute;s do modlog",

	"<strong>Room moderators (@)</strong> can also use:": "<strong>Room moderators (@)</strong> tamb&eacute;m podem usar:",
	"- /roomban OR /rb <em>username</em>: ban user from the room": "- /roomban OU /rb <em>nome</em>: bane um usu&aacute;rio da sala",
	"- /roomunban <em>username</em>: unban user from the room": "- /roomunban <em>nome<em>: remove o banimento de um usu&aacute;rio",
	"- /roomvoice <em>username</em>: appoint a room voice": "- /roomvoice <em>nome</em>: promove um usu&aacute;rio ao cargo de room voice",
	"- /roomdevoice <em>username</em>: remove a room voice": "- /roomdevoice <em>nome</em>: remove o cargo de room voice de um usu&aacute;rio",
	"- /staffintro <em>intro</em>: set the staff introduction that will be displayed for all staff joining the room": "- /staffintro <em>introdu&ccedil;&atilde;o</em>: define a introdu&ccedil;&atilde;o do staff que ser&aacute; vis&iacute;vel para todos membros do staff ao entrarem na sala",
	"- /roomsettings: change a variety of room settings, namely modchat": "- /roomsettings: permite modificar uma variedade de configura&ccedil;&otilde;es da sala, notavelmente o modchat",

	"<strong>Room owners (#)</strong> can also use:": "<strong>Room owners (#)</strong> tamb&eacute;m podem usar:",
	"- /roomintro <em>intro</em>: set the room introduction that will be displayed for all users joining the room": "- /roomintro <em>introdu&ccedil;&atilde;o</em>: define a introdu&ccedil;&atilde;o da sala que ser&aacute; vis&iacute;vel para todos os usu&aacute;rios ao entrarem na sala",
	"- /rules <em>rules link</em>: set the room rules link seen when using /rules": "- /rules <em>link das regras</em>: define o link das regras da sala ao usar /rules",
	"- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver": "- /roommod, /roomdriver <em>nome</em>: promove um usu&aacute;rio ao cargo de room moderator / driver",
	"- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver": "- /roomdemod, /roomdedriver <em>nome</em>: remove o cargo de room moderator / driver de um usu&aacute;rio",
	"- /roomdeauth <em>username</em>: remove all room auth from a user": "- /roomdeauth <em>nome</em>: remove todos os cargos de um usu&aacute;rio na sala",
	"- /declare <em>message</em>: make a large blue declaration to the room": "- /declare <em>mensagem</em>: faz uma declara&ccedil;&atilde;o &agrave; sala em uma caixa de texto azul e comprida",
	"- !htmlbox <em>HTML code</em>: broadcast a box of HTML code to the room": "- !htmlbox <em>c&oacute;digo HTML</em>: exibe uma caixa de c&oacute;digo HTML publicamente para a sala",
	"- !showimage <em>[url], [width], [height]</em>: show an image to the room": "- !showimage [url], [largura], [altura]: mostra uma imagem para a sala",
	"- !show [image or youtube link]: display given media in chat.": null, // NEEDS TRANSLATION
	"- /whitelist [user]: whitelist a non-staff user to use !show.": null, // NEEDS TRANSLATION
	"- /unwhitelist [user]: removes the user from !show whitelist.": null, // NEEDS TRANSLATION
	"- /roomsettings: change a variety of room settings, including modchat, capsfilter, etc": "- /roomsettings: permite modificar uma variedade de configura&ccedil;&otilde;es da sala, incluindo o modchat, filtro de caps lock, etc",

	"More detailed help can be found in the <a href=\"https://www.smogon.com/forums/posts/6774654/\">roomauth guide</a>": "Informa&ccedil;&otilde;es mais detalhadas podem ser encontradas no <a href=\"https://www.smogon.com/forums/posts/6774654/\">guia para roomauth</a>",

	"Tournament Help:": "Ajuda com Torneios:",
	"- /tour create <em>format</em>, elimination: create a new single elimination tournament in the current room.": "- /tour create </em>formato</em>, elimination - cria um novo torneio em formato de elimina&ccedil;&atilde;o &uacute;nica na sala",
	"- /tour create <em>format</em>, roundrobin: create a new round robin tournament in the current room.": "- /tour create <em>formato</em>, roundrobin - cria um novo torneio em formato round robin na sala",
	"- /tour end: forcibly end the tournament in the current room": "- /tour end: encerra manualmente um torneio na sala",
	"- /tour start: start the tournament in the current room": "- /tour start: inicia o torneio na sala",
	"- /tour banlist [pokemon], [talent], [...]: ban moves, abilities, Pokémon or items from being used in a tournament (it must be created first)": "- /tour banlist: [pokemon], [talent], [...]: Bane moves, abilities, Pok&eacute;mon ou itens de um torneio (o qual deve primeiro ser criado) ",

	"More detailed help can be found in the <a href=\"https://www.smogon.com/forums/posts/6777489/\">tournaments guide</a>": "Informações mais detalhadas podem ser encontradas no <a href=\"https://www.smogon.com/forums/posts/6777489/\">guia de torneios</a>",

	"Your status cannot be updated while you are locked or semilocked.": "Seu status não pode ser atualizado enquanto você estiver locked ou semilocked.",
	"Your status is too long; it must be under {MAX} characters.": "Seu status é muito longo; ele deve ter menos de {MAX} caracteres.",
	"Your status contains a banned word.": "Seu status contém uma palavra banida.",
	"Your status has been set to: {TARGET}.": "Seu status foi definido como: {TARGET}.",
	"You are now marked as busy.": "Agora você está marcado como busy (ocupado).",
	"You are now marked as away. Send a message or use /back to indicate you are back.": "Agora você está marcado como away (distante). Envie uma mensagem ou use /back para indicar que está de volta.",
	"You are already marked as back.": "Você já está marcado como back (de volta).",
	"You are no longer marked as busy.": "Você não está mais marcado como busy (ocupado).",

	"You must choose a name before you can talk.": "Você deve escolher um nome antes de poder falar.",
	"You are {LOCKTYPE} and can't talk in chat. {EXPIRATION}": "Você está {LOCKTYPE} e não pode falar em chats. {EXPIRATION}",
	// TRANSLATORS: your lock
	"Get help with this": "Peça ajuda com isso",
	"You are muted and cannot talk in this room.": "Você foi silenciado e não pode falar nesta sala.",
	"Because moderated chat is set, your account must be at least one week old and you must have won at least one ladder game to speak in this room.": "Como o modchat está ativado, sua conta deve ter uma semana de registro e você deve ter ganho no mínimo uma partida na ladder para falar nesta sala.",
	"Because moderated chat is set, your account must be staff in a public room or have a global rank to speak in this room.": "Como o modchat está ativado, sua conta deve ser staff em uma sala pública ou ter um rank global para falar nesta sala.",
	"Because moderated chat is set, you must be of rank {GROUP} or higher to speak in this room.": "Como o modchat está ativado, seu rank deve ser {GROUP} ou maior para falar nesta sala.",
	"Your message can't be blank.": "Sua mensagem não pode estar em branco.",
	"Your message is too long: ": "Sua mensagem é muito longa.",
	"Your message contains banned characters.": "Sua mensagem contém caracteres banidos.",
	"This room has slow-chat enabled. You can only talk once every {SECONDS} seconds.":
	"O slow-chat desta sala está ativado. Você apenas pode falar a cada {SECONDS} segundos.",
	"Your username contains a phrase banned by this room.": "Seu nome de usuário contém uma frase banida por esta sala.",
	"Your status message contains a phrase banned by this room.": "A mensagem do seu status contém uma frase banida por esta sala.",

	"You are {LOCKTYPE} and can only private message members of the global moderation team. {EXPIRATION}": "Você está {LOCKTYPE} e só pode enviar mensagens privadas para a equipe de moderação global. {EXPIRATION}",
	"The user \"{TARGETUSER}\" is locked and cannot be PMed.": "O usuário \"{TARGETUSER}\" está locked e não pode receber mensagens privadas.",
	"On this server, you must be of rank {GROUP} or higher to PM users.": "Neste servidor, você precisa ser de cargo {GROUP} ou maior para enviar mensagens privadas.",
	"This user is blocking private messages right now.": "Este usuário está bloqueando mensagens privadas no momento.",
	"This {GROUP} is too busy to answer private messages right now. Please contact a different staff member.": "Este {GROUP} está muito ocupado para responder mensagens privadas no momento. Por favor, contate outro membro da staff.",
	"If you need help, try opening a <a href=\"view-help-request\" class=\"button\">help ticket</a>": "Se você precisa de ajuda, tente abrir um <a href=\"view-help-request\" class=\"button\">pedido de ajuda</a>",
	"You are blocking private messages right now.": "Você está bloquando mensagens privadas no momento.",
	"You are blocking challenges right now.": "Você está bloqueando desafios no momento.",

	"Your message contained banned words in this room.": "Sua mensagem continha palavras banidas nesta sala.",
	"You can't send the same message again so soon.": "Você não pode enviar a mesma mensagem de novo tão cedo.",
	"Due to this room being a high traffic room, your message must contain at least two letters.": "Como esta sala contém um grande tráfego de mensagens, sua mensagem deve conter no mínimo duas letras.",

	"You are already blocking private messages! To unblock, use /unblockpms": "Você já está bloqueando mensagens privadas! Para desbloqueá-las, utilize /unblockpms",
	"You are now blocking private messages, except from staff and {RANK}.": "Agora você está bloqueando mensagens privadas, exceto de staff e de usuários {RANK}.",
	"You are now blocking private messages, except from staff and {STATUS} users.": "Agora você está bloqueando mensagens privadas, exceto de staff e de usuários {STATUS}.",
	"You are now blocking private messages, except from staff.": "Agora você está bloqueando mensagens privadas, exceto de staff.",
	"You are not blocking private messages! To block, use /blockpms": "Você não está bloqueando mensagens privadas! Para bloqueá-las, utilize /blockpms",
	"You are no longer blocking private messages.": "Você não está mais bloqueando mensagens privadas.",
	"You are now blocking all incoming challenge requests.": "Agora você está bloqueando todos os pedidos de desafio.",
	"You are already blocking challenges!": "Você já está bloqueando desafios",
	"You are already available for challenges!": "Você já está disponível para desafios!",
	"You are available for challenges from now on.": "Você está disponível para desafios a partir de agora.",
	"You are now blocking challenges, except from staff and {RANK}.": "Você está bloqueando desafios no momento, exceto de adminstradores e {RANK}.",
	"You are now blocking challenges, except from staff and {STATUS} users.": "Você está bloqueando desafios no momento, exceto de adminstradores e usuários {STATUS}.",

	"Staff FAQ": "Perguntas Frequentes sobre Staff",
	"You cannot broadcast all FAQs at once.": "Você não pode exibir publicamente todos os FAQs (Perguntas Frequentes) de uma vez.",
	"A user is autoconfirmed when they have won at least one rated battle and have been registered for one week or longer. In order to prevent spamming and trolling, most chatrooms only allow autoconfirmed users to chat. If you are not autoconfirmed, you can politely PM a staff member (staff have %, @, or # in front of their username) in the room you would like to chat and ask them to disable modchat. However, staff are not obligated to disable modchat.": "Um usuário é verificado após ganhar pelo menos uma partida ranqueada e ter uma semana ou mais de registro. A fim de prevenir spam e troll, a maior parte das salas de bate-papo só permitem que usuários verificados conversem. Se você não for verificado, pode educadamente enviar uma mensagem privada a um membro do staff (os quais têm os símbolos %, @ ou # na frente do nome) da sala em que você quer conversar e pedir para o modchat ser desativado. Porém, eles não são obrigados a desativar o modchat.",
	"How the ladder works": "Como a ladder funciona",
	"Tiering FAQ": "Perguntas Frequentes sobre Tiering",
	"Badge FAQ": "Perguntas Frequentes sobre Badges",
	"Common misconceptions about our RNG": "Concepções erradas e comuns sobre nosso RNG",
	"To join a room tournament, click the <strong>Join!</strong> button or type the command <code>/tour join</code> in the room's chat. You can check if your team is legal for the tournament by clicking the <strong>Validate</strong> button once you've joined and selected a team. To battle your opponent in the tournament, click the <strong>Ready!</strong> button when it appears. There are two different types of room tournaments: elimination (if a user loses more than a certain number of times, they are eliminated) and round robin (all users play against each other, and the user with the most wins is the winner).": "Para entrar em um torneio de sala, clique no botão <strong>Join!</strong> ou digite o comando <code>/tour join</code> no chat da sala. Você pode checar se sua equipe é válida para o torneio clicando no botão <strong>Validate</strong> uma vez que você tenha entrado e selecionado um time. Para batalhar contra um oponente no torneio, clique no botão <strong>Ready!</strong> quando ele aparecer. Existem tipos diferentes de torneios de sala: eliminação (se um usuário perder mais do que um certo número de vezes estará eliminado) e round robin (todos jogam entre si, com o usuário com mais pontos sendo o vencedor).",
	"Frequently Asked Questions": "Perguntas Frequentes",

	"Invalid room.": "Sala inválida.",

	"pages/faq": "pages/faq",
	"pages/ladderhelp": "pages/ladderhelp",
	"pages/rng": "pages/rng",
	"pages/staff": "pages/staff",

	"- We log PMs so you can report them - staff can't look at them without permission unless there's a law enforcement reason.": "- Nós registramos PMs (Mensagens Privadas) para que você possa denunciá-los - a equipe não pode olhar para eles sem permissão, a menos que haja um motivo de aplicação da lei.",
	"- We log IPs to enforce bans and mutes.": "- Nós registramos IPs para realizar banimentos e silenciamentos.",
	"- We use cookies to save your login info and teams, and for Google Analytics and AdSense.": "- Usamos cookies para salvar suas informações de login e equipes, e para Google Analytics e AdSense.",
	'- For more information, you can read our <a href="https://{ROOT}/privacy">full privacy policy.</a>': '- Para mais informações, você pode ler nossa <a href="https://{ROOT}/privacy">política de privacidade completa.</a>',
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
