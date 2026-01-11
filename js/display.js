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

// Creates an HTML table structure for displaying tracks
export function createTrackTable(tracks) {
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

// Displays search results in the appropriate country tab
export function displayResults(tracks, countryCode) {
	const resultsContainer = document.querySelector(`.search-results[data-country="${countryCode}"]`);
	resultsContainer.innerHTML = '';

	if (tracks.length === 0) {
		resultsContainer.innerHTML = '<p>No results.</p>';
		return;
	}

	resultsContainer.insertAdjacentHTML('beforeend', createTrackTable(tracks));
}