Pokemon Showdown architecture
=============================

At the highest level, PS is split into three parts:

- Game server (**[smogon/pokemon-showdown](https://github.com/smogon/pokemon-showdown)**)
- Client (**[smogon/pokemon-showdown-client](https://github.com/smogon/pokemon-showdown-client)**)
- Login server (**[smogon/pokemon-showdown-loginserver](https://github.com/smogon/pokemon-showdown-loginserver)**)

All three communicate directly with each other.

A user starts by visiting `https://play.pokemonshowdown.com/`. This is handled by an Apache server (in the Client), which serves mostly static files but uses some PHP (legacy, intended to be migrated to Loginserver).

The user's web browser (running Client code) will then communicate with the Login server (mounted at `https://play.pokemonshowdown.com/api/` to handle logins mostly, or otherwise interface with the Client databases one way or another).

The user's web browser will also connect to the Game server, through SockJS. The Game server handles the chat rooms, matchmaking, and actual battle simulation.

The Game server also communicates with the Login server, to handle replay uploads (and, for the main server, ladder updates).


Game server
-----------

The game server is written in TypeScript and runs on Node.js.

Its entry point is [server/index.ts](./server/index.ts), which launches several major components:

- [server/sockets.ts](./server/sockets.ts) sets up a SockJS (abstracted WebSocket) server to accept connections from clients

- [server/users.ts](./server/users.ts) sets up `Users`, which wraps the SockJS connections in a system that handles users

- [server/rooms.ts](./server/rooms.ts) sets up `Rooms`, which handles the individual chat rooms and battle rooms

- [server/chat.ts](./server/chat.ts) sets up `Chat`, which handles chat commands and messages coming in from users (all client-to-server commands are routed through there)

`Rooms` also includes support for battle rooms, which is where the server connects to the game simulator itself. Game simulation code is in [sim/](./sim/).


Client
------

The client is built in a mix of TypeScript and JavaScript, with a mostly hand-rolled framework built on Backbone. There’s a rewrite to migrate it to Preact but it’s very stalled.

Its entry point is [index.template.html](https://github.com/smogon/pokemon-showdown-client/blob/master/play.pokemonshowdown.com/index.template.html)

It was written long ago, so instead of a single JS entry point, it includes a lot of JS files. Everything important is launched from [js/client.js](https://github.com/smogon/pokemon-showdown-client/blob/master/play.pokemonshowdown.com/js/client.js)


Login server
------------

The client’s login server, which handles logins and most database interaction, is written in TypeScript. The backend is currently split between a MySQL InnoDB database (for users, ladder, and most other things) and a Postgres (technically Cockroach) database (for Replays).

Its entry point is [server.ts](https://github.com/smogon/pokemon-showdown-loginserver/blob/master/src/server.ts).

It's intended to replace all of the old PHP code in the Client, but that migration is only halfway done at the moment.
