/**
 * Tests for the Youtube room plugin.
 * Written by Mia.
 * @author mia-pi-git
 */
'use strict';
const YoutubeInterface = require('../../../server/chat-plugins/youtube').YoutubeInterface;
const assert = require('../../assert');

describe(`Youtube features`, function () {
	it.skip(`should correctly add channels to the database`, async function () {
		if (!Config.youtubeKey) return true;
		const Youtube = new YoutubeInterface({});
		const url = 'https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw';
		await Youtube.getChannelData(url, undefined);
		assert(Youtube.data['UCuAXFkgsw1L7xaCfnd5JJOw']);
	});

	it.skip(`should correctly handle PS names and channel names`, async function () {
		if (!Config.youtubeKey) return true;
		const Youtube = new YoutubeInterface({});
		const url = 'https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw';
		const channelId = 'UCuAXFkgsw1L7xaCfnd5JJOw';
		await Youtube.getChannelData(url, 'Pickle Rick');
		assert.equal(channelId, Youtube.channelSearch('Pickle Rick'));
		assert.equal(channelId, Youtube.channelSearch('Official Rick Astley'));
	});

	it.skip(`should correctly parse channel links`, function () {
		if (!Config.youtubeKey) return true;
		const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
		const channelUrl = 'https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw';
		const Youtube = new YoutubeInterface({});
		const videoId = Youtube.getId(videoUrl);
		assert.equal(videoId, 'dQw4w9WgXcQ');
		const channelId = Youtube.getId(channelUrl);
		assert.equal(channelId, 'UCuAXFkgsw1L7xaCfnd5JJOw');
	});
});
