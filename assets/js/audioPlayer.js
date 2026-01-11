// Toggles audio playback state
function toggleAudio(audio) {
	audio.paused ? audio.play() : audio.pause();
}

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

// Initialize audio player
export function initAudioPlayer() {
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
}
