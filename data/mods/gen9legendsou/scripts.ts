export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	inherit: 'gen9legends',
	init() {
		const legalItems = [
			'assaultvest', 'bigroot', 'blackbelt', 'blackglasses', 'charcoal', 'dragonfang', 'eviolite', 'expertbelt', 'fairyfeather',
			'focusband', 'focussash', 'hardstone', 'kingsrock', 'leftovers', 'lifeorb', 'lightball', 'magnet', 'metalcoat', 'miracleseed',
			'muscleband', 'mysticwater', 'nevermeltice', 'normalgem', 'poisonbarb', 'poweranklet', 'powerband', 'powerbelt', 'powerbracer',
			'powerlens', 'powerweight', 'quickclaw', 'rockyhelmet', 'scopelens', 'sharpbeak', 'shellbell', 'silkscarf', 'silverpowder',
			'softsand', 'spelltag', 'twistedspoon', 'weaknesspolicy', 'whiteherb', 'wiseglasses', 'bottlecap', 'goldbottlecap', 'dawnstone',
			'duskstone', 'firestone', 'galaricacuff', 'galaricawreath', 'icestone', 'leafstone', 'moonstone', 'sachet', 'shinystone',
			'sunstone', 'thunderstone', 'waterstone', 'whippeddream', 'bignugget',
		];
		const legalBerries = [
			'aspearberry', 'babiriberry', 'chartiberry', 'cheriberry', 'chestoberry', 'chilanberry', 'chopleberry', 'cobaberry', 'colburberry',
			'grepaberry', 'habanberry', 'hondewberry', 'kasibberry', 'kebiaberry', 'kelpsyberry', 'lumberry', 'occaberry', 'oranberry', 'passhoberry',
			'payapaberry', 'pechaberry', 'persimberry', 'pomegberry', 'qualotberry', 'rawstberry', 'rindoberry', 'roseliberry', 'shucaberry',
			'sitrusberry', 'tamatoberry', 'tangaberry', 'wacanberry', 'yacheberry',
		];
		const votedLegalitems = [
			'heavydutyboots', 'choiceband', 'choicescarf', 'choicespecs',
		];
		for (const i in this.data.Items) {
			if (this.data.Items[i].isNonstandard === 'CAP' || this.data.Items[i].isNonstandard === 'Custom') continue;
			if ([...legalItems, ...votedLegalitems, ...legalBerries].includes(i) || this.data.Items[i].megaStone) {
				if (['blazikenite', 'swampertite', 'sceptilite'].includes(i)) continue;
				this.modData('Items', i).isNonstandard = null;
			} else {
				this.modData('Items', i).isNonstandard = 'Past';
			}
		}
		for (const i in this.data.Moves) {
			if (this.data.Moves[i].isNonstandard !== 'Past') continue;
			this.modData('Moves', i).isNonstandard = null;
		}
	},
	pokemon: {
		isGrounded(negateImmunity = false) {
			if ('gravity' in this.battle.field.pseudoWeather) return true;
			if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
			if ('smackdown' in this.volatiles) return true;
			const item = (this.ignoringItem() ? '' : this.item);
			if (item === 'ironball') return true;
			// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
			if (!negateImmunity && this.hasType('Flying') && !(this.hasType('???') && 'roost' in this.volatiles)) return false;
			if (this.hasAbility(['levitate', 'ionbattery']) && !this.battle.suppressingAbility(this)) return null;
			if ('magnetrise' in this.volatiles) return false;
			if ('telekinesis' in this.volatiles) return false;
			return item !== 'airballoon';
		},
	},
	actions: {
		canMegaEvo(pokemon) {
			const species = pokemon.baseSpecies;
			const altForme = species.otherFormes && this.dex.species.get(species.otherFormes[0]);
			const item = pokemon.getItem();
			// Mega Rayquaza
			if ((this.battle.gen <= 7 || this.battle.ruleTable.has('+pokemontag:past') ||
				this.battle.ruleTable.has('+pokemontag:future')) &&
				altForme?.isMega && altForme?.requiredMove &&
				pokemon.baseMoves.includes(this.battle.toID(altForme.requiredMove)) && !item.zMove) {
				return altForme.name;
			}
			if (item.megaEvolves === species.name) {
				return item.megaStone;
			}
			return null;
		},
		runMegaEvo(pokemon) {
			const speciesid = pokemon.canMegaEvo || pokemon.canUltraBurst;
			if (!speciesid) return false;

			pokemon.formeChange(speciesid, pokemon.getItem(), true);

			// Limit one mega evolution
			const wasMega = pokemon.canMegaEvo;
			for (const ally of pokemon.side.pokemon) {
				if (wasMega) {
					ally.canMegaEvo = false;
				} else {
					ally.canUltraBurst = null;
				}
			}

			// will finish coding this later, not important since zygarde is banned
			if (speciesid === 'Zygarde-Mega') {
				const coreEnforcer = pokemon.moveSlots.findIndex(x => x.id === 'coreenforcer');
				if (coreEnforcer >= 0) {
					const nihilLight = this.battle.dex.moves.get('nihillight');
					pokemon.moveSlots[coreEnforcer] = pokemon.baseMoveSlots[coreEnforcer] = {
						id: nihilLight.id,
						move: nihilLight.name,
						pp: pokemon.moveSlots[coreEnforcer].pp,
						maxpp: pokemon.moveSlots[coreEnforcer].maxpp,
						disabled: false,
						used: false,
					};
				}
			}

			this.battle.runEvent('AfterMega', pokemon);
			return true;
		},
		modifyDamage(baseDamage, pokemon, target, move, suppressMessages = false) {
			const tr = this.battle.trunc;
			if (!move.type) move.type = '???';
			const type = move.type;

			baseDamage += 2;

			if (move.spreadHit) {
				// multi-target modifier (doubles only)
				const spreadModifier = this.battle.gameType === 'freeforall' ? 0.5 : 0.75;
				this.battle.debug(`Spread modifier: ${spreadModifier}`);
				baseDamage = this.battle.modify(baseDamage, spreadModifier);
			} else if (move.multihitType === 'parentalbond' && move.hit > 1) {
				// Parental Bond modifier
				const bondModifier = this.battle.gen > 6 ? 0.25 : 0.5;
				this.battle.debug(`Parental Bond modifier: ${bondModifier}`);
				baseDamage = this.battle.modify(baseDamage, bondModifier);
			} else if (move.multihitType === 'brassbond' as 'parentalbond' && move.hit > 1) {
				// Brass Bond modifier
				const bondModifier = 0.15;
				this.battle.debug(`Brass Bond modifier: ${bondModifier}`);
				baseDamage = this.battle.modify(baseDamage, bondModifier);
			}

			// weather modifier
			baseDamage = this.battle.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

			// crit - not a modifier
			const isCrit = target.getMoveHitData(move).crit;
			if (isCrit) {
				baseDamage = tr(baseDamage * (move.critModifier || (this.battle.gen >= 6 ? 1.5 : 2)));
			}

			// random factor - also not a modifier
			baseDamage = this.battle.randomizer(baseDamage);

			// STAB
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a MissingNo.)
			if (type !== '???') {
				let stab: number | [number, number] = 1;

				const isSTAB = move.forceSTAB || pokemon.hasType(type) || pokemon.getTypes(false, true).includes(type);
				if (isSTAB) {
					stab = 1.5;
				}

				// The Stellar tera type makes this incredibly confusing
				// If the move's type does not match one of the user's base types,
				// the Stellar tera type applies a one-time 1.2x damage boost for that type.
				//
				// If the move's type does match one of the user's base types,
				// then the Stellar tera type applies a one-time 2x STAB boost for that type,
				// and then goes back to using the regular 1.5x STAB boost for those types.
				if (pokemon.terastallized === 'Stellar') {
					if (!pokemon.stellarBoostedTypes.includes(type) || move.stellarBoosted) {
						stab = isSTAB ? 2 : [4915, 4096];
						move.stellarBoosted = true;
						if (pokemon.species.name !== 'Terapagos-Stellar') {
							pokemon.stellarBoostedTypes.push(type);
						}
					}
				} else {
					if (pokemon.terastallized === type && pokemon.getTypes(false, true).includes(type)) {
						stab = 2;
					}
					stab = this.battle.runEvent('ModifySTAB', pokemon, target, move, stab);
				}

				baseDamage = this.battle.modify(baseDamage, stab);
			}

			// types
			let typeMod = target.runEffectiveness(move);
			typeMod = this.battle.clampIntRange(typeMod, -6, 6);
			target.getMoveHitData(move).typeMod = typeMod;
			if (typeMod > 0) {
				if (!suppressMessages) this.battle.add('-supereffective', target);

				for (let i = 0; i < typeMod; i++) {
					baseDamage *= 2;
				}
			}
			if (typeMod < 0) {
				if (!suppressMessages) this.battle.add('-resisted', target);

				for (let i = 0; i > typeMod; i--) {
					baseDamage = tr(baseDamage / 2);
				}
			}

			if (isCrit && !suppressMessages) this.battle.add('-crit', target);

			if (pokemon.status === 'brn' && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
				if (this.battle.gen < 6 || move.id !== 'facade') {
					baseDamage = this.battle.modify(baseDamage, 0.5);
				}
			}

			// Generation 5, but nothing later, sets damage to 1 before the final damage modifiers
			if (this.battle.gen === 5 && !baseDamage) baseDamage = 1;

			// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
			baseDamage = this.battle.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

			if (move.isZOrMaxPowered && target.getMoveHitData(move).zBrokeProtect) {
				baseDamage = this.battle.modify(baseDamage, 0.25);
				this.battle.add('-zbroken', target);
			}

			// Generation 6-7 moves the check for minimum 1 damage after the final modifier...
			if (this.battle.gen !== 5 && !baseDamage) return 1;

			// ...but 16-bit truncation happens even later, and can truncate to 0
			return tr(baseDamage, 16);
		},
	},
};
