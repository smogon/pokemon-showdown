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