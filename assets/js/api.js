import { API_BASE_URL, artists } from './config.js';

/**
 * API fetch
 */
async function fetchFromApi(params) {
	const query = new URLSearchParams({
		media: 'music',
		entity: 'song',
		...params,
	});

	const response = await fetch(`${API_BASE_URL}?${query.toString()}`);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}


/**
 * Search music
 *
 * @param {string} term
 * @param {string} countryCode
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function searchMusic(term, countryCode, limit = 20) {
	const data = await fetchFromApi({ term, country: countryCode, limit });
	return data.results || [];
}


/**
 * Search music by an artist
 *
 * @param {string} artistName
 * @param {string} countryCode
 * @returns {Promise<Array>}
 */
export async function searchMusicByArtist(artistName, countryCode) {
	const results = await searchMusic(artistName, countryCode, 20);

	const lowerArtist = artistName.toLowerCase();
	return results.filter((track) => track.artistName.toLowerCase().includes(lowerArtist));
}


/**
 * Fetch artists and shuffle
 *
 * @param {string} countryCode
 * @returns {Promise<Array>}
 */
export async function fetchMultipleArtists(countryCode) {
	const countryArtists = artists.filter((a) => a.countryCode === countryCode);

	const results = await Promise.all(countryArtists.map((a) => searchMusicByArtist(a.artist, a.countryCode)));

	return shuffleArray(results.flat());
}

/**
 * Shuffle array
 *
 * @param {Array} array
 * @return {Array}
 */
function shuffleArray(array) {
	const shuffled = [...array];

	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled;
}
