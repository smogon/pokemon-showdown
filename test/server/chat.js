'use strict';

const assert = require('assert');

const {User, Connection} = require('../users-utils');

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
			Chat.formatText(`hi __spoiler: bye__ hi again (parenthetical spoiler: bye again (or not!!!!)) that was fun`),
			`hi <i>spoiler: <span class="spoiler">bye</span></i> hi again (parenthetical spoiler: <span class="spoiler">bye again (or not!!!!)</span>) that was fun`
		);
		assert.strictEqual(
			Chat.formatText(`hi google.com/__a__ bye >w<`),
			`hi <a href="http://google.com/__a__" rel="noopener" target="_blank">google.com/__a__</a> bye &gt;w&lt;`
		);
		assert.strictEqual(
			Chat.formatText(`(https://en.wikipedia.org/wiki/Pokémon_(video_game_series))`),
			`(<a href="https://en.wikipedia.org/wiki/Pokémon_(video_game_series)" rel="noopener" target="_blank">https://en.wikipedia.org/wiki/Pokémon_(video_game_series)</a>)`
		);
		assert.strictEqual(
			Chat.formatText(`hi email@email.com bye >w<`),
			`hi <a href="mailto:email@email.com" rel="noopener" target="_blank">email@email.com</a> bye &gt;w&lt;`
		);
		assert.strictEqual(
			Chat.formatText(`hi email@email.example bye >w<`),
			`hi <a href="mailto:email@email.example" rel="noopener" target="_blank">email@email.example</a> bye &gt;w&lt;`
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
			Chat.formatText(`[[Google <http://www.google.com/>]] >w<`),
			`<a href="http://www.google.com/" rel="noopener" target="_blank">Google<small> &lt;google.com&gt;</small></a> &gt;w&lt;`
		);
		assert.strictEqual(
			Chat.formatText(`[[Google <google.com>]] >w<`, true),
			`<a href="http://google.com" target="_blank">Google</a> &gt;w&lt;`
		);
		assert.strictEqual(
			Chat.formatText(`[[wiki: Pokemon]] >w<`, true),
			`<a href="//en.wikipedia.org/w/index.php?title=Special:Search&search=Pokemon" target="_blank">wiki: Pokemon</a> &gt;w&lt;`
		);
		assert.strictEqual(
			Chat.formatText(`[[wiki: D&D D&amp;D]] [[A>B A&gt;B]] &amp;`, true),
			`<a href="//en.wikipedia.org/w/index.php?title=Special:Search&search=D%26D%20D%26amp%3BD" target="_blank">wiki: D&amp;D D&amp;amp;D</a> <a href="//www.google.com/search?ie=UTF-8&btnI&q=A%3EB%20A%26gt%3BB" target="_blank">A&gt;B A&amp;gt;B</a> &amp;amp;`
		);
		assert.strictEqual(
			Chat.formatText(`[[pokemon: Oshawott]] >w<`, true),
			`<a href="//dex.pokemonshowdown.com/pokemon/oshawott" target="_blank"><psicon pokemon="Oshawott"/></a> &gt;w&lt;`
		);
		assert.strictEqual(
			Chat.formatText(`[[item: Beast ball]] >w<`),
			`<a href="//dex.pokemonshowdown.com/items/beastball" target="_blank">[Beast ball]</a> &gt;w&lt;`
		);
		assert.strictEqual(
			Chat.formatText(`:)`, true),
			`:)`
		);
	});

	let called = false;
	const name = 'bad memes';
	const entry = {
		location: 'EVERYWHERE',
		punishment: 'AUTOLOCK',
		label: 'Bad Memes',
		monitor(line, room, user, message, lcMessage, isStaff) {
			const [regex] = line;
			if (!regex.test(lcMessage)) return;
			if (called) return `${message.replace(/r/g, 'w')} OwO`;
			called = true;
			return false;
		},
	};

	it('should register chat monitors properly', function () {
		Chat.registerMonitor(name, entry);
		assert.deepStrictEqual(Chat.filterWords[name], [], 'registering a chat monitor adds a filter words list');
		assert.strictEqual(Chat.monitors[name], entry, 'registering a chat monitor sets a chat monitor');
		// Clean up after the next set of tests.
	});

	it('should filter messages properly', function () {
		const filter = (message, user, room, connection, targetUser = null) => {
			const context = new Chat.CommandContext({message, room, user, connection});
			return Chat.filter(context, message, user, room, connection, targetUser);
		};

		if (!Rooms.rooms.has('lobby')) Rooms.global.addChatRoom('Lobby');
		const room = Rooms.get('lobby');
		const connection = new Connection('127.0.0.1');
		const user = new User(connection);
		user.forceRename('Morfent', true);
		user.setGroup('@');
		user.connected = true;
		Users.users.set(user.id, user);
		user.joinRoom('global', connection);
		user.joinRoom('lobby', connection);

		const filters = Chat.filters.splice(0);
		Chat.filters.push(function (message, user, room) {
			for (const line of Chat.filterWords[name]) {
				const result = entry.monitor.call(this, line, room, user, message, message, user.isStaff);
				if (result !== undefined) return result;
			}
		});

		Chat.filterWords[name].push([/rof/, 'rof', 'stale, dare i say, moldy', '', 0]);
		assert.strictEqual(
			filter('just lost the ru tour rof', user, room, connection),
			null,
			'filtering returns null when filters return null'
		);
		assert.strictEqual(
			filter('just lost the ru tour rof', user, room, connection),
			'just lost the wu touw wof OwO',
			'filtering returns an altered message when filters return strings'
		);
		assert.strictEqual(
			filter('hey dyde', user, room, connection),
			'hey dyde',
			'filtering returns the original message when filters return undefined'
		);
		Chat.filterWords[name].pop();

		Chat.filters = filters;
		delete Chat.filterWords[name];
		delete Chat.monitors[name];
	});
});
