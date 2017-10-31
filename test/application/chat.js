'use strict';

const assert = require('assert');

describe('Chat', function () {
	it('should run parseText correctly', function () {
		assert.strictEqual(
			Chat.parseText(`hi **__bold italics__** bye`),
			`hi <b><i>bold italics</i></b> bye`
		);
		assert.strictEqual(
			Chat.parseText(`hi \`\` \` \`\` bye`),
			`hi <code>\`</code> bye`
		);
		assert.strictEqual(
			Chat.parseText(`hi \`\`inside __not__ formatted\`\` bye`),
			`hi <code>inside __not__ formatted</code> bye`
		);
		// assert.strictEqual(
		// 	Chat.parseText(`hi spoiler: bye`),
		// 	`hi <span class="spoiler">bye</span>`
		// );
		// assert.strictEqual(
		// 	Chat.parseText(`hi google.com/__a__ bye`),
		// 	`hi <a href="google.com/__a__">google.com/__a__</a> bye`
		// );
	});
});
