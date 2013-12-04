/**
 * Chat plug-ins
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are chat plugins - small programs to enhace the chat rooms on Pokemon Showdown.
 * Plugins are objects inside the plugins object. The objects are expected to have data values and a commands object inside.
 * The data object saves the data relevant to the plugin, like scores.
 * The commands object is used to import the commands onto the chat commands.
 * It's very important that you don't add plug-in commands with the same name as existing commands.
 *
 * @license MIT license
 */

var plugins = exports.plugins = {
};
