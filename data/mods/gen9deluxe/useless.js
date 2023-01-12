"use strict";
exports.__esModule = true;
exports.checkIsMoveNotUseless = void 0;
var dex = require("@pkmn/dex");
var GOOD_STATUS_MOVES = [
    'acidarmor', 'agility', 'aromatherapy', 'auroraveil', 'autotomize', 'banefulbunker', 'batonpass', 'bellydrum', 'bulkup', 'calmmind', 'chillyreception', 'clangoroussoul', 'coil', 'cottonguard', 'courtchange', 'curse', 'defog', 'destinybond', 'detect', 'disable', 'dragondance', 'encore', 'extremeevoboost', 'filletaway', 'geomancy', 'glare', 'haze', 'healbell', 'healingwish', 'healorder', 'heartswap', 'honeclaws', 'kingsshield', 'leechseed', 'lightscreen', 'lovelykiss', 'lunardance', 'magiccoat', 'maxguard', 'memento', 'milkdrink', 'moonlight', 'morningsun', 'nastyplot', 'naturesmadness', 'noretreat', 'obstruct', 'painsplit', 'partingshot', 'perishsong', 'protect', 'quiverdance', 'recover', 'reflect', 'reflecttype', 'rest', 'revivalblessing', 'roar', 'rockpolish', 'roost', 'shedtail', 'shellsmash', 'shiftgear', 'shoreup', 'silktrap', 'slackoff', 'sleeppowder', 'sleeptalk', 'softboiled', 'spikes', 'spikyshield', 'spore', 'stealthrock', 'stickyweb', 'strengthsap', 'substitute', 'switcheroo', 'swordsdance', 'synthesis', 'tailglow', 'tailwind', 'taunt', 'thunderwave', 'tidyup', 'toxic', 'transform', 'trick', 'victorydance', 'whirlwind', 'willowisp', 'wish', 'yawn',
];
var GOOD_WEAK_MOVES = [
    'accelerock', 'acrobatics', 'aquacutter', 'avalanche', 'barbbarrage', 'bonemerang', 'bouncybubble', 'bulletpunch', 'buzzybuzz', 'ceaselessedge', 'circlethrow', 'clearsmog', 'doubleironbash', 'dragondarts', 'dragontail', 'drainingkiss', 'endeavor', 'facade', 'firefang', 'flipturn', 'flowertrick', 'freezedry', 'frustration', 'geargrind', 'grassknot', 'gyroball', 'icefang', 'iceshard', 'iciclespear', 'infernalparade', 'knockoff', 'lastrespects', 'lowkick', 'machpunch', 'mortalspin', 'mysticalpower', 'naturesmadness', 'nightshade', 'nuzzle', 'pikapapow', 'populationbomb', 'psychocut', 'psyshieldbash', 'pursuit', 'quickattack', 'ragefist', 'rapidspin', 'return', 'rockblast', 'ruination', 'saltcure', 'scorchingsands', 'seismictoss', 'shadowclaw', 'shadowsneak', 'sizzlyslide', 'stoneaxe', 'storedpower', 'stormthrow', 'suckerpunch', 'superfang', 'surgingstrikes', 'tailslap', 'trailblaze', 'tripleaxel', 'tripledive', 'twinbeam', 'uturn', 'veeveevolley', 'voltswitch', 'watershuriken', 'weatherball',
];
var BAD_STRONG_MOVES = [
    'belch', 'burnup', 'crushclaw', 'dragonrush', 'dreameater', 'eggbomb', 'firepledge', 'flyingpress', 'grasspledge', 'hyperbeam', 'hyperfang', 'hyperspacehole', 'jawlock', 'landswrath', 'megakick', 'megapunch', 'mistyexplosion', 'muddywater', 'nightdaze', 'pollenpuff', 'rockclimb', 'selfdestruct', 'shelltrap', 'skyuppercut', 'slam', 'strength', 'submission', 'synchronoise', 'takedown', 'thrash', 'uproar', 'waterpledge',
];
var checkIsMoveNotUseless = function (// only for gen 9
moveID, species, moves, pokemonSet) {
    var _a, _b, _c;
    var abilityid = pokemonSet ? dex.toID(pokemonSet.ability) : '';
    var itemid = pokemonSet ? dex.toID(pokemonSet.item) : '';
    switch (moveID) {
        case 'fakeout':
        case 'flamecharge':
        case 'nuzzle':
        case 'poweruppunch':
            return abilityid !== 'sheerforce';
        case 'solarbeam':
        case 'solarblade':
            return ['desolateland', 'drought', 'chlorophyll', 'orichalcumpulse'].includes(abilityid) || itemid === 'powerherb';
        case 'dynamicpunch':
        case 'grasswhistle':
        case 'inferno':
        case 'sing':
        case 'zapcannon':
            return abilityid === 'noguard';
        case 'heatcrash':
        case 'heavyslam':
            return species.weightkg >= (species.evos ? 75 : 130);
        case 'aerialace':
            return ['technician', 'toughclaws'].includes(abilityid) && !moves.includes('bravebird');
        case 'ancientpower':
            return ['serenegrace', 'technician'].includes(abilityid) || !moves.includes('powergem');
        case 'aquajet':
            return !moves.includes('jetpunch');
        case 'aurawheel':
            return species.baseSpecies === 'Morpeko';
        case 'axekick':
            return !moves.includes('highjumpkick');
        case 'bellydrum':
            return moves.includes('aquajet') || moves.includes('jetpunch') || moves.includes('extremespeed') ||
                ['iceface', 'unburden'].includes(abilityid);
        case 'bulletseed':
            return ['skilllink', 'technician'].includes(abilityid);
        case 'chillingwater':
            return !moves.includes('scald');
        case 'counter':
            return species.baseStats.hp >= 65;
        case 'dualwingbeat':
            return abilityid === 'technician' || !moves.includes('drillpeck');
        case 'feint':
            return abilityid === 'refrigerate';
        case 'grassyglide':
            return abilityid === 'grassysurge';
        case 'gyroball':
            return species.baseStats.spe <= 60;
        case 'headbutt':
            return abilityid === 'serenegrace';
        case 'hex':
            return !moves.includes('infernalparade');
        case 'hiddenpowergrass':
            return !moves.includes('energyball') && !moves.includes('grassknot') && !moves.includes('gigadrain');
        case 'hiddenpowerpsychic':
            return species.name === "Unown" || species.baseSpecies === 'Unown';
        case 'hyperspacefury':
            return species.id === 'hoopaunbound';
        case 'icepunch':
            return !moves.includes('icespinner') || ['sheerforce', 'ironfist'].includes(abilityid) || itemid === 'punchingglove';
        case 'iciclecrash':
            return !moves.includes('mountaingale');
        case 'icywind':
            // Keldeo needs Hidden Power for Electric/Ghost
            return species.baseSpecies === 'Keldeo' /* || this.formatType === 'doubles'*/;
        case 'infestation':
            return moves.includes('stickyweb');
        case 'irondefense':
            return !moves.includes('acidarmor');
        case 'irontail':
            return !moves.includes('ironhead') && !moves.includes('gunkshot') && !moves.includes('poisonjab');
        case 'jumpkick':
            return !moves.includes('highjumpkick') && !moves.includes('axekick');
        case 'lastresort':
            return pokemonSet && pokemonSet.moves.length < 3;
        case 'leechlife':
            return true;
        case 'mysticalfire':
            return !moves.includes('flamethrower');
        case 'naturepower':
            return false;
        case 'nightslash':
            return !moves.includes('crunch') && !(moves.includes('knockoff'));
        case 'outrage':
            return !moves.includes('glaiverush');
        case 'petaldance':
            return abilityid === 'owntempo';
        case 'phantomforce':
            return (!moves.includes('poltergeist') && !moves.includes('shadowclaw')) /* || this.formatType === 'doubles'*/;
        case 'poisonfang':
            return species.types.includes('Poison') && !moves.includes('gunkshot') && !moves.includes('poisonjab');
        case 'relicsong':
            return species.id === 'meloetta';
        case 'refresh':
            return !moves.includes('aromatherapy') && !moves.includes('healbell');
        case 'risingvoltage':
            return abilityid === 'electricsurge' || abilityid === 'hadronengine';
        case 'rocktomb':
            return abilityid === 'technician';
        case 'shadowpunch':
            return abilityid === 'ironfist' && !moves.includes('ragefist');
        case 'shelter':
            return !moves.includes('acidarmor') && !moves.includes('irondefense');
        case 'smackdown':
            return species.types.includes('Ground');
        case 'smartstrike':
            return species.types.includes('Steel') && !moves.includes('ironhead');
        case 'soak':
            return abilityid === 'unaware';
        case 'steelwing':
            return !moves.includes('ironhead');
        case 'stompingtantrum':
            return (!moves.includes('earthquake') && !moves.includes('drillrun')) /* || this.formatType === 'doubles'*/;
        case 'stunspore':
            return !moves.includes('thunderwave');
        case 'technoblast':
            return itemid.endsWith('drive') || itemid === 'dousedrive';
        case 'teleport':
            return true;
        case 'terrainpulse':
        case 'waterpulse':
            return ['megalauncher', 'technician'].includes(abilityid) && !moves.includes('originpulse');
        case 'toxicspikes':
            return abilityid !== 'toxicdebris';
        case 'trickroom':
            return species.baseStats.spe <= 100;
    }
    var moveData = dex.Dex.moves.get(moveID);
    if (!moveData)
        return true;
    if (moveData.category === 'Status') {
        return GOOD_STATUS_MOVES.includes(moveID);
    }
    if (moveData.basePower < 75) {
        return GOOD_WEAK_MOVES.includes(moveID);
    }
    if (moveID === 'skydrop')
        return true;
    // strong moves
    if ((_a = moveData.flags) === null || _a === void 0 ? void 0 : _a.charge) {
        return itemid === 'powerherb';
    }
    if ((_b = moveData.flags) === null || _b === void 0 ? void 0 : _b.recharge) {
        return false;
    }
    if ((_c = moveData.flags) === null || _c === void 0 ? void 0 : _c.slicing) {
        return abilityid === 'sharpness';
    }
    return !BAD_STRONG_MOVES.includes(moveID);
};
exports.checkIsMoveNotUseless = checkIsMoveNotUseless;

const pokemonSet = {
    name: 'Charcadet',
    species: 'Charcadet',
    item: 'Choice Band',
    ability: 'Flash Fire',
    moves: [ 'Destiny Bond', 'Astonish' ],
    nature: '',
    evs: { hp: 120, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    teraType: 'Fire',
    level: 100,
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
    gender: ''
}

const species = {
    num: 1003,
    name: 'Charcadet',
    types: [ 'Fire' ],
    baseStats: { hp: 40, atk: 50, def: 40, spa: 50, spd: 40, spe: 35 },
    abilities: { '0': 'Flash Fire', H: 'Flame Body' },
    heightm: 0.6,
    weightkg: 10.5,
    color: 'Red',
    evos: [ 'Armarouge', 'Ceruledge' ],
    eggGroups: [ 'Human-Like' ]
}

const moves = [ 'destinybond', 'astonish' ];

const move = 'destinybond';

console.log(checkIsMoveNotUseless(move, species, moves, pokemonSet));