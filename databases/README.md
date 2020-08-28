# Pokémon Showdown SQLite layout

## Overall
Each SQLite database file (`.db`) should be stored under the `databases/` folder.

Each `.db` file should have a matching `.sql` file containing its schema under the `databases/schemas/` folder. 
Chat plugin database files are the only exception to this - chat plugin `.sql` files should go under the `schemas/chat-plugins/` folder, as they are loaded into their own singular `chat-plugins.db` file.
All tables should use `CREATE ... IF NOT EXISTS` syntax so that they can be run on server startup, table not found errors, hotpatches,or other occasions. 

## Chat Plugins

All chat plugins tables should be prefixed by the name of said plugin, to avoid namespace errors. For example, the Help filter pluginm ight have a table called `help_regexes`, or the Trivia plugin might have a table called `trivia_questions`.
