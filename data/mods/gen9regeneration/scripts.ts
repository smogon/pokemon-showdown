export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	actions: {
		modifyDamage(
			baseDamage: number, pokemon: Pokemon, target: Pokemon, move: ActiveMove, suppressMessages = false
		) {
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

			if (
				pokemon.status === 'brn' && move.category === 'Physical' &&
				!pokemon.hasAbility('guts') && !pokemon.hasAbility('tropicalcurrent')
			) {
				if (this.battle.gen < 6 || move.id !== 'facade') {
					baseDamage = this.battle.modify(baseDamage, 0.5);
				}
			}

			// Generation 5, but nothing later, sets damage to 1 before the final damage modifiers
			if (this.battle.gen === 5 && !baseDamage) baseDamage = 1;

			// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
			baseDamage = this.battle.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

			if (move.isZOrMaxPowered && target.getMoveHitData(move).brokeProtect) {
				baseDamage = this.battle.modify(baseDamage, 0.25);
				this.battle.add('-zbroken', target);
			}

			// Generation 6-7 moves the check for minimum 1 damage after the final modifier...
			if (this.battle.gen !== 5 && !baseDamage) return 1;

			// ...but 16-bit truncation happens even later, and can truncate to 0
			return tr(baseDamage, 16);
		},
	},
	init() {
		this.modData("Learnsets", "alakazam").learnset.brainwave = ["9L1"];
		this.modData("Learnsets", "gengar").learnset.avalanche = ["9L1"];
		this.modData("Learnsets", "gengar").learnset.blizzard = ["9L1"];
		this.modData("Learnsets", "gengar").learnset.focusenergy = ["9L1"];
		this.modData("Learnsets", "gengar").learnset.frostbreath = ["9L1"];
		this.modData("Learnsets", "gengar").learnset.icebeam = ["9L1"];
		this.modData("Learnsets", "gengar").learnset.iceshard = ["9L1"];
		this.modData("Learnsets", "gengar").learnset.powdersnow = ["9L1"];
		this.modData("Learnsets", "gengar").learnset.snowscape = ["9L1"];
		this.modData("Learnsets", "gengar").learnset.illwind = ["9L1"];
		this.modData("Learnsets", "dragonite").learnset.barrier = ["9L1"];
		this.modData("Learnsets", "dragonite").learnset.guardiandive = ["9L1"];
		this.modData("Learnsets", "dragonite").learnset.uturn = ["9L1"];
		this.modData("Learnsets", "venusaur").learnset.aromaticmist = ["9L1"];
		this.modData("Learnsets", "venusaur").learnset.calmmind = ["9L1"];
		this.modData("Learnsets", "venusaur").learnset.dazzlinggleam = ["9L1"];
		this.modData("Learnsets", "venusaur").learnset.drainingkiss = ["9L1"];
		this.modData("Learnsets", "venusaur").learnset.fairywind = ["9L1"];
		this.modData("Learnsets", "venusaur").learnset.floralhealing = ["9L1"];
		this.modData("Learnsets", "venusaur").learnset.flowershield = ["9L1"];
		this.modData("Learnsets", "venusaur").learnset.healpulse = ["9L1"];
		this.modData("Learnsets", "venusaur").learnset.playrough = ["9L1"];
		this.modData("Learnsets", "venusaur").learnset.psychic = ["9L1"];
		this.modData("Learnsets", "venusaur").learnset.vitalenergy = ["9L1"];
		this.modData("Learnsets", "venusaur").learnset.zenheadbutt = ["9L1"];
		this.modData("Learnsets", "charizard").learnset.ceaselessedge = ["9L1"];
		this.modData("Learnsets", "charizard").learnset.throatchop = ["9L1"];
		this.modData("Learnsets", "charizard").learnset.smokytorment = ["9L1"];
		this.modData("Learnsets", "charizard").learnset.suckerpunch = ["9L1"];
		this.modData("Learnsets", "blastoise").learnset.chargebeam = ["9L1"];
		this.modData("Learnsets", "blastoise").learnset.charge = ["9L1"];
		this.modData("Learnsets", "blastoise").learnset.iondeluge = ["9L1"];
		this.modData("Learnsets", "blastoise").learnset.powerwash = ["9L1"];
		this.modData("Learnsets", "blastoise").learnset.thunder = ["9L1"];
		this.modData("Learnsets", "blastoise").learnset.thunderwave = ["9L1"];
		this.modData("Learnsets", "blastoise").learnset.thunderbolt = ["9L1"];
		this.modData("Learnsets", "blastoise").learnset.thundershock = ["9L1"];
		this.modData("Learnsets", "blastoise").learnset.voltswitch = ["9L1"];
		this.modData("Learnsets", "blastoise").learnset.zapcannon = ["9L1"];
		this.modData("Learnsets", "beedrill").learnset.closecombat = ["9L1"];
		this.modData("Learnsets", "beedrill").learnset.flail = ["9L1"];
		this.modData("Learnsets", "beedrill").learnset.reversal = ["9L1"];
		this.modData("Learnsets", "beedrill").learnset.spikes = ["9L1"];
		this.modData("Learnsets", "beedrill").learnset.stickyweb = ["9L1"];
		this.modData("Learnsets", "beedrill").learnset.taunt = ["9L1"];
		this.modData("Learnsets", "beedrill").learnset.terablast = ["9L1"];
		this.modData("Learnsets", "pidgeot").learnset.acrobatics = ["9L1"];
		this.modData("Learnsets", "pidgeot").learnset.closecombat = ["9L1"];
		this.modData("Learnsets", "wigglytuff").learnset.crunch = ["9L1"];
		this.modData("Learnsets", "wigglytuff").learnset.darkpulse = ["9L1"];
		this.modData("Learnsets", "wigglytuff").learnset.rapidspin = ["9L1"];
		this.modData("Learnsets", "wigglytuff").learnset.taunt = ["9L1"];
		this.modData("Learnsets", "wigglytuff").learnset.uturn = ["9L1"];
		this.modData("Learnsets", "dodrio").learnset.brickbreak = ["9L1"];
		this.modData("Learnsets", "dodrio").learnset.bulldoze = ["9L1"];
		this.modData("Learnsets", "dodrio").learnset.dig = ["9L1"];
		this.modData("Learnsets", "dodrio").learnset.drillrun = ["9L1"];
		this.modData("Learnsets", "dodrio").learnset.earthquake = ["9L1"];
		this.modData("Learnsets", "dodrio").learnset.highjumpkick = ["9L1"];
		this.modData("Learnsets", "dodrio").learnset.lowkick = ["9L1"];
		this.modData("Learnsets", "dodrio").learnset.quickguard = ["9L1"];
		this.modData("Learnsets", "dodrio").learnset.rototiller = ["9L1"];
		this.modData("Learnsets", "dodrio").learnset.sandattack = ["9L1"];
		this.modData("Learnsets", "dodrio").learnset.triplekick = ["9L1"];
		this.modData("Learnsets", "seadra").learnset.acidspray = ["9L1"];
		this.modData("Learnsets", "seadra").learnset.coralcrash = ["9L1"];
		this.modData("Learnsets", "seadra").learnset.dracometeor = ["9L1"];
		this.modData("Learnsets", "seadra").learnset.sludgebomb = ["9L1"];
		this.modData("Learnsets", "seadra").learnset.sludgewave = ["9L1"];
		this.modData("Learnsets", "seadra").learnset.thunder = ["9L1"];
		this.modData("Learnsets", "seadra").learnset.thunderbolt = ["9L1"];
		this.modData("Learnsets", "seadra").learnset.toxicspikes = ["9L1"];
		this.modData("Learnsets", "vaporeon").learnset.slipaway = ["9L1"];
		this.modData("Learnsets", "flareon").learnset.crunch = ["9L1"];
		this.modData("Learnsets", "flareon").learnset.flareout = ["9L1"];
		this.modData("Learnsets", "flareon").learnset.playrough = ["9L1"];
		this.modData("Learnsets", "flareon").learnset.psychicfangs = ["9L1"];
		this.modData("Learnsets", "flareon").learnset.suckerpunch = ["9L1"];
		this.modData("Learnsets", "jolteon").learnset.buzzoff = ["9L1"];
		this.modData("Learnsets", "nidoking").learnset.barbbarrage = ["9L1"];
		this.modData("Learnsets", "nidoqueen").learnset.moonlight = ["9L1"];
		this.modData("Learnsets", "butterfree").learnset.strengthsap = ["9L1"];
		this.modData("Learnsets", "butterfree").learnset.powdergale = ["9L1"];
		delete this.modData('Learnsets', 'alakazam').learnset.focusblast;
		delete this.modData('Learnsets', 'alakazam').learnset.nastyplot;
		delete this.modData('Learnsets', 'gengar').learnset.focusblast;
		delete this.modData('Learnsets', 'gengar').learnset.nastyplot;
		delete this.modData('Learnsets', 'gengar').learnset.terablast;
		delete this.modData('Learnsets', 'gengar').learnset.thunderbolt;
		delete this.modData('Learnsets', 'gengar').learnset.thunder;
		delete this.modData('Learnsets', 'dragonite').learnset.dragonclaw;
		delete this.modData('Learnsets', 'dragonite').learnset.dragondance;
		delete this.modData('Learnsets', 'dragonite').learnset.dragonrush;
		delete this.modData('Learnsets', 'dragonite').learnset.dualwingbeat;
		delete this.modData('Learnsets', 'dragonite').learnset.honeclaws;
		delete this.modData('Learnsets', 'dragonite').learnset.outrage;
		delete this.modData('Learnsets', 'dragonite').learnset.poweruppunch;
		delete this.modData('Learnsets', 'dragonite').learnset.terablast;
		delete this.modData('Learnsets', 'venusaur').learnset.earthpower;
		delete this.modData('Learnsets', 'venusaur').learnset.weatherball;
		delete this.modData('Learnsets', 'blastoise').learnset.aurasphere;
		delete this.modData('Learnsets', 'blastoise').learnset.avalanche;
		delete this.modData('Learnsets', 'blastoise').learnset.blizzard;
		delete this.modData('Learnsets', 'blastoise').learnset.focusblast;
		delete this.modData('Learnsets', 'blastoise').learnset.hail;
		delete this.modData('Learnsets', 'blastoise').learnset.icebeam;
		delete this.modData('Learnsets', 'blastoise').learnset.icepunch;
		delete this.modData('Learnsets', 'blastoise').learnset.icywind;
		delete this.modData('Learnsets', 'blastoise').learnset.mist;
		delete this.modData('Learnsets', 'blastoise').learnset.shellsmash;
		delete this.modData('Learnsets', 'pidgeot').learnset.toxic;
		delete this.modData('Learnsets', 'dodrio').learnset.fly;
		delete this.modData('Learnsets', 'seadra').learnset.blizzard;
		delete this.modData('Learnsets', 'seadra').learnset.icebeam;
		// Removing the prevos' moves
		delete this.modData('Learnsets', 'gastly').learnset.nastyplot;
		delete this.modData('Learnsets', 'gastly').learnset.terablast;
		delete this.modData('Learnsets', 'gastly').learnset.thunderbolt;
		delete this.modData('Learnsets', 'gastly').learnset.thunder;
		delete this.modData('Learnsets', 'haunter').learnset.focusblast;
		delete this.modData('Learnsets', 'haunter').learnset.nastyplot;
		delete this.modData('Learnsets', 'haunter').learnset.terablast;
		delete this.modData('Learnsets', 'haunter').learnset.thunderbolt;
		delete this.modData('Learnsets', 'haunter').learnset.thunder;
		delete this.modData('Learnsets', 'dratini').learnset.dragondance;
		delete this.modData('Learnsets', 'dratini').learnset.dragonrush;
		delete this.modData('Learnsets', 'dratini').learnset.outrage;
		delete this.modData('Learnsets', 'dratini').learnset.terablast;
		delete this.modData('Learnsets', 'dragonair').learnset.dragondance;
		delete this.modData('Learnsets', 'dragonair').learnset.dragonrush;
		delete this.modData('Learnsets', 'dragonair').learnset.outrage;
		delete this.modData('Learnsets', 'dragonair').learnset.terablast;
		delete this.modData('Learnsets', 'bulbasaur').learnset.weatherball;
		delete this.modData('Learnsets', 'ivysaur').learnset.weatherball;
		delete this.modData('Learnsets', 'squirtle').learnset.aurasphere;
		delete this.modData('Learnsets', 'squirtle').learnset.blizzard;
		delete this.modData('Learnsets', 'squirtle').learnset.hail;
		delete this.modData('Learnsets', 'squirtle').learnset.icebeam;
		delete this.modData('Learnsets', 'squirtle').learnset.icepunch;
		delete this.modData('Learnsets', 'squirtle').learnset.mist;
		delete this.modData('Learnsets', 'squirtle').learnset.shellsmash;
		delete this.modData('Learnsets', 'wartortle').learnset.aurasphere;
		delete this.modData('Learnsets', 'wartortle').learnset.blizzard;
		delete this.modData('Learnsets', 'wartortle').learnset.hail;
		delete this.modData('Learnsets', 'wartortle').learnset.icebeam;
		delete this.modData('Learnsets', 'wartortle').learnset.icepunch;
		delete this.modData('Learnsets', 'wartortle').learnset.mist;
		delete this.modData('Learnsets', 'wartortle').learnset.shellsmash;
		delete this.modData('Learnsets', 'pidgey').learnset.toxic;
		delete this.modData('Learnsets', 'pidgeotto').learnset.toxic;
		delete this.modData('Learnsets', 'doduo').learnset.fly;
		delete this.modData('Learnsets', 'horsea').learnset.blizzard;
		delete this.modData('Learnsets', 'horsea').learnset.icebeam;
		this.modData("Learnsets", "raticate").learnset.gunkshot = ["9L1"];
		this.modData("Learnsets", "raticate").learnset.poisonjab = ["9L1"];
		this.modData("Learnsets", "raticate").learnset.sludgebomb = ["9L1"];
		this.modData("Learnsets", "raticate").learnset.sludgewave = ["9L1"];
		this.modData("Learnsets", "raticate").learnset.sludge = ["9L1"];
		this.modData("Learnsets", "raticate").learnset.closecombat = ["9L1"];
		this.modData("Learnsets", "raticate").learnset.pestspread = ["9L1"];
		delete this.modData('Learnsets', 'raticate').learnset.swordsdance;
		delete this.modData('Learnsets', 'raticate').learnset.stompingtantrum;
		delete this.modData('Learnsets', 'raticate').learnset.suckerpunch;
		delete this.modData('Learnsets', 'raticate').learnset.pursuit;
		delete this.modData('Learnsets', 'raticate').learnset.zenheadbutt;
		delete this.modData('Learnsets', 'rattata').learnset.swordsdance;
		delete this.modData('Learnsets', 'rattata').learnset.stompingtantrum;
		delete this.modData('Learnsets', 'rattata').learnset.suckerpunch;
		delete this.modData('Learnsets', 'rattata').learnset.pursuit;
		delete this.modData('Learnsets', 'rattata').learnset.zenheadbutt;
		this.modData("Learnsets", "kangaskhan").learnset.familyonslaught = ["9L1"];
		this.modData("Learnsets", "kangaskhan").learnset.dragontail = ["9L1"];
		this.modData("Learnsets", "kangaskhan").learnset.dragonclaw = ["9L1"];
		this.modData("Learnsets", "kangaskhan").learnset.dracometeor = ["9L1"];
		this.modData("Learnsets", "kangaskhan").learnset.dragondance = ["9L1"];
		this.modData("Learnsets", "kangaskhan").learnset.uturn = ["9L1"];
		this.modData("Learnsets", "farfetchd").learnset.bulkup = ["9L1"];
		this.modData("Learnsets", "farfetchd").learnset.sacredsword = ["9L1"];
		delete this.modData('Learnsets', 'farfetchd').learnset.toxic;
		this.modData("Learnsets", "lapras").learnset.escort = ["9L1"];
		this.modData("Learnsets", "lapras").learnset.wish = ["9L1"];
		this.modData("Learnsets", "tauros").learnset.escort = ["9L1"];
		this.modData("Learnsets", "tauros").learnset.headlongrush = ["9L1"];
		this.modData("Learnsets", "marowak").learnset.knockoff = ["9L1"];
		this.modData("Learnsets", "marowak").learnset.vengefulbone = ["9L1"];
		this.modData("Learnsets", "marowak").learnset.closecombat = ["9L1"];
		this.modData("Learnsets", "gyarados").learnset.acrobatics = ["9L1"];
		this.modData("Learnsets", "gyarados").learnset.ragingtorrent = ["9L1"];
		this.modData("Learnsets", "cloyster").learnset.bulletpunch = ["9L1"];
		this.modData("Learnsets", "cloyster").learnset.curse = ["9L1"];
		this.modData("Learnsets", "cloyster").learnset.explosion = ["9L1"];
		this.modData("Learnsets", "cloyster").learnset.ironhead = ["9L1"];
		this.modData("Learnsets", "cloyster").learnset.splashback = ["9L1"];
		this.modData("Learnsets", "tentacruel").learnset.darkpulse = ["9L1"];
		this.modData("Learnsets", "tentacruel").learnset.foulplay = ["9L1"];
		this.modData("Learnsets", "tentacruel").learnset.nastyplot = ["9L1"];
		delete this.modData('Learnsets', 'cloyster').learnset.iceshard;
		delete this.modData('Learnsets', 'cloyster').learnset.lifedew;
		delete this.modData('Learnsets', 'cloyster').learnset.shellsmash;
		delete this.modData('Learnsets', 'tentacruel').learnset.scald;
		delete this.modData('Learnsets', 'shellder').learnset.iceshard;
		delete this.modData('Learnsets', 'shellder').learnset.lifedew;
		delete this.modData('Learnsets', 'shellder').learnset.shellsmash;
		delete this.modData('Learnsets', 'tentacool').learnset.scald;
	},
};
