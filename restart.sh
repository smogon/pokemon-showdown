#!/bin/bash
if  pgrep node > /dev/null
then
	pkill node && screen -L -dmS pokemonshowdown node app.js &
else 
	screen -L -dmS pokemonshowdown node app.js &
fi
