export const Items: {[itemid: string]: ItemData} = {

abilityshield: {
name: "Ability Shield",
spritenum: 0, // TODO
ignoreKlutz: true,
// Neutralizing Gas protection implemented in Pokemon.ignoringAbility() within sim/pokemon.ts
// and in Neutralizing Gas itself within data/abilities.ts
onSetAbility(ability, target, source, effect) {
if (effect && effect.effectType === 'Ability' && effect.name !== 'Trace') {
this.add('-ability', source, effect);
}
this.add('-block', target, 'item: Ability Shield');
return null;
},
// Mold Breaker protection implemented in Battle.suppressingAbility() within sim/battle.ts
num: 1881,
gen: 9,
},

absorbbulb: {
name: "Absorb Bulb",
spritenum: 2,
fling: {
basePower: 30,
},
onDamagingHit(damage, target, source, move) {
if (move.type === 'Water') {
target.useItem();
}
},
boosts: {
spa: 1,
},
num: 545,
gen: 5,
},

adamantcrystal: {
name: "Adamant Crystal",
spritenum: 4, // TODO
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (user.baseSpecies.num === 483 && (move.type === 'Steel' || move.type === 'Dragon')) {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if (source?.baseSpecies.num === 483 || pokemon.baseSpecies.num === 483) {
return false;
}
return true;
},
forcedForme: "Dialga-Origin",
itemUser: ["Dialga-Origin"],
num: 1777,
gen: 8,
isNonstandard: "Unobtainable",
},

adamantorb: {
name: "Adamant Orb",
spritenum: 4,
fling: {
basePower: 60,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (user.baseSpecies.num === 483 && (move.type === 'Steel' || move.type === 'Dragon')) {
return this.chainModify([4915, 4096]);
}
},
itemUser: ["Dialga"],
num: 135,
gen: 4,
isNonstandard: "Unobtainable",
},

adrenalineorb: {
name: "Adrenaline Orb",
spritenum: 660,
fling: {
basePower: 30,
},
onAfterBoost(boost, target, source, effect) {
// Adrenaline Orb activates if Intimidate is blocked by an ability like Hyper Cutter,
// which deletes boost.atk,
// but not if the holder's attack is already at -6 (or +6 if it has Contrary),
// which sets boost.atk to 0
if (target.boosts['spe'] === 6 || boost.atk === 0) {
return;
}
if (effect.name === 'Intimidate') {
target.useItem();
}
},
boosts: {
spe: 1,
},
num: 846,
gen: 7,
},

aguavberry: {
name: "Aguav Berry",
spritenum: 5,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Dragon",
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
pokemon.eatItem();
}
},
onTryEatItem(item, pokemon) {
if (!this.runEvent('TryHeal', pokemon)) return false;
},
onEat(pokemon) {
this.heal(pokemon.baseMaxhp / 3);
if (pokemon.getNature().minus === 'spd') {
pokemon.addVolatile('confusion');
}
},
num: 162,
gen: 3,
},

airballoon: {
name: "Air Balloon",
spritenum: 6,
fling: {
basePower: 10,
},
onStart(target) {
if (!target.ignoringItem() && !this.field.getPseudoWeather('gravity')) {
this.add('-item', target, 'Air Balloon');
}
},
// airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
onDamagingHit(damage, target, source, move) {
this.add('-enditem', target, 'Air Balloon');
target.item = '';
target.itemState = {id: '', target};
this.runEvent('AfterUseItem', target, null, null, this.dex.items.get('airballoon'));
},
onAfterSubDamage(damage, target, source, effect) {
this.debug('effect: ' + effect.id);
if (effect.effectType === 'Move') {
this.add('-enditem', target, 'Air Balloon');
target.item = '';
target.itemState = {id: '', target};
this.runEvent('AfterUseItem', target, null, null, this.dex.items.get('airballoon'));
}
},
num: 541,
gen: 5,
},

apicotberry: {
name: "Apicot Berry",
spritenum: 10,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Ground",
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
pokemon.eatItem();
}
},
onEat(pokemon) {
this.boost({spd: 1});
},
num: 205,
gen: 3,
},

armorfossil: {
name: "Armor Fossil",
spritenum: 12,
fling: {
basePower: 100,
},
num: 104,
gen: 4,
isNonstandard: "Past",
},

aspearberry: {
name: "Aspear Berry",
spritenum: 13,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Ice",
},
onUpdate(pokemon) {
if (pokemon.status === 'frz') {
pokemon.eatItem();
}
},
onEat(pokemon) {
if (pokemon.status === 'frz') {
pokemon.cureStatus();
}
},
num: 153,
gen: 3,
},

assaultvest: {
name: "Assault Vest",
spritenum: 581,
fling: {
basePower: 80,
},
onModifySpDPriority: 1,
onModifySpD(spd) {
return this.chainModify(1.5);
},
onDisableMove(pokemon) {
for (const moveSlot of pokemon.moveSlots) {
if (this.dex.moves.get(moveSlot.move).category === 'Status') {
pokemon.disableMove(moveSlot.id);
}
}
},
num: 640,
gen: 6,
},

auspiciousarmor: {
name: "Auspicious Armor",
spritenum: 0, // TODO
num: 2344,
gen: 9,
},

babiriberry: {
name: "Babiri Berry",
spritenum: 17,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Steel",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Steel' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 199,
gen: 4,
},

belueberry: {
name: "Belue Berry",
spritenum: 21,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Electric",
},
onEat: false,
num: 183,
gen: 3,
isNonstandard: "Past",
},

berryjuice: {
name: "Berry Juice",
spritenum: 22,
fling: {
basePower: 30,
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 2) {
if (this.runEvent('TryHeal', pokemon) && pokemon.useItem()) {
this.heal(20);
}
}
},
num: 43,
gen: 2,
isNonstandard: "Past",
},

berrysweet: {
name: "Berry Sweet",
spritenum: 706,
fling: {
basePower: 10,
},
num: 1111,
gen: 8,
isNonstandard: "Past",
},

bigroot: {
name: "Big Root",
spritenum: 29,
fling: {
basePower: 10,
},
onTryHealPriority: 1,
onTryHeal(damage, target, source, effect) {
const heals = ['drain', 'leechseed', 'ingrain', 'aquaring', 'strengthsap'];
if (heals.includes(effect.id)) {
return this.chainModify([5324, 4096]);
}
},
num: 296,
gen: 4,
},

bindingband: {
name: "Binding Band",
spritenum: 31,
fling: {
basePower: 30,
},
// implemented in statuses
num: 544,
gen: 5,
},

blackbelt: {
name: "Black Belt",
spritenum: 32,
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Fighting') {
return this.chainModify([4915, 4096]);
}
},
num: 241,
gen: 2,
},

blackglasses: {
name: "Black Glasses",
spritenum: 35,
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Dark') {
return this.chainModify([4915, 4096]);
}
},
num: 240,
gen: 2,
},

blacksludge: {
name: "Black Sludge",
spritenum: 34,
fling: {
basePower: 30,
},
onResidualOrder: 5,
onResidualSubOrder: 4,
onResidual(pokemon) {
if (pokemon.hasType('Poison')) {
this.heal(pokemon.baseMaxhp / 16);
} else {
this.damage(pokemon.baseMaxhp / 8);
}
},
num: 281,
gen: 4,
},

blueorb: {
name: "Blue Orb",
spritenum: 41,
onSwitchIn(pokemon) {
if (pokemon.isActive && pokemon.baseSpecies.name === 'Kyogre') {
this.queue.insertChoice({choice: 'runPrimal', pokemon: pokemon});
}
},
onPrimal(pokemon) {
pokemon.formeChange('Kyogre-Primal', this.effect, true);
},
onTakeItem(item, source) {
if (source.baseSpecies.baseSpecies === 'Kyogre') return false;
return true;
},
itemUser: ["Kyogre"],
num: 535,
gen: 6,
isNonstandard: "Past",
},

blukberry: {
name: "Bluk Berry",
spritenum: 44,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Fire",
},
onEat: false,
num: 165,
gen: 3,
isNonstandard: "Past",
},

blunderpolicy: {
name: "Blunder Policy",
spritenum: 716,
fling: {
basePower: 80,
},
// Item activation located in scripts.js
num: 1121,
gen: 8,
},

boosterenergy: {
name: "Booster Energy",
spritenum: 0, // TODO
onUpdate(pokemon) {
if (pokemon.transformed) return;
if (this.queue.peek(true)?.choice === 'runSwitch') return;

if (pokemon.hasAbility('protosynthesis') && !this.field.isWeather('sunnyday') && pokemon.useItem()) {
pokemon.addVolatile('protosynthesis');
}
if (pokemon.hasAbility('quarkdrive') && !this.field.isTerrain('electricterrain') && pokemon.useItem()) {
pokemon.addVolatile('quarkdrive');
}
},
onTakeItem(item, source) {
if (source.baseSpecies.tags.includes("Paradox")) return false;
return true;
},
num: 1880,
gen: 9,
},

bottlecap: {
name: "Bottle Cap",
spritenum: 696,
fling: {
basePower: 30,
},
num: 795,
gen: 7,
},

brightpowder: {
name: "Bright Powder",
spritenum: 51,
fling: {
basePower: 10,
},
onModifyAccuracyPriority: -2,
onModifyAccuracy(accuracy) {
if (typeof accuracy !== 'number') return;
this.debug('brightpowder - decreasing accuracy');
return this.chainModify([3686, 4096]);
},
num: 213,
gen: 2,
},

cellbattery: {
name: "Cell Battery",
spritenum: 60,
fling: {
basePower: 30,
},
onDamagingHit(damage, target, source, move) {
if (move.type === 'Electric') {
target.useItem();
}
},
boosts: {
atk: 1,
},
num: 546,
gen: 5,
},

charcoal: {
name: "Charcoal",
spritenum: 61,
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Fire') {
return this.chainModify([4915, 4096]);
}
},
num: 249,
gen: 2,
},

chartiberry: {
name: "Charti Berry",
spritenum: 62,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Rock",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Rock' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 195,
gen: 4,
},

cheriberry: {
name: "Cheri Berry",
spritenum: 63,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Fire",
},
onUpdate(pokemon) {
if (pokemon.status === 'par') {
pokemon.eatItem();
}
},
onEat(pokemon) {
if (pokemon.status === 'par') {
pokemon.cureStatus();
}
},
num: 149,
gen: 3,
},

chestoberry: {
name: "Chesto Berry",
spritenum: 65,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Water",
},
onUpdate(pokemon) {
if (pokemon.status === 'slp') {
pokemon.eatItem();
}
},
onEat(pokemon) {
if (pokemon.status === 'slp') {
pokemon.cureStatus();
}
},
num: 150,
gen: 3,
},

chilanberry: {
name: "Chilan Berry",
spritenum: 66,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Normal",
},
onSourceModifyDamage(damage, source, target, move) {
if (
move.type === 'Normal' &&
(!target.volatiles['substitute'] || move.flags['bypasssub'] || (move.infiltrates && this.gen >= 6))
) {
if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 200,
gen: 4,
},

choiceband: {
name: "Choice Band",
spritenum: 68,
fling: {
basePower: 10,
},
onStart(pokemon) {
if (pokemon.volatiles['choicelock']) {
this.debug('removing choicelock: ' + pokemon.volatiles['choicelock']);
}
pokemon.removeVolatile('choicelock');
},
onModifyMove(move, pokemon) {
pokemon.addVolatile('choicelock');
},
onModifyAtkPriority: 1,
onModifyAtk(atk, pokemon) {
if (pokemon.volatiles['dynamax']) return;
return this.chainModify(1.5);
},
isChoice: true,
num: 220,
gen: 3,
},

choicescarf: {
name: "Choice Scarf",
spritenum: 69,
fling: {
basePower: 10,
},
onStart(pokemon) {
if (pokemon.volatiles['choicelock']) {
this.debug('removing choicelock: ' + pokemon.volatiles['choicelock']);
}
pokemon.removeVolatile('choicelock');
},
onModifyMove(move, pokemon) {
pokemon.addVolatile('choicelock');
},
onModifySpe(spe, pokemon) {
if (pokemon.volatiles['dynamax']) return;
return this.chainModify(1.5);
},
isChoice: true,
num: 287,
gen: 4,
},

choicespecs: {
name: "Choice Specs",
spritenum: 70,
fling: {
basePower: 10,
},
onStart(pokemon) {
if (pokemon.volatiles['choicelock']) {
this.debug('removing choicelock: ' + pokemon.volatiles['choicelock']);
}
pokemon.removeVolatile('choicelock');
},
onModifyMove(move, pokemon) {
pokemon.addVolatile('choicelock');
},
onModifySpAPriority: 1,
onModifySpA(spa, pokemon) {
if (pokemon.volatiles['dynamax']) return;
return this.chainModify(1.5);
},
isChoice: true,
num: 297,
gen: 4,
},

chopleberry: {
name: "Chople Berry",
spritenum: 71,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Fighting",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Fighting' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 189,
gen: 4,
},

clawfossil: {
name: "Claw Fossil",
spritenum: 72,
fling: {
basePower: 100,
},
num: 100,
gen: 3,
isNonstandard: "Past",
},

clearamulet: {
name: "Clear Amulet",
spritenum: 0, // TODO
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
this.add('-fail', target, 'unboost', '[from] item: Clear Amulet', '[of] ' + target);
}
},
num: 1882,
gen: 9,
},

cloversweet: {
name: "Clover Sweet",
spritenum: 707,
fling: {
basePower: 10,
},
num: 1112,
gen: 8,
isNonstandard: "Past",
},

cobaberry: {
name: "Coba Berry",
spritenum: 76,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Flying",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Flying' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 192,
gen: 4,
},

colburberry: {
name: "Colbur Berry",
spritenum: 78,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Dark",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Dark' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 198,
gen: 4,
},

cornnberry: {
name: "Cornn Berry",
spritenum: 81,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Bug",
},
onEat: false,
num: 175,
gen: 3,
isNonstandard: "Past",
},

coverfossil: {
name: "Cover Fossil",
spritenum: 85,
fling: {
basePower: 100,
},
num: 572,
gen: 5,
isNonstandard: "Past",
},

covertcloak: {
name: "Covert Cloak",
fling: {
basePower: 10,
},
spritenum: 0, // TODO
onModifySecondaries(secondaries) {
this.debug('Covert Cloak prevent secondary');
return secondaries.filter(effect => !!(effect.self || effect.dustproof));
},
num: 1885,
gen: 9,
},

crackedpot: {
name: "Cracked Pot",
spritenum: 719,
fling: {
basePower: 80,
},
num: 1253,
gen: 8,
},

custapberry: {
name: "Custap Berry",
spritenum: 86,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Ghost",
},
onFractionalPriorityPriority: -2,
onFractionalPriority(priority, pokemon) {
if (
priority <= 0 &&
(pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony))
) {
if (pokemon.eatItem()) {
this.add('-activate', pokemon, 'item: Custap Berry', '[consumed]');
return 0.1;
}
}
},
onEat() { },
num: 210,
gen: 4,
isNonstandard: "Unobtainable",
},

deepseascale: {
name: "Deep Sea Scale",
spritenum: 93,
fling: {
basePower: 30,
},
onModifySpDPriority: 2,
onModifySpD(spd, pokemon) {
if (pokemon.baseSpecies.name === 'Clamperl') {
return this.chainModify(2);
}
},
itemUser: ["Clamperl"],
num: 227,
gen: 3,
isNonstandard: "Past",
},

deepseatooth: {
name: "Deep Sea Tooth",
spritenum: 94,
fling: {
basePower: 90,
},
onModifySpAPriority: 1,
onModifySpA(spa, pokemon) {
if (pokemon.baseSpecies.name === 'Clamperl') {
return this.chainModify(2);
}
},
itemUser: ["Clamperl"],
num: 226,
gen: 3,
isNonstandard: "Past",
},

destinyknot: {
name: "Destiny Knot",
spritenum: 95,
fling: {
basePower: 10,
},
onAttractPriority: -100,
onAttract(target, source) {
this.debug('attract intercepted: ' + target + ' from ' + source);
if (!source || source === target) return;
if (!source.volatiles['attract']) source.addVolatile('attract', target);
},
num: 280,
gen: 4,
},

dracoplate: {
name: "Draco Plate",
spritenum: 105,
onPlate: 'Dragon',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Dragon') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Dragon",
num: 311,
gen: 4,
isNonstandard: "Unobtainable",
},

dragonfang: {
name: "Dragon Fang",
spritenum: 106,
fling: {
basePower: 70,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Dragon') {
return this.chainModify([4915, 4096]);
}
},
num: 250,
gen: 2,
},

dragonscale: {
name: "Dragon Scale",
spritenum: 108,
fling: {
basePower: 30,
},
num: 235,
gen: 2,
isNonstandard: "Past",
},

dreadplate: {
name: "Dread Plate",
spritenum: 110,
onPlate: 'Dark',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Dark') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Dark",
num: 312,
gen: 4,
isNonstandard: "Unobtainable",
},

dubiousdisc: {
name: "Dubious Disc",
spritenum: 113,
fling: {
basePower: 50,
},
num: 324,
gen: 4,
isNonstandard: "Past",
},

durinberry: {
name: "Durin Berry",
spritenum: 114,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Water",
},
onEat: false,
num: 182,
gen: 3,
isNonstandard: "Past",
},

earthplate: {
name: "Earth Plate",
spritenum: 117,
onPlate: 'Ground',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Ground') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Ground",
num: 305,
gen: 4,
isNonstandard: "Unobtainable",
},

ejectbutton: {
name: "Eject Button",
spritenum: 118,
fling: {
basePower: 30,
},
onAfterMoveSecondaryPriority: 2,
onAfterMoveSecondary(target, source, move) {
if (source && source !== target && target.hp && move && move.category !== 'Status' && !move.flags['futuremove']) {
if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.beingCalledBack || target.isSkyDropped()) return;
if (target.volatiles['commanding'] || target.volatiles['commanded']) return;
for (const pokemon of this.getAllActive()) {
if (pokemon.switchFlag === true) return;
}
target.switchFlag = true;
if (target.useItem()) {
source.switchFlag = false;
} else {
target.switchFlag = false;
}
}
},
num: 547,
gen: 5,
},

ejectpack: {
name: "Eject Pack",
spritenum: 714,
fling: {
basePower: 50,
},
onAfterBoost(boost, target, source, effect) {
if (this.activeMove?.id === 'partingshot') return;
let eject = false;
let i: BoostID;
for (i in boost) {
if (boost[i]! < 0) {
eject = true;
}
}
if (eject) {
if (target.hp) {
if (!this.canSwitch(target.side)) return;
if (target.volatiles['commanding'] || target.volatiles['commanded']) return;
for (const pokemon of this.getAllActive()) {
if (pokemon.switchFlag === true) return;
}
if (target.useItem()) target.switchFlag = true;
}
}
},
num: 1119,
gen: 8,
},

electirizer: {
name: "Electirizer",
spritenum: 119,
fling: {
basePower: 80,
},
num: 322,
gen: 4,
isNonstandard: "Past",
},

electricseed: {
name: "Electric Seed",
spritenum: 664,
fling: {
basePower: 10,
},
onStart(pokemon) {
if (!pokemon.ignoringItem() && this.field.isTerrain('electricterrain')) {
pokemon.useItem();
}
},
onTerrainChange(pokemon) {
if (this.field.isTerrain('electricterrain')) {
pokemon.useItem();
}
},
boosts: {
def: 1,
},
num: 881,
gen: 7,
},

enigmaberry: {
name: "Enigma Berry",
spritenum: 124,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Bug",
},
onHit(target, source, move) {
if (move && target.getMoveHitData(move).typeMod > 0) {
if (target.eatItem()) {
this.heal(target.baseMaxhp / 4);
}
}
},
onTryEatItem(item, pokemon) {
if (!this.runEvent('TryHeal', pokemon)) return false;
},
onEat() { },
num: 208,
gen: 3,
isNonstandard: "Unobtainable",
},

eviolite: {
name: "Eviolite",
spritenum: 130,
fling: {
basePower: 40,
},
onModifyDefPriority: 2,
onModifyDef(def, pokemon) {
if (pokemon.baseSpecies.nfe) {
return this.chainModify(1.55);
}
},
onModifySpDPriority: 2,
onModifySpD(spd, pokemon) {
if (pokemon.baseSpecies.nfe) {
return this.chainModify(1.55);
}
},
num: 538,
gen: 5,
},

expertbelt: {
name: "Expert Belt",
spritenum: 132,
fling: {
basePower: 10,
},
onModifyDamage(damage, source, target, move) {
if (move && target.getMoveHitData(move).typeMod > 0) {
return this.chainModify([4915, 4096]);
}
},
num: 268,
gen: 4,
},

figyberry: {
name: "Figy Berry",
spritenum: 140,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Bug",
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
pokemon.eatItem();
}
},
onTryEatItem(item, pokemon) {
if (!this.runEvent('TryHeal', pokemon)) return false;
},
onEat(pokemon) {
this.heal(pokemon.baseMaxhp / 3);
if (pokemon.getNature().minus === 'atk') {
pokemon.addVolatile('confusion');
}
},
num: 159,
gen: 3,
},

fistplate: {
name: "Fist Plate",
spritenum: 143,
onPlate: 'Fighting',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Fighting') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Fighting",
num: 303,
gen: 4,
isNonstandard: "Unobtainable",
},

flameorb: {
name: "Flame Orb",
spritenum: 145,
fling: {
basePower: 30,
status: 'brn',
},
onResidualOrder: 28,
onResidualSubOrder: 3,
onResidual(pokemon) {
pokemon.trySetStatus('brn', pokemon);
},
num: 273,
gen: 4,
},

flameplate: {
name: "Flame Plate",
spritenum: 146,
onPlate: 'Fire',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Fire') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Fire",
num: 298,
gen: 4,
isNonstandard: "Unobtainable",
},

floatstone: {
name: "Float Stone",
spritenum: 147,
fling: {
basePower: 30,
},
onModifyWeight(weighthg) {
return this.trunc(weighthg / 2);
},
num: 539,
gen: 5,
},

flowersweet: {
name: "Flower Sweet",
spritenum: 708,
fling: {
basePower: 0,
},
num: 1113,
gen: 8,
isNonstandard: "Past",
},

focusband: {
name: "Focus Band",
spritenum: 150,
fling: {
basePower: 10,
},
onDamagePriority: -40,
onDamage(damage, target, source, effect) {
if (this.randomChance(1, 10) && damage >= target.hp && effect && effect.effectType === 'Move') {
this.add("-activate", target, "item: Focus Band");
return target.hp - 1;
}
},
num: 230,
gen: 2,
},

focussash: {
name: "Focus Sash",
spritenum: 151,
fling: {
basePower: 10,
},
onDamagePriority: -40,
onDamage(damage, target, source, effect) {
if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
if (target.useItem()) {
return target.hp - 1;
}
}
},
num: 275,
gen: 4,
},

fossilizedbird: {
name: "Fossilized Bird",
spritenum: 700,
fling: {
basePower: 100,
},
num: 1105,
gen: 8,
isNonstandard: "Past",
},

fossilizeddino: {
name: "Fossilized Dino",
spritenum: 703,
fling: {
basePower: 100,
},
num: 1108,
gen: 8,
isNonstandard: "Past",
},

fossilizeddrake: {
name: "Fossilized Drake",
spritenum: 702,
fling: {
basePower: 100,
},
num: 1107,
gen: 8,
isNonstandard: "Past",
},

fossilizedfish: {
name: "Fossilized Fish",
spritenum: 701,
fling: {
basePower: 100,
},
num: 1106,
gen: 8,
isNonstandard: "Past",
},

fullincense: {
name: "Full Incense",
spritenum: 155,
fling: {
basePower: 10,
},
onFractionalPriority: -0.1,
num: 316,
gen: 4,
isNonstandard: "Past",
},

galaricacuff: {
name: "Galarica Cuff",
spritenum: 739,
fling: {
basePower: 30,
},
num: 1582,
gen: 8,
isNonstandard: "Unobtainable",
},

galaricawreath: {
name: "Galarica Wreath",
spritenum: 740,
fling: {
basePower: 30,
},
num: 1592,
gen: 8,
isNonstandard: "Unobtainable",
},

ganlonberry: {
name: "Ganlon Berry",
spritenum: 158,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Ice",
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
pokemon.eatItem();
}
},
onEat(pokemon) {
this.boost({def: 1});
},
num: 202,
gen: 3,
},

goldbottlecap: {
name: "Gold Bottle Cap",
spritenum: 697,
fling: {
basePower: 30,
},
num: 796,
gen: 7,
},

grassyseed: {
name: "Grassy Seed",
spritenum: 667,
fling: {
basePower: 10,
},
onStart(pokemon) {
if (!pokemon.ignoringItem() && this.field.isTerrain('grassyterrain')) {
pokemon.useItem();
}
},
onTerrainChange(pokemon) {
if (this.field.isTerrain('grassyterrain')) {
pokemon.useItem();
}
},
boosts: {
def: 1,
},
num: 884,
gen: 7,
},

grepaberry: {
name: "Grepa Berry",
spritenum: 178,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Flying",
},
onEat: false,
num: 173,
gen: 3,
},

gripclaw: {
name: "Grip Claw",
spritenum: 179,
fling: {
basePower: 90,
},
// implemented in statuses
num: 286,
gen: 4,
},

griseouscore: {
name: "Griseous Core",
spritenum: 180, // TODO
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (user.baseSpecies.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if (source?.baseSpecies.num === 487 || pokemon.baseSpecies.num === 487) {
return false;
}
return true;
},
forcedForme: "Giratina-Origin",
itemUser: ["Giratina-Origin"],
num: 1779,
gen: 8,
isNonstandard: "Unobtainable",
},

griseousorb: {
name: "Griseous Orb",
spritenum: 180,
fling: {
basePower: 60,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (user.baseSpecies.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) {
return this.chainModify([4915, 4096]);
}
},
itemUser: ["Giratina"],
num: 112,
gen: 4,
isNonstandard: "Unobtainable",
},

habanberry: {
name: "Haban Berry",
spritenum: 185,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Dragon",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Dragon' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 197,
gen: 4,
},

hardstone: {
name: "Hard Stone",
spritenum: 187,
fling: {
basePower: 100,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Rock') {
return this.chainModify([4915, 4096]);
}
},
num: 238,
gen: 2,
},

heatrock: {
name: "Heat Rock",
spritenum: 193,
fling: {
basePower: 60,
},
num: 284,
gen: 4,
},

heavydutyboots: {
name: "Heavy-Duty Boots",
spritenum: 715,
fling: {
basePower: 80,
},
num: 1120,
gen: 8,
// Hazard Immunity implemented in moves.ts
},

helixfossil: {
name: "Helix Fossil",
spritenum: 195,
fling: {
basePower: 100,
},
num: 101,
gen: 3,
isNonstandard: "Past",
},

hondewberry: {
name: "Hondew Berry",
spritenum: 213,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Ground",
},
onEat: false,
num: 172,
gen: 3,
},

iapapaberry: {
name: "Iapapa Berry",
spritenum: 217,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Dark",
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
pokemon.eatItem();
}
},
onTryEatItem(item, pokemon) {
if (!this.runEvent('TryHeal', pokemon)) return false;
},
onEat(pokemon) {
this.heal(pokemon.baseMaxhp / 3);
if (pokemon.getNature().minus === 'def') {
pokemon.addVolatile('confusion');
}
},
num: 163,
gen: 3,
},

icicleplate: {
name: "Icicle Plate",
spritenum: 220,
onPlate: 'Ice',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Ice') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Ice",
num: 302,
gen: 4,
isNonstandard: "Unobtainable",
},

icyrock: {
name: "Icy Rock",
spritenum: 221,
fling: {
basePower: 40,
},
num: 282,
gen: 4,
},

insectplate: {
name: "Insect Plate",
spritenum: 223,
onPlate: 'Bug',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Bug') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Bug",
num: 308,
gen: 4,
isNonstandard: "Unobtainable",
},

ironball: {
name: "Iron Ball",
spritenum: 224,
fling: {
basePower: 130,
},
onEffectiveness(typeMod, target, type, move) {
if (!target) return;
if (target.volatiles['ingrain'] || target.volatiles['smackdown'] || this.field.getPseudoWeather('gravity')) return;
if (move.type === 'Ground' && target.hasType('Flying')) return 0;
},
// airborneness negation implemented in sim/pokemon.js:Pokemon#isGrounded
onModifySpe(spe) {
return this.chainModify(0.5);
},
num: 278,
gen: 4,
},

ironplate: {
name: "Iron Plate",
spritenum: 225,
onPlate: 'Steel',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Steel') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Steel",
num: 313,
gen: 4,
isNonstandard: "Unobtainable",
},

jabocaberry: {
name: "Jaboca Berry",
spritenum: 230,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Dragon",
},
onDamagingHit(damage, target, source, move) {
if (move.category === 'Physical' && source.hp && source.isActive && !source.hasAbility('magicguard')) {
if (target.eatItem()) {
this.damage(source.baseMaxhp / (target.hasAbility('ripen') ? 4 : 8), source, target);
}
}
},
onEat() { },
num: 211,
gen: 4,
isNonstandard: "Unobtainable",
},

jawfossil: {
name: "Jaw Fossil",
spritenum: 694,
fling: {
basePower: 100,
},
num: 710,
gen: 6,
isNonstandard: "Past",
},

kasibberry: {
name: "Kasib Berry",
spritenum: 233,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Ghost",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Ghost' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 196,
gen: 4,
},

kebiaberry: {
name: "Kebia Berry",
spritenum: 234,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Poison",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Poison' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 190,
gen: 4,
},

keeberry: {
name: "Kee Berry",
spritenum: 593,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Fairy",
},
onAfterMoveSecondary(target, source, move) {
if (move.category === 'Physical') {
if (move.id === 'present' && move.heal) return;
target.eatItem();
}
},
onEat(pokemon) {
this.boost({def: 1});
},
num: 687,
gen: 6,
isNonstandard: "Unobtainable",
},

kelpsyberry: {
name: "Kelpsy Berry",
spritenum: 235,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Fighting",
},
onEat: false,
num: 170,
gen: 3,
},

kingsrock: {
name: "King's Rock",
spritenum: 236,
fling: {
basePower: 30,
volatileStatus: 'flinch',
},
onModifyMovePriority: -1,
onModifyMove(move) {
if (move.category !== "Status") {
if (!move.secondaries) move.secondaries = [];
for (const secondary of move.secondaries) {
if (secondary.volatileStatus === 'flinch') return;
}
move.secondaries.push({
chance: 10,
volatileStatus: 'flinch',
});
}
},
num: 221,
gen: 2,
},

laggingtail: {
name: "Lagging Tail",
spritenum: 237,
fling: {
basePower: 10,
},
onFractionalPriority: -0.1,
num: 279,
gen: 4,
},

lansatberry: {
name: "Lansat Berry",
spritenum: 238,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Flying",
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
pokemon.eatItem();
}
},
onEat(pokemon) {
pokemon.addVolatile('focusenergy');
},
num: 206,
gen: 3,
},

laxincense: {
name: "Lax Incense",
spritenum: 240,
fling: {
basePower: 10,
},
onModifyAccuracyPriority: -2,
onModifyAccuracy(accuracy) {
if (typeof accuracy !== 'number') return;
this.debug('lax incense - decreasing accuracy');
return this.chainModify([3686, 4096]);
},
num: 255,
gen: 3,
isNonstandard: "Past",
},

leek: {
name: "Leek",
fling: {
basePower: 60,
},
spritenum: 475,
onModifyCritRatio(critRatio, user) {
if (["farfetchd", "sirfetchd"].includes(this.toID(user.baseSpecies.baseSpecies))) {
return critRatio + 2;
}
},
itemUser: ["Farfetch\u2019d", "Farfetch\u2019d-Galar", "Sirfetch\u2019d"],
num: 259,
gen: 8,
isNonstandard: "Past",
},

leftovers: {
name: "Leftovers",
spritenum: 242,
fling: {
basePower: 10,
},
onResidualOrder: 5,
onResidualSubOrder: 4,
onResidual(pokemon) {
this.heal(pokemon.baseMaxhp / 16);
},
num: 234,
gen: 2,
},

leppaberry: {
name: "Leppa Berry",
spritenum: 244,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Fighting",
},
onUpdate(pokemon) {
if (!pokemon.hp) return;
if (pokemon.moveSlots.some(move => move.pp === 0)) {
pokemon.eatItem();
}
},
onEat(pokemon) {
const moveSlot = pokemon.moveSlots.find(move => move.pp === 0) ||
pokemon.moveSlots.find(move => move.pp < move.maxpp);
if (!moveSlot) return;
moveSlot.pp += 10;
if (moveSlot.pp > moveSlot.maxpp) moveSlot.pp = moveSlot.maxpp;
this.add('-activate', pokemon, 'item: Leppa Berry', moveSlot.move, '[consumed]');
},
num: 154,
gen: 3,
},

liechiberry: {
name: "Liechi Berry",
spritenum: 248,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Grass",
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
pokemon.eatItem();
}
},
onEat(pokemon) {
this.boost({atk: 1});
},
num: 201,
gen: 3,
},

lifeorb: {
name: "Life Orb",
spritenum: 249,
fling: {
basePower: 30,
},
onModifyDamage(damage, source, target, move) {
return this.chainModify([5324, 4096]);
},
onAfterMoveSecondarySelf(source, target, move) {
if (source && source !== target && move && move.category !== 'Status' && !source.forceSwitchFlag) {
this.damage(source.baseMaxhp / 10, source, source, this.dex.items.get('lifeorb'));
}
},
num: 270,
gen: 4,
},

lightball: {
name: "Light Ball",
spritenum: 251,
fling: {
basePower: 30,
status: 'par',
},
onModifyAtkPriority: 1,
onModifyAtk(atk, pokemon) {
if (pokemon.baseSpecies.baseSpecies === 'Pikachu') {
return this.chainModify(2);
}
},
onModifySpAPriority: 1,
onModifySpA(spa, pokemon) {
if (pokemon.baseSpecies.baseSpecies === 'Pikachu') {
return this.chainModify(2);
}
},
itemUser: ["Pikachu", "Pikachu-Cosplay", "Pikachu-Rock-Star", "Pikachu-Belle", "Pikachu-Pop-Star", "Pikachu-PhD", "Pikachu-Libre", "Pikachu-Original", "Pikachu-Hoenn", "Pikachu-Sinnoh", "Pikachu-Unova", "Pikachu-Kalos", "Pikachu-Alola", "Pikachu-Partner", "Pikachu-Starter", "Pikachu-World"],
num: 236,
gen: 2,
},

lightclay: {
name: "Light Clay",
spritenum: 252,
fling: {
basePower: 30,
},
// implemented in the corresponding thing
num: 269,
gen: 4,
},

loadeddice: {
name: "Loaded Dice",
spritenum: 0, // TODO
// partially implemented in sim/battle-actions.ts:BattleActions#hitStepMoveHitLoop
onModifyMove(move) {
if (move.multiaccuracy) {
delete move.multiaccuracy;
}
},
num: 1886,
gen: 9,
},

lovesweet: {
name: "Love Sweet",
spritenum: 705,
fling: {
basePower: 10,
},
num: 1110,
gen: 8,
isNonstandard: "Past",
},

luckypunch: {
name: "Lucky Punch",
spritenum: 261,
fling: {
basePower: 40,
},
onModifyCritRatio(critRatio, user) {
if (user.baseSpecies.name === 'Chansey') {
return critRatio + 2;
}
},
itemUser: ["Chansey"],
num: 256,
gen: 2,
isNonstandard: "Past",
},

lumberry: {
name: "Lum Berry",
spritenum: 262,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Flying",
},
onAfterSetStatusPriority: -1,
onAfterSetStatus(status, pokemon) {
pokemon.eatItem();
},
onUpdate(pokemon) {
if (pokemon.status || pokemon.volatiles['confusion']) {
pokemon.eatItem();
}
},
onEat(pokemon) {
pokemon.cureStatus();
pokemon.removeVolatile('confusion');
},
num: 157,
gen: 3,
},

luminousmoss: {
name: "Luminous Moss",
spritenum: 595,
fling: {
basePower: 30,
},
onDamagingHit(damage, target, source, move) {
if (move.type === 'Water') {
target.useItem();
}
},
boosts: {
spd: 1,
},
num: 648,
gen: 6,
},

lustrousglobe: {
name: "Lustrous Globe",
spritenum: 265, // TODO
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (user.baseSpecies.num === 484 && (move.type === 'Water' || move.type === 'Dragon')) {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if (source?.baseSpecies.num === 484 || pokemon.baseSpecies.num === 484) {
return false;
}
return true;
},
forcedForme: "Palkia-Origin",
itemUser: ["Palkia-Origin"],
num: 1778,
gen: 8,
isNonstandard: "Unobtainable",
},

lustrousorb: {
name: "Lustrous Orb",
spritenum: 265,
fling: {
basePower: 60,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (user.baseSpecies.num === 484 && (move.type === 'Water' || move.type === 'Dragon')) {
return this.chainModify([4915, 4096]);
}
},
itemUser: ["Palkia"],
num: 136,
gen: 4,
isNonstandard: "Unobtainable",
},

machobrace: {
name: "Macho Brace",
spritenum: 269,
ignoreKlutz: true,
fling: {
basePower: 60,
},
onModifySpe(spe) {
return this.chainModify(0.5);
},
num: 215,
gen: 3,
isNonstandard: "Past",
},

magmarizer: {
name: "Magmarizer",
spritenum: 272,
fling: {
basePower: 80,
},
num: 323,
gen: 4,
isNonstandard: "Past",
},

magnet: {
name: "Magnet",
spritenum: 273,
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Electric') {
return this.chainModify([4915, 4096]);
}
},
num: 242,
gen: 2,
},

magoberry: {
name: "Mago Berry",
spritenum: 274,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Ghost",
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
pokemon.eatItem();
}
},
onTryEatItem(item, pokemon) {
if (!this.runEvent('TryHeal', pokemon)) return false;
},
onEat(pokemon) {
this.heal(pokemon.baseMaxhp / 3);
if (pokemon.getNature().minus === 'spe') {
pokemon.addVolatile('confusion');
}
},
num: 161,
gen: 3,
},

magostberry: {
name: "Magost Berry",
spritenum: 275,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Rock",
},
onEat: false,
num: 176,
gen: 3,
isNonstandard: "Past",
},

mail: {
name: "Mail",
spritenum: 403,
onTakeItem(item, source) {
if (!this.activeMove) return false;
if (this.activeMove.id !== 'knockoff' && this.activeMove.id !== 'thief' && this.activeMove.id !== 'covet') return false;
},
num: 137,
gen: 2,
isNonstandard: "Past",
},

maliciousarmor: {
name: "Malicious Armor",
spritenum: 0, // TODO
num: 1861,
gen: 9,
},

marangaberry: {
name: "Maranga Berry",
spritenum: 597,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Dark",
},
onAfterMoveSecondary(target, source, move) {
if (move.category === 'Special') {
target.eatItem();
}
},
onEat(pokemon) {
this.boost({spd: 1});
},
num: 688,
gen: 6,
isNonstandard: "Unobtainable",
},

meadowplate: {
name: "Meadow Plate",
spritenum: 282,
onPlate: 'Grass',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Grass') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Grass",
num: 301,
gen: 4,
isNonstandard: "Unobtainable",
},

mentalherb: {
name: "Mental Herb",
spritenum: 285,
fling: {
basePower: 10,
effect(pokemon) {
const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'];
for (const firstCondition of conditions) {
if (pokemon.volatiles[firstCondition]) {
for (const secondCondition of conditions) {
pokemon.removeVolatile(secondCondition);
if (firstCondition === 'attract' && secondCondition === 'attract') {

}
}
return;
}
}
},
},
onUpdate(pokemon) {
const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'];
for (const firstCondition of conditions) {
if (pokemon.volatiles[firstCondition]) {
if (!pokemon.useItem()) return;
for (const secondCondition of conditions) {
pokemon.removeVolatile(secondCondition);
if (firstCondition === 'attract' && secondCondition === 'attract') {
this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
}
}
return;
}
}
},
num: 219,
gen: 3,
},

metalcoat: {
name: "Metal Coat",
spritenum: 286,
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Steel') {
return this.chainModify([4915, 4096]);
}
},
num: 233,
gen: 2,
},

metalpowder: {
name: "Metal Powder",
fling: {
basePower: 10,
},
spritenum: 287,
onModifyDefPriority: 2,
onModifyDef(def, pokemon) {
if (pokemon.species.name === 'Ditto' && !pokemon.transformed) {
return this.chainModify(2);
}
},
itemUser: ["Ditto"],
num: 257,
gen: 2,
isNonstandard: "Past",
},

metronome: {
name: "Metronome",
spritenum: 289,
fling: {
basePower: 30,
},
onStart(pokemon) {
pokemon.addVolatile('metronome');
},
condition: {
onStart(pokemon) {
this.effectState.lastMove = '';
this.effectState.numConsecutive = 0;
},
onTryMovePriority: -2,
onTryMove(pokemon, target, move) {
if (!pokemon.hasItem('metronome')) {
pokemon.removeVolatile('metronome');
return;
}
if (this.effectState.lastMove === move.id && pokemon.moveLastTurnResult) {
this.effectState.numConsecutive++;
} else if (pokemon.volatiles['twoturnmove']) {
if (this.effectState.lastMove !== move.id) {
this.effectState.numConsecutive = 1;
} else {
this.effectState.numConsecutive++;
}
} else {
this.effectState.numConsecutive = 0;
}
this.effectState.lastMove = move.id;
},
onModifyDamage(damage, source, target, move) {
const dmgMod = [4096, 4915, 5734, 6553, 7372, 8192];
const numConsecutive = this.effectState.numConsecutive > 5 ? 5 : this.effectState.numConsecutive;
this.debug(`Current Metronome boost: ${dmgMod[numConsecutive]}/4096`);
return this.chainModify([dmgMod[numConsecutive], 4096]);
},
},
num: 277,
gen: 4,
},

micleberry: {
name: "Micle Berry",
spritenum: 290,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Rock",
},
onResidual(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
pokemon.eatItem();
}
},
onEat(pokemon) {
pokemon.addVolatile('micleberry');
},
condition: {
duration: 2,
onSourceAccuracy(accuracy, target, source, move) {
if (!move.ohko) {
this.add('-enditem', source, 'Micle Berry');
source.removeVolatile('micleberry');
if (typeof accuracy === 'number') {
return this.chainModify([4915, 4096]);
}
}
},
},
num: 209,
gen: 4,
isNonstandard: "Unobtainable",
},

mindplate: {
name: "Mind Plate",
spritenum: 291,
onPlate: 'Psychic',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Psychic') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Psychic",
num: 307,
gen: 4,
isNonstandard: "Unobtainable",
},

miracleseed: {
name: "Miracle Seed",
fling: {
basePower: 30,
},
spritenum: 292,
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Grass') {
return this.chainModify([4915, 4096]);
}
},
num: 239,
gen: 2,
},

mirrorherb: {
name: "Mirror Herb",
fling: {
basePower: 10,
},
spritenum: 0, // TODO
onFoeAfterBoost(boost, target, source, effect) {
if (effect?.name === 'Opportunist' || effect?.name === 'Mirror Herb') return;
const boostPlus: SparseBoostsTable = {};
let statsRaised = false;
let i: BoostID;
for (i in boost) {
if (boost[i]! > 0) {
boostPlus[i] = boost[i];
statsRaised = true;
}
}
if (!statsRaised) return;
const pokemon: Pokemon = this.effectState.target;
pokemon.useItem();
this.boost(boostPlus, pokemon);
},
num: 1883,
gen: 9,
},

mistyseed: {
name: "Misty Seed",
spritenum: 666,
fling: {
basePower: 10,
},
onStart(pokemon) {
if (!pokemon.ignoringItem() && this.field.isTerrain('mistyterrain')) {
pokemon.useItem();
}
},
onTerrainChange(pokemon) {
if (this.field.isTerrain('mistyterrain')) {
pokemon.useItem();
}
},
boosts: {
spd: 1,
},
num: 883,
gen: 7,
},

muscleband: {
name: "Muscle Band",
spritenum: 297,
fling: {
basePower: 10,
},
onBasePowerPriority: 16,
onBasePower(basePower, user, target, move) {
if (move.category === 'Physical') {
return this.chainModify([4505, 4096]);
}
},
num: 266,
gen: 4,
},

mysticwater: {
name: "Mystic Water",
spritenum: 300,
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Water') {
return this.chainModify([4915, 4096]);
}
},
num: 243,
gen: 2,
},

nanabberry: {
name: "Nanab Berry",
spritenum: 302,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Water",
},
onEat: false,
num: 166,
gen: 3,
isNonstandard: "Past",
},

nevermeltice: {
name: "Never-Melt Ice",
spritenum: 305,
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Ice') {
return this.chainModify([4915, 4096]);
}
},
num: 246,
gen: 2,
},

nomelberry: {
name: "Nomel Berry",
spritenum: 306,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Dragon",
},
onEat: false,
num: 178,
gen: 3,
isNonstandard: "Past",
},

occaberry: {
name: "Occa Berry",
spritenum: 311,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Fire",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Fire' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 184,
gen: 4,
},

oddincense: {
name: "Odd Incense",
spritenum: 312,
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Psychic') {
return this.chainModify([4915, 4096]);
}
},
num: 314,
gen: 4,
isNonstandard: "Past",
},

oldamber: {
name: "Old Amber",
spritenum: 314,
fling: {
basePower: 100,
},
num: 103,
gen: 3,
isNonstandard: "Past",
},

oranberry: {
name: "Oran Berry",
spritenum: 319,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Poison",
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 2) {
pokemon.eatItem();
}
},
onTryEatItem(item, pokemon) {
if (!this.runEvent('TryHeal', pokemon)) return false;
},
onEat(pokemon) {
this.heal(10);
},
num: 155,
gen: 3,
},

pamtreberry: {
name: "Pamtre Berry",
spritenum: 323,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Steel",
},
onEat: false,
num: 180,
gen: 3,
isNonstandard: "Past",
},

passhoberry: {
name: "Passho Berry",
spritenum: 329,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Water",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Water' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 185,
gen: 4,
},

payapaberry: {
name: "Payapa Berry",
spritenum: 330,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Psychic",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Psychic' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 193,
gen: 4,
},

pechaberry: {
name: "Pecha Berry",
spritenum: 333,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Electric",
},
onUpdate(pokemon) {
if (pokemon.status === 'psn' || pokemon.status === 'tox') {
pokemon.eatItem();
}
},
onEat(pokemon) {
if (pokemon.status === 'psn' || pokemon.status === 'tox') {
pokemon.cureStatus();
}
},
num: 151,
gen: 3,
},

persimberry: {
name: "Persim Berry",
spritenum: 334,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Ground",
},
onUpdate(pokemon) {
if (pokemon.volatiles['confusion']) {
pokemon.eatItem();
}
},
onEat(pokemon) {
pokemon.removeVolatile('confusion');
},
num: 156,
gen: 3,
},

petayaberry: {
name: "Petaya Berry",
spritenum: 335,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Poison",
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
pokemon.eatItem();
}
},
onEat(pokemon) {
this.boost({spa: 1});
},
num: 204,
gen: 3,
},

pinapberry: {
name: "Pinap Berry",
spritenum: 337,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Grass",
},
onEat: false,
num: 168,
gen: 3,
isNonstandard: "Past",
},

whippeddream: {
name: "Whipped Dream",
spritenum: 610,
onPlate: 'Fairy',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Fairy') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Fairy",
num: 644,
gen: 6,
isNonstandard: "Unobtainable",
},

plumefossil: {
name: "Plume Fossil",
spritenum: 339,
fling: {
basePower: 100,
},
num: 573,
gen: 5,
isNonstandard: "Past",
},

poisonbarb: {
name: "Poison Barb",
spritenum: 343,
fling: {
basePower: 70,
status: 'psn',
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Poison') {
return this.chainModify([4915, 4096]);
}
},
num: 245,
gen: 2,
},

pomegberry: {
name: "Pomeg Berry",
spritenum: 351,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Ice",
},
onEat: false,
num: 169,
gen: 3,
},

poweranklet: {
name: "Power Anklet",
spritenum: 354,
ignoreKlutz: true,
fling: {
basePower: 70,
},
onModifySpe(spe) {
return this.chainModify(0.5);
},
num: 293,
gen: 4,
},

powerband: {
name: "Power Band",
spritenum: 355,
ignoreKlutz: true,
fling: {
basePower: 70,
},
onModifySpe(spe) {
return this.chainModify(0.5);
},
num: 292,
gen: 4,
},

powerbelt: {
name: "Power Belt",
spritenum: 356,
ignoreKlutz: true,
fling: {
basePower: 70,
},
onModifySpe(spe) {
return this.chainModify(0.5);
},
num: 290,
gen: 4,
},

powerbracer: {
name: "Power Bracer",
spritenum: 357,
ignoreKlutz: true,
fling: {
basePower: 70,
},
onModifySpe(spe) {
return this.chainModify(0.5);
},
num: 289,
gen: 4,
},

powerherb: {
onChargeMove(pokemon, target, move) {
if (pokemon.useItem()) {
this.debug('power herb - remove charge turn for ' + move.id);
this.attrLastMove('[still]');
this.addMove('-anim', pokemon, move.name, target);
return false; // skip charge turn
}
},
name: "Power Herb",
spritenum: 358,
fling: {
basePower: 10,
},
num: 271,
gen: 4,
},

powerlens: {
name: "Power Lens",
spritenum: 359,
ignoreKlutz: true,
fling: {
basePower: 70,
},
onModifySpe(spe) {
return this.chainModify(0.5);
},
num: 291,
gen: 4,
},

powerweight: {
name: "Power Weight",
spritenum: 360,
ignoreKlutz: true,
fling: {
basePower: 70,
},
onModifySpe(spe) {
return this.chainModify(0.5);
},
num: 294,
gen: 4,
},

prismscale: {
name: "Prism Scale",
spritenum: 365,
fling: {
basePower: 30,
},
num: 537,
gen: 5,
isNonstandard: "Past",
},

protectivepads: {
name: "Protective Pads",
spritenum: 663,
fling: {
basePower: 30,
},
// protective effect handled in Battle#checkMoveMakesContact
num: 880,
gen: 7,
},

protector: {
name: "Protector",
spritenum: 367,
fling: {
basePower: 80,
},
num: 321,
gen: 4,
isNonstandard: "Past",
},

psychicseed: {
name: "Psychic Seed",
spritenum: 665,
fling: {
basePower: 10,
},
onStart(pokemon) {
if (!pokemon.ignoringItem() && this.field.isTerrain('psychicterrain')) {
pokemon.useItem();
}
},
onTerrainChange(pokemon) {
if (this.field.isTerrain('psychicterrain')) {
pokemon.useItem();
}
},
boosts: {
spd: 1,
},
num: 882,
gen: 7,
},

punchingglove: {
name: "Punching Glove",
spritenum: 0, // TODO
onBasePowerPriority: 23,
onBasePower(basePower, attacker, defender, move) {
if (move.flags['punch']) {
this.debug('Punching Glove boost');
return this.chainModify([4506, 4096]);
}
},
onModifyMovePriority: 1,
onModifyMove(move) {
if (move.flags['punch']) delete move.flags['contact'];
},
num: 1884,
gen: 9,
},

qualotberry: {
name: "Qualot Berry",
spritenum: 371,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Poison",
},
onEat: false,
num: 171,
gen: 3,
},

quickclaw: {
onFractionalPriorityPriority: -2,
onFractionalPriority(priority, pokemon, target, move) {
if (move.category === "Status" && pokemon.hasAbility("myceliummight")) return;
if (priority <= 0 && this.randomChance(1, 5)) {
this.add('-activate', pokemon, 'item: Quick Claw');
return 0.1;
}
},
name: "Quick Claw",
spritenum: 373,
fling: {
basePower: 80,
},
num: 217,
gen: 2,
},

quickpowder: {
name: "Quick Powder",
spritenum: 374,
fling: {
basePower: 10,
},
onModifySpe(spe, pokemon) {
if (pokemon.species.name === 'Ditto' && !pokemon.transformed) {
return this.chainModify(2);
}
},
itemUser: ["Ditto"],
num: 274,
gen: 4,
isNonstandard: "Past",
},

rabutaberry: {
name: "Rabuta Berry",
spritenum: 375,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Ghost",
},
onEat: false,
num: 177,
gen: 3,
isNonstandard: "Past",
},

rarebone: {
name: "Rare Bone",
spritenum: 379,
fling: {
basePower: 100,
},
num: 106,
gen: 4,
},

rawstberry: {
name: "Rawst Berry",
spritenum: 381,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Grass",
},
onUpdate(pokemon) {
if (pokemon.status === 'brn') {
pokemon.eatItem();
}
},
onEat(pokemon) {
if (pokemon.status === 'brn') {
pokemon.cureStatus();
}
},
num: 152,
gen: 3,
},

razorclaw: {
name: "Razor Claw",
spritenum: 382,
fling: {
basePower: 80,
},
onModifyCritRatio(critRatio) {
return critRatio + 1;
},
num: 326,
gen: 4,
},

razorfang: {
name: "Razor Fang",
spritenum: 383,
fling: {
basePower: 30,
volatileStatus: 'flinch',
},
onModifyMovePriority: -1,
onModifyMove(move) {
if (move.category !== "Status") {
if (!move.secondaries) move.secondaries = [];
for (const secondary of move.secondaries) {
if (secondary.volatileStatus === 'flinch') return;
}
move.secondaries.push({
chance: 10,
volatileStatus: 'flinch',
});
}
},
num: 327,
gen: 4,
isNonstandard: "Past",
},

razzberry: {
name: "Razz Berry",
spritenum: 384,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Steel",
},
onEat: false,
num: 164,
gen: 3,
isNonstandard: "Past",
},

reapercloth: {
name: "Reaper Cloth",
spritenum: 385,
fling: {
basePower: 10,
},
num: 325,
gen: 4,
isNonstandard: "Past",
},

redcard: {
name: "Red Card",
spritenum: 387,
fling: {
basePower: 10,
},
onAfterMoveSecondary(target, source, move) {
if (source && source !== target && source.hp && target.hp && move && move.category !== 'Status') {
if (!source.isActive || !this.canSwitch(source.side) || source.forceSwitchFlag || target.forceSwitchFlag) {
return;
}
// The item is used up even against a pokemon with Ingrain or that otherwise can't be forced out
if (target.useItem(source)) {
if (this.runEvent('DragOut', source, target, move)) {
source.forceSwitchFlag = true;
}
}
}
},
num: 542,
gen: 5,
},

redorb: {
name: "Red Orb",
spritenum: 390,
onSwitchIn(pokemon) {
if (pokemon.isActive && pokemon.baseSpecies.name === 'Groudon') {
this.queue.insertChoice({choice: 'runPrimal', pokemon: pokemon});
}
},
onPrimal(pokemon) {
pokemon.formeChange('Groudon-Primal', this.effect, true);
},
onTakeItem(item, source) {
if (source.baseSpecies.baseSpecies === 'Groudon') return false;
return true;
},
itemUser: ["Groudon"],
num: 534,
gen: 6,
isNonstandard: "Past",
},

rindoberry: {
name: "Rindo Berry",
spritenum: 409,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Grass",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Grass' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 187,
gen: 4,
},

ringtarget: {
name: "Ring Target",
spritenum: 410,
fling: {
basePower: 10,
},
onNegateImmunity: false,
num: 543,
gen: 5,
},

rockincense: {
name: "Rock Incense",
spritenum: 416,
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Rock') {
return this.chainModify([4915, 4096]);
}
},
num: 315,
gen: 4,
isNonstandard: "Past",
},

rockyhelmet: {
name: "Rocky Helmet",
spritenum: 417,
fling: {
basePower: 60,
},
onDamagingHitOrder: 2,
onDamagingHit(damage, target, source, move) {
if (this.checkMoveMakesContact(move, source, target)) {
this.damage(source.baseMaxhp / 6, source, target);
}
},
num: 540,
gen: 5,
},

roomservice: {
name: "Room Service",
spritenum: 717,
fling: {
basePower: 100,
},
onStart(pokemon) {
if (!pokemon.ignoringItem() && this.field.getPseudoWeather('trickroom')) {
pokemon.useItem();
}
},
onAnyPseudoWeatherChange() {
const pokemon = this.effectState.target;
if (this.field.getPseudoWeather('trickroom')) {
pokemon.useItem(pokemon);
}
},
boosts: {
spe: -1,
},
num: 1122,
gen: 8,
},

rootfossil: {
name: "Root Fossil",
spritenum: 418,
fling: {
basePower: 100,
},
num: 99,
gen: 3,
isNonstandard: "Past",
},

roseincense: {
name: "Rose Incense",
spritenum: 419,
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Grass') {
return this.chainModify([4915, 4096]);
}
},
num: 318,
gen: 4,
isNonstandard: "Past",
},

roseliberry: {
name: "Roseli Berry",
spritenum: 603,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Fairy",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Fairy' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 686,
gen: 6,
},

rowapberry: {
name: "Rowap Berry",
spritenum: 420,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Dark",
},
onDamagingHit(damage, target, source, move) {
if (move.category === 'Special' && source.hp && source.isActive && !source.hasAbility('magicguard')) {
if (target.eatItem()) {
this.damage(source.baseMaxhp / (target.hasAbility('ripen') ? 4 : 8), source, target);
}
}
},
onEat() { },
num: 212,
gen: 4,
isNonstandard: "Unobtainable",
},

rustedshield: {
name: "Rusted Shield",
spritenum: 699,
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 889) || pokemon.baseSpecies.num === 889) {
return false;
}
return true;
},
itemUser: ["Zamazenta-Crowned"],
num: 1104,
gen: 8,
isNonstandard: "Unobtainable",
},

rustedsword: {
name: "Rusted Sword",
spritenum: 698,
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 888) || pokemon.baseSpecies.num === 888) {
return false;
}
return true;
},
itemUser: ["Zacian-Crowned"],
num: 1103,
gen: 8,
isNonstandard: "Unobtainable",
},

sachet: {
name: "Sachet",
spritenum: 691,
fling: {
basePower: 80,
},
num: 647,
gen: 6,
isNonstandard: "Past",
},

safetygoggles: {
name: "Safety Goggles",
spritenum: 604,
fling: {
basePower: 80,
},
onImmunity(type, pokemon) {
if (type === 'sandstorm' || type === 'hail' || type === 'powder') return false;
},
onTryHit(pokemon, source, move) {
if (move.flags['powder'] && pokemon !== source && this.dex.getImmunity('powder', pokemon)) {
this.add('-activate', pokemon, 'item: Safety Goggles', move.name);
return null;
}
},
num: 650,
gen: 6,
},

sailfossil: {
name: "Sail Fossil",
spritenum: 695,
fling: {
basePower: 100,
},
num: 711,
gen: 6,
isNonstandard: "Past",
},

salacberry: {
name: "Salac Berry",
spritenum: 426,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Fighting",
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
pokemon.eatItem();
}
},
onEat(pokemon) {
this.boost({spe: 1});
},
num: 203,
gen: 3,
},

scopelens: {
name: "Scope Lens",
spritenum: 429,
fling: {
basePower: 30,
},
onModifyCritRatio(critRatio) {
return critRatio + 1;
},
num: 232,
gen: 2,
},

seaincense: {
name: "Sea Incense",
spritenum: 430,
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Water') {
return this.chainModify([4915, 4096]);
}
},
num: 254,
gen: 3,
isNonstandard: "Past",
},

sharpbeak: {
name: "Sharp Beak",
spritenum: 436,
fling: {
basePower: 50,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Flying') {
return this.chainModify([4915, 4096]);
}
},
num: 244,
gen: 2,
},

shedshell: {
name: "Shed Shell",
spritenum: 437,
fling: {
basePower: 10,
},
onTrapPokemonPriority: -10,
onTrapPokemon(pokemon) {
pokemon.trapped = pokemon.maybeTrapped = false;
},
num: 295,
gen: 4,
},

shellbell: {
name: "Shell Bell",
spritenum: 438,
fling: {
basePower: 30,
},
onAfterMoveSecondarySelfPriority: -1,
onAfterMoveSecondarySelf(pokemon, target, move) {
if (move.totalDamage && !pokemon.forceSwitchFlag) {
this.heal(move.totalDamage / 8, pokemon);
}
},
num: 253,
gen: 3,
},

shucaberry: {
name: "Shuca Berry",
spritenum: 443,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Ground",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Ground' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 191,
gen: 4,
},

silkscarf: {
name: "Silk Scarf",
spritenum: 444,
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Normal') {
return this.chainModify([4915, 4096]);
}
},
num: 251,
gen: 3,
},

silverpowder: {
name: "Silver Powder",
spritenum: 447,
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Bug') {
return this.chainModify([4915, 4096]);
}
},
num: 222,
gen: 2,
},

sitrusberry: {
name: "Sitrus Berry",
spritenum: 448,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Psychic",
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 2) {
pokemon.eatItem();
}
},
onTryEatItem(item, pokemon) {
if (!this.runEvent('TryHeal', pokemon)) return false;
},
onEat(pokemon) {
this.heal(pokemon.baseMaxhp / 4);
},
num: 158,
gen: 3,
},

skullfossil: {
name: "Skull Fossil",
spritenum: 449,
fling: {
basePower: 100,
},
num: 105,
gen: 4,
isNonstandard: "Past",
},

skyplate: {
name: "Sky Plate",
spritenum: 450,
onPlate: 'Flying',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Flying') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Flying",
num: 306,
gen: 4,
isNonstandard: "Unobtainable",
},

smoothrock: {
name: "Smooth Rock",
spritenum: 453,
fling: {
basePower: 10,
},
num: 283,
gen: 4,
},

snowball: {
name: "Snowball",
spritenum: 606,
fling: {
basePower: 30,
},
onDamagingHit(damage, target, source, move) {
if (move.type === 'Ice') {
target.useItem();
}
},
boosts: {
atk: 1,
},
num: 649,
gen: 6,
},

softsand: {
name: "Soft Sand",
spritenum: 456,
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Ground') {
return this.chainModify([4915, 4096]);
}
},
num: 237,
gen: 2,
},

souldew: {
name: "Soul Dew",
spritenum: 459,
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (
move && (user.baseSpecies.num === 380 || user.baseSpecies.num === 381) &&
(move.type === 'Psychic' || move.type === 'Dragon')
) {
return this.chainModify([4915, 4096]);
}
},
itemUser: ["Latios", "Latias"],
num: 225,
gen: 3,
isNonstandard: "Past",
},

spelltag: {
name: "Spell Tag",
spritenum: 461,
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Ghost') {
return this.chainModify([4915, 4096]);
}
},
num: 247,
gen: 2,
},

spelonberry: {
name: "Spelon Berry",
spritenum: 462,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Dark",
},
onEat: false,
num: 179,
gen: 3,
isNonstandard: "Past",
},

splashplate: {
name: "Splash Plate",
spritenum: 463,
onPlate: 'Water',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Water') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Water",
num: 299,
gen: 4,
isNonstandard: "Unobtainable",
},

spookyplate: {
name: "Spooky Plate",
spritenum: 464,
onPlate: 'Ghost',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Ghost') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Ghost",
num: 310,
gen: 4,
isNonstandard: "Unobtainable",
},

starfberry: {
name: "Starf Berry",
spritenum: 472,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Psychic",
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
pokemon.eatItem();
}
},
onEat(pokemon) {
const stats: BoostID[] = [];
let stat: BoostID;
for (stat in pokemon.boosts) {
if (stat !== 'accuracy' && stat !== 'evasion' && pokemon.boosts[stat] < 6) {
stats.push(stat);
}
}
if (stats.length) {
const randomStat = this.sample(stats);
const boost: SparseBoostsTable = {};
boost[randomStat] = 2;
this.boost(boost);
}
},
num: 207,
gen: 3,
},

starsweet: {
name: "Star Sweet",
spritenum: 709,
fling: {
basePower: 10,
},
num: 1114,
gen: 8,
isNonstandard: "Past",
},

stick: {
name: "Stick",
fling: {
basePower: 60,
},
spritenum: 475,
onModifyCritRatio(critRatio, user) {
if (this.toID(user.baseSpecies.baseSpecies) === 'farfetchd') {
return critRatio + 2;
}
},
itemUser: ["Farfetch\u2019d"],
num: 259,
gen: 2,
isNonstandard: "Past",
},

stickybarb: {
name: "Sticky Barb",
spritenum: 476,
fling: {
basePower: 80,
},
onResidualOrder: 28,
onResidualSubOrder: 3,
onResidual(pokemon) {
this.damage(pokemon.baseMaxhp / 8);
},
onHit(target, source, move) {
if (source && source !== target && !source.item && move && this.checkMoveMakesContact(move, source, target)) {
const barb = target.takeItem();
if (!barb) return; // Gen 4 Multitype
source.setItem(barb);
// no message for Sticky Barb changing hands
}
},
num: 288,
gen: 4,
},

stoneplate: {
name: "Stone Plate",
spritenum: 477,
onPlate: 'Rock',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Rock') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Rock",
num: 309,
gen: 4,
isNonstandard: "Unobtainable",
},

strawberrysweet: {
name: "Strawberry Sweet",
spritenum: 704,
fling: {
basePower: 10,
},
num: 1109,
gen: 8,
isNonstandard: "Past",
},

sweetapple: {
name: "Sweet Apple",
spritenum: 711,
fling: {
basePower: 30,
},
num: 1116,
gen: 8,
},

tamatoberry: {
name: "Tamato Berry",
spritenum: 486,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Psychic",
},
onEat: false,
num: 174,
gen: 3,
},

tangaberry: {
name: "Tanga Berry",
spritenum: 487,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Bug",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Bug' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 194,
gen: 4,
},

tartapple: {
name: "Tart Apple",
spritenum: 712,
fling: {
basePower: 30,
},
num: 1117,
gen: 8,
},

terrainextender: {
name: "Terrain Extender",
spritenum: 662,
fling: {
basePower: 60,
},
num: 879,
gen: 7,
},

thickclub: {
name: "Thick Club",
spritenum: 491,
fling: {
basePower: 90,
},
onModifyAtkPriority: 1,
onModifyAtk(atk, pokemon) {
if (pokemon.baseSpecies.baseSpecies === 'Cubone' || pokemon.baseSpecies.baseSpecies === 'Marowak') {
return this.chainModify(2);
}
},
itemUser: ["Marowak", "Marowak-Alola", "Marowak-Alola-Totem", "Cubone"],
num: 258,
gen: 2,
isNonstandard: "Past",
},

throatspray: {
name: "Throat Spray",
spritenum: 713,
fling: {
basePower: 30,
},
onAfterMoveSecondarySelf(target, source, move) {
if (move.flags['sound']) {
target.useItem();
}
},
boosts: {
spa: 1,
},
num: 1118,
gen: 8,
},

toxicorb: {
name: "Toxic Orb",
spritenum: 515,
fling: {
basePower: 30,
status: 'tox',
},
onResidualOrder: 28,
onResidualSubOrder: 3,
onResidual(pokemon) {
pokemon.trySetStatus('tox', pokemon);
},
num: 272,
gen: 4,
},

toxicplate: {
name: "Toxic Plate",
spritenum: 516,
onPlate: 'Poison',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Poison') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Poison",
num: 304,
gen: 4,
isNonstandard: "Unobtainable",
},

twistedspoon: {
name: "Twisted Spoon",
spritenum: 520,
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Psychic') {
return this.chainModify([4915, 4096]);
}
},
num: 248,
gen: 2,
},

upgrade: {
name: "Up-Grade",
spritenum: 523,
fling: {
basePower: 30,
},
num: 252,
gen: 2,
isNonstandard: "Past",
},

utilityumbrella: {
name: "Utility Umbrella",
spritenum: 718,
fling: {
basePower: 60,
},
// Partially implemented in Pokemon.effectiveWeather() in sim/pokemon.ts
onStart(pokemon) {
if (!pokemon.ignoringItem()) return;
if (['sunnyday', 'raindance', 'desolateland', 'primordialsea'].includes(this.field.effectiveWeather())) {
this.runEvent('WeatherChange', pokemon, pokemon, this.effect);
}
},
onUpdate(pokemon) {
if (!this.effectState.inactive) return;
this.effectState.inactive = false;
if (['sunnyday', 'raindance', 'desolateland', 'primordialsea'].includes(this.field.effectiveWeather())) {
this.runEvent('WeatherChange', pokemon, pokemon, this.effect);
}
},
onEnd(pokemon) {
if (['sunnyday', 'raindance', 'desolateland', 'primordialsea'].includes(this.field.effectiveWeather())) {
this.runEvent('WeatherChange', pokemon, pokemon, this.effect);
}
this.effectState.inactive = true;
},
num: 1123,
gen: 8,
},

wacanberry: {
name: "Wacan Berry",
spritenum: 526,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Electric",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Electric' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;
if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 186,
gen: 4,
},

watmelberry: {
name: "Watmel Berry",
spritenum: 530,
isBerry: true,
naturalGift: {
basePower: 100,
type: "Fire",
},
onEat: false,
num: 181,
gen: 3,
isNonstandard: "Past",
},

waveincense: {
name: "Wave Incense",
spritenum: 531,
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Water') {
return this.chainModify([4915, 4096]);
}
},
num: 317,
gen: 4,
isNonstandard: "Past",
},

weaknesspolicy: {
name: "Weakness Policy",
spritenum: 609,
fling: {
basePower: 80,
},
onDamagingHit(damage, target, source, move) {
if (!move.damage && !move.damageCallback && target.getMoveHitData(move).typeMod > 0) {
target.useItem();
}
},
boosts: {
atk: 2,
spa: 2,
},
num: 639,
gen: 6,
},

wepearberry: {
name: "Wepear Berry",
spritenum: 533,
isBerry: true,
naturalGift: {
basePower: 90,
type: "Electric",
},
onEat: false,
num: 167,
gen: 3,
isNonstandard: "Past",
},

whiteherb: {
name: "White Herb",
spritenum: 535,
fling: {
basePower: 10,
effect(pokemon) {
let activate = false;
const boosts: SparseBoostsTable = {};
let i: BoostID;
for (i in pokemon.boosts) {
if (pokemon.boosts[i] < 0) {
activate = true;
boosts[i] = 0;
}
}
if (activate) {
pokemon.setBoost(boosts);
this.add('-clearnegativeboost', pokemon, '[silent]');
}
},
},
onUpdate(pokemon) {
let activate = false;
const boosts: SparseBoostsTable = {};
let i: BoostID;
for (i in pokemon.boosts) {
if (pokemon.boosts[i] < 0) {
activate = true;
boosts[i] = 0;
}
}
if (activate && pokemon.useItem()) {
pokemon.setBoost(boosts);
this.add('-clearnegativeboost', pokemon, '[silent]');
}
},
num: 214,
gen: 3,
},

widelens: {
name: "Wide Lens",
spritenum: 537,
fling: {
basePower: 10,
},
onSourceModifyAccuracyPriority: -2,
onSourceModifyAccuracy(accuracy) {
if (typeof accuracy === 'number') {
return this.chainModify([4505, 4096]);
}
},
num: 265,
gen: 4,
},

wikiberry: {
name: "Wiki Berry",
spritenum: 538,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Rock",
},
onUpdate(pokemon) {
if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
pokemon.eatItem();
}
},
onTryEatItem(item, pokemon) {
if (!this.runEvent('TryHeal', pokemon)) return false;
},
onEat(pokemon) {
this.heal(pokemon.baseMaxhp / 3);
if (pokemon.getNature().minus === 'spa') {
pokemon.addVolatile('confusion');
}
},
num: 160,
gen: 3,
},

wiseglasses: {
name: "Wise Glasses",
spritenum: 539,
fling: {
basePower: 10,
},
onBasePowerPriority: 16,
onBasePower(basePower, user, target, move) {
if (move.category === 'Special') {
return this.chainModify([4505, 4096]);
}
},
num: 267,
gen: 4,
},

yacheberry: {
name: "Yache Berry",
spritenum: 567,
isBerry: true,
naturalGift: {
basePower: 80,
type: "Ice",
},
onSourceModifyDamage(damage, source, target, move) {
if (move.type === 'Ice' && target.getMoveHitData(move).typeMod > 0) {
const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
if (hitSub) return;

if (target.eatItem()) {
this.debug('-50% reduction');
this.add('-enditem', target, this.effect, '[weaken]');
return this.chainModify(0.5);
}
}
},
onEat() { },
num: 188,
gen: 4,
},

zapplate: {
name: "Zap Plate",
spritenum: 572,
onPlate: 'Electric',
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Electric') {
return this.chainModify([4915, 4096]);
}
},
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
return false;
}
return true;
},
forcedForme: "Arceus-Electric",
num: 300,
gen: 4,
isNonstandard: "Unobtainable",
},

zoomlens: {
name: "Zoom Lens",
spritenum: 574,
fling: {
basePower: 10,
},
onSourceModifyAccuracyPriority: -2,
onSourceModifyAccuracy(accuracy, target) {
if (typeof accuracy === 'number' && !this.queue.willMove(target)) {
this.debug('Zoom Lens boosting accuracy');
return this.chainModify([4915, 4096]);
}
},
num: 276,
gen: 4,
},

};
