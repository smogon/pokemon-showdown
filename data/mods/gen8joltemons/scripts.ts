import {RESTORATIVE_BERRIES} from "../../../sim/pokemon";

export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen8',
	gen: 8,
	actions: {
		canMegaEvo(pokemon) {
			const altForme = pokemon.baseSpecies.otherFormes && this.dex.species.get(pokemon.baseSpecies.otherFormes[0]);
			const item = pokemon.getItem();
			if (
				altForme?.isMega && altForme?.requiredMove &&
				pokemon.baseMoves.includes(this.dex.toID(altForme.requiredMove)) && !item.zMove
			) {
				return altForme.name;
			}
			if (item.name === "Slowbronite" && pokemon.baseSpecies.name === "Slowbro-Galar") {
				return null;
			}
			return item.megaStone;
		},
		modifyDamage(baseDamage, pokemon, target, move, suppressMessages) {
			const tr = this.battle.trunc;
			if (!move.type) move.type = '???';
			const type = move.type;

			baseDamage += 2;

			// multi-target modifier (doubles only)
			if (move.spreadHit) {
				// multi-target modifier (doubles only)
				const spreadModifier = move.spreadModifier || (this.battle.gameType === 'freeforall' ? 0.5 : 0.75);
				this.battle.debug('Spread modifier: ' + spreadModifier);
				baseDamage = this.battle.modify(baseDamage, spreadModifier);
			} else if (move.multihitType === 'parentalbond' && move.hit > 1) {
				// Parental Bond modifier
				const bondModifier = this.battle.gen > 6 ? 0.25 : 0.5;
				this.battle.debug(`Parental Bond modifier: ${bondModifier}`);
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
			if (move.forceSTAB || (type !== '???' && pokemon.hasType(type))) {
				// The "???" type never gets STAB
				// Not even if you Roost in Gen 4 and somehow manage to use
				// Struggle in the same turn.
				// (On second thought, it might be easier to get a MissingNo.)
				baseDamage = this.battle.modify(baseDamage, move.stab || 1.5);
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
				if (this.battle.gen < 6 || move.id !== 'facade' || move.id !== 'shadowpunch') {
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
	pokemon: {
		isGrounded(negateImmunity = false) {
			if ('gravity' in this.battle.field.pseudoWeather) return true;
			if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
			if ('smackdown' in this.volatiles) return true;
			const item = (this.ignoringItem() ? '' : this.item);
			if (item === 'ironball') return true;
			// If a Fire/Flying type uses Burn Up and Roost, it becomes ???/Flying-type, but it's still grounded.
			if (!negateImmunity && this.hasType('Flying') && !('roost' in this.volatiles)) return false;
			if (
				this.hasAbility(['levitate', 'powerofalchemyweezing', 'powerofalchemymismagius']) &&
				!this.battle.suppressingAbility(this)
			) return null;
			if ('magnetrise' in this.volatiles) return false;
			if ('telekinesis' in this.volatiles) return false;
			return item !== 'airballoon';
		},
		ignoringAbility() {
			// Check if any active pokemon have the ability Neutralizing Gas
			let neutralizinggas = false;
			let powerofalchemyweezing = false;
			for (const pokemon of this.battle.getAllActive()) {
				// can't use hasAbility because it would lead to infinite recursion
				if (pokemon.ability === ('neutralizinggas' as ID) ||
					(
						pokemon.ability === ('powerofalchemyweezing' as ID) &&
						!pokemon.volatiles['gastroacid'] &&
						!pokemon.abilityState.ending
					)
				) {
					neutralizinggas = true;
					powerofalchemyweezing = true;
					break;
				}
			}

			return !!(
				(this.battle.gen >= 5 && !this.isActive) ||
				((this.volatiles['gastroacid'] ||
					(neutralizinggas && this.ability !== ('neutralizinggas' as ID)) ||
					(powerofalchemyweezing && this.ability !== ('powerofalchemyweezing' as ID))
				) && !this.getAbility().isPermanent)
			);
		},
		setStatus(
			status: string | Condition,
			source: Pokemon | null = null,
			sourceEffect: Effect | null = null,
			ignoreImmunities = false
		) {
			if (!this.hp) return false;
			status = this.battle.dex.conditions.get(status);
			if (this.battle.event) {
				if (!source) source = this.battle.event.source;
				if (!sourceEffect) sourceEffect = this.battle.effect;
			}
			if (!source) source = this;

			if (this.status === status.id) {
				if ((sourceEffect as Move)?.status === this.status) {
					this.battle.add('-fail', this, this.status);
				} else if ((sourceEffect as Move)?.status) {
					this.battle.add('-fail', source);
					this.battle.attrLastMove('[still]');
				}
				return false;
			}
			if (!ignoreImmunities && status.id &&
				!(source?.hasAbility([
					'corrosion', 'powerofalchemymismagius', 'powerofalchemyumbreon',
				]) && ['tox', 'psn'].includes(status.id))) {
				// the game currently never ignores immunities
				if (!this.runStatusImmunity(status.id === 'tox' ? 'psn' : status.id)) {
					this.battle.debug('immune to status');
					if ((sourceEffect as Move)?.status) {
						this.battle.add('-immune', this);
					}
					return false;
				}
			}
			const prevStatus = this.status;
			const prevStatusState = this.statusState;
			if (status.id) {
				const result: boolean = this.battle.runEvent('SetStatus', this, source, sourceEffect, status);
				if (!result) {
					this.battle.debug('set status [' + status.id + '] interrupted');
					return result;
				}
			}
			this.status = status.id;
			this.statusState = {id: status.id, target: this};
			if (source) this.statusState.source = source;
			if (status.duration) this.statusState.duration = status.duration;
			if (status.durationCallback) {
				this.statusState.duration = status.durationCallback.call(this.battle, this, source, sourceEffect);
			}

			if (status.id && !this.battle.singleEvent('Start', status, this.statusState, this, source, sourceEffect)) {
				this.battle.debug('status start [' + status.id + '] interrupted');
				// cancel the setstatus
				this.status = prevStatus;
				this.statusState = prevStatusState;
				return false;
			}
			if (status.id && !this.battle.runEvent('AfterSetStatus', this, source, sourceEffect, status)) {
				return false;
			}
			return true;
		},
		getAbility() {
			const item = this.battle.dex.items.getByID(this.ability);
			return item.exists ? item as Effect as Ability : this.battle.dex.abilities.getByID(this.ability);
		},
		hasItem(item) {
			if (this.ignoringItem()) return false;
			if (!Array.isArray(item)) {
				item = this.battle.toID(item);
				return item === this.item || item === this.ability;
			}
			item = item.map(this.battle.toID);
			return item.includes(this.item) || item.includes(this.ability);
		},
		eatItem(force, source, sourceEffect) {
			if (!this.item || this.itemState.knockedOff) return false;
			if ((!this.hp && this.item !== 'jabocaberry' && this.item !== 'rowapberry') || !this.isActive) return false;

			if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
			if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
			const item = this.getItem();
			if (
				this.battle.runEvent('UseItem', this, null, null, item) &&
				(force || this.battle.runEvent('TryEatItem', this, null, null, item))
			) {
				this.battle.add('-enditem', this, item, '[eat]');

				this.battle.singleEvent('Eat', item, this.itemState, this, source, sourceEffect);
				this.battle.runEvent('EatItem', this, null, null, item);

				if (RESTORATIVE_BERRIES.has(item.id)) {
					switch (this.pendingStaleness) {
					case 'internal':
						if (this.staleness !== 'external') this.staleness = 'internal';
						break;
					case 'external':
						this.staleness = 'external';
						break;
					}
					this.pendingStaleness = undefined;
				}
				if (this.item === item.id) {
					this.lastItem = this.item;
					this.item = '';
					this.itemState = {id: '', target: this};
				}
				if (this.ability === item.id) {
					this.lastItem = this.ability;
					this.baseAbility = this.ability = '';
					this.abilityState = {id: '', target: this};
				}
				this.usedItemThisTurn = true;
				this.ateBerry = true;
				this.battle.runEvent('AfterUseItem', this, null, null, item);
				return true;
			}
			return false;
		},
		useItem(source, sourceEffect) {
			if ((!this.hp && !this.getItem().isGem) || !this.isActive) return false;
			if (!this.item || this.itemState.knockedOff) return false;

			if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
			if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
			const item = this.getItem();
			if (this.battle.runEvent('UseItem', this, null, null, item)) {
				switch (item.id) {
				case 'redcard':
					this.battle.add('-enditem', this, item, '[of] ' + source);
					break;
				default:
					if (item.isGem) {
						this.battle.add('-enditem', this, item, '[from] gem');
					} else {
						this.battle.add('-enditem', this, item);
					}
					break;
				}
				if (item.boosts) {
					this.battle.boost(item.boosts, this, source, item);
				}

				this.battle.singleEvent('Use', item, this.itemState, this, source, sourceEffect);

				if (this.item === item.id) {
					this.lastItem = this.item;
					this.item = '';
					this.itemState = {id: '', target: this};
				}
				if (this.ability === item.id) {
					this.lastItem = this.ability;
					this.baseAbility = this.ability = '';
					this.abilityState = {id: '', target: this};
				}
				this.usedItemThisTurn = true;
				this.battle.runEvent('AfterUseItem', this, null, null, item);
				return true;
			}
			return false;
		},
		setAbility(ability, source, isFromFormeChange) {
			if (this.battle.dex.items.get(this.ability).exists) return false;
			return Object.getPrototypeOf(this).setAbility.call(this, ability, source, isFromFormeChange);
		},
	},

	init() {
		this.modData('Learnsets', 'wigglytuff').learnset.geomancy = ['8L1'];
		this.modData('Learnsets', 'articunogalar').learnset.defog = ['8L1'];
		this.modData('Learnsets', 'zapdosgalar').learnset.defog = ['8L1'];
		this.modData('Learnsets', 'moltresgalar').learnset.defog = ['8L1'];
		this.modData('Learnsets', 'articunogalar').learnset.toxic = ['8L1'];
		this.modData('Learnsets', 'articunogalar').learnset.heatwave = ['8L1'];
		this.modData('Learnsets', 'zapdosgalar').learnset.toxic = ['8L1'];
		this.modData('Learnsets', 'moltresgalar').learnset.toxic = ['8L1'];
		this.modData('Learnsets', 'magmortar').learnset.recover = ['8L1'];
		this.modData('Learnsets', 'girafarig').learnset.focusblast = ['8L1'];
		this.modData('Learnsets', 'zarude').learnset.focusblast = ['8L1'];
		this.modData('Learnsets', 'zarudedada').learnset.focusblast = ['8L1'];
		this.modData('Learnsets', 'samurott').learnset.focusblast = ['8L1'];
		this.modData('Learnsets', 'jirachi').learnset.focusblast = ['8L1'];
		this.modData('Learnsets', 'delphox').learnset.focusblast = ['8L1'];
		this.modData('Learnsets', 'ninetalesalola').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'sandslashalola').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'abomasnow').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'arctozolt').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'arctovish').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'avalugg').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'articuno').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'crabominable').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'cryogonal').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'dewgong').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'froslass').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'frosmoth').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'glaceon').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'glalie').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'glastrier').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'jynx').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'lapras').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'mrrime').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'vanilluxe').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'walrein').learnset.meltingpoint = ['8L1'];
		this.modData('Learnsets', 'spinarak').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'weedle').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'wurmple').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'venonat').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'combee').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'volbeat').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'illumise').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'shuckle').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'surskit').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'bulbasaur').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'joltik').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'dewpider').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'slowbrogalar').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'tentacool').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'poipole').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'umbreon').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'tangrowth').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'accelgor').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'leavanny').learnset.toxicthread = ['8L1'];
		this.modData('Learnsets', 'anorith').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'croagunk').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'cubone').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'diglett').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'diglettalola').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'drilbur').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'geodude').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'geodudealola').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'gible').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'gligar').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'groudon').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'helioptile').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'jynx').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'mudbray').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'numel').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'lileep').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'onix').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'paras').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'rhyhorn').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'rolycoly').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'salandit').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'sandile').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'sandshrew').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'shuckle').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'silicobra').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'torkoal').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'trapinch').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'volcanion').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'wormadamsandy').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'yamaskgalar').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'solrock').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'lunatone').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'minior').learnset.aridabsorption = ['8L1'];
		this.modData('Learnsets', 'aegislash').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'aggron').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'arceus').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'bastiodon').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'bronzong').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'carbink').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'celesteela').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'copperajah').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'dialga').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'duraludon').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'empoleon').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'escavalier').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'forretress').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'genesect').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'jirachi').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'kartana').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'klinklang').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'magearna').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'magnezone').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'melmetal').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'necrozma').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'probopass').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'regice').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'regigigas').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'registeel').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'regirock').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'scizor').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'skarmory').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'solgaleo').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'stakataka').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'steelix').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'wormadamtrash').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'wormadam').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'wormadamsandy').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'zamazenta').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'reuniclus').learnset.reconstruct = ['8L1'];
		this.modData('Learnsets', 'porygon').learnset.reconstruct = ['8L1'];
		delete this.modData('Learnsets', 'alakazam').learnset.nastyplot;
		this.modData('Learnsets', 'meganium').learnset.wish = ['8L1'];
		this.modData('Learnsets', 'meganium').learnset.weatherball = ['8L1'];
		this.modData('Learnsets', 'meganium').learnset.bodypress = ['8L1'];
		this.modData('Learnsets', 'ampharos').learnset.dracometeor = ['8L1'];
		this.modData('Learnsets', 'ampharos').learnset.slackoff = ['8L1'];
		this.modData('Learnsets', 'ambipom').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'breloom').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'grapploct').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'sawk').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'infernape').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'scrafty').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'hitmonchan').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'crabominable').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'machamp').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'conkeldurr').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'melmetal').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'pangoro').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'ledian').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'toxicroak').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'mukalola').learnset.armthrust = ['8L1'];
		this.modData('Learnsets', 'trevenant').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'exeggcute').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'landorus').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'thundurus').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'tornadus').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'ferrothorn').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'calyrex').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'dhelmise').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'leafeon').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'meganium').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'torterra').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'dubwool').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'sawsbuck').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'comfey').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'maractus').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'abomasnow').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'scolipede').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'regigigas').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'simisage').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'simisear').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'simipour').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'sirfetchd').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'skiddo').learnset.rototiller = ['8L1'];
		this.modData('Learnsets', 'chansey').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'umbreon').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'milotic').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'amoonguss').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'mismagius').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'braixen').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'murkrow').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'ninetales').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'lumineon').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'volbeat').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'solrock').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'pachirisu').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'gigalith').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'watchog').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'gourgeist').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'zekrom').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'electivire').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'golemalola').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'luxray').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'thundurus').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'eelektross').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'zeraora').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'pincurchin').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'arctozolt').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'dracozolt').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'regieleki').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'zebstrika').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'togedemaru').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'toxtricity').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'toxtricitylowkey').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'morpeko').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'zapdos').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'raichualola').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'raichu').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'raikou').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'xurkitree').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'marowak').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'marowakalola').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'rhydon').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'goldeen').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'manectric').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'terrakion').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'virizion').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'keldeo').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'cobalion').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'sirfetchd').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'escavalier').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'celesteela').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'zacian').learnset.lightninglance = ['8L1'];
		this.modData('Learnsets', 'cleffa').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'ralts').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'mawile').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'tapukoko').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'tapulele').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'tapubulu').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'tapufini').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'azurill').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'diancie').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'flabebe').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'snubbull').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'impidimp').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'hatenna').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'ninetalesalola').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'primarina').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'klefki').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'mimikyu').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'togepi').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'weezinggalar').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'swirlix').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'comfey').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'carbink').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'sylveon').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'spritzee').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'cutiefly').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'cottonee').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'milcery').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'dedenne').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'mimejr').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'ponytagalar').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'morelull').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'igglybuff').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'xerneas').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'magearna').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'zacian').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'hoopa').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'latias').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'latios').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'meditite').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'slowpoke').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'slowpokegalar').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'abra').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'victini').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'articunogalar').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'azelf').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'bruxish').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'chingling').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'delphox').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'deoxys').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'girafarig').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'spoink').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'drowzee').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'jirachi').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'meloetta').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'mew').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'beldum').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'necrozma').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'solosis').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'cresselia').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'indeedee').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'indeedeef').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'sigilyph').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'bronzor').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'celebi').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'espeon').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'starmie').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'raichualola').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'calyrex').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'baltoy').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'mesprit').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'natu').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'elgyem').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'exeggcute').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'gothita').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'smoochum').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'lunatone').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'inkay').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'espurr').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'munna').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'oranguru').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'dottler').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'woobat').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'uxie').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'mewtwo').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'lugia').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'arceus').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'solgaleo').learnset.counterspell = ['8L1'];
		this.modData('Learnsets', 'lunala').learnset.counterspell = ['8L1'];
		this.modData("Learnsets", "oshawott").learnset.firstimpression = ["8L1"];
		this.modData("Learnsets", "dewott").learnset.brickbreak = ["8L1"];
		this.modData("Learnsets", "dewott").learnset.closecombat = ["8L1"];
		this.modData("Learnsets", "samurott").learnset.shellsmash = ["8L1"];
		this.modData("Learnsets", "samurott").learnset.drillrun = ["8L1"];
		this.modData("Learnsets", "muk").learnset.recover = ["8L1"];
		this.modData("Learnsets", "muk").learnset.stealthrock = ["8L1"];
		this.modData("Learnsets", "mukalola").learnset.recover = ["8L1"];
		this.modData("Learnsets", "mukalola").learnset.toxicspikes = ["8L1"];
		this.modData("Learnsets", "mismagius").learnset.moonblast = ["8L1"];
		this.modData("Learnsets", "mismagius").learnset.partingshot = ["8L1"];
		this.modData("Learnsets", "mismagius").learnset.toxicspikes = ["8L1"];
		this.modData("Learnsets", "mismagius").learnset.venoshock = ["8L1"];
		this.modData('Learnsets', 'mismagius').learnset.deafeningshriek = ['8L1'];
		this.modData('Learnsets', 'primarina').learnset.deafeningshriek = ['8L1'];
		this.modData('Learnsets', 'froslass').learnset.deafeningshriek = ['8L1'];
		this.modData('Learnsets', 'chatot').learnset.deafeningshriek = ['8L1'];
		this.modData('Learnsets', 'cursola').learnset.deafeningshriek = ['8L1'];
		this.modData('Learnsets', 'exploud').learnset.deafeningshriek = ['8L1'];
		this.modData('Learnsets', 'gourgeist').learnset.deafeningshriek = ['8L1'];
		this.modData('Learnsets', 'drifblim').learnset.deafeningshriek = ['8L1'];
		this.modData('Learnsets', 'guzzlord').learnset.deafeningshriek = ['8L1'];
		this.modData('Learnsets', 'banette').learnset.deafeningshriek = ['8L1'];
		this.modData('Learnsets', 'ludicolo').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'politoed').learnset.lifedew = ['8L1'];
		// this.modData('Learnsets', 'alomomola').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'luvdisc').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'florges').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'xerneas').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'empoleon').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'phione').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'indeedee').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'indeedeef').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'comfey').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'eldegoss').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'seel').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'meganium').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'wailmer').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'panpour').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'misdreavus').learnset.lifedew = ['8L1'];
		// this.modData('Learnsets', 'hoopa').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'morelull').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'munna').learnset.lifedew = ['8L1'];
		this.modData('Learnsets', 'litten').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'zigzagoongalar').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'silvally').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'pancham').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'chatot').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'morpeko').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'persianalola').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'thievul').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'trubbish').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'articunogalar').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'toxtricity').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'muk').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'toxtricitylowkey').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'muk').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'mukalola').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'weezing').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'crobat').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'toxicroak').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'scrafty').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'simisage').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'salandit').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'yveltal').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'sneasel').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'hoopa').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'zweilous').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'krookodile').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'cacturne').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'houndoom').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'zoroark').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'slowkinggalar').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'gastly').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'liepard').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'malamar').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'vullaby').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'zarude').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'zarudedada').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'seviper').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'zangoose').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'gulpin').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'skuntank').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'rattataalola').learnset.trashtalk = ['8L1'];
		this.modData('Learnsets', 'bruxish').learnset.trashtalk = ['8L1'];
		this.modData("Learnsets", "meganium").learnset.playrough = ["8L1"];
		this.modData("Learnsets", "meganium").learnset.moonblast = ["8L1"];
		this.modData("Learnsets", "meganium").learnset.drainingkiss = ["8L1"];
		this.modData("Learnsets", "meganium").learnset.superpower = ["8L1"];
		this.modData("Learnsets", "meganium").learnset.dazzlinggleam = ["8L1"];
		this.modData("Learnsets", "typhlosion").learnset.earthpower = ["8L1"];
		this.modData("Learnsets", "typhlosion").learnset.meteorbeam = ["8L1"];
		this.modData("Learnsets", "typhlosion").learnset.scorchingsands = ["8L1"];
		this.modData("Learnsets", "typhlosion").learnset.stealthrock = ["8L1"];
		this.modData("Learnsets", "feraligatr").learnset.suckerpunch = ["8L1"];
		this.modData("Learnsets", "feraligatr").learnset.pursuit = ["8L1"];
		this.modData("Learnsets", "feraligatr").learnset.scaleshot = ["8L1"];
		this.modData("Learnsets", "centiskorch").learnset.scaleshot = ["8L1"];
		this.modData("Learnsets", "centiskorch").learnset.recover = ["8L1"];
		this.modData("Learnsets", "centiskorch").learnset.suckerpunch = ["8L1"];
		this.modData("Learnsets", "centiskorch").learnset.firstimpression = ["8L1"];
		this.modData("Learnsets", "centiskorch").learnset.uturn = ["8L1"];
		this.modData("Learnsets", "centiskorch").learnset.earthquake = ["8L1"];
		this.modData("Learnsets", "centiskorch").learnset.toxic = ["8L1"];
		this.modData("Learnsets", "centiskorch").learnset.rapidspin = ["8L1"];
		this.modData("Learnsets", "blacephalon").learnset.headbutt = ["8L1"];
		this.modData("Learnsets", "blacephalon").learnset.headcharge = ["8L1"];
		this.modData('Learnsets', 'tapukoko').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'tapulele').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'tapufini').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'tapubulu').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'clefairy').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'wigglytuff').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'hatterene').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'grimmsnarl').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'mrmime').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'golett').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'ledian').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'hitmonchan').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'trevenant').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'haunter').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'shroomish').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'infernape').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'meditite').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'slurpuff').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'shiinotic').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'aromatisse').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'regigigas').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'ralts').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'whimsicott').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'mawile').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'azumarill').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'granbull').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'dusclops').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'jirachi').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'reuniclus').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'audino').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'marshadow').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'hoopa').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'meloetta').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'sableye').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'mesprit').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'uxie').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'azelf').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'delphox').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'celebi').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'victini').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'mew').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'mewtwo').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'abra').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'diancie').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'wooper').learnset.enchantedpunch = ['8L1'];
		this.modData('Learnsets', 'golemalola').learnset.electroball = ['8L1'];
		this.modData('Learnsets', 'passimian').learnset.electroball = ['8L1'];
		this.modData('Learnsets', 'klinklang').learnset.electroball = ['8L1'];
		this.modData('Learnsets', 'jumpluff').learnset.electroball = ['8L1'];
		this.modData('Learnsets', 'raikou').learnset.electroball = ['8L1'];
		this.modData('Learnsets', 'eelektrik').learnset.electroball = ['8L1'];
		this.modData('Learnsets', 'blacephalon').learnset.electroball = ['8L1'];
		this.modData('Learnsets', 'zebstrika').learnset.electroball = ['8L1'];
		this.modData('Learnsets', 'diggersby').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'dusknoir').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'grapploct').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'passimian').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'machamp').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'sawk').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'throh').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'lurantis').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'metagross').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'pignite').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'aipom').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'golurk').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'ledian').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'regigigas').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'poliwhirl').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'primeape').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'hawlucha').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'toxicroak').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'eelektross').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'mienshao').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'thundurus').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'tornadus').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'medicham').learnset.skyuppercut = ['8L1'];
		this.modData('Learnsets', 'hariyama').learnset.skyuppercut = ['8L1'];
		delete this.modData('Learnsets', 'lopunny').learnset.skyuppercut;
		delete this.modData('Learnsets', 'buneary').learnset.skyuppercut;
		delete this.modData('Learnsets', 'tapukoko').learnset.electroball;
		delete this.modData('Learnsets', 'regieleki').learnset.electroball;
		this.modData('Learnsets', 'slurpuff').learnset.thunderpunch = ['8L1'];
		this.modData('Learnsets', 'greedent').learnset.thunderpunch = ['8L1'];
		this.modData('Learnsets', 'komala').learnset.thunderpunch = ['8L1'];
		this.modData('Learnsets', 'indeedee').learnset.thunderpunch = ['8L1'];
		this.modData('Learnsets', 'indeedeef').learnset.thunderpunch = ['8L1'];
		this.modData('Learnsets', 'passimian').learnset.thunderpunch = ['8L1'];
		this.modData('Learnsets', 'darmanitan').learnset.thunderpunch = ['8L1'];
		this.modData('Learnsets', 'beartic').learnset.thunderpunch = ['8L1'];
		this.modData('Learnsets', 'mienfoo').learnset.thunderpunch = ['8L1'];
		this.modData('Learnsets', 'slurpuff').learnset.firepunch = ['8L1'];
		this.modData('Learnsets', 'greedent').learnset.firepunch = ['8L1'];
		this.modData('Learnsets', 'komala').learnset.firepunch = ['8L1'];
		this.modData('Learnsets', 'indeedee').learnset.firepunch = ['8L1'];
		this.modData('Learnsets', 'indeedeef').learnset.firepunch = ['8L1'];
		this.modData('Learnsets', 'passimian').learnset.firepunch = ['8L1'];
		this.modData('Learnsets', 'cherrim').learnset.firepunch = ['8L1'];
		this.modData('Learnsets', 'mienfoo').learnset.firepunch = ['8L1'];
		this.modData('Learnsets', 'slurpuff').learnset.icepunch = ['8L1'];
		this.modData('Learnsets', 'greedent').learnset.icepunch = ['8L1'];
		this.modData('Learnsets', 'komala').learnset.icepunch = ['8L1'];
		this.modData('Learnsets', 'indeedee').learnset.icepunch = ['8L1'];
		this.modData('Learnsets', 'indeedeef').learnset.icepunch = ['8L1'];
		this.modData('Learnsets', 'passimian').learnset.icepunch = ['8L1'];
		this.modData('Learnsets', 'barbaracle').learnset.icepunch = ['8L1'];
		this.modData('Learnsets', 'mienfoo').learnset.icepunch = ['8L1'];
		this.modData("Learnsets", "wishiwashi").learnset.recover = ["8L1"];
		this.modData("Learnsets", "wishiwashi").learnset.outrage = ["8L1"];
		this.modData("Learnsets", "wishiwashi").learnset.dragondance = ["8L1"];
		this.modData("Learnsets", "wishiwashi").learnset.dragonpulse = ["8L1"];
		this.modData("Learnsets", "wishiwashi").learnset.dracometeor = ["8L1"];
		this.modData("Learnsets", "wishiwashi").learnset.coreenforcer = ["8L1"];
		this.modData("Learnsets", "azelf").learnset.aurasphere = ["8L1"];
		this.modData("Learnsets", "azelf").learnset.focusblast = ["8L1"];
		this.modData("Learnsets", "azelf").learnset.reversal = ["8L1"];
		this.modData("Learnsets", "azelf").learnset.vacuumwave = ["8L1"];
		this.modData("Learnsets", "azelf").learnset.forcepalm = ["8L1"];
		this.modData("Learnsets", "mesprit").learnset.taunt = ["8L1"];
		this.modData("Learnsets", "mesprit").learnset.moonblast = ["8L1"];
		this.modData("Learnsets", "mesprit").learnset.spiritbreak = ["8L1"];
		this.modData("Learnsets", "mesprit").learnset.fairylock = ["8L1"];
		this.modData("Learnsets", "mesprit").learnset.defog = ["8L1"];
		this.modData("Learnsets", "uxie").learnset.flashcannon = ["8L1"];
		this.modData("Learnsets", "uxie").learnset.disable = ["8L1"];
		this.modData("Learnsets", "uxie").learnset.doomdesire = ["8L1"];
		this.modData("Learnsets", "uxie").learnset.teleport = ["8L1"];
		this.modData("Learnsets", "uxie").learnset.steelbeam = ["8L1"];
		this.modData("Learnsets", "uxie").learnset.reconstruct = ["8L1"];
		delete this.modData('Learnsets', 'melmetal').learnset.thunderpunch;
		this.modData('Learnsets', 'fearow').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'graveler').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'graveleralola').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'voltorb').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'rhydon').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'totodile').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'hoppip').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'miltank').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'dunsparce').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'kirlia').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'spheal').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'bidoof').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'burmy').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'floatzel').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'lickilicky').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'whirlipede').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'sandile').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'minccino').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'klink').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'meloetta').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'incineroar').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'poipole').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'wooloo').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'barraskewda').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'alcremie').learnset.rapidspin = ['8L1'];
		this.modData('Learnsets', 'meowth').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'meowthalola').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'meowthgalar').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'krabby').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'zapdosgalar').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'totodile').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'ursaring').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'gligar').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'corphish').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'absol').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'metang').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'drapion').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'dwebble').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'krokorok').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'beartic').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'binacle').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'clawitzer').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'pangoro').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'trevenant').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'yveltal').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'incineroar').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'crabrawler').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'golisopod').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'bewear').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'guzzlord').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'necrozma').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'zeraora').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'hatterene').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'zarude').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'zarudedada').learnset.crushclaw = ['8L1'];
		this.modData('Learnsets', 'poliwag').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'seel').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'qwilfish').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'lotad').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'huntail').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'gorebyss').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'luvdisc').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'anorith').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'piplup').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'bidoof').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'buizel').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'finneon').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'croagunk').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'phione').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'oshawott').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'panpour').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'alomomola').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'ducklett').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'stunfisk').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'eelektrik').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'inkay').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'bruxish').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'golisopod').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'grapploct').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'meganium').learnset.highhorsepower = ['8L1'];
		this.modData('Learnsets', 'celesteela').learnset.thunderbolt = ['8L1'];
		this.modData('Learnsets', 'archeops').learnset.bravebird = ['8L1'];
		this.modData('Learnsets', 'archeops').learnset.hurricane = ['8L1'];
		this.modData('Learnsets', 'weedle').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'nidoranm').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'slowbrogalar').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'mareanie').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'ekans').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'spinarak').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'wurmple').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'nidoranf').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'nihilego').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'seviper').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'tentacool').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'venonat').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'victreebel').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'venipede').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'zubat').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'roselia').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'toxtricity').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'toxtricitylowkey').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'skorupi').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'croagunk').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'trubbish').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'qwilfish').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'stunky').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'poipole').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'gligar').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'sandshrew').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'sandshrewalola').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'cacnea').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'vespiquen').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'breloom').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'decidueye').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'buzzwole').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'spearow').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'heracross').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'omastar').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'accelgor').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'pincurchin').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'seismitoad').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'froakie').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'skrelp').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'cloyster').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'frillish').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'octillery').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'clobbopus').learnset.poisondart = ['8L1'];
		this.modData('Learnsets', 'accelgor').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'trubbish').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'goodra').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'grimer').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'grimeralola').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'nidoking').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'nidoqueen').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'pancham').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'reuniclus').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'swalot').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'croagunk').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'haunter').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'guzzlord').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'hitmonchan').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'breloom').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'seismitoad').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'scraggy').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'marshtomp').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'toxtricity').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'toxtricitylowkey').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'poliwrath').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'quagsire').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'clobbopus').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'eelektross').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'deoxys').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'tsareena').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'shiinotic').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'gloom').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'ludicolo').learnset.acidicfists = ['8L1'];
		this.modData('Learnsets', 'tangela').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'foongus').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'oddish').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'butterfree').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'cherrim').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'gossifleur').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'exeggcute').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'hoppip').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'paras').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'morelull').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'venonat').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'bellsprout').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'spewpa').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'carnivine').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'petilil').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'budew').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'shroomish').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'cottonee').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'bulbasaur').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'chikorita').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'dustox').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'mothim').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'beautifly').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'cutiefly').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'volcarona').learnset.rashpowder = ['8L1'];
		this.modData('Learnsets', 'voltorb').learnset.mistyexplosion = ['8L1'];
		this.modData('Learnsets', 'klefki').learnset.mistyexplosion = ['8L1'];
		this.modData('Learnsets', 'flabebe').learnset.mistyexplosion = ['8L1'];
		this.modData('Learnsets', 'dedenne').learnset.mistyexplosion = ['8L1'];
		this.modData('Learnsets', 'luvdisc').learnset.mistyexplosion = ['8L1'];
		this.modData('Learnsets', 'togetic').learnset.mistyexplosion = ['8L1'];
		this.modData('Learnsets', 'altaria').learnset.mistyexplosion = ['8L1'];
		this.modData('Learnsets', 'castform').learnset.mistyexplosion = ['8L1'];
		this.modData('Learnsets', 'mandibuzz').learnset.bonemerang = ['8L1'];
		this.modData('Learnsets', 'houndour').learnset.bonemerang = ['8L1'];
		this.modData('Learnsets', 'stoutland').learnset.bonemerang = ['8L1'];
		this.modData('Learnsets', 'lycanroc').learnset.bonemerang = ['8L1'];
		this.modData('Learnsets', 'lycanrocdusk').learnset.bonemerang = ['8L1'];
		this.modData('Learnsets', 'lycanrocmidnight').learnset.bonemerang = ['8L1'];
		this.modData('Learnsets', 'lucario').learnset.bonemerang = ['8L1'];
		this.modData('Learnsets', 'bulbasaur').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'ekans').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'nidoranm').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'nidoranf').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'bellsprout').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'paras').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'poliwag').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'grimer').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'grimeralola').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'slowbrogalar').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'vileplume').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'diglett').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'diglettalola').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'spinarak').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'wooper').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'yanma').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'qwilfish').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'swinub').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'shuckle').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'mudkip').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'nincada').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'corphish').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'surskit').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'barboach').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'baltoy').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'anorith').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'stunky').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'burmy').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'shellos').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'croagunk').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'skorupi').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'carnivine').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'venipede').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'tympole').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'trubbish').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'shelmet').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'stunfisk').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'golett').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'eelektrik').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'durant').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'bunnelby').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'goomy').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'grubbin').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'wimpod').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'mudbray').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'poipole').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'toxtricity').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'buzzwole').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'gulpin').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'bidoof').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'marill').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'kecleon').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'tangela').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'crabrawler').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'karrablast').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'krabby').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'dwebble').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'tropius').learnset.mudspike = ['8L1'];
		this.modData('Learnsets', 'corsolagalar').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'munchlax').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'stonjourner').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'wailmer').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'jigglypuff').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'pincurchin').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'golett').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'heatran').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'gastly').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'azelf').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'volcanion').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'spheal').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'cyndaquil').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'skwovet').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'geodude').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'geodudealola').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'voltorb').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'koffing').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'pineco').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'seedot').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'lunatone').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'solrock').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'baltoy').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'drifloon').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'stunky').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'roggenrola').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'trubbish').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'ferroseed').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'silvally').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'minior').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'turtonator').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'magnemite').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'grimer').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'grimeralola').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'exeggcute').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'bonsly').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'onix').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'qwilfish').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'corsola').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'nosepass').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'gulpin').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'numel').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'glalie').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'bronzor').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'lickitung').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'solosis').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'vanillite').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'cryogonal').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'rolycoly').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'regirock').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'regice').learnset.selfdestruct = ['8L1'];
		this.modData('Learnsets', 'registeel').learnset.selfdestruct = ['8L1'];
		this.modData("Learnsets", "dusclops").learnset.bodypress = ["8L1"];
		this.modData("Learnsets", "dusclops").learnset.drainpunch = ["8L1"];
		this.modData("Learnsets", "dusclops").learnset.strengthsap = ["8L1"];
		this.modData("Learnsets", "magmortar").learnset.aurasphere = ["8L1"];
		this.modData("Learnsets", "magmortar").learnset.sludgebomb = ["8L1"];
		this.modData("Learnsets", "magmortar").learnset.dragonpulse = ["8L1"];
		this.modData("Learnsets", "magmortar").learnset.vacuumwave = ["8L1"];
		this.modData("Learnsets", "electivire").learnset.knockoff = ["8L1"];
		this.modData("Learnsets", "electivire").learnset.suckerpunch = ["8L1"];
		this.modData("Learnsets", "electivire").learnset.swordsdance = ["8L1"];
		this.modData("Learnsets", "electivire").learnset.closecombat = ["8L1"];
		this.modData("Learnsets", "electivire").learnset.machpunch = ["8L1"];
		this.modData("Learnsets", "electivire").learnset.drainpunch = ["8L1"];
		this.modData("Learnsets", "electivire").learnset.meteormash = ["8L1"];
		this.modData("Learnsets", "sliggoo").learnset.corrosivegas = ["8L1"];
		this.modData("Learnsets", "dodrio").learnset.earthquake = ["8L1"];
		this.modData("Learnsets", "dodrio").learnset.highhorsepower = ["8L1"];
		this.modData("Learnsets", "dodrio").learnset.tripleaxel = ["8L1"];
		this.modData("Learnsets", "cresselia").learnset.haze = ["8L1"];
		this.modData("Learnsets", "cresselia").learnset.defog = ["8L1"];
		this.modData("Learnsets", "beedrill").learnset.mudspike = ["8L1"];
		this.modData('Learnsets', 'vigoroth').learnset.payback = ['8L1'];
		this.modData('Learnsets', 'incineroar').learnset.payback = ['8L1'];
		this.modData('Learnsets', 'grimmsnarl').learnset.payback = ['8L1'];
		this.modData('Learnsets', 'breloom').learnset.payback = ['8L1'];
		this.modData('Learnsets', 'tyrogue').learnset.payback = ['8L1'];
		this.modData('Learnsets', 'tepig').learnset.payback = ['8L1'];
		this.modData('Learnsets', 'munchlax').learnset.payback = ['8L1'];
		this.modData('Learnsets', 'banette').learnset.revenge = ['8L1'];
		this.modData('Learnsets', 'dusclops').learnset.revenge = ['8L1'];
		this.modData('Learnsets', 'vigoroth').learnset.revenge = ['8L1'];
		this.modData('Learnsets', 'breloom').learnset.revenge = ['8L1'];
		this.modData('Learnsets', 'tepig').learnset.revenge = ['8L1'];
		this.modData('Learnsets', 'mimikyu').learnset.revenge = ['8L1'];
		this.modData('Learnsets', 'leafeon').learnset.revenge = ['8L1'];
		this.modData('Learnsets', 'flareon').learnset.revenge = ['8L1'];
		this.modData('Learnsets', 'donphan').learnset.avalanche = ['8L1'];
		this.modData('Learnsets', 'steelix').learnset.avalanche = ['8L1'];
		this.modData('Learnsets', 'gigalith').learnset.avalanche = ['8L1'];
		this.modData('Learnsets', 'forretress').learnset.avalanche = ['8L1'];
		this.modData('Learnsets', 'torterra').learnset.avalanche = ['8L1'];
		this.modData('Learnsets', 'whiscash').learnset.avalanche = ['8L1'];
		this.modData('Learnsets', 'mudsdale').learnset.avalanche = ['8L1'];
		this.modData('Learnsets', 'snorlax').learnset.avalanche = ['8L1'];
		delete this.modData('Learnsets', 'houndoom').learnset.sludgebomb;
		delete this.modData('Learnsets', 'houndour').learnset.sludgebomb;
		this.modData('Learnsets', 'litten').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'zigzagoongalar').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'silvally').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'pancham').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'chatot').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'morpeko').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'persianalola').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'thievul').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'trubbish').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'articunogalar').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'toxtricity').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'muk').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'mukalola').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'weezing').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'crobat').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'toxicroak').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'scrafty').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'simisage').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'salandit').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'yveltal').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'sneasel').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'hoopa').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'zweilous').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'hydreigon').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'krookodile').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'cacturne').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'houndoom').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'zoroark').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'slowkinggalar').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'gastly').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'liepard').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'malamar').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'vullaby').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'zarude').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'zarudedada').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'seviper').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'zangoose').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'gulpin').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'skuntank').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'liepard').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'rattataalola').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'bruxish').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'ariados').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'persian').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'perrserker').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'primeape').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'tauros').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'feraligatr').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'slowbrogalar').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'honchkrow').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'entei').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'mightyena').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'shiftry').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'slaking').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'sharpedo').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'walrein').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'luxray').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'purugly').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'abomasnow').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'mesprit').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'unfezant').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'darmanitan').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'beartic').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'tornadus').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'thundurus').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'tsareena').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'corviknight').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'drapion').learnset.aggravate = ['8L1'];
		this.modData('Learnsets', 'porygon').learnset.technoblast = ['8L1'];
		this.modData('Learnsets', 'klink').learnset.technoblast = ['8L1'];
		this.modData('Learnsets', 'elgyem').learnset.technoblast = ['8L1'];
		this.modData('Learnsets', 'metang').learnset.technoblast = ['8L1'];
		this.modData('Learnsets', 'voltorb').learnset.technoblast = ['8L1'];
		this.modData('Learnsets', 'clauncher').learnset.technoblast = ['8L1'];
		this.modData('Learnsets', 'slowbrogalar').learnset.technoblast = ['8L1'];
		this.modData('Learnsets', 'duraludon').learnset.technoblast = ['8L1'];
		this.modData('Learnsets', 'silvally').learnset.technoblast = ['8L1'];
		this.modData('Learnsets', 'mewtwo').learnset.technoblast = ['8L1'];
		this.modData('Learnsets', 'magearna').learnset.technoblast = ['8L1'];
		this.modData('Learnsets', 'toxtricity').learnset.technoblast = ['8L1'];
		this.modData('Learnsets', 'toxtricitylowkey').learnset.technoblast = ['8L1'];
		this.modData('Learnsets', 'magmortar').learnset.technoblast = ['8L1'];
		delete this.modData('Learnsets', 'scyther').learnset.curse;
		delete this.modData('Learnsets', 'scizor').learnset.curse;
		this.modData('Learnsets', 'scyther').learnset.bulkup = ['8L1'];
		this.modData('Learnsets', 'scizor').learnset.bulkup = ['8L1'];
		this.modData('Learnsets', 'spectrier').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'dhelmise').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'jellicent').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'giratina').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'hoopa').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'marshadow').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'sableye').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'shedinja').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'audino').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'bewear').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'bouffalant').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'braviary').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'claydol').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'crabominable').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'escavalier').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'greedent').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'gumshoos').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'kecleon').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'komala').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'relicanth').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'scrafty').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'watchog').learnset.curse = ['8L1'];
		this.modData('Learnsets', 'toucannon').learnset.curse = ['8L1'];
		this.modData("Learnsets", "eelektross").learnset.poisonjab = ["8L1"];
		this.modData("Learnsets", "eelektross").learnset.gunkshot = ["8L1"];
		this.modData("Learnsets", "eelektross").learnset.surf = ["8L1"];
		this.modData("Learnsets", "eelektross").learnset.sludgebomb = ["8L1"];
		this.modData("Learnsets", "eelektross").learnset.toxicspikes = ["8L1"];
		this.modData("Learnsets", "eelektross").learnset.liquidation = ["8L1"];
		this.modData("Learnsets", "eelektross").learnset.venoshock = ["8L1"];
		this.modData("Learnsets", "eelektross").learnset.icepunch = ["8L1"];
		this.modData("Learnsets", "eelektross").learnset.toxicthread = ["8L1"];
		this.modData("Learnsets", "eelektross").learnset.scald = ["8L1"];
		this.modData("Learnsets", "audino").learnset.moonblast = ["8L1"];
		this.modData("Learnsets", "audino").learnset.counterspell = ["8L1"];
		this.modData("Learnsets", "guzzlord").learnset.glare = ["8L1"];
		this.modData("Learnsets", "guzzlord").learnset.nastyplot = ["8L1"];
		this.modData("Learnsets", "guzzlord").learnset.partingshot = ["8L1"];
		this.modData("Learnsets", "guzzlord").learnset.slackoff = ["8L1"];
		this.modData("Learnsets", "banette").learnset.poltergeist = ["8L1"];
		this.modData("Learnsets", "banette").learnset.metalclaw = ["8L1"];
		this.modData("Learnsets", "banette").learnset.bulletpunch = ["8L1"];
		this.modData("Learnsets", "banette").learnset.ironhead = ["8L1"];
		this.modData("Learnsets", "banette").learnset.smartstrike = ["8L1"];
		this.modData("Learnsets", "banette").learnset.swordsdance = ["8L1"];
		this.modData("Learnsets", "banette").learnset.shiftgear = ["8L1"];
		this.modData("Learnsets", "banette").learnset.irondefense = ["8L1"];
		this.modData("Learnsets", "banette").learnset.superpower = ["8L1"];
		this.modData("Learnsets", "gyarados").learnset.lifedew = ["8L1"];
		this.modData("Learnsets", "gyarados").learnset.pursuit = ["8L1"];
		this.modData("Learnsets", "gyarados").learnset.rapidspin = ["8L1"];
		this.modData("Learnsets", "typenull").learnset.wildcharge = ["8L1"];
		this.modData("Learnsets", "typenull").learnset.superpower = ["8L1"];
		this.modData("Learnsets", "silvally").learnset.wildcharge = ["8L1"];
		this.modData("Learnsets", "silvally").learnset.superpower = ["8L1"];
		this.modData("Learnsets", "silvally").learnset.earthquake = ["8L1"];
		this.modData("Learnsets", "silvally").learnset.blazekick = ["8L1"];
		this.modData("Learnsets", "wormadam").learnset.recover = ["8L1"];
		this.modData("Learnsets", "wormadam").learnset.thunderbolt = ["8L1"];
		this.modData("Learnsets", "wormadam").learnset.earthpower = ["8L1"];
		this.modData("Learnsets", "wormadam").learnset.uturn = ["8L1"];
		this.modData("Learnsets", "wormadamsandy").learnset.recover = ["8L1"];
		this.modData("Learnsets", "wormadamsandy").learnset.spikes = ["8L1"];
		this.modData("Learnsets", "wormadamsandy").learnset.stickyweb = ["8L1"];
		this.modData("Learnsets", "wormadamsandy").learnset.uturn = ["8L1"];
		this.modData("Learnsets", "wormadamtrash").learnset.spikes = ["8L1"];
		this.modData("Learnsets", "wormadamtrash").learnset.thunderbolt = ["8L1"];
		this.modData("Learnsets", "wormadamtrash").learnset.earthpower = ["8L1"];
		this.modData("Learnsets", "wormadamtrash").learnset.uturn = ["8L1"];
		this.modData('Learnsets', 'clauncher').learnset.octazooka = ['8L1'];
		this.modData('Learnsets', 'inteleon').learnset.octazooka = ['8L1'];
		this.modData('Learnsets', 'inkay').learnset.octazooka = ['8L1'];
		this.modData('Learnsets', 'mantine').learnset.octazooka = ['8L1'];
		this.modData('Learnsets', 'inteleon').learnset.signalbeam = ['8L1'];
		this.modData('Learnsets', 'toxtricity').learnset.signalbeam = ['8L1'];
		this.modData('Learnsets', 'dottler').learnset.signalbeam = ['8L1'];
		this.modData('Learnsets', 'hatenna').learnset.signalbeam = ['8L1'];
		this.modData('Learnsets', 'pincurchin').learnset.signalbeam = ['8L1'];
		this.modData('Learnsets', 'boltund').learnset.signalbeam = ['8L1'];
		this.modData('Learnsets', 'ponytagalar').learnset.signalbeam = ['8L1'];
		this.modData('Learnsets', 'slowpokegalar').learnset.signalbeam = ['8L1'];
		this.modData('Learnsets', 'frosmoth').learnset.signalbeam = ['8L1'];
		this.modData('Learnsets', 'raikou').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'jolteon').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'keldeo').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'chinchou').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'beheeyem').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'staryu').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'glaceon').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'empoleon').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'nosepass').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'articuno').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'lugia').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'lapras').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'regice').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'jynx').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'gigalith').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'xurkitree').learnset.aurorabeam = ['8L1'];
		this.modData('Learnsets', 'palossand').learnset.hex = ['8L1'];
		this.modData('Learnsets', 'hatterene').learnset.hex = ['8L1'];
		this.modData('Learnsets', 'delphox').learnset.hex = ['8L1'];
		this.modData('Learnsets', 'seadra').learnset.venoshock = ['8L1'];
		this.modData('Learnsets', 'shiinotic').learnset.venoshock = ['8L1'];
		this.modData('Learnsets', 'umbreon').learnset.venoshock = ['8L1'];
		this.modData('Learnsets', 'sandshrew').learnset.venoshock = ['8L1'];
		this.modData('Learnsets', 'falinks').learnset.attackorder = ['8L1'];
		this.modData('Learnsets', 'honchkrow').learnset.attackorder = ['8L1'];
		this.modData('Learnsets', 'bisharp').learnset.attackorder = ['8L1'];
		this.modData('Learnsets', 'cramorant').learnset.attackorder = ['8L1'];
		delete this.modData('Learnsets', 'gastly').learnset.curse;
		delete this.modData('Learnsets', 'haunter').learnset.curse;
		delete this.modData('Learnsets', 'gengar').learnset.curse;
		delete this.modData('Learnsets', 'dreepy').learnset.curse;
		delete this.modData('Learnsets', 'drakloak').learnset.curse;
		delete this.modData('Learnsets', 'dragapult').learnset.curse;
		delete this.modData('Learnsets', 'misdreavus').learnset.curse;
		delete this.modData('Learnsets', 'mismagius').learnset.curse;
		delete this.modData('Learnsets', 'pumpkaboo').learnset.curse;
		delete this.modData('Learnsets', 'gourgeist').learnset.curse;
		delete this.modData('Learnsets', 'litwick').learnset.curse;
		delete this.modData('Learnsets', 'lampent').learnset.curse;
		delete this.modData('Learnsets', 'chandelure').learnset.curse;
		delete this.modData('Learnsets', 'mimikyu').learnset.curse;
		delete this.modData('Learnsets', 'decidueye').learnset.curse;
		delete this.modData('Learnsets', 'dartrix').learnset.curse;
		delete this.modData('Learnsets', 'rowlet').learnset.curse;
		this.modData("Learnsets", "keldeo").learnset.vacuumwave = ["8L1"];
		this.modData("Learnsets", "keldeo").learnset.highjumpkick = ["8L1"];
		this.modData("Learnsets", "keldeo").learnset.bulkup = ["8L1"];
		this.modData("Learnsets", "keldeo").learnset.aurasphere = ["8L1"];
		this.modData("Learnsets", "keldeo").learnset.brine = ["8L1"];
		this.modData("Learnsets", "keldeo").learnset.aquaring = ["8L1"];
		// this.modData("Learnsets", "keldeo").learnset.lifedew = ["8L1"];
		this.modData("Learnsets", "keldeo").learnset.signalbeam = ["8L1"];
		this.modData("Learnsets", "cobalion").learnset.vacuumwave = ["8L1"];
		this.modData("Learnsets", "cobalion").learnset.highjumpkick = ["8L1"];
		this.modData("Learnsets", "cobalion").learnset.bulkup = ["8L1"];
		this.modData("Learnsets", "cobalion").learnset.aurasphere = ["8L1"];
		this.modData("Learnsets", "cobalion").learnset.kingsshield = ["8L1"];
		this.modData("Learnsets", "cobalion").learnset.doomdesire = ["8L1"];
		this.modData("Learnsets", "cobalion").learnset.bodypress = ["8L1"];
		this.modData("Learnsets", "cobalion").learnset.reconstruct = ["8L1"];
		this.modData("Learnsets", "terrakion").learnset.vacuumwave = ["8L1"];
		this.modData("Learnsets", "terrakion").learnset.highjumpkick = ["8L1"];
		this.modData("Learnsets", "terrakion").learnset.bulkup = ["8L1"];
		this.modData("Learnsets", "terrakion").learnset.aurasphere = ["8L1"];
		this.modData("Learnsets", "terrakion").learnset.accelerock = ["8L1"];
		this.modData("Learnsets", "terrakion").learnset.spikes = ["8L1"];
		this.modData("Learnsets", "virizion").learnset.vacuumwave = ["8L1"];
		this.modData("Learnsets", "virizion").learnset.highjumpkick = ["8L1"];
		this.modData("Learnsets", "virizion").learnset.bulkup = ["8L1"];
		this.modData("Learnsets", "virizion").learnset.aurasphere = ["8L1"];
		this.modData("Learnsets", "virizion").learnset.hornleech = ["8L1"];
		this.modData("Learnsets", "virizion").learnset.powerwhip = ["8L1"];
		this.modData("Learnsets", "virizion").learnset.spikyshield = ["8L1"];
		this.modData("Learnsets", "virizion").learnset.sleeppowder = ["8L1"];
		this.modData("Learnsets", "virizion").learnset.rashpowder = ["8L1"];
		this.modData("Learnsets", "vaporeon").learnset.meltingpoint = ["8L1"];
		this.modData("Learnsets", "vaporeon").learnset.lifedew = ["8L1"];
		this.modData("Learnsets", "vaporeon").learnset.teleport = ["8L1"];
		this.modData("Learnsets", "vaporeon").learnset.bouncybubble = ["8L1"];
		this.modData("Learnsets", "jolteon").learnset.lightinglance = ["8L1"];
		this.modData("Learnsets", "jolteon").learnset.spikes = ["8L1"];
		this.modData("Learnsets", "jolteon").learnset.teleport = ["8L1"];
		this.modData("Learnsets", "jolteon").learnset.buzzybuzz = ["8L1"];
		this.modData("Learnsets", "flareon").learnset.firelash = ["8L1"];
		this.modData("Learnsets", "flareon").learnset.morningsun = ["8L1"];
		this.modData("Learnsets", "flareon").learnset.teleport = ["8L1"];
		this.modData("Learnsets", "flareon").learnset.sizzlyslide = ["8L1"];
		this.modData("Learnsets", "espeon").learnset.focusblast = ["8L1"];
		this.modData("Learnsets", "espeon").learnset.meteorbeam = ["8L1"];
		this.modData("Learnsets", "espeon").learnset.teleport = ["8L1"];
		this.modData("Learnsets", "espeon").learnset.glitzyglow = ["8L1"];
		this.modData("Learnsets", "umbreon").learnset.aggravate = ["8L1"];
		this.modData("Learnsets", "umbreon").learnset.toxicspikes = ["8L1"];
		this.modData("Learnsets", "umbreon").learnset.teleport = ["8L1"];
		this.modData("Learnsets", "umbreon").learnset.baddybad = ["8L1"];
		this.modData("Learnsets", "glaceon").learnset.dazzlinggleam = ["8L1"];
		this.modData("Learnsets", "glaceon").learnset.calmmind = ["8L1"];
		this.modData("Learnsets", "glaceon").learnset.teleport = ["8L1"];
		this.modData("Learnsets", "glaceon").learnset.freezyfrost = ["8L1"];
		this.modData("Learnsets", "leafeon").learnset.mudspike = ["8L1"];
		this.modData("Learnsets", "leafeon").learnset.strengthsap = ["8L1"];
		this.modData("Learnsets", "leafeon").learnset.teleport = ["8L1"];
		this.modData("Learnsets", "leafeon").learnset.sappyseed = ["8L1"];
		this.modData("Learnsets", "sylveon").learnset.moonlight = ["8L1"];
		this.modData("Learnsets", "sylveon").learnset.lovelykiss = ["8L1"];
		this.modData("Learnsets", "sylveon").learnset.teleport = ["8L1"];
		this.modData("Learnsets", "sylveon").learnset.sparklyswirl = ["8L1"];
		this.modData("Learnsets", "skuntank").learnset.knockoff = ["8L1"];
		this.modData("Learnsets", "skuntank").learnset.willowisp = ["8L1"];
		this.modData("Learnsets", "skuntank").learnset.thunderwave = ["8L1"];
		this.modData("Learnsets", "skuntank").learnset.swordsdance = ["8L1"];
		this.modData("Learnsets", "skuntank").learnset.gunkshot = ["8L1"];
		this.modData("Learnsets", "skuntank").learnset.blazekick = ["8L1"];
		this.modData("Learnsets", "skuntank").learnset.aromatherapy = ["8L1"];
		this.modData("Learnsets", "skuntank").learnset.bulkup = ["8L1"];
		this.modData("Learnsets", "skuntank").learnset.superpower = ["8L1"];
		this.modData("Learnsets", "skuntank").learnset.partingshot = ["8L1"];
		this.modData("Learnsets", "skuntank").learnset.strengthsap = ["8L1"];
		this.modData('Learnsets', 'alcremie').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'alomomola').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'altaria').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'ambipom').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'audino').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'azumarill').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'bewear').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'chansey').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'cinccino').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'clefable').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'diggersby').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'dubwool').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'electivire').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'florges').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'garbodor').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'gardevoir').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'gastrodon').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'goodra').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'granbull').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'grapploct').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'greedent').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'grimmsnarl').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'guzzlord').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'hariyama').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'hatterene').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'hawlucha').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'honchkrow').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'incineroar').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'kangaskhan').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'lopunny').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'mantine').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'miltank').learnset.smother = ['8L1'];
		// this.modData('Learnsets', 'mimikyu').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'muk').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'mukalola').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'nidoqueen').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'regigigas').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'sandaconda').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'seviper').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'slaking').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'slurpuff').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'snorlax').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'swalot').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'tangrowth').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'throh').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'togekiss').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'wailord').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'wigglytuff').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'zygarde').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'milotic').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'purugly').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'jellicent').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'dragonite').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'arbok').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'lickilicky').learnset.smother = ['8L1'];
		this.modData('Learnsets', 'salazzle').learnset.fierydance = ['8L1'];
		this.modData('Learnsets', 'torchic').learnset.fierydance = ['8L1'];
		this.modData('Learnsets', 'victini').learnset.fierydance = ['8L1'];
		this.modData('Learnsets', 'pansear').learnset.fierydance = ['8L1'];
		this.modData('Learnsets', 'darumaka').learnset.fierydance = ['8L1'];
		this.modData('Learnsets', 'braixen').learnset.fierydance = ['8L1'];
		this.modData('Learnsets', 'spinda').learnset.fierydance = ['8L1'];
		this.modData('Learnsets', 'flareon').learnset.fierydance = ['8L1'];
		this.modData('Learnsets', 'marowakalola').learnset.fierydance = ['8L1'];
		this.modData('Learnsets', 'cherrim').learnset.fierydance = ['8L1'];
		this.modData('Learnsets', 'bellossom').learnset.fierydance = ['8L1'];
		this.modData('Learnsets', 'solgaleo').learnset.fierydance = ['8L1'];
		this.modData('Learnsets', 'meloetta').learnset.fierydance = ['8L1'];
		this.modData('Learnsets', 'crabominable').learnset.shadowpunch = ['8L1'];
		this.modData('Learnsets', 'pangoro').learnset.shadowpunch = ['8L1'];
		this.modData('Learnsets', 'hoopa').learnset.shadowpunch = ['8L1'];
		this.modData('Learnsets', 'mimikyu').learnset.shadowpunch = ['8L1'];
		this.modData('Learnsets', 'hitmonchan').learnset.shadowpunch = ['8L1'];
		this.modData('Learnsets', 'medicham').learnset.shadowpunch = ['8L1'];
		this.modData('Learnsets', 'toxicroak').learnset.shadowpunch = ['8L1'];
		this.modData('Learnsets', 'snover').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'mrmimegalar').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'smoochum').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'darumakagalar').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'snorunt').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'frosmoth').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'spinda').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'glaceon').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'lotad').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'cryogonal').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'crabominable').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'castform').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'brionne').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'meloetta').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'oricorio').learnset.snowmanjazz = ['8L1'];
		this.modData('Learnsets', 'impidimp').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'nuzleaf').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'spinda').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'zorua').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'sneasel').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'morelull').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'oddish').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'umbreon').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'teddiursa').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'clefairy').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'cresselia').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'darkrai').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'lunala').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'lunatone').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'meloetta').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'primarina').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'cacnea').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'dustox').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'frosmoth').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'volbeat').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'illumise').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'venomoth').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'oricorio').learnset.moonlitwaltz = ['8L1'];
		this.modData('Learnsets', 'pansage').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'lotad').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'spinda').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'leafeon').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'psyduck').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'pichu').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'igglybuff').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'cleffa').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'smoochum').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'mimejr').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'meloetta').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'kirlia').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'shaymin').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'steenee').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'hoppip').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'oricorio').learnset.petaldance = ['8L1'];
		this.modData('Learnsets', 'swablu').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'chatot').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'oricorio').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'delibird').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'spinda').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'ducklett').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'meloetta').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'pidove').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'pidgey').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'pikipek').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'beautifly').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'vivillon').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'butterfree').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'masquerain').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'mothim').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'swoobat').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'togekiss').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'shaymin').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'vespiquen').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'ledian').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'woobat').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'castform').learnset.skysoiree = ['8L1'];
		this.modData('Learnsets', 'hoppip').learnset.skysoiree = ['8L1'];
		this.modData("Learnsets", "gourgeist").learnset.disarmingvoice = ["8L1"];
		delete this.modData('Learnsets', 'gourgeist').learnset.moonblast;
	},
};
