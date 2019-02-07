/**
 * Pokemon Showdown Dex
 *
 * Roughly equivalent to sim/dex.js in a Pokemon Showdown server, but
 * designed for use in browsers rather than in Node.
 *
 * This is a generic utility library for Pokemon Showdown code: any
 * code shared between the replay viewer and the client usually ends up
 * here.
 *
 * Licensing note: PS's client has complicated licensing:
 * - The client as a whole is AGPLv3
 * - The battle replay/animation engine (battle-*.ts) by itself is MIT
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */

if(!Array.prototype.indexOf){
Array.prototype.indexOf=function indexOf(searchElement,fromIndex){
for(var i=fromIndex||0;i<this.length;i++){
if(this[i]===searchElement)return i;
}
return-1;
};
}
if(!Array.prototype.includes){
Array.prototype.includes=function includes(thing){
return this.indexOf(thing)!==-1;
};
}
if(!Array.isArray){
Array.isArray=function isArray(thing){
return Object.prototype.toString.call(thing)==='[object Array]';
};
}
if(!String.prototype.includes){
String.prototype.includes=function includes(thing){
return this.indexOf(thing)!==-1;
};
}
if(!String.prototype.startsWith){
String.prototype.startsWith=function startsWith(thing){
return this.slice(0,thing.length)===thing;
};
}
if(!String.prototype.endsWith){
String.prototype.endsWith=function endsWith(thing){
return this.slice(-thing.length)===thing;
};
}
if(!String.prototype.trim){
String.prototype.trim=function trim(){
return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');
};
}
if(!Object.assign){
Object.assign=function assign(thing,rest){
for(var i=1;i<arguments.length;i++){
var source=arguments[i];
for(var k in source){
thing[k]=source[k];
}
}
return thing;
};
}








if(typeof window==='undefined'){

global.window=global;
}else{

window.exports=window;
}

if(window.soundManager){
soundManager.setup({url:'https://play.pokemonshowdown.com/swf/'});
if(window.Replays)soundManager.onready(window.Replays.soundReady);
soundManager.onready(function(){
soundManager.createSound({
id:'notif',
url:'https://play.pokemonshowdown.com/audio/notification.wav'});

});
}


window.nodewebkit=!!(typeof process!=='undefined'&&process.versions&&process.versions['node-webkit']);

function getString(str){
if(typeof str==='string'||typeof str==='number')return''+str;
return'';
}

function toId(text){
if(text&&text.id){
text=text.id;
}else if(text&&text.userid){
text=text.userid;
}
if(typeof text!=='string'&&typeof text!=='number')return'';
return(''+text).toLowerCase().replace(/[^a-z0-9]+/g,'');
}

function toUserid(text){
return toId(text);
}





function toRoomid(roomid){
return roomid.replace(/[^a-zA-Z0-9-]+/g,'').toLowerCase();
}

function toName(name){
if(typeof name!=='string'&&typeof name!=='number')return'';
name=(''+name).replace(/[\|\s\[\]\,\u202e]+/g,' ').trim();
if(name.length>18)name=name.substr(0,18).trim();


name=name.replace(/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g,'');
name=name.replace(/[\u239b-\u23b9]/g,'');

return name;
}













var Dex={

resourcePrefix:function(){
var prefix='';
if(!window.document||!document.location||document.location.protocol!=='http:')prefix='https:';
return prefix+'//play.pokemonshowdown.com/';
}(),

fxPrefix:function(){
if(window.document&&document.location&&document.location.protocol==='file:'){
if(window.Replays)return'https://play.pokemonshowdown.com/fx/';
return'fx/';
}
return'//play.pokemonshowdown.com/fx/';
}(),

resolveAvatar:function(avatar){
if(avatar in BattleAvatarNumbers){
avatar=BattleAvatarNumbers[avatar];
}
if(avatar.charAt(0)==='#'){
return Dex.resourcePrefix+'sprites/trainers-custom/'+toId(avatar.substr(1))+'.png';
}
if(avatar.includes('.')&&window.Config&&Config.server&&Config.server.registered){

var protocol=Config.server.port===443?'https':'http';
return protocol+'://'+Config.server.host+':'+Config.server.port+
'/avatars/'+encodeURIComponent(avatar).replace(/\%3F/g,'?');
}
return Dex.resourcePrefix+'sprites/trainers/'+Dex.sanitizeName(avatar||'unknown')+'.png';
},












sanitizeName:function(name){
if(!name)return'';
return(''+name).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').slice(0,50);
},

prefs:function(prop,value,save){

if(window.Storage&&Storage.prefs)return Storage.prefs(prop,value,save);
return undefined;
},

getShortName:function(name){
var shortName=name.replace(/[^A-Za-z0-9]+$/,'');
if(shortName.indexOf('(')>=0){
shortName+=name.slice(shortName.length).replace(/[^\(\)]+/g,'').replace(/\(\)/g,'');
}
return shortName;
},

getEffect:function(name){
name=(name||'').trim();
if(name.substr(0,5)==='item:'){
return Dex.getItem(name.substr(5).trim());
}else if(name.substr(0,8)==='ability:'){
return Dex.getAbility(name.substr(8).trim());
}else if(name.substr(0,5)==='move:'){
return Dex.getMove(name.substr(5).trim());
}
var id=toId(name);
return new PureEffect(id,name);
},

getMove:function(nameOrMove){
if(nameOrMove&&typeof nameOrMove!=='string'){

return nameOrMove;
}
var name=nameOrMove||'';
var id=toId(nameOrMove);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toId(name);
}
if(!window.BattleMovedex)window.BattleMovedex={};
var data=window.BattleMovedex[id];
if(data&&typeof data.exists==='boolean')return data;

if(!data&&id.substr(0,11)==='hiddenpower'&&id.length>11){var _ref=
/([a-z]*)([0-9]*)/.exec(id),hpWithType=_ref[1],hpPower=_ref[2];
data=Object.assign({},
window.BattleMovedex[hpWithType]||{},{
basePower:Number(hpPower)||60});

}
if(!data&&id.substr(0,6)==='return'&&id.length>6){
data=Object.assign({},
window.BattleMovedex['return']||{},{
basePower:Number(id.slice(6))});

}
if(!data&&id.substr(0,11)==='frustration'&&id.length>11){
data=Object.assign({},
window.BattleMovedex['frustration']||{},{
basePower:Number(id.slice(11))});

}

if(!data)data={exists:false};
var move=new Move(id,name,data);
window.BattleMovedex[id]=move;
return move;
},

getCategory:function(move,gen,type){
if(gen<=3&&move.category!=='Status'){
return[
'Fire','Water','Grass','Electric','Ice','Psychic','Dark','Dragon'].
includes(type||move.type)?'Special':'Physical';
}
return move.category;
},

getItem:function(nameOrItem){
if(nameOrItem&&typeof nameOrItem!=='string'){

return nameOrItem;
}
var name=nameOrItem||'';
var id=toId(nameOrItem);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toId(name);
}
if(!window.BattleItems)window.BattleItems={};
var data=window.BattleItems[id];
if(data&&typeof data.exists==='boolean')return data;
if(!data)data={exists:false};
var item=new Item(id,name,data);
window.BattleItems[id]=item;
return item;
},

getAbility:function(nameOrAbility){
if(nameOrAbility&&typeof nameOrAbility!=='string'){

return nameOrAbility;
}
var name=nameOrAbility||'';
var id=toId(nameOrAbility);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toId(name);
}
if(!window.BattleAbilities)window.BattleAbilities={};
var data=window.BattleAbilities[id];
if(data&&typeof data.exists==='boolean')return data;
if(!data)data={exists:false};
var ability=new Ability(id,name,data);
window.BattleAbilities[id]=ability;
return ability;
},

getTemplate:function(nameOrTemplate){
if(nameOrTemplate&&typeof nameOrTemplate!=='string'){

return nameOrTemplate;
}
var name=nameOrTemplate||'';
var id=toId(nameOrTemplate);
var formid=id;
if(!window.BattlePokedexAltForms)window.BattlePokedexAltForms={};
if(formid in window.BattlePokedexAltForms)return window.BattlePokedexAltForms[formid];
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toId(name);
}
if(!window.BattlePokedex)window.BattlePokedex={};
var data=window.BattlePokedex[id];

var template;
if(data&&typeof data.exists==='boolean'){
template=data;
}else{
if(!data)data={exists:false};
template=new Template(id,name,data);
window.BattlePokedex[id]=template;
}

if(formid===id||!template.otherForms||!template.otherForms.includes(formid)){
return template;
}
var forme=formid.slice(id.length);
forme=forme[0].toUpperCase()+forme.slice(1);
name=template.baseSpecies+(forme?'-'+forme:'');

template=window.BattlePokedexAltForms[formid]=new Template(formid,name,Object.assign({},
template,{
name:name,
forme:forme}));

return template;
},

getTier:function(pokemon){var gen=arguments.length>1&&arguments[1]!==undefined?arguments[1]:7;var isDoubles=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;
var table=window.BattleTeambuilderTable;
gen=Math.floor(gen);
if(gen<0||gen>7)gen=7;
if(gen<7&&!isDoubles)table=table['gen'+gen];
if(isDoubles)table=table['gen'+gen+'doubles'];

if(this.getTemplate(pokemon.species).gen>gen)return'Illegal';
return table.overrideTier[toId(pokemon.species)];
},

getType:function(type){
if(!type||typeof type==='string'){
var id=toId(type);
id=id.substr(0,1).toUpperCase()+id.substr(1);
type=window.BattleTypeChart&&window.BattleTypeChart[id]||{};
if(type.damageTaken)type.exists=true;
if(!type.id)type.id=id;
if(!type.name)type.name=id;
if(!type.effectType){
type.effectType='Type';
}
}
return type;
},

getAbilitiesFor:function(template){var gen=arguments.length>1&&arguments[1]!==undefined?arguments[1]:7;
template=this.getTemplate(template);
if(gen<3||!template.abilities)return{};
var id=template.id;
var templAbilities=template.abilities;
var table=gen>=7?null:window.BattleTeambuilderTable['gen'+gen];
if(!table)return Object.assign({},templAbilities);
var abilities={};

if(table.overrideAbility&&id in table.overrideAbility){
abilities['0']=table.overrideAbility[id];
}else{
abilities['0']=templAbilities['0'];
}
var removeSecondAbility=table.removeSecondAbility&&id in table.removeSecondAbility;
if(!removeSecondAbility&&templAbilities['1']){
abilities['1']=templAbilities['1'];
}
if(gen>=5&&templAbilities['H'])abilities['H']=templAbilities['H'];
if(gen>=7&&templAbilities['S'])abilities['S']=templAbilities['S'];

return abilities;
},

hasAbility:function(template,ability){var gen=arguments.length>2&&arguments[2]!==undefined?arguments[2]:7;
var abilities=this.getAbilitiesFor(template,gen);
for(var i in abilities){
if(ability===abilities[i])return true;
}
return false;
},

loadedSpriteData:{xy:1,bw:0},
loadSpriteData:function(gen){
if(this.loadedSpriteData[gen])return;
this.loadedSpriteData[gen]=1;

var path=$('script[src*="pokedex-mini.js"]').attr('src')||'';
var qs='?'+(path.split('?')[1]||'');
path=(path.match(/.+?(?=data\/pokedex-mini\.js)/)||[])[0]||'';

var el=document.createElement('script');
el.src=path+'data/pokedex-mini-bw.js'+qs;
document.getElementsByTagName('body')[0].appendChild(el);
},
getSpriteData:function(pokemon,siden){var options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:

{gen:6};return function(){
if(!options.gen)options.gen=6;
if(pokemon instanceof Pokemon){
if(pokemon.volatiles.transform){
options.shiny=pokemon.volatiles.transform[2];
options.gender=pokemon.volatiles.transform[3];
}else{
options.shiny=pokemon.shiny;
options.gender=pokemon.gender;
}
pokemon=pokemon.getSpecies();
}
var template=Dex.getTemplate(pokemon);
var spriteData={
w:96,
h:96,
y:0,
url:Dex.resourcePrefix+'sprites/',
pixelated:true,
isBackSprite:false,
cryurl:'',
shiny:options.shiny};

var name=template.spriteid;
var dir;
var facing;
if(siden){
dir='';
facing='front';
}else{
spriteData.isBackSprite=true;
dir='-back';
facing='back';
}


var fieldGenNum=options.gen;
if(Dex.prefs('nopastgens'))fieldGenNum=6;
if(Dex.prefs('bwgfx')&&fieldGenNum>=6)fieldGenNum=5;
var genNum=Math.max(fieldGenNum,Math.min(template.gen,5));
var gen=['','rby','gsc','rse','dpp','bw','xy','xy'][genNum];

var animationData=null;
var miscData=null;
var speciesid=template.speciesid;
if(template.isTotem)speciesid=toId(name);
if(gen==='xy'&&window.BattlePokemonSprites){
animationData=BattlePokemonSprites[speciesid];
}
if(gen==='bw'&&window.BattlePokemonSpritesBW){
animationData=BattlePokemonSpritesBW[speciesid];
}
if(window.BattlePokemonSprites)miscData=BattlePokemonSprites[speciesid];
if(!miscData&&window.BattlePokemonSpritesBW)miscData=BattlePokemonSpritesBW[speciesid];
if(!animationData)animationData={};
if(!miscData)miscData={};

if(miscData.num>0){
var baseSpeciesid=toId(template.baseSpecies);
spriteData.cryurl='audio/cries/'+baseSpeciesid;
var formeid=template.formeid;
if(template.isMega||formeid&&(
formeid==='-sky'||
formeid==='-therian'||
formeid==='-primal'||
formeid==='-eternal'||
baseSpeciesid==='kyurem'||
baseSpeciesid==='necrozma'||
formeid==='-super'||
formeid==='-unbound'||
formeid==='-midnight'||
formeid==='-school'||
baseSpeciesid==='oricorio'||
baseSpeciesid==='zygarde'))
{
spriteData.cryurl+=formeid;
}
spriteData.cryurl+=window.nodewebkit?'.ogg':'.mp3';
}

if(options.shiny&&options.gen>1)dir+='-shiny';


if(window.Config&&Config.server&&Config.server.afd||options.afd){
dir='afd'+dir;
spriteData.url+=dir+'/'+name+'.png';
return spriteData;
}

if(animationData[facing+'f']&&options.gender==='F')facing+='f';
var allowAnim=!Dex.prefs('noanim')&&!Dex.prefs('nogif');
if(allowAnim&&genNum>=6)spriteData.pixelated=false;
if(allowAnim&&animationData[facing]&&genNum>=5){
if(facing.slice(-1)==='f')name+='-f';
dir=gen+'ani'+dir;

spriteData.w=animationData[facing].w;
spriteData.h=animationData[facing].h;
spriteData.url+=dir+'/'+name+'.gif';
}else{


if(gen==='xy')gen='bw';
dir=gen+dir;



if(genNum>=4&&miscData['frontf']&&options.gender==='F'){
name+='-f';
}

spriteData.url+=dir+'/'+name+'.png';
}

if(!options.noScale){
if(fieldGenNum>5){

}else if(!spriteData.isBackSprite||fieldGenNum===5){
spriteData.w*=2;
spriteData.h*=2;
spriteData.y+=-16;
}else{

spriteData.w*=2/1.5;
spriteData.h*=2/1.5;
spriteData.y+=-11;
}
if(fieldGenNum===5)spriteData.y=-35;
if(fieldGenNum===5&&spriteData.isBackSprite)spriteData.y+=40;
if(genNum<=2)spriteData.y+=2;
}
if(template.isTotem&&!options.noScale){
spriteData.w*=1.5;
spriteData.h*=1.5;
spriteData.y+=-11;
}

return spriteData;
}();},

getPokemonIcon:function(pokemon,facingLeft){
var num=0;
if(pokemon==='pokeball'){
return'background:transparent url('+Dex.resourcePrefix+'sprites/smicons-pokeball-sheet.png) no-repeat scroll -0px 4px';
}else if(pokemon==='pokeball-statused'){
return'background:transparent url('+Dex.resourcePrefix+'sprites/smicons-pokeball-sheet.png) no-repeat scroll -40px 4px';
}else if(pokemon==='pokeball-fainted'){
return'background:transparent url('+Dex.resourcePrefix+'sprites/smicons-pokeball-sheet.png) no-repeat scroll -80px 4px;opacity:.4;filter:contrast(0)';
}else if(pokemon==='pokeball-none'){
return'background:transparent url('+Dex.resourcePrefix+'sprites/smicons-pokeball-sheet.png) no-repeat scroll -80px 4px';
}
var id=toId(pokemon);
if(pokemon&&pokemon.species)id=toId(pokemon.species);
if(pokemon&&pokemon.volatiles&&pokemon.volatiles.formechange&&!pokemon.volatiles.transform){
id=toId(pokemon.volatiles.formechange[2]);
}
if(pokemon&&pokemon.num)num=pokemon.num;else
if(window.BattlePokemonSprites&&BattlePokemonSprites[id]&&BattlePokemonSprites[id].num)num=BattlePokemonSprites[id].num;else
if(window.BattlePokedex&&window.BattlePokedex[id]&&BattlePokedex[id].num)num=BattlePokedex[id].num;
if(num<0)num=0;
if(num>809)num=0;

if(BattlePokemonIconIndexes[id]){
num=BattlePokemonIconIndexes[id];
}

if(pokemon&&pokemon.gender==='F'){
if(id==='unfezant'||id==='frillish'||id==='jellicent'||id==='meowstic'||id==='pyroar'){
num=BattlePokemonIconIndexes[id+'f'];
}
}

if(facingLeft){
if(BattlePokemonIconIndexesLeft[id]){
num=BattlePokemonIconIndexesLeft[id];
}
}

var top=Math.floor(num/12)*30;
var left=num%12*40;
var fainted=pokemon&&pokemon.fainted?';opacity:.7;filter:contrast(0)':'';
return'background:transparent url('+Dex.resourcePrefix+'sprites/smicons-sheet.png?a5) no-repeat scroll -'+left+'px -'+top+'px'+fainted;
},

getTeambuilderSprite:function(pokemon){var gen=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;
if(!pokemon)return'';
var id=toId(pokemon.species);
var spriteid=pokemon.spriteid;
var template=Dex.getTemplate(pokemon.species);
if(pokemon.species&&!spriteid){
spriteid=template.spriteid||toId(pokemon.species);
}
if(Dex.getTemplate(pokemon.species).exists===false){
return'background-image:url('+Dex.resourcePrefix+'sprites/bw/0.png);background-position:10px 5px;background-repeat:no-repeat';
}
var shiny=pokemon.shiny?'-shiny':'';











if(Dex.prefs('nopastgens'))gen=6;
var spriteDir=Dex.resourcePrefix+'sprites/xydex';
if((!gen||gen>=6)&&!template.isNonstandard&&!Dex.prefs('bwgfx')){
var offset='-2px -3px';
if(template.gen>=7)offset='-6px -7px';
if(id.substr(0,6)==='arceus')offset='-2px 7px';
if(id==='garchomp')offset='-2px 2px';
if(id==='garchompmega')offset='-2px 0px';
return'background-image:url('+spriteDir+shiny+'/'+spriteid+'.png);background-position:'+offset+';background-repeat:no-repeat';
}
spriteDir=Dex.resourcePrefix+'sprites/bw';
if(gen<=1&&template.gen<=1)spriteDir=Dex.resourcePrefix+'sprites/rby';else
if(gen<=2&&template.gen<=2)spriteDir=Dex.resourcePrefix+'sprites/gsc';else
if(gen<=3&&template.gen<=3)spriteDir=Dex.resourcePrefix+'sprites/rse';else
if(gen<=4&&template.gen<=4)spriteDir=Dex.resourcePrefix+'sprites/dpp';
return'background-image:url('+spriteDir+shiny+'/'+spriteid+'.png);background-position:10px 5px;background-repeat:no-repeat';
},

getItemIcon:function(item){
var num=0;
if(typeof item==='string'&&exports.BattleItems)item=exports.BattleItems[toId(item)];
if(item&&item.spritenum)num=item.spritenum;

var top=Math.floor(num/16)*24;
var left=num%16*24;
return'background:transparent url('+Dex.resourcePrefix+'sprites/itemicons-sheet.png) no-repeat scroll -'+left+'px -'+top+'px';
},

getTypeIcon:function(type,b){
if(!type)return'';
var sanitizedType=type.replace(/\?/g,'%3f');
return'<img src="'+Dex.resourcePrefix+'sprites/types/'+sanitizedType+'.png" alt="'+type+'" height="14" width="32"'+(b?' class="b"':'')+' />';
}};


if(typeof require==='function'){

global.Dex=Dex;
global.toId=toId;
}

/**
 * Pokemon Showdown Dex Data
 *
 * A collection of data and definitions for src/battle-dex.ts.
 *
 * Larger data has their own files in data/, so this is just for small
 * miscellaneous data that doesn't need its own file.
 *
 * Licensing note: PS's client has complicated licensing:
 * - The client as a whole is AGPLv3
 * - The battle replay/animation engine (battle-*.ts) by itself is MIT
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */



var BattleNatures={
Adamant:{
plus:'atk',
minus:'spa'},

Bashful:{},
Bold:{
plus:'def',
minus:'atk'},

Brave:{
plus:'atk',
minus:'spe'},

Calm:{
plus:'spd',
minus:'atk'},

Careful:{
plus:'spd',
minus:'spa'},

Docile:{},
Gentle:{
plus:'spd',
minus:'def'},

Hardy:{},
Hasty:{
plus:'spe',
minus:'def'},

Impish:{
plus:'def',
minus:'spa'},

Jolly:{
plus:'spe',
minus:'spa'},

Lax:{
plus:'def',
minus:'spd'},

Lonely:{
plus:'atk',
minus:'def'},

Mild:{
plus:'spa',
minus:'def'},

Modest:{
plus:'spa',
minus:'atk'},

Naive:{
plus:'spe',
minus:'spd'},

Naughty:{
plus:'atk',
minus:'spd'},

Quiet:{
plus:'spa',
minus:'spe'},

Quirky:{},
Rash:{
plus:'spa',
minus:'spd'},

Relaxed:{
plus:'def',
minus:'spe'},

Sassy:{
plus:'spd',
minus:'spe'},

Serious:{},
Timid:{
plus:'spe',
minus:'atk'}};


var BattleStatIDs={
HP:'hp',
hp:'hp',
Atk:'atk',
atk:'atk',
Def:'def',
def:'def',
SpA:'spa',
SAtk:'spa',
SpAtk:'spa',
spa:'spa',
spc:'spa',
Spc:'spa',
SpD:'spd',
SDef:'spd',
SpDef:'spd',
spd:'spd',
Spe:'spe',
Spd:'spe',
spe:'spe'};

var BattlePOStatNames={
hp:'HP',
atk:'Atk',
def:'Def',
spa:'SAtk',
spd:'SDef',
spe:'Spd'};

var BattleStatNames={
hp:'HP',
atk:'Atk',
def:'Def',
spa:'SpA',
spd:'SpD',
spe:'Spe'};

var BattleStats={
hp:'HP',
atk:'Attack',
def:'Defense',
spa:'Special Attack',
spd:'Special Defense',
spe:'Speed',
accuracy:'accuracy',
evasion:'evasiveness',
spc:'Special'};


var BattleBaseSpeciesChart=[
'pikachu',
'pichu',
'unown',
'castform',
'deoxys',
'burmy',
'wormadam',
'cherrim',
'shellos',
'gastrodon',
'rotom',
'giratina',
'shaymin',
'arceus',
'basculin',
'darmanitan',
'deerling',
'sawsbuck',
'tornadus',
'thundurus',
'landorus',
'kyurem',
'keldeo',
'meloetta',
'genesect',
'vivillon',
'flabebe',
'floette',
'florges',
'furfrou',
'aegislash',
'pumpkaboo',
'gourgeist',
'meowstic',
'hoopa',
'zygarde',
'lycanroc',
'wishiwashi',
'minior',
'mimikyu',
'greninja',
'oricorio',
'silvally',
'necrozma',


'raticate',
'marowak',
'kommoo',


'charizard',
'mewtwo'];



var BattlePokemonIconIndexes={
egg:816+1,
pikachubelle:816+2,
pikachulibre:816+3,
pikachuphd:816+4,
pikachupopstar:816+5,
pikachurockstar:816+6,
pikachucosplay:816+7,

castformrainy:816+35,
castformsnowy:816+36,
castformsunny:816+37,
deoxysattack:816+38,
deoxysdefense:816+39,
deoxysspeed:816+40,
burmysandy:816+41,
burmytrash:816+42,
wormadamsandy:816+43,
wormadamtrash:816+44,
cherrimsunshine:816+45,
shelloseast:816+46,
gastrodoneast:816+47,
rotomfan:816+48,
rotomfrost:816+49,
rotomheat:816+50,
rotommow:816+51,
rotomwash:816+52,
giratinaorigin:816+53,
shayminsky:816+54,
unfezantf:816+55,
basculinbluestriped:816+56,
darmanitanzen:816+57,
deerlingautumn:816+58,
deerlingsummer:816+59,
deerlingwinter:816+60,
sawsbuckautumn:816+61,
sawsbucksummer:816+62,
sawsbuckwinter:816+63,
frillishf:816+64,
jellicentf:816+65,
tornadustherian:816+66,
thundurustherian:816+67,
landorustherian:816+68,
kyuremblack:816+69,
kyuremwhite:816+70,
keldeoresolute:816+71,
meloettapirouette:816+72,
vivillonarchipelago:816+73,
vivilloncontinental:816+74,
vivillonelegant:816+75,
vivillonfancy:816+76,
vivillongarden:816+77,
vivillonhighplains:816+78,
vivillonicysnow:816+79,
vivillonjungle:816+80,
vivillonmarine:816+81,
vivillonmodern:816+82,
vivillonmonsoon:816+83,
vivillonocean:816+84,
vivillonpokeball:816+85,
vivillonpolar:816+86,
vivillonriver:816+87,
vivillonsandstorm:816+88,
vivillonsavanna:816+89,
vivillonsun:816+90,
vivillontundra:816+91,
pyroarf:816+92,
flabebeblue:816+93,
flabebeorange:816+94,
flabebewhite:816+95,
flabebeyellow:816+96,
floetteblue:816+97,
floetteeternal:816+98,
floetteorange:816+99,
floettewhite:816+100,
floetteyellow:816+101,
florgesblue:816+102,
florgesorange:816+103,
florgeswhite:816+104,
florgesyellow:816+105,
furfroudandy:816+106,
furfroudebutante:816+107,
furfroudiamond:816+108,
furfrouheart:816+109,
furfroukabuki:816+110,
furfroulareine:816+111,
furfroumatron:816+112,
furfroupharaoh:816+113,
furfroustar:816+114,
meowsticf:816+115,
aegislashblade:816+116,
hoopaunbound:816+118,
rattataalola:816+119,
raticatealola:816+120,
raichualola:816+121,
sandshrewalola:816+122,
sandslashalola:816+123,
vulpixalola:816+124,
ninetalesalola:816+125,
diglettalola:816+126,
dugtrioalola:816+127,
meowthalola:816+128,
persianalola:816+129,
geodudealola:816+130,
graveleralola:816+131,
golemalola:816+132,
grimeralola:816+133,
mukalola:816+134,
exeggutoralola:816+135,
marowakalola:816+136,
greninjaash:816+137,
zygarde10:816+138,
zygardecomplete:816+139,
oricoriopompom:816+140,
oricoriopau:816+141,
oricoriosensu:816+142,
lycanrocmidnight:816+143,
wishiwashischool:816+144,
miniormeteor:816+145,
miniororange:816+146,
minioryellow:816+147,
miniorgreen:816+148,
miniorblue:816+149,
miniorviolet:816+150,
miniorindigo:816+151,
magearnaoriginal:816+152,
pikachuoriginal:816+153,
pikachuhoenn:816+154,
pikachusinnoh:816+155,
pikachuunova:816+156,
pikachukalos:816+157,
pikachualola:816+158,
pikachupartner:816+159,
lycanrocdusk:816+160,
necrozmaduskmane:816+161,
necrozmadawnwings:816+162,
necrozmaultra:816+163,
pikachustarter:816+164,
eeveestarter:816+165,

gumshoostotem:735,
raticatealolatotem:816+120,
marowakalolatotem:816+136,
araquanidtotem:752,
lurantistotem:754,
salazzletotem:758,
vikavolttotem:738,
togedemarutotem:777,
mimikyutotem:778,
mimikyubustedtotem:778,
ribombeetotem:743,
kommoototem:784,

venusaurmega:984+0,
charizardmegax:984+1,
charizardmegay:984+2,
blastoisemega:984+3,
beedrillmega:984+4,
pidgeotmega:984+5,
alakazammega:984+6,
slowbromega:984+7,
gengarmega:984+8,
kangaskhanmega:984+9,
pinsirmega:984+10,
gyaradosmega:984+11,
aerodactylmega:984+12,
mewtwomegax:984+13,
mewtwomegay:984+14,
ampharosmega:984+15,
steelixmega:984+16,
scizormega:984+17,
heracrossmega:984+18,
houndoommega:984+19,
tyranitarmega:984+20,
sceptilemega:984+21,
blazikenmega:984+22,
swampertmega:984+23,
gardevoirmega:984+24,
sableyemega:984+25,
mawilemega:984+26,
aggronmega:984+27,
medichammega:984+28,
manectricmega:984+29,
sharpedomega:984+30,
cameruptmega:984+31,
altariamega:984+32,
banettemega:984+33,
absolmega:984+34,
glaliemega:984+35,
salamencemega:984+36,
metagrossmega:984+37,
latiasmega:984+38,
latiosmega:984+39,
kyogreprimal:984+40,
groudonprimal:984+41,
rayquazamega:984+42,
lopunnymega:984+43,
garchompmega:984+44,
lucariomega:984+45,
abomasnowmega:984+46,
gallademega:984+47,
audinomega:984+48,
dianciemega:984+49,

syclant:1152+0,
revenankh:1152+1,
pyroak:1152+2,
fidgit:1152+3,
stratagem:1152+4,
arghonaut:1152+5,
kitsunoh:1152+6,
cyclohm:1152+7,
colossoil:1152+8,
krilowatt:1152+9,
voodoom:1152+10,
tomohawk:1152+11,
necturna:1152+12,
mollux:1152+13,
aurumoth:1152+14,
malaconda:1152+15,
cawmodore:1152+16,
volkraken:1152+17,
plasmanta:1152+18,
naviathan:1152+19,
crucibelle:1152+20,
crucibellemega:1152+21,
kerfluffle:1152+22,
pajantom:1152+23,
jumbao:1152+24,
caribolt:1152+25,
smokomodo:1152+26,
snaelstrom:1152+27,

syclar:1188+0,
embirch:1188+1,
flarelm:1188+2,
breezi:1188+3,
scratchet:1188+4,
necturine:1188+5,
cupra:1188+6,
argalis:1188+7,
brattler:1188+8,
cawdet:1188+9,
volkritter:1188+10,
snugglow:1188+11,
floatoy:1188+12,
caimanoe:1188+13,
pluffle:1188+14,
rebble:1188+15,
tactite:1188+16,
privatyke:1188+17,
nohface:1188+18,
monohm:1188+19,
duohm:1188+20,

voodoll:1188+22,
mumbao:1188+23};


var BattlePokemonIconIndexesLeft={
pikachubelle:1044+0,
pikachupopstar:1044+1,
clefairy:1044+2,
clefable:1044+3,
jigglypuff:1044+4,
wigglytuff:1044+5,
dugtrioalola:1044+6,
poliwhirl:1044+7,
poliwrath:1044+8,
mukalola:1044+9,
kingler:1044+10,
croconaw:1044+11,
cleffa:1044+12,
igglybuff:1044+13,
politoed:1044+14,

sneasel:1044+35,
teddiursa:1044+36,
roselia:1044+37,
zangoose:1044+38,
seviper:1044+39,
castformrainy:1044+40,
absolmega:1044+41,
absol:1044+42,
regirock:1044+43,
torterra:1044+44,
budew:1044+45,
roserade:1044+46,
magmortar:1044+47,
togekiss:1044+48,
rotomwash:1044+49,
shayminsky:1044+50,
emboar:1044+51,
pansear:1044+52,
simisear:1044+53,
drilbur:1044+54,
excadrill:1044+55,
sawk:1044+56,
lilligant:1044+57,
garbodor:1044+58,
solosis:1044+59,
vanilluxe:1044+60,
amoonguss:1044+61,
klink:1044+62,
klang:1044+63,
klinklang:1044+64,
litwick:1044+65,
golett:1044+66,
golurk:1044+67,
kyuremblack:1044+68,
kyuremwhite:1044+69,
kyurem:1044+70,
keldeoresolute:1044+71,
meloetta:1044+72,
greninja:1044+73,
greninjaash:1044+74,
furfroudebutante:1044+75,
barbaracle:1044+76,
clauncher:1044+77,
clawitzer:1044+78,
sylveon:1044+79,
klefki:1044+80,
zygarde:1044+81,
zygarde10:1044+82,
zygardecomplete:1044+83,
dartrix:1044+84,
steenee:1044+85,
tsareena:1044+86,
comfey:1044+87,
miniormeteor:1044+88,
minior:1044+89,
miniororange:1044+90,
minioryellow:1044+91,
miniorgreen:1044+92,
miniorblue:1044+93,
miniorviolet:1044+94,
miniorindigo:1044+95,
dhelmise:1044+96,
necrozma:1044+97,
marshadow:1044+98,
pikachuoriginal:1044+99,
pikachupartner:1044+100,
necrozmaduskmane:1044+101,
necrozmadawnwings:1044+102,
necrozmaultra:1044+103,
stakataka:1044+104,
blacephalon:1044+105};


var BattleAvatarNumbers={
1:'lucas',
2:'dawn',
3:'youngster-gen4',
4:'lass-gen4dp',
5:'camper',
6:'picnicker',
7:'bugcatcher',
8:'aromalady',
9:'twins-gen4dp',
10:'hiker-gen4',
11:'battlegirl-gen4',
12:'fisherman-gen4',
13:'cyclist-gen4',
14:'cyclistf-gen4',
15:'blackbelt-gen4dp',
16:'artist-gen4',
17:'pokemonbreeder-gen4',
18:'pokemonbreederf-gen4',
19:'cowgirl',
20:'jogger',
21:'pokefan-gen4',
22:'pokefanf-gen4',
23:'pokekid',
24:'youngcouple-gen4dp',
25:'acetrainer-gen4dp',
26:'acetrainerf-gen4dp',
27:'waitress-gen4',
28:'veteran-gen4',
29:'ninjaboy',
30:'dragontamer',
31:'birdkeeper-gen4dp',
32:'doubleteam',
33:'richboy-gen4',
34:'lady-gen4',
35:'gentleman-gen4dp',
36:'madame-gen4dp',
37:'beauty-gen4dp',
38:'collector',
39:'policeman-gen4',
40:'pokemonranger-gen4',
41:'pokemonrangerf-gen4',
42:'scientist-gen4dp',
43:'swimmer-gen4dp',
44:'swimmerf-gen4dp',
45:'tuber',
46:'tuberf',
47:'sailor',
48:'sisandbro',
49:'ruinmaniac',
50:'psychic-gen4',
51:'psychicf-gen4',
52:'gambler',
53:'guitarist-gen4',
54:'acetrainersnow',
55:'acetrainersnowf',
56:'skier',
57:'skierf-gen4dp',
58:'roughneck-gen4',
59:'clown',
60:'worker-gen4',
61:'schoolkid-gen4dp',
62:'schoolkidf-gen4',
63:'roark',
64:'barry',
65:'byron',
66:'aaron',
67:'bertha',
68:'flint',
69:'lucian',
70:'cynthia-gen4',
71:'bellepa',
72:'rancher',
73:'mars',
74:'galacticgrunt',
75:'gardenia',
76:'crasherwake',
77:'maylene',
78:'fantina',
79:'candice',
80:'volkner',
81:'parasollady-gen4',
82:'waiter-gen4dp',
83:'interviewers',
84:'cameraman',
85:'reporter',
86:'idol',
87:'cyrus',
88:'jupiter',
89:'saturn',
90:'galacticgruntf',
91:'argenta',
92:'palmer',
93:'thorton',
94:'buck',
95:'darach',
96:'marley',
97:'mira',
98:'cheryl',
99:'riley',
100:'dahlia',
101:'ethan',
102:'lyra',
103:'twins-gen4',
104:'lass-gen4',
105:'acetrainer-gen4',
106:'acetrainerf-gen4',
107:'juggler',
108:'sage',
109:'li',
110:'gentleman-gen4',
111:'teacher',
112:'beauty',
113:'birdkeeper',
114:'swimmer-gen4',
115:'swimmerf-gen4',
116:'kimonogirl',
117:'scientist-gen4',
118:'acetrainercouple',
119:'youngcouple',
120:'supernerd',
121:'medium',
122:'schoolkid-gen4',
123:'blackbelt-gen4',
124:'pokemaniac',
125:'firebreather',
126:'burglar',
127:'biker-gen4',
128:'skierf',
129:'boarder',
130:'rocketgrunt',
131:'rocketgruntf',
132:'archer',
133:'ariana',
134:'proton',
135:'petrel',
136:'eusine',
137:'lucas-gen4pt',
138:'dawn-gen4pt',
139:'madame-gen4',
140:'waiter-gen4',
141:'falkner',
142:'bugsy',
143:'whitney',
144:'morty',
145:'chuck',
146:'jasmine',
147:'pryce',
148:'clair',
149:'will',
150:'koga',
151:'bruno',
152:'karen',
153:'lance',
154:'brock',
155:'misty',
156:'ltsurge',
157:'erika',
158:'janine',
159:'sabrina',
160:'blaine',
161:'blue',
162:'red',
163:'red',
164:'silver',
165:'giovanni',
166:'unknownf',
167:'unknown',
168:'unknown',
169:'hilbert',
170:'hilda',
171:'youngster',
172:'lass',
173:'schoolkid',
174:'schoolkidf',
175:'smasher',
176:'linebacker',
177:'waiter',
178:'waitress',
179:'chili',
180:'cilan',
181:'cress',
182:'nurseryaide',
183:'preschoolerf',
184:'preschooler',
185:'twins',
186:'pokemonbreeder',
187:'pokemonbreederf',
188:'lenora',
189:'burgh',
190:'elesa',
191:'clay',
192:'skyla',
193:'pokemonranger',
194:'pokemonrangerf',
195:'worker',
196:'backpacker',
197:'backpackerf',
198:'fisherman',
199:'musician',
200:'dancer',
201:'harlequin',
202:'artist',
203:'baker',
204:'psychic',
205:'psychicf',
206:'cheren',
207:'bianca',
208:'plasmagrunt-gen5bw',
209:'n',
210:'richboy',
211:'lady',
212:'pilot',
213:'workerice',
214:'hoopster',
215:'scientistf',
216:'clerkf',
217:'acetrainerf',
218:'acetrainer',
219:'blackbelt',
220:'scientist',
221:'striker',
222:'brycen',
223:'iris',
224:'drayden',
225:'roughneck',
226:'janitor',
227:'pokefan',
228:'pokefanf',
229:'doctor',
230:'nurse',
231:'hooligans',
232:'battlegirl',
233:'parasollady',
234:'clerk',
235:'clerk-boss',
236:'backers',
237:'backersf',
238:'veteran',
239:'veteranf',
240:'biker',
241:'infielder',
242:'hiker',
243:'madame',
244:'gentleman',
245:'plasmagruntf-gen5bw',
246:'shauntal',
247:'marshal',
248:'grimsley',
249:'caitlin',
250:'ghetsis-gen5bw',
251:'depotagent',
252:'swimmer',
253:'swimmerf',
254:'policeman',
255:'maid',
256:'ingo',
257:'alder',
258:'cyclist',
259:'cyclistf',
260:'cynthia',
261:'emmet',
262:'hilbert-dueldisk',
263:'hilda-dueldisk',
264:'hugh',
265:'rosa',
266:'nate',
267:'colress',
268:'beauty-gen5bw2',
269:'ghetsis',
270:'plasmagrunt',
271:'plasmagruntf',
272:'iris-gen5bw2',
273:'brycenman',
274:'shadowtriad',
275:'rood',
276:'zinzolin',
277:'cheren-gen5bw2',
278:'marlon',
279:'roxie',
280:'roxanne',
281:'brawly',
282:'wattson',
283:'flannery',
284:'norman',
285:'winona',
286:'tate',
287:'liza',
288:'juan',
289:'guitarist',
290:'steven',
291:'wallace',
292:'bellelba',
293:'benga',
294:'ash',
'#bw2elesa':'elesa-gen5bw2',
'#teamrocket':'teamrocket',
'#yellow':'yellow',
'#zinnia':'zinnia',
'#clemont':'clemont',
'#wally':'wally',
breeder:'pokemonbreeder',
breederf:'pokemonbreederf',

1001:'#1001',
1002:'#1002',
1003:'#1003',
1005:'#1005',
1010:'#1010'};var





















PureEffect=





function PureEffect(id,name){this.effectType='PureEffect';
this.id=id;
this.name=name;
this.gen=0;
this.exists=false;
};var


Item=






















function Item(id,name,data){this.effectType='Item';
if(!data||typeof data!=='object')data={};
if(data.name)name=data.name;
this.name=Dex.sanitizeName(name);
this.id=id;
this.gen=data.gen||0;
this.exists='exists'in data?!!data.exists:true;

this.num=data.num||0;
this.spritenum=data.spritenum||0;
this.desc=data.desc||data.shortDesc||'';
this.shortDesc=data.shortDesc||this.desc;

this.megaStone=data.megaStone||'';
this.megaEvolves=data.megaEvolves||'';
this.zMove=data.zMove||null;
this.zMoveType=data.zMoveType||'';
this.zMoveFrom=data.zMoveFrom||'';
this.zMoveUser=data.zMoveUser||null;
this.onPlate=data.onPlate||'';
this.onMemory=data.onMemory||'';
this.onDrive=data.onDrive||'';

if(!this.gen){
if(this.num>=577){
this.gen=6;
}else if(this.num>=537){
this.gen=5;
}else if(this.num>=377){
this.gen=4;
}else{
this.gen=3;
}
}
};var















































Move=































function Move(id,name,data){this.effectType='Move';
if(!data||typeof data!=='object')data={};
if(data.name)name=data.name;
this.name=Dex.sanitizeName(name);
this.id=id;
this.gen=data.gen||0;
this.exists='exists'in data?!!data.exists:true;

this.basePower=data.basePower||0;
this.accuracy=data.accuracy||0;
this.pp=data.pp||1;
this.type=data.type||'???';
this.category=data.category||'Physical';
this.priority=data.priority||0;
this.target=data.target||'normal';
this.flags=data.flags||{};
this.critRatio=data.critRatio===0?0:data.critRatio||1;


this.desc=data.desc;
this.shortDesc=data.shortDesc;
this.isViable=!!data.isViable;
this.isNonstandard=!!data.isNonstandard;
this.isZ=data.isZ||'';
this.zMovePower=data.zMovePower||0;
this.zMoveEffect=data.zMoveEffect||'';
this.zMoveBoost=data.zMoveBoost||null;

this.num=data.num||0;
if(!this.gen){
if(this.num>=560){
this.gen=6;
}else if(this.num>=468){
this.gen=5;
}else if(this.num>=355){
this.gen=4;
}else if(this.num>=252){
this.gen=3;
}else if(this.num>=166){
this.gen=2;
}else if(this.num>=1){
this.gen=1;
}
}
};var


Ability=










function Ability(id,name,data){this.effectType='Ability';
if(!data||typeof data!=='object')data={};
if(data.name)name=data.name;
this.name=Dex.sanitizeName(name);
this.id=id;
this.gen=data.gen||0;
this.exists='exists'in data?!!data.exists:true;
this.num=data.num||0;
this.desc=data.desc||data.shortDesc||'';
if(!this.gen){
if(this.num>=165){
this.gen=6;
}else if(this.num>=124){
this.gen=5;
}else if(this.num>=77){
this.gen=4;
}else if(this.num>=1){
this.gen=3;
}
}
};var


Template=
















































function Template(id,name,data){this.effectType='Template';
if(!data||typeof data!=='object')data={};
if(data.name||data.species)name=data.name||data.species;
this.name=Dex.sanitizeName(name);
this.id=id;
this.gen=data.gen||0;
this.exists='exists'in data?!!data.exists:true;
this.species=this.name;
this.speciesid=this.id;
if(!data.abilities&&
!['hooh','hakamoo','jangmoo','kommoo','porygonz'].includes(this.id)){
var dashIndex=name.indexOf('-');
if(this.id==='kommoototem'){
data.baseSpecies='Kommo-o';
data.forme='Totem';
}else if(dashIndex>0){
data.baseSpecies=name.slice(0,dashIndex);
data.forme=name.slice(dashIndex+1);
}
}
if(!data.abilities){for(var _i=0;_i<

BattleBaseSpeciesChart.length;_i++){var baseid=BattleBaseSpeciesChart[_i];
if(this.id.length>baseid.length&&this.id.slice(0,baseid.length)===baseid){
data.baseSpecies=baseid;
data.forme=this.id.slice(baseid.length);
}
}
if(this.id!=='yanmega'&&this.id.slice(-4)==='mega'){
data.baseSpecies=this.id.slice(0,-4);
data.forme=this.id.slice(-4);
}else if(this.id.slice(-6)==='primal'){
data.baseSpecies=this.id.slice(0,-6);
data.forme=this.id.slice(-6);
}else if(this.id.slice(-5)==='alola'){
data.baseSpecies=this.id.slice(0,-5);
data.forme=this.id.slice(-5);
}
}
this.baseSpecies=data.baseSpecies||name;
this.forme=data.forme||'';
var baseId=toId(this.baseSpecies);
this.formeid=baseId===this.id?'':'-'+toId(this.forme);
this.spriteid=baseId+this.formeid;
if(this.spriteid.slice(-5)==='totem')this.spriteid=this.spriteid.slice(0,-5);
if(this.spriteid.slice(-1)==='-')this.spriteid=this.spriteid.slice(0,-1);

this.num=data.num||0;
this.types=data.types||['???'];
var abilities={0:"No Ability"};
this.abilities=data.abilities||{0:"No Ability"};
this.baseStats=data.baseStats||{hp:0,atk:0,def:0,spa:0,spd:0,spe:0};
this.weightkg=data.weightkg||0;

this.heightm=data.heightm||0;
this.gender=data.gender||'';
this.color=data.color||'';
this.genderRatio=data.genderRatio||null;
this.eggGroups=data.eggGroups||[];

this.otherFormes=data.otherFormes||null;
this.otherForms=data.otherForms||null;
this.evos=data.evos||null;
this.prevo=data.prevo||'';
this.requiredItem=data.requiredItem||'';
this.tier=data.tier||'';

this.isTotem=false;
this.isMega=false;
this.isPrimal=false;
this.battleOnly=false;
this.isNonstandard=!!data.isNonstandard;
this.unreleasedHidden=!!data.unreleasedHidden;
if(!this.gen){
if(this.forme&&['-mega','-megax','-megay'].includes(this.formeid)){
this.gen=6;
this.isMega=true;
this.battleOnly=true;
}else if(this.formeid==='-primal'){
this.gen=6;
this.isPrimal=true;
this.battleOnly=true;
}else if(this.formeid==='-totem'||this.formeid==='-alolatotem'){
this.gen=7;
this.isTotem=true;
}else if(this.formeid==='-alola'){
this.gen=7;
}else if(this.num>=722){
this.gen=7;
}else if(this.num>=650){
this.gen=6;
}else if(this.num>=494){
this.gen=5;
}else if(this.num>=387){
this.gen=4;
}else if(this.num>=252){
this.gen=3;
}else if(this.num>=152){
this.gen=2;
}else if(this.num>=1){
this.gen=1;
}
}
};


if(typeof require==='function'){

global.BattleBaseSpeciesChart=BattleBaseSpeciesChart;
global.BattleStats=BattleStats;
global.PureEffect=PureEffect;
global.Template=Template;
global.Ability=Ability;
global.Item=Item;
global.Move=Move;
}

/**
 * Battle log
 *
 * An exercise in minimalism! This is a dependency of the client, which
 * requires IE9+ and uses Preact, and the replay player, which requires
 * IE7+ and uses jQuery. Therefore, this has to be compatible with IE7+
 * and use the DOM directly!
 *
 * Special thanks to PPK for QuirksMode.org, one of the few resources
 * available for how to do web development in these conditions.
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */var

BattleLog=function(){













function BattleLog(elem,scene){var _this=this;this.scene=null;this.preemptElem=null;this.atBottom=true;this.battleParser=null;this.perspective=-1;this.





















onScroll=function(){
var distanceFromBottom=_this.elem.scrollHeight-_this.elem.scrollTop-_this.elem.clientHeight;
_this.atBottom=distanceFromBottom<30;
};this.elem=elem;elem.setAttribute('role','log');elem.innerHTML='';var innerElem=document.createElement('div');innerElem.className='inner';elem.appendChild(innerElem);this.innerElem=innerElem;this.className=elem.className;if(scene){this.scene=scene;var preemptElem=document.createElement('div');preemptElem.className='inner-preempt';elem.appendChild(preemptElem);this.preemptElem=preemptElem;this.battleParser=new BattleTextParser();}elem.onscroll=this.onScroll;}var _proto=BattleLog.prototype;_proto.
reset=function reset(){
this.innerElem.innerHTML='';
this.atBottom=true;
};_proto.
destroy=function destroy(){
this.elem.onscroll=null;
};_proto.
add=function add(args,kwArgs,preempt){
if(kwArgs&&kwArgs.silent)return;
var divClass='chat';
var divHTML='';
switch(args[0]){
case'chat':case'c':case'c:':
var battle=this.scene&&this.scene.battle;
var name;
var message;
if(args[0]==='c:'){
name=args[2];
message=args[3];
}else{
name=args[1];
message=args[2];
}
var rank=name.charAt(0);
if(battle&&battle.ignoreSpects&&' +'.includes(rank))return;
if(battle&&battle.ignoreOpponent&&"\u2605\u2606".includes(rank)&&toUserid(name)!==app.user.get('userid'))return;
if(window.app&&app.ignore&&app.ignore[toUserid(name)]&&" +\u2605\u2606".includes(rank))return;
var isHighlighted=window.app&&app.rooms&&app.rooms[battle.roomid].getHighlight(message);var _this$parseChatMessag=
this.parseChatMessage(message,name,'',isHighlighted);divClass=_this$parseChatMessag[0];divHTML=_this$parseChatMessag[1];
if(isHighlighted){
var notifyTitle="Mentioned by "+name+" in "+battle.roomid;
app.rooms[battle.roomid].notifyOnce(notifyTitle,"\""+message+"\"",'highlight');
}
break;

case'join':case'j':
divHTML='<small>'+BattleLog.escapeHTML(args[1])+' joined.</small>';
break;

case'leave':case'l':
divHTML='<small>'+BattleLog.escapeHTML(args[1])+' left.</small>';
break;

case'chatmsg':case'':
divHTML=BattleLog.escapeHTML(args[1]);
break;

case'chatmsg-raw':case'raw':case'html':
divHTML=BattleLog.sanitizeHTML(args[1]);
break;

case'uhtml':case'uhtmlchange':
this.changeUhtml(args[1],args[2],args[0]==='uhtml');
return['',''];

case'error':case'inactive':case'inactiveoff':
divClass='chat message-error';
divHTML=BattleLog.escapeHTML(args[1]);
break;

case'bigerror':
this.message('<div class="broadcast-red">'+BattleLog.escapeHTML(args[1]).replace(/\|/g,'<br />')+'</div>');
return;

case'pm':
divHTML='<strong>'+BattleLog.escapeHTML(args[1])+':</strong> <span class="message-pm"><i style="cursor:pointer" onclick="selectTab(\'lobby\');rooms.lobby.popupOpen(\''+BattleLog.escapeHTML(args[2],true)+'\')">(Private to '+BattleLog.escapeHTML(args[3])+')</i> '+BattleLog.parseMessage(args[4])+'</span>';
break;

case'askreg':
this.addDiv('chat','<div class="broadcast-blue"><b>Register an account to protect your ladder rating!</b><br /><button name="register" value="'+BattleLog.escapeHTML(args[1])+'"><b>Register</b></button></div>');
return;

case'unlink':
var user=toId(args[2])||toId(args[1]);
this.unlinkChatFrom(user);
if(args[2]){
this.hideChatFrom(user);
}
return;

case'debug':
divClass='debug';
divHTML='<div class="chat"><small style="color:#999">[DEBUG] '+BattleLog.escapeHTML(args[1])+'.</small></div>';
break;

case'seed':case'choice':case':':case'timer':
case'J':case'L':case'N':case'n':case'spectator':case'spectatorleave':
return;

default:
this.addBattleMessage(args,kwArgs);
return;}

if(divHTML)this.addDiv(divClass,divHTML,preempt);
};_proto.
addBattleMessage=function addBattleMessage(args,kwArgs){
switch(args[0]){
case'warning':
this.message('<strong>Warning:</strong> '+BattleLog.escapeHTML(args[1]));
this.message("Bug? Report it to <a href=\"http://www.smogon.com/forums/showthread.php?t=3453192\">the replay viewer's Smogon thread</a>");
if(this.scene)this.scene.wait(1000);
return;

case'variation':
this.addDiv('','<small>Variation: <em>'+BattleLog.escapeHTML(args[1])+'</em></small>');
break;

case'rule':
var ruleArgs=args[1].split(': ');
this.addDiv('','<small><em>'+BattleLog.escapeHTML(ruleArgs[0])+(ruleArgs[1]?':':'')+'</em> '+BattleLog.escapeHTML(ruleArgs[1]||'')+'</small>');
break;

case'rated':
this.addDiv('rated','<strong>'+(BattleLog.escapeHTML(args[1])||'Rated battle')+'</strong>');
break;

case'tier':
this.addDiv('','<small>Format:</small> <br /><strong>'+BattleLog.escapeHTML(args[1])+'</strong>');
break;

case'turn':
var h2elem=document.createElement('h2');
h2elem.className='battle-history';
var turnMessage=this.battleParser.parseArgs(args,{}).trim();
if(!turnMessage.startsWith('==')||!turnMessage.endsWith('==')){
throw new Error("Turn message must be a heading.");
}
turnMessage=turnMessage.slice(2,-2).trim();
this.battleParser.curLineSection='break';
h2elem.innerHTML=BattleLog.escapeHTML(turnMessage);
this.addSpacer();
this.addNode(h2elem);
break;

default:
var line=null;
if(this.battleParser){
line=this.battleParser.parseArgs(args,kwArgs||{},true);
}
if(line===null){
this.addDiv('chat message-error','Unrecognized: |'+BattleLog.escapeHTML(args.join('|')));
return;
}
if(!line)return;
this.message.apply(this,this.parseLogMessage(line));
break;}

};_proto.




parseLogMessage=function parseLogMessage(message){
var messages=message.split('\n').map(function(line){
line=BattleLog.escapeHTML(line);
line=line.replace(/\*\*(.*)\*\*/,'<strong>$1</strong>');
line=line.replace(/\|\|([^\|]*)\|\|([^\|]*)\|\|/,'<abbr title="$1">$2</abbr>');
if(line.startsWith('  '))line='<small>'+line.trim()+'</small>';
return line;
});
return[
messages.join('<br />'),
messages.filter(function(line){return!line.startsWith('<small>[');}).join('<br />')];

};_proto.
message=function message(_message){var sceneMessage=arguments.length>1&&arguments[1]!==undefined?arguments[1]:_message;
if(this.scene)this.scene.message(sceneMessage);
this.addDiv('battle-history',_message);
};_proto.
addNode=function addNode(node,preempt){
(preempt?this.preemptElem:this.innerElem).appendChild(node);
if(this.atBottom){
this.elem.scrollTop=this.elem.scrollHeight;
}
};_proto.
addDiv=function addDiv(className,innerHTML,preempt){
var el=document.createElement('div');
el.className=className;
el.innerHTML=innerHTML;
this.addNode(el,preempt);
};_proto.
addSpacer=function addSpacer(){
this.addDiv('spacer battle-history','<br />');
};_proto.
changeUhtml=function changeUhtml(id,html,forceAdd){
id=toId(id);
var classContains=' uhtml-'+id+' ';
var elements=[];for(var _i=0,_ref=
this.innerElem.childNodes;_i<_ref.length;_i++){var node=_ref[_i];
if(node.className&&(' '+node.className+' ').includes(classContains)){
elements.push(node);
}
}
if(this.preemptElem){for(var _i2=0,_ref2=
this.preemptElem.childNodes;_i2<_ref2.length;_i2++){var _node=_ref2[_i2];
if(_node.className&&(' '+_node.className+' ').includes(classContains)){
elements.push(_node);
}
}
}
if(html&&elements.length&&!forceAdd){for(var _i3=0;_i3<
elements.length;_i3++){var element=elements[_i3];
element.innerHTML=BattleLog.sanitizeHTML(html);
}
return;
}for(var _i4=0;_i4<
elements.length;_i4++){var _element=elements[_i4];
_element.parentElement.removeChild(_element);
}
if(html){
this.addDiv('notice uhtml-'+id,BattleLog.sanitizeHTML(html));
}
};_proto.
hideChatFrom=function hideChatFrom(userid){var showRevealButton=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;
var classStart='chat chatmessage-'+userid+' ';
var lastNode;
var count=0;for(var _i5=0,_ref3=
this.innerElem.childNodes;_i5<_ref3.length;_i5++){var node=_ref3[_i5];
if(node.className&&(node.className+' ').startsWith(classStart)){
node.style.display='none';
node.className='revealed '+node.className;
count++;
}
lastNode=node;
}for(var _i6=0,_ref4=
this.preemptElem.childNodes;_i6<_ref4.length;_i6++){var _node2=_ref4[_i6];
if(_node2.className&&(_node2.className+' ').startsWith(classStart)){
_node2.style.display='none';
_node2.className='revealed '+_node2.className;
count++;
}
lastNode=_node2;
}
if(!count||!showRevealButton)return;
var button=document.createElement('button');
button.name='toggleMessages';
button.value=userid;
button.className='subtle';
button.innerHTML='<small>('+count+' line'+(count>1?'s':'')+' from '+userid+' hidden)</small>';
lastNode.appendChild(document.createTextNode(' '));
lastNode.appendChild(button);
};_proto.
unlinkChatFrom=function unlinkChatFrom(userid){
var classStart='chat chatmessage-'+userid+' ';
var innerNodeList=this.innerElem.childNodes;
var preemptNodeList=this.preemptElem.childNodes;

var unlinkNodeList=function(nodeList){for(var _i7=0,_ref5=
nodeList;_i7<_ref5.length;_i7++){var node=_ref5[_i7];
if(node.className&&(node.className+' ').startsWith(classStart)){
var linkList=node.getElementsByTagName('a');

for(var i=linkList.length-1;i>=0;i--){
var linkNode=linkList[i];
var parent=linkNode.parentElement;
if(!parent)continue;for(var _i8=0,_ref6=
linkNode.childNodes;_i8<_ref6.length;_i8++){var childNode=_ref6[_i8];
parent.insertBefore(childNode,linkNode);
}
parent.removeChild(linkNode);
}
}
}
};

unlinkNodeList(innerNodeList);
unlinkNodeList(preemptNodeList);
};_proto.

preemptCatchup=function preemptCatchup(){
if(!this.preemptElem.firstChild)return;
this.innerElem.appendChild(this.preemptElem.firstChild);
};BattleLog.

escapeFormat=function escapeFormat(formatid){
var atIndex=formatid.indexOf('@@@');
if(atIndex>=0){
return this.escapeFormat(formatid.slice(0,atIndex))+'<br />Custom rules: '+this.escapeHTML(formatid.slice(atIndex+3));
}
if(window.BattleFormats&&BattleFormats[formatid]){
return this.escapeHTML(BattleFormats[formatid].name);
}
return this.escapeHTML(formatid);
};BattleLog.

escapeHTML=function escapeHTML(str,jsEscapeToo){
str=getString(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
if(jsEscapeToo)str=str.replace(/\\/g,'\\\\').replace(/'/g,'\\\'');
return str;
};BattleLog.

unescapeHTML=function unescapeHTML(str){
str=str?''+str:'';
return str.replace(/&quot;/g,'"').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&');
};BattleLog.



hashColor=function hashColor(name){
if(this.colorCache[name])return this.colorCache[name];
var hash;
if(window.Config&&Config.customcolors&&Config.customcolors[name]){
if(Config.customcolors[name].color){
return this.colorCache[name]='color:'+Config.customcolors[name].color+';';
}
hash=MD5(Config.customcolors[name]);
}else{
hash=MD5(name);
}
var H=parseInt(hash.substr(4,4),16)%360;
var S=parseInt(hash.substr(0,4),16)%50+40;
var L=Math.floor(parseInt(hash.substr(8,4),16)%20+30);

var C=(100-Math.abs(2*L-100))*S/100/100;
var X=C*(1-Math.abs(H/60%2-1));
var m=L/100-C/2;

var R1;
var G1;
var B1;
switch(Math.floor(H/60)){
case 1:R1=X;G1=C;B1=0;break;
case 2:R1=0;G1=C;B1=X;break;
case 3:R1=0;G1=X;B1=C;break;
case 4:R1=X;G1=0;B1=C;break;
case 5:R1=C;G1=0;B1=X;break;
case 0:default:R1=C;G1=X;B1=0;break;}

var R=R1+m;
var G=G1+m;
var B=B1+m;
var lum=R*R*R*0.2126+G*G*G*0.7152+B*B*B*0.0722;

var HLmod=(lum-0.2)*-150;
if(HLmod>18)HLmod=(HLmod-18)*2.5;else
if(HLmod<0)HLmod=(HLmod-0)/3;else
HLmod=0;

var Hdist=Math.min(Math.abs(180-H),Math.abs(240-H));
if(Hdist<15){
HLmod+=(15-Hdist)/3;
}

L+=HLmod;

this.colorCache[name]="color:hsl("+H+","+S+"%,"+L+"%);";
return this.colorCache[name];
};BattleLog.

prefs=function prefs(name){

if(window.Storage&&Storage.prefs)return Storage.prefs(name);

if(window.PS)return PS.prefs[name];
return undefined;
};_proto.

parseChatMessage=function parseChatMessage(message,name,timestamp,isHighlighted){
var showMe=!(BattleLog.prefs('chatformatting')||{}).hideme;
var group=' ';
if(!/[A-Za-z0-9]/.test(name.charAt(0))){

group=name.charAt(0);
name=name.substr(1);
}
var color=BattleLog.hashColor(toId(name));
var clickableName='<small>'+BattleLog.escapeHTML(group)+'</small><span class="username" data-name="'+BattleLog.escapeHTML(name)+'">'+
BattleLog.escapeHTML(name)+'</span>';
var hlClass=isHighlighted?' highlighted':'';
var mineClass=window.app&&app.user&&app.user.get('name')===name?' mine':'';

var cmd='';
var target='';
if(message.charAt(0)==='/'){
if(message.charAt(1)==='/'){
message=message.slice(1);
}else{
var spaceIndex=message.indexOf(' ');
cmd=spaceIndex>=0?message.slice(1,spaceIndex):message.slice(1);
if(spaceIndex>=0)target=message.slice(spaceIndex+1);
}
}

switch(cmd){
case'me':
if(!showMe){
return[
'chat chatmessage-'+toId(name)+hlClass+mineClass,
''+timestamp+'<strong style="'+color+'">'+clickableName+':</strong> <em>/me'+BattleLog.parseMessage(' '+target)+'</em>'];

}
return[
'chat chatmessage-'+toId(name)+hlClass+mineClass,
''+timestamp+'<strong style="'+color+'">&bull;</strong> <em>'+clickableName+'<i>'+BattleLog.parseMessage(' '+target)+'</i></em>'];

case'mee':
if(!showMe){
return[
'chat chatmessage-'+toId(name)+hlClass+mineClass,
''+timestamp+'<strong style="'+color+'">'+clickableName+':</strong> <em>/me'+BattleLog.parseMessage(' '+target).slice(1)+'</em>'];

}
return[
'chat chatmessage-'+toId(name)+hlClass+mineClass,
''+timestamp+'<strong style="'+color+'">&bull;</strong> <em>'+clickableName+'<i>'+BattleLog.parseMessage(' '+target).slice(1)+'</i></em>'];

case'invite':
var roomid=toRoomid(target);
return[
'chat',
''+timestamp+'<em>'+clickableName+' invited you to join the room "'+roomid+'"</em>'+
'<div class="notice"><button name="joinRoom" value="'+roomid+'">Join '+roomid+'</button></div>'];

case'announce':
return[
'chat chatmessage-'+toId(name)+hlClass+mineClass,
''+timestamp+'<strong style="'+color+'">'+clickableName+':</strong> <span class="message-announce">'+BattleLog.parseMessage(target)+'</span>'];

case'log':
return[
'chat chatmessage-'+toId(name)+hlClass+mineClass,
''+timestamp+'<span class="message-log">'+BattleLog.parseMessage(target)+'</span>'];

case'data-pokemon':
case'data-item':
case'data-ability':
case'data-move':
return['chat message-error','[outdated code no longer supported]'];
case'text':
return['chat',BattleLog.parseMessage(target)];
case'error':
return['chat message-error',BattleLog.escapeHTML(target)];
case'html':
return[
'chat chatmessage-'+toId(name)+hlClass+mineClass,
''+timestamp+'<strong style="'+color+'">'+clickableName+':</strong> <em>'+BattleLog.sanitizeHTML(target)+'</em>'];

case'uhtml':
case'uhtmlchange':
var parts=target.split(',');
var _html=parts.slice(1).join(',').trim();
this.changeUhtml(parts[0],_html,cmd==='uhtml');
return['',''];
case'raw':
return['chat',BattleLog.sanitizeHTML(target)];
default:

if(!name){
return['chat'+hlClass,timestamp+'<em>'+BattleLog.parseMessage(message)+'</em>'];
}
return[
'chat chatmessage-'+toId(name)+hlClass+mineClass,
''+timestamp+'<strong style="'+color+'">'+clickableName+':</strong> <em>'+BattleLog.parseMessage(message)+'</em>'];}


};BattleLog.

parseMessage=function parseMessage(str){

if(str.substr(0,3)==='>> '||str.substr(0,4)==='>>> ')return this.escapeHTML(str);

if(str.substr(0,3)==='<< ')return this.escapeHTML(str);
str=formatText(str);

var options=BattleLog.prefs('chatformatting')||{};

if(options.hidelinks){
str=str.replace(/<a[^>]*>/g,'<u>').replace(/<\/a>/g,'</u>');
}
if(options.hidespoiler){
str=str.replace(/<span class="spoiler">/g,'<span class="spoiler spoiler-shown">');
}
if(options.hidegreentext){
str=str.replace(/<span class="greentext">/g,'<span>');
}

return str;
};BattleLog.
























initSanitizeHTML=function initSanitizeHTML(){
if(this.tagPolicy)return;
if(!('html4'in window)){
throw new Error('sanitizeHTML requires caja');
}

Object.assign(html4.ELEMENTS,{
marquee:0,
blink:0,
psicon:html4.eflags['OPTIONAL_ENDTAG']|html4.eflags['EMPTY']});

Object.assign(html4.ATTRIBS,{

'marquee::behavior':0,
'marquee::bgcolor':0,
'marquee::direction':0,
'marquee::height':0,
'marquee::hspace':0,
'marquee::loop':0,
'marquee::scrollamount':0,
'marquee::scrolldelay':0,
'marquee::truespeed':0,
'marquee::vspace':0,
'marquee::width':0,
'psicon::pokemon':0,
'psicon::item':0});


this.tagPolicy=function(tagName,attribs){
if(html4.ELEMENTS[tagName]&html4.eflags['UNSAFE']){
return;
}
var targetIdx=0;
var srcIdx=0;
if(tagName==='a'){


for(var i=0;i<attribs.length-1;i+=2){
switch(attribs[i]){
case'target':
targetIdx=i+1;
break;}

}
}
var dataUri='';
if(tagName==='img'){
for(var _i9=0;_i9<attribs.length-1;_i9+=2){
if(attribs[_i9]==='src'&&attribs[_i9+1].substr(0,11)==='data:image/'){
srcIdx=_i9;
dataUri=attribs[_i9+1];
}
if(attribs[_i9]==='src'&&attribs[_i9+1].substr(0,2)==='//'){
if(location.protocol!=='http:'&&location.protocol!=='https:'){
attribs[_i9+1]='http:'+attribs[_i9+1];
}
}
}
}else if(tagName==='psicon'){


var classValueIndex=-1;
var styleValueIndex=-1;
var iconAttrib=null;
for(var _i10=0;_i10<attribs.length-1;_i10+=2){
if(attribs[_i10]==='pokemon'||attribs[_i10]==='item'){

iconAttrib=attribs.slice(_i10,_i10+2);
}else if(attribs[_i10]==='class'){
classValueIndex=_i10+1;
}else if(attribs[_i10]==='style'){
styleValueIndex=_i10+1;
}
}
tagName='span';

if(iconAttrib){
if(classValueIndex<0){
attribs.push('class','');
classValueIndex=attribs.length-1;
}
if(styleValueIndex<0){
attribs.push('style','');
styleValueIndex=attribs.length-1;
}


if(iconAttrib[0]==='pokemon'){
attribs[classValueIndex]=attribs[classValueIndex]?'picon '+attribs[classValueIndex]:'picon';
attribs[styleValueIndex]=attribs[styleValueIndex]?
Dex.getPokemonIcon(iconAttrib[1])+'; '+attribs[styleValueIndex]:
Dex.getPokemonIcon(iconAttrib[1]);
}else if(iconAttrib[0]==='item'){
attribs[classValueIndex]=attribs[classValueIndex]?'itemicon '+attribs[classValueIndex]:'itemicon';
attribs[styleValueIndex]=attribs[styleValueIndex]?
Dex.getItemIcon(iconAttrib[1])+'; '+attribs[styleValueIndex]:
Dex.getItemIcon(iconAttrib[1]);
}
}
}

if(attribs[targetIdx]==='replace'){
targetIdx=-targetIdx;
}
attribs=html.sanitizeAttribs(tagName,attribs,function(urlData){
if(urlData.scheme_==='geo'||urlData.scheme_==='sms'||urlData.scheme_==='tel')return null;
return urlData;
});
if(targetIdx<0){
targetIdx=-targetIdx;
attribs[targetIdx-1]='data-target';
attribs[targetIdx]='replace';
targetIdx=0;
}

if(dataUri&&tagName==='img'){
attribs[srcIdx+1]=dataUri;
}
if(tagName==='a'||tagName==='form'){
if(targetIdx){
attribs[targetIdx]='_blank';
}else{
attribs.push('target');
attribs.push('_blank');
}
if(tagName==='a'){
attribs.push('rel');
attribs.push('noopener');
}
}
return{tagName:tagName,attribs:attribs};
};
};BattleLog.
localizeTime=function localizeTime(full,date,time,timezone){
var parsedTime=new Date(date+'T'+time+(timezone||'Z').toUpperCase());



if(!parsedTime.getTime())return full;

var formattedTime;

if(window.Intl&&Intl.DateTimeFormat){
formattedTime=new Intl.DateTimeFormat(undefined,{
month:'long',day:'numeric',hour:'numeric',minute:'numeric'}).
format(parsedTime);
}else{


formattedTime=parsedTime.toLocaleString();
}
return'<time>'+BattleLog.escapeHTML(formattedTime)+'</time>';
};BattleLog.
sanitizeHTML=function sanitizeHTML(input){
this.initSanitizeHTML();
var sanitized=html.sanitizeWithPolicy(getString(input),this.tagPolicy);















return sanitized.replace(
/<time>\s*([+-]?\d{4,}-\d{2}-\d{2})[T ](\d{2}:\d{2}(?::\d{2}(?:\.\d{3})?)?)(Z|[+-]\d{2}:\d{2})?\s*<\/time>/ig,
this.localizeTime);
};BattleLog.


























createReplayFile=function createReplayFile(room){
var battle=room.battle;
var replayid=room.id;
if(replayid){

replayid=replayid.slice(7);
if(Config.server.id!=='showdown'){
if(!Config.server.registered){
replayid='unregisteredserver-'+replayid;
}else{
replayid=Config.server.id+'-'+replayid;
}
}
}else{

replayid=room.fragment;
}
battle.fastForwardTo(-1);
var buf='<!DOCTYPE html>\n';
buf+='<meta charset="utf-8" />\n';
buf+='<!-- version 1 -->\n';
buf+='<title>'+BattleLog.escapeHTML(battle.tier)+' replay: '+BattleLog.escapeHTML(battle.p1.name)+' vs. '+BattleLog.escapeHTML(battle.p2.name)+'</title>\n';
buf+='<style>\n';
buf+='html,body {font-family:Verdana, sans-serif;font-size:10pt;margin:0;padding:0;}body{padding:12px 0;} .battle-log {font-family:Verdana, sans-serif;font-size:10pt;} .battle-log-inline {border:1px solid #AAAAAA;background:#EEF2F5;color:black;max-width:640px;margin:0 auto 80px;padding-bottom:5px;} .battle-log .inner {padding:4px 8px 0px 8px;} .battle-log .inner-preempt {padding:0 8px 4px 8px;} .battle-log .inner-after {margin-top:0.5em;} .battle-log h2 {margin:0.5em -8px;padding:4px 8px;border:1px solid #AAAAAA;background:#E0E7EA;border-left:0;border-right:0;font-family:Verdana, sans-serif;font-size:13pt;} .battle-log .chat {vertical-align:middle;padding:3px 0 3px 0;font-size:8pt;} .battle-log .chat strong {color:#40576A;} .battle-log .chat em {padding:1px 4px 1px 3px;color:#000000;font-style:normal;} .chat.mine {background:rgba(0,0,0,0.05);margin-left:-8px;margin-right:-8px;padding-left:8px;padding-right:8px;} .spoiler {color:#BBBBBB;background:#BBBBBB;padding:0px 3px;} .spoiler:hover, .spoiler:active, .spoiler-shown {color:#000000;background:#E2E2E2;padding:0px 3px;} .spoiler a {color:#BBBBBB;} .spoiler:hover a, .spoiler:active a, .spoiler-shown a {color:#2288CC;} .chat code, .chat .spoiler:hover code, .chat .spoiler:active code, .chat .spoiler-shown code {border:1px solid #C0C0C0;background:#EEEEEE;color:black;padding:0 2px;} .chat .spoiler code {border:1px solid #CCCCCC;background:#CCCCCC;color:#CCCCCC;} .battle-log .rated {padding:3px 4px;} .battle-log .rated strong {color:white;background:#89A;padding:1px 4px;border-radius:4px;} .spacer {margin-top:0.5em;} .message-announce {background:#6688AA;color:white;padding:1px 4px 2px;} .message-announce a, .broadcast-green a, .broadcast-blue a, .broadcast-red a {color:#DDEEFF;} .broadcast-green {background-color:#559955;color:white;padding:2px 4px;} .broadcast-blue {background-color:#6688AA;color:white;padding:2px 4px;} .infobox {border:1px solid #6688AA;padding:2px 4px;} .infobox-limited {max-height:200px;overflow:auto;overflow-x:hidden;} .broadcast-red {background-color:#AA5544;color:white;padding:2px 4px;} .message-learn-canlearn {font-weight:bold;color:#228822;text-decoration:underline;} .message-learn-cannotlearn {font-weight:bold;color:#CC2222;text-decoration:underline;} .message-effect-weak {font-weight:bold;color:#CC2222;} .message-effect-resist {font-weight:bold;color:#6688AA;} .message-effect-immune {font-weight:bold;color:#666666;} .message-learn-list {margin-top:0;margin-bottom:0;} .message-throttle-notice, .message-error {color:#992222;} .message-overflow, .chat small.message-overflow {font-size:0pt;} .message-overflow::before {font-size:9pt;content:\'...\';} .subtle {color:#3A4A66;}\n';
buf+='</style>\n';
buf+='<div class="wrapper replay-wrapper" style="max-width:1180px;margin:0 auto">\n';
buf+='<input type="hidden" name="replayid" value="'+replayid+'" />\n';
buf+='<div class="battle"></div><div class="battle-log"></div><div class="replay-controls"></div><div class="replay-controls-2"></div>\n';
buf+='<h1 style="font-weight:normal;text-align:center"><strong>'+BattleLog.escapeHTML(battle.tier)+'</strong><br /><a href="http://pokemonshowdown.com/users/'+toId(battle.p1.name)+'" class="subtle" target="_blank">'+BattleLog.escapeHTML(battle.p1.name)+'</a> vs. <a href="http://pokemonshowdown.com/users/'+toId(battle.p2.name)+'" class="subtle" target="_blank">'+BattleLog.escapeHTML(battle.p2.name)+'</a></h1>\n';
buf+='<script type="text/plain" class="battle-log-data">'+battle.activityQueue.join('\n').replace(/\//g,'\\/')+'</script>\n';
buf+='</div>\n';
buf+='<div class="battle-log battle-log-inline"><div class="inner">'+battle.scene.log.elem.innerHTML+'</div></div>\n';
buf+='</div>\n';
buf+='<script>\n';
buf+='let daily = Math.floor(Date.now()/1000/60/60/24);document.write(\'<script src="https://play.pokemonshowdown.com/js/replay-embed.js?version\'+daily+\'"></\'+\'script>\');\n';
buf+='</script>\n';
return buf;
};BattleLog.

createReplayFileHref=function createReplayFileHref(room){


return'data:text/plain;base64,'+encodeURIComponent(btoa(unescape(encodeURIComponent(BattleLog.createReplayFile(room)))));
};return BattleLog;}();BattleLog.colorCache={};BattleLog.interstice=function(){var whitelist=window.Config&&Config.whitelist?Config.whitelist:[];var patterns=whitelist.map(function(entry){return new RegExp("^(https?:)?//([A-Za-z0-9-]*\\.)?"+entry+"(/.*)?",'i');});return{isWhitelisted:function(uri){if(uri[0]==='/'&&uri[1]!=='/'){return true;}for(var _i11=0;_i11<patterns.length;_i11++){var pattern=patterns[_i11];if(pattern.test(uri))return true;}return false;},getURI:function(uri){return'http://pokemonshowdown.com/interstice?uri='+encodeURIComponent(uri);}};}();BattleLog.tagPolicy=null;


exports.BattleLog=BattleLog;

/**
 * Pokemon Showdown Log Misc
 *
 * Some miscellaneous helper functions for battle-log.ts, namely:
 *
 * - an MD5 hasher
 *
 * - a parseText function (for converting chat text to HTML),
 *   cross-compiled from the server
 *
 * Licensing note: PS's client has complicated licensing:
 * - The client as a whole is AGPLv3
 * - The battle replay/animation engine (battle-*.ts) by itself is MIT
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */

/* eslint-disable */

// MD5 minified
function MD5(f){function i(b,c){var d,e,f,g,h;f=b&2147483648;g=c&2147483648;d=b&1073741824;e=c&1073741824;h=(b&1073741823)+(c&1073741823);return d&e?h^2147483648^f^g:d|e?h&1073741824?h^3221225472^f^g:h^1073741824^f^g:h^f^g}function j(b,c,d,e,f,g,h){b=i(b,i(i(c&d|~c&e,f),h));return i(b<<g|b>>>32-g,c)}function k(b,c,d,e,f,g,h){b=i(b,i(i(c&e|d&~e,f),h));return i(b<<g|b>>>32-g,c)}function l(b,c,e,d,f,g,h){b=i(b,i(i(c^e^d,f),h));return i(b<<g|b>>>32-g,c)}function m(b,c,e,d,f,g,h){b=i(b,i(i(e^(c|~d),
f),h));return i(b<<g|b>>>32-g,c)}function n(b){var c="",e="",d;for(d=0;d<=3;d++)e=b>>>d*8&255,e="0"+e.toString(16),c+=e.substr(e.length-2,2);return c}var g=[],o,p,q,r,b,c,d,e,f=function(b){for(var b=b.replace(/\r\n/g,"\n"),c="",e=0;e<b.length;e++){var d=b.charCodeAt(e);d<128?c+=String.fromCharCode(d):(d>127&&d<2048?c+=String.fromCharCode(d>>6|192):(c+=String.fromCharCode(d>>12|224),c+=String.fromCharCode(d>>6&63|128)),c+=String.fromCharCode(d&63|128))}return c}(f),g=function(b){var c,d=b.length;c=
d+8;for(var e=((c-c%64)/64+1)*16,f=Array(e-1),g=0,h=0;h<d;)c=(h-h%4)/4,g=h%4*8,f[c]|=b.charCodeAt(h)<<g,h++;f[(h-h%4)/4]|=128<<h%4*8;f[e-2]=d<<3;f[e-1]=d>>>29;return f}(f);b=1732584193;c=4023233417;d=2562383102;e=271733878;for(f=0;f<g.length;f+=16)o=b,p=c,q=d,r=e,b=j(b,c,d,e,g[f+0],7,3614090360),e=j(e,b,c,d,g[f+1],12,3905402710),d=j(d,e,b,c,g[f+2],17,606105819),c=j(c,d,e,b,g[f+3],22,3250441966),b=j(b,c,d,e,g[f+4],7,4118548399),e=j(e,b,c,d,g[f+5],12,1200080426),d=j(d,e,b,c,g[f+6],17,2821735955),c=
j(c,d,e,b,g[f+7],22,4249261313),b=j(b,c,d,e,g[f+8],7,1770035416),e=j(e,b,c,d,g[f+9],12,2336552879),d=j(d,e,b,c,g[f+10],17,4294925233),c=j(c,d,e,b,g[f+11],22,2304563134),b=j(b,c,d,e,g[f+12],7,1804603682),e=j(e,b,c,d,g[f+13],12,4254626195),d=j(d,e,b,c,g[f+14],17,2792965006),c=j(c,d,e,b,g[f+15],22,1236535329),b=k(b,c,d,e,g[f+1],5,4129170786),e=k(e,b,c,d,g[f+6],9,3225465664),d=k(d,e,b,c,g[f+11],14,643717713),c=k(c,d,e,b,g[f+0],20,3921069994),b=k(b,c,d,e,g[f+5],5,3593408605),e=k(e,b,c,d,g[f+10],9,38016083),
d=k(d,e,b,c,g[f+15],14,3634488961),c=k(c,d,e,b,g[f+4],20,3889429448),b=k(b,c,d,e,g[f+9],5,568446438),e=k(e,b,c,d,g[f+14],9,3275163606),d=k(d,e,b,c,g[f+3],14,4107603335),c=k(c,d,e,b,g[f+8],20,1163531501),b=k(b,c,d,e,g[f+13],5,2850285829),e=k(e,b,c,d,g[f+2],9,4243563512),d=k(d,e,b,c,g[f+7],14,1735328473),c=k(c,d,e,b,g[f+12],20,2368359562),b=l(b,c,d,e,g[f+5],4,4294588738),e=l(e,b,c,d,g[f+8],11,2272392833),d=l(d,e,b,c,g[f+11],16,1839030562),c=l(c,d,e,b,g[f+14],23,4259657740),b=l(b,c,d,e,g[f+1],4,2763975236),
e=l(e,b,c,d,g[f+4],11,1272893353),d=l(d,e,b,c,g[f+7],16,4139469664),c=l(c,d,e,b,g[f+10],23,3200236656),b=l(b,c,d,e,g[f+13],4,681279174),e=l(e,b,c,d,g[f+0],11,3936430074),d=l(d,e,b,c,g[f+3],16,3572445317),c=l(c,d,e,b,g[f+6],23,76029189),b=l(b,c,d,e,g[f+9],4,3654602809),e=l(e,b,c,d,g[f+12],11,3873151461),d=l(d,e,b,c,g[f+15],16,530742520),c=l(c,d,e,b,g[f+2],23,3299628645),b=m(b,c,d,e,g[f+0],6,4096336452),e=m(e,b,c,d,g[f+7],10,1126891415),d=m(d,e,b,c,g[f+14],15,2878612391),c=m(c,d,e,b,g[f+5],21,4237533241),
b=m(b,c,d,e,g[f+12],6,1700485571),e=m(e,b,c,d,g[f+3],10,2399980690),d=m(d,e,b,c,g[f+10],15,4293915773),c=m(c,d,e,b,g[f+1],21,2240044497),b=m(b,c,d,e,g[f+8],6,1873313359),e=m(e,b,c,d,g[f+15],10,4264355552),d=m(d,e,b,c,g[f+6],15,2734768916),c=m(c,d,e,b,g[f+13],21,1309151649),b=m(b,c,d,e,g[f+4],6,4149444226),e=m(e,b,c,d,g[f+11],10,3174756917),d=m(d,e,b,c,g[f+2],15,718787259),c=m(c,d,e,b,g[f+9],21,3951481745),b=i(b,o),c=i(c,p),d=i(d,q),e=i(e,r);return(n(b)+n(c)+n(d)+n(e)).toLowerCase()};

// text formatter, transpiled from server chat-formatter.js
var formatText = (function(){function g(d,a){a=void 0===a?!1:a;d=(""+d).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");this.f=d=d.replace(h,function(a){if(/^[a-z0-9.]+@/ig.test(a))var c="mailto:"+a;else if(c=a.replace(/^([a-z]*[^a-z:])/g,"http://$1"),"https://docs.google.com/"===a.substr(0,24)||"docs.google.com/"===a.substr(0,16)){"https"===a.slice(0,5)&&(a=a.slice(8));if("?usp=sharing"===a.substr(-12)||"&usp=sharing"===a.substr(-12))a=a.slice(0,-12);
"#gid=0"===a.substr(-6)&&(a=a.slice(0,-6));var b=a.lastIndexOf("/");18<a.length-b&&(b=a.length);22<b-4&&(a=a.slice(0,19)+'<small class="message-overflow">'+a.slice(19,b-4)+"</small>"+a.slice(b-4))}return'<a href="'+c+'" rel="noopener" target="_blank">'+a+"</a>"});this.b=[];this.stack=[];this.isTrusted=a;this.offset=0}var h=/(?:(?:(?:https?:\/\/|\bwww[.])[a-z0-9-]+(?:[.][a-z0-9-]+)*|\b[a-z0-9-]+(?:[.][a-z0-9-]+)*[.](?:com?|org|net|edu|info|us|jp|[a-z]{2,3}(?=[:/])))(?:[:][0-9]+)?\b(?:\/(?:(?:[^\s()&<>]|&amp;|&quot;|[(](?:[^\s()<>&]|&amp;)*[)])*(?:[^\s`()[\]{}'".,!?;:&<>*`^~\\]|[(](?:[^\s()<>&]|&amp;)*[)]))?)?|[a-z0-9.]+\b@[a-z0-9-]+(?:[.][a-z0-9-]+)*[.][a-z]{2,3})(?![^ ]*&gt;)/ig;
g.prototype.slice=function(d,a){return this.f.slice(d,a)};g.prototype.a=function(d){return this.f.charAt(d)};g.prototype.i=function(d,a,b){this.c(a);this.stack.push([d,this.b.length]);this.b.push(this.slice(a,b));this.offset=b};g.prototype.c=function(d){d!==this.offset&&(this.b.push(this.slice(this.offset,d)),this.offset=d)};g.prototype.m=function(d){for(var a=-1,b=this.stack.length-1;0<=b;b--){var c=this.stack[b];if("("===c[0]){a=b;break}if("spoiler"!==c[0])break}if(-1!==a){for(this.c(d);this.stack.length>
a;)this.h(d);this.offset=d}};g.prototype.o=function(d,a,b){for(var c=-1,e=this.stack.length-1;0<=e;e--)if(this.stack[e][0]===d){c=e;break}if(-1===c)return!1;for(this.c(a);this.stack.length>c+1;)this.h(a);a=this.stack.pop()[1];c="";switch(d){case "_":c="i";break;case "*":c="b";break;case "~":c="s";break;case "^":c="sup";break;case "\\":c="sub"}c&&(this.b[a]="<"+c+">",this.b.push("</"+c+">"),this.offset=b);return!0};g.prototype.h=function(d){var a=this.stack.pop();if(a)switch(this.c(d),a[0]){case "spoiler":this.b.push("</span>");
this.b[a[1]]='<span class="spoiler">';break;case ">":this.b.push("</span>"),this.b[a[1]]='<span class="greentext">'}};g.prototype.j=function(d){for(;this.stack.length;)this.h(d);this.c(d)};g.prototype.l=function(d){d=d.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'");return encodeURIComponent(d)};g.prototype.g=function(d,a){switch(d){case "`":for(var b=0,c=a;"`"===this.a(c);)b++,c++;for(var e=0;c<this.f.length;){var f=this.a(c);if("\n"===
f)break;if("`"===f)e++;else{if(e===b)break;e=0}c++}if(e!==b)break;this.c(a);this.b.push("<code>");e=a+b;b=c-b;e+1>=b||(" "===this.a(e)&&" "===this.a(b-1)?(e++,b--):" "===this.a(e)&&"`"===this.a(e+1)?e++:" "===this.a(b-1)&&"`"===this.a(b-2)&&b--);this.b.push(this.slice(e,b));this.b.push("</code>");this.offset=c;break;case "[":if("[["!==this.slice(a,a+2))break;c=a+2;for(f=e=-1;c<this.f.length;){b=this.a(c);if("]"===b||"\n"===b)break;":"===b&&0>e&&(e=c);"&"===b&&"&lt;"===this.slice(c,c+4)&&(f=c);c++}if("]]"!==
this.slice(c,c+2))break;var g=c;b="";0<=f&&"&gt;"===this.slice(c-4,c)&&(b=this.slice(f+4,c-4),g=f," "===this.a(g-1)&&g--,b=encodeURI(b.replace(/^([a-z]*[^a-z:])/g,"http://$1")));f=this.slice(a+2,g).replace(/<\/?a(?: [^>]+)?>/g,"");b&&!this.isTrusted&&(g=b.replace(/^https?:\/\//,"").replace(/^www\./,"").replace(/\/$/,""),f+="<small> &lt;"+g+"&gt;</small>",b+='" rel="noopener');if(0<e)switch(e=this.slice(a+2,e).toLowerCase(),e){case "w":case "wiki":f=f.slice(" "===f.charAt(e.length+1)?e.length+2:e.length+
1);b="//en.wikipedia.org/w/index.php?title=Special:Search&search="+this.l(f);f="wiki: "+f;break;case "pokemon":case "item":f=f.slice(" "===f.charAt(e.length+1)?e.length+2:e.length+1),g=this.isTrusted?"<psicon "+e+'="'+f+'"/>':"["+f+"]",b=e,"item"===e&&(b+="s"),b="//dex.pokemonshowdown.com/"+b+"/"+toId(f),f=g}b||(b="//www.google.com/search?ie=UTF-8&btnI&q="+this.l(f));this.c(a);this.b.push('<a href="'+b+'" target="_blank">'+f+"</a>");this.offset=c+2;break;case "<":if("&lt;&lt;"!==this.slice(a,a+8))break;
for(c=a+8;/[a-z0-9-]/.test(this.a(c));)c++;if("&gt;&gt;"!==this.slice(c,c+8))break;this.c(a);b=this.slice(a+8,c);this.b.push('&laquo;<a href="/'+b+'" target="_blank">'+b+"</a>&raquo;");this.offset=c+8;break;case "a":for(c=a+1;"/"!==this.a(c)||"a"!==this.a(c+1)||">"!==this.a(c+2);)c++;this.c(c+3)}};g.prototype.get=function(){for(var d=this.offset,a=d;a<this.f.length;a++){var b=this.a(a);switch(b){case "_":case "*":case "~":case "^":case "\\":if(this.a(a+1)===b&&this.a(a+2)!==b&&(" "!==this.a(a-1)&&
this.o(b,a,a+2)||" "!==this.a(a+2)&&this.i(b,a,a+2),a<this.offset)){a=this.offset-1;break}for(;this.a(a+1)===b;)a++;break;case "(":this.stack.push(["(",-1]);break;case ")":this.m(a);a<this.offset&&(a=this.offset-1);break;case "`":"`"===this.a(a+1)&&this.g("`",a);if(a<this.offset){a=this.offset-1;break}for(;"`"===this.a(a+1);)a++;break;case "[":this.g("[",a);if(a<this.offset){a=this.offset-1;break}for(;"["===this.a(a+1);)a++;break;case ":":if(7>a)break;if("spoiler:"===this.slice(a-7,a+1).toLowerCase()||
"spoilers:"===this.slice(a-8,a+1).toLowerCase())" "===this.a(a+1)&&a++,this.i("spoiler",a+1,a+1);break;case "&":a===d&&"&gt;"===this.slice(a,a+4)?"._/=:;".includes(this.a(a+4))||["w&lt;","w&gt;"].includes(this.slice(a+4,a+9))||this.i(">",a,a):this.g("<",a);if(a<this.offset){a=this.offset-1;break}for(;"lt;&"===this.slice(a+1,a+5);)a+=4;break;case "<":this.g("a",a);a<this.offset&&(a=this.offset-1);break;case "\r":case "\n":this.j(a),d=a+1}}this.j(this.f.length);return this.b.join("")};return function(d,
a){return(new g(d,void 0===a?!1:a)).get()}})();
/* eslint-enable */
exports.BattleText = {
	default: {
		startBattle: "Battle started between [TRAINER] and [TRAINER]!",
		winBattle: "**[TRAINER]** won the battle!",
		tieBattle: "Tie between [TRAINER] and [TRAINER]!",

		pokemon: "[NICKNAME]",
		opposingPokemon: "the opposing [NICKNAME]",
		team: "your team",
		opposingTeam: "the opposing team",

		turn: "== Turn [NUMBER] ==",
		switchIn: "[TRAINER] sent out [FULLNAME]!",
		switchInOwn: "Go! [FULLNAME]!",
		switchOut: "[TRAINER] withdrew [NICKNAME]!",
		switchOutOwn: "[NICKNAME], come back!",
		drag: "[FULLNAME] was dragged out!",
		faint: "[POKEMON] fainted!",
		swap: "[POKEMON] and [TARGET] switched places!",
		swapCenter: "[POKEMON] moved to the center!",

		zEffect: "  [POKEMON] unleases its full-force Z-Move!",
		move: "[POKEMON] used **[MOVE]**!",
		abilityActivation: "  [[POKEMON]'s [ABILITY]]",

		mega: "  [POKEMON]'s [ITEM] is reacting to the Key Stone!",
		megaNoItem: "  [POKEMON] is reacting to [TRAINER]'s Key Stone!",
		megaGen6: "  [POKEMON]'s [ITEM] is reacting to [TRAINER]'s Mega Bracelet!",
		transformMega: "[POKEMON] has Mega Evolved into Mega [SPECIES]!",
		primal: "[POKEMON]'s Primal Reversion! It reverted to its primal state!",
		zPower: "  [POKEMON] surrounded itself with its Z-Power!",
		zBroken: "  [POKEMON] couldn't fully protect itself and got hurt!",

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON] can't use [MOVE]!",
		cantNoMove: "[POKEMON] can't move!",
		fail: "  But it failed!",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "[POKEMON] transformed!",
		typeChange: "  [POKEMON] transformed into the [TYPE] type!",
		typeChangeFromEffect: "  [POKEMON]'s [EFFECT] made it the [TYPE] type!",
		typeAdd: "  [TYPE] type was added to [POKEMON]!",

		start: "  ([EFFECT] started on [POKEMON]!)",
		end: "  [POKEMON] was freed from [EFFECT]!",
		activate: "  ([EFFECT] activated!)",
		startTeamEffect: "  ([EFFECT] started on [TEAM]!)",
		endTeamEffect: "  ([EFFECT] ended on [TEAM]!)",
		startFieldEffect: "  ([EFFECT] started!)",
		endFieldEffect: "  ([EFFECT] ended!)",

		changeAbility: "  [POKEMON] acquired [ABILITY]!",
		addItem: "  [POKEMON] obtained one [ITEM].", // Trick, Switcheroo
		takeItem: "  [POKEMON] stole [SOURCE]'s [ITEM]!", // Thief, Covet, Magician, Pickpocket
		eatItem: "  [POKEMON] ate its [ITEM]!",
		useGem: "  The [ITEM] strengthened [POKEMON]'s power!",
		eatItemWeaken: "  The [ITEM] weakened damage to [POKEMON]!",
		removeItem: "  [POKEMON] lost its [ITEM]!",
		activateItem: "  ([POKEMON] used its [ITEM]!)",
		activateWeaken: "  The [ITEM] weakened the damage to [POKEMON]!",

		damage: "  ([POKEMON] was hurt!)",
		damagePercentage: "  ([POKEMON] lost [PERCENTAGE] of its health!)",
		damageFromPokemon: "  [POKEMON] is hurt by [SOURCE]'s [ITEM]!", // Jaboca/Rowap Berry
		damageFromItem: "  [POKEMON] is hurt by its [ITEM]!", // Sticky Barb
		damageFromPartialTrapping: "  [POKEMON] is hurt by [MOVE]!",
		heal: "  [POKEMON] restored its HP.",
		healFromZEffect: "  [POKEMON] restored its HP using its Z-Power!",
		healFromEffect: "  [POKEMON] restored HP using its [EFFECT]!",

		boost: "  [POKEMON]'s [STAT] rose!",
		boost2: "  [POKEMON]'s [STAT] rose sharply!",
		boost3: "  [POKEMON]'s [STAT] rose drastically!",
		boost0: "  [POKEMON]'s [STAT] won't go any higher!",
		boostFromItem: "  The [ITEM] raised [POKEMON]'s [STAT]!",
		boost2FromItem: "  The [ITEM] sharply raised [POKEMON]'s [STAT]!",
		boost3FromItem: "  The [ITEM] drastically raised [POKEMON]'s [STAT]!",
		boostFromZEffect: "  [POKEMON] boosted its [STAT] using its Z-Power!",
		boost2FromZEffect: "  [POKEMON] boosted its [STAT] sharply using its Z-Power!",
		boost3FromZEffect: "  [POKEMON] boosted its [STAT] drastically using its Z-Power!",
		boostMultipleFromZEffect: "  [POKEMON] boosted its stats using its Z-Power!",

		unboost: "  [POKEMON]'s [STAT] fell!",
		unboost2: "  [POKEMON]'s [STAT] fell harshly!",
		unboost3: "  [POKEMON]'s [STAT] fell severely!",
		unboost0: "  [POKEMON]'s [STAT] won't go any lower!",
		unboostFromItem: "  The [ITEM] lowered [POKEMON]'s [STAT]!",
		unboost2FromItem: "  The [ITEM] harshly lowered [POKEMON]'s [STAT]!",
		unboost3FromItem: "  The [ITEM] drastically lowered [POKEMON]'s [STAT]!",

		swapBoost: "  [POKEMON] switched stat changes with its target!",
		swapOffensiveBoost: "  [POKEMON] switched all changes to its Attack and Sp. Atk with its target!",
		swapDefensiveBoost: "  [POKEMON] switched all changes to its Defense and Sp. Def with its target!",
		copyBoost: "  [POKEMON] copied [TARGET]'s stat changes!",
		clearBoost: "  [POKEMON]'s stat changes were removed!",
		clearBoostFromZEffect: "  [POKEMON] returned its decreased stats to normal using its Z-Power!",
		invertBoost: "  [POKEMON]'s stat changes were inverted!",
		clearAllBoost: "  All stat changes were eliminated!",

		superEffective: "  It's super effective!",
		superEffectiveSpread: "  It's super effective on [POKEMON]!",
		resisted: "  It's not very effective...",
		resistedSpread: "  It's not very effective on [POKEMON].",
		crit: "  A critical hit!",
		critSpread: "  A critical hit on [POKEMON]!",
		immune: "  It doesn't affect [POKEMON]...",
		immuneNoPokemon: "  It had no effect!", // old gens
		immuneOHKO: "  [POKEMON] is unaffected!",
		miss: "  [POKEMON] avoided the attack!",
		missNoPokemon: "  [SOURCE]'s attack missed!", // old gens

		center: "  Automatic center!",
		noTarget: "  But there was no target...", // gen 5 and earlier
		ohko: "  It's a one-hit KO!",
		combine: "  The two moves have become one! It's a combined move!",
		hitCount: "  Hit [NUMBER] times!",
		hitCountSingular: "  Hit 1 time!",
	},

	// stats
	hp: {
		statName: "HP",
	},
	atk: {
		statName: "Attack",
	},
	def: {
		statName: "Defense",
	},
	spa: {
		statName: "Special Attack",
	},
	spd: {
		statName: "Special Defense",
	},
	spe: {
		statName: "Speed",
	},
	accuracy: {
		statName: "accuracy",
	},
	evasion: {
		statName: "evasiveness",
	},
	spc: {
		statName: "Special",
	},
	stats: {
		statName: "stats",
	},

	// statuses
	brn: {
		start: "  [POKEMON] was burned!",
		startFromItem: "  [POKEMON] was burned by the [ITEM]!",
		alreadyStarted: "  [POKEMON] already has a burn.",
		end: "  [POKEMON]'s burn was healed.",
		endFromItem: "  [POKEMON]'s [ITEM] healed its burn!",
		damage: "  [POKEMON] was hurt by its burn!",
	},
	frz: {
		start: "  [POKEMON] was frozen solid!",
		alreadyStarted: "  [POKEMON] is already frozen solid!",
		end: "  [POKEMON] thawed out!",
		endFromItem: "  [POKEMON]'s [ITEM] defrosted it!",
		endFromMove: "  [POKEMON]'s [MOVE] melted the ice!",
		cant: "[POKEMON] is frozen solid!",
	},
	par: {
		start: "  [POKEMON] is paralyzed! It may be unable to move!",
		alreadyStarted: "  [POKEMON] is already paralyzed.",
		end: "  [POKEMON] was cured of paralysis.",
		endFromItem: "  [POKEMON]'s [ITEM] cured its paralysis!",
		cant: "[POKEMON] is paralyzed! It can't move!",
	},
	psn: {
		start: "  [POKEMON] was poisoned!",
		alreadyStarted: "  [POKEMON] is already poisoned.",
		end: "  [POKEMON] was cured of its poisoning.",
		endFromItem: "  [POKEMON]'s [ITEM] cured its poison!",
		damage: "  [POKEMON] was hurt by poison!",
	},
	tox: {
		start: "  [POKEMON] was badly poisoned!",
		startFromItem: "  [POKEMON] was badly poisoned by the [ITEM]!",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  [POKEMON] fell asleep!",
		startFromRest: "  [POKEMON] slept and became healthy!",
		alreadyStarted: "  [POKEMON] is already asleep!",
		end: "  [POKEMON] woke up!",
		endFromItem: "  [POKEMON]'s [ITEM] woke it up!",
		cant: "[POKEMON] is fast asleep.",
	},

	// misc effects
	confusion: {
		start: "  [POKEMON] became confused!",
		startFromFatigue: "  [POKEMON] became confused due to fatigue!",
		end: "  [POKEMON] snapped out of its confusion!",
		endFromItem: "  [POKEMON]'s [ITEM] snapped it out of its confusion!",
		alreadyStarted: "  [POKEMON] is already confused!",
		activate: "  [POKEMON] is confused!",
		damage: "It hurt itself in its confusion!",
	},
	drain: {
		heal: "  [SOURCE] had its energy drained!",
	},
	flinch: {
		cant: "[POKEMON] flinched and couldn't move!",
	},
	healreplacement: {
		activate: "  [POKEMON] will restore its replacement's HP using its Z-Power!",
	},
	nopp: {
		cant: "[POKEMON] used [MOVE]!\n  But there was no PP left for the move!",
	},
	recharge: {
		cant: "[POKEMON] must recharge!",
	},
	recoil: {
		damage: "  [POKEMON] is damaged by the recoil!",
	},
	unboost: {
		fail: "  [POKEMON]'s stats were not lowered!",
		failSingular: "  [POKEMON]'s [STAT] was not lowered!",
	},
	struggle: {
		activate: "  [POKEMON] has no moves left!",
	},
	trapped: {
		start: "  [POKEMON] can no longer escape!",
	},

	// weather
	sandstorm: {
		weatherName: "Sandstorm",
		start: "  A sandstorm kicked up!",
		end: "  The sandstorm subsided.",
		upkeep: "  The sandstorm is raging.",
		damage: "  [POKEMON] is buffeted by the sandstorm!",
	},
	sunnyday: {
		weatherName: "Sun",
		start: "  The sunlight turned harsh!",
		end: "  The sunlight faded.",
		upkeep: "  (The sunlight is strong!)",
	},
	raindance: {
		weatherName: "Rain",
		start: "  It started to rain!",
		end: "  The rain stopped.",
		upkeep: "  (Rain continues to fall!)",
	},
	hail: {
		weatherName: "Hail",
		start: "  It started to hail!",
		end: "  The hail stopped.",
		upkeep: "  The hail is crashing down.",
		damage: "  [POKEMON] is buffeted by the hail!",
	},
	desolateland: {
		weatherName: "Intense Sun",
		start: "  The sunlight turned extremely harsh!",
		end: "  The extremely harsh sunlight faded.",
		block: "  The extremely harsh sunlight was not lessened at all!",
		blockMove: "  The Water-type attack evaporated in the harsh sunlight!",
	},
	primordialsea: {
		weatherName: "Heavy Rain",
		start: "  A heavy rain began to fall!",
		end: "  The heavy rain has lifted!",
		block: "  There is no relief from this heavy rain!",
		blockMove: "  The Fire-type attack fizzled out in the heavy rain!",
	},
	deltastream: {
		weatherName: "Strong Winds",
		start: "  Mysterious strong winds are protecting Flying-type Pok\u00E9mon!",
		end: "  The mysterious strong winds have dissipated!",
		activate: "  The mysterious strong winds weakened the attack!",
		block: "  The mysterious strong winds blow on regardless!",
	},

	// terrain
	electricterrain: {
		start: "  An electric current runs across the battlefield!",
		end: "  The electricity disappeared from the battlefield.",
		block: "  [POKEMON] surrounds itself with electrified terrain!",
	},
	grassyterrain: {
		start: "  Grass grew to cover the battlefield!",
		end: "  The grass disappeared from the battlefield.",
	},
	mistyterrain: {
		start: "  Mist swirls around the battlefield!",
		end: "  The mist disappeared from the battlefield.",
		block: "  [POKEMON] surrounds itself with a protective mist!",
	},
	psychicterrain: {
		start: "  The battlefield got weird!",
		end: "  The weirdness disappeared from the battlefield!",
		block: "  [POKEMON] surrounds itself with psychic terrain!",
	},

	// field effects
	gravity: {
		start: "  Gravity intensified!",
		end: "  Gravity returned to normal!",
		cant: "[POKEMON] can't use [MOVE] because of gravity!",
		activate: "[POKEMON] couldn't stay airborne because of gravity!",
	},
	magicroom: {
		start: "  It created a bizarre area in which Pok\u00E9mon's held items lose their effects!",
		end: "  Magic Room wore off, and held items' effects returned to normal!",
	},
	mudsport: {
		start: "  Electricity's power was weakened!",
		end: "  The effects of Mud Sport have faded.",
	},
	trickroom: {
		start: "  [POKEMON] twisted the dimensions!",
		end: "  The twisted dimensions returned to normal!",
	},
	watersport: {
		start: "  Fire's power was weakened!",
		end: "  The effects of Water Sport have faded.",
	},
	wonderroom: {
		start: "  It created a bizarre area in which Defense and Sp. Def stats are swapped!",
		end: "  Wonder Room wore off, and Defense and Sp. Def stats returned to normal!",
	},

	// moves
	afteryou: {
		activate: "  [TARGET] took the kind offer!",
	},
	aquaring: {
		start: "  [POKEMON] surrounded itself with a veil of water!",
		heal: "  A veil of water restored [POKEMON]'s HP!",
	},
	aromatherapy: {
		activate: "  A soothing aroma wafted through the area!",
	},
	attract: {
		start: "  [POKEMON] fell in love!",
		startFromItem: "  [POKEMON] fell in love from the [ITEM]!",
		end: "  [POKEMON] got over its infatuation!",
		endFromItem: "  [POKEMON] cured its infatuation using its [ITEM]!",
		activate: "  [POKEMON] is in love with [TARGET]!",
		cant: "[POKEMON] is immobilized by love!",
	},
	auroraveil: {
		start: "  Aurora Veil made [TEAM] stronger against physical and special moves!",
		end: "  [TEAM]'s Aurora Veil wore off!",
	},
	autotomize: {
		start: "  [POKEMON] became nimble!",
	},
	beakblast: {
		start: "  [POKEMON] started heating up its beak!",
	},
	beatup: {
		activate: "  [TARGET]'s attack!", // past gen only
	},
	bestow: {
		takeItem: "  [POKEMON] received [ITEM] from [SOURCE]!",
	},
	bide: {
		start: "  [POKEMON] is storing energy!",
		end: "  [POKEMON] unleashed its energy!",
		activate: "  [POKEMON] is storing energy!",
	},
	bind: {
		start: "  [POKEMON] was squeezed by [SOURCE]!",
		move: "#wrap", // gen 1 only
	},
	brickbreak: {
		activate: "  [POKEMON] shattered [TEAM]'s protections!",
	},
	bellydrum: {
		boost: "  [POKEMON] cut its own HP and maximized its Attack!"
	},
	bounce: {
		prepare: "[POKEMON] sprang up!",
	},
	bugbite: {
		removeItem: "  [SOURCE] stole and ate its target's [ITEM]!",
	},
	burnup: {
		typeChange: "  [POKEMON] burned itself out!",
	},
	celebrate: {
		activate: "  Congratulations, [TRAINER]!",
	},
	charge: {
		start: "  [POKEMON] began charging power!",
	},
	clamp: {
		start: "  [SOURCE] clamped down on [POKEMON]!",
		move: "#wrap", // gen 1 only
	},
	craftyshield: {
		start: "  Crafty Shield protected [TEAM]!",
		block: "  Crafty Shield protected [POKEMON]!",
	},
	crash: {
		damage: "  [POKEMON] kept going and crashed!",
	},
	curse: {
		start: "  [SOURCE] cut its own HP and put a curse on [POKEMON]!",
		damage: "  [POKEMON] is afflicted by the curse!",
	},
	darkvoid: {
		fail: "But [POKEMON] can't use the move!",
		failWrongForme: "But [POKEMON] can't use it the way it is now!",
	},
	destinybond: {
		start: "[POKEMON] is hoping to take its attacker down with it!",
		activate: "  [POKEMON] took its attacker down with it!",
	},
	dig: {
		prepare: "[POKEMON] burrowed its way under the ground!",
	},
	disable: {
		start: "  [POKEMON]'s [MOVE] was disabled!",
		end: "  [POKEMON]'s move is no longer disabled!",
	},
	dive: {
		prepare: "[POKEMON] hid underwater!",
	},
	doomdesire: {
		start: "  [POKEMON] chose Doom Desire as its destiny!",
		activate: "  [TARGET] took the Doom Desire attack!",
	},
	dragonascent: {
		megaNoItem: "  [TRAINER]'s fervent wish has reached [POKEMON]!",
	},
	electrify: {
		start: "  [POKEMON]'s moves have been electrified!",
	},
	embargo: {
		start: "  [POKEMON] can't use items anymore!",
		end: "  [POKEMON] can use items again!",
	},
	encore: {
		start: "  [POKEMON] received an encore!",
		end: "  [POKEMON]'s encore ended!",
	},
	endure: {
		start: "  [POKEMON] braced itself!",
		activate: "  [POKEMON] endured the hit!",
	},
	fairylock: {
		activate: "  No one will be able to run away during the next turn!",
	},
	feint: {
		activate: "  [TARGET] fell for the feint!",
	},
	firepledge: {
		activate: "#waterpledge",
		start: "  A sea of fire enveloped [TEAM]!",
		end: "  The sea of fire around [TEAM] disappeared!",
		damage: "  [POKEMON] is hurt by the sea of fire!",
	},
	firespin: {
		start: "  [POKEMON] became trapped in the fiery vortex!",
		move: "#wrap", // gen 1 only
	},
	flameburst: {
		damage: "  The bursting flame hit [POKEMON]!",
	},
	fling: {
		removeItem: "  [POKEMON] flung its [ITEM]!",
	},
	fly: {
		prepare: "[POKEMON] flew up high!",
	},
	focusenergy: {
		start: "  [POKEMON] is getting pumped!",
		startFromItem: "  [POKEMON] used the [ITEM] to get pumped!",
		startFromZEffect: "  [POKEMON] boosted its critical-hit ratio using its Z-Power!",
	},
	focuspunch: {
		start: "  [POKEMON] is tightening its focus!",
		cant: "[POKEMON] lost its focus and couldn't move!",
	},
	followme: {
		start: "  [POKEMON] became the center of attention!",
		startFromZEffect: "  [POKEMON] became the center of attention!",
	},
	foresight: {
		start: "  [POKEMON] was identified!",
	},
	freezeshock: {
		prepare: "  [POKEMON] became cloaked in a freezing light!",
	},
	futuresight: {
		start: "  [POKEMON] foresaw an attack!",
		activate: "  [TARGET] took the Future Sight attack!",
	},
	gastroacid: {
		start: "  [POKEMON]'s Ability was suppressed!",
	},
	geomancy: {
		prepare: "[POKEMON] is absorbing power!",
	},
	grasspledge: {
		activate: "#waterpledge",
		start: "  A swamp enveloped [TEAM]!",
		end: "  The swamp around [TEAM] disappeared!",
	},
	grudge: {
		activate: "  [POKEMON]'s [MOVE] lost all of its PP due to the grudge!",
		start: "[POKEMON] wants its target to bear a grudge!",
	},
	guardsplit: {
		activate: "  [POKEMON] shared its guard with the target!",
	},
	happyhour: {
		activate: "  Everyone is caught up in the happy atmosphere!",
	},
	healbell: {
		activate: "  A bell chimed!",
	},
	healblock: {
		start: "  [POKEMON] was prevented from healing!",
		end: "  [POKEMON]'s Heal Block wore off!",
		cant: "[POKEMON] can't use [MOVE] because of Heal Block!",
	},
	healingwish: {
		heal: "  The healing wish came true for [POKEMON]!",
	},
	helpinghand: {
		start: "  [SOURCE] is ready to help [POKEMON]!",
	},
	highjumpkick: {
		damage: "#crash",
	},
	hyperspacefury: {
		activate: "#shadowforce",
		fail: "#darkvoid",
	},
	hyperspacehole: {
		activate: "#shadowforce",
	},
	iceburn: {
		prepare: "  [POKEMON] became cloaked in freezing air!",
	},
	imprison: {
		start: "  [POKEMON] sealed any moves its target shares with it!",
		cant: "[POKEMON] can't use its sealed [MOVE]!",
	},
	incinerate: {
		removeItem: "  [POKEMON]'s [ITEM] was burned up!",
	},
	infestation: {
		start: "  [POKEMON] has been afflicted with an infestation by [SOURCE]!",
	},
	ingrain: {
		start: "  [POKEMON] planted its roots!",
		block: "  [POKEMON] anchored itself with its roots!",
		heal: "  [POKEMON] absorbed nutrients with its roots!",
	},
	instruct: {
		activate: "  [TARGET] used the move instructed by [POKEMON]!",
	},
	iondeluge: {
		activate: "  A deluge of ions showers the battlefield!",
	},
	jumpkick: {
		damage: "#crash",
	},
	knockoff: {
		removeItem: "  [SOURCE] knocked off [POKEMON]'s [ITEM]!",
	},
	laserfocus: {
		start: "  [POKEMON] concentrated intensely!",
	},
	leechseed: {
		start: "  [POKEMON] was seeded!",
		end: "  [POKEMON] was freed from Leech Seed!",
		damage: "  [POKEMON]'s health is sapped by Leech Seed!",
	},
	lightscreen: {
		start: "  Light Screen made [TEAM] stronger against special moves!",
		end: "  [TEAM]'s Light Screen wore off!",
		// gen 1
		startGen1: "  [POKEMON]'s protected against special attacks!",
	},
	lockon: {
		start: "  [SOURCE] took aim at [POKEMON]!",
	},
	luckychant: {
		start: "  Lucky Chant shielded [TEAM] from critical hits!",
		end: "  [TEAM]'s Lucky Chant wore off!",
	},
	lunardance: {
		heal: "  [POKEMON] became cloaked in mystical moonlight!",
	},
	magiccoat: {
		start: "  [POKEMON] shrouded itself with Magic Coat!",
		move: "[POKEMON] bounced the [MOVE] back!",
	},
	magikarpsrevenge: {
		fail: "#darkvoid",
	},
	magmastorm: {
		start: "  [POKEMON] became trapped by swirling magma!",
	},
	magnitude: {
		activate: "  Magnitude [NUMBER]!",
	},
	matblock: {
		start: "  [POKEMON] intends to flip up a mat and block incoming attacks!",
		block: "  [MOVE] was blocked by the kicked-up mat!",
	},
	magnetrise: {
		start: "  [POKEMON] levitated with electromagnetism!",
		end: "  [POKEMON]'s electromagnetism wore off!",
		// "The electromagnetism of [POKEMON] wore off!" // PO artifact?
	},
	memento: {
		heal: "  [POKEMON]'s HP was restored by the Z-Power!",
	},
	metronome: {
		move: "Waggling a finger let it use [MOVE]!",
	},
	mimic: {
		start: "  [POKEMON] learned [MOVE]!",
	},
	mindreader: {
		start: "#lockon",
	},
	miracleeye: {
		start: "#foresight",
	},
	mist: {
		start: "  [TEAM] became shrouded in mist!",
		end: "  [TEAM] is no longer protected by mist!",
		block: "  [POKEMON] is protected by the mist!",
	},
	naturepower: {
		move: "Nature Power turned into [MOVE]!",
	},
	nightmare: {
		start: "  [POKEMON] began having a nightmare!",
		damage: "  [POKEMON] is locked in a nightmare!",
	},
	painsplit: {
		activate: "  The battlers shared their pain!",
	},
	partingshot: {
		heal: "#memento",
	},
	payday: {
		activate: "  Coins were scattered everywhere!",
	},
	perishsong: {
		start: "  All Pok\u00E9mon that heard the song will faint in three turns!",
		activate: "  [POKEMON]'s perish count fell to [NUMBER].",
	},
	phantomforce: {
		prepare: "#shadowforce",
		activate: "#shadowforce",
	},
	pluck: {
		removeItem: '#bugbite',
	},
	powder: {
		start: "  [POKEMON] is covered in powder!",
		activate: "  When the flame touched the powder on the Pok\u00E9mon, it exploded!",
	},
	powersplit: {
		activate: "  [POKEMON] shared its power with the target!",
	},
	powertrick: {
		start: "  [POKEMON] switched its Attack and Defense!",
		end: '#.start',
	},
	protect: {
		start: "  [POKEMON] protected itself!",
		block: "  [POKEMON] protected itself!",
	},
	pursuit: {
		activate: "  ([TARGET] is being withdrawn...)",
	},
	quash: {
		activate: "  [TARGET]'s move was postponed!",
	},
	quickguard: {
		start: "  Quick Guard protected [TEAM]!",
		block: "  Quick Guard protected [POKEMON]!",
	},
	ragepowder: {
		start: '#followme',
		startFromZEffect: '#followme',
	},
	razorwind: {
		prepare: "  [POKEMON] whipped up a whirlwind!",
	},
	recycle: {
		addItem: "  [POKEMON] found one [ITEM]!",
	},
	reflect: {
		start: "  Reflect made [TEAM] stronger against physical moves!",
		end: "  [TEAM]'s Reflect wore off!",
		// gen 1
		startGen1: "  [POKEMON] gained armor!",
	},
	reflecttype: {
		typeChange: "  [POKEMON]'s type became the same as [SOURCE]'s type!",
	},
	roleplay: {
		changeAbility: "  [POKEMON] copied [SOURCE]'s [ABILITY] Ability!",
	},
	roost: {
		start: "  ([POKEMON] loses Flying type this turn.)",
	},
	safeguard: {
		start: "  [TEAM] cloaked itself in a mystical veil!",
		end: "  [TEAM] is no longer protected by Safeguard!",
		block: "  [POKEMON] is protected by Safeguard!",
	},
	sandtomb: {
		start: "  [POKEMON] became trapped by the quicksand!",
	},
	shadowforce: {
		activate: "  It broke through [TARGET]'s protection!",
		prepare: "[POKEMON] vanished instantly!",
	},
	shelltrap: {
		start: "  [POKEMON] set a shell trap!",
		prepare: "  [POKEMON] set a shell trap!",
		cant: "[POKEMON]'s shell trap didn't work!",
	},
	sketch: {
		activate: "  [POKEMON] sketched [MOVE]!",
	},
	skillswap: {
		activate: "  [POKEMON] swapped Abilities with its target!",
	},
	skullbash: {
		prepare: "[POKEMON] tucked in its head!",
	},
	skyattack: {
		prepare: "[POKEMON] became cloaked in a harsh light!",
	},
	skydrop: {
		prepare: "[POKEMON] took [TARGET] into the sky!",
		end: "  [POKEMON] was freed from the Sky Drop!",
		failSelect: "Sky Drop won't let [POKEMON] go!",
		failTooHeavy: "  [POKEMON] is too heavy to be lifted!",
	},
	smackdown: {
		start: "  [POKEMON] fell straight down!",
	},
	snatch: {
		start: "  [POKEMON] waits for a target to make a move!",
		activate: "  [POKEMON] snatched [TARGET]'s move!",
	},
	solarbeam: {
		prepare: "  [POKEMON] absorbed light!",
	},
	solarblade: {
		prepare: "#solarbeam",
	},
	spectralthief: {
		clearBoost: "  [SOURCE] stole the target's boosted stats!",
	},
	speedswap: {
		activate: "  [POKEMON] switched Speed with its target!",
	},
	spikes: {
		start: "  Spikes were scattered on the ground all around [TEAM]!",
		end: "  The spikes disappeared from the ground around [TEAM]!",
		damage: "  [POKEMON] is hurt by the spikes!",
	},
	spikyshield: {
		damage: "#roughskin",
	},
	spite: {
		activate: "  It reduced the PP of [TARGET]'s [MOVE] by [NUMBER]!",
	},
	splash: {
		activate: "  But nothing happened!",
	},
	spotlight: {
		start: "#followme",
		startFromZEffect: "#followme",
	},
	stealthrock: {
		start: "  Pointed stones float in the air around [TEAM]!",
		end: "  The pointed stones disappeared from around [TEAM]!",
		damage: "  Pointed stones dug into [POKEMON]!",
	},
	stickyweb: {
		start: "  A sticky web spreads out on the ground around [TEAM]!",
		end: "  The sticky web has disappeared from the ground around [TEAM]!",
		activate: "  [POKEMON] was caught in a sticky web!",
	},
	stockpile: {
		start: "  [POKEMON] stockpiled [NUMBER]!",
		end: "  [POKEMON]'s stockpiled effect wore off!",
	},
	substitute: {
		start: "  [POKEMON] put in a substitute!",
		alreadyStarted: "  [POKEMON] already has a substitute!",
		end: "  [POKEMON]'s substitute faded!",
		fail: "  But it does not have enough HP left to make a substitute!",
		activate: "  The substitute took damage for [POKEMON]!",
	},
	switcheroo: {
		activate: "#trick",
	},
	tailwind: {
		start: "  The Tailwind blew from behind [TEAM]!",
		end: "  [TEAM]'s Tailwind petered out!",
	},
	taunt: {
		start: "  [POKEMON] fell for the taunt!",
		end: "  [POKEMON]'s taunt wore off!",
		cant: "[POKEMON] can't use [MOVE] after the taunt!",
	},
	telekinesis: {
		start: "  [POKEMON] was hurled into the air!",
		end: "  [POKEMON] was freed from the telekinesis!",
	},
	throatchop: {
		cant: "The effects of Throat Chop prevent [POKEMON] from using certain moves!",
	},
	torment: {
		start: "  [POKEMON] was subjected to torment!",
		end: "  [POKEMON]'s torment wore off!",
	},
	toxicspikes: {
		start: "  Poison spikes were scattered on the ground all around [TEAM]!",
		end: "  The poison spikes disappeared from the ground around [TEAM]!",
	},
	transform: {
		transform: "[POKEMON] transformed into [SPECIES]!",
	},
	trick: {
		activate: "  [POKEMON] switched items with its target!",
	},
	uproar: {
		start: "  [POKEMON] caused an uproar!",
		end: "  [POKEMON] calmed down.",
		upkeep: "  [POKEMON] is making an uproar!",
		block: "  But the uproar kept [POKEMON] awake!",
		blockSelf: "  [POKEMON] can't sleep in an uproar!",
	},
	uturn: {
		switchOut: "[POKEMON] went back to [TRAINER]!",
	},
	voltswitch: {
		switchOut: '#uturn',
	},
	waterpledge: {
		activate: "  [POKEMON] is waiting for [TARGET]'s move...",
		start: "  A rainbow appeared in the sky on [TEAM]'s side!",
		end: "  The rainbow on [TEAM]'s side disappeared!",
	},
	weatherball: {
		move: "Breakneck Blitz turned into [MOVE] due to the weather!",
	},
	whirlpool: {
		start: "  [POKEMON] became trapped in the vortex!",
	},
	wideguard: {
		start: "  Wide Guard protected [TEAM]!",
		block: "  Wide Guard protected [POKEMON]!",
	},
	wish: {
		heal: "  [NICKNAME]'s wish came true!",
	},
	wrap: {
		start: "  [POKEMON] was wrapped by [SOURCE]!",
		move: "[POKEMON]'s attack continues!", // gen 1 only
	},
	yawn: {
		start: "  [POKEMON] grew drowsy!",
	},

	// abilities
	aftermath: {
		damage: "  [POKEMON] is hurt!",
	},
	airlock: {
		start: "  The effects of the weather disappeared.",
	},
	angerpoint: {
		boost: "  [POKEMON] maxed its Attack!",
	},
	anticipation: {
		activate: "  [POKEMON] shuddered!",
	},
	aromaveil: {
		block: "  [POKEMON] is protected by an aromatic veil!",
	},
	aurabreak: {
		start: "  [POKEMON] reversed all other Pok\u00E9mon's auras!",
	},
	baddreams: {
		damage: "  [POKEMON] is tormented!",
	},
	battlebond: {
		activate: "  [POKEMON] became fully charged due to its bond with its Trainer!",
		transform: "[POKEMON] became Ash-Greninja!",
	},
	blacksludge: {
		heal: "  [POKEMON] restored a little HP using its Black Sludge!",
	},
	cloudnine: {
		start: "#airlock",
	},
	comatose: {
		start: "  [POKEMON] is drowsing!",
	},
	damp: {
		cant: "[POKEMON] cannot use [MOVE]!",
	},
	darkaura: {
		start: "  [POKEMON] is radiating a dark aura!",
	},
	dazzling: {
		cant: "#damp",
	},
	disguise: {
		block: "  Its disguise served it as a decoy!",
		transform: "[POKEMON]'s disguise was busted!",
	},
	dryskin: {
		damage: "  ([POKEMON] was hurt by its Dry Skin.)",
	},
	fairyaura: {
		start: "  [POKEMON] is radiating a fairy aura!",
	},
	flashfire: {
		start: "  The power of [POKEMON]'s Fire-type moves rose!",
	},
	flowerveil: {
		block: "  [POKEMON] surrounded itself with a veil of petals!",
	},
	forewarn: {
		activate: "  It was alerted to [TARGET]'s [MOVE]!",
		activateNoTarget: "  [POKEMON]'s Forewarn alerted it to [MOVE]!",
	},
	frisk: {
		activate: "  [POKEMON] frisked [TARGET] and found its [ITEM]!",
		activateNoTarget: "  [POKEMON] frisked its target and found one [ITEM]!",
	},
	harvest: {
		addItem: "  [POKEMON] harvested one [ITEM]!",
	},
	illusion: {
		end: "  [POKEMON]'s illusion wore off!",
	},
	innardsout: {
		damage: "#aftermath",
	},
	ironbarbs: {
		damage: "#roughskin",
	},
	leftovers: {
		heal: "  [POKEMON] restored a little HP using its Leftovers!",
	},
	lightningrod: {
		activate: "  [POKEMON] took the attack!",
	},
	liquidooze: {
		damage: "  [POKEMON] sucked up the liquid ooze!",
	},
	magicbounce: {
		move: '#magiccoat',
	},
	mindblown: {
		damage: "  ([POKEMON] cut its own HP to power up its move!)",
	},
	moldbreaker: {
		start: "  [POKEMON] breaks the mold!",
	},
	mummy: {
		changeAbility: "  [TARGET]'s Ability became Mummy!",
	},
	naturalcure: {
		activate: "  ([POKEMON] is cured by its Natural Cure!)",
	},
	owntempo: {
		block: "  [POKEMON] doesn't become confused!",
	},
	persistent: {
		activate: "  [POKEMON] extends [MOVE] by 2 turns!",
	},
	pickup: {
		addItem: '#recycle',
	},
	powerconstruct: {
		activate: "  You sense the presence of many!",
		transform: "[POKEMON] transformed into its Complete Forme!",
	},
	powerofalchemy: {
		changeAbility: "#receiver",
	},
	pressure: {
		start: "  [POKEMON] is exerting its pressure!",
	},
	queenlymajesty: {
		cant: "#damp",
	},
	rebound: {
		move: '#magiccoat',
	},
	receiver: {
		changeAbility: "  [SOURCE]'s [ABILITY] was taken over!",
	},
	rockyhelmet: {
		damage: "  [POKEMON] was hurt by the Rocky Helmet!",
	},
	roughskin: {
		damage: "  [POKEMON] was hurt!",
	},
	schooling: {
		transform: "[POKEMON] formed a school!",
		transformEnd: "[POKEMON] stopped schooling!",
	},
	shellbell: {
		heal: "  [POKEMON] restored a little HP using its Shell Bell!",
	},
	shieldsdown: {
		// n.b. this isn't a bug, the game actually says "Shields Down deactivated" on first transformation
		// https://www.youtube.com/watch?v=SThjYBz4SEA
		transform: "Shields Down deactivated!\n([POKEMON] shielded itself.)",
		transformEnd: "Shields Down activated!\n([POKEMON] stopped shielding itself.)",
	},
	slowstart: {
		start: "  [POKEMON] can't get it going!",
		end: "  [POKEMON] finally got its act together!",
	},
	solarpower: {
		damage: "  ([POKEMON] was hurt by its Solar Power.)",
	},
	stancechange: {
		transform: "Changed to Blade Forme!",
		transformEnd: "Changed to Shield Forme!",
	},
	stickyhold: {
		block: "  [POKEMON]'s item cannot be removed!",
	},
	stormdrain: {
		activate: "#lightningrod",
	},
	sturdy: {
		activate: "  [POKEMON] endured the hit!",
	},
	suctioncups: {
		block: "  [POKEMON] anchors itself!",
	},
	sweetveil: {
		block: "  [POKEMON] surrounded itself with a veil of sweetness!",
	},
	symbiosis: {
		activate: "  [POKEMON] shared its [ITEM] with [TARGET]!",
	},
	telepathy: {
		block: "  [POKEMON] avoids attacks by its ally Pok\u00E9mon!",
	},
	teravolt: {
		start: "  [POKEMON] is radiating a bursting aura!",
	},
	trace: {
		changeAbility: "  [POKEMON] traced [SOURCE]'s [ABILITY]!",
	},
	truant: {
		cant: "[POKEMON] is loafing around!",
	},
	turboblaze: {
		start: "  [POKEMON] is radiating a blazing aura!",
	},
	unnerve: {
		start: "  [TEAM] is too nervous to eat Berries!",
	},
	zenmode: {
		transform: 'Zen Mode triggered!',
		transformEnd: 'Zen Mode ended!',
	},

	// items
	airballoon: {
		start: "  [POKEMON] floats in the air with its Air Balloon!",
		end: "  [POKEMON]'s Air Balloon popped!",
	},
	custapberry: {
		activate: "  [POKEMON]'s Custap Berry let it move first!",
	},
	ejectbutton: {
		end: "  [POKEMON] is switched out with the Eject Button!",
	},
	focusband: {
		activate: "  [POKEMON] hung on using its Focus Band!",
	},
	focussash: {
		end: "  [POKEMON] hung on using its Focus Sash!",
	},
	leppaberry: {
		activate: "  [POKEMON] restored PP to its [MOVE] move using Leppa Berry!",
	},
	lifeorb: {
		damage: "  [POKEMON] lost some of its HP!",
	},
	mysteryberry: {
		activate: "  [POKEMON] restored PP to its [MOVE] move using Mystery Berry!",
	},
	powerherb: {
		end: "  [POKEMON] became fully charged due to its Power Herb!",
	},
	protectivepads: {
		block: "  [POKEMON] protected itself with the Protective Pads!",
	},
	quickclaw: {
		activate: "  [POKEMON]'s Quick Claw let it move first!",
	},
	redcard: {
		end: "  [POKEMON] held up its Red Card against [TARGET]!",
	},
	safetygoggles: {
		block: "  [POKEMON] is not affected by [MOVE] thanks to its Safety Goggles!",
	},
	ultranecroziumz: {
		transform: "  Bright light is about to burst out of [POKEMON]!",
		activate: "[POKEMON] regained its true power through Ultra Burst!",
	},
	whiteherb: {
		end: "  [POKEMON] returned its status to normal using its White Herb!",
	},
};


var




BattleTextParser=function(){







function BattleTextParser(){var perspective=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;this.p1="Player 1";this.p2="Player 2";this.gen=7;this.curLineSection='break';this.lowercaseRegExp=undefined;this.











































































































































pokemonName=function(pokemon){
if(!pokemon)return'';
if(!pokemon.startsWith('p1')&&!pokemon.startsWith('p2'))return"???pokemon:"+pokemon+"???";
if(pokemon.charAt(3)===':')return pokemon.slice(4).trim();else
if(pokemon.charAt(2)===':')return pokemon.slice(3).trim();
return"???pokemon:"+pokemon+"???";
};this.perspective=perspective;}BattleTextParser.parseLine=function parseLine(line){if(!line.startsWith('|')){return{args:['',line],kwArgs:{}};}if(line==='|'){return{args:['done'],kwArgs:{}};}var index=line.indexOf('|',1);var cmd=line.slice(1,index);switch(cmd){case'chatmsg':case'chatmsg-raw':case'raw':case'error':case'html':case'inactive':case'inactiveoff':case'warning':case'fieldhtml':case'controlshtml':case'bigerror':case'debug':case'tier':return{args:[cmd,line.slice(index+1)],kwArgs:{}};case'c':case'chat':case'uhtml':case'uhtmlchange':var index2a=line.indexOf('|',index+1);return{args:[cmd,line.slice(index+1,index2a),line.slice(index2a+1)],kwArgs:{}};case'c:':var index2b=line.indexOf('|',index+1);var index3b=line.indexOf('|',index2b+1);return{args:[cmd,line.slice(index+1,index2b),line.slice(index2b+1,index3b),line.slice(index3b+1)],kwArgs:{}};}var args=line.slice(1).split('|');var kwArgs={};while(args.length>1){var lastArg=args[args.length-1];if(lastArg.charAt(0)!=='[')break;var bracketPos=lastArg.indexOf(']');if(bracketPos<=0)break;kwArgs[lastArg.slice(1,bracketPos)]=lastArg.slice(bracketPos+1).trim()||'.';args.pop();}return BattleTextParser.upgradeArgs({args:args,kwArgs:kwArgs});};BattleTextParser.upgradeArgs=function upgradeArgs(_ref){var args=_ref.args,kwArgs=_ref.kwArgs;switch(args[0]){case'-activate':{if(kwArgs.item||kwArgs.move||kwArgs.number||kwArgs.ability)return{args:args,kwArgs:kwArgs};var _args=args,pokemon=_args[1],effect=_args[2],arg3=_args[3],arg4=_args[4];var target=kwArgs.of;var _id=BattleTextParser.effectId(effect);if(kwArgs.block)return{args:['-fail',pokemon],kwArgs:kwArgs};if(_id==='wonderguard')return{args:['-immune',pokemon],kwArgs:{from:'ability:Wonder Guard'}};if(['ingrain','quickguard','wideguard','craftyshield','matblock','protect','mist','safeguard','electricterrain','mistyterrain','psychicterrain','telepathy','stickyhold','suctioncups','aromaveil','flowerveil','sweetveil','disguise','safetygoggles','protectivepads'].includes(_id)){return{args:['-block',target||pokemon,effect,arg3],kwArgs:{}};}if(['bind','wrap','clamp','whirlpool','firespin','magmastorm','sandtomb','infestation','charge','trapped'].includes(_id)){return{args:['-start',pokemon,effect],kwArgs:{of:target}};}if(_id==='fairylock'){return{args:['-fieldactivate',effect],kwArgs:{}};}if(_id==='symbiosis'){kwArgs.item=arg3;}else if(_id==='magnitude'){kwArgs.number=arg3;}else if(_id==='skillswap'||_id==='mummy'){kwArgs.ability=arg3;kwArgs.ability2=arg4;}else if(['spite','grudge','forewarn','sketch','leppaberry','mysteryberry'].includes(_id)){kwArgs.move=arg3;kwArgs.number=arg4;}args=['-activate',pokemon,effect,target||''];return{args:args,kwArgs:kwArgs};}case'move':{if(kwArgs.from==='Magic Bounce')kwArgs.from='ability:Magic Bounce';return{args:args,kwArgs:kwArgs};}case'-nothing':return{args:['-activate','','move:Splash'],kwArgs:kwArgs};}return{args:args,kwArgs:kwArgs};};var _proto=BattleTextParser.prototype;_proto.extractMessage=function extractMessage(buf){var out='';for(var _i=0,_buf$split=buf.split('\n');_i<_buf$split.length;_i++){var line=_buf$split[_i];var _BattleTextParser$par=BattleTextParser.parseLine(line),args=_BattleTextParser$par.args,kwArgs=_BattleTextParser$par.kwArgs;out+=this.parseArgs(args,kwArgs)||'';}return out;};_proto.fixLowercase=function fixLowercase(input){if(this.lowercaseRegExp===undefined){var prefixes=['pokemon','opposingPokemon','team','opposingTeam'].map(function(templateId){var template=BattleText["default"][templateId];if(template.charAt(0)===template.charAt(0).toUpperCase())return'';var bracketIndex=template.indexOf('[');if(bracketIndex>=0)return template.slice(0,bracketIndex);return template;}).filter(function(prefix){return prefix;});if(prefixes.length){var buf="((?:^|\n)(?:  |  \\(|  \\[)?)("+prefixes.map(BattleTextParser.escapeRegExp).join('|')+")";this.lowercaseRegExp=new RegExp(buf,'g');}else{this.lowercaseRegExp=null;}}if(!this.lowercaseRegExp)return input;return input.replace(this.lowercaseRegExp,function(match,p1,p2){return p1+p2.charAt(0).toUpperCase()+p2.slice(1);});};BattleTextParser.escapeRegExp=function escapeRegExp(input){return input.replace(/[\\^$.*+?()[\]{}|]/g,'\\$&');};_proto.

pokemon=function pokemon(_pokemon){
if(!_pokemon)return'';
var side;
switch(_pokemon.slice(0,2)){
case'p1':side=0;break;
case'p2':side=1;break;
default:return"???pokemon:"+_pokemon+"???";}

var name=this.pokemonName(_pokemon);
var template=BattleText["default"][side===this.perspective?'pokemon':'opposingPokemon'];
return template.replace('[NICKNAME]',name);
};_proto.

pokemonFull=function pokemonFull(pokemon,details){
var nickname=this.pokemonName(pokemon);

var species=details.split(',')[0];
if(nickname===species)return[pokemon.slice(0,2),"**"+species+"**"];
return[pokemon.slice(0,2),nickname+" (**"+species+"**)"];
};_proto.

trainer=function trainer(side){
side=side.slice(0,2);
if(side==='p1')return this.p1;
if(side==='p2')return this.p2;
return"???side:"+side+"???";
};_proto.

team=function team(side){
side=side.slice(0,2);
if(side===(this.perspective===0?'p1':'p2')){
return BattleText["default"].team;
}
return BattleText["default"].opposingTeam;
};_proto.

own=function own(side){
side=side.slice(0,2);
if(side===(this.perspective===0?'p1':'p2')){
return'OWN';
}
return'';
};BattleTextParser.

effectId=function effectId(effect){
if(!effect)return'';
if(effect.startsWith('item:')||effect.startsWith('move:')){
effect=effect.slice(5);
}else if(effect.startsWith('ability:')){
effect=effect.slice(8);
}
return toId(effect);
};_proto.

effect=function effect(_effect){
if(!_effect)return'';
if(_effect.startsWith('item:')||_effect.startsWith('move:')){
_effect=_effect.slice(5);
}else if(_effect.startsWith('ability:')){
_effect=_effect.slice(8);
}
return _effect.trim();
};_proto.

template=function template(type){for(var _len=arguments.length,namespaces=new Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){namespaces[_key-1]=arguments[_key];}for(var _i2=0;_i2<
namespaces.length;_i2++){var namespace=namespaces[_i2];
if(!namespace)continue;
if(namespace==='OWN'){
return BattleText["default"][type+'Own']+'\n';
}
if(namespace==='NODEFAULT'){
return'';
}
var _id2=BattleTextParser.effectId(namespace);
if(BattleText[_id2]&&type in BattleText[_id2]){
if(BattleText[_id2][type].charAt(1)==='.')type=BattleText[_id2][type].slice(2);
if(BattleText[_id2][type].charAt(0)==='#')_id2=BattleText[_id2][type].slice(1);
if(!BattleText[_id2][type])return'';
return BattleText[_id2][type]+'\n';
}
}
if(!BattleText["default"][type])return'';
return BattleText["default"][type]+'\n';
};_proto.

maybeAbility=function maybeAbility(effect,holder){
if(!effect)return'';
if(!effect.startsWith('ability:'))return'';
return this.ability(effect.slice(8).trim(),holder);
};_proto.

ability=function ability(name,holder){
if(!name)return'';
return BattleText["default"].abilityActivation.replace('[POKEMON]',this.pokemon(holder)).replace('[ABILITY]',this.effect(name))+'\n';
};_proto.

stat=function stat(_stat){
var entry=BattleText[_stat||"stats"];
if(!entry||!entry.statName)return"???stat:"+_stat+"???";
return entry.statName;
};_proto.

lineSection=function lineSection(args,kwArgs){
var cmd=args[0];
switch(cmd){
case'done':case'turn':
return'break';
case'move':case'cant':case'switch':case'drag':case'upkeep':case'start':case'-mega':
return'major';
case'switchout':case'faint':
return'preMajor';
case'-zpower':
return'postMajor';
case'-damage':{
var _id3=BattleTextParser.effectId(kwArgs.from);
if(_id3==='confusion')return'major';
return'postMajor';
}
case'-curestatus':{
var _id4=BattleTextParser.effectId(kwArgs.from);
if(_id4==='naturalcure')return'preMajor';
return'postMajor';
}
case'-start':{
var _id5=BattleTextParser.effectId(kwArgs.from);
if(_id5==='protean')return'preMajor';
return'postMajor';
}
case'-activate':{
var _id6=BattleTextParser.effectId(args[2]);
if(_id6==='confusion'||_id6==='attract')return'preMajor';
return'postMajor';
}}

return cmd.charAt(0)==='-'?'postMajor':'';
};_proto.

sectionBreak=function sectionBreak(args,kwArgs){
var prevSection=this.curLineSection;
var curSection=this.lineSection(args,kwArgs);
if(!curSection)return false;
this.curLineSection=curSection;
switch(curSection){
case'break':
if(prevSection!=='break')return true;
return false;
case'preMajor':
case'major':
if(prevSection==='postMajor'||prevSection==='major')return true;
return false;
case'postMajor':
return false;}

};_proto.

parseArgs=function parseArgs(args,kwArgs,noSectionBreak){
var buf=!noSectionBreak&&this.sectionBreak(args,kwArgs)?'\n':'';
return buf+this.fixLowercase(this.parseArgsInner(args,kwArgs)||'');
};_proto.

parseArgsInner=function parseArgsInner(args,kwArgs){
var cmd=args[0];
switch(cmd){
case'player':{var
side=args[1],name=args[2];
if(side==='p1'&&name){
this.p1=name;
}else if(side==='p2'&&name){
this.p2=name;
}
return'';
}

case'gen':{var
num=args[1];
this.gen=parseInt(num,10);
return'';
}

case'turn':{var
_num=args[1];
return this.template('turn').replace('[NUMBER]',_num)+'\n';
}

case'start':{
return this.template('startBattle').replace('[TRAINER]',this.p1).replace('[TRAINER]',this.p2);
}

case'win':case'tie':{var
_name=args[1];
if(cmd==='tie'||!_name){
return this.template('tieBattle').replace('[TRAINER]',this.p1).replace('[TRAINER]',this.p2);
}
return this.template('winBattle').replace('[TRAINER]',_name);
}

case'switch':{var
pokemon=args[1],details=args[2];var _this$pokemonFull=
this.pokemonFull(pokemon,details),_side=_this$pokemonFull[0],fullname=_this$pokemonFull[1];
var template=this.template('switchIn',this.own(_side));
return template.replace('[TRAINER]',this.trainer(_side)).replace('[FULLNAME]',fullname);
}

case'drag':{var
_pokemon2=args[1],_details=args[2];var _this$pokemonFull2=
this.pokemonFull(_pokemon2,_details),_side2=_this$pokemonFull2[0],_fullname=_this$pokemonFull2[1];
var _template=this.template('drag');
return _template.replace('[TRAINER]',this.trainer(_side2)).replace('[FULLNAME]',_fullname);
}

case'detailschange':case'-transform':case'-formechange':{var
_pokemon3=args[1],arg2=args[2],arg3=args[3];
var newSpecies='';
switch(cmd){
case'detailschange':newSpecies=arg2.split(',')[0].trim();break;
case'-transform':newSpecies=arg3;break;
case'-formechange':newSpecies=arg2;break;}

var newSpeciesId=toId(newSpecies);
var _id7='';
var _templateName='transform';
if(cmd!=='-transform'){
switch(newSpeciesId){
case'greninjaash':_id7='battlebond';break;
case'mimikyubusted':_id7='disguise';break;
case'zygardecomplete':_id7='powerconstruct';break;
case'necrozmaultra':_id7='ultranecroziumz';break;
case'darmanitanzen':_id7='zenmode';break;
case'darmanitan':_id7='zenmode';_templateName='transformEnd';break;
case'aegislashblade':_id7='stancechange';break;
case'aegislash':_id7='stancechange';_templateName='transformEnd';break;
case'wishiwashischool':_id7='schooling';break;
case'wishiwashi':_id7='schooling';_templateName='transformEnd';break;
case'miniormeteor':_id7='shieldsdown';break;
case'minior':_id7='shieldsdown';_templateName='transformEnd';break;}

}else if(newSpecies){
_id7='transform';
}
var _template2=this.template(_templateName,_id7,kwArgs.msg?'':'NODEFAULT');
var line1=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon3);
return line1+_template2.replace('[POKEMON]',this.pokemon(_pokemon3)).replace('[SPECIES]',newSpecies);
}

case'switchout':{var
_pokemon4=args[1];
var _side3=_pokemon4.slice(0,2);
var _template3=this.template('switchOut',kwArgs.from,this.own(_side3));
return _template3.replace('[TRAINER]',this.trainer(_side3)).replace('[NICKNAME]',this.pokemonName(_pokemon4)).replace('[POKEMON]',this.pokemon(_pokemon4));
}

case'faint':{var
_pokemon5=args[1];
var _template4=this.template('faint');
return _template4.replace('[POKEMON]',this.pokemon(_pokemon5));
}

case'swap':{var
_pokemon6=args[1],target=args[2];
if(!target||!isNaN(Number(target))){
var _template6=this.template('swapCenter');
return _template6.replace('[POKEMON]',this.pokemon(_pokemon6));
}
var _template5=this.template('swap');
return _template5.replace('[POKEMON]',this.pokemon(_pokemon6)).replace('[TARGET]',this.pokemon(target));
}

case'move':{var
_pokemon7=args[1],move=args[2];
var _line=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon7);
if(kwArgs.zEffect){
_line=this.template('zEffect').replace('[POKEMON]',this.pokemon(_pokemon7));
}
var _template7=this.template('move',kwArgs.from);
return _line+_template7.replace('[POKEMON]',this.pokemon(_pokemon7)).replace('[MOVE]',move);
}

case'cant':{var
_pokemon8=args[1],effect=args[2],_move=args[3];
var _id8=BattleTextParser.effectId(effect);
switch(_id8){
case'damp':case'dazzling':case'queenlymajesty':var _ref2=

[kwArgs.of,_pokemon8];_pokemon8=_ref2[0];kwArgs.of=_ref2[1];
break;}

var _template8=this.template('cant',effect,'NODEFAULT')||
this.template(_move?'cant':'cantNoMove');
var _line2=this.maybeAbility(effect,kwArgs.of||_pokemon8);
return _line2+_template8.replace('[POKEMON]',this.pokemon(_pokemon8)).replace('[MOVE]',_move);
}

case'message':{var
message=args[1];
return''+message+'\n';
}

case'-start':{var
_pokemon9=args[1],_effect2=args[2],_arg=args[3];
var _line3=this.maybeAbility(_effect2,_pokemon9)||this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon9);
var _id9=BattleTextParser.effectId(_effect2);
if(_id9==='typechange'){
var _template10=this.template('typeChange',kwArgs.from);
return _line3+_template10.replace('[POKEMON]',this.pokemon(_pokemon9)).replace('[TYPE]',_arg).replace('[SOURCE]',this.pokemon(kwArgs.of));
}
if(_id9==='typeadd'){
var _template11=this.template('typeAdd',kwArgs.from);
return _line3+_template11.replace('[POKEMON]',this.pokemon(_pokemon9)).replace('[TYPE]',_arg);
}
if(_id9.startsWith('stockpile')){
var _num2=_id9.slice(9);
var _template12=this.template('start','stockpile');
return _line3+_template12.replace('[POKEMON]',this.pokemon(_pokemon9)).replace('[NUMBER]',_num2);
}
if(_id9.startsWith('perish')){
var _num3=_id9.slice(6);
var _template13=this.template('activate','perishsong');
return _line3+_template13.replace('[POKEMON]',this.pokemon(_pokemon9)).replace('[NUMBER]',_num3);
}
var templateId='start';
if(kwArgs.already)templateId='alreadyStarted';
if(kwArgs.fatigue)templateId='startFromFatigue';
if(kwArgs.zeffect)templateId='startFromZEffect';
if(kwArgs.damage)templateId='activate';
if(kwArgs.block)templateId='block';
if(kwArgs.upkeep)templateId='upkeep';
if(_id9==='reflect'||_id9==='lightscreen')templateId='startGen1';
if(templateId==='start'&&kwArgs.from&&kwArgs.from.startsWith('item:')){
templateId+='FromItem';
}
var _template9=this.template(templateId,_effect2);
return _line3+_template9.replace('[POKEMON]',this.pokemon(_pokemon9)).replace('[EFFECT]',this.effect(_effect2)).replace('[MOVE]',_arg).replace('[SOURCE]',this.pokemon(kwArgs.of)).replace('[ITEM]',this.effect(kwArgs.from));
}

case'-end':{var
_pokemon10=args[1],_effect3=args[2];
var _line4=this.maybeAbility(_effect3,_pokemon10)||this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon10);
var _id10=BattleTextParser.effectId(_effect3);
if(_id10==='doomdesire'||_id10==='futuresight'){
var _template15=this.template('activate',_effect3);
return _line4+_template15.replace('[TARGET]',this.pokemon(_pokemon10));
}
var _templateId='end';
var _template14='';
if(kwArgs.from&&kwArgs.from.startsWith('item:')){
_template14=this.template('endFromItem',_effect3);
}
if(!_template14)_template14=this.template(_templateId,_effect3);
return _line4+_template14.replace('[POKEMON]',this.pokemon(_pokemon10)).replace('[EFFECT]',this.effect(_effect3)).replace('[SOURCE]',this.pokemon(kwArgs.of));
}

case'-ability':{var
_pokemon11=args[1],ability=args[2],oldAbility=args[3],arg4=args[4];
var _line5='';
if(oldAbility&&(oldAbility.startsWith('p1')||oldAbility.startsWith('p2')||oldAbility==='boost')){
arg4=oldAbility;
oldAbility='';
}
if(oldAbility)_line5+=this.ability(oldAbility,_pokemon11);
_line5+=this.ability(ability,_pokemon11);
if(kwArgs.fail){
var _template17=this.template('block',kwArgs.from);
return _line5+_template17;
}
if(kwArgs.from){
_line5=this.maybeAbility(kwArgs.from,_pokemon11)+_line5;
var _template18=this.template('changeAbility',kwArgs.from);
return _line5+_template18.replace('[POKEMON]',this.pokemon(_pokemon11)).replace('[ABILITY]',this.effect(ability)).replace('[SOURCE]',this.pokemon(kwArgs.of));
}
var _id11=BattleTextParser.effectId(ability);
if(_id11==='unnerve'){
var _template19=this.template('start',ability);
return _line5+_template19.replace('[TEAM]',this.team(arg4));
}
var _templateId2='start';
if(_id11==='anticipation'||_id11==='sturdy')_templateId2='activate';
var _template16=this.template(_templateId2,ability,'NODEFAULT');
return _line5+_template16.replace('[POKEMON]',this.pokemon(_pokemon11));
}

case'-endability':{var
_pokemon12=args[1],_ability=args[2];
if(_ability)return this.ability(_ability,_pokemon12);
var _line6=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon12);
var _template20=this.template('start','Gastro Acid');
return _line6+_template20.replace('[POKEMON]',this.pokemon(_pokemon12));
}

case'-item':{var
_pokemon13=args[1],item=args[2];
var _id12=BattleTextParser.effectId(kwArgs.from);
var _target='';
if(['magician','pickpocket'].includes(_id12)){var _ref3=
[kwArgs.of,''];_target=_ref3[0];kwArgs.of=_ref3[1];
}
var _line7=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon13);
if(['thief','covet','bestow','magician','pickpocket'].includes(_id12)){
var _template22=this.template('takeItem',kwArgs.from);
return _line7+_template22.replace('[POKEMON]',this.pokemon(_pokemon13)).replace('[ITEM]',this.effect(item)).replace('[SOURCE]',this.pokemon(_target||kwArgs.of));
}
if(_id12==='frisk'){
var _template23=this.template(kwArgs.of&&_pokemon13&&kwArgs.of!==_pokemon13?'activate':'activateNoTarget',"Frisk");
return _line7+_template23.replace('[POKEMON]',this.pokemon(kwArgs.of)).replace('[ITEM]',this.effect(item)).replace('[TARGET]',this.pokemon(_pokemon13));
}
if(kwArgs.from){
var _template24=this.template('addItem',kwArgs.from);
return _line7+_template24.replace('[POKEMON]',this.pokemon(_pokemon13)).replace('[ITEM]',this.effect(item));
}
var _template21=this.template('start',item,'NODEFAULT');
return _line7+_template21.replace('[POKEMON]',this.pokemon(_pokemon13));
}

case'-enditem':{var
_pokemon14=args[1],_item=args[2];
var _line8=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon14);
if(kwArgs.eat){
var _template26=this.template('eatItem',kwArgs.from);
return _line8+_template26.replace('[POKEMON]',this.pokemon(_pokemon14)).replace('[ITEM]',this.effect(_item));
}
var _id13=BattleTextParser.effectId(kwArgs.from);
if(_id13==='gem'){
var _template27=this.template('useGem',_item);
return _line8+_template27.replace('[POKEMON]',this.pokemon(_pokemon14)).replace('[ITEM]',this.effect(_item)).replace('[MOVE]',kwArgs.move);
}
if(_id13==='stealeat'){
var _template28=this.template('removeItem',"Bug Bite");
return _line8+_template28.replace('[SOURCE]',this.pokemon(kwArgs.of)).replace('[ITEM]',this.effect(_item));
}
if(kwArgs.from){
var _template29=this.template('removeItem',kwArgs.from);
return _line8+_template29.replace('[POKEMON]',this.pokemon(_pokemon14)).replace('[ITEM]',this.effect(_item)).replace('[SOURCE]',this.pokemon(kwArgs.of));
}
if(kwArgs.weaken){
var _template30=this.template('activateWeaken');
return _line8+_template30.replace('[POKEMON]',this.pokemon(_pokemon14)).replace('[ITEM]',this.effect(_item));
}
var _template25=this.template('end',_item,'NODEFAULT');
if(!_template25)_template25=this.template('activateItem').replace('[ITEM]',this.effect(_item));
return _line8+_template25.replace('[POKEMON]',this.pokemon(_pokemon14)).replace('[TARGET]',this.pokemon(kwArgs.of));
}

case'-status':{var
_pokemon15=args[1],status=args[2];
var _line9=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon15);
if(BattleTextParser.effectId(kwArgs.from)==='rest'){
var _template32=this.template('startFromRest',status);
return _line9+_template32.replace('[POKEMON]',this.pokemon(_pokemon15));
}
var _template31=this.template('start',status);
return _line9+_template31.replace('[POKEMON]',this.pokemon(_pokemon15));
}

case'-curestatus':{var
_pokemon16=args[1],_status=args[2];
if(BattleTextParser.effectId(kwArgs.from)==='naturalcure'){
var _template34=this.template('activate',kwArgs.from);
return _template34.replace('[POKEMON]',this.pokemon(_pokemon16));
}
var _line10=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon16);
if(kwArgs.from&&kwArgs.from.startsWith('item:')){
var _template35=this.template('endFromItem',_status);
return _line10+_template35.replace('[POKEMON]',this.pokemon(_pokemon16)).replace('[ITEM]',this.effect(kwArgs.from));
}
if(kwArgs.thaw){
var _template36=this.template('endFromMove',_status);
return _line10+_template36.replace('[POKEMON]',this.pokemon(_pokemon16)).replace('[MOVE]',this.effect(kwArgs.from));
}
var _template33=this.template('end',_status,'NODEFAULT');
if(!_template33)_template33=this.template('end').replace('[EFFECT]',_status);
return _line10+_template33.replace('[POKEMON]',this.pokemon(_pokemon16));
}

case'-cureteam':{
return this.template('activate',kwArgs.from);
}

case'-singleturn':case'-singlemove':{var
_pokemon17=args[1],_effect4=args[2];
var _line11=this.maybeAbility(_effect4,kwArgs.of||_pokemon17)||this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon17);
var _id14=BattleTextParser.effectId(_effect4);
if(_id14==='instruct'){
var _template38=this.template('activate',_effect4);
return _line11+_template38.replace('[POKEMON]',this.pokemon(kwArgs.of)).replace('[TARGET]',this.pokemon(_pokemon17));
}
var _template37=this.template('start',_effect4,'NODEFAULT');
if(!_template37)_template37=this.template('start').replace('[EFFECT]',this.effect(_effect4));
return _line11+_template37.replace('[POKEMON]',this.pokemon(_pokemon17)).replace('[SOURCE]',this.pokemon(kwArgs.of)).replace('[TEAM]',this.team(_pokemon17.slice(0,2)));
}

case'-sidestart':{var
_side4=args[1],_effect5=args[2];
var _template39=this.template('start',_effect5,'NODEFAULT');
if(!_template39)_template39=this.template('startTeamEffect').replace('[EFFECT]',this.effect(_effect5));
return _template39.replace('[TEAM]',this.team(_side4));
}

case'-sideend':{var
_side5=args[1],_effect6=args[2];
var _template40=this.template('end',_effect6,'NODEFAULT');
if(!_template40)_template40=this.template('endTeamEffect').replace('[EFFECT]',this.effect(_effect6));
return _template40.replace('[TEAM]',this.team(_side5));
}

case'-weather':{var
weather=args[1];
if(!weather||weather==='none'){
var _template42=this.template('end',kwArgs.from,'NODEFAULT');
if(!_template42)return this.template('endFieldEffect').replace('[EFFECT]',this.effect(weather));
return _template42;
}
if(kwArgs.upkeep){
return this.template('upkeep',weather,'NODEFAULT');
}
var _line12=this.maybeAbility(kwArgs.from,kwArgs.of);
var _template41=this.template('start',weather,'NODEFAULT');
if(!_template41)_template41=this.template('startFieldEffect').replace('[EFFECT]',this.effect(weather));
return _line12+_template41;
}

case'-fieldstart':case'-fieldactivate':{var
_effect7=args[1];
var _line13=this.maybeAbility(kwArgs.from,kwArgs.of);
var _templateId3=cmd.slice(6);
if(BattleTextParser.effectId(_effect7)==='perishsong')_templateId3='start';
var _template43=this.template(_templateId3,_effect7,'NODEFAULT');
if(!_template43)_template43=this.template('startFieldEffect').replace('[EFFECT]',this.effect(_effect7));
return _line13+_template43.replace('[POKEMON]',this.pokemon(kwArgs.of));
}

case'-fieldend':{var
_effect8=args[1];
var _template44=this.template('end',_effect8,'NODEFAULT');
if(!_template44)_template44=this.template('endFieldEffect').replace('[EFFECT]',this.effect(_effect8));
return _template44;
}

case'-sethp':{
var _effect9=kwArgs.from;
return this.template('activate',_effect9);
}

case'-message':{var
_message=args[1];
return'  '+_message+'\n';
}

case'-hint':{var
_message2=args[1];
return'  ('+_message2+')\n';
}

case'-activate':{var
_pokemon18=args[1],_effect10=args[2],_target2=args[3];
var _id15=BattleTextParser.effectId(_effect10);
if(_id15==='celebrate'){
return this.template('activate','celebrate').replace('[TRAINER]',this.trainer(_pokemon18.slice(0,2)));
}
if(!_target2&&['hyperspacefury','hyperspacehole','phantomforce','shadowforce','feint'].includes(_id15)){var _ref4=
[kwArgs.of,_pokemon18];_pokemon18=_ref4[0];_target2=_ref4[1];
if(!_pokemon18)_pokemon18=_target2;
}
if(!_target2)_target2=kwArgs.of||_pokemon18;

var _line14=this.maybeAbility(_effect10,_pokemon18);

if(_id15==='lockon'||_id15==='mindreader'){
var _template46=this.template('start',_effect10);
return _line14+_template46.replace('[POKEMON]',this.pokemon(kwArgs.of)).replace('[SOURCE]',this.pokemon(_pokemon18));
}

var _templateId4='activate';
if(_id15==='forewarn'&&_pokemon18===_target2){
_templateId4='activateNoTarget';
}
var _template45=this.template(_templateId4,_effect10,'NODEFAULT');
if(!_template45){
if(_line14)return _line14;
_template45=this.template('activate');
return _line14+_template45.replace('[EFFECT]',this.effect(_effect10));
}

if(_id15==='brickbreak'){
_template45=_template45.replace('[TEAM]',this.team(_target2.slice(0,2)));
}
if(kwArgs.ability){
_line14+=this.ability(kwArgs.ability,_pokemon18);
}
if(kwArgs.ability2){
_line14+=this.ability(kwArgs.ability2,_target2);
}
if(_id15==='mummy'){
_line14+=this.ability("Mummy",_target2);
_template45=this.template('changeAbility',"Mummy");
}
if(kwArgs.move||kwArgs.number||kwArgs.item){
_template45=_template45.replace('[MOVE]',kwArgs.move).replace('[NUMBER]',kwArgs.number).replace('[ITEM]',kwArgs.item);
}
return _line14+_template45.replace('[POKEMON]',this.pokemon(_pokemon18)).replace('[TARGET]',this.pokemon(_target2)).replace('[SOURCE]',this.pokemon(kwArgs.of));
}

case'-prepare':{var
_pokemon19=args[1],_effect11=args[2],_target3=args[3];
var _template47=this.template('prepare',_effect11);
return _template47.replace('[POKEMON]',this.pokemon(_pokemon19)).replace('[TARGET]',this.pokemon(_target3));
}

case'-damage':{var
_pokemon20=args[1],percentage=args[3];
var _template48=this.template('damage',kwArgs.from,'NODEFAULT');
var _line15=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon20);
var _id16=BattleTextParser.effectId(kwArgs.from);
if(_template48){
return _line15+_template48.replace('[POKEMON]',this.pokemon(_pokemon20));
}

if(!kwArgs.from){
_template48=this.template(percentage?'damagePercentage':'damage');
return _line15+_template48.replace('[POKEMON]',this.pokemon(_pokemon20)).replace('[PERCENTAGE]',percentage);
}
if(kwArgs.from.startsWith('item:')){
_template48=this.template(kwArgs.of?'damageFromPokemon':'damageFromItem');
return _line15+_template48.replace('[POKEMON]',this.pokemon(_pokemon20)).replace('[ITEM]',this.effect(kwArgs.from)).replace('[SOURCE]',this.pokemon(kwArgs.of));
}
if(kwArgs.partiallytrapped||_id16==='bind'||_id16==='wrap'){
_template48=this.template('damageFromPartialTrapping');
return _line15+_template48.replace('[POKEMON]',this.pokemon(_pokemon20)).replace('[MOVE]',this.effect(kwArgs.from));
}

_template48=this.template('damage');
return _line15+_template48.replace('[POKEMON]',this.pokemon(_pokemon20));
}

case'-heal':{var
_pokemon21=args[1];
var _template49=this.template('heal',kwArgs.from,'NODEFAULT');
var _line16=this.maybeAbility(kwArgs.from,_pokemon21);
if(_template49){
return _line16+_template49.replace('[POKEMON]',this.pokemon(_pokemon21)).replace('[SOURCE]',this.pokemon(kwArgs.of)).replace('[NICKNAME]',kwArgs.wisher);
}

if(kwArgs.from&&!kwArgs.from.startsWith('ability:')){
_template49=this.template('healFromEffect');
return _line16+_template49.replace('[POKEMON]',this.pokemon(_pokemon21)).replace('[EFFECT]',this.effect(kwArgs.from));
}

_template49=this.template('heal');
return _line16+_template49.replace('[POKEMON]',this.pokemon(_pokemon21));
}

case'-boost':case'-unboost':{var
_pokemon22=args[1],stat=args[2],_num4=args[3];
if(stat==='spa'&&this.gen===1)stat='spc';
var amount=parseInt(_num4,10);
var _line17=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon22);
var _templateId5=cmd.slice(1);
if(amount>=3)_templateId5+='3';else
if(amount>=2)_templateId5+='2';else
if(amount===0)_templateId5+='0';
if(amount&&kwArgs.zeffect){
_templateId5+=kwArgs.multiple?'MultipleFromZEffect':'FromZEffect';
}else if(amount&&kwArgs.from&&kwArgs.from.startsWith('item:')){
_templateId5+='FromItem';
}
var _template50=this.template(_templateId5,kwArgs.from);
return _line17+_template50.replace('[POKEMON]',this.pokemon(_pokemon22)).replace('[STAT]',this.stat(stat));
}

case'-setboost':{var
_pokemon23=args[1];
var _effect12=kwArgs.from;
var _line18=this.maybeAbility(_effect12,kwArgs.of||_pokemon23);
var _template51=this.template('boost',_effect12);
return _line18+_template51.replace('[POKEMON]',this.pokemon(_pokemon23));
}

case'-swapboost':{var
_pokemon24=args[1],_target4=args[2];
var _line19=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon24);
var _id17=BattleTextParser.effectId(kwArgs.from);
var _templateId6='swapBoost';
if(_id17==='guardswap')_templateId6='swapDefensiveBoost';
if(_id17==='powerswap')_templateId6='swapOffensiveBoost';
var _template52=this.template(_templateId6,kwArgs.from);
return _line19+_template52.replace('[POKEMON]',this.pokemon(_pokemon24)).replace('[TARGET]',this.pokemon(_target4));
}

case'-copyboost':{var
_pokemon25=args[1],_target5=args[2];
var _line20=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon25);
var _template53=this.template('copyBoost',kwArgs.from);
return _line20+_template53.replace('[POKEMON]',this.pokemon(_pokemon25)).replace('[TARGET]',this.pokemon(_target5));
}

case'-clearboost':case'-clearpositiveboost':case'-clearnegativeboost':{var
_pokemon26=args[1],source=args[2];
var _line21=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon26);
var _templateId7='clearBoost';
if(kwArgs.zeffect)_templateId7='clearBoostFromZEffect';
var _template54=this.template(_templateId7,kwArgs.from);
return _line21+_template54.replace('[POKEMON]',this.pokemon(_pokemon26)).replace('[SOURCE]',this.pokemon(source));
}

case'-invertboost':{var
_pokemon27=args[1];
var _line22=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon27);
var _template55=this.template('invertBoost',kwArgs.from);
return _line22+_template55.replace('[POKEMON]',this.pokemon(_pokemon27));
}

case'-clearallboost':{
return this.template('clearAllBoost',kwArgs.from);
}

case'-crit':case'-supereffective':case'-resisted':{var
_pokemon28=args[1];
var _templateId8=cmd.slice(1);
if(_templateId8==='supereffective')_templateId8='superEffective';
if(kwArgs.spread)_templateId8+='Spread';
var _template56=this.template(_templateId8);
return _template56.replace('[POKEMON]',this.pokemon(_pokemon28));
}

case'-block':{var
_pokemon29=args[1],_effect13=args[2],_move2=args[3];
var _line23=this.maybeAbility(_effect13,kwArgs.of||_pokemon29);
var _template57=this.template('block',_effect13);
return _line23+_template57.replace('[POKEMON]',this.pokemon(_pokemon29)).replace('[MOVE]',_move2);
}

case'-fail':{var
_pokemon30=args[1],_effect14=args[2],_stat2=args[3];
var _id18=BattleTextParser.effectId(_effect14);
var blocker=BattleTextParser.effectId(kwArgs.from);
var _line24=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon30);
var _templateId9='block';
if(['desolateland','primordialsea'].includes(blocker)&&
!['sunnyday','raindance','sandstorm','hail'].includes(_id18)){
_templateId9='blockMove';
}else if(blocker==='uproar'&&kwArgs.msg){
_templateId9='blockSelf';
}
var _template58=this.template(_templateId9,kwArgs.from);
if(_template58){
return _line24+_template58.replace('[POKEMON]',this.pokemon(_pokemon30));
}

if(_id18==='unboost'){
_template58=this.template(_stat2?'failSingular':'fail','unboost');
if(BattleTextParser.effectId(kwArgs.from)==='flowerveil'){
_template58=this.template('block',kwArgs.from);
_pokemon30=kwArgs.of;
}
return _line24+_template58.replace('[POKEMON]',this.pokemon(_pokemon30)).replace('[STAT]',_stat2);
}

_templateId9='fail';
if(['brn','frz','par','psn','slp','substitute'].includes(_id18)){
_templateId9='alreadyStarted';
}
if(kwArgs.heavy)_templateId9='failTooHeavy';
if(kwArgs.weak)_templateId9='fail';
if(kwArgs.forme)_templateId9='failWrongForme';
_template58=this.template(_templateId9,_id18);
return _line24+_template58.replace('[POKEMON]',this.pokemon(_pokemon30));
}

case'-immune':{var
_pokemon31=args[1];
var _line25=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon31);
var _template59=this.template('block',kwArgs.from);
if(!_template59){
var _templateId10=kwArgs.ohko?'immuneOHKO':'immune';
_template59=this.template(_pokemon31?_templateId10:'immuneNoPokemon',kwArgs.from);
}
return _line25+_template59.replace('[POKEMON]',this.pokemon(_pokemon31));
}

case'-miss':{var
_source=args[1],_pokemon32=args[2];
var _line26=this.maybeAbility(kwArgs.from,kwArgs.of||_pokemon32);
if(!_pokemon32){
var _template61=this.template('missNoPokemon');
return _line26+_template61.replace('[SOURCE]',this.pokemon(_source));
}
var _template60=this.template('miss');
return _line26+_template60.replace('[POKEMON]',this.pokemon(_pokemon32));
}

case'-center':case'-ohko':case'-combine':{
return this.template(cmd.slice(1));
}

case'-notarget':{
return this.template('noTarget');
}

case'-mega':case'-primal':{var
_pokemon33=args[1],species=args[2],_item2=args[3];
var _id19='';
var _templateId11=cmd.slice(1);
if(species==='Rayquaza'){
_id19='dragonascent';
_templateId11='megaNoItem';
}
if(!_id19&&cmd==='-mega'&&this.gen<7)_templateId11='megaGen6';
if(!_item2&&cmd==='-mega')_templateId11='megaNoItem';
var _template62=this.template(_templateId11);
var _side6=_pokemon33.slice(0,2);
var pokemonName=this.pokemon(_pokemon33);
if(cmd==='-mega'){
var template2=this.template('transformMega');
_template62+=template2.replace('[POKEMON]',pokemonName).replace('[SPECIES]',species);
}
return _template62.replace('[POKEMON]',pokemonName).replace('[ITEM]',_item2).replace('[TRAINER]',this.trainer(_side6));
}

case'-zpower':{var
_pokemon34=args[1];
var _template63=this.template('zPower');
return _template63.replace('[POKEMON]',this.pokemon(_pokemon34));
}

case'-burst':{var
_pokemon35=args[1];
var _template64=this.template('activate',"Ultranecrozium Z");
return _template64.replace('[POKEMON]',this.pokemon(_pokemon35));
}

case'-zbroken':{var
_pokemon36=args[1];
var _template65=this.template('zBroken');
return _template65.replace('[POKEMON]',this.pokemon(_pokemon36));
}

case'-hitcount':{var
_num5=args[2];
if(_num5==='1'){
return this.template('hitCountSingular');
}
return this.template('hitCount').replace('[NUMBER]',_num5);
}

case'-waiting':{var
_pokemon37=args[1],_target6=args[2];
var _template66=this.template('activate',"Water Pledge");
return _template66.replace('[POKEMON]',this.pokemon(_pokemon37)).replace('[TARGET]',this.pokemon(_target6));
}

case'-anim':{
return'';
}

default:{
return null;
}}

};return BattleTextParser;}();


if(typeof require==='function'){

global.BattleTextParser=BattleTextParser;
}