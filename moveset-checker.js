// TODO:
//   - Check illegal egg move combinations
//   - Check for trading between generation restrictions (3->4, 4->5 removes all TM moves)
//   - Check for event pokemon learning moves from it's prevos
//   - Find more things that are missing from this list

exports.check = function(pokemon, pokemonData) {
	for (var m = 0; m < pokemon.moves.length; ++m) {
		pokemon.moves[m] = pokemon.moves[m].toLowerCase().replace(/[^a-z0-9]+/g, "");
	}

	var moveCombinations = getBestMoveCombinations(pokemon, pokemonData);
	if (moveCombinations.length === 0) return new Array(); // Empty moveset, but the error for that is elsewhere

	var problems = new Array();

	// Check if the pokemon can have any sketched moves
	var sketches = getNumberOfSketches(pokemonData);
	var isHasUnsketchableMove = false;
	if (sketches > 0 && moveCombinations[0].invalid.length > 0) {
		for (var m = 0; m < moveCombinations.length; ++m) {
			var curSketches = sketches;
			var isHasEventSketch = false;
			if (moveCombinations[m].valid.event) {
				var eventPokemon = Tools.getTemplate(moveCombinations[m].valid.event.data.pokemon).eventPokemon[moveCombinations[m].valid.event.data.id];
				if (eventPokemon.moves.indexOf('sketch') !== -1) {
					++curSketches;
					isHasEventSketch = true;
				}
			}
			var ignoredInvalidMoves = 0;
			while (curSketches > 0 && ignoredInvalidMoves < moveCombinations[m].invalid.length) {
				var invalidMove = moveCombinations[m].invalid[ignoredInvalidMoves];
				if (invalidMove.move === 'struggle' || invalidMove.move === 'chatter') {
					problems.push(pokemon.name + " (" + pokemon.species + ") can't sketch " + Tools.getMove(invalidMove.move).name + ".");
					isHasUnsketchableMove = true;
					++ignoredInvalidMoves;
					continue;
				}
				if (isHasEventSketch) {
					moveCombinations[m].valid.event.moves.push(invalidMove.move);
					isHasEventSketch = false;
				} else {
					moveCombinations[m].valid.nonEvent.push(invalidMove.move);
				}
				moveCombinations[m].invalid.splice(ignoredInvalidMoves, 1);
				--curSketches;
			}
		}
	}

	// Now check if all it's moves are valid
	if (moveCombinations[0].invalid.length !== 0) {
		if (sketches > 0) {
			if (!isHasUnsketchableMove) problems.push(pokemon.name + " (" + pokemon.species + ") can only sketch a maximum of " + sketches + " move(s).");
		} else {
			problems.push(pokemon.name + " (" + pokemon.species + ") doesn't have a valid moveset. (Placeholder)");
			problems.push("DEBUG: " + JSON.stringify(moveCombinations));
			if (moveCombinations.length > 1) {
				problems.push("DEBUG: Please send the data for " + pokemon.name + " (" + pokemon.species + ") to kota");
			}
		}
	} else {
		// Make sure the pokemon's nature, ability, gender and level matches any of the applicable events, if any
		var possibleNatures = new Array();
		var possibleAbilities = new Array();
		var possibleGenders = "N/A";
		var minLevel = 999;
		for (var m = 0; m < moveCombinations.length; ++m) {
			if (!moveCombinations[m].valid.event) continue;
			var eventPokemon = Tools.getTemplate(moveCombinations[m].valid.event.data.pokemon).eventPokemon[moveCombinations[m].valid.event.data.id];
			possibleNatures.push(eventPokemon.nature);
			possibleAbilities = possibleAbilities.concat(eventPokemon.abilities);

			var gender = eventPokemon.gender;
			if (possibleGenders === "N/A") {
				possibleGenders = gender;
			} else if (gender === "M/F" ||
				(possibleGenders === "M" && gender === "F") ||
				(possibleGenders === "F" && gender === "M")) {
				possibleGenders = "M/F";
			}
			if (eventPokemon.level < minLevel) {
				minLevel = eventPokemon.level;
			}
		}
		if (minLevel !== 999) {
			if (possibleNatures.indexOf("Any") === -1 &&
				possibleNatures.indexOf(pokemon.nature) === -1) {
				problems.push(pokemon.name + " (" + pokemon.species + ") can't have a " + pokemon.nature.toLowerCase() + " nature because it uses an event move and none of the event pokemon have it.");
			}
			if (possibleAbilities.indexOf(pokemon.ability.toLowerCase().replace(/[^a-z0-9]+/g, "")) === -1) {
				problems.push(pokemon.name + " (" + pokemon.species + ") can't have " + pokemon.ability + " because it uses an event move and none of the event pokemon have it.");
			}
			if (!pokemon.gender) {
				pokemon.gender = possibleGenders;
				if (pokemon.gender === "M/F") {
					pokemon.gender = Math.random() > 0.5 ? "M" : "F";
				}
			}
			if (possibleGenders === "N/A" && pokemon.gender !== "N" && pokemon.gender !== "N/A") {
				problems.push(pokemon.name + " (" + pokemon.species + ") can't have a gender.");
			} else if (possibleGenders === "M" && pokemon.gender === "F") {
				problems.push(pokemon.name + " (" + pokemon.species + ") must be male because it uses an event move and none of the event pokemon are female.");
			} else if (possibleGenders === "F" && pokemon.gender === "M") {
				problems.push(pokemon.name + " (" + pokemon.species + ") must be female because it uses an event move and none of the event pokemon are male.");
			}
			if (pokemon.level < minLevel) {
				problems.push(pokemon.name + " (" + pokemon.species + ") must be at least level " + minLevel + " because it uses an event move and none of the event pokemon are given out under that level.");
			}
		}
	}

	return problems;
}

function getBestMoveCombinations(pokemon, pokemonData) {
	var moveCombinations = getMoveCombinationsRecursive(pokemon, pokemonData);
	// First remove any move combinations that has an invalid move with the "event" reason
nextCombination:
	for (var m = 0; m < moveCombinations.length; ++m) {
		for (var i = 0; i < moveCombinations[m].invalid.length; ++i) {
			if (moveCombinations[m].invalid[i].reason === "event") {
				moveCombinations.splice(m, 1);
				--m;
				continue nextCombination;
			}
		}
	}

	// Sort the combinations by the amount of invalid moves, ascending, then by whether
	// the combination uses an event move or not, with no event taking priority.
	moveCombinations = moveCombinations.sort(function(a, b) {
			var result = a.invalid.length - b.invalid.length;
			if (result === 0) {
				result = !!a.valid.event - !!b.valid.event;
			}
			return result;
		});
	if (moveCombinations.length === 0) return new Array();

	// Non-event combinations is always better, and there can only be one of them
	if (!moveCombinations[0].valid.event) return [moveCombinations[0]];

	var results = new Array();
	results.push(moveCombinations[0]);
	for (var m = 1; m < moveCombinations.length; ++m) {
		if (moveCombinations[m].invalid.length === moveCombinations[m - 1].invalid.length) {
			results.push(moveCombinations[m]);
		} else {
			break;
		}
	}
	return results;
}

function getMoveCombinationsRecursive(pokemon, pokemonData) {
	if (pokemonData.prevo) {
		var prevoData = Tools.getTemplate(pokemonData.prevo);
		if (!prevoData.exists) {
			throw new Error("Warning: Prevo for " + pokemonData.name + " doesn't exist! Badly formed pokedex.js?");
		}

		var prevoMoves = getMoveCombinationsRecursive(pokemon, prevoData);
		var results = new Array();
		for (var m = 0; m < prevoMoves.length; ++m) {
			var testPokemon = JSON.parse(JSON.stringify(pokemon));
			testPokemon.moves = new Array();
			for (var i = 0; i < prevoMoves[m].invalid.length; ++i) {
				testPokemon.moves.push(prevoMoves[m].invalid[i].move);
			}
			var testResults = getMoveCombinations(testPokemon, pokemonData);
			for (var r = 0; r < testResults.length; ++r) {
				var result = {
						valid: {nonEvent: prevoMoves[m].valid.nonEvent.concat(testResults[r].valid.nonEvent)},
						invalid: new Array()
					};
				if (prevoMoves[m].valid.event) {
					result.valid.event = {
							moves: prevoMoves[m].valid.event.moves.slice(0),
							data: prevoMoves[m].valid.event.data
						};
					if (testResults[r].valid.event) {
						for (var re = 0; re < testResults[r].valid.event.moves.length; ++re) {
							result.invalid.push({move: testResults[r].valid.event.moves[re], reason: "anotherevent"});
						}
					}
				} else if (testResults[r].valid.event) {
					result.valid.event = {
							moves: testResults[r].valid.event.moves.slice(0),
							data: testResults[r].valid.event.data
						};
				}
				for (var ri = 0; ri < testResults[r].invalid.length; ++ri) {
					var prevoInvalidReason;
					for (var i = 0; i < prevoMoves[m].invalid.length; ++i) {
						if (prevoMoves[m].invalid[i].move === testResults[r].invalid[ri].move) {
							prevoInvalidReason = prevoMoves[m].invalid[i].reason;
							break;
						}
					}
					//assert(prevoInvalidReason);
					if (prevoInvalidReason === "notinlearnset" || prevoInvalidReason === "event") {
						result.invalid.push(testResults[r].invalid[ri]);
					} else {
						result.invalid.push({move: testResults[r].invalid[ri].move, reason: prevoInvalidReason});
					}
				}
				results.push(result);
			}
		}
		return results;
	} else {
		return getMoveCombinations(pokemon, pokemonData);
	}
}

/* Possible reasons for unlearnable moves:
 *   - "notinlearnset"
 *   - "event" (When isIgnoreEvent is set)
 *   - "anotherevent"
 *   - "eggbutevent"
 *   - "eggatcurlevelbutevent"
 */
function getMoveCombinations(pokemon, pokemonData) {
	var results = new Array();

	// First consider any event-only moves to be invalid
	// TODO: Check for invalid egg move combinations here
	var movesWithoutEvent = splitMoves(pokemon, pokemonData, true);
	results.push({
			valid: {nonEvent: movesWithoutEvent.learnable.nonEvent.slice(0)},
			invalid: movesWithoutEvent.unlearnable.slice(0)
		});

	// Now include event moves
	var moves = splitMoves(pokemon, pokemonData);
	var eventMoveCombinations = getEventMoveCombinations(moves.learnable.event, pokemonData);
	for (var c = 0; c < eventMoveCombinations.length; ++c) {
		var result = {
				valid: {
					nonEvent: moves.learnable.nonEvent.slice(0),
					event: {moves: eventMoveCombinations[c].inSet.slice(0), data: {pokemon: pokemonData.id, id: eventMoveCombinations[c].eventId}}
				},
				invalid: moves.unlearnable.slice(0)
			};
		for (var m = 0; m < eventMoveCombinations[c].notInSet.length; ++m) {
			result.invalid.push({move: eventMoveCombinations[c].notInSet[m], reason: "anotherevent"});
		}
		results.push(result);
	}

	return results;
}

function splitMoves(pokemon, pokemonData, isIgnoreEvent) {
	// First split the moves in to learnable and unlearnable moves
	var moves = pokemon.moves;
	var learnableMoves = new Array();
	var unlearnableMoves = new Array();
	for (var m = 0; m < moves.length; ++m) {
		if (pokemonData.learnset[moves[m]] && pokemonData.learnset[moves[m]].length > 0) {
			learnableMoves.push(moves[m]);
		} else {
			unlearnableMoves.push({move: moves[m], reason: "notinlearnset"});
		}
	}

	// Get the data for the learnable moves
	var learnableMovesData = new Object();
	for (var m = 0; m < learnableMoves.length; ++m) {
		learnableMovesData[learnableMoves[m]] = getMoveData(learnableMoves[m], pokemonData);
	}

	// Split the learnable moves in to event-only and non-event moves
	var eventMoves = new Array();
	var nonEventMoves = new Array();
	for (var m = 0; m < learnableMoves.length; ++m) {
		if (learnableMovesData[learnableMoves[m]].event.length > 0 &&
			learnableMovesData[learnableMoves[m]].levelup.length === 0 &&
			!learnableMovesData[learnableMoves[m]].isEgg &&
			!learnableMovesData[learnableMoves[m]].isTutor &&
			!learnableMovesData[learnableMoves[m]].isMachine) {
			if (!isIgnoreEvent) {
				eventMoves.push(learnableMoves[m]);
			} else {
				unlearnableMoves.push({move: learnableMoves[m], reason: "event"});
			}
		} else {
			nonEventMoves.push(learnableMoves[m]);
		}
	}

	// If there are event moves...
	if (eventMoves.length > 0) {
		// Make sure there a no egg moves in the non-event moves
		for (var m = 0; m < nonEventMoves.length; ++m) {
			if (learnableMovesData[nonEventMoves[m]].isEgg &&
				!learnableMovesData[nonEventMoves[m]].isTutor &&
				!learnableMovesData[nonEventMoves[m]].isMachine &&
				learnableMovesData[nonEventMoves[m]].levelup.length === 0) {
				if (learnableMovesData[nonEventMoves[m]].event.length > 0) {
					eventMoves.push(nonEventMoves[m]);
				} else {
					unlearnableMoves.push({move: nonEventMoves[m], reason: "eggbutevent"});
				}
				nonEventMoves.splice(m, 1);
				--m;
			} else if (learnableMovesData[nonEventMoves[m]].levelup.length > 0 &&
				!learnableMovesData[nonEventMoves[m]].isTutor &&
				!learnableMovesData[nonEventMoves[m]].isMachine) {
				var minLevelLearnt = 999;
				for (var l = 0; l < learnableMovesData[nonEventMoves[m]].levelup.length; ++l) {
					if (learnableMovesData[nonEventMoves[m]].levelup[l] < minLevelLearnt) {
						minLevelLearnt = learnableMovesData[nonEventMoves[m]].levelup[l];
					}
				}
				if (minLevelLearnt > pokemon.level) {
					if (learnableMovesData[nonEventMoves[m]].event.length > 0) {
						eventMoves.push(nonEventMoves[m]);
					} else {
						unlearnableMoves.push({move: nonEventMoves[m], reason: "eggatcurlevelbutevent"});
					}
					nonEventMoves.splice(m, 1);
					--m;
				}
			}
		}
	}

	return {
			learnable: {event: eventMoves, nonEvent: nonEventMoves},
			unlearnable: unlearnableMoves
		};
}

function getEventMoveCombinations(eventMoves, pokemonData) {
	// Get the data for event moves
	var eventMovesData = new Object();
	for (var e = 0; e < eventMoves.length; ++e) {
		eventMovesData[eventMoves[e]] = getMoveData(eventMoves[e], pokemonData);
	}

	// Get all the event ids
	var allEventIds = new Array();
	for (var e = 0; e < eventMoves.length; ++e) {
		var eventIds = eventMovesData[eventMoves[e]].event;
		for (var i = 0; i < eventIds.length; ++i) {
			if (allEventIds.indexOf(eventIds[i]) === -1) {
				allEventIds.push(eventIds[i]);
			}
		}
	}

	// Work out the move combinations
	var results = new Array();
	for (var i = 0; i < allEventIds.length; ++i) {
		var inSet = new Array();
		var notInSet = new Array();
		for (var e = 0; e < eventMoves.length; ++e) {
			var eventIds = eventMovesData[eventMoves[e]].event;
			if (eventIds.indexOf(allEventIds[i]) === -1) {
				notInSet.push(eventMoves[e]);
			} else {
				inSet.push(eventMoves[e]);
			}
		}
		results.push({inSet: inSet, notInSet: notInSet, eventId: allEventIds[i]});
	}
	return results;
}

function getNumberOfSketches(pokemonData) {
	if (!pokemonData.learnset['sketch'] || pokemonData.learnset['sketch'].length === 0) return 0;
	// There is no need to check prevos as of when this was written, as all the pokemon
	// that had sketch was Smeargle and Necturna, both of which don't have prevos
	var moveData = getMoveData('sketch', pokemonData);
	var result = 0;
	if (moveData.isEgg) ++result;
	if (moveData.isTutor) ++result;
	if (moveData.isMachine) result = Infinity;
	if (moveData.levelup.length > 0) result = Infinity;
	return result;
}

function getMoveData(move, pokemonData) {
	var result = {
			isEgg: false,
			isTutor: false,
			isMachine: false,
			levelup: new Array(),
			event: new Array()
		};
	if (!pokemonData.learnset[move]) return result;

	for (var l = 0; l < pokemonData.learnset[move].length; ++l) {
		switch (pokemonData.learnset[move][l][1]) {
			case 'E':
				result.isEgg = true;
				break;

			case 'T':
				result.isTutor = true;
				break;

			case 'M':
				result.isMachine = true;
				break;

			case 'S':
				result.event.push(parseInt(pokemonData.learnset[move][l].slice(2), 10));
				break;

			case 'L':
				result.levelup.push(parseInt(pokemonData.learnset[move][l].slice(2), 10));
				break;
		}
	}
	return result;
}

// Debugging use
exports.getBestMoveCombinations = getBestMoveCombinations;
exports.getMoveCombinationsRecursive = getMoveCombinationsRecursive;
