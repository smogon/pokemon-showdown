Pokémon Showdown Logging
========================================================================

This is the Pokémon Showdown log directory.

Pokémon Showdown will, by default, log rated battles in each format, but not unrated
battles. To enable logging of unrated battles, turn on the config setting `logchallenges`.
There is currently no config option to disable logs for rated battles.
Battle logs are placed under a subdirectory for each month (e.g. `2013-02`).

Moderator actions are logged in the subdirectory `modlog`.
Each chat room has a separate log file (e.g. `modlog_lobby.txt`).
Battle rooms share a single log file, which is named `modlog_battle.txt`.

If the server or the simulator process crashes, a stack trace will
usually be logged to `errors.txt`.

By default, Pokémon Showdown does not log chat rooms. However, you can
enable their logging by setting the `logchat` option in `config.js`.
If you enable it, the logs are written in the subdirectory named `chat`.
Each room gets their own subdirectory within, which are furthermore classified by month.

