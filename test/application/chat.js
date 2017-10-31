'use strict';

const assert = require('assert');

describe('Chat', function () {
	it('should run formatText correctly', function () {
		assert.strictEqual(
			Chat.formatText(`hi **__bold italics__** bye`),
			`hi <b><i>bold italics</i></b> bye`
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
