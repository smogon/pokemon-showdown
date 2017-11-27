'use strict';

const assert = require('assert');

describe('Chat', function () {
	it('should run formatText correctly', function () {
		assert.strictEqual(
			Chat.formatText(`hi **__bold italics__** ^^superscript^^ \\\\subscript\\\\ normal ~~strikethrough~~ bye`),
			`hi <b><i>bold italics</i></b> <sup>superscript</sup> <sub>subscript</sub> normal <s>strikethrough</s> bye`
		);
		assert.strictEqual(
			Chat.formatText(`__**reverse nesting**__`),
			`<i><b>reverse nesting</b></i>`
		);
		assert.strictEqual(
			Chat.formatText(`__**bad nesting__**`),
			`<i>**bad nesting</i>**`
		);
		assert.strictEqual(
			Chat.formatText(`spaced ** out ** no __also no __ ~~ also no~~ ok`),
			`spaced ** out ** no __also no __ ~~ also no~~ ok`
		);
		assert.strictEqual(
			Chat.formatText(`hi \`\` \` \`\` bye`),
			`hi <code>\`</code> bye`
		);
		assert.strictEqual(
			Chat.formatText(`hi \`\`inside __not__ formatted\`\` bye`),
			`hi <code>inside __not__ formatted</code> bye`
		);
		assert.strictEqual(
			Chat.formatText(`<<roomid-1-2-3>> <<roomid_1_2_3>>`),
			`&laquo;<a href="/roomid-1-2-3" target="_blank">roomid-1-2-3</a>&raquo; &lt;&lt;roomid_1_2_3&gt;&gt;`
		);
		assert.strictEqual(
			Chat.formatText(`hi __spoiler: bye__ hi again`),
			`hi <i>spoiler: <span class="spoiler">bye</span></i> hi again`
		);
		assert.strictEqual(
			Chat.formatText(`hi google.com/__a__ bye`),
			`hi <a href="http://google.com/__a__" target="_blank" rel="noopener">google.com/__a__</a> bye`
		);
		assert.strictEqual(
			Chat.formatText(`hi email@email.com bye`),
			`hi <a href="mailto:email@email.com" target="_blank" rel="noopener">email@email.com</a> bye`
		);
		assert.strictEqual(
			Chat.formatText(`>greentext`),
			`<span class="greentext">&gt;greentext</span>`
		);
		assert.strictEqual(
			Chat.formatText(`>w< not greentext >also not greentext`),
			`&gt;w&lt; not greentext &gt;also not greentext`
		);
		assert.strictEqual(
			Chat.formatText(`[[Google]]<http://www.google.com/>`),
			`<a href="http://www.google.com/" target="_blank" rel="noopener">Google<small> &lt;google.com&gt;</small></a>`
		);
		assert.strictEqual(
			Chat.formatText(`[[Google]]<google.com>`, true),
			`<a href="http://google.com" target="_blank" rel="noopener">Google</a>`
		);
	});
});
