Protocol
========

Pokémon Showdown's protocol is relatively simple.

Pokémon Showdown is implemented in SockJS. SockJS is a compatibility
layer over raw WebSocket, so you can actually connect to Pokémon
Showdown directly using WebSocket:

    ws://sim.smogon.com:8000/showdown/websocket
      or
    wss://sim.smogon.com/showdown/websocket

Client implementations you might want to look at for reference include:

- pickdenis' chat bot (Ruby) -
    https://github.com/pickdenis/ps-chatbot
- Quinella and TalkTakesTime's chat bot (Node.js) -
    https://github.com/TalkTakesTime/Pokemon-Showdown-Bot
- Nixola's chat bot (Lua) -
    https://github.com/Nixola/NixPSbot
- the official client (HTML5 + JavaScript) -
    https://github.com/Zarel/Pokemon-Showdown-Client

The official client logs protocol messages in the JavaScript console,
so opening that (F12 in most browsers) can help tell you what's going
on.

Client-to-server messages
-------------------------

Messages from the user to the server are in the form:

    ROOMID|TEXT

`ROOMID` can optionally be left blank if it's the lobby, or if the room
is irrelevant (for instance, if `TEXT` is a command like
`/join lobby` where it doesn't matter what room it's sent from, you can
just send `|/join lobby`.)

`TEXT` can contain newlines, in which case it'll be treated the same
way as if each line were sent to the room separately.

A partial list of available commands can be found with `/help`.

To log in, look at the documentation for the `|challstr|` server message.


Server-to-client messages
-------------------------

Messages from the server to the user are in the form:

    >ROOMID
    MESSAGE
    MESSAGE
    MESSAGE
    ...

`>ROOMID` and the newline after it can be omitted if the room is lobby
or global. `MESSAGE` cannot start with `>`, so it's unambiguous whether
or not `>ROOMID` has been omitted.

As for the payload: it's made of any number of blocks of data
separated by newlines; empty lines should be ignored. In particular,
it should be treated the same way whether or not it ends in a
newline, and if the payload is empty, the entire message should be ignored.

If `MESSAGE` doesn't start with `|`, it should be shown directly in the
room's log. Otherwise, it will be in the form:

    |TYPE|DATA

For example:

    |j| Some dude
    |c|@Moderator|hi!
    |c| Some dude|you suck and i hate you!
    Some dude was banned by Moderator.
    |l| Some dude
    |b|battle-ou-12| Cool guy|@Moderator

This might be displayed as:

    Some dude joined.
    @Moderator: hi!
    Some dude: you suck and i hate you!
    Some dude was banned by Moderator.
    Some dude left.
    OU battle started between Cool guy and Moderator

For bandwidth reasons, five of the message types - `chat`, `join`, `leave`,
`name`, and `battle` - are sometimes abbreviated to `c`, `j`, `l`, `n`,
and `b` respectively. All other message types are written out in full so they
should be easy to understand.

Four of these can be uppercase: `J`, `L`, `N`, and `B`, which are
the equivalent of their lowercase versions, but are recommended not to be
displayed inline because they happen too often. For instance, the main server
gets around 5 joins/leaves a second, and showing that inline with chat would
make it near-impossible to chat.

Some outgoing message types
---------------------------

`USER` = a user, the first character being their rank (users with no rank are
represented by a space), and the rest of the string being their username.

####Room initialization

`|init|ROOMTYPE`

> The first message received from a room when you join it. `ROOMTYPE` is
> one of: `chat` or `battle`

`|users|USERLIST`

> `USERLIST` is a comma-separated list of `USER`s, sent from chat rooms when
> they're joined.

####Room messages

`||MESSAGE` or `MESSAGE`

> We received a message `MESSAGE`, which should be displayed directly in
> the room's log.

`|html|HTML`

> We received an HTML message, which should be sanitized and displayed
> directly in the room's log.

`|uhtml|NAME|HTML`

> We recieved an HTML message (NAME) that can change what it's displaying,
> this is used in things like our Polls system, for example.

`|uhtmlchange|NAME|HTML`

> Changes the HTML display of the `|uhtml|` message named (NAME).

`|join|USER` or `|j|USER`

> `USER` joined the room.

`|leave|USER` or `|l|USER`

> `USER` left the room.

`|name|USER|OLDID` or `|n|USER|OLDID`

> A user changed name to `USER`, and their previous userid was `OLDID`.

`|chat|USER|MESSAGE` or `|c|USER|MESSAGE`

> `USER` said `MESSAGE`. Note that `MESSAGE` can contain `|` characters,
> so you can't just split by `|` and take the fourth string.

`|:|TIMESTAMP`

`|c:|TIMESTAMP|USER|MESSAGE`

> `c:` is pretty much the same as `c`, but also comes with a UNIX timestamp;
> (the number of seconds since 1970). This is used for accurate timestamps
> in chat logs.
>
> `:` is the current time according to the server, so that times can be
> adjusted and reported in the local time in the case of a discrepancy.
>
> The exact fate of this command is uncertain - it may or may not be
> replaced with a more generalized way to transmit timestamps at some point.

`|battle|ROOMID|USER1|USER2` or `|b|ROOMID|USER1|USER2`

> A battle started between `USER1` and `USER2`, and the battle room has
> ID `ROOMID`.

####Battle messages

`|player|PLAYER|USERNAME|AVATAR`

> Appears when you join a battle room. `PLAYER` denotes which player it is
> (`p1` or `p2`) and `USERNAME` is the username. `AVATAR` is the player's
> avatar identifier (usually a number, but other values can be used for
> custom avatars).

    |gametype|GAMETYPE
    |gen|GENNUM
    |tier|TIERNAME
    |rated
    |rule|RULE: DESCRIPTION

> Additional details when you join a battle room. `GAMETYPE` is one of
> `singles`, `doubles`, or `triples`; `GENNUM` denotes the generation of
> Pokémon being played; `tier` is the format; and `rule` appears multiple
> times, once for each clause in effect. `rated` only appears if the battle
> is rated.

    |clearpoke
    |poke|PLAYER|DETAILS|ITEM
    |poke|PLAYER|DETAILS|ITEM
    ...
    |teampreview

> These messages appear if you're playing a format that uses team previews.
> `PLAYER` is the player ID (see `|player|`) and `DETAILS` describes the
> pokemon. `|teampreview` commonly appears after `|rule` tags instead of
> immediately after the pokemon list.
>
> The format for `DETAILS` is described in `|switch|`, although not
> everything may be revealed. In particular, forme is sometimes not
> specified (so Arceus would appear as `Arceus-*` since it's impossible
> to identify Arceus forme in Team Preview).

`|request|REQUEST`

> Gives a JSON object containing a request for a decision (to move or
> switch). To assist in your decision, `REQUEST.active` has information
> about your active Pokémon, and `REQUEST.side` has information about your
> your team as a whole.

`|inactive|MESSAGE` or `|inactiveoff|MESSAGE`

> A message related to the battle timer has been sent. The official client
> displays these messages in red.
>
> `inactive` means that the timer is on at the time the message was sent,
> while `inactiveoff` means that the timer is off.

`|start`

> Indicates that the game has started.

`|win|USER`

> `USER` has won the battle.

`|tie`

> The battle has ended in a tie.

######Major actions

In battle, most Pokémon actions come in the form `|ACTION|POKEMON|DETAILS`
followed by a few messages detailing what happens after the action occurs.

A Pokémon is always identified in the form `POSITION: NAME`. `POSITION` is
the spot that the Pokémon is in: it consists of the `PLAYER` of the player
(see `|player|`), followed by a letter indicating the given Pokémon's
position, counting from `a`.

In doubles and triples battles, `a` will refer to the leftmost Pokémon
on one team and the rightmost Pokémon on the other (so `p1a` faces `p2c`,
etc). `NAME` is the nickname of the Pokémon performing the action.

Battle actions (especially minor actions) often come with tags such as
`|[from] EFFECT|[of] SOURCE`. `EFFECT` will be an effect (move, ability,
item, status, etc), and `SOURCE` will be a Pokémon. These can affect the
message or animation displayed, but do not affect anything else. Other 
tags include `|[still]` (suppress animation) and `|[silent]` (suppress message).

`|move|POKEMON|MOVE|TARGET`

> The specified Pokémon has used move `MOVE` at `TARGET`. If a move has
> multiple targets or no target, `TARGET` should be ignored. If a move
> targets a side, `TARGET` will be a (possibly fainted) Pokémon on that
> side.
>
> If `|[miss]` is present, the move missed.
>
> `|[anim] MOVE2` tells the client to use the animation of `MOVE2` instead
> of `MOVE` when displaying to the client.

`|switch|POKEMON|DETAILS|HP STATUS` or `|drag|POKEMON|DETAILS|HP STATUS`

> A Pokémon identified by `POKEMON` has switched in (the old Pokémon, if
> still there, is switched out).
>
> `DETAILS` is a comma-separated list of all information about a pokemon
> visible on the battle screen: species, shininess, gender, and level. So it
> starts with `SPECIES`, adding `, shiny` if it's shiny, `, M` if it's male,
> `, F` if it's female, `, L##` if it's not level 100.
>
> So, for instance, `Deoxys-Speed` is a level 100 non-shiny genderless
> Deoxys (Speed forme). `Sawsbuck, shiny, F, L50` is a level 50 shiny female
> Sawsbuck (Spring form).
>
> `POKEMON|DETAILS` represents all the information that can reliably identify
> a pokemon in a game. If two pokemon have the same `POKEMON|DETAILS` (which
> will never happen in any format with Species Clause), you usually won't be
> able to tell if the same pokemon switched in or a different pokemon switched
> in.
>
> The switched Pokémon has HP `HP`, and status `STATUS`. `HP` is specified as
> a fraction; if it is your own Pokémon then it will be `CURRENT/MAX`, if not,
> it will be `/100` if HP Percentage Mod is in effect and `/48` otherwise.
> `STATUS` can be left blank, or it can be `slp`, `par`, etc.
>
> `switch` means it was intentional, while `drag` means it was unintentional
> (forced by Whirlwind, Roar, etc).

`|swap|POKEMON|POSITION`

> Moves already active `POKEMON` to active field `POSITION` where the
> leftmost position is 0 and each position to the right counts up by 1.

`|detailschange|POKEMON|DETAILS|HP STATUS` or 
`|-formechange|POKEMON|SPECIES|HP STATUS`

> The specified Pokémon has changed formes (via Mega Evolution, ability, etc.) 
> to `SPECIES`. If the forme change cannot be reverted (Mega Evolution or a 
> Shaymin-Sky that is frozen), then `detailschange` will appear; otherwise, 
> the client will send `-formechange`.
>
> For the `DETAILS` format, see the documentation for `|switch|`.

`|cant|POKEMON|REASON` or `|cant|POKEMON|REASON|MOVE`

> The Pokémon `POKEMON` could not perform a move because of the indicated
> `REASON` (such as paralysis, Disable, etc). Sometimes, the move it was
> trying to use is given.

`|faint|POKEMON`

> The Pokémon `POKEMON` has fainted.

######Minor actions

Minor actions are less important than major actions. In the official client,
they're usually displayed in small font if they have a message. Pretty much
anything that happens in a battle other than a switch or the fact that a move
was used is a minor action. So yes, the effects of a move such as damage or
stat boosts are minor actions.

`|-fail|POKEMON|ACTION`

> The specified `ACTION` has failed against the `POKEMON` targetted. The `ACTION`
>  in question can be a move that fails, or a stat drop blocked by an ability 
> like Hyper Cutter, in which case `ACTION` will be `unboost|STAT`, where `STAT` 
> indicates where the ability prevents stat drops. (For abilities that block all 
> stat drops, like Clear Body, `|STAT` does not appear.) 

`|-damage|POKEMON|HP STATUS`

> The specified Pokémon `POKEMON` has taken damage, and is now at
> `HP STATUS` (see `|switch|` for details).
>
> If `HP` is 0, `STATUS` should be ignored. The current behavior is for
> `STATUS` to be `fnt`, but this may change and should not be relied upon.

`|-heal|POKEMON|HP STATUS`

> Same as `-damage`, but the Pokémon has healed damage instead.

`|-status|POKEMON|STATUS`

> The Pokémon `POKEMON` has been inflicted with `STATUS`.

`|-curestatus|POKEMON|STATUS`

> The Pokémon `POKEMON` has recovered from `STATUS`.

`|-cureteam|POKEMON`

> The Pokémon `POKEMON` has used a move that cures its team of status effects, 
> like Heal Bell.

`|-boost|POKEMON|STAT|AMOUNT`

> The specified Pokémon `POKEMON` has gained `AMOUNT` in `STAT`, using the
> standard rules for Pokémon stat changes in-battle. `STAT` is a standard
> three-letter abbreviation fot the stat in question, so Speed will be `spe`,
> Special Defense will be `spd`, etc.

`|-unboost|POKEMON|STAT|AMOUNT`

> Same as `-boost`, but for negative stat changes instead.

`|-weather|WEATHER`

> Indicates the weather that is currently in effect. If `|[upkeep]` is present,
> it means that `WEATHER` was active previously and is still in effect that
> turn. Otherwise, it means that the weather has changed due to a move or ability,
> or has expired, in which case `WEATHER` will be `none`.

`|-fieldstart|CONDITION`

> The field condition `CONDITION` has started. Field conditions are all effects that
> affect the entire field and aren't a weather. (For example: Trick Room, Grassy
> Terrain)

`|-fieldend|CONDITION`

> Indicates that the field condition `CONDITION` has ended.

`|-sidestart|SIDE|CONDITION`

> A side condition `CONDITION` has started on `SIDE`. Side conditions are all effects
> that affect one side of the field. (For example: Tailwind, Stealth Rock, Reflect)

`|-sideend|SIDE|CONDITION`

> Indicates that the side condition `CONDITION` ended for the given `SIDE`.

`|-crit|POKEMON`

> A move has dealt a critical hit against the `POKEMON`.

`|-supereffective|POKEMON`

> A move was super effective against the `POKEMON`.

`|-resisted|POKEMON`

> A move was not very effective against the `POKEMON`.

`|-immune|POKEMON`

> The `POKEMON` was immune to a move.

`|-item|POKEMON|ITEM`

> The `ITEM` held by the `POKEMON` has been changed or revealed due to a move or 
> ability. In addition, Air Balloon reveals itself when the Pokémon holding it 
> switches in, so it will also cause this message to appear.

`|-enditem|POKEMON|ITEM`

> The `ITEM` held by `POKEMON` has been destroyed, and it now holds no item. This can 
> be because of an item's own effects (consumed Berries, Air Balloon), or by a move or 
> ability, like Knock Off. If a berry is consumed, it also has an additional modifier 
> `|[eat]` to indicate that it was consumed. This message does not appear if the item's 
> ownership was changed (with a move or ability like Thief or Trick), even if the move 
> or ability would result in a Pokémon without an item.

`|-ability|POKEMON|ABILITY`

> The `ABILITY` of the `POKEMON` has been changed due to a move/ability, or it has
> activated in a way that could not be better described by one of the other minor
> messages. For example, Clear Body sends `-fail` when it blocks stat drops, while
> Mold Breaker sends this message to reveal itself upon switch-in.
>
> Note that Skill Swap does not send this message despite it changing abilities,
> because it does not reveal abilities when used between allies in a Double or
> Triple Battle.

`|-endability|POKEMON`

> The `POKEMON` has had its ability surpressed, either by a move like Gastro Acid, or 
> by the effects of Mummy.

`|-transform|POKEMON|SPECIES`

> The Pokémon `POKEMON` has transformed into `SPECIES` by the effect of Transform 
> or the ability Imposter.

`|-mega|POKEMON|MEGASTONE`

> The Pokémon `POKEMON` used `MEGASTONE` to Mega Evolve.

`|-activate|EFFECT`

> A miscellaneous effect has activated. This is triggered whenever an effect could 
> not be better described by one of the other minor messages: for example, healing 
> abilities like Water Absorb simply use `-heal`, and items that are consumed upon 
> use have the `-enditem` message instead.

`|-hint|MESSAGE`

> Displays a message in parentheses to the client. Hint messages appear to explain and 
> clarify why certain actions, such as Fake Out and Mat Block failing, have occurred,  
> when there would normally be no in-game messages.

`|-center`

> Appears in Triple Battles when only one Pokémon remains on each side, to indicate
> that the Pokémon have been automatically centered.

`|-message|MESSAGE`

> Displays a miscellaneous message to the client. These messages are primarily used 
> for messages from game mods that aren't supported by the client, like rule clauses 
> such as Sleep Clause, or other metagames with custom messages for specific scenarios. 

I'll document all the message types eventually, but for now this should be
enough to get you started. You can watch the data sent and received from
the server on a regular connection, or look at the client source code
for a full list of message types.

######Action requests

These are how the client sends the player's decisions to the server. All
requests except `/undo` can be sent with `|RQID` at the end. `RQID` is
`REQUEST.rqid` from `|request|`. Each `RQID` is a unique number used to
identify which action the request was intended for and is used to protect
against race conditions involving `/undo` (the cancel button).

If an invalid request is sent, the game will replace the missing or
erroneous request with a valid choice, which is usually the first usable
move. 

`|/team ORDER`

> Chooses the team order. Numbers not listed are displaced to the back by swapping
> them with the number that took their place. For example `/team 25` sets the team
> order from default to 253416.

`|/move NUMBER TARGET`

> Uses your active Pokémon's `NUMBER`th move on `TARGET` Pokémon. `NUMBER` is usually
> a number ranging from 1 to 4 (although it can range up to 24 in Custom Games where
> Pokémon can have that many moves).
>
> `TARGET` is optional and only needs to be specified for single target moves in
> doubles/triples formats. Moves with `TARGET` specify which position they are trying
> to use the move on as a number wherein the opposing Pokémon are positive integers
> counting up from `1` starting on the right. Ally Pokémon targets are negative
> integers counting down from `-1` starting on the left. 
>
> If `mega` is added as a final parameter, the Pokémon will Mega Evolve if possible.

`|/switch NUMBER`

> Switches the active Pokémon with the `NUMBER`th Pokémon on the team. In cases where
> a Pokémon is KOed, their replacement is also chosen with `/switch`. This should
> correspond to a non-active, non-fainted Pokémon, which means `NUMBER` should be
> between 2 and 6.

`|/choose ACTION,ACTION,ACTION`

> For doubles/triples formats, decisions are sent for all team positions in the same
> line separated by commas. `ACTION` can be any of the following: `move`, `switch`,
> `shift`, `pass`.
>
> `move` and `switch` use the same syntax as their respective commands explained above
> except without the `/`. In triples, `/choose shift` requests to `|swap|` the current
> outside Pokémon to the middle team position. pass is used to indicate that the Pokémon
> in that slot is not performing an action, for instance, because the Pokémon is fainted
> and you have no non-fainted Pokémon to replace it with, or because the Pokémon is not
> fainted while you are switching in replacements for fainted Pokémon. For example,
> `/choose move 1 2,move 4 -1,pass` will have the leftmost Pokémon attack the opponent's
> middle Pokémon with its first move, the middle Pokémon will attack its ally to the 
> left with its fourth move, and the third team slot is empty.

`|/undo`

> Attempts to cancel the last request so a new one can be made.

####Global messages

`|popup|MESSAGE`

> Show the user a popup containing `MESSAGE`. `||` denotes a newline in
> the popup.

`|pm|SENDER|RECEIVER|MESSAGE`

> A PM was sent from `SENDER` to `RECEIVER` containing the message
> `MESSAGE`.

`|usercount|USERCOUNT`

> `USERCOUNT` is the number of users on the server.

`|nametaken|USERNAME|MESSAGE`

> You tried to change your username to `USERNAME` but it failed for the
> reason described in `MESSAGE`.

`|challstr|CHALLSTR`

> You just connected to the server, and we're giving you some information you'll need to log in.
>
> If you're already logged in and have session cookies, you can make an HTTP GET request to
> `http://play.pokemonshowdown.com/action.php?act=upkeep&challstr=CHALLSTR`
>
> Otherwise, you'll need to make an HTTP POST request to `http://play.pokemonshowdown.com/action.php`
> with the data `act=login&name=USERNAME&pass=PASSWORD&challstr=CHALLSTR`
>
> `USERNAME` is your username and `PASSWORD` is your password, and `CHALLSTR`
> is the value you got from `|challstr|`. Note that `CHALLSTR` contains `|`
> characters. (Also feel free to make the request to `https://` if your client
> supports it.)
>
> Either way, the response will start with `]` and be followed by a JSON
> object which we'll call `data`.
>
> Finish logging in (or renaming) by sending: `/trn USERNAME,0,ASSERTION`
> where `USERNAME` is your desired username and `ASSERTION` is `data.assertion`.

`|updateuser|USERNAME|NAMED|AVATAR`

> Your name or avatar was successfully changed. Your username is now `USERNAME`.
> `NAMED` will be `0` if you are a guest or `1` otherwise. And your avatar is
> now `AVATAR`.

`|formats|FORMATSLIST`

> This server supports the formats specified in `FORMATSLIST`. `FORMATSLIST`
> is a `|`-separated list of `FORMAT`s. `FORMAT` is a format name with one or
> more of these suffixes: `,#` if the format uses random teams, `,,` if the
> format is only available for searching, and `,` if the format is only
> available for challenging.
> Sections are separated by two vertical bars with the number of the column of
> that section prefixed by `,` in it. After that follows the name of the
> section and another vertical bar.

`|updatesearch|JSON`

> `JSON` is a JSON object representing the current state of what battles the
> user is currently searching for.

`|updatechallenges|JSON`

> `JSON` is a JSON object representing the current state of who the user
> is challenging and who is challenging the user.

`|queryresponse|QUERYTYPE|JSON`

> `JSON` is a JSON object representing containing the data that was requested
> with `/query QUERYTYPE` or `/query QUERYTYPE DETAILS`.
>
> Possible queries include `/query roomlist` and `/query userdetails USERNAME`.
