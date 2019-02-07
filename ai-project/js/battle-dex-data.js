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