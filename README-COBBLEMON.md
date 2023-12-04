## Debugging

For anyone who has to do any work on the showdown side of the project, you no longer need to go through the annoying process of building showdown, copying the data into the zip, updating the showdown json, and restarting your client. There's a few new commands available that you can use.

When you're in the root folder of showdown, you can use `node pokemon-showdown cobbled-debug-server [PORT]` to launch a server intended for Cobblemon use. With this, you have two options:
1. Launch a command-line client with `node pokemon-showdown cobbled-debug-client [SERVER PORT]`, which will take user input, send it to the showdown server, and print the output
2. Swap the showdown implementation in `ShowdownService` to `SocketShowdownService` in the Cobblemon mod. This will connect to the debug server. If you need to make changes to the showdown server while the mod is running, you can restart the server and run the Minecraft command `/reloadshowdown` , which will re-establish the connection.

## Building
When you're in the root folder of showdown, you can now use `node build --cobbled`, which will remove redundant modules, copy over the cobbled server bootstrap, and zip it under showdown.zip in a cobblemon-showdown subfolder.
You can then copy that over to Cobblemon and update the showdown.json when you are finished with your changes. 

## Updating from Smogon
Pull from the Showdown github to get updates from Smogon. When new formats are added by Smogon, they have to get added to dex.ts, inside includeMods(). This is because we don't get to use fs to autodiscover all the mods, so we have to hardcode which folders to load.
