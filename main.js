'use strict';

// iTunes API
const API_BASE_URL = 'https://itunes.apple.com/search/';

// List of featured artists by country
const artists = [
	// English (US/UK artists, country code: gb)
	{ artist: 'Adele', countryCode: 'gb' },
	{ artist: 'Ed Sheeran', countryCode: 'gb' },
	{ artist: 'Taylor Swift', countryCode: 'gb' },
	{ artist: 'Beyoncé', countryCode: 'gb' },
	{ artist: 'Harry Styles', countryCode: 'gb' },

	// Spanish
	{ artist: 'Rosalía', countryCode: 'es' },
	{ artist: 'Bad Bunny', countryCode: 'es' },
	{ artist: 'Alejandro Sanz', countryCode: 'es' },
	{ artist: 'Pablo Alborán', countryCode: 'es' },
	{ artist: 'Shakira', countryCode: 'es' },

	// German
	{ artist: 'Rammstein', countryCode: 'de' },
	{ artist: 'Helene Fischer', countryCode: 'de' },
	{ artist: 'Nena', countryCode: 'de' },
	{ artist: 'Andreas Bourani', countryCode: 'de' },
	{ artist: 'Herbert Grönemeyer', countryCode: 'de' },

	// French
	{ artist: 'Stromae', countryCode: 'fr' },
	{ artist: 'Aya Nakamura', countryCode: 'fr' },
	{ artist: 'Zaz', countryCode: 'fr' },
	{ artist: 'Maître Gims', countryCode: 'fr' },
	{ artist: 'Angèle', countryCode: 'fr' },

	// Japanese
	{ artist: '宇多田ヒカル', countryCode: 'jp' },
	{ artist: 'YOASOBI', countryCode: 'jp' },
	{ artist: 'あいみょん', countryCode: 'jp' },
	{ artist: 'King Gnu', countryCode: 'jp' },
	{ artist: 'Official髭男dism', countryCode: 'jp' },

	// Korean
	{ artist: 'BTS', countryCode: 'kr' },
	{ artist: 'BLACKPINK', countryCode: 'kr' },
	{ artist: 'IU', countryCode: 'kr' },
	{ artist: 'Seventeen', countryCode: 'kr' },
	{ artist: 'Stray Kids', countryCode: 'kr' },

	// Chinese
	{ artist: '周杰倫', countryCode: 'cn' },
	{ artist: '鄧紫棋', countryCode: 'cn' },
	{ artist: '五月天', countryCode: 'cn' },
	{ artist: '張學友', countryCode: 'cn' },
	{ artist: '王菲', countryCode: 'cn' },
];

// Filteres artists by country code
function getArtistsByCountry(countryCode) {
	return artists.filter((artist) => artist.countryCode === countryCode);
}

// Fetch music data for all supported countries
async function fetchMusicData() {
	try {
		const countryCodes = ['gb', 'es', 'de', 'fr', 'jp', 'kr', 'cn'];

		for (const countryCode of countryCodes) {
			const allTracks = await fetchMultipleArtists(countryCode);
			displayResults(allTracks, countryCode);
		}
	} catch (error) {
		console.error('Error:', error);
	}
}

// Searches iTunes API for songs by a specific artist and country
async function searchMusicByCountry(artist, countryCode) {
	const searchTerm = artist;
	const requestUrl = `${API_BASE_URL}?term=${encodeURIComponent(searchTerm)}&country=${countryCode}&media=music&entity=song&limit=20`;
	const response = await fetch(requestUrl);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const musicDataByCountry = await response.json();

	const filteredResults = musicDataByCountry.results.filter((track) => {
		return track.artistName.toLowerCase().includes(artist.toLowerCase());
	});

	return { results: filteredResults };
}

// Fetches tracks from multiple artists for a given country
async function fetchMultipleArtists(countryCode) {
	const countryArtists = getArtistsByCountry(countryCode);

	const promises = countryArtists.map((artistInfo) => {
		return searchMusicByCountry(artistInfo.artist, artistInfo.countryCode);
	});

	const results = await Promise.all(promises);
	const allTracks = results.flatMap((result) => result.results);

	return displayShuffledOrder(allTracks);
}

// Shuffles an array of tracks
function displayShuffledOrder(tracks) {
	const shuffled = [...tracks];

	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled;
}

// Displays search results in the appropriate country tab
function displayResults(tracks, countryCode) {
	const resultsContainer = document.querySelector(`.search-results[data-country="${countryCode}"]`);
	resultsContainer.innerHTML = '';

	if (tracks.length === 0) {
		resultsContainer.innerHTML = '<p>No results.</p>';
		return;
	}

	resultsContainer.insertAdjacentHTML('beforeend', createTrackTable(tracks));
}

// Creates an HTML table structure for displaying tracks
function createTrackTable(tracks) {
	const tableHeader = `
		<table class="search-results__table">
			<thead>
				<tr>
					<th>Album</th>
					<th>Track Title</th>
					<th>Artist</th>
					<th>Preview</th>
				</tr>
			</thead>
			<tbody id="track-list">`;

	const trackRows = tracks.map((track) => {
		return createTrackRows(track);
	});

	const tableFooter = `
			</tbody>
		</table>
	`;

	return tableHeader + trackRows.join('') + tableFooter;
}

// Creates a table row for a single track
function createTrackRows(track) {
	return `
		<tr>
			<td class="search-results__album">
				<img src="${track.artworkUrl100}" alt="${track.collectionName}">
			</td>
			<td class="search-results__track-title">
				<span class="search-results__track-title-text">${track.trackName}</span>
				<button class="search-results__track-title-copy-btn" data-copy-text="${track.trackName}"><i class="fa-regular fa-clone"></i></button>
			</td>
			<td class="search-results__artist">
				<span class="search-results__artist-text">${track.artistName}</span>
				<button class="search-results__artist-copy-btn" data-copy-text="${track.artistName}"><i class="fa-regular fa-clone"></i></button>
			</td>
			<td class="search-results__preview">
				<div class="search-results__preview-inner">
					<audio src="${track.previewUrl}" class="search-results__preview-audio"></audio>
					<button class="search-results__preview-btn">
						<i class="bi bi-play-circle"></i>
						<i class="bi bi-pause-circle"></i>
					</button>
					<div class="search-results__preview-wave">
  						<span class="search-results__preview-wave-bar"></span>
  						<span class="search-results__preview-wave-bar"></span>
  						<span class="search-results__preview-wave-bar"></span>
  						<span class="search-results__preview-wave-bar"></span>
  					</div>
				</div>
			</td>
		</tr>
	`;
}

// Initialise the application
fetchMusicData();

// Enables copy-to-clipboard functionality
document.addEventListener('DOMContentLoaded', () => {
	setupCopyFeature();
});

function setupCopyFeature() {
	const searchResultsContainers = document.querySelectorAll('.search-results');

	searchResultsContainers.forEach((container) => {
		container.addEventListener('click', async (e) => {
			const copyBtn = e.target.closest('[data-copy-text]');
			if (!copyBtn) return;

			try {
				await navigator.clipboard.writeText(copyBtn.dataset.copyText);
			} catch (error) {
				console.error('Copy failed:', error);
			}
		});
	});
}

// Toggles audio playback state
function toggleAudio(audio) {
	audio.paused ? audio.play() : audio.pause();
}

// Handles preview button clicks
document.addEventListener(
	'click',
	(e) => {
		const previewBtn = e.target.closest('.search-results__preview-btn');
		if (!previewBtn) return;

		const targetPreviewInner = previewBtn.closest('.search-results__preview-inner');
		const targetAudio = targetPreviewInner.querySelector('.search-results__preview-audio');

		const audioAll = document.querySelectorAll('.search-results__preview-audio');
		audioAll.forEach((otherAudio) => {
			if (otherAudio !== targetAudio && !otherAudio.paused) {
				otherAudio.pause();
				otherAudio.currentTime = 0;
			}
		});

		toggleAudio(targetAudio);
	},
	true
);

// Syncs UI state with audio events
const previewStates = ['play', 'pause', 'ended'];
previewStates.forEach((state) => {
	document.addEventListener(state, handleAudioStateChange, true);
});

// Updates preview UI based on audio state
function handleAudioStateChange(e) {
	if (!e.target.classList.contains('search-results__preview-audio')) return;

	const previewInner = e.target.closest('.search-results__preview-inner');
	const previewBtn = previewInner.querySelector('.search-results__preview-btn');
	const wave = previewInner.querySelector('.search-results__preview-wave');

	switch (e.type) {
		case 'play':
			previewBtn.classList.add('playing');
			wave.classList.add('is-playing');
			break;

		case 'pause':
		case 'ended':
			previewBtn.classList.remove('playing');
			wave.classList.remove('is-playing');
			e.target.currentTime = 0;
			break;
	}
}
