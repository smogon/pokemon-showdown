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
			Chat.formatText(`hi \`\` \` \`\` bye`),
			`hi <code>\`</code> bye`
		);
		assert.strictEqual(
			Chat.formatText(`hi \`\`inside __not__ formatted\`\` bye`),
			`hi <code>inside __not__ formatted</code> bye`
		);
		// assert.strictEqual(
		// 	Chat.formatText(`hi spoiler: bye`),
		// 	`hi <span class="spoiler">bye</span>`
		// );
		// assert.strictEqual(
		// 	Chat.formatText(`hi google.com/__a__ bye`),
		// 	`hi <a href="google.com/__a__">google.com/__a__</a> bye`
		// );
	});
});
