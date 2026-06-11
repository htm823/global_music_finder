/**
 * Track row template
 */
const renderTrackRow = (track) => `
	<tr class="track">
    <td class="track__album">
      <img src="${track.artworkUrl100}" alt="${track.collectionName}">
    </td>
    <td class="track__name">
      <span class="track__name-txt">${track.trackName}</span>
      <button class="track__copy" data-copy-text="${track.trackName}">
        <i class="fa-regular fa-clone"></i>
        <i class="fa-solid fa-check"></i>
      </button>
    </td>
    <td class="track__artist">
      <span class="track__artist-txt">${track.artistName}</span>
      <button class="track__copy" data-copy-text="${track.artistName}">
        <i class="fa-regular fa-clone"></i>
        <i class="fa-solid fa-check"></i>
      </button>
    </td>
    <td class="track__preview">
      <div class="track__kit">
        <button class="track__play" data-preview-url="${track.previewUrl}">
          <i class="bi bi-play-circle"></i>
          <i class="bi bi-pause-circle"></i>
        </button>
        <div class="track__waves">
            ${'<span class="track__bar"></span>'.repeat(4)}
          </div>
      </div>
    </td>
  </tr>
`;

/**
 * Create a track table
 */
const createTrackTable = (tracks) => `
	<table class="tracks">
    <thead class="tracks__header">
      <tr class="tracks__labels">
        <th class="tracks__label square">album</th>
        <th class="tracks__label">track title</th>
        <th class="tracks__label">artist</th>
        <th class="tracks__label square">preview</th>
      </tr>
    </thead>
    <tbody class="tracks__content">${tracks.map(renderTrackRow).join('')}</tbody>
  </table>
`;

/**
 * Helper Function: get a container
 *
 */
const getContainer = (countryCode) => document.querySelector(`.search__results[data-country="${countryCode}"]`);

/**
 * Display results
 *
 * @param {Array} tracks
 * @param {string} countryCode
 * @return {void}
 */
export function displayResults(tracks, countryCode) {
	const container = getContainer(countryCode);
	if (!container) return;

	if (tracks.length === 0) {
		container.innerHTML = '<p class="search__nothing">No results.</p>';
		return;
	}
	container.innerHTML = createTrackTable(tracks);
}

/**
 * Show loading text
 *
 * @param {string} countryCode
 * @return {void}
 */
export function showLoading(countryCode) {
	const container = getContainer(countryCode);
	if (container) container.innerHTML = '<p class="search__loading">Searching...</p>';
}

/**
 * Show error text
 *
 * @param {string} countryCode
 * @param {string} message
 * @return {void}
 */
export function showError(countryCode, message = 'Failed to load music. Please try again.') {
	const container = getContainer(countryCode);
	if (container) container.innerHTML = `<p class="search__error">${message}</p>`;
}
