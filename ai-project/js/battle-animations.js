var _temp;function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;subClass.__proto__=superClass;}/**
 * Pokemon Showdown Battle Animations
 *
 * There are the specific resource files and scripts for misc animations
 *
 * Licensing note: PS's client has complicated licensing:
 * - The client as a whole is AGPLv3
 * - The battle replay/animation engine (battle-*.ts) by itself is MIT
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */var




















BattleScene=function(){





















































function BattleScene(battle,$frame,$logFrame){this.animating=true;this.acceleration=1;this.gen=7;this.activeCount=1;this.numericId=0;this.$battle=null;this.$options=null;this.$terrain=null;this.$weather=null;this.$bgEffect=null;this.$bg=null;this.$sprite=null;this.$sprites=[null,null];this.$spritesFront=[null,null];this.$stat=null;this.$fx=null;this.$leftbar=null;this.$rightbar=null;this.$turn=null;this.$messagebar=null;this.$delay=null;this.$hiddenMessage=null;this.sideConditions=[{},{}];this.preloadDone=0;this.preloadNeeded=0;this.bgm=null;this.backdropImage='';this.bgmNum=0;this.preloadCache={};this.messagebarOpen=false;this.interruptionCount=1;this.curWeather='';this.curTerrain='';this.timeOffset=0;this.pokemonTimeOffset=0;this.minDelay=0;this.activeAnimations=$();
this.battle=battle;
$frame.addClass('battle');
this.$frame=$frame;
this.log=new BattleLog($logFrame[0],this);
this.log.battleParser.pokemonName=function(pokemonId){
if(!pokemonId)return'';
if(battle.ignoreNicks||battle.ignoreOpponent){
var pokemon=battle.getPokemon(pokemonId);
if(pokemon)return pokemon.species;
}
if(!pokemonId.startsWith('p1')&&!pokemonId.startsWith('p2'))return'???pokemon:'+pokemonId+'???';
if(pokemonId.charAt(3)===':')return pokemonId.slice(4).trim();else
if(pokemonId.charAt(2)===':')return pokemonId.slice(3).trim();
return'???pokemon:'+pokemonId+'???';
};

var numericId=0;
if(battle.id){
numericId=parseInt(battle.id.slice(battle.id.lastIndexOf('-')+1),10);
}
if(!numericId){
numericId=Math.floor(Math.random()*1000000);
}
this.numericId=numericId;

this.preloadEffects();

}var _proto=BattleScene.prototype;_proto.

reset=function reset(){
this.updateGen();




if(this.$options){
this.log.reset();
}else{
this.$options=$('<div class="battle-options"></div>');
$(this.log.elem).prepend(this.$options);
}




this.$frame.empty();
this.$battle=$('<div class="innerbattle"></div>');
this.$frame.append(this.$battle);

this.$bg=$('<div class="backdrop" style="background-image:url('+Dex.resourcePrefix+this.backdropImage+');display:block;opacity:0.8"></div>');
this.$terrain=$('<div class="weather"></div>');
this.$weather=$('<div class="weather"></div>');
this.$bgEffect=$('<div></div>');
this.$sprite=$('<div></div>');

this.$sprites=[$('<div></div>'),$('<div></div>')];
this.$spritesFront=[$('<div></div>'),$('<div></div>')];

this.$sprite.append(this.$sprites[1]);
this.$sprite.append(this.$spritesFront[1]);
this.$sprite.append(this.$spritesFront[0]);
this.$sprite.append(this.$sprites[0]);

this.$stat=$('<div role="complementary" aria-label="Active Pokemon"></div>');
this.$fx=$('<div></div>');
this.$leftbar=$('<div class="leftbar" role="complementary" aria-label="Your Team"></div>');
this.$rightbar=$('<div class="rightbar" role="complementary" aria-label="Opponent\'s Team"></div>');
this.$turn=$('<div></div>');
this.$messagebar=$('<div class="messagebar message"></div>');
this.$delay=$('<div></div>');
this.$hiddenMessage=$('<div class="message" style="position:absolute;display:block;visibility:hidden"></div>');

this.$battle.append(this.$bg);
this.$battle.append(this.$terrain);
this.$battle.append(this.$weather);
this.$battle.append(this.$bgEffect);
this.$battle.append(this.$sprite);
this.$battle.append(this.$stat);
this.$battle.append(this.$fx);
this.$battle.append(this.$leftbar);
this.$battle.append(this.$rightbar);
this.$battle.append(this.$turn);
this.$battle.append(this.$messagebar);
this.$battle.append(this.$delay);
this.$battle.append(this.$hiddenMessage);

if(!this.animating){
this.$battle.append('<div class="seeking"><strong>seeking...</strong></div>');
}

this.messagebarOpen=false;
this.timeOffset=0;
this.pokemonTimeOffset=0;
this.curTerrain='';
this.curWeather='';

this.log.battleParser.perspective=this.battle.sidesSwitched?1:0;
};_proto.

animationOff=function animationOff(){
this.$battle.append('<div class="seeking"><strong>seeking...</strong></div>');
this.stopAnimation();

this.animating=false;
this.$messagebar.empty().css({
opacity:0,
height:0});

};_proto.
stopAnimation=function stopAnimation(){
this.interruptionCount++;
this.$battle.find(':animated').finish();
this.$fx.empty();
};_proto.
animationOn=function animationOn(){
if(this.animating)return;
$.fx.off=false;
this.animating=true;
this.$battle.find('.seeking').remove();
this.updateSidebars();for(var _i=0,_this$battle$sides=
this.battle.sides;_i<_this$battle$sides.length;_i++){var side=_this$battle$sides[_i];for(var _i2=0,_side$pokemon=
side.pokemon;_i2<_side$pokemon.length;_i2++){var pokemon=_side$pokemon[_i2];
pokemon.sprite.reset(pokemon);
}
}
this.updateWeather(true);
this.resetTurn();
this.resetSideConditions();
};_proto.
pause=function pause(){
this.stopAnimation();
this.soundPause();
if(this.battle.resumeButton){
this.$frame.append('<div class="playbutton"><button data-action="resume"><i class="fa fa-play icon-play"></i> Resume</button></div>');
this.$frame.find('div.playbutton button').click(this.battle.resumeButton);
}
};_proto.
resume=function resume(){
this.$frame.find('div.playbutton').remove();
this.soundStart();
};_proto.
wait=function wait(time){
if(!this.animating)return;
this.timeOffset+=time;
};_proto.




addSprite=function addSprite(sprite){
if(sprite.$el)this.$sprites[sprite.siden].append(sprite.$el);
};_proto.
showEffect=function showEffect(effect,start,end,transition,after){
if(typeof effect==='string')effect=BattleEffects[effect];
if(!start.time)start.time=0;
if(!end.time)end.time=start.time+500;
start.time+=this.timeOffset;
end.time+=this.timeOffset;
if(!end.scale&&end.scale!==0&&start.scale)end.scale=start.scale;
if(!end.xscale&&end.xscale!==0&&start.xscale)end.xscale=start.xscale;
if(!end.yscale&&end.yscale!==0&&start.yscale)end.yscale=start.yscale;
end=Object.assign({},start,end);

var startpos=this.pos(start,effect);
var endpos=this.posT(end,effect,transition,start);

var $effect=$('<img src="'+effect.url+'" style="display:block;position:absolute" />');
this.$fx.append($effect);
$effect=this.$fx.children().last();

if(start.time){
$effect.css(Object.assign({},startpos,{opacity:0}));
$effect.delay(start.time).animate({
opacity:startpos.opacity},
1);
}else{
$effect.css(startpos);
}
$effect.animate(endpos,end.time-start.time);
if(after==='fade'){
$effect.animate({
opacity:0},
100);
}
if(after==='explode'){
if(end.scale)end.scale*=3;
if(end.xscale)end.xscale*=3;
if(end.yscale)end.yscale*=3;
end.opacity=0;
var endendpos=this.pos(end,effect);
$effect.animate(endendpos,200);
}
this.waitFor($effect);
};_proto.
backgroundEffect=function backgroundEffect(bg,duration){var opacity=arguments.length>2&&arguments[2]!==undefined?arguments[2]:1;var delay=arguments.length>3&&arguments[3]!==undefined?arguments[3]:0;
var $effect=$('<div class="background"></div>');
$effect.css({
background:bg,
display:'block',
opacity:0});

this.$bgEffect.append($effect);
$effect.delay(delay).animate({
opacity:opacity},
250).delay(duration-250);
$effect.animate({
opacity:0},
250);
};_proto.







pos=function pos(loc,obj){
loc=Object.assign({
x:0,
y:0,
z:0,
scale:1,
opacity:1},
loc);

if(!loc.xscale&&loc.xscale!==0)loc.xscale=loc.scale;
if(!loc.yscale&&loc.yscale!==0)loc.yscale=loc.scale;

var left=210;
var top=245;
var scale=1.5-0.5*(loc.z/200);
if(scale<.1)scale=.1;

left+=(410-190)*(loc.z/200);
top+=(135-245)*(loc.z/200);
left+=Math.floor(loc.x*scale);
top-=Math.floor(loc.y*scale);
var width=Math.floor(obj.w*scale*loc.xscale);
var height=Math.floor(obj.h*scale*loc.yscale);
var hoffset=Math.floor((obj.h-(obj.y||0)*2)*scale*loc.yscale);
left-=Math.floor(width/2);
top-=Math.floor(hoffset/2);

var pos={
left:left,
top:top,
width:width,
height:height,
opacity:loc.opacity};

if(loc.display)pos.display=loc.display;
return pos;
};_proto.





posT=function posT(loc,obj,transition,oldLoc){
var pos=this.pos(loc,obj);
var oldPos=oldLoc?this.pos(oldLoc,obj):null;
var transitionMap={
left:'linear',
top:'linear',
width:'linear',
height:'linear',
opacity:'linear'};

if(transition==='ballistic'){
transitionMap.top=pos.top<oldPos.top?'ballisticUp':'ballisticDown';
}
if(transition==='ballisticUnder'){
transitionMap.top=pos.top<oldPos.top?'ballisticDown':'ballisticUp';
}
if(transition==='ballistic2'){
transitionMap.top=pos.top<oldPos.top?'quadUp':'quadDown';
}
if(transition==='ballistic2Under'){
transitionMap.top=pos.top<oldPos.top?'quadDown':'quadUp';
}
if(transition==='swing'){
transitionMap.left='swing';
transitionMap.top='swing';
transitionMap.width='swing';
transitionMap.height='swing';
}
if(transition==='accel'){
transitionMap.left='quadDown';
transitionMap.top='quadDown';
transitionMap.width='quadDown';
transitionMap.height='quadDown';
}
if(transition==='decel'){
transitionMap.left='quadUp';
transitionMap.top='quadUp';
transitionMap.width='quadUp';
transitionMap.height='quadUp';
}
return{
left:[pos.left,transitionMap.left],
top:[pos.top,transitionMap.top],
width:[pos.width,transitionMap.width],
height:[pos.height,transitionMap.height],
opacity:[pos.opacity,transitionMap.opacity]};

};_proto.

waitFor=function waitFor(elem){
this.activeAnimations=this.activeAnimations.add(elem);
};_proto.

startAnimations=function startAnimations(){
this.$fx.empty();
this.activeAnimations=$();
this.timeOffset=0;
this.minDelay=0;
};_proto.

finishAnimations=function finishAnimations(){
if(this.minDelay||this.timeOffset){
this.$delay.delay(Math.max(this.minDelay,this.timeOffset));
this.activeAnimations=this.activeAnimations.add(this.$delay);
}
if(!this.activeAnimations.length)return undefined;
return this.activeAnimations.promise();
};_proto.




preemptCatchup=function preemptCatchup(){
this.log.preemptCatchup();
};_proto.
message=function message(_message){var _this=this;
if(!this.messagebarOpen){
this.log.addSpacer();
if(this.animating){
this.$messagebar.empty();
this.$messagebar.css({
display:'block',
opacity:0,
height:'auto'});

this.$messagebar.animate({
opacity:1},
this.battle.messageFadeTime/this.acceleration);
}
}
if(this.battle.hardcoreMode&&_message.slice(0,8)==='<small>('){
_message='';
}
if(_message&&this.animating){
this.$hiddenMessage.append('<p></p>');
var $message=this.$hiddenMessage.children().last();
$message.html(_message);
$message.css({
display:'block',
opacity:0});

$message.animate({
height:'hide'},
1,function(){
$message.appendTo(_this.$messagebar);
$message.animate({
height:'show',
'padding-bottom':4,
opacity:1},
_this.battle.messageFadeTime/_this.acceleration);
});
this.waitFor($message);
}
this.messagebarOpen=true;
};_proto.
maybeCloseMessagebar=function maybeCloseMessagebar(args,kwArgs){
if(this.log.battleParser.sectionBreak(args,kwArgs)){
if(!this.messagebarOpen)return false;
this.closeMessagebar();
return true;
}
return false;
};_proto.
closeMessagebar=function closeMessagebar(){
if(this.messagebarOpen){
this.messagebarOpen=false;
if(this.animating){
this.$messagebar.delay(this.battle.messageShownTime/this.acceleration).animate({
opacity:0},
this.battle.messageFadeTime/this.acceleration);
this.waitFor(this.$messagebar);
}
return true;
}
return false;
};_proto.




runMoveAnim=function runMoveAnim(moveid,participants){
if(!this.animating)return;
if(!BattleMoveAnims[moveid]){
BattleMoveAnims['tackle'].anim(this,participants.map(function(p){return p.sprite;}));
return;
}
BattleMoveAnims[moveid].anim(this,participants.map(function(p){return p.sprite;}));
};_proto.

runOtherAnim=function runOtherAnim(moveid,participants){
if(!this.animating)return;
BattleOtherAnims[moveid].anim(this,participants.map(function(p){return p.sprite;}));
};_proto.

runStatusAnim=function runStatusAnim(moveid,participants){
if(!this.animating)return;
BattleStatusAnims[moveid].anim(this,participants.map(function(p){return p.sprite;}));
};_proto.

runResidualAnim=function runResidualAnim(moveid,pokemon){
if(!this.animating)return;
BattleMoveAnims[moveid].residualAnim(this,[pokemon.sprite]);
};_proto.

runPrepareAnim=function runPrepareAnim(moveid,attacker,defender){
if(!this.animating)return;
var moveAnim=BattleMoveAnims[moveid];
if(!moveAnim.prepareAnim)return;
moveAnim.prepareAnim(this,[attacker.sprite,defender.sprite]);
};_proto.

updateGen=function updateGen(){
var gen=this.battle.gen;
if(Dex.prefs('nopastgens'))gen=6;
if(Dex.prefs('bwgfx')&&gen>5)gen=5;
this.gen=gen;
this.activeCount=this.battle.mySide&&this.battle.mySide.active.length||1;

var isSPL=typeof this.battle.rated==='string'&&this.battle.rated.startsWith("Smogon Premier League");
var bg;
if(isSPL){
if(gen<=1)bg='fx/bg-gen1-spl.png';else
if(gen<=2)bg='fx/bg-gen2-spl.png';else
if(gen<=3)bg='fx/bg-gen3-spl.png';else
if(gen<=4)bg='fx/bg-gen4-spl.png';else
bg='fx/bg-spl.png';
this.setBgm(-101);
}else{
if(gen<=1)bg='fx/bg-gen1.png?';else
if(gen<=2)bg='fx/bg-gen2.png?';else
if(gen<=3)bg='fx/'+BattleBackdropsThree[this.numericId%BattleBackdropsThree.length]+'?';else
if(gen<=4)bg='fx/'+BattleBackdropsFour[this.numericId%BattleBackdropsFour.length];else
if(gen<=5)bg='fx/'+BattleBackdropsFive[this.numericId%BattleBackdropsFive.length];else
bg='sprites/gen6bgs/'+BattleBackdrops[this.numericId%BattleBackdrops.length];
}

this.backdropImage=bg;
if(this.$bg){
this.$bg.css('background-image','url('+Dex.resourcePrefix+''+this.backdropImage+')');
}
};_proto.

getDetailsText=function getDetailsText(pokemon){
var name=pokemon.side&&pokemon.side.n&&(this.battle.ignoreOpponent||this.battle.ignoreNicks)?pokemon.species:pokemon.name;
if(name!==pokemon.species){
name+=' ('+pokemon.species+')';
}
if(pokemon===pokemon.side.active[0]){
name+=' (active)';
}else if(pokemon.fainted){
name+=' (fainted)';
}else{
var statustext='';
if(pokemon.hp!==pokemon.maxhp){
statustext+=pokemon.hpDisplay();
}
if(pokemon.status){
if(statustext)statustext+='|';
statustext+=pokemon.status;
}
if(statustext){
name+=' ('+statustext+')';
}
}
return BattleLog.escapeHTML(name);
};_proto.

updateSidebar=function updateSidebar(side){
if(!this.animating)return;
var pokemonhtml='';
var noShow=this.battle.hardcoreMode&&this.battle.gen<7;
var pokemonCount=Math.max(side.pokemon.length,6);
for(var i=0;i<pokemonCount;i++){
var poke=side.pokemon[i];
if(i>=side.totalPokemon&&i>=side.pokemon.length){
pokemonhtml+='<span class="picon" style="'+Dex.getPokemonIcon('pokeball-none')+'"></span>';
}else if(noShow&&poke&&poke.fainted){
pokemonhtml+='<span class="picon" style="'+Dex.getPokemonIcon('pokeball-fainted')+'" title="Fainted" aria-label="Fainted"></span>';
}else if(noShow&&poke&&poke.status){
pokemonhtml+='<span class="picon" style="'+Dex.getPokemonIcon('pokeball-statused')+'" title="Status" aria-label="Status"></span>';
}else if(noShow){
pokemonhtml+='<span class="picon" style="'+Dex.getPokemonIcon('pokeball')+'" title="Non-statused" aria-label="Non-statused"></span>';
}else if(!poke){
pokemonhtml+='<span class="picon" style="'+Dex.getPokemonIcon('pokeball')+'" title="Not revealed" aria-label="Not revealed"></span>';
}else if(!poke.ident&&this.battle.teamPreviewCount&&this.battle.teamPreviewCount<side.pokemon.length){
var details=this.getDetailsText(poke);
pokemonhtml+='<span class="picon" style="'+Dex.getPokemonIcon(poke,!side.n)+';opacity:0.6" title="'+details+'" aria-label="'+details+'"></span>';
}else{
var _details=this.getDetailsText(poke);
pokemonhtml+='<span class="picon" style="'+Dex.getPokemonIcon(poke,!side.n)+'" title="'+_details+'" aria-label="'+_details+'"></span>';
}
if(i%3===2)pokemonhtml+='</div><div class="teamicons">';
}
pokemonhtml='<div class="teamicons">'+pokemonhtml+'</div>';
var $sidebar=side.n?this.$rightbar:this.$leftbar;
if(side.name){
$sidebar.html('<div class="trainer"><strong>'+BattleLog.escapeHTML(side.name)+'</strong><div class="trainersprite" style="background-image:url('+Dex.resolveAvatar(side.avatar)+')"></div>'+pokemonhtml+'</div>');
$sidebar.find('.trainer').css('opacity',1);
}else{
$sidebar.find('.trainer').css('opacity',0.4);
}
};_proto.
updateSidebars=function updateSidebars(){for(var _i3=0,_this$battle$sides2=
this.battle.sides;_i3<_this$battle$sides2.length;_i3++){var side=_this$battle$sides2[_i3];this.updateSidebar(side);}
};_proto.
updateStatbars=function updateStatbars(){for(var _i4=0,_this$battle$sides3=
this.battle.sides;_i4<_this$battle$sides3.length;_i4++){var side=_this$battle$sides3[_i4];for(var _i5=0,_side$active=
side.active;_i5<_side$active.length;_i5++){var active=_side$active[_i5];
if(active)active.sprite.updateStatbar(active);
}
}
};_proto.

teamPreviewEnd=function teamPreviewEnd(){
for(var siden=0;siden<2;siden++){
this.$sprites[siden].empty();
this.battle.sides[siden].updateSprites();
}
};_proto.
teamPreview=function teamPreview(){
for(var siden=0;siden<2;siden++){
var side=this.battle.sides[siden];
var textBuf='';
var buf='';
var buf2='';
this.$sprites[siden].empty();

var ludicoloCount=0;
var lombreCount=0;
for(var i=0;i<side.pokemon.length;i++){
var pokemon=side.pokemon[i];
if(pokemon.species==='Ludicolo')ludicoloCount++;
if(pokemon.species==='Lombre')lombreCount++;

var spriteData=Dex.getSpriteData(pokemon,siden,{
gen:this.gen,
noScale:true});

var _y=0;
var _x=0;
if(siden){
_y=48+50+3*(i+6-side.pokemon.length);
_x=48+180+50*(i+6-side.pokemon.length);
}else{
_y=48+200+3*i;
_x=48+100+50*i;
}
if(textBuf)textBuf+=' / ';
textBuf+=pokemon.species;
var _url=spriteData.url;

buf+='<img src="'+_url+'" width="'+spriteData.w+'" height="'+spriteData.h+'" style="position:absolute;top:'+Math.floor(_y-spriteData.h/2)+'px;left:'+Math.floor(_x-spriteData.w/2)+'px" />';
buf2+='<div style="position:absolute;top:'+(_y+45)+'px;left:'+(_x-40)+'px;width:80px;font-size:10px;text-align:center;color:#FFF;">';
if(pokemon.gender==='F'){
buf2+='<img src="'+Dex.resourcePrefix+'fx/gender-f.png" width="7" height="10" alt="F" style="margin-bottom:-1px" /> ';
}else if(pokemon.gender==='M'){
buf2+='<img src="'+Dex.resourcePrefix+'fx/gender-m.png" width="7" height="10" alt="M" style="margin-bottom:-1px" /> ';
}
if(pokemon.level!==100){
buf2+='<span style="text-shadow:#000 1px 1px 0,#000 1px -1px 0,#000 -1px 1px 0,#000 -1px -1px 0"><small>L</small>'+pokemon.level+'</span>';
}
if(pokemon.item){
buf2+=' <img src="'+Dex.resourcePrefix+'fx/item.png" width="8" height="10" alt="F" style="margin-bottom:-1px" />';
}
buf2+='</div>';
}
side.totalPokemon=side.pokemon.length;
if(textBuf){
this.log.addDiv('chat battle-history',
'<strong>'+BattleLog.escapeHTML(side.name)+'\'s team:</strong> <em style="color:#445566;display:block;">'+BattleLog.escapeHTML(textBuf)+'</em>');

}
this.$sprites[siden].html(buf+buf2);

if(ludicoloCount>=2){
this.bgmNum=-3;
}else if(ludicoloCount+lombreCount>=2){
this.bgmNum=-2;
}
}
if(this.bgmNum<0){
this.setBgm(this.bgmNum);
}
this.wait(1000);
this.updateSidebars();
};_proto.

showJoinButtons=function showJoinButtons(){
if(!this.battle.joinButtons)return;
if(this.battle.ended||this.battle.rated)return;
if(!this.battle.p1.name){
this.$battle.append('<div class="playbutton1"><button name="joinBattle">Join Battle</button></div>');
}
if(!this.battle.p2.name){
this.$battle.append('<div class="playbutton2"><button name="joinBattle">Join Battle</button></div>');
}
};_proto.
hideJoinButtons=function hideJoinButtons(){
if(!this.battle.joinButtons)return;
this.$battle.find('.playbutton1, .playbutton2').remove();
};_proto.

pseudoWeatherLeft=function pseudoWeatherLeft(pWeather){
var buf='<br />'+Dex.getMove(pWeather[0]).name;
if(!pWeather[1]&&pWeather[2]){
pWeather[1]=pWeather[2];
pWeather[2]=0;
}
if(this.battle.gen<7&&this.battle.hardcoreMode)return buf;
if(pWeather[2]){
return buf+' <small>('+pWeather[1]+' or '+pWeather[2]+' turns)</small>';
}
if(pWeather[1]){
return buf+' <small>('+pWeather[1]+' turn'+(pWeather[1]===1?'':'s')+')</small>';
}
return buf;
};_proto.
sideConditionLeft=function sideConditionLeft(cond,siden){
if(!cond[2]&&!cond[3])return'';
var buf='<br />'+(siden?"Foe's ":"")+Dex.getMove(cond[0]).name;
if(!cond[2]&&cond[3]){
cond[2]=cond[3];
cond[3]=0;
}
if(this.battle.gen<7&&this.battle.hardcoreMode)return buf;
if(!cond[3]){
return buf+' <small>('+cond[2]+' turn'+(cond[2]===1?'':'s')+')</small>';
}
return buf+' <small>('+cond[2]+' or '+cond[3]+' turns)</small>';
};_proto.
weatherLeft=function weatherLeft(){
if(this.battle.gen<7&&this.battle.hardcoreMode)return'';
if(this.battle.weatherMinTimeLeft!==0){
return' <small>('+this.battle.weatherMinTimeLeft+' or '+this.battle.weatherTimeLeft+' turns)</small>';
}
if(this.battle.weatherTimeLeft!==0){
return' <small>('+this.battle.weatherTimeLeft+' turn'+(this.battle.weatherTimeLeft===1?'':'s')+')</small>';
}
return'';
};_proto.
upkeepWeather=function upkeepWeather(){
var isIntense=this.curWeather==='desolateland'||this.curWeather==='primordialsea'||this.curWeather==='deltastream';
this.$weather.animate({
opacity:1.0},
300).animate({
opacity:isIntense?0.9:0.5},
300);
};_proto.
updateWeather=function updateWeather(instant){var _this2=this;
if(!this.animating)return;
var isIntense=false;
var weatherNameTable={
sunnyday:'Sun',
desolateland:'Intense Sun',
raindance:'Rain',
primordialsea:'Heavy Rain',
sandstorm:'Sandstorm',
hail:'Hail',
deltastream:'Strong Winds'};

var weather=this.battle.weather;
var terrain='';for(var _i6=0,_this$battle$pseudoWe=
this.battle.pseudoWeather;_i6<_this$battle$pseudoWe.length;_i6++){var pseudoWeatherData=_this$battle$pseudoWe[_i6];
var pwid=toId(pseudoWeatherData[0]);
switch(pwid){
case'electricterrain':
case'grassyterrain':
case'mistyterrain':
case'psychicterrain':
terrain=pwid;
break;
default:
if(!terrain)terrain='pseudo';
break;}

}
if(weather==='desolateland'||weather==='primordialsea'||weather==='deltastream'){
isIntense=true;
}

var weatherhtml='';
if(weather&&weather in weatherNameTable){
weatherhtml+='<br />'+weatherNameTable[weather]+this.weatherLeft();
}for(var _i7=0,_this$battle$pseudoWe2=
this.battle.pseudoWeather;_i7<_this$battle$pseudoWe2.length;_i7++){var pseudoWeather=_this$battle$pseudoWe2[_i7];
weatherhtml+=this.pseudoWeatherLeft(pseudoWeather);
}for(var _i8=0,_this$battle$sides4=
this.battle.sides;_i8<_this$battle$sides4.length;_i8++){var side=_this$battle$sides4[_i8];
for(var _id in side.sideConditions){
weatherhtml+=this.sideConditionLeft(side.sideConditions[_id],side.n);
}
}

if(instant){
this.$weather.html('<em>'+weatherhtml+'</em>');
if(this.curWeather===weather&&this.curTerrain===terrain)return;
this.$terrain.attr('class',terrain?'weather '+terrain+'weather':'weather');
this.curTerrain=terrain;
this.$weather.attr('class',weather?'weather '+weather+'weather':'weather');
this.$weather.css('opacity',isIntense||!weather?0.9:0.5);
this.curWeather=weather;
return;
}

if(weather!==this.curWeather){
this.$weather.animate({
opacity:0},
this.curWeather?300:100,function(){
_this2.$weather.html('<em>'+weatherhtml+'</em>');
_this2.$weather.attr('class',weather?'weather '+weather+'weather':'weather');
_this2.$weather.animate({opacity:isIntense||!weather?0.9:0.5},300);
});
this.curWeather=weather;
}else{
this.$weather.html('<em>'+weatherhtml+'</em>');
}

if(terrain!==this.curTerrain){
this.$terrain.animate({
top:360,
opacity:0},
this.curTerrain?400:1,function(){
_this2.$terrain.attr('class',terrain?'weather '+terrain+'weather':'weather');
_this2.$terrain.animate({top:0,opacity:1},400);
});
this.curTerrain=terrain;
}
};_proto.
resetTurn=function resetTurn(){
if(!this.battle.turn){
this.$turn.html('');
return;
}
this.$turn.html('<div class="turn">Turn '+this.battle.turn+'</div>');
};_proto.
incrementTurn=function incrementTurn(){
if(!this.animating)return;

var turn=this.battle.turn;
if(!turn)return;
var $prevTurn=this.$turn.children();
var $newTurn=$('<div class="turn">Turn '+turn+'</div>');
$newTurn.css({
opacity:0,
left:160});

this.$turn.append($newTurn);
$newTurn.animate({
opacity:1,
left:110},
500).animate({
opacity:.4},
1500);
$prevTurn.animate({
opacity:0,
left:60},
500,function(){
$prevTurn.remove();
});
if(this.battle.turnsSinceMoved>2){
this.acceleration=(this.battle.messageFadeTime<150?2:1)*Math.min(this.battle.turnsSinceMoved-1,3);
}else{
this.acceleration=this.battle.messageFadeTime<150?2:1;
}
this.wait(500/this.acceleration);
};_proto.

addPokemonSprite=function addPokemonSprite(pokemon){
var siden=pokemon.side.n;
var sprite=new PokemonSprite(Dex.getSpriteData(pokemon,siden,{
gen:this.gen}),
{
x:pokemon.side.x,
y:pokemon.side.y,
z:pokemon.side.z,
opacity:0},
this,siden);
if(sprite.$el)this.$sprites[siden].append(sprite.$el);
return sprite;
};_proto.

addSideCondition=function addSideCondition(siden,id,instant){
if(!this.animating)return;
var side=this.battle.sides[siden];
switch(id){
case'auroraveil':
var auroraveil=new Sprite(BattleEffects.auroraveil,{
display:'block',
x:side.x,
y:side.y,
z:side.behind(-14),
xscale:1,
yscale:0,
opacity:0.1},
this);
this.$spritesFront[siden].append(auroraveil.$el);
this.sideConditions[siden][id]=[auroraveil];
auroraveil.anim({
opacity:0.7,
time:instant?0:400}).
anim({
opacity:0.3,
time:instant?0:300});

break;
case'reflect':
var reflect=new Sprite(BattleEffects.reflect,{
display:'block',
x:side.x,
y:side.y,
z:side.behind(-17),
xscale:1,
yscale:0,
opacity:0.1},
this);
this.$spritesFront[siden].append(reflect.$el);
this.sideConditions[siden][id]=[reflect];
reflect.anim({
opacity:0.7,
time:instant?0:400}).
anim({
opacity:0.3,
time:instant?0:300});

break;
case'safeguard':
var safeguard=new Sprite(BattleEffects.safeguard,{
display:'block',
x:side.x,
y:side.y,
z:side.behind(-20),
xscale:1,
yscale:0,
opacity:0.1},
this);
this.$spritesFront[siden].append(safeguard.$el);
this.sideConditions[siden][id]=[safeguard];
safeguard.anim({
opacity:0.7,
time:instant?0:400}).
anim({
opacity:0.3,
time:instant?0:300});

break;
case'lightscreen':
var lightscreen=new Sprite(BattleEffects.lightscreen,{
display:'block',
x:side.x,
y:side.y,
z:side.behind(-23),
xscale:1,
yscale:0,
opacity:0.1},
this);
this.$spritesFront[siden].append(lightscreen.$el);
this.sideConditions[siden][id]=[lightscreen];
lightscreen.anim({
opacity:0.7,
time:instant?0:400}).
anim({
opacity:0.3,
time:instant?0:300});

break;
case'mist':
var mist=new Sprite(BattleEffects.mist,{
display:'block',
x:side.x,
y:side.y,
z:side.behind(-27),
xscale:1,
yscale:0,
opacity:0.1},
this);
this.$spritesFront[siden].append(mist.$el);
this.sideConditions[siden][id]=[mist];
mist.anim({
opacity:0.7,
time:instant?0:400}).
anim({
opacity:0.3,
time:instant?0:300});

break;
case'stealthrock':
var rock1=new Sprite(BattleEffects.rock1,{
display:'block',
x:side.leftof(-40),
y:side.y-10,
z:side.z,
opacity:0.5,
scale:0.2},
this);

var rock2=new Sprite(BattleEffects.rock2,{
display:'block',
x:side.leftof(-20),
y:side.y-40,
z:side.z,
opacity:0.5,
scale:0.2},
this);

var rock3=new Sprite(BattleEffects.rock1,{
display:'block',
x:side.leftof(30),
y:side.y-20,
z:side.z,
opacity:0.5,
scale:0.2},
this);

var rock4=new Sprite(BattleEffects.rock2,{
display:'block',
x:side.leftof(10),
y:side.y-30,
z:side.z,
opacity:0.5,
scale:0.2},
this);

this.$spritesFront[siden].append(rock1.$el);
this.$spritesFront[siden].append(rock2.$el);
this.$spritesFront[siden].append(rock3.$el);
this.$spritesFront[siden].append(rock4.$el);
this.sideConditions[siden][id]=[rock1,rock2,rock3,rock4];
break;
case'spikes':
var spikeArray=this.sideConditions[siden]['spikes'];
if(!spikeArray){
spikeArray=[];
this.sideConditions[siden]['spikes']=spikeArray;
}
var levels=this.battle.sides[siden].sideConditions['spikes'][1];
if(spikeArray.length<1&&levels>=1){
var spike1=new Sprite(BattleEffects.caltrop,{
display:'block',
x:side.x-25,
y:side.y-40,
z:side.z,
scale:0.3},
this);
this.$spritesFront[siden].append(spike1.$el);
spikeArray.push(spike1);
}
if(spikeArray.length<2&&levels>=2){
var spike2=new Sprite(BattleEffects.caltrop,{
display:'block',
x:side.x+30,
y:side.y-45,
z:side.z,
scale:.3},
this);
this.$spritesFront[siden].append(spike2.$el);
spikeArray.push(spike2);
}
if(spikeArray.length<3&&levels>=3){
var spike3=new Sprite(BattleEffects.caltrop,{
display:'block',
x:side.x+50,
y:side.y-40,
z:side.z,
scale:.3},
this);
this.$spritesFront[siden].append(spike3.$el);
spikeArray.push(spike3);
}
break;
case'toxicspikes':
var tspikeArray=this.sideConditions[siden]['toxicspikes'];
if(!tspikeArray){
tspikeArray=[];
this.sideConditions[siden]['toxicspikes']=tspikeArray;
}
var tspikeLevels=this.battle.sides[siden].sideConditions['toxicspikes'][1];
if(tspikeArray.length<1&&tspikeLevels>=1){
var tspike1=new Sprite(BattleEffects.poisoncaltrop,{
display:'block',
x:side.x+5,
y:side.y-40,
z:side.z,
scale:0.3},
this);
this.$spritesFront[siden].append(tspike1.$el);
tspikeArray.push(tspike1);
}
if(tspikeArray.length<2&&tspikeLevels>=2){
var tspike2=new Sprite(BattleEffects.poisoncaltrop,{
display:'block',
x:side.x-15,
y:side.y-35,
z:side.z,
scale:.3},
this);
this.$spritesFront[siden].append(tspike2.$el);
tspikeArray.push(tspike2);
}
break;
case'stickyweb':
var web=new Sprite(BattleEffects.web,{
display:'block',
x:side.x+15,
y:side.y-35,
z:side.z,
opacity:0.4,
scale:0.7},
this);
this.$spritesFront[siden].append(web.$el);
this.sideConditions[siden][id]=[web];
break;}

};_proto.
removeSideCondition=function removeSideCondition(siden,id){
if(!this.animating)return;
if(this.sideConditions[siden][id]){for(var _i9=0,_this$sideConditions$=
this.sideConditions[siden][id];_i9<_this$sideConditions$.length;_i9++){var sprite=_this$sideConditions$[_i9];sprite.destroy();}
delete this.sideConditions[siden][id];
}
};_proto.
resetSideConditions=function resetSideConditions(){
for(var siden=0;siden<this.sideConditions.length;siden++){
for(var _id2 in this.sideConditions[siden]){
this.removeSideCondition(siden,_id2);
}
for(var _id3 in this.battle.sides[siden].sideConditions){
this.addSideCondition(siden,_id3,true);
}
}
};_proto.

typeAnim=function typeAnim(pokemon,types){
var result=BattleLog.escapeHTML(types).split('/').map(function(type){return(
'<img src="'+Dex.resourcePrefix+'sprites/types/'+type+'.png" alt="'+type+'" class="pixelated" />');}).
join(' ');
this.resultAnim(pokemon,result,'neutral');
};_proto.
resultAnim=function resultAnim(pokemon,result,type){
if(!this.animating)return;
var $effect=$('<div class="result '+type+'result"><strong>'+result+'</strong></div>');
this.$fx.append($effect);
$effect.delay(this.timeOffset).css({
display:'block',
opacity:0,
top:pokemon.sprite.top-5,
left:pokemon.sprite.left-75}).
animate({
opacity:1},
1);
$effect.animate({
opacity:0,
top:pokemon.sprite.top-65},
1000,'swing');
this.wait(this.acceleration<2?350:250);
pokemon.sprite.updateStatbar(pokemon);
if(this.acceleration<3)this.waitFor($effect);
};_proto.
abilityActivateAnim=function abilityActivateAnim(pokemon,result){
if(!this.animating)return;
this.$fx.append('<div class="result abilityresult"><strong>'+result+'</strong></div>');
var $effect=this.$fx.children().last();
$effect.delay(this.timeOffset).css({
display:'block',
opacity:0,
top:pokemon.sprite.top+15,
left:pokemon.sprite.left-75}).
animate({
opacity:1},
1);
$effect.delay(800).animate({
opacity:0},
400,'swing');
this.wait(100);
pokemon.sprite.updateStatbar(pokemon);
if(this.acceleration<3)this.waitFor($effect);
};_proto.
damageAnim=function damageAnim(pokemon,damage){
if(!this.animating)return;
if(!pokemon.sprite.$statbar)return;
pokemon.sprite.updateHPText(pokemon);

var $hp=pokemon.sprite.$statbar.find('div.hp');
var w=pokemon.hpWidth(150);
var hpcolor=pokemon.getHPColor();
var callback;
if(hpcolor==='y'){
callback=function(){$hp.addClass('hp-yellow');};
}
if(hpcolor==='r'){
callback=function(){$hp.addClass('hp-yellow hp-red');};
}

this.resultAnim(pokemon,this.battle.hardcoreMode?'Damage':'&minus;'+damage,'bad');

$hp.animate({
width:w,
'border-right-width':w?1:0},
350,callback);
};_proto.
healAnim=function healAnim(pokemon,damage){
if(!this.animating)return;
if(!pokemon.sprite.$statbar)return;
pokemon.sprite.updateHPText(pokemon);

var $hp=pokemon.sprite.$statbar.find('div.hp');
var w=pokemon.hpWidth(150);
var hpcolor=pokemon.getHPColor();
var callback;
if(hpcolor==='g'){
callback=function(){$hp.removeClass('hp-yellow hp-red');};
}
if(hpcolor==='y'){
callback=function(){$hp.removeClass('hp-red');};
}

this.resultAnim(pokemon,this.battle.hardcoreMode?'Heal':'+'+damage,'good');

$hp.animate({
width:w,
'border-right-width':w?1:0},
350,callback);
};_proto.




removeEffect=function removeEffect(pokemon,id,instant){
return pokemon.sprite.removeEffect(id,instant);
};_proto.
addEffect=function addEffect(pokemon,id,instant){
return pokemon.sprite.addEffect(id,instant);
};_proto.
animSummon=function animSummon(pokemon,slot,instant){
return pokemon.sprite.animSummon(pokemon,slot,instant);
};_proto.
animUnsummon=function animUnsummon(pokemon,instant){
return pokemon.sprite.animUnsummon(pokemon,instant);
};_proto.
animDragIn=function animDragIn(pokemon,slot){
return pokemon.sprite.animDragIn(pokemon,slot);
};_proto.
animDragOut=function animDragOut(pokemon){
return pokemon.sprite.animDragOut(pokemon);
};_proto.
updateStatbar=function updateStatbar(pokemon,updatePrevhp,updateHp){
return pokemon.sprite.updateStatbar(pokemon,updatePrevhp,updateHp);
};_proto.
updateStatbarIfExists=function updateStatbarIfExists(pokemon,updatePrevhp,updateHp){
return pokemon.sprite.updateStatbarIfExists(pokemon,updatePrevhp,updateHp);
};_proto.
animTransform=function animTransform(pokemon,isCustomAnim,isPermanent){
return pokemon.sprite.animTransform(pokemon,isCustomAnim,isPermanent);
};_proto.
clearEffects=function clearEffects(pokemon){
return pokemon.sprite.clearEffects();
};_proto.
removeTransform=function removeTransform(pokemon){
return pokemon.sprite.removeTransform();
};_proto.
animFaint=function animFaint(pokemon){
return pokemon.sprite.animFaint(pokemon);
};_proto.
animReset=function animReset(pokemon){
return pokemon.sprite.animReset();
};_proto.
anim=function anim(pokemon,end,transition){
return pokemon.sprite.anim(end,transition);
};_proto.
beforeMove=function beforeMove(pokemon){
return pokemon.sprite.beforeMove();
};_proto.
afterMove=function afterMove(pokemon){
return pokemon.sprite.afterMove();
};_proto.
updateSpritesForSide=function updateSpritesForSide(side){
if(side.missedPokemon&&side.missedPokemon.sprite){
side.missedPokemon.sprite.destroy();
}

side.missedPokemon={
sprite:new PokemonSprite(null,{
x:side.leftof(-100),
y:side.y,
z:side.z,
opacity:0},
this,side.n)};


side.missedPokemon.sprite.isMissedPokemon=true;
};_proto.




setFrameHTML=function setFrameHTML(html){
this.$frame.html(html);
};_proto.
setControlsHTML=function setControlsHTML(html){
var $controls=this.$frame.parent().children('.battle-controls');
$controls.html(html);
};_proto.

preloadImage=function preloadImage(url){var _this3=this;
var token=url.replace(/\.(gif|png)$/,'').replace(/\//g,'-');
if(this.preloadCache[token]){
return;
}
this.preloadNeeded++;
this.preloadCache[token]=new Image();
this.preloadCache[token].onload=function(){
_this3.preloadDone++;
};
this.preloadCache[token].src=url;
};_proto.
preloadEffects=function preloadEffects(){
for(var i in BattleEffects){
if(i==='alpha'||i==='omega')continue;
var _url2=BattleEffects[i].url;
if(_url2)this.preloadImage(_url2);
}
this.preloadImage(Dex.resourcePrefix+'sprites/xyani/substitute.gif');
this.preloadImage(Dex.resourcePrefix+'sprites/xyani-back/substitute.gif');
};_proto.
setBgm=function setBgm(bgmNum){
if(!bgmNum)bgmNum=1+this.numericId%15;
if(this.bgmNum===bgmNum)return;
this.bgmNum=bgmNum;
if(this.bgm){
this.preloadBgm();
if(this.animating)this.soundStart();
}
};_proto.
preloadBgm=function preloadBgm(){var bgmNum=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;
if(bgmNum===0)bgmNum=this.bgmNum||1+this.numericId%15;
this.bgmNum=bgmNum;

var ext=window.nodewebkit?'.ogg':'.mp3';
switch(bgmNum){
case-1:
BattleSound.loadBgm('audio/bw2-homika-dogars'+ext,1661,68131);
this.bgm='audio/bw2-homika-dogars'+ext;
break;
case-2:
BattleSound.loadBgm('audio/xd-miror-b'+ext,9000,57815);
this.bgm='audio/xd-miror-b'+ext;
break;
case-3:
BattleSound.loadBgm('audio/colosseum-miror-b'+ext,896,47462);
this.bgm='audio/colosseum-miror-b'+ext;
break;
case 1:
BattleSound.loadBgm('audio/dpp-trainer'+ext,13440,96959);
this.bgm='audio/dpp-trainer'+ext;
break;
case 2:
BattleSound.loadBgm('audio/dpp-rival'+ext,13888,66352);
this.bgm='audio/dpp-rival'+ext;
break;
case 3:
BattleSound.loadBgm('audio/hgss-johto-trainer'+ext,23731,125086);
this.bgm='audio/hgss-johto-trainer'+ext;
break;
case 4:
BattleSound.loadBgm('audio/hgss-kanto-trainer'+ext,13003,94656);
this.bgm='audio/hgss-kanto-trainer'+ext;
break;
case 5:
BattleSound.loadBgm('audio/bw-trainer'+ext,14629,110109);
this.bgm='audio/bw-trainer'+ext;
break;
case 6:
BattleSound.loadBgm('audio/bw-rival'+ext,19180,57373);
this.bgm='audio/bw-rival'+ext;
break;
case 7:
BattleSound.loadBgm('audio/bw-subway-trainer'+ext,15503,110984);
this.bgm='audio/bw-subway-trainer'+ext;
break;
case 8:
BattleSound.loadBgm('audio/bw2-kanto-gym-leader'+ext,14626,58986);
this.bgm='audio/bw2-kanto-gym-leader'+ext;
break;
case 9:
BattleSound.loadBgm('audio/bw2-rival'+ext,7152,68708);
this.bgm='audio/bw2-rival'+ext;
break;
case 10:
BattleSound.loadBgm('audio/xy-trainer'+ext,7802,82469);
this.bgm='audio/xy-trainer'+ext;
break;
case 11:
BattleSound.loadBgm('audio/xy-rival'+ext,7802,58634);
this.bgm='audio/xy-rival'+ext;
break;
case 12:
BattleSound.loadBgm('audio/oras-trainer'+ext,13579,91548);
this.bgm='audio/oras-trainer'+ext;
break;
case 13:
BattleSound.loadBgm('audio/oras-rival'+ext,14303,69149);
this.bgm='audio/oras-rival'+ext;
break;
case 14:
BattleSound.loadBgm('audio/sm-trainer'+ext,8323,89230);
this.bgm='audio/sm-trainer'+ext;
break;
case-101:
BattleSound.loadBgm('audio/spl-elite4'+ext,3962,152509);
this.bgm='audio/spl-elite4'+ext;
break;
case 15:
default:
BattleSound.loadBgm('audio/sm-rival'+ext,11389,62158);
this.bgm='audio/sm-rival'+ext;
break;}

};_proto.
soundStart=function soundStart(){
if(!this.bgm)this.preloadBgm();
BattleSound.playBgm(this.bgm);
};_proto.
soundStop=function soundStop(){
BattleSound.stopBgm();
};_proto.
soundPause=function soundPause(){
BattleSound.pauseBgm();
};_proto.
destroy=function destroy(){
this.log.destroy();
if(this.$frame)this.$frame.empty();
this.soundStop();
this.battle=null;
};return BattleScene;}();var

























Sprite=function(){






function Sprite(spriteData,pos,scene){this.$el=null;
this.scene=scene;
var sp=null;
if(spriteData){
sp=spriteData;
var rawHTML=sp.rawHTML||
'<img src="'+sp.url+'" style="display:none;position:absolute"'+(sp.pixelated?' class="pixelated"':'')+' />';
this.$el=$(rawHTML);
}else{
sp={
w:0,
h:0,
url:''};

}
this.sp=sp;

this.x=pos.x;
this.y=pos.y;
this.z=pos.z;
if(pos.opacity!==0&&spriteData)this.$el.css(scene.pos(pos,sp));

if(!spriteData){
this.delay=function(){return this;};
this.anim=function(){return this;};
}
}var _proto2=Sprite.prototype;_proto2.

destroy=function destroy(){
if(this.$el)this.$el.remove();
this.$el=null;
this.scene=null;
};_proto2.
delay=function delay(time){
this.$el.delay(time);
return this;
};_proto2.
anim=function anim(end,transition){
end=Object.assign({
x:this.x,
y:this.y,
z:this.z,
scale:1,
opacity:1,
time:500},
end);

if(end.time===0){
this.$el.css(this.scene.pos(end,this.sp));
return this;
}
this.$el.animate(this.scene.posT(end,this.sp,transition,this),end.time);
return this;
};return Sprite;}();var


PokemonSprite=function(_Sprite){_inheritsLoose(PokemonSprite,_Sprite);
























function PokemonSprite(spriteData,pos,scene,siden){var _this4;
_this4=_Sprite.call(this,spriteData,pos,scene)||this;_this4.forme='';_this4.cryurl=undefined;_this4.subsp=null;_this4.$sub=null;_this4.isSubActive=false;_this4.$statbar=null;_this4.isMissedPokemon=false;_this4.oldsp=null;_this4.statbarLeft=0;_this4.statbarTop=0;_this4.left=0;_this4.top=0;_this4.effects={};
_this4.siden=siden;
_this4.cryurl=_this4.sp.cryurl;
_this4.isBackSprite=!_this4.siden;return _this4;
}var _proto3=PokemonSprite.prototype;_proto3.
destroy=function destroy(){
if(this.$el)this.$el.remove();
this.$el=null;
if(this.$statbar)this.$statbar.remove();
this.$statbar=null;
if(this.$sub)this.$sub.remove();
this.$sub=null;
this.scene=null;
};_proto3.

delay=function delay(time){
this.$el.delay(time);
if(this.$sub)this.$sub.delay(time);
return this;
};_proto3.
anim=function anim(end,transition){
end=Object.assign({
x:this.x,
y:this.y,
z:this.z,
scale:1,
opacity:1,
time:500},
end);var _ref=

this.isSubActive?[this.$sub,this.subsp]:[this.$el,this.sp],$el=_ref[0],sp=_ref[1];
$el.animate(this.scene.posT(end,sp,transition,this),end.time);
return this;
};_proto3.

behindx=function behindx(offset){
return this.x+(this.isBackSprite?-1:1)*offset;
};_proto3.
behindy=function behindy(offset){
return this.y+(this.isBackSprite?1:-1)*offset;
};_proto3.
leftof=function leftof(offset){
return this.x+(this.isBackSprite?-1:1)*offset;
};_proto3.
behind=function behind(offset){
return this.z+(this.isBackSprite?-1:1)*offset;
};_proto3.

removeTransform=function removeTransform(){
if(!this.scene.animating)return;
if(!this.oldsp)return;
var sp=this.oldsp;
this.cryurl=sp.cryurl;
this.sp=sp;
this.oldsp=null;

var $el=this.isSubActive?this.$sub:this.$el;
$el.attr('src',sp.url);
$el.css(this.scene.pos({
x:this.x,
y:this.y,
z:this.isSubActive?this.behind(30):this.z,
opacity:this.$sub?.3:1},
sp));
};_proto3.
animSub=function animSub(instant,noAnim){
if(!this.scene.animating)return;
if(this.$sub)return;
var subsp=Dex.getSpriteData('substitute',this.siden,{
gen:this.scene.gen});

this.subsp=subsp;
this.$sub=$('<img src="'+subsp.url+'" style="display:block;opacity:0;position:absolute"'+(subsp.pixelated?' class="pixelated"':'')+' />');
this.scene.$spritesFront[this.siden].append(this.$sub);
this.isSubActive=true;
if(instant){
if(!noAnim)this.animReset();
return;
}
this.$el.animate(this.scene.pos({
x:this.x,
y:this.y,
z:this.behind(30),
opacity:0.3},
this.sp),500);
this.$sub.css(this.scene.pos({
x:this.x,
y:this.y+50,
z:this.z,
opacity:0},
subsp));
this.$sub.animate(this.scene.pos({
x:this.x,
y:this.y,
z:this.z},
subsp),500);
this.scene.waitFor(this.$sub);
};_proto3.
animSubFade=function animSubFade(instant){
if(!this.$sub||!this.scene.animating)return;
this.isSubActive=false;
if(instant){
this.$sub.remove();
this.$sub=null;
this.animReset();
return;
}
if(this.scene.timeOffset){
this.$el.delay(this.scene.timeOffset);
this.$sub.delay(this.scene.timeOffset);
}
this.$sub.animate(this.scene.pos({
x:this.x,
y:this.y-50,
z:this.z,
opacity:0},
this.subsp),500);

this.$sub=null;
this.anim({time:500});
if(this.scene.animating)this.scene.waitFor(this.$el);
};_proto3.
beforeMove=function beforeMove(){
if(!this.scene.animating)return false;
if(!this.isSubActive)return false;
this.isSubActive=false;
this.anim({time:300});
this.$sub.animate(this.scene.pos({
x:this.leftof(-50),
y:this.y,
z:this.z,
opacity:0.5},
this.subsp),300);for(var _i10=0,_this$scene$battle$si=
this.scene.battle.sides;_i10<_this$scene$battle$si.length;_i10++){var side=_this$scene$battle$si[_i10];for(var _i11=0,_side$active2=
side.active;_i11<_side$active2.length;_i11++){var active=_side$active2[_i11];
if(active&&active.sprite!==this){
active.sprite.delay(300);
}
}
}
this.scene.wait(300);
this.scene.waitFor(this.$el);

return true;
};_proto3.
afterMove=function afterMove(){var _this5=this;
if(!this.scene.animating)return false;
if(!this.$sub||this.isSubActive)return false;
this.isSubActive=true;
this.$sub.delay(300);
this.$el.add(this.$sub).promise().done(function(){
if(!_this5.$sub||!_this5.$el)return;
_this5.$el.animate(_this5.scene.pos({
x:_this5.x,
y:_this5.y,
z:_this5.behind(30),
opacity:0.3},
_this5.sp),300);
_this5.anim({time:300});
});
return false;
};_proto3.
removeSub=function removeSub(){
if(!this.$sub)return;
this.isSubActive=false;
if(!this.scene.animating){
this.$sub.remove();
}else{
var $sub=this.$sub;
$sub.animate({
opacity:0},
function(){
$sub.remove();
});
}
this.$sub=null;
};_proto3.
reset=function reset(pokemon){
this.clearEffects();

if(pokemon.volatiles.formechange){
this.oldsp=this.sp;
this.sp=Dex.getSpriteData(pokemon,this.isBackSprite?0:1,{
gen:this.scene.gen});

}











if(this.$el){
this.$el.stop(true,false);
var $newEl=$('<img src="'+this.sp.url+'" style="display:none;position:absolute"'+(this.sp.pixelated?' class="pixelated"':'')+' />');
this.$el.replaceWith($newEl);
this.$el=$newEl;
}

if(!pokemon.isActive()){
if(this.$statbar){
this.$statbar.remove();
this.$statbar=null;
}
return;
}

this.recalculatePos(pokemon.slot);
this.resetStatbar(pokemon);
this.$el.css(this.scene.pos({
display:'block',
x:this.x,
y:this.y,
z:this.z},
this.sp));

for(var _id4 in pokemon.volatiles){this.addEffect(_id4,true);}
for(var _id5 in pokemon.turnstatuses){this.addEffect(_id5,true);}
for(var _id6 in pokemon.movestatuses){this.addEffect(_id6,true);}
};_proto3.
animReset=function animReset(){
if(!this.scene.animating)return;
if(this.$sub){
this.isSubActive=true;
this.$el.stop(true,false);
this.$sub.stop(true,false);
this.$el.css(this.scene.pos({
x:this.x,
y:this.y,
z:this.behind(30),
opacity:.3},
this.sp));
this.$sub.css(this.scene.pos({
x:this.x,
y:this.y,
z:this.z},
this.subsp));
}else{
this.$el.stop(true,false);
this.$el.css(this.scene.pos({
x:this.x,
y:this.y,
z:this.z},
this.sp));
}
};_proto3.
recalculatePos=function recalculatePos(slot){
var moreActive=this.scene.activeCount-1;
var statbarOffset=0;
if(this.scene.gen<=4&&moreActive){
this.x=(slot-0.52)*(this.isBackSprite?-1:1)*-55;
this.y=(this.isBackSprite?-1:1)+1;
if(!this.isBackSprite)statbarOffset=30*slot;
if(this.isBackSprite)statbarOffset=-28*slot;
}else{
switch(moreActive){
case 0:
this.x=0;
break;
case 1:
if(this.sp.pixelated){
this.x=(slot*-100+18)*(this.isBackSprite?-1:1);
}else{
this.x=(slot*-75+18)*(this.isBackSprite?-1:1);
}
break;
case 2:
this.x=(slot*-70+20)*(this.isBackSprite?-1:1);
break;}

this.y=slot*10*(this.isBackSprite?-1:1);
if(!this.isBackSprite)statbarOffset=17*slot;
if(!this.isBackSprite&&!moreActive&&this.sp.pixelated)statbarOffset=15;
if(this.isBackSprite)statbarOffset=-7*slot;
if(!this.isBackSprite&&moreActive===2)statbarOffset=14*slot-10;
}
if(this.scene.gen<=2){
statbarOffset+=this.isBackSprite?1:20;
}else if(this.scene.gen<=3){
statbarOffset+=this.isBackSprite?5:30;
}else{
statbarOffset+=this.isBackSprite?20:30;
}

var pos=this.scene.pos({
x:this.x,
y:this.y,
z:this.z},
{
w:0,
h:96});

pos.top+=40;

this.left=pos.left;
this.top=pos.top;
this.statbarLeft=pos.left-80;
this.statbarTop=pos.top-73-statbarOffset;

if(moreActive){

if(!slot&&this.isBackSprite||slot&&!this.isBackSprite){
this.$el.prependTo(this.$el.parent());
}else{
this.$el.appendTo(this.$el.parent());
}
}
};_proto3.
animSummon=function animSummon(pokemon,slot,instant){
if(!this.scene.animating)return;
this.scene.$sprites[this.siden].append(this.$el);
this.recalculatePos(slot);


if(instant){
this.$el.css('display','block');
this.animReset();
this.resetStatbar(pokemon);
if(pokemon.hasVolatile('substitute'))this.animSub(true);
return;
}
if(this.cryurl){
BattleSound.playEffect(this.cryurl);
}
this.$el.css(this.scene.pos({
display:'block',
x:this.x,
y:this.y-10,
z:this.z,
scale:0,
opacity:0},
this.sp));
this.scene.showEffect('pokeball',{
opacity:0,
x:this.x,
y:this.y+30,
z:this.behind(50),
scale:.7},
{
opacity:1,
x:this.x,
y:this.y-10,
z:this.z,
time:300/this.scene.acceleration},
'ballistic2','fade');
if(this.scene.gen<=4){
this.delay(this.scene.timeOffset+300/this.scene.acceleration).anim({
x:this.x,
y:this.y,
z:this.z,
time:400/this.scene.acceleration});

}else{
this.delay(this.scene.timeOffset+300/this.scene.acceleration).anim({
x:this.x,
y:this.y+30,
z:this.z,
time:400/this.scene.acceleration}).
anim({
x:this.x,
y:this.y,
z:this.z,
time:300/this.scene.acceleration},
'accel');
}
if(this.sp.shiny&&this.scene.acceleration<2)BattleOtherAnims.shiny.anim(this.scene,[this]);
this.scene.waitFor(this.$el);

if(pokemon.hasVolatile('substitute')){
this.animSub(true,true);
this.$sub.css(this.scene.pos({
x:this.x,
y:this.y,
z:this.z},
this.subsp));
this.$el.animate(this.scene.pos({
x:this.x,
y:this.y,
z:this.behind(30),
opacity:0.3},
this.sp),300);
}

this.resetStatbar(pokemon,true);
this.scene.updateSidebar(pokemon.side);
this.$statbar.css({
display:'block',
left:this.statbarLeft,
top:this.statbarTop+20,
opacity:0});

this.$statbar.delay(300/this.scene.acceleration).animate({
top:this.statbarTop,
opacity:1},
400/this.scene.acceleration);

this.dogarsCheck(pokemon);
};_proto3.
animDragIn=function animDragIn(pokemon,slot){
if(!this.scene.animating)return;
this.scene.$sprites[this.siden].append(this.$el);
this.recalculatePos(slot);


this.$el.css(this.scene.pos({
display:'block',
x:this.leftof(-100),
y:this.y,
z:this.z,
opacity:0},
this.sp));
this.delay(300).anim({
x:this.x,
y:this.y,
z:this.z,
time:400},
'decel');
if(!!this.scene.animating&&this.sp.shiny)BattleOtherAnims.shiny.anim(this.scene,[this]);
this.scene.waitFor(this.$el);
this.scene.timeOffset=700;

this.resetStatbar(pokemon,true);
this.scene.updateSidebar(pokemon.side);
this.$statbar.css({
display:'block',
left:this.statbarLeft+(this.siden?-100:100),
top:this.statbarTop,
opacity:0});

this.$statbar.delay(300).animate({
left:this.statbarLeft,
opacity:1},
400);

this.dogarsCheck(pokemon);
};_proto3.
animDragOut=function animDragOut(pokemon){
if(!this.scene.animating)return this.animUnsummon(pokemon,true);
if(this.$sub){
this.isSubActive=false;
var $sub=this.$sub;
$sub.animate(this.scene.pos({
x:this.leftof(100),
y:this.y,
z:this.z,
opacity:0,
time:400},
this.subsp),function(){
$sub.remove();
});
this.$sub=null;
}
this.anim({
x:this.leftof(100),
y:this.y,
z:this.z,
opacity:0,
time:400},
'accel');

this.updateStatbar(pokemon,true);
var $statbar=this.$statbar;
if($statbar){
this.$statbar=null;
$statbar.animate({
left:this.statbarLeft-(this.siden?-100:100),
opacity:0},
300/this.scene.acceleration,function(){
$statbar.remove();
});
}
};_proto3.
animUnsummon=function animUnsummon(pokemon,instant){
this.removeSub();
if(!this.scene.animating||instant){
this.$el.hide();
if(this.$statbar){
this.$statbar.remove();
this.$statbar=null;
}
return;
}
if(this.scene.gen<=4){
this.anim({
x:this.x,
y:this.y-25,
z:this.z,
scale:0,
opacity:0,
time:400/this.scene.acceleration});

}else{
this.anim({
x:this.x,
y:this.y-40,
z:this.z,
scale:0,
opacity:0,
time:400/this.scene.acceleration});

}
this.scene.showEffect('pokeball',{
opacity:1,
x:this.x,
y:this.y-40,
z:this.z,
scale:.7,
time:300/this.scene.acceleration},
{
opacity:0,
x:this.x,
y:this.y,
z:this.behind(50),
time:700/this.scene.acceleration},
'ballistic2');
if(this.scene.acceleration<3)this.scene.wait(600/this.scene.acceleration);

this.updateStatbar(pokemon,true);
var $statbar=this.$statbar;
if($statbar){
this.$statbar=null;
$statbar.animate({
left:this.statbarLeft+(this.siden?50:-50),
opacity:0},
300/this.scene.acceleration,function(){
$statbar.remove();
});
}
};_proto3.
animFaint=function animFaint(pokemon){var _this6=this;
this.removeSub();
if(!this.scene.animating){
this.$el.remove();
if(this.$statbar){
this.$statbar.remove();
this.$statbar=null;
}
return;
}
this.updateStatbar(pokemon,false,true);
this.scene.updateSidebar(pokemon.side);
if(this.cryurl){
BattleSound.playEffect(this.cryurl);
}
this.anim({
y:this.y-80,
opacity:0},
'accel');
this.scene.waitFor(this.$el);
this.$el.promise().done(function(){
_this6.$el.remove();
});

var $statbar=this.$statbar;
if($statbar){
this.$statbar=null;
$statbar.animate({
opacity:0},
300,function(){
$statbar.remove();
});
}
};_proto3.
animTransform=function animTransform(pokemon,isCustomAnim,isPermanent){var _this7=this;
if(!this.scene.animating&&!isPermanent)return;
var sp=Dex.getSpriteData(pokemon,this.isBackSprite?0:1,{
gen:this.scene.gen});

var oldsp=this.sp;
if(isPermanent){
this.oldsp=null;
}else if(!this.oldsp){
this.oldsp=oldsp;
}
this.sp=sp;
this.cryurl=sp.cryurl;

if(!this.scene.animating)return;
var speciesid=toId(pokemon.getSpecies());
var doCry=false;
var scene=this.scene;
if(isCustomAnim){
if(speciesid==='kyogreprimal'){
BattleOtherAnims.primalalpha.anim(scene,[this]);
doCry=true;
}else if(speciesid==='groudonprimal'){
BattleOtherAnims.primalomega.anim(scene,[this]);
doCry=true;
}else if(speciesid==='necrozmaultra'){
BattleOtherAnims.ultraburst.anim(scene,[this]);
doCry=true;
}else if(speciesid==='zygardecomplete'){
BattleOtherAnims.powerconstruct.anim(scene,[this]);
}else if(speciesid==='wishiwashischool'||speciesid==='greninjaash'){
BattleOtherAnims.schoolingin.anim(scene,[this]);
}else if(speciesid==='wishiwashi'){
BattleOtherAnims.schoolingout.anim(scene,[this]);
}else if(speciesid==='mimikyubusted'||speciesid==='mimikyubustedtotem'){

}else{
BattleOtherAnims.megaevo.anim(scene,[this]);
doCry=true;
}
}

var $newEl=$('<img src="'+sp.url+'" style="display:block;opacity:0;position:absolute"'+(sp.pixelated?' class="pixelated"':'')+' />');
$newEl.css(this.scene.pos({
x:this.x,
y:this.y,
z:this.z,
yscale:0,
xscale:0,
opacity:0},
sp));
this.$el.animate(this.scene.pos({
x:this.x,
y:this.y,
z:this.z,
yscale:0,
xscale:0,
opacity:0.3},
oldsp),300,function(){
if(_this7.cryurl&&doCry){
BattleSound.playEffect(_this7.cryurl);
}
_this7.$el.replaceWith($newEl);
_this7.$el=$newEl;
_this7.$el.animate(scene.pos({
x:_this7.x,
y:_this7.y,
z:_this7.z,
opacity:1},
sp),300);
});
this.scene.wait(500);

if(isPermanent){
this.scene.updateSidebar(pokemon.side);
this.resetStatbar(pokemon);
}else{
this.updateStatbar(pokemon);
}
};_proto3.

pokeEffect=function pokeEffect(id){
if(id==='protect'||id==='magiccoat'){
this.effects[id][0].anim({
scale:1.2,
opacity:1,
time:100}).
anim({
opacity:.4,
time:300});

}
};_proto3.
addEffect=function addEffect(id,instant){
if(id in this.effects){
this.pokeEffect(id);
return;
}
if(id==='substitute'){
this.animSub(instant);
}else if(id==='leechseed'){
var pos1={
display:'block',
x:this.x-30,
y:this.y-40,
z:this.z,
scale:.2,
opacity:.6};

var pos2={
display:'block',
x:this.x+40,
y:this.y-35,
z:this.z,
scale:.2,
opacity:.6};

var pos3={
display:'block',
x:this.x+20,
y:this.y-25,
z:this.z,
scale:.2,
opacity:.6};


var leechseed1=new Sprite(BattleEffects.energyball,pos1,this.scene);
var leechseed2=new Sprite(BattleEffects.energyball,pos2,this.scene);
var leechseed3=new Sprite(BattleEffects.energyball,pos3,this.scene);
this.scene.$spritesFront[this.siden].append(leechseed1.$el);
this.scene.$spritesFront[this.siden].append(leechseed2.$el);
this.scene.$spritesFront[this.siden].append(leechseed3.$el);
this.effects['leechseed']=[leechseed1,leechseed2,leechseed3];
}else if(id==='protect'||id==='magiccoat'){
var protect=new Sprite(BattleEffects.protect,{
display:'block',
x:this.x,
y:this.y,
z:this.behind(-15),
xscale:1,
yscale:0,
opacity:.1},
this.scene);
this.scene.$spritesFront[this.siden].append(protect.$el);
this.effects[id]=[protect];
protect.anim({
opacity:.9,
time:instant?0:400}).
anim({
opacity:.4,
time:instant?0:300});

}
};_proto3.

removeEffect=function removeEffect(id,instant){
if(id==='formechange')this.removeTransform();
if(id==='substitute')this.animSubFade(instant);
if(this.effects[id]){for(var _i12=0,_this$effects$id=
this.effects[id];_i12<_this$effects$id.length;_i12++){var sprite=_this$effects$id[_i12];sprite.destroy();}
delete this.effects[id];
}
};_proto3.
clearEffects=function clearEffects(){
for(var _id7 in this.effects){this.removeEffect(_id7,true);}
this.animSubFade(true);
this.removeTransform();
};_proto3.

dogarsCheck=function dogarsCheck(pokemon){
if(pokemon.side.n===1)return;

if(pokemon.species==='Koffing'&&pokemon.name.match(/dogars/i)){
this.scene.setBgm(-1);
}else if(this.scene.bgmNum===-1){
this.scene.setBgm(0);
}
};_proto3.




getStatbarHTML=function getStatbarHTML(pokemon){
var buf='<div class="statbar'+(this.siden?' lstatbar':' rstatbar')+'" style="display: none">';
buf+='<strong>'+(this.siden&&(this.scene.battle.ignoreOpponent||this.scene.battle.ignoreNicks)?pokemon.species:BattleLog.escapeHTML(pokemon.name));
var gender=pokemon.gender;
if(gender)buf+=' <img src="'+Dex.resourcePrefix+'fx/gender-'+gender.toLowerCase()+'.png" alt="'+gender+'" />';
buf+=pokemon.level===100?'':' <small>L'+pokemon.level+'</small>';

var symbol='';
if(pokemon.species.indexOf('-Mega')>=0)symbol='mega';else
if(pokemon.species==='Kyogre-Primal')symbol='alpha';else
if(pokemon.species==='Groudon-Primal')symbol='omega';
if(symbol){
buf+=' <img src="'+Dex.resourcePrefix+'sprites/misc/'+symbol+'.png" alt="'+symbol+'" style="vertical-align:text-bottom;" />';
}

buf+='</strong><div class="hpbar"><div class="hptext"></div><div class="hptextborder"></div><div class="prevhp"><div class="hp"></div></div><div class="status"></div>';
buf+='</div>';
return buf;
};_proto3.

resetStatbar=function resetStatbar(pokemon,startHidden){
if(this.$statbar){
this.$statbar.remove();
this.$statbar=null;
}
this.updateStatbar(pokemon,true);
if(!startHidden&&this.$statbar){
this.$statbar.css({
display:'block',
left:this.statbarLeft,
top:this.statbarTop,
opacity:1});

}
};_proto3.

updateStatbarIfExists=function updateStatbarIfExists(pokemon,updatePrevhp,updateHp){
if(this.$statbar){
this.updateStatbar(pokemon,updatePrevhp,updateHp);
}
};_proto3.

updateStatbar=function updateStatbar(pokemon,updatePrevhp,updateHp){
if(!this.scene.animating)return;
if(!pokemon.isActive()){
if(this.$statbar)this.$statbar.hide();
return;
}
if(!this.$statbar){
this.$statbar=$(this.getStatbarHTML(pokemon));
this.scene.$stat.append(this.$statbar);
updatePrevhp=true;
}
var hpcolor;
if(updatePrevhp||updateHp){
hpcolor=pokemon.getHPColor();
var w=pokemon.hpWidth(150);
var $hp=this.$statbar.find('.hp');
$hp.css({
width:w,
'border-right-width':w?1:0});

if(hpcolor==='g')$hp.removeClass('hp-yellow hp-red');else
if(hpcolor==='y')$hp.removeClass('hp-red').addClass('hp-yellow');else
$hp.addClass('hp-yellow hp-red');
this.updateHPText(pokemon);
}
if(updatePrevhp){
var $prevhp=this.$statbar.find('.prevhp');
$prevhp.css('width',pokemon.hpWidth(150)+1);
if(hpcolor==='g')$prevhp.removeClass('prevhp-yellow prevhp-red');else
if(hpcolor==='y')$prevhp.removeClass('prevhp-red').addClass('prevhp-yellow');else
$prevhp.addClass('prevhp-yellow prevhp-red');
}
var status='';
if(pokemon.status==='brn'){
status+='<span class="brn">BRN</span> ';
}else if(pokemon.status==='psn'){
status+='<span class="psn">PSN</span> ';
}else if(pokemon.status==='tox'){
status+='<span class="psn">TOX</span> ';
}else if(pokemon.status==='slp'){
status+='<span class="slp">SLP</span> ';
}else if(pokemon.status==='par'){
status+='<span class="par">PAR</span> ';
}else if(pokemon.status==='frz'){
status+='<span class="frz">FRZ</span> ';
}
if(pokemon.volatiles.typechange&&pokemon.volatiles.typechange[1]){
var types=pokemon.volatiles.typechange[1].split('/');
status+='<img src="'+Dex.resourcePrefix+'sprites/types/'+encodeURIComponent(types[0])+'.png" alt="'+types[0]+'" class="pixelated" /> ';
if(types[1]){
status+='<img src="'+Dex.resourcePrefix+'sprites/types/'+encodeURIComponent(types[1])+'.png" alt="'+types[1]+'" class="pixelated" /> ';
}
}
if(pokemon.volatiles.typeadd){
var type=pokemon.volatiles.typeadd[1];
status+='+<img src="'+Dex.resourcePrefix+'sprites/types/'+type+'.png" alt="'+type+'" class="pixelated" /> ';
}
for(var stat in pokemon.boosts){
if(pokemon.boosts[stat]){
status+='<span class="'+pokemon.getBoostType(stat)+'">'+pokemon.getBoost(stat)+'</span> ';
}
}
var statusTable={
formechange:'',
typechange:'',
typeadd:'',
trapped:'',
throatchop:'<span class="bad">Throat&nbsp;Chop</span> ',
confusion:'<span class="bad">Confused</span> ',
healblock:'<span class="bad">Heal&nbsp;Block</span> ',
yawn:'<span class="bad">Drowsy</span> ',
flashfire:'<span class="good">Flash&nbsp;Fire</span> ',
imprison:'<span class="good">Imprisoning&nbsp;foe</span> ',
autotomize:'<span class="neutral">Lightened</span> ',
miracleeye:'<span class="bad">Miracle&nbsp;Eye</span> ',
foresight:'<span class="bad">Foresight</span> ',
telekinesis:'<span class="neutral">Telekinesis</span> ',
transform:'<span class="neutral">Transformed</span> ',
powertrick:'<span class="neutral">Power&nbsp;Trick</span> ',
curse:'<span class="bad">Curse</span> ',
nightmare:'<span class="bad">Nightmare</span> ',
attract:'<span class="bad">Attract</span> ',
torment:'<span class="bad">Torment</span> ',
taunt:'<span class="bad">Taunt</span> ',
disable:'<span class="bad">Disable</span> ',
embargo:'<span class="bad">Embargo</span> ',
ingrain:'<span class="good">Ingrain</span> ',
aquaring:'<span class="good">Aqua&nbsp;Ring</span> ',
stockpile1:'<span class="good">Stockpile</span> ',
stockpile2:'<span class="good">Stockpile&times;2</span> ',
stockpile3:'<span class="good">Stockpile&times;3</span> ',
perish0:'<span class="bad">Perish&nbsp;now</span>',
perish1:'<span class="bad">Perish&nbsp;next&nbsp;turn</span> ',
perish2:'<span class="bad">Perish&nbsp;in&nbsp;2</span> ',
perish3:'<span class="bad">Perish&nbsp;in&nbsp;3</span> ',
airballoon:'<span class="good">Balloon</span> ',
leechseed:'<span class="bad">Leech&nbsp;Seed</span> ',
encore:'<span class="bad">Encore</span> ',
mustrecharge:'<span class="bad">Must&nbsp;recharge</span> ',
bide:'<span class="good">Bide</span> ',
magnetrise:'<span class="good">Magnet&nbsp;Rise</span> ',
smackdown:'<span class="bad">Smack&nbsp;Down</span> ',
focusenergy:'<span class="good">Focus&nbsp;Energy</span> ',
slowstart:'<span class="bad">Slow&nbsp;Start</span> ',
doomdesire:'',
futuresight:'',
mimic:'<span class="good">Mimic</span> ',
watersport:'<span class="good">Water&nbsp;Sport</span> ',
mudsport:'<span class="good">Mud&nbsp;Sport</span> ',
substitute:'',

uproar:'<span class="neutral">Uproar</span>',
rage:'<span class="neutral">Rage</span>',
roost:'<span class="neutral">Landed</span>',
protect:'<span class="good">Protect</span>',
quickguard:'<span class="good">Quick&nbsp;Guard</span>',
wideguard:'<span class="good">Wide&nbsp;Guard</span>',
craftyshield:'<span class="good">Crafty&nbsp;Shield</span>',
matblock:'<span class="good">Mat&nbsp;Block</span>',
helpinghand:'<span class="good">Helping&nbsp;Hand</span>',
magiccoat:'<span class="good">Magic&nbsp;Coat</span>',
destinybond:'<span class="good">Destiny&nbsp;Bond</span>',
snatch:'<span class="good">Snatch</span>',
grudge:'<span class="good">Grudge</span>',
endure:'<span class="good">Endure</span>',
focuspunch:'<span class="neutral">Focusing</span>',
shelltrap:'<span class="neutral">Trap&nbsp;set</span>',
powder:'<span class="bad">Powder</span>',
electrify:'<span class="bad">Electrify</span>',
ragepowder:'<span class="good">Rage&nbsp;Powder</span>',
followme:'<span class="good">Follow&nbsp;Me</span>',
instruct:'<span class="neutral">Instruct</span>',
beakblast:'<span class="neutral">Beak&nbsp;Blast</span>',
laserfocus:'<span class="good">Laser&nbsp;Focus</span>',
spotlight:'<span class="neutral">Spotlight</span>',
itemremoved:'',

bind:'<span class="bad">Bind</span>',
clamp:'<span class="bad">Clamp</span>',
firespin:'<span class="bad">Fire Spin</span>',
infestation:'<span class="bad">Infestation</span>',
magmastorm:'<span class="bad">Magma Storm</span>',
sandtomb:'<span class="bad">Sand Tomb</span>',
whirlpool:'<span class="bad">Whirlpool</span>',
wrap:'<span class="bad">Wrap</span>',

lightscreen:'<span class="good">Light&nbsp;Screen</span>',
reflect:'<span class="good">Reflect</span>'};

for(var i in pokemon.volatiles){
if(typeof statusTable[i]==='undefined')status+='<span class="neutral">[['+i+']]</span>';else
status+=statusTable[i];
}
for(var _i13 in pokemon.turnstatuses){
if(_i13==='roost'&&!pokemon.getTypeList().includes('Flying'))continue;
if(typeof statusTable[_i13]==='undefined')status+='<span class="neutral">[['+_i13+']]</span>';else
status+=statusTable[_i13];
}
for(var _i14 in pokemon.movestatuses){
if(typeof statusTable[_i14]==='undefined')status+='<span class="neutral">[['+_i14+']]</span>';else
status+=statusTable[_i14];
}
var statusbar=this.$statbar.find('.status');
statusbar.html(status);
};_proto3.

updateHPText=function updateHPText(pokemon){
if(!this.$statbar)return;
var $hptext=this.$statbar.find('.hptext');
var $hptextborder=this.$statbar.find('.hptextborder');
if(pokemon.maxhp===48||this.scene.battle.hardcoreMode&&pokemon.maxhp===100){
$hptext.hide();
$hptextborder.hide();
}else if(this.scene.battle.hardcoreMode){
$hptext.html(pokemon.hp+'/');
$hptext.show();
$hptextborder.show();
}else{
$hptext.html(pokemon.hpWidth(100)+'%');
$hptext.show();
$hptextborder.show();
}
};return PokemonSprite;}(Sprite);










Object.assign($.easing,{
ballisticUp:function(x,t,b,c,d){
return-3*x*x+4*x;
},
ballisticDown:function(x,t,b,c,d){
x=1-x;
return 1-(-3*x*x+4*x);
},
quadUp:function(x,t,b,c,d){
x=1-x;
return 1-x*x;
},
quadDown:function(x,t,b,c,d){
return x*x;
}});


var BattleSound=new(_temp=function(){function _temp(){this.
effectCache={};this.


bgmCache={};this.
bgm=null;this.


soundPlaceholder={
play:function(){return this;},
pause:function(){return this;},
stop:function(){return this;},
resume:function(){return this;},
setVolume:function(){return this;},
onposition:function(){return this;},
isSoundPlaceholder:true};this.



effectVolume=50;this.
bgmVolume=50;this.
muted=false;}var _proto4=_temp.prototype;_proto4.

loadEffect=function loadEffect(url){
if(this.effectCache[url]&&!this.effectCache[url].isSoundPlaceholder){
return this.effectCache[url];
}
try{
this.effectCache[url]=soundManager.createSound({
id:url,
url:Dex.resourcePrefix+url,
volume:this.effectVolume});

}catch(e){}
if(!this.effectCache[url]){
this.effectCache[url]=this.soundPlaceholder;
}
return this.effectCache[url];
};_proto4.
playEffect=function playEffect(url){
if(!this.muted)this.loadEffect(url).setVolume(this.effectVolume).play();
};_proto4.


loadBgm=function loadBgm(url,loopstart,loopend){
if(this.bgmCache[url]){
if(!this.bgmCache[url].isSoundPlaceholder||loopstart===undefined){
return this.bgmCache[url];
}
}
try{
this.bgmCache[url]=soundManager.createSound({
id:url,
url:Dex.resourcePrefix+url,
volume:this.bgmVolume});

}catch(e){}
if(!this.bgmCache[url]){


return this.bgmCache[url]=this.soundPlaceholder;
}
this.bgmCache[url].onposition(loopend,function(evP){
this.setPosition(this.position-(loopend-loopstart));
});
return this.bgmCache[url];
};_proto4.
playBgm=function playBgm(url,loopstart,loopstop){
if(this.bgm===this.loadBgm(url,loopstart,loopstop)){
if(!this.bgm.paused&&this.bgm.playState){
return;
}
}else{
this.stopBgm();
}
try{
this.bgm=this.loadBgm(url,loopstart,loopstop).setVolume(this.bgmVolume);
if(!this.muted){
if(this.bgm.paused){
this.bgm.resume();
}else{
this.bgm.play();
}
}
}catch(e){}
};_proto4.
pauseBgm=function pauseBgm(){
if(this.bgm){
this.bgm.pause();
}
};_proto4.
stopBgm=function stopBgm(){
if(this.bgm){
this.bgm.stop();
this.bgm=null;
}
};_proto4.


setMute=function setMute(muted){
muted=!!muted;
if(this.muted===muted)return;
this.muted=muted;
if(muted){
if(this.bgm)this.bgm.pause();
}else{
if(this.bgm)this.bgm.play();
}
};_proto4.

loudnessPercentToAmplitudePercent=function loudnessPercentToAmplitudePercent(loudnessPercent){

var decibels=10*Math.log(loudnessPercent/100)/Math.log(2);
return Math.pow(10,decibels/20)*100;
};_proto4.
setBgmVolume=function setBgmVolume(bgmVolume){
this.bgmVolume=this.loudnessPercentToAmplitudePercent(bgmVolume);
if(this.bgm){
try{
this.bgm.setVolume(this.bgmVolume);
}catch(e){}
}
};_proto4.
setEffectVolume=function setEffectVolume(effectVolume){
this.effectVolume=this.loudnessPercentToAmplitudePercent(effectVolume);
};return _temp;}(),_temp)();









var BattleEffects={
wisp:{
url:'wisp.png',
w:100,h:100},

poisonwisp:{
url:'poisonwisp.png',
w:100,h:100},

waterwisp:{
url:'waterwisp.png',
w:100,h:100},

mudwisp:{
url:'mudwisp.png',
w:100,h:100},

blackwisp:{
url:'blackwisp.png',
w:100,h:100},

fireball:{
url:'fireball.png',
w:64,h:64},

bluefireball:{
url:'bluefireball.png',
w:64,h:64},

icicle:{
url:'icicle.png',
w:80,h:60},

lightning:{
url:'lightning.png',
w:41,h:229},

rocks:{
url:'rocks.png',
w:100,h:100},

rock1:{
url:'rock1.png',
w:64,h:80},

rock2:{
url:'rock2.png',
w:66,h:72},

rock3:{
url:'rock3.png',
w:66,h:72},

leaf1:{
url:'leaf1.png',
w:32,h:26},

leaf2:{
url:'leaf2.png',
w:40,h:26},

bone:{
url:'bone.png',
w:29,h:29},

caltrop:{
url:'caltrop.png',
w:80,h:80},

poisoncaltrop:{
url:'poisoncaltrop.png',
w:80,h:80},

shadowball:{
url:'shadowball.png',
w:100,h:100},

energyball:{
url:'energyball.png',
w:100,h:100},

electroball:{
url:'electroball.png',
w:100,h:100},

mistball:{
url:'mistball.png',
w:100,h:100},

iceball:{
url:'iceball.png',
w:100,h:100},

flareball:{
url:'flareball.png',
w:100,h:100},

pokeball:{
url:'pokeball.png',
w:24,h:24},

fist:{
url:'fist.png',
w:55,h:49},

fist1:{
url:'fist1.png',
w:49,h:55},

foot:{
url:'foot.png',
w:50,h:75},

topbite:{
url:'topbite.png',
w:108,h:64},

bottombite:{
url:'bottombite.png',
w:108,h:64},

web:{
url:'web.png',
w:120,h:122},

leftclaw:{
url:'leftclaw.png',
w:44,h:60},

rightclaw:{
url:'rightclaw.png',
w:44,h:60},

leftslash:{
url:'leftslash.png',
w:57,h:56},

rightslash:{
url:'rightslash.png',
w:57,h:56},

leftchop:{
url:'leftchop.png',
w:100,h:130},

rightchop:{
url:'rightchop.png',
w:100,h:130},

angry:{
url:'angry.png',
w:30,h:30},

heart:{
url:'heart.png',
w:30,h:30},

pointer:{
url:'pointer.png',
w:100,h:100},

sword:{
url:'sword.png',
w:48,h:100},

impact:{
url:'impact.png',
w:127,h:119},

stare:{
url:'stare.png',
w:100,h:35},

shine:{
url:'shine.png',
w:127,h:119},

feather:{
url:'feather.png',
w:100,h:38},

shell:{
url:'shell.png',
w:100,h:91.5},

petal:{
url:'petal.png',
w:60,h:60},

gear:{
url:'gear.png',
w:100,h:100},

alpha:{
url:'alpha.png',
w:80,h:80},

omega:{
url:'omega.png',
w:80,h:80},

rainbow:{
url:'rainbow.png',
w:128,h:128},

zsymbol:{
url:'z-symbol.png',
w:150,h:100},

ultra:{
url:'ultra.png',
w:113,h:165},

hitmark:{
url:'hitmarker.png',
w:100,h:100},

protect:{
rawHTML:'<div class="turnstatus-protect" style="display:none;position:absolute" />',
w:100,h:70},

auroraveil:{
rawHTML:'<div class="sidecondition-auroraveil" style="display:none;position:absolute" />',
w:100,h:50},

reflect:{
rawHTML:'<div class="sidecondition-reflect" style="display:none;position:absolute" />',
w:100,h:50},

safeguard:{
rawHTML:'<div class="sidecondition-safeguard" style="display:none;position:absolute" />',
w:100,h:50},

lightscreen:{
rawHTML:'<div class="sidecondition-lightscreen" style="display:none;position:absolute" />',
w:100,h:50},

mist:{
rawHTML:'<div class="sidecondition-mist" style="display:none;position:absolute" />',
w:100,h:50}};


(function(){
if(!window.Dex||!Dex.resourcePrefix)return;
for(var _id8 in BattleEffects){
if(!BattleEffects[_id8].url)continue;
BattleEffects[_id8].url=Dex.fxPrefix+BattleEffects[_id8].url;
}
})();
var BattleBackdropsThree=[
'bg-gen3.png',
'bg-gen3-cave.png',
'bg-gen3-ocean.png',
'bg-gen3-sand.png',
'bg-gen3-forest.png',
'bg-gen3-arena.png'];

var BattleBackdropsFour=[
'bg-gen4.png',
'bg-gen4-cave.png',
'bg-gen4-snow.png',
'bg-gen4-indoors.png',
'bg-gen4-water.png'];

var BattleBackdropsFive=[
'bg-beach.png',
'bg-beachshore.png',
'bg-desert.png',
'bg-meadow.png',
'bg-thunderplains.png',
'bg-city.png',
'bg-earthycave.png',
'bg-mountain.png',
'bg-volcanocave.png',
'bg-dampcave.png',
'bg-forest.png',
'bg-river.png',
'bg-deepsea.png',
'bg-icecave.png',
'bg-route.png'];

var BattleBackdrops=[
'bg-aquacordetown.jpg',
'bg-beach.jpg',
'bg-city.jpg',
'bg-dampcave.jpg',
'bg-darkbeach.jpg',
'bg-darkcity.jpg',
'bg-darkmeadow.jpg',
'bg-deepsea.jpg',
'bg-desert.jpg',
'bg-earthycave.jpg',
'bg-elite4drake.jpg',
'bg-forest.jpg',
'bg-icecave.jpg',
'bg-leaderwallace.jpg',
'bg-library.jpg',
'bg-meadow.jpg',
'bg-orasdesert.jpg',
'bg-orassea.jpg',
'bg-skypillar.jpg'];


var BattleOtherAnims={
hitmark:{
anim:function(scene,_ref2){var attacker=_ref2[0];
scene.showEffect('hitmark',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:1},
{
opacity:0.5,
time:250},
'linear','fade');
}},

attack:{
anim:function(scene,_ref3){var attacker=_ref3[0],defender=_ref3[1];
scene.showEffect('wisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.1,
opacity:1},
{
x:defender.x,
y:defender.y,
z:defender.behind(40),
scale:1,
opacity:0.5},
'linear');
}},

contactattack:{
anim:function(scene,_ref4){var attacker=_ref4[0],defender=_ref4[1];
attacker.anim({
x:defender.x,
y:defender.y+80,
z:defender.behind(-30),
time:400},
'ballistic');
attacker.anim({
x:defender.x,
y:defender.y+5,
z:defender.z,
time:100});

attacker.anim({
time:500},
'ballistic2Back');
defender.delay(450);
defender.anim({
z:defender.behind(20),
time:100},
'swing');
defender.anim({
time:300},
'swing');
scene.wait(500);
}},

xattack:{
anim:function(scene,_ref5){var attacker=_ref5[0],defender=_ref5[1];
attacker.anim({
x:defender.leftof(-30),
y:defender.y+80,
z:defender.behind(-30),
time:400},
'ballistic');
attacker.anim({
x:defender.leftof(30),
y:defender.y+5,
z:defender.z,
time:100});

attacker.anim({
x:defender.leftof(30),
y:defender.y+80,
z:defender.behind(-30),
time:200},
'ballisticUp');
attacker.anim({
x:defender.leftof(-30),
y:defender.y+5,
z:defender.z,
time:100});

attacker.anim({
time:500},
'ballistic2Back');
defender.delay(450);
defender.anim({
z:defender.behind(20),
time:100},
'swing');
defender.anim({
time:200},
'swing');
defender.anim({
z:defender.behind(20),
time:100},
'swing');
defender.anim({
time:300},
'swing');
}},

slashattack:{
anim:function(scene,_ref6){var attacker=_ref6[0],defender=_ref6[1];
attacker.anim({
x:defender.x,
y:defender.y+80,
z:defender.behind(-30),
time:400},
'ballistic');
attacker.anim({
x:defender.x,
y:defender.y+5,
z:defender.z,
time:100});

attacker.anim({
time:500},
'ballistic2Back');
defender.delay(450);
defender.anim({
z:defender.behind(20),
time:100},
'swing');
defender.anim({
time:300},
'swing');

scene.showEffect('rightslash',{
x:defender.x,
y:defender.y,
z:defender.z,
scale:1,
opacity:1,
time:500},
{
scale:3,
opacity:0,
time:800},
'linear','fade');
}},

clawattack:{
anim:function(scene,_ref7){var attacker=_ref7[0],defender=_ref7[1];
attacker.anim({
x:defender.leftof(-30),
y:defender.y+80,
z:defender.behind(-30),
time:400},
'ballistic');
attacker.anim({
x:defender.leftof(30),
y:defender.y+5,
z:defender.z,
time:100});

attacker.anim({
x:defender.leftof(30),
y:defender.y+80,
z:defender.behind(-30),
time:200},
'ballisticUp');
attacker.anim({
x:defender.leftof(-30),
y:defender.y+5,
z:defender.z,
time:100});

attacker.anim({
time:500},
'ballistic2Back');
defender.delay(450);
defender.anim({
z:defender.behind(20),
time:100},
'swing');
defender.anim({
time:200},
'swing');
defender.anim({
z:defender.behind(20),
time:100},
'swing');
defender.anim({
time:300},
'swing');

scene.showEffect('leftclaw',{
x:defender.x-20,
y:defender.y+20,
z:defender.z,
scale:0,
opacity:1,
time:400},
{
x:defender.x-20,
y:defender.y+20,
z:defender.z,
scale:3,
opacity:0,
time:700},
'linear','fade');
scene.showEffect('leftclaw',{
x:defender.x-20,
y:defender.y-20,
z:defender.z,
scale:0,
opacity:1,
time:400},
{
x:defender.x-20,
y:defender.y-20,
z:defender.z,
scale:3,
opacity:0,
time:700},
'linear','fade');
scene.showEffect('rightclaw',{
x:defender.x+20,
y:defender.y+20,
z:defender.z,
scale:0,
opacity:1,
time:700},
{
x:defender.x+20,
y:defender.y+20,
z:defender.z,
scale:3,
opacity:0,
time:1000},
'linear','fade');
scene.showEffect('rightclaw',{
x:defender.x+20,
y:defender.y-20,
z:defender.z,
scale:0,
opacity:1,
time:700},
{
x:defender.x+20,
y:defender.y-20,
z:defender.z,
scale:3,
opacity:0,
time:1000},
'linear','fade');
}},

punchattack:{
anim:function(scene,_ref8){var attacker=_ref8[0],defender=_ref8[1];
scene.showEffect('wisp',{
x:defender.x,
y:defender.y,
z:defender.z,
scale:0,
opacity:1,
time:400},
{
x:defender.leftof(-20),
y:defender.y,
z:defender.behind(20),
scale:3,
opacity:0,
time:700},
'linear');
scene.showEffect('wisp',{
x:defender.x,
y:defender.y,
z:defender.z,
scale:0,
opacity:1,
time:500},
{
x:defender.leftof(-20),
y:defender.y,
z:defender.behind(20),
scale:3,
opacity:0,
time:800},
'linear');
scene.showEffect('fist',{
x:defender.x,
y:defender.y,
z:defender.z,
scale:1,
opacity:1,
time:400},
{
x:defender.leftof(-20),
y:defender.y,
z:defender.behind(20),
scale:2,
opacity:0,
time:800},
'linear');
attacker.anim({
x:defender.leftof(20),
y:defender.y,
z:defender.behind(-20),
time:400},
'ballistic2Under');
attacker.anim({
x:defender.x,
y:defender.y,
z:defender.z,
time:50});

attacker.anim({
time:500},
'ballistic2');
defender.delay(425);
defender.anim({
x:defender.leftof(-15),
y:defender.y,
z:defender.behind(15),
time:50},
'swing');
defender.anim({
time:300},
'swing');
}},

bite:{
anim:function(scene,_ref9){var attacker=_ref9[0],defender=_ref9[1];
scene.showEffect('topbite',{
x:defender.x,
y:defender.y+50,
z:defender.z,
scale:0.5,
opacity:0,
time:370},
{
x:defender.x,
y:defender.y+10,
z:defender.z,
scale:0.5,
opacity:1,
time:500},
'linear','fade');
scene.showEffect('bottombite',{
x:defender.x,
y:defender.y-50,
z:defender.z,
scale:0.5,
opacity:0,
time:370},
{
x:defender.x,
y:defender.y-10,
z:defender.z,
scale:0.5,
opacity:1,
time:500},
'linear','fade');
}},

kick:{
anim:function(scene,_ref10){var attacker=_ref10[0],defender=_ref10[1];
scene.showEffect('foot',{
x:defender.x,
y:defender.y,
z:defender.z,
scale:1,
opacity:1,
time:400},
{
x:defender.x,
y:defender.y-20,
z:defender.behind(15),
scale:2,
opacity:0,
time:800},
'linear');
}},

fastattack:{
anim:function(scene,_ref11){var attacker=_ref11[0],defender=_ref11[1];
scene.showEffect('wisp',{
x:defender.x,
y:defender.y,
z:defender.z,
scale:0,
opacity:0.5,
time:260},
{
scale:2,
opacity:0,
time:560},
'linear');
scene.showEffect('wisp',{
x:defender.x,
y:defender.y,
z:defender.z,
scale:0,
opacity:0.5,
time:310},
{
scale:2,
opacity:0,
time:610},
'linear');
scene.showEffect(attacker.sp,{
x:attacker.x,
y:attacker.y,
z:attacker.z,
opacity:0.3,
time:50},
{
x:defender.x,
y:defender.y,
z:defender.behind(70),
time:350},
'accel','fade');
scene.showEffect(attacker.sp,{
x:attacker.x,
y:attacker.y,
z:attacker.z,
opacity:0.3,
time:100},
{
x:defender.x,
y:defender.y,
z:defender.behind(70),
time:400},
'accel','fade');
attacker.anim({
x:defender.x,
y:defender.y,
z:defender.behind(70),
time:300,
opacity:0.5},
'accel');
attacker.anim({
x:defender.x,
y:defender.x,
z:defender.behind(100),
opacity:0,
time:100},
'linear');
attacker.anim({
x:attacker.x,
y:attacker.y,
z:attacker.behind(70),
opacity:0,
time:1},
'linear');
attacker.anim({
opacity:1,
time:500},
'decel');
defender.delay(260);
defender.anim({
z:defender.behind(30),
time:100},
'swing');
defender.anim({
time:300},
'swing');
}},

sneakattack:{
anim:function(scene,_ref12){var attacker=_ref12[0],defender=_ref12[1];
attacker.anim({
x:attacker.leftof(-20),
y:attacker.y,
z:attacker.behind(-20),
opacity:0,
time:200},
'linear');
attacker.anim({
x:defender.x,
y:defender.y,
z:defender.behind(-120),
opacity:0,
time:1},
'linear');
attacker.anim({
x:defender.x,
y:defender.y,
z:defender.behind(40),
opacity:1,
time:250},
'linear');
attacker.anim({
x:defender.x,
y:defender.y,
z:defender.behind(-5),
opacity:0,
time:300},
'linear');
attacker.anim({
opacity:0,
time:1},
'linear');
attacker.anim({
time:300,
opacity:1},
'linear');
defender.delay(330);
defender.anim({
z:defender.behind(20),
time:100},
'swing');
defender.anim({
time:300},
'swing');
}},

spinattack:{
anim:function(scene,_ref13){var attacker=_ref13[0],defender=_ref13[1];
attacker.anim({
x:defender.x,
y:defender.y+60,
z:defender.behind(-30),
time:400},
'ballistic2');
attacker.anim({
x:defender.x,
y:defender.y+5,
z:defender.z,
time:100});

attacker.anim({
time:500},
'ballistic2');
defender.delay(450);
defender.anim({
z:defender.behind(20),
time:100},
'swing');
defender.anim({
time:300},
'swing');
scene.wait(500);
}},

bound:{
anim:function(scene,_ref14){var attacker=_ref14[0];
scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y+15,
z:attacker.z,
scale:0.7,
xscale:2,
opacity:0.3,
time:0},
{
scale:0.4,
xscale:1,
opacity:0.1,
time:500},
'decel','fade');
scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y-5,
z:attacker.z,
scale:0.7,
xscale:2,
opacity:0.3,
time:50},
{
scale:0.4,
xscale:1,
opacity:0.1,
time:550},
'decel','fade');
scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y-20,
z:attacker.z,
scale:0.7,
xscale:2,
opacity:0.3,
time:100},
{
scale:0.4,
xscale:1,
opacity:0.1,
time:600},
'decel','fade');
attacker.anim({
y:attacker.y+15,
z:attacker.behind(10),
yscale:1.3,
time:200},
'swing');
attacker.anim({
time:200},
'swing');
attacker.delay(25);
attacker.anim({
x:attacker.leftof(-10),
y:attacker.y+15,
z:attacker.behind(5),
yscale:1.3,
time:200},
'swing');
attacker.anim({
time:200},
'swing');
}},

selfstatus:{
anim:function(scene,_ref15){var attacker=_ref15[0];
scene.showEffect('wisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:2,
opacity:0.2,
time:0},
{
scale:0,
opacity:1,
time:300},
'linear');
scene.showEffect('wisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:2,
opacity:0.2,
time:200},
{
scale:0,
opacity:1,
time:500},
'linear');
}},

lightstatus:{
anim:function(scene,_ref16){var attacker=_ref16[0];
scene.showEffect('electroball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:2,
opacity:0.1,
time:0},
{
scale:0,
opacity:0.5,
time:600},
'linear');
}},

chargestatus:{
anim:function(scene,_ref17){var attacker=_ref17[0];
scene.showEffect('electroball',{
x:attacker.x-60,
y:attacker.y+40,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:0},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:300},
'linear','fade');
scene.showEffect('electroball',{
x:attacker.x+60,
y:attacker.y-5,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:100},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:300},
'linear','fade');
scene.showEffect('electroball',{
x:attacker.x-30,
y:attacker.y+60,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:100},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:400},
'linear','fade');
scene.showEffect('electroball',{
x:attacker.x+20,
y:attacker.y-50,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:100},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:400},
'linear','fade');
scene.showEffect('electroball',{
x:attacker.x-70,
y:attacker.y-50,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:200},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:500},
'linear','fade');
}},

heal:{
anim:function(scene,_ref18){var attacker=_ref18[0];
scene.showEffect('iceball',{
x:attacker.x+30,
y:attacker.y+5,
z:attacker.z,
scale:0.1,
opacity:0.7,
time:200},
{
x:attacker.x+40,
y:attacker.y+10,
opacity:0,
time:600},
'accel');
scene.showEffect('iceball',{
x:attacker.x-30,
y:attacker.y-10,
z:attacker.z,
scale:0.1,
opacity:0.7,
time:300},
{
x:attacker.x-40,
y:attacker.y-20,
opacity:0,
time:700},
'accel');
scene.showEffect('iceball',{
x:attacker.x+15,
y:attacker.y+10,
z:attacker.z,
scale:0.1,
opacity:0.7,
time:400},
{
x:attacker.x+25,
y:attacker.y+20,
opacity:0,
time:800},
'accel');
scene.showEffect('iceball',{
x:attacker.x-15,
y:attacker.y-30,
z:attacker.z,
scale:0.1,
opacity:0.7,
time:500},
{
x:attacker.x-25,
y:attacker.y-40,
opacity:0,
time:900},
'accel');
}},

shiny:{
anim:function(scene,_ref19){var attacker=_ref19[0];
scene.backgroundEffect('#000000',800,0.3,100);
scene.showEffect('shine',{
x:attacker.x+5,
y:attacker.y+20,
z:attacker.z,
scale:0.1,
opacity:0.7,
time:450},
{
y:attacker.y+35,
opacity:0,
time:675},
'decel');
scene.showEffect('shine',{
x:attacker.x+15,
y:attacker.y+20,
z:attacker.z,
scale:0.2,
opacity:0.7,
time:475},
{
x:attacker.x+25,
y:attacker.y+30,
opacity:0,
time:700},
'decel');
scene.showEffect('shine',{
x:attacker.x-15,
y:attacker.y+20,
z:attacker.z,
scale:0.2,
opacity:0.7,
time:500},
{
x:attacker.x-25,
y:attacker.y+30,
opacity:0,
time:725},
'decel');
scene.showEffect('shine',{
x:attacker.x-20,
y:attacker.y+5,
z:attacker.z,
scale:0.2,
opacity:0.7,
time:550},
{
x:attacker.x-30,
y:attacker.y-5,
opacity:0,
time:775},
'decel');
scene.showEffect('shine',{
x:attacker.x+15,
y:attacker.y+10,
z:attacker.z,
scale:0.2,
opacity:0.7,
time:650},
{
x:attacker.x+35,
y:attacker.y-5,
opacity:0,
time:875},
'decel');
scene.showEffect('shine',{
x:attacker.x+5,
y:attacker.y-5,
z:attacker.z,
scale:0.2,
opacity:0.7,
time:675},
{
y:attacker.y-20,
opacity:0,
time:900},
'decel');
}},

flight:{
anim:function(scene,_ref20){var attacker=_ref20[0],defender=_ref20[1];
attacker.anim({
x:attacker.leftof(-200),
y:attacker.y+80,
z:attacker.z,
opacity:0,
time:350},
'accel');
attacker.anim({
x:defender.leftof(-200),
y:defender.y+80,
z:defender.z,
time:1},
'linear');
attacker.anim({
x:defender.x,
y:defender.y,
z:defender.z,
opacity:1,
time:350},
'accel');
scene.showEffect('wisp',{
x:defender.x,
y:defender.y,
z:defender.z,
scale:0,
opacity:0.5,
time:700},
{
scale:2,
opacity:0,
time:900},
'linear');
attacker.anim({
x:defender.leftof(100),
y:defender.y-40,
z:defender.z,
opacity:0,
time:175});

attacker.anim({
x:attacker.x,
y:attacker.y+40,
z:attacker.behind(40),
time:1});

attacker.anim({
x:attacker.x,
y:attacker.y,
z:attacker.z,
time:250},
'decel');
defender.delay(700);
defender.anim({
z:defender.behind(20),
time:100},
'swing');
defender.anim({
time:300},
'swing');
}},

shake:{
anim:function(scene,_ref21){var attacker=_ref21[0];
attacker.anim({x:attacker.x-10,time:200});
attacker.anim({x:attacker.x+10,time:300});
attacker.anim({x:attacker.x,time:200});
}},

dance:{
anim:function(scene,_ref22){var attacker=_ref22[0];
attacker.anim({x:attacker.x-10});
attacker.anim({x:attacker.x+10});
attacker.anim({x:attacker.x});
}},

consume:{
anim:function(scene,_ref23){var defender=_ref23[0];
scene.showEffect('wisp',{
x:defender.leftof(-25),
y:defender.y+40,
z:defender.behind(-20),
scale:0.5,
opacity:1},
{
x:defender.leftof(-15),
y:defender.y+35,
z:defender.z,
scale:0,
opacity:0.2,
time:500},
'swing','fade');

defender.delay(400);
defender.anim({
y:defender.y+5,
yscale:1.1,
time:200},
'swing');
defender.anim({
time:200},
'swing');
defender.anim({
y:defender.y+5,
yscale:1.1,
time:200},
'swing');
defender.anim({
time:200},
'swing');
}},

leech:{
anim:function(scene,_ref24){var attacker=_ref24[0],defender=_ref24[1];
scene.showEffect('energyball',{
x:defender.x-30,
y:defender.y-40,
z:defender.z,
scale:0.2,
opacity:0.7,
time:0},
{
x:attacker.x,
y:attacker.y,
z:attacker.z,
time:500,
opacity:0.1},
'ballistic2','fade');
scene.showEffect('energyball',{
x:defender.x+40,
y:defender.y-35,
z:defender.z,
scale:0.2,
opacity:0.7,
time:50},
{
x:attacker.x,
y:attacker.y,
z:attacker.z,
time:550,
opacity:0.1},
'linear','fade');
scene.showEffect('energyball',{
x:defender.x+20,
y:defender.y-25,
z:defender.z,
scale:0.2,
opacity:0.7,
time:100},
{
x:attacker.x,
y:attacker.y,
z:attacker.z,
time:600,
opacity:0.1},
'ballistic2Under','fade');
}},

drain:{
anim:function(scene,_ref25){var attacker=_ref25[0],defender=_ref25[1];
scene.showEffect('energyball',{
x:defender.x,
y:defender.y,
z:defender.z,
scale:0.6,
opacity:0.6,
time:0},
{
x:attacker.x,
y:attacker.y,
z:attacker.z,
time:500,
opacity:0},
'ballistic2');
scene.showEffect('energyball',{
x:defender.x,
y:defender.y,
z:defender.z,
scale:0.6,
opacity:0.6,
time:50},
{
x:attacker.x,
y:attacker.y,
z:attacker.z,
time:550,
opacity:0},
'linear');
scene.showEffect('energyball',{
x:defender.x,
y:defender.y,
z:defender.z,
scale:0.6,
opacity:0.6,
time:100},
{
x:attacker.x,
y:attacker.y,
z:attacker.z,
time:600,
opacity:0},
'ballistic2Under');
}},

hydroshot:{
anim:function(scene,_ref26){var attacker=_ref26[0],defender=_ref26[1];
scene.showEffect('waterwisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.4,
opacity:0.3},
{
x:defender.x+10,
y:defender.y+5,
z:defender.behind(30),
scale:1,
opacity:0.6},
'decel','explode');
scene.showEffect('waterwisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.4,
opacity:0.3,
time:75},
{
x:defender.x-10,
y:defender.y-5,
z:defender.behind(30),
scale:1,
opacity:0.6},
'decel','explode');
scene.showEffect('waterwisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.4,
opacity:0.3,
time:150},
{
x:defender.x,
y:defender.y+5,
z:defender.behind(30),
scale:1,
opacity:0.6},
'decel','explode');
}},

sound:{
anim:function(scene,_ref27){var attacker=_ref27[0];
scene.showEffect('wisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0,
opacity:0.7,
time:0},
{
z:attacker.behind(-50),
scale:5,
opacity:0,
time:400},
'linear');
scene.showEffect('wisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0,
opacity:0.7,
time:150},
{
z:attacker.behind(-50),
scale:5,
opacity:0,
time:600},
'linear');
scene.showEffect('wisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0,
opacity:0.7,
time:300},
{
z:attacker.behind(-50),
scale:5,
opacity:0,
time:800},
'linear');
}},

gravity:{
anim:function(scene,_ref28){var attacker=_ref28[0];
attacker.anim({
y:attacker.y-20,
yscale:0.5,
time:300},
'decel');
attacker.delay(200);
attacker.anim({
time:300});

}},

futuresighthit:{
anim:function(scene,_ref29){var defender=_ref29[0];
scene.backgroundEffect('#AA44BB',250,0.6);
scene.backgroundEffect('#AA44FF',250,0.6,400);
defender.anim({
scale:1.2,
time:100});

defender.anim({
scale:1,
time:100});

defender.anim({
scale:1.4,
time:150});

defender.anim({
scale:1,
time:150});

scene.wait(700);
}},

doomdesirehit:{
anim:function(scene,_ref30){var defender=_ref30[0];
scene.backgroundEffect('#ffffff',600,0.6);
scene.showEffect('fireball',{
x:defender.x+40,
y:defender.y,
z:defender.z,
scale:0,
opacity:0.6},
{
scale:6,
opacity:0},
'linear');
scene.showEffect('fireball',{
x:defender.x-40,
y:defender.y-20,
z:defender.z,
scale:0,
opacity:0.6,
time:150},
{
scale:6,
opacity:0},
'linear');
scene.showEffect('fireball',{
x:defender.x+10,
y:defender.y+20,
z:defender.z,
scale:0,
opacity:0.6,
time:300},
{
scale:6,
opacity:0},
'linear');

defender.delay(100);
defender.anim({
x:defender.x-30,
time:75});

defender.anim({
x:defender.x+30,
time:100});

defender.anim({
x:defender.x-30,
time:100});

defender.anim({
x:defender.x+30,
time:100});

defender.anim({
x:defender.x,
time:100});

}},

itemoff:{
anim:function(scene,_ref31){var defender=_ref31[0];
scene.showEffect('pokeball',{
x:defender.x,
y:defender.y,
z:defender.z,
scale:1,
opacity:1},
{
x:defender.x,
y:defender.y+40,
z:defender.behind(70),
opacity:0,
time:400},
'ballistic2');
}},

anger:{
anim:function(scene,_ref32){var attacker=_ref32[0];
scene.showEffect('angry',{
x:attacker.x+20,
y:attacker.y+20,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:0},
{
scale:1,
opacity:1,
time:300},
'ballistic2Under','fade');
scene.showEffect('angry',{
x:attacker.x-20,
y:attacker.y+10,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:100},
{
scale:1,
opacity:1,
time:400},
'ballistic2Under','fade');
scene.showEffect('angry',{
x:attacker.x,
y:attacker.y+40,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:200},
{
scale:1,
opacity:1,
time:500},
'ballistic2Under','fade');
}},

bidecharge:{
anim:function(scene,_ref33){var attacker=_ref33[0];
scene.showEffect('wisp',{
x:attacker.x+30,
y:attacker.y,
z:attacker.z,
scale:1,
opacity:1,
time:0},
{
y:attacker.y+60,
opacity:0.2,
time:400},
'linear','fade');
scene.showEffect('wisp',{
x:attacker.x-30,
y:attacker.y,
z:attacker.z,
scale:1,
opacity:1,
time:100},
{
y:attacker.y+60,
opacity:0.2,
time:500},
'linear','fade');
scene.showEffect('wisp',{
x:attacker.x+15,
y:attacker.y,
z:attacker.z,
scale:1,
opacity:1,
time:200},
{
y:attacker.y+60,
opacity:0.2,
time:600},
'linear','fade');
scene.showEffect('wisp',{
x:attacker.x-15,
y:attacker.y,
z:attacker.z,
scale:1,
opacity:1,
time:300},
{
y:attacker.y+60,
opacity:0.2,
time:700},
'linear','fade');

attacker.anim({
x:attacker.x-2.5,
time:75},
'swing');
attacker.anim({
x:attacker.x+2.5,
time:75},
'swing');
attacker.anim({
x:attacker.x-2.5,
time:75},
'swing');
attacker.anim({
x:attacker.x+2.5,
time:75},
'swing');
attacker.anim({
x:attacker.x-2.5,
time:75},
'swing');
attacker.anim({
time:100},
'accel');
}},

bideunleash:{
anim:function(scene,_ref34){var attacker=_ref34[0];
scene.showEffect('fireball',{
x:attacker.x+40,
y:attacker.y,
z:attacker.z,
scale:0,
opacity:0.6},
{
scale:6,
opacity:0},
'linear');
scene.showEffect('fireball',{
x:attacker.x-40,
y:attacker.y-20,
z:attacker.z,
scale:0,
opacity:0.6,
time:150},
{
scale:6,
opacity:0},
'linear');
scene.showEffect('fireball',{
x:attacker.x+10,
y:attacker.y+20,
z:attacker.z,
scale:0,
opacity:0.6,
time:300},
{
scale:6,
opacity:0},
'linear');

attacker.anim({
x:attacker.x-30,
time:75});

attacker.anim({
x:attacker.x+30,
time:100});

attacker.anim({
x:attacker.x-30,
time:100});

attacker.anim({
x:attacker.x+30,
time:100});

attacker.anim({
x:attacker.x-30,
time:100});

attacker.anim({
x:attacker.x+30,
time:100});

attacker.anim({
x:attacker.x,
time:100});

}},

spectralthiefboost:{
anim:function(scene,_ref35){var attacker=_ref35[0],defender=_ref35[1];
scene.backgroundEffect('linear-gradient(#000000 30%, #440044',1400,0.5);
scene.showEffect('shadowball',{
x:defender.x,
y:defender.y-30,
z:defender.z,
scale:0.5,
xscale:0.5,
yscale:1,
opacity:0.5},
{
scale:2,
xscale:4,
opacity:0.1,
time:400},
'decel','fade');
scene.showEffect('poisonwisp',{
x:defender.x,
y:defender.y-25,
z:defender.z,
scale:1},
{
x:defender.x+50,
scale:3,
xscale:3.5,
opacity:0.3,
time:500},
'linear','fade');
scene.showEffect('poisonwisp',{
x:defender.x,
y:defender.y-25,
z:defender.z,
scale:1},
{
x:defender.x-50,
scale:3,
xscale:3.5,
opacity:0.3,
time:500},
'linear','fade');
scene.showEffect('shadowball',{
x:defender.x+35,
y:defender.y,
z:defender.z,
opacity:0.4,
scale:0.25,
time:50},
{
y:defender.y-40,
opacity:0,
time:300},
'accel');
scene.showEffect('shadowball',{
x:defender.x-35,
y:defender.y,
z:defender.z,
opacity:0.4,
scale:0.25,
time:100},
{
y:defender.y-40,
opacity:0,
time:350},
'accel');
scene.showEffect('shadowball',{
x:defender.x+15,
y:defender.y,
z:defender.z,
opacity:0.4,
scale:0.5,
time:150},
{
y:defender.y-40,
opacity:0,
time:400},
'accel');
scene.showEffect('shadowball',{
x:defender.x+15,
y:defender.y,
z:defender.z,
opacity:0.4,
scale:0.25,
time:200},
{
y:defender.y-40,
opacity:0,
time:450},
'accel');

scene.showEffect('poisonwisp',{
x:defender.x-50,
y:defender.y-40,
z:defender.z,
scale:2,
opacity:0.3,
time:300},
{
x:attacker.x-50,
y:attacker.y-40,
z:attacker.z,
time:900},
'decel','fade');
scene.showEffect('poisonwisp',{
x:defender.x-50,
y:defender.y-40,
z:defender.z,
scale:2,
opacity:0.3,
time:400},
{
x:attacker.x-50,
y:attacker.y-40,
z:attacker.z,
time:900},
'decel','fade');
scene.showEffect('poisonwisp',{
x:defender.x,
y:defender.y-40,
z:defender.z,
scale:2,
opacity:0.3,
time:450},
{
x:attacker.x,
y:attacker.y-40,
z:attacker.z,
time:950},
'decel','fade');

scene.showEffect('shadowball',{
x:attacker.x,
y:attacker.y-30,
z:attacker.z,
scale:0,
xscale:0.5,
yscale:1,
opacity:0.5,
time:750},
{
scale:2,
xscale:4,
opacity:0.1,
time:1200},
'decel','fade');

scene.showEffect('shadowball',{
x:attacker.x+35,
y:attacker.y-40,
z:attacker.z,
opacity:0.4,
scale:0.25,
time:750},
{
y:attacker.y,
opacity:0,
time:1000},
'decel');
scene.showEffect('shadowball',{
x:attacker.x-35,
y:attacker.y-40,
z:attacker.z,
opacity:1,
scale:0.25,
time:800},
{
y:attacker.y,
opacity:0,
time:1150},
'decel');
scene.showEffect('shadowball',{
x:attacker.x+15,
y:attacker.y-40,
z:attacker.z,
opacity:1,
scale:0.25,
time:950},
{
y:attacker.y,
opacity:0,
time:1200},
'decel');
scene.showEffect('shadowball',{
x:attacker.x+15,
y:attacker.y-40,
z:attacker.z,
opacity:1,
scale:0.25,
time:1000},
{
y:attacker.y,
opacity:0,
time:1350},
'decel');

scene.showEffect('poisonwisp',{
x:attacker.x,
y:attacker.y-25,
z:attacker.z,
scale:2,
opacity:1,
time:750},
{
x:attacker.x+75,
opacity:0.3,
time:1200},
'linear','fade');
scene.showEffect('poisonwisp',{
x:attacker.x,
y:attacker.y-25,
z:attacker.z,
scale:2,
opacity:1,
time:750},
{
x:attacker.x-75,
opacity:0.3,
time:1200},
'linear','fade');

defender.anim({
x:defender.x-15,
time:75});

defender.anim({
x:defender.x+15,
time:100});

defender.anim({
x:defender.x-15,
time:100});

defender.anim({
x:defender.x+15,
time:100});

defender.anim({
x:defender.x-15,
time:100});

defender.anim({
x:defender.x+15,
time:100});

defender.anim({
x:defender.x,
time:100});

}},

schoolingin:{
anim:function(scene,_ref36){var attacker=_ref36[0];
scene.backgroundEffect('#0000DD',600,0.2);
scene.showEffect('wisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:2.5,
opacity:1},
{
scale:3,
time:600},
'linear','explode');
scene.showEffect('waterwisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:3,
opacity:0.3},
{
scale:3.25,
time:600},
'linear','explode');

scene.showEffect('iceball',{
x:attacker.leftof(200),
y:attacker.y+40,
z:attacker.z,
scale:0.5,
opacity:0.5},
{
x:attacker.x,
y:attacker.y,
z:attacker.z,
opacity:0,
time:200},
'ballistic','fade');
scene.showEffect('iceball',{
x:attacker.leftof(-140),
y:attacker.y-60,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:100},
{
x:attacker.x,
y:attacker.y,
z:attacker.z,
opacity:0,
time:300},
'ballistic2Under','fade');
scene.showEffect('iceball',{
x:attacker.leftof(-140),
y:attacker.y+50,
z:attacker.behind(170),
scale:0.5,
opacity:0.5,
time:200},
{
x:attacker.x,
y:attacker.y,
z:attacker.z,
opacity:0,
time:400},
'ballistic2','fade');
scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y+30,
z:attacker.behind(-250),
scale:0.5,
opacity:0.5,
time:200},
{
x:attacker.x,
y:attacker.y,
z:attacker.z,
opacity:0,
time:500},
'ballistic','fade');
scene.showEffect('iceball',{
x:attacker.leftof(240),
y:attacker.y-80,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:300},
{
x:attacker.x,
y:attacker.y,
z:attacker.z,
opacity:0,
time:600},
'ballistic2Under');
}},

schoolingout:{
anim:function(scene,_ref37){var attacker=_ref37[0];
scene.backgroundEffect('#0000DD',600,0.2);
scene.showEffect('wisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:3,
opacity:1},
{
scale:2,
time:600},
'linear','explode');
scene.showEffect('waterwisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:3.25,
opacity:0.3},
{
scale:2.5,
time:600},
'linear','explode');

scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:0},
{
x:attacker.leftof(200),
y:attacker.y+40,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:200},
'ballistic','fade');
scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:0,
time:100},
{
x:attacker.leftof(-140),
y:attacker.y-60,
z:attacker.z,
opacity:0.5,
time:300},
'ballistic2Under','fade');
scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:0,
time:200},
{
x:attacker.leftof(-140),
y:attacker.y+50,
z:attacker.behind(170),
opacity:0.5,
time:400},
'ballistic2','fade');
scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:0,
time:200},
{
x:attacker.x,
y:attacker.y+30,
z:attacker.behind(-250),
opacity:0.5,
time:500},
'ballistic','fade');
scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:0,
time:300},
{
x:attacker.leftof(240),
y:attacker.y-80,
z:attacker.z,
opacity:0.5,
time:600},
'ballistic2Under');
}},

primalalpha:{
anim:function(scene,_ref38){var attacker=_ref38[0];
scene.backgroundEffect('#0000DD',500,0.4);
scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:2,
opacity:0.2,
time:0},
{
scale:0.5,
opacity:1,
time:300},
'linear','fade');
scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:1,
time:300},
{
scale:4,
opacity:0,
time:700},
'linear','fade');
scene.showEffect('shadowball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:300},
{
scale:5,
opacity:0,
time:600},
'linear','fade');
scene.showEffect('alpha',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:1,
time:300},
{
scale:2.5,
opacity:0,
time:600},
'decel');
}},

primalomega:{
anim:function(scene,_ref39){var attacker=_ref39[0];
scene.backgroundEffect('linear-gradient(#390000 30%, #B84038)',500,0.4);
scene.showEffect('flareball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:2,
opacity:0.2,
time:0},
{
scale:0.5,
opacity:1,
time:300},
'linear','fade');
scene.showEffect('flareball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:1,
time:300},
{
scale:4,
opacity:0,
time:700},
'linear','fade');
scene.showEffect('shadowball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:300},
{
scale:5,
opacity:0,
time:600},
'linear','fade');
scene.showEffect('omega',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:1,
time:300},
{
scale:2.5,
opacity:0,
time:600},
'decel');
}},

megaevo:{
anim:function(scene,_ref40){var attacker=_ref40[0];
scene.backgroundEffect('#835BA5',500,0.6);
scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:2,
opacity:0.2,
time:0},
{
scale:0.5,
opacity:1,
time:300},
'linear','fade');
scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:1,
time:300},
{
scale:4,
opacity:0,
time:700},
'linear','fade');
scene.showEffect('mistball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:300},
{
scale:5,
opacity:0,
time:600},
'linear','fade');
scene.showEffect('rainbow',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:1,
time:300},
{
scale:5,
opacity:0,
time:600},
'linear','fade');
}},

zpower:{
anim:function(scene,_ref41){var attacker=_ref41[0];
scene.backgroundEffect('linear-gradient(#000000 20%, #0000DD)',1800,0.4);
scene.showEffect('electroball',{
x:attacker.x-60,
y:attacker.y+40,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:0},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:300},
'linear','fade');
scene.showEffect('electroball',{
x:attacker.x+60,
y:attacker.y-5,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:100},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:300},
'linear','fade');
scene.showEffect('electroball',{
x:attacker.x-30,
y:attacker.y+60,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:100},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:400},
'linear','fade');
scene.showEffect('electroball',{
x:attacker.x+20,
y:attacker.y-50,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:100},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:400},
'linear','fade');
scene.showEffect('electroball',{
x:attacker.x-70,
y:attacker.y-50,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:200},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:500},
'linear','fade');
scene.showEffect('zsymbol',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.7,
opacity:1,
time:500},
{
scale:1,
opacity:0.5,
time:800},
'decel','explode');
scene.showEffect(attacker.sp,{
x:attacker.x,
y:attacker.y,
z:attacker.z,
opacity:0.3,
time:800},
{
y:attacker.y+20,
scale:2,
opacity:0,
time:1200},
'accel');
scene.showEffect(attacker.sp,{
x:attacker.x,
y:attacker.y,
z:attacker.z,
opacity:0.3,
time:1000},
{
y:attacker.y+20,
scale:2,
opacity:0,
time:1400},
'accel');
scene.showEffect(attacker.sp,{
x:attacker.x,
y:attacker.y,
z:attacker.z,
opacity:0.3,
time:1200},
{
y:attacker.y+20,
scale:2,
opacity:0,
time:1600},
'accel');
}},

powerconstruct:{
anim:function(scene,_ref42){var attacker=_ref42[0];
var xf=[1,-1,1,-1];
var yf=[1,-1,-1,1];
var xf2=[1,0,-1,0];
var yf2=[0,1,0,-1];

scene.backgroundEffect('#000000',1000,0.7);
for(var i=0;i<4;i++){
scene.showEffect('energyball',{
x:attacker.x+150*xf[i],
y:attacker.y-50,
z:attacker.z+70*yf[i],
scale:0.1,
xscale:0.5,
opacity:0.4},
{
x:attacker.x,
y:attacker.y-50,
z:attacker.z,
scale:0.3,
xscale:0.8,
opacity:0,
time:500},
'decel','fade');
scene.showEffect('energyball',{
x:attacker.x+200*xf2[i],
y:attacker.y-50,
z:attacker.z+90*yf2[i],
scale:0.1,
xscale:0.5,
opacity:0.4},
{
x:attacker.x,
y:attacker.y-50,
z:attacker.z,
scale:0.3,
xscale:0.8,
opacity:0,
time:500},
'decel','fade');

scene.showEffect('energyball',{
x:attacker.x+50*xf[i],
y:attacker.y-50,
z:attacker.z+100*yf[i],
scale:0.1,
xscale:0.5,
opacity:0.4,
time:200},
{
x:attacker.x,
y:attacker.y-50,
z:attacker.z,
scale:0.3,
xscale:0.8,
opacity:0,
time:500},
'decel','fade');
scene.showEffect('energyball',{
x:attacker.x+100*xf2[i],
y:attacker.y-50,
z:attacker.z+90*yf2[i],
scale:0.1,
xscale:0.5,
opacity:0.4,
time:200},
{
x:attacker.x,
y:attacker.y-50,
z:attacker.z,
scale:0.3,
xscale:0.8,
opacity:0,
time:500},
'decel','fade');
}
scene.showEffect('energyball',{
x:attacker.x,
y:attacker.y-25,
z:attacker.z,
scale:3,
opacity:0,
time:50},
{
scale:1,
opacity:0.8,
time:300},
'linear','fade');
scene.showEffect('energyball',{
x:attacker.x,
y:attacker.y-25,
z:attacker.z,
scale:3.5,
opacity:0,
time:150},
{
scale:1.5,
opacity:1,
time:350},
'linear','fade');
scene.showEffect('energyball',{
x:attacker.x,
y:attacker.y-25,
z:attacker.z,
scale:0.5,
opacity:1,
time:200},
{
scale:3,
opacity:0,
time:600},
'linear','fade');
scene.showEffect('wisp',{
x:attacker.x,
y:attacker.y-25,
z:attacker.z,
scale:1,
opacity:0.6,
time:100},
{
scale:3.5,
opacity:0.8,
time:500},
'linear','explode');
}},

ultraburst:{
anim:function(scene,_ref43){var attacker=_ref43[0];
scene.backgroundEffect('#000000',600,0.5);
scene.backgroundEffect('#ffffff',500,1,550);
scene.showEffect('wisp',{
x:attacker.x-60,
y:attacker.y+40,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:0},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:150},
'linear','fade');
scene.showEffect('wisp',{
x:attacker.x+60,
y:attacker.y-5,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:100},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:150},
'linear','fade');
scene.showEffect('wisp',{
x:attacker.x-30,
y:attacker.y+60,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:100},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:250},
'linear','fade');
scene.showEffect('wisp',{
x:attacker.x+20,
y:attacker.y-50,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:100},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:250},
'linear','fade');
scene.showEffect('wisp',{
x:attacker.x-70,
y:attacker.y-50,
z:attacker.z,
scale:0.7,
opacity:0.7,
time:100},
{
x:attacker.x,
y:attacker.y,
scale:0.2,
opacity:0.2,
time:300},
'linear','fade');

scene.showEffect('wisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:1.5,
opacity:1},
{
scale:4,
time:600},
'linear','explode');
scene.showEffect('electroball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:2,
opacity:0},
{
scale:2.25,
opacity:0.1,
time:600},
'linear','explode');
scene.showEffect('energyball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:2,
opacity:0,
time:200},
{
scale:2.25,
opacity:0.1,
time:600},
'linear','explode');

scene.showEffect('electroball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:6,
opacity:0.2},
{
scale:1,
opacity:0,
time:300},
'linear');
scene.showEffect('electroball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:6,
opacity:0.2,
time:150},
{
scale:1,
opacity:0,
time:450},
'linear');
scene.showEffect('electroball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:6,
opacity:0.2,
time:300},
{
scale:1,
opacity:0,
time:600},
'linear');
scene.showEffect('ultra',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:1,
time:600},
{
scale:1,
opacity:0,
time:900},
'decel');
scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y-60,
z:attacker.z,
scale:0.5,
xscale:0.25,
yscale:0,
opacity:0.5,
time:600},
{
scale:2,
xscale:6,
yscale:1,
opacity:0,
time:800},
'linear');
scene.showEffect('iceball',{
x:attacker.x,
y:attacker.y-60,
z:attacker.z,
scale:0.5,
xscale:0.25,
yscale:0.75,
opacity:0.5,
time:800},
{
scale:2,
xscale:6,
opacity:0.1,
time:1000},
'linear');
}}};


var BattleStatusAnims={
brn:{
anim:function(scene,_ref44){var attacker=_ref44[0];
scene.showEffect('fireball',{
x:attacker.x-20,
y:attacker.y-15,
z:attacker.z,
scale:0.2,
opacity:0.3},
{
x:attacker.x+40,
y:attacker.y+15,
z:attacker.z,
scale:1,
opacity:1,
time:300},
'swing','fade');
}},

psn:{
anim:function(scene,_ref45){var attacker=_ref45[0];
scene.showEffect('poisonwisp',{
x:attacker.x+30,
y:attacker.y-40,
z:attacker.z,
scale:0.2,
opacity:1,
time:0},
{
y:attacker.y,
scale:1,
opacity:0.5,
time:300},
'decel','fade');
scene.showEffect('poisonwisp',{
x:attacker.x-30,
y:attacker.y-40,
z:attacker.z,
scale:0.2,
opacity:1,
time:100},
{
y:attacker.y,
scale:1,
opacity:0.5,
time:400},
'decel','fade');
scene.showEffect('poisonwisp',{
x:attacker.x,
y:attacker.y-40,
z:attacker.z,
scale:0.2,
opacity:1,
time:200},
{
y:attacker.y,
scale:1,
opacity:0.5,
time:500},
'decel','fade');
}},

slp:{
anim:function(scene,_ref46){var attacker=_ref46[0];
scene.showEffect('wisp',{
x:attacker.x,
y:attacker.y+20,
z:attacker.z,
scale:0.5,
opacity:0.1},
{
x:attacker.x,
y:attacker.y+20,
z:attacker.behind(-50),
scale:1.5,
opacity:1,
time:400},
'ballistic2Under','fade');
scene.showEffect('wisp',{
x:attacker.x,
y:attacker.y+20,
z:attacker.z,
scale:0.5,
opacity:0.1,
time:200},
{
x:attacker.x,
y:attacker.y+20,
z:attacker.behind(-50),
scale:1.5,
opacity:1,
time:600},
'ballistic2Under','fade');
}},

par:{
anim:function(scene,_ref47){var attacker=_ref47[0];
scene.showEffect('electroball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:1.5,
opacity:0.2},
{
scale:2,
opacity:0.1,
time:300},
'linear','fade');

attacker.delay(100);
attacker.anim({
x:attacker.x-1,
time:75},
'swing');
attacker.anim({
x:attacker.x+1,
time:75},
'swing');
attacker.anim({
x:attacker.x-1,
time:75},
'swing');
attacker.anim({
x:attacker.x+1,
time:75},
'swing');
attacker.anim({
x:attacker.x-1,
time:75},
'swing');
attacker.anim({
time:100},
'accel');
}},

frz:{
anim:function(scene,_ref48){var attacker=_ref48[0];
scene.showEffect('icicle',{
x:attacker.x-30,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:200},
{
scale:0.9,
opacity:0,
time:600},
'linear','fade');
scene.showEffect('icicle',{
x:attacker.x,
y:attacker.y-30,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:300},
{
scale:0.9,
opacity:0,
time:650},
'linear','fade');
scene.showEffect('icicle',{
x:attacker.x+15,
y:attacker.y,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:400},
{
scale:0.9,
opacity:0,
time:700},
'linear','fade');
scene.showEffect('wisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:1,
opacity:0.5},
{
scale:3,
opacity:0,
time:600},
'linear','fade');
}},

flinch:{
anim:function(scene,_ref49){var attacker=_ref49[0];
scene.showEffect('shadowball',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:1,
opacity:0.2},
{
scale:3,
opacity:0.1,
time:300},
'linear','fade');
}},

attracted:{
anim:function(scene,_ref50){var attacker=_ref50[0];
scene.showEffect('heart',{
x:attacker.x+20,
y:attacker.y+20,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:0},
{
scale:1,
opacity:1,
time:300},
'ballistic2Under','fade');
scene.showEffect('heart',{
x:attacker.x-20,
y:attacker.y+10,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:100},
{
scale:1,
opacity:1,
time:400},
'ballistic2Under','fade');
scene.showEffect('heart',{
x:attacker.x,
y:attacker.y+40,
z:attacker.z,
scale:0.5,
opacity:0.5,
time:200},
{
scale:1,
opacity:1,
time:500},
'ballistic2Under','fade');
}},

cursed:{
anim:function(scene,_ref51){var attacker=_ref51[0];
scene.backgroundEffect('#000000',700,0.2);
attacker.delay(300);
attacker.anim({x:attacker.x-5,time:50});
attacker.anim({x:attacker.x+5,time:50});
attacker.anim({x:attacker.x-5,time:50});
attacker.anim({x:attacker.x+5,time:50});
attacker.anim({x:attacker.x,time:50});

scene.showEffect(attacker.sp,{
x:attacker.x,
y:attacker.y,
z:attacker.z,
opacity:0.5,
time:0},
{
z:attacker.behind(20),
opacity:0,
time:600},
'decel');
}},

confused:{
anim:function(scene,_ref52){var attacker=_ref52[0];
scene.showEffect('electroball',{
x:attacker.x+50,
y:attacker.y+30,
z:attacker.z,
scale:0.1,
opacity:1,
time:400},
{
x:attacker.x-50,
scale:0.15,
opacity:0.4,
time:600},
'linear','fade');
scene.showEffect('electroball',{
x:attacker.x-50,
y:attacker.y+30,
z:attacker.z,
scale:0.1,
opacity:1,
time:400},
{
x:attacker.x+50,
scale:0.15,
opacity:0.4,
time:600},
'linear','fade');
scene.showEffect('electroball',{
x:attacker.x+50,
y:attacker.y+30,
z:attacker.z,
scale:0.1,
opacity:1,
time:600},
{
x:attacker.x-50,
scale:0.4,
opacity:0.4,
time:800},
'linear','fade');
scene.showEffect('electroball',{
x:attacker.x-50,
y:attacker.y+30,
z:attacker.z,
scale:0.15,
opacity:1,
time:600},
{
x:attacker.x+50,
scale:0.4,
opacity:0.4,
time:800},
'linear','fade');
}},

confusedselfhit:{
anim:function(scene,_ref53){var attacker=_ref53[0];
scene.showEffect('wisp',{
x:attacker.x,
y:attacker.y,
z:attacker.z,
scale:0,
opacity:0.5},
{
scale:2,
opacity:0,
time:200},
'linear');
attacker.delay(50);
attacker.anim({
x:attacker.leftof(2),
z:attacker.behind(5),
time:100},
'swing');
attacker.anim({
time:300},
'swing');
}}};


BattleStatusAnims['focuspunch']={anim:BattleStatusAnims['flinch'].anim};