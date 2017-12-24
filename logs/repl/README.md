# repl directory

The REPL feature is enabled by default; it can be disabled in `config.js`.

This directory is used by default to store the REPL sockets to all of showdown's processes.

The intended uses of these REPL sockets are for debugging (especially when the server is seemingly frozen) and scripting.

You can use any tool capable of talking to Unix sockets such as `nc`. e.g. `nc -U app`, replacing `app` with the name of any socket in this directory.
