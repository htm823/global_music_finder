import { API_BASE_URL, artists } from './config.js';

// Filteres artists by country code
function getArtistsByCountry(countryCode) {
	return artists.filter((artist) => artist.countryCode === countryCode);
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

	console.log(musicDataByCountry);

	const filteredResults = musicDataByCountry.results.filter((track) => {
		return track.artistName.toLowerCase().includes(artist.toLowerCase());
	});

	return { results: filteredResults };
}

// Searches iTunes API for songs by a search term
export async function searchByUserQuery(searchTerm, countryCode) {
	const requestUrl = `${API_BASE_URL}?term=${encodeURIComponent(searchTerm)}&country=${countryCode}&media=music&entity=song&limit=50`;
	const response = await fetch(requestUrl);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const musicData = await response.json();
	return musicData.results;
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

// Fetches tracks from multiple artists for a given country
export async function fetchMultipleArtists(countryCode) {
	const countryArtists = getArtistsByCountry(countryCode);

	const promises = countryArtists.map((artistInfo) => {
		return searchMusicByCountry(artistInfo.artist, artistInfo.countryCode);
	});

	const results = await Promise.all(promises);
	const allTracks = results.flatMap((result) => result.results);

	return displayShuffledOrder(allTracks);
}
