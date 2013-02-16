Pokemon Showdown Logging
========================================================================

This is the Pokemon Showdown log directory.

Pokemon Showdown will log rated battles in each format, but not unrated
battles. There is currently no config option to log unrated battles.
Battle logs are placed under a subdirectory for each month (e.g. `2013-02`).

Moderator actions are logged to `modlog.txt`.

If the server or the simulator process crashes, a stack trace will
usually be logged to `errors.txt`.

By default, Pokemon Showdown does not log the lobby. However, you can
enable logging of the lobby by setting the `loglobby` option in
`config.js`. If you enable lobby logging, lobby logs are written to
a subdirectory named `lobby`.
