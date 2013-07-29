exports.BattleAbilities = {
"angerpoint": {
desc: "If this Pokemon, or its Substitute, is struck by a Critical Hit, its Attack is boosted to six stages.",
shortDesc: "If this Pokemon (not a Substitute) is hit by a critical hit, its Attack is boosted by 12.",
onCriticalHit: function(target) {
if (!target.volatiles['substitute']) {
target.setBoost({atk: 6});
this.add('-setboost',target,'atk',12,'[from] ability: Anger Point');
}
},
id: "angerpoint",
name: "Anger Point",
rating: 2,
num: 83
},
"baddreams": {
desc: "If asleep, each of this Pokemon's opponents receives damage equal to one-eighth of its max HP.",
shortDesc: "Causes sleeping adjacent foes to lose 1/8 of their max HP at the end of each turn.",
onResidualOrder: 26,
onResidualSubOrder: 1,
onResidual: function(pokemon) {
for (var i=0; i<pokemon.side.foe.active.length; i++) {
var target = pokemon.side.foe.active[i];
if (pokemon.hp && target.status === 'slp') {
this.damage(target.maxhp/8, target);
}
}
},
id: "baddreams",
name: "Bad Dreams",
rating: 2,
num: 123
},
"contrary": {
desc: "Stat changes are inverted.",
shortDesc: "If this Pokemon has a stat boosted it is lowered instead, and vice versa.",
onBoost: function(boost) {
for (var i in boost) {
boost[i] *= -1;
}
},
id: "contrary",
name: "Contrary",
rating: 4,
num: 126
},
"cursedbody": {
desc: "30% chance of disabling one of the opponent's moves when attacked. This works even if the attacker is behind a Substitute, but will not activate if the Pokemon with Cursed Body is behind a Substitute.",
shortDesc: "If this Pokemon is hit by an attack, there is a 30% chance that move gets Disabled.",
onAfterDamage: function(damage, target, source, move) {
if (!source || source.volatiles['disable']) return;
if (source !== target && move && move.effectType === 'Move') {
if (this.random(10) < 3) {
source.addVolatile('disable');
}
}
},
id: "cursedbody",
name: "Cursed Body",
rating: 2,
num: 130
},
id: "guts",
name: "Guts",
rating: 3,
num: 62
},
"hugepower": {
desc: "This Pokemon's Attack stat is doubled. Therefore, if this Pokemon's Attack stat on the status screen is 200, it effectively has an Attack stat of 400; which is then subject to the full range of stat boosts and reductions.",
shortDesc: "This Pokemon's Attack is doubled.",
onModifyAtk: function(atk) {
return atk * 2;
},
id: "hugepower",
name: "Huge Power",
rating: 5,
num: 37
},
"hustle": {
desc: "This Pokemon's Attack receives a 50% boost but its Physical attacks receive a 20% drop in Accuracy. For example, a 100% accurate move would become an 80% accurate move. The accuracy of moves that never miss, such as Aerial Ace, remains unaffected.",
shortDesc: "This Pokemon's Attack is 1.5x and accuracy of its physical attacks is 0.8x.",
onModifyAtk: function(atk) {
return atk * 1.5;
},
onModifyMove: function(move) {
if (move.category === 'Physical' && typeof move.accuracy === 'number') {
move.accuracy *= 0.8;
}
},
id: "hustle",
name: "Hustle",
rating: 3,
num: 55
},
"imposter": {
desc: "As soon as the user comes into battle, it Transforms into its opponent, copying the opponent's stats exactly, with the exception of HP. Imposter copies all stat changes on the target originating from moves and abilities such as Swords Dance and Intimidate, but not from items such as Choice Specs. Imposter will not Transform the user if the opponent is an Illusion or if the opponent is behind a Substitute.",
shortDesc: "On switch-in, this Pokemon copies the foe it's facing; stats, moves, types, Ability.",
onStart: function(pokemon) {
var target = pokemon.side.foe.active[pokemon.side.foe.active.length-1-pokemon.position];
if (target && pokemon.transformInto(target, pokemon)) {
this.add('-transform', pokemon, target);
}
},
id: "imposter",
name: "Imposter",
rating: 5,
num: 150
},
"insomnia": {
desc: "This Pokemon cannot be put to sleep; this includes both opponent-induced sleep as well as user-induced sleep via Rest.",
shortDesc: "This Pokemon cannot fall asleep. Gaining this Ability while asleep cures it.",
onUpdate: function(pokemon) {
if (pokemon.status === 'slp') {
pokemon.cureStatus();
}
},
onImmunity: function(type, pokemon) {
if (type === 'slp') return false;
},
id: "insomnia",
name: "Insomnia",
rating: 2,
num: 15
},
"intimidate": {
desc: "When this Pokemon enters the field, the Attack stat of each of its opponents lowers by one stage.",
shortDesc: "On switch-in, this Pokemon lowers adjacent foes' Attack by 1.",
onStart: function(pokemon) {
var foeactive = pokemon.side.foe.active;
for (var i=0; i<foeactive.length; i++) {
if (!foeactive[i] || foeactive[i].fainted) continue;
if (foeactive[i].volatiles['substitute']) {
// does it give a message?
this.add('-activate',foeactive[i],'Substitute','ability: Intimidate','[of] '+pokemon);
} else {
this.add('-ability',pokemon,'Intimidate','[of] '+foeactive[i]);
this.boost({atk: -1}, foeactive[i], pokemon);
}
}
},
id: "intimidate",
name: "Intimidate",
rating: 4,
num: 22
},
"ironbarbs": {
desc: "All moves that make contact with the Pokemon with Iron Barbs will damage the user by 1/8 of their maximum HP after damage is dealt.",
shortDesc: "This Pokemon causes other Pokemon making contact to lose 1/8 of their max HP.",
onAfterDamageOrder: 1,
onAfterDamage: function(damage, target, source, move) {
if (source && source !== target && move && move.isContact) {
this.damage(source.maxhp/8, source, target);
}
},
"levitate": {
desc: "This Pokemon is immune to Ground-type attacks, Spikes, Toxic Spikes and the Arena Trap ability; it loses these immunities while holding Iron Ball, after using Ingrain or if Gravity is in effect.",
shortDesc: "This Pokemon is immune to Ground; Gravity, Ingrain, Smack Down, Iron Ball nullify it.",
onImmunity: function(type) {
if (type === 'Ground') return false;
},
id: "levitate",
name: "Levitate",
rating: 3.5,
num: 26
},
id: "moldbreaker",
name: "Mold Breaker",
rating: 3,
num: 104
},
"moody": {
desc: "Causes the Pokemon to raise one of its stats by two stages, while another stat is lowered by one stage at the end of each turn. These stats include accuracy and evasion.",
shortDesc: "Boosts a random stat by 2 and lowers another stat by 1 at the end of each turn.",
onResidualOrder: 26,
onResidualSubOrder: 1,
onResidual: function(pokemon) {
var stats = [], i = '';
var boost = {};
for (var i in pokemon.boosts) {
if (pokemon.boosts[i] < 6) {
stats.push(i);
}
}
if (stats.length) {
i = stats[this.random(stats.length)];
boost[i] = 2;
}
stats = [];
for (var j in pokemon.boosts) {
if (pokemon.boosts[j] > -6 && j !== i) {
stats.push(j);
}
}
if (stats.length) {
i = stats[this.random(stats.length)];
boost[i] = -1;
}
this.boost(boost);
},
id: "moody",
name: "Moody",
rating: 5,
num: 141
},
"moxie": {
desc: "When a Pokemon with Moxie faints another Pokemon, its Attack rises by one stage.",
shortDesc: "This Pokemon's Attack is boosted by 1 if it attacks and faints another Pokemon.",
onSourceFaint: function(target, source, effect) {
if (effect && effect.effectType === 'Move') {
this.boost({atk:1}, source);
}
},
id: "moxie",
name: "Moxie",
rating: 4,
num: 153
},
"noguard": {
desc: "Every attack used by or against this Pokemon will always hit.",
shortDesc: "Every move used by or against this Pokemon will always hit.",
onModifyMove: function(move) {
move.accuracy = true;
move.alwaysHit = true;
},
onSourceModifyMove: function(move) {
move.accuracy = true;
move.alwaysHit = true;
},
id: "noguard",
name: "No Guard",
rating: 4.5,
num: 99
},
"oblivious": {
desc: "This Pokemon cannot become attracted to another Pokemon.",
shortDesc: "This Pokemon cannot be infatuated. Gaining this Ability while infatuated cures it.",
onUpdate: function(pokemon) {
if (pokemon.volatiles['attract']) {
pokemon.removeVolatile('attract');
this.add("-message", pokemon.name+" got over its infatuation. (placeholder)");
}
},
onImmunity: function(type, pokemon) {
if (type === 'attract') {
this.add('-immune', pokemon, '[from] Oblivious');
return false;
}
},
onTryHit: function(pokemon, target, move) {
if (move.id === 'captivate') {
this.add('-immune', pokemon, '[msg]', '[from] Oblivious');
return null;
}
},
id: "oblivious",
name: "Oblivious",
rating: 0.5,
num: 12
},
"pickpocket": {
desc: "Steals attacking Pokemon's held item on contact.",
shortDesc: "If this Pokemon has no item, it steals an item off a Pokemon making contact.",
onAfterDamage: function(damage, target, source, move) {
if (source && source !== target && move && move.isContact) {
if (target.item) {
return;
}
var yourItem = source.takeItem(target);
if (!yourItem) {
return;
}
if (!target.setItem(yourItem)) {
source.item = yourItem.id;
return;
}
this.add('-item', target, yourItem, '[from] ability: Pickpocket');
}
},
id: "pickpocket",
name: "Pickpocket",
rating: 1,
num: 124
},
"poisontouch": {
desc: "The contact-based attacks from a Pokemon with Poison Touch have a 30% chance of poisoning the target.",
shortDesc: "This Pokemon's contact moves have a 30% chance of poisoning.",
// upokecenter says this is implemented as an added secondary effect
onModifyMove: function(move) {
if (!move || !move.isContact) return;
if (!move.secondaries) {
move.secondaries = [];
}
move.secondaries.push({
chance: 30,
status: 'psn'
});
},
id: "poisontouch",
name: "Poison Touch",
rating: 2,
num: 143
},
"prankster": {
desc: "Increases the priority of non-damaging moves by 1.",
shortDesc: "This Pokemon's non-damaging moves have their priority increased by 1.",
onModifyPriority: function(priority, pokemon, target, move) {
if (move && move.category === 'Status') {
return priority + 1;
}
},
id: "prankster",
name: "Prankster",
rating: 4.5,
num: 158
},
"quickfeet": {
desc: "When this Pokemon is poisoned (including Toxic), burned, paralyzed, asleep (including self-induced Rest) or frozen, its Speed stat receives a 50% boost; the paralysis status' Speed drop is also ignored.",
shortDesc: "If this Pokemon is statused, its Speed is 1.5x; paralysis' Speed drop is ignored.",
onModifySpe: function(spe, pokemon) {
if (pokemon.status) {
return spe * 1.5;
}
},
id: "quickfeet",
name: "Quick Feet",
rating: 3,
num: 95
},
"rattled": {
desc: "Raises the user's Speed one stage when hit by a Dark-, Bug-, or Ghost-type move.",
shortDesc: "This Pokemon's Speed is boosted by 1 if hit by a Dark-, Bug-, or Ghost-type attack.",
onAfterDamage: function(damage, target, source, effect) {
if (effect && (effect.type === 'Dark' || effect.type === 'Bug' || effect.type === 'Ghost')) {
this.boost({spe:1});
}
},
id: "rattled",
name: "Rattled",
rating: 2,
num: 155
},
"rivalry": {
desc: "Increases base power of Physical and Special attacks by 25% if the opponent is the same gender, but decreases base power by 25% if opponent is the opposite gender.",
shortDesc: "This Pokemon's attacks do 1.25x on same gender targets; 0.75x on opposite gender.",
onBasePower: function(basePower, attacker, defender, move) {
if (attacker.gender && defender.gender) {
if (attacker.gender === defender.gender) {
this.debug('Rivalry boost');
return basePower * 5/4;
} else {
this.debug('Rivalry weaken');
return basePower * 3/4;
}
}
},
id: "rivalry",
name: "Rivalry",
rating: 0.5,
num: 79
},
"scrappy": {
desc: "This Pokemon has the ability to hit Ghost-type Pokemon with Normal-type and Fighting-type moves. Effectiveness of these moves takes into account the Ghost-type Pokemon's other weaknesses and resistances.",
shortDesc: "This Pokemon can hit Ghost-types with Normal- and Fighting-type moves.",
onFoeModifyPokemon: function(pokemon) {
if (pokemon.hasType('Ghost')) {
pokemon.negateImmunity['Normal'] = true;
pokemon.negateImmunity['Fighting'] = true;
}
},
id: "scrappy",
name: "Scrappy",
rating: 3,
num: 113
},
"shadowtag": {
desc: "When this Pokemon enters the field, its opponents cannot switch or flee the battle unless they have the same ability, are holding Shed Shell, or they use the moves Baton Pass or U-Turn.",
shortDesc: "Prevents foes from switching out normally unless they also have this Ability.",
onFoeModifyPokemon: function(pokemon) {
if (pokemon.ability !== 'shadowtag') {
pokemon.trapped = true;
}
},
onFoeMaybeTrapPokemon: function(pokemon) {
if (pokemon.ability !== 'shadowtag') {
pokemon.maybeTrapped = true;
}
},
id: "shadowtag",
name: "Shadow Tag",
rating: 5,
num: 23
},
"slowstart": {
desc: "After this Pokemon switches into the battle, its Attack and Speed stats are halved for five turns; for example, if this Pokemon has an Attack stat of 400, it will effectively have an Attack stat of 200 until the effects of Slow Start wear off.",
shortDesc: "On switch-in, this Pokemon's Attack and Speed are halved for 5 turns.",
onStart: function(pokemon) {
pokemon.addVolatile('slowstart');
},
effect: {
duration: 5,
onStart: function(target) {
this.add('-start', target, 'Slow Start');
},
onModifyAtk: function(atk, pokemon) {
if (pokemon.ability !== 'slowstart') {
pokemon.removeVolatile('slowstart');
return;
}
return atk / 2;
},
onModifySpe: function(spe, pokemon) {
if (pokemon.ability !== 'slowstart') {
pokemon.removeVolatile('slowstart');
return;
}
return spe / 2;
},
onEnd: function(target) {
this.add('-end', target, 'Slow Start');
}
},
id: "slowstart",
name: "Slow Start",
rating: -2,
num: 112
},
"soundproof": {
desc: "This Pokemon is immune to the effects of the sound-related moves Bug Buzz, Chatter, Echoed Voice, Grasswhistle, Growl, Heal Bell, Hyper Voice, Metal Sound, Perish Song, Relic Song, Roar, Round, Screech, Sing, Snarl, Snore, Supersonic, and Uproar.",
shortDesc: "This Pokemon is immune to sound-based moves, except Heal Bell.",
onTryHit: function(target, source, move) {
if (target !== source && move.isSoundBased) {
this.add('-immune', target, '[msg]');
return null;
}
},
id: "soundproof",
name: "Soundproof",
rating: 2,
num: 43
},
"speedboost": {
desc: "While this Pokemon is active, its Speed increases by one stage at the end of every turn; the six stage maximum for stat boosts is still in effect.",
shortDesc: "This Pokemon's Speed is boosted by 1 at the end of each full turn on the field.",
onResidualOrder: 26,
onResidualSubOrder: 1,
onResidual: function(pokemon) {
if (pokemon.activeTurns) {
this.boost({spe:1});
}
},
id: "speedboost",
name: "Speed Boost",
rating: 4.5,
num: 3
},
"stall": {
desc: "This Pokemon attacks last in its priority bracket.",
shortDesc: "This Pokemon moves last among Pokemon using the same or greater priority moves.",
onModifyPriority: function(priority) {
return priority - 0.1;
},
id: "stench",
name: "Stench",
rating: 0,
num: 1
},
"stickyhold": {
desc: "Opponents cannot remove items from this Pokemon.",
shortDesc: "This Pokemon cannot lose its held item due to another Pokemon's attack.",
onTakeItem: function(item, pokemon, source) {
if (source && source !== pokemon) return false;
},
id: "stickyhold",
name: "Sticky Hold",
rating: 1,
num: 60
},
"superluck": {
desc: "Raises the chance of this Pokemon scoring a Critical Hit.",
shortDesc: "This Pokemon's critical hit ratio is boosted by 1.",
onModifyMove: function(move) {
move.critRatio++;
},
id: "superluck",
name: "Super Luck",
rating: 1,
num: 105
},
"swarm": {
desc: "When its health reaches one-third or less of its max HP, this Pokemon's Bug-type attacks receive a 50% boost in power.",
shortDesc: "When this Pokemon has 1/3 or less of its max HP, its Bug attacks do 1.5x damage.",
onBasePower: function(basePower, attacker, defender, move) {
if (move.type === 'Bug' && attacker.hp <= attacker.maxhp/3) {
this.debug('Swarm boost');
return basePower * 1.5;
}
},
id: "swarm",
name: "Swarm",
rating: 2,
num: 68
},
"tintedlens": {
desc: "Doubles the power of moves that are Not Very Effective against opponents.",
shortDesc: "This Pokemon's attacks that are not very effective on a target do double damage.",
onModifyDamage: function(damage, source, target, move) {
if (this.getEffectiveness(move.type, target) < 0) {
this.debug('Tinted Lens boost');
return this.modify(damage, 2);
}
},
id: "tintedlens",
name: "Tinted Lens",
rating: 4,
num: 110
},
"trace": {
desc: "When this Pokemon enters the field, it temporarily copies an opponent's ability (except Multitype). This ability remains with this Pokemon until it leaves the field.",
shortDesc: "On switch-in, or when it can, this Pokemon copies a random adjacent foe's Ability.",
onUpdate: function(pokemon) {
var target = pokemon.side.foe.randomActive();
if (!target) return;
var ability = this.getAbility(target.ability);
var bannedAbilities = {flowergift:1, forecast:1, illusion:1, imposter:1, multitype:1, trace:1, zenmode:1};
if (bannedAbilities[target.ability]) {
return;
}
if (pokemon.setAbility(ability)) {
this.add('-ability',pokemon, ability,'[from] ability: Trace','[of] '+target);
}
},
id: "trace",
name: "Trace",
rating: 3.5,
num: 36
},
"unaware": {
desc: "This Pokemon ignores an opponent's stat boosts for Attack, Defense, Special Attack and Special Defense. These boosts will still be calculated if this Pokemon uses Punishment.",
shortDesc: "This Pokemon ignores other Pokemon's stat changes when taking or doing damage.",
id: "unaware",
name: "Unaware",
onModifyMove: function(move, user, target) {
move.ignoreEvasion = true;
move.ignoreDefensive = true;
},
onSourceModifyMove: function(move, user, target) {
move.ignoreAccuracy = true;
move.ignoreOffensive = true;
},
rating: 2,
num: 109
},
"vitalspirit": {
desc: "This Pokemon cannot be put to sleep; this includes both opponent-induced sleep as well as user-induced sleep via Rest.",
shortDesc: "This Pokemon cannot fall asleep. Gaining this Ability while asleep cures it.",
onUpdate: function(pokemon) {
if (pokemon.status === 'slp') {
pokemon.cureStatus();
}
},
onImmunity: function(type) {
if (type === 'slp') return false;
},
id: "vitalspirit",
name: "Vital Spirit",
rating: 2,
num: 72
},
"whitesmoke": {
desc: "Opponents cannot reduce this Pokemon's stats; they can, however, modify stat changes with Power Swap, Guard Swap and Heart Swap and inflict stat boosts with Swagger and Flatter. This ability does not prevent self-inflicted stat reductions. [Field Effect]\u00a0If this Pokemon is in the lead spot, the rate of wild Pokemon battles decreases by 50%.",
shortDesc: "Prevents other Pokemon from lowering this Pokemon's stat stages.",
onBoost: function(boost, target, source, effect) {
if (source && target === source) return;
var showMsg = false;
for (var i in boost) {
if (boost[i] < 0) {
delete boost[i];
showMsg = true;
}
}
if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: White Smoke", "[of] "+target);
},
id: "whitesmoke",
name: "White Smoke",
rating: 2,
num: 73
},

// CAP
"mountaineer": {
desc: "This Pokémon avoids all Rock-type attacks and hazards when switching in.",
shortDesc: "On switch-in, this Pokemon avoids all Rock-type attacks and Stealth Rock.",
onDamage: function(damage, target, source, effect) {
if (effect && effect.id === 'stealthrock') {
return false;
}
},
onImmunity: function(type, target) {
if (type === 'Rock' && !target.activeTurns) {
return false;
}
},
id: "mountaineer",
isNonstandard: true,
name: "Mountaineer",
rating: 3.5,
num: -2
},
"rebound": {
desc: "It can reflect the effect of status moves when switching in.",
shortDesc: "On switch-in, this Pokemon blocks certain status moves and uses the move itself.",
id: "rebound",
isNonstandard: true,
name: "Rebound",
onTryHitPriority: 1,
onTryHit: function(target, source, move) {
if (this.effectData.target.activeTurns) return;

if (target === source) return;
if (move.hasBounced) return;
if (typeof move.isBounceable === 'undefined') {
move.isBounceable = !!(move.category === 'Status' && (move.status || move.boosts || move.volatileStatus === 'confusion' || move.forceSwitch));
}
if (move.isBounceable) {
var newMove = this.getMoveCopy(move.id);
newMove.hasBounced = true;
this.useMove(newMove, target, source);
return null;
}
},
onAllyTryHitSide: function(target, source, move) {
if (this.effectData.target.activeTurns) return;

if (target.side === source.side) return;
if (move.hasBounced) return;
if (typeof move.isBounceable === 'undefined') {
move.isBounceable = !!(move.category === 'Status' && (move.status || move.boosts || move.volatileStatus === 'confusion' || move.forceSwitch));
}
if (move.isBounceable) {
var newMove = this.getMoveCopy(move.id);
newMove.hasBounced = true;
this.useMove(newMove, target, source);
return null;
}
},
effect: {
duration: 1
},
rating: 4.5,
num: -3
},
"persistent": {
desc: "Increases the duration of many field effects by two turns when used by this Pokémon.",
shortDesc: "The duration of certain field effects is increased by 2 turns if used by this Pokemon.",
id: "persistent",
isNonstandard: true,
name: "Persistent",
// implemented in the corresponding move
rating: 4,
num: -4
}
}; 
