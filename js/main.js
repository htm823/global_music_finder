'use strict';

import{ fetchMultipleArtists } from './api.js';
import { displayResults } from './display.js';
import { initAudioPlayer } from './audioPlayer.js';
import { initClipboard } from './clipboard.js';

// Fetch music data for all supported countries
async function fetchMusicData() {
	try {
		const countryCodes = ['gb', 'es', 'de', 'fr', 'jp', 'kr', 'tw'];

		for (const countryCode of countryCodes) {
			const allTracks = await fetchMultipleArtists(countryCode);
			displayResults(allTracks, countryCode);
		}
	} catch (error) {
		console.error('Error:', error);
	}
}

// Initialise the application
fetchMusicData();

// Enables copy-to-clipboard functionality
document.addEventListener('DOMContentLoaded', () => {
	initAudioPlayer();
	initClipboard();
});








