'use strict';

import { fetchMultipleArtists, searchMusic } from './api.js';
import { displayResults, showLoading, showError } from './display.js';
import { initAudioPlayer } from './audioPlayer.js';
import { initClipboard } from './clipboard.js';
import { initThemeSwitcher } from './themeSwitcher.js';
import { initTabSwitcher } from './tab.js';

/**
 * Initialize
 */
const init = () => {
	initThemeSwitcher();

	initTabSwitcher();

	initAudioPlayer();

	initClipboard();

	initSearchForms();

	setupTabSwitching();

	fetchInitialMusicData();
};

/**
 * Load default tracks
 *
 * @param {string} countryCode
 */
async function loadDefaultContent(countryCode) {
	showLoading(countryCode);
	try {
		const tracks = await fetchMultipleArtists(countryCode);
		displayResults(tracks, countryCode);
	} catch (error) {
		console.error(`Error loading default content for ${countryCode}`, error);
		showError(countryCode);
	}
}

/**
 * Execute search
 *
 * @param {string} searchTerm
 * @param {string} countryCode
 * @return {void}
 */
async function executeSearch(searchTerm, countryCode) {
	showLoading(countryCode);
	try {
		const results = await searchMusic(searchTerm, countryCode);
		displayResults(results, countryCode);
	} catch (error) {
		console.error('Search error: ', error);
		showError(countryCode, 'Search failed. Please try again.');
	}
}

/**
 * Setup search forms
 */
function setupSearchForm(form, countryCode) {
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const input = form.querySelector('.search__input');
		const term = input.value.trim();
		input.value = term;

		term ? await executeSearch(term, countryCode) : await loadDefaultContent(countryCode);
	});
}

/**
 * Initialize search forms
 */
function initSearchForms() {
	document.querySelectorAll('.search__content').forEach((content) => {
		const form = content.querySelector('.search__form');
		const countryCode = content.querySelector('.search__results')?.dataset.country;
		if (form && countryCode) setupSearchForm(form, countryCode);
	});
}

/**
 * Setup tab switching
 */
function setupTabSwitching() {
	const loadedTabs = new Set(['english']);

	document.querySelectorAll('.sidebar__radio').forEach((radio) => {
		radio.addEventListener('change', (e) => {
			if (!e.target.checked || loadedTabs.has(e.target.id)) return;

			const content = document.querySelector(`.search__content[data-tab="${e.target.id}"]`);
			const countryCode = content?.querySelector('.search__results')?.dataset.country;

			if (countryCode) {
				loadDefaultContent(countryCode);
				loadedTabs.add(e.target.id);
			}
		});

		loadDefaultContent('gb');
	});
}

/**
 * Fetch initial music data
 */
async function fetchInitialMusicData() {
	const countryCodes = ['gb', 'es', 'de', 'fr', 'jp', 'kr', 'tw', 'hi'];
	await Promise.all(countryCodes.map((code) => loadDefaultContent(code)));
}

init();
