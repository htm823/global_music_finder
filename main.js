'use strict';

// Base URL of iTunes Search API
const API_BASE_URL = 'https://itunes.apple.com/search';

async function fetchMusicData() {
	try {
		const searchTerm = 'Taylor Swift';
		const url = `${API_BASE_URL}?term=${encodeURIComponent(searchTerm)}?term=${encodeURIComponent(searchTerm)}&country=US&media=music&entity=song`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		displayResults(data.results);
	} catch (error) {
		console.error('Error:', error);
	}
}

function displayResults(tracks) {
	const resultsContainer = document.getElementById('results');
	resultsContainer.innerHTML = '';

	if (tracks.length === 0) {
		resultsContainer.innerHTML = '<p>No results.</p>';
		return;
	}

	tracks.forEach((track) => {
		resultsContainer.insertAdjacentHTML('beforeend', createTrackCard(track));
	});
}

function createTrackCard(track) {
	return `
		<div class="results__track-card">
			<img src="${track.artworkUrl100}" class="results__track-img" alt="${track.trackName} — ${track.artistName}">
			<span class="results__track-name">${track.trackName}</span>
			<span class="resutls__artist">${track.artistName}</span>
			<audio controls src="${track.previewUrl}" class="results__preview"></audio>
		</div>
	`;
}

fetchMusicData();