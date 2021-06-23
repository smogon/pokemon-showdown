'use strict';

const assert = require('assert').strict;

describe('Chat', function () {
	it('should run formatText correctly', function () {
		assert.equal(
			Chat.formatText(`hi **__bold italics__** ^^superscript^^ \\\\subscript\\\\ normal ~~strikethrough~~ bye`),
			`hi <b><i>bold italics</i></b> <sup>superscript</sup> <sub>subscript</sub> normal <s>strikethrough</s> bye`
		);
		assert.equal(
			Chat.formatText(`__**reverse nesting**__`),
			`<i><b>reverse nesting</b></i>`
		);
		assert.equal(
			Chat.formatText(`__**bad nesting__**`),
			`<i>**bad nesting</i>**`
		);
		assert.equal(
			Chat.formatText(`spaced ** out ** no __also no __ ~~ also no~~ ok`),
			`spaced ** out ** no __also no __ ~~ also no~~ ok`
		);
		assert.equal(
			Chat.formatText(`hi \`\` \` \`\` bye`),
			`hi <code>\`</code> bye`
		);
		assert.equal(
			Chat.formatText(`hi \`\`inside __not__ formatted\`\` bye`),
			`hi <code>inside __not__ formatted</code> bye`
		);
		assert.equal(
			Chat.formatText(`<<roomid-1-2-3>> <<roomid_1_2_3>>`),
			`&laquo;<a href="/roomid-1-2-3" target="_blank">roomid-1-2-3</a>&raquo; &lt;&lt;roomid_1_2_3&gt;&gt;`
		);
		assert.equal(
			Chat.formatText(`hi __spoiler: bye__ hi again (parenthetical spoiler: bye again (or not!!!!)) that was fun`),
			`hi <i>spoiler: <span class="spoiler">bye</span></i> hi again (parenthetical spoiler: <span class="spoiler">bye again (or not!!!!)</span>) that was fun`
		);
		assert.equal(
			Chat.formatText(`hi __||bye||__ hi again (parenthetical ||bye again (or not!!!!)||) that was fun`),
			`hi <i><span class="spoiler">bye</span></i> hi again (parenthetical <span class="spoiler">bye again (or not!!!!)</span>) that was fun`
		);
		assert.equal(
			Chat.formatText(`hi google.com/__a__ bye >w<`),
			`hi <a href="http://google.com/__a__" rel="noopener" target="_blank">google.com/__a__</a> bye &gt;w&lt;`
		);
		assert.equal(
			Chat.formatText(`(https://en.wikipedia.org/wiki/Pokémon_(video_game_series))`),
			`(<a href="https://en.wikipedia.org/wiki/Pokémon_(video_game_series)" rel="noopener" target="_blank">https://en.wikipedia.org/wiki/Pokémon_(video_game_series)</a>)`
		);
		assert.equal(
			Chat.formatText(`hi email@email.com bye >w<`),
			`hi <a href="mailto:email@email.com" rel="noopener" target="_blank">email@email.com</a> bye &gt;w&lt;`
		);
		assert.equal(
			Chat.formatText(`hi email@email.example bye >w<`),
			`hi <a href="mailto:email@email.example" rel="noopener" target="_blank">email@email.example</a> bye &gt;w&lt;`
		);
		assert.equal(
			Chat.formatText(`>greentext`),
			`<span class="greentext">&gt;greentext</span>`
		);
		assert.equal(
			Chat.formatText(`>w< not greentext >also not greentext`),
			`&gt;w&lt; not greentext &gt;also not greentext`
		);
		assert.equal(
			Chat.formatText(`[[Google <http://www.google.com/>]] >w<`),
			`<a href="http://www.google.com/" rel="noopener" target="_blank">Google<small> &lt;google.com&gt;</small></a> &gt;w&lt;`
		);
		assert.equal(
			Chat.formatText(`[[Google <google.com>]] >w<`, true),
			`<a href="http://google.com" target="_blank">Google</a> &gt;w&lt;`
		);
		assert.equal(
			Chat.formatText(`[[wiki: Pokemon]] >w<`, true),
			`<a href="//en.wikipedia.org/w/index.php?title=Special:Search&search=Pokemon" target="_blank">wiki: Pokemon</a> &gt;w&lt;`
		);
		assert.equal(
			Chat.formatText(`[[wiki: D&D D&amp;D]] [[A>B A&gt;B]] &amp;`, true),
			`<a href="//en.wikipedia.org/w/index.php?title=Special:Search&search=D%26D%20D%26amp%3BD" target="_blank">wiki: D&amp;D D&amp;amp;D</a> <a href="//www.google.com/search?ie=UTF-8&btnI&q=A%3EB%20A%26gt%3BB" target="_blank">A&gt;B A&amp;gt;B</a> &amp;amp;`
		);
		assert.equal(
			Chat.formatText(`[[pokemon: Oshawott]] >w<`, true),
			`<a href="//dex.pokemonshowdown.com/pokemon/oshawott" target="_blank"><psicon pokemon="Oshawott" /></a> &gt;w&lt;`
		);
		assert.equal(
			Chat.formatText(`[[item: Beast ball]] >w<`),
			`<a href="//dex.pokemonshowdown.com/items/beastball" target="_blank">[Beast ball]</a> &gt;w&lt;`
		);
		assert.equal(
			Chat.formatText(`:)`, true),
			`:)`
		);
		assert.equal(
			Chat.formatText(`a\nb\nc`),
			`a\nb\nc`
		);
		assert.equal(
			Chat.formatText(`a\nb\nc`, true),
			`a<br />b<br />c`
		);
		assert.equal(
			Chat.formatText(`a\nb\nc`, false, true),
			`a<br />b<br />c`
		);
	});

	it('should run toDurationString correctly', function () {
		assert(Chat.toDurationString(1e50));

		assert(!Chat.toDurationString(10000000 * 24 * 60 * 60 * 1000).includes('  '));
	});
});
