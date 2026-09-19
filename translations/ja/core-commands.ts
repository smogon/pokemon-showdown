import type { TranslationCatalog } from '../../server/chat';

export const translations: TranslationCatalog = {
	"Server version: <b>{VERSION}</b>": "サーバーのバージョン: <b>{VERSION}</b>",
	"/mee - must not start with a letter or number": "文字や数字を最初においてはいけません。",
	"What?! How are you not more excited to battle?! Try /battle! to show me you're ready.": "バトルが盛り上がってないって!?覚悟を決めて、/battle! だ!",
	"Access denied for custom avatar - make sure you're on the right account?": "このカスタムアバターを使用する権限がありません。許可されているアカウントでログインしてください。",
	"Invalid avatar.": "アバター名が正しくありません。",
	"Avatar changed to:": "アバターを次のものに変更しました。",
	"Artist: ": "作者: ",
	"No one has PMed you yet.": "誰もあなたにPMを送っていません。",
	"You forgot the comma.": "コンマを忘れていませんか?",
	"User {TARGETUSER} not found. Did you misspell their name?": "ユーザー名:{TARGETUSER}は見つかりませんでした。名前を間違えていませんか?",
	"User {TARGETUSER} is offline.": "ユーザー名:{TARGETUSER}は見つかりませんでした。",
	"The user \"{TARGETUSER}\" was not found.": "ユーザー名:\"{TARGETUSER}\"は見つかりませんでした。",
	"The room \"{TARGET}\" was not found.": "チャットルーム:\"{TARGET}\"は見つかりませんでした。",
	"You do not have permission to invite people into this room.": "あなたはこの部屋でユーザーを招待する権限を持っていません。",
	"This user is already in \"{ROOM}\".": "このユーザーはすでに\"{ROOM}\"にいます。",
	"Setting status messages in /busy is no longer supported. Set a status using /status.": "/busyでのステータスメッセージの設定はサポートされなくなりました。ステータスメッセージの設定は、/statusを使って行ってください。",
	"Setting status messages in /away is no longer supported. Set a status using /status.": "/awayでのステータスメッセージの設定はサポートされなくなりました。ステータスメッセージの設定は、/statusを使って行ってください。",
	"{TARGETUSER} does not have a status set.": "{TARGETUSER}はステータスメッセージを設定していません。",
	"{TARGETUSER}'s status \"{STATUS}\" was cleared by {USER}{REASON}": "{TARGETUSER}のステータスメッセージは{USER}によって消去されました。{REASON}",
	"You don't have a status message set.": "ステータスメッセージを設定していません。",
	"You have cleared your status message.": "ステータスメッセージを消去しました。",
	"This user has not played any ladder games yet.": "このユーザーはレートが有効なバトルをしていません。",
	// TRANSLATORS: initial for Wins
	"W": "W(Winsの頭文字)",
	// TRANSLATORS: initial for Losses
	"L": "L(Lossesの頭文字)",
	"You already have the temporary symbol '{GROUP}'.": "あなたはすでに一時的なランクである'{GROUP}'になっています。",
	"You must specify a valid group symbol.": "有効なランクの記号を特定する必要があります。",
	"You may only set a temporary symbol below your current rank.": "現在のランクより下の一時的なシンボルしか設定できません。",
	"Your temporary group symbol is now": "あなたの一時的なランクの記号",
	"Currently, you're viewing Pokémon Showdown in {LANGUAGE}.": "現在、Pokémon Showdownを{LANGUAGE}で表示しています。",
	"Valid languages are: {LANGUAGES}": "有効な言語一覧: {LANGUAGES}",
	"Pokémon Showdown will now be displayed in {LANGUAGE} (except in language rooms).": "Pokémon Showdownは言語部屋以外の場所は{LANGUAGE}で表示されます。",
	"Note that rooms can set their own language, which will override this setting.": "言語部屋ではそれぞれが独自の言語を設定でき、その場合はユーザー設定より部屋の設定が優先されます。",
	"/updatesettings expects JSON encoded object.": "/updatesettings を使用するには、JSONにエンコードされたデータが必要です。",
	"Unable to parse settings in /updatesettings!": "/updatesettings において、設定に使用するJSONを解析することができません。",
	"Must be in a battle.": "バトルの中でなければいけません。",
	"User {USER} not found.": "ユーザー {USER} は見つかりませんでした。",
	"Must be a player in this battle.": "プレイヤーである必要があります。",
	"{TARGETUSER} has not requested extraction.": "{TARGETUSER} は解析を要求していません。",
	"You have already consented to extraction with {TARGETUSER}.": "あなたはすでに{TARGETUSER}と解析に同意しています。",
	"{USER} consents to sharing battle team and choices with {TARGETUSER}.": "{USER}と{TARGETUSER}はバトルチームや技の選択を共有することに同意します。",
	"No input log found.": "インプットされたログが見つかりませんでした。",
	"This command only works in battle rooms.": "このコマンドはバトル内のみで有効です。",
	"This command only works when the battle has ended - if the battle has stalled, use /offertie.": "このコマンドはバトルが終わった後に有効になります。バトルが長引いた場合は、/offertie を使用してください。",
	"Alternatively, you can end the battle with /forcetie.": "あるいは/forcetie で強制的にバトルを引き分けにすることもできます。",
	"{USER} has extracted the battle input log.": "{USER}がバトルのログを出力しました。",
	"You already extracted the battle input log.": "あなたはすでにログを出力しています。",
	"Battle input log re-requested.": "ログの出力が再要求されました。",
	"Invalid input log.": "不正なログです。",
	"Your input log contains untrusted code - you must have console access to use it.": "入力ログには信頼されていないコードが含まれています。これを使用するにはコンソールへのアクセス権が必要です。",
	"This command can only be used in a battle.": "このコマンドはバトル内でのみ使用できます。",
	"Only players can extract their team.": "プレイヤーのみがチームの詳細を閲覧できます。",
	"Use a number between 1-6 to view a specific set.": "セットを出力するには1から6の間の数字を指定してください。",
	"The Pokemon \"{TARGET}\" is not in your team.": "\"{TARGET}\"はあなたのチームの中にはいません。",
	"That Pokemon is not in your team.": "そのポケモンはあなたのチームの中にはいません。",
	"View team": "チームを見る",
	"Must be in a battle room.": "バトルの中でなければいけません。",
	"User {USER} must be in the battle room already.": "ユーザー \"{USER}\"はすでに入室しています。",
	"This server does not allow offering ties.": "このサーバーでは引き分けの提案が許可されていません。",
	"You can't offer ties in tournaments.": "トーナメントでは引き分けを提案できません。",
	"It's too early to tie, please play until turn 100.": "引き分けの提案が早すぎます。100ターン目まで待ってください。",
	"No other player is requesting a tie right now. It was probably canceled.": "他のプレイヤーは引き分けを提案していません。おそらくキャンセルされました。",
	"{USER} is offering a tie.": "{USER}が引き分けを提案しています。",
	"Accept tie": "引き分けの提案を受け入れる",
	"Reject": "引き分けの提案を拒否する",
	"Must be a player to accept ties.": "引き分けを受け入れるにはプレイヤーである必要があります。",
	"You have already agreed to a tie.": "すでに引き分け同意しています。",
	"{USER} accepted the tie.": "{USER}が引き分けに同意しました。",
	"All players have accepted the tie.": "全てのプレイヤーが引き分けに同意しました。",
	"Must be a player to reject ties.": "引き分けを拒否するにはプレイヤーである必要があります。",
	"{USER} rejected the tie.": "{USER}が引き分けを拒否しました。",
	"This room doesn't have an active game.": "この部屋には、進行中のゲームがありません。",
	"This kind of game can't be forfeited.": "この種類のゲームは降参できません。",
	"This game doesn't support /choose": "このゲームでは\"/choose\"が使えません。",
	"This game doesn't support /undo": "このゲームでは\"/undo\"が使えません。",
	"You can only save replays for battles.": "リプレイが保存できるのはバトルだけです。",
	"This battle can't have hidden replays, because the tournament is set to be forced public.": "トーナメントの設定でこのバトルを隠し部屋にすることが許されていません。",
	"The replay for this battle is already set to hidden.": "このバトルのリプレイはすでに隠されています。",
	"{USER} hid the replay of this battle.": "{USER}がこのバトルのリプレイを非表示にしました。",
	"You can only do this in battle rooms.": "これはバトル部屋のみで使えます。",
	"You can only add a Player to unrated battles.": "プレイヤーを追加できるのはレートが有効でないバトルのみです。",
	"Player must be set to \"p1\" or \"p2\", not \"{TARGET}\".": "プレイヤーは \"{TARGET}\"ではなく\"p1\"か\"p2\"に設定しなければなりません。",
	"This room already has a player in slot {TARGET}.": "スロット {TARGET}にはすでにユーザーが割り当てられています。",
	"{TARGETUSER} is already a player in this battle.": null, // NEEDS TRANSLATION
	"Player 2": "プレイヤー2",
	"Players could not be restored (maybe this battle already has two players?).": "プレイヤーの復元ができませんでした。(このバトルにすでに2人プレイヤーがいるからかもしれません。)",
	"This game doesn't support /joingame": "このゲームでは /joingame が使えません。",
	"This game doesn't support /leavegame": "このゲームでは /leavegame が使えません。",
	"You can only do this in unrated non-tour battles.": "これはトーナメントでなくかつレートが有効ではないバトルでのみ有効です。",
	"{TARGETUSER} was kicked from a battle by {USER} {REASON}": "{TARGETUSER}は{USER}によってバトルからキックされました。({REASON})",
	"You can only set the timer from inside a battle room.": "タイマーはバトル部屋の中で設定できます。",
	"This game's timer is managed by a different command.": "このゲームのタイマーは他のコマンドで管理されています。",
	"The game timer is OFF.": "ゲームのタイマーがオフになりました。",
	"The game timer is ON (requested by {USER})": "ゲームのタイマーがオンになりました({USER}が設定しました)",
	"Access denied.": "アクセスが拒否されました。",
	"Timer was turned off by staff. Please do not turn it back on until our staff say it's okay.": "スタッフがタイマーをオフに設定しました。スタッフの許可を得るまで、元に戻さないでください。",
	"The timer is already off.": "タイマーは既にオフに設定されています。",
	"\"{TARGET}\" is not a recognized timer state.": "\"{TARGET}\"は認識できないタイマーの状態です。",
	"Forcetimer is now OFF: The timer is now opt-in. (set by {USER})": "強制的なタイマーがオフになりました。(by {USER})",
	"Forcetimer is now ON: All battles will be timed. (set by {USER})": "タイマーがオンになりました。すべてのバトルが強制的にタイマーで計測されます。(by {USER})",
	"'{TARGET}' is not a recognized forcetimer setting.": "'{TARGET}'は認識できないタイマーの状態です。",
	"This server requires you to be rank {GROUP} or higher to search for a battle.": "このサーバーでは、バトルを検索するためにはランクが{GROUP}以上であることが必要です。",
	"Since you have reached {ELO} ELO in {TARGET}, you must register your account to continue playing that format on ladder.": "ELOレートが{TARGET}で{ELO}に達したので、アカウントを登録する必要があります。",
	"Register": "登録",
	"The user '{TARGETUSER}' was not found.": "ユーザー \"{TARGETUSER}\"は見つかりませんでした。",
	"You are locked and cannot challenge unlocked users. If this user is your friend, ask them to challenge you instead.": "あなたはロックされており、ロックされていないユーザーにchallengeすることはできません。このユーザーがあなたの友人である場合は、代わりにchallengeするよう依頼してください",
	"You are banned from battling and cannot challenge users.": "あなたはバトルをすることを禁止されているため、ほかのユーザーにchallengeすることはできません。",
	"You must choose a username before you challenge someone.": "誰かにchallengeする前にユーザー名を決める必要があります。",
	"This server requires you to be rank {GROUP} or higher to challenge users.": "このサーバーでは、ユーザーにchallengeするためにはランクが{GROUP}以上であることが必要です。",
	"This command does not support specifying multiple users": "このコマンドでは複数のユーザーを指定できません",
	"Provide a valid format.": "有効なフォーマット名を入力してください",
	"Please provide a valid format.": "有効なフォーマット名を入力してください",
	"The format '{FORMAT}' was not found.": "フォーマット\"{FORMAT}\"は見つかりませんでした。",
	"Your team is valid for {FORMAT}.": "このチームは \"{FORMAT}\"に適合しています。",
	"Your team was rejected for the following reasons:": "このチームは以下の理由によって不適切です。",
	"Battles are now hidden (except to staff) in your trainer card.": "あなたのトレーナーカードからバトルはスタッフ以外には見えなくなりました",
	"Battles are now visible in your trainer card.": "あなたのトレーナーカードからバトルが見られるようになりました。",
	"'{COMMAND}' is a help command.": "\"{COMMAND}\"はヘルプコマンドです。",
	"The command '/{TARGET}' does not exist.": "コマンド \"/{TARGET}\"は見つかりませんでした。",
	"Could not find help for '/{TARGET}'. Try /help for general help.": "\"{TARGET}\"のヘルプは見つかりませんでした。\"/help\"で総合的なヘルプを試してみてください。",
	"Could not find help for '/{TARGET}' - displaying help for '/{CLOSEST}' instead": "\"/{TARGET}\"のヘルプは見つかりませんでした。\"/{CLOSEST}\"のヘルプを表示しています。",
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
