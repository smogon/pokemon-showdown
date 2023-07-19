export const Items: {[itemid: string]: ItemData} = {

abilityshield: {
name: "Ability Shield",
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
},

abomasite: {
name: "Abomasite",
megaStone: "Abomasnow-Mega",
megaEvolves: "Abomasnow",
itemUser: ["Abomasnow"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

absolite: {
name: "Absolite",
megaStone: "Absol-Mega",
megaEvolves: "Absol",
itemUser: ["Absol"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

absorbbulb: {
name: "Absorb Bulb",
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
},

adamantcrystal: {
name: "Adamant Crystal",
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
isNonstandard: "Unobtainable",
},

adamantorb: {
name: "Adamant Orb",
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
isNonstandard: "Unobtainable",
},

adrenalineorb: {
name: "Adrenaline Orb",
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
},

aerodactylite: {
name: "Aerodactylite",
megaStone: "Aerodactyl-Mega",
megaEvolves: "Aerodactyl",
itemUser: ["Aerodactyl"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

aggronite: {
name: "Aggronite",
megaStone: "Aggron-Mega",
megaEvolves: "Aggron",
itemUser: ["Aggron"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

aguavberry: {
name: "Aguav Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

airballoon: {
name: "Air Balloon",
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
},

alakazite: {
name: "Alakazite",
megaStone: "Alakazam-Mega",
megaEvolves: "Alakazam",
itemUser: ["Alakazam"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

aloraichiumz: {
name: "Aloraichium Z",
onTakeItem: false,
zMove: "Stoked Sparksurfer",
zMoveFrom: "Thunderbolt",
itemUser: ["Raichu-Alola"],
isNonstandard: "Past",
},

altarianite: {
name: "Altarianite",
megaStone: "Altaria-Mega",
megaEvolves: "Altaria",
itemUser: ["Altaria"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

ampharosite: {
name: "Ampharosite",
megaStone: "Ampharos-Mega",
megaEvolves: "Ampharos",
itemUser: ["Ampharos"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

apicotberry: {
name: "Apicot Berry",
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
},

armorfossil: {
name: "Armor Fossil",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

aspearberry: {
name: "Aspear Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

assaultvest: {
name: "Assault Vest",
fling: {
basePower: 100,
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
},

audinite: {
name: "Audinite",
megaStone: "Audino-Mega",
megaEvolves: "Audino",
itemUser: ["Audino"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

auspiciousarmor: {
name: "Auspicious Armor",
},

babiriberry: {
name: "Babiri Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

banettite: {
name: "Banettite",
megaStone: "Banette-Mega",
megaEvolves: "Banette",
itemUser: ["Banette"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

beastball: {
name: "Beast Ball",
isPokeball: true,
},

beedrillite: {
name: "Beedrillite",
megaStone: "Beedrill-Mega",
megaEvolves: "Beedrill",
itemUser: ["Beedrill"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

belueberry: {
name: "Belue Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Electric",
},
onEat: false,
isNonstandard: "Past",
},

berryjuice: {
name: "Berry Juice",
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
isNonstandard: "Past",
},

berrysweet: {
name: "Berry Sweet",
fling: {
basePower: 10,
},
isNonstandard: "Past",
},

bigroot: {
name: "Big Root",
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
},

bindingband: {
name: "Binding Band",
fling: {
basePower: 30,
},
// implemented in statuses
},

blackbelt: {
name: "Black Belt",
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Fighting') {
return this.chainModify([4915, 4096]);
}
},
},

blackglasses: {
name: "Black Glasses",
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Dark') {
return this.chainModify([4915, 4096]);
}
},
},

blacksludge: {
name: "Black Sludge",
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
},

blastoisinite: {
name: "Blastoisinite",
megaStone: "Blastoise-Mega",
megaEvolves: "Blastoise",
itemUser: ["Blastoise"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

blazikenite: {
name: "Blazikenite",
megaStone: "Blaziken-Mega",
megaEvolves: "Blaziken",
itemUser: ["Blaziken"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

blueorb: {
name: "Blue Orb",
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
isNonstandard: "Past",
},

blukberry: {
name: "Bluk Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Fire",
},
onEat: false,
isNonstandard: "Past",
},

blunderpolicy: {
name: "Blunder Policy",
fling: {
basePower: 100,
},
// Item activation located in scripts.js
},

boosterenergy: {
name: "Booster Energy",
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
},

bottlecap: {
name: "Bottle Cap",
fling: {
basePower: 30,
},
},

brightpowder: {
name: "Bright Powder",
fling: {
basePower: 10,
},
onModifyAccuracyPriority: -2,
onModifyAccuracy(accuracy) {
if (typeof accuracy !== 'number') return;
this.debug('brightpowder - decreasing accuracy');
return this.chainModify([3686, 4096]);
},
},

buggem: {
name: "Bug Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status') return;
if (move.type === 'Bug' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

bugmemory: {
name: "Bug Memory",
onMemory: 'Bug',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Bug",
itemUser: ["Silvally-Bug"],
isNonstandard: "Past",
},

buginiumz: {
name: "Buginium Z",
onPlate: 'Bug',
onTakeItem: false,
zMove: true,
zMoveType: "Bug",
forcedForme: "Arceus-Bug",
isNonstandard: "Past",
},

burndrive: {
name: "Burn Drive",
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
return false;
}
return true;
},
onDrive: 'Fire',
forcedForme: "Genesect-Burn",
itemUser: ["Genesect-Burn"],
isNonstandard: "Past",
},

cameruptite: {
name: "Cameruptite",
megaStone: "Camerupt-Mega",
megaEvolves: "Camerupt",
itemUser: ["Camerupt"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

cellbattery: {
name: "Cell Battery",
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
},

charcoal: {
name: "Charcoal",
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Fire') {
return this.chainModify([4915, 4096]);
}
},
},

charizarditex: {
name: "Charizardite X",
megaStone: "Charizard-Mega-X",
megaEvolves: "Charizard",
itemUser: ["Charizard"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

charizarditey: {
name: "Charizardite Y",
megaStone: "Charizard-Mega-Y",
megaEvolves: "Charizard",
itemUser: ["Charizard"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

chartiberry: {
name: "Charti Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

cheriberry: {
name: "Cheri Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

cherishball: {
name: "Cherish Ball",
isPokeball: true,
isNonstandard: "Unobtainable",
},

chestoberry: {
name: "Chesto Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

chilanberry: {
name: "Chilan Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

chilldrive: {
name: "Chill Drive",
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
return false;
}
return true;
},
onDrive: 'Ice',
forcedForme: "Genesect-Chill",
itemUser: ["Genesect-Chill"],
isNonstandard: "Past",
},

chippedpot: {
name: "Chipped Pot",
fling: {
basePower: 100,
},
},

choiceband: {
name: "Choice Band",
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
},

choicescarf: {
name: "Choice Scarf",
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
},

choicespecs: {
name: "Choice Specs",
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
},

chopleberry: {
name: "Chople Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

clawfossil: {
name: "Claw Fossil",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

clearamulet: {
name: "Clear Amulet",
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
},

cloversweet: {
name: "Clover Sweet",
fling: {
basePower: 10,
},
isNonstandard: "Past",
},

cobaberry: {
name: "Coba Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

colburberry: {
name: "Colbur Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

cornnberry: {
name: "Cornn Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Bug",
},
onEat: false,
isNonstandard: "Past",
},

coverfossil: {
name: "Cover Fossil",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

covertcloak: {
name: "Covert Cloak",
fling: {
basePower: 10,
},
onModifySecondaries(secondaries) {
this.debug('Covert Cloak prevent secondary');
return secondaries.filter(effect => !!(effect.self || effect.dustproof));
},
},

crackedpot: {
name: "Cracked Pot",
fling: {
basePower: 100,
},
},

custapberry: {
name: "Custap Berry",
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
isNonstandard: "Unobtainable",
},

damprock: {
name: "Damp Rock",
fling: {
basePower: 60,
},
},

darkgem: {
name: "Dark Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status') return;
if (move.type === 'Dark' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

darkmemory: {
name: "Dark Memory",
onMemory: 'Dark',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Dark",
itemUser: ["Silvally-Dark"],
isNonstandard: "Past",
},

darkiniumz: {
name: "Darkinium Z",
onPlate: 'Dark',
onTakeItem: false,
zMove: true,
zMoveType: "Dark",
forcedForme: "Arceus-Dark",
isNonstandard: "Past",
},

dawnstone: {
name: "Dawn Stone",
fling: {
basePower: 100,
},
},

decidiumz: {
name: "Decidium Z",
onTakeItem: false,
zMove: "Sinister Arrow Raid",
zMoveFrom: "Spirit Shackle",
itemUser: ["Decidueye"],
isNonstandard: "Past",
},

deepseascale: {
name: "Deep Sea Scale",
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
isNonstandard: "Past",
},

deepseatooth: {
name: "Deep Sea Tooth",
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
isNonstandard: "Past",
},

destinyknot: {
name: "Destiny Knot",
fling: {
basePower: 10,
},
onAttractPriority: -100,
onAttract(target, source) {
this.debug('attract intercepted: ' + target + ' from ' + source);
if (!source || source === target) return;
if (!source.volatiles['attract']) source.addVolatile('attract', target);
},
},

diancite: {
name: "Diancite",
megaStone: "Diancie-Mega",
megaEvolves: "Diancie",
itemUser: ["Diancie"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

diveball: {
name: "Dive Ball",
isPokeball: true,
},

domefossil: {
name: "Dome Fossil",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

dousedrive: {
name: "Douse Drive",
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
return false;
}
return true;
},
onDrive: 'Water',
forcedForme: "Genesect-Douse",
itemUser: ["Genesect-Douse"],
isNonstandard: "Past",
},

dracoplate: {
name: "Draco Plate",
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
isNonstandard: "Unobtainable",
},

dragonfang: {
name: "Dragon Fang",
fling: {
basePower: 70,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Dragon') {
return this.chainModify([4915, 4096]);
}
},
},

dragongem: {
name: "Dragon Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status') return;
if (move.type === 'Dragon' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

dragonmemory: {
name: "Dragon Memory",
onMemory: 'Dragon',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Dragon",
itemUser: ["Silvally-Dragon"],
isNonstandard: "Past",
},

dragonscale: {
name: "Dragon Scale",
fling: {
basePower: 30,
},
isNonstandard: "Past",
},

dragoniumz: {
name: "Dragonium Z",
onPlate: 'Dragon',
onTakeItem: false,
zMove: true,
zMoveType: "Dragon",
forcedForme: "Arceus-Dragon",
isNonstandard: "Past",
},

dreadplate: {
name: "Dread Plate",
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
isNonstandard: "Unobtainable",
},

dreamball: {
name: "Dream Ball",
isPokeball: true,
},

dubiousdisc: {
name: "Dubious Disc",
fling: {
basePower: 50,
},
isNonstandard: "Past",
},

durinberry: {
name: "Durin Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Water",
},
onEat: false,
isNonstandard: "Past",
},

duskball: {
name: "Dusk Ball",
isPokeball: true,
},

duskstone: {
name: "Dusk Stone",
fling: {
basePower: 100,
},
},

earthplate: {
name: "Earth Plate",
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
isNonstandard: "Unobtainable",
},

eeviumz: {
name: "Eevium Z",
onTakeItem: false,
zMove: "Extreme Evoboost",
zMoveFrom: "Last Resort",
itemUser: ["Eevee"],
isNonstandard: "Past",
},

ejectbutton: {
name: "Eject Button",
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
},

ejectpack: {
name: "Eject Pack",
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
},

electirizer: {
name: "Electirizer",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

electricgem: {
name: "Electric Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status' || move.flags['pledgecombo']) return;
if (move.type === 'Electric' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

electricmemory: {
name: "Electric Memory",
onMemory: 'Electric',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Electric",
itemUser: ["Silvally-Electric"],
isNonstandard: "Past",
},

electricseed: {
name: "Electric Seed",
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
},

electriumz: {
name: "Electrium Z",
onPlate: 'Electric',
onTakeItem: false,
zMove: true,
zMoveType: "Electric",
forcedForme: "Arceus-Electric",
isNonstandard: "Past",
},

enigmaberry: {
name: "Enigma Berry",
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
isNonstandard: "Unobtainable",
},

eviolite: {
name: "Eviolite",
fling: {
basePower: 40,
},
onModifyDefPriority: 2,
onModifyDef(def, pokemon) {
if (pokemon.baseSpecies.nfe) {
return this.chainModify(1.5);
}
},
onModifySpDPriority: 2,
onModifySpD(spd, pokemon) {
if (pokemon.baseSpecies.nfe) {
return this.chainModify(1.5);
}
},
},

expertbelt: {
name: "Expert Belt",
fling: {
basePower: 10,
},
onModifyDamage(damage, source, target, move) {
if (move && target.getMoveHitData(move).typeMod > 0) {
return this.chainModify([4915, 4096]);
}
},
},

fairiumz: {
name: "Fairium Z",
onPlate: 'Fairy',
onTakeItem: false,
zMove: true,
zMoveType: "Fairy",
forcedForme: "Arceus-Fairy",
isNonstandard: "Past",
},

fairygem: {
name: "Fairy Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status') return;
if (move.type === 'Fairy' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

fairymemory: {
name: "Fairy Memory",
onMemory: 'Fairy',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Fairy",
itemUser: ["Silvally-Fairy"],
isNonstandard: "Past",
},

fastball: {
name: "Fast Ball",
isPokeball: true,
},

fightinggem: {
name: "Fighting Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status') return;
if (move.type === 'Fighting' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

fightingmemory: {
name: "Fighting Memory",
onMemory: 'Fighting',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Fighting",
itemUser: ["Silvally-Fighting"],
isNonstandard: "Past",
},

fightiniumz: {
name: "Fightinium Z",
onPlate: 'Fighting',
onTakeItem: false,
zMove: true,
zMoveType: "Fighting",
forcedForme: "Arceus-Fighting",
isNonstandard: "Past",
},

figyberry: {
name: "Figy Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

firegem: {
name: "Fire Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status' || move.flags['pledgecombo']) return;
if (move.type === 'Fire' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

firememory: {
name: "Fire Memory",
onMemory: 'Fire',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Fire",
itemUser: ["Silvally-Fire"],
isNonstandard: "Past",
},

firestone: {
name: "Fire Stone",
fling: {
basePower: 30,
},
},

firiumz: {
name: "Firium Z",
onPlate: 'Fire',
onTakeItem: false,
zMove: true,
zMoveType: "Fire",
forcedForme: "Arceus-Fire",
isNonstandard: "Past",
},

fistplate: {
name: "Fist Plate",
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
isNonstandard: "Unobtainable",
},

flameorb: {
name: "Flame Orb",
fling: {
basePower: 30,
status: 'brn',
},
onResidualOrder: 28,
onResidualSubOrder: 3,
onResidual(pokemon) {
pokemon.trySetStatus('brn', pokemon);
},
},

flameplate: {
name: "Flame Plate",
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
isNonstandard: "Unobtainable",
},

floatstone: {
name: "Float Stone",
fling: {
basePower: 30,
},
onModifyWeight(weighthg) {
return this.trunc(weighthg / 2);
},
},

flowersweet: {
name: "Flower Sweet",
fling: {
basePower: 0,
},
isNonstandard: "Past",
},

flyinggem: {
name: "Flying Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status') return;
if (move.type === 'Flying' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

flyingmemory: {
name: "Flying Memory",
onMemory: 'Flying',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Flying",
itemUser: ["Silvally-Flying"],
isNonstandard: "Past",
},

flyiniumz: {
name: "Flyinium Z",
onPlate: 'Flying',
onTakeItem: false,
zMove: true,
zMoveType: "Flying",
forcedForme: "Arceus-Flying",
isNonstandard: "Past",
},

focusband: {
name: "Focus Band",
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
},

focussash: {
name: "Focus Sash",
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
},

fossilizedbird: {
name: "Fossilized Bird",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

fossilizeddino: {
name: "Fossilized Dino",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

fossilizeddrake: {
name: "Fossilized Drake",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

fossilizedfish: {
name: "Fossilized Fish",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

friendball: {
name: "Friend Ball",
isPokeball: true,
},

fullincense: {
name: "Full Incense",
fling: {
basePower: 10,
},
onFractionalPriority: -0.1,
isNonstandard: "Past",
},

galaricacuff: {
name: "Galarica Cuff",
fling: {
basePower: 30,
},
isNonstandard: "Unobtainable",
},

galaricawreath: {
name: "Galarica Wreath",
fling: {
basePower: 30,
},
isNonstandard: "Unobtainable",
},

galladite: {
name: "Galladite",
megaStone: "Gallade-Mega",
megaEvolves: "Gallade",
itemUser: ["Gallade"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

ganlonberry: {
name: "Ganlon Berry",
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
},

garchompite: {
name: "Garchompite",
megaStone: "Garchomp-Mega",
megaEvolves: "Garchomp",
itemUser: ["Garchomp"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

gardevoirite: {
name: "Gardevoirite",
megaStone: "Gardevoir-Mega",
megaEvolves: "Gardevoir",
itemUser: ["Gardevoir"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

gengarite: {
name: "Gengarite",
megaStone: "Gengar-Mega",
megaEvolves: "Gengar",
itemUser: ["Gengar"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

ghostgem: {
name: "Ghost Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status') return;
if (move.type === 'Ghost' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

ghostmemory: {
name: "Ghost Memory",
onMemory: 'Ghost',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Ghost",
itemUser: ["Silvally-Ghost"],
isNonstandard: "Past",
},

ghostiumz: {
name: "Ghostium Z",
onPlate: 'Ghost',
onTakeItem: false,
zMove: true,
zMoveType: "Ghost",
forcedForme: "Arceus-Ghost",
isNonstandard: "Past",
},

glalitite: {
name: "Glalitite",
megaStone: "Glalie-Mega",
megaEvolves: "Glalie",
itemUser: ["Glalie"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

goldbottlecap: {
name: "Gold Bottle Cap",
fling: {
basePower: 30,
},
},

grassgem: {
name: "Grass Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status' || move.flags['pledgecombo']) return;
if (move.type === 'Grass' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

grassmemory: {
name: "Grass Memory",
onMemory: 'Grass',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Grass",
itemUser: ["Silvally-Grass"],
isNonstandard: "Past",
},

grassiumz: {
name: "Grassium Z",
onPlate: 'Grass',
onTakeItem: false,
zMove: true,
zMoveType: "Grass",
forcedForme: "Arceus-Grass",
isNonstandard: "Past",
},

grassyseed: {
name: "Grassy Seed",
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
},

greatball: {
name: "Great Ball",
isPokeball: true,
},

grepaberry: {
name: "Grepa Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Flying",
},
onEat: false,
},

gripclaw: {
name: "Grip Claw",
fling: {
basePower: 90,
},
// implemented in statuses
},

griseouscore: {
name: "Griseous Core",
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
isNonstandard: "Unobtainable",
},

griseousorb: {
name: "Griseous Orb",
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
isNonstandard: "Unobtainable",
},

groundgem: {
name: "Ground Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status') return;
if (move.type === 'Ground' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

groundmemory: {
name: "Ground Memory",
onMemory: 'Ground',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Ground",
itemUser: ["Silvally-Ground"],
isNonstandard: "Past",
},

groundiumz: {
name: "Groundium Z",
onPlate: 'Ground',
onTakeItem: false,
zMove: true,
zMoveType: "Ground",
forcedForme: "Arceus-Ground",
isNonstandard: "Past",
},

gyaradosite: {
name: "Gyaradosite",
megaStone: "Gyarados-Mega",
megaEvolves: "Gyarados",
itemUser: ["Gyarados"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

habanberry: {
name: "Haban Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

hardstone: {
name: "Hard Stone",
fling: {
basePower: 100,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Rock') {
return this.chainModify([4915, 4096]);
}
},
},

healball: {
name: "Heal Ball",
isPokeball: true,
},

heatrock: {
name: "Heat Rock",
fling: {
basePower: 60,
},
},

heavyball: {
name: "Heavy Ball",
isPokeball: true,
},

heavydutyboots: {
name: "Heavy-Duty Boots",
fling: {
basePower: 100,
},
// Hazard Immunity implemented in moves.ts
},

helixfossil: {
name: "Helix Fossil",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

heracronite: {
name: "Heracronite",
megaStone: "Heracross-Mega",
megaEvolves: "Heracross",
itemUser: ["Heracross"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

hondewberry: {
name: "Hondew Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Ground",
},
onEat: false,
},

houndoominite: {
name: "Houndoominite",
megaStone: "Houndoom-Mega",
megaEvolves: "Houndoom",
itemUser: ["Houndoom"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

iapapaberry: {
name: "Iapapa Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

icegem: {
name: "Ice Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status') return;
if (move.type === 'Ice' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

icememory: {
name: "Ice Memory",
onMemory: 'Ice',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Ice",
itemUser: ["Silvally-Ice"],
isNonstandard: "Past",
},

icestone: {
name: "Ice Stone",
fling: {
basePower: 30,
},
},

icicleplate: {
name: "Icicle Plate",
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
isNonstandard: "Unobtainable",
},

iciumz: {
name: "Icium Z",
onPlate: 'Ice',
onTakeItem: false,
zMove: true,
zMoveType: "Ice",
forcedForme: "Arceus-Ice",
isNonstandard: "Past",
},

icyrock: {
name: "Icy Rock",
fling: {
basePower: 40,
},
},

inciniumz: {
name: "Incinium Z",
onTakeItem: false,
zMove: "Malicious Moonsault",
zMoveFrom: "Darkest Lariat",
itemUser: ["Incineroar"],
isNonstandard: "Past",
},

insectplate: {
name: "Insect Plate",
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
isNonstandard: "Unobtainable",
},

ironball: {
name: "Iron Ball",
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
},

ironplate: {
name: "Iron Plate",
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
isNonstandard: "Unobtainable",
},

jabocaberry: {
name: "Jaboca Berry",
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
isNonstandard: "Unobtainable",
},

jawfossil: {
name: "Jaw Fossil",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

kasibberry: {
name: "Kasib Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

kebiaberry: {
name: "Kebia Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

keeberry: {
name: "Kee Berry",
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
isNonstandard: "Unobtainable",
},

kelpsyberry: {
name: "Kelpsy Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Fighting",
},
onEat: false,
},

kangaskhanite: {
name: "Kangaskhanite",
megaStone: "Kangaskhan-Mega",
megaEvolves: "Kangaskhan",
itemUser: ["Kangaskhan"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

kingsrock: {
name: "King's Rock",
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
},

kommoniumz: {
name: "Kommonium Z",
onTakeItem: false,
zMove: "Clangorous Soulblaze",
zMoveFrom: "Clanging Scales",
itemUser: ["Kommo-o", "Kommo-o-Totem"],
isNonstandard: "Past",
},

laggingtail: {
name: "Lagging Tail",
fling: {
basePower: 10,
},
onFractionalPriority: -0.1,
},

lansatberry: {
name: "Lansat Berry",
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
},

latiasite: {
name: "Latiasite",
megaStone: "Latias-Mega",
megaEvolves: "Latias",
itemUser: ["Latias"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

latiosite: {
name: "Latiosite",
megaStone: "Latios-Mega",
megaEvolves: "Latios",
itemUser: ["Latios"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

laxincense: {
name: "Lax Incense",
fling: {
basePower: 10,
},
onModifyAccuracyPriority: -2,
onModifyAccuracy(accuracy) {
if (typeof accuracy !== 'number') return;
this.debug('lax incense - decreasing accuracy');
return this.chainModify([3686, 4096]);
},
isNonstandard: "Past",
},

leafstone: {
name: "Leaf Stone",
fling: {
basePower: 30,
},
},

leek: {
name: "Leek",
fling: {
basePower: 60,
},
onModifyCritRatio(critRatio, user) {
if (["farfetchd", "sirfetchd"].includes(this.toID(user.baseSpecies.baseSpecies))) {
return critRatio + 2;
}
},
itemUser: ["Farfetch\u2019d", "Farfetch\u2019d-Galar", "Sirfetch\u2019d"],
isNonstandard: "Past",
},

leftovers: {
name: "Leftovers",
fling: {
basePower: 10,
},
onResidualOrder: 5,
onResidualSubOrder: 4,
onResidual(pokemon) {
this.heal(pokemon.baseMaxhp / 16);
},
},

leppaberry: {
name: "Leppa Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

levelball: {
name: "Level Ball",
isPokeball: true,
},

liechiberry: {
name: "Liechi Berry",
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
},

lifeorb: {
name: "Life Orb",
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
},

lightball: {
name: "Light Ball",
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
},

lightclay: {
name: "Light Clay",
fling: {
basePower: 30,
},
// implemented in the corresponding thing
},

loadeddice: {
name: "Loaded Dice",
// partially implemented in sim/battle-actions.ts:BattleActions#hitStepMoveHitLoop
onModifyMove(move) {
if (move.multiaccuracy) {
delete move.multiaccuracy;
}
},
},

lopunnite: {
name: "Lopunnite",
megaStone: "Lopunny-Mega",
megaEvolves: "Lopunny",
itemUser: ["Lopunny"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

loveball: {
name: "Love Ball",
isPokeball: true,
},

lovesweet: {
name: "Love Sweet",
fling: {
basePower: 10,
},
isNonstandard: "Past",
},

lucarionite: {
name: "Lucarionite",
megaStone: "Lucario-Mega",
megaEvolves: "Lucario",
itemUser: ["Lucario"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

luckypunch: {
name: "Lucky Punch",
fling: {
basePower: 40,
},
onModifyCritRatio(critRatio, user) {
if (user.baseSpecies.name === 'Chansey') {
return critRatio + 2;
}
},
itemUser: ["Chansey"],
isNonstandard: "Past",
},

lumberry: {
name: "Lum Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

luminousmoss: {
name: "Luminous Moss",
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
},

lunaliumz: {
name: "Lunalium Z",
onTakeItem: false,
zMove: "Menacing Moonraze Maelstrom",
zMoveFrom: "Moongeist Beam",
itemUser: ["Lunala", "Necrozma-Dawn-Wings"],
isNonstandard: "Past",
},

lureball: {
name: "Lure Ball",
isPokeball: true,
},

lustrousglobe: {
name: "Lustrous Globe",
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
isNonstandard: "Unobtainable",
},

lustrousorb: {
name: "Lustrous Orb",
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
isNonstandard: "Unobtainable",
},

luxuryball: {
name: "Luxury Ball",
isPokeball: true,
},

lycaniumz: {
name: "Lycanium Z",
onTakeItem: false,
zMove: "Splintered Stormshards",
zMoveFrom: "Stone Edge",
itemUser: ["Lycanroc", "Lycanroc-Midnight", "Lycanroc-Dusk"],
isNonstandard: "Past",
},

machobrace: {
name: "Macho Brace",
fling: {
basePower: 60,
},
onModifySpe(spe) {
return this.chainModify(0.5);
},
isNonstandard: "Past",
},

magmarizer: {
name: "Magmarizer",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

magnet: {
name: "Magnet",
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Electric') {
return this.chainModify([4915, 4096]);
}
},
},

magoberry: {
name: "Mago Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

magostberry: {
name: "Magost Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Rock",
},
onEat: false,
isNonstandard: "Past",
},

mail: {
name: "Mail",
onTakeItem(item, source) {
if (!this.activeMove) return false;
if (this.activeMove.id !== 'knockoff' && this.activeMove.id !== 'thief' && this.activeMove.id !== 'covet') return false;
},
isNonstandard: "Past",
},

maliciousarmor: {
name: "Malicious Armor",
},

manectite: {
name: "Manectite",
megaStone: "Manectric-Mega",
megaEvolves: "Manectric",
itemUser: ["Manectric"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

marangaberry: {
name: "Maranga Berry",
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
isNonstandard: "Unobtainable",
},

marshadiumz: {
name: "Marshadium Z",
onTakeItem: false,
zMove: "Soul-Stealing 7-Star Strike",
zMoveFrom: "Spectral Thief",
itemUser: ["Marshadow"],
isNonstandard: "Past",
},

masterball: {
name: "Master Ball",
isPokeball: true,
},

mawilite: {
name: "Mawilite",
megaStone: "Mawile-Mega",
megaEvolves: "Mawile",
itemUser: ["Mawile"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

meadowplate: {
name: "Meadow Plate",
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
isNonstandard: "Unobtainable",
},

medichamite: {
name: "Medichamite",
megaStone: "Medicham-Mega",
megaEvolves: "Medicham",
itemUser: ["Medicham"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

mentalherb: {
name: "Mental Herb",
fling: {
basePower: 10,
effect(pokemon) {
const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'];
for (const firstCondition of conditions) {
if (pokemon.volatiles[firstCondition]) {
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
},

metagrossite: {
name: "Metagrossite",
megaStone: "Metagross-Mega",
megaEvolves: "Metagross",
itemUser: ["Metagross"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

metalcoat: {
name: "Metal Coat",
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Steel') {
return this.chainModify([4915, 4096]);
}
},
},

metalpowder: {
name: "Metal Powder",
fling: {
basePower: 10,
},
onModifyDefPriority: 2,
onModifyDef(def, pokemon) {
if (pokemon.species.name === 'Ditto' && !pokemon.transformed) {
return this.chainModify(2);
}
},
itemUser: ["Ditto"],
isNonstandard: "Past",
},

metronome: {
name: "Metronome",
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
},

mewniumz: {
name: "Mewnium Z",
onTakeItem: false,
zMove: "Genesis Supernova",
zMoveFrom: "Psychic",
itemUser: ["Mew"],
isNonstandard: "Past",
},

mewtwonitex: {
name: "Mewtwonite X",
megaStone: "Mewtwo-Mega-X",
megaEvolves: "Mewtwo",
itemUser: ["Mewtwo"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

mewtwonitey: {
name: "Mewtwonite Y",
megaStone: "Mewtwo-Mega-Y",
megaEvolves: "Mewtwo",
itemUser: ["Mewtwo"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

micleberry: {
name: "Micle Berry",
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
isNonstandard: "Unobtainable",
},

mimikiumz: {
name: "Mimikium Z",
onTakeItem: false,
zMove: "Let's Snuggle Forever",
zMoveFrom: "Play Rough",
itemUser: ["Mimikyu", "Mimikyu-Busted", "Mimikyu-Totem", "Mimikyu-Busted-Totem"],
isNonstandard: "Past",
},

mindplate: {
name: "Mind Plate",
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
isNonstandard: "Unobtainable",
},

miracleseed: {
name: "Miracle Seed",
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Grass') {
return this.chainModify([4915, 4096]);
}
},
},

mirrorherb: {
name: "Mirror Herb",
fling: {
basePower: 10,
},
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
},

mistyseed: {
name: "Misty Seed",
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
},

moonball: {
name: "Moon Ball",
isPokeball: true,
},

moonstone: {
name: "Moon Stone",
fling: {
basePower: 30,
},
},

muscleband: {
name: "Muscle Band",
fling: {
basePower: 10,
},
onBasePowerPriority: 16,
onBasePower(basePower, user, target, move) {
if (move.category === 'Physical') {
return this.chainModify([4505, 4096]);
}
},
},

mysticwater: {
name: "Mystic Water",
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Water') {
return this.chainModify([4915, 4096]);
}
},
},

nanabberry: {
name: "Nanab Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Water",
},
onEat: false,
isNonstandard: "Past",
},

nestball: {
name: "Nest Ball",
isPokeball: true,
},

netball: {
name: "Net Ball",
isPokeball: true,
},

nevermeltice: {
name: "Never-Melt Ice",
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Ice') {
return this.chainModify([4915, 4096]);
}
},
},

nomelberry: {
name: "Nomel Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Dragon",
},
onEat: false,
isNonstandard: "Past",
},

normalgem: {
name: "Normal Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status' || move.flags['pledgecombo']) return;
if (move.type === 'Normal' && source.useItem()) {
source.addVolatile('gem');
}
},
},

normaliumz: {
name: "Normalium Z",
onTakeItem: false,
zMove: true,
zMoveType: "Normal",
isNonstandard: "Past",
},

occaberry: {
name: "Occa Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

oddincense: {
name: "Odd Incense",
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Psychic') {
return this.chainModify([4915, 4096]);
}
},
isNonstandard: "Past",
},

oldamber: {
name: "Old Amber",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

oranberry: {
name: "Oran Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

ovalstone: {
name: "Oval Stone",
fling: {
basePower: 100,
},
},

pamtreberry: {
name: "Pamtre Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Steel",
},
onEat: false,
isNonstandard: "Past",
},

parkball: {
name: "Park Ball",
isPokeball: true,
isNonstandard: "Unobtainable",
},

passhoberry: {
name: "Passho Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

payapaberry: {
name: "Payapa Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

pechaberry: {
name: "Pecha Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

persimberry: {
name: "Persim Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

petayaberry: {
name: "Petaya Berry",
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
},

pidgeotite: {
name: "Pidgeotite",
megaStone: "Pidgeot-Mega",
megaEvolves: "Pidgeot",
itemUser: ["Pidgeot"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

pikaniumz: {
name: "Pikanium Z",
onTakeItem: false,
zMove: "Catastropika",
zMoveFrom: "Volt Tackle",
itemUser: ["Pikachu"],
isNonstandard: "Past",
},

pikashuniumz: {
name: "Pikashunium Z",
onTakeItem: false,
zMove: "10,000,000 Volt Thunderbolt",
zMoveFrom: "Thunderbolt",
itemUser: ["Pikachu-Original", "Pikachu-Hoenn", "Pikachu-Sinnoh", "Pikachu-Unova", "Pikachu-Kalos", "Pikachu-Alola", "Pikachu-Partner"],
isNonstandard: "Past",
},

pinapberry: {
name: "Pinap Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Grass",
},
onEat: false,
isNonstandard: "Past",
},

pinsirite: {
name: "Pinsirite",
megaStone: "Pinsir-Mega",
megaEvolves: "Pinsir",
itemUser: ["Pinsir"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

pixieplate: {
name: "Pixie Plate",
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
isNonstandard: "Unobtainable",
},

plumefossil: {
name: "Plume Fossil",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

poisonbarb: {
name: "Poison Barb",
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
},

poisongem: {
name: "Poison Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status') return;
if (move.type === 'Poison' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

poisonmemory: {
name: "Poison Memory",
onMemory: 'Poison',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Poison",
itemUser: ["Silvally-Poison"],
isNonstandard: "Past",
},

poisoniumz: {
name: "Poisonium Z",
onPlate: 'Poison',
onTakeItem: false,
zMove: true,
zMoveType: "Poison",
forcedForme: "Arceus-Poison",
isNonstandard: "Past",
},

pokeball: {
name: "Poke Ball",
isPokeball: true,
},

pomegberry: {
name: "Pomeg Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Ice",
},
onEat: false,
},

poweranklet: {
name: "Power Anklet",
fling: {
basePower: 70,
},
onModifySpe(spe) {
return this.chainModify(0.5);
},
},

powerband: {
name: "Power Band",
fling: {
basePower: 70,
},
onModifySpe(spe) {
return this.chainModify(0.5);
},
},

powerbelt: {
name: "Power Belt",
fling: {
basePower: 70,
},
onModifySpe(spe) {
return this.chainModify(0.5);
},
},

powerbracer: {
name: "Power Bracer",
fling: {
basePower: 70,
},
onModifySpe(spe) {
return this.chainModify(0.5);
},
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
fling: {
basePower: 10,
},
},

powerlens: {
name: "Power Lens",
fling: {
basePower: 70,
},
onModifySpe(spe) {
return this.chainModify(0.5);
},
},

powerweight: {
name: "Power Weight",
fling: {
basePower: 70,
},
onModifySpe(spe) {
return this.chainModify(0.5);
},
},

premierball: {
name: "Premier Ball",
isPokeball: true,
},

primariumz: {
name: "Primarium Z",
onTakeItem: false,
zMove: "Oceanic Operetta",
zMoveFrom: "Sparkling Aria",
itemUser: ["Primarina"],
isNonstandard: "Past",
},

prismscale: {
name: "Prism Scale",
fling: {
basePower: 30,
},
isNonstandard: "Past",
},

protectivepads: {
name: "Protective Pads",
fling: {
basePower: 30,
},
// protective effect handled in Battle#checkMoveMakesContact
},

protector: {
name: "Protector",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

psychicgem: {
name: "Psychic Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status') return;
if (move.type === 'Psychic' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

psychicmemory: {
name: "Psychic Memory",
onMemory: 'Psychic',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Psychic",
itemUser: ["Silvally-Psychic"],
isNonstandard: "Past",
},

psychicseed: {
name: "Psychic Seed",
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
},

psychiumz: {
name: "Psychium Z",
onPlate: 'Psychic',
onTakeItem: false,
zMove: true,
zMoveType: "Psychic",
forcedForme: "Arceus-Psychic",
isNonstandard: "Past",
},

punchingglove: {
name: "Punching Glove",
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
},

qualotberry: {
name: "Qualot Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Poison",
},
onEat: false,
},

quickball: {
name: "Quick Ball",
isPokeball: true,
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
fling: {
basePower: 100,
},
},

quickpowder: {
name: "Quick Powder",
fling: {
basePower: 10,
},
onModifySpe(spe, pokemon) {
if (pokemon.species.name === 'Ditto' && !pokemon.transformed) {
return this.chainModify(2);
}
},
itemUser: ["Ditto"],
isNonstandard: "Past",
},

rabutaberry: {
name: "Rabuta Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Ghost",
},
onEat: false,
isNonstandard: "Past",
},

rarebone: {
name: "Rare Bone",
fling: {
basePower: 100,
},
},

rawstberry: {
name: "Rawst Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

razorclaw: {
name: "Razor Claw",
fling: {
basePower: 100,
},
onModifyCritRatio(critRatio) {
return critRatio + 1;
},
},

razorfang: {
name: "Razor Fang",
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
isNonstandard: "Past",
},

razzberry: {
name: "Razz Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Steel",
},
onEat: false,
isNonstandard: "Past",
},

reapercloth: {
name: "Reaper Cloth",
fling: {
basePower: 10,
},
isNonstandard: "Past",
},

redcard: {
name: "Red Card",
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
},

redorb: {
name: "Red Orb",
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
isNonstandard: "Past",
},

repeatball: {
name: "Repeat Ball",
isPokeball: true,
},

ribbonsweet: {
name: "Ribbon Sweet",
fling: {
basePower: 10,
},
isNonstandard: "Past",
},

rindoberry: {
name: "Rindo Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

ringtarget: {
name: "Ring Target",
fling: {
basePower: 10,
},
onNegateImmunity: false,
},

rockgem: {
name: "Rock Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status') return;
if (move.type === 'Rock' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

rockincense: {
name: "Rock Incense",
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Rock') {
return this.chainModify([4915, 4096]);
}
},
isNonstandard: "Past",
},

rockmemory: {
name: "Rock Memory",
onMemory: 'Rock',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Rock",
itemUser: ["Silvally-Rock"],
isNonstandard: "Past",
},

rockiumz: {
name: "Rockium Z",
onPlate: 'Rock',
onTakeItem: false,
zMove: true,
zMoveType: "Rock",
forcedForme: "Arceus-Rock",
isNonstandard: "Past",
},

rockyhelmet: {
name: "Rocky Helmet",
fling: {
basePower: 60,
},
onDamagingHitOrder: 2,
onDamagingHit(damage, target, source, move) {
if (this.checkMoveMakesContact(move, source, target)) {
this.damage(source.baseMaxhp / 6, source, target);
}
},
},

roomservice: {
name: "Room Service",
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
},

rootfossil: {
name: "Root Fossil",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

roseincense: {
name: "Rose Incense",
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Grass') {
return this.chainModify([4915, 4096]);
}
},
isNonstandard: "Past",
},

roseliberry: {
name: "Roseli Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

rowapberry: {
name: "Rowap Berry",
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
isNonstandard: "Unobtainable",
},

rustedshield: {
name: "Rusted Shield",
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 889) || pokemon.baseSpecies.num === 889) {
return false;
}
return true;
},
itemUser: ["Zamazenta-Crowned"],
isNonstandard: "Unobtainable",
},

rustedsword: {
name: "Rusted Sword",
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 888) || pokemon.baseSpecies.num === 888) {
return false;
}
return true;
},
itemUser: ["Zacian-Crowned"],
isNonstandard: "Unobtainable",
},

sablenite: {
name: "Sablenite",
megaStone: "Sableye-Mega",
megaEvolves: "Sableye",
itemUser: ["Sableye"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

sachet: {
name: "Sachet",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

safariball: {
name: "Safari Ball",
isPokeball: true,
isNonstandard: "Unobtainable",
},

safetygoggles: {
name: "Safety Goggles",
fling: {
basePower: 100,
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
},

sailfossil: {
name: "Sail Fossil",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

salacberry: {
name: "Salac Berry",
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
},

salamencite: {
name: "Salamencite",
megaStone: "Salamence-Mega",
megaEvolves: "Salamence",
itemUser: ["Salamence"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

sceptilite: {
name: "Sceptilite",
megaStone: "Sceptile-Mega",
megaEvolves: "Sceptile",
itemUser: ["Sceptile"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

scizorite: {
name: "Scizorite",
megaStone: "Scizor-Mega",
megaEvolves: "Scizor",
itemUser: ["Scizor"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

scopelens: {
name: "Scope Lens",
fling: {
basePower: 30,
},
onModifyCritRatio(critRatio) {
return critRatio + 1;
},
},

seaincense: {
name: "Sea Incense",
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Water') {
return this.chainModify([4915, 4096]);
}
},
isNonstandard: "Past",
},

sharpbeak: {
name: "Sharp Beak",
fling: {
basePower: 50,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move && move.type === 'Flying') {
return this.chainModify([4915, 4096]);
}
},
},

sharpedonite: {
name: "Sharpedonite",
megaStone: "Sharpedo-Mega",
megaEvolves: "Sharpedo",
itemUser: ["Sharpedo"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

shedshell: {
name: "Shed Shell",
fling: {
basePower: 10,
},
onTrapPokemonPriority: -10,
onTrapPokemon(pokemon) {
pokemon.trapped = pokemon.maybeTrapped = false;
},
},

shellbell: {
name: "Shell Bell",
fling: {
basePower: 30,
},
onAfterMoveSecondarySelfPriority: -1,
onAfterMoveSecondarySelf(pokemon, target, move) {
if (move.totalDamage && !pokemon.forceSwitchFlag) {
this.heal(move.totalDamage / 8, pokemon);
}
},
},

shinystone: {
name: "Shiny Stone",
fling: {
basePower: 100,
},
},

shockdrive: {
name: "Shock Drive",
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
return false;
}
return true;
},
onDrive: 'Electric',
forcedForme: "Genesect-Shock",
itemUser: ["Genesect-Shock"],
isNonstandard: "Past",
},

shucaberry: {
name: "Shuca Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

silkscarf: {
name: "Silk Scarf",
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Normal') {
return this.chainModify([4915, 4096]);
}
},
},

silverpowder: {
name: "Silver Powder",
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Bug') {
return this.chainModify([4915, 4096]);
}
},
},

sitrusberry: {
name: "Sitrus Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

skullfossil: {
name: "Skull Fossil",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

skyplate: {
name: "Sky Plate",
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
isNonstandard: "Unobtainable",
},

slowbronite: {
name: "Slowbronite",
megaStone: "Slowbro-Mega",
megaEvolves: "Slowbro",
itemUser: ["Slowbro"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

smoothrock: {
name: "Smooth Rock",
fling: {
basePower: 10,
},
},

snorliumz: {
name: "Snorlium Z",
onTakeItem: false,
zMove: "Pulverizing Pancake",
zMoveFrom: "Giga Impact",
itemUser: ["Snorlax"],
isNonstandard: "Past",
},

snowball: {
name: "Snowball",
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
},

softsand: {
name: "Soft Sand",
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Ground') {
return this.chainModify([4915, 4096]);
}
},
},

solganiumz: {
name: "Solganium Z",
onTakeItem: false,
zMove: "Searing Sunraze Smash",
zMoveFrom: "Sunsteel Strike",
itemUser: ["Solgaleo", "Necrozma-Dusk-Mane"],
isNonstandard: "Past",
},

souldew: {
name: "Soul Dew",
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
isNonstandard: "Past",
},

spelltag: {
name: "Spell Tag",
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Ghost') {
return this.chainModify([4915, 4096]);
}
},
},

spelonberry: {
name: "Spelon Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Dark",
},
onEat: false,
isNonstandard: "Past",
},

splashplate: {
name: "Splash Plate",
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
isNonstandard: "Unobtainable",
},

spookyplate: {
name: "Spooky Plate",
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
isNonstandard: "Unobtainable",
},

sportball: {
name: "Sport Ball",
isPokeball: true,
isNonstandard: "Unobtainable",
},

starfberry: {
name: "Starf Berry",
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
},

starsweet: {
name: "Star Sweet",
fling: {
basePower: 10,
},
isNonstandard: "Past",
},

steelixite: {
name: "Steelixite",
megaStone: "Steelix-Mega",
megaEvolves: "Steelix",
itemUser: ["Steelix"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

steelgem: {
name: "Steel Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status') return;
if (move.type === 'Steel' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

steelmemory: {
name: "Steel Memory",
onMemory: 'Steel',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Steel",
itemUser: ["Silvally-Steel"],
isNonstandard: "Past",
},

steeliumz: {
name: "Steelium Z",
onPlate: 'Steel',
onTakeItem: false,
zMove: true,
zMoveType: "Steel",
forcedForme: "Arceus-Steel",
isNonstandard: "Past",
},

stick: {
name: "Stick",
fling: {
basePower: 60,
},
onModifyCritRatio(critRatio, user) {
if (this.toID(user.baseSpecies.baseSpecies) === 'farfetchd') {
return critRatio + 2;
}
},
itemUser: ["Farfetch\u2019d"],
isNonstandard: "Past",
},

stickybarb: {
name: "Sticky Barb",
fling: {
basePower: 100,
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
},

stoneplate: {
name: "Stone Plate",
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
isNonstandard: "Unobtainable",
},

strangeball: {
name: "Strange Ball",
isPokeball: true,
isNonstandard: "Unobtainable",
},

strawberrysweet: {
name: "Strawberry Sweet",
fling: {
basePower: 10,
},
isNonstandard: "Past",
},

sunstone: {
name: "Sun Stone",
fling: {
basePower: 30,
},
},

swampertite: {
name: "Swampertite",
megaStone: "Swampert-Mega",
megaEvolves: "Swampert",
itemUser: ["Swampert"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

sweetapple: {
name: "Sweet Apple",
fling: {
basePower: 30,
},
},

tamatoberry: {
name: "Tamato Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Psychic",
},
onEat: false,
},

tangaberry: {
name: "Tanga Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

tapuniumz: {
name: "Tapunium Z",
onTakeItem: false,
zMove: "Guardian of Alola",
zMoveFrom: "Nature's Madness",
itemUser: ["Tapu Koko", "Tapu Lele", "Tapu Bulu", "Tapu Fini"],
isNonstandard: "Past",
},

tartapple: {
name: "Tart Apple",
fling: {
basePower: 30,
},
},

terrainextender: {
name: "Terrain Extender",
fling: {
basePower: 60,
},
},

thickclub: {
name: "Thick Club",
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
isNonstandard: "Past",
},

throatspray: {
name: "Throat Spray",
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
},

thunderstone: {
name: "Thunder Stone",
fling: {
basePower: 30,
},
},

timerball: {
name: "Timer Ball",
isPokeball: true,
},

toxicorb: {
name: "Toxic Orb",
fling: {
basePower: 30,
status: 'tox',
},
onResidualOrder: 28,
onResidualSubOrder: 3,
onResidual(pokemon) {
pokemon.trySetStatus('tox', pokemon);
},
},

toxicplate: {
name: "Toxic Plate",
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
isNonstandard: "Unobtainable",
},

twistedspoon: {
name: "Twisted Spoon",
fling: {
basePower: 30,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Psychic') {
return this.chainModify([4915, 4096]);
}
},
},

tyranitarite: {
name: "Tyranitarite",
megaStone: "Tyranitar-Mega",
megaEvolves: "Tyranitar",
itemUser: ["Tyranitar"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

ultraball: {
name: "Ultra Ball",
isPokeball: true,
},

ultranecroziumz: {
name: "Ultranecrozium Z",
onTakeItem: false,
zMove: "Light That Burns the Sky",
zMoveFrom: "Photon Geyser",
itemUser: ["Necrozma-Ultra"],
isNonstandard: "Past",
},

upgrade: {
name: "Up-Grade",
fling: {
basePower: 30,
},
isNonstandard: "Past",
},

utilityumbrella: {
name: "Utility Umbrella",
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
},

venusaurite: {
name: "Venusaurite",
megaStone: "Venusaur-Mega",
megaEvolves: "Venusaur",
itemUser: ["Venusaur"],
onTakeItem(item, source) {
if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
return true;
},
isNonstandard: "Past",
},

wacanberry: {
name: "Wacan Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

watergem: {
name: "Water Gem",
isGem: true,
onSourceTryPrimaryHit(target, source, move) {
if (target === source || move.category === 'Status' || move.flags['pledgecombo']) return;
if (move.type === 'Water' && source.useItem()) {
source.addVolatile('gem');
}
},
isNonstandard: "Past",
},

watermemory: {
name: "Water Memory",
onMemory: 'Water',
onTakeItem(item, pokemon, source) {
if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
return false;
}
return true;
},
forcedForme: "Silvally-Water",
itemUser: ["Silvally-Water"],
isNonstandard: "Past",
},

waterstone: {
name: "Water Stone",
fling: {
basePower: 30,
},
},

wateriumz: {
name: "Waterium Z",
onPlate: 'Water',
onTakeItem: false,
zMove: true,
zMoveType: "Water",
forcedForme: "Arceus-Water",
isNonstandard: "Past",
},

watmelberry: {
name: "Watmel Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Fire",
},
onEat: false,
isNonstandard: "Past",
},

waveincense: {
name: "Wave Incense",
fling: {
basePower: 10,
},
onBasePowerPriority: 15,
onBasePower(basePower, user, target, move) {
if (move.type === 'Water') {
return this.chainModify([4915, 4096]);
}
},
isNonstandard: "Past",
},

weaknesspolicy: {
name: "Weakness Policy",
fling: {
basePower: 100,
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
},

wepearberry: {
name: "Wepear Berry",
isBerry: true,
naturalGift: {
basePower: 100,
type: "Electric",
},
onEat: false,
isNonstandard: "Past",
},

whippeddream: {
name: "Whipped Dream",
fling: {
basePower: 100,
},
isNonstandard: "Past",
},

whiteherb: {
name: "White Herb",
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
},

widelens: {
name: "Wide Lens",
fling: {
basePower: 10,
},
onSourceModifyAccuracyPriority: -2,
onSourceModifyAccuracy(accuracy) {
if (typeof accuracy === 'number') {
return this.chainModify([4505, 4096]);
}
},
},

wikiberry: {
name: "Wiki Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

wiseglasses: {
name: "Wise Glasses",
fling: {
basePower: 10,
},
onBasePowerPriority: 16,
onBasePower(basePower, user, target, move) {
if (move.category === 'Special') {
return this.chainModify([4505, 4096]);
}
},
},

yacheberry: {
name: "Yache Berry",
isBerry: true,
naturalGift: {
basePower: 100,
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
},

zapplate: {
name: "Zap Plate",
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
isNonstandard: "Unobtainable",
},

zoomlens: {
name: "Zoom Lens",
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
},

};