var BattleTooltips = (function () {

	// In addition to some static methods:
	//   BattleTooltips.tooltipAttrs()
	//   BattleTooltips.showTooltip()
	//   BattleTooltips.hideTooltip()
	// Most tooltips tend to involve a battle and/or room object
	function BattleTooltips(battle, room) {
		this.battle = battle;
		this.room = room;

		// tooltips
		var buf = '';
		var tooltips = {
			your2: {top: 70, left: 250, width: 80, height: 100},
			your1: {top: 85, left: 320, width: 90, height: 100},
			your0: {top: 90, left: 390, width: 100, height: 100},
			my0: {top: 200, left: 130, width: 120, height: 160},
			my1: {top: 200, left: 250, width: 150, height: 160},
			my2: {top: 200, left: 350, width: 150, height: 160}
		};
		for (var active in tooltips) {
			buf += '<div style="position:absolute;';
			for (var css in tooltips[active]) {
				buf += css + ':' + tooltips[active][css] + 'px;';
			}
			buf += '"' + this.tooltipAttrs(active, 'pokemon', true) + '></div>';
		}
		room.$foeHint.html(buf);
	}

	BattleTooltips.showTooltipFor = function (roomid, thing, type, elem, ownHeight) {
		app.rooms[roomid].tooltips.showTooltip(thing, type, elem, ownHeight);
	};
	BattleTooltips.hideTooltip = function () {
		$('#tooltipwrapper').html('');
	};
	// tooltips
	// Touch delay, pressing finger more than that time will cause the tooltip to open.
	// Shorter time will cause the button to click
	var LONG_TAP_DELAY = 350; // ms
	var touchTooltipTimeout;
	var runClickActionOfButtonWithTooltip = false;

	// Each time a finger presses the button this function will be callled
	// First finger starts the counter, and when last finger leaves time is checked
	BattleTooltips._handleTouchStartFor = function (e, roomid, thing, type, elem, ownHeight) {
		// Prevent default on touch events to block mouse events when touch is used
		e.preventDefault();

		// On first tap start counting
		if (e.touches.length === 1) {
			// Timeout will be canceled by `_handleTouchEndFor` if a short tap have occurred
			touchTooltipTimeout = setTimeout(function () {
				touchTooltipTimeout = undefined;
				BattleTooltips.showTooltipFor(roomid, thing, type, elem, ownHeight);
			}, LONG_TAP_DELAY);
		}
	};
	BattleTooltips._handleTouchLeaveFor = function (e) {
		// Prevent default on touch events to block mouse events when touch is used
		e.preventDefault();

		// If tooltip is open and the last finger just left, close the tooptip
		if (touchTooltipTimeout === undefined && e.touches.length === 0) {
			BattleTooltips.hideTooltip();
		}
	};
	BattleTooltips._handleTouchEndFor = function (e, elem) {
		// Close tooptip if needed
		BattleTooltips._handleTouchLeaveFor(e);

		// If tooltip is not opened (`touchTooltipTimeout` is still defined) and the last finger left,
		// meaning the timeout in `_handleTouchStartFor` wasn't fired, fire the action
		if (touchTooltipTimeout !== undefined && e.touches.length === 0) {
			clearTimeout(touchTooltipTimeout);
			touchTooltipTimeout = undefined;
			runClickActionOfButtonWithTooltip = true;

			// Need to call `click` event manually because we prevented default behaviour of `touchend` event
			elem.click();
		}
	};
	// Call click on mouse up, because `runClickActionOfButtonWithTooltip` must be set before the click
	BattleTooltips._handleMouseUpFor = function () {
		BattleTooltips.hideTooltip();
		runClickActionOfButtonWithTooltip = true;
	};
	// Stop click from doing it's action unless `runClickActionOfButtonWithTooltip` was set to true
	// (in `_handleMouseUpFor` or in `_handleTouchEndFor`)
	BattleTooltips._handleClickFor = function (e) {
		if (!runClickActionOfButtonWithTooltip) {
			e.stopPropagation();
		} else {
			// Reset `runClickActionOfButtonWithTooltip` value to false for next click
			runClickActionOfButtonWithTooltip = false;
		}
	};
	BattleTooltips.prototype.tooltipAttrs = function (thing, type, ownHeight) {
		var roomid = this.room.id;
		return ' onclick="BattleTooltips._handleClickFor(event)"' +
		' ontouchstart="BattleTooltips._handleTouchStartFor(event, \'' + roomid + '\', \'' + BattleLog.escapeHTML('' + thing, true) + '\',\'' + type + '\', this, ' + (ownHeight ? 'true' : 'false') + ')"' +
		' ontouchend="BattleTooltips._handleTouchEndFor(event, this)"' +
		' ontouchleave="BattleTooltips._handleTouchLeaveFor(event)"' +
		' ontouchcancel="BattleTooltips._handleTouchLeaveFor(event)"' +
		' onmouseover="BattleTooltips.showTooltipFor(\'' + roomid + '\', \'' + BattleLog.escapeHTML('' + thing, true) + '\',\'' + type + '\', this, ' + (ownHeight ? 'true' : 'false') + ')"' +
		' onfocus="BattleTooltips.showTooltipFor(\'' + roomid + '\', \'' + BattleLog.escapeHTML('' + thing, true) + '\',\'' + type + '\', this, ' + (ownHeight ? 'true' : 'false') + ')"' +
		' onmouseout="BattleTooltips.hideTooltip()"' +
		' onblur="BattleTooltips.hideTooltip()"' +
		' onmouseup="BattleTooltips._handleMouseUpFor()"' +
		' aria-describedby="tooltipwrapper"';
	};
	BattleTooltips.prototype.showTooltip = function (thing, type, elem, ownHeight) {
		var room = this.room;

		var text = '';
		switch (type) {
		case 'move':
		case 'zmove':
			var move = Dex.getMove(thing);
			if (!move) return;
			text = this.showMoveTooltip(move, type === 'zmove');
			break;

		case 'pokemon':
			var side = room.battle[thing.slice(0, -1) + "Side"];
			var pokemon = side.active[thing.slice(-1)];
			if (!pokemon) return;
			/* falls through */
		case 'sidepokemon':
			var pokemonData;
			var isActive = (type === 'pokemon');
			if (room.myPokemon) {
				if (!pokemon) {
					pokemonData = room.myPokemon[parseInt(thing, 10)];
					pokemon = pokemonData;
				} else if (room.controlsShown && pokemon.side === room.battle.mySide) {
					// battlePokemon = pokemon;
					pokemonData = room.myPokemon[pokemon.slot];
				}
			}
			text = this.showPokemonTooltip(pokemon, pokemonData, isActive);
			break;
		}

		var offset = {
			left: 150,
			top: 500
		};
		if (elem) offset = $(elem).offset();
		var x = offset.left - 2;
		if (elem) {
			if (ownHeight) offset = $(elem).offset();
			else offset = $(elem).parent().offset();
		}
		var y = offset.top - 5;

		if (x > room.leftWidth + 335) x = room.leftWidth + 335;
		if (y < 140) y = 140;
		if (x > $(window).width() - 303) x = Math.max($(window).width() - 303, 0);

		if (!$('#tooltipwrapper').length) $(document.body).append('<div id="tooltipwrapper" onclick="$(\'#tooltipwrapper\').html(\'\');" role="tooltip"></div>');
		$('#tooltipwrapper').css({
			left: x,
			top: y
		});
		$('#tooltipwrapper').html(text).appendTo(document.body);
		if (elem) {
			var height = $('#tooltipwrapper .tooltip').height();
			if (height > y) {
				y += height + 10;
				if (ownHeight) y += $(elem).height();
				else y += $(elem).parent().height();
				$('#tooltipwrapper').css('top', y);
			}
		}
	};

	BattleTooltips.prototype.hideTooltip = function () {
		BattleTooltips.hideTooltip();
	};

	BattleTooltips.prototype.zMoveEffects = {
		'clearnegativeboost': "Restores negative stat stages to 0",
		'crit2': "Crit ratio +2",
		'heal': "Restores HP 100%",
		'curse': "Restores HP 100% if user is Ghost type, otherwise Attack +1",
		'redirect': "Redirects opposing attacks to user",
		'healreplacement': "Restores replacement's HP 100%"
	};

	BattleTooltips.prototype.getStatusZMoveEffect = function (move) {
		if (move.zMoveEffect in this.zMoveEffects) {
			return this.zMoveEffects[move.zMoveEffect];
		}
		var boostText = '';
		if (move.zMoveBoost) {
			var boosts = Object.keys(move.zMoveBoost);
			boostText = boosts.map(function (stat) {
				return BattleStats[stat] + ' +' + move.zMoveBoost[stat];
			}).join(', ');
		}
		return boostText;
	};

	BattleTooltips.prototype.zMoveTable = {
		Poison: "Acid Downpour",
		Fighting: "All-Out Pummeling",
		Dark: "Black Hole Eclipse",
		Grass: "Bloom Doom",
		Normal: "Breakneck Blitz",
		Rock: "Continental Crush",
		Steel: "Corkscrew Crash",
		Dragon: "Devastating Drake",
		Electric: "Gigavolt Havoc",
		Water: "Hydro Vortex",
		Fire: "Inferno Overdrive",
		Ghost: "Never-Ending Nightmare",
		Bug: "Savage Spin-Out",
		Psychic: "Shattered Psyche",
		Ice: "Subzero Slammer",
		Flying: "Supersonic Skystrike",
		Ground: "Tectonic Rage",
		Fairy: "Twinkle Tackle"
	};

	BattleTooltips.prototype.showMoveTooltip = function (move, isZ) {
		var text = '';
		var basePowerText = '';
		var additionalInfo = '';
		var zEffect = '';
		var yourActive = this.battle.yourSide.active;
		var pokemon = this.battle.mySide.active[this.room.choice.choices.length];
		var pokemonData = this.room.myPokemon[pokemon.slot];
		// TODO: move this somewhere it makes more sense
		if (pokemon.ability === '(suppressed)') pokemonData.ability = '(suppressed)';
		var ability = toId(pokemonData.ability || pokemon.ability || pokemonData.baseAbility);

		if (isZ) {
			var item = Dex.getItem(pokemonData.item);
			if (item.zMoveFrom == move.name) {
				move = Dex.getMove(item.zMove);
			} else if (move.category === 'Status') {
				move = JSON.parse(JSON.stringify(move));
				move.name = 'Z-' + move.name;
				zEffect = this.getStatusZMoveEffect(move);
			} else {
				var zmove = Dex.getMove(this.zMoveTable[item.zMoveType]);
				zmove = JSON.parse(JSON.stringify(zmove));
				zmove.category = move.category;
				zmove.basePower = move.zMovePower;
				move = zmove;
				// TODO: Weather Ball type-changing shenanigans
			}
		}

		var basePower = move.basePower;

		// Check if there are more than one active Pokémon to check for multiple possible BPs.
		if (yourActive.length > 1) {
			// We check if there is a difference in base powers to note it.
			// Otherwise, it is just shown as in singles.
			// The trick is that we need to calculate it first for each Pokémon to see if it changes.
			var previousBasepower = false;
			var difference = false;
			var basePowers = [];
			for (var i = 0; i < yourActive.length; i++) {
				if (!yourActive[i]) continue;
				basePower = this.getMoveBasePower(move, pokemon, yourActive[i]);
				if (previousBasepower === false) previousBasepower = basePower;
				if (previousBasepower !== basePower) difference = true;
				if (!basePower) basePower = '&mdash;';
				basePowers.push('Base power for ' + yourActive[i].name + ': ' + basePower);
			}
			if (difference) {
				basePowerText = '<p>' + basePowers.join('<br />') + '</p>';
			}
			// Falls through to not to repeat code on showing the base power.
		}
		if (!basePowerText) {
			var activeTarget = yourActive[0] || yourActive[1] || yourActive[2];
			basePower = this.getMoveBasePower(move, pokemon, activeTarget) || basePower;
			if (!basePower) basePower = '&mdash;';
			basePowerText = '<p>Base power: ' + basePower + '</p>';
		}
		var accuracy = this.getMoveAccuracy(move, pokemon);

		// Handle move type for moves that vary their type.
		var moveType = this.getMoveType(move, pokemon);

		// Deal with Nature Power special case, indicating which move it calls.
		if (move.id === 'naturepower') {
			var calls;
			if (this.battle.gen > 5) {
				if (this.battle.hasPseudoWeather('Electric Terrain')) {
					calls = 'Thunderbolt';
				} else if (this.battle.hasPseudoWeather('Grassy Terrain')) {
					calls = 'Energy Ball';
				} else if (this.battle.hasPseudoWeather('Misty Terrain')) {
					calls = 'Moonblast';
				} else if (this.battle.hasPseudoWeather('Psychic Terrain')) {
					calls = 'Psychic';
				} else {
					calls = 'Tri Attack';
				}
			} else if (this.battle.gen > 3) {
				// In gens 4 and 5 it calls Earthquake.
				calls = 'Earthquake';
			} else {
				// In gen 3 it calls Swift, so it retains its normal typing.
				calls = 'Swift';
			}
			calls = Dex.getMove(calls);
			additionalInfo = 'Calls ' + Dex.getTypeIcon(this.getMoveType(calls, pokemon)) + ' ' + calls.name;
		}

		text = '<div class="tooltipinner"><div class="tooltip">';
		var category = Dex.getCategory(move, this.battle.gen, moveType);
		text += '<h2>' + move.name + '<br />' + Dex.getTypeIcon(moveType) + ' <img src="' + Dex.resourcePrefix;
		text += 'sprites/categories/' + category + '.png" alt="' + category + '" /></h2>';
		text += basePowerText;
		if (additionalInfo) text += '<p>' + additionalInfo + '</p>';
		text += '<p>Accuracy: ' + accuracy + '</p>';
		if (zEffect) text += '<p>Z-Effect: ' + zEffect + '</p>';
		if (this.battle.gen < 7 || this.battle.hardcoreMode) {
			var desc = move.shortDesc;
			for (var i = this.battle.gen; i < 7; i++) {
				if (move.id in BattleTeambuilderTable['gen' + i].overrideMoveDesc) {
					desc = BattleTeambuilderTable['gen' + i].overrideMoveDesc[move.id];
					break;
				}
			}
			text += '<p class="section">' + desc + '</p>';
		} else {
			text += '<p class="section">';
			if (move.priority > 1) {
				text += 'Nearly always moves first <em>(priority +' + move.priority + ')</em>.</p><p>';
			} else if (move.priority <= -1) {
				text += 'Nearly always moves last <em>(priority &minus;' + (-move.priority) + ')</em>.</p><p>';
			} else if (move.priority == 1) {
				text += 'Usually moves first <em>(priority +' + move.priority + ')</em>.</p><p>';
			}

			text += '' + (move.desc || move.shortDesc) + '</p>';

			if ('defrost' in move.flags) {
				text += '<p class="movetag">The user thaws out if it is frozen.</p>';
			}
			if (!('protect' in move.flags) && move.target !== 'self' && move.target !== 'allySide' && move.target !== 'allyTeam') {
				text += '<p class="movetag">Not blocked by Protect <small>(and Detect, King\'s Shield, Spiky Shield)</small></p>';
			}
			if ('authentic' in move.flags) {
				text += '<p class="movetag">Bypasses Substitute <small>(but does not break it)</small></p>';
			}
			if (!('reflectable' in move.flags) && move.target !== 'self' && move.target !== 'allySide' && move.target !== 'allyTeam' && move.category === 'Status') {
				text += '<p class="movetag">&#x2713; Not bounceable <small>(can\'t be bounced by Magic Coat/Bounce)</small></p>';
			}

			if ('contact' in move.flags) {
				text += '<p class="movetag">&#x2713; Contact <small>(triggers Iron Barbs, Spiky Shield, etc)</small></p>';
			}
			if ('sound' in move.flags) {
				text += '<p class="movetag">&#x2713; Sound <small>(doesn\'t affect Soundproof pokemon)</small></p>';
			}
			if ('powder' in move.flags) {
				text += '<p class="movetag">&#x2713; Powder <small>(doesn\'t affect Grass, Overcoat, Safety Goggles)</small></p>';
			}
			if ('punch' in move.flags && ability === 'ironfist') {
				text += '<p class="movetag">&#x2713; Fist <small>(boosted by Iron Fist)</small></p>';
			}
			if ('pulse' in move.flags && ability === 'megalauncher') {
				text += '<p class="movetag">&#x2713; Pulse <small>(boosted by Mega Launcher)</small></p>';
			}
			if ('bite' in move.flags && ability === 'strongjaw') {
				text += '<p class="movetag">&#x2713; Bite <small>(boosted by Strong Jaw)</small></p>';
			}
			if ((move.recoil || move.hasCustomRecoil) && ability === 'reckless') {
				text += '<p class="movetag">&#x2713; Recoil <small>(boosted by Reckless)</small></p>';
			}
			if ('bullet' in move.flags) {
				text += '<p class="movetag">&#x2713; Ballistic <small>(doesn\'t affect Bulletproof pokemon)</small></p>';
			}

			if (this.battle.gameType === 'doubles') {
				if (move.target === 'allAdjacent') {
					text += '<p class="movetag">&#x25ce; Hits both foes and ally.</p>';
				} else if (move.target === 'allAdjacentFoes') {
					text += '<p class="movetag">&#x25ce; Hits both foes.</p>';
				}
			} else if (this.battle.gameType === 'triples') {
				if (move.target === 'allAdjacent') {
					text += '<p class="movetag">&#x25ce; Hits adjacent foes and allies.</p>';
				} else if (move.target === 'allAdjacentFoes') {
					text += '<p class="movetag">&#x25ce; Hits adjacent foes.</p>';
				} else if (move.target === 'any') {
					text += '<p class="movetag">&#x25ce; Can target distant Pok&eacute;mon in Triples.</p>';
				}
			}
		}
		text += '</div></div>';
		return text;
	};

	BattleTooltips.prototype.showPokemonTooltip = function (pokemon, pokemonData, isActive) {
		var text = '';
		var gender = pokemon.gender;
		if (gender) gender = ' <img src="' + Dex.resourcePrefix + 'fx/gender-' + gender.toLowerCase() + '.png" alt="' + gender + '" />';
		text = '<div class="tooltipinner"><div class="tooltip">';

		var name = BattleLog.escapeHTML(pokemon.name);
		if (pokemon.species !== pokemon.name) {
			name += ' <small>(' + BattleLog.escapeHTML(pokemon.species) + ')</small>';
		}

		text += '<h2>' + name + gender + (pokemon.level !== 100 ? ' <small>L' + pokemon.level + '</small>' : '') + '<br />';

		var template = Dex.getTemplate(pokemon.getSpecies ? pokemon.getSpecies() : pokemon.species);
		if (pokemon.volatiles && pokemon.volatiles.formechange) {
			if (pokemon.volatiles.transform) {
				text += '<small>(Transformed into ' + pokemon.volatiles.formechange[1] + ')</small><br />';
			} else {
				text += '<small>(Forme: ' + pokemon.volatiles.formechange[1] + ')</small><br />';
			}
		}

		var types = this.getPokemonTypes(pokemon);

		if (pokemon.volatiles && (pokemon.volatiles.typechange || pokemon.volatiles.typeadd)) text += '<small>(Type changed)</small><br />';
		if (types) {
			text += types.map(Dex.getTypeIcon).join(' ');
		} else {
			text += 'Types unknown';
		}
		text += '</h2>';
		if (pokemon.fainted) {
			text += '<p>HP: (fainted)</p>';
		} else if (this.battle.hardcoreMode) {
			if (pokemonData) {
				text += '<p>HP: ' + pokemonData.hp + '/' + pokemonData.maxhp + (pokemon.status ? ' <span class="status ' + pokemon.status + '">' + pokemon.status.toUpperCase() + '</span>' : '') + '</p>';
			}
		} else {
			var exacthp = '';
			if (pokemonData) exacthp = ' (' + pokemonData.hp + '/' + pokemonData.maxhp + ')';
			else if (pokemon.maxhp == 48) exacthp = ' <small>(' + pokemon.hp + '/' + pokemon.maxhp + ' pixels)</small>';
			text += '<p>HP: ' + pokemon.hpDisplay() + exacthp + (pokemon.status ? ' <span class="status ' + pokemon.status + '">' + pokemon.status.toUpperCase() + '</span>' : '');
			if (pokemon.statusData) {
				if (pokemon.status === 'tox') {
					if (pokemon.ability === 'Poison Heal' || pokemon.ability === 'Magic Guard') {
						text += ' <small>Would take if ability removed: ' + Math.floor(100 / 16) * Math.min(pokemon.statusData.toxicTurns + 1, 15) + '%</small>';
					} else {
						text += ' Next damage: ' + Math.floor(100 / 16) * Math.min(pokemon.statusData.toxicTurns + 1, 15) + '%';
					}
				} else if (pokemon.status === 'slp') {
					text += ' Turns asleep: ' + pokemon.statusData.sleepTurns;
				}
			}
			text += '</p>';
		}
		var showOtherSees = !this.battle.hardcoreMode && isActive;
		if (pokemonData) {
			if (this.battle.gen > 2 && this.battle.tier.indexOf("Let's Go") === -1) {
				var abilityText = Dex.getAbility(pokemonData.baseAbility).name;
				var ability = Dex.getAbility(pokemonData.ability || pokemon.ability).name;
				if (ability && (ability !== abilityText)) {
					abilityText = ability + ' (base: ' + abilityText + ')';
				}
				text += '<p>Ability: ' + abilityText;
				if (pokemonData.item) {
					text += ' / Item: ' + Dex.getItem(pokemonData.item).name;
				}
				text += '</p>';
			} else if (pokemonData.item) {
				var itemName = Dex.getItem(pokemonData.item).name;
				text += '<p>Item: ' + itemName + '</p>';
			}
			text += '<p>' + pokemonData.stats['atk'] + '&nbsp;Atk /&nbsp;' + pokemonData.stats['def'] + '&nbsp;Def /&nbsp;' + pokemonData.stats['spa'];
			if (this.battle.gen === 1) {
				text += '&nbsp;Spc /&nbsp;';
			} else {
				text += '&nbsp;SpA /&nbsp;' + pokemonData.stats['spd'] + '&nbsp;SpD /&nbsp;';
			}
			text += pokemonData.stats['spe'] + '&nbsp;Spe</p>';
			if (showOtherSees) {
				if (this.battle.gen > 1) {
					var modifiedStats = this.calculateModifiedStats(pokemon, pokemonData);
					var statsText = this.makeModifiedStatText(pokemonData, modifiedStats);
					if (statsText.match('<b')) {
						text += '<p>After Modifiers:</p>';
						text += statsText;
					}
				}
				text += '<p class="section">Opponent sees:</p>';
			}
		} else {
			showOtherSees = !this.battle.hardcoreMode;
		}
		if (this.battle.gen > 2 && showOtherSees && this.battle.tier.indexOf("Let's Go") === -1) {
			if (!pokemon.baseAbility && !pokemon.ability) {
				if (template.abilities) {
					var abilitiesInThisGen = Dex.getAbilitiesFor(template, this.battle.gen);
					text += '<p>Possible abilities: ' + Dex.getAbility(abilitiesInThisGen['0']).name;
					if (abilitiesInThisGen['1']) text += ', ' + Dex.getAbility(abilitiesInThisGen['1']).name;
					if (abilitiesInThisGen['H']) text += ', ' + Dex.getAbility(abilitiesInThisGen['H']).name;
					if (abilitiesInThisGen['S']) text += ', ' + Dex.getAbility(abilitiesInThisGen['S']).name;
					text += '</p>';
				}
			} else if (pokemon.ability) {
				if (pokemon.ability === pokemon.baseAbility) {
					text += '<p>Ability: ' + Dex.getAbility(pokemon.ability).name + '</p>';
				} else {
					text += '<p>Ability: ' + Dex.getAbility(pokemon.ability).name + ' (base: ' + Dex.getAbility(pokemon.baseAbility).name + ')' + '</p>';
				}
			} else if (pokemon.baseAbility) {
				text += '<p>Ability: ' + Dex.getAbility(pokemon.baseAbility).name + '</p>';
			}
		}

		if (showOtherSees) {
			var item = '';
			var itemEffect = pokemon.itemEffect || '';
			if (pokemon.prevItem) {
				item = 'None';
				if (itemEffect) itemEffect += '; ';
				var prevItem = Dex.getItem(pokemon.prevItem).name;
				itemEffect += pokemon.prevItemEffect ? prevItem + ' was ' + pokemon.prevItemEffect : 'was ' + prevItem;
			}
			if (pokemon.item) item = Dex.getItem(pokemon.item).name;
			if (itemEffect) itemEffect = ' (' + itemEffect + ')';
			if (item) text += '<p>Item: ' + item + itemEffect + '</p>';

			if (template.baseStats) {
				text += '<p>' + this.getTemplateMinSpeed(template, pokemon.level) + ' to ' + this.getTemplateMaxSpeed(template, pokemon.level) + ' Spe (before items/abilities/modifiers)</p>';
			}
		}

		if (pokemonData && !isActive) {
			text += '<p class="section">';
			var battlePokemon = this.battle.getPokemon(pokemon.ident, pokemon.details);
			for (var i = 0; i < pokemonData.moves.length; i++) {
				var move = Dex.getMove(pokemonData.moves[i]);
				var name = move.name;
				if (battlePokemon && battlePokemon.moveTrack) {
					for (var j = 0; j < battlePokemon.moveTrack.length; j++) {
						if (name === battlePokemon.moveTrack[j][0]) {
							name = this.getPPUseText(battlePokemon.moveTrack[j], true);
							break;
						}
					}
				}
				text += '&#8226; ' + name + '<br />';
			}
			text += '</p>';
		} else if (!this.battle.hardcoreMode && pokemon.moveTrack && pokemon.moveTrack.length) {
			text += '<p class="section">';
			for (var i = 0; i < pokemon.moveTrack.length; i++) {
				text += '&#8226; ' + this.getPPUseText(pokemon.moveTrack[i]) + '<br />';
			}
			if (pokemon.moveTrack.length > 4) {
				text += '(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.)';
			}
			if (this.battle.gen === 3) {
				text += '(Pressure is not visible in Gen 3, so if you have Pressure, more PP may have been lost than shown here.)';
			}
			text += '</p>';
		}
		text += '</div></div>';
		return text;
	};

	BattleTooltips.prototype.calculateModifiedStats = function (pokemon, pokemonData) {
		var stats = {};
		for (var statName in pokemonData.stats) {
			stats[statName] = pokemonData.stats[statName];

			if (pokemon.boosts && pokemon.boosts[statName]) {
				var boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
				if (pokemon.boosts[statName] > 0) {
					stats[statName] *= boostTable[pokemon.boosts[statName]];
				} else {
					if (this.battle.gen <= 2) boostTable = [1, 100 / 66, 2, 2.5, 100 / 33, 100 / 28, 4];
					stats[statName] /= boostTable[-pokemon.boosts[statName]];
				}
				stats[statName] = Math.floor(stats[statName]);
			}
		}

		var ability = toId(pokemonData.ability || pokemon.ability || pokemonData.baseAbility);
		if ('gastroacid' in pokemon.volatiles) ability = '';

		// check for burn, paralysis, guts, quick feet
		if (pokemon.status) {
			if (this.battle.gen > 2 && ability === 'guts') {
				stats.atk = Math.floor(stats.atk * 1.5);
			} else if (pokemon.status === 'brn') {
				stats.atk = Math.floor(stats.atk * 0.5);
			}

			if (this.battle.gen > 2 && ability === 'quickfeet') {
				stats.spe = Math.floor(stats.spe * 1.5);
			} else if (pokemon.status === 'par') {
				if (this.battle.gen > 6) {
					stats.spe = Math.floor(stats.spe * 0.5);
				} else {
					stats.spe = Math.floor(stats.spe * 0.25);
				}
			}
		}

		// gen 1 doesn't support items
		if (this.battle.gen <= 1) {
			for (var statName in stats) {
				if (stats[statName] > 999) stats[statName] = 999;
			}
			return stats;
		}

		var item = toId(pokemonData.item);
		if (ability === 'klutz' && item !== 'machobrace') item = '';
		var species = pokemon.baseSpecies;

		// check for light ball, thick club, metal/quick powder
		// the only stat modifying items in gen 2 were light ball, thick club, metal powder
		if (item === 'lightball' && species === 'Pikachu') {
			if (this.battle.gen >= 4) stats.atk *= 2;
			stats.spa *= 2;
		}

		if (item === 'thickclub') {
			if (species === 'Marowak' || species === 'Cubone') {
				stats.atk *= 2;
			}
		}

		if (species === 'Ditto' && !('transform' in pokemon.volatiles)) {
			if (item === 'quickpowder') {
				stats.spe *= 2;
			}
			if (item === 'metalpowder') {
				if (this.battle.gen === 2) {
					stats.def = Math.floor(stats.def * 1.5);
					stats.spd = Math.floor(stats.spd * 1.5);
				} else {
					stats.def *= 2;
				}
			}
		}

		// check abilities other than Guts and Quick Feet
		// check items other than light ball, thick club, metal/quick powder
		if (this.battle.gen <= 2) {
			return stats;
		}

		var weather = this.battle.weather;
		if (weather) {
			// Check if anyone has an anti-weather ability
			for (var i = 0; i < this.battle.p1.active.length; i++) {
				if (this.battle.p1.active[i] && this.battle.p1.active[i].ability in {'Air Lock': 1, 'Cloud Nine': 1}) {
					weather = '';
					break;
				}
				if (this.battle.p2.active[i] && this.battle.p2.active[i].ability in {'Air Lock': 1, 'Cloud Nine': 1}) {
					weather = '';
					break;
				}
			}
		}

		if (item === 'choiceband') {
			stats.atk = Math.floor(stats.atk * 1.5);
		}
		if (ability === 'purepower' || ability === 'hugepower') {
			stats.atk *= 2;
		}
		if (ability === 'hustle') {
			stats.atk = Math.floor(stats.atk * 1.5);
		}
		if (weather) {
			if (weather === 'sunnyday' || weather === 'desolateland') {
				if (ability === 'solarpower') {
					stats.spa = Math.floor(stats.spa * 1.5);
				}
				var allyActive = pokemon.side.active;
				if (allyActive.length > 1) {
					for (var i = 0; i < allyActive.length; i++) {
						var ally = allyActive[i];
						if (!ally || ally.fainted) continue;
						if (ally.ability === 'flowergift' && (ally.baseSpecies === 'Cherrim' || this.battle.gen <= 4)) {
							stats.atk = Math.floor(stats.atk * 1.5);
							stats.spd = Math.floor(stats.spd * 1.5);
						}
					}
				}
			}
			if (this.battle.gen >= 4 && this.pokemonHasType(pokemonData, 'Rock') && weather === 'sandstorm') {
				stats.spd = Math.floor(stats.spd * 1.5);
			}
			if (ability === 'chlorophyll' && (weather === 'sunnyday' || weather === 'desolateland')) {
				stats.spe *= 2;
			}
			if (ability === 'swiftswim' && (weather === 'raindance' || weather === 'primordialsea')) {
				stats.spe *= 2;
			}
			if (ability === 'sandrush' && weather === 'sandstorm') {
				stats.spe *= 2;
			}
			if (ability === 'slushrush' && weather === 'hail') {
				stats.spe *= 2;
			}
		}
		if (ability === 'defeatist' && pokemonData.hp <= pokemonData.maxhp / 2) {
			stats.atk = Math.floor(stats.atk * 0.5);
			stats.spa = Math.floor(stats.spa * 0.5);
		}
		if (pokemon.volatiles) {
			if ('slowstart' in pokemon.volatiles) {
				stats.atk = Math.floor(stats.atk * 0.5);
				stats.spe = Math.floor(stats.spe * 0.5);
			}
			if (ability === 'unburden' && 'itemremoved' in pokemon.volatiles && !item) {
				stats.spe *= 2;
			}
		}
		if (ability === 'marvelscale' && pokemon.status) {
			stats.def = Math.floor(stats.def * 1.5);
		}
		if (item === 'eviolite' && Dex.getTemplate(pokemon.species).evos) {
			stats.def = Math.floor(stats.def * 1.5);
			stats.spd = Math.floor(stats.spd * 1.5);
		}
		if (ability === 'grasspelt' && this.battle.hasPseudoWeather('Grassy Terrain')) {
			stats.def = Math.floor(stats.def * 1.5);
		}
		if (ability === 'surgesurfer' && this.battle.hasPseudoWeather('Electric Terrain')) {
			stats.spe *= 2;
		}
		if (item === 'choicespecs') {
			stats.spa = Math.floor(stats.spa * 1.5);
		}
		if (item === 'deepseatooth' && species === 'Clamperl') {
			stats.spa *= 2;
		}
		if (item === 'souldew' && this.battle.gen <= 6 && (species === 'Latios' || species === 'Latias')) {
			stats.spa = Math.floor(stats.spa * 1.5);
			stats.spd = Math.floor(stats.spd * 1.5);
		}
		if (ability === 'plus' || ability === 'minus') {
			var allyActive = pokemon.side.active;
			if (allyActive.length > 1) {
				var abilityName = (ability === 'plus' ? 'Plus' : 'Minus');
				for (var i = 0; i < allyActive.length; i++) {
					var ally = allyActive[i];
					if (!(ally && ally !== pokemon && !ally.fainted)) continue;
					if (!(ally.ability === 'Plus' || ally.ability === 'Minus')) continue;
					if (this.battle.gen <= 4 && ally.ability === abilityName) continue;
					stats.spa = Math.floor(stats.spa * 1.5);
					break;
				}
			}
		}
		if (item === 'assaultvest') {
			stats.spd = Math.floor(stats.spd * 1.5);
		}
		if (item === 'deepseascale' && species === 'Clamperl') {
			stats.spd *= 2;
		}
		if (item === 'choicescarf') {
			stats.spe = Math.floor(stats.spe * 1.5);
		}
		if (item === 'ironball' || item === 'machobrace' || /power(?!herb)/.test(item)) {
			stats.spe = Math.floor(stats.spe * 0.5);
		}
		if (ability === 'furcoat') {
			stats.def *= 2;
		}

		return stats;
	};

	BattleTooltips.prototype.makeModifiedStatText = function (pokemonData, modifiedStats) {
		var statsText = '<p>';
		var statTable = {atk: '&nbsp;Atk /&nbsp;', def: '&nbsp;Def /&nbsp;', spa: '&nbsp;SpA /&nbsp;',
						 spc: '&nbsp;Spc /&nbsp;', spd: '&nbsp;SpD /&nbsp;', spe: '&nbsp;Spe</p>'};
		statsText += this.boldModifiedStat(pokemonData, modifiedStats, 'atk') + statTable['atk'];
		statsText += this.boldModifiedStat(pokemonData, modifiedStats, 'def') + statTable['def'];
		statsText += this.boldModifiedStat(pokemonData, modifiedStats, 'spa');
		if (this.battle.gen === 1) {
			statsText += statTable['spc'];
		} else {
			statsText += statTable['spa'];
			statsText += this.boldModifiedStat(pokemonData, modifiedStats, 'spd') + statTable['spd'];
		}
		statsText += this.boldModifiedStat(pokemonData, modifiedStats, 'spe') + statTable['spe'];
		return statsText;
	};

	BattleTooltips.prototype.boldModifiedStat = function (pokemonData, modifiedStats, statName) {
		var statText = '';
		if (pokemonData.stats[statName] === modifiedStats[statName]) {
			statText += '' + modifiedStats[statName];
		} else if (pokemonData.stats[statName] > modifiedStats[statName]) {
			statText += '<b class="stat-lowered">' + modifiedStats[statName] + '</b>';
		} else {
			statText += '<b class="stat-boosted">' + modifiedStats[statName] + '</b>';
		}
		return statText;
	};

	BattleTooltips.prototype.getPPUseText = function (moveTrackRow, showKnown) {
		var moveName = moveTrackRow[0];
		var ppUsed = moveTrackRow[1];
		var move, maxpp;
		if (moveName.charAt(0) === '*') {
			move = Dex.getMove(moveName.substr(1));
			maxpp = 5;
		} else {
			move = Dex.getMove(moveName);
			maxpp = move.pp;
			if (this.battle.gen < 7) {
				var table = BattleTeambuilderTable['gen' + this.battle.gen];
				if (move.id in table.overridePP) maxpp = table.overridePP[move.id];
			}
			maxpp = Math.floor(maxpp * 8 / 5);
		}
		if (ppUsed === Infinity) return move.name + ' <small>(0/' + maxpp + ')</small>';
		if (ppUsed || moveName.charAt(0) === '*') return move.name + ' <small>(' + (maxpp - ppUsed) + '/' + maxpp + ')</small>';
		return move.name + (showKnown ? ' <small>(revealed)</small>' : '');
	};

	// Functions to calculate speed ranges of an opponent.
	BattleTooltips.prototype.getTemplateMinSpeed = function (template, level) {
		var baseSpe = template.baseStats['spe'];
		var tier = this.battle.tier;
		var gen = this.battle.gen;
		if (gen < 7) {
			var overrideStats = BattleTeambuilderTable['gen' + gen].overrideStats[template.id];
			if (overrideStats && 'spe' in overrideStats) baseSpe = overrideStats['spe'];
		}

		var nature = (tier.indexOf('Random Battle') >= 0 || (tier.indexOf('Random') >= 0 && tier.indexOf('Battle') >= 0 && gen >= 6) || gen < 3) ? 1 : 0.9;
		if (tier.indexOf("Let's Go") >= 0) {
			return Math.floor(Math.floor(Math.floor(2 * baseSpe * level / 100 + 5) * nature) * Math.floor((70 / 255 / 10 + 1) * 100) / 100);
		}
		return Math.floor(Math.floor(2 * baseSpe * level / 100 + 5) * nature);
	};
	BattleTooltips.prototype.getTemplateMaxSpeed = function (template, level) {
		var baseSpe = template.baseStats['spe'];
		var tier = this.battle.tier;
		var gen = this.battle.gen;
		if (gen < 7) {
			var overrideStats = BattleTeambuilderTable['gen' + gen].overrideStats[template.id];
			if (overrideStats && 'spe' in overrideStats) baseSpe = overrideStats['spe'];
		}

		var iv = (gen < 3) ? 30 : 31;
		var isRandomBattle = tier.indexOf('Random Battle') >= 0 || (tier.indexOf('Random') >= 0 && tier.indexOf('Battle') >= 0 && gen >= 6);
		var value = iv + ((isRandomBattle && gen >= 3) ? 21 : 63);
		var nature = (isRandomBattle || gen < 3) ? 1 : 1.1;
		if (tier.indexOf("Let's Go") >= 0) {
			var maxStat = Math.floor(Math.floor(Math.floor(Math.floor(2 * baseSpe + iv) * level / 100 + 5) * nature) * Math.floor((70 / 255 / 10 + 1) * 100) / 100);
			if (tier.indexOf('No Restrictions') >= 0) return maxStat + 200;
			if (tier.indexOf('Random') >= 0) return maxStat + 20;
			return maxStat;
		}
		return Math.floor(Math.floor(Math.floor(2 * baseSpe + value) * level / 100 + 5) * nature);
	};

	// Gets the proper current type for moves with a variable type.
	BattleTooltips.prototype.getMoveType = function (move, pokemon) {
		var pokemonData = this.room.myPokemon[pokemon.slot] || pokemon;
		var ability = Dex.getAbility(pokemonData.ability || pokemon.ability || pokemonData.baseAbility).name;
		var moveType = move.type;
		var pokemonTypes = this.getPokemonTypes(pokemon);
		// Normalize is the first move type changing effect.
		if (ability === 'Normalize') {
			moveType = 'Normal';
		}
		if ((move.id === 'bite' || move.id === 'gust' || move.id === 'karatechop' || move.id === 'sandattack') && this.battle.gen <= 1) {
			moveType = 'Normal';
		}
		if ((move.id === 'charm' || move.id === 'moonlight' || move.id === 'sweetkiss') && this.battle.gen <= 5) {
			moveType = 'Normal';
		}
		if (move.id === 'revelationdance') {
			moveType = pokemonTypes[0];
		}
		// Moves that require an item to change their type.
		if (!this.battle.hasPseudoWeather('Magic Room') && (!pokemon.volatiles || !pokemon.volatiles['embargo'])) {
			if (move.id === 'multiattack') {
				var item = Dex.getItem(pokemonData.item);
				if (item.onMemory) moveType = item.onMemory;
			}
			if (move.id === 'judgment') {
				var item = Dex.getItem(pokemonData.item);
				if (item.onPlate && !item.zMove) moveType = item.onPlate;
			}
			if (move.id === 'technoblast') {
				var item = Dex.getItem(pokemonData.item);
				if (item.onDrive) moveType = item.onDrive;
			}
			if (move.id === 'naturalgift') {
				var item = Dex.getItem(pokemonData.item);
				if (item.naturalGift) moveType = item.naturalGift.type;
			}
		}
		// Weather and pseudo-weather type changes.
		if (move.id === 'weatherball' && this.battle.weather) {
			var antiWeatherAbility = false;
			// Check if there's an anti weather ability to skip this.
			abilitySearch: for (var i = 0; i < this.battle.sides.length; i++) {
				var side = this.battle.sides[i];
				for (var j = 0; j < side.active.length; j++) {
					if (side.active[j] && ['Air Lock', 'Cloud Nine'].includes(side.active[j].ability)) {
						antiWeatherAbility = true;
						break abilitySearch;
					}
				}
			}

			// If the weather is indeed active, check it to see what move type weatherball gets.
			if (!antiWeatherAbility) {
				if (this.battle.weather === 'sunnyday' || this.battle.weather === 'desolateland') moveType = 'Fire';
				if (this.battle.weather === 'raindance' || this.battle.weather === 'primordialsea') moveType = 'Water';
				if (this.battle.weather === 'sandstorm') moveType = 'Rock';
				if (this.battle.weather === 'hail') moveType = 'Ice';
			}
		}
		// Other abilities that change the move type.
		if ('sound' in move.flags && ability === 'Liquid Voice') moveType = 'Water';
		if (moveType === 'Normal' && move.category && move.category !== 'Status' && !(move.id in {judgment: 1, multiattack: 1, naturalgift: 1, revelationdance: 1, struggle: 1, technoblast: 1, weatherball: 1})) {
			if (ability === 'Aerilate') moveType = 'Flying';
			if (ability === 'Galvanize') moveType = 'Electric';
			if (ability === 'Pixilate') moveType = 'Fairy';
			if (ability === 'Refrigerate') moveType = 'Ice';
		}
		return moveType;
	};

	BattleTooltips.prototype.makePercentageChangeText = function (boost, source) {
		return ' (&times;' + boost + ' from ' + source + ')';
	};

	// Gets the current accuracy for a move.
	BattleTooltips.prototype.getMoveAccuracy = function (move, pokemon) {
		var pokemonData = this.room.myPokemon[pokemon.slot];
		var ability = Dex.getAbility(pokemonData.ability || pokemon.ability || pokemonData.baseAbility).name;
		var accuracy = move.accuracy;
		if (this.battle.gen < 7) {
			var table = BattleTeambuilderTable['gen' + this.battle.gen];
			if (move.id in table.overrideAcc) accuracy = table.overrideAcc[move.id];
		}
		var accuracyComment = '%';
		if (move.id === 'toxic' && this.battle.gen >= 6 && this.pokemonHasType(pokemon, 'Poison')) return '&mdash; (Boosted by Poison type)';
		if (move.id === 'blizzard' && this.battle.weather === 'hail') return '&mdash; (Boosted by Hail)';
		if (move.id === 'hurricane' || move.id === 'thunder') {
			if (this.battle.weather === 'raindance' || this.battle.weather === 'primordialsea') return '&mdash; (Boosted by Rain)';
			if (this.battle.weather === 'sunnyday' || this.battle.weather === 'desolateland') {
				accuracy = 50;
				accuracyComment += ' (Reduced by Sun)';
			}
		}
		if (!accuracy || accuracy === true) return '&mdash;';
		if (ability === 'No Guard') return '&mdash; (Boosted by No Guard)';
		if (move.ohko) {
			if (this.battle.gen === 1) return accuracy + '% (Will fail if target\'s speed is higher)';
			if (move.id === 'sheercold' && this.battle.gen >= 7) {
				if (!this.pokemonHasType(pokemon, 'Ice')) accuracy = 20;
			}
			return accuracy + '% (Will fail if target\'s level is higher, increases 1% per each level above target)';
		}
		if (pokemon.boosts && pokemon.boosts.accuracy) {
			if (pokemon.boosts.accuracy > 0) {
				accuracy *= (pokemon.boosts.accuracy + 3) / 3;
			} else {
				accuracy *= 3 / (3 - pokemon.boosts.accuracy);
			}
		}
		if (ability === 'Hustle' && move.category === 'Physical') {
			accuracy *= 0.8;
			accuracyComment += this.makePercentageChangeText(0.8, 'Hustle');
		}
		if (ability === 'Compound Eyes') {
			accuracy *= 1.3;
			accuracyComment += this.makePercentageChangeText(1.3, 'Compound Eyes');
		}
		for (var i = 0; i < pokemon.side.active.length; i++) {
			if (!pokemon.side.active[i] || pokemon.side.active[i].fainted) continue;
			ability = Dex.getAbility(pokemon.side.pokemon[i].ability).name;
			if (ability === 'Victory Star') {
				accuracy *= 1.1;
				accuracyComment += this.makePercentageChangeText(1.1, 'Victory Star');
			}
		}
		if (pokemonData.item === 'widelens' && !this.battle.hasPseudoWeather('Magic Room') && !(pokemon.volatiles && pokemon.volatiles['embargo'])) {
			accuracy *= 1.1;
			accuracyComment += this.makePercentageChangeText(1.1, 'Wide Lens');
		}
		if (this.battle.hasPseudoWeather('Gravity')) {
			accuracy *= 5 / 3;
			accuracyComment += this.makePercentageChangeText(1.66, 'Gravity');
		}
		return Math.round(accuracy) + accuracyComment;
	};

	// Gets the proper current base power for moves which have a variable base power.
	// Takes into account the target for some moves.
	// If it is unsure of the actual base power, it gives an estimate.
	BattleTooltips.prototype.getMoveBasePower = function (move, pokemon, target) {
		if (!target) target = this.room.myPokemon[0]; // fallback
		var pokemonData = this.room.myPokemon[pokemon.slot];
		if (!pokemonData) return '' + move.basePower;
		var ability = Dex.getAbility(pokemonData.ability || pokemon.ability || pokemonData.baseAbility).name;
		var item = {};
		var basePower = move.basePower;
		var moveType = this.getMoveType(move, pokemon);
		if (this.battle.gen < 7) {
			var table = BattleTeambuilderTable['gen' + this.battle.gen];
			if (move.id in table.overrideBP) basePower = table.overrideBP[move.id];
		}
		var basePowerComment = '';
		var antiWeatherAbility = false;
		// Check if there's an anti weather ability to skip this.
		abilitySearch2: for (var i = 0; i < this.battle.sides.length; i++) {
			var side = this.battle.sides[i];
			for (var j = 0; j < side.active.length; j++) {
				if (side.active[j] && ['Air Lock', 'Cloud Nine'].includes(side.active[j].ability)) {
					antiWeatherAbility = true;
					break abilitySearch2;
				}
			}
		}
		var thereIsWeather = !!this.battle.weather && !antiWeatherAbility;
		if (move.id === 'acrobatics') {
			if (!pokemonData.item) {
				basePower *= 2;
				basePowerComment = this.makePercentageChangeText(2, 'Acrobatics + no item');
			}
		}
		if (move.id === 'crushgrip' || move.id === 'wringout') {
			basePower = Math.floor(Math.floor((120 * (100 * Math.floor(target.hp * 4096 / target.maxhp)) + 2048 - 1) / 4096) / 100) || 1;
			basePowerComment = ' (Approximation)';
		}
		if (move.id === 'brine' && target.hp * 2 <= target.maxhp) {
			basePower *= 2;
			basePowerComment = this.makePercentageChangeText(2, 'Brine + target below half HP');
		}
		if (move.id === 'eruption' || move.id === 'waterspout') {
			basePower = Math.floor(150 * pokemon.hp / pokemon.maxhp) || 1;
		}
		if (move.id === 'facade' && !(pokemon.status in {'': 1, 'slp': 1, 'frz': 1})) {
			basePower *= 2;
			basePowerComment = this.makePercentageChangeText(2, 'Facade + status');
		}
		if (move.id === 'flail' || move.id === 'reversal') {
			if (this.battle.gen > 4) {
				var multiplier = 48;
				var ratios = [2, 5, 10, 17, 33];
			} else {
				var multiplier = 64;
				var ratios = [2, 6, 13, 22, 43];
			}
			var ratio = pokemon.hp * multiplier / pokemon.maxhp;
			if (ratio < ratios[0]) basePower = 200;
			else if (ratio < ratios[1]) basePower = 150;
			else if (ratio < ratios[2]) basePower = 100;
			else if (ratio < ratios[3]) basePower = 80;
			else if (ratio < ratios[4]) basePower = 40;
			else basePower = 20;
		}
		if (move.id === 'hex' && target.status) {
			basePower *= 2;
			basePowerComment = this.makePercentageChangeText(2, 'Hex + status');
		}
		if (move.id === 'punishment') {
			var boosts = Object.keys(target.boosts);
			var multiply = 0;
			for (var i = 0; i < boosts.length; i++) {
				if (target.boosts[boosts[i]] > 0) multiply += target.boosts[boosts[i]];
			}
			basePower = 60 + 20 * multiply;
			if (basePower > 200) basePower = 200;
		}
		if (move.id === 'smellingsalts') {
			if (target.status === 'par') {
				basePower *= 2;
				basePowerComment = this.makePercentageChangeText(2, 'Smelling Salts + Paralysis');
			}
		}
		if (move.id === 'storedpower' || move.id == 'powertrip') {
			var boosts = Object.keys(pokemon.boosts);
			var multiply = 0;
			for (var i = 0; i < boosts.length; i++) {
				if (pokemon.boosts[boosts[i]] > 0) multiply += pokemon.boosts[boosts[i]];
			}
			basePower = 20 + 20 * multiply;
		}
		if (move.id === 'trumpcard') {
			basePower = 40;
			if (move.pp === 1) basePower = 200;
			else if (move.pp === 2) basePower = 80;
			else if (move.pp === 3) basePower = 60;
			else if (move.pp === 4) basePower = 50;
		}
		if (move.id === 'venoshock') {
			if (target.status === 'psn' || target.status === 'tox') {
				basePower *= 2;
				basePowerComment = this.makePercentageChangeText(2, 'Venoshock + Poison');
			}
		}
		if (move.id === 'wakeupslap') {
			if (target.status === 'slp') {
				basePower *= 2;
				basePowerComment = this.makePercentageChangeText(2, 'Wake-Up Slap + Sleep');
			}
		}
		if (move.id === 'weatherball' && thereIsWeather) {
			basePower = 100;
		}
		if (move.id === 'watershuriken' && pokemon.species === 'Greninja-Ash' && pokemon.ability === 'Battle Bond') {
			basePower += 5;
		}
		// Moves that check opponent speed.
		var template = Dex.getTemplate(target.getSpecies());
		if (move.id === 'electroball') {
			var min = 0;
			var max = 0;
			var minRatio = (pokemonData.stats['spe'] / this.getTemplateMaxSpeed(template, target.level));
			var maxRatio = (pokemonData.stats['spe'] / this.getTemplateMinSpeed(template, target.level));
			if (minRatio >= 4) min = 150;
			else if (minRatio >= 3) min = 120;
			else if (minRatio >= 2) min = 80;
			else if (minRatio >= 1) min = 60;
			else min = 40;
			if (maxRatio >= 4) max = 150;
			else if (maxRatio >= 3) max = 120;
			else if (maxRatio >= 2) max = 80;
			else if (maxRatio >= 1) max = 60;
			else max = 40;
			// Special case due to being a range.
			return this.boostBasePowerRange(move, pokemon, min, max);
		}
		if (move.id === 'gyroball') {
			var min = (Math.floor(25 * this.getTemplateMinSpeed(template, target.level) / pokemonData.stats['spe']) || 1);
			var max = (Math.floor(25 * this.getTemplateMaxSpeed(template, target.level) / pokemonData.stats['spe']) || 1);
			if (min > 150) min = 150;
			if (max > 150) max = 150;
			// Special case due to range as well.
			return this.boostBasePowerRange(move, pokemon, min, max);
		}
		// Movements which have base power changed due to items.
		if (pokemonData.item && !this.battle.hasPseudoWeather('Magic Room') && (!pokemon.volatiles || !pokemon.volatiles['embargo'])) {
			item = Dex.getItem(pokemonData.item);
			if (move.id === 'fling') {
				if (item.fling) basePower = item.fling.basePower;
			}
			if (move.id === 'naturalgift') {
				if (item.naturalGift) basePower = item.naturalGift.basePower;
			}
		}
		// Movements which have base power changed according to weight.
		if (target && target.weightkg) {
			var targetWeight = target.weightkg;
			var pokemonWeight = pokemon.weightkg;
			// Autotomize cannot be really known on client, so we calculate it's one charge.
			if (target.volatiles && target.volatiles.autotomize) targetWeight -= 100;
			if (targetWeight < 0.1) targetWeight = 0.1;
			if (move.id === 'lowkick' || move.id === 'grassknot') {
				basePower = 20;
				if (targetWeight >= 200) basePower = 120;
				else if (targetWeight >= 100) basePower = 100;
				else if (targetWeight >= 50) basePower = 80;
				else if (targetWeight >= 25) basePower = 60;
				else if (targetWeight >= 10) basePower = 40;
				if (target.volatiles && target.volatiles.autotomize) basePowerComment = ' (Approximation)';
			}
			if (move.id === 'heavyslam' || move.id === 'heatcrash') {
				basePower = 40;
				if (pokemonWeight > targetWeight * 5) basePower = 120;
				else if (pokemonWeight > targetWeight * 4) basePower = 100;
				else if (pokemonWeight > targetWeight * 3) basePower = 80;
				else if (pokemonWeight > targetWeight * 2) basePower = 60;
				if (target.volatiles && target.volatiles.autotomize) basePowerComment = ' (Approximation)';
			}
		}
		if (!basePower) return basePowerComment;

		// Other ability boosts.
		var abilityBoost = 0;
		if ((ability === 'Flare Boost' && pokemon.status === 'brn' && move.category === 'Special') ||
			(ability === 'Mega Launcher' && move.flags['pulse']) ||
			(ability === 'Strong Jaw' && move.flags['bite']) ||
			(ability === 'Technician' && basePower <= 60) ||
			(ability === 'Toxic Boost' && (pokemon.status === 'psn' || pokemon.status === 'tox') && move.category === 'Physical')) {
			abilityBoost = 1.5;
		} else if ((ability === 'Sand Force' && this.battle.weather === 'sandstorm' && (moveType === 'Rock' || moveType === 'Ground' || moveType === 'Steel')) ||
			(ability === 'Sheer Force' && move.secondaries) ||
			(ability === 'Tough Claws' && move.flags['contact'])) {
			abilityBoost = 1.3;
		} else if (ability === 'Rivalry' && pokemon.gender && target.gender) {
			if (pokemon.gender === target.gender) {
				abilityBoost = 1.25;
			} else {
				abilityBoost = 0.75;
			}
		} else if (move.type === 'Normal' && move.category !== 'Status' &&
			ability in {'Aerilate': 1, 'Galvanize': 1, 'Pixilate': 1, 'Refrigerate': 1} &&
			!(move.id in {judgment: 1, multiattack: 1, naturalgift: 1, revelationdance: 1, struggle: 1, technoblast: 1, weatherball: 1})) {
			abilityBoost = (this.battle.gen > 6 ? 1.2 : 1.3);
		} else if ((ability === 'Iron Fist' && move.flags['punch']) ||
			(ability === 'Reckless' && (move.recoil || move.hasCustomRecoil)) ||
			(ability === 'Normalize' && this.battle.gen > 6)) {
			abilityBoost = 1.2;
		}
		if (abilityBoost) {
			basePower = Math.floor(basePower * abilityBoost);
			basePowerComment += this.makePercentageChangeText(abilityBoost, ability);
		}

		var allyActive = pokemon.side.active;
		var auraBoosted = '';
		var auraBroken = false;
		if (move.category !== 'Status' && allyActive.length > 1) {
			for (var i = 0; i < allyActive.length; i++) {
				var ally = allyActive[i];
				if (!ally || ally.fainted) continue;
				if (ally.ability === 'Fairy Aura') {
					if (moveType === 'Fairy') auraBoosted = 'Fairy Aura';
				} else if (ally.ability === 'Dark Aura') {
					if (moveType === 'Dark') auraBoosted = 'Dark Aura';
				} else if (ally.ability === 'Aura Break') {
					auraBroken = true;
				} else if (ally.ability === 'Battery') {
					if (ally !== pokemon && move.category === 'Special') {
						basePower = Math.floor(basePower * 1.3);
						basePowerComment += this.makePercentageChangeText(1.3, 'Battery');
					}
				}
			}
		}
		var foeActive = this.battle.yourSide.active;
		var doneLooking = auraBoosted && auraBroken;
		if (!doneLooking && move.category !== 'Status' && (moveType === 'Fairy' || moveType === 'Dark')) {
			for (var i = 0; i < foeActive.length; i++) {
				var foe = foeActive[i];
				if (!foe || foe.fainted) continue;
				if (foe.ability === 'Fairy Aura') {
					if (moveType === 'Fairy') auraBoosted = 'Fairy Aura';
				} else if (foe.ability === 'Dark Aura') {
					if (moveType === 'Dark') auraBoosted = 'Dark Aura';
				} else if (foe.ability === 'Aura Break') {
					auraBroken = true;
				}
			}
		}
		if (auraBoosted) {
			if (auraBroken) {
				basePower = Math.floor(basePower * 0.75);
				basePowerComment += this.makePercentageChangeText(0.75, auraBoosted + ' + Aura Break');
			} else {
				basePower = Math.floor(basePower * 1.33);
				basePowerComment += this.makePercentageChangeText(1.33, auraBoosted);
			}
		}

		// Field Effects
		var terrainBuffed = this.battle.hasPseudoWeather('Misty Terrain') ? target : pokemonData;
		var isGrounded = true;
		var noItem = !terrainBuffed.item || this.battle.hasPseudoWeather('Magic Room') || terrainBuffed.volatiles && terrainBuffed.volatiles['embargo'];
		if (this.battle.hasPseudoWeather('Gravity')) {
			isGrounded = true;
		} else if (terrainBuffed.volatiles && terrainBuffed.volatiles['ingrain'] && this.battle.gen >= 4) {
			isGrounded = true;
		} else if (terrainBuffed.volatiles && terrainBuffed.volatiles['smackdown']) {
			isGrounded = true;
		} else if (!noItem && terrainBuffed.item === 'ironball') {
			isGrounded = true;
		} else if (ability === 'levitate') {
			isGrounded = false;
		} else if (terrainBuffed.volatiles && (terrainBuffed.volatiles['magnetrise'] || terrainBuffed.volatiles['telekinesis'])) {
			isGrounded = false;
		} else if (!noItem && terrainBuffed.item !== 'airballoon') {
			isGrounded = false;
		} else if (!(terrainBuffed.volatiles && terrainBuffed.volatiles['roost'])) {
			// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
			if (this.pokemonHasType(terrainBuffed, 'Flying')) isGrounded = false;
		}

		if (isGrounded) {
			if ((this.battle.hasPseudoWeather('Electric Terrain') && moveType === 'Electric') ||
				(this.battle.hasPseudoWeather('Grassy Terrain') && moveType === 'Grass') ||
				(this.battle.hasPseudoWeather('Psychic Terrain') && moveType === 'Psychic')) {
				basePower = Math.floor(basePower * 1.5);
				basePowerComment += this.makePercentageChangeText(1.5, moveType + (moveType === 'Grass' ? 'y Terrain' : ' Terrain'));
			} else if (this.battle.hasPseudoWeather('Misty Terrain') && moveType === 'Dragon') {
				basePower = Math.floor(basePower / 2);
				basePowerComment += this.makePercentageChangeText(0.5, 'Misty Terrain + grounded target');
			}
		}

		return this.boostBasePower(move, pokemon, basePower, basePowerComment);
	};

	var incenseTypes = {
		'Odd Incense': 'Psychic',
		'Rock Incense': 'Rock',
		'Rose Incense': 'Grass',
		'Sea Incense': 'Water',
		'Wave Incense': 'Water'
	};
	var itemTypes = {
		'Black Belt': 'Fighting',
		'Black Glasses': 'Dark',
		'Charcoal': 'Fire',
		'Dragon Fang': 'Dragon',
		'Hard Stone': 'Rock',
		'Magnet': 'Electric',
		'Metal Coat': 'Steel',
		'Miracle Seed': 'Grass',
		'Mystic Water': 'Water',
		'Never-Melt Ice': 'Ice',
		'Poison Barb': 'Poison',
		'Sharp Beak': 'Flying',
		'Silk Scarf': 'Normal',
		'SilverPowder': 'Bug',
		'Soft Sand': 'Ground',
		'Spell Tag': 'Ghost',
		'Twisted Spoon': 'Psychic'
	};
	var orbUsers = {
		'Latias': 'Soul Dew',
		'Latios': 'Soul Dew',
		'Dialga': 'Adamant Orb',
		'Palkia': 'Lustrous Orb',
		'Giratina': 'Griseous Orb'
	};
	var orbTypes = {
		'Soul Dew': 'Psychic',
		'Adamant Orb': 'Steel',
		'Lustrous Orb': 'Water',
		'Griseous Orb': 'Ghost'
	};
	var noGemMoves = {
		'Fire Pledge': 1,
		'Fling': 1,
		'Grass Pledge': 1,
		'Struggle': 1,
		'Water Pledge': 1
	};
	BattleTooltips.prototype.getItemBoost = function (move, pokemon) {
		var pokemonData = this.room.myPokemon[pokemon.slot];
		if (!pokemonData.item || this.battle.hasPseudoWeather('Magic Room') || pokemon.volatiles && pokemon.volatiles['embargo']) return 0;

		var item = Dex.getItem(pokemonData.item);
		var moveType = this.getMoveType(move, pokemon);
		var itemName = item.name;
		var moveName = move.name;

		// Plates
		if (item.onPlate === moveType && !item.zMove) return 1.2;

		// Incenses
		if (incenseTypes[item.name] === moveType) return 1.2;

		// Type-enhancing items
		if (itemTypes[item.name] === moveType) return this.battle.gen < 4 ? 1.1 : 1.2;

		// Pokemon-specific items
		if (item.name === 'Soul Dew' && this.battle.gen < 7) return 0;
		if (orbUsers[pokemonData.baseSpecies] === item.name && (orbTypes[item.name] === moveType || moveType === 'Dragon')) return 1.2;

		// Gems
		if (moveName in noGemMoves) return 0;
		if (itemName === moveType + ' Gem') return this.battle.gen < 6 ? 1.5 : 1.3;

		return 0;
	};
	BattleTooltips.prototype.boostBasePower = function (move, pokemon, basePower, basePowerComment) {
		var itemBoost = this.getItemBoost(move, pokemon);
		if (itemBoost) {
			basePower = Math.floor(basePower * itemBoost);
			var pokemonData = this.room.myPokemon[pokemon.slot];
			basePowerComment += this.makePercentageChangeText(itemBoost, Dex.getItem(pokemonData.item).name);
		}
		return basePower + basePowerComment;
	};
	BattleTooltips.prototype.boostBasePowerRange = function (move, pokemon, min, max) {
		var pokemonData = this.room.myPokemon[pokemon.slot];
		var technician = Dex.getAbility(pokemonData.ability || pokemon.ability || pokemonData.baseAbility).name === 'Technician';
		if (technician) {
			if (min <= 60) min *= 1.5;
			if (max <= 60) max *= 1.5;
		}
		var itemBoost = this.getItemBoost(move, pokemon);
		if (itemBoost) {
			min *= itemBoost;
			max *= itemBoost;
		}
		var basePowerComment = min === max ? '' : Math.floor(min) + ' to ';
		basePowerComment += Math.floor(max);
		if (technician) basePowerComment += this.makePercentageChangeText(1.5, 'Technician');
		if (itemBoost) basePowerComment += this.makePercentageChangeText(itemBoost, Dex.getItem(pokemonData.item).name);
		return basePowerComment;
	};
	BattleTooltips.prototype.getPokemonTypes = function (pokemon) {
		if (!pokemon.types) {
			var template = Dex.getTemplate(pokemon.species);

			var types = template.types;
			if (this.battle.gen < 7) {
				var table = BattleTeambuilderTable['gen' + this.battle.gen];
				if (template.speciesid in table.overrideType) types = table.overrideType[template.speciesid].split('/');
			}
			return types;
		}

		var typesMap = pokemon.getTypes();
		var types = typesMap[0];
		if (typesMap[1]) return types.concat(typesMap[1]);
		return types;
	};
	BattleTooltips.prototype.pokemonHasType = function (pokemon, type, types) {
		if (!types) types = this.getPokemonTypes(pokemon);
		for (var i = 0; i < types.length; i++) {
			if (types[i] === type) return true;
		}
		return false;
	};
	return BattleTooltips;
})();
