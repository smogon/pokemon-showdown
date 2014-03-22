Protocol
========

Pokemon Showdown's protocol is relatively simple.

Pokemon Showdown is implemented in SockJS. SockJS is a compatibility
layer over raw WebSocket, so you can actually connect to Pokemon
Showdown directly using WebSocket:

    ws://sim.smogon.com:8000/showdown/websocket
      or
    wss://sim.smogon.com/showdown/websocket


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

    |tc|2|@Moderator|Some dude will join in two seconds!
    |j| Some dude
    |c|@Moderator|hi!
    |c| Some dude|you suck and i hate you!
    Some dude was banned by Moderator.
    |l| Some dude
    |b|battle-ou-12| Cool guy|@Moderator

This might be displayed as:

    @Moderator: Some dude will join in two seconds!
    Some dude joined.
    @Moderator: hi!
    Some dude: you suck and i hate you!
    Some dude was banned by Moderator.
    Some dude left.
    OU battle started between Cool guy and Moderator

For bandwidth reasons, there are five message types: `chat`, `join`, `leave`,
`name`, and `battle`, which are sometimes abbreviated to `c`, `j`, `l`, `n`,
and `b` respectively. All other message types are written out in full so they
should be easy to understand.

Four of these can be uppercase: `J`, `L`, `N`, and `B`, which are
the equivalent of their lowercase versions, but are recommended not to be
displayed inline because they happen too often. For instance, the main server
gets around 5 joins/leaves a second, and showing that inline with chat would
make it near-impossible to chat.

`tc` is pretty much the same as `c`, but also gives the delta time; the amount
of seconds passed since the message has been sent. This is so that when the
chat replays for example, the times shown are correct.

Some outgoing message types
---------------------------

`USER` = a user, the first character being their rank (users with no rank are
represented by a space), and the rest of the string being their username.

**Room initialization**

`|init|ROOMTYPE`

> The first message received from a room when you join it. `ROOMTYPE` is
> one of: `chat` or `battle`

`|users|USERLIST`

> `USERLIST` is a comma-separated list of `USER`s, sent from chat rooms when
> they're joined.

**Room messages**

`||MESSAGE` or `MESSAGE`

> We received a message `MESSAGE`, which should be displayed directly in
> the room's log.

`|html|HTML`

> We received an HTML message, which should be sanitized and displayed
> directly in the room's log.

`|join|USER` or `|j|USER`

> `USER` joined the room.

`|leave|USER` or `|l|USER`

> `USER` left the room.

`|name|USER|OLDID` or `|n|USER|OLDID`

> A user changed name to `USER`, and their previous userid was `OLDID`.

`|chat|USER|MESSAGE` or `|c|USER|MESSAGE`

> `USER` said `MESSAGE`. Note that `MESSAGE` can contain `|` characters,
> so you can't just split by `|` and take the fourth string.

`|battle|ROOMID|USER1|USER2` or `|b|ROOMID|USER1|USER2`

> A battle started between `USER1` and `USER2`, and the battle room has
> ID `ROOMID`.

**Battle messages**

Battle messages aren't documented yet.

I'll document all the message types eventually, but for now this should be
enough to get you started. You can watch the data sent and received from
the server on a regular connection, or look at the client source code
for a full list of message types.

**Global messages**

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

`|challstr|KEYID|CHALLENGE`

> You just connected to the server, and we're giving you some information you'll need to log in.
>
> If you're already logged in and have session cookies, you can make an HTTP GET request to
> `http://play.pokemonshowdown.com/action.php?act=upkeep&challengekeyid=KEYID&challenge=CHALLENGE`
>
> Otherwise, you'll need to make an HTTP POST request to `http://play.pokemonshowdown.com/action.php`
> with the data `act=login&name=USERNAME&pass=PASSWORD&challengekeyid=KEYID&challenge=CHALLENGE`
>
> `USERNAME` is your username and `PASSWORD` is your password, and `KEYID` and
> `CHALLENGE` are the values you got from `|challstr|`. (Also feel free to make
> the request to `https://` if your client supports it.)
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
