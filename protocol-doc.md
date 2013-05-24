Protocol
========

Pokemon Showdown's protocol is relatively simple.

Pokemon Showdown is implemented in SockJS. SockJS is a compatibility
layer over raw WebSocket, so you can actually connect to Pokemon
Showdown directly using WebSocket:

    ws://sim.psim.us:8000/showdown/websocket
      or
    wss://sim.psim.us/showdown/websocket

Incoming messages
-----------------

Messages from the user to the server are in the form:

    ROOMID|TEXT

`ROOMID` can optionally be left blank if it's the lobby, or if the room
is irrelevant (for instance, if `TEXT` is a command like
`/join lobby` where it doesn't matter what room it's sent from.)

`TEXT` can contain newlines, in which case it'll be treated the same
way as if each line were sent to the room separately.

Outgoing messages
-----------------

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
    |c| Some dude|fuck you!
    Some dude was banned by Moderator.
    |l| Some dude

This might be displayed as:

    Some dude joined.
    @Moderator: hi!
    Some dude: fuck you!
    Some dude was banned by Moderator.
    Some dude left.

I'll document all the message types eventually, but for now this should be
enough to get you started. You can watch the data sent and received from
the server on a regular connection, or look at the client source code
for a full list of message types.
