'use strict';

import{ fetchMultipleArtists, searchByUserQuery } from './api.js';
import { displayResults, showLoading, showError } from './display.js';
import { initAudioPlayer } from './audioPlayer.js';
import { initClipboard } from './clipboard.js';

// Load default artists
async function loadDefaultContent(countryCode) {
	showLoading(countryCode);

	try {
		const tracks = await fetchMultipleArtists(countryCode);
		displayResults(tracks, countryCode);
	} catch (error) {
		console.error('Error loading default content:', error);
		showError(countryCode);
	}
}

// Execute user search
async function executeSearch(searchTerm, countryCode) {
	showLoading(countryCode);

	try {
		const results = await searchByUserQuery(searchTerm, countryCode);
		displayResults(results, countryCode);
	} catch (error) {
		console.error('Search error:', error);
		showError(countryCode, 'Search failed. Please try again.');
	}
}

// Set up search forms
function setupSearchForm(form, countryCode) {
	const searchInput = form.querySelector('.search-form__input');

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const searchTerm = searchInput.value.trim();
		searchInput.value = searchTerm;

		if (!searchTerm) {
			await loadDefaultContent(countryCode);
		} else {
			await executeSearch(searchTerm, countryCode);
		}
	});
}

// Initialise search forms
function initSearchForms() {
	const languageContents = document.querySelectorAll('.language__content');

	languageContents.forEach(content => {
		const form = content.querySelector('.search-form');
		const resultsContainer = content.querySelector('.search-results');
		const countryCode = resultsContainer.dataset.country;

		setupSearchForm(form, countryCode);
	});
}

// Load default contents when switching tabs
function setupTabSwitching() {
	const radios = document.querySelectorAll('.language__radio');
	const loadedTabs = new Set();

	radios.forEach(radio => {
		radio.addEventListener('change', () => {
			if (radio.checked) {
				const tabName = radio.id;

				if (!loadedTabs.has(tabName)) {
					const content = document.querySelector(`.language__content[data-tab="${tabName}"]`);
					const resultsContainer = content.querySelector('.search-results');
					const countryCode = resultsContainer.dataset.country;

					loadDefaultContent(countryCode);
					loadedTabs.add(tabName);
				}
			}
		});
	});

	loadDefaultContent('gb');
	loadedTabs.add('english');
}

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
	initSearchForms();
	setupTabSwitching();
});








