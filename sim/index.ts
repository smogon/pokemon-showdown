/**
 * Simulator process
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file is where the battle simulation itself happens.
 *
 * The most important part of the simulation happens in runEvent -
 * see that function's definition for details.
 *
 * @license MIT license
 */
import Dex = require('./dex');
import {Battle} from './battle';
import {Side} from './side';
import {Pokemon} from './pokemon';
import {PRNG} from './prng';
import {BattleStream}  from './battle-stream';
import TeamValidator = require('./team-validator');

export = {
	Pokemon,
	Side,
	Battle,
	PRNG,
	Dex,
	TeamValidator,

	BattleStream,
};
