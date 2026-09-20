export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	coldgaze: {
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Cold Gaze', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ spe: -1 }, target, pokemon, null, true);
				}
			}
		},
		flags: {},
		name: "Cold Gaze",
		shortDesc: "Upon entering the field, this Pokemon lowers the Speed of all opponents by one stage.",
	},
	demoralize: {
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Demoralize', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ spa: -1 }, target, pokemon, null, true);
				}
			}
		},
		flags: {},
		name: "Demoralize",
		shortDesc: "Upon entering the field, this Pokemon lowers the Special Attack of all opponents by one stage.",
	},
	savageroar: {
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-anim', pokemon, "Snarl", target);
					this.add('-ability', pokemon, 'Savage Roar', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ atk: -1 }, target, pokemon, null, true);
				}
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (['Intimidate', 'Savage Roar'].includes(effect.name) && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Savage Roar', `[of] ${target}`);
			}
		},

		flags: { breakable: 1 },
		name: "Savage Roar",
		shortDesc: "Intimidate effect, user can't be Intimidated.",
	},
	constrictingdarkness: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Constricting Darkness');
			this.add('-message', 'Darkness constricts you... Special Attack reduced!');
		},
		onAnyModifySpA(spa, source, target, move) {
			const abilityHolder = this.effectState.target;
			if (source.hasAbility('Constricting Darkness')) return;
			if (!move.ruinedSpA) move.ruinedSpA = abilityHolder;
			if (move.ruinedSpA !== abilityHolder) return;
			this.debug('Constricting Darkness Debuff');
			return this.chainModify(0.75);
		},

		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Dark') {
				return this.chainModify([5325, 4096]);
			}
		},

		flags: {},
		name: "Constricting Darkness",
		shortDesc: "Pokemon without this ability have 0.75x Sp. Attack. User's Dark-type attacks: 1.3x Power.",
	},
	yourtakingtoolong: {
		onStart(pokemon) {
			this.add('-start', pokemon, 'ability: YOUR TAKING TOO LONG');
			this.effectState.counter = 5;
		},
		onResidualOrder: 12,
		onResidual(pokemon, target) {
			if (pokemon.activeTurns) {
				this.effectState.counter--;

				if (this.effectState.counter <= 0) {
					this.add('-message', "YOUR TAKING TOO LONG!");
					for (pokemon of this.getAllActive()) {
						if (pokemon.fainted) continue;
						this.damage(pokemon.baseMaxhp / 4, pokemon, target);
					}
				}
			}
		},
		onEnd(pokemon) {
			if (pokemon.beingCalledBack) return;
			this.add('-end', pokemon, 'YOUR TAKING TOO LONG', '[silent]');
		},

		flags: {},
		name: "YOUR TAKING TOO LONG",
		shortDesc: "After 5 turns, all Pokemon lose 25% of their HP per turn until user switches.",
	},

	// copied from Berserk
	fury: {
		onDamage(damage, target, source, effect) {
			this.effectState.checkedBerserk = !(
				effect.effectType === "Move" && !effect.multihit &&
				!(effect.hasSheerForce && source.hasAbility('sheerforce'))
			);
		},
		onTryEatItem(item) {
			const healingItems = [
				'aguavberry', 'enigmaberry', 'figyberry', 'iapapaberry', 'magoberry', 'sitrusberry', 'wikiberry', 'oranberry', 'berryjuice',
			];
			if (healingItems.includes(item.id)) {
				return this.effectState.checkedBerserk;
			}
			return true;
		},
		onAfterMoveSecondary(target, source, move) {
			this.effectState.checkedBerserk = true;
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			const lastAttackedBy = target.getLastAttackedBy();
			if (!lastAttackedBy) return;
			const damage = move.multihit && !move.smartTarget ? move.totalDamage : lastAttackedBy.damage;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				this.boost({ atk: 1 }, target, target);
			}
		},
		flags: {},
		name: "Fury",
		shortDesc: "This Pokemon's Attack is raised by 1 stage when it drops to 1/2 HP or less.",
	},
	dogmarriagedogamy: {
		onModifyDefPriority: 5,
		onModifyDef(def, pokemon) {
			for (const ally of pokemon.allies()) {
				if (ally.baseSpecies.name === 'Dogaressa') {
					return this.chainModify(1.5);
				}
			}
		},
		onModifySpDPriority: 5,
		onModifySpD(spd, pokemon) {
			for (const ally of pokemon.allies()) {
				if (ally.baseSpecies.name === 'Dogaressa') {
					return this.chainModify(1.5);
				}
			}
		},

		flags: {},
		name: "Dog Marriage (Dogamy)",
		shortDesc: "If this Pokemon's ally is Dogaressa, this Pokemon gains 1.5x Defense and Special Defense.",
	},
	dogmarriagedogaressa: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			for (const ally of pokemon.allies()) {
				if (ally.baseSpecies.name === 'Dogamy') {
					return this.chainModify(1.5);
				}
			}
		},
		onModifySpePriority: 5,
		onModifySpe(spe, pokemon) {
			for (const ally of pokemon.allies()) {
				if (ally.baseSpecies.name === 'Dogamy') {
					return this.chainModify(1.5);
				}
			}
		},

		flags: {},
		name: "Dog Marriage (Dogaressa)",
		shortDesc: "If this Pokemon's ally is Dogamy, this Pokemon gains 1.5x Attack and Speed.",
	},
	undyingspirit: {
		onUpdate(pokemon) {
			if (pokemon.m.undyingRecover) return;
			if (pokemon.hp <= pokemon.maxhp / 4 && !pokemon.fainted && !pokemon.volatiles['healblock']) {
				this.heal(pokemon.baseMaxhp / 2);
				pokemon.m.undyingRecover = true;
			}
		},

		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Undying Spirit",
		shortDesc: "Once per battle, if this Pokemon drops to 1/4 HP or less, restore 1/2 of its HP.",
	},
	pyromancy: {
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fire') {
				this.debug('Pyromancy damage reduction');
				return this.chainModify(0.5);
			}
		},
		onTryHit(target, source, move) {
			if (move.type === 'Fire') {
				if (!target.m.pyroBoost) target.m.pyroBoost = 0;
				if (target.m.pyroBoost >= 2) return;
				this.add('-activate', target, 'ability: Pyromancy');
				this.add('-anim', target, "Burning Bulwark", target);
				this.add('-message', `The power of ${target.name}'s Fire-Type moves increased!`);
				target.m.pyroBoost++;
			}
		},
		onBasePower(basePower, target, pokemon, move) {
			if (move.type === 'Fire' && move.category !== 'Status') {
				const fireBoost = (target.m.pyroBoost || 0) * 10;
				this.debug('Pyromancy boost');
				return basePower + fireBoost;
			}
		},

		flags: { breakable: 1 },
		name: "Pyromancy",
		shortDesc: "Enemy Fire moves: 50% dmg. Hit by Fire move: Fire moves get permanent +10 BP (max 2).",
	},
	makeththerules: {
		onSwitchIn(pokemon) {
			this.add('-ability', pokemon, 'Maketh the Rules');
			this.add('-message', `${pokemon.name} is bending the rules! Type matchups are inversed!`);
		},
		onAnyModifyMove(move) {
			move.ignoreImmunity = true;
		},
		onAnyEffectiveness(typeMod, target, type, move) {
			if (move?.id === 'freezedry' && type === 'Water') return;
			if (move && !this.dex.getImmunity(move, type)) return 1;
			return typeMod * -1;
		},

		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Maketh the Rules",
		shortDesc: "Allst Pokemon Type matchups art Inversed whilst this Pokemon is on the Fielde.",
	},
	souldrain: {
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Soul Drain');
					activated = true;
					this.add('-message', `${pokemon.name} drained the PP of the opponent's last used move!`);
				}
				let move: Move | ActiveMove | null = target.lastMove;
				if (!move || move.isZ) return false;
				if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);

				const ppDeducted = target.deductPP(move.id, 2);
				if (!ppDeducted) return false;
			}
		},

		flags: {},
		name: "Soul Drain",
		shortDesc: "Upon entering the field, this Pokemon drains 2 PP of opponent's last move.",
	},
	// copied from Purifying Salt and Clear Body
	temouttatem: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
				this.add("-fail", target, "unboost", "[from] ability: Tem Outta Tem", `[of] ${target}`);
			}
		},
		onSetStatus(status, target, source, effect) {
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Tem Outta Tem');
			}
			return false;
		},
		onTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.add('-immune', target, '[from] ability: Tem Outta Tem');
				return null;
			}
		},

		flags: {},
		name: "Tem Outta Tem",
		shortDesc: "Immunity to stat drops from other Pokemon and all non-volatile status conditions.",
	},
	amalgamation: {
		onStart(pokemon) {
			pokemon.addVolatile('amalgamation');
		},
		condition: {
			noCopy: true,
			onStart(target) {
				this.add('-start', target, 'ability: Amalgamation');
			},
			onAnyFaint(target) {
				if (!this.effectState.target.hp) return;
				const ability = target.getAbility();
				if (ability.flags['noreceiver'] || ability.flags['notrace'] || ability.id === 'noability') return;
				if (this.effectState.target.setAbility(ability)) {
					this.add('-ability', this.effectState.target, ability,
						'[from] ability: Amalgamation', `[of] ${target}`);
				};
			},
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Amalgamation",
		shortDesc: "Gain the Amalgamation effect: Copy the ability of the last Pokemon to faint in battle.",
	},
	// copied from Quark Drive
	blossomboost: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon);
		},
		onTerrainChange(pokemon) {
			if (this.field.isTerrain('grassyterrain')) {
				pokemon.addVolatile('blossomboost');
			} else if (!pokemon.volatiles['blossomboost']?.fromBooster) {
				pokemon.removeVolatile('blossomboost');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['blossomboost'];
			this.add('-end', pokemon, 'Blossom Boost', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Blossom Boost', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Blossom Boost');
				}
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'blossomboost' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility()) return;
				this.debug('Blossom Boost atk boost');
				return this.chainModify([5325, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility()) return;
				this.debug('Blossom Boost def boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility()) return;
				this.debug('Blossom Boost spa boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility()) return;
				this.debug('Blossom Boost spd boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility()) return;
				this.debug('Blossom Boost spe boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Blossom Boost');
			},
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Blossom Boost",
		shortDesc: "Highest stat multiplied by 1.3x (1.5x if Speed) in Grassy Terrain or using Booster Energy.",
	},
	sharpshooter: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['bullet']) {
				this.debug('Sharpshooter boost');
				return this.chainModify(1.5);
			}
		},
		onModifyMove(move) {
			if (move.flags['bullet']) move.tracksTarget = true;
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Sharpshooter",
		shortDesc: "Bullet moves: 1.5x dmg, cannot be redirected. Pollen Puff heals 3/4.",
	},
	// Many Seths were harmed in the making of this ability.
	tacticaldodge: {
		// The original code for this move was so much more convoluted than it ever needed to be, this should be a more elegant answer.
		onInvulnerability(pokemon, target, move) {
			if (pokemon.m.dodged) return;
			if (pokemon.runEffectiveness(move) > 0 && move.category !== 'Status') {
				this.add('-anim', pokemon, "Nasty Plot", target);
				this.add('-activate', pokemon, 'ability: Tactical Dodge');
				pokemon.m.dodged = true;
				return false;
			}
		},
		flags: { breakable: 1, failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Tactical Dodge",
		shortDesc: "Once per battle, dodge a super-effective attack.",
	},
	lovingdances: {
		onTryMove(attacker, pokemon, move) {
			if (move.flags['dance'] && this.randomChance(1, 2)) {
				for (const ally of attacker.alliesAndSelf()) {
					if (ally.status) {
						this.add('-activate', attacker, 'ability: Loving Dances');
						ally.cureStatus();
					}
				}
			}
		},

		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Loving Dances",
		shortDesc: "Dance moves have a 50% chance to cure this Pokemon and its ally's status conditions.",
	},
	fastfood: {
		onStart(pokemon) {
			if (!pokemon.m.foodCount) pokemon.m.foodCount = 0;
			if (pokemon.m.foodCount >= 2) return;
			this.add('-activate', pokemon, 'ability: Fast Food');
			this.add('-message', `${pokemon.name} whipped up some Fast Food!`);

			for (const ally of pokemon.alliesAndSelf()) {
				this.heal(ally.baseMaxhp * 0.15, ally, pokemon);
				ally.ateBerry = true;
			}
			this.boost({ spe: 1 }, pokemon);
			pokemon.m.foodCount++;
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Fast Food",
		shortDesc: "Twice per battle, user + ally heal 15% max HP. Counts as eating a berry. User's Speed +1.",
	},
	swordplay: {
		onModifyMove(move) {
			if (move.flags['slicing']) {
				delete move.flags['protect'];
				(move as any).pierce = true;
			}
		},

		onModifyDamage(damage, source, target, move) {
			if ((move as any).pierce && move.flags?.slicing && target.volatiles['protect']) {
				this.debug('Swordplay Bypass');
				return this.chainModify(0.25);
			}
		},
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['slicing']) {
				this.debug('Swordplay boost');
				return this.chainModify([5325, 4096]);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Swordplay",
		shortDesc: "This Pokemon's slicing moves do 1.3x their normal damage and partially bypass Protect.",
	},
	fullbelly: {
		onModifyAtkPriority: 5,
		onUpdate(pokemon) {
			if (pokemon.ateBerry) {
				if (!pokemon.m.berryMessage) {
					this.add('-message', `${pokemon.name} has acquired all yummies!`);
					pokemon.m.berryMessage = true;
				}
			}
		},
		onModifyAtk(atk, pokemon) {
			if (pokemon.ateBerry) {
				this.debug('Full Belly Active');
				return this.chainModify(1.5);
			} else {
				this.debug('Full Belly Inactive');
				return this.chainModify(0.7);
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Full Belly",
		shortDesc: "0.7x Attack if no berry eaten, 1.5x Attack if berry has been eaten.",
	},
	reverberate: {
		// Copied from Parental Bond
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.multihit || move.flags['noparentalbond'] || move.flags['charge'] ||
				move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax || !move.flags['sound']) return;
			move.multihit = 2;
			// @ts-expect-error custom
			move.multihitType = 'reverberate';
		},

		onSourceModifySecondaries(secondaries, target, source, move) {
			// @ts-expect-error custom
			if (move.multihitType === 'reverberate' && move.id === 'secretpower' && move.hit < 2)
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
		},
		// Modifier located in scripts with parental bond.
		flags: {},
		name: "Reverberate",
		shortDesc: "Single target: Sound moves hit twice. The second hit does 50% of its normal damage.",
	},
	ghostlygroove: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			if (move.flags['sound']) {
				move.type = 'Ghost';
			}
		},

		onBasePowerPriority: 7,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound']) {
				this.debug('Ghostly Groove boost');
				return this.chainModify(1.1);
			}
		},
		flags: {},
		name: "Ghostly Groove",
		shortDesc: "This Pokemon's sound-based moves become Ghost-Type and have 1.1x Power.",
	},
	antivirus: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Bug') {
				if (!this.boost({ atk: 1 })) {
					this.add('-immune', target, '[from] ability: Antivirus');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
		name: "Antivirus",
		shortDesc: "This Pokemon is immune to Bug-Type moves. Getting hit by a Bug-Type move boosts its Attack by 1 stage.",
	},
	splitpersonality: {
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.species.baseSpecies !== 'Pink') return;
			const targetForme = pokemon.species.name === 'Pink' ? 'Pink-Ghost' : 'Pink';
			pokemon.formeChange(targetForme);
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Split Personality",
		shortDesc: "Pink: Switch between Corporeal Forme and Ghost Forme each turn.",
	},
	stellarguard: {
		onSourceModifyDamage(damage, source, target, move) {
			this.debug('Stellar Guard reduction');
			return this.chainModify(0.9);
		},
		flags: { breakable: 1 },
		name: "Stellar Guard",
		shortDesc: "This Pokemon takes 0.9x damage from all attacks.",
	},
	darkspawn: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Dark') {
				this.heal(target.baseMaxhp / 4, target, target);
				if (!this.boost({ atk: 1 })) {
					this.add('-immune', target, '[from] ability: Darkspawn');
				}
				return null;
			}
		},
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['bite']) {
				return this.chainModify(1.5);
			}
		},
		flags: { breakable: 1, failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Darkspawn",
		shortDesc: "Immune to and heal 25% from Dark moves. Bite Moves: 1.5x Power.",
	},
	normalability: {
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Normal') {
				return this.chainModify(1.2);
			}
		},
		onResidualOrder: 13,
		onResidual(pokemon) {
			for (const target of pokemon.adjacentFoes()) {
				if (target.baseSpecies.name !== 'Onionsan' || target.volatiles['substitute'] || target.isSemiInvulnerable()) return;
				if (this.randomChance(2, 10)) {
					this.add('-message', `${pokemon.name} bludgeoned ${target.name}!`);
					this.add('-anim', pokemon, "Close Combat", target);
					target.faint();
					this.add('-message', `${target.name} was turned into takoyaki!`);
					this.heal(pokemon.baseMaxhp);
					this.add('-message', `${pokemon.name} ate the takoyaki and fully restored its health!`);
				}
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Normal Ability",
		shortDesc: "A normal ability. Does Normal things.",
	},

	// Vanilla abilities edited to interact with Savage Roar
	guarddog: {
		inherit: true,
		onTryBoostPriority: 2,
		onTryBoost(boost, target, source, effect) {
			if (['Intimidate', 'Savage Roar'].includes(effect.name) && boost.atk) {
				delete boost.atk;
				this.boost({ atk: 1 }, target, target, null, false, true);
			}
		},
	},
	scrappy: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (['Intimidate', 'Savage Roar'].includes(effect.name) && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Scrappy', `[of] ${target}`);
			}
		},
	},
	rattled: {
		inherit: true,
		onAfterBoost(boost, target, source, effect) {
			if (['Intimidate', 'Savage Roar'].includes(effect.name) && boost.atk) {
				this.boost({ spe: 1 });
			}
		},
	},
	owntempo: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (['Intimidate', 'Savage Roar'].includes(effect.name) && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Own Tempo', `[of] ${target}`);
			}
		},
	},
	oblivious: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (['Intimidate', 'Savage Roar'].includes(effect.name) && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Oblivious', `[of] ${target}`);
			}
		},
	},
	innerfocus: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (['Intimidate', 'Savage Roar'].includes(effect.name) && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Inner Focus', `[of] ${target}`);
			}
		},
	},
};
