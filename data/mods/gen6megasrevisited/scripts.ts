export const Scripts: ModdedBattleScriptsData = {
	gen: 6,
	inherit: 'gen6',
	actions: {
		// for parental bond
		modifyDamage(
			baseDamage: number, pokemon: Pokemon, target: Pokemon, move: ActiveMove, suppressMessages = false
		) {
			const tr = this.battle.trunc;
			if (!move.type) move.type = '???';
			const type = move.type;
			baseDamage += 2;
			if (move.spreadHit) {
				// multi-target modifier (doubles only)
				const spreadModifier = move.spreadModifier || (this.battle.gameType === 'freeforall' ? 0.5 : 0.75);
				this.battle.debug('Spread modifier: ' + spreadModifier);
				baseDamage = this.battle.modify(baseDamage, spreadModifier);
			} else if (move.multihitType === 'parentalbond' && move.hit > 1) {
				// Parental Bond modifier
				const bondModifier = this.battle.gen > 6 ? 0.25 : 0.25;
				this.battle.debug(`Parental Bond modifier: ${bondModifier}`);
				baseDamage = this.battle.modify(baseDamage, bondModifier);
			}
			baseDamage = this.battle.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);
			const isCrit = target.getMoveHitData(move).crit;
			if (isCrit) {
				baseDamage = tr(baseDamage * (move.critModifier || (this.battle.gen >= 6 ? 1.5 : 2)));
			}
			baseDamage = this.battle.randomizer(baseDamage);
			if (type !== '???') {
				let stab: number | [number, number] = 1;
				const isSTAB = move.forceSTAB || pokemon.hasType(type) || pokemon.getTypes(false, true).includes(type);
				if (isSTAB) {
					stab = 1.5;
				}
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
			if (this.battle.gen === 5 && !baseDamage) baseDamage = 1;
			baseDamage = this.battle.runEvent('ModifyDamage', pokemon, target, move, baseDamage);
			if (move.isZOrMaxPowered && target.getMoveHitData(move).zBrokeProtect) {
				baseDamage = this.battle.modify(baseDamage, 0.25);
				this.battle.add('-zbroken', target);
			}
			if (this.battle.gen !== 5 && !baseDamage) return 1;
			return tr(baseDamage, 16);
		},
	},
	pokemon: {
		// for neutralizing gas
		ignoringAbility() {
			if (this.battle.gen >= 5 && !this.isActive) return true;
			if (this.getAbility().flags['cantsuppress']) return false;
			if (this.volatiles['gastroacid']) return true;
			if (this.ability === ('neutralizinggas' as ID)) return false;
			if (this.volatiles['neutralizinggas']) return true;
			return false;
		},
	},
	init() {
		this.modData("Learnsets", "lucario").learnset.meteormash = ["6L1"];
		this.modData("Learnsets", "lucario").learnset.machpunch = ["6L1"];
		this.modData("Learnsets", "houndoom").learnset.toxicspikes = ["6L1"];
		this.modData("Learnsets", "houndoom").learnset.venoshock = ["6L1"];
		this.modData("Learnsets", "houndoom").learnset.hex = ["6L1"];
		this.modData("Learnsets", "audino").learnset.discharge = ["6L1"];
		this.modData("Learnsets", "audino").learnset.voltswitch = ["6L1"];
		this.modData("Learnsets", "audino").learnset.chargebeam = ["6L1"];
		this.modData("Learnsets", "audino").learnset.charge = ["6L1"];
		this.modData("Learnsets", "audino").learnset.zapcannon = ["6L1"];
		this.modData("Learnsets", "glalie").learnset.thunderfang = ["6L1"];
		this.modData("Learnsets", "glalie").learnset.partingshot = ["6L1"];
		this.modData("Learnsets", "glalie").learnset.boomburst = ["6L1"];
		this.modData("Learnsets", "banette").learnset.ironhead = ["6L1"];
		this.modData("Learnsets", "banette").learnset.metalsound = ["6L1"];
		this.modData("Learnsets", "banette").learnset.powder = ["6L1"];
		this.modData("Learnsets", "banette").learnset.stealthrock = ["6L1"];
		this.modData("Learnsets", "banette").learnset.defog = ["6L1"];
		this.modData("Learnsets", "venusaur").learnset.psychic = ["6L1"];
		this.modData("Learnsets", "venusaur").learnset.calmmind = ["6L1"];
		this.modData("Learnsets", "blastoise").learnset.moonblast = ["6L1"];
		this.modData("Learnsets", "blastoise").learnset.mistyterrain = ["6L1"];
		this.modData("Learnsets", "blastoise").learnset.taunt = ["6L1"];
		this.modData("Learnsets", "blastoise").learnset.drainingkiss = ["6L1"];
		this.modData("Learnsets", "blastoise").learnset.dazzlinggleam = ["6L1"];
		this.modData("Learnsets", "charizard").learnset.calmmind = ["6L1"];
		this.modData("Learnsets", "charizard").learnset.hurricane = ["6L1"];
		this.modData("Learnsets", "charizard").learnset.lavaplume = ["6L1"];
		this.modData("Learnsets", "gengar").learnset.reflecttype = ["6L1"];
		this.modData("Learnsets", "gengar").learnset.calmmind = ["6L1"];
		this.modData("Learnsets", "alakazam").learnset.blizzard = ["6L1"];
		this.modData("Learnsets", "alakazam").learnset.flashcannon = ["6L1"];
		this.modData("Learnsets", "alakazam").learnset.icebeam = ["6L1"];
		this.modData("Learnsets", "alakazam").learnset.hail = ["6L1"];
		this.modData("Learnsets", "pinsir").learnset.hail = ["6L1"];
		this.modData("Learnsets", "pinsir").learnset.megahorn = ["6L1"];
		this.modData("Learnsets", "pinsir").learnset.uturn = ["6L1"];
		this.modData("Learnsets", "pinsir").learnset.iceshard = ["6L1"];
		this.modData("Learnsets", "pinsir").learnset.iciclecrash = ["6L1"];
		this.modData("Learnsets", "pinsir").learnset.icebeam = ["6L1"];
		this.modData("Learnsets", "pinsir").learnset.blizzard = ["6L1"];
		this.modData("Learnsets", "pinsir").learnset.roost = ["6L1"];
		this.modData("Learnsets", "pinsir").learnset.iciclespear = ["6L1"];
		this.modData("Learnsets", "aerodactyl").learnset.powergem = ["6L1"];
		this.modData("Learnsets", "aerodactyl").learnset.shadowball = ["6L1"];
		this.modData("Learnsets", "aerodactyl").learnset.hurricane = ["6L1"];
		this.modData("Learnsets", "steelix").learnset.heatcrash = ["6L1"];
		this.modData("Learnsets", "steelix").learnset.rapidspin = ["6L1"];
		this.modData("Learnsets", "steelix").learnset.smackdown = ["6L1"];
		this.modData("Learnsets", "altaria").learnset.scald = ["6L1"];
		this.modData("Learnsets", "altaria").learnset.hydropump = ["6L1"];
		this.modData("Learnsets", "altaria").learnset.thunder = ["6L1"];
		this.modData("Learnsets", "sceptile").learnset.calmmind = ["6L1"];
		this.modData("Learnsets", "sceptile").learnset.sludgewave = ["6L1"];
		this.modData("Learnsets", "swampert").learnset.sludgebomb = ["6L1"];
		this.modData("Learnsets", "swampert").learnset.bulkup = ["6L1"];
		this.modData("Learnsets", "swampert").learnset.toxicspikes = ["6L1"];
		this.modData("Learnsets", "swampert").learnset.aquajet = ["6L1"];
		this.modData("Learnsets", "swampert").learnset.gunkshot = ["6L1"];
		this.modData("Learnsets", "swampert").learnset.poisonjab = ["6L1"];
		this.modData("Learnsets", "pidgeot").learnset.focusblast = ["6L1"];
		this.modData("Learnsets", "absol").learnset.closecombat = ["6L1"];
		this.modData("Learnsets", "absol").learnset.moonblast = ["6L1"];
		this.modData("Learnsets", "absol").learnset.moonlight = ["6L1"];
		this.modData("Learnsets", "medicham").learnset.aurasphere = ["6L1"];
		this.modData("Learnsets", "medicham").learnset.thunderbolt = ["6L1"];
		this.modData("Learnsets", "medicham").learnset.closecombat = ["6L1"];
		this.modData("Learnsets", "medicham").learnset.gunkshot = ["6L1"];
		this.modData("Learnsets", "medicham").learnset.healingwish = ["6L1"];
		this.modData("Learnsets", "beedrill").learnset.earthquake = ["6L1"];
		this.modData("Learnsets", "beedrill").learnset.stoneedge = ["6L1"];
		this.modData("Learnsets", "beedrill").learnset.rockslide = ["6L1"];
		this.modData("Learnsets", "beedrill").learnset.smackdown = ["6L1"];
		this.modData("Learnsets", "beedrill").learnset.stealthrock = ["6L1"];
		this.modData("Learnsets", "beedrill").learnset.diamondstorm = ["6L1"];
		this.modData("Learnsets", "mawile").learnset.firepunch = ["6L1"];
		this.modData("Learnsets", "mawile").learnset.rockslide = ["6L1"];
		this.modData("Learnsets", "mawile").learnset.slackoff = ["6L1"];
		this.modData("Learnsets", "camerupt").learnset.morningsun = ["6L1"];
		this.modData("Learnsets", "abomasnow").learnset.spikyshield = ["6L1"];
		this.modData("Learnsets", "abomasnow").learnset.earthpower = ["6L1"];
		this.modData("Learnsets", "abomasnow").learnset.hornleech = ["6L1"];
		this.modData("Learnsets", "gallade").learnset.sacredsword = ["6L1"];
		this.modData("Learnsets", "gallade").learnset.machpunch = ["6L1"];
		this.modData('Moves', 'aerialace').flags.slicing = 1;
		this.modData('Moves', 'aircutter').flags.slicing = 1;
		this.modData('Moves', 'airslash').flags.slicing = 1;
		this.modData('Moves', 'behemothblade').flags.slicing = 1;
		this.modData('Moves', 'crosspoison').flags.slicing = 1;
		this.modData('Moves', 'cut').flags.slicing = 1;
		this.modData('Moves', 'furycutter').flags.slicing = 1;
		this.modData('Moves', 'nightslash').flags.slicing = 1;
		this.modData('Moves', 'psychocut').flags.slicing = 1;
		this.modData('Moves', 'razorleaf').flags.slicing = 1;
		this.modData('Moves', 'razorshell').flags.slicing = 1;
		this.modData('Moves', 'sacredsword').flags.slicing = 1;
		this.modData('Moves', 'slash').flags.slicing = 1;
		this.modData('Moves', 'solarblade').flags.slicing = 1;
		this.modData('Moves', 'xscissor').flags.slicing = 1;
		this.modData("Learnsets", "ampharos").learnset.waterpulse = ["6L1"];
		this.modData("Learnsets", "ampharos").learnset.aurasphere = ["6L1"];
		this.modData("Learnsets", "ampharos").learnset.darkpulse = ["6L1"];
		this.modData("Learnsets", "ampharos").learnset.defog = ["6L1"];
		this.modData("Learnsets", "ampharos").learnset.slackoff = ["6L1"];
		this.modData("Learnsets", "heracross").learnset.healorder = ["6L1"];
		this.modData("Learnsets", "heracross").learnset.circlethrow = ["6L1"];
		this.modData("Learnsets", "heracross").learnset.spikes = ["6L1"];
		this.modData("Learnsets", "heracross").learnset.icepunch = ["6L1"];
		this.modData("Learnsets", "sharpedo").learnset.thunder = ["6L1"];
		this.modData("Learnsets", "gardevoir").learnset.rapidspin = ["6L1"];
		this.modData("Learnsets", "gardevoir").learnset.mysticalfire = ["6L1"];
		this.modData("Learnsets", "aggron").learnset.voltswitch = ["6L1"];
		this.modData("Learnsets", "kangaskhan").learnset.milkdrink = ["6L1"];
		this.modData("Learnsets", "salamence").learnset.hurricane = ["6L1"];
		this.modData("Learnsets", "salamence").learnset.airslash = ["6L1"];
		this.modData("Learnsets", "salamence").learnset.ironhead = ["6L1"];
		this.modData("Learnsets", "tyranitar").learnset.wildcharge = ["6L1"];
		this.modData("Learnsets", "tyranitar").learnset.waterfall = ["6L1"];
		this.modData("Learnsets", "diancie").learnset.spikyshield = ["6L1"];
		this.modData("Learnsets", "blaziken").learnset.uturn = ["6L1"];
		this.modData("Learnsets", "blaziken").learnset.spikes = ["6L1"];
		this.modData("Learnsets", "blaziken").learnset.roost = ["6L1"];
		this.modData("Learnsets", "blaziken").learnset.closecombat = ["6L1"];
		this.modData("Learnsets", "mewtwo").learnset.extremespeed = ["6L1"];
		this.modData("Learnsets", "mewtwo").learnset.sludgewave = ["6L1"];
		this.modData("Learnsets", "mewtwo").learnset.swordsdance = ["6L1"];
		this.modData("Learnsets", "mewtwo").learnset.uturn = ["6L1"];
		this.modData("Learnsets", "mewtwo").learnset.closecombat = ["6L1"];
		this.modData("Learnsets", "mewtwo").learnset.drainpunch = ["6L1"];
		this.modData("Learnsets", "mewtwo").learnset.machpunch = ["6L1"];
		this.modData("Learnsets", "mewtwo").learnset.scald = ["6L1"];
		this.modData("Learnsets", "mewtwo").learnset.surf = ["6L1"];
		this.modData("Learnsets", "mewtwo").learnset.hydropump = ["6L1"];
		this.modData("Learnsets", "rayquaza").learnset.coil = ["6L1"];
		this.modData("Learnsets", "rayquaza").learnset.defog = ["6L1"];
	},
};
