export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	terastalclause: {
		effectType: 'Rule',
		name: 'Terastal Clause',
		desc: "Prevents Pok&eacute;mon from Terastallizing",
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				if (pokemon.species.baseSpecies !== 'Ogerpon') {
					pokemon.canTerastallize = null;
				}
			}
			this.add('rule', 'Terastal Clause: You cannot Terastallize');
		},
	},
	ccapmformchanges: {
		effectType: 'Rule',
		name: 'CCAPM Form Changes',
		desc: "Makes a bunch of form changes function",
		onBegin() {
			this.add('rule', 'CCAPM Form Changes: Makes many form changes work');
		},
		onSwitchIn(pokemon) {
			if (!this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				if (pokemon.species.name === "Samurott" && pokemon.side.totalFainted >= 3) {
					pokemon.formeChange('Samurott-Overlord', null, true);
				}
				if (pokemon.species.name === "Jirachi" && (pokemon.side as any).holdHandsUsers?.length >= 2) {
					pokemon.formeChange('Jirachi-Harmonic', null, true);

					const holdHandsIndex = pokemon.set.moves
						.map(move => move.toLowerCase().replace(/[^a-z0-9]/g, '')).indexOf('holdhands' as ID);
					if (holdHandsIndex < 0) return;

					const move = this.dex.moves.get('lightofruin');
					const sketchedMove = {
						move: move.name,
						id: move.id,
						pp: move.pp,
						maxpp: move.pp,
						target: move.target,
						disabled: false,
						used: false,
					};
					pokemon.moveSlots[holdHandsIndex] = sketchedMove;
					pokemon.baseMoveSlots[holdHandsIndex] = sketchedMove;
				}
				if (pokemon.species.name === "Luvdisc" && pokemon.side.totalFainted >= 5) {
					pokemon.formeChange('Luvdisc-Heartbreak', null, true);
				}
			}
		},
		onWeatherChange(target, source, effect) {
			if (!this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				const weather = target.effectiveWeather();
				if (weather === 'sunnyday' || weather === 'desolateland') {
					if (target.species.name === "Beartic") {
						target.formeChange('Beartic-Freshwater', null, true);
						const glacierFangIndex = target.set.moves
							.map(move => move.toLowerCase().replace(/[^a-z0-9]/g, '')).indexOf('glacierfang' as ID);
						if (glacierFangIndex < 0) return;

						const move = this.dex.moves.get('meltingmaul');
						const sketchedMove = {
							move: move.name,
							id: move.id,
							pp: move.pp,
							maxpp: move.pp,
							target: move.target,
							disabled: false,
							used: false,
						};
						target.moveSlots[glacierFangIndex] = sketchedMove;
						target.baseMoveSlots[glacierFangIndex] = sketchedMove;
					}
				} else if (weather === 'hail' || weather === 'snowscape') {
					if (target.species.name === "Beartic-Freshwater") {
						target.formeChange('Beartic', null, true);
						const meltingMaulIndex = target.set.moves
							.map(move => move.toLowerCase().replace(/[^a-z0-9]/g, '')).indexOf('meltingmaul' as ID);
						if (meltingMaulIndex < 0) return;

						const move = this.dex.moves.get('glacierfang');
						const sketchedMove = {
							move: move.name,
							id: move.id,
							pp: move.pp,
							maxpp: move.pp,
							target: move.target,
							disabled: false,
							used: false,
						};
						target.moveSlots[meltingMaulIndex] = sketchedMove;
						target.baseMoveSlots[meltingMaulIndex] = sketchedMove;
					}
				}
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (!this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				if (move.type === 'Fire' && target.species.name === "Beartic") {
					target.formeChange('Beartic-Freshwater', null, true);

					const glacierFangIndex = target.set.moves
						.map(setMove => setMove.toLowerCase().replace(/[^a-z0-9]/g, '')).indexOf('glacierfang' as ID);
					if (glacierFangIndex < 0) return;

					const meltingmaul = this.dex.moves.get('meltingmaul');
					const sketchedMove = {
						move: meltingmaul.name,
						id: meltingmaul.id,
						pp: meltingmaul.pp,
						maxpp: meltingmaul.pp,
						target: meltingmaul.target,
						disabled: false,
						used: false,
					};

					target.moveSlots[glacierFangIndex] = sketchedMove;
					target.baseMoveSlots[glacierFangIndex] = sketchedMove;
				} else if (move.type === 'Ice' && target.species.name === "Beartic-Freshwater") {
					target.formeChange('Beartic', null, true);

					const meltingMaulIndex = target.set.moves
						.map(setMove => setMove.toLowerCase().replace(/[^a-z0-9]/g, '')).indexOf('meltingmaul' as ID);
					if (meltingMaulIndex < 0) return;

					const glacierfang = this.dex.moves.get('glacierfang');
					const sketchedMove = {
						move: glacierfang.name,
						id: glacierfang.id,
						pp: glacierfang.pp,
						maxpp: glacierfang.pp,
						target: glacierfang.target,
						disabled: false,
						used: false,
					};
					target.moveSlots[meltingMaulIndex] = sketchedMove;
					target.baseMoveSlots[meltingMaulIndex] = sketchedMove;
				} else if (move.type === 'Rock' && target.species.name === "Kommo-o") {
					target.formeChange('Kommo-o-Hard-Rock', null, true);
				} else if (move.type === 'Electric' && target.species.name === "Luxray") {
					target.formeChange('Luxray-Conductive', null, true);
				} else if (!move.damage && !move.damageCallback &&
					target.getMoveHitData(move).typeMod > 0 &&
					target.species.name === "Rhyperior") {
					target.formeChange('Rhyperior-Adversity', null, true);
				}
			}
		},
		onDamage(damage, target, source, effect) {
			if (!this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				if (effect && effect.id === 'stealthrock' && target.species.name === "Kommo-o") {
					target.formeChange('Kommo-o-Hard-Rock', null, true);
				}
			}
		},
		onAfterBoost(boost, target, source, effect) {
			if (!this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				/* let speedUp = false;
				let i: BoostID;
				for (i in boost) {
					if (boost[i]! > 0) {
						speedUp = true;
					}
				}
				if (speedUp && target.species.name === "Blaziken") {
					target.formeChange('Blaziken-Wildfire', null, true);
					target.setAbility('burnout', target);
				} */
				if (boost.spe && boost.spe > 0 &&
					target.species.name === "Blaziken") {
					target.formeChange('Blaziken-Wildfire', null, true);
				}
			}
			if (effect?.name === 'Fiery Dance' && boost.spa &&
				source.species.name === "Volcarona") {
				source.formeChange('Volcarona-Radiant', null, true);
				this.add('-activate', source, 'ability: Desolate Land');
			}
		},
		onModifyMovePriority: 1,
		onModifyMove(move, attacker, defender) {
			const shayLand = [
				'seedflare', 'gigadrain', 'flowertrick', 'sappyseed',
			];
			const shaySky = [
				'aromatherapy', 'worryseed', 'synthesis', 'flowershield', 'floralhealing', 'strengthsap',
			];
			if (attacker.species.name === "Shaymin" && shaySky.includes(move.id)) {
				attacker.formeChange('Shaymin-Sky', null, true);
			} else if (attacker.species.name === "Shaymin-Sky" && shayLand.includes(move.id)) {
				attacker.formeChange('Shaymin', null, true);
			}
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (!this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				if (source.species.name === "Clawitzer" && move.flags['pulse']) {
					source.formeChange('Clawitzer-Curled', null, true);
				} else if (source.species.name === "Lilligant" && move.flags['dance']) {
					source.formeChange('Lilligant-Hisui', null, true);
				} else if (source.species.name === "Luxray-Conductive" &&
					move.type !== 'Electric') {
					source.formeChange('Luxray', null, true);
				} else if (source.species.name === "Luxray" && move.type === 'Electric') {
					source.formeChange('Luxray-Conductive', null, true);
				} else if (source.species.name === "Talonflame" && move.type === 'Flying') {
					source.formeChange('Talonflame-Tempest', null, true);
				}
			}
		},
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (!this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				if (pokemon.activeTurns && pokemon.species.name === "Fearow") {
					pokemon.formeChange('Fearow-Ferocious', null, true);
					this.add('-ability', pokemon, 'Wonder Guard');
				} else if (pokemon.activeTurns && pokemon.species.name === "Fearow-Ferocious") {
					pokemon.formeChange('Fearow', null, true);
					this.add('-ability', pokemon, 'Sniper');
				} else if (pokemon.hp <= pokemon.maxhp / 2 &&
					pokemon.species.name === "Sunflora") {
					pokemon.formeChange('Sunflora-Wilted', null, true);
				} else if (pokemon.hp <= pokemon.maxhp / 2 &&
					pokemon.species.name === "Torterra") {
					pokemon.sethp(Math.min(pokemon.maxhp, pokemon.hp + pokemon.baseMaxhp / 4));
					this.add('-heal', pokemon, pokemon.getHealth);
					pokemon.formeChange('Torterra-Old!', null, true);
				}
			}
		},
		onAfterFaint(length, target, source, effect) {
			if (!this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				if (source?.species.id === 'lucario') {
					if (this.effectState.auraTriggered) return;
					if (effect?.effectType !== 'Move') {
						return;
					}
					if (source.hp && !source.transformed && source.side.foePokemonLeft()) {
						this.add('-activate', source, 'ability: Aura Bond');
						// the ability isn't real
						source.formeChange('Lucario-Aura Bond', this.effect, true);
						source.formeRegression = true;
						this.effectState.auraTriggered = true;
					}
				} else if (source?.species.name === "Octillery") {
					if (effect && effect.effectType === 'Move' && target.getMoveHitData(effect).crit) {
						source.formeChange('Octillery-Sharpshooter', null, true);
					}
				} else if (source?.species.name === "Dudunsparce" || source?.species.name === "Du-Dudunsparce") {
					if (effect && effect.effectType === 'Move') {
						source.formeChange('Dudunsparce-tongueemoji', null, true);
					}
				}
			}
		},
		onUpdate(pokemon) {
			if (!this.ruleTable.tagRules.includes("+pokemontag:cap")) {
				if (pokemon.species.baseSpecies === "Beartic") {
					this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
				}
				for (const target of pokemon.adjacentFoes()) {
					if ((target.status === 'psn' || target.status === 'tox') &&
						pokemon.species.name === "Pecharunt") {
						pokemon.formeChange('Pecharunt-Puppetmaster', null, true);
					} else if (target.status !== 'psn' && target.status !== 'tox' &&
						pokemon.species.name === "Pecharunt-Puppetmaster") {
						pokemon.formeChange('Pecharunt', null, true);
					}
				}
				if (pokemon.species.name === "Victini" && pokemon.hp <= pokemon.maxhp / 4 &&
					pokemon.hp > 0 && pokemon.side.pokemonLeft > 1) {
					let stat: BoostID;
					for (stat in pokemon.boosts) {
						if (pokemon.boosts[stat] < 0) {
							return;
						}
					}
					pokemon.formeChange('Victini-Victorious', null, true);
				}
			}
		},
	},
};
