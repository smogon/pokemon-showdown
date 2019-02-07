/**
 * Pokemon Showdown Battle
 *
 * This is the main file for handling battle animations
 *
 * Licensing note: PS's client has complicated licensing:
 * - The client as a whole is AGPLv3
 * - The battle replay/animation engine (battle-*.ts) by itself is MIT
 *
 * Layout:
 *
 * - Battle
 *   - Side
 *     - Pokemon
 *   - BattleScene
 *     - BattleLog
 *       - BattleTextParser
 *
 * When a Battle receives a message, it splits the message into tokens
 * and parses what happens, updating its own state, and then telling
 * BattleScene to do any relevant animations. The tokens then get
 * passed directly into BattleLog. If the message is an in-battle
 * message, it'll be extracted by BattleTextParser, which adds it to
 * both the battle log itself, as well as the messagebar.
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */var








Pokemon=function(){




































































function Pokemon(data,side){this.name='';this.species='';this.ident='';this.details='';this.searchid='';this.slot=0;this.fainted=false;this.hp=0;this.maxhp=1000;this.level=100;this.gender='N';this.shiny=false;this.hpcolor='g';this.moves=[];this.ability='';this.baseAbility='';this.item='';this.itemEffect='';this.prevItem='';this.prevItemEffect='';this.boosts={};this.status='';this.statusStage=0;this.volatiles={};this.turnstatuses={};this.movestatuses={};this.weightkg=0;this.lastMove='';this.moveTrack=[];this.statusData={sleepTurns:0,toxicTurns:0};
this.side=side;
this.species=data.species;


Object.assign(this,Dex.getTemplate(data.species));
Object.assign(this,data);

this.sprite=side.battle.scene.addPokemonSprite(this);
}var _proto=Pokemon.prototype;_proto.

isActive=function isActive(){
return this.side.active.includes(this);
};_proto.

getHPColor=function getHPColor(){
if(this.hpcolor)return this.hpcolor;
var ratio=this.hp/this.maxhp;
if(ratio>0.5)return'g';
if(ratio>0.2)return'y';
return'r';
};_proto.
getHPColorClass=function getHPColorClass(){
switch(this.getHPColor()){
case'y':return' hpbar-yellow';
case'r':return' hpbar-red';}

return'';
};_proto.
getPixelRange=function getPixelRange(pixels,color){
var epsilon=0.5/714;

if(pixels===0)return[0,0];
if(pixels===1)return[0+epsilon,2/48-epsilon];
if(pixels===9){
if(color==='y'){
return[0.2+epsilon,10/48-epsilon];
}else{
return[9/48,0.2];
}
}
if(pixels===24){
if(color==='g'){
return[0.5+epsilon,25/48-epsilon];
}else{
return[0.5,0.5];
}
}
if(pixels===48)return[1,1];

return[pixels/48,(pixels+1)/48-epsilon];
};_proto.
getFormattedRange=function getFormattedRange(range,precision,separator){
if(range[0]===range[1]){
var percentage=Math.abs(range[0]*100);
if(Math.floor(percentage)===percentage){
return percentage+'%';
}
return percentage.toFixed(precision)+'%';
}
var lower;
var upper;
if(precision===0){
lower=Math.floor(range[0]*100);
upper=Math.ceil(range[1]*100);
}else{
lower=(range[0]*100).toFixed(precision);
upper=(range[1]*100).toFixed(precision);
}
return''+lower+separator+upper+'%';
};_proto.

getDamageRange=function getDamageRange(damage){
if(damage[1]!==48){
var ratio=damage[0]/damage[1];
return[ratio,ratio];
}else if(damage.length===undefined){


return[damage[2]/100,damage[2]/100];
}

var oldrange=this.getPixelRange(damage[3],damage[4]);
var newrange=this.getPixelRange(damage[3]+damage[0],this.hpcolor);
if(damage[0]===0){

return[0,newrange[1]-newrange[0]];
}
if(oldrange[0]<newrange[0]){
var r=oldrange;
oldrange=newrange;
newrange=r;
}
return[oldrange[0]-newrange[1],oldrange[1]-newrange[0]];
};_proto.
healthParse=function healthParse(hpstring,parsedamage,heal)
{

if(!hpstring||!hpstring.length)return null;
var parenIndex=hpstring.lastIndexOf('(');
if(parenIndex>=0){

if(parsedamage){
var damage=parseFloat(hpstring);

if(isNaN(damage))damage=50;
if(heal){
this.hp+=this.maxhp*damage/100;
if(this.hp>this.maxhp)this.hp=this.maxhp;
}else{
this.hp-=this.maxhp*damage/100;
}

var ret=this.healthParse(hpstring);
if(ret&&ret[1]===100){

return[damage,100,damage];
}

var percent=Math.round(Math.ceil(damage*48/100)/48*100);
var pixels=Math.ceil(damage*48/100);
return[pixels,48,percent];
}
if(hpstring.substr(hpstring.length-1)!==')'){
return null;
}
hpstring=hpstring.substr(parenIndex+1,hpstring.length-parenIndex-2);
}

var oldhp=this.fainted?0:this.hp||1;
var oldmaxhp=this.maxhp;
var oldwidth=this.hpWidth(100);
var oldcolor=this.hpcolor;

this.side.battle.parseHealth(hpstring,this);
if(oldmaxhp===0){
oldmaxhp=oldhp=this.maxhp;
}

var oldnum=oldhp?Math.floor(this.maxhp*oldhp/oldmaxhp)||1:0;
var delta=this.hp-oldnum;
var deltawidth=this.hpWidth(100)-oldwidth;
return[delta,this.maxhp,deltawidth,oldnum,oldcolor];
};_proto.
checkDetails=function checkDetails(details){
if(!details)return false;
if(details===this.details)return true;
if(this.searchid)return false;
if(details.indexOf(', shiny')>=0){
if(this.checkDetails(details.replace(', shiny','')))return true;
}

details=details.replace(/(-[A-Za-z0-9]+)?(, |$)/,'-*$2');
return details===this.details;
};_proto.
getIdent=function getIdent(){
var slots=['a','b','c','d','e','f'];
return this.ident.substr(0,2)+slots[this.slot]+this.ident.substr(2);
};_proto.
removeVolatile=function removeVolatile(volatile){
this.side.battle.scene.removeEffect(this,volatile);
if(!this.hasVolatile(volatile))return;
delete this.volatiles[volatile];
};_proto.
addVolatile=function addVolatile(volatile){for(var _len=arguments.length,args=new Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){args[_key-1]=arguments[_key];}
if(this.hasVolatile(volatile)&&!args.length)return;
this.volatiles[volatile]=[volatile].concat(args);
this.side.battle.scene.addEffect(this,volatile);
};_proto.
hasVolatile=function hasVolatile(volatile){
return!!this.volatiles[volatile];
};_proto.
removeTurnstatus=function removeTurnstatus(volatile){
this.side.battle.scene.removeEffect(this,volatile);
if(!this.hasTurnstatus(volatile))return;
delete this.turnstatuses[volatile];
};_proto.
addTurnstatus=function addTurnstatus(volatile){
volatile=toId(volatile);
this.side.battle.scene.addEffect(this,volatile);
if(this.hasTurnstatus(volatile))return;
this.turnstatuses[volatile]=[volatile];
};_proto.
hasTurnstatus=function hasTurnstatus(volatile){
return!!this.turnstatuses[volatile];
};_proto.
clearTurnstatuses=function clearTurnstatuses(){
for(var _id in this.turnstatuses){
this.removeTurnstatus(_id);
}
this.turnstatuses={};
this.side.battle.scene.updateStatbar(this);
};_proto.
removeMovestatus=function removeMovestatus(volatile){
this.side.battle.scene.removeEffect(this,volatile);
if(!this.hasMovestatus(volatile))return;
delete this.movestatuses[volatile];
};_proto.
addMovestatus=function addMovestatus(volatile){
volatile=toId(volatile);
if(this.hasMovestatus(volatile))return;
this.movestatuses[volatile]=[volatile];
this.side.battle.scene.addEffect(this,volatile);
};_proto.
hasMovestatus=function hasMovestatus(volatile){
return!!this.movestatuses[volatile];
};_proto.
clearMovestatuses=function clearMovestatuses(){
for(var _id2 in this.movestatuses){
this.removeMovestatus(_id2);
}
this.movestatuses={};
};_proto.
clearVolatiles=function clearVolatiles(){
this.volatiles={};
this.clearTurnstatuses();
this.clearMovestatuses();
this.side.battle.scene.clearEffects(this);
};_proto.
rememberMove=function rememberMove(moveName){var pp=arguments.length>1&&arguments[1]!==undefined?arguments[1]:1;var recursionSource=arguments.length>2?arguments[2]:undefined;
if(recursionSource===this.ident)return;
moveName=Dex.getMove(moveName).name;
if(moveName.charAt(0)==='*')return;
if(moveName==='Struggle')return;
if(this.volatiles.transform){

if(!recursionSource)recursionSource=this.ident;
this.volatiles.transform[1].rememberMove(moveName,0,recursionSource);
moveName='*'+moveName;
}for(var _i=0,_this$moveTrack=
this.moveTrack;_i<_this$moveTrack.length;_i++){var entry=_this$moveTrack[_i];
if(moveName===entry[0]){
entry[1]+=pp;
if(entry[1]<0)entry[1]=0;
return;
}
}
this.moveTrack.push([moveName,pp]);
};_proto.
rememberAbility=function rememberAbility(ability,isNotBase){
ability=Dex.getAbility(ability).name;
this.ability=ability;
if(!this.baseAbility&&!isNotBase){
this.baseAbility=ability;
}
};_proto.
getBoost=function getBoost(boostStat){
var boostStatTable={
atk:'Atk',
def:'Def',
spa:'SpA',
spd:'SpD',
spe:'Spe',
accuracy:'Accuracy',
evasion:'Evasion',
spc:'Spc'};

if(!this.boosts[boostStat]){
return'1&times;&nbsp;'+boostStatTable[boostStat];
}
if(this.boosts[boostStat]>6)this.boosts[boostStat]=6;
if(this.boosts[boostStat]<-6)this.boosts[boostStat]=-6;
if(boostStat==='accuracy'||boostStat==='evasion'){
if(this.boosts[boostStat]>0){
var goodBoostTable=['1&times;','1.33&times;','1.67&times;','2&times;','2.33&times;','2.67&times;','3&times;'];

return''+goodBoostTable[this.boosts[boostStat]]+'&nbsp;'+boostStatTable[boostStat];
}
var _badBoostTable=['1&times;','0.75&times;','0.6&times;','0.5&times;','0.43&times;','0.38&times;','0.33&times;'];

return''+_badBoostTable[-this.boosts[boostStat]]+'&nbsp;'+boostStatTable[boostStat];
}
if(this.boosts[boostStat]>0){
var _goodBoostTable=['1&times;','1.5&times;','2&times;','2.5&times;','3&times;','3.5&times;','4&times;'];

return''+_goodBoostTable[this.boosts[boostStat]]+'&nbsp;'+boostStatTable[boostStat];
}
var badBoostTable=['1&times;','0.67&times;','0.5&times;','0.4&times;','0.33&times;','0.29&times;','0.25&times;'];

return''+badBoostTable[-this.boosts[boostStat]]+'&nbsp;'+boostStatTable[boostStat];
};_proto.
getBoostType=function getBoostType(boostStat){
if(!this.boosts[boostStat])return'neutral';
if(this.boosts[boostStat]>0)return'good';
return'bad';
};_proto.
clearVolatile=function clearVolatile(){
this.ability=this.baseAbility;
if(window.BattlePokedex&&BattlePokedex[this.species]&&BattlePokedex[this.species].weightkg){
this.weightkg=BattlePokedex[this.species].weightkg;
}
this.boosts={};
this.clearVolatiles();
for(var i=0;i<this.moveTrack.length;i++){
if(this.moveTrack[i][0].charAt(0)==='*'){
this.moveTrack.splice(i,1);
i--;
}
}

this.statusStage=0;
this.statusData.toxicTurns=0;
if(this.side.battle.gen===5)this.statusData.sleepTurns=0;
};_proto.




copyVolatileFrom=function copyVolatileFrom(pokemon,copyAll){
this.boosts=pokemon.boosts;
this.volatiles=pokemon.volatiles;

if(!copyAll){
delete this.volatiles['airballoon'];
delete this.volatiles['attract'];
delete this.volatiles['autotomize'];
delete this.volatiles['disable'];
delete this.volatiles['encore'];
delete this.volatiles['foresight'];
delete this.volatiles['imprison'];
delete this.volatiles['mimic'];
delete this.volatiles['miracleeye'];
delete this.volatiles['nightmare'];
delete this.volatiles['smackdown'];
delete this.volatiles['stockpile1'];
delete this.volatiles['stockpile2'];
delete this.volatiles['stockpile3'];
delete this.volatiles['torment'];
delete this.volatiles['typeadd'];
delete this.volatiles['typechange'];
delete this.volatiles['yawn'];
}
delete this.volatiles['transform'];
delete this.volatiles['formechange'];

pokemon.boosts={};
pokemon.volatiles={};
pokemon.side.battle.scene.removeTransform(pokemon);
pokemon.statusStage=0;
};_proto.
copyTypesFrom=function copyTypesFrom(pokemon){var _pokemon$getTypes=
pokemon.getTypes(),types=_pokemon$getTypes[0],addedType=_pokemon$getTypes[1];
this.addVolatile('typechange',types.join('/'));
if(addedType){
this.addVolatile('typeadd',addedType);
}else{
this.removeVolatile('typeadd');
}
};_proto.
getTypes=function getTypes(){
var types;
if(this.volatiles.typechange){
types=this.volatiles.typechange[1].split('/');
}else{
var species=this.getSpecies();
types=
window.BattleTeambuilderTable&&
window.BattleTeambuilderTable['gen'+this.side.battle.gen]&&
window.BattleTeambuilderTable['gen'+this.side.battle.gen].overrideType[toId(species)];

if(types)types=types.split('/');
if(!types)types=Dex.getTemplate(species).types||[];
}
var addedType=this.volatiles.typeadd?this.volatiles.typeadd[1]:'';
return[types,addedType];
};_proto.
getTypeList=function getTypeList(){var _this$getTypes=
this.getTypes(),types=_this$getTypes[0],addedType=_this$getTypes[1];
return types.concat(addedType);
};_proto.
getSpecies=function getSpecies(){
return this.volatiles.formechange?this.volatiles.formechange[1]:this.species;
};_proto.
reset=function reset(){
this.clearVolatile();
this.hp=this.maxhp;
this.fainted=false;
this.status='';
this.moveTrack=[];
this.name=this.name||this.species;
};_proto.






hpWidth=function hpWidth(maxWidth){
if(this.fainted||!this.hp)return 0;


if(this.hp===1&&this.maxhp>45)return 1;

if(this.maxhp===48){



var range=this.getPixelRange(this.hp,this.hpcolor);
var ratio=(range[0]+range[1])/2;
return Math.round(maxWidth*ratio)||1;
}
var percentage=Math.ceil(100*this.hp/this.maxhp);
if(percentage===100&&this.hp<this.maxhp){
percentage=99;
}
return percentage*maxWidth/100;
};_proto.
hpDisplay=function hpDisplay(){var precision=arguments.length>0&&arguments[0]!==undefined?arguments[0]:1;
if(this.maxhp===100)return this.hp+'%';
if(this.maxhp!==48)return(100*this.hp/this.maxhp).toFixed(precision)+'%';
var range=this.getPixelRange(this.hp,this.hpcolor);
return this.getFormattedRange(range,precision,'–');
};_proto.
destroy=function destroy(){
if(this.sprite)this.sprite.destroy();
this.sprite=null;
this.side=null;
};return Pokemon;}();var


Side=function(){





















function Side(battle,n){this.name='';this.id='';this.foe=null;this.avatar='unknown';this.totalPokemon=6;this.x=0;this.y=0;this.z=0;this.missedPokemon=null;this.wisher=null;this.active=[null];this.lastPokemon=null;this.pokemon=[];this.sideConditions={};
this.battle=battle;
this.n=n;
this.updateSprites();
}var _proto2=Side.prototype;_proto2.

rollTrainerSprites=function rollTrainerSprites(){
var sprites=['lucas','dawn','ethan','lyra','hilbert','hilda'];
this.avatar=sprites[Math.floor(Math.random()*sprites.length)];
};_proto2.

behindx=function behindx(offset){
return this.x+(!this.n?-1:1)*offset;
};_proto2.
behindy=function behindy(offset){
return this.y+(!this.n?1:-1)*offset;
};_proto2.
leftof=function leftof(offset){
return(!this.n?-1:1)*offset;
};_proto2.
behind=function behind(offset){
return this.z+(!this.n?-1:1)*offset;
};_proto2.

clearPokemon=function clearPokemon(){for(var _i2=0,_this$pokemon=
this.pokemon;_i2<_this$pokemon.length;_i2++){var pokemon=_this$pokemon[_i2];pokemon.destroy();}
this.pokemon=[];
for(var i=0;i<this.active.length;i++){this.active[i]=null;}
this.lastPokemon=null;
};_proto2.
reset=function reset(){
this.clearPokemon();
this.updateSprites();
this.sideConditions={};
};_proto2.
updateSprites=function updateSprites(){
this.z=this.n?200:0;
this.battle.scene.updateSpritesForSide(this);
};_proto2.
setAvatar=function setAvatar(avatar){
this.avatar=avatar;
};_proto2.
setName=function setName(name,avatar){
if(name)this.name=name;
this.id=toId(this.name);
if(avatar){
this.setAvatar(avatar);
}else{
this.rollTrainerSprites();
if(this.foe&&this.avatar===this.foe.avatar)this.rollTrainerSprites();
}
if(this.battle.stagnateCallback)this.battle.stagnateCallback(this.battle);
};_proto2.
addSideCondition=function addSideCondition(effect){
var condition=effect.id;
if(this.sideConditions[condition]){
if(condition==='spikes'||condition==='toxicspikes'){
this.sideConditions[condition][1]++;
}
this.battle.scene.addSideCondition(this.n,condition);
return;
}

switch(condition){
case'auroraveil':
this.sideConditions[condition]=[effect.name,1,5,8];
break;
case'reflect':
this.sideConditions[condition]=[effect.name,1,5,this.battle.gen>=4?8:0];
break;
case'safeguard':
this.sideConditions[condition]=[effect.name,1,5,0];
break;
case'lightscreen':
this.sideConditions[condition]=[effect.name,1,5,this.battle.gen>=4?8:0];
break;
case'mist':
this.sideConditions[condition]=[effect.name,1,5,0];
break;
case'tailwind':
this.sideConditions[condition]=[effect.name,1,this.battle.gen>=5?4:3,0];
break;
case'luckychant':
this.sideConditions[condition]=[effect.name,1,5,0];
break;
case'stealthrock':
this.sideConditions[condition]=[effect.name,1,0,0];
break;
case'spikes':
this.sideConditions[condition]=[effect.name,1,0,0];
break;
case'toxicspikes':
this.sideConditions[condition]=[effect.name,1,0,0];
break;
case'stickyweb':
this.sideConditions[condition]=[effect.name,1,0,0];
break;
default:
this.sideConditions[condition]=[effect.name,1,0,0];
break;}

this.battle.scene.addSideCondition(this.n,condition);
};_proto2.
removeSideCondition=function removeSideCondition(condition){
var id=toId(condition);
if(!this.sideConditions[id])return;
delete this.sideConditions[id];
this.battle.scene.removeSideCondition(this.n,id);
};_proto2.
newPokemon=function newPokemon(data){var replaceSlot=arguments.length>1&&arguments[1]!==undefined?arguments[1]:-1;
var poke=new Pokemon(data,this);
if(!poke.ability&&poke.baseAbility)poke.ability=poke.baseAbility;
poke.reset();

if(replaceSlot>=0){
this.pokemon[replaceSlot]=poke;
}else{
this.pokemon.push(poke);
}
if(this.pokemon.length>this.totalPokemon||this.battle.speciesClause){

var existingTable={};
var toRemove=-1;
for(var poke1i=0;poke1i<this.pokemon.length;poke1i++){
var poke1=this.pokemon[poke1i];
if(!poke1.searchid)continue;
if(poke1.searchid in existingTable){
var poke2i=existingTable[poke1.searchid];
var poke2=this.pokemon[poke2i];
if(poke===poke1){
toRemove=poke2i;
}else if(poke===poke2){
toRemove=poke1i;
}else if(this.active.indexOf(poke1)>=0){
toRemove=poke2i;
}else if(this.active.indexOf(poke2)>=0){
toRemove=poke1i;
}else if(poke1.fainted&&!poke2.fainted){
toRemove=poke2i;
}else{
toRemove=poke1i;
}
break;
}
existingTable[poke1.searchid]=poke1i;
}
if(toRemove>=0){
if(this.pokemon[toRemove].fainted){

var illusionFound=null;for(var _i3=0,_this$pokemon2=
this.pokemon;_i3<_this$pokemon2.length;_i3++){var curPoke=_this$pokemon2[_i3];
if(curPoke===poke)continue;
if(curPoke.fainted)continue;
if(this.active.indexOf(curPoke)>=0)continue;
if(curPoke.species==='Zoroark'||curPoke.species==='Zorua'||curPoke.ability==='Illusion'){
illusionFound=curPoke;
break;
}
}
if(!illusionFound){for(var _i4=0,_this$pokemon3=




this.pokemon;_i4<_this$pokemon3.length;_i4++){var _curPoke=_this$pokemon3[_i4];
if(_curPoke===poke)continue;
if(_curPoke.fainted)continue;
if(this.active.indexOf(_curPoke)>=0)continue;
illusionFound=_curPoke;
break;
}
}
if(illusionFound){
illusionFound.fainted=true;
illusionFound.hp=0;
illusionFound.status='';
}
}
this.pokemon.splice(toRemove,1);
}
}
this.battle.scene.updateSidebar(this);

return poke;
};_proto2.

switchIn=function switchIn(pokemon,slot){
if(slot===undefined)slot=pokemon.slot;
this.active[slot]=pokemon;
pokemon.slot=slot;
pokemon.clearVolatile();
pokemon.lastMove='';
this.battle.lastMove='switch-in';
if(this.lastPokemon&&(this.lastPokemon.lastMove==='batonpass'||this.lastPokemon.lastMove==='zbatonpass')){
pokemon.copyVolatileFrom(this.lastPokemon);
}

this.battle.scene.animSummon(pokemon,slot);

if(this.battle.switchCallback)this.battle.switchCallback(this.battle,this);
};_proto2.
dragIn=function dragIn(pokemon){var slot=arguments.length>1&&arguments[1]!==undefined?arguments[1]:pokemon.slot;
var oldpokemon=this.active[slot];
if(oldpokemon===pokemon)return;
this.lastPokemon=oldpokemon;
if(oldpokemon){
this.battle.scene.animDragOut(oldpokemon);
oldpokemon.clearVolatile();
}
pokemon.clearVolatile();
pokemon.lastMove='';
this.battle.lastMove='switch-in';
this.active[slot]=pokemon;
pokemon.slot=slot;

this.battle.scene.animDragIn(pokemon,slot);

if(this.battle.dragCallback)this.battle.dragCallback(this.battle,this);
};_proto2.
replace=function replace(pokemon){var slot=arguments.length>1&&arguments[1]!==undefined?arguments[1]:pokemon.slot;
var oldpokemon=this.active[slot];
if(pokemon===oldpokemon)return;
this.lastPokemon=oldpokemon;
pokemon.clearVolatile();
if(oldpokemon){
pokemon.lastMove=oldpokemon.lastMove;
pokemon.hp=oldpokemon.hp;
pokemon.maxhp=oldpokemon.maxhp;
pokemon.hpcolor=oldpokemon.hpcolor;
pokemon.status=oldpokemon.status;
pokemon.copyVolatileFrom(oldpokemon,true);
pokemon.statusData=Object.assign({},oldpokemon.statusData);


oldpokemon.fainted=false;
oldpokemon.hp=oldpokemon.maxhp;
oldpokemon.status='???';
}
this.active[slot]=pokemon;
pokemon.slot=slot;

if(oldpokemon){
this.battle.scene.animUnsummon(oldpokemon,true);
}
this.battle.scene.animSummon(pokemon,slot,true);

if(this.battle.dragCallback)this.battle.dragCallback(this.battle,this);
};_proto2.
switchOut=function switchOut(pokemon){var slot=arguments.length>1&&arguments[1]!==undefined?arguments[1]:pokemon.slot;
if(pokemon.lastMove!=='batonpass'&&pokemon.lastMove!=='zbatonpass'){
pokemon.clearVolatile();
}else{
pokemon.removeVolatile('transform');
pokemon.removeVolatile('formechange');
}
if(pokemon.lastMove==='uturn'||pokemon.lastMove==='voltswitch'){
this.battle.log(['switchout',pokemon.ident],{from:pokemon.lastMove});
}else if(pokemon.lastMove!=='batonpass'&&pokemon.lastMove!=='zbatonpass'){
this.battle.log(['switchout',pokemon.ident]);
}
pokemon.statusData.toxicTurns=0;
if(this.battle.gen===5)pokemon.statusData.sleepTurns=0;
this.lastPokemon=pokemon;
this.active[slot]=null;

this.battle.scene.animUnsummon(pokemon);
};_proto2.
swapTo=function swapTo(pokemon,slot,kwArgs){
if(pokemon.slot===slot)return;
var target=this.active[slot];

var oslot=pokemon.slot;

pokemon.slot=slot;
if(target)target.slot=oslot;

this.active[slot]=pokemon;
this.active[oslot]=target;

this.battle.scene.animUnsummon(pokemon,true);
if(target)this.battle.scene.animUnsummon(target,true);

this.battle.scene.animSummon(pokemon,slot,true);
if(target)this.battle.scene.animSummon(target,oslot,true);
};_proto2.
swapWith=function swapWith(pokemon,target,kwArgs){

if(pokemon===target)return;

var oslot=pokemon.slot;
var nslot=target.slot;

pokemon.slot=nslot;
target.slot=oslot;
this.active[nslot]=pokemon;
this.active[oslot]=target;

this.battle.scene.animUnsummon(pokemon,true);
this.battle.scene.animUnsummon(target,true);

this.battle.scene.animSummon(pokemon,nslot,true);
this.battle.scene.animSummon(target,oslot,true);
};_proto2.
faint=function faint(pokemon){var slot=arguments.length>1&&arguments[1]!==undefined?arguments[1]:pokemon.slot;
pokemon.clearVolatile();
this.lastPokemon=pokemon;
this.active[slot]=null;

pokemon.fainted=true;
pokemon.hp=0;

this.battle.scene.animFaint(pokemon);
if(this.battle.faintCallback)this.battle.faintCallback(this.battle,this);
};_proto2.
destroy=function destroy(){
this.clearPokemon();
this.battle=null;
this.foe=null;
};return Side;}();var


Playback;(function(Playback){Playback[Playback["Uninitialized"]=0]="Uninitialized";Playback[Playback["Ready"]=1]="Ready";Playback[Playback["Playing"]=2]="Playing";Playback[Playback["Paused"]=3]="Paused";Playback[Playback["Finished"]=4]="Finished";Playback[Playback["Seeking"]=5]="Seeking";})(Playback||(Playback={}));var








Battle=function(){












































































function Battle($frame,$logFrame){var id=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'';this.sidesSwitched=false;this.activityQueue=[];this.preemptActivityQueue=[];this.waitForAnimations=true;this.activityStep=0;this.fastForward=0;this.fastForwardWillScroll=false;this.resultWaiting=false;this.activeMoveIsSpread=null;this.faintCallback=null;this.switchCallback=null;this.dragCallback=null;this.turnCallback=null;this.startCallback=null;this.stagnateCallback=null;this.endCallback=null;this.customCallback=null;this.errorCallback=null;this.mute=false;this.messageFadeTime=300;this.messageShownTime=1;this.turnsSinceMoved=0;this.turn=0;this.ended=false;this.usesUpkeep=false;this.weather='';this.pseudoWeather=[];this.weatherTimeLeft=0;this.weatherMinTimeLeft=0;this.mySide=null;this.yourSide=null;this.p1=null;this.p2=null;this.sides=[null,null];this.lastMove='';this.gen=7;this.teamPreviewCount=0;this.speciesClause=false;this.tier='';this.gameType='singles';this.rated=false;this.endLastTurnPending=false;this.totalTimeLeft=0;this.graceTimeLeft=0;this.kickingInactive=false;this.id='';this.roomid='';this.hardcoreMode=false;this.ignoreNicks=Dex.prefs('ignorenicks');this.ignoreOpponent=false;this.ignoreSpects=false;this.debug=false;this.joinButtons=false;this.paused=true;this.playbackState=Playback.Uninitialized;this.resumeButton=null;
this.id=id;

if(!$frame&&!$logFrame){
this.scene=new BattleSceneStub();
}else{
this.scene=new BattleScene(this,$frame,$logFrame);
}

this.init();
}var _proto3=Battle.prototype;_proto3.

removePseudoWeather=function removePseudoWeather(weather){
for(var i=0;i<this.pseudoWeather.length;i++){
if(this.pseudoWeather[i][0]===weather){
this.pseudoWeather.splice(i,1);
this.scene.updateWeather();
return;
}
}
};_proto3.
addPseudoWeather=function addPseudoWeather(weather,minTimeLeft,timeLeft){
this.pseudoWeather.push([weather,minTimeLeft,timeLeft]);
this.scene.updateWeather();
};_proto3.
hasPseudoWeather=function hasPseudoWeather(weather){for(var _i5=0,_this$pseudoWeather=
this.pseudoWeather;_i5<_this$pseudoWeather.length;_i5++){var _ref=_this$pseudoWeather[_i5];var pseudoWeatherName=_ref[0];
if(weather===pseudoWeatherName){
return true;
}
}
return false;
};_proto3.
init=function init(){
this.mySide=new Side(this,0);
this.yourSide=new Side(this,1);
this.mySide.foe=this.yourSide;
this.yourSide.foe=this.mySide;
this.sides=[this.mySide,this.yourSide];
this.p1=this.mySide;
this.p2=this.yourSide;
this.gen=7;
this.reset();
};_proto3.
reset=function reset(dontResetSound){

this.turn=0;
this.ended=false;
this.weather='';
this.weatherTimeLeft=0;
this.weatherMinTimeLeft=0;
this.pseudoWeather=[];
this.lastMove='';


this.scene.reset();for(var _i6=0,_this$sides=

this.sides;_i6<_this$sides.length;_i6++){var side=_this$sides[_i6];
if(side)side.reset();
}


this.activeMoveIsSpread=null;
this.activityStep=0;
this.fastForwardOff();
this.resultWaiting=false;
this.paused=true;
if(this.playbackState!==Playback.Seeking){
this.playbackState=this.activityQueue.length?Playback.Ready:Playback.Uninitialized;
if(!dontResetSound)this.scene.soundStop();
}
this.resetTurnsSinceMoved();
};_proto3.
destroy=function destroy(){
this.scene.destroy();

for(var i=0;i<this.sides.length;i++){
if(this.sides[i])this.sides[i].destroy();
this.sides[i]=null;
}
this.mySide=null;
this.yourSide=null;
this.p1=null;
this.p2=null;
};_proto3.

log=function log(args,kwArgs,preempt){
this.scene.log.add(args,kwArgs,preempt);
};_proto3.

resetToCurrentTurn=function resetToCurrentTurn(){
if(this.ended){
this.reset(true);
this.fastForwardTo(-1);
}else{
var turn=this.turn;
var paused=this.paused;
this.reset(true);
this.paused=paused;
if(turn)this.fastForwardTo(turn);
if(!paused){
this.play();
}else{
this.pause();
}
}
};_proto3.
switchSides=function switchSides(){
this.setSidesSwitched(!this.sidesSwitched);
this.resetToCurrentTurn();
};_proto3.
setSidesSwitched=function setSidesSwitched(sidesSwitched){
this.sidesSwitched=sidesSwitched;
if(this.sidesSwitched){
this.mySide=this.p2;
this.yourSide=this.p1;
}else{
this.mySide=this.p1;
this.yourSide=this.p2;
}
this.sides[0]=this.mySide;
this.sides[1]=this.yourSide;
this.sides[0].n=0;
this.sides[1].n=1;


};_proto3.




start=function start(){
this.log(['start']);
if(this.startCallback)this.startCallback(this);
};_proto3.
winner=function winner(_winner){
this.log(['win',_winner||'']);
this.ended=true;
};_proto3.
prematureEnd=function prematureEnd(){
this.log(['message','This replay ends here.']);
this.ended=true;
};_proto3.
endLastTurn=function endLastTurn(){
if(this.endLastTurnPending){
this.endLastTurnPending=false;
this.scene.updateStatbars();
}
};_proto3.
setHardcoreMode=function setHardcoreMode(mode){
this.hardcoreMode=mode;
this.scene.updateSidebars();
this.scene.updateWeather(true);
};_proto3.
setTurn=function setTurn(turnNum){
turnNum=parseInt(turnNum,10);
if(turnNum===this.turn+1){
this.endLastTurnPending=true;
}
if(this.turn&&!this.usesUpkeep)this.updatePseudoWeatherLeft();
this.turn=turnNum;

if(this.mySide.active[0])this.mySide.active[0].clearTurnstatuses();
if(this.mySide.active[1])this.mySide.active[1].clearTurnstatuses();
if(this.mySide.active[2])this.mySide.active[2].clearTurnstatuses();
if(this.yourSide.active[0])this.yourSide.active[0].clearTurnstatuses();
if(this.yourSide.active[1])this.yourSide.active[1].clearTurnstatuses();
if(this.yourSide.active[2])this.yourSide.active[2].clearTurnstatuses();

if(!this.fastForward)this.turnsSinceMoved++;

this.scene.incrementTurn();

if(this.fastForward){
if(this.turnCallback)this.turnCallback(this);
if(this.fastForward>-1&&turnNum>=this.fastForward){
this.fastForwardOff();
if(this.endCallback)this.endCallback(this);
}
return;
}

if(this.turnCallback)this.turnCallback(this);
};_proto3.
resetTurnsSinceMoved=function resetTurnsSinceMoved(){
this.turnsSinceMoved=0;
this.scene.acceleration=this.messageFadeTime<150?2:1;
};_proto3.
updateToxicTurns=function updateToxicTurns(){for(var _i7=0,_this$sides2=
this.sides;_i7<_this$sides2.length;_i7++){var side=_this$sides2[_i7];for(var _i8=0,_side$active=
side.active;_i8<_side$active.length;_i8++){var poke=_side$active[_i8];
if(poke&&poke.status==='tox')poke.statusData.toxicTurns++;
}
}
};_proto3.
changeWeather=function changeWeather(weatherName,poke,isUpkeep,ability){
var weather=toId(weatherName);
if(!weather||weather==='none'){
weather='';
}
if(isUpkeep){
if(this.weather&&this.weatherTimeLeft){
this.weatherTimeLeft--;
if(this.weatherMinTimeLeft!==0)this.weatherMinTimeLeft--;
}
if(!this.fastForward){
this.scene.upkeepWeather();
}
return;
}
if(weather){
var isExtremeWeather=weather==='deltastream'||weather==='desolateland'||weather==='primordialsea';
if(poke){
if(ability){
this.activateAbility(poke,ability.name);
}
this.weatherTimeLeft=this.gen<=5||isExtremeWeather?0:8;
this.weatherMinTimeLeft=this.gen<=5||isExtremeWeather?0:5;
}else if(isExtremeWeather){
this.weatherTimeLeft=0;
this.weatherMinTimeLeft=0;
}else{
this.weatherTimeLeft=this.gen<=3?5:8;
this.weatherMinTimeLeft=this.gen<=3?0:5;
}
}
this.weather=weather;
this.scene.updateWeather();
};_proto3.
updatePseudoWeatherLeft=function updatePseudoWeatherLeft(){for(var _i9=0,_this$pseudoWeather2=
this.pseudoWeather;_i9<_this$pseudoWeather2.length;_i9++){var pWeather=_this$pseudoWeather2[_i9];
if(pWeather[1])pWeather[1]--;
if(pWeather[2])pWeather[2]--;
}for(var _i10=0,_this$sides3=
this.sides;_i10<_this$sides3.length;_i10++){var side=_this$sides3[_i10];
for(var _id3 in side.sideConditions){
var cond=side.sideConditions[_id3];
if(cond[2])cond[2]--;
if(cond[3])cond[3]--;
}
}
this.scene.updateWeather();
};_proto3.
useMove=function useMove(pokemon,move,target,kwArgs){
var fromeffect=Dex.getEffect(kwArgs.from);
this.activateAbility(pokemon,fromeffect);
pokemon.clearMovestatuses();
if(move.id==='focuspunch'){
pokemon.removeTurnstatus('focuspunch');
}
this.scene.updateStatbar(pokemon);
if(fromeffect.id==='sleeptalk'){
pokemon.rememberMove(move.name,0);
}else if(!fromeffect.id||fromeffect.id==='pursuit'){
var moveName=move.name;
if(move.isZ){
pokemon.item=move.isZ;
var item=Dex.getItem(move.isZ);
if(item.zMoveFrom)moveName=item.zMoveFrom;
}else if(move.name.slice(0,2)==='Z-'){
moveName=moveName.slice(2);
move=Dex.getMove(moveName);
if(window.BattleItems){
for(var _item in BattleItems){
if(BattleItems[_item].zMoveType===move.type)pokemon.item=_item;
}
}
}
var pp=target&&target.side!==pokemon.side&&toId(target.ability)==='pressure'?2:1;
pokemon.rememberMove(moveName,pp);
}
pokemon.lastMove=move.id;
this.lastMove=move.id;
if(move.id==='wish'||move.id==='healingwish'){
pokemon.side.wisher=pokemon;
}
};_proto3.
animateMove=function animateMove(pokemon,move,target,kwArgs){
if(this.fastForward||kwArgs.still)return;

if(!target)target=pokemon.side.foe.active[0];
if(!target)target=pokemon.side.foe.missedPokemon;
if(kwArgs.miss&&target.side){
target=target.side.missedPokemon;
}
if(kwArgs.notarget){
return;
}

if(kwArgs.prepare||kwArgs.anim==='prepare'){
this.scene.runPrepareAnim(move.id,pokemon,target);
return;
}

var usedMove=kwArgs.anim?Dex.getMove(kwArgs.anim):move;
if(!kwArgs.spread){
this.scene.runMoveAnim(usedMove.id,[pokemon,target]);
return;
}

this.activeMoveIsSpread=kwArgs.spread;
var targets=[pokemon];
if(kwArgs.spread==='.'){

targets.push(target.side.missedPokemon);
}else{for(var _i11=0,_kwArgs$spread$split=
kwArgs.spread.split(',');_i11<_kwArgs$spread$split.length;_i11++){var hitTarget=_kwArgs$spread$split[_i11];
targets.push(this.getPokemon(hitTarget+': ?'));
}
}

this.scene.runMoveAnim(usedMove.id,targets);
};_proto3.
cantUseMove=function cantUseMove(pokemon,effect,move,kwArgs){
pokemon.clearMovestatuses();
this.scene.updateStatbar(pokemon);
if(effect.id in BattleStatusAnims){
this.scene.runStatusAnim(effect.id,[pokemon]);
}
this.activateAbility(pokemon,effect);
if(move.id)pokemon.rememberMove(move.name,0);
switch(effect.id){
case'par':
this.scene.resultAnim(pokemon,'Paralyzed','par');
break;
case'frz':
this.scene.resultAnim(pokemon,'Frozen','frz');
break;
case'slp':
this.scene.resultAnim(pokemon,'Asleep','slp');
pokemon.statusData.sleepTurns++;
break;
case'truant':
this.scene.resultAnim(pokemon,'Loafing around','neutral');
break;
case'recharge':
this.scene.runOtherAnim('selfstatus',[pokemon]);
this.scene.resultAnim(pokemon,'Must recharge','neutral');
break;
case'focuspunch':
this.scene.resultAnim(pokemon,'Lost focus','neutral');
pokemon.removeTurnstatus('focuspunch');
break;
case'shelltrap':
this.scene.resultAnim(pokemon,'Trap failed','neutral');
pokemon.removeTurnstatus('shelltrap');
break;
case'flinch':
this.scene.resultAnim(pokemon,'Flinched','neutral');
pokemon.removeTurnstatus('focuspunch');
break;
case'attract':
this.scene.resultAnim(pokemon,'Immobilized','neutral');
break;}

this.scene.animReset(pokemon);
};_proto3.

activateAbility=function activateAbility(pokemon,effectOrName,isNotBase){
if(!pokemon||!effectOrName)return;
if(typeof effectOrName!=='string'){
if(effectOrName.effectType!=='Ability')return;
effectOrName=effectOrName.name;
}
this.scene.abilityActivateAnim(pokemon,effectOrName);
pokemon.rememberAbility(effectOrName,isNotBase);
};_proto3.

runMinor=function runMinor(args,kwArgs,nextArgs,nextKwargs){
if(nextArgs&&nextKwargs){
if(args[2]==='Sturdy'&&args[0]==='-activate')args[2]='ability: Sturdy';
if(args[0]==='-crit'||args[0]==='-supereffective'||args[0]==='-resisted'||args[2]==='ability: Sturdy')kwArgs.then='.';
if(args[0]==='-damage'&&!kwArgs.from&&args[1]!==nextArgs[1]&&(
nextArgs[0]==='-crit'||
nextArgs[0]==='-supereffective'||
nextArgs[0]==='-resisted'||
nextArgs[0]==='-damage'&&!nextKwargs.from))
kwArgs.then='.';
if(args[0]==='-damage'&&nextArgs[0]==='-damage'&&kwArgs.from&&kwArgs.from===nextKwargs.from)kwArgs.then='.';
if(args[0]==='-ability'&&(args[2]==='Intimidate'||args[3]==='boost'))kwArgs.then='.';
if(args[0]==='-unboost'&&nextArgs[0]==='-unboost')kwArgs.then='.';
if(args[0]==='-boost'&&nextArgs[0]==='-boost')kwArgs.then='.';
if(args[0]==='-damage'&&kwArgs.from==='Leech Seed'&&nextArgs[0]==='-heal'&&nextKwargs.silent)kwArgs.then='.';
if(args[0]==='detailschange'&&nextArgs[0]==='-mega'){
if(this.scene.closeMessagebar()){
this.activityStep--;
return;
}
kwArgs.simult='.';
}
}
if(kwArgs.then)this.waitForAnimations=false;
if(kwArgs.simult)this.waitForAnimations='simult';

switch(args[0]){
case'-damage':{
var poke=this.getPokemon(args[1]);
var damage=poke.healthParse(args[2],true);
if(damage===null)break;
var range=poke.getDamageRange(damage);

if(kwArgs.from){
var effect=Dex.getEffect(kwArgs.from);
var ofpoke=this.getPokemon(kwArgs.of);
this.activateAbility(ofpoke,effect);
if(effect.effectType==='Item'){
(ofpoke||poke).item=effect.name;
}
switch(effect.id){
case'brn':
this.scene.runStatusAnim('brn',[poke]);
break;
case'psn':
this.scene.runStatusAnim('psn',[poke]);
break;
case'baddreams':
this.scene.runStatusAnim('cursed',[poke]);
break;
case'curse':
this.scene.runStatusAnim('cursed',[poke]);
break;
case'confusion':
this.scene.runStatusAnim('confusedselfhit',[poke]);
break;
case'leechseed':
this.scene.runOtherAnim('leech',[ofpoke,poke]);
break;
case'bind':
case'wrap':
this.scene.runOtherAnim('bound',[poke]);
break;}

}else{
var damageinfo=''+poke.getFormattedRange(range,damage[1]===100?0:1,"\u2013");
if(damage[1]!==100){
var hover=''+(damage[0]<0?"\u2212":'')+
Math.abs(damage[0])+'/'+damage[1];
if(damage[1]===48){
hover+=' pixels';
}

damageinfo='||'+hover+'||'+damageinfo+'||';
}
args[3]=damageinfo;
}
this.scene.damageAnim(poke,poke.getFormattedRange(range,0,' to '));
this.log(args,kwArgs);
break;
}
case'-heal':{
var _poke=this.getPokemon(args[1]);
var _damage=_poke.healthParse(args[2],true,true);
if(_damage===null)break;
var _range=_poke.getDamageRange(_damage);

if(kwArgs.from){
var _effect=Dex.getEffect(kwArgs.from);
this.activateAbility(_poke,_effect);
if(_effect.effectType==='Item'){
_poke.item=_effect.name;
}
switch(_effect.id){
case'lunardance':for(var _i12=0,_poke$moveTrack=
_poke.moveTrack;_i12<_poke$moveTrack.length;_i12++){var trackedMove=_poke$moveTrack[_i12];
trackedMove[1]=0;
}

case'healingwish':
this.lastMove='healing-wish';
this.scene.runResidualAnim('healingwish',_poke);
_poke.side.wisher=null;
break;
case'wish':
this.scene.runResidualAnim('wish',_poke);
break;}

}
this.scene.runOtherAnim('heal',[_poke]);
this.scene.healAnim(_poke,_poke.getFormattedRange(_range,0,' to '));
this.log(args,kwArgs);
break;
}
case'-sethp':{
for(var _k=0;_k<2;_k++){
var cpoke=this.getPokemon(args[1+2*_k]);
if(cpoke){
var _damage2=cpoke.healthParse(args[2+2*_k]);
var _range2=cpoke.getDamageRange(_damage2);
var formattedRange=cpoke.getFormattedRange(_range2,0,' to ');
var diff=_damage2[0];
if(diff>0){
this.scene.healAnim(cpoke,formattedRange);
}else{
this.scene.damageAnim(cpoke,formattedRange);
}
}
}
this.log(args,kwArgs);
break;
}
case'-boost':{
var _poke2=this.getPokemon(args[1]);
var _stat=args[2];
if(this.gen===1&&_stat==='spd')break;
if(this.gen===1&&_stat==='spa')_stat='spc';
var amount=parseInt(args[3],10);
if(amount===0){
this.scene.resultAnim(_poke2,'Highest '+BattleStats[_stat],'neutral');
this.log(args,kwArgs);
break;
}
if(!_poke2.boosts[_stat]){
_poke2.boosts[_stat]=0;
}
_poke2.boosts[_stat]+=amount;

if(!kwArgs.silent&&kwArgs.from){
var _effect2=Dex.getEffect(kwArgs.from);
var _ofpoke=this.getPokemon(kwArgs.of);
if(!(_effect2.id==='weakarmor'&&_stat==='spe')){
this.activateAbility(_ofpoke||_poke2,_effect2);
}
}
this.scene.resultAnim(_poke2,_poke2.getBoost(_stat),'good');
this.log(args,kwArgs);
break;
}
case'-unboost':{
var _poke3=this.getPokemon(args[1]);
var _stat2=args[2];
if(this.gen===1&&_stat2==='spd')break;
if(this.gen===1&&_stat2==='spa')_stat2='spc';
var _amount=parseInt(args[3],10);
if(_amount===0){
this.scene.resultAnim(_poke3,'Lowest '+BattleStats[_stat2],'bad');
this.log(args,kwArgs);
break;
}
if(!_poke3.boosts[_stat2]){
_poke3.boosts[_stat2]=0;
}
_poke3.boosts[_stat2]-=_amount;

if(!kwArgs.silent&&kwArgs.from){
var _effect3=Dex.getEffect(kwArgs.from);
var _ofpoke2=this.getPokemon(kwArgs.of);
this.activateAbility(_ofpoke2||_poke3,_effect3);
}
this.scene.resultAnim(_poke3,_poke3.getBoost(_stat2),'bad');
this.log(args,kwArgs);
break;
}
case'-setboost':{
var _poke4=this.getPokemon(args[1]);
var _stat3=args[2];
var _amount2=parseInt(args[3],10);
_poke4.boosts[_stat3]=_amount2;
this.scene.resultAnim(_poke4,_poke4.getBoost(_stat3),_amount2>0?'good':'bad');
this.log(args,kwArgs);
break;
}
case'-swapboost':{
var _poke5=this.getPokemon(args[1]);
var poke2=this.getPokemon(args[2]);
var stats=args[3]?args[3].split(', '):['atk','def','spa','spd','spe','accuracy','evasion'];for(var _i13=0;_i13<
stats.length;_i13++){var _stat4=stats[_i13];
var tmp=_poke5.boosts[_stat4];
_poke5.boosts[_stat4]=poke2.boosts[_stat4];
if(!_poke5.boosts[_stat4])delete _poke5.boosts[_stat4];
poke2.boosts[_stat4]=tmp;
if(!poke2.boosts[_stat4])delete poke2.boosts[_stat4];
}
this.scene.resultAnim(_poke5,'Stats swapped','neutral');
this.scene.resultAnim(poke2,'Stats swapped','neutral');

this.log(args,kwArgs);
break;
}
case'-clearpositiveboost':{
var _poke6=this.getPokemon(args[1]);
var _ofpoke3=this.getPokemon(args[2]);
var _effect4=Dex.getEffect(args[3]);
for(var _stat5 in _poke6.boosts){
if(_poke6.boosts[_stat5]>0)delete _poke6.boosts[_stat5];
}
this.scene.resultAnim(_poke6,'Boosts lost','bad');

if(_effect4.id){
switch(_effect4.id){
case'spectralthief':

this.scene.runOtherAnim('spectralthiefboost',[_ofpoke3,_poke6]);
break;}

}
this.log(args,kwArgs);
break;
}
case'-clearnegativeboost':{
var _poke7=this.getPokemon(args[1]);
for(var _stat6 in _poke7.boosts){
if(_poke7.boosts[_stat6]<0)delete _poke7.boosts[_stat6];
}
this.scene.resultAnim(_poke7,'Restored','good');

this.log(args,kwArgs);
break;
}
case'-copyboost':{
var _poke8=this.getPokemon(args[1]);
var frompoke=this.getPokemon(args[2]);
var _stats=args[3]?args[3].split(', '):['atk','def','spa','spd','spe','accuracy','evasion'];for(var _i14=0;_i14<
_stats.length;_i14++){var _stat7=_stats[_i14];
_poke8.boosts[_stat7]=frompoke.boosts[_stat7];
if(!_poke8.boosts[_stat7])delete _poke8.boosts[_stat7];
}
this.scene.resultAnim(_poke8,'Stats copied','neutral');

this.log(args,kwArgs);
break;
}
case'-clearboost':{
var _poke9=this.getPokemon(args[1]);
_poke9.boosts={};
this.scene.resultAnim(_poke9,'Stats reset','neutral');

this.log(args,kwArgs);
break;
}
case'-invertboost':{
var _poke10=this.getPokemon(args[1]);
for(var _stat8 in _poke10.boosts){
_poke10.boosts[_stat8]=-_poke10.boosts[_stat8];
}
this.scene.resultAnim(_poke10,'Stats inverted','neutral');

this.log(args,kwArgs);
break;
}
case'-clearallboost':{
var timeOffset=this.scene.timeOffset;for(var _i15=0,_this$sides4=
this.sides;_i15<_this$sides4.length;_i15++){var side=_this$sides4[_i15];for(var _i16=0,_side$active2=
side.active;_i16<_side$active2.length;_i16++){var active=_side$active2[_i16];
if(active){
active.boosts={};
this.scene.timeOffset=timeOffset;
this.scene.resultAnim(active,'Stats reset','neutral');
}
}
}

this.log(args,kwArgs);
break;
}
case'-crit':{
var _poke11=this.getPokemon(args[1]);
if(_poke11)this.scene.resultAnim(_poke11,'Critical hit','bad');
if(this.activeMoveIsSpread)kwArgs.spread='.';
this.log(args,kwArgs);
break;
}
case'-supereffective':{
var _poke12=this.getPokemon(args[1]);
if(_poke12){
this.scene.resultAnim(_poke12,'Super-effective','bad');
if(window.Config&&Config.server&&Config.server.afd){
this.scene.runOtherAnim('hitmark',[_poke12]);
}
}
if(this.activeMoveIsSpread)kwArgs.spread='.';
this.log(args,kwArgs);
break;
}
case'-resisted':{
var _poke13=this.getPokemon(args[1]);
if(_poke13)this.scene.resultAnim(_poke13,'Resisted','neutral');
if(this.activeMoveIsSpread)kwArgs.spread='.';
this.log(args,kwArgs);
break;
}
case'-immune':{
var _poke14=this.getPokemon(args[1]);
var fromeffect=Dex.getEffect(kwArgs.from);
this.activateAbility(this.getPokemon(kwArgs.of)||_poke14,fromeffect);
this.log(args,kwArgs);
this.scene.resultAnim(_poke14,'Immune','neutral');
break;
}
case'-miss':{
var target=this.getPokemon(args[2]);
if(target){
this.scene.resultAnim(target,'Missed','neutral');
}
this.log(args,kwArgs);
break;
}
case'-fail':{
var _poke15=this.getPokemon(args[1]);
var _effect5=Dex.getEffect(args[2]);
var _fromeffect=Dex.getEffect(kwArgs.from);
var _ofpoke4=this.getPokemon(kwArgs.of);
this.activateAbility(_ofpoke4||_poke15,_fromeffect);
switch(_effect5.id){
case'brn':
this.scene.resultAnim(_poke15,'Already burned','neutral');
break;
case'tox':
case'psn':
this.scene.resultAnim(_poke15,'Already poisoned','neutral');
break;
case'slp':
if(_fromeffect.id==='uproar'){
this.scene.resultAnim(_poke15,'Failed','neutral');
}else{
this.scene.resultAnim(_poke15,'Already asleep','neutral');
}
break;
case'par':
this.scene.resultAnim(_poke15,'Already paralyzed','neutral');
break;
case'frz':
this.scene.resultAnim(_poke15,'Already frozen','neutral');
break;
case'unboost':
this.scene.resultAnim(_poke15,'Stat drop blocked','neutral');
break;
default:
if(_poke15){
this.scene.resultAnim(_poke15,'Failed','neutral');
}
break;}

this.log(args,kwArgs);
break;
}
case'-block':{
var _poke16=this.getPokemon(args[1]);
var _effect6=Dex.getEffect(args[2]);
var _ofpoke5=this.getPokemon(kwArgs.of);
this.activateAbility(_ofpoke5||_poke16,_effect6);
switch(_effect6.id){
case'quickguard':
_poke16.addTurnstatus('quickguard');
this.scene.resultAnim(_poke16,'Quick Guard','good');
break;
case'wideguard':
_poke16.addTurnstatus('wideguard');
this.scene.resultAnim(_poke16,'Wide Guard','good');
break;
case'craftyshield':
_poke16.addTurnstatus('craftyshield');
this.scene.resultAnim(_poke16,'Crafty Shield','good');
break;
case'protect':
_poke16.addTurnstatus('protect');
this.scene.resultAnim(_poke16,'Protected','good');
break;

case'safetygoggles':
_poke16.item='Safety Goggles';
break;
case'protectivepads':
_poke16.item='Protective Pads';
break;}

this.log(args,kwArgs);
break;
}
case'-center':case'-notarget':case'-ohko':
case'-combine':case'-hitcount':case'-waiting':case'-zbroken':{
this.log(args,kwArgs);
break;
}
case'-zpower':{
var _poke17=this.getPokemon(args[1]);
this.scene.runOtherAnim('zpower',[_poke17]);
this.log(args,kwArgs);
break;
}
case'-prepare':{
var _poke18=this.getPokemon(args[1]);
var moveid=toId(args[2]);
var _target=this.getPokemon(args[3])||_poke18.side.foe.active[0]||_poke18;
this.scene.runPrepareAnim(moveid,_poke18,_target);
this.log(args,kwArgs);
break;
}
case'-mustrecharge':{
var _poke19=this.getPokemon(args[1]);
_poke19.addMovestatus('mustrecharge');
this.scene.updateStatbar(_poke19);
break;
}
case'-status':{
var _poke20=this.getPokemon(args[1]);
var _effect7=Dex.getEffect(kwArgs.from);
var _ofpoke6=this.getPokemon(kwArgs.of)||_poke20;
_poke20.status=args[2];
_poke20.removeVolatile('yawn');
this.activateAbility(_ofpoke6||_poke20,_effect7);
if(_effect7.effectType==='Item'){
_ofpoke6.item=_effect7.name;
}

switch(args[2]){
case'brn':
this.scene.resultAnim(_poke20,'Burned','brn');
this.scene.runStatusAnim('brn',[_poke20]);
break;
case'tox':
this.scene.resultAnim(_poke20,'Toxic poison','psn');
this.scene.runStatusAnim('psn',[_poke20]);
_poke20.statusData.toxicTurns=_effect7.name==="Toxic Orb"?-1:0;
break;
case'psn':
this.scene.resultAnim(_poke20,'Poisoned','psn');
this.scene.runStatusAnim('psn',[_poke20]);
break;
case'slp':
this.scene.resultAnim(_poke20,'Asleep','slp');
if(_effect7.id==='rest'){
_poke20.statusData.sleepTurns=0;
}
break;
case'par':
this.scene.resultAnim(_poke20,'Paralyzed','par');
this.scene.runStatusAnim('par',[_poke20]);
break;
case'frz':
this.scene.resultAnim(_poke20,'Frozen','frz');
this.scene.runStatusAnim('frz',[_poke20]);
break;
default:
this.scene.updateStatbar(_poke20);
break;}

this.log(args,kwArgs);
break;
}
case'-curestatus':{
var _poke21=this.getPokemon(args[1]);
var _effect8=Dex.getEffect(kwArgs.from);

if(_effect8.id){
switch(_effect8.id){
case'flamewheel':
case'flareblitz':
case'fusionflare':
case'sacredfire':
case'scald':
case'steameruption':
kwArgs.thaw='.';
break;}

}
if(_poke21){
_poke21.status='';
switch(args[2]){
case'brn':
this.scene.resultAnim(_poke21,'Burn cured','good');
break;
case'tox':
case'psn':
_poke21.statusData.toxicTurns=0;
this.scene.resultAnim(_poke21,'Poison cured','good');
break;
case'slp':
this.scene.resultAnim(_poke21,'Woke up','good');
_poke21.statusData.sleepTurns=0;
break;
case'par':
this.scene.resultAnim(_poke21,'Paralysis cured','good');
break;
case'frz':
this.scene.resultAnim(_poke21,'Thawed','good');
break;
default:
_poke21.removeVolatile('confusion');
this.scene.resultAnim(_poke21,'Cured','good');}

}
this.log(args,kwArgs);
break;

}
case'-cureteam':{
var _poke22=this.getPokemon(args[1]);for(var _i17=0,_poke22$side$pokemon=
_poke22.side.pokemon;_i17<_poke22$side$pokemon.length;_i17++){var _target2=_poke22$side$pokemon[_i17];
_target2.status='';
this.scene.updateStatbarIfExists(_target2);
}

this.scene.resultAnim(_poke22,'Team Cured','good');
this.log(args,kwArgs);
break;
}
case'-item':{
var _poke23=this.getPokemon(args[1]);
var item=Dex.getItem(args[2]);
var _effect9=Dex.getEffect(kwArgs.from);
var _ofpoke7=this.getPokemon(kwArgs.of);
_poke23.item=item.name;
_poke23.itemEffect='';
_poke23.removeVolatile('airballoon');
if(item.id==='airballoon')_poke23.addVolatile('airballoon');

if(_effect9.id){
switch(_effect9.id){
case'pickup':
this.activateAbility(_poke23,"Pickup");

case'recycle':
_poke23.itemEffect='found';
this.scene.resultAnim(_poke23,item.name,'neutral');
break;
case'frisk':
this.activateAbility(_ofpoke7,"Frisk");
if(_poke23&&_poke23!==_ofpoke7){
_poke23.itemEffect='frisked';
this.scene.resultAnim(_poke23,item.name,'neutral');
}
break;
case'magician':
case'pickpocket':
this.activateAbility(_poke23,_effect9.name);

case'thief':
case'covet':

_ofpoke7.item='';
_ofpoke7.itemEffect='';
_ofpoke7.prevItem=item.name;
_ofpoke7.prevItemEffect='stolen';
_ofpoke7.addVolatile('itemremoved');
_poke23.itemEffect='stolen';
this.scene.resultAnim(_poke23,item.name,'neutral');
this.scene.resultAnim(_ofpoke7,'Item Stolen','bad');
break;
case'harvest':
_poke23.itemEffect='harvested';
this.activateAbility(_poke23,"Harvest");
this.scene.resultAnim(_poke23,item.name,'neutral');
break;
case'bestow':
_poke23.itemEffect='bestowed';
this.scene.resultAnim(_poke23,item.name,'neutral');
break;
case'trick':
_poke23.itemEffect='tricked';

default:
break;}

}else{
switch(item.id){
case'airballoon':
this.scene.resultAnim(_poke23,'Balloon','good');
break;}

}
this.log(args,kwArgs);
break;
}
case'-enditem':{
var _poke24=this.getPokemon(args[1]);
var _item2=Dex.getItem(args[2]);
var _effect10=Dex.getEffect(kwArgs.from);
_poke24.item='';
_poke24.itemEffect='';
_poke24.prevItem=_item2.name;
_poke24.prevItemEffect='';
_poke24.removeVolatile('airballoon');
_poke24.addVolatile('itemremoved');
if(kwArgs.eat){
_poke24.prevItemEffect='eaten';
this.scene.runOtherAnim('consume',[_poke24]);
this.lastMove=_item2.id;
}else if(kwArgs.weaken){
_poke24.prevItemEffect='eaten';
this.lastMove=_item2.id;
}else if(_effect10.id){
switch(_effect10.id){
case'fling':
_poke24.prevItemEffect='flung';
break;
case'knockoff':
_poke24.prevItemEffect='knocked off';
this.scene.runOtherAnim('itemoff',[_poke24]);
this.scene.resultAnim(_poke24,'Item knocked off','neutral');
break;
case'stealeat':
_poke24.prevItemEffect='stolen';
break;
case'gem':
_poke24.prevItemEffect='consumed';
break;
case'incinerate':
_poke24.prevItemEffect='incinerated';
break;}

}else{
switch(_item2.id){
case'airballoon':
_poke24.prevItemEffect='popped';
_poke24.removeVolatile('airballoon');
this.scene.resultAnim(_poke24,'Balloon popped','neutral');
break;
case'focussash':
_poke24.prevItemEffect='consumed';
this.scene.resultAnim(_poke24,'Sash','neutral');
break;
case'focusband':
this.scene.resultAnim(_poke24,'Focus Band','neutral');
break;
case'redcard':
_poke24.prevItemEffect='held up';
break;
default:
_poke24.prevItemEffect='consumed';
break;}

}
this.log(args,kwArgs);
break;
}
case'-ability':{
var _poke25=this.getPokemon(args[1]);
var ability=Dex.getAbility(args[2]);
var _effect11=Dex.getEffect(kwArgs.from);
var _ofpoke8=this.getPokemon(kwArgs.of);
_poke25.rememberAbility(ability.name,_effect11.id&&!kwArgs.fail);

if(kwArgs.silent){

}else if(_effect11.id){
switch(_effect11.id){
case'trace':
this.activateAbility(_poke25,"Trace");
this.scene.wait(500);
this.activateAbility(_poke25,ability.name,true);
_ofpoke8.rememberAbility(ability.name);
break;
case'powerofalchemy':
case'receiver':
this.activateAbility(_poke25,_effect11.name);
this.scene.wait(500);
this.activateAbility(_poke25,ability.name,true);
_ofpoke8.rememberAbility(ability.name);
break;
case'roleplay':
this.activateAbility(_poke25,ability.name,true);
_ofpoke8.rememberAbility(ability.name);
break;
case'desolateland':
case'primordialsea':
case'deltastream':
if(kwArgs.fail){
this.activateAbility(_poke25,ability.name);
}
break;
default:
this.activateAbility(_poke25,ability.name);
break;}

}else{
this.activateAbility(_poke25,ability.name);
}
this.log(args,kwArgs);
break;
}
case'-endability':{


var _poke26=this.getPokemon(args[1]);
var _ability=Dex.getAbility(args[2]);
_poke26.ability='(suppressed)';

if(_ability.id){
if(!_poke26.baseAbility)_poke26.baseAbility=_ability.name;
}
this.log(args,kwArgs);
break;
}
case'detailschange':{
var _poke27=this.getPokemon(args[1]);
_poke27.removeVolatile('formechange');
_poke27.removeVolatile('typeadd');
_poke27.removeVolatile('typechange');

var newSpecies=args[2];
var commaIndex=newSpecies.indexOf(',');
if(commaIndex!==-1){
var level=newSpecies.substr(commaIndex+1).trim();
if(level.charAt(0)==='L'){
_poke27.level=parseInt(level.substr(1),10);
}
newSpecies=args[2].substr(0,commaIndex);
}
var template=Dex.getTemplate(newSpecies);

_poke27.species=newSpecies;
_poke27.ability=_poke27.baseAbility=template.abilities?template.abilities['0']:'';
_poke27.weightkg=template.weightkg;

_poke27.details=args[2];
_poke27.searchid=args[1].substr(0,2)+args[1].substr(3)+'|'+args[2];

this.scene.animTransform(_poke27,true,true);
this.log(args,kwArgs);
break;
}
case'-transform':{
var _poke28=this.getPokemon(args[1]);
var tpoke=this.getPokemon(args[2]);
var _effect12=Dex.getEffect(kwArgs.from);
if(_poke28===tpoke)throw new Error("Transforming into self");

if(!kwArgs.silent){
this.activateAbility(_poke28,_effect12);
}

_poke28.boosts=Object.assign({},tpoke.boosts);
_poke28.copyTypesFrom(tpoke);
_poke28.weightkg=tpoke.weightkg;
_poke28.ability=tpoke.ability;
var species=tpoke.volatiles.formechange?tpoke.volatiles.formechange[1]:tpoke.species;
var pokemon=tpoke;
var shiny=tpoke.shiny;
var gender=tpoke.gender;
_poke28.addVolatile('transform',pokemon,shiny,gender);
_poke28.addVolatile('formechange',species);for(var _i18=0,_tpoke$moveTrack=
tpoke.moveTrack;_i18<_tpoke$moveTrack.length;_i18++){var _trackedMove=_tpoke$moveTrack[_i18];
_poke28.rememberMove(_trackedMove[0],0);
}
this.scene.animTransform(_poke28);
this.scene.resultAnim(_poke28,'Transformed','good');
this.log(['-transform',args[1],args[2],tpoke.species],kwArgs);
break;
}
case'-formechange':{
var _poke29=this.getPokemon(args[1]);
var _template=Dex.getTemplate(args[2]);
var _fromeffect2=Dex.getEffect(kwArgs.from);
var isCustomAnim=false;
_poke29.removeVolatile('typeadd');
_poke29.removeVolatile('typechange');
if(this.gen>=7)_poke29.removeVolatile('autotomize');

if(!kwArgs.silent){
this.activateAbility(_poke29,_fromeffect2);
}
_poke29.addVolatile('formechange',_template.species);
this.scene.animTransform(_poke29,isCustomAnim);
this.log(args,kwArgs);
break;
}
case'-mega':{
var _poke30=this.getPokemon(args[1]);
var _item3=Dex.getItem(args[3]);
if(args[3]){
_poke30.item=_item3.name;
}
this.log(args,kwArgs);
break;
}
case'-primal':case'-burst':{
this.log(args,kwArgs);
break;
}
case'-start':{
var _poke31=this.getPokemon(args[1]);
var _effect13=Dex.getEffect(args[2]);
var _ofpoke9=this.getPokemon(kwArgs.of);
var _fromeffect3=Dex.getEffect(kwArgs.from);

this.activateAbility(_poke31,_effect13);
this.activateAbility(_ofpoke9||_poke31,_fromeffect3);
switch(_effect13.id){
case'typechange':
if(_ofpoke9&&_fromeffect3.id==='reflecttype'){
_poke31.copyTypesFrom(_ofpoke9);
}else{
var types=Dex.sanitizeName(args[3]||'???');
_poke31.removeVolatile('typeadd');
_poke31.addVolatile('typechange',types);
if(!kwArgs.silent){
this.scene.typeAnim(_poke31,types);
}
}
this.scene.updateStatbar(_poke31);
break;
case'typeadd':
var type=Dex.sanitizeName(args[3]);
_poke31.addVolatile('typeadd',type);
if(kwArgs.silent)break;
this.scene.typeAnim(_poke31,type);
break;
case'powertrick':
this.scene.resultAnim(_poke31,'Power Trick','neutral');
break;
case'foresight':
case'miracleeye':
this.scene.resultAnim(_poke31,'Identified','bad');
break;
case'telekinesis':
this.scene.resultAnim(_poke31,'Telekinesis','neutral');
break;
case'confusion':
if(!kwArgs.already){
this.scene.runStatusAnim('confused',[_poke31]);
this.scene.resultAnim(_poke31,'Confused','bad');
}
break;
case'leechseed':
this.scene.updateStatbar(_poke31);
break;
case'healblock':
this.scene.resultAnim(_poke31,'Heal Block','bad');
break;
case'yawn':
this.scene.resultAnim(_poke31,'Drowsy','slp');
break;
case'taunt':
this.scene.resultAnim(_poke31,'Taunted','bad');
break;
case'imprison':
this.scene.resultAnim(_poke31,'Imprisoning','good');
case'disable':
this.scene.resultAnim(_poke31,'Disabled','bad');
break;
case'embargo':
this.scene.resultAnim(_poke31,'Embargo','bad');
break;
case'torment':
this.scene.resultAnim(_poke31,'Tormented','bad');
break;
case'ingrain':
this.scene.resultAnim(_poke31,'Ingrained','good');
break;
case'aquaring':
this.scene.resultAnim(_poke31,'Aqua Ring','good');
break;
case'stockpile1':
this.scene.resultAnim(_poke31,'Stockpile','good');
break;
case'stockpile2':
_poke31.removeVolatile('stockpile1');
this.scene.resultAnim(_poke31,'Stockpile&times;2','good');
break;
case'stockpile3':
_poke31.removeVolatile('stockpile2');
this.scene.resultAnim(_poke31,'Stockpile&times;3','good');
break;
case'perish0':
_poke31.removeVolatile('perish1');
break;
case'perish1':
_poke31.removeVolatile('perish2');
this.scene.resultAnim(_poke31,'Perish next turn','bad');
break;
case'perish2':
_poke31.removeVolatile('perish3');
this.scene.resultAnim(_poke31,'Perish in 2','bad');
break;
case'perish3':
if(!kwArgs.silent)this.scene.resultAnim(_poke31,'Perish in 3','bad');
break;
case'encore':
this.scene.resultAnim(_poke31,'Encored','bad');
break;
case'bide':
this.scene.resultAnim(_poke31,'Bide','good');
break;
case'attract':
this.scene.resultAnim(_poke31,'Attracted','bad');
break;
case'autotomize':
this.scene.resultAnim(_poke31,'Lightened','good');
break;
case'focusenergy':
this.scene.resultAnim(_poke31,'+Crit rate','good');
break;
case'curse':
this.scene.resultAnim(_poke31,'Cursed','bad');
break;
case'nightmare':
this.scene.resultAnim(_poke31,'Nightmare','bad');
break;
case'magnetrise':
this.scene.resultAnim(_poke31,'Magnet Rise','good');
break;
case'smackdown':
this.scene.resultAnim(_poke31,'Smacked Down','bad');
_poke31.removeVolatile('magnetrise');
_poke31.removeVolatile('telekinesis');
if(_poke31.lastMove==='fly'||_poke31.lastMove==='bounce')this.scene.animReset(_poke31);
break;
case'substitute':
if(kwArgs.damage){
this.scene.resultAnim(_poke31,'Damage','bad');
}else if(kwArgs.block){
this.scene.resultAnim(_poke31,'Blocked','neutral');
}
break;


case'lightscreen':
this.scene.resultAnim(_poke31,'Light Screen','good');
break;
case'reflect':
this.scene.resultAnim(_poke31,'Reflect','good');
break;}

_poke31.addVolatile(_effect13.id);
this.scene.updateStatbar(_poke31);
this.log(args,kwArgs);
break;
}
case'-end':{
var _poke32=this.getPokemon(args[1]);
var _effect14=Dex.getEffect(args[2]);
var _fromeffect4=Dex.getEffect(kwArgs.from);
_poke32.removeVolatile(_effect14.id);

if(kwArgs.silent){

}else{
switch(_effect14.id){
case'powertrick':
this.scene.resultAnim(_poke32,'Power Trick','neutral');
break;
case'telekinesis':
this.scene.resultAnim(_poke32,'Telekinesis&nbsp;ended','neutral');
break;
case'skydrop':
if(kwArgs.interrupt){
this.scene.anim(_poke32,{time:100});
}
break;
case'confusion':
this.scene.resultAnim(_poke32,'Confusion&nbsp;ended','good');
break;
case'leechseed':
if(_fromeffect4.id==='rapidspin'){
this.scene.resultAnim(_poke32,'De-seeded','good');
}
break;
case'healblock':
this.scene.resultAnim(_poke32,'Heal Block ended','good');
break;
case'attract':
this.scene.resultAnim(_poke32,'Attract&nbsp;ended','good');
break;
case'taunt':
this.scene.resultAnim(_poke32,'Taunt&nbsp;ended','good');
break;
case'disable':
this.scene.resultAnim(_poke32,'Disable&nbsp;ended','good');
break;
case'embargo':
this.scene.resultAnim(_poke32,'Embargo ended','good');
break;
case'torment':
this.scene.resultAnim(_poke32,'Torment&nbsp;ended','good');
break;
case'encore':
this.scene.resultAnim(_poke32,'Encore&nbsp;ended','good');
break;
case'bide':
this.scene.runOtherAnim('bideunleash',[_poke32]);
break;
case'illusion':
this.scene.resultAnim(_poke32,'Illusion ended','bad');
_poke32.rememberAbility('Illusion');
break;
case'slowstart':
this.scene.resultAnim(_poke32,'Slow Start ended','good');
break;
case'perishsong':
_poke32.removeVolatile('perish3');
break;
case'substitute':
this.scene.resultAnim(_poke32,'Faded','bad');
break;
case'stockpile':
_poke32.removeVolatile('stockpile1');
_poke32.removeVolatile('stockpile2');
_poke32.removeVolatile('stockpile3');
break;
default:
if(_effect14.effectType==='Move'){
if(_effect14.name==='Doom Desire'){
this.scene.runOtherAnim('doomdesirehit',[_poke32]);
}
if(_effect14.name==='Future Sight'){
this.scene.runOtherAnim('futuresighthit',[_poke32]);
}
}}

}
this.scene.updateStatbar(_poke32);
this.log(args,kwArgs);
break;
}
case'-singleturn':{
var _poke33=this.getPokemon(args[1]);
var _effect15=Dex.getEffect(args[2]);
_poke33.addTurnstatus(_effect15.id);

if(_effect15.id==='roost'&&!_poke33.getTypeList().includes('Flying')){
break;
}
switch(_effect15.id){
case'roost':
this.scene.resultAnim(_poke33,'Landed','neutral');
break;
case'quickguard':
this.scene.resultAnim(_poke33,'Quick Guard','good');
break;
case'wideguard':
this.scene.resultAnim(_poke33,'Wide Guard','good');
break;
case'craftyshield':
this.scene.resultAnim(_poke33,'Crafty Shield','good');
break;
case'matblock':
this.scene.resultAnim(_poke33,'Mat Block','good');
break;
case'protect':
this.scene.resultAnim(_poke33,'Protected','good');
break;
case'endure':
this.scene.resultAnim(_poke33,'Enduring','good');
break;
case'helpinghand':
this.scene.resultAnim(_poke33,'Helping Hand','good');
break;
case'focuspunch':
this.scene.resultAnim(_poke33,'Focusing','neutral');
_poke33.rememberMove(_effect15.name,0);
break;
case'shelltrap':
this.scene.resultAnim(_poke33,'Trap set','neutral');
_poke33.rememberMove(_effect15.name,0);
break;
case'beakblast':
this.scene.runOtherAnim('bidecharge',[_poke33]);
this.scene.resultAnim(_poke33,'Beak Blast','neutral');
break;}

this.scene.updateStatbar(_poke33);
this.log(args,kwArgs);
break;
}
case'-singlemove':{
var _poke34=this.getPokemon(args[1]);
var _effect16=Dex.getEffect(args[2]);
_poke34.addMovestatus(_effect16.id);

switch(_effect16.id){
case'grudge':
this.scene.resultAnim(_poke34,'Grudge','neutral');
break;
case'destinybond':
this.scene.resultAnim(_poke34,'Destiny Bond','neutral');
break;}

this.log(args,kwArgs);
break;
}
case'-activate':{
var _poke35=this.getPokemon(args[1]);
var _effect17=Dex.getEffect(args[2]);
var _target3=this.getPokemon(args[3]);
this.activateAbility(_poke35,_effect17);
switch(_effect17.id){
case'grudge':
_poke35.rememberMove(kwArgs.move,Infinity);
break;
case'substitute':
if(kwArgs.damage){
this.scene.resultAnim(_poke35,'Damage','bad');
}else if(kwArgs.block){
this.scene.resultAnim(_poke35,'Blocked','neutral');
}
break;
case'attract':
this.scene.runStatusAnim('attracted',[_poke35]);
break;
case'bide':
this.scene.runOtherAnim('bidecharge',[_poke35]);
break;


case'aromatherapy':
this.scene.resultAnim(_poke35,'Team Cured','good');
break;
case'healbell':
this.scene.resultAnim(_poke35,'Team Cured','good');
break;
case'brickbreak':
_target3.side.removeSideCondition('Reflect');
_target3.side.removeSideCondition('LightScreen');
break;
case'hyperspacefury':
case'hyperspacehole':
case'phantomforce':
case'shadowforce':
case'feint':
this.scene.resultAnim(_poke35,'Protection broken','bad');
_poke35.removeTurnstatus('protect');for(var _i19=0,_poke35$side$pokemon=
_poke35.side.pokemon;_i19<_poke35$side$pokemon.length;_i19++){var curTarget=_poke35$side$pokemon[_i19];
curTarget.removeTurnstatus('wideguard');
curTarget.removeTurnstatus('quickguard');
curTarget.removeTurnstatus('craftyshield');
curTarget.removeTurnstatus('matblock');
this.scene.updateStatbar(curTarget);
}
break;
case'spite':
var move=Dex.getMove(kwArgs.move).name;
var pp=Number(kwArgs.number);
if(isNaN(pp))pp=4;
_poke35.rememberMove(move,pp);
break;
case'gravity':
_poke35.removeVolatile('magnetrise');
_poke35.removeVolatile('telekinesis');
this.scene.anim(_poke35,{time:100});
break;
case'skillswap':
if(this.gen<=4)break;
var pokeability=Dex.sanitizeName(kwArgs.ability)||_target3.ability;
var targetability=Dex.sanitizeName(kwArgs.ability2)||_poke35.ability;
if(pokeability){
_poke35.ability=pokeability;
if(!_target3.baseAbility)_target3.baseAbility=pokeability;
}
if(targetability){
_target3.ability=targetability;
if(!_poke35.baseAbility)_poke35.baseAbility=targetability;
}
if(_poke35.side!==_target3.side){
this.activateAbility(_poke35,pokeability,true);
this.activateAbility(_target3,targetability,true);
}
break;


case'forewarn':
if(_target3){
_target3.rememberMove(kwArgs.move,0);
}else{
var foeActive=[];for(var _i20=0,_poke35$side$foe$acti=
_poke35.side.foe.active;_i20<_poke35$side$foe$acti.length;_i20++){var maybeTarget=_poke35$side$foe$acti[_i20];
if(maybeTarget&&!maybeTarget.fainted)foeActive.push(maybeTarget);
}
if(foeActive.length===1){
foeActive[0].rememberMove(kwArgs.move,0);
}
}
break;
case'mummy':
if(!kwArgs.ability)break;
var _ability2=Dex.getAbility(kwArgs.ability);
this.activateAbility(_target3,_ability2.name);
this.activateAbility(_poke35,"Mummy");
this.scene.wait(700);
this.activateAbility(_target3,"Mummy",true);
break;


case'leppaberry':
case'mysteryberry':
_poke35.rememberMove(kwArgs.move,_effect17.id==='leppaberry'?-10:-5);
break;
case'focusband':
_poke35.item='Focus Band';
break;
default:
if(kwArgs.broken){
this.scene.resultAnim(_poke35,'Protection broken','bad');
}}

this.log(args,kwArgs);
break;
}
case'-sidestart':{
var _side=this.getSide(args[1]);
var _effect18=Dex.getEffect(args[2]);
_side.addSideCondition(_effect18);

switch(_effect18.id){
case'tailwind':
case'auroraveil':
case'reflect':
case'lightscreen':
case'safeguard':
case'mist':
this.scene.updateWeather();
break;}

this.log(args,kwArgs);
break;
}
case'-sideend':{
var _side2=this.getSide(args[1]);
var _effect19=Dex.getEffect(args[2]);


_side2.removeSideCondition(_effect19.name);
this.log(args,kwArgs);
break;
}
case'-weather':{
var _effect20=Dex.getEffect(args[1]);
var _poke36=this.getPokemon(kwArgs.of)||undefined;
var _ability3=Dex.getEffect(kwArgs.from);
if(!_effect20.id||_effect20.id==='none'){
kwArgs.from=this.weather;
}
this.changeWeather(_effect20.name,_poke36,!!kwArgs.upkeep,_ability3);
this.log(args,kwArgs);
break;
}
case'-fieldstart':{
var _effect21=Dex.getEffect(args[1]);
var _poke37=this.getPokemon(kwArgs.of);
var _fromeffect5=Dex.getEffect(kwArgs.from);
this.activateAbility(_poke37,_fromeffect5);
var maxTimeLeft=0;
if(['electricterrain','grassyterrain','mistyterrain','psychicterrain'].includes(_effect21.id)){
for(var i=this.pseudoWeather.length-1;i>=0;i--){
var pwName=this.pseudoWeather[i][0];
if(pwName==='Electric Terrain'||pwName==='Grassy Terrain'||pwName==='Misty Terrain'||pwName==='Psychic Terrain'){
this.pseudoWeather.splice(i,1);
continue;
}
}
if(this.gen>6)maxTimeLeft=8;
}
this.addPseudoWeather(_effect21.name,5,maxTimeLeft);

switch(_effect21.id){
case'gravity':
if(!this.fastForward){for(var _i21=0,_this$sides5=
this.sides;_i21<_this$sides5.length;_i21++){var _side3=_this$sides5[_i21];for(var _i22=0,_side3$active=
_side3.active;_i22<_side3$active.length;_i22++){var _active=_side3$active[_i22];
if(_active)this.scene.runOtherAnim('gravity',[_active]);
}
}
}
break;}

this.log(args,kwArgs);
break;
}
case'-fieldend':{
var _effect22=Dex.getEffect(args[1]);

this.removePseudoWeather(_effect22.name);
this.log(args,kwArgs);
break;
}
case'-fieldactivate':{
var _effect23=Dex.getEffect(args[1]);
switch(_effect23.id){
case'perishsong':
this.scene.updateStatbars();
break;}

this.log(args,kwArgs);
break;
}
case'-anim':{
var _poke38=this.getPokemon(args[1]);
var _move=Dex.getMove(args[2]);
if(this.checkActive(_poke38))return;
var _poke39=this.getPokemon(args[3]);
this.scene.beforeMove(_poke38);
this.animateMove(_poke38,_move,_poke39,kwArgs);
this.scene.afterMove(_poke38);
break;
}
case'-hint':case'-message':{
this.log(args,kwArgs);
break;
}
default:{
if(this.errorCallback)this.errorCallback(this);
break;
}}
};_proto3.































parseDetails=function parseDetails(name,pokemonid){var details=arguments.length>2&&arguments[2]!==undefined?arguments[2]:"";var output=arguments.length>3&&arguments[3]!==undefined?arguments[3]:{};
output.details=details;
output.name=name;
output.species=name;
output.level=100;
output.shiny=false;
output.gender='';
output.ident=name?pokemonid:'';
output.searchid=name?pokemonid+'|'+details:'';
var splitDetails=details.split(', ');
if(splitDetails[splitDetails.length-1]==='shiny'){
output.shiny=true;
splitDetails.pop();
}
if(splitDetails[splitDetails.length-1]==='M'||splitDetails[splitDetails.length-1]==='F'){
output.gender=splitDetails[splitDetails.length-1];
splitDetails.pop();
}
if(splitDetails[1]){
output.level=parseInt(splitDetails[1].substr(1),10)||100;
}
if(splitDetails[0]){
output.species=splitDetails[0];
}
return output;
};_proto3.
parseHealth=function parseHealth(hpstring)





{var output=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var _hpstring$split=
hpstring.split(' '),hp=_hpstring$split[0],status=_hpstring$split[1];


output.hpcolor='';
if(hp==='0'||hp==='0.0'){
if(!output.maxhp)output.maxhp=100;
output.hp=0;
}else if(hp.indexOf('/')>0){var _hp$split=
hp.split('/'),curhp=_hp$split[0],_maxhp=_hp$split[1];
if(isNaN(parseFloat(curhp))||isNaN(parseFloat(_maxhp))){
return null;
}
output.hp=parseFloat(curhp);
output.maxhp=parseFloat(_maxhp);
if(output.hp>output.maxhp)output.hp=output.maxhp;
var colorchar=_maxhp.slice(-1);
if(colorchar==='y'||colorchar==='g'){
output.hpcolor=colorchar;
}
}else if(!isNaN(parseFloat(hp))){
if(!output.maxhp)output.maxhp=100;
output.hp=output.maxhp*parseFloat(hp)/100;
}


if(!status){
output.status='';
}else if(status==='par'||status==='brn'||status==='slp'||status==='frz'||status==='tox'){
output.status=status;
}else if(status==='psn'&&output.status!=='tox'){
output.status=status;
}else if(status==='fnt'){
output.hp=0;
output.fainted=true;
}
return output;
};_proto3.
parsePokemonId=function parsePokemonId(pokemonid){
var name=pokemonid;

var siden=-1;
var slot=-1;
var slotChart={a:0,b:1,c:2,d:3,e:4,f:5};
if(name.substr(0,4)==='p2: '||name==='p2'){
siden=this.p2.n;
name=name.substr(4);
}else if(name.substr(0,4)==='p1: '||name==='p1'){
siden=this.p1.n;
name=name.substr(4);
}else if(name.substr(0,2)==='p2'&&name.substr(3,2)===': '){
slot=slotChart[name.substr(2,1)];
siden=this.p2.n;
name=name.substr(5);
pokemonid='p2: '+name;
}else if(name.substr(0,2)==='p1'&&name.substr(3,2)===': '){
slot=slotChart[name.substr(2,1)];
siden=this.p1.n;
name=name.substr(5);
pokemonid='p1: '+name;
}
return{name:name,siden:siden,slot:slot,pokemonid:pokemonid};
};_proto3.
getPokemon=function getPokemon(pokemonid,details){
var isNew=false;
var isSwitch=false;
var isInactive=false;
var createIfNotFound=false;

if(pokemonid===undefined||pokemonid==='??')return null;
if(pokemonid.substr(0,5)==='new: '){
pokemonid=pokemonid.substr(5);
isNew=true;
createIfNotFound=true;
}
if(pokemonid.substr(0,10)==='switchin: '){
pokemonid=pokemonid.substr(10);
isSwitch=true;
createIfNotFound=true;
}
var parseIdResult=this.parsePokemonId(pokemonid);var
name=parseIdResult.name,siden=parseIdResult.siden,slot=parseIdResult.slot;
pokemonid=parseIdResult.pokemonid;

if(!details){
if(siden<0)return null;
if(this.sides[siden].active[slot])return this.sides[siden].active[slot];
if(slot>=0)isInactive=true;
}

var searchid='';
if(details)searchid=pokemonid+'|'+details;


if(siden!==this.p2.n&&!isNew){
var active=this.p1.active[slot];
if(active&&active.searchid===searchid&&!isSwitch){
active.slot=slot;
return active;
}
for(var i=0;i<this.p1.pokemon.length;i++){
var _pokemon=this.p1.pokemon[i];
if(_pokemon.fainted&&(isNew||isSwitch))continue;
if(isSwitch||isInactive){
if(this.p1.active.indexOf(_pokemon)>=0)continue;
}
if(isSwitch&&_pokemon===this.p1.lastPokemon&&!this.p1.active[slot])continue;
if(searchid&&_pokemon.searchid===searchid||
!searchid&&_pokemon.ident===pokemonid){
if(slot>=0)_pokemon.slot=slot;
return _pokemon;
}
if(!_pokemon.searchid&&_pokemon.checkDetails(details)){
_pokemon=this.p1.newPokemon(this.parseDetails(name,pokemonid,details),i);
if(slot>=0)_pokemon.slot=slot;
return _pokemon;
}
}
}


if(siden!==this.p1.n&&!isNew){
var _active2=this.p2.active[slot];
if(_active2&&_active2.searchid===searchid&&!isSwitch){
if(slot>=0)_active2.slot=slot;
return _active2;
}
for(var _i23=0;_i23<this.p2.pokemon.length;_i23++){
var _pokemon2=this.p2.pokemon[_i23];
if(_pokemon2.fainted&&(isNew||isSwitch))continue;
if(isSwitch||isInactive){
if(this.p2.active.indexOf(_pokemon2)>=0)continue;
}
if(isSwitch&&_pokemon2===this.p2.lastPokemon&&!this.p2.active[slot])continue;
if(searchid&&_pokemon2.searchid===searchid||
!searchid&&_pokemon2.ident===pokemonid){
if(slot>=0)_pokemon2.slot=slot;
return _pokemon2;
}
if(!_pokemon2.searchid&&_pokemon2.checkDetails(details)){
_pokemon2=this.p2.newPokemon(this.parseDetails(name,pokemonid,details),_i23);
if(slot>=0)_pokemon2.slot=slot;
return _pokemon2;
}
}
}

if(!details||!createIfNotFound)return null;



if(siden<0)throw new Error("Invalid pokemonid passed to getPokemon");

var species=name;
var gender='';
var level=100;
var shiny=false;
if(details){
var splitDetails=details.split(', ');
if(splitDetails[splitDetails.length-1]==='shiny'){
shiny=true;
splitDetails.pop();
}
if(splitDetails[splitDetails.length-1]==='M'||splitDetails[splitDetails.length-1]==='F'){
gender=splitDetails[splitDetails.length-1];
splitDetails.pop();
}
if(splitDetails[1]){
level=parseInt(splitDetails[1].substr(1),10)||100;
}
if(splitDetails[0]){
species=splitDetails[0];
}
}
if(slot<0)slot=0;
var pokemon=this.sides[siden].newPokemon({
species:species,
details:details,
name:name,
ident:name?pokemonid:'',
searchid:name?pokemonid+'|'+details:'',
level:level,
gender:gender,
shiny:shiny,
slot:slot},
isNew?-2:-1);
return pokemon;
};_proto3.
getSide=function getSide(sidename){
if(sidename==='p1'||sidename.substr(0,3)==='p1:')return this.p1;
if(sidename==='p2'||sidename.substr(0,3)==='p2:')return this.p2;
if(this.mySide.id===sidename)return this.mySide;
if(this.yourSide.id===sidename)return this.yourSide;
if(this.mySide.name===sidename)return this.mySide;
if(this.yourSide.name===sidename)return this.yourSide;
return{
name:sidename,
id:sidename.replace(/ /g,'')};

};_proto3.

add=function add(command,fastForward){
if(command)this.activityQueue.push(command);

if(this.playbackState===Playback.Uninitialized){
this.playbackState=Playback.Ready;
}else if(this.playbackState===Playback.Finished){
this.playbackState=Playback.Playing;
this.paused=false;
this.scene.soundStart();
if(fastForward){
this.fastForwardTo(-1);
}else{
this.nextActivity();
}
}
};_proto3.








instantAdd=function instantAdd(command){
this.run(command,true);
this.preemptActivityQueue.push(command);
this.add(command);
};_proto3.
runMajor=function runMajor(args,kwArgs,preempt){
switch(args[0]){
case'start':{
this.scene.teamPreviewEnd();
this.mySide.active[0]=null;
this.yourSide.active[0]=null;
this.start();
break;
}
case'upkeep':{
this.usesUpkeep=true;
this.updatePseudoWeatherLeft();
this.updateToxicTurns();
break;
}
case'turn':{
this.setTurn(args[1]);
this.log(args);
break;
}
case'tier':{
this.tier=args[1];
if(this.tier.slice(-13)==='Random Battle'){
this.speciesClause=true;
}
this.log(args);
break;
}
case'gametype':{
this.gameType=args[1];
switch(args[1]){
default:
this.mySide.active=[null];
this.yourSide.active=[null];
break;
case'doubles':
this.mySide.active=[null,null];
this.yourSide.active=[null,null];
break;
case'triples':
case'rotation':
this.mySide.active=[null,null,null];
this.yourSide.active=[null,null,null];
break;}

this.scene.updateGen();
break;
}
case'rule':{
var ruleName=args[1].split(': ')[0];
if(ruleName==='Species Clause')this.speciesClause=true;
this.log(args);
break;
}
case'rated':{
this.rated=args[1]||true;
this.scene.updateGen();
this.log(args);
break;
}
case'inactive':{
if(!this.kickingInactive)this.kickingInactive=true;
if(args[1].slice(0,11)==="Time left: "){var _args$1$split=
args[1].split(' | '),time=_args$1$split[0],totalTime=_args$1$split[1],graceTime=_args$1$split[2];
this.kickingInactive=parseInt(time.slice(11),10)||true;
this.totalTimeLeft=parseInt(totalTime,10);
this.graceTimeLeft=parseInt(graceTime||'',10)||0;
if(this.totalTimeLeft===this.kickingInactive)this.totalTimeLeft=0;
return;
}else if(args[1].slice(0,9)==="You have "){



this.kickingInactive=parseInt(args[1].slice(9),10)||true;
return;
}else if(args[1].slice(-14)===' seconds left.'){
var hasIndex=args[1].indexOf(' has ');
var userid=window.app&&app.user&&app.user.get('userid');
if(toId(args[1].slice(0,hasIndex))===userid){
this.kickingInactive=parseInt(args[1].slice(hasIndex+5),10)||true;
}
}
this.log(args,undefined,preempt);
break;
}
case'inactiveoff':{
this.kickingInactive=false;
this.log(args,undefined,preempt);
break;
}
case'join':case'j':{
if(this.roomid){
var room=app.rooms[this.roomid];
var user=args[1];
var _userid=toUserid(user);
if(/^[a-z0-9]/i.test(user))user=' '+user;
if(!room.users[_userid])room.userCount.users++;
room.users[_userid]=user;
room.userList.add(_userid);
room.userList.updateUserCount();
room.userList.updateNoUsersOnline();
}
if(!this.ignoreSpects){
this.log(args,undefined,preempt);
}
break;
}
case'leave':case'l':{
if(this.roomid){
var _room=app.rooms[this.roomid];
var _user=args[1];
var _userid2=toUserid(_user);
if(_room.users[_userid2])_room.userCount.users--;
delete _room.users[_userid2];
_room.userList.remove(_userid2);
_room.userList.updateUserCount();
_room.userList.updateNoUsersOnline();
}
if(!this.ignoreSpects){
this.log(args,undefined,preempt);
}
break;
}
case'player':{
var side=this.getSide(args[1]);
side.setName(args[2]);
if(args[3])side.setAvatar(args[3]);
this.scene.updateSidebar(side);
if(this.joinButtons)this.scene.hideJoinButtons();
this.log(args);
break;
}
case'teamsize':{
var _side4=this.getSide(args[1]);
_side4.totalPokemon=parseInt(args[2],10);
this.scene.updateSidebar(_side4);
break;
}
case'win':case'tie':{
this.winner(args[0]==='tie'?undefined:args[1]);
break;
}
case'prematureend':{
this.prematureEnd();
break;
}
case'clearpoke':{
this.p1.clearPokemon();
this.p2.clearPokemon();
break;
}
case'poke':{
var pokemon=this.getPokemon('new: '+args[1],args[2]);
if(args[3]==='item'){
pokemon.item='(exists)';
}
break;
}
case'teampreview':{
this.teamPreviewCount=parseInt(args[1],10);
this.scene.teamPreview();
break;
}
case'switch':case'drag':case'replace':{
this.endLastTurn();
var poke=this.getPokemon('switchin: '+args[1],args[2]);
var slot=poke.slot;
poke.healthParse(args[3]);
poke.removeVolatile('itemremoved');
if(args[0]==='switch'){
if(poke.side.active[slot]){
poke.side.switchOut(poke.side.active[slot]);
}
poke.side.switchIn(poke);
}else if(args[0]==='replace'){
poke.side.replace(poke);
}else{
poke.side.dragIn(poke);
}
this.log(args,kwArgs);
break;
}
case'faint':{
var _poke40=this.getPokemon(args[1]);
_poke40.side.faint(_poke40);
this.log(args,kwArgs);
break;
}
case'swap':{
if(isNaN(Number(args[2]))){
var _poke41=this.getPokemon(args[1]);
_poke41.side.swapWith(_poke41,this.getPokemon(args[2]),kwArgs);
}else{
var _poke42=this.getPokemon(args[1]);
var targetIndex=parseInt(args[2],10);
if(kwArgs.from){
var target=_poke42.side.active[targetIndex];
if(target)args[2]=target.ident;
}
_poke42.side.swapTo(_poke42,targetIndex,kwArgs);
}
this.log(args,kwArgs);
break;
}
case'move':{
this.endLastTurn();
this.resetTurnsSinceMoved();
var _poke43=this.getPokemon(args[1]);
var move=Dex.getMove(args[2]);
if(this.checkActive(_poke43))return;
var poke2=this.getPokemon(args[3]);
this.scene.beforeMove(_poke43);
this.useMove(_poke43,move,poke2,kwArgs);
this.animateMove(_poke43,move,poke2,kwArgs);
this.log(args,kwArgs);
this.scene.afterMove(_poke43);
break;
}
case'cant':{
this.endLastTurn();
this.resetTurnsSinceMoved();
var _poke44=this.getPokemon(args[1]);
var effect=Dex.getEffect(args[2]);
var _move2=Dex.getMove(args[3]);
this.cantUseMove(_poke44,effect,_move2,kwArgs);
this.log(args,kwArgs);
break;
}
case'gen':{
this.gen=parseInt(args[1],10);
this.scene.updateGen();
this.log(args);
break;
}
case'callback':{
if(this.customCallback)this.customCallback(this,args[1],args.slice(1),kwArgs);
break;
}
case'fieldhtml':{
this.playbackState=Playback.Seeking;
this.scene.setFrameHTML(BattleLog.sanitizeHTML(args[1]));
break;
}
case'controlshtml':{
this.scene.setControlsHTML(BattleLog.sanitizeHTML(args[1]));
break;
}
default:{
this.log(args,kwArgs,preempt);
break;
}}
};_proto3.

run=function run(str,preempt){
if(!preempt&&this.preemptActivityQueue.length&&str===this.preemptActivityQueue[0]){
this.preemptActivityQueue.shift();
this.scene.preemptCatchup();
return;
}
if(!str)return;var _BattleTextParser$par=
BattleTextParser.parseLine(str),args=_BattleTextParser$par.args,kwArgs=_BattleTextParser$par.kwArgs;

if(this.scene.maybeCloseMessagebar(args,kwArgs)){
this.activityStep--;
this.activeMoveIsSpread=null;
return;
}


var nextArgs=[''];
var nextKwargs={};
var nextLine=this.activityQueue[this.activityStep+1]||'';
if(nextLine&&nextLine.substr(0,2)==='|-'){var _BattleTextParser$par2=
BattleTextParser.parseLine(nextLine);nextArgs=_BattleTextParser$par2.args;nextKwargs=_BattleTextParser$par2.kwArgs;
}

if(this.debug){
if(args[0].charAt(0)==='-'||args[0]==='detailschange'){
this.runMinor(args,kwArgs,nextArgs,nextKwargs);
}else{
this.runMajor(args,kwArgs,preempt);
}
}else{
try{
if(args[0].charAt(0)==='-'||args[0]==='detailschange'){
this.runMinor(args,kwArgs,nextArgs,nextKwargs);
}else{
this.runMajor(args,kwArgs,preempt);
}
}catch(e){
this.log(['majorerror','Error parsing: '+str+' ('+e+')']);
if(e.stack){
var stack=(''+e.stack).split('\n');for(var _i24=0;_i24<
stack.length;_i24++){var line=stack[_i24];
if(/\brun\b/.test(line)){
break;
}
this.log(['error',line]);
}
}
if(this.errorCallback)this.errorCallback(this);
}
}

if(this.fastForward>0&&this.fastForward<1){
if(nextLine.substr(0,6)==='|start'){
this.fastForwardOff();
if(this.endCallback)this.endCallback(this);
}
}
};_proto3.
checkActive=function checkActive(poke){
if(!poke.side.active[poke.slot]){

poke.side.replace(poke);
}
return false;
};_proto3.

pause=function pause(){
this.paused=true;
this.playbackState=Playback.Paused;
this.scene.pause();
};_proto3.
play=function play(){
this.paused=false;
this.playbackState=Playback.Playing;
this.scene.resume();
this.nextActivity();
};_proto3.
skipTurn=function skipTurn(){
this.fastForwardTo(this.turn+1);
};_proto3.
fastForwardTo=function fastForwardTo(time){
if(this.fastForward)return;
if(time===0||time==='0'){
time=0.5;
}else{
time=Math.floor(Number(time));
}
if(isNaN(time))return;
if(this.ended&&time>=this.turn+1)return;

if(time<=this.turn&&time!==-1){
var paused=this.paused;
this.reset(true);
if(paused)this.pause();else
this.paused=false;
this.fastForwardWillScroll=true;
}
this.scene.animationOff();
this.playbackState=Playback.Seeking;
this.fastForward=time;
this.nextActivity();
};_proto3.
fastForwardOff=function fastForwardOff(){
this.fastForward=0;
this.scene.animationOn();
this.playbackState=this.paused?Playback.Paused:Playback.Playing;
};_proto3.
nextActivity=function nextActivity(){var _this=this;
this.scene.startAnimations();
var animations;
while(!animations){
this.waitForAnimations=true;
if(this.activityStep>=this.activityQueue.length){
this.fastForwardOff();
if(this.ended){
this.paused=true;
this.scene.soundStop();
}
this.playbackState=Playback.Finished;
if(this.endCallback)this.endCallback(this);
return;
}
if(this.paused&&!this.fastForward)return;
this.run(this.activityQueue[this.activityStep]);
this.activityStep++;
if(this.waitForAnimations===true){
animations=this.scene.finishAnimations();
}else if(this.waitForAnimations==='simult'){
this.scene.timeOffset=0;
}
}

if(this.playbackState===Playback.Paused)return;

var interruptionCount=this.scene.interruptionCount;
animations.done(function(){
if(interruptionCount===_this.scene.interruptionCount){
_this.nextActivity();
}
});
};_proto3.

newBattle=function newBattle(){
this.reset();
this.activityQueue=[];
};_proto3.
setQueue=function setQueue(queue){
this.reset();
this.activityQueue=queue;














this.playbackState=Playback.Ready;
};_proto3.

setMute=function setMute(mute){
BattleSound.setMute(mute);
};return Battle;}();


if(typeof require==='function'){

global.Battle=Battle;
}