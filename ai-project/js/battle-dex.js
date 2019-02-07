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