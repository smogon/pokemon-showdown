	// List of flags and their descriptions can be found in sim/dex-moves.ts
	
	export const Moves: {[moveid: string]: MoveData} = {
	
attackorder: {	attackorder: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Attack Order",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
bugbite: {	bugbite: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Bug Bite",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onHit(target, source) {
	const item = target.getItem();
	if (source.hp && item.isBerry && target.takeItem(source)) {
	this.add('-enditem', target, item.name, '[from] stealeat', '[move] Bug Bite', '[of] ' + source);
	if (this.singleEvent('Eat', item, null, source, null, null)) {
	this.runEvent('EatItem', source, null, null, item);
	if (item.id === 'leppaberry') target.staleness = 'external';
	}
	if (item.onEat) source.ateBerry = true;
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
bugbuzz: {	bugbuzz: {
accuracy:	accuracy: 80,
basePower:	basePower: 110,
category:	category: "Special",
	name: "Bug Buzz",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
secondary:	secondary: {
	chance: 40,
	boosts: {
	spd: -1,
	},
	},
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
defendorder: {	defendorder: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Defend Order",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	def: 2,
	spd: 2,
	spe:-2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Bug",	type: "Bug",
	},
	
fellstinger: {	fellstinger: {
accuracy:	accuracy: 85,
basePower:	basePower: 65,
category:	category: "Physical",
	name: "Fell Stinger",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onAfterMoveSecondarySelf(pokemon, target, move) {
	if (!target || target.fainted || target.hp <= 0) this.boost({atk: 3}, pokemon, pokemon, move);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
firstimpression: {	firstimpression: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "First Impression",
	pp: 1.25,
priority:	priority: 2,
	flags: {contact: 1, protect: 1, mirror: 1},
	onTry(source) {
	if (source.activeMoveActions > 1) {
	this.hint("First Impression only works on your first turn out.");
	return false;
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
furycutter: {	furycutter: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
	basePowerCallback(pokemon, target, move) {
	if (!pokemon.volatiles['furycutter'] || move.hit === 1) {
	pokemon.addVolatile('furycutter');
	}
	const bp = this.clampIntRange(move.basePower * pokemon.volatiles['furycutter'].multiplier, 1, 160);
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Physical",
	name: "Fury Cutter",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
	condition: {
	duration: 2,
	onStart() {
	this.effectState.multiplier = 1;
	},
	onRestart() {
	if (this.effectState.multiplier < 4) {
	this.effectState.multiplier <<= 1;
	}
	this.effectState.duration = 2;
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
healorder: {	healorder: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Heal Order",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	heal: [1, 2],
secondary:	secondary: null,
target:	target: "self",
type: "Bug",	type: "Bug",
	},
	
infestation: {	infestation: {
accuracy:	accuracy: 95,
basePower:	basePower: 25,
category:	category: "Special",
	name: "Infestation",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	volatileStatus: 'partiallytrapped',
secondary:	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
leechlife: {	leechlife: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Leech Life",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
	drain: [1, 2],
secondary:	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
lunge: {	lunge: {
accuracy:	accuracy: 90,
basePower:	basePower: 35,
category:	category: "Special",
	name: "Lunge",
	pp: 1.25,
priority:	priority: 2,
	flags: {contact: 1, protect: 1, mirror: 1},
	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
megahorn: {	megahorn: {
accuracy:	accuracy: 85,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Megahorn",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	self: {
	boosts: {
	atk: -1,
	def: -1,
	},
	},
target:	target: "allAdjacentFoes",
type: "Bug",	type: "Bug",
	},
	
pinmissile: {	pinmissile: {
accuracy:	accuracy: 90,
basePower:	basePower: 15,
category:	category: "Physical",
	name: "Pin Missile",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	multihit: [2, 8],
secondary:	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
pollenpuff: {	pollenpuff: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Pollen Puff",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1, allyanim: 1},
	onTryHit(target, source, move) {
	if (source.isAlly(target)) {
	move.basePower = 0;
	move.infiltrates = true;
	}
	},
	onHit(target, source) {
	if (source.isAlly(target)) {
	if (!this.heal(Math.floor(target.baseMaxhp * 0.5))) {
	this.add('-immune', target);
	return this.NOT_FAIL;
	}
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
pounce: {	pounce: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Pounce",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spe: -1,
	},
	},
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
powder: {	powder: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Powder",
	pp: 1.25,
priority:	priority: 1,
	flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1, bypasssub: 1},
	volatileStatus: 'powder',
	condition: {
	duration: 1,
	onStart(target) {
	this.add('-singleturn', target, 'Powder');
	},
	onTryMovePriority: -1,
	onTryMove(pokemon, target, move) {
	if (move.type === 'Fire') {
	this.add('-activate', pokemon, 'move: Powder');
	this.damage(this.clampIntRange(Math.round(pokemon.maxhp / 4), 1));
	this.attrLastMove('[still]');
	return false;
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
quiverdance: {	quiverdance: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Quiver Dance",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, dance: 1},
	boosts: {
	spa: 1,
	spd: 1,
	spe: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Bug",	type: "Bug",
	},
	
ragepowder: {	ragepowder: {
accuracy:	accuracy: 95,
basePower:	basePower: 25,
category:	category: "Special",
	name: "Rage Powder",
	pp: 1.25,
priority:	priority: 2,
	flags: {powder: 1, noassist: 1, failcopycat: 1},
	volatileStatus: 'ragepowder',
	onTry(source) {
	return this.activePerHalf > 1;
	},
	condition: {
	duration: 1,
	onStart(pokemon) {
	this.add('-singleturn', pokemon, 'move: Rage Powder');
	},
	onFoeRedirectTargetPriority: 1,
	onFoeRedirectTarget(target, source, source2, move) {
	const ragePowderUser = this.effectState.target;
	if (ragePowderUser.isSkyDropped()) return;
	if (source.runStatusImmunity('powder') && this.validTarget(ragePowderUser, source, move.target)) {
	if (move.smartTarget) move.smartTarget = false;
	this.debug("Rage Powder redirected target of move");
	return ragePowderUser;
	}
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Bug",	type: "Bug",
	},
	
savagespinout: {	savagespinout: {
accuracy:	accuracy: 65,
basePower:	basePower: 200,
category:	category: "Physical",
	name: "Savage Spin-Out",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
signalbeam: {	signalbeam: {
accuracy:	accuracy: 85,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Signal Beam",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 75,
	volatileStatus: 'confusion',
	},
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
silktrap: {	silktrap: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Silk Trap",
	pp: 1.25,
priority:	priority: 4,
	flags: {},
	stallingMove: true,
	volatileStatus: 'silktrap',
	onPrepareHit(pokemon) {
	return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
	},
	onHit(pokemon) {
	pokemon.addVolatile('stall');
	},
	condition: {
	duration: 1,
	onStart(target) {
	this.add('-singleturn', target, 'Protect');
	},
	onTryHitPriority: 3,
	onTryHit(target, source, move) {
	if (!move.flags['protect'] || move.category === 'Status') {
	if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
	return;
	}
	if (move.smartTarget) {
	move.smartTarget = false;
	} else {
	this.add('-activate', target, 'move: Protect');
	}
	const lockedmove = source.getVolatile('lockedmove');
	if (lockedmove) {
	// Outrage counter is reset
	if (source.volatiles['lockedmove'].duration === 2) {
	delete source.volatiles['lockedmove'];
	}
	}
	if (this.checkMoveMakesContact(move, source, target)) {
	this.boost({spe: -2}, source, target, this.dex.getActiveMove("Silk Trap"));
	}
	return this.NOT_FAIL;
	},
	onHit(target, source, move) {
	if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
	this.boost({spe: -2}, source, target, this.dex.getActiveMove("Silk Trap"));
	}
	},
	},
target:	target: "self",
type: "Bug",	type: "Bug",
	},
	
silverwind: {	silverwind: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Special",
	name: "Silver Wind",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 50,
	self: {
	boosts: {
	atk: 1,
	def: 1,
	spa: 1,
	spd: 1,
	spe: 1,
	},
	},
	},
target:	target: "foeSide",
type: "Bug",	type: "Bug",
	},
	
skittersmack: {	skittersmack: {
accuracy:	accuracy: 90,
basePower:	basePower: 45,
category:	category: "Physical",
	name: "Skitter Smack",
	pp: 1.25,
priority:	priority: 2,
	flags: {contact: 1, protect: 1, mirror: 1},
	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
spiderweb: {	spiderweb: {
accuracy:	accuracy: 95,
basePower:	basePower: 20,
category:	category: "attack",
	name: "Spider Web",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	onHit(target, source, move) {
	return target.addVolatile('trapped', source, move, 'trapper');
	},
secondary:	secondary: null,
target:	target: "foeSide",
type: "Bug",	type: "Bug",
	},
	
steamroller: {	steamroller: {
accuracy:	accuracy: 90,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Steamroller",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 50,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
stickyweb: {	stickyweb: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Sticky Web",
	pp: 1.25,
priority:	priority: 0,
	flags: {reflectable: 1},
	sideCondition: 'stickyweb',
	condition: {
	onSideStart(side) {
	this.add('-sidestart', side, 'move: Sticky Web');
	},
	onEntryHazard(pokemon) {
	if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
	this.add('-activate', pokemon, 'move: Sticky Web');
	this.boost({spe: -1}, pokemon, this.effectState.source, this.dex.getActiveMove('stickyweb'));
	},
	},
secondary:	secondary: null,
target:	target: "foeSide",
type: "Bug",	type: "Bug",
	},
	
stringshot: {	stringshot: {
accuracy:	accuracy: 95,
basePower:	basePower: 55,
category:	category: "Physical",
	name: "String Shot",
	pp: 125,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	boosts: {
	spe: -1,
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Bug",	type: "Bug",
	},
	
strugglebug: {	strugglebug: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Special",
	name: "Struggle Bug",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spa: -1,
	atk: -1,
	},
	},
target:	target: "allAdjacentFoes",
type: "Bug",	type: "Bug",
	},
	
tailglow: {	tailglow: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Tail Glow",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	spa: 3,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Bug",	type: "Bug",
	},
	
twineedle: {	twineedle: {
accuracy:	accuracy: 95,
basePower:	basePower: 25,
category:	category: "Physical",
	name: "Twineedle",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	multihit: 2,
secondary:	secondary: {
	chance: 40,
	status: 'tox',
	},
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
uturn: {	uturn: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "U-turn",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	selfSwitch: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
xscissor: {	xscissor: {
accuracy:	accuracy: 85,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "X-Scissor",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Bug",	type: "Bug",
	},
	
assurance: {	assurance: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
	basePowerCallback(pokemon, target, move) {
	if (target.hurtThisTurn) {
	this.debug('BP doubled on damaged target');
	return move.basePower * 2;
	}
	return move.basePower;
	},
category:	category: "Physical",
	name: "Assurance",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
baddybad: {	baddybad: {
accuracy:	accuracy: 80,
basePower:	basePower: 110,
category:	category: "Special",
	name: "Baddy Bad",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	self: {
	sideCondition: 'reflect',
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
beatup: {	beatup: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon, target, move) {
	const currentSpecies = move.allies!.shift()!.species;
	const bp = 5 + Math.floor(currentSpecies.baseStats.atk / 10);
	this.debug('BP for ' + currentSpecies.name + ' hit: ' + bp);
	return bp;
	},
category:	category: "Physical",
	name: "Beat Up",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, allyanim: 1},
	onModifyMove(move, pokemon) {
	move.allies = pokemon.side.pokemon.filter(ally => ally === pokemon || !ally.fainted && !ally.status);
	move.multihit = move.allies.length;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
bite: {	bite: {
accuracy:	accuracy: 90,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Bite",
	pp: 1.25,
priority:	priority: 0,
	flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 40,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
blackholeeclipse: {	blackholeeclipse: {
accuracy:	accuracy: 65,
basePower:	basePower: 200,
category:	category: "Physical",
	name: "Black Hole Eclipse",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
brutalswing: {	brutalswing: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Brutal Swing",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "allAdjacent",
type: "Dark",	type: "Dark",
	},
	
ceaselessedge: {	ceaselessedge: {
accuracy:	accuracy: 90,
basePower:	basePower: 65,
category:	category: "Physical",
	name: "Ceaseless Edge",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
	self: {
	onHit(source) {
	for (const side of source.side.foeSidesWithConditions()) {
	side.addSideCondition('spikes');
	}
	},
	},
secondary:	secondary: {}, // allows sheer force to trigger
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
comeuppance: {	comeuppance: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	damageCallback(pokemon) {
	const lastDamagedBy = pokemon.getLastDamagedBy(true);
	if (lastDamagedBy !== undefined) {
	return (lastDamagedBy.damage * 1.5) || 1;
	}
	return 0;
	},
category:	category: "Physical",
	name: "Comeuppance",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, failmefirst: 1},
	onTry(source) {
	const lastDamagedBy = source.getLastDamagedBy(true);
	if (lastDamagedBy === undefined || !lastDamagedBy.thisTurn) return false;
	},
	onModifyTarget(targetRelayVar, source, target, move) {
	const lastDamagedBy = source.getLastDamagedBy(true);
	if (lastDamagedBy) {
	targetRelayVar.target = this.getAtSlot(lastDamagedBy.slot);
	}
	},
secondary:	secondary: null,
target:	target: "scripted",
type: "Dark",	type: "Dark",
	},
	
crunch: {	crunch: {
accuracy:	accuracy: 90,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Crunch",
	pp: 1.25,
priority:	priority: 0,
	flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 20,
	boosts: {
	def: -1,
	},
	},
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
darkestlariat: {	darkestlariat: {
accuracy:	accuracy: 95,
basePower:	basePower: 85,
category:	category: "Physical",
	name: "Darkest Lariat",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	ignoreEvasion: true,
	ignoreDefensive: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
darkpulse: {	darkpulse: {
accuracy:	accuracy: 85,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Dark Pulse",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, pulse: 1, mirror: 1, distance: 1},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "any",
type: "Dark",	type: "Dark",
	},
	
darkvoid: {	darkvoid: {
accuracy:	accuracy: 50,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Dark Void",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	status: 'slp',
	onTry(source, target, move) {
	if (source.species.name === 'Darkrai' || move.hasBounced) {
	return;
	}
	this.add('-fail', source, 'move: Dark Void');
	this.hint("Only a Pokemon whose form is Darkrai can use this move.");
	return null;
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Dark",	type: "Dark",
	},
	
embargo: {	embargo: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Embargo",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	volatileStatus: 'embargo',
	condition: {
	duration: 5,
	onStart(pokemon) {
	this.add('-start', pokemon, 'Embargo');
	this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
	},
	// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
	onResidualOrder: 21,
	onEnd(pokemon) {
	this.add('-end', pokemon, 'Embargo');
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
faketears: {	faketears: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Fake Tears",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	boosts: {
	spd: -2,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
falsesurrender: {	falsesurrender: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "False Surrender",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
feintattack: {	feintattack: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Feint Attack",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
fierywrath: {	fierywrath: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Fiery Wrath",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 20,
	volatileStatus: 'flinch',
	},
target:	target: "allAdjacentFoes",
type: "Dark",	type: "Dark",
	},
	
flatter: {	flatter: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Flatter",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	volatileStatus: 'confusion',
	boosts: {
	spa: 1,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
fling: {	fling: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Physical",
	name: "Fling",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, allyanim: 1, noparentalbond: 1},
	onPrepareHit(target, source, move) {
	if (source.ignoringItem()) return false;
	const item = source.getItem();
	if (!this.singleEvent('TakeItem', item, source.itemState, source, source, move, item)) return false;
	if (!item.fling) return false;
	move.basePower = item.fling.basePower;
	this.debug('BP: ' + move.basePower);
	if (item.isBerry) {
	move.onHit = function (foe) {
	if (this.singleEvent('Eat', item, null, foe, null, null)) {
	this.runEvent('EatItem', foe, null, null, item);
	if (item.id === 'leppaberry') foe.staleness = 'external';
	}
	if (item.onEat) foe.ateBerry = true;
	};
	} else if (item.fling.effect) {
	move.onHit = item.fling.effect;
	} else {
	if (!move.secondaries) move.secondaries = [];
	if (item.fling.status) {
	move.secondaries.push({status: item.fling.status});
	} else if (item.fling.volatileStatus) {
	move.secondaries.push({volatileStatus: item.fling.volatileStatus});
	}
	}
	source.addVolatile('fling');
	},
	condition: {
	onUpdate(pokemon) {
	const item = pokemon.getItem();
	pokemon.setItem('');
	pokemon.lastItem = item.id;
	pokemon.usedItemThisTurn = true;
	this.add('-enditem', pokemon, item.name, '[from] move: Fling');
	this.runEvent('AfterUseItem', pokemon, null, null, item);
	pokemon.removeVolatile('fling');
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
foulplay: {	foulplay: {
accuracy:	accuracy: 95,
basePower:	basePower: 95,
category:	category: "Physical",
	name: "Foul Play",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	overrideOffensivePokemon: 'target',
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
honeclaws: {	honeclaws: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Hone Claws",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
atk: 1,	atk: 1,
accuracy:	accuracy: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Dark",	type: "Dark",
	},
	
hyperspacefury: {	hyperspacefury: {
accuracy:	accuracy: 90,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Hyperspace Fury",
	pp: 1.25,
priority:	priority: 0,
	flags: {mirror: 1,},
	breaksProtect: true,
	onTry(source) {
	if (source.species.name === 'Hoopa-Unbound') {
	return;
	}
	this.hint("Only a Pokemon whose form is Hoopa Unbound can use this move.");
	if (source.species.name === 'Hoopa') {
	this.attrLastMove('[still]');
	this.add('-fail', source, 'move: Hyperspace Fury', '[forme]');
	return null;
	}
	this.attrLastMove('[still]');
	this.add('-fail', source, 'move: Hyperspace Fury');
	return null;
	},
	self: {
	boosts: {
	def: -1,
	spd: -1,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
jawlock: {	jawlock: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Jaw Lock",
	pp: 1.25,
priority:	priority: 0,
	flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
	onHit(target, source, move) {
	source.addVolatile('trapped', target, move, 'trapper');
	target.addVolatile('trapped', source, move, 'trapper');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
knockoff: {	knockoff: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Physical",
	name: "Knock Off",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onBasePower(basePower, source, target, move) {
	const item = target.getItem();
	if (!this.singleEvent('TakeItem', item, target.itemState, target, target, move, item)) return;
	if (item.id) {
	return this.chainModify(1.5);
	}
	},
	onAfterHit(target, source) {
	if (source.hp) {
	const item = target.takeItem();
	if (item) {
	this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of] ' + source);
	}
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
kowtowcleave: {	kowtowcleave: {
accuracy:	accuracy: 95,
basePower:	basePower: 85,
category:	category: "Physical",
	name: "Kowtow Cleave",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
lashout: {	lashout: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Physical",
	name: "Lash Out",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onBasePower(basePower, source) {
	if (source.statsLoweredThisTurn) {
	this.debug('lashout buff');
	return this.chainModify(2);
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
maliciousmoonsault: {	maliciousmoonsault: {
accuracy:	accuracy: 80,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Malicious Moonsault",
	pp: 1,
priority:	priority: 0,
	flags: {contact: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
memento: {	memento: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Memento",
	pp: 1.25,
priority:	priority: 4,
	flags: {protect: 1, mirror: 1},
	boosts: {
	atk: -2,
	spa: -2,
	},
	selfdestruct: "ifHit",
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
nastyplot: {	nastyplot: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Nasty Plot",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	spa: 2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Dark",	type: "Dark",
	},
	
nightdaze: {	nightdaze: {
accuracy:	accuracy: 90,
basePower:	basePower: 85,
category:	category: "Special",
	name: "Night Daze",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 75,
boosts: {	boosts: {
accuracy:	accuracy: -1,
	},
	},
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
nightslash: {	nightslash: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Night Slash",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
obstruct: {	obstruct: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Obstruct",
	pp: 1.25,
priority:	priority: 4,
	flags: {failinstruct: 1},
	stallingMove: true,
	volatileStatus: 'obstruct',
	onPrepareHit(pokemon) {
	return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
	},
	onHit(pokemon) {
	pokemon.addVolatile('stall');
	},
	condition: {
	duration: 1,
	onStart(target) {
	this.add('-singleturn', target, 'Protect');
	},
	onTryHitPriority: 3,
	onTryHit(target, source, move) {
	if (!move.flags['protect'] || move.category === 'Status') {
	if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
	if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
	return;
	}
	if (move.smartTarget) {
	move.smartTarget = false;
	} else {
	this.add('-activate', target, 'move: Protect');
	}
	const lockedmove = source.getVolatile('lockedmove');
	if (lockedmove) {
	// Outrage counter is reset
	if (source.volatiles['lockedmove'].duration === 2) {
	delete source.volatiles['lockedmove'];
	}
	}
	if (this.checkMoveMakesContact(move, source, target)) {
	this.boost({def: -2}, source, target, this.dex.getActiveMove("Obstruct"));
	}
	return this.NOT_FAIL;
	},
	onHit(target, source, move) {
	if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
	this.boost({def: -2}, source, target, this.dex.getActiveMove("Obstruct"));
	}
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Dark",	type: "Dark",
	},
	
partingshot: {	partingshot: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Parting Shot",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1},
	onHit(target, source, move) {
	const success = this.boost({atk: -1, spa: -1}, target, source);
	if (!success && !target.hasAbility('mirrorarmor')) {
	delete move.selfSwitch;
	}
	},
	selfSwitch: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
payback: {	payback: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
	basePowerCallback(pokemon, target, move) {
	if (target.newlySwitched || this.queue.willMove(target)) {
	this.debug('Payback NOT boosted');
	return move.basePower;
	}
	this.debug('Payback damage boost');
	return move.basePower * 2;
	},
category:	category: "Physical",
	name: "Payback",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
powertrip: {	powertrip: {
accuracy:	accuracy: 95,
basePower:	basePower: 20,
	basePowerCallback(pokemon, target, move) {
	const bp = move.basePower + 20 * pokemon.positiveBoosts();
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Physical",
	name: "Power Trip",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
punishment: {	punishment: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon, target) {
	let power = 60 + 20 * target.positiveBoosts();
	if (power > 200) power = 200;
	this.debug('BP: ' + power);
	return power;
	},
category:	category: "Physical",
	name: "Punishment",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
pursuit: {	pursuit: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
	basePowerCallback(pokemon, target, move) {
	// You can't get here unless the pursuit succeeds
	if (target.beingCalledBack || target.switchFlag) {
	this.debug('Pursuit damage boost');
	return move.basePower * 2;
	}
	return move.basePower;
	},
category:	category: "Physical",
	name: "Pursuit",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	beforeTurnCallback(pokemon) {
	for (const side of this.sides) {
	if (side.hasAlly(pokemon)) continue;
	side.addSideCondition('pursuit', pokemon);
	const data = side.getSideConditionData('pursuit');
	if (!data.sources) {
	data.sources = [];
	}
	data.sources.push(pokemon);
	}
	},
	onModifyMove(move, source, target) {
	if (target?.beingCalledBack || target?.switchFlag) move.accuracy = true;
	},
	onTryHit(target, pokemon) {
	target.side.removeSideCondition('pursuit');
	},
	condition: {
	duration: 1,
	onBeforeSwitchOut(pokemon) {
	this.debug('Pursuit start');
	let alreadyAdded = false;
	pokemon.removeVolatile('destinybond');
	for (const source of this.effectState.sources) {
	if (!source.isAdjacent(pokemon) || !this.queue.cancelMove(source) || !source.hp) continue;
	if (!alreadyAdded) {
	this.add('-activate', pokemon, 'move: Pursuit');
	alreadyAdded = true;
	}
	// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
	// If it is, then Mega Evolve before moving.
	if (source.canMegaEvo || source.canUltraBurst) {
	for (const [actionIndex, action] of this.queue.entries()) {
	if (action.pokemon === source && action.choice === 'megaEvo') {
	this.actions.runMegaEvo(source);
	this.queue.list.splice(actionIndex, 1);
	break;
	}
	}
	}
	this.actions.runMove('pursuit', source, source.getLocOf(pokemon));
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
quash: {	quash: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Special",
	name: "Quash",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onHit(target) {
	if (this.activePerHalf === 1) return false; // fails in singles
	const action = this.queue.willMove(target);
	if (!action) return false;
	action.order = 201;
	this.add('-activate', target, 'move: Quash');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
ruination: {	ruination: {
accuracy:	accuracy: 90,
basePower:	basePower: 0,
	damageCallback(pokemon, target) {
	return this.clampIntRange(Math.floor(target.getUndynamaxedHP() / 2), 1);
	},
category:	category: "Special",
	name: "Ruination",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
snarl: {	snarl: {
accuracy:	accuracy: 95,
basePower:	basePower: 55,
category:	category: "Special",
	name: "Snarl",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spa: -1,
	atk: -1,
	},
	},
target:	target: "allAdjacentFoes",
type: "Dark",	type: "Dark",
	},
	
snatch: {	snatch: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Snatch",
	pp: 1.25,
priority:	priority: 4,
	flags: {bypasssub: 1, mustpressure: 1, noassist: 1, failcopycat: 1},
	volatileStatus: 'snatch',
	condition: {
	duration: 1,
	onStart(pokemon) {
	this.add('-singleturn', pokemon, 'Snatch');
	},
	onAnyPrepareHitPriority: -1,
	onAnyPrepareHit(source, target, move) {
	const snatchUser = this.effectState.source;
	if (snatchUser.isSkyDropped()) return;
	if (!move || move.isZ || move.isMax || !move.flags['snatch'] || move.sourceEffect === 'snatch') {
	return;
	}
	snatchUser.removeVolatile('snatch');
	this.add('-activate', snatchUser, 'move: Snatch', '[of] ' + source);
	this.actions.useMove(move.id, snatchUser);
	return null;
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Dark",	type: "Dark",
	},
	
suckerpunch: {	suckerpunch: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Sucker Punch",
	pp: 1.25,
priority:	priority: 1,
	flags: {contact: 1, protect: 1, mirror: 1},
	onTry(source, target) {
	const action = this.queue.willMove(target);
	const move = action?.choice === 'move' ? action.move : null;
	if (!move || (move.category === 'Status' && move.id !== 'mefirst') || target.volatiles['mustrecharge']) {
	return false;
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
switcheroo: {	switcheroo: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Switcheroo",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, allyanim: 1, noassist: 1, failcopycat: 1},
	onTryImmunity(target) {
	return !target.hasAbility('stickyhold');
	},
	onHit(target, source, move) {
	const yourItem = target.takeItem(source);
	const myItem = source.takeItem();
	if (target.item || source.item || (!yourItem && !myItem)) {
	if (yourItem) target.item = yourItem.id;
	if (myItem) source.item = myItem.id;
	return false;
	}
	if (
	(myItem && !this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem)) ||
	(yourItem && !this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem))
	) {
	if (yourItem) target.item = yourItem.id;
	if (myItem) source.item = myItem.id;
	return false;
	}
	this.add('-activate', source, 'move: Trick', '[of] ' + target);
	if (myItem) {
	target.setItem(myItem);
	this.add('-item', target, myItem, '[from] move: Switcheroo');
	} else {
	this.add('-enditem', target, yourItem, '[silent]', '[from] move: Switcheroo');
	}
	if (yourItem) {
	source.setItem(yourItem);
	this.add('-item', source, yourItem, '[from] move: Switcheroo');
	} else {
	this.add('-enditem', source, myItem, '[silent]', '[from] move: Switcheroo');
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
taunt: {	taunt: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Taunt",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, bypasssub: 1},
	volatileStatus: 'taunt',
	condition: {
	duration: 3,
	onStart(target) {
	if (target.activeTurns && !this.queue.willMove(target)) {
	this.effectState.duration++;
	}
	this.add('-start', target, 'move: Taunt');
	},
	onResidualOrder: 15,
	onEnd(target) {
	this.add('-end', target, 'move: Taunt');
	},
	onDisableMove(pokemon) {
	for (const moveSlot of pokemon.moveSlots) {
	const move = this.dex.moves.get(moveSlot.id);
	if (move.category === 'Status' && move.id !== 'mefirst') {
	pokemon.disableMove(moveSlot.id);
	}
	}
	},
	onBeforeMovePriority: 5,
	onBeforeMove(attacker, defender, move) {
	if (!move.isZ && !move.isMax && move.category === 'Status' && move.id !== 'mefirst') {
	this.add('cant', attacker, 'move: Taunt', move);
	return false;
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
thief: {	thief: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Thief",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, failmefirst: 1, noassist: 1, failcopycat: 1},
	onAfterHit(target, source, move) {
	if (source.item || source.volatiles['gem']) {
	return;
	}
	const yourItem = target.takeItem(source);
	if (!yourItem) {
	return;
	}
	if (!this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem) ||
	!source.setItem(yourItem)) {
	target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
	return;
	}
	this.add('-enditem', target, yourItem, '[silent]', '[from] move: Thief', '[of] ' + source);
	this.add('-item', source, yourItem, '[from] move: Thief', '[of] ' + target);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
throatchop: {	throatchop: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Throat Chop",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	condition: {
	duration: 2,
	onStart(target) {
	this.add('-start', target, 'Throat Chop', '[silent]');
	},
	onDisableMove(pokemon) {
	for (const moveSlot of pokemon.moveSlots) {
	if (this.dex.moves.get(moveSlot.id).flags['sound']) {
	pokemon.disableMove(moveSlot.id);
	}
	}
	},
	onBeforeMovePriority: 6,
	onBeforeMove(pokemon, target, move) {
	if (!move.isZ && !move.isMax && move.flags['sound']) {
	this.add('cant', pokemon, 'move: Throat Chop');
	return false;
	}
	},
	onModifyMove(move, pokemon, target) {
	if (!move.isZ && !move.isMax && move.flags['sound']) {
	this.add('cant', pokemon, 'move: Throat Chop');
	return false;
	}
	},
	onResidualOrder: 22,
	onEnd(target) {
	this.add('-end', target, 'Throat Chop', '[silent]');
	},
	},
secondary:	secondary: {
	chance: 100,
	onHit(target) {
	target.addVolatile('throatchop');
	},
	},
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
topsyturvy: {	topsyturvy: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Topsy-Turvy",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	onHit(target) {
	let success = false;
	let i: BoostID;
	for (i in target.boosts) {
	if (target.boosts[i] === 0) continue;
	target.boosts[i] = -target.boosts[i];
	success = true;
	}
	if (!success) return false;
	this.add('-invertboost', target, '[from] move: Topsy-Turvy');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
torment: {	torment: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Torment",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, bypasssub: 1},
	volatileStatus: 'torment',
	condition: {
	noCopy: true,
	onStart(pokemon, source, effect) {
	if (pokemon.volatiles['dynamax']) {
	delete pokemon.volatiles['torment'];
	return false;
	}
	if (effect?.id === 'gmaxmeltdown') this.effectState.duration = 3;
	this.add('-start', pokemon, 'Torment');
	},
	onEnd(pokemon) {
	this.add('-end', pokemon, 'Torment');
	},
	onDisableMove(pokemon) {
	if (pokemon.lastMove && pokemon.lastMove.id !== 'struggle') pokemon.disableMove(pokemon.lastMove.id);
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
wickedblow: {	wickedblow: {
accuracy:	accuracy: 90,
basePower:	basePower: 45,
category:	category: "Physical",
	name: "Wicked Blow",
	pp: 1.25,
priority:	priority: 2,
	flags: {contact: 1, protect: 1, punch: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
wickedtorque: {	wickedtorque: {
accuracy:	accuracy: 95,
basePower:	basePower: 35,
category:	category: "Special",
	name: "Wicked Torque",
	pp: 1.25,
priority:	priority: 2,
	flags: {
	protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
	},
secondary:	secondary: {
	chance: 50,
	status: 'slp',
	},
target:	target: "normal",
type: "Dark",	type: "Dark",
	},
	
breakingswipe: {	breakingswipe: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Breaking Swipe",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	atk: -1,
	},
	},
target:	target: "allAdjacentFoes",
type: "Dragon",	type: "Dragon",
	},
	
clangingscales: {	clangingscales: {
accuracy:	accuracy: 95,
basePower:	basePower: 110,
category:	category: "Special",
	name: "Clanging Scales",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
	selfBoost: {
	boosts: {
	def: -1,
	},
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Dragon",	type: "Dragon",
	},
	
clangoroussoul: {	clangoroussoul: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Clangorous Soul",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, sound: 1, dance: 1},
	onTry(source) {
	if (source.hp <= (source.maxhp * 33 / 100) || source.maxhp === 1) return false;
	},
	onTryHit(pokemon, target, move) {
	if (!this.boost(move.boosts as SparseBoostsTable)) return null;
	delete move.boosts;
	},
	onHit(pokemon) {
	this.directDamage(pokemon.maxhp * 33 / 100);
	},
	boosts: {
	atk: 1,
	def: 1,
	spa: 1,
	spd: 1,
	spe: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Dragon",	type: "Dragon",
	},
	
clangoroussoulblaze: {	clangoroussoulblaze: {
accuracy:	accuracy: 80,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Clangorous Soulblaze",
	pp: 1,
priority:	priority: 0,
	flags: {sound: 1, bypasssub: 1},
	selfBoost: {
	boosts: {
	atk: 1,
	def: 1,
	spa: 1,
	spd: 1,
	spe: 1,
	},
	},
secondary:	secondary: {
	// Sheer Force negates the selfBoost even though it is not secondary
	},
target:	target: "allAdjacentFoes",
type: "Dragon",	type: "Dragon",
	},
	
coreenforcer: {	coreenforcer: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Core Enforcer",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onHit(target) {
	if (target.getAbility().isPermanent) return;
	if (target.newlySwitched || this.queue.willMove(target)) return;
	target.addVolatile('gastroacid');
	},
	onAfterSubDamage(damage, target) {
	if (target.getAbility().isPermanent) return;
	if (target.newlySwitched || this.queue.willMove(target)) return;
	target.addVolatile('gastroacid');
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Dragon",	type: "Dragon",
	},
	
devastatingdrake: {	devastatingdrake: {
accuracy:	accuracy: 60,
basePower:	basePower: 200,
category:	category: "Physical",
	name: "Devastating Drake",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
dracometeor: {	dracometeor: {
accuracy:	accuracy: 80,
basePower:	basePower: 110,
category:	category: "Special",
	name: "Draco Meteor",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	self: {
	boosts: {
	spa: -2,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
dragonbreath: {	dragonbreath: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Special",
	name: "Dragon Breath",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 50,
	status: 'par',
	},
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
dragonclaw: {	dragonclaw: {
accuracy:	accuracy: 90,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Dragon Claw",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
dragondance: {	dragondance: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Dragon Dance",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, dance: 1},
	boosts: {
	atk: 1,
	spe: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Dragon",	type: "Dragon",
	},
	
dragondarts: {	dragondarts: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Dragon Darts",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, noparentalbond: 1},
	multihit: 2,
	smartTarget: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
dragonenergy: {	dragonenergy: {
accuracy:	accuracy: 80,
basePower:	basePower: 120,
	basePowerCallback(pokemon, target, move) {
	const bp = move.basePower * pokemon.hp / pokemon.maxhp;
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Special",
	name: "Dragon Energy",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Dragon",	type: "Dragon",
	},
	
dragonhammer: {	dragonhammer: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Dragon Hammer",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
dragonpulse: {	dragonpulse: {
accuracy:	accuracy: 85,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Dragon Pulse",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, pulse: 1, mirror: 1, distance: 1},
secondary:	secondary: null,
target:	target: "any",
type: "Dragon",	type: "Dragon",
	},
	
dragonrage: {	dragonrage: {
accuracy:	accuracy: 95,
basePower:	basePower: 35,
category:	category: "Special",
	name: "Dragon Rage",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
dragonrush: {	dragonrush: {
accuracy:	accuracy: 75,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Dragon Rush",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 20,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
dragontail: {	dragontail: {
accuracy:	accuracy: 90,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Dragon Tail",
	pp: 1.25,
priority:	priority: -6,
	flags: {contact: 1, protect: 1, mirror: 1, noassist: 1, failcopycat: 1},
	forceSwitch: true,
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
dualchop: {	dualchop: {
accuracy:	accuracy: 90,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "Dual Chop",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	multihit: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
eternabeam: {	eternabeam: {
accuracy:	accuracy: 90,
basePower:	basePower: 150,
category:	category: "Special",
	name: "Eternabeam",
	pp: 1.25,
priority:	priority: 0,
	flags: {recharge: 1, protect: 1, mirror: 1},
	self: {
	volatileStatus: 'mustrecharge',
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
glaiverush: {	glaiverush: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Glaive Rush",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	self: {
	volatileStatus: 'glaiverush',
	},
	condition: {
	noCopy: true,
	onStart(pokemon) {
	this.add('-singlemove', pokemon, 'Glaive Rush', '[silent]');
	},
	onAccuracy() {
	return true;
	},
	onSourceModifyDamage() {
	return this.chainModify(2);
	},
	onBeforeMovePriority: 100,
	onBeforeMove(pokemon) {
	this.debug('removing Glaive Rush drawback before attack');
	pokemon.removeVolatile('glaiverush');
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
orderup: {	orderup: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Order Up",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1},
	onAfterMoveSecondarySelf(pokemon, target, move) {
	if (!pokemon.volatiles['commanded']) return;
	const tatsugiri = pokemon.volatiles['commanded'].source;
	if (tatsugiri.baseSpecies.baseSpecies !== 'Tatsugiri') return; // Should never happen
	switch (tatsugiri.baseSpecies.forme) {
	case 'Droopy':
	this.boost({def: 1}, pokemon, pokemon);
	break;
	case 'Stretchy':
	this.boost({spe: 1}, pokemon, pokemon);
	break;
	default:
	this.boost({atk: 1}, pokemon, pokemon);
	break;
	}
	},
secondary:	secondary: null,
	hasSheerForce: true,
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
outrage: {	outrage: {
accuracy:	accuracy: 75,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Outrage",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, failinstruct: 1},
	self: {
	volatileStatus: 'lockedmove',
	},
	onAfterMove(pokemon) {
	if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
	pokemon.removeVolatile('lockedmove');
	}
	},
secondary:	secondary: null,
target:	target: "randomNormal",
type: "Dragon",	type: "Dragon",
	},
	
roaroftime: {	roaroftime: {
accuracy:	accuracy: 90,
basePower:	basePower: 150,
category:	category: "Special",
	name: "Roar of Time",
	pp: 1.25,
priority:	priority: 0,
	flags: {recharge: 1, protect: 1, mirror: 1},
	self: {
	volatileStatus: 'mustrecharge',
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
scaleshot: {	scaleshot: {
accuracy:	accuracy: 90,
basePower:	basePower: 5,
category:	category: "Physical",
	name: "Scale Shot",
	pp: 1.25,
priority:	priority: 1,
	flags: {protect: 1, mirror: 1},
	multihit: [2, 5],
	selfBoost: {
	boosts: {
	def: -1,
	spe: 1,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
spacialrend: {	spacialrend: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Spacial Rend",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Dragon",	type: "Dragon",
	},
	
twister: {	twister: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Special",
	name: "Twister",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, wind: 1},
secondary:	secondary: {
	chance: 20,
	volatileStatus: 'flinch',
	},
target:	target: "allAdjacentFoes",
type: "Dragon",	type: "Dragon",
	},
	
"10000000voltthunderbolt": {	"10000000voltthunderbolt": {
accuracy:	accuracy: 75,
	    
category:	category: "Special",
	name: "10,000,000 Volt Thunderbolt",
	pp: 1,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, noparentalbond: 1},
	selfdestruct: "always",
critRatio:	critRatio: 4,
secondary:	secondary: null,
target:	target: "all",
type: "Electric",	type: "Electric",
	},
	
aurawheel: {	aurawheel: {
accuracy:	accuracy: 95,
basePower:	basePower: 110,
category:	category: "Physical",
	name: "Aura Wheel",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	self: {
	boosts: {
	spe: 1,
	},
	},
	},
	onTry(source) {
	if (source.species.baseSpecies === 'Morpeko') {
	return;
	}
	this.attrLastMove('[still]');
	this.add('-fail', source, 'move: Aura Wheel');
	this.hint("Only a Pokemon whose form is Morpeko or Morpeko-Hangry can use this move.");
	return null;
	},
	onModifyType(move, pokemon) {
	if (pokemon.species.name === 'Morpeko-Hangry') {
	move.type = 'Dark';
	} else {
	move.type = 'Electric';
	}
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
boltbeak: {	boltbeak: {
accuracy:	accuracy: 95,
basePower:	basePower: 85,
	basePowerCallback(pokemon, target, move) {
	if (target.newlySwitched || this.queue.willMove(target)) {
	this.debug('Bolt Beak damage boost');
	return move.basePower * 2;
	}
	this.debug('Bolt Beak NOT boosted');
	return move.basePower;
	},
category:	category: "Physical",
	name: "Bolt Beak",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
boltstrike: {	boltstrike: {
accuracy:	accuracy: 85,
basePower:	basePower: 130,
category:	category: "Physical",
	name: "Bolt Strike",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 20,
	status: 'par',
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
buzzybuzz: {	buzzybuzz: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Special",
	name: "Buzzy Buzz",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	status: 'par',
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
catastropika: {	catastropika: {
accuracy:	accuracy: 95,
basePower:	basePower: 210,
category:	category: "Physical",
	name: "Catastropika",
	pp: 1,
priority:	priority: 0,
	flags: {contact: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
charge: {	charge: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Charge",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	volatileStatus: 'charge',
	condition: {
	onStart(pokemon, source, effect) {
	if (effect && ['Electromorphosis', 'Wind Power'].includes(effect.name)) {
	this.add('-start', pokemon, 'Charge', this.activeMove!.name, '[from] ability: ' + effect.name);
	} else {
	this.add('-start', pokemon, 'Charge');
	}
	},
	onRestart(pokemon, source, effect) {
	if (effect && ['Electromorphosis', 'Wind Power'].includes(effect.name)) {
	this.add('-start', pokemon, 'Charge', this.activeMove!.name, '[from] ability: ' + effect.name);
	} else {
	this.add('-start', pokemon, 'Charge');
	}
	},
	onBasePowerPriority: 9,
	onBasePower(basePower, attacker, defender, move) {
	if (move.type === 'Electric') {
	this.debug('charge boost');
	return this.chainModify(2);
	}
	},
	onMoveAborted(pokemon, target, move) {
	if (move.type === 'Electric' && move.id !== 'charge') {
	pokemon.removeVolatile('charge');
	}
	},
	onAfterMove(pokemon, target, move) {
	if (move.type === 'Electric' && move.id !== 'charge') {
	pokemon.removeVolatile('charge');
	}
	},
	onEnd(pokemon) {
	this.add('-end', pokemon, 'Charge', '[silent]');
	},
	},
	boosts: {
	spd: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Electric",	type: "Electric",
	},
	
chargebeam: {	chargebeam: {
accuracy:	accuracy: 90,
basePower:	basePower: 50,
category:	category: "Special",
	name: "Charge Beam",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 70,
	self: {
	boosts: {
	spa: 1,
	},
	},
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
discharge: {	discharge: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Discharge",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	status: 'par',
	},
target:	target: "allAdjacent",
type: "Electric",	type: "Electric",
	},
	
doubleshock: {	doubleshock: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Double Shock",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onTryMove(pokemon, target, move) {
	if (pokemon.hasType('Electric')) return;
	this.add('-fail', pokemon, 'move: Double Shock');
	this.attrLastMove('[still]');
	return null;
	},
	self: {
	onHit(pokemon) {
	pokemon.setType(pokemon.getTypes(true).map(type => type === "Electric" ? "???" : type));
	this.add('-start', pokemon, 'typechange', pokemon.getTypes().join('/'), '[from] move: Double Shock');
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
eerieimpulse: {	eerieimpulse: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Eerie Impulse",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	boosts: {
	spa: -2,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
electricterrain: {	electricterrain: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Electric Terrain",
	pp: 1.25,
priority:	priority: 0,
	flags: {nonsky: 1},
	terrain: 'electricterrain',
	condition: {
	duration: 5,
	durationCallback(source, effect) {
	if (source?.hasItem('terrainextender')) {
	return 8;
	}
	return 5;
	},
	onSetStatus(status, target, source, effect) {
	if (status.id === 'slp' && target.isGrounded() && !target.isSemiInvulnerable()) {
	if (effect.id === 'yawn' || (effect.effectType === 'Move' && !effect.secondaries)) {
	this.add('-activate', target, 'move: Electric Terrain');
	}
	return false;
	}
	},
	onTryAddVolatile(status, target) {
	if (!target.isGrounded() || target.isSemiInvulnerable()) return;
	if (status.id === 'yawn') {
	this.add('-activate', target, 'move: Electric Terrain');
	return null;
	}
	},
	onBasePowerPriority: 6,
	onBasePower(basePower, attacker, defender, move) {
	if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
	this.debug('electric terrain boost');
	return this.chainModify([5325, 4096]);
	}
	},
	onFieldStart(field, source, effect) {
	if (effect?.effectType === 'Ability') {
	this.add('-fieldstart', 'move: Electric Terrain', '[from] ability: ' + effect.name, '[of] ' + source);
	} else {
	this.add('-fieldstart', 'move: Electric Terrain');
	}
	},
	onFieldResidualOrder: 27,
	onFieldResidualSubOrder: 7,
	onFieldEnd() {
	this.add('-fieldend', 'move: Electric Terrain');
	},
	},
secondary:	secondary: null,
target:	target: "all",
type: "Electric",	type: "Electric",
	},
	
electrify: {	electrify: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Electrify",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, allyanim: 1},
	volatileStatus: 'electrify',
	onTryHit(target) {
	if (!this.queue.willMove(target) && target.activeTurns) return false;
	},
	condition: {
	duration: 1,
	onStart(target) {
	this.add('-singleturn', target, 'move: Electrify');
	},
	onModifyTypePriority: -2,
	onModifyType(move) {
	if (move.id !== 'struggle') {
	this.debug('Electrify making move type electric');
	move.type = 'Electric';
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
electroball: {	electroball: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon, target) {
	let ratio = Math.floor(pokemon.getStat('spe') / target.getStat('spe'));
	if (!isFinite(ratio)) ratio = 0;
	const bp = [40, 60, 80, 120, 150][Math.min(ratio, 4)];
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Special",
	name: "Electro Ball",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
electrodrift: {	electrodrift: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Electro Drift",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onBasePower(basePower, source, target, move) {
	if (target.runEffectiveness(move) > 0) {
	// Placeholder
	this.debug(`electro drift super effective buff`);
	return this.chainModify([5461, 4096]);
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
electroweb: {	electroweb: {
accuracy:	accuracy: 95,
basePower:	basePower: 55,
category:	category: "Special",
	name: "Electroweb",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spe: -1,
	},
	},
target:	target: "allAdjacentFoes",
type: "Electric",	type: "Electric",
	},
	
fusionbolt: {	fusionbolt: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Fusion Bolt",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onBasePower(basePower, pokemon) {
	if (this.lastSuccessfulMoveThisTurn === 'fusionflare') {
	this.debug('double power');
	return this.chainModify(2);
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
gigavolthavoc: {	gigavolthavoc: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "Gigavolt Havoc",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
iondeluge: {	iondeluge: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Ion Deluge",
	pp: 1.25,
priority:	priority: 1,
	flags: {},
	pseudoWeather: 'iondeluge',
	condition: {
	duration: 1,
	onFieldStart(target, source, sourceEffect) {
	this.add('-fieldactivate', 'move: Ion Deluge');
	this.hint(`Normal-type moves become Electric-type after using ${sourceEffect}.`);
	},
	onModifyTypePriority: -2,
	onModifyType(move) {
	if (move.type === 'Normal') {
	move.type = 'Electric';
	this.debug(move.name + "'s type changed to Electric");
	}
	},
	},
secondary:	secondary: null,
target:	target: "all",
type: "Electric",	type: "Electric",
	},
	
magneticflux: {	magneticflux: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Magnetic Flux",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, distance: 1, bypasssub: 1},
	onHitSide(side, source, move) {
	const targets = side.allies().filter(ally => (
	ally.hasAbility(['plus', 'minus']) &&
	(!ally.volatiles['maxguard'] || this.runEvent('TryHit', ally, source, move))
	));
	if (!targets.length) return false;
	let didSomething = false;
	for (const target of targets) {
	didSomething = this.boost({def: 1, spd: 1}, target, source, move, false, true) || didSomething;
	}
	return didSomething;
	},
secondary:	secondary: null,
target:	target: "allySide",
type: "Electric",	type: "Electric",
	},
	
magnetrise: {	magnetrise: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Magnet Rise",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, gravity: 1},
	volatileStatus: 'magnetrise',
	onTry(source, target, move) {
	if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;
	// Additional Gravity check for Z-move variant
	if (this.field.getPseudoWeather('Gravity')) {
	this.add('cant', source, 'move: Gravity', move);
	return null;
	}
	},
	condition: {
	duration: 5,
	onStart(target) {
	this.add('-start', target, 'Magnet Rise');
	},
	onImmunity(type) {
	if (type === 'Ground') return false;
	},
	onResidualOrder: 18,
	onEnd(target) {
	this.add('-end', target, 'Magnet Rise');
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Electric",	type: "Electric",
	},
	
nuzzle: {	nuzzle: {
accuracy:	accuracy: 95,
basePower:	basePower: 20,
category:	category: "Physical",
	name: "Nuzzle",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	status: 'par',
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
overdrive: {	overdrive: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Overdrive",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Electric",	type: "Electric",
	},
	
paraboliccharge: {	paraboliccharge: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Special",
	name: "Parabolic Charge",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, heal: 1},
	drain: [1, 2],
secondary:	secondary: null,
target:	target: "allAdjacent",
type: "Electric",	type: "Electric",
	},
	
pikapapow: {	pikapapow: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon) {
	const bp = Math.floor((pokemon.happiness * 10) / 25) || 1;
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Special",
	name: "Pika Papow",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
plasmafists: {	plasmafists: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Plasma Fists",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
	pseudoWeather: 'iondeluge',
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
risingvoltage: {	risingvoltage: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
	basePowerCallback(source, target, move) {
	if (this.field.isTerrain('electricterrain') && target.isGrounded()) {
	if (!source.isAlly(target)) this.hint(`${move.name}'s BP doubled on grounded target.`);
	return move.basePower * 2;
	}
	return move.basePower;
	},
category:	category: "Special",
	name: "Rising Voltage",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
shockwave: {	shockwave: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Special",
	name: "Shock Wave",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
spark: {	spark: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Physical",
	name: "Spark",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	status: 'par',
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
stokedsparksurfer: {	stokedsparksurfer: {
accuracy:	accuracy: 95,
basePower:	basePower: 175,
category:	category: "Special",
	name: "Stoked Sparksurfer",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: {
	chance: 100,
	status: 'par',
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
thunder: {	thunder: {
accuracy:	accuracy: 70,
basePower:	basePower: 110,
category:	category: "Special",
	name: "Thunder",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onModifyMove(move, pokemon, target) {
	switch (target?.effectiveWeather()) {
	case 'raindance':
	case 'primordialsea':
	move.accuracy = true;
	break;
	case 'sunnyday':
	case 'desolateland':
	move.accuracy = 50;
	break;
	}
	},
secondary:	secondary: {
	chance: 30,
	status: 'par',
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
thunderbolt: {	thunderbolt: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Thunderbolt",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	status: 'par',
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
thundercage: {	thundercage: {
accuracy:	accuracy: 90,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Thunder Cage",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	volatileStatus: 'partiallytrapped',
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
thunderfang: {	thunderfang: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Physical",
	name: "Thunder Fang",
	pp: 1.25,
priority:	priority: 0,
	flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
	secondaries: [
	{
	chance: 10,
	status: 'par',
	}, {
	chance: 10,
	volatileStatus: 'flinch',
	},
	],
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
thunderpunch: {	thunderpunch: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Physical",
	name: "Thunder Punch",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
secondary:	secondary: {
	chance: 10,
	status: 'par',
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
thundershock: {	thundershock: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Special",
	name: "Thunder Shock",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	status: 'par',
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
thunderwave: {	thunderwave: {
accuracy:	accuracy: 90,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Thunder Wave",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	status: 'par',
	ignoreImmunity: false,
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
voltswitch: {	voltswitch: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Special",
	name: "Volt Switch",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	selfSwitch: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
volttackle: {	volttackle: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Volt Tackle",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	recoil: [33, 100],
secondary:	secondary: {
	chance: 10,
	status: 'par',
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
wildboltstorm: {	wildboltstorm: {
accuracy:	accuracy: 80,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Wildbolt Storm",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, wind: 1},
secondary:	secondary: {
	chance: 20,
	status: 'par',
	},
target:	target: "allAdjacentFoes",
type: "Electric",	type: "Electric",
	},
	
wildcharge: {	wildcharge: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Wild Charge",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	recoil: [1, 4],
secondary:	secondary: null,
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
zapcannon: {	zapcannon: {
accuracy:	accuracy: 50,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Zap Cannon",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	status: 'par',
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
zingzap: {	zingzap: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Zing Zap",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
zippyzap: {	zippyzap: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Zippy Zap",
	pp: 1.25,
priority:	priority: 2,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	self: {
	boosts: {
	evasion: 1,
	},
	},
	},
target:	target: "normal",
type: "Electric",	type: "Electric",
	},
	
aromaticmist: {	aromaticmist: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Aromatic Mist",
	pp: 1.25,
priority:	priority: 0,
	flags: {bypasssub: 1},
	boosts: {
	spd: 1,
	},
secondary:	secondary: null,
target:	target: "adjacentAlly",
type: "Fairy",	type: "Fairy",
	},
	
babydolleyes: {	babydolleyes: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Baby-Doll Eyes",
	pp: 1.25,
priority:	priority: 1,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	boosts: {
	atk: -1,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
charm: {	charm: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Charm",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	boosts: {
	atk: -2,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
craftyshield: {	craftyshield: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Crafty Shield",
	pp: 1.25,
priority:	priority: 3,
	flags: {},
	sideCondition: 'craftyshield',
	onTry() {
	return !!this.queue.willAct();
	},
	condition: {
	duration: 1,
	onSideStart(target, source) {
	this.add('-singleturn', source, 'Crafty Shield');
	},
	onTryHitPriority: 3,
	onTryHit(target, source, move) {
	if (['self', 'all'].includes(move.target) || move.category !== 'Status') return;
	this.add('-activate', target, 'move: Crafty Shield');
	return this.NOT_FAIL;
	},
	},
secondary:	secondary: null,
target:	target: "allySide",
type: "Fairy",	type: "Fairy",
	},
	
dazzlinggleam: {	dazzlinggleam: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Dazzling Gleam",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Fairy",	type: "Fairy",
	},
	
decorate: {	decorate: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Decorate",
	pp: 1.25,
priority:	priority: 0,
	flags: {allyanim: 1},
secondary:	secondary: null,
	boosts: {
	atk: 2,
	spa: 2,
	},
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
disarmingvoice: {	disarmingvoice: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Special",
	name: "Disarming Voice",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Fairy",	type: "Fairy",
	},
	
drainingkiss: {	drainingkiss: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Draining Kiss",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
	drain: [3, 4],
secondary:	secondary: null,
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
fairylock: {	fairylock: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Fairy Lock",
	pp: 1.25,
priority:	priority: 0,
	flags: {mirror: 1, bypasssub: 1},
	pseudoWeather: 'fairylock',
	condition: {
	duration: 2,
	onFieldStart(target) {
	this.add('-fieldactivate', 'move: Fairy Lock');
	},
	onTrapPokemon(pokemon) {
	pokemon.tryTrap();
	},
	},
secondary:	secondary: null,
target:	target: "all",
type: "Fairy",	type: "Fairy",
	},
	
fairywind: {	fairywind: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Special",
	name: "Fairy Wind",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, wind: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
fleurcannon: {	fleurcannon: {
accuracy:	accuracy: 90,
basePower:	basePower: 130,
category:	category: "Special",
	name: "Fleur Cannon",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	self: {
	boosts: {
	spa: -2,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
floralhealing: {	floralhealing: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Floral Healing",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, heal: 1, allyanim: 1},
	onHit(target, source) {
	let success = false;
	if (this.field.isTerrain('grassyterrain')) {
	success = !!this.heal(this.modify(target.baseMaxhp, 0.667));
	} else {
	success = !!this.heal(Math.ceil(target.baseMaxhp * 0.5));
	}
	if (success && !target.isAlly(source)) {
	target.staleness = 'external';
	}
	if (!success) {
	this.add('-fail', target, 'heal');
	return this.NOT_FAIL;
	}
	return success;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
flowershield: {	flowershield: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Flower Shield",
	pp: 1.25,
priority:	priority: 0,
	flags: {distance: 1},
	onHitField(t, source, move) {
	const targets: Pokemon[] = [];
	for (const pokemon of this.getAllActive()) {
	if (
	pokemon.hasType('Grass') &&
	(!pokemon.volatiles['maxguard'] ||
	this.runEvent('TryHit', pokemon, source, move))
	) {
	// This move affects every Grass-type Pokemon in play.
	targets.push(pokemon);
	}
	}
	let success = false;
	for (const target of targets) {
	success = this.boost({def: 1}, target, source, move) || success;
	}
	return success;
	},
secondary:	secondary: null,
target:	target: "all",
type: "Fairy",	type: "Fairy",
	},
	
geomancy: {	geomancy: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Geomancy",
	pp: 1.25,
priority:	priority: 0,
	flags: {charge: 1, nonsky: 1, nosleeptalk: 1, failinstruct: 1},
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	this.add('-prepare', attacker, move.name);
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
	boosts: {
	spa: 2,
	spd: 2,
	spe: 2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Fairy",	type: "Fairy",
	},
	
guardianofalola: {	guardianofalola: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	damageCallback(pokemon, target) {
	const hp75 = Math.floor(target.getUndynamaxedHP() * 3 / 4);
	if (
	target.volatiles['protect'] || target.volatiles['banefulbunker'] || target.volatiles['kingsshield'] ||
	target.volatiles['spikyshield'] || target.side.getSideCondition('matblock')
	) {
	this.add('-zbroken', target);
	return this.clampIntRange(Math.ceil(hp75 / 4 - 0.5), 1);
	}
	return this.clampIntRange(hp75, 1);
	},
category:	category: "Special",
	name: "Guardian of Alola",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
letssnuggleforever: {	letssnuggleforever: {
accuracy:	accuracy: 95,
basePower:	basePower: 190,
category:	category: "Physical",
	name: "Let's Snuggle Forever",
	pp: 1,
priority:	priority: 0,
	flags: {contact: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
lightofruin: {	lightofruin: {
accuracy:	accuracy: 90,
basePower:	basePower: 140,
category:	category: "Special",
	name: "Light of Ruin",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	recoil: [1, 2],
secondary:	secondary: null,
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
magicaltorque: {	magicaltorque: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Magical Torque",
	pp: 1.25,
priority:	priority: 0,
	flags: {
	protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
	},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'confusion',
	},
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
mistyexplosion: {	mistyexplosion: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Misty Explosion",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	selfdestruct: "always",
	onBasePower(basePower, source) {
	if (this.field.isTerrain('mistyterrain') && source.isGrounded()) {
	this.debug('misty terrain boost');
	return this.chainModify(1.5);
	}
	},
secondary:	secondary: null,
target:	target: "allAdjacent",
type: "Fairy",	type: "Fairy",
	},
	
mistyterrain: {	mistyterrain: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Misty Terrain",
	pp: 1.25,
priority:	priority: 0,
	flags: {nonsky: 1},
	terrain: 'mistyterrain',
	condition: {
	duration: 5,
	durationCallback(source, effect) {
	if (source?.hasItem('terrainextender')) {
	return 8;
	}
	return 5;
	},
	onSetStatus(status, target, source, effect) {
	if (!target.isGrounded() || target.isSemiInvulnerable()) return;
	if (effect && ((effect as Move).status || effect.id === 'yawn')) {
	this.add('-activate', target, 'move: Misty Terrain');
	}
	return false;
	},
	onTryAddVolatile(status, target, source, effect) {
	if (!target.isGrounded() || target.isSemiInvulnerable()) return;
	if (status.id === 'confusion') {
	if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Misty Terrain');
	return null;
	}
	},
	onBasePowerPriority: 6,
	onBasePower(basePower, attacker, defender, move) {
	if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
	this.debug('misty terrain weaken');
	return this.chainModify(0.5);
	}
	},
	onFieldStart(field, source, effect) {
	if (effect?.effectType === 'Ability') {
	this.add('-fieldstart', 'move: Misty Terrain', '[from] ability: ' + effect.name, '[of] ' + source);
	} else {
	this.add('-fieldstart', 'move: Misty Terrain');
	}
	},
	onFieldResidualOrder: 27,
	onFieldResidualSubOrder: 7,
	onFieldEnd() {
	this.add('-fieldend', 'Misty Terrain');
	},
	},
secondary:	secondary: null,
target:	target: "all",
type: "Fairy",	type: "Fairy",
	},
	
moonblast: {	moonblast: {
accuracy:	accuracy: 95,
basePower:	basePower: 95,
category:	category: "Special",
	name: "Moonblast",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	boosts: {
	spa: -1,
	},
	},
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
moonlight: {	moonlight: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Moonlight",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	onHit(pokemon) {
	let factor = 0.5;
	switch (pokemon.effectiveWeather()) {
	case 'sunnyday':
	case 'desolateland':
	factor = 0.667;
	break;
	case 'raindance':
	case 'primordialsea':
	case 'sandstorm':
	case 'hail':
	case 'snow':
	factor = 0.25;
	break;
	}
	const success = !!this.heal(this.modify(pokemon.maxhp, factor));
	if (!success) {
	this.add('-fail', pokemon, 'heal');
	return this.NOT_FAIL;
	}
	return success;
	},
secondary:	secondary: null,
target:	target: "self",
type: "Fairy",	type: "Fairy",
	},
	
naturesmadness: {	naturesmadness: {
accuracy:	accuracy: 90,
basePower:	basePower: 0,
	damageCallback(pokemon, target) {
	return this.clampIntRange(Math.floor(target.getUndynamaxedHP() / 2), 1);
	},
category:	category: "Special",
	name: "Nature's Madness",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
playrough: {	playrough: {
accuracy:	accuracy: 90,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Play Rough",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	boosts: {
	atk: -1,
	},
	},
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
sparklyswirl: {	sparklyswirl: {
accuracy:	accuracy: 85,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Sparkly Swirl",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	self: {
	onHit(pokemon, source, move) {
	this.add('-activate', source, 'move: Aromatherapy');
	for (const ally of source.side.pokemon) {
	if (ally !== source && (ally.volatiles['substitute'] && !move.infiltrates)) {
	continue;
	}
	ally.cureStatus();
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
spiritbreak: {	spiritbreak: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Physical",
	name: "Spirit Break",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spa: -1,
	},
	},
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
springtidestorm: {	springtidestorm: {
accuracy:	accuracy: 80,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Springtide Storm",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, wind: 1},
secondary:	secondary: {
	chance: 30,
	boosts: {
	atk: -1,
	},
	},
target:	target: "allAdjacentFoes",
type: "Fairy",	type: "Fairy",
	},
	
strangesteam: {	strangesteam: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Strange Steam",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 20,
	volatileStatus: 'confusion',
	},
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
sweetkiss: {	sweetkiss: {
accuracy:	accuracy: 75,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Sweet Kiss",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	volatileStatus: 'confusion',
secondary:	secondary: null,
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
twinkletackle: {	twinkletackle: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "Twinkle Tackle",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Fairy",	type: "Fairy",
	},
	
alloutpummeling: {	alloutpummeling: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "All-Out Pummeling",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
armthrust: {	armthrust: {
accuracy:	accuracy: 95,
basePower:	basePower: 15,
category:	category: "Physical",
	name: "Arm Thrust",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	multihit: [2, 5],
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
aurasphere: {	aurasphere: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Aura Sphere",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, pulse: 1, mirror: 1, distance: 1},
secondary:	secondary: null,
target:	target: "any",
type: "Fighting",	type: "Fighting",
	},
	
axekick: {	axekick: {
accuracy:	accuracy: 90,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Axe Kick",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	hasCrashDamage: true,
	onMoveFail(target, source, move) {
	this.damage(source.baseMaxhp / 2, source, source, this.dex.conditions.get('High Jump Kick'));
	},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'confusion',
	},
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
bodypress: {	bodypress: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Body Press",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	overrideOffensiveStat: 'def',
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
brickbreak: {	brickbreak: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Physical",
	name: "Brick Break",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onTryHit(pokemon) {
	// will shatter screens through sub, before you hit
	pokemon.side.removeSideCondition('reflect');
	pokemon.side.removeSideCondition('lightscreen');
	pokemon.side.removeSideCondition('auroraveil');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
bulkup: {	bulkup: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Bulk Up",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	atk: 1,
	def: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Fighting",	type: "Fighting",
	},
	
circlethrow: {	circlethrow: {
accuracy:	accuracy: 90,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Circle Throw",
	pp: 1.25,
priority:	priority: -6,
	flags: {contact: 1, protect: 1, mirror: 1, noassist: 1, failcopycat: 1},
	forceSwitch: true,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
closecombat: {	closecombat: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Close Combat",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	self: {
	boosts: {
	def: -1,
	spd: -1,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
coaching: {	coaching: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Coaching",
	pp: 1.25,
priority:	priority: 0,
	flags: {bypasssub: 1, allyanim: 1},
secondary:	secondary: null,
	boosts: {
	atk: 1,
	def: 1,
	},
target:	target: "adjacentAlly",
type: "Fighting",	type: "Fighting",
	},
	
collisioncourse: {	collisioncourse: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Collision Course",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onBasePower(basePower, source, target, move) {
	if (target.runEffectiveness(move) > 0) {
	// Placeholder
	this.debug(`collision course super effective buff`);
	return this.chainModify([5461, 4096]);
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
combattorque: {	combattorque: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Combat Torque",
	pp: 1.25,
priority:	priority: 0,
	flags: {
	protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
	},
secondary:	secondary: {
	chance: 30,
	status: 'par',
	},
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
counter: {	counter: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	damageCallback(pokemon) {
	if (!pokemon.volatiles['counter']) return 0;
	return pokemon.volatiles['counter'].damage || 1;
	},
category:	category: "Physical",
	name: "Counter",
	pp: 1.25,
priority:	priority: -5,
	flags: {contact: 1, protect: 1, failmefirst: 1, noassist: 1, failcopycat: 1},
	beforeTurnCallback(pokemon) {
	pokemon.addVolatile('counter');
	},
	onTry(source) {
	if (!source.volatiles['counter']) return false;
	if (source.volatiles['counter'].slot === null) return false;
	},
	condition: {
	duration: 1,
	noCopy: true,
	onStart(target, source, move) {
	this.effectState.slot = null;
	this.effectState.damage = 0;
	},
	onRedirectTargetPriority: -1,
	onRedirectTarget(target, source, source2, move) {
	if (move.id !== 'counter') return;
	if (source !== this.effectState.target || !this.effectState.slot) return;
	return this.getAtSlot(this.effectState.slot);
	},
	onDamagingHit(damage, target, source, move) {
	if (!source.isAlly(target) && this.getCategory(move) === 'Physical') {
	this.effectState.slot = source.getSlot();
	this.effectState.damage = 2 * damage;
	}
	},
	},
secondary:	secondary: null,
target:	target: "scripted",
type: "Fighting",	type: "Fighting",
	},
	
crosschop: {	crosschop: {
accuracy:	accuracy: 80,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Cross Chop",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
detect: {	detect: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Detect",
	pp: 1.25,
priority:	priority: 4,
	flags: {noassist: 1, failcopycat: 1},
	stallingMove: true,
	volatileStatus: 'protect',
	onPrepareHit(pokemon) {
	return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
	},
	onHit(pokemon) {
	pokemon.addVolatile('stall');
	},
secondary:	secondary: null,
target:	target: "self",
type: "Fighting",	type: "Fighting",
	},
	
doublekick: {	doublekick: {
accuracy:	accuracy: 95,
basePower:	basePower: 30,
category:	category: "Physical",
	name: "Double Kick",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	multihit: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
drainpunch: {	drainpunch: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Physical",
	name: "Drain Punch",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1, heal: 1},
	drain: [1, 2],
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
dynamicpunch: {	dynamicpunch: {
accuracy:	accuracy: 50,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Dynamic Punch",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
secondary:	secondary: {
	chance: 100,
	volatileStatus: 'confusion',
	},
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
finalgambit: {	finalgambit: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	damageCallback(pokemon) {
	const damage = pokemon.hp;
	pokemon.faint();
	return damage;
	},
category:	category: "Special",
	name: "Final Gambit",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, noparentalbond: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
flyingpress: {	flyingpress: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Flying Press",
	pp: 1.25,
	flags: {contact: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, nonsky: 1},
	onEffectiveness(typeMod, target, type, move) {
	return typeMod + this.dex.getEffectiveness('Flying', type);
	},
priority:	priority: 0,
secondary:	secondary: null,
target:	target: "any",
type: "Fighting",	type: "Fighting",
	},
	
focusblast: {	focusblast: {
accuracy:	accuracy: 70,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Focus Blast",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	boosts: {
	spd: -1,
	},
	},
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
focuspunch: {	focuspunch: {
accuracy:	accuracy: 95,
basePower:	basePower: 150,
category:	category: "Physical",
	name: "Focus Punch",
	pp: 1.25,
priority:	priority: -3,
	flags: {contact: 1, protect: 1, punch: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1},
	priorityChargeCallback(pokemon) {
	pokemon.addVolatile('focuspunch');
	},
	beforeMoveCallback(pokemon) {
	if (pokemon.volatiles['focuspunch']?.lostFocus) {
	this.add('cant', pokemon, 'Focus Punch', 'Focus Punch');
	return true;
	}
	},
	condition: {
	duration: 1,
	onStart(pokemon) {
	this.add('-singleturn', pokemon, 'move: Focus Punch');
	},
	onHit(pokemon, source, move) {
	if (move.category !== 'Status') {
	this.effectState.lostFocus = true;
	}
	},
	onTryAddVolatile(status, pokemon) {
	if (status.id === 'flinch') return null;
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
forcepalm: {	forcepalm: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Force Palm",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	status: 'par',
	},
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
hammerarm: {	hammerarm: {
accuracy:	accuracy: 90,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Hammer Arm",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
	self: {
	boosts: {
	spe: -1,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
highjumpkick: {	highjumpkick: {
accuracy:	accuracy: 90,
basePower:	basePower: 130,
category:	category: "Physical",
	name: "High Jump Kick",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
	hasCrashDamage: true,
	onMoveFail(target, source, move) {
	this.damage(source.baseMaxhp / 2, source, source, this.dex.conditions.get('High Jump Kick'));
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
jumpkick: {	jumpkick: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Jump Kick",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
	hasCrashDamage: true,
	onMoveFail(target, source, move) {
	this.damage(source.baseMaxhp / 2, source, source, this.dex.conditions.get('Jump Kick'));
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
karatechop: {	karatechop: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Karate Chop",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
lowkick: {	lowkick: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon, target) {
	const targetWeight = target.getWeight();
	let bp;
	if (targetWeight >= 2000) {
	bp = 120;
	} else if (targetWeight >= 1000) {
	bp = 100;
	} else if (targetWeight >= 500) {
	bp = 80;
	} else if (targetWeight >= 250) {
	bp = 60;
	} else if (targetWeight >= 100) {
	bp = 40;
	} else {
	bp = 20;
	}
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Physical",
	name: "Low Kick",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onTryHit(target, pokemon, move) {
	if (target.volatiles['dynamax']) {
	this.add('-fail', pokemon, 'Dynamax');
	this.attrLastMove('[still]');
	return null;
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
lowsweep: {	lowsweep: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Physical",
	name: "Low Sweep",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spe: -1,
	},
	},
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
machpunch: {	machpunch: {
accuracy:	accuracy: 90,
basePower:	basePower: 45,
category:	category: "Physical",
	name: "Mach Punch",
	pp: 1.25,
priority:	priority: 1,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
matblock: {	matblock: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Mat Block",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, nonsky: 1, noassist: 1, failcopycat: 1},
	stallingMove: true,
	sideCondition: 'matblock',
	onTry(source) {
	if (source.activeMoveActions > 1) {
	this.hint("Mat Block only works on your first turn out.");
	return false;
	}
	return !!this.queue.willAct();
	},
	condition: {
	duration: 1,
	onSideStart(target, source) {
	this.add('-singleturn', source, 'Mat Block');
	},
	onTryHitPriority: 3,
	onTryHit(target, source, move) {
	if (!move.flags['protect']) {
	if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
	if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
	return;
	}
	if (move && (move.target === 'self' || move.category === 'Status')) return;
	this.add('-activate', target, 'move: Mat Block', move.name);
	const lockedmove = source.getVolatile('lockedmove');
	if (lockedmove) {
	// Outrage counter is reset
	if (source.volatiles['lockedmove'].duration === 2) {
	delete source.volatiles['lockedmove'];
	}
	}
	return this.NOT_FAIL;
	},
	},
secondary:	secondary: null,
target:	target: "allySide",
type: "Fighting",	type: "Fighting",
	},
	
meteorassault: {	meteorassault: {
accuracy:	accuracy: 95,
basePower:	basePower: 150,
category:	category: "Physical",
	name: "Meteor Assault",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, recharge: 1, mirror: 1, failinstruct: 1},
	self: {
	volatileStatus: 'mustrecharge',
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
noretreat: {	noretreat: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "No Retreat",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	volatileStatus: 'noretreat',
	onTry(source, target, move) {
	if (source.volatiles['noretreat']) return false;
	if (source.volatiles['trapped']) {
	delete move.volatileStatus;
	}
	},
	condition: {
	onStart(pokemon) {
	this.add('-start', pokemon, 'move: No Retreat');
	},
	onTrapPokemon(pokemon) {
	pokemon.tryTrap();
	},
	},
	boosts: {
	atk: 1,
	def: 1,
	spa: 1,
	spd: 1,
	spe: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Fighting",	type: "Fighting",
	},
	
octolock: {	octolock: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Octolock",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onTryImmunity(target) {
	return this.dex.getImmunity('trapped', target);
	},
	volatileStatus: 'octolock',
	condition: {
	onStart(pokemon, source) {
	this.add('-start', pokemon, 'move: Octolock', '[of] ' + source);
	},
	onResidualOrder: 14,
	onResidual(pokemon) {
	const source = this.effectState.source;
	if (source && (!source.isActive || source.hp <= 0 || !source.activeTurns)) {
	delete pokemon.volatiles['octolock'];
	this.add('-end', pokemon, 'Octolock', '[partiallytrapped]', '[silent]');
	return;
	}
	this.boost({def: -1, spd: -1}, pokemon, source, this.dex.getActiveMove('octolock'));
	},
	onTrapPokemon(pokemon) {
	if (this.effectState.source && this.effectState.source.isActive) pokemon.tryTrap();
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
poweruppunch: {	poweruppunch: {
accuracy:	accuracy: 95,
basePower:	basePower: 30,
category:	category: "Physical",
	name: "Power-Up Punch",
	pp: 1.25,
priority:	priority: -1,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
secondary:	secondary: {
	chance: 100,
	self: {
	boosts: {
	atk: 1,
	def: 1,
	spa: 1,
	spd: 1,
	spe: -1,
	},
	},
	},
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
quickguard: {	quickguard: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Quick Guard",
	pp: 1.25,
priority:	priority: 3,
	flags: {snatch: 1},
	sideCondition: 'quickguard',
	onTry() {
	return !!this.queue.willAct();
	},
	onHitSide(side, source) {
	source.addVolatile('stall');
	},
	condition: {
	duration: 1,
	onSideStart(target, source) {
	this.add('-singleturn', source, 'Quick Guard');
	},
	onTryHitPriority: 4,
	onTryHit(target, source, move) {
	// Quick Guard blocks moves with positive priority, even those given increased priority by Prankster or Gale Wings.
	// (e.g. it blocks 0 priority moves boosted by Prankster or Gale Wings; Quick Claw/Custap Berry do not count)
	if (move.priority <= 0.1) return;
	if (!move.flags['protect']) {
	if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
	if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
	return;
	}
	this.add('-activate', target, 'move: Quick Guard');
	const lockedmove = source.getVolatile('lockedmove');
	if (lockedmove) {
	// Outrage counter is reset
	if (source.volatiles['lockedmove'].duration === 2) {
	delete source.volatiles['lockedmove'];
	}
	}
	return this.NOT_FAIL;
	},
	},
secondary:	secondary: null,
target:	target: "allySide",
type: "Fighting",	type: "Fighting",
	},
	
revenge: {	revenge: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
	basePowerCallback(pokemon, target, move) {
	const damagedByTarget = pokemon.attackedBy.some(
	p => p.source === target && p.damage > 0 && p.thisTurn
	);
	if (damagedByTarget) {
	this.debug('BP doubled for getting hit by ' + target);
	return move.basePower * 2;
	}
	return move.basePower;
	},
category:	category: "Physical",
	name: "Revenge",
	pp: 1.25,
priority:	priority: -4,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
reversal: {	reversal: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon, target) {
	const ratio = Math.max(Math.floor(pokemon.hp * 48 / pokemon.maxhp), 1);
	let bp;
	if (ratio < 2) {
	bp = 200;
	} else if (ratio < 5) {
	bp = 150;
	} else if (ratio < 10) {
	bp = 100;
	} else if (ratio < 17) {
	bp = 80;
	} else if (ratio < 33) {
	bp = 40;
	} else {
	bp = 20;
	}
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Physical",
	name: "Reversal",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
rocksmash: {	rocksmash: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "Rock Smash",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 50,
	boosts: {
	def: -1,
	},
	},
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
rollingkick: {	rollingkick: {
accuracy:	accuracy: 85,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Rolling Kick",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
sacredsword: {	sacredsword: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Sacred Sword",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
	ignoreEvasion: true,
	ignoreDefensive: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
secretsword: {	secretsword: {
accuracy:	accuracy: 95,
basePower:	basePower: 85,
category:	category: "Special",
	overrideDefensiveStat: 'def',
	name: "Secret Sword",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
seismictoss: {	seismictoss: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	damage: 'level',
category:	category: "Physical",
	name: "Seismic Toss",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
skyuppercut: {	skyuppercut: {
accuracy:	accuracy: 90,
basePower:	basePower: 85,
category:	category: "Physical",
	name: "Sky Uppercut",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
stormthrow: {	stormthrow: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Storm Throw",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	willCrit: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
submission: {	submission: {
accuracy:	accuracy: 80,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Submission",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	recoil: [1, 4],
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
superpower: {	superpower: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Superpower",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	self: {
	boosts: {
	atk: -1,
	def: -1,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
thunderouskick: {	thunderouskick: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Thunderous Kick",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	def: -1,
	},
	},
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
triplearrows: {	triplearrows: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Triple Arrows",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
critRatio:	critRatio: 2,
	secondaries: [
	{
	chance: 50,
	boosts: {
	def: -1,
	},
	}, {
	chance: 30,
	volatileStatus: 'flinch',
	},
	],
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
triplekick: {	triplekick: {
accuracy:	accuracy: 90,
basePower:	basePower: 10,
	basePowerCallback(pokemon, target, move) {
	return 10 * move.hit;
	},
category:	category: "Physical",
	name: "Triple Kick",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
multihit: 3,	multihit: 3,
accuracy:	multiaccuracy: 95,
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
vacuumwave: {	vacuumwave: {
accuracy:	accuracy: 90,
basePower:	basePower: 50,
category:	category: "Special",
	name: "Vacuum Wave",
	pp: 1.25,
priority:	priority: 1,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
victorydance: {	victorydance: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Victory Dance",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, dance: 1},
	boosts: {
	atk: 1,
	def: 1,
	spe: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Fighting",	type: "Fighting",
	},
	
vitalthrow: {	vitalthrow: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Vital Throw",
	pp: 1.25,
priority:	priority: -1,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
wakeupslap: {	wakeupslap: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
	basePowerCallback(pokemon, target, move) {
	if (target.status === 'slp' || target.hasAbility('comatose')) {
	this.debug('BP doubled on sleeping target');
	return move.basePower * 2;
	}
	return move.basePower;
	},
category:	category: "Physical",
	name: "Wake-Up Slap",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onHit(target) {
	if (target.status === 'slp') target.cureStatus();
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fighting",	type: "Fighting",
	},
	
armorcannon: {	armorcannon: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Armor Cannon",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	self: {
	boosts: {
	def: -1,
	spd: -1,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
bitterblade: {	bitterblade: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Bitter Blade",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
	drain: [1, 2],
secondary:	secondary: null,
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
blastburn: {	blastburn: {
accuracy:	accuracy: 90,
basePower:	basePower: 150,
category:	category: "Special",
	name: "Blast Burn",
	pp: 1.25,
priority:	priority: 0,
	flags: {recharge: 1, protect: 1, mirror: 1},
	self: {
	volatileStatus: 'mustrecharge',
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
blazekick: {	blazekick: {
accuracy:	accuracy: 90,
basePower:	basePower: 85,
category:	category: "Physical",
	name: "Blaze Kick",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
critRatio:	critRatio: 2,
secondary:	secondary: {
	chance: 10,
	status: 'brn',
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
blazingtorque: {	blazingtorque: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Blazing Torque",
	pp: 1.25,
priority:	priority: 0,
	flags: {
	protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
	},
secondary:	secondary: {
	chance: 30,
	status: 'brn',
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
blueflare: {	blueflare: {
accuracy:	accuracy: 85,
basePower:	basePower: 130,
category:	category: "Special",
	name: "Blue Flare",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 20,
	status: 'brn',
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
burningjealousy: {	burningjealousy: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Special",
	name: "Burning Jealousy",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	onHit(target, source, move) {
	if (target?.statsRaisedThisTurn) {
	target.trySetStatus('brn', source, move);
	}
	},
	},
target:	target: "allAdjacentFoes",
type: "Fire",	type: "Fire",
	},
	
burnup: {	burnup: {
accuracy:	accuracy: 95,
basePower:	basePower: 130,
category:	category: "Special",
	name: "Burn Up",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, defrost: 1},
	onTryMove(pokemon, target, move) {
	if (pokemon.hasType('Fire')) return;
	this.add('-fail', pokemon, 'move: Burn Up');
	this.attrLastMove('[still]');
	return null;
	},
	self: {
	onHit(pokemon) {
	pokemon.setType(pokemon.getTypes(true).map(type => type === "Fire" ? "???" : type));
	this.add('-start', pokemon, 'typechange', pokemon.getTypes().join('/'), '[from] move: Burn Up');
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
ember: {	ember: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Special",
	name: "Ember",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	status: 'brn',
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
eruption: {	eruption: {
accuracy:	accuracy: 95,
basePower:	basePower: 150,
	basePowerCallback(pokemon, target, move) {
	const bp = move.basePower * pokemon.hp / pokemon.maxhp;
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Special",
	name: "Eruption",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Fire",	type: "Fire",
	},
	
fierydance: {	fierydance: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Fiery Dance",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, dance: 1},
secondary:	secondary: {
	chance: 50,
	self: {
	boosts: {
	spa: 1,
	},
	},
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
fireblast: {	fireblast: {
accuracy:	accuracy: 85,
basePower:	basePower: 110,
category:	category: "Special",
	name: "Fire Blast",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	status: 'brn',
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
firefang: {	firefang: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Physical",
	name: "Fire Fang",
	pp: 1.25,
priority:	priority: 0,
	flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
	secondaries: [
	{
	chance: 10,
	status: 'brn',
	}, {
	chance: 10,
	volatileStatus: 'flinch',
	},
	],
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
firelash: {	firelash: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Fire Lash",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	def: -1,
	},
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
firepledge: {	firepledge: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
	basePowerCallback(target, source, move) {
	if (['grasspledge', 'waterpledge'].includes(move.sourceEffect)) {
	this.add('-combine');
	return 150;
	}
	return 80;
	},
category:	category: "Special",
	name: "Fire Pledge",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1, pledgecombo: 1},
	onPrepareHit(target, source, move) {
	for (const action of this.queue.list as MoveAction[]) {
	if (
	!action.move || !action.pokemon?.isActive ||
	action.pokemon.fainted || action.maxMove || action.zmove
	) {
	continue;
	}
	if (action.pokemon.isAlly(source) && ['grasspledge', 'waterpledge'].includes(action.move.id)) {
	this.queue.prioritizeAction(action, move);
	this.add('-waiting', source, action.pokemon);
	return null;
	}
	}
	},
	onModifyMove(move) {
	if (move.sourceEffect === 'waterpledge') {
	move.type = 'Water';
	move.forceSTAB = true;
	move.self = {sideCondition: 'waterpledge'};
	}
	if (move.sourceEffect === 'grasspledge') {
	move.type = 'Fire';
	move.forceSTAB = true;
	move.sideCondition = 'firepledge';
	}
	},
	condition: {
	duration: 4,
	onSideStart(targetSide) {
	this.add('-sidestart', targetSide, 'Fire Pledge');
	},
	onResidualOrder: 5,
	onResidualSubOrder: 1,
	onResidual(pokemon) {
	if (!pokemon.hasType('Fire')) this.damage(pokemon.baseMaxhp / 8, pokemon);
	},
	onSideResidualOrder: 26,
	onSideResidualSubOrder: 8,
	onSideEnd(targetSide) {
	this.add('-sideend', targetSide, 'Fire Pledge');
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
firepunch: {	firepunch: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Physical",
	name: "Fire Punch",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
secondary:	secondary: {
	chance: 10,
	status: 'brn',
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
firespin: {	firespin: {
accuracy:	accuracy: 85,
basePower:	basePower: 35,
category:	category: "Special",
	name: "Fire Spin",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	volatileStatus: 'partiallytrapped',
secondary:	secondary: null,
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
flameburst: {	flameburst: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Special",
	name: "Flame Burst",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onHit(target, source, move) {
	for (const ally of target.adjacentAllies()) {
	this.damage(ally.baseMaxhp / 16, ally, source, this.dex.conditions.get('Flame Burst'));
	}
	},
	onAfterSubDamage(damage, target, source, move) {
	for (const ally of target.adjacentAllies()) {
	this.damage(ally.baseMaxhp / 16, ally, source, this.dex.conditions.get('Flame Burst'));
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
flamecharge: {	flamecharge: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Flame Charge",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	self: {
	boosts: {
	spe: 1,
	},
	},
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
flamewheel: {	flamewheel: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Flame Wheel",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, defrost: 1},
secondary:	secondary: {
	chance: 10,
	status: 'brn',
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
flamethrower: {	flamethrower: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Flamethrower",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	status: 'brn',
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
flareblitz: {	flareblitz: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Flare Blitz",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, defrost: 1},
	recoil: [33, 100],
secondary:	secondary: {
	chance: 10,
	status: 'brn',
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
fusionflare: {	fusionflare: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Fusion Flare",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, defrost: 1},
	onBasePower(basePower, pokemon) {
	if (this.lastSuccessfulMoveThisTurn === 'fusionbolt') {
	this.debug('double power');
	return this.chainModify(2);
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
heatcrash: {	heatcrash: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon, target) {
	const targetWeight = target.getWeight();
	const pokemonWeight = pokemon.getWeight();
	let bp;
	if (pokemonWeight >= targetWeight * 5) {
	bp = 120;
	} else if (pokemonWeight >= targetWeight * 4) {
	bp = 100;
	} else if (pokemonWeight >= targetWeight * 3) {
	bp = 80;
	} else if (pokemonWeight >= targetWeight * 2) {
	bp = 60;
	} else {
	bp = 40;
	}
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Physical",
	name: "Heat Crash",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
	onTryHit(target, pokemon, move) {
	if (target.volatiles['dynamax']) {
	this.add('-fail', pokemon, 'Dynamax');
	this.attrLastMove('[still]');
	return null;
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
heatwave: {	heatwave: {
accuracy:	accuracy: 90,
basePower:	basePower: 95,
category:	category: "Special",
	name: "Heat Wave",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, wind: 1},
secondary:	secondary: {
	chance: 10,
	status: 'brn',
	},
target:	target: "allAdjacentFoes",
type: "Fire",	type: "Fire",
	},
	
incinerate: {	incinerate: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Special",
	name: "Incinerate",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onHit(pokemon, source) {
	const item = pokemon.getItem();
	if ((item.isBerry || item.isGem) && pokemon.takeItem(source)) {
	this.add('-enditem', pokemon, item.name, '[from] move: Incinerate');
	}
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Fire",	type: "Fire",
	},
	
inferno: {	inferno: {
accuracy:	accuracy: 50,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Inferno",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	status: 'brn',
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
infernooverdrive: {	infernooverdrive: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "Inferno Overdrive",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
lavaplume: {	lavaplume: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Lava Plume",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	status: 'brn',
	},
target:	target: "allAdjacent",
type: "Fire",	type: "Fire",
	},
	
magmastorm: {	magmastorm: {
accuracy:	accuracy: 75,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Magma Storm",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	volatileStatus: 'partiallytrapped',
secondary:	secondary: null,
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
mindblown: {	mindblown: {
accuracy:	accuracy: 95,
basePower:	basePower: 150,
category:	category: "Special",
	name: "Mind Blown",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	mindBlownRecoil: true,
	onAfterMove(pokemon, target, move) {
	if (move.mindBlownRecoil && !move.multihit) {
	const hpBeforeRecoil = pokemon.hp;
	this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Mind Blown'), true);
	if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
	this.runEvent('EmergencyExit', pokemon, pokemon);
	}
	}
	},
secondary:	secondary: null,
target:	target: "allAdjacent",
type: "Fire",	type: "Fire",
	},
	
mysticalfire: {	mysticalfire: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Special",
	name: "Mystical Fire",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spa: -1,
	},
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
overheat: {	overheat: {
accuracy:	accuracy: 90,
basePower:	basePower: 130,
category:	category: "Special",
	name: "Overheat",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	self: {
	boosts: {
	spa: -2,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
pyroball: {	pyroball: {
accuracy:	accuracy: 90,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Pyro Ball",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, defrost: 1, bullet: 1},
secondary:	secondary: {
	chance: 10,
	status: 'brn',
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
ragingfury: {	ragingfury: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Raging Fury",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	self: {
	volatileStatus: 'lockedmove',
	},
	onAfterMove(pokemon) {
	if (pokemon.volatiles['lockedmove']?.duration === 1) {
	pokemon.removeVolatile('lockedmove');
	}
	},
secondary:	secondary: null,
target:	target: "randomNormal",
type: "Fire",	type: "Fire",
	},
	
sacredfire: {	sacredfire: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Sacred Fire",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, defrost: 1},
secondary:	secondary: {
	chance: 50,
	status: 'brn',
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
searingshot: {	searingshot: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Searing Shot",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	status: 'brn',
	},
target:	target: "allAdjacent",
type: "Fire",	type: "Fire",
	},
	
shelltrap: {	shelltrap: {
accuracy:	accuracy: 95,
basePower:	basePower: 150,
category:	category: "Special",
	name: "Shell Trap",
	pp: 1.25,
priority:	priority: -3,
	flags: {protect: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1},
	priorityChargeCallback(pokemon) {
	pokemon.addVolatile('shelltrap');
	},
	onTryMove(pokemon) {
	if (!pokemon.volatiles['shelltrap']?.gotHit) {
	this.attrLastMove('[still]');
	this.add('cant', pokemon, 'Shell Trap', 'Shell Trap');
	return null;
	}
	},
	condition: {
	duration: 1,
	onStart(pokemon) {
	this.add('-singleturn', pokemon, 'move: Shell Trap');
	},
	onHit(pokemon, source, move) {
	if (!pokemon.isAlly(source) && move.category === 'Physical') {
	this.effectState.gotHit = true;
	const action = this.queue.willMove(pokemon);
	if (action) {
	this.queue.prioritizeAction(action);
	}
	}
	},
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Fire",	type: "Fire",
	},
	
sizzlyslide: {	sizzlyslide: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Sizzly Slide",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, defrost: 1},
secondary:	secondary: {
	chance: 100,
	status: 'brn',
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
sunnyday: {	sunnyday: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Sunny Day",
	pp: 1.25,
priority:	priority: 0,
	flags: {},
	weather: 'sunnyday',
secondary:	secondary: null,
target:	target: "all",
type: "Fire",	type: "Fire",
	},
	
torchsong: {	torchsong: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Torch Song",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
secondary:	secondary: {
	chance: 100,
	self: {
	boosts: {
	spa: 1,
	},
	},
	},
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
vcreate: {	vcreate: {
accuracy:	accuracy: 95,
basePower:	basePower: 180,
category:	category: "Physical",
	name: "V-create",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	self: {
	boosts: {
	spe: -1,
	def: -1,
	spd: -1,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
willowisp: {	willowisp: {
accuracy:	accuracy: 85,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Will-O-Wisp",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	status: 'brn',
secondary:	secondary: null,
target:	target: "normal",
type: "Fire",	type: "Fire",
	},
	
acrobatics: {	acrobatics: {
accuracy:	accuracy: 95,
basePower:	basePower: 55,
	basePowerCallback(pokemon, target, move) {
	if (!pokemon.item) {
	this.debug("BP doubled for no item");
	return move.basePower * 2;
	}
	return move.basePower;
	},
category:	category: "Physical",
	name: "Acrobatics",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
secondary:	secondary: null,
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
aerialace: {	aerialace: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Aerial Ace",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, distance: 1, slicing: 1},
secondary:	secondary: null,
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
aeroblast: {	aeroblast: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Aeroblast",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, distance: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
aircutter: {	aircutter: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Special",
	name: "Air Cutter",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, slicing: 1, wind: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Flying",	type: "Flying",
	},
	
airslash: {	airslash: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Special",
	name: "Air Slash",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, distance: 1, slicing: 1},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
beakblast: {	beakblast: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Beak Blast",
	pp: 1.25,
priority:	priority: -3,
	flags: {bullet: 1, protect: 1, noassist: 1, failmefirst: 1, nosleeptalk: 1, failcopycat: 1, failinstruct: 1},
	priorityChargeCallback(pokemon) {
	pokemon.addVolatile('beakblast');
	},
	condition: {
	duration: 1,
	onStart(pokemon) {
	this.add('-singleturn', pokemon, 'move: Beak Blast');
	},
	onHit(target, source, move) {
	if (this.checkMoveMakesContact(move, source, target)) {
	source.trySetStatus('brn', target);
	}
	},
	},
	// FIXME: onMoveAborted(pokemon) {pokemon.removeVolatile('beakblast')},
	onAfterMove(pokemon) {
	pokemon.removeVolatile('beakblast');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Flying",	type: "Flying",
	},
	
bleakwindstorm: {	bleakwindstorm: {
accuracy:	accuracy: 80,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Bleakwind Storm",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, wind: 1},
secondary:	secondary: {
	chance: 30,
	boosts: {
	spe: -1,
	},
	},
target:	target: "allAdjacentFoes",
type: "Flying",	type: "Flying",
	},
	
bounce: {	bounce: {
accuracy:	accuracy: 85,
basePower:	basePower: 85,
category:	category: "Physical",
	name: "Bounce",
	pp: 1.25,
priority:	priority: 0,
	flags: {
	contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1,
	},
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	this.add('-prepare', attacker, move.name);
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
	condition: {
	duration: 2,
	onInvulnerability(target, source, move) {
	if (['gust', 'twister', 'skyuppercut', 'thunder', 'hurricane', 'smackdown', 'thousandarrows'].includes(move.id)) {
	return;
	}
	return false;
	},
	onSourceBasePower(basePower, target, source, move) {
	if (move.id === 'gust' || move.id === 'twister') {
	return this.chainModify(2);
	}
	},
	},
secondary:	secondary: {
	chance: 30,
	status: 'par',
	},
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
bravebird: {	bravebird: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Brave Bird",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
	recoil: [33, 100],
secondary:	secondary: null,
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
chatter: {	chatter: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Special",
	name: "Chatter",
	pp: 1.25,
priority:	priority: 0,
	flags: {
	protect: 1, mirror: 1, sound: 1, distance: 1, bypasssub: 1, nosleeptalk: 1, noassist: 1,
	failcopycat: 1, failinstruct: 1, failmimic: 1,
	},
	noSketch: true,
secondary:	secondary: {
	chance: 100,
	volatileStatus: 'confusion',
	},
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
defog: {	defog: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Defog",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, bypasssub: 1},
	onHit(target, source, move) {
	let success = false;
	if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({evasion: -1});
	const removeTarget = [
	'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb',
	];
	const removeAll = [
	'spikes', 'toxicspikes', 'stealthrock', 'stickyweb',
	];
	for (const targetCondition of removeTarget) {
	if (target.side.removeSideCondition(targetCondition)) {
	if (!removeAll.includes(targetCondition)) continue;
	this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', '[of] ' + source);
	success = true;
	}
	}
	for (const sideCondition of removeAll) {
	if (source.side.removeSideCondition(sideCondition)) {
	this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', '[of] ' + source);
	success = true;
	}
	}
	this.field.clearTerrain();
	return success;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Flying",	type: "Flying",
	},
	
dragonascent: {	dragonascent: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Dragon Ascent",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
	self: {
	boosts: {
	def: -1,
	spd: -1,
	},
	},
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
drillpeck: {	drillpeck: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Drill Peck",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
secondary:	secondary: null,
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
dualwingbeat: {	dualwingbeat: {
accuracy:	accuracy: 90,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "Dual Wingbeat",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	multihit: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Flying",	type: "Flying",
	},
	
featherdance: {	featherdance: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Feather Dance",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1, dance: 1},
	boosts: {
	atk: -2,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Flying",	type: "Flying",
	},
	
floatyfall: {	floatyfall: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Floaty Fall",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, gravity: 1},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Flying",	type: "Flying",
	},
	
fly: {	fly: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Fly",
	pp: 1.25,
priority:	priority: 0,
	flags: {
	contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1,
	},
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	this.add('-prepare', attacker, move.name);
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
	condition: {
	duration: 2,
	onInvulnerability(target, source, move) {
	if (['gust', 'twister', 'skyuppercut', 'thunder', 'hurricane', 'smackdown', 'thousandarrows'].includes(move.id)) {
	return;
	}
	return false;
	},
	onSourceModifyDamage(damage, source, target, move) {
	if (move.id === 'gust' || move.id === 'twister') {
	return this.chainModify(2);
	}
	},
	},
secondary:	secondary: null,
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
gust: {	gust: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Special",
	name: "Gust",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, distance: 1, wind: 1},
secondary:	secondary: null,
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
hurricane: {	hurricane: {
accuracy:	accuracy: 70,
basePower:	basePower: 110,
category:	category: "Special",
	name: "Hurricane",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, distance: 1, wind: 1},
	onModifyMove(move, pokemon, target) {
	switch (target?.effectiveWeather()) {
	case 'raindance':
	case 'primordialsea':
	move.accuracy = true;
	break;
	case 'sunnyday':
	case 'desolateland':
	move.accuracy = 50;
	break;
	}
	},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'confusion',
	},
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
mirrormove: {	mirrormove: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Mirror Move",
	pp: 1.25,
priority:	priority: 0,
	flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1},
	onTryHit(target, pokemon) {
	const move = target.lastMove;
	if (!move?.flags['mirror'] || move.isZ || move.isMax) {
	return false;
	}
	this.actions.useMove(move.id, pokemon, target);
	return null;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Flying",	type: "Flying",
	},
	
oblivionwing: {	oblivionwing: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Oblivion Wing",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, distance: 1, heal: 1},
	drain: [3, 4],
secondary:	secondary: null,
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
peck: {	peck: {
accuracy:	accuracy: 95,
basePower:	basePower: 35,
category:	category: "Physical",
	name: "Peck",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
secondary:	secondary: null,
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
pluck: {	pluck: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Pluck",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
	onHit(target, source) {
	const item = target.getItem();
	if (source.hp && item.isBerry && target.takeItem(source)) {
	this.add('-enditem', target, item.name, '[from] stealeat', '[move] Pluck', '[of] ' + source);
	if (this.singleEvent('Eat', item, null, source, null, null)) {
	this.runEvent('EatItem', source, null, null, item);
	if (item.id === 'leppaberry') target.staleness = 'external';
	}
	if (item.onEat) source.ateBerry = true;
	}
	},
secondary:	secondary: null,
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
roost: {	roost: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Roost",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	heal: [1, 2],
	self: {
	volatileStatus: 'roost',
	},
	condition: {
	duration: 1,
	onResidualOrder: 25,
	onStart(target) {
	if (!target.terastallized) {
	this.add('-singleturn', target, 'move: Roost');
	} else if (target.terastallized === "Flying") {
	this.add('-hint', "If a Flying Terastallized Pokemon uses Roost, it remains Flying-type.");
	}
	},
	onTypePriority: -1,
	onType(types, pokemon) {
	this.effectState.typeWas = types;
	return types.filter(type => type !== 'Flying');
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Flying",	type: "Flying",
	},
	
skyattack: {	skyattack: {
accuracy:	accuracy: 90,
basePower:	basePower: 140,
category:	category: "Physical",
	name: "Sky Attack",
	pp: 1.25,
priority:	priority: 0,
	flags: {charge: 1, protect: 1, mirror: 1, distance: 1, nosleeptalk: 1, failinstruct: 1},
critRatio:	critRatio: 2,
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	this.add('-prepare', attacker, move.name);
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
skydrop: {	skydrop: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Sky Drop",
	pp: 1.25,
priority:	priority: 0,
	flags: {
	contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1,
	},
	onModifyMove(move, source) {
	if (!source.volatiles['skydrop']) {
	move.accuracy = true;
	delete move.flags['contact'];
	}
	},
	onMoveFail(target, source) {
	if (source.volatiles['twoturnmove'] && source.volatiles['twoturnmove'].duration === 1) {
	source.removeVolatile('skydrop');
	source.removeVolatile('twoturnmove');
	if (target === this.effectState.target) {
	this.add('-end', target, 'Sky Drop', '[interrupt]');
	}
	}
	},
	onTry(source, target) {
	return !target.fainted;
	},
	onTryHit(target, source, move) {
	if (source.removeVolatile(move.id)) {
	if (target !== source.volatiles['twoturnmove'].source) return false;
	if (target.hasType('Flying')) {
	this.add('-immune', target);
	return null;
	}
	} else {
	if (target.volatiles['substitute'] || target.isAlly(source)) {
	return false;
	}
	if (target.getWeight() >= 2000) {
	this.add('-fail', target, 'move: Sky Drop', '[heavy]');
	return null;
	}
	this.add('-prepare', source, move.name, target);
	source.addVolatile('twoturnmove', target);
	return null;
	}
	},
	onHit(target, source) {
	if (target.hp) this.add('-end', target, 'Sky Drop');
	},
	condition: {
	duration: 2,
	onAnyDragOut(pokemon) {
	if (pokemon === this.effectState.target || pokemon === this.effectState.source) return false;
	},
	onFoeTrapPokemonPriority: -15,
	onFoeTrapPokemon(defender) {
	if (defender !== this.effectState.source) return;
	defender.trapped = true;
	},
	onFoeBeforeMovePriority: 12,
	onFoeBeforeMove(attacker, defender, move) {
	if (attacker === this.effectState.source) {
	attacker.activeMoveActions--;
	this.debug('Sky drop nullifying.');
	return null;
	}
	},
	onRedirectTargetPriority: 99,
	onRedirectTarget(target, source, source2) {
	if (source !== this.effectState.target) return;
	if (this.effectState.source.fainted) return;
	return this.effectState.source;
	},
	onAnyInvulnerability(target, source, move) {
	if (target !== this.effectState.target && target !== this.effectState.source) {
	return;
	}
	if (source === this.effectState.target && target === this.effectState.source) {
	return;
	}
	if (['gust', 'twister', 'skyuppercut', 'thunder', 'hurricane', 'smackdown', 'thousandarrows'].includes(move.id)) {
	return;
	}
	return false;
	},
	onAnyBasePower(basePower, target, source, move) {
	if (target !== this.effectState.target && target !== this.effectState.source) {
	return;
	}
	if (source === this.effectState.target && target === this.effectState.source) {
	return;
	}
	if (move.id === 'gust' || move.id === 'twister') {
	this.debug('BP doubled on midair target');
	return this.chainModify(2);
	}
	},
	onFaint(target) {
	if (target.volatiles['skydrop'] && target.volatiles['twoturnmove'].source) {
	this.add('-end', target.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
	}
	},
	},
secondary:	secondary: null,
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
supersonicskystrike: {	supersonicskystrike: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "Supersonic Skystrike",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Flying",	type: "Flying",
	},
	
tailwind: {	tailwind: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Tailwind",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, wind: 1},
	sideCondition: 'tailwind',
	condition: {
	duration: 4,
	durationCallback(target, source, effect) {
	if (source?.hasAbility('persistent')) {
	this.add('-activate', source, 'ability: Persistent', '[move] Tailwind');
	return 6;
	}
	return 4;
	},
	onSideStart(side, source) {
	if (source?.hasAbility('persistent')) {
	this.add('-sidestart', side, 'move: Tailwind', '[persistent]');
	} else {
	this.add('-sidestart', side, 'move: Tailwind');
	}
	},
	onModifySpe(spe, pokemon) {
	return this.chainModify(2);
	},
	onSideResidualOrder: 26,
	onSideResidualSubOrder: 5,
	onSideEnd(side) {
	this.add('-sideend', side, 'move: Tailwind');
	},
	},
secondary:	secondary: null,
target:	target: "allySide",
type: "Flying",	type: "Flying",
	},
	
wingattack: {	wingattack: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Wing Attack",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
secondary:	secondary: null,
target:	target: "any",
type: "Flying",	type: "Flying",
	},
	
astonish: {	astonish: {
accuracy:	accuracy: 95,
basePower:	basePower: 30,
category:	category: "Physical",
	name: "Astonish",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
astralbarrage: {	astralbarrage: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Astral Barrage",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Ghost",	type: "Ghost",
	},
	
bittermalice: {	bittermalice: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Special",
	name: "Bitter Malice",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	atk: -1,
	},
	},
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
confuseray: {	confuseray: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Confuse Ray",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	volatileStatus: 'confusion',
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
curse: {	curse: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Curse",
	pp: 1.25,
priority:	priority: 0,
	flags: {bypasssub: 1},
	volatileStatus: 'curse',
	onModifyMove(move, source, target) {
	if (!source.hasType('Ghost')) {
	move.target = move.nonGhostTarget as MoveTarget;
	} else if (source.isAlly(target)) {
	move.target = 'randomNormal';
	}
	},
	onTryHit(target, source, move) {
	if (!source.hasType('Ghost')) {
	delete move.volatileStatus;
	delete move.onHit;
	move.self = {boosts: {spe: -1, atk: 1, def: 1}};
	} else if (move.volatileStatus && target.volatiles['curse']) {
	return false;
	}
	},
	onHit(target, source) {
	this.directDamage(source.maxhp / 2, source, source);
	},
	condition: {
	onStart(pokemon, source) {
	this.add('-start', pokemon, 'Curse', '[of] ' + source);
	},
	onResidualOrder: 12,
	onResidual(pokemon) {
	this.damage(pokemon.baseMaxhp / 4);
	},
	},
secondary:	secondary: null,
target:	target: "normal",
	nonGhostTarget: "self",
type: "Ghost",	type: "Ghost",
	},
	
destinybond: {	destinybond: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Destiny Bond",
	pp: 1.25,
priority:	priority: 0,
	flags: {bypasssub: 1, noassist: 1, failcopycat: 1},
	volatileStatus: 'destinybond',
	onPrepareHit(pokemon) {
	return !pokemon.removeVolatile('destinybond');
	},
	condition: {
	onStart(pokemon) {
	this.add('-singlemove', pokemon, 'Destiny Bond');
	},
	onFaint(target, source, effect) {
	if (!source || !effect || target.isAlly(source)) return;
	if (effect.effectType === 'Move' && !effect.flags['futuremove']) {
	if (source.volatiles['dynamax']) {
	this.add('-hint', "Dynamaxed Pokémon are immune to Destiny Bond.");
	return;
	}
	this.add('-activate', target, 'move: Destiny Bond');
	source.faint();
	}
	},
	onBeforeMovePriority: -1,
	onBeforeMove(pokemon, target, move) {
	if (move.id === 'destinybond') return;
	this.debug('removing Destiny Bond before attack');
	pokemon.removeVolatile('destinybond');
	},
	onMoveAborted(pokemon, target, move) {
	pokemon.removeVolatile('destinybond');
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Ghost",	type: "Ghost",
	},
	
grudge: {	grudge: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Grudge",
	pp: 1.25,
priority:	priority: 0,
	flags: {bypasssub: 1},
	volatileStatus: 'grudge',
	condition: {
	onStart(pokemon) {
	this.add('-singlemove', pokemon, 'Grudge');
	},
	onFaint(target, source, effect) {
	if (!source || source.fainted || !effect) return;
	if (effect.effectType === 'Move' && !effect.flags['futuremove'] && source.lastMove) {
	let move: Move = source.lastMove;
	if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
	for (const moveSlot of source.moveSlots) {
	if (moveSlot.id === move.id) {
	moveSlot.pp = 0;
	this.add('-activate', source, 'move: Grudge', move.name);
	}
	}
	}
	},
	onBeforeMovePriority: 100,
	onBeforeMove(pokemon) {
	this.debug('removing Grudge before attack');
	pokemon.removeVolatile('grudge');
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Ghost",	type: "Ghost",
	},
	
hex: {	hex: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
	basePowerCallback(pokemon, target, move) {
	if (target.status || target.hasAbility('comatose')) {
	this.debug('BP doubled from status condition');
	return move.basePower * 2;
	}
	return move.basePower;
	},
category:	category: "Special",
	name: "Hex",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
infernalparade: {	infernalparade: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
	basePowerCallback(pokemon, target, move) {
	if (target.status || target.hasAbility('comatose')) return move.basePower * 2;
	return move.basePower;
	},
category:	category: "Special",
	name: "Infernal Parade",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	status: 'brn',
	},
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
lastrespects: {	lastrespects: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
	basePowerCallback(pokemon, target, move) {
	return 50 + 50 * pokemon.side.totalFainted;
	},
category:	category: "Physical",
	name: "Last Respects",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
lick: {	lick: {
accuracy:	accuracy: 95,
basePower:	basePower: 30,
category:	category: "Physical",
	name: "Lick",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	status: 'par',
	},
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
menacingmoonrazemaelstrom: {	menacingmoonrazemaelstrom: {
accuracy:	accuracy: 95,
basePower:	basePower: 200,
category:	category: "Special",
	name: "Menacing Moonraze Maelstrom",
	pp: 1,
priority:	priority: 0,
	flags: {},
	ignoreAbility: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
moongeistbeam: {	moongeistbeam: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Moongeist Beam",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	ignoreAbility: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
neverendingnightmare: {	neverendingnightmare: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "Never-Ending Nightmare",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
nightmare: {	nightmare: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Nightmare",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	volatileStatus: 'nightmare',
	condition: {
	noCopy: true,
	onStart(pokemon) {
	if (pokemon.status !== 'slp' && !pokemon.hasAbility('comatose')) {
	return false;
	}
	this.add('-start', pokemon, 'Nightmare');
	},
	onResidualOrder: 11,
	onResidual(pokemon) {
	this.damage(pokemon.baseMaxhp / 4);
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
nightshade: {	nightshade: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	damage: 'level',
category:	category: "Special",
	name: "Night Shade",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
ominouswind: {	ominouswind: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Special",
	name: "Ominous Wind",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	self: {
	boosts: {
	atk: 1,
	def: 1,
	spa: 1,
	spd: 1,
	spe: 1,
	},
	},
	},
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
phantomforce: {	phantomforce: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Phantom Force",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, charge: 1, mirror: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1},
	breaksProtect: true,
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	this.add('-prepare', attacker, move.name);
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
	condition: {
	duration: 2,
	onInvulnerability: false,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
poltergeist: {	poltergeist: {
accuracy:	accuracy: 90,
basePower:	basePower: 110,
category:	category: "Physical",
	name: "Poltergeist",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onTry(source, target) {
	return !!target.item;
	},
	onTryHit(target, source, move) {
	this.add('-activate', target, 'move: Poltergeist', this.dex.items.get(target.item).name);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
ragefist: {	ragefist: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
	basePowerCallback(pokemon) {
	return Math.min(350, 50 + 50 * pokemon.timesAttacked);
	},
category:	category: "Physical",
	name: "Rage Fist",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
shadowball: {	shadowball: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Shadow Ball",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 20,
	boosts: {
	spd: -1,
	},
	},
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
shadowbone: {	shadowbone: {
accuracy:	accuracy: 95,
basePower:	basePower: 85,
category:	category: "Physical",
	name: "Shadow Bone",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 20,
	boosts: {
	def: -1,
	},
	},
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
shadowclaw: {	shadowclaw: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Shadow Claw",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
shadowforce: {	shadowforce: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Shadow Force",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, charge: 1, mirror: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1},
	breaksProtect: true,
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	this.add('-prepare', attacker, move.name);
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
	condition: {
	duration: 2,
	onInvulnerability: false,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
shadowpunch: {	shadowpunch: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Shadow Punch",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
shadowsneak: {	shadowsneak: {
accuracy:	accuracy: 90,
basePower:	basePower: 45,
category:	category: "Physical",
	name: "Shadow Sneak",
	pp: 1.25,
priority:	priority: 1,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
shadowstrike: {	shadowstrike: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Shadow Strike",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 50,
	boosts: {
	def: -1,
	},
	},
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
sinisterarrowraid: {	sinisterarrowraid: {
accuracy:	accuracy: 95,
basePower:	basePower: 180,
category:	category: "Physical",
	name: "Sinister Arrow Raid",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
soulstealing7starstrike: {	soulstealing7starstrike: {
accuracy:	accuracy: 95,
basePower:	basePower: 195,
category:	category: "Physical",
	name: "Soul-Stealing 7-Star Strike",
	pp: 1,
priority:	priority: 0,
	flags: {contact: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
spectralthief: {	spectralthief: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Spectral Thief",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, bypasssub: 1},
	stealsBoosts: true,
	// Boost stealing implemented in scripts.js
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
spiritshackle: {	spiritshackle: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Spirit Shackle",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	onHit(target, source, move) {
	if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
	},
	},
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
spite: {	spite: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Spite",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, bypasssub: 1},
	onHit(target) {
	let move: Move | ActiveMove | null = target.lastMove;
	if (!move || move.isZ) return false;
	if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
	const ppDeducted = target.deductPP(move.id, 4);
	if (!ppDeducted) return false;
	this.add("-activate", target, 'move: Spite', move.name, ppDeducted);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
trickortreat: {	trickortreat: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Trick-or-Treat",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	onHit(target) {
	if (target.hasType('Ghost')) return false;
	if (!target.addType('Ghost')) return false;
	this.add('-start', target, 'typeadd', 'Ghost', '[from] move: Trick-or-Treat');
	if (target.side.active.length === 2 && target.position === 1) {
	// Curse Glitch
	const action = this.queue.willMove(target);
	if (action && action.move.id === 'curse') {
	action.targetLoc = -1;
	}
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Ghost",	type: "Ghost",
	},
	
absorb: {	absorb: {
accuracy:	accuracy: 95,
basePower:	basePower: 20,
category:	category: "Special",
	name: "Absorb",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, heal: 1},
	drain: [1, 2],
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
appleacid: {	appleacid: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Apple Acid",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spd: -1,
	},
	},
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
aromatherapy: {	aromatherapy: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Aromatherapy",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, distance: 1},
	onHit(target, source, move) {
	this.add('-activate', source, 'move: Aromatherapy');
	let success = false;
	const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
	for (const ally of allies) {
	if (ally !== source && ((ally.hasAbility('sapsipper')) ||
	(ally.volatiles['substitute'] && !move.infiltrates))) {
	continue;
	}
	if (ally.cureStatus()) success = true;
	}
	return success;
	},
target:	target: "allyTeam",
type: "Grass",	type: "Grass",
	},
	
bloomdoom: {	bloomdoom: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "Bloom Doom",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
branchpoke: {	branchpoke: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "Branch Poke",
	pp: 125,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
bulletseed: {	bulletseed: {
accuracy:	accuracy: 95,
basePower:	basePower: 25,
category:	category: "Physical",
	name: "Bullet Seed",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
	multihit: [2, 5],
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
chloroblast: {	chloroblast: {
accuracy:	accuracy: 95,
basePower:	basePower: 150,
category:	category: "Special",
	name: "Chloroblast",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	mindBlownRecoil: true,
	onAfterMove(pokemon, target, move) {
	if (move.mindBlownRecoil && !move.multihit) {
	const hpBeforeRecoil = pokemon.hp;
	this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Chloroblast'), true);
	if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
	this.runEvent('EmergencyExit', pokemon, pokemon);
	}
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
cottonguard: {	cottonguard: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Cotton Guard",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	def: 3,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Grass",	type: "Grass",
	},
	
cottonspore: {	cottonspore: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Cotton Spore",
	pp: 125,
priority:	priority: 0,
	flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
	boosts: {
	spe: -2,
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Grass",	type: "Grass",
	},
	
drumbeating: {	drumbeating: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Drum Beating",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spe: -1,
	},
	},
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
energyball: {	energyball: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Energy Ball",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	boosts: {
	spd: -1,
	},
	},
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
flowertrick: {	flowertrick: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Flower Trick",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	willCrit: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
forestscurse: {	forestscurse: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Forest's Curse",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	onHit(target) {
	if (target.hasType('Grass')) return false;
	if (!target.addType('Grass')) return false;
	this.add('-start', target, 'typeadd', 'Grass', '[from] move: Forest\'s Curse');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
frenzyplant: {	frenzyplant: {
accuracy:	accuracy: 90,
basePower:	basePower: 150,
category:	category: "Special",
	name: "Frenzy Plant",
	pp: 1.25,
priority:	priority: 0,
	flags: {recharge: 1, protect: 1, mirror: 1, nonsky: 1},
	self: {
	volatileStatus: 'mustrecharge',
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
gigadrain: {	gigadrain: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Special",
	name: "Giga Drain",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, heal: 1},
	drain: [1, 2],
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
grassknot: {	grassknot: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon, target) {
	const targetWeight = target.getWeight();
	let bp;
	if (targetWeight >= 2000) {
	bp = 120;
	} else if (targetWeight >= 1000) {
	bp = 100;
	} else if (targetWeight >= 500) {
	bp = 80;
	} else if (targetWeight >= 250) {
	bp = 60;
	} else if (targetWeight >= 100) {
	bp = 40;
	} else {
	bp = 20;
	}
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Special",
	name: "Grass Knot",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
	onTryHit(target, source, move) {
	if (target.volatiles['dynamax']) {
	this.add('-fail', source, 'move: Grass Knot', '[from] Dynamax');
	this.attrLastMove('[still]');
	return null;
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
grasspledge: {	grasspledge: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
	basePowerCallback(target, source, move) {
	if (['waterpledge', 'firepledge'].includes(move.sourceEffect)) {
	this.add('-combine');
	return 150;
	}
	return 80;
	},
category:	category: "Special",
	name: "Grass Pledge",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1, pledgecombo: 1},
	onPrepareHit(target, source, move) {
	for (const action of this.queue.list as MoveAction[]) {
	if (
	!action.move || !action.pokemon?.isActive ||
	action.pokemon.fainted || action.maxMove || action.zmove
	) {
	continue;
	}
	if (action.pokemon.isAlly(source) && ['waterpledge', 'firepledge'].includes(action.move.id)) {
	this.queue.prioritizeAction(action, move);
	this.add('-waiting', source, action.pokemon);
	return null;
	}
	}
	},
	onModifyMove(move) {
	if (move.sourceEffect === 'waterpledge') {
	move.type = 'Grass';
	move.forceSTAB = true;
	move.sideCondition = 'grasspledge';
	}
	if (move.sourceEffect === 'firepledge') {
	move.type = 'Fire';
	move.forceSTAB = true;
	move.sideCondition = 'firepledge';
	}
	},
	condition: {
	duration: 4,
	onSideStart(targetSide) {
	this.add('-sidestart', targetSide, 'Grass Pledge');
	},
	onSideResidualOrder: 26,
	onSideResidualSubOrder: 9,
	onSideEnd(targetSide) {
	this.add('-sideend', targetSide, 'Grass Pledge');
	},
	onModifySpe(spe, pokemon) {
	return this.chainModify(0.25);
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
grasswhistle: {	grasswhistle: {
accuracy:	accuracy: 55,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Grass Whistle",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1},
	status: 'slp',
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
grassyglide: {	grassyglide: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Grassy Glide",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onModifyPriority(priority, source, target, move) {
	if (this.field.isTerrain('grassyterrain') && source.isGrounded()) {
	return priority + 1;
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
grassyterrain: {	grassyterrain: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Grassy Terrain",
	pp: 1.25,
priority:	priority: 0,
	flags: {nonsky: 1},
	terrain: 'grassyterrain',
	condition: {
	duration: 5,
	durationCallback(source, effect) {
	if (source?.hasItem('terrainextender')) {
	return 8;
	}
	return 5;
	},
	onBasePowerPriority: 6,
	onBasePower(basePower, attacker, defender, move) {
	const weakenedMoves = ['earthquake', 'bulldoze', 'magnitude'];
	if (weakenedMoves.includes(move.id) && defender.isGrounded() && !defender.isSemiInvulnerable()) {
	this.debug('move weakened by grassy terrain');
	return this.chainModify(0.5);
	}
	if (move.type === 'Grass' && attacker.isGrounded()) {
	this.debug('grassy terrain boost');
	return this.chainModify([5325, 4096]);
	}
	},
	onFieldStart(field, source, effect) {
	if (effect?.effectType === 'Ability') {
	this.add('-fieldstart', 'move: Grassy Terrain', '[from] ability: ' + effect.name, '[of] ' + source);
	} else {
	this.add('-fieldstart', 'move: Grassy Terrain');
	}
	},
	onResidualOrder: 5,
	onResidualSubOrder: 2,
	onResidual(pokemon) {
	if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
	this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon);
	} else {
	this.debug(`Pokemon semi-invuln or not grounded; Grassy Terrain skipped`);
	}
	},
	onFieldResidualOrder: 27,
	onFieldResidualSubOrder: 7,
	onFieldEnd() {
	this.add('-fieldend', 'move: Grassy Terrain');
	},
	},
secondary:	secondary: null,
target:	target: "all",
type: "Grass",	type: "Grass",
	},
	
gravapple: {	gravapple: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Grav Apple",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onBasePower(basePower) {
	if (this.field.getPseudoWeather('gravity')) {
	return this.chainModify(1.5);
	}
	},
secondary:	secondary: {
	chance: 100,
	boosts: {
	def: -1,
	},
	},
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
hornleech: {	hornleech: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Physical",
	name: "Horn Leech",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, heal: 1},
	drain: [1, 2],
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
ingrain: {	ingrain: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Ingrain",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, nonsky: 1},
	volatileStatus: 'ingrain',
	condition: {
	onStart(pokemon) {
	this.add('-start', pokemon, 'move: Ingrain');
	},
	onResidualOrder: 7,
	onResidual(pokemon) {
	this.heal(pokemon.baseMaxhp / 16);
	},
	onTrapPokemon(pokemon) {
	pokemon.tryTrap();
	},
	// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
	onDragOut(pokemon) {
	this.add('-activate', pokemon, 'move: Ingrain');
	return null;
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Grass",	type: "Grass",
	},
	
junglehealing: {	junglehealing: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Jungle Healing",
	pp: 1.25,
priority:	priority: 0,
	flags: {heal: 1, bypasssub: 1, allyanim: 1},
	onHit(pokemon) {
	const success = !!this.heal(this.modify(pokemon.maxhp, 0.25));
	return pokemon.cureStatus() || success;
	},
secondary:	secondary: null,
target:	target: "allies",
type: "Grass",	type: "Grass",
	},
	
leafage: {	leafage: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "Leafage",
	pp: 125,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
leafblade: {	leafblade: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Leaf Blade",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
leafstorm: {	leafstorm: {
accuracy:	accuracy: 90,
basePower:	basePower: 130,
category:	category: "Special",
	name: "Leaf Storm",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	self: {
	boosts: {
	spa: -2,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
leaftornado: {	leaftornado: {
accuracy:	accuracy: 90,
basePower:	basePower: 65,
category:	category: "Special",
	name: "Leaf Tornado",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 50,
boosts: {	boosts: {
accuracy:	accuracy: -1,
	},
	},
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
leechseed: {	leechseed: {
accuracy:	accuracy: 90,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Leech Seed",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	volatileStatus: 'leechseed',
	condition: {
	onStart(target) {
	this.add('-start', target, 'move: Leech Seed');
	},
	onResidualOrder: 8,
	onResidual(pokemon) {
	const target = this.getAtSlot(pokemon.volatiles['leechseed'].sourceSlot);
	if (!target || target.fainted || target.hp <= 0) {
	this.debug('Nothing to leech into');
	return;
	}
	const damage = this.damage(pokemon.baseMaxhp / 8, pokemon, target);
	if (damage) {
	this.heal(damage, target, pokemon);
	}
	},
	},
	onTryImmunity(target) {
	return !target.hasType('Grass');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
magicalleaf: {	magicalleaf: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Special",
	name: "Magical Leaf",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
megadrain: {	megadrain: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Special",
	name: "Mega Drain",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, heal: 1},
	drain: [1, 2],
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
needlearm: {	needlearm: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Needle Arm",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
petalblizzard: {	petalblizzard: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Petal Blizzard",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, wind: 1},
secondary:	secondary: null,
target:	target: "allAdjacent",
type: "Grass",	type: "Grass",
	},
	
petaldance: {	petaldance: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Petal Dance",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, dance: 1, failinstruct: 1},
	self: {
	volatileStatus: 'lockedmove',
	},
	onAfterMove(pokemon) {
	if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
	pokemon.removeVolatile('lockedmove');
	}
	},
secondary:	secondary: null,
target:	target: "randomNormal",
type: "Grass",	type: "Grass",
	},
	
powerwhip: {	powerwhip: {
accuracy:	accuracy: 85,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Power Whip",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
razorleaf: {	razorleaf: {
accuracy:	accuracy: 95,
basePower:	basePower: 55,
category:	category: "Physical",
	name: "Razor Leaf",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, slicing: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Grass",	type: "Grass",
	},
	
sappyseed: {	sappyseed: {
accuracy:	accuracy: 90,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Sappy Seed",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	onHit(target, source) {
	if (target.hasType('Grass')) return null;
	target.addVolatile('leechseed', source);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
seedbomb: {	seedbomb: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Seed Bomb",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
seedflare: {	seedflare: {
accuracy:	accuracy: 85,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Seed Flare",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 40,
	boosts: {
	spd: -2,
	},
	},
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
sleeppowder: {	sleeppowder: {
accuracy:	accuracy: 75,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Sleep Powder",
	pp: 1.25,
priority:	priority: 0,
	flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
	status: 'slp',
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
snaptrap: {	snaptrap: {
accuracy:	accuracy: 95,
basePower:	basePower: 35,
category:	category: "Physical",
	name: "Snap Trap",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	volatileStatus: 'partiallytrapped',
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
solarbeam: {	solarbeam: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Solar Beam",
	pp: 1.25,
priority:	priority: 0,
	flags: {charge: 1, protect: 1, mirror: 1, nosleeptalk: 1, failinstruct: 1},
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	this.add('-prepare', attacker, move.name);
	if (['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) {
	this.attrLastMove('[still]');
	this.addMove('-anim', attacker, move.name, defender);
	return;
	}
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
	onBasePower(basePower, pokemon, target) {
	const weakWeathers = ['raindance', 'primordialsea', 'sandstorm', 'hail', 'snow'];
	if (weakWeathers.includes(pokemon.effectiveWeather())) {
	this.debug('weakened by weather');
	return this.chainModify(0.5);
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
solarblade: {	solarblade: {
accuracy:	accuracy: 95,
basePower:	basePower: 125,
category:	category: "Physical",
	name: "Solar Blade",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, charge: 1, protect: 1, mirror: 1, slicing: 1, nosleeptalk: 1, failinstruct: 1},
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	this.add('-prepare', attacker, move.name);
	if (['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) {
	this.attrLastMove('[still]');
	this.addMove('-anim', attacker, move.name, defender);
	return;
	}
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
	onBasePower(basePower, pokemon, target) {
	const weakWeathers = ['raindance', 'primordialsea', 'sandstorm', 'hail', 'snow'];
	if (weakWeathers.includes(pokemon.effectiveWeather())) {
	this.debug('weakened by weather');
	return this.chainModify(0.5);
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
spicyextract: {	spicyextract: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Spicy Extract",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	boosts: {
	atk: 2,
	def: -2,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
spikyshield: {	spikyshield: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Spiky Shield",
	pp: 1.25,
priority:	priority: 4,
	flags: {noassist: 1, failcopycat: 1},
	stallingMove: true,
	volatileStatus: 'spikyshield',
	onPrepareHit(pokemon) {
	return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
	},
	onHit(pokemon) {
	pokemon.addVolatile('stall');
	},
	condition: {
	duration: 1,
	onStart(target) {
	this.add('-singleturn', target, 'move: Protect');
	},
	onTryHitPriority: 3,
	onTryHit(target, source, move) {
	if (!move.flags['protect']) {
	if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
	if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
	return;
	}
	if (move.smartTarget) {
	move.smartTarget = false;
	} else {
	this.add('-activate', target, 'move: Protect');
	}
	const lockedmove = source.getVolatile('lockedmove');
	if (lockedmove) {
	// Outrage counter is reset
	if (source.volatiles['lockedmove'].duration === 2) {
	delete source.volatiles['lockedmove'];
	}
	}
	if (this.checkMoveMakesContact(move, source, target)) {
	this.damage(source.baseMaxhp / 8, source, target);
	}
	return this.NOT_FAIL;
	},
	onHit(target, source, move) {
	if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
	this.damage(source.baseMaxhp / 8, source, target);
	}
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Grass",	type: "Grass",
	},
	
spore: {	spore: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Spore",
	pp: 1.25,
priority:	priority: 0,
	flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
	status: 'slp',
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
strengthsap: {	strengthsap: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Strength Sap",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, heal: 1},
	onHit(target, source) {
	if (target.boosts.atk === -6) return false;
	const atk = target.getStat('atk', false, true);
	const success = this.boost({atk: -1}, target, source, null, false, true);
	return !!(this.heal(atk, source, target) || success);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
stunspore: {	stunspore: {
accuracy:	accuracy: 75,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Stun Spore",
	pp: 1.25,
priority:	priority: 0,
	flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
	status: 'par',
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
synthesis: {	synthesis: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Synthesis",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	onHit(pokemon) {
	let factor = 0.5;
	switch (pokemon.effectiveWeather()) {
	case 'sunnyday':
	case 'desolateland':
	factor = 0.667;
	break;
	case 'raindance':
	case 'primordialsea':
	case 'sandstorm':
	case 'hail':
	case 'snow':
	factor = 0.25;
	break;
	}
	const success = !!this.heal(this.modify(pokemon.maxhp, factor));
	if (!success) {
	this.add('-fail', pokemon, 'heal');
	return this.NOT_FAIL;
	}
	return success;
	},
secondary:	secondary: null,
target:	target: "self",
type: "Grass",	type: "Grass",
	},
	
trailblaze: {	trailblaze: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Trailblaze",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	self: {
	boosts: {
	spe: 1,
	},
	},
	},
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
tropkick: {	tropkick: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Trop Kick",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	atk: -1,
	},
	},
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
vinewhip: {	vinewhip: {
accuracy:	accuracy: 95,
basePower:	basePower: 45,
category:	category: "Physical",
	name: "Vine Whip",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
woodhammer: {	woodhammer: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Wood Hammer",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	recoil: [33, 100],
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
worryseed: {	worryseed: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Worry Seed",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	onTryImmunity(target) {
	// Truant and Insomnia have special treatment; they fail before
	// checking accuracy and will double Stomping Tantrum's BP
	if (target.ability === 'truant' || target.ability === 'insomnia') {
	return false;
	}
	},
	onTryHit(target) {
	if (target.getAbility().isPermanent) {
	return false;
	}
	},
	onHit(pokemon) {
	const oldAbility = pokemon.setAbility('insomnia');
	if (oldAbility) {
	this.add('-ability', pokemon, 'Insomnia', '[from] move: Worry Seed');
	if (pokemon.status === 'slp') {
	pokemon.cureStatus();
	}
	return;
	}
	return oldAbility as false | null;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Grass",	type: "Grass",
	},
	
boneclub: {	boneclub: {
accuracy:	accuracy: 85,
basePower:	basePower: 65,
category:	category: "Physical",
	name: "Bone Club",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
bonemerang: {	bonemerang: {
accuracy:	accuracy: 90,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Bonemerang",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	multihit: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
bonerush: {	bonerush: {
accuracy:	accuracy: 90,
basePower:	basePower: 25,
category:	category: "Physical",
	name: "Bone Rush",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	multihit: [2, 5],
secondary:	secondary: null,
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
bulldoze: {	bulldoze: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Bulldoze",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spe: -1,
	},
	},
target:	target: "allAdjacent",
type: "Ground",	type: "Ground",
	},
	
dig: {	dig: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Dig",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, charge: 1, protect: 1, mirror: 1, nonsky: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1},
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	this.add('-prepare', attacker, move.name);
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
	condition: {
	duration: 2,
	onImmunity(type, pokemon) {
	if (type === 'sandstorm' || type === 'hail') return false;
	},
	onInvulnerability(target, source, move) {
	if (['earthquake', 'magnitude'].includes(move.id)) {
	return;
	}
	return false;
	},
	onSourceModifyDamage(damage, source, target, move) {
	if (move.id === 'earthquake' || move.id === 'magnitude') {
	return this.chainModify(2);
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
drillrun: {	drillrun: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Drill Run",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
earthpower: {	earthpower: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Earth Power",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1},
secondary:	secondary: {
	chance: 10,
	boosts: {
	spd: -1,
	},
	},
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
earthquake: {	earthquake: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Earthquake",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1},
secondary:	secondary: null,
target:	target: "allAdjacent",
type: "Ground",	type: "Ground",
	},
	
fissure: {	fissure: {
accuracy:	accuracy: 30,
basePower:	basePower: 0,
category:	category: "Physical",
	name: "Fissure",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1},
	ohko: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
headlongrush: {	headlongrush: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Headlong Rush",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
	self: {
	boosts: {
	def: -1,
	spd: -1,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
highhorsepower: {	highhorsepower: {
accuracy:	accuracy: 95,
basePower:	basePower: 95,
category:	category: "Physical",
	name: "High Horsepower",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
landswrath: {	landswrath: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Land's Wrath",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Ground",	type: "Ground",
	},
	
magnitude: {	magnitude: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Physical",
	name: "Magnitude",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1},
	onModifyMove(move, pokemon) {
	const i = this.random(100);
	if (i < 5) {
	move.magnitude = 4;
	move.basePower = 10;
	} else if (i < 15) {
	move.magnitude = 5;
	move.basePower = 30;
	} else if (i < 35) {
	move.magnitude = 6;
	move.basePower = 50;
	} else if (i < 65) {
	move.magnitude = 7;
	move.basePower = 70;
	} else if (i < 85) {
	move.magnitude = 8;
	move.basePower = 90;
	} else if (i < 95) {
	move.magnitude = 9;
	move.basePower = 110;
	} else {
	move.magnitude = 10;
	move.basePower = 150;
	}
	},
	onUseMoveMessage(pokemon, target, move) {
	this.add('-activate', pokemon, 'move: Magnitude', move.magnitude);
	},
secondary:	secondary: null,
target:	target: "allAdjacent",
type: "Ground",	type: "Ground",
	},
	
mudbomb: {	mudbomb: {
accuracy:	accuracy: 85,
basePower:	basePower: 65,
category:	category: "Special",
	name: "Mud Bomb",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
boosts: {	boosts: {
accuracy:	accuracy: -1,
	},
	},
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
mudshot: {	mudshot: {
accuracy:	accuracy: 95,
basePower:	basePower: 55,
category:	category: "Special",
	name: "Mud Shot",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spe: -1,
	},
	},
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
mudslap: {	mudslap: {
accuracy:	accuracy: 95,
basePower:	basePower: 20,
category:	category: "Special",
	name: "Mud-Slap",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
boosts: {	boosts: {
accuracy:	accuracy: -1,
	},
	},
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
mudsport: {	mudsport: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Mud Sport",
	pp: 1.25,
priority:	priority: 0,
	flags: {nonsky: 1},
	pseudoWeather: 'mudsport',
	condition: {
	duration: 5,
	onFieldStart(field, source) {
	this.add('-fieldstart', 'move: Mud Sport', '[of] ' + source);
	},
	onBasePowerPriority: 1,
	onBasePower(basePower, attacker, defender, move) {
	if (move.type === 'Electric') {
	this.debug('mud sport weaken');
	return this.chainModify([1352, 4096]);
	}
	},
	onFieldResidualOrder: 27,
	onFieldResidualSubOrder: 4,
	onFieldEnd() {
	this.add('-fieldend', 'move: Mud Sport');
	},
	},
secondary:	secondary: null,
target:	target: "all",
type: "Ground",	type: "Ground",
	},
	
precipiceblades: {	precipiceblades: {
accuracy:	accuracy: 85,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Precipice Blades",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1},
target:	target: "allAdjacentFoes",
type: "Ground",	type: "Ground",
	},
	
rototiller: {	rototiller: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Rototiller",
	pp: 1.25,
priority:	priority: 0,
	flags: {distance: 1, nonsky: 1},
	onHitField(target, source) {
	const targets: Pokemon[] = [];
	let anyAirborne = false;
	for (const pokemon of this.getAllActive()) {
	if (!pokemon.runImmunity('Ground')) {
	this.add('-immune', pokemon);
	anyAirborne = true;
	continue;
	}
	if (pokemon.hasType('Grass')) {
	// This move affects every grounded Grass-type Pokemon in play.
	targets.push(pokemon);
	}
	}
	if (!targets.length && !anyAirborne) return false; // Fails when there are no grounded Grass types or airborne Pokemon
	for (const pokemon of targets) {
	this.boost({atk: 1, spa: 1}, pokemon, source);
	}
	},
secondary:	secondary: null,
target:	target: "all",
type: "Ground",	type: "Ground",
	},
	
sandattack: {	sandattack: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Sand Attack",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
boosts: {	boosts: {
accuracy:	accuracy: -1,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
sandsearstorm: {	sandsearstorm: {
accuracy:	accuracy: 80,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Sandsear Storm",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, wind: 1},
secondary:	secondary: {
	chance: 20,
	status: 'brn',
	},
target:	target: "allAdjacentFoes",
type: "Ground",	type: "Ground",
	},
	
sandtomb: {	sandtomb: {
accuracy:	accuracy: 85,
basePower:	basePower: 35,
category:	category: "Physical",
	name: "Sand Tomb",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	volatileStatus: 'partiallytrapped',
secondary:	secondary: null,
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
scorchingsands: {	scorchingsands: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Special",
	name: "Scorching Sands",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, defrost: 1},
	thawsTarget: true,
secondary:	secondary: {
	chance: 30,
	status: 'brn',
	},
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
shoreup: {	shoreup: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Shore Up",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	onHit(pokemon) {
	let factor = 0.5;
	if (this.field.isWeather('sandstorm')) {
	factor = 0.667;
	}
	const success = !!this.heal(this.modify(pokemon.maxhp, factor));
	if (!success) {
	this.add('-fail', pokemon, 'heal');
	return this.NOT_FAIL;
	}
	return success;
	},
secondary:	secondary: null,
target:	target: "self",
type: "Ground",	type: "Ground",
	},
	
spikes: {	spikes: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Spikes",
	pp: 1.25,
priority:	priority: 0,
	flags: {reflectable: 1, nonsky: 1, mustpressure: 1},
	sideCondition: 'spikes',
	condition: {
	// this is a side condition
	onSideStart(side) {
	this.add('-sidestart', side, 'Spikes');
	this.effectState.layers = 1;
	},
	onSideRestart(side) {
	if (this.effectState.layers >= 3) return false;
	this.add('-sidestart', side, 'Spikes');
	this.effectState.layers++;
	},
	onEntryHazard(pokemon) {
	if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
	const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
	this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
	},
	},
secondary:	secondary: null,
target:	target: "foeSide",
type: "Ground",	type: "Ground",
	},
	
stompingtantrum: {	stompingtantrum: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
	basePowerCallback(pokemon, target, move) {
	if (pokemon.moveLastTurnResult === false) {
	this.debug('doubling Stomping Tantrum BP due to previous move failure');
	return move.basePower * 2;
	}
	return move.basePower;
	},
category:	category: "Physical",
	name: "Stomping Tantrum",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
tectonicrage: {	tectonicrage: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "Tectonic Rage",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Ground",	type: "Ground",
	},
	
thousandarrows: {	thousandarrows: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Thousand Arrows",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1},
	onEffectiveness(typeMod, target, type, move) {
	if (move.type !== 'Ground') return;
	if (!target) return; // avoid crashing when called from a chat plugin
	// ignore effectiveness if the target is Flying type and immune to Ground
	if (!target.runImmunity('Ground')) {
	if (target.hasType('Flying')) return 0;
	}
	},
	volatileStatus: 'smackdown',
	ignoreImmunity: {'Ground': true},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Ground",	type: "Ground",
	},
	
thousandwaves: {	thousandwaves: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Thousand Waves",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1},
	onHit(target, source, move) {
	if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Ground",	type: "Ground",
	},
	
aurorabeam: {	aurorabeam: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Special",
	name: "Aurora Beam",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	boosts: {
	atk: -1,
	},
	},
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
auroraveil: {	auroraveil: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Aurora Veil",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	sideCondition: 'auroraveil',
	onTry() {
	return this.field.isWeather(['hail', 'snow']);
	},
	condition: {
	duration: 5,
	durationCallback(target, source, effect) {
	if (source?.hasItem('lightclay')) {
	return 8;
	}
	return 5;
	},
	onAnyModifyDamage(damage, source, target, move) {
	if (target !== source && this.effectState.target.hasAlly(target)) {
	if ((target.side.getSideCondition('reflect') && this.getCategory(move) === 'Physical') ||
	(target.side.getSideCondition('lightscreen') && this.getCategory(move) === 'Special')) {
	return;
	}
	if (!target.getMoveHitData(move).crit && !move.infiltrates) {
	this.debug('Aurora Veil weaken');
	if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
	return this.chainModify(0.5);
	}
	}
	},
	onSideStart(side) {
	this.add('-sidestart', side, 'move: Aurora Veil');
	},
	onSideResidualOrder: 26,
	onSideResidualSubOrder: 10,
	onSideEnd(side) {
	this.add('-sideend', side, 'move: Aurora Veil');
	},
	},
secondary:	secondary: null,
target:	target: "allySide",
type: "Ice",	type: "Ice",
	},
	
avalanche: {	avalanche: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
	basePowerCallback(pokemon, target, move) {
	const damagedByTarget = pokemon.attackedBy.some(
	p => p.source === target && p.damage > 0 && p.thisTurn
	);
	if (damagedByTarget) {
	this.debug('BP doubled for getting hit by ' + target);
	return move.basePower * 2;
	}
	return move.basePower;
	},
category:	category: "Physical",
	name: "Avalanche",
	pp: 1.25,
priority:	priority: -4,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
blizzard: {	blizzard: {
accuracy:	accuracy: 70,
basePower:	basePower: 110,
category:	category: "Special",
	name: "Blizzard",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, wind: 1},
	onModifyMove(move) {
	if (this.field.isWeather(['hail', 'snow'])) move.accuracy = true;
	},
secondary:	secondary: {
	chance: 10,
	status: 'frz',
	},
target:	target: "allAdjacentFoes",
type: "Ice",	type: "Ice",
	},
	
chillyreception: {	chillyreception: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Chilly Reception",
	pp: 1.25,
priority:	priority: 0,
	flags: {},
	// TODO show prepare message before the "POKEMON used MOVE!" message
	// This happens even before sleep shows its "POKEMON is fast asleep." message
	weather: 'snow',
	selfSwitch: true,
secondary:	secondary: null,
target:	target: "all",
type: "Ice",	type: "Ice",
	},
	
freezedry: {	freezedry: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Special",
	name: "Freeze-Dry",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onEffectiveness(typeMod, target, type) {
	if (type === 'Water') return 1;
	},
secondary:	secondary: {
	chance: 10,
	status: 'frz',
	},
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
freezeshock: {	freezeshock: {
accuracy:	accuracy: 90,
basePower:	basePower: 140,
category:	category: "Physical",
	name: "Freeze Shock",
	pp: 1.25,
priority:	priority: 0,
	flags: {charge: 1, protect: 1, mirror: 1, nosleeptalk: 1, failinstruct: 1},
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	this.add('-prepare', attacker, move.name);
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
secondary:	secondary: {
	chance: 30,
	status: 'par',
	},
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
freezyfrost: {	freezyfrost: {
accuracy:	accuracy: 90,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Freezy Frost",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onHit() {
	this.add('-clearallboost');
	for (const pokemon of this.getAllActive()) {
	pokemon.clearBoosts();
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
frostbreath: {	frostbreath: {
accuracy:	accuracy: 90,
basePower:	basePower: 60,
category:	category: "Special",
	name: "Frost Breath",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	willCrit: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
glaciallance: {	glaciallance: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Glacial Lance",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Ice",	type: "Ice",
	},
	
glaciate: {	glaciate: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Special",
	name: "Glaciate",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spe: -1,
	},
	},
target:	target: "allAdjacentFoes",
type: "Ice",	type: "Ice",
	},
	
hail: {	hail: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Hail",
	pp: 1.25,
priority:	priority: 0,
	flags: {},
	weather: 'hail',
secondary:	secondary: null,
target:	target: "all",
type: "Ice",	type: "Ice",
	},
	
haze: {	haze: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Haze",
	pp: 1.25,
priority:	priority: 0,
	flags: {bypasssub: 1},
	onHitField() {
	this.add('-clearallboost');
	for (const pokemon of this.getAllActive()) {
	pokemon.clearBoosts();
	}
	},
secondary:	secondary: null,
target:	target: "all",
type: "Ice",	type: "Ice",
	},
	
iceball: {	iceball: {
accuracy:	accuracy: 90,
basePower:	basePower: 30,
	basePowerCallback(pokemon, target, move) {
	let bp = move.basePower;
	const iceballData = pokemon.volatiles['iceball'];
	if (iceballData?.hitCount) {
	bp *= Math.pow(2, iceballData.contactHitCount);
	}
	if (iceballData && pokemon.status !== 'slp') {
	iceballData.hitCount++;
	iceballData.contactHitCount++;
	if (iceballData.hitCount < 5) {
	iceballData.duration = 2;
	}
	}
	if (pokemon.volatiles['defensecurl']) {
	bp *= 2;
	}
	this.debug("BP: " + bp);
	return bp;
	},
category:	category: "Physical",
	name: "Ice Ball",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, contact: 1, protect: 1, mirror: 1, noparentalbond: 1, failinstruct: 1},
	onModifyMove(move, pokemon, target) {
	if (pokemon.volatiles['iceball'] || pokemon.status === 'slp' || !target) return;
	pokemon.addVolatile('iceball');
	// @ts-ignore
	// TS thinks pokemon.volatiles['iceball'] doesn't exist because of the condition on the return above
	// but it does exist now because addVolatile created it
	pokemon.volatiles['iceball'].targetSlot = move.sourceEffect ? pokemon.lastMoveTargetLoc : pokemon.getLocOf(target);
	},
	onAfterMove(source, target, move) {
	const iceballData = source.volatiles["iceball"];
	if (
	iceballData &&
	iceballData.hitCount === 5 &&
	iceballData.contactHitCount < 5
	// this conditions can only be met in gen7 and gen8dlc1
	// see `disguise` and `iceface` abilities in the resp mod folders
	) {
	source.addVolatile("rolloutstorage");
	source.volatiles["rolloutstorage"].contactHitCount =
	iceballData.contactHitCount;
	}
	},
	condition: {
	duration: 1,
	onLockMove: 'iceball',
	onStart() {
	this.effectState.hitCount = 0;
	this.effectState.contactHitCount = 0;
	},
	onResidual(target) {
	if (target.lastMove && target.lastMove.id === 'struggle') {
	// don't lock
	delete target.volatiles['iceball'];
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
icebeam: {	icebeam: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Ice Beam",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	status: 'frz',
	},
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
iceburn: {	iceburn: {
accuracy:	accuracy: 90,
basePower:	basePower: 140,
category:	category: "Special",
	name: "Ice Burn",
	pp: 1.25,
priority:	priority: 0,
	flags: {charge: 1, protect: 1, mirror: 1, nosleeptalk: 1, failinstruct: 1},
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	this.add('-prepare', attacker, move.name);
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
secondary:	secondary: {
	chance: 30,
	status: 'brn',
	},
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
icefang: {	icefang: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Physical",
	name: "Ice Fang",
	pp: 1.25,
priority:	priority: 0,
	flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
	secondaries: [
	{
	chance: 10,
	status: 'frz',
	}, {
	chance: 10,
	volatileStatus: 'flinch',
	},
	],
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
icehammer: {	icehammer: {
accuracy:	accuracy: 90,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Ice Hammer",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
	self: {
	boosts: {
	spe: -1,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
icepunch: {	icepunch: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Physical",
	name: "Ice Punch",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
secondary:	secondary: {
	chance: 10,
	status: 'frz',
	},
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
iceshard: {	iceshard: {
accuracy:	accuracy: 90,
basePower:	basePower: 45,
category:	category: "Physical",
	name: "Ice Shard",
	pp: 1.25,
priority:	priority: 1,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
icespinner: {	icespinner: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Ice Spinner",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onHit() {
	this.field.clearTerrain();
	},
	onAfterSubDamage() {
	this.field.clearTerrain();
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
iciclecrash: {	iciclecrash: {
accuracy:	accuracy: 90,
basePower:	basePower: 85,
category:	category: "Physical",
	name: "Icicle Crash",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
iciclespear: {	iciclespear: {
accuracy:	accuracy: 95,
basePower:	basePower: 25,
category:	category: "Physical",
	name: "Icicle Spear",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	multihit: [2, 5],
secondary:	secondary: null,
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
icywind: {	icywind: {
accuracy:	accuracy: 95,
basePower:	basePower: 55,
category:	category: "Special",
	name: "Icy Wind",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, wind: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spe: -1,
	},
	},
target:	target: "allAdjacentFoes",
type: "Ice",	type: "Ice",
	},
	
mist: {	mist: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Mist",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	sideCondition: 'mist',
	condition: {
	duration: 5,
	onTryBoost(boost, target, source, effect) {
	if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
	if (source && target !== source) {
	let showMsg = false;
	let i: BoostID;
	for (i in boost) {
	if (boost[i]! < 0) {
	delete boost[i];
	showMsg = true;
	}
	}
	if (showMsg && !(effect as ActiveMove).secondaries) {
	this.add('-activate', target, 'move: Mist');
	}
	}
	},
	onSideStart(side) {
	this.add('-sidestart', side, 'Mist');
	},
	onSideResidualOrder: 26,
	onSideResidualSubOrder: 4,
	onSideEnd(side) {
	this.add('-sideend', side, 'Mist');
	},
	},
secondary:	secondary: null,
target:	target: "allySide",
type: "Ice",	type: "Ice",
	},
	
mountaingale: {	mountaingale: {
accuracy:	accuracy: 85,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Mountain Gale",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
powdersnow: {	powdersnow: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Special",
	name: "Powder Snow",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	status: 'frz',
	},
target:	target: "allAdjacentFoes",
type: "Ice",	type: "Ice",
	},
	
sheercold: {	sheercold: {
accuracy:	accuracy: 30,
basePower:	basePower: 0,
category:	category: "Special",
	name: "Sheer Cold",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
	ohko: 'Ice',
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
snowscape: {	snowscape: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Snowscape",
	pp: 1.25,
priority:	priority: 0,
	flags: {},
	weather: 'snow',
secondary:	secondary: null,
target:	target: "all",
type: "Ice",	type: "Ice",
	},
	
subzeroslammer: {	subzeroslammer: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "Subzero Slammer",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
tripleaxel: {	tripleaxel: {
accuracy:	accuracy: 90,
basePower:	basePower: 20,
	basePowerCallback(pokemon, target, move) {
	return 20 * move.hit;
	},
category:	category: "Physical",
	name: "Triple Axel",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
multihit: 3,	multihit: 3,
accuracy:	multiaccuracy: 95,
secondary:	secondary: null,
target:	target: "normal",
type: "Ice",	type: "Ice",
	},
	
acupressure: {	acupressure: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Acupressure",
	pp: 1.25,
priority:	priority: 0,
	flags: {},
	onHit(target) {
	const stats: BoostID[] = [];
	let stat: BoostID;
	for (stat in target.boosts) {
	if (target.boosts[stat] < 6) {
	stats.push(stat);
	}
	}
	if (stats.length) {
	const randomStat = this.sample(stats);
	const boost: SparseBoostsTable = {};
	boost[randomStat] = 2;
	this.boost(boost);
	} else {
	return false;
	}
	},
secondary:	secondary: null,
target:	target: "adjacentAllyOrSelf",
type: "Normal",	type: "Normal",
	},
	
afteryou: {	afteryou: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "After You",
	pp: 1.25,
priority:	priority: 0,
	flags: {bypasssub: 1, allyanim: 1},
	onHit(target) {
	if (target.side.active.length < 2) return false; // fails in singles
	const action = this.queue.willMove(target);
	if (action) {
	this.queue.prioritizeAction(action);
	this.add('-activate', target, 'move: After You');
	} else {
	return false;
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
assist: {	assist: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Assist",
	pp: 1.25,
priority:	priority: 0,
	flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1},
	onHit(target) {
	const moves = [];
	for (const pokemon of target.side.pokemon) {
	if (pokemon === target) continue;
	for (const moveSlot of pokemon.moveSlots) {
	const moveid = moveSlot.id;
	const move = this.dex.moves.get(moveid);
	if (move.flags['noassist'] || move.isZ || move.isMax) {
	continue;
	}
	moves.push(moveid);
	}
	}
	let randomMove = '';
	if (moves.length) randomMove = this.sample(moves);
	if (!randomMove) {
	return false;
	}
	this.actions.useMove(randomMove, target);
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
attract: {	attract: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Attract",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, bypasssub: 1},
	volatileStatus: 'attract',
	condition: {
	noCopy: true, // doesn't get copied by Baton Pass
	onStart(pokemon, source, effect) {
	if (!(pokemon.gender === 'M' && source.gender === 'F') && !(pokemon.gender === 'F' && source.gender === 'M')) {
	this.debug('incompatible gender');
	return false;
	}
	if (!this.runEvent('Attract', pokemon, source)) {
	this.debug('Attract event failed');
	return false;
	}
	if (effect.name === 'Cute Charm') {
	this.add('-start', pokemon, 'Attract', '[from] ability: Cute Charm', '[of] ' + source);
	} else if (effect.name === 'Destiny Knot') {
	this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', '[of] ' + source);
	} else {
	this.add('-start', pokemon, 'Attract');
	}
	},
	onUpdate(pokemon) {
	if (this.effectState.source && !this.effectState.source.isActive && pokemon.volatiles['attract']) {
	this.debug('Removing Attract volatile on ' + pokemon);
	pokemon.removeVolatile('attract');
	}
	},
	onBeforeMovePriority: 2,
	onBeforeMove(pokemon, target, move) {
	this.add('-activate', pokemon, 'move: Attract', '[of] ' + this.effectState.source);
	if (this.randomChance(1, 2)) {
	this.add('cant', pokemon, 'Attract');
	return false;
	}
	},
	onEnd(pokemon) {
	this.add('-end', pokemon, 'Attract', '[silent]');
	},
	},
	onTryImmunity(target, source) {
	return (target.gender === 'M' && source.gender === 'F') || (target.gender === 'F' && source.gender === 'M');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
barrage: {	barrage: {
accuracy:	accuracy: 85,
basePower:	basePower: 15,
category:	category: "Physical",
	name: "Barrage",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
	multihit: [2, 5],
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
batonpass: {	batonpass: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Baton Pass",
	pp: 125,
priority:	priority: 0,
	flags: {},
	onTryHit(target) {
	if (!this.canSwitch(target.side) || target.volatiles['commanded']) {
	this.attrLastMove('[still]');
	this.add('-fail', target);
	return this.NOT_FAIL;
	}
	},
	self: {
	onHit(source) {
	source.skipBeforeSwitchOutEventFlag = true;
	},
	},
	selfSwitch: 'copyvolatile',
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
bellydrum: {	bellydrum: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Belly Drum",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	onHit(target) {
	if (target.hp <= target.maxhp / 2 || target.boosts.atk >= 6 || target.maxhp === 1) { // Shedinja clause
	return false;
	}
	this.directDamage(target.maxhp / 2);
	this.boost({atk: 12}, target);
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
bestow: {	bestow: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Bestow",
	pp: 1.25,
priority:	priority: 0,
	flags: {mirror: 1, bypasssub: 1, allyanim: 1, noassist: 1, failcopycat: 1},
	onHit(target, source, move) {
	if (target.item) {
	return false;
	}
	const myItem = source.takeItem();
	if (!myItem) return false;
	if (!this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem) || !target.setItem(myItem)) {
	source.item = myItem.id;
	return false;
	}
	this.add('-item', target, myItem.name, '[from] move: Bestow', '[of] ' + source);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
bide: {	bide: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Physical",
	name: "Bide",
	pp: 1.25,
priority:	priority: 1,
	flags: {contact: 1, protect: 1, nosleeptalk: 1, failinstruct: 1},
	volatileStatus: 'bide',
	ignoreImmunity: true,
	beforeMoveCallback(pokemon) {
	if (pokemon.volatiles['bide']) return true;
	},
	condition: {
	duration: 3,
	onLockMove: 'bide',
	onStart(pokemon) {
	this.effectState.totalDamage = 0;
	this.add('-start', pokemon, 'move: Bide');
	},
	onDamagePriority: -101,
	onDamage(damage, target, source, move) {
	if (!move || move.effectType !== 'Move' || !source) return;
	this.effectState.totalDamage += damage;
	this.effectState.lastDamageSource = source;
	},
	onBeforeMove(pokemon, target, move) {
	if (this.effectState.duration === 1) {
	this.add('-end', pokemon, 'move: Bide');
	target = this.effectState.lastDamageSource;
	if (!target || !this.effectState.totalDamage) {
	this.attrLastMove('[still]');
	this.add('-fail', pokemon);
	return false;
	}
	if (!target.isActive) {
	const possibleTarget = this.getRandomTarget(pokemon, this.dex.moves.get('pound'));
	if (!possibleTarget) {
	this.add('-miss', pokemon);
	return false;
	}
	target = possibleTarget;
	}
	const moveData: Partial<ActiveMove> = {
	id: 'bide' as ID,
name: "Bide",	name: "Bide",
accuracy:	accuracy: 95,
	damage: this.effectState.totalDamage * 2,
category:	category: "Physical",
priority:	priority: 1,
	flags: {contact: 1, protect: 1},
	effectType: 'Move',
type: 'Normal',	type: 'Normal',
	};
	this.actions.tryMoveHit(target, pokemon, moveData as ActiveMove);
	pokemon.removeVolatile('bide');
	return false;
	}
	this.add('-activate', pokemon, 'move: Bide');
	},
	onMoveAborted(pokemon) {
	pokemon.removeVolatile('bide');
	},
	onEnd(pokemon) {
	this.add('-end', pokemon, 'move: Bide', '[silent]');
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
bind: {	bind: {
accuracy:	accuracy: 85,
basePower:	basePower: 15,
category:	category: "Physical",
	name: "Bind",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	volatileStatus: 'partiallytrapped',
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
block: {	block: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Block",
	pp: 1.25,
priority:	priority: 0,
	flags: {reflectable: 1, mirror: 1},
	onHit(target, source, move) {
	return target.addVolatile('trapped', source, move, 'trapper');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
bodyslam: {	bodyslam: {
accuracy:	accuracy: 95,
basePower:	basePower: 85,
category:	category: "Physical",
	name: "Body Slam",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
secondary:	secondary: {
	chance: 30,
	status: 'par',
	},
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
boomburst: {	boomburst: {
accuracy:	accuracy: 95,
basePower:	basePower: 140,
category:	category: "Special",
	name: "Boomburst",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
secondary:	secondary: null,
target:	target: "allAdjacent",
type: "Normal",	type: "Normal",
	},
	
breakneckblitz: {	breakneckblitz: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "Breakneck Blitz",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
camouflage: {	camouflage: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Camouflage",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	onHit(target) {
	let newType = 'Normal';
	if (this.field.isTerrain('electricterrain')) {
	newType = 'Electric';
	} else if (this.field.isTerrain('grassyterrain')) {
	newType = 'Grass';
	} else if (this.field.isTerrain('mistyterrain')) {
	newType = 'Fairy';
	} else if (this.field.isTerrain('psychicterrain')) {
	newType = 'Psychic';
	}
	if (target.getTypes().join() === newType || !target.setType(newType)) return false;
	this.add('-start', target, 'typechange', newType);
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
captivate: {	captivate: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Captivate",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	onTryImmunity(pokemon, source) {
	return (pokemon.gender === 'M' && source.gender === 'F') || (pokemon.gender === 'F' && source.gender === 'M');
	},
	boosts: {
	spa: -2,
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Normal",	type: "Normal",
	},
	
celebrate: {	celebrate: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Celebrate",
	pp: 125,
priority:	priority: 0,
	flags: {nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1},
	onTryHit(target, source) {
	this.add('-activate', target, 'move: Celebrate');
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
chipaway: {	chipaway: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Chip Away",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	ignoreDefensive: true,
	ignoreEvasion: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
cometpunch: {	cometpunch: {
accuracy:	accuracy: 85,
basePower:	basePower: 18,
category:	category: "Physical",
	name: "Comet Punch",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
	multihit: [2, 5],
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
confide: {	confide: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Confide",
	pp: 1.25,
priority:	priority: 0,
	flags: {reflectable: 1, mirror: 1, sound: 1, bypasssub: 1},
	boosts: {
	spa: -1,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
constrict: {	constrict: {
accuracy:	accuracy: 95,
basePower:	basePower: 10,
category:	category: "Physical",
	name: "Constrict",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	boosts: {
	spe: -1,
	},
	},
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
conversion: {	conversion: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Conversion",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	onHit(target) {
	const type = this.dex.moves.get(target.moveSlots[0].id).type;
	if (target.hasType(type) || !target.setType(type)) return false;
	this.add('-start', target, 'typechange', type);
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
conversion2: {	conversion2: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Conversion 2",
	pp: 1.25,
priority:	priority: 0,
	flags: {bypasssub: 1},
	onHit(target, source) {
	if (!target.lastMoveUsed) {
	return false;
	}
	const possibleTypes = [];
	const attackType = target.lastMoveUsed.type;
	for (const type of this.dex.types.names()) {
	if (source.hasType(type)) continue;
	const typeCheck = this.dex.types.get(type).damageTaken[attackType];
	if (typeCheck === 2 || typeCheck === 3) {
	possibleTypes.push(type);
	}
	}
	if (!possibleTypes.length) {
	return false;
	}
	const randomType = this.sample(possibleTypes);
	if (!source.setType(randomType)) return false;
	this.add('-start', source, 'typechange', randomType);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
copycat: {	copycat: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Copycat",
	pp: 1.25,
priority:	priority: 0,
	flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1},
	onHit(pokemon) {
	let move: Move | ActiveMove | null = this.lastMove;
	if (!move) return;
	if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
	if (move.flags['failcopycat'] || move.isZ || move.isMax) {
	return false;
	}
	this.actions.useMove(move.id, pokemon);
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
courtchange: {	courtchange: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Court Change",
	pp: 1.25,
priority:	priority: 0,
	flags: {mirror: 1},
	onHitField(target, source) {
	const sideConditions = [
	'mist', 'lightscreen', 'reflect', 'spikes', 'safeguard', 'tailwind', 'toxicspikes', 'stealthrock', 'waterpledge', 'firepledge', 'grasspledge', 'stickyweb', 'auroraveil', 'gmaxsteelsurge', 'gmaxcannonade', 'gmaxvinelash', 'gmaxwildfire',
	];
	let success = false;
	if (this.gameType === "freeforall") {
	// random integer from 1-3 inclusive
	const offset = this.random(3) + 1;
	// the list of all sides in counterclockwise order
	const sides = [this.sides[0], this.sides[2]!, this.sides[1], this.sides[3]!];
	const temp: {[k: number]: typeof source.side.sideConditions} = {0: {}, 1: {}, 2: {}, 3: {}};
	for (const side of sides) {
	for (const id in side.sideConditions) {
	if (!sideConditions.includes(id)) continue;
	temp[side.n][id] = side.sideConditions[id];
	delete side.sideConditions[id];
	const effectName = this.dex.conditions.get(id).name;
	this.add('-sideend', side, effectName, '[silent]');
	success = true;
	}
	}
	for (let i = 0; i < 4; i++) {
	const sourceSideConditions = temp[sides[i].n];
	const targetSide = sides[(i + offset) % 4]; // the next side in rotation
	for (const id in sourceSideConditions) {
	targetSide.sideConditions[id] = sourceSideConditions[id];
	const effectName = this.dex.conditions.get(id).name;
	let layers = sourceSideConditions[id].layers || 1;
	for (; layers > 0; layers--) this.add('-sidestart', targetSide, effectName, '[silent]');
	}
	}
	} else {
	const sourceSideConditions = source.side.sideConditions;
	const targetSideConditions = source.side.foe.sideConditions;
	const sourceTemp: typeof sourceSideConditions = {};
	const targetTemp: typeof targetSideConditions = {};
	for (const id in sourceSideConditions) {
	if (!sideConditions.includes(id)) continue;
	sourceTemp[id] = sourceSideConditions[id];
	delete sourceSideConditions[id];
	success = true;
	}
	for (const id in targetSideConditions) {
	if (!sideConditions.includes(id)) continue;
	targetTemp[id] = targetSideConditions[id];
	delete targetSideConditions[id];
	success = true;
	}
	for (const id in sourceTemp) {
	targetSideConditions[id] = sourceTemp[id];
	}
	for (const id in targetTemp) {
	sourceSideConditions[id] = targetTemp[id];
	}
	this.add('-swapsideconditions');
	}
	if (!success) return false;
	this.add('-activate', source, 'move: Court Change');
	},
secondary:	secondary: null,
target:	target: "all",
type: "Normal",	type: "Normal",
	},
	
covet: {	covet: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Covet",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, failmefirst: 1, noassist: 1, failcopycat: 1},
	onAfterHit(target, source, move) {
	if (source.item || source.volatiles['gem']) {
	return;
	}
	const yourItem = target.takeItem(source);
	if (!yourItem) {
	return;
	}
	if (
	!this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem) ||
	!source.setItem(yourItem)
	) {
	target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
	return;
	}
	this.add('-item', source, yourItem, '[from] move: Covet', '[of] ' + target);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
crushclaw: {	crushclaw: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Physical",
	name: "Crush Claw",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 50,
	boosts: {
	def: -1,
	},
	},
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
crushgrip: {	crushgrip: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon, target) {
	const hp = target.hp;
	const maxHP = target.maxhp;
	const bp = Math.floor(Math.floor((120 * (100 * Math.floor(hp * 4096 / maxHP)) + 2048 - 1) / 4096) / 100) || 1;
	this.debug('BP for ' + hp + '/' + maxHP + " HP: " + bp);
	return bp;
	},
category:	category: "Physical",
	name: "Crush Grip",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
cut: {	cut: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Cut",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
defensecurl: {	defensecurl: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Defense Curl",
	pp: 125,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	def: 1,
	},
	volatileStatus: 'defensecurl',
	condition: {
	noCopy: true,
	onRestart: () => null,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
disable: {	disable: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Disable",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, bypasssub: 1},
	volatileStatus: 'disable',
	onTryHit(target) {
	if (!target.lastMove || target.lastMove.isZ || target.lastMove.isMax || target.lastMove.id === 'struggle') {
	return false;
	}
	},
	condition: {
	duration: 5,
	noCopy: true, // doesn't get copied by Baton Pass
	onStart(pokemon, source, effect) {
	// The target hasn't taken its turn, or Cursed Body activated and the move was not used through Dancer or Instruct
	if (
	this.queue.willMove(pokemon) ||
	(pokemon === this.activePokemon && this.activeMove && !this.activeMove.isExternal)
	) {
	this.effectState.duration--;
	}
	if (!pokemon.lastMove) {
	this.debug(`Pokemon hasn't moved yet`);
	return false;
	}
	for (const moveSlot of pokemon.moveSlots) {
	if (moveSlot.id === pokemon.lastMove.id) {
	if (!moveSlot.pp) {
	this.debug('Move out of PP');
	return false;
	}
	}
	}
	if (effect.effectType === 'Ability') {
	this.add('-start', pokemon, 'Disable', pokemon.lastMove.name, '[from] ability: Cursed Body', '[of] ' + source);
	} else {
	this.add('-start', pokemon, 'Disable', pokemon.lastMove.name);
	}
	this.effectState.move = pokemon.lastMove.id;
	},
	onResidualOrder: 17,
	onEnd(pokemon) {
	this.add('-end', pokemon, 'Disable');
	},
	onBeforeMovePriority: 7,
	onBeforeMove(attacker, defender, move) {
	if (!move.isZ && move.id === this.effectState.move) {
	this.add('cant', attacker, 'Disable', move);
	return false;
	}
	},
	onDisableMove(pokemon) {
	for (const moveSlot of pokemon.moveSlots) {
	if (moveSlot.id === this.effectState.move) {
	pokemon.disableMove(moveSlot.id);
	}
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
dizzypunch: {	dizzypunch: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Dizzy Punch",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
secondary:	secondary: {
	chance: 20,
	volatileStatus: 'confusion',
	},
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
doodle: {	doodle: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Doodle",
	pp: 1.25,
priority:	priority: 0,
	flags: {},
	onHit(target, source, move) {
	let success: boolean | null = false;
	for (const pokemon of source.alliesAndSelf()) {
	if (pokemon.ability === target.ability) continue;
	const oldAbility = pokemon.setAbility(target.ability);
	if (oldAbility) {
	this.add('-ability', pokemon, target.getAbility().name, '[from] move: Doodle');
	success = true;
	} else if (!success && oldAbility === null) {
	success = null;
	}
	}
	if (!success) {
	if (success === false) {
	this.add('-fail', source);
	}
	this.attrLastMove('[still]');
	return this.NOT_FAIL;
	}
	},
secondary:	secondary: null,
target:	target: "adjacentFoe",
type: "Normal",	type: "Normal",
	},
	
doubleedge: {	doubleedge: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Double-Edge",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	recoil: [33, 100],
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
doublehit: {	doublehit: {
accuracy:	accuracy: 90,
basePower:	basePower: 35,
category:	category: "Physical",
	name: "Double Hit",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	multihit: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
doubleslap: {	doubleslap: {
accuracy:	accuracy: 85,
basePower:	basePower: 15,
category:	category: "Physical",
	name: "Double Slap",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	multihit: [2, 5],
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
doubleteam: {	doubleteam: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Double Team",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	evasion: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
echoedvoice: {	echoedvoice: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
	basePowerCallback(pokemon, target, move) {
	let bp = move.basePower;
	if (this.field.pseudoWeather.echoedvoice) {
	bp = move.basePower * this.field.pseudoWeather.echoedvoice.multiplier;
	}
	this.debug('BP: ' + move.basePower);
	return bp;
	},
category:	category: "Special",
	name: "Echoed Voice",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
	onTry() {
	this.field.addPseudoWeather('echoedvoice');
	},
	condition: {
	duration: 2,
	onFieldStart() {
	this.effectState.multiplier = 1;
	},
	onFieldRestart() {
	if (this.effectState.duration !== 2) {
	this.effectState.duration = 2;
	if (this.effectState.multiplier < 5) {
	this.effectState.multiplier++;
	}
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
eggbomb: {	eggbomb: {
accuracy:	accuracy: 75,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Egg Bomb",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
encore: {	encore: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Encore",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, failencore: 1},
	volatileStatus: 'encore',
	condition: {
	duration: 3,
	noCopy: true, // doesn't get copied by Z-Baton Pass
	onStart(target) {
	let move: Move | ActiveMove | null = target.lastMove;
	if (!move || target.volatiles['dynamax']) return false;
	if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
	const moveIndex = target.moves.indexOf(move.id);
	if (move.isZ || move.flags['failencore'] || !target.moveSlots[moveIndex] || target.moveSlots[moveIndex].pp <= 0) {
	// it failed
	return false;
	}
	this.effectState.move = move.id;
	this.add('-start', target, 'Encore');
	if (!this.queue.willMove(target)) {
	this.effectState.duration++;
	}
	},
	onOverrideAction(pokemon, target, move) {
	if (move.id !== this.effectState.move) return this.effectState.move;
	},
	onResidualOrder: 16,
	onResidual(target) {
	if (target.moves.includes(this.effectState.move) &&
	target.moveSlots[target.moves.indexOf(this.effectState.move)].pp <= 0) {
	// early termination if you run out of PP
	target.removeVolatile('encore');
	}
	},
	onEnd(target) {
	this.add('-end', target, 'Encore');
	},
	onDisableMove(pokemon) {
	if (!this.effectState.move || !pokemon.hasMove(this.effectState.move)) {
	return;
	}
	for (const moveSlot of pokemon.moveSlots) {
	if (moveSlot.id !== this.effectState.move) {
	pokemon.disableMove(moveSlot.id);
	}
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
endeavor: {	endeavor: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	damageCallback(pokemon, target) {
	return target.getUndynamaxedHP() - pokemon.hp;
	},
category:	category: "Physical",
	name: "Endeavor",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, noparentalbond: 1},
	onTryImmunity(target, pokemon) {
	return pokemon.hp < target.hp;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
endure: {	endure: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Endure",
	pp: 1.25,
priority:	priority: 4,
	flags: {noassist: 1, failcopycat: 1},
	stallingMove: true,
	volatileStatus: 'endure',
	onPrepareHit(pokemon) {
	return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
	},
	onHit(pokemon) {
	pokemon.addVolatile('stall');
	},
	condition: {
	duration: 1,
	onStart(target) {
	this.add('-singleturn', target, 'move: Endure');
	},
	onDamagePriority: -10,
	onDamage(damage, target, source, effect) {
	if (effect?.effectType === 'Move' && damage >= target.hp) {
	this.add('-activate', target, 'move: Endure');
	return target.hp - 1;
	}
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
entrainment: {	entrainment: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Entrainment",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	onTryHit(target, source) {
	if (target === source || target.volatiles['dynamax']) return false;
	const additionalBannedSourceAbilities = [
	// Zen Mode included here for compatability with Gen 5-6
	'flowergift', 'forecast', 'hungerswitch', 'illusion', 'imposter', 'neutralizinggas', 'powerofalchemy', 'receiver', 'trace', 'zenmode',
	];
	if (
	target.ability === source.ability ||
	target.getAbility().isPermanent || target.ability === 'truant' ||
	source.getAbility().isPermanent || additionalBannedSourceAbilities.includes(source.ability)
	) {
	return false;
	}
	},
	onHit(target, source) {
	const oldAbility = target.setAbility(source.ability);
	if (oldAbility) {
	this.add('-ability', target, target.getAbility().name, '[from] move: Entrainment');
	if (!target.isAlly(source)) target.volatileStaleness = 'external';
	return;
	}
	return oldAbility as false | null;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
explosion: {	explosion: {
accuracy:	accuracy: 95,
basePower:	basePower: 250,
category:	category: "Physical",
	name: "Explosion",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, noparentalbond: 1},
	selfdestruct: "always",
secondary:	secondary: null,
target:	target: "allAdjacent",
type: "Normal",	type: "Normal",
	},
	
extremeevoboost: {	extremeevoboost: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Extreme Evoboost",
	pp: 1,
priority:	priority: 0,
	flags: {},
	boosts: {
	atk: 2,
	def: 2,
	spa: 2,
	spd: 2,
	spe: 2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
extremespeed: {	extremespeed: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Extreme Speed",
	pp: 1.25,
priority:	priority: 2,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
facade: {	facade: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Facade",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onBasePower(basePower, pokemon) {
	if (pokemon.status && pokemon.status !== 'slp') {
	return this.chainModify(2);
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
fakeout: {	fakeout: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "Fake Out",
	pp: 1.25,
priority:	priority: 3,
	flags: {contact: 1, protect: 1, mirror: 1},
	onTry(source) {
	if (source.activeMoveActions > 1) {
	this.hint("Fake Out only works on your first turn out.");
	return false;
	}
	},
secondary:	secondary: {
	chance: 100,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
falseswipe: {	falseswipe: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "False Swipe",
	pp: 125,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onDamagePriority: -20,
	onDamage(damage, target, source, effect) {
	if (damage >= target.hp) return target.hp - 1;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
feint: {	feint: {
accuracy:	accuracy: 95,
basePower:	basePower: 30,
category:	category: "Physical",
	name: "Feint",
	pp: 1.25,
priority:	priority: 2,
	flags: {mirror: 1, noassist: 1, failcopycat: 1},
	breaksProtect: true,
	// Breaking protection implemented in scripts.js
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
filletaway: {	filletaway: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Fillet Away",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	onTry(source) {
	if (source.hp <= source.maxhp / 2 || source.maxhp === 1) return false;
	},
	onTryHit(pokemon, target, move) {
	if (!this.boost(move.boosts as SparseBoostsTable)) return null;
	delete move.boosts;
	},
	onHit(pokemon) {
	this.directDamage(pokemon.maxhp / 2);
	},
	boosts: {
	atk: 2,
	spa: 2,
	spe: 2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
flail: {	flail: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon, target) {
	const ratio = Math.max(Math.floor(pokemon.hp * 48 / pokemon.maxhp), 1);
	let bp;
	if (ratio < 2) {
	bp = 200;
	} else if (ratio < 5) {
	bp = 150;
	} else if (ratio < 10) {
	bp = 100;
	} else if (ratio < 17) {
	bp = 80;
	} else if (ratio < 33) {
	bp = 40;
	} else {
	bp = 20;
	}
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Physical",
	name: "Flail",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
flash: {	flash: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Flash",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
boosts: {	boosts: {
accuracy:	accuracy: -1,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
focusenergy: {	focusenergy: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Focus Energy",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	volatileStatus: 'focusenergy',
	condition: {
	onStart(target, source, effect) {
	if (effect?.id === 'zpower') {
	this.add('-start', target, 'move: Focus Energy', '[zeffect]');
	} else if (effect && (['costar', 'imposter', 'psychup', 'transform'].includes(effect.id))) {
	this.add('-start', target, 'move: Focus Energy', '[silent]');
	} else {
	this.add('-start', target, 'move: Focus Energy');
	}
	},
	onModifyCritRatio(critRatio) {
	return critRatio + 2;
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
followme: {	followme: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Follow Me",
	pp: 1.25,
priority:	priority: 2,
	flags: {noassist: 1, failcopycat: 1},
	volatileStatus: 'followme',
	onTry(source) {
	return this.activePerHalf > 1;
	},
	condition: {
	duration: 1,
	onStart(target, source, effect) {
	if (effect?.id === 'zpower') {
	this.add('-singleturn', target, 'move: Follow Me', '[zeffect]');
	} else {
	this.add('-singleturn', target, 'move: Follow Me');
	}
	},
	onFoeRedirectTargetPriority: 1,
	onFoeRedirectTarget(target, source, source2, move) {
	if (!this.effectState.target.isSkyDropped() && this.validTarget(this.effectState.target, source, move.target)) {
	if (move.smartTarget) move.smartTarget = false;
	this.debug("Follow Me redirected target of move");
	return this.effectState.target;
	}
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
foresight: {	foresight: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Foresight",
	pp: 125,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, bypasssub: 1},
	volatileStatus: 'foresight',
	onTryHit(target) {
	if (target.volatiles['miracleeye']) return false;
	},
	condition: {
	noCopy: true,
	onStart(pokemon) {
	this.add('-start', pokemon, 'Foresight');
	},
	onNegateImmunity(pokemon, type) {
	if (pokemon.hasType('Ghost') && ['Normal', 'Fighting'].includes(type)) return false;
	},
	onModifyBoost(boosts) {
	if (boosts.evasion && boosts.evasion > 0) {
	boosts.evasion = 0;
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
frustration: {	frustration: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon) {
	return Math.floor(((255 - pokemon.happiness) * 10) / 25) || 1;
	},
category:	category: "Physical",
	name: "Frustration",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
furyattack: {	furyattack: {
accuracy:	accuracy: 85,
basePower:	basePower: 15,
category:	category: "Physical",
	name: "Fury Attack",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	multihit: [2, 5],
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
furyswipes: {	furyswipes: {
accuracy:	accuracy: 80,
basePower:	basePower: 18,
category:	category: "Physical",
	name: "Fury Swipes",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	multihit: [2, 5],
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
gigaimpact: {	gigaimpact: {
accuracy:	accuracy: 90,
basePower:	basePower: 150,
category:	category: "Physical",
	name: "Giga Impact",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, recharge: 1, protect: 1, mirror: 1},
	self: {
	volatileStatus: 'mustrecharge',
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
glare: {	glare: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Glare",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	status: 'par',
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
growl: {	growl: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Growl",
	pp: 125,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1},
	boosts: {
	atk: -1,
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Normal",	type: "Normal",
	},
	
growth: {	growth: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Growth",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	onModifyMove(move, pokemon) {
	if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) move.boosts = {atk: 2, spa: 2};
	},
	boosts: {
	atk: 1,
	spa: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
guillotine: {	guillotine: {
accuracy:	accuracy: 30,
basePower:	basePower: 0,
category:	category: "Physical",
	name: "Guillotine",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	ohko: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
happyhour: {	happyhour: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Happy Hour",
	pp: 1.25,
priority:	priority: 0,
	flags: {},
	onTryHit(target, source) {
	this.add('-activate', target, 'move: Happy Hour');
	},
secondary:	secondary: null,
target:	target: "allySide",
type: "Normal",	type: "Normal",
	},
	
harden: {	harden: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Harden",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	def: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
headbutt: {	headbutt: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Headbutt",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
headcharge: {	headcharge: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Head Charge",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	recoil: [1, 4],
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
healbell: {	healbell: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Heal Bell",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, sound: 1, distance: 1, bypasssub: 1},
	onHit(target, source) {
	this.add('-activate', source, 'move: Heal Bell');
	let success = false;
	const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
	for (const ally of allies) {
	if (ally !== source && ally.hasAbility('soundproof')) continue;
	if (ally.cureStatus()) success = true;
	}
	return success;
	},
target:	target: "allyTeam",
type: "Normal",	type: "Normal",
	},
	
helpinghand: {	helpinghand: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Helping Hand",
	pp: 1.25,
priority:	priority: 5,
	flags: {bypasssub: 1, noassist: 1, failcopycat: 1},
	volatileStatus: 'helpinghand',
	onTryHit(target) {
	if (!target.newlySwitched && !this.queue.willMove(target)) return false;
	},
	condition: {
	duration: 1,
	onStart(target, source) {
	this.effectState.multiplier = 1.5;
	this.add('-singleturn', target, 'Helping Hand', '[of] ' + source);
	},
	onRestart(target, source) {
	this.effectState.multiplier *= 1.5;
	this.add('-singleturn', target, 'Helping Hand', '[of] ' + source);
	},
	onBasePowerPriority: 10,
	onBasePower(basePower) {
	this.debug('Boosting from Helping Hand: ' + this.effectState.multiplier);
	return this.chainModify(this.effectState.multiplier);
	},
	},
secondary:	secondary: null,
target:	target: "adjacentAlly",
type: "Normal",	type: "Normal",
	},
	
holdback: {	holdback: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "Hold Back",
	pp: 125,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onDamagePriority: -20,
	onDamage(damage, target, source, effect) {
	if (damage >= target.hp) return target.hp - 1;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
holdhands: {	holdhands: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Hold Hands",
	pp: 125,
priority:	priority: 0,
	flags: {bypasssub: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1},
secondary:	secondary: null,
target:	target: "adjacentAlly",
type: "Normal",	type: "Normal",
	},
	
hornattack: {	hornattack: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Physical",
	name: "Horn Attack",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
horndrill: {	horndrill: {
accuracy:	accuracy: 30,
basePower:	basePower: 0,
category:	category: "Physical",
	name: "Horn Drill",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	ohko: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
howl: {	howl: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Howl",
	pp: 125,
priority:	priority: 0,
	flags: {snatch: 1, sound: 1},
	boosts: {
	atk: 1,
	},
secondary:	secondary: null,
target:	target: "allies",
type: "Normal",	type: "Normal",
	},
	
hyperbeam: {	hyperbeam: {
accuracy:	accuracy: 95,
basePower:	basePower: 500,
category:	category: "Special",
	name: "Hyper Beam",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	self: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
hyperdrill: {	hyperdrill: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Hyper Drill",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
hyperfang: {	hyperfang: {
accuracy:	accuracy: 90,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Hyper Fang",
	pp: 1.25,
priority:	priority: 0,
	flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
hypervoice: {	hypervoice: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Hyper Voice",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Normal",	type: "Normal",
	},
	
judgment: {	judgment: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Judgment",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onModifyType(move, pokemon) {
	if (pokemon.ignoringItem()) return;
	const item = pokemon.getItem();
	if (item.id && item.onPlate && !item.zMove) {
	move.type = item.onPlate;
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
laserfocus: {	laserfocus: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Laser Focus",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	volatileStatus: 'laserfocus',
	condition: {
	duration: 2,
	onStart(pokemon, source, effect) {
	if (effect && (['costar', 'imposter', 'psychup', 'transform'].includes(effect.id))) {
	this.add('-start', pokemon, 'move: Laser Focus', '[silent]');
	} else {
	this.add('-start', pokemon, 'move: Laser Focus');
	}
	},
	onRestart(pokemon) {
	this.effectState.duration = 2;
	this.add('-start', pokemon, 'move: Laser Focus');
	},
	onModifyCritRatio(critRatio) {
	return 5;
	},
	onEnd(pokemon) {
	this.add('-end', pokemon, 'move: Laser Focus', '[silent]');
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
lastresort: {	lastresort: {
accuracy:	accuracy: 95,
basePower:	basePower: 140,
category:	category: "Physical",
	name: "Last Resort",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onTry(source) {
	if (source.moveSlots.length < 2) return false; // Last Resort fails unless the user knows at least 2 moves
	let hasLastResort = false; // User must actually have Last Resort for it to succeed
	for (const moveSlot of source.moveSlots) {
	if (moveSlot.id === 'lastresort') {
	hasLastResort = true;
	continue;
	}
	if (!moveSlot.used) return false;
	}
	return hasLastResort;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
leer: {	leer: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Leer",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	boosts: {
	def: -1,
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Normal",	type: "Normal",
	},
	
lockon: {	lockon: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Lock-On",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onTryHit(target, source) {
	if (source.volatiles['lockon']) return false;
	},
	onHit(target, source) {
	source.addVolatile('lockon', target);
	this.add('-activate', source, 'move: Lock-On', '[of] ' + target);
	},
	condition: {
	noCopy: true, // doesn't get copied by Baton Pass
	duration: 2,
	onSourceInvulnerabilityPriority: 1,
	onSourceInvulnerability(target, source, move) {
	if (move && source === this.effectState.target && target === this.effectState.source) return 0;
	},
	onSourceAccuracy(accuracy, target, source, move) {
	if (move && source === this.effectState.target && target === this.effectState.source) return true;
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
lovelykiss: {	lovelykiss: {
accuracy:	accuracy: 75,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Lovely Kiss",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	status: 'slp',
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
luckychant: {	luckychant: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Lucky Chant",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	sideCondition: 'luckychant',
	condition: {
	duration: 5,
	onSideStart(side) {
	this.add('-sidestart', side, 'move: Lucky Chant'); // "The Lucky Chant shielded [side.name]'s team from critical hits!"
	},
	onCriticalHit: false,
	onSideResidualOrder: 26,
	onSideResidualSubOrder: 6,
	onSideEnd(side) {
	this.add('-sideend', side, 'move: Lucky Chant'); // "[side.name]'s team's Lucky Chant wore off!"
	},
	},
secondary:	secondary: null,
target:	target: "allySide",
type: "Normal",	type: "Normal",
	},
	
meanlook: {	meanlook: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Mean Look",
	pp: 1.25,
priority:	priority: 0,
	flags: {reflectable: 1, mirror: 1},
	onHit(target, source, move) {
	return target.addVolatile('trapped', source, move, 'trapper');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
mefirst: {	mefirst: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Me First",
	pp: 1.25,
priority:	priority: 0,
	flags: {
	protect: 1, bypasssub: 1,
	failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
	},
	onTryHit(target, pokemon) {
	const action = this.queue.willMove(target);
	if (!action) return false;
	const move = this.dex.getActiveMove(action.move.id);
	if (action.zmove || move.isZ || move.isMax) return false;
	if (target.volatiles['mustrecharge']) return false;
	if (move.category === 'Status' || move.flags['failmefirst']) return false;
	pokemon.addVolatile('mefirst');
	this.actions.useMove(move, pokemon, target);
	return null;
	},
	condition: {
	duration: 1,
	onBasePowerPriority: 12,
	onBasePower(basePower) {
	return this.chainModify(1.5);
	},
	},
secondary:	secondary: null,
target:	target: "adjacentFoe",
type: "Normal",	type: "Normal",
	},
	
megakick: {	megakick: {
accuracy:	accuracy: 75,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Mega Kick",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
megapunch: {	megapunch: {
accuracy:	accuracy: 85,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Mega Punch",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
metronome: {	metronome: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Metronome",
	pp: 1.25,
priority:	priority: 0,
	flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1},
	noMetronome: [
	"After You", "Apple Acid", "Armor Cannon", "Assist", "Astral Barrage", "Aura Wheel", "Baneful Bunker", "Beak Blast", "Behemoth Bash", "Behemoth Blade", "Belch", "Bestow", "Blazing Torque", "Body Press", "Branch Poke", "Breaking Swipe", "Celebrate", "Chatter", "Chilling Water", "Chilly Reception", "Clangorous Soul", "Collision Course", "Combat Torque", "Comeuppance", "Copycat", "Counter", "Covet", "Crafty Shield", "Decorate", "Destiny Bond", "Detect", "Diamond Storm", "Doodle", "Double Iron Bash", "Double Shock", "Dragon Ascent", "Dragon Energy", "Drum Beating", "Dynamax Cannon", "Electro Drift", "Endure", "Eternabeam", "False Surrender", "Feint", "Fiery Wrath", "Fillet Away", "Fleur Cannon", "Focus Punch", "Follow Me", "Freeze Shock", "Freezing Glare", "Glacial Lance", "Grav Apple", "Helping Hand", "Hold Hands", "Hyper Drill", "Hyperspace Fury", "Hyperspace Hole", "Ice Burn", "Instruct", "Jet Punch", "Jungle Healing", "King's Shield", "Life Dew", "Light of Ruin", "Magical Torque", "Make It Rain", "Mat Block", "Me First", "Meteor Assault", "Metronome", "Mimic", "Mind Blown", "Mirror Coat", "Mirror Move", "Moongeist Beam", "Nature Power", "Nature's Madness", "Noxious Torque", "Obstruct", "Order Up", "Origin Pulse", "Overdrive", "Photon Geyser", "Plasma Fists", "Population Bomb", "Pounce", "Power Shift", "Precipice Blades", "Protect", "Pyro Ball", "Quash", "Quick Guard", "Rage Fist", "Rage Powder", "Raging Bull", "Raging Fury", "Relic Song", "Revival Blessing", "Ruination", "Salt Cure", "Secret Sword", "Shed Tail", "Shell Trap", "Silk Trap", "Sketch", "Sleep Talk", "Snap Trap", "Snarl", "Snatch", "Snore", "Snowscape", "Spectral Thief", "Spicy Extract", "Spiky Shield", "Spirit Break", "Spotlight", "Springtide Storm", "Steam Eruption", "Steel Beam", "Strange Steam", "Struggle", "Sunsteel Strike", "Surging Strikes", "Switcheroo", "Techno Blast", "Thief", "Thousand Arrows", "Thousand Waves", "Thunder Cage", "Thunderous Kick", "Tidy Up", "Trailblaze", "Transform", "Trick", "Twin Beam", "V-create", "Wicked Blow", "Wicked Torque", "Wide Guard",
	],
	onHit(target, source, effect) {
	const moves = this.dex.moves.all().filter(move => (
	(![2, 4].includes(this.gen) || !source.moves.includes(move.id)) &&
	!move.realMove && !move.isZ && !move.isMax &&
	!effect.noMetronome!.includes(move.name)
	));
	let randomMove = '';
	if (moves.length) {
	moves.sort((a, b) => a.num - b.num);
	randomMove = this.sample(moves).id;
	}
	if (!randomMove) return false;
	source.side.lastSelectedMove = this.toID(randomMove);
	this.actions.useMove(randomMove, target);
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
milkdrink: {	milkdrink: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Milk Drink",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	heal: [1, 2],
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
mimic: {	mimic: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Mimic",
	pp: 1.25,
priority:	priority: 0,
	flags: {
	protect: 1, bypasssub: 1, allyanim: 1,
	failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
	},
	onHit(target, source) {
	const move = target.lastMove;
	if (source.transformed || !move || move.flags['failmimic'] || source.moves.includes(move.id)) {
	return false;
	}
	if (move.isZ || move.isMax) return false;
	const mimicIndex = source.moves.indexOf('mimic');
	if (mimicIndex < 0) return false;
	source.moveSlots[mimicIndex] = {
	move: move.name,
	id: move.id,
	pp: move.pp,
	maxpp: move.pp,
target:	target: move.target,
	disabled: false,
	used: false,
	virtual: true,
	};
	this.add('-start', source, 'Mimic', move.name);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
mindreader: {	mindreader: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Mind Reader",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onTryHit(target, source) {
	if (source.volatiles['lockon']) return false;
	},
	onHit(target, source) {
	source.addVolatile('lockon', target);
	this.add('-activate', source, 'move: Mind Reader', '[of] ' + target);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
minimize: {	minimize: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Minimize",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	volatileStatus: 'minimize',
	condition: {
	noCopy: true,
	onRestart: () => null,
	onSourceModifyDamage(damage, source, target, move) {
	const boostedMoves = [
	'stomp', 'steamroller', 'bodyslam', 'flyingpress', 'dragonrush', 'heatcrash', 'heavyslam', 'maliciousmoonsault',
	];
	if (boostedMoves.includes(move.id)) {
	return this.chainModify(2);
	}
	},
	onAccuracy(accuracy, target, source, move) {
	const boostedMoves = [
	'stomp', 'steamroller', 'bodyslam', 'flyingpress', 'dragonrush', 'heatcrash', 'heavyslam', 'maliciousmoonsault',
	];
	if (boostedMoves.includes(move.id)) {
	return true;
	}
	return accuracy;
	},
	},
	boosts: {
	evasion: 2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
morningsun: {	morningsun: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Morning Sun",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	onHit(pokemon) {
	let factor = 0.5;
	switch (pokemon.effectiveWeather()) {
	case 'sunnyday':
	case 'desolateland':
	factor = 0.667;
	break;
	case 'raindance':
	case 'primordialsea':
	case 'sandstorm':
	case 'hail':
	case 'snow':
	factor = 0.25;
	break;
	}
	const success = !!this.heal(this.modify(pokemon.maxhp, factor));
	if (!success) {
	this.add('-fail', pokemon, 'heal');
	return this.NOT_FAIL;
	}
	return success;
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
multiattack: {	multiattack: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Multi-Attack",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onModifyType(move, pokemon) {
	if (pokemon.ignoringItem()) return;
	move.type = this.runEvent('Memory', pokemon, null, move, 'Normal');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
naturalgift: {	naturalgift: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Physical",
	name: "Natural Gift",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onModifyType(move, pokemon) {
	if (pokemon.ignoringItem()) return;
	const item = pokemon.getItem();
	if (!item.naturalGift) return;
	move.type = item.naturalGift.type;
	},
	onPrepareHit(target, pokemon, move) {
	if (pokemon.ignoringItem()) return false;
	const item = pokemon.getItem();
	if (!item.naturalGift) return false;
	move.basePower = item.naturalGift.basePower;
	this.debug('BP: ' + move.basePower);
	pokemon.setItem('');
	pokemon.lastItem = item.id;
	pokemon.usedItemThisTurn = true;
	this.runEvent('AfterUseItem', pokemon, null, null, item);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
naturepower: {	naturepower: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Nature Power",
	pp: 1.25,
priority:	priority: 0,
	flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1},
	onTryHit(target, pokemon) {
	let move = 'triattack';
	if (this.field.isTerrain('electricterrain')) {
	move = 'thunderbolt';
	} else if (this.field.isTerrain('grassyterrain')) {
	move = 'energyball';
	} else if (this.field.isTerrain('mistyterrain')) {
	move = 'moonblast';
	} else if (this.field.isTerrain('psychicterrain')) {
	move = 'psychic';
	}
	this.actions.useMove(move, pokemon, target);
	return null;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
nobleroar: {	nobleroar: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Noble Roar",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1},
	boosts: {
	atk: -1,
	spa: -1,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
odorsleuth: {	odorsleuth: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Odor Sleuth",
	pp: 125,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, allyanim: 1},
	volatileStatus: 'foresight',
	onTryHit(target) {
	if (target.volatiles['miracleeye']) return false;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
painsplit: {	painsplit: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Pain Split",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, allyanim: 1},
	onHit(target, pokemon) {
	const targetHP = target.getUndynamaxedHP();
	const averagehp = Math.floor((targetHP + pokemon.hp) / 2) || 1;
	const targetChange = targetHP - averagehp;
	target.sethp(target.hp - targetChange);
	this.add('-sethp', target, target.getHealth, '[from] move: Pain Split', '[silent]');
	pokemon.sethp(averagehp);
	this.add('-sethp', pokemon, pokemon.getHealth, '[from] move: Pain Split');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
payday: {	payday: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "Pay Day",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
perishsong: {	perishsong: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Perish Song",
	pp: 1.25,
priority:	priority: 0,
	flags: {sound: 1, distance: 1, bypasssub: 1},
	onHitField(target, source, move) {
	let result = false;
	let message = false;
	for (const pokemon of this.getAllActive()) {
	if (this.runEvent('Invulnerability', pokemon, source, move) === false) {
	this.add('-miss', source, pokemon);
	result = true;
	} else if (this.runEvent('TryHit', pokemon, source, move) === null) {
	result = true;
	} else if (!pokemon.volatiles['perishsong']) {
	pokemon.addVolatile('perishsong');
	this.add('-start', pokemon, 'perish3', '[silent]');
	result = true;
	message = true;
	}
	}
	if (!result) return false;
	if (message) this.add('-fieldactivate', 'move: Perish Song');
	},
	condition: {
	duration: 4,
	onEnd(target) {
	this.add('-start', target, 'perish0');
	target.faint();
	},
	onResidualOrder: 24,
	onResidual(pokemon) {
	const duration = pokemon.volatiles['perishsong'].duration;
	this.add('-start', pokemon, 'perish' + duration);
	},
	},
secondary:	secondary: null,
target:	target: "all",
type: "Normal",	type: "Normal",
	},
	
playnice: {	playnice: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Play Nice",
	pp: 1.25,
priority:	priority: 0,
	flags: {reflectable: 1, mirror: 1, bypasssub: 1},
	boosts: {
	atk: -1,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
populationbomb: {	populationbomb: {
accuracy:	accuracy: 90,
basePower:	basePower: 20,
category:	category: "Physical",
	name: "Population Bomb",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
multihit: 10,	multihit: 10,
accuracy:	multiaccuracy: 95,
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
pound: {	pound: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "Pound",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
powershift: {	powershift: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Power Shift",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	volatileStatus: 'powershift',
	condition: {
	onStart(pokemon) {
	this.add('-start', pokemon, 'Power Shift');
	[pokemon.storedStats.atk, pokemon.storedStats.spa,
	pokemon.storedStats.def, pokemon.storedStats.spd] =
	[pokemon.storedStats.def, pokemon.storedStats.spd,
	pokemon.storedStats.atk, pokemon.storedStats.spa];
	},
	onCopy(pokemon) {
	[pokemon.storedStats.atk, pokemon.storedStats.spa,
	pokemon.storedStats.def, pokemon.storedStats.spd] =
	[pokemon.storedStats.def, pokemon.storedStats.spd,
	pokemon.storedStats.atk, pokemon.storedStats.spa];
	},
	onEnd(pokemon) {
	this.add('-end', pokemon, 'Power Shift');
	[pokemon.storedStats.atk, pokemon.storedStats.spa,
	pokemon.storedStats.def, pokemon.storedStats.spd] =
	[pokemon.storedStats.def, pokemon.storedStats.spd,
	pokemon.storedStats.atk, pokemon.storedStats.spa];
	},
	onRestart(pokemon) {
	pokemon.removeVolatile('Power Shift');
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
present: {	present: {
accuracy:	accuracy: 90,
basePower:	basePower: 0,
category:	category: "Physical",
	name: "Present",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onModifyMove(move, pokemon, target) {
	const rand = this.random(10);
	if (rand < 2) {
	move.heal = [1, 4];
	move.infiltrates = true;
	} else if (rand < 6) {
	move.basePower = 40;
	} else if (rand < 9) {
	move.basePower = 80;
	} else {
	move.basePower = 120;
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
protect: {	protect: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Protect",
	pp: 1.25,
priority:	priority: 4,
	flags: {noassist: 1, failcopycat: 1},
	stallingMove: true,
	volatileStatus: 'protect',
	onPrepareHit(pokemon) {
	return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
	},
	onHit(pokemon) {
	pokemon.addVolatile('stall');
	},
	condition: {
	duration: 1,
	onStart(target) {
	this.add('-singleturn', target, 'Protect');
	},
	onTryHitPriority: 3,
	onTryHit(target, source, move) {
	if (!move.flags['protect']) {
	if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
	if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
	return;
	}
	if (move.smartTarget) {
	move.smartTarget = false;
	} else {
	this.add('-activate', target, 'move: Protect');
	}
	const lockedmove = source.getVolatile('lockedmove');
	if (lockedmove) {
	// Outrage counter is reset
	if (source.volatiles['lockedmove'].duration === 2) {
	delete source.volatiles['lockedmove'];
	}
	}
	return this.NOT_FAIL;
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
psychup: {	psychup: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Psych Up",
	pp: 1.25,
priority:	priority: 0,
	flags: {bypasssub: 1, allyanim: 1},
	onHit(target, source) {
	let i: BoostID;
	for (i in target.boosts) {
	source.boosts[i] = target.boosts[i];
	}
	const volatilesToCopy = ['focusenergy', 'gmaxchistrike', 'laserfocus'];
	for (const volatile of volatilesToCopy) {
	if (target.volatiles[volatile]) {
	source.addVolatile(volatile);
	if (volatile === 'gmaxchistrike') source.volatiles[volatile].layers = target.volatiles[volatile].layers;
	} else {
	source.removeVolatile(volatile);
	}
	}
	this.add('-copyboost', source, target, '[from] move: Psych Up');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
pulverizingpancake: {	pulverizingpancake: {
accuracy:	accuracy: 95,
basePower:	basePower: 210,
category:	category: "Physical",
	name: "Pulverizing Pancake",
	pp: 1,
priority:	priority: 0,
	flags: {contact: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
quickattack: {	quickattack: {
accuracy:	accuracy: 90,
basePower:	basePower: 45,
category:	category: "Physical",
	name: "Quick Attack",
	pp: 1.25,
priority:	priority: 1,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
rage: {	rage: {
accuracy:	accuracy: 95,
basePower:	basePower: 20,
category:	category: "Physical",
	name: "Rage",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	self: {
	volatileStatus: 'rage',
	},
	condition: {
	onStart(pokemon) {
	this.add('-singlemove', pokemon, 'Rage');
	},
	onHit(target, source, move) {
	if (target !== source && move.category !== 'Status') {
	this.boost({atk: 1});
	}
	},
	onBeforeMovePriority: 100,
	onBeforeMove(pokemon) {
	this.debug('removing Rage before attack');
	pokemon.removeVolatile('rage');
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
ragingbull: {	ragingbull: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Raging Bull",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onTryHit(pokemon) {
	// will shatter screens through sub, before you hit
	pokemon.side.removeSideCondition('reflect');
	pokemon.side.removeSideCondition('lightscreen');
	pokemon.side.removeSideCondition('auroraveil');
	},
	onModifyType(move, pokemon) {
	switch (pokemon.species.name) {
	case 'Tauros-Paldea-Combat':
	move.type = 'Fighting';
	break;
	case 'Tauros-Paldea-Blaze':
	move.type = 'Fire';
	break;
	case 'Tauros-Paldea-Aqua':
	move.type = 'Water';
	break;
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
rapidspin: {	rapidspin: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Rapid Spin",
	pp: 125,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onAfterHit(target, pokemon) {
	if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
	this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
	}
	const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
	for (const condition of sideConditions) {
	if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
	this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
	}
	}
	if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
	pokemon.removeVolatile('partiallytrapped');
	}
	},
	onAfterSubDamage(damage, target, pokemon) {
	if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
	this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
	}
	const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
	for (const condition of sideConditions) {
	if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
	this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
	}
	}
	if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
	pokemon.removeVolatile('partiallytrapped');
	}
	},
secondary:	secondary: {
	chance: 100,
	self: {
	boosts: {
	spe: 1,
	},
	},
	},
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
razorwind: {	razorwind: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Razor Wind",
	pp: 1.25,
priority:	priority: 0,
	flags: {charge: 1, protect: 1, mirror: 1, nosleeptalk: 1, failinstruct: 1},
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	this.add('-prepare', attacker, move.name);
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Normal",	type: "Normal",
	},
	
recover: {	recover: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Recover",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	heal: [1, 2],
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
recycle: {	recycle: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Recycle",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	onHit(pokemon) {
	if (pokemon.item || !pokemon.lastItem) return false;
	const item = pokemon.lastItem;
	pokemon.lastItem = '';
	this.add('-item', pokemon, this.dex.items.get(item), '[from] move: Recycle');
	pokemon.setItem(item);
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
reflecttype: {	reflecttype: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Reflect Type",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, bypasssub: 1, allyanim: 1},
	onHit(target, source) {
	if (source.species && (source.species.num === 493 || source.species.num === 773)) return false;
	if (source.terastallized) return false;
	const oldApparentType = source.apparentType;
	let newBaseTypes = target.getTypes(true).filter(type => type !== '???');
	if (!newBaseTypes.length) {
	if (target.addedType) {
	newBaseTypes = ['Normal'];
	} else {
	return false;
	}
	}
	this.add('-start', source, 'typechange', '[from] move: Reflect Type', '[of] ' + target);
	source.setType(newBaseTypes);
	source.addedType = target.addedType;
	source.knownType = target.isAlly(source) && target.knownType;
	if (!source.knownType) source.apparentType = oldApparentType;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
refresh: {	refresh: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Refresh",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	onHit(pokemon) {
	if (['', 'slp', 'frz'].includes(pokemon.status)) return false;
	pokemon.cureStatus();
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
relicsong: {	relicsong: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Special",
	name: "Relic Song",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
secondary:	secondary: {
	chance: 10,
	status: 'slp',
	},
	onHit(target, pokemon, move) {
	if (pokemon.baseSpecies.baseSpecies === 'Meloetta' && !pokemon.transformed) {
	move.willChangeForme = true;
	}
	},
	onAfterMoveSecondarySelf(pokemon, target, move) {
	if (move.willChangeForme) {
	const meloettaForme = pokemon.species.id === 'meloettapirouette' ? '' : '-Pirouette';
	pokemon.formeChange('Meloetta' + meloettaForme, this.effect, false, '[msg]');
	}
	},
target:	target: "allAdjacentFoes",
type: "Normal",	type: "Normal",
	},
	
retaliate: {	retaliate: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Retaliate",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onBasePower(basePower, pokemon) {
	if (pokemon.side.faintedLastTurn) {
	this.debug('Boosted for a faint last turn');
	return this.chainModify(2);
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
return: {	return: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon) {
	return Math.floor((pokemon.happiness * 10) / 25) || 1;
	},
category:	category: "Physical",
	name: "Return",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
revelationdance: {	revelationdance: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Revelation Dance",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, dance: 1},
	onModifyType(move, pokemon) {
	let type = pokemon.getTypes()[0];
	if (type === "Bird") type = "???";
	move.type = type;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
revivalblessing: {	revivalblessing: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Revival Blessing",
	pp: 1,
	noPPBoosts: true,
priority:	priority: 0,
	flags: {},
	onTryHit(source) {
	if (!source.side.pokemon.filter(ally => ally.fainted).length) {
	return false;
	}
	},
	slotCondition: 'revivalblessing',
	// No this not a real switchout move
	// This is needed to trigger a switch protocol to choose a fainted party member
	// Feel free to refactor
	selfSwitch: true,
	condition: {
	duration: 1,
	// reviving implemented in side.ts, kind of
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
	roar: {
	
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Roar",
	pp: 1.25,
priority:	priority: -6,
	flags: {reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, allyanim: 1, noassist: 1, failcopycat: 1},
	forceSwitch: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
rockclimb: {	rockclimb: {
accuracy:	accuracy: 85,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Rock Climb",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 20,
	volatileStatus: 'confusion',
	},
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
round: {	round: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
	basePowerCallback(target, source, move) {
	if (move.sourceEffect === 'round') {
	this.debug('BP doubled');
	return move.basePower * 2;
	}
	return move.basePower;
	},
category:	category: "Special",
	name: "Round",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
	onTry(source, target, move) {
	for (const action of this.queue.list as MoveAction[]) {
	if (!action.pokemon || !action.move || action.maxMove || action.zmove) continue;
	if (action.move.id === 'round') {
	this.queue.prioritizeAction(action, move);
	return;
	}
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
safeguard: {	safeguard: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Safeguard",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	sideCondition: 'safeguard',
	condition: {
	duration: 5,
	durationCallback(target, source, effect) {
	if (source?.hasAbility('persistent')) {
	this.add('-activate', source, 'ability: Persistent', '[move] Safeguard');
	return 7;
	}
	return 5;
	},
	onSetStatus(status, target, source, effect) {
	if (!effect || !source) return;
	if (effect.id === 'yawn') return;
	if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
	if (target !== source) {
	this.debug('interrupting setStatus');
	if (effect.name === 'Synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
	this.add('-activate', target, 'move: Safeguard');
	}
	return null;
	}
	},
	onTryAddVolatile(status, target, source, effect) {
	if (!effect || !source) return;
	if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
	if ((status.id === 'confusion' || status.id === 'yawn') && target !== source) {
	if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Safeguard');
	return null;
	}
	},
	onSideStart(side, source) {
	if (source?.hasAbility('persistent')) {
	this.add('-sidestart', side, 'Safeguard', '[persistent]');
	} else {
	this.add('-sidestart', side, 'Safeguard');
	}
	},
	onSideResidualOrder: 26,
	onSideResidualSubOrder: 3,
	onSideEnd(side) {
	this.add('-sideend', side, 'Safeguard');
	},
	},
secondary:	secondary: null,
target:	target: "allySide",
type: "Normal",	type: "Normal",
	},
	
scaryface: {	scaryface: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Scary Face",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	boosts: {
	spe: -2,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
scratch: {	scratch: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "Scratch",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
screech: {	screech: {
accuracy:	accuracy: 85,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Screech",
	pp: 125,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, allyanim: 1},
	boosts: {
	def: -2,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
secretpower: {	secretpower: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Secret Power",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onModifyMove(move, pokemon) {
	if (this.field.isTerrain('')) return;
	move.secondaries = [];
	if (this.field.isTerrain('electricterrain')) {
	move.secondaries.push({
	chance: 30,
	status: 'par',
	});
	} else if (this.field.isTerrain('grassyterrain')) {
	move.secondaries.push({
	chance: 30,
	status: 'slp',
	});
	} else if (this.field.isTerrain('mistyterrain')) {
	move.secondaries.push({
	chance: 30,
	boosts: {
	spa: -1,
	},
	});
	} else if (this.field.isTerrain('psychicterrain')) {
	move.secondaries.push({
	chance: 30,
	boosts: {
	spe: -1,
	},
	});
	}
	},
secondary:	secondary: {
	chance: 30,
	status: 'par',
	},
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
selfdestruct: {	selfdestruct: {
accuracy:	accuracy: 95,
basePower:	basePower: 200,
category:	category: "Physical",
	name: "Self-Destruct",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, noparentalbond: 1},
	selfdestruct: "always",
secondary:	secondary: null,
target:	target: "allAdjacent",
type: "Normal",	type: "Normal",
	},
	
sharpen: {	sharpen: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Sharpen",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	atk: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
shedtail: {	shedtail: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Shed Tail",
	pp: 1.25,
priority:	priority: 0,
	flags: {},
	volatileStatus: 'substitute',
	onTryHit(source) {
	if (!this.canSwitch(source.side)) {
	this.add('-fail', source);
	return this.NOT_FAIL;
	}
	if (source.volatiles['substitute']) {
	this.add('-fail', source, 'move: Shed Tail');
	return this.NOT_FAIL;
	}
	if (source.hp <= Math.ceil(source.maxhp / 2)) {
	this.add('-fail', source, 'move: Shed Tail', '[weak]');
	return this.NOT_FAIL;
	}
	},
	onHit(target) {
	this.directDamage(Math.ceil(target.maxhp / 2));
	},
	self: {
	onHit(source) {
	source.skipBeforeSwitchOutEventFlag = true;
	},
	},
	selfSwitch: 'shedtail',
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
shellsmash: {	shellsmash: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Shell Smash",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	def: -1,
	spd: -1,
	atk: 2,
	spa: 2,
	spe: 2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
simplebeam: {	simplebeam: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Simple Beam",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	onTryHit(target) {
	if (target.getAbility().isPermanent || target.ability === 'simple' || target.ability === 'truant') {
	return false;
	}
	},
	onHit(pokemon) {
	const oldAbility = pokemon.setAbility('simple');
	if (oldAbility) {
	this.add('-ability', pokemon, 'Simple', '[from] move: Simple Beam');
	return;
	}
	return oldAbility as false | null;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
sing: {	sing: {
accuracy:	accuracy: 55,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Sing",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1},
	status: 'slp',
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
sketch: {	sketch: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Sketch",
	pp: 1,
	noPPBoosts: true,
priority:	priority: 0,
	flags: {
	bypasssub: 1, allyanim: 1, failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
	},
	onHit(target, source) {
	const disallowedMoves = ['chatter', 'sketch', 'struggle'];
	const move = target.lastMove;
	if (source.transformed || !move || source.moves.includes(move.id)) return false;
	if (disallowedMoves.includes(move.id) || move.isZ || move.isMax) return false;
	const sketchIndex = source.moves.indexOf('sketch');
	if (sketchIndex < 0) return false;
	const sketchedMove = {
	move: move.name,
	id: move.id,
	pp: move.pp,
	maxpp: move.pp,
target:	target: move.target,
	disabled: false,
	used: false,
	};
	source.moveSlots[sketchIndex] = sketchedMove;
	source.baseMoveSlots[sketchIndex] = sketchedMove;
	this.add('-activate', source, 'move: Sketch', move.name);
	},
	noSketch: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
skullbash: {	skullbash: {
accuracy:	accuracy: 95,
basePower:	basePower: 130,
category:	category: "Physical",
	name: "Skull Bash",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, charge: 1, protect: 1, mirror: 1, nosleeptalk: 1, failinstruct: 1},
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	this.add('-prepare', attacker, move.name);
	this.boost({def: 1}, attacker, attacker, move);
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
slackoff: {	slackoff: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Slack Off",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	heal: [1, 2],
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
slam: {	slam: {
accuracy:	accuracy: 75,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Slam",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
slash: {	slash: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Slash",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
sleeptalk: {	sleeptalk: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Sleep Talk",
	pp: 1.25,
priority:	priority: 0,
	flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1},
	sleepUsable: true,
	onTry(source) {
	return source.status === 'slp' || source.hasAbility('comatose');
	},
	onHit(pokemon) {
	const moves = [];
	for (const moveSlot of pokemon.moveSlots) {
	const moveid = moveSlot.id;
	if (!moveid) continue;
	const move = this.dex.moves.get(moveid);
	if (move.flags['nosleeptalk'] || move.flags['charge'] || (move.isZ && move.basePower !== 1) || move.isMax) {
	continue;
	}
	moves.push(moveid);
	}
	let randomMove = '';
	if (moves.length) randomMove = this.sample(moves);
	if (!randomMove) {
	return false;
	}
	this.actions.useMove(randomMove, pokemon);
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
smellingsalts: {	smellingsalts: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
	basePowerCallback(pokemon, target, move) {
	if (target.status === 'par') {
	this.debug('BP doubled on paralyzed target');
	return move.basePower * 2;
	}
	return move.basePower;
	},
category:	category: "Physical",
	name: "Smelling Salts",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onHit(target) {
	if (target.status === 'par') target.cureStatus();
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
smokescreen: {	smokescreen: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Smokescreen",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
boosts: {	boosts: {
accuracy:	accuracy: -1,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
snore: {	snore: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Special",
	name: "Snore",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
	sleepUsable: true,
	onTry(source) {
	return source.status === 'slp' || source.hasAbility('comatose');
	},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
softboiled: {	softboiled: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Soft-Boiled",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	heal: [1, 2],
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
sonicboom: {	sonicboom: {
accuracy:	accuracy: 90,
basePower:	basePower: 0,
	damage: 20,
category:	category: "Special",
	name: "Sonic Boom",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
spikecannon: {	spikecannon: {
accuracy:	accuracy: 95,
basePower:	basePower: 20,
category:	category: "Physical",
	name: "Spike Cannon",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	multihit: [2, 5],
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
spitup: {	spitup: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon) {
	if (!pokemon.volatiles['stockpile']?.layers) return false;
	return pokemon.volatiles['stockpile'].layers * 100;
	},
category:	category: "Special",
	name: "Spit Up",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1},
	onTry(source) {
	return !!source.volatiles['stockpile'];
	},
	onAfterMove(pokemon) {
	pokemon.removeVolatile('stockpile');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
splash: {	splash: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Splash",
	pp: 125,
priority:	priority: 0,
	flags: {gravity: 1},
	onTry(source, target, move) {
	// Additional Gravity check for Z-move variant
	if (this.field.getPseudoWeather('Gravity')) {
	this.add('cant', source, 'move: Gravity', move);
	return null;
	}
	},
	onTryHit(target, source) {
	this.add('-nothing');
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
spotlight: {	spotlight: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Spotlight",
	pp: 1.25,
priority:	priority: 3,
	flags: {protect: 1, reflectable: 1, allyanim: 1, noassist: 1, failcopycat: 1},
	volatileStatus: 'spotlight',
	onTryHit(target) {
	if (this.activePerHalf === 1) return false;
	},
	condition: {
	duration: 1,
	onStart(pokemon) {
	this.add('-singleturn', pokemon, 'move: Spotlight');
	},
	onFoeRedirectTargetPriority: 2,
	onFoeRedirectTarget(target, source, source2, move) {
	if (this.validTarget(this.effectState.target, source, move.target)) {
	this.debug("Spotlight redirected target of move");
	return this.effectState.target;
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
stockpile: {	stockpile: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Stockpile",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	onTry(source) {
	if (source.volatiles['stockpile'] && source.volatiles['stockpile'].layers >= 3) return false;
	},
	volatileStatus: 'stockpile',
	condition: {
	noCopy: true,
	onStart(target) {
	this.effectState.layers = 1;
	this.effectState.def = 0;
	this.effectState.spd = 0;
	this.add('-start', target, 'stockpile' + this.effectState.layers);
	const [curDef, curSpD] = [target.boosts.def, target.boosts.spd];
	this.boost({def: 1, spd: 1}, target, target);
	if (curDef !== target.boosts.def) this.effectState.def--;
	if (curSpD !== target.boosts.spd) this.effectState.spd--;
	},
	onRestart(target) {
	if (this.effectState.layers >= 3) return false;
	this.effectState.layers++;
	this.add('-start', target, 'stockpile' + this.effectState.layers);
	const curDef = target.boosts.def;
	const curSpD = target.boosts.spd;
	this.boost({def: 1, spd: 1}, target, target);
	if (curDef !== target.boosts.def) this.effectState.def--;
	if (curSpD !== target.boosts.spd) this.effectState.spd--;
	},
	onEnd(target) {
	if (this.effectState.def || this.effectState.spd) {
	const boosts: SparseBoostsTable = {};
	if (this.effectState.def) boosts.def = this.effectState.def;
	if (this.effectState.spd) boosts.spd = this.effectState.spd;
	this.boost(boosts, target, target);
	}
	this.add('-end', target, 'Stockpile');
	if (this.effectState.def !== this.effectState.layers * -1 || this.effectState.spd !== this.effectState.layers * -1) {
	this.hint("In Gen 7, Stockpile keeps track of how many times it successfully altered each stat individually.");
	}
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
stomp: {	stomp: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Physical",
	name: "Stomp",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
strength: {	strength: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Strength",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
struggle: {	struggle: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Struggle",
	pp: 1,
	noPPBoosts: true,
priority:	priority: 0,
	flags: {
	contact: 1, protect: 1,
	failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
	},
	noSketch: true,
	onModifyMove(move, pokemon, target) {
	move.type = '???';
	this.add('-activate', pokemon, 'move: Struggle');
	},
	struggleRecoil: true,
secondary:	secondary: null,
target:	target: "randomNormal",
type: "Normal",	type: "Normal",
	},
	
stuffcheeks: {	stuffcheeks: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Stuff Cheeks",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	onDisableMove(pokemon) {
	if (!pokemon.getItem().isBerry) pokemon.disableMove('stuffcheeks');
	},
	onTry(source) {
	return source.getItem().isBerry;
	},
	onHit(pokemon) {
	if (!this.boost({def: 2})) return null;
	pokemon.eatItem(true);
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
substitute: {	substitute: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Substitute",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, nonsky: 1},
	volatileStatus: 'substitute',
	onTryHit(source) {
	if (source.volatiles['substitute']) {
	this.add('-fail', source, 'move: Substitute');
	return this.NOT_FAIL;
	}
	if (source.hp <= source.maxhp / 4 || source.maxhp === 1) { // Shedinja clause
	this.add('-fail', source, 'move: Substitute', '[weak]');
	return this.NOT_FAIL;
	}
	},
	onHit(target) {
	this.directDamage(target.maxhp / 4);
	},
	condition: {
	onStart(target, source, effect) {
	if (effect?.id === 'shedtail') {
	this.add('-start', target, 'Substitute', '[from] move: Shed Tail');
	} else {
	this.add('-start', target, 'Substitute');
	}
	this.effectState.hp = Math.floor(target.maxhp / 4);
	if (target.volatiles['partiallytrapped']) {
	this.add('-end', target, target.volatiles['partiallytrapped'].sourceEffect, '[partiallytrapped]', '[silent]');
	delete target.volatiles['partiallytrapped'];
	}
	},
	onTryPrimaryHitPriority: -1,
	onTryPrimaryHit(target, source, move) {
	if (target === source || move.flags['bypasssub'] || move.infiltrates) {
	return;
	}
	let damage = this.actions.getDamage(source, target, move);
	if (!damage && damage !== 0) {
	this.add('-fail', source);
	this.attrLastMove('[still]');
	return null;
	}
	damage = this.runEvent('SubDamage', target, source, move, damage);
	if (!damage) {
	return damage;
	}
	if (damage > target.volatiles['substitute'].hp) {
	damage = target.volatiles['substitute'].hp as number;
	}
	target.volatiles['substitute'].hp -= damage;
	source.lastDamage = damage;
	if (target.volatiles['substitute'].hp <= 0) {
	if (move.ohko) this.add('-ohko');
	target.removeVolatile('substitute');
	} else {
	this.add('-activate', target, 'move: Substitute', '[damage]');
	}
	if (move.recoil) {
	this.damage(this.actions.calcRecoilDamage(damage, move), source, target, 'recoil');
	}
	if (move.drain) {
	this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
	}
	this.singleEvent('AfterSubDamage', move, null, target, source, move, damage);
	this.runEvent('AfterSubDamage', target, source, move, damage);
	return this.HIT_SUBSTITUTE;
	},
	onEnd(target) {
	this.add('-end', target, 'Substitute');
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
superfang: {	superfang: {
accuracy:	accuracy: 90,
basePower:	basePower: 0,
	damageCallback(pokemon, target) {
	return this.clampIntRange(target.getUndynamaxedHP() / 2, 1);
	},
category:	category: "Physical",
	name: "Super Fang",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
supersonic: {	supersonic: {
accuracy:	accuracy: 55,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Supersonic",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1},
	volatileStatus: 'confusion',
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
swagger: {	swagger: {
accuracy:	accuracy: 85,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Swagger",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	volatileStatus: 'confusion',
	boosts: {
	atk: 2,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
swallow: {	swallow: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Swallow",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	onTry(source) {
	return !!source.volatiles['stockpile'];
	},
	onHit(pokemon) {
	const healAmount = [0.25, 0.5, 1];
	const success = !!this.heal(this.modify(pokemon.maxhp, healAmount[(pokemon.volatiles['stockpile'].layers - 1)]));
	if (!success) this.add('-fail', pokemon, 'heal');
	pokemon.removeVolatile('stockpile');
	return success || this.NOT_FAIL;
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
sweetscent: {	sweetscent: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Sweet Scent",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	boosts: {
	evasion: -2,
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Normal",	type: "Normal",
	},
	
swift: {	swift: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Special",
	name: "Swift",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Normal",	type: "Normal",
	},
	
swordsdance: {	swordsdance: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Swords Dance",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, dance: 1},
	boosts: {
	atk: 2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
tackle: {	tackle: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "Tackle",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
tailslap: {	tailslap: {
accuracy:	accuracy: 85,
basePower:	basePower: 25,
category:	category: "Physical",
	name: "Tail Slap",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	multihit: [2, 5],
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
tailwhip: {	tailwhip: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Tail Whip",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	boosts: {
	def: -1,
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Normal",	type: "Normal",
	},
	
takedown: {	takedown: {
accuracy:	accuracy: 85,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Take Down",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	recoil: [1, 4],
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
tearfullook: {	tearfullook: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Tearful Look",
	pp: 1.25,
priority:	priority: 0,
	flags: {reflectable: 1, mirror: 1},
	boosts: {
	atk: -1,
	spa: -1,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
teatime: {	teatime: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Teatime",
	pp: 1.25,
priority:	priority: 0,
	flags: {bypasssub: 1},
	onHitField(target, source, move) {
	const targets: Pokemon[] = [];
	for (const pokemon of this.getAllActive()) {
	if (this.runEvent('Invulnerability', pokemon, source, move) === false) {
	this.add('-miss', source, pokemon);
	} else if (this.runEvent('TryHit', pokemon, source, move) && pokemon.getItem().isBerry) {
	targets.push(pokemon);
	}
	}
	this.add('-fieldactivate', 'move: Teatime');
	if (!targets.length) {
	this.add('-fail', source, 'move: Teatime');
	this.attrLastMove('[still]');
	return this.NOT_FAIL;
	}
	for (const pokemon of targets) {
	pokemon.eatItem(true);
	}
	},
secondary:	secondary: null,
target:	target: "all",
type: "Normal",	type: "Normal",
	},
	
technoblast: {	technoblast: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Techno Blast",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onModifyType(move, pokemon) {
	if (pokemon.ignoringItem()) return;
	move.type = this.runEvent('Drive', pokemon, null, move, 'Normal');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
teeterdance: {	teeterdance: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Teeter Dance",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, dance: 1},
	volatileStatus: 'confusion',
secondary:	secondary: null,
target:	target: "allAdjacent",
type: "Normal",	type: "Normal",
	},
	
terablast: {	terablast: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Tera Blast",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, mustpressure: 1},
	onModifyType(move, pokemon, target) {
	if (pokemon.terastallized) {
	move.type = pokemon.teraType;
	}
	},
	onModifyMove(move, pokemon) {
	if (pokemon.terastallized && pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) {
	move.category = 'Physical';
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
terrainpulse: {	terrainpulse: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Special",
	name: "Terrain Pulse",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, pulse: 1},
	onModifyType(move, pokemon) {
	if (!pokemon.isGrounded()) return;
	switch (this.field.terrain) {
	case 'electricterrain':
	move.type = 'Electric';
	break;
	case 'grassyterrain':
	move.type = 'Grass';
	break;
	case 'mistyterrain':
	move.type = 'Fairy';
	break;
	case 'psychicterrain':
	move.type = 'Psychic';
	break;
	}
	},
	onModifyMove(move, pokemon) {
	if (this.field.terrain && pokemon.isGrounded()) {
	move.basePower *= 2;
	this.debug('BP doubled in Terrain');
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
thrash: {	thrash: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Thrash",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, failinstruct: 1},
	self: {
	volatileStatus: 'lockedmove',
	},
	onAfterMove(pokemon) {
	if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
	pokemon.removeVolatile('lockedmove');
	}
	},
secondary:	secondary: null,
target:	target: "randomNormal",
type: "Normal",	type: "Normal",
	},
	
tickle: {	tickle: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Tickle",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	boosts: {
	atk: -1,
	def: -1,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
tidyup: {	tidyup: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Tidy Up",
	pp: 1.25,
priority:	priority: 0,
	flags: {},
	onHit(pokemon) {
	let success = false;
	for (const active of this.getAllActive()) {
	if (active.removeVolatile('substitute')) success = true;
	}
	const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
	const sides = [pokemon.side, ...pokemon.side.foeSidesWithConditions()];
	for (const side of sides) {
	for (const sideCondition of removeAll) {
	if (side.removeSideCondition(sideCondition)) {
	this.add('-sideend', side, this.dex.conditions.get(sideCondition).name);
	success = true;
	}
	}
	}
	if (success) this.add('-activate', pokemon, 'move: Tidy Up');
	return !!this.boost({atk: 1, spe: 1}, pokemon, pokemon, null, false, true) || success;
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
transform: {	transform: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Transform",
	pp: 1.25,
priority:	priority: 0,
	flags: {allyanim: 1, failencore: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1},
	onHit(target, pokemon) {
	if (!pokemon.transformInto(target)) {
	return false;
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
triattack: {	triattack: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Tri Attack",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 20,
	onHit(target, source) {
	const result = this.random(3);
	if (result === 0) {
	target.trySetStatus('brn', source);
	} else if (result === 1) {
	target.trySetStatus('par', source);
	} else {
	target.trySetStatus('frz', source);
	}
	},
	},
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
trumpcard: {	trumpcard: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(source, target, move) {
	const callerMoveId = move.sourceEffect || move.id;
	const moveSlot = callerMoveId === 'instruct' ? source.getMoveData(move.id) : source.getMoveData(callerMoveId);
	let bp;
	if (!moveSlot) {
	bp = 40;
	} else {
	switch (moveSlot.pp) {
	case 0:
	bp = 200;
	break;
	case 1:
	bp = 80;
	break;
	case 2:
	bp = 60;
	break;
	case 3:
	bp = 50;
	break;
	default:
	bp = 40;
	break;
	}
	}
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Special",
	name: "Trump Card",
	pp: 1.25,
	noPPBoosts: true,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
uproar: {	uproar: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Uproar",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1, nosleeptalk: 1, failinstruct: 1},
	self: {
	volatileStatus: 'uproar',
	},
	onTryHit(target) {
	const activeTeam = target.side.activeTeam();
	const foeActiveTeam = target.side.foe.activeTeam();
	for (const [i, allyActive] of activeTeam.entries()) {
	if (allyActive && allyActive.status === 'slp') allyActive.cureStatus();
	const foeActive = foeActiveTeam[i];
	if (foeActive && foeActive.status === 'slp') foeActive.cureStatus();
	}
	},
	condition: {
	duration: 3,
	onStart(target) {
	this.add('-start', target, 'Uproar');
	},
	onResidual(target) {
	if (target.volatiles['throatchop']) {
	target.removeVolatile('uproar');
	return;
	}
	if (target.lastMove && target.lastMove.id === 'struggle') {
	// don't lock
	delete target.volatiles['uproar'];
	}
	this.add('-start', target, 'Uproar', '[upkeep]');
	},
	onResidualOrder: 28,
	onResidualSubOrder: 1,
	onEnd(target) {
	this.add('-end', target, 'Uproar');
	},
	onLockMove: 'uproar',
	onAnySetStatus(status, pokemon) {
	if (status.id === 'slp') {
	if (pokemon === this.effectState.target) {
	this.add('-fail', pokemon, 'slp', '[from] Uproar', '[msg]');
	} else {
	this.add('-fail', pokemon, 'slp', '[from] Uproar');
	}
	return null;
	}
	},
	},
secondary:	secondary: null,
target:	target: "randomNormal",
type: "Normal",	type: "Normal",
	},
	
veeveevolley: {	veeveevolley: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon) {
	const bp = Math.floor((pokemon.happiness * 10) / 25) || 1;
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Physical",
	name: "Veevee Volley",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
visegrip: {	visegrip: {
accuracy:	accuracy: 95,
basePower:	basePower: 55,
category:	category: "Physical",
	name: "Vise Grip",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
weatherball: {	weatherball: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Special",
	name: "Weather Ball",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
	onModifyType(move, pokemon) {
	switch (pokemon.effectiveWeather()) {
	case 'sunnyday':
	case 'desolateland':
	move.type = 'Fire';
	break;
	case 'raindance':
	case 'primordialsea':
	move.type = 'Water';
	break;
	case 'sandstorm':
	move.type = 'Rock';
	break;
	case 'hail':
	case 'snow':
	move.type = 'Ice';
	break;
	}
	},
	onModifyMove(move, pokemon) {
	switch (pokemon.effectiveWeather()) {
	case 'sunnyday':
	case 'desolateland':
	move.basePower *= 2;
	break;
	case 'raindance':
	case 'primordialsea':
	move.basePower *= 2;
	break;
	case 'sandstorm':
	move.basePower *= 2;
	break;
	case 'hail':
	case 'snow':
	move.basePower *= 2;
	break;
	}
	this.debug('BP: ' + move.basePower);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
whirlwind: {	whirlwind: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Whirlwind",
	pp: 1.25,
priority:	priority: -6,
	flags: {reflectable: 1, mirror: 1, bypasssub: 1, allyanim: 1, wind: 1, noassist: 1, failcopycat: 1},
	forceSwitch: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
wish: {	wish: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Wish",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	slotCondition: 'Wish',
	condition: {
	duration: 2,
	onStart(pokemon, source) {
	this.effectState.hp = source.maxhp / 2;
	},
	onResidualOrder: 4,
	onEnd(target) {
	if (target && !target.fainted) {
	const damage = this.heal(this.effectState.hp, target, target);
	if (damage) {
	this.add('-heal', target, target.getHealth, '[from] move: Wish', '[wisher] ' + this.effectState.source.name);
	}
	}
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
workup: {	workup: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Work Up",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	atk: 1,
	spa: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Normal",	type: "Normal",
	},
	
wrap: {	wrap: {
accuracy:	accuracy: 90,
basePower:	basePower: 15,
category:	category: "Physical",
	name: "Wrap",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	volatileStatus: 'partiallytrapped',
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
wringout: {	wringout: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon, target, move) {
	const hp = target.hp;
	const maxHP = target.maxhp;
	const bp = Math.floor(Math.floor((120 * (100 * Math.floor(hp * 4096 / maxHP)) + 2048 - 1) / 4096) / 100) || 1;
	this.debug('BP for ' + hp + '/' + maxHP + " HP: " + bp);
	return bp;
	},
category:	category: "Special",
	name: "Wring Out",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
yawn: {	yawn: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Yawn",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	volatileStatus: 'yawn',
	onTryHit(target) {
	if (target.status || !target.runStatusImmunity('slp')) {
	return false;
	}
	},
	condition: {
	noCopy: true, // doesn't get copied by Baton Pass
	duration: 2,
	onStart(target, source) {
	this.add('-start', target, 'move: Yawn', '[of] ' + source);
	},
	onResidualOrder: 23,
	onEnd(target) {
	this.add('-end', target, 'move: Yawn', '[silent]');
	target.trySetStatus('slp', this.effectState.source);
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Normal",	type: "Normal",
	},
	
acid: {	acid: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Special",
	name: "Acid",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	boosts: {
	spd: -1,
	},
	},
target:	target: "allAdjacentFoes",
type: "Poison",	type: "Poison",
	},
	
acidarmor: {	acidarmor: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Acid Armor",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	def: 2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Poison",	type: "Poison",
	},
	
aciddownpour: {	aciddownpour: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "Acid Downpour",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
acidspray: {	acidspray: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Special",
	name: "Acid Spray",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spd: -2,
	},
	},
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
banefulbunker: {	banefulbunker: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Baneful Bunker",
	pp: 1.25,
priority:	priority: 4,
	flags: {noassist: 1, failcopycat: 1},
	stallingMove: true,
	volatileStatus: 'banefulbunker',
	onPrepareHit(pokemon) {
	return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
	},
	onHit(pokemon) {
	pokemon.addVolatile('stall');
	},
	condition: {
	duration: 1,
	onStart(target) {
	this.add('-singleturn', target, 'move: Protect');
	},
	onTryHitPriority: 3,
	onTryHit(target, source, move) {
	if (!move.flags['protect']) {
	if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
	if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
	return;
	}
	if (move.smartTarget) {
	move.smartTarget = false;
	} else {
	this.add('-activate', target, 'move: Protect');
	}
	const lockedmove = source.getVolatile('lockedmove');
	if (lockedmove) {
	// Outrage counter is reset
	if (source.volatiles['lockedmove'].duration === 2) {
	delete source.volatiles['lockedmove'];
	}
	}
	if (this.checkMoveMakesContact(move, source, target)) {
	source.trySetStatus('tox', target);
	}
	return this.NOT_FAIL;
	},
	onHit(target, source, move) {
	if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
	source.trySetStatus('tox', target);
	}
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Poison",	type: "Poison",
	},
	
barbbarrage: {	barbbarrage: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Barb Barrage",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onBasePower(basePower, pokemon, target) {
	if (target.status === 'tox' || target.status === 'tox') {
	return this.chainModify(2);
	}
	},
secondary:	secondary: {
	chance: 50,
	status: 'tox',
	},
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
belch: {	belch: {
accuracy:	accuracy: 90,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Belch",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1},
	onDisableMove(pokemon) {
	if (!pokemon.ateBerry) pokemon.disableMove('belch');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
clearsmog: {	clearsmog: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Special",
	name: "Clear Smog",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onHit(target) {
	target.clearBoosts();
	this.add('-clearboost', target);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
coil: {	coil: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Coil",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	atk: 1,
def: 1,	def: 1,
accuracy:	accuracy: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Poison",	type: "Poison",
	},
	
corrosivegas: {	corrosivegas: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Corrosive Gas",
	pp: 125,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	onHit(target, source) {
	const item = target.takeItem(source);
	if (item) {
	this.add('-enditem', target, item.name, '[from] move: Corrosive Gas', '[of] ' + source);
	} else {
	this.add('-fail', target, 'move: Corrosive Gas');
	}
	},
secondary:	secondary: null,
target:	target: "allAdjacent",
type: "Poison",	type: "Poison",
	},
	
crosspoison: {	crosspoison: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Cross Poison",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
secondary:	secondary: {
	chance: 10,
	status: 'tox',
	},
critRatio:	critRatio: 2,
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
direclaw: {	direclaw: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Dire Claw",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 50,
	onHit(target, source) {
	const result = this.random(3);
	if (result === 0) {
	target.trySetStatus('tox', source);
	} else if (result === 1) {
	target.trySetStatus('par', source);
	} else {
	target.trySetStatus('slp', source);
	}
	},
	},
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
gastroacid: {	gastroacid: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Gastro Acid",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	volatileStatus: 'gastroacid',
	onTryHit(target) {
	if (target.getAbility().isPermanent) {
	return false;
	}
	if (target.hasItem('Ability Shield')) {
	this.add('-block', target, 'item: Ability Shield');
	return null;
	}
	},
	condition: {
	// Ability suppression implemented in Pokemon.ignoringAbility() within sim/pokemon.ts
	onStart(pokemon) {
	if (pokemon.hasItem('Ability Shield')) return false;
	this.add('-endability', pokemon);
	this.singleEvent('End', pokemon.getAbility(), pokemon.abilityState, pokemon, pokemon, 'gastroacid');
	},
	onCopy(pokemon) {
	if (pokemon.getAbility().isPermanent) pokemon.removeVolatile('gastroacid');
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
gunkshot: {	gunkshot: {
accuracy:	accuracy: 80,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Gunk Shot",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	status: 'tox',
	},
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
mortalspin: {	mortalspin: {
accuracy:	accuracy: 95,
basePower:	basePower: 30,
category:	category: "Physical",
	name: "Mortal Spin",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onAfterHit(target, pokemon) {
	if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
	this.add('-end', pokemon, 'Leech Seed', '[from] move: Mortal Spin', '[of] ' + pokemon);
	}
	const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
	for (const condition of sideConditions) {
	if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
	this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Mortal Spin', '[of] ' + pokemon);
	}
	}
	if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
	pokemon.removeVolatile('partiallytrapped');
	}
	},
	onAfterSubDamage(damage, target, pokemon) {
	if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
	this.add('-end', pokemon, 'Leech Seed', '[from] move: Mortal Spin', '[of] ' + pokemon);
	}
	const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
	for (const condition of sideConditions) {
	if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
	this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Mortal Spin', '[of] ' + pokemon);
	}
	}
	if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
	pokemon.removeVolatile('partiallytrapped');
	}
	},
secondary:	secondary: {
	chance: 100,
	status: 'tox',
	},
target:	target: "allAdjacentFoes",
type: "Poison",	type: "Poison",
	},
	
noxioustorque: {	noxioustorque: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Noxious Torque",
	pp: 1.25,
priority:	priority: 0,
	flags: {
	protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, failmimic: 1,
	},
secondary:	secondary: {
	chance: 30,
	status: 'tox',
	},
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
poisonfang: {	poisonfang: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Poison Fang",
	pp: 1.25,
priority:	priority: 0,
	flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 50,
	status: 'tox',
	},
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
poisongas: {	poisongas: {
accuracy:	accuracy: 90,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Poison Gas",
	pp: 125,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	status: 'tox',
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Poison",	type: "Poison",
	},
	
poisonjab: {	poisonjab: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Poison Jab",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	status: 'tox',
	},
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
poisonpowder: {	poisonpowder: {
accuracy:	accuracy: 75,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Poison Powder",
	pp: 1.25,
priority:	priority: 0,
	flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
	status: 'tox',
secondary:	secondary: null,
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
poisonsting: {	poisonsting: {
accuracy:	accuracy: 95,
basePower:	basePower: 15,
category:	category: "Physical",
	name: "Poison Sting",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	status: 'tox',
	},
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
poisontail: {	poisontail: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Poison Tail",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
critRatio:	critRatio: 2,
secondary:	secondary: {
	chance: 10,
	status: 'tox',
	},
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
purify: {	purify: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Purify",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, heal: 1},
	onHit(target, source) {
	if (!target.cureStatus()) {
	this.add('-fail', source);
	this.attrLastMove('[still]');
	return this.NOT_FAIL;
	}
	this.heal(Math.ceil(source.maxhp * 0.5), source);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
shellsidearm: {	shellsidearm: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Shell Side Arm",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onPrepareHit(target, source, move) {
	if (!source.isAlly(target)) {
	this.attrLastMove('[anim] Shell Side Arm ' + move.category);
	}
	},
	onModifyMove(move, pokemon, target) {
	if (!target) return;
	const atk = pokemon.getStat('atk', false, true);
	const spa = pokemon.getStat('spa', false, true);
	const def = target.getStat('def', false, true);
	const spd = target.getStat('spd', false, true);
	const physical = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * atk) / def) / 50);
	const special = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * spa) / spd) / 50);
	if (physical > special || (physical === special && this.random(2) === 0)) {
	move.category = 'Physical';
	move.flags.contact = 1;
	}
	},
	onHit(target, source, move) {
	// Shell Side Arm normally reveals its category via animation on cart, but doesn't play either custom animation against allies
	if (!source.isAlly(target)) this.hint(move.category + " Shell Side Arm");
	},
	onAfterSubDamage(damage, target, source, move) {
	if (!source.isAlly(target)) this.hint(move.category + " Shell Side Arm");
	},
secondary:	secondary: {
	chance: 20,
	status: 'tox',
	},
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
sludge: {	sludge: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Special",
	name: "Sludge",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	status: 'tox',
	},
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
sludgebomb: {	sludgebomb: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Sludge Bomb",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	status: 'tox',
	},
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
sludgewave: {	sludgewave: {
accuracy:	accuracy: 95,
basePower:	basePower: 95,
category:	category: "Special",
	name: "Sludge Wave",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	status: 'tox',
	},
target:	target: "allAdjacent",
type: "Poison",	type: "Poison",
	},
	
smog: {	smog: {
accuracy:	accuracy: 70,
basePower:	basePower: 30,
category:	category: "Special",
	name: "Smog",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 40,
	status: 'tox',
	},
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
toxic: {	toxic: {
accuracy:	accuracy: 90,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Toxic",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	// No Guard-like effect for Poison-type users implemented in Scripts#tryMoveHit
	status: 'tox',
secondary:	secondary: null,
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
toxicspikes: {	toxicspikes: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Toxic Spikes",
	pp: 1.25,
priority:	priority: 0,
	flags: {reflectable: 1, nonsky: 1, mustpressure: 1},
	sideCondition: 'toxicspikes',
	condition: {
	// this is a side condition
	onSideStart(side) {
	this.add('-sidestart', side, 'move: Toxic Spikes');
	this.effectState.layers = 1;
	},
	onSideRestart(side) {
	if (this.effectState.layers >= 2) return false;
	this.add('-sidestart', side, 'move: Toxic Spikes');
	this.effectState.layers++;
	},
	onEntryHazard(pokemon) {
	if (!pokemon.isGrounded()) return;
	if (pokemon.hasType('Poison')) {
	this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] ' + pokemon);
	pokemon.side.removeSideCondition('toxicspikes');
	} else if (pokemon.hasType('Steel') || pokemon.hasItem('heavydutyboots')) {
	return;
	} else if (this.effectState.layers >= 2) {
	pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
	} else {
	pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
	}
	},
	},
secondary:	secondary: null,
target:	target: "foeSide",
type: "Poison",	type: "Poison",
	},
	
toxicthread: {	toxicthread: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Toxic Thread",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	status: 'tox',
	boosts: {
	spe: -1,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
venomdrench: {	venomdrench: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Venom Drench",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	onHit(target, source, move) {
	if (target.status === 'tox' || target.status === 'tox') {
	return !!this.boost({atk: -1, spa: -1, spe: -1}, target, source, move);
	}
	return false;
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Poison",	type: "Poison",
	},
	
venoshock: {	venoshock: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Special",
	name: "Venoshock",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onBasePower(basePower, pokemon, target) {
	if (target.status === 'tox' || target.status === 'tox') {
	return this.chainModify(2);
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Poison",	type: "Poison",
	},
	
agility: {	agility: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Agility",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	spe: 2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
allyswitch: {	allyswitch: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Ally Switch",
	pp: 1.25,
priority:	priority: 2,
	flags: {},
	stallingMove: true,
	onPrepareHit(pokemon) {
	return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
	},
	onTryHit(source) {
	if (source.side.active.length === 1) return false;
	if (source.side.active.length === 3 && source.position === 1) return false;
	},
	onHit(pokemon) {
	pokemon.addVolatile('stall');
	const newPosition = (pokemon.position === 0 ? pokemon.side.active.length - 1 : 0);
	if (!pokemon.side.active[newPosition]) return false;
	if (pokemon.side.active[newPosition].fainted) return false;
	this.swapPosition(pokemon, newPosition, '[from] move: Ally Switch');
	},
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
amnesia: {	amnesia: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Amnesia",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	spd: 2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
barrier: {	barrier: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Barrier",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	def: 2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
calmmind: {	calmmind: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Calm Mind",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	spa: 1,
	spd: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
confusion: {	confusion: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Special",
	name: "Confusion",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	volatileStatus: 'confusion',
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
cosmicpower: {	cosmicpower: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Cosmic Power",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	def: 1,
	spd: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
dreameater: {	dreameater: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Dream Eater",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, heal: 1},
	drain: [1, 2],
	onTryImmunity(target) {
	return target.status === 'slp' || target.hasAbility('comatose');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
eeriespell: {	eeriespell: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Eerie Spell",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
secondary:	secondary: {
	chance: 100,
	onHit(target) {
	if (!target.hp) return;
	let move: Move | ActiveMove | null = target.lastMove;
	if (!move || move.isZ) return;
	if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
	const ppDeducted = target.deductPP(move.id, 3);
	if (!ppDeducted) return;
	this.add('-activate', target, 'move: Eerie Spell', move.name, ppDeducted);
	},
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
esperwing: {	esperwing: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Esper Wing",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
critRatio:	critRatio: 2,
secondary:	secondary: {
	chance: 100,
	self: {
	boosts: {
	spe: 1,
	},
	},
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
expandingforce: {	expandingforce: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Expanding Force",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onBasePower(basePower, source) {
	if (this.field.isTerrain('psychicterrain') && source.isGrounded()) {
	this.debug('terrain buff');
	return this.chainModify(1.5);
	}
	},
	onModifyMove(move, source, target) {
	if (this.field.isTerrain('psychicterrain') && source.isGrounded()) {
	move.target = 'allAdjacentFoes';
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
extrasensory: {	extrasensory: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Extrasensory",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
freezingglare: {	freezingglare: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Freezing Glare",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	status: 'frz',
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
futuresight: {	futuresight: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Future Sight",
	pp: 1.25,
priority:	priority: 0,
	flags: {allyanim: 1, futuremove: 1},
	ignoreImmunity: true,
	onTry(source, target) {
	if (!target.side.addSlotCondition(target, 'futuremove')) return false;
	Object.assign(target.side.slotConditions[target.position]['futuremove'], {
	duration: 3,
	move: 'futuresight',
	source: source,
	moveData: {
	id: 'futuresight',
name: "Future Sight",	name: "Future Sight",
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Special",
priority:	priority: 0,
	flags: {allyanim: 1, futuremove: 1},
	ignoreImmunity: false,
	effectType: 'Move',
type: 'Psychic',	type: 'Psychic',
	},
	});
	this.add('-start', source, 'move: Future Sight');
	return this.NOT_FAIL;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
genesissupernova: {	genesissupernova: {
accuracy:	accuracy: 95,
basePower:	basePower: 185,
category:	category: "Special",
	name: "Genesis Supernova",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: {
	chance: 100,
	self: {
	onHit() {
	this.field.setTerrain('psychicterrain');
	},
	},
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
glitzyglow: {	glitzyglow: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Glitzy Glow",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	self: {
	sideCondition: 'lightscreen',
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
gravity: {	gravity: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Gravity",
	pp: 1.25,
priority:	priority: 0,
	flags: {nonsky: 1},
	pseudoWeather: 'gravity',
	condition: {
	duration: 5,
	durationCallback(source, effect) {
	if (source?.hasAbility('persistent')) {
	this.add('-activate', source, 'ability: Persistent', '[move] Gravity');
	return 7;
	}
	return 5;
	},
	onFieldStart(target, source) {
	if (source?.hasAbility('persistent')) {
	this.add('-fieldstart', 'move: Gravity', '[persistent]');
	} else {
	this.add('-fieldstart', 'move: Gravity');
	}
	for (const pokemon of this.getAllActive()) {
	let applies = false;
	if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
	applies = true;
	this.queue.cancelMove(pokemon);
	pokemon.removeVolatile('twoturnmove');
	}
	if (pokemon.volatiles['skydrop']) {
	applies = true;
	this.queue.cancelMove(pokemon);
	if (pokemon.volatiles['skydrop'].source) {
	this.add('-end', pokemon.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
	}
	pokemon.removeVolatile('skydrop');
	pokemon.removeVolatile('twoturnmove');
	}
	if (pokemon.volatiles['magnetrise']) {
	applies = true;
	delete pokemon.volatiles['magnetrise'];
	}
	if (pokemon.volatiles['telekinesis']) {
	applies = true;
	delete pokemon.volatiles['telekinesis'];
	}
	if (applies) this.add('-activate', pokemon, 'move: Gravity');
	}
	},
	onModifyAccuracy(accuracy) {
	if (typeof accuracy !== 'number') return;
	return this.chainModify([6840, 4096]);
	},
	onDisableMove(pokemon) {
	for (const moveSlot of pokemon.moveSlots) {
	if (this.dex.moves.get(moveSlot.id).flags['gravity']) {
	pokemon.disableMove(moveSlot.id);
	}
	}
	},
	// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
	onBeforeMovePriority: 6,
	onBeforeMove(pokemon, target, move) {
	if (move.flags['gravity'] && !move.isZ) {
	this.add('cant', pokemon, 'move: Gravity', move);
	return false;
	}
	},
	onModifyMove(move, pokemon, target) {
	if (move.flags['gravity'] && !move.isZ) {
	this.add('cant', pokemon, 'move: Gravity', move);
	return false;
	}
	},
	onFieldResidualOrder: 27,
	onFieldResidualSubOrder: 2,
	onFieldEnd() {
	this.add('-fieldend', 'move: Gravity');
	},
	},
secondary:	secondary: null,
target:	target: "all",
type: "Psychic",	type: "Psychic",
	},
	
guardsplit: {	guardsplit: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Guard Split",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, allyanim: 1},
	onHit(target, source) {
	const newdef = Math.floor((target.storedStats.def + source.storedStats.def) / 2);
	target.storedStats.def = newdef;
	source.storedStats.def = newdef;
	const newspd = Math.floor((target.storedStats.spd + source.storedStats.spd) / 2);
	target.storedStats.spd = newspd;
	source.storedStats.spd = newspd;
	this.add('-activate', source, 'move: Guard Split', '[of] ' + target);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
guardswap: {	guardswap: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Guard Swap",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, bypasssub: 1, allyanim: 1},
	onHit(target, source) {
	const targetBoosts: SparseBoostsTable = {};
	const sourceBoosts: SparseBoostsTable = {};
	const defSpd: BoostID[] = ['def', 'spd'];
	for (const stat of defSpd) {
	targetBoosts[stat] = target.boosts[stat];
	sourceBoosts[stat] = source.boosts[stat];
	}
	source.setBoost(targetBoosts);
	target.setBoost(sourceBoosts);
	this.add('-swapboost', source, target, 'def, spd', '[from] move: Guard Swap');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
healblock: {	healblock: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Heal Block",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	volatileStatus: 'healblock',
	condition: {
	duration: 5,
	durationCallback(target, source, effect) {
	if (source?.hasAbility('persistent')) {
	this.add('-activate', source, 'ability: Persistent', '[move] Heal Block');
	return 7;
	}
	return 5;
	},
	onStart(pokemon, source) {
	this.add('-start', pokemon, 'move: Heal Block');
	source.moveThisTurnResult = true;
	},
	onDisableMove(pokemon) {
	for (const moveSlot of pokemon.moveSlots) {
	if (this.dex.moves.get(moveSlot.id).flags['heal']) {
	pokemon.disableMove(moveSlot.id);
	}
	}
	},
	onBeforeMovePriority: 6,
	onBeforeMove(pokemon, target, move) {
	if (move.flags['heal'] && !move.isZ && !move.isMax) {
	this.add('cant', pokemon, 'move: Heal Block', move);
	return false;
	}
	},
	onModifyMove(move, pokemon, target) {
	if (move.flags['heal'] && !move.isZ && !move.isMax) {
	this.add('cant', pokemon, 'move: Heal Block', move);
	return false;
	}
	},
	onResidualOrder: 20,
	onEnd(pokemon) {
	this.add('-end', pokemon, 'move: Heal Block');
	},
	onTryHeal(damage, target, source, effect) {
	if ((effect?.id === 'zpower') || this.effectState.isZ) return damage;
	return false;
	},
	onRestart(target, source) {
	this.add('-fail', target, 'move: Heal Block'); // Succeeds to supress downstream messages
	if (!source.moveThisTurnResult) {
	source.moveThisTurnResult = false;
	}
	},
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Psychic",	type: "Psychic",
	},
	
healingwish: {	healingwish: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Healing Wish",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	onTryHit(source) {
	if (!this.canSwitch(source.side)) {
	this.attrLastMove('[still]');
	this.add('-fail', source);
	return this.NOT_FAIL;
	}
	},
	selfdestruct: "ifHit",
	slotCondition: 'healingwish',
	condition: {
	onSwap(target) {
	if (!target.fainted && (target.hp < target.maxhp || target.status)) {
	target.heal(target.maxhp);
	target.clearStatus();
	this.add('-heal', target, target.getHealth, '[from] move: Healing Wish');
	target.side.removeSlotCondition(target, 'healingwish');
	}
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
healpulse: {	healpulse: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Heal Pulse",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, pulse: 1, reflectable: 1, distance: 1, heal: 1, allyanim: 1},
	onHit(target, source) {
	let success = false;
	if (source.hasAbility('megalauncher')) {
	success = !!this.heal(this.modify(target.baseMaxhp, 0.75));
	} else {
	success = !!this.heal(Math.ceil(target.baseMaxhp * 0.5));
	}
	if (success && !target.isAlly(source)) {
	target.staleness = 'external';
	}
	if (!success) {
	this.add('-fail', target, 'heal');
	return this.NOT_FAIL;
	}
	return success;
	},
secondary:	secondary: null,
target:	target: "any",
type: "Psychic",	type: "Psychic",
	},
	
heartstamp: {	heartstamp: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Heart Stamp",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
heartswap: {	heartswap: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Heart Swap",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, bypasssub: 1, allyanim: 1},
	onHit(target, source) {
	const targetBoosts: SparseBoostsTable = {};
	const sourceBoosts: SparseBoostsTable = {};
	let i: BoostID;
	for (i in target.boosts) {
	targetBoosts[i] = target.boosts[i];
	sourceBoosts[i] = source.boosts[i];
	}
	target.setBoost(sourceBoosts);
	source.setBoost(targetBoosts);
	this.add('-swapboost', source, target, '[from] move: Heart Swap');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
hyperspacehole: {	hyperspacehole: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Hyperspace Hole",
	pp: 1.25,
priority:	priority: 0,
	flags: {mirror: 1, bypasssub: 1},
	breaksProtect: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
hypnosis: {	hypnosis: {
accuracy:	accuracy: 60,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Hypnosis",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	status: 'slp',
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
imprison: {	imprison: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Imprison",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, bypasssub: 1, mustpressure: 1},
	volatileStatus: 'imprison',
	condition: {
	noCopy: true,
	onStart(target) {
	this.add('-start', target, 'move: Imprison');
	},
	onFoeDisableMove(pokemon) {
	for (const moveSlot of this.effectState.source.moveSlots) {
	if (moveSlot.id === 'struggle') continue;
	pokemon.disableMove(moveSlot.id, 'hidden');
	}
	pokemon.maybeDisabled = true;
	},
	onFoeBeforeMovePriority: 4,
	onFoeBeforeMove(attacker, defender, move) {
	if (move.id !== 'struggle' && this.effectState.source.hasMove(move.id) && !move.isZ && !move.isMax) {
	this.add('cant', attacker, 'move: Imprison', move);
	return false;
	}
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
instruct: {	instruct: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Instruct",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, bypasssub: 1, allyanim: 1, failinstruct: 1},
	onHit(target, source) {
	if (!target.lastMove || target.volatiles['dynamax']) return false;
	const lastMove = target.lastMove;
	const moveIndex = target.moves.indexOf(lastMove.id);
	if (
	lastMove.flags['failinstruct'] || lastMove.isZ || lastMove.isMax ||
	lastMove.flags['charge'] || lastMove.flags['recharge'] ||
	target.volatiles['beakblast'] || target.volatiles['focuspunch'] || target.volatiles['shelltrap'] ||
	(target.moveSlots[moveIndex] && target.moveSlots[moveIndex].pp <= 0)
	) {
	return false;
	}
	this.add('-singleturn', target, 'move: Instruct', '[of] ' + source);
	this.queue.prioritizeAction(this.queue.resolveAction({
	choice: 'move',
	pokemon: target,
	moveid: target.lastMove.id,
	targetLoc: target.lastMoveTargetLoc!,
	})[0] as MoveAction);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
kinesis: {	kinesis: {
accuracy:	accuracy: 80,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Kinesis",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
boosts: {	boosts: {
accuracy:	accuracy: -1,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
lightscreen: {	lightscreen: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Light Screen",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	sideCondition: 'lightscreen',
	condition: {
	duration: 5,
	durationCallback(target, source, effect) {
	if (source?.hasItem('lightclay')) {
	return 8;
	}
	return 5;
	},
	onAnyModifyDamage(damage, source, target, move) {
	if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Special') {
	if (!target.getMoveHitData(move).crit && !move.infiltrates) {
	this.debug('Light Screen weaken');
	if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
	return this.chainModify(0.5);
	}
	}
	},
	onSideStart(side) {
	this.add('-sidestart', side, 'move: Light Screen');
	},
	onSideResidualOrder: 26,
	onSideResidualSubOrder: 2,
	onSideEnd(side) {
	this.add('-sideend', side, 'move: Light Screen');
	},
	},
secondary:	secondary: null,
target:	target: "allySide",
type: "Psychic",	type: "Psychic",
	},
	
lightthatburnsthesky: {	lightthatburnsthesky: {
accuracy:	accuracy: 95,
basePower:	basePower: 200,
category:	category: "Special",
	name: "Light That Burns the Sky",
	pp: 1,
priority:	priority: 0,
	flags: {},
	onModifyMove(move, pokemon) {
	if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
	},
	ignoreAbility: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
luminacrash: {	luminacrash: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Lumina Crash",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spd: -2,
	},
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
lunarblessing: {	lunarblessing: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Lunar Blessing",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	onHit(pokemon) {
	const success = !!this.heal(this.modify(pokemon.maxhp, 0.25));
	return pokemon.cureStatus() || success;
	},
secondary:	secondary: null,
target:	target: "allies",
type: "Psychic",	type: "Psychic",
	},
	
lunardance: {	lunardance: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Lunar Dance",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1, dance: 1},
	onTryHit(source) {
	if (!this.canSwitch(source.side)) {
	this.attrLastMove('[still]');
	this.add('-fail', source);
	return this.NOT_FAIL;
	}
	},
	selfdestruct: "ifHit",
	slotCondition: 'lunardance',
	condition: {
	onSwap(target) {
	if (
	!target.fainted && (
	target.hp < target.maxhp ||
	target.status ||
	target.moveSlots.some(moveSlot => moveSlot.pp < moveSlot.maxpp)
	)
	) {
	target.heal(target.maxhp);
	target.clearStatus();
	for (const moveSlot of target.moveSlots) {
	moveSlot.pp = moveSlot.maxpp;
	}
	this.add('-heal', target, target.getHealth, '[from] move: Lunar Dance');
	target.side.removeSlotCondition(target, 'lunardance');
	}
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
lusterpurge: {	lusterpurge: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Special",
	name: "Luster Purge",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 50,
	boosts: {
	spd: -1,
	},
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
magiccoat: {	magiccoat: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Magic Coat",
	pp: 1.25,
priority:	priority: 4,
	flags: {},
	volatileStatus: 'magiccoat',
	condition: {
	duration: 1,
	onStart(target, source, effect) {
	this.add('-singleturn', target, 'move: Magic Coat');
	if (effect?.effectType === 'Move') {
	this.effectState.pranksterBoosted = effect.pranksterBoosted;
	}
	},
	onTryHitPriority: 2,
	onTryHit(target, source, move) {
	if (target === source || move.hasBounced || !move.flags['reflectable']) {
	return;
	}
	const newMove = this.dex.getActiveMove(move.id);
	newMove.hasBounced = true;
	newMove.pranksterBoosted = this.effectState.pranksterBoosted;
	this.actions.useMove(newMove, target, source);
	return null;
	},
	onAllyTryHitSide(target, source, move) {
	if (target.isAlly(source) || move.hasBounced || !move.flags['reflectable']) {
	return;
	}
	const newMove = this.dex.getActiveMove(move.id);
	newMove.hasBounced = true;
	newMove.pranksterBoosted = false;
	this.actions.useMove(newMove, this.effectState.target, source);
	return null;
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
magicpowder: {	magicpowder: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Magic Powder",
	pp: 1.25,
priority:	priority: 0,
	flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	onHit(target) {
	if (target.getTypes().join() === 'Psychic' || !target.setType('Psychic')) return false;
	this.add('-start', target, 'typechange', 'Psychic');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
magicroom: {	magicroom: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Magic Room",
	pp: 1.25,
priority:	priority: 0,
	flags: {mirror: 1},
	pseudoWeather: 'magicroom',
	condition: {
	duration: 5,
	durationCallback(source, effect) {
	if (source?.hasAbility('persistent')) {
	this.add('-activate', source, 'ability: Persistent', '[move] Magic Room');
	return 7;
	}
	return 5;
	},
	onFieldStart(target, source) {
	if (source?.hasAbility('persistent')) {
	this.add('-fieldstart', 'move: Magic Room', '[of] ' + source, '[persistent]');
	} else {
	this.add('-fieldstart', 'move: Magic Room', '[of] ' + source);
	}
	for (const mon of this.getAllActive()) {
	this.singleEvent('End', mon.getItem(), mon.itemState, mon);
	}
	},
	onFieldRestart(target, source) {
	this.field.removePseudoWeather('magicroom');
	},
	// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
	onFieldResidualOrder: 27,
	onFieldResidualSubOrder: 6,
	onFieldEnd() {
	this.add('-fieldend', 'move: Magic Room', '[of] ' + this.effectState.source);
	},
	},
secondary:	secondary: null,
target:	target: "all",
type: "Psychic",	type: "Psychic",
	},
	
meditate: {	meditate: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Meditate",
	pp: 125,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	atk: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
miracleeye: {	miracleeye: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Miracle Eye",
	pp: 125,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, bypasssub: 1},
	volatileStatus: 'miracleeye',
	onTryHit(target) {
	if (target.volatiles['foresight']) return false;
	},
	condition: {
	noCopy: true,
	onStart(pokemon) {
	this.add('-start', pokemon, 'Miracle Eye');
	},
	onNegateImmunity(pokemon, type) {
	if (pokemon.hasType('Dark') && type === 'Psychic') return false;
	},
	onModifyBoost(boosts) {
	if (boosts.evasion && boosts.evasion > 0) {
	boosts.evasion = 0;
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
mirrorcoat: {	mirrorcoat: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	damageCallback(pokemon) {
	if (!pokemon.volatiles['mirrorcoat']) return 0;
	return pokemon.volatiles['mirrorcoat'].damage || 1;
	},
category:	category: "Special",
	name: "Mirror Coat",
	pp: 1.25,
priority:	priority: -5,
	flags: {protect: 1, failmefirst: 1, noassist: 1},
	beforeTurnCallback(pokemon) {
	pokemon.addVolatile('mirrorcoat');
	},
	onTry(source) {
	if (!source.volatiles['mirrorcoat']) return false;
	if (source.volatiles['mirrorcoat'].slot === null) return false;
	},
	condition: {
	duration: 1,
	noCopy: true,
	onStart(target, source, move) {
	this.effectState.slot = null;
	this.effectState.damage = 0;
	},
	onRedirectTargetPriority: -1,
	onRedirectTarget(target, source, source2, move) {
	if (move.id !== 'mirrorcoat') return;
	if (source !== this.effectState.target || !this.effectState.slot) return;
	return this.getAtSlot(this.effectState.slot);
	},
	onDamagingHit(damage, target, source, move) {
	if (!source.isAlly(target) && this.getCategory(move) === 'Special') {
	this.effectState.slot = source.getSlot();
	this.effectState.damage = 2 * damage;
	}
	},
	},
secondary:	secondary: null,
target:	target: "scripted",
type: "Psychic",	type: "Psychic",
	},
	
mistball: {	mistball: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Special",
	name: "Mist Ball",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 50,
	boosts: {
	spa: -1,
	},
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
mysticalpower: {	mysticalpower: {
accuracy:	accuracy: 90,
basePower:	basePower: 70,
category:	category: "Special",
	name: "Mystical Power",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	self: {
	boosts: {
	spa: 1,
	},
	},
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
photongeyser: {	photongeyser: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Special",
	name: "Photon Geyser",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onModifyMove(move, pokemon) {
	if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
	},
	ignoreAbility: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
powersplit: {	powersplit: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Power Split",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, allyanim: 1},
	onHit(target, source) {
	const newatk = Math.floor((target.storedStats.atk + source.storedStats.atk) / 2);
	target.storedStats.atk = newatk;
	source.storedStats.atk = newatk;
	const newspa = Math.floor((target.storedStats.spa + source.storedStats.spa) / 2);
	target.storedStats.spa = newspa;
	source.storedStats.spa = newspa;
	this.add('-activate', source, 'move: Power Split', '[of] ' + target);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
powerswap: {	powerswap: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Power Swap",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, bypasssub: 1, allyanim: 1},
	onHit(target, source) {
	const targetBoosts: SparseBoostsTable = {};
	const sourceBoosts: SparseBoostsTable = {};
	const atkSpa: BoostID[] = ['atk', 'spa'];
	for (const stat of atkSpa) {
	targetBoosts[stat] = target.boosts[stat];
	sourceBoosts[stat] = source.boosts[stat];
	}
	source.setBoost(targetBoosts);
	target.setBoost(sourceBoosts);
	this.add('-swapboost', source, target, 'atk, spa', '[from] move: Power Swap');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
powertrick: {	powertrick: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Power Trick",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	volatileStatus: 'powertrick',
	condition: {
	onStart(pokemon) {
	this.add('-start', pokemon, 'Power Trick');
	const newatk = pokemon.storedStats.def;
	const newdef = pokemon.storedStats.atk;
	pokemon.storedStats.atk = newatk;
	pokemon.storedStats.def = newdef;
	},
	onCopy(pokemon) {
	const newatk = pokemon.storedStats.def;
	const newdef = pokemon.storedStats.atk;
	pokemon.storedStats.atk = newatk;
	pokemon.storedStats.def = newdef;
	},
	onEnd(pokemon) {
	this.add('-end', pokemon, 'Power Trick');
	const newatk = pokemon.storedStats.def;
	const newdef = pokemon.storedStats.atk;
	pokemon.storedStats.atk = newatk;
	pokemon.storedStats.def = newdef;
	},
	onRestart(pokemon) {
	pokemon.removeVolatile('Power Trick');
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
prismaticlaser: {	prismaticlaser: {
accuracy:	accuracy: 95,
basePower:	basePower: 160,
category:	category: "Special",
	name: "Prismatic Laser",
	pp: 1.25,
priority:	priority: 0,
	flags: {recharge: 1, protect: 1, mirror: 1},
	self: {
	volatileStatus: 'mustrecharge',
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
psybeam: {	psybeam: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Special",
	name: "Psybeam",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	volatileStatus: 'confusion',
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
psyblade: {	psyblade: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Psyblade",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
secondary:	secondary: null,
	onBasePower(basePower, source) {
	if (this.field.isTerrain('electricterrain')) {
	this.debug('psyblade electric terrain boost');
	return this.chainModify(1.5);
	}
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
psychic: {	psychic: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Psychic",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	boosts: {
	spd: -1,
	},
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
psychicfangs: {	psychicfangs: {
accuracy:	accuracy: 95,
basePower:	basePower: 85,
category:	category: "Physical",
	name: "Psychic Fangs",
	pp: 1.25,
priority:	priority: 0,
	flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
	onTryHit(pokemon) {
	// will shatter screens through sub, before you hit
	pokemon.side.removeSideCondition('reflect');
	pokemon.side.removeSideCondition('lightscreen');
	pokemon.side.removeSideCondition('auroraveil');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
psychicterrain: {	psychicterrain: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Psychic Terrain",
	pp: 1.25,
priority:	priority: 0,
	flags: {nonsky: 1},
	terrain: 'psychicterrain',
	condition: {
	duration: 5,
	durationCallback(source, effect) {
	if (source?.hasItem('terrainextender')) {
	return 8;
	}
	return 5;
	},
	onTryHitPriority: 4,
	onTryHit(target, source, effect) {
	if (effect && (effect.priority <= 0.1 || effect.target === 'self')) {
	return;
	}
	if (target.isSemiInvulnerable() || target.isAlly(source)) return;
	if (!target.isGrounded()) {
	const baseMove = this.dex.moves.get(effect.id);
	if (baseMove.priority > 0) {
	this.hint("Psychic Terrain doesn't affect Pokémon immune to Ground.");
	}
	return;
	}
	this.add('-activate', target, 'move: Psychic Terrain');
	return null;
	},
	onBasePowerPriority: 6,
	onBasePower(basePower, attacker, defender, move) {
	if (move.type === 'Psychic' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
	this.debug('psychic terrain boost');
	return this.chainModify([5325, 4096]);
	}
	},
	onFieldStart(field, source, effect) {
	if (effect?.effectType === 'Ability') {
	this.add('-fieldstart', 'move: Psychic Terrain', '[from] ability: ' + effect.name, '[of] ' + source);
	} else {
	this.add('-fieldstart', 'move: Psychic Terrain');
	}
	},
	onFieldResidualOrder: 27,
	onFieldResidualSubOrder: 7,
	onFieldEnd() {
	this.add('-fieldend', 'move: Psychic Terrain');
	},
	},
secondary:	secondary: null,
target:	target: "all",
type: "Psychic",	type: "Psychic",
	},
	
psychoboost: {	psychoboost: {
accuracy:	accuracy: 90,
basePower:	basePower: 140,
category:	category: "Special",
	name: "Psycho Boost",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	self: {
	boosts: {
	spa: -2,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
psychocut: {	psychocut: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Psycho Cut",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, slicing: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
psychoshift: {	psychoshift: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Psycho Shift",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onTryHit(target, source, move) {
	if (!source.status) return false;
	move.status = source.status;
	},
	self: {
	onHit(pokemon) {
	pokemon.cureStatus();
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
psyshieldbash: {	psyshieldbash: {
accuracy:	accuracy: 90,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Psyshield Bash",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	self: {
	boosts: {
	def: 1,
	},
	},
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
psyshock: {	psyshock: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	overrideDefensiveStat: 'def',
	name: "Psyshock",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
psystrike: {	psystrike: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Special",
	overrideDefensiveStat: 'def',
	name: "Psystrike",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
psywave: {	psywave: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	damageCallback(pokemon) {
	return (this.random(50, 151) * pokemon.level) / 100;
	},
category:	category: "Special",
	name: "Psywave",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
reflect: {	reflect: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Reflect",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	sideCondition: 'reflect',
	condition: {
	duration: 5,
	durationCallback(target, source, effect) {
	if (source?.hasItem('lightclay')) {
	return 8;
	}
	return 5;
	},
	onAnyModifyDamage(damage, source, target, move) {
	if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Physical') {
	if (!target.getMoveHitData(move).crit && !move.infiltrates) {
	this.debug('Reflect weaken');
	if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
	return this.chainModify(0.5);
	}
	}
	},
	onSideStart(side) {
	this.add('-sidestart', side, 'Reflect');
	},
	onSideResidualOrder: 26,
	onSideResidualSubOrder: 1,
	onSideEnd(side) {
	this.add('-sideend', side, 'Reflect');
	},
	},
secondary:	secondary: null,
target:	target: "allySide",
type: "Psychic",	type: "Psychic",
	},
	
rest: {	rest: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Rest",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1},
	onTry(source) {
	if (source.status === 'slp' || source.hasAbility('comatose')) return false;
	if (source.hp === source.maxhp) {
	this.add('-fail', source, 'heal');
	return null;
	}
	if (source.hasAbility(['insomnia', 'vitalspirit'])) {
	this.add('-fail', source, '[from] ability: ' + source.getAbility().name, '[of] ' + source);
	return null;
	}
	},
	onHit(target, source, move) {
	const result = target.setStatus('slp', source, move);
	if (!result) return result;
	target.statusState.time = 3;
	target.statusState.startTime = 3;
	this.heal(target.maxhp); // Aesthetic only as the healing happens after you fall asleep in-game
	},
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
roleplay: {	roleplay: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Role Play",
	pp: 1.25,
priority:	priority: 0,
	flags: {bypasssub: 1, allyanim: 1},
	onTryHit(target, source) {
	if (target.ability === source.ability) return false;
	const additionalBannedTargetAbilities = [
	// Zen Mode included here for compatability with Gen 5-6
	'flowergift', 'forecast', 'hungerswitch', 'illusion', 'imposter', 'neutralizinggas', 'powerofalchemy', 'receiver', 'trace', 'wonderguard', 'zenmode',
	];
	if (target.getAbility().isPermanent || additionalBannedTargetAbilities.includes(target.ability) ||
	source.getAbility().isPermanent) {
	return false;
	}
	},
	onHit(target, source) {
	const oldAbility = source.setAbility(target.ability);
	if (oldAbility) {
	this.add('-ability', source, source.getAbility().name, '[from] move: Role Play', '[of] ' + target);
	return;
	}
	return oldAbility as false | null;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
shatteredpsyche: {	shatteredpsyche: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "Shattered Psyche",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
skillswap: {	skillswap: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Skill Swap",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, bypasssub: 1, allyanim: 1},
	onTryHit(target, source) {
	const additionalBannedAbilities = ['hungerswitch', 'illusion', 'neutralizinggas', 'wonderguard'];
	const targetAbility = target.getAbility();
	const sourceAbility = source.getAbility();
	// TODO: research in what order these should be checked
	if (
	target.volatiles['dynamax'] ||
	targetAbility.isPermanent || sourceAbility.isPermanent ||
	additionalBannedAbilities.includes(target.ability) || additionalBannedAbilities.includes(source.ability)
	) {
	return false;
	}
	const sourceCanBeSet = this.runEvent('SetAbility', source, source, this.effect, targetAbility);
	if (!sourceCanBeSet) return sourceCanBeSet;
	const targetCanBeSet = this.runEvent('SetAbility', target, source, this.effect, sourceAbility);
	if (!targetCanBeSet) return targetCanBeSet;
	},
	onHit(target, source, move) {
	const targetAbility = target.getAbility();
	const sourceAbility = source.getAbility();
	if (target.isAlly(source)) {
	this.add('-activate', source, 'move: Skill Swap', '', '', '[of] ' + target);
	} else {
	this.add('-activate', source, 'move: Skill Swap', targetAbility, sourceAbility, '[of] ' + target);
	}
	this.singleEvent('End', sourceAbility, source.abilityState, source);
	this.singleEvent('End', targetAbility, target.abilityState, target);
	source.ability = targetAbility.id;
	target.ability = sourceAbility.id;
target:	source.abilityState = {id: this.toID(source.ability), target: source};
target:	target.abilityState = {id: this.toID(target.ability), target: target};
	if (!target.isAlly(source)) target.volatileStaleness = 'external';
	this.singleEvent('Start', targetAbility, source.abilityState, source);
	this.singleEvent('Start', sourceAbility, target.abilityState, target);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
speedswap: {	speedswap: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Speed Swap",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, bypasssub: 1, allyanim: 1},
	onHit(target, source) {
	const targetSpe = target.storedStats.spe;
	target.storedStats.spe = source.storedStats.spe;
	source.storedStats.spe = targetSpe;
	this.add('-activate', source, 'move: Speed Swap', '[of] ' + target);
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
storedpower: {	storedpower: {
accuracy:	accuracy: 95,
basePower:	basePower: 20,
	basePowerCallback(pokemon, target, move) {
	const bp = move.basePower + 20 * pokemon.positiveBoosts();
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Special",
	name: "Stored Power",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
synchronoise: {	synchronoise: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Synchronoise",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onTryImmunity(target, source) {
	return target.hasType(source.getTypes());
	},
secondary:	secondary: null,
target:	target: "allAdjacent",
type: "Psychic",	type: "Psychic",
	},
	
takeheart: {	takeheart: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Take Heart",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	onHit(pokemon) {
	const success = !!this.boost({spa: 1, spd: 1});
	return pokemon.cureStatus() || success;
	},
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
telekinesis: {	telekinesis: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Telekinesis",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, gravity: 1, allyanim: 1},
	volatileStatus: 'telekinesis',
	onTry(source, target, move) {
	// Additional Gravity check for Z-move variant
	if (this.field.getPseudoWeather('Gravity')) {
	this.attrLastMove('[still]');
	this.add('cant', source, 'move: Gravity', move);
	return null;
	}
	},
	condition: {
	duration: 3,
	onStart(target) {
	if (['Diglett', 'Dugtrio', 'Palossand', 'Sandygast'].includes(target.baseSpecies.baseSpecies) ||
	target.baseSpecies.name === 'Gengar-Mega') {
	this.add('-immune', target);
	return null;
	}
	if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;
	this.add('-start', target, 'Telekinesis');
	},
	onAccuracyPriority: -1,
	onAccuracy(accuracy, target, source, move) {
	if (move && !move.ohko) return true;
	},
	onImmunity(type) {
	if (type === 'Ground') return false;
	},
	onUpdate(pokemon) {
	if (pokemon.baseSpecies.name === 'Gengar-Mega') {
	delete pokemon.volatiles['telekinesis'];
	this.add('-end', pokemon, 'Telekinesis', '[silent]');
	}
	},
	onResidualOrder: 19,
	onEnd(target) {
	this.add('-end', target, 'Telekinesis');
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
teleport: {	teleport: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Teleport",
	pp: 1.25,
priority:	priority: -6,
	flags: {},
	onTry(source) {
	return !!this.canSwitch(source.side);
	},
	selfSwitch: true,
secondary:	secondary: null,
target:	target: "self",
type: "Psychic",	type: "Psychic",
	},
	
trick: {	trick: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Trick",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, allyanim: 1, noassist: 1, failcopycat: 1},
	onTryImmunity(target) {
	return !target.hasAbility('stickyhold');
	},
	onHit(target, source, move) {
	const yourItem = target.takeItem(source);
	const myItem = source.takeItem();
	if (target.item || source.item || (!yourItem && !myItem)) {
	if (yourItem) target.item = yourItem.id;
	if (myItem) source.item = myItem.id;
	return false;
	}
	if (
	(myItem && !this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem)) ||
	(yourItem && !this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem))
	) {
	if (yourItem) target.item = yourItem.id;
	if (myItem) source.item = myItem.id;
	return false;
	}
	this.add('-activate', source, 'move: Trick', '[of] ' + target);
	if (myItem) {
	target.setItem(myItem);
	this.add('-item', target, myItem, '[from] move: Trick');
	} else {
	this.add('-enditem', target, yourItem, '[silent]', '[from] move: Trick');
	}
	if (yourItem) {
	source.setItem(yourItem);
	this.add('-item', source, yourItem, '[from] move: Trick');
	} else {
	this.add('-enditem', source, myItem, '[silent]', '[from] move: Trick');
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
trickroom: {	trickroom: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Trick Room",
	pp: 1.25,
priority:	priority: -7,
	flags: {mirror: 1},
	pseudoWeather: 'trickroom',
	condition: {
	duration: 5,
	durationCallback(source, effect) {
	if (source?.hasAbility('persistent')) {
	this.add('-activate', source, 'ability: Persistent', '[move] Trick Room');
	return 7;
	}
	return 5;
	},
	onFieldStart(target, source) {
	if (source?.hasAbility('persistent')) {
	this.add('-fieldstart', 'move: Trick Room', '[of] ' + source, '[persistent]');
	} else {
	this.add('-fieldstart', 'move: Trick Room', '[of] ' + source);
	}
	},
	onFieldRestart(target, source) {
	this.field.removePseudoWeather('trickroom');
	},
	// Speed modification is changed in Pokemon.getActionSpeed() in sim/pokemon.js
	onFieldResidualOrder: 27,
	onFieldResidualSubOrder: 1,
	onFieldEnd() {
	this.add('-fieldend', 'move: Trick Room');
	},
	},
secondary:	secondary: null,
target:	target: "all",
type: "Psychic",	type: "Psychic",
	},
	
twinbeam: {	twinbeam: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Special",
	name: "Twin Beam",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	multihit: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
wonderroom: {	wonderroom: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Wonder Room",
	pp: 1.25,
priority:	priority: 0,
	flags: {mirror: 1},
	pseudoWeather: 'wonderroom',
	condition: {
	duration: 5,
	durationCallback(source, effect) {
	if (source?.hasAbility('persistent')) {
	this.add('-activate', source, 'ability: Persistent', '[move] Wonder Room');
	return 7;
	}
	return 5;
	},
	onModifyMove(move, source, target) {
	// This code is for moves that use defensive stats as the attacking stat; see below for most of the implementation
	if (!move.overrideOffensiveStat) return;
	const statAndBoosts = move.overrideOffensiveStat;
	if (!['def', 'spd'].includes(statAndBoosts)) return;
	move.overrideOffensiveStat = statAndBoosts === 'def' ? 'spd' : 'def';
	this.hint(`${move.name} uses ${statAndBoosts === 'def' ? '' : 'Sp. '}Def boosts when Wonder Room is active.`);
	},
	onFieldStart(field, source) {
	if (source?.hasAbility('persistent')) {
	this.add('-fieldstart', 'move: Wonder Room', '[of] ' + source, '[persistent]');
	} else {
	this.add('-fieldstart', 'move: Wonder Room', '[of] ' + source);
	}
	},
	onFieldRestart(target, source) {
	this.field.removePseudoWeather('wonderroom');
	},
	// Swapping defenses partially implemented in sim/pokemon.js:Pokemon#calculateStat and Pokemon#getStat
	onFieldResidualOrder: 27,
	onFieldResidualSubOrder: 5,
	onFieldEnd() {
	this.add('-fieldend', 'move: Wonder Room');
	},
	},
secondary:	secondary: null,
target:	target: "all",
type: "Psychic",	type: "Psychic",
	},
	
zenheadbutt: {	zenheadbutt: {
accuracy:	accuracy: 90,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Zen Headbutt",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 20,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Psychic",	type: "Psychic",
	},
	
accelerock: {	accelerock: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "Accelerock",
	pp: 1.25,
priority:	priority: 1,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
ancientpower: {	ancientpower: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Special",
	name: "Ancient Power",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	self: {
	boosts: {
	atk: 1,
	def: 1,
	spa: 1,
	spd: 1,
	spe: 1,
	},
	},
	},
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
continentalcrush: {	continentalcrush: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "Continental Crush",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
diamondstorm: {	diamondstorm: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Diamond Storm",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	self: {
	chance: 50,
	boosts: {
	def: 2,
	},
	},
secondary:	secondary: {
	// Sheer Force negates the self even though it is not secondary
	},
target:	target: "allAdjacentFoes",
type: "Rock",	type: "Rock",
	},
	
headsmash: {	headsmash: {
accuracy:	accuracy: 80,
basePower:	basePower: 150,
category:	category: "Physical",
	name: "Head Smash",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	recoil: [1, 2],
secondary:	secondary: null,
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
meteorbeam: {	meteorbeam: {
accuracy:	accuracy: 90,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Meteor Beam",
	pp: 1.25,
priority:	priority: 0,
	flags: {charge: 1, protect: 1, mirror: 1},
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	this.add('-prepare', attacker, move.name);
	this.boost({spa: 1}, attacker, attacker, move);
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
paleowave: {	paleowave: {
accuracy:	accuracy: 95,
basePower:	basePower: 85,
category:	category: "Special",
	name: "Paleo Wave",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 20,
	boosts: {
	atk: -1,
	},
	},
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
powergem: {	powergem: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Power Gem",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
rockblast: {	rockblast: {
accuracy:	accuracy: 90,
basePower:	basePower: 25,
category:	category: "Physical",
	name: "Rock Blast",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
	multihit: [2, 5],
secondary:	secondary: null,
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
rockpolish: {	rockpolish: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Rock Polish",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	spe: 2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Rock",	type: "Rock",
	},
	
rockslide: {	rockslide: {
accuracy:	accuracy: 90,
basePower:	basePower: 75,
category:	category: "Physical",
	name: "Rock Slide",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "allAdjacentFoes",
type: "Rock",	type: "Rock",
	},
	
rockthrow: {	rockthrow: {
accuracy:	accuracy: 90,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Rock Throw",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
rocktomb: {	rocktomb: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Rock Tomb",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	spe: -1,
	},
	},
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
rockwrecker: {	rockwrecker: {
accuracy:	accuracy: 90,
basePower:	basePower: 150,
category:	category: "Physical",
	name: "Rock Wrecker",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, recharge: 1, protect: 1, mirror: 1},
	self: {
	volatileStatus: 'mustrecharge',
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
rollout: {	rollout: {
accuracy:	accuracy: 90,
basePower:	basePower: 30,
	basePowerCallback(pokemon, target, move) {
	let bp = move.basePower;
	const rolloutData = pokemon.volatiles['rollout'];
	if (rolloutData?.hitCount) {
	bp *= Math.pow(2, rolloutData.contactHitCount);
	}
	if (rolloutData && pokemon.status !== 'slp') {
	rolloutData.hitCount++;
	rolloutData.contactHitCount++;
	if (rolloutData.hitCount < 5) {
	rolloutData.duration = 2;
	}
	}
	if (pokemon.volatiles['defensecurl']) {
	bp *= 2;
	}
	this.debug("BP: " + bp);
	return bp;
	},
category:	category: "Physical",
	name: "Rollout",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, noparentalbond: 1, failinstruct: 1},
	onModifyMove(move, pokemon, target) {
	if (pokemon.volatiles['rollout'] || pokemon.status === 'slp' || !target) return;
	pokemon.addVolatile('rollout');
	// @ts-ignore
	// TS thinks pokemon.volatiles['rollout'] doesn't exist because of the condition on the return above
	// but it does exist now because addVolatile created it
	pokemon.volatiles['rollout'].targetSlot = move.sourceEffect ? pokemon.lastMoveTargetLoc : pokemon.getLocOf(target);
	},
	onAfterMove(source, target, move) {
	const rolloutData = source.volatiles["rollout"];
	if (
	rolloutData &&
	rolloutData.hitCount === 5 &&
	rolloutData.contactHitCount < 5
	// this conditions can only be met in gen7 and gen8dlc1
	// see `disguise` and `iceface` abilities in the resp mod folders
	) {
	source.addVolatile("rolloutstorage");
	source.volatiles["rolloutstorage"].contactHitCount =
	rolloutData.contactHitCount;
	}
	},
	condition: {
	duration: 1,
	onLockMove: 'rollout',
	onStart() {
	this.effectState.hitCount = 0;
	this.effectState.contactHitCount = 0;
	},
	onResidual(target) {
	if (target.lastMove && target.lastMove.id === 'struggle') {
	// don't lock
	delete target.volatiles['rollout'];
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
saltcure: {	saltcure: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "Salt Cure",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	condition: {
	noCopy: true,
	onStart(pokemon) {
	this.add('-start', pokemon, 'Salt Cure');
	},
	onResidualOrder: 13,
	onResidual(pokemon) {
	this.damage(pokemon.baseMaxhp / (pokemon.hasType(['Water', 'Steel']) ? 4 : 8));
	},
	onEnd(pokemon) {
	this.add('-end', pokemon, 'Salt Cure');
	},
	},
secondary:	secondary: {
	chance: 100,
	volatileStatus: 'saltcure',
	},
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
sandstorm: {	sandstorm: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Sandstorm",
	pp: 1.25,
priority:	priority: 0,
	flags: {wind: 1},
	weather: 'Sandstorm',
secondary:	secondary: null,
target:	target: "all",
type: "Rock",	type: "Rock",
	},
	
smackdown: {	smackdown: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Smack Down",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1},
	volatileStatus: 'smackdown',
	condition: {
	noCopy: true,
	onStart(pokemon) {
	let applies = false;
	if (pokemon.hasType('Flying') || pokemon.hasAbility('levitate')) applies = true;
	if (pokemon.hasItem('ironball') || pokemon.volatiles['ingrain'] ||
	this.field.getPseudoWeather('gravity')) applies = false;
	if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
	applies = true;
	this.queue.cancelMove(pokemon);
	pokemon.removeVolatile('twoturnmove');
	}
	if (pokemon.volatiles['magnetrise']) {
	applies = true;
	delete pokemon.volatiles['magnetrise'];
	}
	if (pokemon.volatiles['telekinesis']) {
	applies = true;
	delete pokemon.volatiles['telekinesis'];
	}
	if (!applies) return false;
	this.add('-start', pokemon, 'Smack Down');
	},
	onRestart(pokemon) {
	if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
	this.queue.cancelMove(pokemon);
	pokemon.removeVolatile('twoturnmove');
	this.add('-start', pokemon, 'Smack Down');
	}
	},
	// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
splinteredstormshards: {	splinteredstormshards: {
accuracy:	accuracy: 95,
basePower:	basePower: 190,
category:	category: "Physical",
	name: "Splintered Stormshards",
	pp: 1,
priority:	priority: 0,
	flags: {},
	onHit() {
	this.field.clearTerrain();
	},
	onAfterSubDamage() {
	this.field.clearTerrain();
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
stealthrock: {	stealthrock: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Stealth Rock",
	pp: 1.25,
priority:	priority: 0,
	flags: {reflectable: 1, mustpressure: 1},
	sideCondition: 'stealthrock',
	condition: {
	// this is a side condition
	onSideStart(side) {
	this.add('-sidestart', side, 'move: Stealth Rock');
	},
	onEntryHazard(pokemon) {
	if (pokemon.hasItem('heavydutyboots')) return;
	const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
	this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
	},
	},
secondary:	secondary: null,
target:	target: "foeSide",
type: "Rock",	type: "Rock",
	},
	
stoneaxe: {	stoneaxe: {
accuracy:	accuracy: 90,
basePower:	basePower: 65,
category:	category: "Physical",
	name: "Stone Axe",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
	self: {
	onHit(source) {
	for (const side of source.side.foeSidesWithConditions()) {
	side.addSideCondition('stealthrock');
	}
	},
	},
secondary:	secondary: {}, // allows sheer force to trigger
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
stoneedge: {	stoneedge: {
accuracy:	accuracy: 80,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Stone Edge",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
tarshot: {	tarshot: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Tar Shot",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1},
	volatileStatus: 'tarshot',
	condition: {
	onStart(pokemon) {
	this.add('-start', pokemon, 'Tar Shot');
	},
	onEffectivenessPriority: -2,
	onEffectiveness(typeMod, target, type, move) {
	if (move.type !== 'Fire') return;
	if (!target) return;
	if (type !== target.getTypes()[0]) return;
	return typeMod + 1;
	},
	},
	boosts: {
	spe: -1,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Rock",	type: "Rock",
	},
	
wideguard: {	wideguard: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Wide Guard",
	pp: 1.25,
priority:	priority: 3,
	flags: {snatch: 1},
	sideCondition: 'wideguard',
	onTry() {
	return !!this.queue.willAct();
	},
	onHitSide(side, source) {
	source.addVolatile('stall');
	},
	condition: {
	duration: 1,
	onSideStart(target, source) {
	this.add('-singleturn', source, 'Wide Guard');
	},
	onTryHitPriority: 4,
	onTryHit(target, source, move) {
	// Wide Guard blocks all spread moves
	if (move?.target !== 'allAdjacent' && move.target !== 'allAdjacentFoes') {
	return;
	}
	if (move.isZ || move.isMax) {
	if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
	target.getMoveHitData(move).zBrokeProtect = true;
	return;
	}
	this.add('-activate', target, 'move: Wide Guard');
	const lockedmove = source.getVolatile('lockedmove');
	if (lockedmove) {
	// Outrage counter is reset
	if (source.volatiles['lockedmove'].duration === 2) {
	delete source.volatiles['lockedmove'];
	}
	}
	return this.NOT_FAIL;
	},
	},
secondary:	secondary: null,
target:	target: "allySide",
type: "Rock",	type: "Rock",
	},
	
anchorshot: {	anchorshot: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Anchor Shot",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	onHit(target, source, move) {
	if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
	},
	},
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
autotomize: {	autotomize: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Autotomize",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	onTryHit(pokemon) {
	const hasContrary = pokemon.hasAbility('contrary');
	if ((!hasContrary && pokemon.boosts.spe === 6) || (hasContrary && pokemon.boosts.spe === -6)) {
	return false;
	}
	},
	boosts: {
	spe: 2,
	},
	onHit(pokemon) {
	if (pokemon.weighthg > 1) {
	pokemon.weighthg = Math.max(1, pokemon.weighthg - 1000);
	this.add('-start', pokemon, 'Autotomize');
	}
	},
secondary:	secondary: null,
target:	target: "self",
type: "Steel",	type: "Steel",
	},
	
behemothbash: {	behemothbash: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Behemoth Bash",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, failcopycat: 1, failmimic: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
behemothblade: {	behemothblade: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Behemoth Blade",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1, failcopycat: 1, failmimic: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
bulletpunch: {	bulletpunch: {
accuracy:	accuracy: 90,
basePower:	basePower: 45,
category:	category: "Physical",
	name: "Bullet Punch",
	pp: 1.25,
priority:	priority: 1,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
corkscrewcrash: {	corkscrewcrash: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "Corkscrew Crash",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
doomdesire: {	doomdesire: {
accuracy:	accuracy: 95,
basePower:	basePower: 140,
category:	category: "Special",
	name: "Doom Desire",
	pp: 1.25,
priority:	priority: 0,
	flags: {futuremove: 1},
	onTry(source, target) {
	if (!target.side.addSlotCondition(target, 'futuremove')) return false;
	Object.assign(target.side.slotConditions[target.position]['futuremove'], {
	move: 'doomdesire',
	source: source,
	moveData: {
	id: 'doomdesire',
name: "Doom Desire",	name: "Doom Desire",
accuracy:	accuracy: 95,
basePower:	basePower: 140,
category:	category: "Special",
priority:	priority: 0,
	flags: {futuremove: 1},
	effectType: 'Move',
type: 'Steel',	type: 'Steel',
	},
	});
	this.add('-start', source, 'Doom Desire');
	return this.NOT_FAIL;
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
doubleironbash: {	doubleironbash: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Double Iron Bash",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
	multihit: 2,
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
flashcannon: {	flashcannon: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Flash Cannon",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	boosts: {
	spd: -1,
	},
	},
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
geargrind: {	geargrind: {
accuracy:	accuracy: 85,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Gear Grind",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	multihit: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
gearup: {	gearup: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Gear Up",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, bypasssub: 1},
	onHitSide(side, source, move) {
	const targets = side.allies().filter(target => (
	target.hasAbility(['plus', 'minus']) &&
	(!target.volatiles['maxguard'] || this.runEvent('TryHit', target, source, move))
	));
	if (!targets.length) return false;
	let didSomething = false;
	for (const target of targets) {
	didSomething = this.boost({atk: 1, spa: 1}, target, source, move, false, true) || didSomething;
	}
	return didSomething;
	},
secondary:	secondary: null,
target:	target: "allySide",
type: "Steel",	type: "Steel",
	},
	
gigatonhammer: {	gigatonhammer: {
accuracy:	accuracy: 95,
basePower:	basePower: 160,
category:	category: "Physical",
	name: "Gigaton Hammer",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onDisableMove(pokemon) {
	if (pokemon.lastMove?.id === 'gigatonhammer') pokemon.disableMove('gigatonhammer');
	},
	beforeMoveCallback(pokemon) {
	if (pokemon.lastMove?.id === 'gigatonhammer') pokemon.addVolatile('gigatonhammer');
	},
	onAfterMove(pokemon) {
	if (pokemon.removeVolatile('gigatonhammer')) {
	this.add('-hint', "Some effects can force a Pokemon to use Gigaton Hammer again in a row.");
	}
	},
	condition: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
gyroball: {	gyroball: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon, target) {
	let power = Math.floor(25 * target.getStat('spe') / pokemon.getStat('spe')) + 1;
	if (!isFinite(power)) power = 1;
	if (power > 150) power = 150;
	this.debug('BP: ' + power);
	return power;
	},
category:	category: "Physical",
	name: "Gyro Ball",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
heavyslam: {	heavyslam: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	basePowerCallback(pokemon, target) {
	const targetWeight = target.getWeight();
	const pokemonWeight = pokemon.getWeight();
	let bp;
	if (pokemonWeight >= targetWeight * 5) {
	bp = 120;
	} else if (pokemonWeight >= targetWeight * 4) {
	bp = 100;
	} else if (pokemonWeight >= targetWeight * 3) {
	bp = 80;
	} else if (pokemonWeight >= targetWeight * 2) {
	bp = 60;
	} else {
	bp = 40;
	}
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Physical",
	name: "Heavy Slam",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
	onTryHit(target, pokemon, move) {
	if (target.volatiles['dynamax']) {
	this.add('-fail', pokemon, 'Dynamax');
	this.attrLastMove('[still]');
	return null;
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
irondefense: {	irondefense: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Iron Defense",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	def: 2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Steel",	type: "Steel",
	},
	
ironhead: {	ironhead: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Iron Head",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
irontail: {	irontail: {
accuracy:	accuracy: 75,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Iron Tail",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	boosts: {
	def: -1,
	},
	},
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
kingsshield: {	kingsshield: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "King's Shield",
	pp: 1.25,
priority:	priority: 4,
	flags: {noassist: 1, failcopycat: 1, failinstruct: 1},
	stallingMove: true,
	volatileStatus: 'kingsshield',
	onPrepareHit(pokemon) {
	return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
	},
	onHit(pokemon) {
	pokemon.addVolatile('stall');
	},
	condition: {
	duration: 1,
	onStart(target) {
	this.add('-singleturn', target, 'Protect');
	},
	onTryHitPriority: 3,
	onTryHit(target, source, move) {
	if (!move.flags['protect'] || move.category === 'Status') {
	if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
	if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
	return;
	}
	if (move.smartTarget) {
	move.smartTarget = false;
	} else {
	this.add('-activate', target, 'move: Protect');
	}
	const lockedmove = source.getVolatile('lockedmove');
	if (lockedmove) {
	// Outrage counter is reset
	if (source.volatiles['lockedmove'].duration === 2) {
	delete source.volatiles['lockedmove'];
	}
	}
	if (this.checkMoveMakesContact(move, source, target)) {
	this.boost({atk: -1}, source, target, this.dex.getActiveMove("King's Shield"));
	}
	return this.NOT_FAIL;
	},
	onHit(target, source, move) {
	if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
	this.boost({atk: -1}, source, target, this.dex.getActiveMove("King's Shield"));
	}
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Steel",	type: "Steel",
	},
	
magnetbomb: {	magnetbomb: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Magnet Bomb",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
makeitrain: {	makeitrain: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Special",
	name: "Make It Rain",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	self: {
	boosts: {
	spa: -1,
	},
	},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Steel",	type: "Steel",
	},
	
metalburst: {	metalburst: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
	damageCallback(pokemon) {
	const lastDamagedBy = pokemon.getLastDamagedBy(true);
	if (lastDamagedBy !== undefined) {
	return (lastDamagedBy.damage * 1.5) || 1;
	}
	return 0;
	},
category:	category: "Physical",
	name: "Metal Burst",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, failmefirst: 1},
	onTry(source) {
	const lastDamagedBy = source.getLastDamagedBy(true);
	if (lastDamagedBy === undefined || !lastDamagedBy.thisTurn) return false;
	},
	onModifyTarget(targetRelayVar, source, target, move) {
	const lastDamagedBy = source.getLastDamagedBy(true);
	if (lastDamagedBy) {
	targetRelayVar.target = this.getAtSlot(lastDamagedBy.slot);
	}
	},
secondary:	secondary: null,
target:	target: "scripted",
type: "Steel",	type: "Steel",
	},
	
metalclaw: {	metalclaw: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Physical",
	name: "Metal Claw",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	self: {
	boosts: {
	atk: 1,
	},
	},
	},
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
metalsound: {	metalsound: {
accuracy:	accuracy: 85,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Metal Sound",
	pp: 125,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, allyanim: 1},
	boosts: {
	spd: -2,
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
meteormash: {	meteormash: {
accuracy:	accuracy: 90,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Meteor Mash",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
secondary:	secondary: {
	chance: 20,
	self: {
	boosts: {
	atk: 1,
	},
	},
	},
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
mirrorshot: {	mirrorshot: {
accuracy:	accuracy: 85,
basePower:	basePower: 65,
category:	category: "Special",
	name: "Mirror Shot",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
boosts: {	boosts: {
accuracy:	accuracy: -1,
	},
	},
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
searingsunrazesmash: {	searingsunrazesmash: {
accuracy:	accuracy: 95,
basePower:	basePower: 200,
category:	category: "Physical",
	name: "Searing Sunraze Smash",
	pp: 1,
priority:	priority: 0,
	flags: {contact: 1},
	ignoreAbility: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
shelter: {	shelter: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Shelter",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	def: 2,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Steel",	type: "Steel",
	},
	
shiftgear: {	shiftgear: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Shift Gear",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	spe: 2,
	atk: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Steel",	type: "Steel",
	},
	
smartstrike: {	smartstrike: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Smart Strike",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
spinout: {	spinout: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Spin Out",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	self: {
	boosts: {
	spe: -2,
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
steelbeam: {	steelbeam: {
accuracy:	accuracy: 95,
basePower:	basePower: 140,
category:	category: "Special",
	name: "Steel Beam",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	mindBlownRecoil: true,
	onAfterMove(pokemon, target, move) {
	if (move.mindBlownRecoil && !move.multihit) {
	const hpBeforeRecoil = pokemon.hp;
	this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Steel Beam'), true);
	if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
	this.runEvent('EmergencyExit', pokemon, pokemon);
	}
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
steelroller: {	steelroller: {
accuracy:	accuracy: 95,
basePower:	basePower: 130,
category:	category: "Physical",
	name: "Steel Roller",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	onTry() {
	return !this.field.isTerrain('');
	},
	onHit() {
	this.field.clearTerrain();
	},
	onAfterSubDamage() {
	this.field.clearTerrain();
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
steelwing: {	steelwing: {
accuracy:	accuracy: 90,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Steel Wing",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	self: {
	boosts: {
	def: 1,
	},
	},
	},
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
sunsteelstrike: {	sunsteelstrike: {
accuracy:	accuracy: 95,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Sunsteel Strike",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	ignoreAbility: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Steel",	type: "Steel",
	},
	
aquacutter: {	aquacutter: {
accuracy:	accuracy: 95,
basePower:	basePower: 70,
category:	category: "Physical",
	name: "Aqua Cutter",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, slicing: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
aquajet: {	aquajet: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Physical",
	name: "Aqua Jet",
	pp: 1.25,
priority:	priority: 1,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
aquaring: {	aquaring: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Aqua Ring",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1},
	volatileStatus: 'aquaring',
	condition: {
	onStart(pokemon) {
	this.add('-start', pokemon, 'Aqua Ring');
	},
	onResidualOrder: 6,
	onResidual(pokemon) {
	this.heal(pokemon.baseMaxhp / 16);
	},
	},
secondary:	secondary: null,
target:	target: "self",
type: "Water",	type: "Water",
	},
	
aquastep: {	aquastep: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Aqua Step",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, dance: 1},
secondary:	secondary: {
	chance: 100,
	self: {
	boosts: {
	spe: 1,
	},
	},
	},
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
aquatail: {	aquatail: {
accuracy:	accuracy: 90,
basePower:	basePower: 90,
category:	category: "Physical",
	name: "Aqua Tail",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
bouncybubble: {	bouncybubble: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Special",
	name: "Bouncy Bubble",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, heal: 1},
	drain: [1, 2],
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
brine: {	brine: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Special",
	name: "Brine",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	onBasePower(basePower, pokemon, target) {
	if (target.hp * 2 <= target.maxhp) {
	return this.chainModify(2);
	}
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
bubble: {	bubble: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Special",
	name: "Bubble",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	boosts: {
	spe: -1,
	},
	},
target:	target: "allAdjacentFoes",
type: "Water",	type: "Water",
	},
	
bubblebeam: {	bubblebeam: {
accuracy:	accuracy: 95,
basePower:	basePower: 65,
category:	category: "Special",
	name: "Bubble Beam",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 10,
	boosts: {
	spe: -1,
	},
	},
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
chillingwater: {	chillingwater: {
accuracy:	accuracy: 95,
basePower:	basePower: 50,
category:	category: "Special",
	name: "Chilling Water",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 100,
	boosts: {
	atk: -1,
	},
	},
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
clamp: {	clamp: {
accuracy:	accuracy: 85,
basePower:	basePower: 35,
category:	category: "Physical",
	name: "Clamp",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	volatileStatus: 'partiallytrapped',
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
crabhammer: {	crabhammer: {
accuracy:	accuracy: 90,
basePower:	basePower: 100,
category:	category: "Physical",
	name: "Crabhammer",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
critRatio:	critRatio: 2,
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
dive: {	dive: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Dive",
	pp: 1.25,
priority:	priority: 0,
	flags: {
	contact: 1, charge: 1, protect: 1, mirror: 1, nonsky: 1, allyanim: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1,
	},
	onTryMove(attacker, defender, move) {
	if (attacker.removeVolatile(move.id)) {
	return;
	}
	if (attacker.hasAbility('gulpmissile') && attacker.species.name === 'Cramorant' && !attacker.transformed) {
	const forme = attacker.hp <= attacker.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
	attacker.formeChange(forme, move);
	}
	this.add('-prepare', attacker, move.name);
	if (!this.runEvent('ChargeMove', attacker, defender, move)) {
	return;
	}
	attacker.addVolatile('twoturnmove', defender);
	return null;
	},
	condition: {
	duration: 2,
	onImmunity(type, pokemon) {
	if (type === 'sandstorm' || type === 'hail') return false;
	},
	onInvulnerability(target, source, move) {
	if (['surf', 'whirlpool'].includes(move.id)) {
	return;
	}
	return false;
	},
	onSourceModifyDamage(damage, source, target, move) {
	if (move.id === 'surf' || move.id === 'whirlpool') {
	return this.chainModify(2);
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
fishiousrend: {	fishiousrend: {
accuracy:	accuracy: 95,
basePower:	basePower: 85,
	basePowerCallback(pokemon, target, move) {
	if (target.newlySwitched || this.queue.willMove(target)) {
	this.debug('Fishious Rend damage boost');
	return move.basePower * 2;
	}
	this.debug('Fishious Rend NOT boosted');
	return move.basePower;
	},
category:	category: "Physical",
	name: "Fishious Rend",
	pp: 1.25,
priority:	priority: 0,
	flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
flipturn: {	flipturn: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Flip Turn",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	selfSwitch: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
hydrocannon: {	hydrocannon: {
accuracy:	accuracy: 90,
basePower:	basePower: 150,
category:	category: "Special",
	name: "Hydro Cannon",
	pp: 1.25,
priority:	priority: 0,
	flags: {recharge: 1, protect: 1, mirror: 1},
	self: {
	volatileStatus: 'mustrecharge',
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
hydropump: {	hydropump: {
accuracy:	accuracy: 80,
basePower:	basePower: 110,
category:	category: "Special",
	name: "Hydro Pump",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
hydrosteam: {	hydrosteam: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Hydro Steam",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, defrost: 1},
	// Damage boost in Sun applied in conditions.ts
	thawsTarget: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
hydrovortex: {	hydrovortex: {
accuracy:	accuracy: 95,
basePower:	basePower: 1,
category:	category: "Physical",
	name: "Hydro Vortex",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
jetpunch: {	jetpunch: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Physical",
	name: "Jet Punch",
	pp: 1.25,
priority:	priority: 1,
	flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
secondary:	secondary: null,
	hasSheerForce: true,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
lifedew: {	lifedew: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Life Dew",
	pp: 1.25,
priority:	priority: 0,
	flags: {snatch: 1, heal: 1, bypasssub: 1},
	heal: [1, 4],
secondary:	secondary: null,
target:	target: "allies",
type: "Water",	type: "Water",
	},
	
liquidation: {	liquidation: {
accuracy:	accuracy: 95,
basePower:	basePower: 85,
category:	category: "Physical",
	name: "Liquidation",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 20,
	boosts: {
	def: -1,
	},
	},
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
muddywater: {	muddywater: {
accuracy:	accuracy: 85,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Muddy Water",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1},
secondary:	secondary: {
	chance: 30,
boosts: {	boosts: {
accuracy:	accuracy: -1,
	},
	},
target:	target: "allAdjacentFoes",
type: "Water",	type: "Water",
	},
	
oceanicoperetta: {	oceanicoperetta: {
accuracy:	accuracy: 95,
basePower:	basePower: 195,
category:	category: "Special",
	name: "Oceanic Operetta",
	pp: 1,
priority:	priority: 0,
	flags: {},
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
octazooka: {	octazooka: {
accuracy:	accuracy: 85,
basePower:	basePower: 65,
category:	category: "Special",
	name: "Octazooka",
	pp: 1.25,
priority:	priority: 0,
	flags: {bullet: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 50,
boosts: {	boosts: {
accuracy:	accuracy: -1,
	},
	},
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
originpulse: {	originpulse: {
accuracy:	accuracy: 85,
basePower:	basePower: 110,
category:	category: "Special",
	name: "Origin Pulse",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, pulse: 1, mirror: 1},
target:	target: "allAdjacentFoes",
type: "Water",	type: "Water",
	},
	
raindance: {	raindance: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Rain Dance",
	pp: 1.25,
priority:	priority: 0,
	flags: {},
	weather: 'RainDance',
secondary:	secondary: null,
target:	target: "all",
type: "Water",	type: "Water",
	},
	
razorshell: {	razorshell: {
accuracy:	accuracy: 95,
basePower:	basePower: 75,
category:	category: "Physical",
	name: "Razor Shell",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
secondary:	secondary: {
	chance: 50,
	boosts: {
	def: -1,
	},
	},
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
scald: {	scald: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Scald",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, defrost: 1},
	thawsTarget: true,
secondary:	secondary: {
	chance: 30,
	status: 'brn',
	},
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
snipeshot: {	snipeshot: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Special",
	name: "Snipe Shot",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
critRatio:	critRatio: 2,
	tracksTarget: true,
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
soak: {	soak: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Soak",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
	onHit(target) {
	if (target.getTypes().join() === 'Water' || !target.setType('Water')) {
	// Soak should animate even when it fails.
	// Returning false would suppress the animation.
	this.add('-fail', target);
	return null;
	}
	this.add('-start', target, 'typechange', 'Water');
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
sparklingaria: {	sparklingaria: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Sparkling Aria",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1},
secondary:	secondary: {
	dustproof: true,
	chance: 100,
	volatileStatus: 'sparklingaria',
	},
	onAfterMove(source, target, move) {
	for (const pokemon of this.getAllActive()) {
	if (pokemon !== source && pokemon.removeVolatile('sparklingaria') && pokemon.status === 'brn' && !source.fainted) {
	pokemon.cureStatus();
	}
	}
	},
target:	target: "allAdjacent",
type: "Water",	type: "Water",
	},
	
splishysplash: {	splishysplash: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Splishy Splash",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 30,
	status: 'par',
	},
target:	target: "allAdjacentFoes",
type: "Water",	type: "Water",
	},
	
steameruption: {	steameruption: {
accuracy:	accuracy: 95,
basePower:	basePower: 110,
category:	category: "Special",
	name: "Steam Eruption",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, defrost: 1},
	thawsTarget: true,
secondary:	secondary: {
	chance: 30,
	status: 'brn',
	},
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
surf: {	surf: {
accuracy:	accuracy: 95,
basePower:	basePower: 90,
category:	category: "Special",
	name: "Surf",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1},
secondary:	secondary: null,
target:	target: "allAdjacent",
type: "Water",	type: "Water",
	},
	
surgingstrikes: {	surgingstrikes: {
accuracy:	accuracy: 95,
basePower:	basePower: 25,
category:	category: "Physical",
	name: "Surging Strikes",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, punch: 1, mirror: 1},
	willCrit: true,
	multihit: 3,
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
tripledive: {	tripledive: {
accuracy:	accuracy: 95,
basePower:	basePower: 30,
category:	category: "Physical",
	name: "Triple Dive",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	multihit: 3,
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
waterfall: {	waterfall: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
category:	category: "Physical",
	name: "Waterfall",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
secondary:	secondary: {
	chance: 20,
	volatileStatus: 'flinch',
	},
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
watergun: {	watergun: {
accuracy:	accuracy: 95,
basePower:	basePower: 40,
category:	category: "Special",
	name: "Water Gun",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
waterpledge: {	waterpledge: {
accuracy:	accuracy: 95,
basePower:	basePower: 80,
	basePowerCallback(target, source, move) {
	if (['firepledge', 'grasspledge'].includes(move.sourceEffect)) {
	this.add('-combine');
	return 150;
	}
	return 80;
	},
category:	category: "Special",
	name: "Water Pledge",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1, nonsky: 1, pledgecombo: 1},
	onPrepareHit(target, source, move) {
	for (const action of this.queue) {
	if (action.choice !== 'move') continue;
	const otherMove = action.move;
	const otherMoveUser = action.pokemon;
	if (
	!otherMove || !action.pokemon || !otherMoveUser.isActive ||
	otherMoveUser.fainted || action.maxMove || action.zmove
	) {
	continue;
	}
	if (otherMoveUser.isAlly(source) && ['firepledge', 'grasspledge'].includes(otherMove.id)) {
	this.queue.prioritizeAction(action, move);
	this.add('-waiting', source, otherMoveUser);
	return null;
	}
	}
	},
	onModifyMove(move) {
	if (move.sourceEffect === 'grasspledge') {
	move.type = 'Grass';
	move.forceSTAB = true;
	move.sideCondition = 'grasspledge';
	}
	if (move.sourceEffect === 'firepledge') {
	move.type = 'Water';
	move.forceSTAB = true;
	move.self = {sideCondition: 'waterpledge'};
	}
	},
	condition: {
	duration: 4,
	onSideStart(targetSide) {
	this.add('-sidestart', targetSide, 'Water Pledge');
	},
	onSideResidualOrder: 26,
	onSideResidualSubOrder: 7,
	onSideEnd(targetSide) {
	this.add('-sideend', targetSide, 'Water Pledge');
	},
	onModifyMove(move, pokemon) {
	if (move.secondaries && move.id !== 'secretpower') {
	this.debug('doubling secondary chance');
	for (const secondary of move.secondaries) {
	if (pokemon.hasAbility('serenegrace') && secondary.volatileStatus === 'flinch') continue;
	if (secondary.chance) secondary.chance *= 2;
	}
	if (move.self?.chance) move.self.chance *= 2;
	}
	},
	},
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
waterpulse: {	waterpulse: {
accuracy:	accuracy: 95,
basePower:	basePower: 60,
category:	category: "Special",
	name: "Water Pulse",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, pulse: 1, mirror: 1, distance: 1},
secondary:	secondary: {
	chance: 20,
	volatileStatus: 'confusion',
	},
target:	target: "any",
type: "Water",	type: "Water",
	},
	
watershuriken: {	watershuriken: {
accuracy:	accuracy: 95,
basePower:	basePower: 15,
	basePowerCallback(pokemon, target, move) {
	if (pokemon.species.name === 'Greninja-Ash' && pokemon.hasAbility('battlebond') &&
	!pokemon.transformed) {
	return move.basePower + 5;
	}
	return move.basePower;
	},
category:	category: "Special",
	name: "Water Shuriken",
	pp: 1.25,
priority:	priority: 1,
	flags: {protect: 1, mirror: 1},
	multihit: [2, 5],
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
watersport: {	watersport: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Water Sport",
	pp: 1.25,
priority:	priority: 0,
	flags: {nonsky: 1},
	pseudoWeather: 'watersport',
	condition: {
	duration: 5,
	onFieldStart(field, source) {
	this.add('-fieldstart', 'move: Water Sport', '[of] ' + source);
	},
	onBasePowerPriority: 1,
	onBasePower(basePower, attacker, defender, move) {
	if (move.type === 'Fire') {
	this.debug('water sport weaken');
	return this.chainModify([1352, 4096]);
	}
	},
	onFieldResidualOrder: 27,
	onFieldResidualSubOrder: 3,
	onFieldEnd() {
	this.add('-fieldend', 'move: Water Sport');
	},
	},
secondary:	secondary: null,
target:	target: "all",
type: "Water",	type: "Water",
	},
	
waterspout: {	waterspout: {
accuracy:	accuracy: 95,
basePower:	basePower: 150,
	basePowerCallback(pokemon, target, move) {
	const bp = move.basePower * pokemon.hp / pokemon.maxhp;
	this.debug('BP: ' + bp);
	return bp;
	},
category:	category: "Special",
	name: "Water Spout",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
secondary:	secondary: null,
target:	target: "allAdjacentFoes",
type: "Water",	type: "Water",
	},
	
wavecrash: {	wavecrash: {
accuracy:	accuracy: 95,
basePower:	basePower: 120,
category:	category: "Physical",
	name: "Wave Crash",
	pp: 1.25,
priority:	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1},
	recoil: [33, 100],
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
whirlpool: {	whirlpool: {
accuracy:	accuracy: 85,
basePower:	basePower: 35,
category:	category: "Special",
	name: "Whirlpool",
	pp: 1.25,
priority:	priority: 0,
	flags: {protect: 1, mirror: 1},
	volatileStatus: 'partiallytrapped',
secondary:	secondary: null,
target:	target: "normal",
type: "Water",	type: "Water",
	},
	
withdraw: {	withdraw: {
accuracy:	accuracy: 95,
basePower:	basePower: 0,
category:	category: "Status",
	name: "Withdraw",
	pp: 125,
priority:	priority: 0,
	flags: {snatch: 1},
	boosts: {
	def: 1,
	},
secondary:	secondary: null,
target:	target: "self",
type: "Water",	type: "Water",
	},
	
	};